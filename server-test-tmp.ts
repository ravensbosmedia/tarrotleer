import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, writeFileSync, mkdirSync, renameSync } from 'fs';
import { allCards } from './src/data/cards/index.js';
import { installeerAccounts } from './accounts.js';
import { installeerCursusUploads } from './cursussen.js';
import { installeerAcademie } from './academie.js';
import { installeerPubliek, installeerTekstenBeheer } from './publiek.js';

// Laad .env als die aanwezig is (voor lokale dev en PM2 zonder ecosystem config)
try {
  const { config } = await import('dotenv');
  config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });
} catch { /* dotenv optioneel */ }

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4299;
const CACHE_DIR = join(__dirname, 'cache');

app.use(express.json());

// ─── Accounts: zonder geldige sessie alleen de inlog-/aanmeldpagina ───
app.set('trust proxy', 'loopback'); // nginx ervoor → echte IP voor de inlogrem
// Openbaar voor de voorpagina zen-flow.nl (zonder inloggen, zonder AI) — vóór de toegangscontrole
installeerPubliek(app, __dirname, { maandhoroscoop: (teken) => maandHoroscoop(teken) });
installeerAccounts(app, __dirname);
installeerTekstenBeheer(app, __dirname);
installeerCursusUploads(app, __dirname);
installeerAcademie(app, __dirname);

app.use(express.static(join(__dirname, 'dist')));

// ─── Kaarten API ─────────────────────────────────────────────────

app.get('/api/cards', (_req, res) => {
  res.json(allCards);
});

app.get('/api/cards/random', (_req, res) => {
  const card = allCards[Math.floor(Math.random() * allCards.length)];
  res.json({ ...card, isReversed: Math.random() > 0.5 });
});

app.get('/api/cards/suit/:suit', (req, res) => {
  const { suit } = req.params;
  const valid = ['major', 'wands', 'cups', 'swords', 'pentacles'];
  if (!valid.includes(suit)) {
    res.status(400).json({ error: 'Ongeldige suit. Gebruik: major, wands, cups, swords, pentacles' });
    return;
  }
  res.json(allCards.filter(c => c.suit === suit));
});

app.get('/api/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const card = allCards.find(c => c.id === id);
  if (!card) { res.status(404).json({ error: 'Kaart niet gevonden' }); return; }
  res.json(card);
});

app.post('/api/interpret', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { res.status(503).json({ error: 'OpenAI API sleutel niet geconfigureerd' }); return; }
  const { cards, question, spread } = req.body;
  if (!cards || !Array.isArray(cards)) { res.status(400).json({ error: 'Geef een array van kaarten mee' }); return; }
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });
    const cardDescriptions = cards.map((c: { nameNL: string; isReversed: boolean; position?: string }) =>
      `${c.position ? `[${c.position}] ` : ''}${c.nameNL}${c.isReversed ? ' (omgekeerd)' : ''}`
    ).join(', ');
    const prompt = `Je bent een ervarene tarotlezer. Geef een interpretatie in het Nederlands.
Legging: ${spread || 'Vrije legging'}
${question ? `Vraag: ${question}` : ''}
Kaarten: ${cardDescriptions}

Geef een persoonlijke, reflectieve interpretatie van maximaal 200 woorden. Focus op inzicht, niet op voorspelling.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 1500,
    });
    res.json({ interpretation: completion.choices[0].message.content });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Onbekende fout' });
  }
});

// Volledig tarot legging interpretatie — gebruikt door TarotAIInterpretation component
app.post('/api/tarot/interpretatie', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { res.status(503).json({ error: 'OpenAI API sleutel niet geconfigureerd' }); return; }
  const { cards, positions, vraagstelling, readingType } = req.body;
  if (!cards || !Array.isArray(cards) || !positions || !Array.isArray(positions)) {
    res.status(400).json({ error: 'Vereist: cards[] en positions[]' }); return;
  }
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const cardsInfo = cards.map((card: Record<string, string>, i: number) => ({
      name: card.nameNL,
      position: positions[i],
      meaning: card.meaningUpright,
      description: card.description,
    }));

    const systemPrompt = `Je bent een ervaren Nederlandse tarotlezer met een warme, empathische benadering.
Geef een gebalanceerde interpretatie waarbij je evenveel aandacht besteedt aan elke kaart en positie.
Gebruik concrete voorbeelden en praktische adviezen. Schrijf in vloeiend Nederlands.`;

    const interpretaties: string[] = [];

    if (readingType === 'celtic') {
      // Keltisch Kruis: twee aparte calls (kaarten 1-5 en 6-10)
      for (const [half, slice] of [
        ['eerste vijf kaarten (1-5)', cardsInfo.slice(0, 5)],
        ['laatste vijf kaarten (6-10)', cardsInfo.slice(5)],
      ] as [string, typeof cardsInfo][]) {
        const resp = await openai.chat.completions.create({
          model: 'gpt-5.5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Interpreteer de ${half} van het Keltisch Kruis:\n${JSON.stringify(slice, null, 2)}\n\n${vraagstelling ? `Vraag: ${vraagstelling}` : ''}` }
          ],
          max_completion_tokens: 3000,
        });
        interpretaties.push(resp.choices[0].message.content || '');
      }
    } else {
      const resp = await openai.chat.completions.create({
        model: 'gpt-5.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Interpreteer deze tarotlegging:\n${JSON.stringify(cardsInfo, null, 2)}\n\n${vraagstelling ? `Vraag: ${vraagstelling}` : ''}` }
        ],
        max_completion_tokens: 2500,
      });
      interpretaties.push(resp.choices[0].message.content || '');
    }

    res.json({ interpretaties });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Onbekende fout' });
  }
});

// Lenormand legging-duiding — voedt het model met ONZE kaartbetekenissen + ONZE combinaties
app.post('/api/lenormand/duiding', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { res.status(503).json({ error: 'OpenAI API sleutel niet geconfigureerd' }); return; }
  const { vraag, legging, kaarten, combinaties } = req.body;
  if (!kaarten || !Array.isArray(kaarten) || kaarten.length === 0) {
    res.status(400).json({ error: 'Geef kaarten[] mee' }); return;
  }
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const kaartLijst = (kaarten as Array<{ naam: string; positie?: string; betekenis?: string; sleutelwoorden?: string[] }>)
      .map((k, i) =>
        `${i + 1}. ${k.positie ? `[${k.positie}] ` : ''}${k.naam}` +
        `${k.sleutelwoorden?.length ? ` — sleutelwoorden: ${k.sleutelwoorden.join(', ')}` : ''}` +
        `\n   Betekenis: ${k.betekenis || ''}`
      ).join('\n');

    const comboLijst = Array.isArray(combinaties) && combinaties.length
      ? (combinaties as Array<{ links: string; rechts: string; betekenis: string }>)
          .map((c) => `- ${c.links} + ${c.rechts}: ${c.betekenis}`).join('\n')
      : '(geen specifieke combinaties beschikbaar — lees de buurkaarten intuïtief samen)';

    const systemPrompt = `Je bent een ervaren Nederlandse Lenormand-lezer met een warme, heldere stijl.
BELANGRIJK: baseer je UITSLUITEND op de meegegeven kaartbetekenissen en de meegegeven combinaties. Verzin geen andere kaartbetekenissen en haal er geen tarot-symboliek bij. Lees de kaarten als buur-duo's (de combinaties) en weef die tot één samenhangend verhaal. De middelste kaart is het hoofdthema.`;

    const userPrompt = `Legging: ${legging || 'Lenormand-lijn'}
${vraag ? `Vraag van de cliënt: ${vraag}` : 'Geen specifieke vraag — geef een algemene duiding.'}

DE KAARTEN (met ONZE betekenissen):
${kaartLijst}

DE COMBINATIES (buur-duo's uit ONZE database):
${comboLijst}

Geef een persoonlijke, reflectieve duiding in vloeiend Nederlands (max ~250 woorden). Verwijs naar de combinaties waar relevant. Focus op inzicht, niet op stellige voorspelling.`;

    const resp = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_completion_tokens: 3000,
    });
    res.json({ duiding: resp.choices[0].message.content });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Onbekende fout' });
  }
});

