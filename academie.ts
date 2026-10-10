// ─── Academie: losse cursussen beoordelen en aanpassen (alleen beheerders) ───
// Cursusmateriaal komt uit een geüploade zip (zie cursussen.ts) en wordt hier geïmporteerd
// als concept. Beheerders beoordelen en bewerken elk hoofdstuk; elke opslag bewaart een versie.
// Niets hiervan is zichtbaar voor gewone leden.
import type express from 'express';
import Database from 'better-sqlite3';
import { execFileSync } from 'child_process';
import { join } from 'path';

type HoofdstukStatus = 'te_beoordelen' | 'aangepast' | 'goedgekeurd';
type CursusStatus = 'concept' | 'in_beoordeling' | 'goedgekeurd';
const H_STATUS: HoofdstukStatus[] = ['te_beoordelen', 'aangepast', 'goedgekeurd'];
const C_STATUS: CursusStatus[] = ['concept', 'in_beoordeling', 'goedgekeurd'];

interface CursusRij { id: number; slug: string; nr: number; titel: string; beschrijving: string; status: CursusStatus; upload_id: number | null; bijgewerkt: string }
interface HoofdstukRij {
  id: number; cursus_id: number; nr: number; slug: string; titel: string; inhoud: string; origineel: string;
  status: HoofdstukStatus; notitie: string; bijgewerkt: string; bijgewerkt_door: string;
}

// Leest alle .md-bestanden uit een zip (via Python, dat al op de server staat)
const ZIP_LEZER = `
import json, sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
uit = []
for n in z.namelist():
    if n.endswith('.md') and not n.startswith('/') and '..' not in n and not n.startswith('__MACOSX'):
        uit.append({'pad': n, 'tekst': z.read(n).decode('utf-8', 'replace')})
print(json.dumps(uit))
`;

