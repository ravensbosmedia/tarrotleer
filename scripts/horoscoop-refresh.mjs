#!/usr/bin/env node
/**
 * Dagelijkse horoscoop refresh — scrapet horoscope.com (EN) voor alle 12 tekens,
 * vertaalt naar Nederlands via OpenAI, slaat op in cache/horoscoop-YYYY-MM-DD.json
 *
 * Uitvoeren: node scripts/horoscoop-refresh.mjs
 * Cron via PM2: elke nacht 00:05
 */

import { getHoroscope } from 'horoscopefree';
import OpenAI from 'openai';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_DIR = join(ROOT, 'cache');

const TEKENS = [
  'aries','taurus','gemini','cancer',
  'leo','virgo','libra','scorpio',
  'sagittarius','capricorn','aquarius','pisces'
];

const TEKEN_NL = {
  aries: 'Ram', taurus: 'Stier', gemini: 'Tweelingen', cancer: 'Kreeft',
  leo: 'Leeuw', virgo: 'Maagd', libra: 'Weegschaal', scorpio: 'Schorpioen',
  sagittarius: 'Boogschutter', capricorn: 'Steenbok', aquarius: 'Waterman', pisces: 'Vissen'
};

async function vertaalBatch(teksten, openai) {
  const invoer = teksten.map((t, i) => `${i+1}. ${t}`).join('\n\n');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Vertaal de volgende ${teksten.length} horoscoop-teksten naar vloeiend Nederlands.
Bewaar de nummering. Geef ALLEEN de vertalingen terug, niets anders.

${invoer}`
    }],
    temperature: 0.3,
    max_tokens: 2000,
  });

  const uitvoer = response.choices[0].message.content;
  const regels = uitvoer.split(/\n\n+/);
  return regels.map(r => r.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  const vandaag = new Date().toISOString().slice(0, 10);
  console.log(`[horoscoop-refresh] ${vandaag} — starten...`);
  if (!apiKey) console.warn('  ⚠ OPENAI_API_KEY niet ingesteld — opslaan zonder vertaling');

  mkdirSync(CACHE_DIR, { recursive: true });

  // Scrape alle 12 tekens (lib heeft ingebouwde throttle)
  console.log('Scrapen van horoscope.com...');
  const resultaten = [];
  for (const teken of TEKENS) {
    try {
      const r = await getHoroscope(teken, vandaag, 'en');
      resultaten.push({ teken, tekst_en: r.text });
      console.log(`  ✓ ${teken}`);
    } catch (e) {
      console.error(`  ✗ ${teken}: ${e.message}`);
      resultaten.push({ teken, tekst_en: null });
    }
  }

  // Vertaal in één batch (als key beschikbaar)
  let vertalingen = [];
  const teVertalen = resultaten.filter(r => r.tekst_en);
  if (apiKey && teVertalen.length > 0) {
    try {
      console.log('Vertalen naar Nederlands...');
      const openai = new OpenAI({ apiKey });
      vertalingen = await vertaalBatch(teVertalen.map(r => r.tekst_en), openai);
      console.log(`  ✓ ${vertalingen.length} teksten vertaald`);
    } catch (e) {
      console.error('  ✗ Vertaling mislukt:', e.message);
    }
  }

  // Bouw cache object
  const cache = { datum: vandaag, gegenereerd: new Date().toISOString(), tekens: {} };
  let vi = 0;
  for (const r of resultaten) {
    const vertaald = r.tekst_en && vertalingen[vi] ? vertalingen[vi++] : null;
    cache.tekens[r.teken] = {
      slug: r.teken,
      naam: TEKEN_NL[r.teken],
      tekst_nl: vertaald ?? r.tekst_en,
      tekst_en: r.tekst_en,
    };
  }

  const pad = join(CACHE_DIR, `horoscoop-${vandaag}.json`);
  writeFileSync(pad, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`[horoscoop-refresh] Opgeslagen → ${pad}`);
}

main().catch(e => {
  console.error('[horoscoop-refresh] FOUT:', e.message);
  process.exit(1);
});