// Buur-duo's: waarom vullen twee kaarten elkaar aan? — gevoed met ONZE betekenissen, geen woordenteller-bias
app.post('/api/lenormand/duos', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { res.status(503).json({ error: 'OpenAI API sleutel niet geconfigureerd' }); return; }
  const { duos, vraag } = req.body;
  if (!duos || !Array.isArray(duos) || duos.length === 0) {
    res.status(400).json({ error: 'Geef duos[] mee' }); return;
  }
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const lijst = (duos as Array<{ links: { naam: string; betekenis?: string }; rechts: { naam: string; betekenis?: string } }>)
      .map((d, i) => `${i + 1}. ${d.links.naam} (${d.links.betekenis || ''}) + ${d.rechts.naam} (${d.rechts.betekenis || ''})`)
      .join('\n');

    const systemPrompt = `Je bent een ervaren Nederlandse Lenormand-lezer. Leg voor ELK kaartpaar in 1 à 2 heldere zinnen uit WAAROM de twee kaarten elkaar aanvullen — hoe ze op elkaar inwerken, elkaar versterken of nuanceren. Baseer je UITSLUITEND op de gegeven betekenissen. Maak GEEN aannames over geslacht (gebruik niet "mannelijk/vrouwelijk") tenzij een betekenis dat expliciet noemt. Antwoord als JSON: {"uitleg": ["...","..."]} met precies één string per paar, in dezelfde volgorde.`;
    const userPrompt = `${vraag ? `Context-vraag van de cliënt: ${vraag}\n\n` : ''}Paren:\n${lijst}`;

    const resp = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_completion_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    let uitleg: string[] = [];
    try {
      const parsed = JSON.parse(resp.choices[0].message.content || '{}');
      if (Array.isArray(parsed.uitleg)) uitleg = parsed.uitleg.map((x: unknown) => String(x));
    } catch { /* laat leeg bij parse-fout */ }
    res.json({ uitleg });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Onbekende fout' });
  }
});

// Tarot-gesprek over een legging — gebruikt door TarotChat (key blijft op de server)
app.post('/api/tarot/chat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { res.status(503).json({ error: 'OpenAI API sleutel niet geconfigureerd' }); return; }
  const { kaarten, vraag, geschiedenis } = req.body;
  if (!kaarten || !Array.isArray(kaarten) || typeof vraag !== 'string' || !vraag.trim()) {
    res.status(400).json({ error: 'Geef kaarten[] en een vraag mee' }); return;
  }
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const systemPrompt = `Je bent een ervaren Nederlandse tarotlezer met een warme, empathische benadering.
Geef persoonlijke, inzichtelijke antwoorden die hoop en begrip bieden.
Gebruik een vriendelijke, toegankelijke taal en spreek de persoon direct aan.
Focus op praktische adviezen en positieve groeimogelijkheden. Houd het antwoord onder de 250 woorden.

Tarotlegging: ${JSON.stringify(kaarten).slice(0, 12000)}`;

    // Laatste beurten van het gesprek meesturen zodat vervolgvragen context hebben
    const eerder = (Array.isArray(geschiedenis) ? geschiedenis : [])
      .filter((m: { role?: string; content?: unknown }) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-8)
      .map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    const resp = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [
        { role: 'system', content: systemPrompt },
        ...eerder,
        { role: 'user', content: vraag.slice(0, 2000) },
      ],
      max_completion_tokens: 2500,
    });
    res.json({ antwoord: resp.choices[0].message.content || '' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Onbekende fout' });
  }
});

// ─── Horoscoop API ────────────────────────────────────────────────

const TEKEN_NL: Record<string, string> = {
  aries:'Ram', taurus:'Stier', gemini:'Tweelingen', cancer:'Kreeft',
  leo:'Leeuw', virgo:'Maagd', libra:'Weegschaal', scorpio:'Schorpioen',
  sagittarius:'Boogschutter', capricorn:'Steenbok', aquarius:'Waterman', pisces:'Vissen',
};
const ALLE_TEKENS = Object.keys(TEKEN_NL);

const CHINEES_INFO: Record<string, { naam: string; emoji: string }> = {
  rat:{naam:'Rat',emoji:'🐀'}, ox:{naam:'Os',emoji:'🐂'}, tiger:{naam:'Tijger',emoji:'🐅'},
  rabbit:{naam:'Konijn',emoji:'🐇'}, dragon:{naam:'Draak',emoji:'🐉'}, snake:{naam:'Slang',emoji:'🐍'},
  horse:{naam:'Paard',emoji:'🐎'}, goat:{naam:'Geit',emoji:'🐐'}, monkey:{naam:'Aap',emoji:'🐒'},
  rooster:{naam:'Haan',emoji:'🐓'}, dog:{naam:'Hond',emoji:'🐕'}, pig:{naam:'Varken',emoji:'🐖'},
};
const CHINEES_VOLGORDE = ['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig'];

function chineesTekenVoorJaar(jaar: number): string {
  return CHINEES_VOLGORDE[((jaar - 2020) % 12 + 12) % 12];
}

function isoWeekKey(date: Date): { key: string; week: number; jaar: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const jaar = d.getUTCFullYear();
  return { key: `${jaar}-W${String(week).padStart(2, '0')}`, week, jaar };
}

function leesWeekCache(weekKey: string): Record<string, unknown> | null {
  const pad = join(CACHE_DIR, `weekhoroscoop-${weekKey}.json`);
  if (!existsSync(pad)) return null;
  try { return JSON.parse(readFileSync(pad, 'utf-8')); } catch { return null; }
}

app.get('/api/horoscoop/week', (_req, res) => {
  const { key } = isoWeekKey(new Date());
  const cache = leesWeekCache(key);
  if (!cache) { res.status(503).json({ error: 'Weekhoroscoop niet beschikbaar. Genereer eerst met scripts/weekhoroscoop-refresh.mjs' }); return; }
  res.json(cache);
});

app.get('/api/horoscoop/week/:teken', (req, res) => {
  const teken = req.params.teken.toLowerCase();
  if (!ALLE_TEKENS.includes(teken)) {
    res.status(400).json({ error: `Ongeldig teken. Gebruik: ${ALLE_TEKENS.join(', ')}` }); return;
  }
  const { key } = isoWeekKey(new Date());
  const cache = leesWeekCache(key) as Record<string, unknown> | null;
  if (!cache) { res.status(503).json({ error: 'Weekhoroscoop niet beschikbaar' }); return; }
  const tekens = cache.tekens as Record<string, unknown>;
  res.json({ weekKey: key, ...(tekens[teken] as object) });
});

app.get('/api/horoscoop/chinees/:jaar', (req, res) => {
  const jaar = parseInt(req.params.jaar);
  if (isNaN(jaar) || jaar < 1900 || jaar > 2100) {
    res.status(400).json({ error: 'Geef een geldig jaar op (1900–2100)' }); return;
  }
  const slug = chineesTekenVoorJaar(jaar);
  res.json({ jaar, slug, ...CHINEES_INFO[slug] });
});

function vandaagNL(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' }); // JJJJ-MM-DD
}

// ─── AstroAPI (astrology-api.io v3) — zuinig: gratis plan = 50 calls per maand ───
// Elk antwoord wordt permanent opgeslagen in cache/astroapi/ en nooit opnieuw opgehaald.
// Een maandteller (cache/astroapi/teller-JJJJ-MM.json) stopt bij ASTROAPI_MAANDLIMIET (standaard 45).
const ASTRO_DIR = join(CACHE_DIR, 'astroapi');
const ASTRO_LIMIET = parseInt(process.env.ASTROAPI_MAANDLIMIET || '45', 10);
const astroBezig = new Map<string, Promise<Record<string, unknown>>>();

function astroTeller(maand: string): number {
  const pad = join(ASTRO_DIR, `teller-${maand}.json`);
  if (!existsSync(pad)) return 0;
  try { return JSON.parse(readFileSync(pad, 'utf-8')).calls || 0; } catch { return ASTRO_LIMIET; }
}

