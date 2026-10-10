// ─── Academie: losse cursussen beoordelen en aanpassen (alleen beheerders) ───
// Cursusmateriaal komt uit een geüploade zip (zie cursussen.ts) en wordt hier geïmporteerd
// als concept. Beheerders beoordelen en bewerken elk hoofdstuk; elke opslag bewaart een versie.
// Bewust GEEN AI-aanroep op de server (kost tegoed); verbeteren gebeurt via ChatGPT in de browser.
// Niets hiervan is zichtbaar voor gewone leden.
import express from 'express';
import Database from 'better-sqlite3';
import { execFileSync, execFile } from 'child_process';
import { promisify } from 'util';
import { posix } from 'path';
import { join } from 'path';
import { unlinkSync, mkdirSync, readdirSync, readFileSync, statSync, createWriteStream, openSync, readSync, closeSync, writeFileSync } from 'fs';

type HoofdstukStatus = 'te_beoordelen' | 'aangepast' | 'goedgekeurd';
type CursusStatus = 'concept' | 'in_beoordeling' | 'goedgekeurd';
const H_STATUS: HoofdstukStatus[] = ['te_beoordelen', 'aangepast', 'goedgekeurd'];
const C_STATUS: CursusStatus[] = ['concept', 'in_beoordeling', 'goedgekeurd'];

interface CursusRij { id: number; slug: string; nr: number; titel: string; beschrijving: string; status: CursusStatus; upload_id: number | null; bijgewerkt: string }
interface HoofdstukRij {
  id: number; cursus_id: number; nr: number; slug: string; titel: string; inhoud: string; origineel: string;
  status: HoofdstukStatus; notitie: string; bijgewerkt: string; bijgewerkt_door: string;
}

const execFileAsync = promisify(execFile);

// Leest alle .md-bestanden uit een zip en pakt afbeeldingen uit naar een mediamap (via Python, staat al op de server).
// Uitvoer: { md: [{ pad, tekst }], img: [pad, …] } met genormaliseerde paden binnen de zip.
const ZIP_LEZER = `
import json, os, shutil, sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
media = sys.argv[2] if len(sys.argv) > 2 else None
afb = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'}
md, img = [], []
for info in z.infolist():
    n = info.filename
    if info.is_dir() or n.startswith('__MACOSX') or '/.' in '/' + n:
        continue
    pad = os.path.normpath(n).replace(os.sep, '/')
    if pad.startswith('..') or pad.startswith('/'):
        continue
    ext = os.path.splitext(pad)[1].lower()
    if ext == '.md' or (ext == '.json' and 'koppeling' in os.path.basename(pad).lower()):
        md.append({'pad': pad, 'tekst': z.read(info).decode('utf-8-sig', 'replace')})
    elif ext in afb and media:
        doel = os.path.join(media, pad)
        os.makedirs(os.path.dirname(doel), exist_ok=True)
        with z.open(info) as bron, open(doel, 'wb') as uit:
            shutil.copyfileobj(bron, uit, 1 << 20)
        img.append(pad)
print(json.dumps({'md': md, 'img': img}))
`;

interface ZipInhoud { md: { pad: string; tekst: string }[]; img: string[] }

/** Schrijft de request-body rechtstreeks naar een bestand (niet in het geheugen); geeft het aantal bytes terug. */
function ontvangNaarBestand(req: express.Request, pad: string, max: number): Promise<number> {
  return new Promise((ok, fout) => {
    const uit = createWriteStream(pad);
    let n = 0;
    req.on('data', (stuk: Buffer) => { n += stuk.length; if (n > max) { req.destroy(); uit.destroy(); fout(new Error('Bestand is te groot (max 1 GB)')); } });
    req.on('aborted', () => { uit.destroy(); fout(new Error('Upload afgebroken')); });
    uit.on('finish', () => ok(n));
    uit.on('error', fout);
    req.pipe(uit);
  });
}

/** Controleert of een bestand met "PK\x03\x04" begint (zip). */
function isZip(pad: string): boolean {
  const kop = Buffer.alloc(4);
  const fd = openSync(pad, 'r');
  try { readSync(fd, kop, 0, 4, 0); } finally { closeSync(fd); }
  return kop.readUInt32LE(0) === 0x04034b50;
}

