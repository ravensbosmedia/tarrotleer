#!/usr/bin/env node
/**
 * Schrijft de betekenis van alle Lenormand-kaartparen opnieuw met gpt-5.5,
 * gevoed met ONZE kaartbetekenissen (src/data/lenormand/kaarten.ts) én met wat de
 * opgehaalde bronnen zeggen (cache/bronnen/paren.json, zie scripts/bronnen_combinaties.py).
 * De bronnen worden in eigen woorden samengevat, nooit letterlijk overgenomen.
 *
 *   node node_modules/.bin/tsx scripts/combinaties-genereren.mjs --proef 8   → proef, alleen tonen
 *   node node_modules/.bin/tsx scripts/combinaties-genereren.mjs             → alle paren
 *
 * Volledige run schrijft tussentijds naar cache/combinaties-nieuw.json (hervatbaar)
 * en aan het eind naar public/lenormand/combinaties.json (oude versie → cache/archief/).
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
const TUSSEN = join(ROOT, 'cache/combinaties-nieuw.json');
const BRONNEN = join(ROOT, 'cache/bronnen/paren.json');
const PER_CALL = 20;
const GELIJKTIJDIG = 4;
const bronnen = existsSync(BRONNEN) ? JSON.parse(readFileSync(BRONNEN, 'utf-8')) : {};

const proefIdx = process.argv.indexOf('--proef');
const proef = proefIdx > 0 ? parseInt(process.argv[proefIdx + 1] || '8', 10) : 0;

const kaart = (id) => lenormandKaarten.find((k) => k.id === id);
const kort = (k) => `${k.naam} (${k.id}) — sleutelwoorden: ${k.sleutelwoorden.join(', ')}. Kern: ${k.betekenis.split('. ')[0]}.`;

const SYSTEEM = `Je bent een ervaren Nederlandse Lenormand-lezer en docent.
Je schrijft voor een leerplatform de betekenis van kaartcombinaties (twee kaarten naast elkaar).
Regels:
- Volgorde telt: de EERSTE kaart is het onderwerp, de TWEEDE kaart kleurt of beschrijft het (klassieke Lenormand-regel).
- Baseer je op de gegeven kernbetekenissen; schrijf concreet en herkenbaar, 1 à 2 zinnen (max ±35 woorden).
- De Man (28) en De Vrouw (29) zijn personen (de vrager of een belangrijke ander). Gebruik verder GEEN aannames over geslacht of "mannelijke/vrouwelijke energie".
- Geen sjabloonzinnen; elke combinatie moet echt iets eigens zeggen.
- Bij een paar staan soms fragmenten uit bronnen (Nederlandse en Engelse Lenormand-sites). Gebruik wat de bronnen
  gemeenschappelijk zeggen als belangrijkste basis, vul aan met de kernbetekenissen, en schrijf alles in EIGEN woorden
  (nooit zinnen letterlijk overnemen). Spreken bronnen elkaar tegen, kies de klassieke lezing.
- Geef bij elk paar 3 kernwoorden ("k", kort en eigen woorden, beginnend met hoofdletter) en 2 à 3 thema's ("t", kleine letters), bv. "liefde", "werk", "nieuws".
Antwoord als JSON: {"paren": [{"a": <id>, "b": <id>, "m": "<betekenis>", "k": ["...", "...", "..."], "t": ["...", "..."]}]} in dezelfde volgorde als gevraagd.`;

/** Bronfragmenten voor één paar, ingekort zodat een blok van 20 paren behapbaar blijft. */
function bronTekst(a, b) {
  const lijst = bronnen[`${a}-${b}`] || [];
  return lijst.map((x) => `   [${x.bron}]${x.kernwoorden ? ` kernwoorden: ${x.kernwoorden}.` : ''} ${x.tekst.replace(/\s+/g, ' ').slice(0, 550)}`).join('\n');
}