async function astroApi(opslag: string, endpoint: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const pad = join(ASTRO_DIR, `${opslag}.json`);
  if (existsSync(pad)) return JSON.parse(readFileSync(pad, 'utf-8')).data;
  const lopend = astroBezig.get(opslag);
  if (lopend) return lopend;

  const aanvraag = (async () => {
    const apiKey = process.env.ASTROAPI_KEY;
    if (!apiKey) throw new Error('ASTROAPI_KEY niet geconfigureerd');
    const maand = vandaagNL().slice(0, 7);
    const calls = astroTeller(maand);
    if (calls >= ASTRO_LIMIET) throw new Error(`AstroAPI-maandlimiet bereikt (${calls}/${ASTRO_LIMIET})`);
    // Tellen vóór de call: ook mislukte calls kosten tegoed
    mkdirSync(ASTRO_DIR, { recursive: true });
    writeFileSync(join(ASTRO_DIR, `teller-${maand}.json`), JSON.stringify({ maand, calls: calls + 1, laatste: opslag }));
    const r = await fetch(`https://api.astrology-api.io/api/v3/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) throw new Error(`AstroAPI gaf ${r.status}`);
    const json = await r.json() as { data?: Record<string, unknown> };
    const data = json.data || {};
    writeFileSync(pad, JSON.stringify({ opgehaald: new Date().toISOString(), endpoint, body, data }));
    return data;
  })();
  astroBezig.set(opslag, aanvraag);
  try { return await aanvraag; } finally { astroBezig.delete(opslag); }
}

// ─── Beheer van de maandhoroscopen: origineel (AstroAPI) naast de makkelijke versie (B1), aanpassen of opnieuw herschrijven ───
const alleenBeheer: express.RequestHandler = (req, res, next) => {
  if ((req as express.Request & { lid?: { rol?: string } }).lid?.rol !== 'admin') { res.status(403).json({ error: 'Alleen voor beheerders' }); return; }
  next();
};
const maandBestand = (maand: string, teken: string, b1 = false) => join(ASTRO_DIR, `maand-${maand}-${teken}${b1 ? '-b1' : ''}.json`);
const geldigeMaand = (m: unknown) => (typeof m === 'string' && /^\d{4}-\d{2}$/.test(m) ? m : vandaagNL().slice(0, 7));

app.get('/api/admin/horoscoop/maand', alleenBeheer, (req, res) => {
  const maand = geldigeMaand(req.query.maand);
  res.json({ maand, tekens: ALLE_TEKENS.map((t) => {
    const b1 = existsSync(maandBestand(maand, t, true)) ? JSON.parse(readFileSync(maandBestand(maand, t, true), 'utf-8')) : null;
    return { teken: t, naam: TEKEN_NL[t], opgehaald: existsSync(maandBestand(maand, t)), makkelijk: !!b1, aangepastDoor: b1?.aangepastDoor ?? null, bijgewerkt: b1?.bijgewerkt ?? b1?.gemaakt ?? null };
  }) });
});

app.get('/api/admin/horoscoop/maand/:teken', alleenBeheer, (req, res) => {
  const teken = String(req.params.teken), maand = geldigeMaand(req.query.maand);
  if (!ALLE_TEKENS.includes(teken)) { res.status(400).json({ error: 'Onbekend teken' }); return; }
  if (!existsSync(maandBestand(maand, teken))) { res.json({ maand, teken, naam: TEKEN_NL[teken], origineel: null, makkelijk: null }); return; }
  const d = JSON.parse(readFileSync(maandBestand(maand, teken), 'utf-8')).data || {};
  const b1 = existsSync(maandBestand(maand, teken, true)) ? JSON.parse(readFileSync(maandBestand(maand, teken, true), 'utf-8')) : null;
  res.json({
    maand, teken, naam: TEKEN_NL[teken],
    origineel: { thema: d.monthly_theme ?? null, gebieden: d.life_areas ?? [], tips: d.tips ?? [], maancycli: d.lunations ?? [] },
    makkelijk: b1?.b1 ?? null, meta: b1 ? { gemaakt: b1.gemaakt, bron: b1.bron, aangepastDoor: b1.aangepastDoor ?? null, bijgewerkt: b1.bijgewerkt ?? null } : null,
  });
});

// Eigen aanpassingen opslaan: { thema, gebieden: [{area, prediction}], tips: [...], maancycli: [{date, interpretation}] }
app.put('/api/admin/horoscoop/maand/:teken', alleenBeheer, (req, res) => {
  const teken = String(req.params.teken), maand = geldigeMaand(req.query.maand);
  const pad = maandBestand(maand, teken, true);
  if (!ALLE_TEKENS.includes(teken) || !existsSync(pad)) { res.status(404).json({ error: 'Nog geen makkelijke versie voor dit teken' }); return; }
  const huidig = JSON.parse(readFileSync(pad, 'utf-8'));
  const b = req.body || {}, b1 = huidig.b1;
  const kort = (x: unknown) => (typeof x === 'string' ? x.trim().slice(0, 4000) : null);
  if (kort(b.thema)) b1.thema = kort(b.thema);
  if (Array.isArray(b.gebieden)) b1.gebieden = b1.gebieden.map((g: { area: string; prediction: string }) => {
    const n = b.gebieden.find((x: { area?: string }) => x.area === g.area); return n && kort(n.prediction) ? { ...g, prediction: kort(n.prediction) } : g;
  });
  if (Array.isArray(b.tips) && b.tips.length === b1.tips.length) b1.tips = b.tips.map((t: unknown, i: number) => kort(t) || b1.tips[i]);
  if (Array.isArray(b.maancycli)) b1.maancycli = b1.maancycli.map((c: { date: string; interpretation?: string }) => {
    const n = b.maancycli.find((x: { date?: string }) => x.date === c.date); return n && kort(n.interpretation) ? { ...c, interpretation: kort(n.interpretation) } : c;
  });
  const lid = (req as express.Request & { lid?: { email?: string } }).lid;
  if (!existsSync(pad + '.ai')) writeFileSync(pad + '.ai', JSON.stringify(huidig));   // eerste AI-versie bewaren
  writeFileSync(pad, JSON.stringify({ ...huidig, b1, aangepastDoor: lid?.email ?? null, bijgewerkt: new Date().toISOString() }));
  res.json({ ok: true });
});

// Opnieuw laten herschrijven door AI (kost één AI-call); haalt het teken zo nodig eerst op bij AstroAPI
app.post('/api/admin/horoscoop/maand/:teken/herschrijf', alleenBeheer, async (req, res) => {
  const teken = String(req.params.teken), maand = vandaagNL().slice(0, 7);
  if (!ALLE_TEKENS.includes(teken)) { res.status(400).json({ error: 'Onbekend teken' }); return; }
  const pad = maandBestand(maand, teken, true);
  if (existsSync(pad)) renameSync(pad, `${pad}.vorige-${Date.now()}`);   // vorige versie bewaren
  try { const r = await maandHoroscoop(teken); res.json({ ok: 'taal' in r }); }
  catch (err) { res.status(503).json({ error: err instanceof Error ? err.message : 'Mislukt' }); }
});

app.get('/api/astroapi/verbruik', (_req, res) => {
  const maand = vandaagNL().slice(0, 7);
  res.json({ maand, calls: astroTeller(maand), limiet: ASTRO_LIMIET });
});

// Maandhoroscoop per teken via AstroAPI: max 12 calls per maand (ook gebruikt door de voorpagina, zie publiek.ts).
// De tekst wordt één keer per teken per maand door gpt-5.5 herschreven in makkelijk Nederlands (B1) en bewaard
// (cache/astroapi/maand-JJJJ-MM-teken-b1.json); lukt dat niet, dan volgt de oorspronkelijke tekst.
async function maandHoroscoop(teken: string) {
  const maand = vandaagNL().slice(0, 7);
  const d = await astroApi(`maand-${maand}-${teken}`, 'horoscope/sign/monthly', { sign: teken, month: maand, language: 'nl' });
  const basis = {
    maand, slug: teken, naam: TEKEN_NL[teken],
    thema: d.monthly_theme ?? null,
    score: d.overall_rating ?? null,
    weken: d.key_periods ?? null,
    gebieden: d.life_areas ?? [],
    tips: d.tips ?? [],
    maancycli: d.lunations ?? [],
    geluk: d.lucky_elements ?? null,
  };
  try {
    return { ...basis, ...(await maandInMakkelijkeTaal(maand, teken, basis)), taal: 'B1' };
  } catch (err) {
    console.error(`Maandhoroscoop ${teken} niet herschreven:`, err instanceof Error ? err.message : err);
    return basis;
  }
}

const b1Bezig = new Map<string, Promise<Record<string, unknown>>>();
async function maandInMakkelijkeTaal(maand: string, teken: string, basis: Record<string, unknown>): Promise<Record<string, unknown>> {
  const pad = join(ASTRO_DIR, `maand-${maand}-${teken}-b1.json`);
  if (existsSync(pad)) return JSON.parse(readFileSync(pad, 'utf-8')).b1;
  const lopend = b1Bezig.get(pad);
  if (lopend) return lopend;
  const taak = (async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY ontbreekt');
    type Gebied = { area?: string; title?: string; prediction?: string; [k: string]: unknown };
    type Cyclus = { date?: string; phase?: string; interpretation?: string | null; [k: string]: unknown };
    const gebieden = (basis.gebieden as Gebied[]) || [];
    const cycli = (basis.maancycli as Cyclus[]) || [];
    const invoer = {
      thema: basis.thema, tips: basis.tips, weken: basis.weken,
      gebieden: gebieden.map((g) => ({ area: g.area, titel: g.title, tekst: g.prediction })),
      maancycli: cycli.map((c) => ({ datum: c.date, tekst: c.interpretation })),
    };
    const { default: OpenAI } = await import('openai');
    const resp = await new OpenAI({ apiKey }).chat.completions.create({
      model: 'gpt-5.5',
      max_completion_tokens: 16000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `Je herschrijft een maandhoroscoop voor ${TEKEN_NL[teken]} in eenvoudig Nederlands (taalniveau B1) voor een breed publiek.
Regels: behoud per onderdeel precies de boodschap; voeg niets toe en laat niets inhoudelijks weg. Korte zinnen (gemiddeld 10 tot 15 woorden, nooit meer dan 20). Gewone woorden; vervang moeilijke en vaktermen (zoals huizen, aspecten, trigoon, transit) door gewone woorden of laat ze weg als de boodschap blijft. Spreek de lezer aan met je. Warm en rustig, geen angst, geen garanties of zekere voorspellingen.
Antwoord als JSON met PRECIES dezelfde opbouw, sleutels en aantallen als de invoer (dezelfde "area"- en "datum"-waarden); alleen de teksten veranderen. Laat "weken" null als het null is.` },
        { role: 'user', content: JSON.stringify(invoer) },
      ],
    });
    const uit = JSON.parse(resp.choices[0].message.content || '{}') as typeof invoer;
    const nieuweGebieden = gebieden.map((g) => {
      const n = (uit.gebieden || []).find((x) => x.area === g.area);
      return n?.tekst ? { ...g, prediction: n.tekst } : g;
    });
    const nieuweCycli = cycli.map((c, i) => {
      const n = (uit.maancycli || []).find((x) => x.datum === c.date) || (uit.maancycli || [])[i];
      return n?.tekst ? { ...c, interpretation: n.tekst } : c;
    });
    const tips = Array.isArray(uit.tips) && uit.tips.length === (basis.tips as unknown[] || []).length ? uit.tips : basis.tips;
    if (!uit.thema || nieuweGebieden.filter((g, i) => g !== gebieden[i]).length < Math.min(3, gebieden.length)) throw new Error('Onvolledige herschrijving');
    const b1 = { thema: uit.thema, gebieden: nieuweGebieden, tips, maancycli: nieuweCycli, weken: uit.weken ?? basis.weken };
    mkdirSync(ASTRO_DIR, { recursive: true });
    writeFileSync(pad, JSON.stringify({ gemaakt: new Date().toISOString(), bron: 'gpt-5.5', b1 }));
    return b1;
  })();
  b1Bezig.set(pad, taak);
  try { return await taak; } finally { b1Bezig.delete(pad); }
}

app.get('/api/horoscoop/maand/:teken', async (req, res) => {
  const teken = req.params.teken.toLowerCase();
  if (!ALLE_TEKENS.includes(teken)) {
    res.status(400).json({ error: `Ongeldig teken. Gebruik: ${ALLE_TEKENS.join(', ')}` }); return;
  }
  try {
    res.json(await maandHoroscoop(teken));
  } catch (err: unknown) {
    res.status(503).json({ error: err instanceof Error ? err.message : 'Maandhoroscoop niet beschikbaar' });
  }
});

// ─── Dagelijkse horoscoop: één gpt-5.5-call per dag voor alle 12 tekens ───
// Gevoed met de echte maanstand (SunCalc); opgeslagen in cache/daghoroscoop-DATUM.json.
const GEBIEDEN_NL: Record<string, string> = {
  love: 'Liefde', relationships: 'Relaties', career: 'Carrière', finance: 'Financiën',
  health: 'Gezondheid', spirituality: 'Spiritualiteit',
};
let dagBezig: Promise<Record<string, unknown>> | null = null;

async function haalDagHoroscopen(datum: string): Promise<Record<string, unknown>> {
  const pad = join(CACHE_DIR, `daghoroscoop-${datum}.json`);
  if (existsSync(pad)) return JSON.parse(readFileSync(pad, 'utf-8'));
  if (dagBezig) return dagBezig;

  dagBezig = (async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API sleutel niet geconfigureerd');
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });
    const maan = getMaanData(new Date(`${datum}T12:00:00`));

    const systemPrompt = `Je bent een ervaren Nederlandse astroloog. Schrijf de dagelijkse horoscoop voor ${datum} voor alle 12 sterrenbeelden.
Maanstand vandaag: ${maan.fase} (${maan.verlichtingspercentage}% verlicht). Laat die energie meeklinken.
Toon: warm, reflectief en praktisch; geen angstaanjagende voorspellingen, geen aannames over geslacht.
Antwoord als JSON: {"tekens": {"<slug>": {"thema": "1 korte kernzin", "tekst": "de horoscoop zelf: 4-6 zinnen, persoonlijk aangesproken met je/jij", "score": 1-5, "gebieden": {${Object.keys(GEBIEDEN_NL).map(k => `"${k}": {"tekst": "1-2 zinnen", "score": 1-5}`).join(', ')}}, "tips": ["...","...","..."], "geluk": {"numbers": [4 getallen], "colors": [2-3 kleuren], "stones": [2 stenen]}}}}
Slugs: ${ALLE_TEKENS.join(', ')}. Varieer echt per teken (element, heerser); scores niet allemaal gelijk.`;

    const resp = await openai.chat.completions.create({
      model: 'gpt-5.5',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Horoscopen voor ${datum}` }],
      max_completion_tokens: 20000,
      response_format: { type: 'json_object' },
    });
    const ruw = JSON.parse(resp.choices[0].message.content || '{}').tekens || {};
    const tekens: Record<string, unknown> = {};
    for (const t of ALLE_TEKENS) {
      const x = ruw[t] || {};
      tekens[t] = {
        slug: t, naam: TEKEN_NL[t],
        thema: x.thema ?? null, tekst_nl: x.tekst ?? x.thema ?? null, score: x.score ?? null,
        gebieden: Object.entries(GEBIEDEN_NL)
          .filter(([k]) => x.gebieden?.[k]?.tekst)
          .map(([k, titel]) => ({ area: k, title: titel, prediction: x.gebieden[k].tekst, rating: x.gebieden[k].score ?? 3 })),
        tips: Array.isArray(x.tips) ? x.tips : [],
        geluk: x.geluk ?? null,
        maan: { emoji: maan.emoji, fase: maan.fase },
      };
    }
    if (!Object.values(tekens).some((v) => (v as { thema: unknown }).thema)) throw new Error('Lege horoscoop ontvangen');
    const cache = { datum, gegenereerd: new Date().toISOString(), bron: 'gpt-5.5', tekens };
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(pad, JSON.stringify(cache), 'utf-8');
    return cache;
  })();
  try { return await dagBezig; } finally { dagBezig = null; }
}

