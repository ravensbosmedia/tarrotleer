// ─── Accounts, abonnementen en voortgang (SQLite) ────────────────────
// Vervangt de oude pincode: zonder geldige sessie krijg je de inlog-/aanmeldpagina.
// Database: data/leren.db (gaat mee in de nachtelijke back-up).
import type express from 'express';
import Database from 'better-sqlite3';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import { mkdirSync } from 'fs';
import { join } from 'path';

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

function hashWachtwoord(wachtwoord: string): string {
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
  `);
  db.prepare(`DELETE FROM sessies WHERE verloopt < datetime('now')`).run();

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

  // ── Toegangscontrole: alles hierna alleen met een account ──
  app.use((req, res, next) => {
    const lid = lidUitSessie(req);
    if (lid) { req.lid = lid; return next(); }
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

  app.put('/api/voortgang', (req, res) => {
    const onderdeel = String(req.body?.onderdeel || '').slice(0, 50);
    const item = String(req.body?.item || '').slice(0, 100);
    const data = JSON.stringify(req.body?.data ?? {});
    if (!onderdeel || !item) { res.status(400).json({ error: 'Geef onderdeel en item mee' }); return; }
    if (data.length > 20000) { res.status(413).json({ error: 'Te veel data' }); return; }
    db.prepare(`INSERT INTO voortgang (lid_id, onderdeel, item, data, bijgewerkt) VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT (lid_id, onderdeel, item) DO UPDATE SET data = excluded.data, bijgewerkt = excluded.bijgewerkt`)
      .run(req.lid!.id, onderdeel, item, data);
    res.json({ ok: true });
  });
}

const TOEGANG_PAGINA = `<!doctype html><html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mystieke Kaarten — Inloggen</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;
  font-family:'Crimson Pro',Georgia,serif;background:radial-gradient(circle at 50% 25%,#3A2E1C,#1A1209 70%);color:#F5EDD8}
  .box{background:rgba(44,36,22,.92);border:.5px solid rgba(184,134,11,.4);border-radius:18px;padding:34px 30px;
  width:100%;max-width:370px;box-shadow:0 14px 44px rgba(0,0,0,.55)}
  h1{font-family:Cinzel,serif;color:#B8860B;font-size:21px;letter-spacing:.14em;margin:0 0 4px;text-align:center}
  .sub{color:rgba(245,237,216,.6);font-size:15px;margin:0 0 22px;text-align:center}
  .tabs{display:flex;gap:6px;margin-bottom:18px}
  .tabs button{flex:1;font-family:Cinzel,serif;font-size:12px;letter-spacing:.08em;padding:8px;border-radius:9px;cursor:pointer;
  border:.5px solid rgba(184,134,11,.35);background:transparent;color:rgba(245,237,216,.75)}
  .tabs button.aan{background:#B8860B;color:#1A1209;border-color:#B8860B}
  label{display:block;font-size:14px;color:rgba(245,237,216,.75);margin:12px 0 4px}
  input{width:100%;padding:11px 12px;font-size:16px;border-radius:9px;border:.5px solid rgba(184,134,11,.4);
  background:#1A1209;color:#F5EDD8;outline:none;font-family:inherit}
  input:focus{border-color:#B8860B}
  .knop{margin-top:20px;width:100%;padding:12px;font-family:Cinzel,serif;font-size:13px;letter-spacing:.1em;border:0;border-radius:10px;
  cursor:pointer;background:linear-gradient(135deg,#B8860B,#D4A537);color:#1A1209;font-weight:600}
  .knop:disabled{opacity:.6;cursor:wait}
  .fout{color:#ff9a8a;font-size:14px;min-height:18px;margin-top:10px;text-align:center}
  .klein{font-size:13px;color:rgba(245,237,216,.5);text-align:center;margin-top:14px}
  .verborgen{display:none}
</style></head><body>
<div class="box">
  <h1>✦ MYSTIEKE KAARTEN</h1>
  <p class="sub">Leer tarot, lenormand, numerologie en astrologie</p>
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
  <p class="klein" id="uitleg">Nog geen account? Aanmelden is gratis.</p>
</div>
<script>
let modus='in';
function kies(m){modus=m;
  document.getElementById('t-in').className=m==='in'?'aan':'';
  document.getElementById('t-aan').className=m==='aan'?'aan':'';
  document.getElementById('v-naam').className=m==='aan'?'':'verborgen';
  document.getElementById('knop').textContent=m==='aan'?'Gratis account maken':'Inloggen';
  document.getElementById('ww').autocomplete=m==='aan'?'new-password':'current-password';
  document.getElementById('uitleg').textContent=m==='aan'?'Minimaal 8 tekens voor je wachtwoord.':'Nog geen account? Aanmelden is gratis.';
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
