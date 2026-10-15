// ─── Accounts, abonnementen en voortgang (SQLite) ────────────────────
// Vervangt de oude pincode: zonder geldige sessie krijg je de inlog-/aanmeldpagina.
// Database: data/leren.db (gaat mee in de nachtelijke back-up).
import type express from 'express';
import Database from 'better-sqlite3';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { mailIngesteld } from './mail.js';
import { stuurVasteMail } from './mails.js';

export type Abonnement = 'gratis' | 'maand' | 'jaar';
const ABONNEMENTEN: Abonnement[] = ['gratis', 'maand', 'jaar'];

interface LidRij {
  id: number; email: string; naam: string; wachtwoord_hash: string;
  rol: 'lid' | 'admin'; abonnement: Abonnement; abonnement_tot: string | null;
  actief: number; aangemaakt: string; laatst_ingelogd: string | null;
}

export interface Lid {
  id: number; email: string; naam: string; rol: 'lid' | 'admin';
  abonnement: Abonnement;            // zoals ingesteld
  abonnement_tot: string | null;
  abonnement_actief: Abonnement;     // na verloopdatum terug naar 'gratis'
  aangemaakt: string; laatst_ingelogd: string | null; actief: boolean;
}

declare module 'express-serve-static-core' {
  interface Request { lid?: Lid }
}

const SESSIE_COOKIE = 'tl_sessie';
const SESSIE_DAGEN = 30;

function vandaag(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' });
}

export function hashWachtwoord(wachtwoord: string): string {
  const zout = randomBytes(16);
  return `scrypt$${zout.toString('base64')}$${scryptSync(wachtwoord, zout, 64).toString('base64')}`;
}

