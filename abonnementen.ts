// ─── Abonnementstypen voor de cursussen (zonder betaling) — beheer: /admin/abonnementen ────────────────────
// Een abonnementstype (bv. "Kennismaking", "Alles") bepaalt welke Academie-cursussen erbij horen en hoe lang het loopt.
// Een beheerder kent een type toe aan een lid (bv. testers, of na een betaling buiten de site).
// De TOEGANGSCONTROLE staat standaard UIT (instelling `toegang_via_abonnement`): dan ziet iedereen alle live cursussen,
// zoals voorheen. Pas als een beheerder hem aanzet, opent een Academie-cursus alleen met een passend abonnement.
// Beheerders zien altijd alles. Betaling (Stripe/Mollie) komt later en hangt dan aan deze typen. Zie README.
import express from 'express';
import Database from 'better-sqlite3';
import { join } from 'path';

let db: Database.Database | null = null;
function open(root: string) {
  if (!db) {
    db = new Database(join(root, 'data', 'leren.db'));
    db.pragma('foreign_keys = ON');
    db.exec(`
      CREATE TABLE IF NOT EXISTS abonnement_typen (
        id INTEGER PRIMARY KEY AUTOINCREMENT, naam TEXT NOT NULL, beschrijving TEXT NOT NULL DEFAULT '',
        looptijd_dagen INTEGER,                       -- NULL = onbeperkt
        alle_cursussen INTEGER NOT NULL DEFAULT 0,    -- 1 = ook toekomstige cursussen
        actief INTEGER NOT NULL DEFAULT 1,            -- 0 = gearchiveerd (niet meer toe te kennen; bestaande toekenningen blijven)
        aangemaakt TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS abonnement_type_cursussen (
        type_id INTEGER NOT NULL REFERENCES abonnement_typen(id) ON DELETE CASCADE,
        cursus_slug TEXT NOT NULL, PRIMARY KEY (type_id, cursus_slug)
      );
      CREATE TABLE IF NOT EXISTS lid_abonnementen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lid_id INTEGER NOT NULL REFERENCES leden(id) ON DELETE CASCADE,
        type_id INTEGER NOT NULL REFERENCES abonnement_typen(id),
        start TEXT NOT NULL, tot TEXT,                -- datums JJJJ-MM-DD; tot NULL = onbeperkt; tot is de laatste geldige dag
        notitie TEXT NOT NULL DEFAULT '', door TEXT NOT NULL DEFAULT '',
        aangemaakt TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS instellingen (
        sleutel TEXT PRIMARY KEY, waarde TEXT NOT NULL,
        bijgewerkt TEXT NOT NULL DEFAULT (datetime('now')), door TEXT NOT NULL DEFAULT ''
      );`);
  }
  return db;
}

