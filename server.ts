import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { allCards } from './src/data/cards/index.js';

// Laad .env als die aanwezig is (voor lokale dev en PM2 zonder ecosystem config)
try {
  const { config } = await import('dotenv');
  config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });
} catch { /* dotenv optioneel */ }

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4210;
const CACHE_DIR = join(__dirname, 'cache');

app.use(express.json());
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
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400, temperature: 0.8,
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
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Interpreteer de ${half} van het Keltisch Kruis:\n${JSON.stringify(slice, null, 2)}\n\n${vraagstelling ? `Vraag: ${vraagstelling}` : ''}` }
          ],
          temperature: 0.7, max_tokens: 1500,
        });
        interpretaties.push(resp.choices[0].message.content || '');
      }
    } else {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Interpreteer deze tarotlegging:\n${JSON.stringify(cardsInfo, null, 2)}\n\n${vraagstelling ? `Vraag: ${vraagstelling}` : ''}` }
        ],
        temperature: 0.7, max_tokens: 1000,
      });
      interpretaties.push(resp.choices[0].message.content || '');
    }

    res.json({ interpretaties });
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

function leesHoroscoopCache(datum: string): Record<string, unknown> | null {
  const pad = join(CACHE_DIR, `horoscoop-${datum}.json`);
  if (!existsSync(pad)) return null;
  try { return JSON.parse(readFileSync(pad, 'utf-8')); } catch { return null; }
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

app.get('/api/horoscoop/vandaag', (_req, res) => {
  const vandaag = new Date().toISOString().slice(0, 10);
  const cache = leesHoroscoopCache(vandaag);
  if (!cache) { res.status(503).json({ error: 'Cache nog niet beschikbaar' }); return; }
  res.json(cache);
});

app.get('/api/horoscoop/chinees/:jaar', (req, res) => {
  const jaar = parseInt(req.params.jaar);
  if (isNaN(jaar) || jaar < 1900 || jaar > 2100) {
    res.status(400).json({ error: 'Geef een geldig jaar op (1900–2100)' }); return;
  }
  const slug = chineesTekenVoorJaar(jaar);
  res.json({ jaar, slug, ...CHINEES_INFO[slug] });
});

app.get('/api/horoscoop/:teken', (req, res) => {
  const teken = req.params.teken.toLowerCase();
  if (!ALLE_TEKENS.includes(teken)) {
    res.status(400).json({ error: `Ongeldig teken. Gebruik: ${ALLE_TEKENS.join(', ')}` }); return;
  }
  const vandaag = new Date().toISOString().slice(0, 10);
  const cache = leesHoroscoopCache(vandaag) as Record<string, unknown> | null;
  if (!cache) { res.status(503).json({ error: 'Cache nog niet beschikbaar' }); return; }
  const tekens = cache.tekens as Record<string, unknown>;
  res.json({ datum: vandaag, ...(tekens[teken] as object) });
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

app.listen(PORT, () => {
  console.log(`Tarot server draait op http://localhost:${PORT}`);
  console.log(`API beschikbaar op http://localhost:${PORT}/api/cards`);
});