/** Haalt de kop (titel + gegevens) en de navigatie onderaan uit een hoofdstuk. */
function kaleInhoud(md: string): { titel: string; inhoud: string } {
  const titel = (md.match(/^#\s+(?:Hoofdstuk\s+\d+\s+[—-]\s+)?(.+)$/m)?.[1] || '').trim();
  let inhoud = md;
  const start = inhoud.search(/^##\s/m);
  if (start > 0) inhoud = inhoud.slice(start);
  inhoud = inhoud.replace(/\n\*\*Vorige:\*\*[\s\S]*$/, '').trim();
  return { titel, inhoud };
}

export function installeerAcademie(app: express.Express, root: string) {
  const db = new Database(join(root, 'data', 'leren.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS academie_cursussen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      nr INTEGER NOT NULL,
      titel TEXT NOT NULL,
      beschrijving TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'concept',
      upload_id INTEGER,
      bijgewerkt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS academie_hoofdstukken (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cursus_id INTEGER NOT NULL REFERENCES academie_cursussen(id) ON DELETE CASCADE,
      nr INTEGER NOT NULL,
      slug TEXT NOT NULL,
      titel TEXT NOT NULL,
      inhoud TEXT NOT NULL,
      origineel TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'te_beoordelen',
      notitie TEXT NOT NULL DEFAULT '',
      bijgewerkt TEXT NOT NULL DEFAULT (datetime('now')),
      bijgewerkt_door TEXT NOT NULL DEFAULT '',
      UNIQUE (cursus_id, nr)
    );
    CREATE TABLE IF NOT EXISTS academie_versies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hoofdstuk_id INTEGER NOT NULL REFERENCES academie_hoofdstukken(id) ON DELETE CASCADE,
      titel TEXT NOT NULL,
      inhoud TEXT NOT NULL,
      datum TEXT NOT NULL DEFAULT (datetime('now')),
      door TEXT NOT NULL,
      reden TEXT NOT NULL DEFAULT ''
    );
  `);

  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };
  const cursusVan = db.prepare<[string], CursusRij>('SELECT * FROM academie_cursussen WHERE slug = ?');
  const hoofdstukVan = db.prepare<[number], HoofdstukRij>('SELECT * FROM academie_hoofdstukken WHERE id = ?');

  // ── Import uit een geüploade zip: alleen nieuwe cursussen/hoofdstukken, bewerkte inhoud blijft staan ──
  app.post('/api/admin/academie/importeer/:uploadId', alleenAdmin, (req, res) => {
    const upload = db.prepare<[number], { id: number; bestand: string }>('SELECT id, bestand FROM cursus_uploads WHERE id = ?')
      .get(Number(req.params.uploadId));
    if (!upload) { res.status(404).json({ error: 'Upload niet gevonden' }); return; }
    let bestanden: { pad: string; tekst: string }[];
    try {
      const uit = execFileSync('python3', ['-c', ZIP_LEZER, join(root, 'data', 'uploads', 'cursussen', upload.bestand)],
        { maxBuffer: 200 * 1024 * 1024 });
      bestanden = JSON.parse(uit.toString('utf-8'));
    } catch {
      res.status(400).json({ error: 'Zip kon niet gelezen worden' }); return;
    }

    // Cursustitels uit het startbestand ("## 01. Mediumschap & …"), anders uit "**Cursus:**" in een hoofdstuk
    const titels = new Map<number, string>();
    const start = bestanden.find((b) => /START/i.test(b.pad.split('/').pop() || ''));
    for (const m of (start?.tekst || '').matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)) titels.set(Number(m[1]), m[2].trim());

    let nieuweCursussen = 0, nieuweHoofdstukken = 0, overgeslagen = 0;
    const voegToe = db.transaction(() => {
      for (const b of bestanden) {
        const delen = b.pad.split('/');
        const map = delen[delen.length - 2] || '';
        const bestand = delen[delen.length - 1];
        const cm = map.match(/^(\d+)-(.+)$/);
        const hm = bestand.match(/^(\d+)-(\d+)-(.+)\.md$/);
        if (!cm || !hm) continue;
        const cursusNr = Number(cm[1]);
        const slug = map;
        let cursus = cursusVan.get(slug);
        if (!cursus) {
          const titel = titels.get(cursusNr) || b.tekst.match(/^\*\*Cursus:\*\*\s*(.+?)\s*$/m)?.[1] || cm[2].replace(/-/g, ' ');
          db.prepare('INSERT INTO academie_cursussen (slug, nr, titel, upload_id) VALUES (?, ?, ?, ?)').run(slug, cursusNr, titel, upload.id);
          cursus = cursusVan.get(slug)!;
          nieuweCursussen++;
        }
        const nr = Number(hm[2]);
        const bestaat = db.prepare('SELECT 1 FROM academie_hoofdstukken WHERE cursus_id = ? AND nr = ?').get(cursus.id, nr);
        if (bestaat) { overgeslagen++; continue; }
        const { titel, inhoud } = kaleInhoud(b.tekst);
        db.prepare(`INSERT INTO academie_hoofdstukken (cursus_id, nr, slug, titel, inhoud, origineel, bijgewerkt_door)
          VALUES (?, ?, ?, ?, ?, ?, ?)`).run(cursus.id, nr, hm[3], titel || hm[3].replace(/-/g, ' '), inhoud, inhoud, 'import');
        nieuweHoofdstukken++;
      }
      db.prepare(`UPDATE cursus_uploads SET status = CASE WHEN status = 'nieuw' THEN 'in_behandeling' ELSE status END WHERE id = ?`).run(upload.id);
    });
    voegToe();
    res.json({ nieuweCursussen, nieuweHoofdstukken, overgeslagen });
  });

  // ── Overzicht van alle cursussen met voortgang van de beoordeling ──
  app.get('/api/admin/academie', alleenAdmin, (_req, res) => {
    const rijen = db.prepare(`
      SELECT c.*, COUNT(h.id) AS hoofdstukken,
        SUM(h.status = 'goedgekeurd') AS goedgekeurd, SUM(h.status = 'aangepast') AS aangepast
      FROM academie_cursussen c LEFT JOIN academie_hoofdstukken h ON h.cursus_id = c.id
      GROUP BY c.id ORDER BY c.nr`).all();
    res.json(rijen);
  });

  app.get('/api/admin/academie/:slug', alleenAdmin, (req, res) => {
    const c = cursusVan.get(String(req.params.slug));
    if (!c) { res.status(404).json({ error: 'Cursus niet gevonden' }); return; }
    const hoofdstukken = db.prepare(`SELECT id, nr, slug, titel, status, notitie, bijgewerkt, bijgewerkt_door,
      (inhoud != origineel) AS gewijzigd, length(inhoud) AS lengte FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr`).all(c.id);
    res.json({ ...c, hoofdstukken });
  });

  app.patch('/api/admin/academie/:slug', alleenAdmin, (req, res) => {
    const c = cursusVan.get(String(req.params.slug));
    if (!c) { res.status(404).json({ error: 'Cursus niet gevonden' }); return; }
    const titel = typeof req.body?.titel === 'string' && req.body.titel.trim() ? req.body.titel.trim().slice(0, 150) : c.titel;
    const beschrijving = typeof req.body?.beschrijving === 'string' ? req.body.beschrijving.slice(0, 2000) : c.beschrijving;
    const status = C_STATUS.includes(req.body?.status) ? req.body.status : c.status;
    db.prepare(`UPDATE academie_cursussen SET titel = ?, beschrijving = ?, status = ?, bijgewerkt = datetime('now') WHERE id = ?`)
      .run(titel, beschrijving, status, c.id);
    res.json(cursusVan.get(c.slug));
  });

  // ── Eén hoofdstuk lezen en bewerken ──
  app.get('/api/admin/academie/hoofdstuk/:id', alleenAdmin, (req, res) => {
    const h = hoofdstukVan.get(Number(req.params.id));
    if (!h) { res.status(404).json({ error: 'Hoofdstuk niet gevonden' }); return; }
    const c = db.prepare<[number], CursusRij>('SELECT * FROM academie_cursussen WHERE id = ?').get(h.cursus_id)!;
    const buren = db.prepare<[number], { id: number; nr: number; titel: string }>('SELECT id, nr, titel FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr').all(h.cursus_id);
    const versies = db.prepare('SELECT id, titel, datum, door, reden, length(inhoud) AS lengte FROM academie_versies WHERE hoofdstuk_id = ? ORDER BY id DESC LIMIT 50').all(h.id);
    res.json({ ...h, cursus: { slug: c.slug, titel: c.titel, nr: c.nr }, buren, versies });
  });

  app.put('/api/admin/academie/hoofdstuk/:id', alleenAdmin, (req, res) => {
    const h = hoofdstukVan.get(Number(req.params.id));
    if (!h) { res.status(404).json({ error: 'Hoofdstuk niet gevonden' }); return; }
    const titel = typeof req.body?.titel === 'string' && req.body.titel.trim() ? req.body.titel.trim().slice(0, 200) : h.titel;
    const inhoud = typeof req.body?.inhoud === 'string' ? req.body.inhoud.slice(0, 100000) : h.inhoud;
    const status = H_STATUS.includes(req.body?.status) ? req.body.status : h.status;
    const notitie = typeof req.body?.notitie === 'string' ? req.body.notitie.slice(0, 2000) : h.notitie;
    db.transaction(() => {
      // Vorige versie bewaren als de tekst of titel verandert (zo is alles terug te zetten)
      if (inhoud !== h.inhoud || titel !== h.titel) {
        db.prepare('INSERT INTO academie_versies (hoofdstuk_id, titel, inhoud, door, reden) VALUES (?, ?, ?, ?, ?)')
          .run(h.id, h.titel, h.inhoud, req.lid!.email, String(req.body?.reden || 'opgeslagen').slice(0, 100));
      }
      db.prepare(`UPDATE academie_hoofdstukken SET titel = ?, inhoud = ?, status = ?, notitie = ?, bijgewerkt = datetime('now'), bijgewerkt_door = ? WHERE id = ?`)
        .run(titel, inhoud, status, notitie, req.lid!.email, h.id);
    })();
    res.json(hoofdstukVan.get(h.id));
  });

  app.get('/api/admin/academie/versie/:id', alleenAdmin, (req, res) => {
    const v = db.prepare('SELECT * FROM academie_versies WHERE id = ?').get(Number(req.params.id));
    if (!v) { res.status(404).json({ error: 'Versie niet gevonden' }); return; }
    res.json(v);
  });

  // ── AI-voorstel: gpt-5.5 maakt een verbeterde versie; de beheerder beslist of die wordt overgenomen ──
  app.post('/api/admin/academie/hoofdstuk/:id/voorstel', alleenAdmin, async (req, res) => {
    const h = hoofdstukVan.get(Number(req.params.id));
    if (!h) { res.status(404).json({ error: 'Hoofdstuk niet gevonden' }); return; }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) { res.status(503).json({ error: 'OpenAI API sleutel niet geconfigureerd' }); return; }
    const c = db.prepare<[number], CursusRij>('SELECT * FROM academie_cursussen WHERE id = ?').get(h.cursus_id)!;
    const alle = db.prepare<[number], { nr: number; titel: string }>('SELECT nr, titel FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr').all(h.cursus_id);
    const wens = String(req.body?.wens || '').slice(0, 1000);
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey });
      const systeem = `Je bent een ervaren Nederlandse docent en redacteur voor een spirituele online academie (Mystieke Kaarten).
Je herschrijft één hoofdstuk zodat het ECHTE, specifieke inhoud heeft over het onderwerp in de titel, in plaats van algemene sjabloonzinnen.
Regels:
- Behoud de opbouw met deze kopjes (Markdown): ## Welkom, ## Leerdoelen, ## Uitleg, ## Toepassing, ## Praktijkoefening, ## Kennistoets, ## Afronden.
- Uitleg: 400–700 woorden concrete kennis over het onderwerp (achtergrond, tradities, begrippen, voorbeelden). Specifiek voor DIT hoofdstuk, geen herhaling van andere hoofdstukken.
- Praktijkoefening: een specifieke, uitvoerbare oefening in genummerde stappen.
- Kennistoets: 4 meerkeuzevragen in dit formaat, plus 1 open reflectievraag:
  **1. Vraag?**
  - A) …
  - B) …
  - C) …
  - D) …
  Zet de juiste antwoorden met korte uitleg in een <details><summary>Antwoorden</summary> … </details>-blok.
- Toon: warm, helder, je/jij. Spirituele begrippen als traditie of overtuiging; geen genezingsbeloften, geen medische, juridische of financiële adviezen; benoem grenzen en doorverwijzen waar passend.
- Geef ALLEEN de Markdown van het hoofdstuk terug, zonder titelregel.`;
      const gebruiker = `Cursus: ${c.titel}\nHoofdstukken van deze cursus: ${alle.map((a) => `${a.nr}. ${a.titel}`).join(' | ')}\n` +
        `Dit hoofdstuk: ${h.nr}. ${h.titel}\n${wens ? `Extra wens van de beheerder: ${wens}\n` : ''}\nHuidige tekst:\n${h.inhoud}`;
      const resp = await openai.chat.completions.create({
        model: 'gpt-5.5',
        messages: [{ role: 'system', content: systeem }, { role: 'user', content: gebruiker }],
        max_completion_tokens: 12000,
      });
      res.json({ voorstel: (resp.choices[0].message.content || '').trim() });
    } catch (err: unknown) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Voorstel mislukt' });
    }
  });
}
