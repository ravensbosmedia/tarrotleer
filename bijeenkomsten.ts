// ─── Bijeenkomsten en privégesprekken plannen (beheer: /admin/bijeenkomsten, leden: /bijeenkomsten) ────────────────────
// Een beheerder plant een groepsbijeenkomst (voor alle leden, de leden van één cursus of losse personen) of een
// privégesprek (één lid). Leden zien hun bijeenkomsten in de leeromgeving, met de link, de pincode en een agenda-item (.ics).
// Het portal zelf draait apart (live: bijeenkomst.zen-flow.nl / gesprek.zen-flow.nl op de OVH-VPS 57.129.169.181);
// hier staat alleen de link + pincode. Uitnodigingsmails volgen na de Office 365-koppeling. Zie README.
import express from 'express';
import Database from 'better-sqlite3';
import { join } from 'path';

export type Soort = 'groep' | 'prive';
export type Doelgroep = 'alle' | 'cursus' | 'personen';
interface Rij {
  id: number; soort: Soort; titel: string; omschrijving: string; start: string; duur_min: number; link: string; pincode: string;
  doelgroep: Doelgroep; cursus_slug: string; status: 'gepland' | 'geannuleerd'; door: string; aangemaakt: string;
}

let db: Database.Database | null = null;
function open(root: string) {
  if (!db) {
    db = new Database(join(root, 'data', 'leren.db'));
    db.pragma('foreign_keys = ON');
    db.exec(`
      CREATE TABLE IF NOT EXISTS bijeenkomsten (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        soort TEXT NOT NULL CHECK (soort IN ('groep','prive')),
        titel TEXT NOT NULL, omschrijving TEXT NOT NULL DEFAULT '',
        start TEXT NOT NULL,                          -- Nederlandse tijd, JJJJ-MM-DDTHH:MM
        duur_min INTEGER NOT NULL DEFAULT 60,
        link TEXT NOT NULL, pincode TEXT NOT NULL DEFAULT '',
        doelgroep TEXT NOT NULL DEFAULT 'alle' CHECK (doelgroep IN ('alle','cursus','personen')),
        cursus_slug TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'gepland' CHECK (status IN ('gepland','geannuleerd')),
        door TEXT NOT NULL DEFAULT '', aangemaakt TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS bijeenkomst_genodigden (
        bijeenkomst_id INTEGER NOT NULL REFERENCES bijeenkomsten(id) ON DELETE CASCADE,
        lid_id INTEGER NOT NULL REFERENCES leden(id) ON DELETE CASCADE,
        PRIMARY KEY (bijeenkomst_id, lid_id)
      );`);
  }
  return db;
}

const STANDAARD_LINK: Record<Soort, string> = { groep: 'https://bijeenkomst.zen-flow.nl/', prive: 'https://gesprek.zen-flow.nl/' };

