#!/usr/bin/env node
/**
 * Verdiept de Lenormand-combinaties: per paar een duiding in de liefde, in werk en een advies.
 * Gebruikt de bestaande duiding (public/lenormand/combinaties.json), onze kaartbetekenissen
 * en de opgehaalde bronnen (cache/bronnen/paren.json). Eigen woorden, nooit letterlijk overnemen.
 *
 *   node node_modules/.bin/tsx scripts/combinaties-verdiepen.mjs --proef 5   → proef, alleen tonen
 *   node node_modules/.bin/tsx scripts/combinaties-verdiepen.mjs             → alle paren
 *
 * Tussenresultaat: cache/combinaties-verdieping.json (hervatbaar). Aan het eind worden de velden
 * l (liefde), w (werk) en ad (advies) aan public/lenormand/combinaties.json toegevoegd.
 */
import OpenAI from 'openai';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { lenormandKaarten } from '../src/data/lenormand/kaarten.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
config({ path: join(ROOT, '.env') });

const BRON = join(ROOT, 'public/lenormand/combinaties.json');
const TUSSEN = join(ROOT, 'cache/combinaties-verdieping.json');
const BRONNEN = join(ROOT, 'cache/bronnen/paren.json');
const PER_CALL = 15;
const GELIJKTIJDIG = 4;
const bronnen = existsSync(BRONNEN) ? JSON.parse(readFileSync(BRONNEN, 'utf-8')) : {};

const proefIdx = process.argv.indexOf('--proef');
const proef = proefIdx > 0 ? parseInt(process.argv[proefIdx + 1] || '5', 10) : 0;

const kaart = (id) => lenormandKaarten.find((k) => k.id === id);

const SYSTEEM = `Je bent een ervaren Nederlandse Lenormand-lezer en docent op een leerplatform.
Bij elk kaartpaar staat al een algemene duiding. Schrijf daarbij drie korte aanvullingen:
- "l": wat de combinatie betekent IN DE LIEFDE (relaties, gevoelens, daten)
- "w": wat de combinatie betekent IN WERK (baan, collega's, zaken, geld)
- "ad": een concreet ADVIES voor de vrager (wat kun je het beste doen of laten)
Regels:
- Elk veld 1 à 2 zinnen (max ±30 woorden), concreet, warm en herkenbaar; spreek de lezer aan met je/jij.
- Volgorde telt: de EERSTE kaart is het onderwerp, de TWEEDE kleurt het.
- Sluit aan bij de algemene duiding en wat de bronnen zeggen, maar herhaal de algemene duiding niet letterlijk.
- Schrijf in EIGEN woorden; neem nooit zinnen uit de bronnen over.
- De Man (28) en De Vrouw (29) zijn personen. Verder geen aannames over geslacht of "mannelijke/vrouwelijke energie".
- Geen stellige of angstaanjagende voorspellingen; geen medische of financiële garanties.
Antwoord als JSON: {"paren": [{"a": <id>, "b": <id>, "l": "...", "w": "...", "ad": "..."}]} in dezelfde volgorde als gevraagd.`;

function bronTekst(a, b) {
  return (bronnen[`${a}-${b}`] || [])
    .map((x) => `   [${x.bron}]${x.kernwoorden ? ` kernwoorden: ${x.kernwoorden}.` : ''} ${x.tekst.replace(/\s+/g, ' ').slice(0, 700)}`)
    .join('\n');
}

