// ─── Cursus-uploads (alleen beheerders) ───────────────────────────────
// Een beheerder uploadt een zip met cursusmateriaal; die wordt in data/uploads/cursussen/ bewaard.
// Daarna wordt de inhoud (handmatig/met Claude) omgezet naar een cursus en via de status goedgekeurd.
// Statussen: nieuw → in_behandeling → concept → goedgekeurd | afgewezen
import type express from 'express';
import Database from 'better-sqlite3';
import { createWriteStream, mkdirSync, renameSync, unlinkSync, openSync, readSync, closeSync, existsSync } from 'fs';
import { join } from 'path';

const MAX_BYTES = 300 * 1024 * 1024;
const STATUSSEN = ['nieuw', 'in_behandeling', 'concept', 'goedgekeurd', 'afgewezen'] as const;
type Status = typeof STATUSSEN[number];

interface UploadRij {
  id: number; bestand: string; origineel: string; grootte: number;
  geupload_door: string; datum: string; status: Status; notitie: string;
}

export function installeerCursusUploads(app: express.Express, root: string) {
  const map = join(root, 'data', 'uploads', 'cursussen');
  mkdirSync(map, { recursive: true });
  const db = new Database(join(root, 'data', 'leren.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS cursus_uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bestand TEXT NOT NULL,
      origineel TEXT NOT NULL,
      grootte INTEGER NOT NULL,
      geupload_door TEXT NOT NULL,
      datum TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'nieuw',
      notitie TEXT NOT NULL DEFAULT ''
    );
  `);

  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };

  // Upload: de zip komt als ruwe body binnen en wordt rechtstreeks naar schijf gestreamd
  app.post('/api/admin/cursus-upload', alleenAdmin, (req, res) => {
    const origineel = String(req.query.naam || 'cursus.zip').replace(/[^\w.\- ()]/g, '_').slice(0, 150) || 'cursus.zip';
    const lengte = Number(req.headers['content-length'] || 0);
    if (lengte > MAX_BYTES) { res.status(413).json({ error: 'Bestand is groter dan 300 MB' }); return; }

    const tijdelijk = join(map, `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.tmp`);
    const uit = createWriteStream(tijdelijk);
    let ontvangen = 0;
    let afgebroken = false;
    const stop = (status: number, error: string) => {
      if (afgebroken) return;
      afgebroken = true;
      uit.destroy();
      try { unlinkSync(tijdelijk); } catch { /* al weg */ }
      if (!res.headersSent) res.status(status).json({ error });
    };

    req.on('data', (stuk: Buffer) => {
      ontvangen += stuk.length;
      if (ontvangen > MAX_BYTES) { stop(413, 'Bestand is groter dan 300 MB'); req.destroy(); }
    });
    req.on('aborted', () => stop(400, 'Upload afgebroken'));
    req.pipe(uit);

    uit.on('finish', () => {
      if (afgebroken) return;
      if (ontvangen < 22) return stop(400, 'Leeg of ongeldig bestand');
      // Controleer of het echt een zip is (begint met "PK\x03\x04")
      const kop = Buffer.alloc(4);
      const fd = openSync(tijdelijk, 'r'); readSync(fd, kop, 0, 4, 0); closeSync(fd);
      if (kop.readUInt32LE(0) !== 0x04034b50) return stop(400, 'Dit is geen zip-bestand');

      const info = db.prepare(`INSERT INTO cursus_uploads (bestand, origineel, grootte, geupload_door) VALUES ('', ?, ?, ?)`)
        .run(origineel, ontvangen, req.lid!.email);
      const id = Number(info.lastInsertRowid);
      const bestand = `${String(id).padStart(4, '0')}-${origineel.replace(/\s+/g, '_')}`;
      renameSync(tijdelijk, join(map, bestand));
      db.prepare('UPDATE cursus_uploads SET bestand = ? WHERE id = ?').run(bestand, id);
      res.json(db.prepare<[number], UploadRij>('SELECT * FROM cursus_uploads WHERE id = ?').get(id));
    });
    uit.on('error', () => stop(500, 'Opslaan mislukt'));
  });

  app.get('/api/admin/cursus-uploads', alleenAdmin, (_req, res) => {
    res.json(db.prepare<[], UploadRij>('SELECT * FROM cursus_uploads ORDER BY datum DESC, id DESC').all());
  });

  app.patch('/api/admin/cursus-uploads/:id', alleenAdmin, (req, res) => {
    const r = db.prepare<[number], UploadRij>('SELECT * FROM cursus_uploads WHERE id = ?').get(Number(req.params.id));
    if (!r) { res.status(404).json({ error: 'Upload niet gevonden' }); return; }
    const status = STATUSSEN.includes(req.body?.status) ? req.body.status : r.status;
    const notitie = typeof req.body?.notitie === 'string' ? req.body.notitie.slice(0, 2000) : r.notitie;
    db.prepare('UPDATE cursus_uploads SET status = ?, notitie = ? WHERE id = ?').run(status, notitie, r.id);
    res.json(db.prepare<[number], UploadRij>('SELECT * FROM cursus_uploads WHERE id = ?').get(r.id));
  });

  app.get('/api/admin/cursus-uploads/:id/download', alleenAdmin, (req, res) => {
    const r = db.prepare<[number], UploadRij>('SELECT * FROM cursus_uploads WHERE id = ?').get(Number(req.params.id));
    const pad = r && join(map, r.bestand);
    if (!r || !pad || !existsSync(pad)) { res.status(404).json({ error: 'Bestand niet gevonden' }); return; }
    res.download(pad, r.origineel);
  });
}