// Vooraf genereren (duurt ~1 min) zodat de eerste bezoeker van de dag niet hoeft te wachten
const voorbereidDag = () => { haalDagHoroscopen(vandaagNL()).catch((e) => console.warn('[daghoroscoop]', e.message)); };
setTimeout(voorbereidDag, 5000);
setInterval(voorbereidDag, 30 * 60 * 1000);

app.get('/api/horoscoop/vandaag', async (_req, res) => {
  try {
    res.json(await haalDagHoroscopen(vandaagNL()));
  } catch (err: unknown) {
    res.status(503).json({ error: err instanceof Error ? err.message : 'Horoscoop niet beschikbaar' });
  }
});

app.get('/api/horoscoop/:teken', async (req, res) => {
  const teken = req.params.teken.toLowerCase();
  if (!ALLE_TEKENS.includes(teken)) {
    res.status(400).json({ error: `Ongeldig teken. Gebruik: ${ALLE_TEKENS.join(', ')}` }); return;
  }
  const datum = vandaagNL();
  try {
    const cache = await haalDagHoroscopen(datum) as { tekens: Record<string, object> };
    res.json({ datum, ...cache.tekens[teken] });
  } catch (err: unknown) {
    res.status(503).json({ error: err instanceof Error ? err.message : 'Horoscoop niet beschikbaar' });
  }
});

// ─── Numerologie API ──────────────────────────────────────────────

