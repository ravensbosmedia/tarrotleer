#!/usr/bin/env node
/**
 * Wekelijkse horoscoop generator — genereert spirituele weekhoroscopen voor alle 12 tekens
 * via OpenAI gpt-4o-mini, gecached als weekhoroscoop-YYYY-WW.json
 *
 * Uitvoeren: node scripts/weekhoroscoop-refresh.mjs
 * Plan: elke maandag 06:00
 */

import OpenAI from 'openai';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_DIR = join(ROOT, 'cache');

config({ path: join(ROOT, '.env') });

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

const TEKEN_INFO = {
  aries:       'Ram (21 mrt – 19 apr) • Vuur • Mars • Kardinaal',
  taurus:      'Stier (20 apr – 20 mei) • Aarde • Venus • Vast',
  gemini:      'Tweelingen (21 mei – 20 jun) • Lucht • Mercurius • Mutatief',
  cancer:      'Kreeft (21 jun – 22 jul) • Water • Maan • Kardinaal',
  leo:         'Leeuw (23 jul – 22 aug) • Vuur • Zon • Vast',
  virgo:       'Maagd (23 aug – 22 sep) • Aarde • Mercurius • Mutatief',
  libra:       'Weegschaal (23 sep – 22 okt) • Lucht • Venus • Kardinaal',
  scorpio:     'Schorpioen (23 okt – 21 nov) • Water • Pluto/Mars • Vast',
  sagittarius: 'Boogschutter (22 nov – 21 dec) • Vuur • Jupiter • Mutatief',
  capricorn:   'Steenbok (22 dec – 19 jan) • Aarde • Saturnus • Kardinaal',
  aquarius:    'Waterman (20 jan – 18 feb) • Lucht • Uranus • Vast',
  pisces:      'Vissen (19 feb – 20 mrt) • Water • Neptunus/Jupiter • Mutatief',
};

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return {
    week: Math.ceil(((d - yearStart) / 86400000 + 1) / 7),
    jaar: d.getUTCFullYear(),
  };
}

function weekDatums(jaar, week) {
  const jan4 = new Date(Date.UTC(jaar, 0, 4));
  const maandag = new Date(jan4);
  maandag.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1 + (week - 1) * 7);
  const zondag = new Date(maandag);
  zondag.setUTCDate(maandag.getUTCDate() + 6);
  const fmt = d => d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  return { van: fmt(maandag), tot: fmt(zondag), maandag, zondag };
}

async function genereerWeekhoroscopen(apiKey, jaar, week) {
  const openai = new OpenAI({ apiKey });
  const datums = weekDatums(jaar, week);
  const periode = `${datums.van} t/m ${datums.tot} ${jaar}`;

  console.log(`Genereren week ${week}/${jaar} (${periode})...`);
  const resultaten = {};

  for (const teken of TEKENS) {
    try {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Je bent een spirituele astroloog met een diepe kennis van de kosmos, numerologie en verborgen energieën.
Je schrijft weekhoroscopen in het Nederlands in de stijl van Paravisie: warm, mystiek, gelaagd en hoopvol.
Gebruik astrologische termen maar maak ze toegankelijk. Schrijf altijd in vloeiend, persoonlijk Nederlands.
Geen bulletpoints — vloeiende alinea's.`,
          },
          {
            role: 'user',
            content: `Schrijf een weekhoroscoop voor ${TEKEN_NL[teken]} (${TEKEN_INFO[teken]}) voor de week van ${periode}.

De horoscoop moet:
- 3-4 alinea's zijn (totaal ~250-300 woorden)
- Beginnen met de dominante energie van deze week voor dit teken
- Ingaan op: liefde/relaties, werk/financiën, persoonlijke groei/spiritualiteit
- Afsluiten met een krachtige boodschap of mantra voor de week
- Een mystieke, inspirerende toon hebben (Paravisie-stijl)

Schrijf ALLEEN de horoscooptekst, geen titel of introductie.`,
          },
        ],
        temperature: 0.85,
        max_tokens: 500,
      });

      resultaten[teken] = {
        slug: teken,
        naam: TEKEN_NL[teken],
        tekst: resp.choices[0].message.content?.trim() || '',
        periode,
      };
      console.log(`  ✓ ${TEKEN_NL[teken]}`);

      // Kleine pauze om rate limits te vermijden
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`  ✗ ${teken}:`, e.message);
      resultaten[teken] = { slug: teken, naam: TEKEN_NL[teken], tekst: '', periode };
    }
  }

  return resultaten;
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY niet ingesteld');
    process.exit(1);
  }

  const { week, jaar } = isoWeek(new Date());
  const weekKey = `${jaar}-W${String(week).padStart(2, '0')}`;
  const pad = join(CACHE_DIR, `weekhoroscoop-${weekKey}.json`);

  if (existsSync(pad)) {
    console.log(`[weekhoroscoop-refresh] Cache al aanwezig: ${pad}`);
    process.exit(0);
  }

  mkdirSync(CACHE_DIR, { recursive: true });

  const tekens = await genereerWeekhoroscopen(apiKey, jaar, week);

  const cache = {
    week,
    jaar,
    weekKey,
    periode: Object.values(tekens)[0]?.periode || '',
    gegenereerd: new Date().toISOString(),
    tekens,
  };

  writeFileSync(pad, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`[weekhoroscoop-refresh] Opgeslagen → ${pad}`);
}

main().catch(e => {
  console.error('[weekhoroscoop-refresh] FOUT:', e.message);
  process.exit(1);
});
