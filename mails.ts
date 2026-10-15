// ─── Vaste mails (sjablonen) die beheerders zelf aanpassen: /admin/mails ────────────────────
// Elke vaste mail heeft een sleutel (welkom, wachtwoord_herstel, …), een onderwerp, een titel, tekst in alinea's
// (lege regel = nieuwe alinea), een optionele knop en een aan/uit-schakelaar. Invulvelden: {naam} {email} {link} {leeromgeving}.
// Versturen loopt via mail.ts; zolang mail niet is ingesteld wordt er niets verstuurd. Zie README, kopje "Vaste mails".
import express from 'express';
import Database from 'better-sqlite3';
import { join } from 'path';
import { mailHtml, mailIngesteld, verstuurMail } from './mail.js';

export interface Sjabloon { onderwerp: string; titel: string; tekst: string; knop_tekst: string; knop_url: string; aan: boolean }
interface Standaard extends Sjabloon { naam: string; uitleg: string; kanUit: boolean; velden: string[] }

const LEREN_URL = () => (process.env.LEREN_URL || 'https://leren.zen-flow.nl').replace(/\/$/, '');

/** Standaardteksten (B1). Een beheerder kan ze aanpassen; leeg terugzetten = weer de standaardtekst. */
export const STANDAARD_MAILS: Record<string, Standaard> = {
  welkom: {
    naam: 'Welkomstmail', uitleg: 'Gaat direct na het aanmaken van een account naar het nieuwe lid (ook bij aanmelden via zen-flow.nl).',
    kanUit: true, aan: false, velden: ['naam', 'email', 'leeromgeving'],
    onderwerp: 'Welkom bij Zen Flow, {naam}',
    titel: 'Welkom bij Zen Flow',
    tekst: 'Hoi {naam},\n\nFijn dat je er bent. Je account is klaar en je kunt meteen beginnen in je eigen leeromgeving.\n\nJe kiest zelf waar je begint: bij de kaarten, bij getallen, bij de pendel of bij rust en meditatie. Je werkt in je eigen tempo en je voortgang wordt bewaard.\n\nHeb je een vraag? Beantwoord dan gewoon deze mail.\n\nHartelijke groet,\nZen Flow',
    knop_tekst: 'Naar mijn leeromgeving', knop_url: '{leeromgeving}',
  },
  wachtwoord_herstel: {
    naam: 'Wachtwoord vergeten', uitleg: 'Gaat naar een lid dat op "Wachtwoord vergeten?" klikt. Deze mail kan niet uit; de knop gaat altijd naar de herstellink.',
    kanUit: false, aan: true, velden: ['naam', 'email', 'link'],
    onderwerp: 'Kies een nieuw wachtwoord voor Zen Flow',
    titel: 'Kies een nieuw wachtwoord',
    tekst: 'Hoi {naam},\n\nJe hebt gevraagd om een nieuw wachtwoord voor je Zen Flow-account. Klik op de knop om een nieuw wachtwoord te kiezen.\n\nDe link werkt één uur en maar één keer.\n\nHeb je dit niet zelf gevraagd? Dan hoef je niets te doen. Je wachtwoord blijft hetzelfde.',
    knop_tekst: 'Nieuw wachtwoord kiezen', knop_url: '{link}',
  },
};

let db: Database.Database | null = null;
function open(root: string) {
  if (!db) {
    db = new Database(join(root, 'data', 'leren.db'));
    db.exec(`CREATE TABLE IF NOT EXISTS mail_sjablonen (
      sleutel TEXT PRIMARY KEY, onderwerp TEXT NOT NULL, titel TEXT NOT NULL, tekst TEXT NOT NULL,
      knop_tekst TEXT NOT NULL DEFAULT '', knop_url TEXT NOT NULL DEFAULT '', aan INTEGER NOT NULL,
      bijgewerkt TEXT NOT NULL DEFAULT (datetime('now')), door TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS mail_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tijd TEXT NOT NULL DEFAULT (datetime('now')),
      aan TEXT NOT NULL, soort TEXT NOT NULL, onderwerp TEXT NOT NULL, status TEXT NOT NULL, fout TEXT NOT NULL DEFAULT ''
    )`);
  }
  return db;
}