const VOWELS = new Set(['A','E','I','O','U']);

function letterWaarde(ch: string): number { return ch.toUpperCase().charCodeAt(0) - 64; }

function reduceerNum(n: number): number {
  if (n === 11 || n === 22) return n;
  while (n > 9) n = String(n).split('').reduce((s, d) => s + parseInt(d), 0);
  return n;
}

function reduceToSingleDigit(n: number): number {
  while (n > 9) n = String(n).split('').reduce((s, d) => s + parseInt(d), 0);
  return n;
}

function reduceToSingleOrMaster(n: number): number {
  return (n === 11 || n === 22) ? n : reduceToSingleDigit(n);
}

function reduceNumber(n: number): number { return reduceerNum(n); }

function calculateNumbers(date: string) {
  if (!date) return null;
  const [year, month, day] = date.split('-');
  const calculations: Record<string, { result: number; steps: string[] }> = {};

  const rulingSteps: string[] = [];
  let rulingNumber = parseInt(day);
  rulingSteps.push(`1. Geboortedag is ${rulingNumber}`);
  if (rulingNumber < 10) {
    rulingSteps.push(`2. ${rulingNumber} is al een enkel cijfer → Bestuursgetal`);
  } else {
    const s = day.split('').reduce((a, d) => a + parseInt(d), 0);
    rulingSteps.push(`2. ${day.split('').join(' + ')} = ${s}`);
    if (s < 10) { rulingNumber = s; rulingSteps.push(`3. ${s} → Bestuursgetal`); }
    else {
      rulingNumber = s.toString().split('').reduce((a, d) => a + parseInt(d), 0);
      rulingSteps.push(`3. ${s.toString().split('').join(' + ')} = ${rulingNumber} → Bestuursgetal`);
    }
  }
  calculations.ruling = { result: rulingNumber, steps: rulingSteps };

  const daySum = day.split('').reduce((a, d) => a + parseInt(d), 0);
  const dayReduced = reduceToSingleDigit(daySum);
  const monthNum = parseInt(month);
  const monthSum = month.split('').reduce((a, d) => a + parseInt(d), 0);
  const monthReduced = reduceToSingleDigit(monthSum);
  const yearSum = year.split('').reduce((a, d) => a + parseInt(d), 0);
  const yearReduced = reduceToSingleDigit(yearSum);
  const totalSum = dayReduced + monthReduced + yearReduced;
  const lifePathNumber = reduceToSingleOrMaster(totalSum);
  calculations.lifePath = { result: lifePathNumber, steps: [
    `1. Dag ${day} → ${daySum}${daySum !== dayReduced ? ` → ${dayReduced}` : ''}`,
    `2. Maand ${monthNum}${monthNum > 9 ? ` → ${monthSum} → ${monthReduced}` : ` → ${monthReduced}`}`,
    `3. Jaar ${year} → ${yearSum}${yearSum !== yearReduced ? ` → ${yearReduced}` : ''}`,
    `4. ${dayReduced} + ${monthReduced} + ${yearReduced} = ${totalSum}`,
    ...(totalSum !== lifePathNumber ? [`5. ${totalSum} → ${lifePathNumber}`] : []),
  ]};

  const lessonNumber = reduceNumber(parseInt(month));
  const soulNumber = reduceNumber(parseInt(day));
  const giftNumber = reduceNumber(parseInt(year.slice(-2)));
  const pastNumber = reduceNumber(Array.from(year).reduce((a, d) => a + parseInt(d), 0));
  calculations.lesson     = { result: lessonNumber,                     steps: [`Geboortemaand ${month} → ${lessonNumber}`] };
  calculations.soul       = { result: soulNumber,                       steps: [`Geboortedag ${day} → ${soulNumber}`] };
  calculations.gift       = { result: giftNumber,                       steps: [`Laatste twee cijfers jaar ${year.slice(-2)} → ${giftNumber}`] };
  calculations.past       = { result: pastNumber,                       steps: [`Jaar ${year} → ${pastNumber}`] };
  calculations.foundation = { result: reduceNumber(soulNumber + lessonNumber),   steps: [`Zielengetal (${soulNumber}) + Levensles (${lessonNumber}) = ${reduceNumber(soulNumber + lessonNumber)}`] };
  calculations.projection = { result: reduceNumber(giftNumber + soulNumber),     steps: [`Geschenk (${giftNumber}) + Zielengetal (${soulNumber}) = ${reduceNumber(giftNumber + soulNumber)}`] };
  calculations.core       = { result: reduceNumber(pastNumber + lessonNumber),   steps: [`Verleden (${pastNumber}) + Levensles (${lessonNumber}) = ${reduceNumber(pastNumber + lessonNumber)}`] };
  calculations.purpose    = { result: reduceNumber(parseInt(month) + parseInt(day) + parseInt(year)), steps: [`${month} + ${day} + ${year} → ${reduceNumber(parseInt(month) + parseInt(day) + parseInt(year))}`] };
  return calculations;
}

function naamAnalyse(naam: string) {
  const schoon = naam.toUpperCase().replace(/[^A-Z\s]/g, '');
  const letters = schoon.replace(/\s/g, '').split('');
  const totaal = letters.reduce((s, l) => s + letterWaarde(l), 0);
  const klinkers = letters.filter(l => VOWELS.has(l));
  const medeklinkers = letters.filter(l => !VOWELS.has(l));
  const klinkerSom = klinkers.reduce((s, l) => s + letterWaarde(l), 0);
  const medeklinkerSom = medeklinkers.reduce((s, l) => s + letterWaarde(l), 0);
  const woorden = schoon.split(/\s+/).filter(Boolean).map(w => {
    const ls = w.split('');
    const s = ls.reduce((a, l) => a + letterWaarde(l), 0);
    return { woord: w, getal: reduceerNum(s), letterwaarden: ls.map(l => ({ letter: l, waarde: letterWaarde(l), isKlinker: VOWELS.has(l) })) };
  });
  return {
    naamGetal: reduceerNum(totaal), zielenGetal: reduceerNum(klinkerSom),
    persoonlijkheidsGetal: reduceerNum(medeklinkerSom),
    totaal, klinkerSom, medeklinkerSom, woorden,
    unicLetters: [...new Set(letters)].sort(),
    letters: letters.map(l => ({ letter: l, waarde: letterWaarde(l), isKlinker: VOWELS.has(l) })),
  };
}

function persoonlijkJaar(geboortedatum: string, jaar?: number) {
  const currentYear = jaar ?? new Date().getFullYear();
  const [, month, day] = geboortedatum.split('-');
  const som = String(currentYear).split('').reduce((a, d) => a + parseInt(d), 0) + parseInt(month) + parseInt(day);
  return { jaar: currentYear, getal: reduceerNum(som) };
}

function huisnummerBerekening(input: string) {
  const cijfers = input.replace(/[^0-9]/g, '');
  if (!cijfers) return null;
  const som = cijfers.split('').reduce((a, d) => a + parseInt(d), 0);
  const getal = reduceerNum(som);
  return { invoer: input, getal, stappen: [`${cijfers.split('').join(' + ')} = ${som}${som !== getal ? ` → ${getal}` : ''}`] };
}

app.get('/api/numerologie/analyse', (req, res) => {
  const { datum, naam } = req.query as { datum?: string; naam?: string };
  if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    res.status(400).json({ error: 'Geef een geldig datum op (YYYY-MM-DD) via ?datum=' }); return;
  }
  res.json({ datum, naam: naam ?? null, getallen: calculateNumbers(datum), naamAnalyse: naam ? naamAnalyse(naam) : null, persoonlijkJaar: persoonlijkJaar(datum) });
});

app.get('/api/numerologie/naam', (req, res) => {
  const { naam } = req.query as { naam?: string };
  if (!naam?.trim()) { res.status(400).json({ error: 'Geef een naam op via ?naam=' }); return; }
  res.json(naamAnalyse(naam));
});

app.get('/api/numerologie/jaar', (req, res) => {
  const { datum, jaar } = req.query as { datum?: string; jaar?: string };
  if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    res.status(400).json({ error: 'Geef een geldig datum op (YYYY-MM-DD) via ?datum=' }); return;
  }
  res.json(persoonlijkJaar(datum, jaar ? parseInt(jaar) : undefined));
});

app.get('/api/numerologie/huisnummer', (req, res) => {
  const { nummer } = req.query as { nummer?: string };
  if (!nummer) { res.status(400).json({ error: 'Geef een nummer op via ?nummer=' }); return; }
  const result = huisnummerBerekening(nummer);
  if (!result) { res.status(400).json({ error: 'Geen cijfers gevonden in de invoer' }); return; }
  res.json(result);
});