function controleerWachtwoord(wachtwoord: string, opgeslagen: string): boolean {
  const [soort, zout, hash] = opgeslagen.split('$');
  if (soort !== 'scrypt' || !zout || !hash) return false;
  const verwacht = Buffer.from(hash, 'base64');
  const echt = scryptSync(wachtwoord, Buffer.from(zout, 'base64'), verwacht.length);
  return timingSafeEqual(verwacht, echt);
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

function naarLid(r: LidRij): Lid {
  const verlopen = r.abonnement !== 'gratis' && !!r.abonnement_tot && r.abonnement_tot < vandaag();
  return {
    id: r.id, email: r.email, naam: r.naam, rol: r.rol,
    abonnement: r.abonnement, abonnement_tot: r.abonnement_tot,
    abonnement_actief: verlopen ? 'gratis' : r.abonnement,
    aangemaakt: r.aangemaakt, laatst_ingelogd: r.laatst_ingelogd, actief: r.actief === 1,
  };
}

function leesCookie(req: express.Request, naam: string): string | null {
  for (const deel of (req.headers.cookie || '').split(';')) {
    const [k, ...v] = deel.trim().split('=');
    if (k === naam) return decodeURIComponent(v.join('='));
  }
  return null;
}

// Eenvoudige rem op inlog-/aanmeldpogingen: 10 per kwartier per IP
const pogingen = new Map<string, { aantal: number; tot: number }>();
function teVeelPogingen(ip: string): boolean {
  const nu = Date.now();
  const p = pogingen.get(ip);
  if (!p || p.tot < nu) { pogingen.set(ip, { aantal: 1, tot: nu + 15 * 60 * 1000 }); return false; }
  p.aantal++;
  return p.aantal > 10;
}

function plusPeriode(type: Abonnement): string | null {
  if (type === 'gratis') return null;
  const d = new Date(`${vandaag()}T12:00:00`);
  if (type === 'maand') d.setMonth(d.getMonth() + 1); else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function installeerAccounts(app: express.Express, root: string) {
  mkdirSync(join(root, 'data'), { recursive: true });
  const db = new Database(join(root, 'data', 'leren.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS leden (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      naam TEXT NOT NULL,
      wachtwoord_hash TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'lid' CHECK (rol IN ('lid','admin')),
      abonnement TEXT NOT NULL DEFAULT 'gratis' CHECK (abonnement IN ('gratis','maand','jaar')),
      abonnement_tot TEXT,
      actief INTEGER NOT NULL DEFAULT 1,
      aangemaakt TEXT NOT NULL DEFAULT (datetime('now')),
      laatst_ingelogd TEXT
    );
    CREATE TABLE IF NOT EXISTS sessies (
      token_hash TEXT PRIMARY KEY,
      lid_id INTEGER NOT NULL REFERENCES leden(id) ON DELETE CASCADE,
      verloopt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS voortgang (
      lid_id INTEGER NOT NULL REFERENCES leden(id) ON DELETE CASCADE,
      onderdeel TEXT NOT NULL,
      item TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT '{}',
      bijgewerkt TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (lid_id, onderdeel, item)
    );
    CREATE TABLE IF NOT EXISTS quiz_stats (
      lid_id INTEGER NOT NULL REFERENCES leden(id) ON DELETE CASCADE,
      onderdeel TEXT NOT NULL,
      sleutel TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT '',
      goed INTEGER NOT NULL DEFAULT 0,
      fout INTEGER NOT NULL DEFAULT 0,
      laatst TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (lid_id, onderdeel, sleutel)
    );
  `);
  db.prepare(`DELETE FROM sessies WHERE verloopt < datetime('now')`).run();
  db.exec(`CREATE TABLE IF NOT EXISTS wachtwoord_herstel (
    token_hash TEXT PRIMARY KEY,
    lid_id INTEGER NOT NULL REFERENCES leden(id) ON DELETE CASCADE,
    verloopt TEXT NOT NULL,
    gebruikt INTEGER NOT NULL DEFAULT 0
  )`);
  db.prepare(`DELETE FROM wachtwoord_herstel WHERE verloopt < datetime('now', '-1 day')`).run();

  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const zoekOpEmail = db.prepare<[string], LidRij>('SELECT * FROM leden WHERE email = ?');
  const zoekOpId = db.prepare<[number], LidRij>('SELECT * FROM leden WHERE id = ?');

  function startSessie(res: express.Response, lidId: number) {
    const token = randomBytes(32).toString('base64url');
    db.prepare(`INSERT INTO sessies (token_hash, lid_id, verloopt) VALUES (?, ?, datetime('now', ?))`)
      .run(sha256(token), lidId, `+${SESSIE_DAGEN} days`);
    db.prepare(`UPDATE leden SET laatst_ingelogd = datetime('now') WHERE id = ?`).run(lidId);
    res.setHeader('Set-Cookie',
      `${SESSIE_COOKIE}=${token}; HttpOnly; Secure; Path=/; Max-Age=${SESSIE_DAGEN * 86400}; SameSite=Lax`);
  }

  function lidUitSessie(req: express.Request): Lid | null {
    const token = leesCookie(req, SESSIE_COOKIE);
    if (!token) return null;
    const r = db.prepare<[string], LidRij>(`
      SELECT l.* FROM sessies s JOIN leden l ON l.id = s.lid_id
      WHERE s.token_hash = ? AND s.verloopt > datetime('now') AND l.actief = 1`).get(sha256(token));
    return r ? naarLid(r) : null;
  }

  // ── De Zen Flow-voorpagina (zen-flow.nl) mag accounts aanmaken en inloggen (CORS, met cookies) ──
  // zen-flow.nl en leren.zen-flow.nl zijn dezelfde site, dus de SameSite=Lax-sessiecookie wordt gewoon gezet.
  const VOORPAGINA_ORIGINS = ['https://zen-flow.nl', 'https://www.zen-flow.nl'];
  app.use('/api/auth', (req, res, next) => {
    const origin = String(req.headers.origin || '');
    if (VOORPAGINA_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Max-Age', '600');
        res.status(204).end(); return;
      }
    }
    next();
  });

  // ── Aanmelden / inloggen (vóór de toegangscontrole) ──
  app.post('/api/auth/registreer', (req, res) => {
    if (teVeelPogingen(req.ip || '')) { res.status(429).json({ error: 'Te veel pogingen, probeer het over een kwartier opnieuw' }); return; }
    const naam = String(req.body?.naam || '').trim().slice(0, 80);
    const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 200);
    const wachtwoord = String(req.body?.wachtwoord || '');
    if (!naam) { res.status(400).json({ error: 'Vul je naam in' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ error: 'Vul een geldig e-mailadres in' }); return; }
    if (wachtwoord.length < 8) { res.status(400).json({ error: 'Kies een wachtwoord van minimaal 8 tekens' }); return; }
    if (zoekOpEmail.get(email)) { res.status(409).json({ error: 'Er bestaat al een account met dit e-mailadres' }); return; }
    const rol = ADMIN_EMAIL && email === ADMIN_EMAIL ? 'admin' : 'lid';
    const info = db.prepare(`INSERT INTO leden (email, naam, wachtwoord_hash, rol) VALUES (?, ?, ?, ?)`)
      .run(email, naam, hashWachtwoord(wachtwoord), rol);
    startSessie(res, Number(info.lastInsertRowid));
    // Welkomstmail (alleen als die aan staat op /admin/mails en mail is ingesteld); wacht er niet op
    stuurVasteMail(root, 'welkom', email, { naam }).catch((e) => console.error('Welkomstmail mislukt:', (e as Error).message));
    res.json({ ok: true });
  });

  app.post('/api/auth/login', (req, res) => {
    if (teVeelPogingen(req.ip || '')) { res.status(429).json({ error: 'Te veel pogingen, probeer het over een kwartier opnieuw' }); return; }
    const email = String(req.body?.email || '').trim().toLowerCase();
    const r = zoekOpEmail.get(email);
    if (!r || !controleerWachtwoord(String(req.body?.wachtwoord || ''), r.wachtwoord_hash)) {
      res.status(401).json({ error: 'Onjuist e-mailadres of wachtwoord' }); return;
    }
    if (!r.actief) { res.status(403).json({ error: 'Dit account is geblokkeerd' }); return; }
    if (ADMIN_EMAIL && email === ADMIN_EMAIL && r.rol !== 'admin') db.prepare(`UPDATE leden SET rol = 'admin' WHERE id = ?`).run(r.id);
    startSessie(res, r.id);
    res.json({ ok: true });
  });

  app.post('/api/auth/uitloggen', (req, res) => {
    const token = leesCookie(req, SESSIE_COOKIE);
    if (token) db.prepare('DELETE FROM sessies WHERE token_hash = ?').run(sha256(token));
    res.setHeader('Set-Cookie', `${SESSIE_COOKIE}=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax`);
    res.json({ ok: true });
  });

  // ── Wachtwoord vergeten (vóór de toegangscontrole). Werkt alleen als mail is ingesteld (mail.ts). ──
  // Antwoordt altijd hetzelfde, zodat niemand kan uitzoeken welke e-mailadressen een account hebben.
  const LEREN_URL = (process.env.LEREN_URL || 'https://leren.zen-flow.nl').replace(/\/$/, '');
  const herstelPerEmail = new Map<string, { aantal: number; tot: number }>();
  app.get('/api/auth/herstel-beschikbaar', (_req, res) => { res.json({ beschikbaar: mailIngesteld() }); });

  app.post('/api/auth/wachtwoord-vergeten', async (req, res) => {
    if (!mailIngesteld()) { res.status(503).json({ error: 'Wachtwoord herstellen is nog niet beschikbaar' }); return; }
    if (teVeelPogingen(req.ip || '')) { res.status(429).json({ error: 'Te veel pogingen, probeer het over een kwartier opnieuw' }); return; }
    const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 200);
    const antwoord = { ok: true, bericht: 'Als er een account is met dit e-mailadres, krijg je binnen een paar minuten een mail met een link. Kijk ook bij je spam.' };
    const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? zoekOpEmail.get(email) : undefined;
    const nu = Date.now(), p = herstelPerEmail.get(email);
    if (p && p.tot > nu && p.aantal >= 3) { res.json(antwoord); return; }          // max. 3 mails per uur per adres
    herstelPerEmail.set(email, p && p.tot > nu ? { aantal: p.aantal + 1, tot: p.tot } : { aantal: 1, tot: nu + 3600_000 });
    if (!r || !r.actief) { res.json(antwoord); return; }
    const token = randomBytes(32).toString('base64url');
    db.prepare('DELETE FROM wachtwoord_herstel WHERE lid_id = ?').run(r.id);       // alleen de nieuwste link werkt
    db.prepare(`INSERT INTO wachtwoord_herstel (token_hash, lid_id, verloopt) VALUES (?, ?, datetime('now', '+60 minutes'))`).run(sha256(token), r.id);
    const url = `${LEREN_URL}/herstel?token=${token}`;
    try { await stuurVasteMail(root, 'wachtwoord_herstel', r.email, { naam: r.naam, link: url }); }   // tekst aanpasbaar op /admin/mails
    catch (e) { console.error('Herstelmail mislukt:', (e as Error).message); }
    res.json(antwoord);
  });

  app.post('/api/auth/wachtwoord-herstellen', (req, res) => {
    if (teVeelPogingen(req.ip || '')) { res.status(429).json({ error: 'Te veel pogingen, probeer het over een kwartier opnieuw' }); return; }
    const token = String(req.body?.token || ''), nieuw = String(req.body?.wachtwoord || '');
    if (nieuw.length < 8) { res.status(400).json({ error: 'Kies een wachtwoord van minimaal 8 tekens' }); return; }
    const h = db.prepare<[string], { lid_id: number }>(`SELECT lid_id FROM wachtwoord_herstel
      WHERE token_hash = ? AND gebruikt = 0 AND verloopt > datetime('now')`).get(sha256(token));
    const r = h ? zoekOpId.get(h.lid_id) : undefined;
    if (!h || !r || !r.actief) { res.status(400).json({ error: 'Deze link is verlopen of al gebruikt. Vraag een nieuwe link aan.' }); return; }
    db.transaction(() => {
      db.prepare('UPDATE leden SET wachtwoord_hash = ? WHERE id = ?').run(hashWachtwoord(nieuw), r.id);
      db.prepare('DELETE FROM wachtwoord_herstel WHERE lid_id = ?').run(r.id);
      db.prepare('DELETE FROM sessies WHERE lid_id = ?').run(r.id);                 // overal uitloggen
    })();
    startSessie(res, r.id);
    res.json({ ok: true });
  });

  app.get('/herstel', (_req, res) => { res.type('html').send(HERSTEL_PAGINA); });

  // ── Toegangscontrole: alles hierna alleen met een account ──
  app.use((req, res, next) => {
    const lid = lidUitSessie(req);
    if (lid) { req.lid = lid; return next(); }
    if (req.path === '/favicon.svg') return next();   // icoon ook op het inlogscherm
    if (req.path.startsWith('/api/')) { res.status(401).json({ error: 'Log eerst in' }); return; }
    res.status(401).type('html').send(TOEGANG_PAGINA);
  });

  app.get('/api/auth/ik', (req, res) => { res.json(req.lid); });

  app.post('/api/auth/wachtwoord', (req, res) => {
    const r = zoekOpId.get(req.lid!.id)!;
    if (!controleerWachtwoord(String(req.body?.oud || ''), r.wachtwoord_hash)) { res.status(400).json({ error: 'Huidig wachtwoord klopt niet' }); return; }
    const nieuw = String(req.body?.nieuw || '');
    if (nieuw.length < 8) { res.status(400).json({ error: 'Kies een wachtwoord van minimaal 8 tekens' }); return; }
    db.prepare('UPDATE leden SET wachtwoord_hash = ? WHERE id = ?').run(hashWachtwoord(nieuw), r.id);
    res.json({ ok: true });
  });

  // ── Beheer van leden (alleen admin) ──
  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };

  app.get('/api/admin/leden', alleenAdmin, (_req, res) => {
    const rijen = db.prepare<[], LidRij>('SELECT * FROM leden ORDER BY aangemaakt DESC').all();
    const tellingen = new Map(
      db.prepare<[], { lid_id: number; n: number }>('SELECT lid_id, COUNT(*) n FROM voortgang GROUP BY lid_id').all()
        .map((t) => [t.lid_id, t.n]),
    );
    res.json(rijen.map((r) => ({ ...naarLid(r), voortgang_items: tellingen.get(r.id) || 0 })));
  });

  app.patch('/api/admin/leden/:id', alleenAdmin, (req, res) => {
    const r = zoekOpId.get(Number(req.params.id));
    if (!r) { res.status(404).json({ error: 'Lid niet gevonden' }); return; }
    const b = req.body || {};
    let abonnement = r.abonnement;
    let tot = r.abonnement_tot;
    if (b.abonnement !== undefined) {
      if (!ABONNEMENTEN.includes(b.abonnement)) { res.status(400).json({ error: 'Abonnement moet gratis, maand of jaar zijn' }); return; }
      if (b.abonnement !== abonnement) tot = plusPeriode(b.abonnement); // nieuwe periode vanaf vandaag
      abonnement = b.abonnement;
    }
    if (b.abonnement_tot !== undefined) {
      if (b.abonnement_tot !== null && !/^\d{4}-\d{2}-\d{2}$/.test(b.abonnement_tot)) { res.status(400).json({ error: 'Datum als JJJJ-MM-DD' }); return; }
      tot = b.abonnement_tot;
    }
    if (abonnement === 'gratis') tot = null;
    const rol = b.rol === 'admin' || b.rol === 'lid' ? b.rol : r.rol;
    const actief = typeof b.actief === 'boolean' ? (b.actief ? 1 : 0) : r.actief;
    if (r.id === req.lid!.id && (rol !== 'admin' || !actief)) { res.status(400).json({ error: 'Je kunt jezelf geen beheerrechten afnemen of blokkeren' }); return; }
    db.prepare('UPDATE leden SET abonnement = ?, abonnement_tot = ?, rol = ?, actief = ? WHERE id = ?')
      .run(abonnement, tot, rol, actief, r.id);
    if (!actief) db.prepare('DELETE FROM sessies WHERE lid_id = ?').run(r.id);
    if (typeof b.nieuw_wachtwoord === 'string') {
      if (b.nieuw_wachtwoord.length < 8) { res.status(400).json({ error: 'Wachtwoord minimaal 8 tekens' }); return; }
      db.prepare('UPDATE leden SET wachtwoord_hash = ? WHERE id = ?').run(hashWachtwoord(b.nieuw_wachtwoord), r.id);
      db.prepare('DELETE FROM sessies WHERE lid_id = ?').run(r.id);
    }
    res.json(naarLid(zoekOpId.get(r.id)!));
  });

  // ── Voortgang (per lid; onderdeel = bv. 'cursus', item = bv. 'module-01') ──
  app.get('/api/voortgang', (req, res) => {
    const rijen = db.prepare<[number], { onderdeel: string; item: string; data: string; bijgewerkt: string }>(
      'SELECT onderdeel, item, data, bijgewerkt FROM voortgang WHERE lid_id = ? ORDER BY bijgewerkt DESC').all(req.lid!.id);
    res.json(rijen.map((r) => ({ ...r, data: JSON.parse(r.data) })));
  });

  // ── Quizresultaten: per vraag/kaart goed-fout tellen + rondes per quiz ──
  // antwoorden: [{ sleutel: 'kaart:14', label: 'De Vos', goed: true }, ...]
  // ronde=false (bv. de doorlopende tarotquiz) telt alleen de antwoorden, geen ronde/beste score.
  const telAntwoord = db.prepare(`
    INSERT INTO quiz_stats (lid_id, onderdeel, sleutel, label, goed, fout, laatst) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT (lid_id, onderdeel, sleutel) DO UPDATE SET
      goed = goed + excluded.goed, fout = fout + excluded.fout, label = excluded.label, laatst = excluded.laatst`);
  const leesResultaat = db.prepare<[number, string], { data: string }>(
    `SELECT data FROM voortgang WHERE lid_id = ? AND onderdeel = ? AND item = 'resultaat'`);
  const schrijfResultaat = db.prepare(`INSERT INTO voortgang (lid_id, onderdeel, item, data, bijgewerkt) VALUES (?, ?, 'resultaat', ?, datetime('now'))
    ON CONFLICT (lid_id, onderdeel, item) DO UPDATE SET data = excluded.data, bijgewerkt = excluded.bijgewerkt`);

  app.post('/api/quiz/ronde', (req, res) => {
    const onderdeel = String(req.body?.onderdeel || '').slice(0, 50);
    const antwoorden = Array.isArray(req.body?.antwoorden) ? req.body.antwoorden.slice(0, 200) : [];
    const score = Math.max(0, Number(req.body?.score) || 0);
    const totaal = Math.max(0, Number(req.body?.totaal) || 0);
    const ronde = req.body?.ronde !== false;
    if (!/^[a-z0-9-]+$/.test(onderdeel) || score > totaal) { res.status(400).json({ error: 'Ongeldige quizronde' }); return; }
    const lid = req.lid!.id;
    const resultaat = db.transaction(() => {
      // Zelfde sleutel kan meerdere keren in één ronde voorkomen (bv. kaart in twee vragen)
      for (const a of antwoorden as { sleutel?: unknown; label?: unknown; goed?: unknown }[]) {
        const sleutel = String(a.sleutel || '').slice(0, 120);
        if (!sleutel) continue;
        telAntwoord.run(lid, onderdeel, sleutel, String(a.label || '').slice(0, 300), a.goed ? 1 : 0, a.goed ? 0 : 1);
      }
      const oud = leesResultaat.get(lid, onderdeel);
      const r = oud ? JSON.parse(oud.data) : {};
      const pct = totaal ? Math.round((score / totaal) * 100) : 0;
      const nieuw = {
        rondes: (r.rondes || 0) + (ronde ? 1 : 0),
        beste_pct: ronde ? Math.max(r.beste_pct || 0, pct) : (r.beste_pct || 0),
        beste_score: ronde && pct >= (r.beste_pct || 0) ? { score, totaal } : (r.beste_score || null),
        laatste: ronde ? { score, totaal, datum: new Date().toISOString(), ...(req.body?.extra && typeof req.body.extra === 'object' ? req.body.extra : {}) } : (r.laatste || null),
        totaal_goed: (r.totaal_goed || 0) + score,
        totaal_vragen: (r.totaal_vragen || 0) + totaal,
        nieuw_record: ronde && !!oud && pct > (r.beste_pct || 0),
      };
      schrijfResultaat.run(lid, onderdeel, JSON.stringify(nieuw));
      return nieuw;
    })();
    res.json(resultaat);
  });

  app.get('/api/quiz/stats', (req, res) => {
    const rijen = db.prepare<[number], { onderdeel: string; sleutel: string; label: string; goed: number; fout: number; laatst: string }>(
      'SELECT onderdeel, sleutel, label, goed, fout, laatst FROM quiz_stats WHERE lid_id = ?').all(req.lid!.id);
    res.json(rijen);
  });

  app.put('/api/voortgang', (req, res) => {
    const onderdeel = String(req.body?.onderdeel || '').slice(0, 50);
    const item = String(req.body?.item || '').slice(0, 100);
    const data = JSON.stringify(req.body?.data ?? {});
    if (!onderdeel || !item) { res.status(400).json({ error: 'Geef onderdeel en item mee' }); return; }
    if (data.length > 60000) { res.status(413).json({ error: 'Te veel data' }); return; }
    db.prepare(`INSERT INTO voortgang (lid_id, onderdeel, item, data, bijgewerkt) VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT (lid_id, onderdeel, item) DO UPDATE SET data = excluded.data, bijgewerkt = excluded.bijgewerkt`)
      .run(req.lid!.id, onderdeel, item, data);
    res.json({ ok: true });
  });

  // Eén voortgangsitem verwijderen (bv. een opgeslagen legging)
  app.delete('/api/voortgang', (req, res) => {
    const onderdeel = String(req.query.onderdeel || '');
    const item = String(req.query.item || '');
    if (!onderdeel || !item) { res.status(400).json({ error: 'Geef onderdeel en item mee' }); return; }
    const r = db.prepare('DELETE FROM voortgang WHERE lid_id = ? AND onderdeel = ? AND item = ?').run(req.lid!.id, onderdeel, item);
    res.json({ ok: true, verwijderd: r.changes });
  });
}

const STIJL = `  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;
  font:15px/1.5 'DM Sans',sans-serif;color:#FFF3DF;
  background:radial-gradient(ellipse at 15% 20%,#5f286a55,transparent 45%),radial-gradient(ellipse at 85% 80%,#632a6d55,transparent 45%),#0D0C22}
  .box{background:#20162F;border:1px solid #C292BD;border-radius:13px;padding:36px 30px;width:100%;max-width:400px;box-shadow:0 0 70px #AC55B23B}
  .merk{text-align:center;color:#F5D392;font:21px/1 Georgia,serif;letter-spacing:1.8px;margin-bottom:6px}
  .merk span{font-size:40px;display:block;margin-bottom:4px;text-shadow:0 0 20px #FFC04C66}
  h1{font:500 30px/1.1 'Cormorant Garamond',Georgia,serif;margin:14px 0 6px;text-align:center}
  .sub{color:#E0D5E9;font-size:14px;margin:0 0 22px;text-align:center}
  .tabs{display:flex;gap:8px;margin-bottom:16px}
  .tabs button{flex:1;font:600 12px 'DM Sans',sans-serif;text-transform:uppercase;padding:10px;border-radius:28px;cursor:pointer;min-height:44px;
  border:1px solid #B67AC9;background:transparent;color:#FFF3DF}
  .tabs button.aan{background:linear-gradient(#322040,#160D24);border-color:#EFB4FF;box-shadow:0 0 12px #BF60ED66}
  label{display:block;font-size:12px;color:#E1D2E8;margin:15px 0 0}
  input{width:100%;margin-top:7px;padding:12px 14px;font:15px 'DM Sans',sans-serif;border-radius:5px;border:1px solid #79527C;background:#130E1C;color:#fff;outline:none}
  input:focus-visible{outline:3px solid #F1CB78;outline-offset:2px}
  .knop{margin-top:22px;width:100%;min-height:44px;padding:13px 22px;font:700 12px 'DM Sans',sans-serif;text-transform:uppercase;border:1px solid #FFF2C3;border-radius:28px;
  cursor:pointer;background:linear-gradient(#FFEEB5,#FFC653 58%,#EEB153);color:#1C0D06;box-shadow:inset 0 0 7px #FFF1AF,0 0 16px #FFA33B77;transition:.2s}
  .knop:hover{filter:brightness(1.12);transform:translateY(-2px)}
  .knop:disabled{opacity:.48;cursor:wait;transform:none}
  .fout{color:#F1CB78;font-size:13px;min-height:18px;margin-top:12px;text-align:center}
  .klein{font-size:12px;color:#B9A9CC;text-align:center;margin-top:14px}
  .klein a{color:#F1CB78;text-decoration:none}
  .verborgen{display:none}
`;

const TOEGANG_PAGINA = `<!doctype html><html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0D0C22">
<title>Zen Flow — Inloggen</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${STIJL}</style></head><body>
<div class="box">
  <div class="merk"><span>☾</span>ZEN FLOW</div>
  <h1>Welkom terug</h1>
  <p class="sub">Log in op jouw Zen Flow-leeromgeving</p>
  <div class="tabs">
    <button type="button" id="t-in" class="aan" onclick="kies('in')">Inloggen</button>
    <button type="button" id="t-aan" onclick="kies('aan')">Account maken</button>
  </div>
  <form id="f" onsubmit="return verstuur(event)">
    <div id="v-naam" class="verborgen"><label for="naam">Naam</label><input id="naam" autocomplete="name" maxlength="80"></div>
    <label for="email">E-mailadres</label><input id="email" type="email" autocomplete="email" required>
    <label for="ww">Wachtwoord</label><input id="ww" type="password" autocomplete="current-password" required minlength="8">
    <button class="knop" id="knop" type="submit">Inloggen</button>
    <div class="fout" id="fout"></div>
  </form>
  <p class="klein verborgen" id="vergeten"><a href="/herstel">Wachtwoord vergeten?</a></p>
  <p class="klein" id="uitleg">Nog geen account? Aanmelden is gratis.</p>
  <p class="klein"><a href="https://zen-flow.nl">← Naar zen-flow.nl</a></p>
</div>
<script>
let modus='in';
fetch('/api/auth/herstel-beschikbaar').then(r=>r.json()).then(d=>{if(d.beschikbaar)document.getElementById('vergeten').className='klein'}).catch(()=>{});
function kies(m){modus=m;
  document.getElementById('t-in').className=m==='in'?'aan':'';
  document.getElementById('t-aan').className=m==='aan'?'aan':'';
  document.getElementById('v-naam').className=m==='aan'?'':'verborgen';
  document.getElementById('knop').textContent=m==='aan'?'Gratis account maken':'Inloggen';
  document.getElementById('ww').autocomplete=m==='aan'?'new-password':'current-password';
  document.getElementById('uitleg').textContent=m==='aan'?'Minimaal 8 tekens voor je wachtwoord.':'Nog geen account? Aanmelden is gratis.';
  document.getElementById('vergeten').style.display=m==='aan'?'none':'';
  document.getElementById('fout').textContent='';}
async function verstuur(e){e.preventDefault();
  const knop=document.getElementById('knop');knop.disabled=true;document.getElementById('fout').textContent='';
  const body={email:document.getElementById('email').value,wachtwoord:document.getElementById('ww').value,naam:document.getElementById('naam').value};
  try{const r=await fetch(modus==='aan'?'/api/auth/registreer':'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(r.ok){location.reload();return false}
    const d=await r.json().catch(()=>({}));document.getElementById('fout').textContent=d.error||'Er ging iets mis';
  }catch{document.getElementById('fout').textContent='Geen verbinding, probeer het opnieuw'}
  knop.disabled=false;return false}
</script></body></html>`;

// Wachtwoord vergeten: zonder token een adres invullen, met token (uit de mail) een nieuw wachtwoord kiezen.
const HERSTEL_PAGINA = `<!doctype html><html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0D0C22"><meta name="robots" content="noindex">
<title>Zen Flow — Wachtwoord herstellen</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${STIJL}
  .ok{color:#E0D5E9;font-size:14px;text-align:center;margin-top:14px}
</style></head><body>
<div class="box">
  <div class="merk"><span>☾</span>ZEN FLOW</div>
  <div id="vraag" class="verborgen">
    <h1>Wachtwoord vergeten?</h1>
    <p class="sub">Vul je e-mailadres in. Je krijgt een mail met een link om een nieuw wachtwoord te kiezen.</p>
    <form onsubmit="return vraagAan(event)">
      <label for="email">E-mailadres</label><input id="email" type="email" autocomplete="email" required>
      <button class="knop" id="k1" type="submit">Stuur mij een link</button>
      <div class="fout" id="f1"></div>
    </form>
  </div>
  <div id="nieuw" class="verborgen">
    <h1>Kies een nieuw wachtwoord</h1>
    <p class="sub">Minimaal 8 tekens. Daarna ben je meteen ingelogd.</p>
    <form onsubmit="return stelIn(event)">
      <label for="ww">Nieuw wachtwoord</label><input id="ww" type="password" autocomplete="new-password" required minlength="8">
      <label for="ww2">Nog een keer</label><input id="ww2" type="password" autocomplete="new-password" required minlength="8">
      <button class="knop" id="k2" type="submit">Wachtwoord opslaan</button>
      <div class="fout" id="f2"></div>
    </form>
  </div>
  <div id="uit" class="verborgen"><h1>Nog niet beschikbaar</h1><p class="sub">Wachtwoord herstellen kan binnenkort. Neem tot die tijd contact met ons op.</p></div>
  <p class="klein"><a href="/">← Terug naar inloggen</a></p>
</div>
<script>
const token=new URLSearchParams(location.search).get('token');
const toon=id=>document.getElementById(id).className='';
if(token){toon('nieuw');history.replaceState(null,'','/herstel')}
else fetch('/api/auth/herstel-beschikbaar').then(r=>r.json()).then(d=>toon(d.beschikbaar?'vraag':'uit')).catch(()=>toon('uit'));
async function post(url,body){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Er ging iets mis');return d}
async function vraagAan(e){e.preventDefault();const k=document.getElementById('k1'),f=document.getElementById('f1');k.disabled=true;f.textContent='';
  try{const d=await post('/api/auth/wachtwoord-vergeten',{email:document.getElementById('email').value});
    document.getElementById('vraag').innerHTML='<h1>Kijk in je mail</h1><p class="ok"></p>';document.querySelector('#vraag .ok').textContent=d.bericht}
  catch(err){f.textContent=err.message;k.disabled=false}return false}
async function stelIn(e){e.preventDefault();const k=document.getElementById('k2'),f=document.getElementById('f2');f.textContent='';
  const a=document.getElementById('ww').value,b=document.getElementById('ww2').value;if(a!==b){f.textContent='De twee wachtwoorden zijn niet hetzelfde';return false}
  k.disabled=true;try{await post('/api/auth/wachtwoord-herstellen',{token,wachtwoord:a});location.href='/'}catch(err){f.textContent=err.message;k.disabled=false}return false}
</script></body></html>`;