type Rij = Omit<Sjabloon, 'aan'> & { aan: number; bijgewerkt: string; door: string };
function leesSjabloon(root: string, sleutel: string): (Sjabloon & { aangepast: boolean; bijgewerkt: string | null; door: string | null }) | null {
  const s = STANDAARD_MAILS[sleutel]; if (!s) return null;
  const r = open(root).prepare<[string], Rij>('SELECT * FROM mail_sjablonen WHERE sleutel = ?').get(sleutel);
  if (!r) return { onderwerp: s.onderwerp, titel: s.titel, tekst: s.tekst, knop_tekst: s.knop_tekst, knop_url: s.knop_url, aan: s.aan, aangepast: false, bijgewerkt: null, door: null };
  return { onderwerp: r.onderwerp, titel: r.titel, tekst: r.tekst, knop_tekst: r.knop_tekst, knop_url: s.kanUit ? r.knop_url : s.knop_url,
    aan: s.kanUit ? r.aan === 1 : true, aangepast: true, bijgewerkt: r.bijgewerkt, door: r.door };
}

const vul = (t: string, w: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => (k in w ? w[k] : m));

/** Maakt de mail op met ingevulde velden (ook gebruikt voor het voorbeeld in het beheer). */
export function maakMail(sj: Sjabloon, waarden: Record<string, string>) {
  const w = { leeromgeving: `${LEREN_URL()}/`, ...waarden };
  const alineas = vul(sj.tekst, w).split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);
  const knop = sj.knop_tekst.trim() && sj.knop_url.trim() ? { tekst: vul(sj.knop_tekst, w), url: vul(sj.knop_url, w) } : undefined;
  const onderwerp = vul(sj.onderwerp, w), titel = vul(sj.titel, w);
  return { onderwerp, html: mailHtml(titel, alineas, knop), tekst: `${alineas.join('\n\n')}${knop ? `\n\n${knop.tekst}: ${knop.url}` : ''}` };
}

/** Verstuurt een vaste mail. Doet niets (geeft false) als de mail uit staat of mail niet is ingesteld. */
export async function stuurVasteMail(root: string, sleutel: string, aan: string, waarden: Record<string, string>): Promise<boolean> {
  const sj = leesSjabloon(root, sleutel);
  if (!sj || !sj.aan || !mailIngesteld()) return false;
  const m = maakMail(sj, { email: aan, ...waarden });
  await verstuurMail(root, { aan, soort: sleutel, ...m });
  return true;
}

const VOORBEELD = { naam: 'Sanne', email: 'sanne@voorbeeld.nl', link: 'https://leren.zen-flow.nl/herstel?token=voorbeeld' };