// ─── Maanfase API ────────────────────────────────────────────────

import SunCalc from 'suncalc';

function maanfaseNaam(phase: number): { naam: string; emoji: string } {
  if (phase < 0.033)  return { naam: 'Nieuwe Maan',           emoji: '🌑' };
  if (phase < 0.233)  return { naam: 'Wassende Maansikkel',   emoji: '🌒' };
  if (phase < 0.283)  return { naam: 'Eerste Kwartier',        emoji: '🌓' };
  if (phase < 0.467)  return { naam: 'Wassende Maan',          emoji: '🌔' };
  if (phase < 0.533)  return { naam: 'Volle Maan',             emoji: '🌕' };
  if (phase < 0.717)  return { naam: 'Afnemende Maan',         emoji: '🌖' };
  if (phase < 0.783)  return { naam: 'Laatste Kwartier',       emoji: '🌗' };
  if (phase < 0.967)  return { naam: 'Afnemende Maansikkel',   emoji: '🌘' };
  return { naam: 'Nieuwe Maan', emoji: '🌑' };
}

function getMaanData(datum: Date) {
  const illum = SunCalc.getMoonIllumination(datum);
  const fase = maanfaseNaam(illum.phase);
  return {
    datum: datum.toISOString().slice(0, 10),
    fase: fase.naam,
    emoji: fase.emoji,
    verlichtingspercentage: Math.round(illum.fraction * 100),
    faseWaarde: parseFloat(illum.phase.toFixed(4)),
  };
}

// GET /api/maan/nu
app.get('/api/maan/nu', (_req, res) => {
  res.json(getMaanData(new Date()));
});

// GET /api/maan/kalender?maand=5&jaar=2026
app.get('/api/maan/kalender', (req, res) => {
  const nu = new Date();
  const maand = parseInt((req.query.maand as string) || String(nu.getMonth() + 1));
  const jaar  = parseInt((req.query.jaar  as string) || String(nu.getFullYear()));
  if (maand < 1 || maand > 12 || jaar < 2000 || jaar > 2100) {
    res.status(400).json({ error: 'Ongeldige maand of jaar' }); return;
  }
  const dagenInMaand = new Date(jaar, maand, 0).getDate();
  const dagen = [];
  for (let d = 1; d <= dagenInMaand; d++) {
    dagen.push(getMaanData(new Date(jaar, maand - 1, d, 12)));
  }
  res.json({ maand, jaar, dagen });
});

// ─── Natal Chart proxy → Kerykeion (poort 4211) ──────────────────

async function kerykeionProxy(pad: string): Promise<unknown> {
  const { default: fetch } = await import('node-fetch');
  const r = await (fetch as unknown as typeof globalThis.fetch)(`http://127.0.0.1:4211${pad}`);
  if (!r.ok) {
    const err = await r.json() as { detail?: string };
    throw new Error(err.detail ?? 'Kerykeion fout');
  }
  return r.json();
}

app.get('/api/natal', async (req, res) => {
  const { naam, jaar, maand, dag, uur, minuut, stad } = req.query as Record<string, string>;
  if (!naam || !jaar || !maand || !dag) {
    res.status(400).json({ error: 'Vereist: naam, jaar, maand, dag' }); return;
  }
  const params = new URLSearchParams({ naam, jaar, maand, dag, uur: uur ?? '12', minuut: minuut ?? '0', stad: stad ?? 'Amsterdam' });
  try {
    const data = await kerykeionProxy(`/natal?${params}`);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : 'Onbekende fout' });
  }
});

app.get('/api/natal/svg', async (req, res) => {
  const { naam, jaar, maand, dag, uur, minuut, stad } = req.query as Record<string, string>;
  if (!naam || !jaar || !maand || !dag) {
    res.status(400).json({ error: 'Vereist: naam, jaar, maand, dag' }); return;
  }
  const params = new URLSearchParams({ naam, jaar, maand, dag, uur: uur ?? '12', minuut: minuut ?? '0', stad: stad ?? 'Amsterdam' });
  try {
    const { default: fetch } = await import('node-fetch');
    const r = await (fetch as unknown as typeof globalThis.fetch)(`http://127.0.0.1:4211/natal/svg?${params}`);
    if (!r.ok) { res.status(400).json({ error: 'SVG generatie mislukt' }); return; }
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(await r.text());
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Fout' });
  }
});

app.get('/api/natal/geocodeer', async (req, res) => {
  const { q } = req.query as { q?: string };
  if (!q) { res.status(400).json({ error: 'Geef een zoekterm op via ?q=' }); return; }
  try {
    const data = await kerykeionProxy(`/geocodeer?q=${encodeURIComponent(q)}`);
    res.json(data);
  } catch (e) {
    res.status(503).json({ error: e instanceof Error ? e.message : 'Fout' });
  }
});

// ─── Planeten posities nu ────────────────────────────────────────

app.get('/api/planeten/nu', async (_req, res) => {
  try {
    const data = await kerykeionProxy('/planeten/nu');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Fout' });
  }
});

// ─── Zodiac Compatibiliteit ──────────────────────────────────────