const vandaag = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' });
const plusDagen = (datum: string, n: number) => { const d = new Date(`${datum}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export function toegangsControleAan(root: string): boolean {
  return open(root).prepare<[], { waarde: string }>(`SELECT waarde FROM instellingen WHERE sleutel = 'toegang_via_abonnement'`).get()?.waarde === '1';
}

/** Welke cursussen mag dit lid openen? `null` = alles (controle uit of beheerder). */
export function cursussenMetToegang(root: string, lid: { id: number; rol: string } | undefined): Set<string> | null {
  if (!toegangsControleAan(root) || lid?.rol === 'admin') return null;
  if (!lid) return new Set();
  const d = vandaag();
  const typen = open(root).prepare<[number, string, string], { id: number; alle_cursussen: number }>(`
    SELECT DISTINCT t.id, t.alle_cursussen FROM lid_abonnementen la JOIN abonnement_typen t ON t.id = la.type_id
    WHERE la.lid_id = ? AND la.start <= ? AND (la.tot IS NULL OR la.tot >= ?)`).all(lid.id, d, d);
  if (typen.some((t) => t.alle_cursussen === 1)) return null;
  const slugs = new Set<string>();
  for (const t of typen) for (const r of open(root).prepare<[number], { cursus_slug: string }>('SELECT cursus_slug FROM abonnement_type_cursussen WHERE type_id = ?').all(t.id)) slugs.add(r.cursus_slug);
  return slugs;
}

interface TypeRij { id: number; naam: string; beschrijving: string; looptijd_dagen: number | null; alle_cursussen: number; actief: number; aangemaakt: string }

export function installeerAbonnementen(app: express.Express, root: string) {
  const d = open(root);
  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };
  const typeMetCursussen = (t: TypeRij) => ({
    ...t, alle_cursussen: t.alle_cursussen === 1, actief: t.actief === 1,
    cursussen: d.prepare<[number], { cursus_slug: string }>('SELECT cursus_slug FROM abonnement_type_cursussen WHERE type_id = ?').all(t.id).map((r) => r.cursus_slug),
    leden_actief: d.prepare<[number, string, string], { n: number }>(`SELECT COUNT(DISTINCT lid_id) n FROM lid_abonnementen WHERE type_id = ? AND start <= ? AND (tot IS NULL OR tot >= ?)`).get(t.id, vandaag(), vandaag())!.n,
  });
  const leesType = (b: Record<string, unknown>) => {
    const naam = typeof b.naam === 'string' ? b.naam.trim().slice(0, 80) : '';
    if (!naam) return 'Geef het abonnement een naam';
    const looptijd = b.looptijd_dagen === null || b.looptijd_dagen === '' || b.looptijd_dagen === undefined ? null : Number(b.looptijd_dagen);
    if (looptijd !== null && (!Number.isInteger(looptijd) || looptijd < 1 || looptijd > 3660)) return 'Looptijd in hele dagen (1 t/m 3660), of leeg voor onbeperkt';
    const cursussen = Array.isArray(b.cursussen) ? [...new Set(b.cursussen.filter((s): s is string => typeof s === 'string' && /^[\w-]{1,120}$/.test(s)))] : [];
    return { naam, beschrijving: typeof b.beschrijving === 'string' ? b.beschrijving.trim().slice(0, 500) : '', looptijd, alle: b.alle_cursussen === true, cursussen };
  };

  app.get('/api/admin/abonnementen', alleenAdmin, (_req, res) => {
    res.json({
      aan: toegangsControleAan(root),
      typen: d.prepare<[], TypeRij>('SELECT * FROM abonnement_typen ORDER BY actief DESC, naam').all().map(typeMetCursussen),
      cursussen: d.prepare(`SELECT slug, nr, titel, live FROM academie_cursussen WHERE slug NOT LIKE '%-concept' ORDER BY nr`).all(),
    });
  });

  app.put('/api/admin/abonnementen/toegang', alleenAdmin, (req, res) => {
    const aan = req.body?.aan === true;
    d.prepare(`INSERT INTO instellingen (sleutel, waarde, door) VALUES ('toegang_via_abonnement', ?, ?)
      ON CONFLICT(sleutel) DO UPDATE SET waarde = excluded.waarde, door = excluded.door, bijgewerkt = datetime('now')`).run(aan ? '1' : '0', req.lid!.email);
    res.json({ aan });
  });

  const bewaarCursussen = (id: number, alle: boolean, cursussen: string[]) => {
    d.prepare('DELETE FROM abonnement_type_cursussen WHERE type_id = ?').run(id);
    if (!alle) for (const s of cursussen) d.prepare('INSERT INTO abonnement_type_cursussen (type_id, cursus_slug) VALUES (?, ?)').run(id, s);
  };
  app.post('/api/admin/abonnementen/typen', alleenAdmin, (req, res) => {
    const t = leesType(req.body || {});
    if (typeof t === 'string') { res.status(400).json({ error: t }); return; }
    const id = d.transaction(() => {
      const i = Number(d.prepare('INSERT INTO abonnement_typen (naam, beschrijving, looptijd_dagen, alle_cursussen) VALUES (?, ?, ?, ?)').run(t.naam, t.beschrijving, t.looptijd, t.alle ? 1 : 0).lastInsertRowid);
      bewaarCursussen(i, t.alle, t.cursussen); return i;
    })();
    res.json({ id });
  });
  app.put('/api/admin/abonnementen/typen/:id', alleenAdmin, (req, res) => {
    const id = Number(req.params.id);
    if (!d.prepare('SELECT 1 FROM abonnement_typen WHERE id = ?').get(id)) { res.status(404).json({ error: 'Onbekend abonnement' }); return; }
    if (typeof req.body?.actief === 'boolean' && Object.keys(req.body).length === 1) {   // alleen archiveren / terugzetten
      d.prepare('UPDATE abonnement_typen SET actief = ? WHERE id = ?').run(req.body.actief ? 1 : 0, id); res.json({ ok: true }); return;
    }
    const t = leesType(req.body || {});
    if (typeof t === 'string') { res.status(400).json({ error: t }); return; }
    d.transaction(() => {
      d.prepare('UPDATE abonnement_typen SET naam = ?, beschrijving = ?, looptijd_dagen = ?, alle_cursussen = ? WHERE id = ?').run(t.naam, t.beschrijving, t.looptijd, t.alle ? 1 : 0, id);
      bewaarCursussen(id, t.alle, t.cursussen);
    })();
    res.json({ ok: true });
  });

  // Toekenningen per lid
  const toekenningen = (lidId: number) => d.prepare(`SELECT la.id, la.type_id, t.naam, la.start, la.tot, la.notitie, la.door, la.aangemaakt,
      CASE WHEN la.start <= @v AND (la.tot IS NULL OR la.tot >= @v) THEN 'actief' WHEN la.start > @v THEN 'gepland' ELSE 'verlopen' END AS status
    FROM lid_abonnementen la JOIN abonnement_typen t ON t.id = la.type_id WHERE la.lid_id = @l ORDER BY la.start DESC, la.id DESC`).all({ v: vandaag(), l: lidId });
  app.get('/api/admin/leden/:id/abonnementen', alleenAdmin, (req, res) => { res.json(toekenningen(Number(req.params.id))); });
  app.post('/api/admin/leden/:id/abonnementen', alleenAdmin, (req, res) => {
    const lidId = Number(req.params.id), b = req.body || {};
    if (!d.prepare('SELECT 1 FROM leden WHERE id = ?').get(lidId)) { res.status(404).json({ error: 'Lid niet gevonden' }); return; }
    const t = d.prepare<[number], TypeRij>('SELECT * FROM abonnement_typen WHERE id = ? AND actief = 1').get(Number(b.type_id));
    if (!t) { res.status(400).json({ error: 'Kies een (niet-gearchiveerd) abonnement' }); return; }
    const start = typeof b.start === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.start) ? b.start : vandaag();
    let tot: string | null = t.looptijd_dagen ? plusDagen(start, t.looptijd_dagen - 1) : null;
    if (typeof b.tot === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.tot)) tot = b.tot;
    if (tot && tot < start) { res.status(400).json({ error: 'De einddatum ligt voor de startdatum' }); return; }
    d.prepare('INSERT INTO lid_abonnementen (lid_id, type_id, start, tot, notitie, door) VALUES (?, ?, ?, ?, ?, ?)')
      .run(lidId, t.id, start, tot, typeof b.notitie === 'string' ? b.notitie.slice(0, 300) : '', req.lid!.email);
    res.json(toekenningen(lidId));
  });
  // Beëindigen = einddatum op gisteren (niets wordt verwijderd, de geschiedenis blijft)
  app.post('/api/admin/lid-abonnementen/:id/beeindigen', alleenAdmin, (req, res) => {
    const r = d.prepare<[number], { lid_id: number; start: string }>('SELECT lid_id, start FROM lid_abonnementen WHERE id = ?').get(Number(req.params.id));
    if (!r) { res.status(404).json({ error: 'Niet gevonden' }); return; }
    const gisteren = plusDagen(vandaag(), -1);
    // Nog niet begonnen (of vandaag gestart)? Dan ook de start op gisteren, zodat de periode helemaal voorbij is.
    d.prepare('UPDATE lid_abonnementen SET start = MIN(start, ?), tot = ? WHERE id = ?').run(gisteren, gisteren, Number(req.params.id));
    res.json(toekenningen(r.lid_id));
  });

  // Voor het lid zelf (accountpagina)
  app.get('/api/mijn-abonnementen', (req, res) => {
    res.json({ controle: toegangsControleAan(root), abonnementen: toekenningen(req.lid!.id).filter((a) => (a as { status: string }).status !== 'verlopen') });
  });
}
