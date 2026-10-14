// Openbare onderdelen voor de Zen Flow-voorpagina (zen-flow.nl) — zonder inloggen en ZONDER AI:
// dagkaart (eigen kaartbetekenissen), levenspadgetal (berekening + eigen teksten), maandhoroscoop
// (AstroAPI, één keer per teken per maand opgehaald en bewaard) en de disclaimerteksten.
// Daarnaast het beheer van die teksten (alleen beheerders). Zie README, kopje "Probeer het zelf".
import express from 'express';
import Database from 'better-sqlite3';
import { join } from 'path';
import { allCards } from './src/data/cards/index.js';
import { calculateNumbers } from './src/utils/numerologieCalculations.js';
import { numberDescriptions } from './src/data/numerologie/getalBeschrijvingen.js';

/** Standaardteksten; beheerders kunnen ze aanpassen op /admin/teksten (tabel `instellingen`). */
export const STANDAARD_TEKSTEN: Record<string, string> = {
  disclaimer_algemeen: 'Zen Flow is bedoeld voor inspiratie, zelfreflectie en persoonlijke groei. Kaarten, getallen en horoscopen voorspellen niets met zekerheid en vervangen geen medisch, psychologisch, juridisch of financieel advies.',
  disclaimer_ai: 'Duidingen in de leeromgeving worden met behulp van AI gemaakt op basis van onze eigen kaartbetekenissen en kunnen fouten bevatten.',
};
const VOORPAGINA = ['https://zen-flow.nl', 'https://www.zen-flow.nl'];
const TEKENS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const ARCANA: Record<string, string> = { major: 'Grote Arcana', wands: 'Staven', cups: 'Kelken', swords: 'Zwaarden', pentacles: 'Pentakels' };

function openDb(root: string) {
  const db = new Database(join(root, 'data', 'leren.db'));
  db.exec(`CREATE TABLE IF NOT EXISTS instellingen (
    sleutel TEXT PRIMARY KEY, waarde TEXT NOT NULL,
    bijgewerkt TEXT NOT NULL DEFAULT (datetime('now')), door TEXT NOT NULL DEFAULT ''
  )`);
  return db;
}

/** Vóór de toegangscontrole installeren (server.ts). */
export function installeerPubliek(app: express.Express, root: string, opties: { maandhoroscoop: (teken: string) => Promise<unknown> }) {
  const db = openDb(root);
  const tekst = (k: string) => (db.prepare<[string], { waarde: string }>('SELECT waarde FROM instellingen WHERE sleutel = ?').get(k)?.waarde) ?? STANDAARD_TEKSTEN[k];

  // Alleen de voorpagina mag deze onderdelen vanuit de browser gebruiken (alleen lezen)
  app.use('/api/publiek', (req, res, next) => {
    const origin = String(req.headers.origin || '');
    if (VOORPAGINA.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'GET'); res.status(204).end(); return; }
    }
    if (req.method !== 'GET') { res.status(405).end(); return; }
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  // Kaartafbeeldingen (zonder inloggen), voor de dagkaart op de voorpagina
  app.use('/publiek/kaarten', express.static(join(root, 'public', 'cards'), { maxAge: '30d', fallthrough: false }));

  app.get('/api/publiek/teksten', (_req, res) => {
    res.json({ disclaimer_algemeen: tekst('disclaimer_algemeen'), disclaimer_ai: tekst('disclaimer_ai') });
  });

  // Dagkaart: willekeurige tarotkaart met onze eigen betekenis (geen AI)
  app.get('/api/publiek/dagkaart', (_req, res) => {
    const k = allCards[Math.floor(Math.random() * allCards.length)];
    const omgekeerd = Math.random() < 0.3;
    res.json({
      id: k.id, naam: k.nameNL, naamEn: k.name, arcana: ARCANA[k.suit] ?? k.suit, omgekeerd,
      betekenis: omgekeerd ? k.meaningReversed : k.meaningUpright, beschrijving: k.description,
      afbeelding: `https://leren.zen-flow.nl/publiek/kaarten/${String(k.imageUrl).split('/').pop()}`,
    });
  });

  // Levenspadgetal uit de geboortedatum (berekening + eigen teksten, geen AI)
  app.get('/api/publiek/levenspad', (req, res) => {
    const datum = String(req.query.datum || '');
    const m = datum.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const d = m ? new Date(`${datum}T12:00:00Z`) : null;
    if (!m || !d || isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== datum || Number(m[1]) < 1900 || d > new Date()) {
      res.status(400).json({ error: 'Vul een geldige geboortedatum in' }); return;
    }
    const lp = calculateNumbers(datum)?.lifePath;
    if (!lp) { res.status(400).json({ error: 'Kon het levenspad niet berekenen' }); return; }
    const b = (numberDescriptions as Record<number, { title?: string; description?: string; positives?: string[]; negatives?: string[] }>)[lp.result] || {};
    res.json({ getal: lp.result, stappen: lp.steps, titel: b.title ?? null, betekenis: b.description ?? null, sterk: b.positives ?? [], aandacht: b.negatives ?? [] });
  });

  // Maandhoroscoop per sterrenbeeld (AstroAPI; max. één keer per teken per maand opgehaald)
  app.get('/api/publiek/maandhoroscoop/:teken', async (req, res) => {
    const teken = String(req.params.teken).toLowerCase();
    if (!TEKENS.includes(teken)) { res.status(400).json({ error: 'Onbekend sterrenbeeld' }); return; }
    try { res.json(await opties.maandhoroscoop(teken)); }
    catch { res.status(503).json({ error: 'De maandhoroscoop is nu even niet beschikbaar. Probeer het later opnieuw.' }); }
  });
}

/** Na de toegangscontrole installeren: teksten aanpassen (alleen beheerders). */
export function installeerTekstenBeheer(app: express.Express, root: string) {
  const db = openDb(root);
  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };
  app.get('/api/admin/teksten', alleenAdmin, (_req, res) => {
    const rijen = db.prepare<[], { sleutel: string; waarde: string; bijgewerkt: string; door: string }>('SELECT * FROM instellingen').all();
    res.json(Object.keys(STANDAARD_TEKSTEN).map((sleutel) => {
      const r = rijen.find((x) => x.sleutel === sleutel);
      return { sleutel, waarde: r?.waarde ?? STANDAARD_TEKSTEN[sleutel], standaard: STANDAARD_TEKSTEN[sleutel], aangepast: !!r, bijgewerkt: r?.bijgewerkt ?? null, door: r?.door ?? null };
    }));
  });
  app.put('/api/admin/teksten/:sleutel', alleenAdmin, (req, res) => {
    const sleutel = String(req.params.sleutel);
    if (!(sleutel in STANDAARD_TEKSTEN)) { res.status(404).json({ error: 'Onbekende tekst' }); return; }
    const waarde = typeof req.body?.waarde === 'string' ? req.body.waarde.trim().slice(0, 2000) : '';
    if (!waarde) db.prepare('DELETE FROM instellingen WHERE sleutel = ?').run(sleutel);   // leeg = standaardtekst
    else db.prepare(`INSERT INTO instellingen (sleutel, waarde, door) VALUES (?, ?, ?)
      ON CONFLICT(sleutel) DO UPDATE SET waarde = excluded.waarde, door = excluded.door, bijgewerkt = datetime('now')`).run(sleutel, waarde, req.lid!.email);
    res.json({ ok: true });
  });
}