/** Na de toegangscontrole installeren: beheer van de vaste mails (alleen beheerders). */
export function installeerMailBeheer(app: express.Express, root: string) {
  const alleenAdmin: express.RequestHandler = (req, res, next) => {
    if (req.lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
    next();
  };
  const invoer = (b: Record<string, unknown>, s: Standaard): Sjabloon | string => {
    const tekst = (k: string, max: number) => (typeof b[k] === 'string' ? (b[k] as string).slice(0, max) : '');
    const sj = { onderwerp: tekst('onderwerp', 200).trim(), titel: tekst('titel', 200).trim(), tekst: tekst('tekst', 8000).trim(),
      knop_tekst: tekst('knop_tekst', 80).trim(), knop_url: s.kanUit ? tekst('knop_url', 500).trim() : s.knop_url, aan: s.kanUit ? b.aan === true : true };
    if (!sj.onderwerp || !sj.titel || !sj.tekst) return 'Onderwerp, titel en tekst zijn verplicht';
    if (sj.knop_url && !/^(https:\/\/|\{\w+\})/.test(sj.knop_url)) return 'De link van de knop moet beginnen met https:// of een invulveld zoals {leeromgeving}';
    return sj;
  };

  app.get('/api/admin/mails', alleenAdmin, (_req, res) => {
    res.json({
      ingesteld: mailIngesteld(),
      mails: Object.entries(STANDAARD_MAILS).map(([sleutel, s]) => ({
        sleutel, naam: s.naam, uitleg: s.uitleg, kanUit: s.kanUit, velden: s.velden, ...leesSjabloon(root, sleutel)!,
        standaard: { onderwerp: s.onderwerp, titel: s.titel, tekst: s.tekst, knop_tekst: s.knop_tekst, knop_url: s.knop_url },
      })),
    });
  });

  app.put('/api/admin/mails/:sleutel', alleenAdmin, (req, res) => {
    const sleutel = String(req.params.sleutel), s = STANDAARD_MAILS[sleutel];
    if (!s) { res.status(404).json({ error: 'Onbekende mail' }); return; }
    if (req.body?.standaard === true) { open(root).prepare('DELETE FROM mail_sjablonen WHERE sleutel = ?').run(sleutel); res.json({ ok: true }); return; }
    const sj = invoer(req.body || {}, s);
    if (typeof sj === 'string') { res.status(400).json({ error: sj }); return; }
    open(root).prepare(`INSERT INTO mail_sjablonen (sleutel, onderwerp, titel, tekst, knop_tekst, knop_url, aan, door) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(sleutel) DO UPDATE SET onderwerp = excluded.onderwerp, titel = excluded.titel, tekst = excluded.tekst, knop_tekst = excluded.knop_tekst,
      knop_url = excluded.knop_url, aan = excluded.aan, door = excluded.door, bijgewerkt = datetime('now')`)
      .run(sleutel, sj.onderwerp, sj.titel, sj.tekst, sj.knop_tekst, sj.knop_url, sj.aan ? 1 : 0, req.lid!.email);
    res.json({ ok: true });
  });

  // Voorbeeld van de (nog niet opgeslagen) tekst, met voorbeeldgegevens
  app.post('/api/admin/mails/:sleutel/voorbeeld', alleenAdmin, (req, res) => {
    const s = STANDAARD_MAILS[String(req.params.sleutel)];
    if (!s) { res.status(404).json({ error: 'Onbekende mail' }); return; }
    const sj = invoer(req.body || {}, s);
    if (typeof sj === 'string') { res.status(400).json({ error: sj }); return; }
    res.json(maakMail(sj, VOORBEELD));
  });

  // Testmail van de opgeslagen versie naar de beheerder zelf (ook als de mail uit staat)
  app.post('/api/admin/mails/:sleutel/test', alleenAdmin, async (req, res) => {
    const sleutel = String(req.params.sleutel), sj = leesSjabloon(root, sleutel);
    if (!sj) { res.status(404).json({ error: 'Onbekende mail' }); return; }
    if (!mailIngesteld()) { res.status(503).json({ error: 'Mail is nog niet ingesteld. Een testmail kan pas na de koppeling met Office 365.' }); return; }
    try {
      const m = maakMail(sj, { ...VOORBEELD, naam: req.lid!.naam, email: req.lid!.email });
      await verstuurMail(root, { aan: req.lid!.email, soort: `test:${sleutel}`, ...m, onderwerp: `[TEST] ${m.onderwerp}` });
      res.json({ ok: true, aan: req.lid!.email });
    } catch (e) { res.status(502).json({ error: `Versturen mislukt: ${(e as Error).message}` }); }
  });

  app.get('/api/admin/mails/log', alleenAdmin, (_req, res) => {
    res.json(open(root).prepare(`SELECT tijd, aan, soort, onderwerp, status, fout FROM mail_log ORDER BY id DESC LIMIT 100`).all());
  });
}