/** Leest een zip asynchroon (blokkeert de server niet), optioneel met uitpakken van afbeeldingen. */
async function leesZip(zip: string, mediaMap?: string): Promise<ZipInhoud> {
  const args = ['-c', ZIP_LEZER, zip, ...(mediaMap ? [mediaMap] : [])];
  const { stdout } = await execFileAsync('python3', args, { maxBuffer: 300 * 1024 * 1024 });
  return JSON.parse(stdout);
}

/**
 * Bereidt de .md-bestanden uit een zip voor op import:
 * - verwijzingen naar afbeeldingen in de tekst worden gekoppeld (zie koppelAfbeeldingen);
 * - heeft een hoofdstuk géén afbeelding, dan komt er een kopafbeelding bovenaan uit een koppelbestand
 *   (koppeling-hoofdstukken.json: markdown → afbeelding + alt), of anders een afbeelding met dezelfde naam;
 * - een eventuele les_status uit het koppelbestand wordt teruggegeven als notitie.
 */
function bereidVoor(z: ZipInhoud, prefix: string): { pad: string; tekst: string; kop?: string; notitie?: string }[] {
  const afbeeldingen = new Set(z.img);
  const mediaUrl = (pad: string) => `/api/academie-media/${prefix}/${pad.split('/').map(encodeURIComponent).join('/')}`;
  const koppeling = new Map<string, { afbeelding?: string; alt?: string; status?: string }>();
  for (const b of z.md.filter((x) => x.pad.endsWith('.json'))) {
    try {
      const basis = posix.dirname(b.pad);
      for (const r of JSON.parse(b.tekst) as Record<string, unknown>[]) {
        if (typeof r.markdown !== 'string') continue;
        koppeling.set(posix.normalize(posix.join(basis, r.markdown)), {
          afbeelding: typeof r.afbeelding === 'string' ? posix.normalize(posix.join(basis, r.afbeelding)) : undefined,
          alt: typeof r.alt === 'string' ? r.alt : undefined,
          status: typeof r.les_status === 'string' ? r.les_status : undefined,
        });
      }
    } catch { /* geen geldig koppelbestand */ }
  }
  // Afbeeldingen op basisnaam (zonder extensie), voor de terugval "zelfde naam als het hoofdstuk"
  const opNaam = new Map<string, string>();
  for (const a of z.img) opNaam.set(posix.basename(a).replace(/\.[^.]+$/, ''), a);

  return z.md.filter((b) => b.pad.endsWith('.md')).map((b) => {
    const tekst = koppelAfbeeldingen(b.tekst, b.pad, afbeeldingen, prefix);
    const k = koppeling.get(b.pad);
    let kop: string | undefined;
    if (!tekst.includes('/api/academie-media/')) {
      const afb = k?.afbeelding && afbeeldingen.has(k.afbeelding) ? k.afbeelding : opNaam.get(posix.basename(b.pad).replace(/\.md$/, ''));
      if (afb) kop = `![${(k?.alt || '').replace(/[\[\]]/g, '')}](${mediaUrl(afb)})`;
    }
    return { pad: b.pad, tekst, kop, notitie: k?.status };
  });
}

/**
 * Zet afbeeldingsverwijzingen in Markdown (en <img>-tags) om naar adressen op onze server.
 * Paden zijn relatief aan de map van het .md-bestand in de zip; alleen afbeeldingen die in de zip zaten tellen.
 */
function koppelAfbeeldingen(md: string, mdPad: string, afbeeldingen: Set<string>, prefix: string): string {
  const map = posix.dirname(mdPad);
  const url = (ref: string): string | null => {
    const schoon = decodeURIComponent(ref.trim().replace(/^<|>$/g, '')).replace(/^\.\//, '');
    if (/^(https?:|data:|\/)/i.test(schoon)) return null;
    const pad = posix.normalize(posix.join(map, schoon));
    const gevonden = afbeeldingen.has(pad) ? pad : [...afbeeldingen].find((a) => a.endsWith('/' + schoon) || a === schoon);
    return gevonden ? `/api/academie-media/${prefix}/${gevonden.split('/').map(encodeURIComponent).join('/')}` : null;
  };
  return md
    // <img src="…" alt="…"> → Markdown-afbeelding (de weergave voert geen HTML uit)
    .replace(/<img\b[^>]*?src=["']([^"']+)["'][^>]*>/gi, (heel, src) => {
      const alt = heel.match(/alt=["']([^"']*)["']/i)?.[1] || '';
      const u = url(src);
      return u ? `![${alt}](${u})` : heel;
    })
    .replace(/!\[([^\]]*)\]\((<[^>]+>|[^)\s]+)(\s+"[^"]*")?\)/g, (heel, alt, ref) => {
      const u = url(ref);
      return u ? `![${alt}](${u})` : heel;
    });
}