const ZODIAC_COMPAT: Record<string, { percentage: number; samenvatting: string; emotioneel: string; intellectueel: string }> = {
  'aries-aries':        { percentage: 75, samenvatting: 'Twee pioniers — veel energie en passie, maar ook botsende ego\'s.', emotioneel: 'Intens maar vluchtig', intellectueel: 'Snel en stimulerend' },
  'aries-taurus':       { percentage: 55, samenvatting: 'Ram\'s impulsiviteit botst met Stier\'s behoefte aan rust.', emotioneel: 'Spanning door tempo-verschil', intellectueel: 'Aanvullend als beiden leren geven' },
  'aries-gemini':       { percentage: 80, samenvatting: 'Levendig duo — samen altijd in beweging.', emotioneel: 'Licht maar plezierig', intellectueel: 'Uitstekend — beiden snel van geest' },
  'aries-cancer':       { percentage: 50, samenvatting: 'Ram\'s directheid kwetst Kreeft\'s gevoeligheid.', emotioneel: 'Kreeft heeft meer diepte nodig', intellectueel: 'Matig — andere prioriteiten' },
  'aries-leo':          { percentage: 88, samenvatting: 'Vuur ontmoet vuur — passioneel en dynamisch.', emotioneel: 'Warm en hartstochtelijk', intellectueel: 'Stimulerend en ambitieus' },
  'aries-virgo':        { percentage: 45, samenvatting: 'Impulsief vs. analytisch — vereist veel begrip.', emotioneel: 'Maagd vindt Ram te onstuimig', intellectueel: 'Kan aanvullend zijn' },
  'aries-libra':        { percentage: 70, samenvatting: 'Tegengestelden die elkaar aantrekken.', emotioneel: 'Passioneel maar ongelijkmatig', intellectueel: 'Weegschaal brengt balans in Ram\'s energie' },
  'aries-scorpio':      { percentage: 65, samenvatting: 'Beide intens — magnetisch maar explosief.', emotioneel: 'Diep en gepassioneerd', intellectueel: 'Botsend maar stimulerend' },
  'aries-sagittarius':  { percentage: 90, samenvatting: 'Twee vrije geesten — samen onverslaanbaar.', emotioneel: 'Warm, spontaan, avontuurlijk', intellectueel: 'Uitstekend — gedeeld enthousiasme' },
  'aries-capricorn':    { percentage: 50, samenvatting: 'Ram\'s spontaniteit vs. Steenbok\'s discipline.', emotioneel: 'Koud en warm tegelijk', intellectueel: 'Aanvullend als beiden groeien' },
  'aries-aquarius':     { percentage: 78, samenvatting: 'Beide onafhankelijk en vooruitstrevend.', emotioneel: 'Vriendschappelijk en vrij', intellectueel: 'Sterk — gedeeld idealisme' },
  'aries-pisces':       { percentage: 55, samenvatting: 'Ram\'s daadkracht kan Vissen overweldigen.', emotioneel: 'Vissen heeft meer tederheid nodig', intellectueel: 'Matig — andere werelden' },
  'taurus-taurus':      { percentage: 80, samenvatting: 'Stabiel, sensueel en betrouwbaar — maar weinig prikkeling.', emotioneel: 'Diep en trouw', intellectueel: 'Gelijkgestemd maar weinig groei' },
  'taurus-gemini':      { percentage: 52, samenvatting: 'Stier zoekt stabiliteit, Tweelingen zoekt variatie.', emotioneel: 'Moeilijk — andere basisbehoeften', intellectueel: 'Tweelingen stimuleert Stier' },
  'taurus-cancer':      { percentage: 88, samenvatting: 'Twee verzorgers — warmte, veiligheid en trouw.', emotioneel: 'Diepe emotionele verbinding', intellectueel: 'Gelijkgestemd en praktisch' },
  'taurus-leo':         { percentage: 60, samenvatting: 'Beide koppig — macht kan botsen.', emotioneel: 'Warm maar territoriaal', intellectueel: 'Leeuw inspireert, Stier aardt' },
  'taurus-virgo':       { percentage: 85, samenvatting: 'Aarde ontmoet aarde — praktisch en betrouwbaar.', emotioneel: 'Kalm en stabiel', intellectueel: 'Uitstekend — gedeelde waarden' },
  'taurus-libra':       { percentage: 72, samenvatting: 'Beide houden van schoonheid en comfort.', emotioneel: 'Harmonieus en sensueel', intellectueel: 'Goed — gedeelde esthetiek' },
  'taurus-scorpio':     { percentage: 78, samenvatting: 'Tegengestelden met diepe aantrekkingskracht.', emotioneel: 'Intens en diep', intellectueel: 'Aanvullend — Schorpioen verdiept Stier' },
  'taurus-sagittarius': { percentage: 48, samenvatting: 'Stier\'s rust vs. Boogschutter\'s avontuur.', emotioneel: 'Boogschutter voelt zich bekneld', intellectueel: 'Matig — te veel verschil' },
  'taurus-capricorn':   { percentage: 90, samenvatting: 'Twee aardetekens — stabiel, ambitieus, betrouwbaar.', emotioneel: 'Solide en trouw', intellectueel: 'Uitstekend — gedeelde doelen' },
  'taurus-aquarius':    { percentage: 45, samenvatting: 'Stier is traditioneel, Waterman revolutionair.', emotioneel: 'Moeilijk te overbruggen', intellectueel: 'Botsend maar leerzaam' },
  'taurus-pisces':      { percentage: 82, samenvatting: 'Stier aardt Vissen, Vissen brengt magie.', emotioneel: 'Zacht en aanvullend', intellectueel: 'Goed — dromer en doener samen' },
  'gemini-gemini':      { percentage: 70, samenvatting: 'Veel plezier en prikkeling — maar weinig stabiliteit.', emotioneel: 'Oppervlakkig maar levendig', intellectueel: 'Uitstekend — eindeloze gesprekken' },
  'gemini-cancer':      { percentage: 58, samenvatting: 'Tweelingen\'s luchthartigheid vs. Kreeft\'s emotionele diepte.', emotioneel: 'Kreeft wil meer diepte', intellectueel: 'Tweelingen stimuleert Kreeft' },
  'gemini-leo':         { percentage: 82, samenvatting: 'Leeuw geniet van Tweelingen\'s aandacht.', emotioneel: 'Levendig en warm', intellectueel: 'Uitstekend — beiden sociaal' },
  'gemini-virgo':       { percentage: 55, samenvatting: 'Beide Mercurius-tekens maar heel anders ingesteld.', emotioneel: 'Maagd wil meer zekerheid', intellectueel: 'Goed — gedeelde intellectuele nieuwsgierigheid' },
  'gemini-libra':       { percentage: 88, samenvatting: 'Twee luchttekens — intellectueel en sociaal perfect.', emotioneel: 'Licht maar harmonieus', intellectueel: 'Uitstekend' },
  'gemini-scorpio':     { percentage: 50, samenvatting: 'Tweelingen is te vluchtig voor Schorpioen\'s intensiteit.', emotioneel: 'Schorpioen wil diepte', intellectueel: 'Stimulerend maar ongelijkmatig' },
  'gemini-sagittarius': { percentage: 80, samenvatting: 'Tegengestelden die elkaar perfect aanvullen.', emotioneel: 'Avontuurlijk en vrij', intellectueel: 'Uitstekend — gedeeld enthousiasme' },
  'gemini-capricorn':   { percentage: 48, samenvatting: 'Tweelingen\'s spontaniteit vs. Steenbok\'s ernst.', emotioneel: 'Moeilijk overbrugbaar', intellectueel: 'Aanvullend maar moeizaam' },
  'gemini-aquarius':    { percentage: 86, samenvatting: 'Twee luchtgeesten — vrijheid en intellect.', emotioneel: 'Vriendschappelijk en stimulerend', intellectueel: 'Uitstekend' },
  'gemini-pisces':      { percentage: 52, samenvatting: 'Tweelingen leeft in hoofd, Vissen in gevoel.', emotioneel: 'Vissen voelt zich niet begrepen', intellectueel: 'Matig — andere talen' },
  'cancer-cancer':      { percentage: 75, samenvatting: 'Diep emotioneel begrip maar ook dubbel gevoelig.', emotioneel: 'Zeer diep en trouw', intellectueel: 'Gelijkgestemd — kunnen in bubbel schieten' },
  'cancer-leo':         { percentage: 65, samenvatting: 'Kreeft verzorgt, Leeuw schittert — kan werken.', emotioneel: 'Warm maar Kreeft behoeft meer', intellectueel: 'Goed als Leeuw luistert' },
  'cancer-virgo':       { percentage: 80, samenvatting: 'Kreeft\'s zorg + Maagd\'s structuur = stabiel thuis.', emotioneel: 'Veilig en kalm', intellectueel: 'Goed — aanvullend' },
  'cancer-libra':       { percentage: 55, samenvatting: 'Kreeft wil diepte, Weegschaal wil balans.', emotioneel: 'Weegschaal kan te rationeel lijken', intellectueel: 'Matig' },
  'cancer-scorpio':     { percentage: 92, samenvatting: 'Twee watertekens — diepste emotionele verbinding.', emotioneel: 'Intens, diep en trouw', intellectueel: 'Uitstekend — intuïtief begrip' },
  'cancer-sagittarius': { percentage: 45, samenvatting: 'Kreeft wil thuis, Boogschutter wil reizen.', emotioneel: 'Kreeft voelt zich verlaten', intellectueel: 'Matig' },
  'cancer-capricorn':   { percentage: 72, samenvatting: 'Tegengestelden — thuis vs. ambitie, kunnen aanvullen.', emotioneel: 'Steenbok leert van Kreeft\'s zorg', intellectueel: 'Goed — aanvullend' },
  'cancer-aquarius':    { percentage: 42, samenvatting: 'Kreeft wil intimiteit, Waterman wil vrijheid.', emotioneel: 'Moeilijk — te ver uiteen', intellectueel: 'Matig' },
  'cancer-pisces':      { percentage: 90, samenvatting: 'Twee watertekens — intuitief en vol liefde.', emotioneel: 'Diep, zacht en begrijpend', intellectueel: 'Goed — gedeelde gevoelswereld' },
  'leo-leo':            { percentage: 70, samenvatting: 'Beiden willen schitteren — geef elkaar de podiumruimte.', emotioneel: 'Warm en hartstochtelijk', intellectueel: 'Stimulerend maar competitief' },
  'leo-virgo':          { percentage: 55, samenvatting: 'Leeuw wil applaus, Maagd geeft kritiek.', emotioneel: 'Maagd moet leren complimenteren', intellectueel: 'Goed als er respect is' },
  'leo-libra':          { percentage: 82, samenvatting: 'Beiden sociaal en charmant — gouden duo.', emotioneel: 'Warm en harmonieus', intellectueel: 'Uitstekend' },
  'leo-scorpio':        { percentage: 62, samenvatting: 'Beiden krachtig — machtsstrijd mogelijk.', emotioneel: 'Intens en explosief', intellectueel: 'Botsend maar stimulerend' },
  'leo-sagittarius':    { percentage: 88, samenvatting: 'Twee vuurgeesten — avontuurlijk en enthousiast.', emotioneel: 'Warm, groot en hartstochtelijk', intellectueel: 'Uitstekend' },
  'leo-capricorn':      { percentage: 52, samenvatting: 'Leeuw speelt, Steenbok werkt.', emotioneel: 'Moeilijk overbrugbaar', intellectueel: 'Aanvullend maar moeizaam' },
  'leo-aquarius':       { percentage: 72, samenvatting: 'Tegengestelden — ik vs. wij, kunnen groeien.', emotioneel: 'Spanning maar ook magie', intellectueel: 'Stimulerend — Waterman opent Leeuw' },
  'leo-pisces':         { percentage: 58, samenvatting: 'Leeuw geeft Vissen zekerheid, Vissen geeft magie.', emotioneel: 'Kan werken met begrip', intellectueel: 'Matig' },
  'virgo-virgo':        { percentage: 72, samenvatting: 'Twee perfectionisten — begrijpen elkaar maar kunnen ook over-analyseren.', emotioneel: 'Kalm en betrouwbaar', intellectueel: 'Uitstekend' },
  'virgo-libra':        { percentage: 65, samenvatting: 'Beide verfijnd en esthetisch — kunnen klikken.', emotioneel: 'Weegschaal brengt warmte', intellectueel: 'Goed' },
  'virgo-scorpio':      { percentage: 80, samenvatting: 'Maagd\'s analyse + Schorpioen\'s diepte = krachtig.', emotioneel: 'Diep en vertrouwensvol', intellectueel: 'Uitstekend' },
  'virgo-sagittarius':  { percentage: 48, samenvatting: 'Maagd details vs. Boogschutter groot plaatje.', emotioneel: 'Moeilijk overbrugbaar', intellectueel: 'Aanvullend maar frustrerend' },
  'virgo-capricorn':    { percentage: 88, samenvatting: 'Twee aardetekens — praktisch en betrouwbaar.', emotioneel: 'Kalm, stabiel, trouw', intellectueel: 'Uitstekend' },
  'virgo-aquarius':     { percentage: 50, samenvatting: 'Maagd is praktisch, Waterman is idealistisch.', emotioneel: 'Moeilijk', intellectueel: 'Stimulerend maar ongelijkmatig' },
  'virgo-pisces':       { percentage: 75, samenvatting: 'Tegengestelden — detail vs. gevoel, aanvullend.', emotioneel: 'Vissen verzacht Maagd\'s kritiek', intellectueel: 'Goed — aanvullend' },
  'libra-libra':        { percentage: 75, samenvatting: 'Harmonie en schoonheid — maar wie neemt beslissingen?', emotioneel: 'Warm en aangenaam', intellectueel: 'Uitstekend' },
  'libra-scorpio':      { percentage: 65, samenvatting: 'Weegschaal\'s luchthartigheid vs. Schorpioen\'s intensiteit.', emotioneel: 'Schorpioen wil meer diepte', intellectueel: 'Stimulerend' },
  'libra-sagittarius':  { percentage: 82, samenvatting: 'Beiden sociaal en avontuurlijk.', emotioneel: 'Vrij en levendig', intellectueel: 'Uitstekend' },
  'libra-capricorn':    { percentage: 55, samenvatting: 'Weegschaal wil harmonie, Steenbok wil resultaat.', emotioneel: 'Moeizaam', intellectueel: 'Aanvullend' },
  'libra-aquarius':     { percentage: 88, samenvatting: 'Twee luchttekens — vrijheid en intellect.', emotioneel: 'Vriendschappelijk en harmonieus', intellectueel: 'Uitstekend' },
  'libra-pisces':       { percentage: 68, samenvatting: 'Beide zacht en artistiek — romantisch duo.', emotioneel: 'Teder en mooi', intellectueel: 'Goed' },
  'scorpio-scorpio':    { percentage: 78, samenvatting: 'Diepe intensiteit — transformatief of destructief.', emotioneel: 'Ongeëvenaard diep', intellectueel: 'Krachtig' },
  'scorpio-sagittarius':{ percentage: 55, samenvatting: 'Schorpioen\'s diepte vs. Boogschutter\'s vrijheid.', emotioneel: 'Boogschutter voelt zich opgesloten', intellectueel: 'Stimulerend' },
  'scorpio-capricorn':  { percentage: 85, samenvatting: 'Beiden krachtig en ambitieus — sterk duo.', emotioneel: 'Diep en betrouwbaar', intellectueel: 'Uitstekend' },
  'scorpio-aquarius':   { percentage: 48, samenvatting: 'Schorpioen\'s bezitterigheid vs. Waterman\'s vrijheid.', emotioneel: 'Moeilijk', intellectueel: 'Botsend maar fascinerend' },
  'scorpio-pisces':     { percentage: 92, samenvatting: 'Twee watertekens — diepste spirituele verbinding.', emotioneel: 'Diep, intens en mystiek', intellectueel: 'Uitstekend — intuïtief begrip' },
  'sagittarius-sagittarius': { percentage: 80, samenvatting: 'Twee avonturiers — samen overal.', emotioneel: 'Vrij en levendig', intellectueel: 'Uitstekend' },
  'sagittarius-capricorn': { percentage: 52, samenvatting: 'Boogschutter vrij vs. Steenbok gedisciplineerd.', emotioneel: 'Moeilijk maar leerzaam', intellectueel: 'Aanvullend' },
  'sagittarius-aquarius':{ percentage: 86, samenvatting: 'Beiden vrij en idealistisch.', emotioneel: 'Vriendschappelijk en stimulerend', intellectueel: 'Uitstekend' },
  'sagittarius-pisces': { percentage: 65, samenvatting: 'Beiden dromerig — maar op andere manieren.', emotioneel: 'Warm maar ongrijpbaar', intellectueel: 'Goed' },
  'capricorn-capricorn':{ percentage: 78, samenvatting: 'Twee bouwers — solide maar weinig spontaniteit.', emotioneel: 'Betrouwbaar en trouw', intellectueel: 'Uitstekend' },
  'capricorn-aquarius': { percentage: 55, samenvatting: 'Traditie vs. revolutie — botsende waarden.', emotioneel: 'Moeizaam', intellectueel: 'Stimulerend maar frustrerend' },
  'capricorn-pisces':   { percentage: 72, samenvatting: 'Steenbok aardt Vissen, Vissen inspireert Steenbok.', emotioneel: 'Aanvullend en stabiel', intellectueel: 'Goed' },
  'aquarius-aquarius':  { percentage: 75, samenvatting: 'Twee revolutionairen — samen of nooit.', emotioneel: 'Vriendschappelijk maar afstandelijk', intellectueel: 'Uitstekend' },
  'aquarius-pisces':    { percentage: 62, samenvatting: 'Waterman in hoofd, Vissen in gevoel.', emotioneel: 'Vissen wil meer warmte', intellectueel: 'Goed' },
  'pisces-pisces':      { percentage: 80, samenvatting: 'Twee dromers — magisch maar wie aardt?', emotioneel: 'Diep en spiritueel', intellectueel: 'Goed maar weinig structuur' },
};