async function genereer(openai, paren) {
  const lijst = paren.map((p, i) => {
    const bron = bronTekst(p.a, p.b);
    return `${i + 1}. EERSTE: ${kort(kaart(p.a))}\n   TWEEDE: ${kort(kaart(p.b))}${bron ? `\n   BRONNEN:\n${bron}` : ''}`;
  }).join('\n\n');
  const resp = await openai.chat.completions.create({
    model: 'gpt-5.5',
    messages: [{ role: 'system', content: SYSTEEM }, { role: 'user', content: `Schrijf de betekenis van deze ${paren.length} paren:\n\n${lijst}` }],
    max_completion_tokens: 16000,
    response_format: { type: 'json_object' },
  });
  const uit = JSON.parse(resp.choices[0].message.content || '{}').paren || [];
  const per = new Map(uit.map((x) => [`${x.a}-${x.b}`, x]));
  return paren.map((p) => {
    const x = per.get(`${p.a}-${p.b}`);
    if (!x?.m) throw new Error(`Geen betekenis voor ${p.a}-${p.b}`);
    // b = bronnen (alleen naam + link) zodat de site kan tonen waar de duiding op steunt
    const b = [...new Map((bronnen[`${p.a}-${p.b}`] || []).map((y) => [y.bron, { n: y.bron, u: y.url }])).values()];
    return {
      a: p.a, b: p.b, m: String(x.m).trim(),
      k: Array.isArray(x.k) ? x.k.map(String).slice(0, 3) : [],
      t: Array.isArray(x.t) ? x.t.map(String).slice(0, 3) : [],
      ...(b.length ? { bronnen: b } : {}),
    };
  });
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY ontbreekt');
  const openai = new OpenAI({ apiKey });
  const oud = JSON.parse(readFileSync(BRON, 'utf-8'));
  const oudPer = new Map(oud.map((x) => [`${x.a}-${x.b}`, x.m]));

  if (proef) {
    // Proef: een paar paren waar de oude tekst duidelijk mis was, plus wat willekeurige
    const voorkeur = [[14, 29], [28, 29], [24, 25], [1, 27], [8, 24], [33, 35]];
    const extra = oud.filter((x) => !voorkeur.some(([a, b]) => a === x.a && b === x.b)).sort(() => Math.random() - 0.5);
    const paren = [...voorkeur.map(([a, b]) => ({ a, b })), ...extra].slice(0, proef);
    const nieuw = await genereer(openai, paren);
    for (const n of nieuw) {
      console.log(`\n${kaart(n.a).naam} + ${kaart(n.b).naam}`);
      console.log(`  OUD:   ${oudPer.get(`${n.a}-${n.b}`)}`);
      console.log(`  BRON:  ${(bronnen[`${n.a}-${n.b}`] || []).map((x) => `${x.bron}: ${x.kernwoorden || x.tekst.slice(0, 60)}`).join(' | ') || '—'}`);
      console.log(`  NIEUW: ${n.m}  {${n.k.join(', ')}} [${n.t.join(', ')}]`);
    }
    return;
  }

  mkdirSync(join(ROOT, 'cache/archief'), { recursive: true });
  const klaar = existsSync(TUSSEN) ? JSON.parse(readFileSync(TUSSEN, 'utf-8')) : [];
  const gedaan = new Set(klaar.map((x) => `${x.a}-${x.b}`));
  const todo = oud.filter((x) => !gedaan.has(`${x.a}-${x.b}`)).map(({ a, b }) => ({ a, b }));
  console.log(`${klaar.length} al klaar, ${todo.length} te gaan`);

  // Vier blokken tegelijk; na elk blok tussentijds opslaan (hervatbaar)
  const blokken = [];
  for (let i = 0; i < todo.length; i += PER_CALL) blokken.push(todo.slice(i, i + PER_CALL));
  const werker = async () => {
    while (blokken.length) {
      const blok = blokken.shift();
      for (let poging = 1; ; poging++) {
        try {
          klaar.push(...await genereer(openai, blok));
          writeFileSync(TUSSEN, JSON.stringify(klaar));
          console.log(`  ${klaar.length}/${oud.length}`);
          break;
        } catch (e) {
          if (poging >= 3) throw e;
          console.warn(`  poging ${poging} mislukt: ${e.message} — opnieuw`);
        }
      }
    }
  };
  await Promise.all(Array.from({ length: GELIJKTIJDIG }, werker));
  if (klaar.length < oud.length) throw new Error(`Niet compleet: ${klaar.length}/${oud.length}`);

  // Zelfde volgorde als de bron; betrouwbaarheidsveld vervalt (was overal "hoog")
  const per = new Map(klaar.map((x) => [`${x.a}-${x.b}`, x]));
  const resultaat = oud.map((x) => per.get(`${x.a}-${x.b}`));
  copyFileSync(BRON, join(ROOT, `cache/archief/combinaties-oud-${new Date().toISOString().slice(0, 10)}.json`));
  writeFileSync(BRON, JSON.stringify(resultaat));
  console.log(`Klaar: ${resultaat.length} combinaties geschreven naar ${BRON}`);
}

main().catch((e) => { console.error('FOUT:', e.message); process.exit(1); });