// Maakt een zip van de meegegeven bestanden (JSON via stdin) en schrijft die naar stdout
const ZIP_MAKER = `
import io, json, sys, zipfile
bestanden = json.load(sys.stdin)
buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
    for b in bestanden:
        z.writestr(b['naam'], b['tekst'])
sys.stdout.buffer.write(buf.getvalue())
`;

/** Bestandsnaam voor een hoofdstuk, zelfde patroon als in de oorspronkelijke zip: 06-03-amethist.md */
const bestandsnaam = (cursusNr: number, nr: number, slug: string) =>
  `${String(cursusNr).padStart(2, '0')}-${String(nr).padStart(2, '0')}-${slug}.md`;

/** Hoofdstuk als los Markdown-bestand, met de titel bovenaan zodat die mee terug kan komen. */
const alsBestand = (nr: number, titel: string, inhoud: string) => `# Hoofdstuk ${nr} — ${titel}\n\n${inhoud}\n`;

/** Haalt de kop (titel + gegevens) en de navigatie onderaan uit een hoofdstuk. */
function kaleInhoud(md: string): { titel: string; inhoud: string } {
  const titel = (md.match(/^#\s+(?:Hoofdstuk\s+\d+\s+[—-]\s+)?(.+)$/m)?.[1] || '').trim();
  let inhoud = md.replace(/^\uFEFF/, '');
  const start = inhoud.search(/^##\s/m);
  if (start >= 0) {
    // Kop vóór het eerste ##-kopje: titelregel en **Cursus:**/**Duur:**-gegevens eruit,
    // maar wat er verder staat (bv. een hoofdstukafbeelding of inleiding) blijft behouden
    const kop = inhoud.slice(0, start).split('\n')
      .filter((r) => !/^#\s/.test(r) && !/^\*\*[^*]+:\*\*/.test(r.trim()) && r.trim() !== '');
    inhoud = (kop.length ? kop.join('\n\n') + '\n\n' : '') + inhoud.slice(start);
  } else inhoud = inhoud.replace(/^#\s+.+\n?/, '');
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

  // Adviesvelden (beoordeling per cursus en per hoofdstuk), later toegevoegd
  for (const [tabel, kolom] of [['academie_cursussen', 'advies'], ['academie_hoofdstukken', 'advies']]) {
    const kolommen = db.prepare(`PRAGMA table_info(${tabel})`).all() as { name: string }[];
    if (!kolommen.some((k) => k.name === kolom)) db.exec(`ALTER TABLE ${tabel} ADD COLUMN ${kolom} TEXT NOT NULL DEFAULT ''`);
  }

  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };
  const cursusVan = db.prepare<[string], CursusRij>('SELECT * FROM academie_cursussen WHERE slug = ?');
  const hoofdstukVan = db.prepare<[number], HoofdstukRij>('SELECT * FROM academie_hoofdstukken WHERE id = ?');

  // ── Import uit een geüploade zip ──
  // Nieuwe cursussen/hoofdstukken worden toegevoegd. Bestaande hoofdstukken die nog NIET bewerkt zijn, krijgen de
  // nieuwe versie (bv. met afbeeldingen); bij al bewerkte hoofdstukken wordt alleen het "origineel" bijgewerkt.
  const mediaRoot = join(root, 'data', 'academie-media');
  app.post('/api/admin/academie/importeer/:uploadId', alleenAdmin, async (req, res) => {
    const upload = db.prepare<[number], { id: number; bestand: string }>('SELECT id, bestand FROM cursus_uploads WHERE id = ?')
      .get(Number(req.params.uploadId));
    if (!upload) { res.status(404).json({ error: 'Upload niet gevonden' }); return; }
    const prefix = `u${upload.id}`;
    let zipInhoud: ZipInhoud;
    try {
      zipInhoud = await leesZip(join(root, 'data', 'uploads', 'cursussen', upload.bestand), join(mediaRoot, prefix));
    } catch {
      res.status(400).json({ error: 'Zip kon niet gelezen worden' }); return;
    }
    const afbeeldingen = new Set(zipInhoud.img);
    const bestanden = bereidVoor(zipInhoud, prefix);
    const bewerktOvergeslagen: string[] = [];

    // Cursustitels uit het startbestand ("## 01. Mediumschap & …"), anders uit "**Cursus:**" in een hoofdstuk
    const titels = new Map<number, string>();
    const start = bestanden.find((b) => /START/i.test(b.pad.split('/').pop() || ''));
    for (const m of (start?.tekst || '').matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)) titels.set(Number(m[1]), m[2].trim());

    let nieuweCursussen = 0, nieuweHoofdstukken = 0, overgeslagen = 0, bijgewerkt = 0;
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
        const bestaat = db.prepare<[number, number], HoofdstukRij>('SELECT * FROM academie_hoofdstukken WHERE cursus_id = ? AND nr = ?').get(cursus.id, nr);
        const kaal = kaleInhoud(b.tekst);
        const titel = kaal.titel;
        const inhoud = b.kop ? `${b.kop}\n\n${kaal.inhoud}` : kaal.inhoud;
        // Lesstatus uit het koppelbestand als notitie, alleen als er nog geen notitie staat
        if (b.notitie) db.prepare(`UPDATE academie_hoofdstukken SET notitie = ? WHERE cursus_id = ? AND nr = ? AND notitie = ''`).run(b.notitie.slice(0, 2000), cursus.id, nr);
        if (bestaat) {
          if (inhoud === bestaat.origineel) { overgeslagen++; continue; }
          if (bestaat.inhoud === bestaat.origineel) {
            // Nog niet bewerkt: nieuwe versie overnemen (vorige als versie bewaren)
            db.prepare('INSERT INTO academie_versies (hoofdstuk_id, titel, inhoud, door, reden) VALUES (?, ?, ?, ?, ?)')
              .run(bestaat.id, bestaat.titel, bestaat.inhoud, req.lid!.email, 'vervangen door nieuwe import');
            db.prepare(`UPDATE academie_hoofdstukken SET inhoud = ?, origineel = ?, titel = ?, bijgewerkt = datetime('now'), bijgewerkt_door = ? WHERE id = ?`)
              .run(inhoud, inhoud, titel || bestaat.titel, req.lid!.email, bestaat.id);
            bijgewerkt++;
          } else {
            // Al bewerkt: niets overschrijven, alleen het origineel bijwerken zodat het met één knop over te nemen is
            db.prepare('UPDATE academie_hoofdstukken SET origineel = ? WHERE id = ?').run(inhoud, bestaat.id);
            bewerktOvergeslagen.push(`${cursusNr}.${nr} ${bestaat.titel}`);
          }
          continue;
        }
        db.prepare(`INSERT INTO academie_hoofdstukken (cursus_id, nr, slug, titel, inhoud, origineel, bijgewerkt_door, notitie)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(cursus.id, nr, hm[3], titel || hm[3].replace(/-/g, ' '), inhoud, inhoud, 'import', (b.notitie || '').slice(0, 2000));
        nieuweHoofdstukken++;
      }
      db.prepare(`UPDATE cursus_uploads SET status = CASE WHEN status = 'nieuw' THEN 'in_behandeling' ELSE status END WHERE id = ?`).run(upload.id);
    });
    voegToe();
    res.json({ nieuweCursussen, nieuweHoofdstukken, bijgewerkt, overgeslagen, bewerktOvergeslagen, afbeeldingen: afbeeldingen.size });
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
      (inhoud != origineel) AS gewijzigd, length(inhoud) AS lengte, (advies != '') AS heeft_advies FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr`).all(c.id);
    res.json({ ...c, hoofdstukken });
  });

  app.patch('/api/admin/academie/:slug', alleenAdmin, (req, res) => {
    const c = cursusVan.get(String(req.params.slug));
    if (!c) { res.status(404).json({ error: 'Cursus niet gevonden' }); return; }
    const titel = typeof req.body?.titel === 'string' && req.body.titel.trim() ? req.body.titel.trim().slice(0, 150) : c.titel;
    const beschrijving = typeof req.body?.beschrijving === 'string' ? req.body.beschrijving.slice(0, 2000) : c.beschrijving;
    const status = C_STATUS.includes(req.body?.status) ? req.body.status : c.status;
    const advies = typeof req.body?.advies === 'string' ? req.body.advies.slice(0, 20000) : (c as CursusRij & { advies: string }).advies;
    db.prepare(`UPDATE academie_cursussen SET titel = ?, beschrijving = ?, status = ?, advies = ?, bijgewerkt = datetime('now') WHERE id = ?`)
      .run(titel, beschrijving, status, advies, c.id);
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
    const advies = typeof req.body?.advies === 'string' ? req.body.advies.slice(0, 10000) : (h as HoofdstukRij & { advies: string }).advies;
    db.transaction(() => {
      // Vorige versie bewaren als de tekst of titel verandert (zo is alles terug te zetten)
      if (inhoud !== h.inhoud || titel !== h.titel) {
        db.prepare('INSERT INTO academie_versies (hoofdstuk_id, titel, inhoud, door, reden) VALUES (?, ?, ?, ?, ?)')
          .run(h.id, h.titel, h.inhoud, req.lid!.email, String(req.body?.reden || 'opgeslagen').slice(0, 100));
      }
      db.prepare(`UPDATE academie_hoofdstukken SET titel = ?, inhoud = ?, status = ?, notitie = ?, advies = ?, bijgewerkt = datetime('now'), bijgewerkt_door = ? WHERE id = ?`)
        .run(titel, inhoud, status, notitie, advies, req.lid!.email, h.id);
    })();
    res.json(hoofdstukVan.get(h.id));
  });

  app.get('/api/admin/academie/versie/:id', alleenAdmin, (req, res) => {
    const v = db.prepare('SELECT * FROM academie_versies WHERE id = ?').get(Number(req.params.id));
    if (!v) { res.status(404).json({ error: 'Versie niet gevonden' }); return; }
    res.json(v);
  });

  // ── Downloaden en nieuwe versies uploaden (per hoofdstuk .md, per cursus .zip) ──
  const tmpMap = join(root, 'data', 'uploads', 'tmp');
  mkdirSync(tmpMap, { recursive: true });
  const cursusVanId = db.prepare<[number], CursusRij>('SELECT * FROM academie_cursussen WHERE id = ?');

  /** Slaat nieuwe inhoud op als die anders is, met versie; geeft true terug als er iets veranderde. */
  function nieuweVersie(h: HoofdstukRij, md: string, door: string, reden: string): boolean {
    const { titel: nieuweTitel, inhoud } = kaleInhoud(md.replace(/\r\n/g, '\n'));
    const titel = nieuweTitel || h.titel;
    if (!inhoud.trim() || (inhoud === h.inhoud && titel === h.titel)) return false;
    db.prepare('INSERT INTO academie_versies (hoofdstuk_id, titel, inhoud, door, reden) VALUES (?, ?, ?, ?, ?)')
      .run(h.id, h.titel, h.inhoud, door, reden);
    db.prepare(`UPDATE academie_hoofdstukken SET titel = ?, inhoud = ?,
      status = CASE WHEN status = 'te_beoordelen' THEN 'aangepast' ELSE status END,
      bijgewerkt = datetime('now'), bijgewerkt_door = ? WHERE id = ?`).run(titel, inhoud.slice(0, 100000), door, h.id);
    return true;
  }

  app.get('/api/admin/academie/hoofdstuk/:id/download', alleenAdmin, (req, res) => {
    const h = hoofdstukVan.get(Number(req.params.id));
    if (!h) { res.status(404).json({ error: 'Hoofdstuk niet gevonden' }); return; }
    const c = cursusVanId.get(h.cursus_id)!;
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${bestandsnaam(c.nr, h.nr, h.slug)}"`);
    res.send(alsBestand(h.nr, h.titel, h.inhoud));
  });

  app.post('/api/admin/academie/hoofdstuk/:id/upload', alleenAdmin, express.raw({ type: () => true, limit: '20mb' }), async (req, res) => {
    const h = hoofdstukVan.get(Number(req.params.id));
    if (!h) { res.status(404).json({ error: 'Hoofdstuk niet gevonden' }); return; }
    const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    let md = buf.toString('utf-8');
    // Ook een zip (bv. van ChatGPT): neem het .md-bestand met dit hoofdstuknummer, of het enige hoofdstukbestand
    if (buf.length >= 4 && buf.readUInt32LE(0) === 0x04034b50) {
      const c = cursusVanId.get(h.cursus_id)!;
      const tmp = join(tmpMap, `hoofdstuk-${Date.now()}.zip`);
      try {
        writeFileSync(tmp, buf);
        const z = await leesZip(tmp);
        const kandidaten = z.md.filter((b) => b.pad.endsWith('.md') && !/(^|\/)0\d-[A-Z]/.test(b.pad));
        const juist = kandidaten.find((b) => (b.pad.split('/').pop() || '').startsWith(`${String(c.nr).padStart(2, '0')}-${String(h.nr).padStart(2, '0')}-`));
        md = (juist || (kandidaten.length === 1 ? kandidaten[0] : undefined))?.tekst || '';
        if (!md) { res.status(400).json({ error: `Geen hoofdstukbestand gevonden in de zip (verwacht: ${bestandsnaam(c.nr, h.nr, h.slug)})` }); return; }
      } catch {
        res.status(400).json({ error: 'Zip kon niet gelezen worden' }); return;
      } finally {
        try { unlinkSync(tmp); } catch { /* weg */ }
      }
    }
    if (!md.trim()) { res.status(400).json({ error: 'Leeg bestand' }); return; }
    const gewijzigd = db.transaction(() => nieuweVersie(h, md, req.lid!.email, 'nieuwe versie geüpload'))();
    res.json({ gewijzigd, hoofdstuk: hoofdstukVan.get(h.id) });
  });

  app.get('/api/admin/academie/:slug/download', alleenAdmin, (req, res) => {
    const c = cursusVan.get(String(req.params.slug));
    if (!c) { res.status(404).json({ error: 'Cursus niet gevonden' }); return; }
    const hoofdstukken = db.prepare<[number], HoofdstukRij>('SELECT * FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr').all(c.id);
    const bestanden = hoofdstukken.map((h) => ({ naam: `${c.slug}/${bestandsnaam(c.nr, h.nr, h.slug)}`, tekst: alsBestand(h.nr, h.titel, h.inhoud) }));
    const zip = execFileSync('python3', ['-c', ZIP_MAKER], { input: JSON.stringify(bestanden), maxBuffer: 100 * 1024 * 1024 });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${c.slug}.zip"`);
    res.send(zip);
  });

  // Zip met .md-bestanden; hoofdstukken worden herkend aan het nummer in de bestandsnaam (NN-MM-… of MM-…)
  app.post('/api/admin/academie/:slug/upload', alleenAdmin, async (req, res) => {
    const c = cursusVan.get(String(req.params.slug));
    if (!c) { res.status(404).json({ error: 'Cursus niet gevonden' }); return; }
    const tmp = join(tmpMap, `cursus-${Date.now()}.zip`);
    const prefix = `c${c.id}-${Date.now()}`;
    let bestanden: { pad: string; tekst: string }[];
    try {
      const n = await ontvangNaarBestand(req, tmp, 1024 * 1024 * 1024);
      if (n < 22 || !isZip(tmp)) { res.status(400).json({ error: 'Dit is geen zip-bestand' }); try { unlinkSync(tmp); } catch { /* weg */ } return; }
      const z = await leesZip(tmp, join(mediaRoot, prefix));
      bestanden = bereidVoor(z, prefix).map((b) => ({ pad: b.pad, tekst: b.kop ? b.tekst.replace(/^(#\s.*\n(?:\s*\n|\*\*.*\n)*)/, `$1\n${b.kop}\n\n`) : b.tekst }));
    } catch {
      res.status(400).json({ error: 'Zip kon niet gelezen worden' }); return;
    } finally {
      try { unlinkSync(tmp); } catch { /* al weg */ }
    }
    const perNr = new Map(db.prepare<[number], HoofdstukRij>('SELECT * FROM academie_hoofdstukken WHERE cursus_id = ?').all(c.id).map((h) => [h.nr, h]));
    const resultaat = { gewijzigd: [] as string[], ongewijzigd: 0, onbekend: [] as string[] };
    db.transaction(() => {
      for (const b of bestanden) {
        const naam = b.pad.split('/').pop() || '';
        const m = naam.match(/^(\d+)-(\d+)-/) || naam.match(/^(\d+)-/);
        const nr = m ? Number(m[2] ?? m[1]) : NaN;
        if (m && m[2] !== undefined && Number(m[1]) !== c.nr) { resultaat.onbekend.push(`${naam} (hoort bij cursus ${Number(m[1])})`); continue; }
        const h = perNr.get(nr);
        if (!h) { resultaat.onbekend.push(naam); continue; }
        if (nieuweVersie(h, b.tekst, req.lid!.email, 'nieuwe versie geüpload (cursus-zip)')) resultaat.gewijzigd.push(`${h.nr}. ${h.titel}`);
        else resultaat.ongewijzigd++;
      }
    })();
    res.json(resultaat);
  });

  // ── Sjabloon voor ChatGPT: uitleg + voorbeeldcursus, aangevuld met de bestaande cursussen en een vrij nummer ──
  app.get('/api/admin/academie-sjabloon', alleenAdmin, (_req, res) => {
    const bron = join(root, 'sjablonen', 'academie-cursus');
    const bestaand = db.prepare<[], { nr: number; titel: string }>('SELECT nr, titel FROM academie_cursussen ORDER BY nr').all();
    const vrij = Math.max(0, ...bestaand.map((c) => c.nr)) + 1;
    const twee = (n: number) => String(n).padStart(2, '0');
    const vervang = (t: string) => t
      .replace(/\{\{NR\}\}/g, twee(vrij)).replace(/\{\{NR2\}\}/g, twee(vrij + 1))
      .replace(/\{\{BESTAAND\}\}/g, bestaand.length ? bestaand.map((c) => `- ${twee(c.nr)}. ${c.titel}`).join('\n') : '- (nog geen)');
    const bestanden: { naam: string; tekst: string }[] = [];
    const lees = (map: string, rel: string) => {
      for (const naam of readdirSync(map).sort()) {
        const pad = join(map, naam);
        if (statSync(pad).isDirectory()) lees(pad, `${rel}${naam}/`);
        else bestanden.push({ naam: `Academie_sjabloon/${rel}${naam}`, tekst: vervang(readFileSync(pad, 'utf-8')) });
      }
    };
    lees(bron, '');
    const zip = execFileSync('python3', ['-c', ZIP_MAKER], { input: JSON.stringify(bestanden), maxBuffer: 20 * 1024 * 1024 });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="academie-sjabloon-voor-chatgpt.zip"');
    res.send(zip);
  });

  // ── Afbeeldingen van de Academie (voorlopig alleen voor beheerders) ──
  app.get(/^\/api\/academie-media\/(.+)$/, alleenAdmin, (req, res) => {
    const rel = decodeURIComponent((req.params as unknown as string[])[0] || '');
    if (rel.includes('..') || rel.startsWith('/')) { res.status(400).end(); return; }
    if (/\.svg$/i.test(rel)) res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.sendFile(rel, { root: mediaRoot, dotfiles: 'deny' }, (err) => { if (err && !res.headersSent) res.status(404).end(); });
  });

  // ── Pakket voor ChatGPT: opdracht + technische eisen + advies + huidige hoofdstukken (één cursus) ──
  app.get('/api/admin/academie/:slug/chatgpt-pakket', alleenAdmin, (req, res) => {
    const c = cursusVan.get(String(req.params.slug)) as (CursusRij & { advies: string }) | undefined;
    if (!c) { res.status(404).json({ error: 'Cursus niet gevonden' }); return; }
    const hoofdstukken = db.prepare<[number], HoofdstukRij & { advies: string }>('SELECT * FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr').all(c.id);
    const map = join(root, 'sjablonen', 'academie-herwerken');
    const advies = [
      `# Beoordeling en advies — Cursus ${c.nr}: ${c.titel}`,
      '',
      'Dit advies hoort bij de opdracht in 00-OPDRACHT.md. Gebruik het als startpunt voor je analyse; het vervangt je eigen kritische analyse niet.',
      'Schrijf alles in makkelijke taal en maak het makkelijk te onthouden, zoals beschreven in 02-TAAL-EN-ONTHOUDEN.md.',
      '',
      '## De cursus als geheel',
      '',
      c.advies || '(nog geen cursusadvies)',
      '',
      '## Per hoofdstuk',
      '',
      ...hoofdstukken.flatMap((h) => [`### ${bestandsnaam(c.nr, h.nr, h.slug)} — ${h.titel}`, '', h.advies || '(nog geen advies)', '']),
    ].join('\n');
    const bestanden = [
      { naam: '00-OPDRACHT.md', tekst: readFileSync(join(map, '00-OPDRACHT.md'), 'utf-8') },
      { naam: '01-TECHNISCHE-EISEN.md', tekst: readFileSync(join(map, '01-TECHNISCHE-EISEN.md'), 'utf-8') },
      { naam: '02-TAAL-EN-ONTHOUDEN.md', tekst: readFileSync(join(map, '02-TAAL-EN-ONTHOUDEN.md'), 'utf-8') },
      { naam: '03-ADVIES-PER-HOOFDSTUK.md', tekst: advies },
      ...hoofdstukken.map((h) => ({ naam: `${c.slug}/${bestandsnaam(c.nr, h.nr, h.slug)}`, tekst: alsBestand(h.nr, h.titel, h.inhoud) })),
    ];
    const zip = execFileSync('python3', ['-c', ZIP_MAKER], { input: JSON.stringify(bestanden), maxBuffer: 50 * 1024 * 1024 });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="chatgpt-pakket-${c.slug}.zip"`);
    res.send(zip);
  });

  // ── Pakket voor ChatGPT voor één hoofdstuk: zelfde opdracht/eisen, advies van dit hoofdstuk + context van de cursus ──
  app.get('/api/admin/academie/hoofdstuk/:id/chatgpt-pakket', alleenAdmin, (req, res) => {
    const h = hoofdstukVan.get(Number(req.params.id)) as (HoofdstukRij & { advies: string }) | undefined;
    if (!h) { res.status(404).json({ error: 'Hoofdstuk niet gevonden' }); return; }
    const c = cursusVanId.get(h.cursus_id) as CursusRij & { advies: string };
    const alle = db.prepare<[number], { nr: number; titel: string }>('SELECT nr, titel FROM academie_hoofdstukken WHERE cursus_id = ? ORDER BY nr').all(c.id);
    const map = join(root, 'sjablonen', 'academie-herwerken');
    const naam = bestandsnaam(c.nr, h.nr, h.slug);
    const leesEerst = [
      `# Lees eerst: dit pakket bevat één hoofdstuk`,
      '',
      `Dit pakket bevat **alleen hoofdstuk ${h.nr} — ${h.titel}** van de cursus **${c.nr}. ${c.titel}**.`,
      '',
      'Voer de opdracht uit 00-OPDRACHT.md uit voor **alleen dit hoofdstuk**. Waar de opdracht over "de volledige cursus" spreekt, geldt dat hier voor dit ene hoofdstuk. De andere hoofdstukken van de cursus staan hieronder, zodat je weet wat elders al behandeld wordt en herhaling kunt voorkomen.',
      '',
      `**Lever één bestand op met precies dezelfde naam: \`${naam}\`** (los, of in een zip). Een korte rapportage mag erbij.`,
      '',
      '## Alle hoofdstukken van deze cursus',
      '',
      ...alle.map((x) => `- ${x.nr}. ${x.titel}${x.nr === h.nr ? '  ← dit hoofdstuk' : ''}`),
    ].join('\n');
    const advies = [
      `# Advies — Hoofdstuk ${h.nr}: ${h.titel}`,
      '',
      'Schrijf alles in makkelijke taal en maak het makkelijk te onthouden, zoals beschreven in 02-TAAL-EN-ONTHOUDEN.md.',
      '',
      '## Advies voor dit hoofdstuk',
      '',
      h.advies || '(nog geen advies)',
      '',
      `## Achtergrond: advies voor de hele cursus "${c.titel}"`,
      '',
      c.advies || '(nog geen cursusadvies)',
    ].join('\n');
    const bestanden = [
      { naam: '00-LEES-EERST.md', tekst: leesEerst },
      { naam: '00-OPDRACHT.md', tekst: readFileSync(join(map, '00-OPDRACHT.md'), 'utf-8') },
      { naam: '01-TECHNISCHE-EISEN.md', tekst: readFileSync(join(map, '01-TECHNISCHE-EISEN.md'), 'utf-8') },
      { naam: '02-TAAL-EN-ONTHOUDEN.md', tekst: readFileSync(join(map, '02-TAAL-EN-ONTHOUDEN.md'), 'utf-8') },
      { naam: '03-ADVIES-DIT-HOOFDSTUK.md', tekst: advies },
      { naam: naam, tekst: alsBestand(h.nr, h.titel, h.inhoud) },
    ];
    const zip = execFileSync('python3', ['-c', ZIP_MAKER], { input: JSON.stringify(bestanden), maxBuffer: 20 * 1024 * 1024 });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="chatgpt-pakket-${naam.replace(/\.md$/, '')}.zip"`);
    res.send(zip);
  });
}