const TEKEN_EN_NL: Record<string, string> = {
  aries:'Ram',taurus:'Stier',gemini:'Tweelingen',cancer:'Kreeft',
  leo:'Leeuw',virgo:'Maagd',libra:'Weegschaal',scorpio:'Schorpioen',
  sagittarius:'Boogschutter',capricorn:'Steenbok',aquarius:'Waterman',pisces:'Vissen',
};

app.get('/api/compatibiliteit/:teken1/:teken2', (req, res) => {
  const t1 = req.params.teken1.toLowerCase();
  const t2 = req.params.teken2.toLowerCase();
  const tekens = Object.keys(TEKEN_EN_NL);
  if (!tekens.includes(t1) || !tekens.includes(t2)) {
    res.status(400).json({ error: `Ongeldig teken. Gebruik: ${tekens.join(', ')}` }); return;
  }
  const sleutel = t1 < t2 ? `${t1}-${t2}` : `${t2}-${t1}`;
  const data = ZODIAC_COMPAT[sleutel];
  if (!data) { res.status(404).json({ error: 'Combinatie niet gevonden' }); return; }
  res.json({
    teken1: { en: t1, nl: TEKEN_EN_NL[t1] },
    teken2: { en: t2, nl: TEKEN_EN_NL[t2] },
    percentage: data.percentage,
    samenvatting: data.samenvatting,
    emotioneel: data.emotioneel,
    intellectueel: data.intellectueel,
  });
});

// ─── SPA fallback (Express 5) ────────────────────────────────────
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Tarot server draait op http://localhost:${PORT}`);
  console.log(`API beschikbaar op http://localhost:${PORT}/api/cards`);
});
// Node breekt een verzoek standaard na 5 minuten af (408). Grote cursus-zips (honderden MB's)
// hebben bij een gewone thuisverbinding meer tijd nodig om te uploaden.
server.requestTimeout = 2 * 60 * 60 * 1000;