async function verdiep(openai, paren) {
  const lijst = paren.map((p, i) => {
    const k1 = kaart(p.a); const k2 = kaart(p.b);
    return `${i + 1}. ${k1.naam} (${p.a}) + ${k2.naam} (${p.b})\n   ALGEMEEN: ${p.m}\n   KERNWOORDEN: ${(p.k || []).join(', ')}\n` +
      `   EERSTE kaart in liefde/werk: ${k1.liefde} / ${k1.werk}\n   TWEEDE kaart in liefde/werk: ${k2.liefde} / ${k2.werk}` +
      (bronTekst(p.a, p.b) ? `\n   BRONNEN:\n${bronTekst(p.a, p.b)}` : '');
  }).join('\n\n');
  const resp = await openai.chat.completions.create({
    model: 'gpt-5.5',
    messages: [{ role: 'system', content: SYSTEEM }, { role: 'user', content: `Verdiep deze ${paren.length} paren:\n\n${lijst}` }],
    max_completion_tokens: 16000,
    response_format: { type: 'json_object' },
  });
  const uit = JSON.parse(resp.choices[0].message.content || '{}').paren || [];
  const per = new Map(uit.map((x) => [`${x.a}-${x.b}`, x]));
  return paren.map((p) => {
    const x = per.get(`${p.a}-${p.b}`);
    if (!x?.l || !x?.w || !x?.ad) throw new Error(`Onvolledig voor ${p.a}-${p.b}`);
    return { a: p.a, b: p.b, l: String(x.l).trim(), w: String(x.w).trim(), ad: String(x.ad).trim() };
  });
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY ontbreekt');
  const openai = new OpenAI({ apiKey });
  const combinaties = JSON.parse(readFileSync(BRON, 'utf-8'));

  if (proef) {
    const voorkeur = [[14, 29], [24, 25], [25, 10], [19, 17]];
    const extra = combinaties.filter((x) => !voorkeur.some(([a, b]) => a === x.a && b === x.b)).sort(() => Math.random() - 0.5);
    const paren = [...voorkeur.map(([a, b]) => combinaties.find((x) => x.a === a && x.b === b)), ...extra].slice(0, proef);
    for (const n of await verdiep(openai, paren)) {
      const c = combinaties.find((x) => x.a === n.a && x.b === n.b);
      console.log(`\n${kaart(n.a).naam} + ${kaart(n.b).naam}\n  ALGEMEEN: ${c.m}\n  LIEFDE:   ${n.l}\n  WERK:     ${n.w}\n  ADVIES:   ${n.ad}`);
    }
    return;
  }

  const klaar = existsSync(TUSSEN) ? JSON.parse(readFileSync(TUSSEN, 'utf-8')) : [];
  const gedaan = new Set(klaar.map((x) => `${x.a}-${x.b}`));
  const todo = combinaties.filter((x) => !gedaan.has(`${x.a}-${x.b}`));
  console.log(`${klaar.length} al klaar, ${todo.length} te gaan`);

  const blokken = [];
  for (let i = 0; i < todo.length; i += PER_CALL) blokken.push(todo.slice(i, i + PER_CALL));
  const werker = async () => {
    while (blokken.length) {
      const blok = blokken.shift();
      for (let poging = 1; ; poging++) {
        try {
          klaar.push(...await verdiep(openai, blok));
          writeFileSync(TUSSEN, JSON.stringify(klaar));
          console.log(`  ${klaar.length}/${combinaties.length}`);
          break;
        } catch (e) {
          if (poging >= 3) throw e;
          console.warn(`  poging ${poging} mislukt: ${e.message} — opnieuw`);
        }
      }
    }
  };
  await Promise.all(Array.from({ length: GELIJKTIJDIG }, werker));
  if (klaar.length < combinaties.length) throw new Error(`Niet compleet: ${klaar.length}/${combinaties.length}`);

  const per = new Map(klaar.map((x) => [`${x.a}-${x.b}`, x]));
  mkdirSync(join(ROOT, 'cache/archief'), { recursive: true });
  copyFileSync(BRON, join(ROOT, `cache/archief/combinaties-voor-verdieping-${new Date().toISOString().slice(0, 10)}.json`));
  const resultaat = combinaties.map((c) => {
    const v = per.get(`${c.a}-${c.b}`);
    return { ...c, l: v.l, w: v.w, ad: v.ad };
  });
  writeFileSync(BRON, JSON.stringify(resultaat));
  console.log(`Klaar: ${resultaat.length} combinaties verdiept in ${BRON}`);
}

main().catch((e) => { console.error('FOUT:', e.message); process.exit(1); });