/** Nederlandse tijd 'JJJJ-MM-DDTHH:MM' → UTC-tijdstip (rekening houdend met zomer-/wintertijd). */
export function nlNaarUtc(nl: string): Date {
  const [d, t] = nl.split('T'); const [j, m, dg] = d.split('-').map(Number); const [u, mi] = t.split(':').map(Number);
  const gok = Date.UTC(j, m - 1, dg, u, mi);
  const deel = (ms: number) => Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(ms)).map((p) => [p.type, p.value]));
  const p = deel(gok); const verschil = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - gok;
  return new Date(gok - verschil);
}
const icsTijd = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// iCalendar: regels langer dan 75 bytes worden gevouwen (vervolgregel begint met een spatie)
const vouw = (r: string) => { const uit: string[] = []; let rest = r; while (Buffer.byteLength(rest) > 73) { let n = 73; while (Buffer.byteLength(rest.slice(0, n)) > 73) n--; uit.push(rest.slice(0, n)); rest = ' ' + rest.slice(n); } uit.push(rest); return uit.join('\r\n'); };
const icsTekst = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Mag dit lid deze bijeenkomst zien? */
function isGenodigd(d: Database.Database, b: Rij, lid: { id: number; rol: string }): boolean {
  if (lid.rol === 'admin') return true;
  if (b.soort === 'prive' || b.doelgroep === 'personen') return !!d.prepare('SELECT 1 FROM bijeenkomst_genodigden WHERE bijeenkomst_id = ? AND lid_id = ?').get(b.id, lid.id);
  if (b.doelgroep === 'cursus') {
    // Leden die met de cursus bezig zijn, of die hem in een (actief) abonnement hebben
    const vandaag = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' });
    return !!d.prepare(`SELECT 1 FROM voortgang WHERE lid_id = ? AND onderdeel = ? LIMIT 1`).get(lid.id, `academie-${b.cursus_slug}`)
      || !!(tabelBestaat(d, 'lid_abonnementen') && d.prepare(`SELECT 1 FROM lid_abonnementen la JOIN abonnement_typen t ON t.id = la.type_id
          LEFT JOIN abonnement_type_cursussen tc ON tc.type_id = t.id AND tc.cursus_slug = ?
          WHERE la.lid_id = ? AND la.start <= ? AND (la.tot IS NULL OR la.tot >= ?) AND (t.alle_cursussen = 1 OR tc.cursus_slug IS NOT NULL) LIMIT 1`)
        .get(b.cursus_slug, lid.id, vandaag, vandaag));
  }
  return true;   // alle leden
}
const tabelBestaat = (d: Database.Database, naam: string) => !!d.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?`).get(naam);

export function installeerBijeenkomsten(app: express.Express, root: string) {
  const d = open(root);
  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };
  const genodigden = (id: number) => d.prepare<[number], { id: number; naam: string; email: string }>(`SELECT l.id, l.naam, l.email FROM bijeenkomst_genodigden g
    JOIN leden l ON l.id = g.lid_id WHERE g.bijeenkomst_id = ? ORDER BY l.naam`).all(id);

  const lees = (b: Record<string, unknown>) => {
    const s = (k: string, max: number) => (typeof b[k] === 'string' ? (b[k] as string).trim().slice(0, max) : '');
    const soort = b.soort === 'prive' ? 'prive' : 'groep';
    const titel = s('titel', 120), start = s('start', 16), link = s('link', 300) || STANDAARD_LINK[soort];
    if (!titel) return 'Geef een titel';
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start) || isNaN(nlNaarUtc(start).getTime())) return 'Kies een datum en tijd';
    const duur = Number(b.duur_min ?? 60);
    if (!Number.isInteger(duur) || duur < 10 || duur > 480) return 'Duur tussen 10 en 480 minuten';
    if (!/^https:\/\/[^\s]+$/.test(link)) return 'De link moet beginnen met https://';
    const pincode = s('pincode', 8);
    if (pincode && !/^\d{4,8}$/.test(pincode)) return 'Pincode: 4 tot 8 cijfers (of leeg)';
    const doelgroep: Doelgroep = soort === 'prive' ? 'personen' : (['alle', 'cursus', 'personen'] as const).includes(b.doelgroep as Doelgroep) ? b.doelgroep as Doelgroep : 'alle';
    const cursus_slug = doelgroep === 'cursus' ? s('cursus_slug', 120) : '';
    if (doelgroep === 'cursus' && !d.prepare('SELECT 1 FROM academie_cursussen WHERE slug = ?').get(cursus_slug)) return 'Kies een cursus';
    const leden = Array.isArray(b.genodigden) ? [...new Set(b.genodigden.map(Number).filter((n) => Number.isInteger(n) && n > 0))] : [];
    if (doelgroep === 'personen' && leden.length === 0) return soort === 'prive' ? 'Kies het lid voor dit gesprek' : 'Kies minimaal één persoon';
    if (soort === 'prive' && leden.length !== 1) return 'Een privégesprek is met precies één lid';
    return { soort, titel, omschrijving: s('omschrijving', 2000), start, duur, link, pincode, doelgroep, cursus_slug, leden };
  };
  const bewaarGenodigden = (id: number, leden: number[]) => {
    d.prepare('DELETE FROM bijeenkomst_genodigden WHERE bijeenkomst_id = ?').run(id);
    for (const l of leden) if (d.prepare('SELECT 1 FROM leden WHERE id = ?').get(l)) d.prepare('INSERT INTO bijeenkomst_genodigden VALUES (?, ?)').run(id, l);
  };

  // ── Beheer ──
  app.get('/api/admin/bijeenkomsten', alleenAdmin, (_req, res) => {
    const rijen = d.prepare<[], Rij>('SELECT * FROM bijeenkomsten ORDER BY start DESC LIMIT 200').all();
    res.json(rijen.map((b) => ({ ...b, genodigden: genodigden(b.id) })));
  });
  app.post('/api/admin/bijeenkomsten', alleenAdmin, (req, res) => {
    const b = lees(req.body || {});
    if (typeof b === 'string') { res.status(400).json({ error: b }); return; }
    const id = d.transaction(() => {
      const i = Number(d.prepare(`INSERT INTO bijeenkomsten (soort, titel, omschrijving, start, duur_min, link, pincode, doelgroep, cursus_slug, door)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(b.soort, b.titel, b.omschrijving, b.start, b.duur, b.link, b.pincode, b.doelgroep, b.cursus_slug, req.lid!.email).lastInsertRowid);
      bewaarGenodigden(i, b.doelgroep === 'personen' ? b.leden : []); return i;
    })();
    res.json({ id });
  });
  app.put('/api/admin/bijeenkomsten/:id', alleenAdmin, (req, res) => {
    const id = Number(req.params.id);
    if (!d.prepare('SELECT 1 FROM bijeenkomsten WHERE id = ?').get(id)) { res.status(404).json({ error: 'Niet gevonden' }); return; }
    if (req.body && Object.keys(req.body).length === 1 && (req.body.status === 'geannuleerd' || req.body.status === 'gepland')) {
      d.prepare('UPDATE bijeenkomsten SET status = ? WHERE id = ?').run(req.body.status, id); res.json({ ok: true }); return;   // annuleren = archiveren
    }
    const b = lees(req.body || {});
    if (typeof b === 'string') { res.status(400).json({ error: b }); return; }
    d.transaction(() => {
      d.prepare(`UPDATE bijeenkomsten SET soort = ?, titel = ?, omschrijving = ?, start = ?, duur_min = ?, link = ?, pincode = ?, doelgroep = ?, cursus_slug = ? WHERE id = ?`)
        .run(b.soort, b.titel, b.omschrijving, b.start, b.duur, b.link, b.pincode, b.doelgroep, b.cursus_slug, id);
      bewaarGenodigden(id, b.doelgroep === 'personen' ? b.leden : []);
    })();
    res.json({ ok: true });
  });

  // ── Voor leden: komende bijeenkomsten waarvoor zij zijn uitgenodigd (tot 2 uur na de start zichtbaar) ──
  app.get('/api/bijeenkomsten', (req, res) => {
    const nu = Date.now();
    const rijen = d.prepare<[], Rij>(`SELECT * FROM bijeenkomsten WHERE status = 'gepland' ORDER BY start`).all()
      .filter((b) => nlNaarUtc(b.start).getTime() + (b.duur_min + 120) * 60_000 > nu && isGenodigd(d, b, req.lid!));
    res.json(rijen.map(({ door: _d, aangemaakt: _a, ...b }) => b));
  });
  app.get('/api/bijeenkomsten/:id/agenda.ics', (req, res) => {
    const b = d.prepare<[number], Rij>('SELECT * FROM bijeenkomsten WHERE id = ?').get(Number(req.params.id));
    if (!b || !isGenodigd(d, b, req.lid!)) { res.status(404).json({ error: 'Niet gevonden' }); return; }
    const start = nlNaarUtc(b.start), eind = new Date(start.getTime() + b.duur_min * 60_000);
    const uitleg = [b.omschrijving, `Deelnemen: ${b.link}`, b.pincode ? `Pincode: ${b.pincode}` : ''].filter(Boolean).join('\n\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zen Flow//Bijeenkomsten//NL', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      `UID:bijeenkomst-${b.id}@leren.zen-flow.nl`, `DTSTAMP:${icsTijd(new Date())}`, `DTSTART:${icsTijd(start)}`, `DTEND:${icsTijd(eind)}`,
      `SUMMARY:${icsTekst(b.titel)}`, `DESCRIPTION:${icsTekst(uitleg)}`, `URL:${b.link}`, `LOCATION:${icsTekst(b.link)}`,
      b.status === 'geannuleerd' ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED',
      'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', `DESCRIPTION:${icsTekst(b.titel)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].map(vouw).join('\r\n');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="zen-flow-bijeenkomst-${b.id}.ics"`);
    res.send(ics);
  });
}
