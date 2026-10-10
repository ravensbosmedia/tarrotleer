// Lenormand-quiz: vragen worden per ronde willekeurig samengesteld uit
// de 36 kaarten, de 1260 combinaties en de handgeschreven basisvragen.
// Zo is elke ronde anders en staat het goede antwoord niet steeds op dezelfde plek.
import { LenormandKaart } from '../../types/lenormand';
import { lenormandKaarten } from './kaarten';
import { lenormandQuizVragen } from './quiz';
import type { Combinatie } from './combinaties';

export interface QuizVraag {
  soort: string;
  vraag: string;
  /** optioneel citaat dat bij de vraag hoort (omschrijving waar je de kaart bij zoekt) */
  citaat?: string;
  opties: string[];
  correct: number;
  uitleg: string;
  /** kaarten waar deze vraag over gaat (voor de voortgang per kaart) */
  kaarten: number[];
  /** vaste code van de vraag, los van de geschudde opties: bv. 'vraag:nummer-kaart:14' */
  vraagId: string;
  /** leesbare naam van de vraag voor het voortgangsoverzicht */
  vraagLabel: string;
}

export type QuizOnderwerp = 'mix' | 'kaarten' | 'combinaties';
export type Niveau = 'beginner' | 'gevorderd' | 'pro';

// Niveau per vraagsoort (het deel na 'vraag:' in de vraagcode)
const NIVEAU_PER_SOORT: Record<string, Niveau> = {
  'nummer-kaart': 'beginner', 'kaart-nummer': 'beginner', 'woord-kaart': 'beginner', 'kaart-woorden': 'beginner', basis: 'beginner',
  'omschrijving-kaart': 'gevorderd', 'liefde-kaart': 'gevorderd', 'werk-kaart': 'gevorderd', 'gezondheid-kaart': 'gevorderd',
  'combi-betekenis': 'gevorderd', 'combi-paar': 'gevorderd',
  'kaart-liefde': 'pro', 'kaart-werk': 'pro', 'combi-liefde': 'pro', 'combi-werk': 'pro', 'combi-advies': 'pro',
};

/** Niveau van een vraag op basis van zijn vaste code, bv. 'vraag:combi-advies:14-29' → 'pro'. */
export function niveauVan(vraagId: string): Niveau {
  return NIVEAU_PER_SOORT[vraagId.split(':')[1]] ?? 'gevorderd';
}

function schud<T>(arr: T[]): T[] {
  const k = [...arr];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}


/** Zet het goede antwoord tussen de afleiders en schudt de volgorde. */
function maakVraag(soort: string, vraag: string, goed: string, fout: string[], uitleg: string, citaat?: string): QuizVraag {
  const opties = schud([goed, ...fout.slice(0, 3)]);
  return { soort, vraag, citaat, opties, correct: opties.indexOf(goed), uitleg, kaarten: [], vraagId: '', vraagLabel: vraag };
}

/** Drie andere kaarten dan de gegeven kaart(en). */
function andereKaarten(...uitsluiten: number[]): LenormandKaart[] {
  return schud(lenormandKaarten.filter((k) => !uitsluiten.includes(k.id))).slice(0, 3);
}

/** Vervangt de kaartnaam in een tekst door "deze kaart", zodat de tekst het antwoord niet verraadt. */
function verbergNaam(tekst: string, kaart: LenormandKaart): string {
  const kaal = kaart.naam.replace(/^(De|Het) /, '');
  return tekst
    .replace(new RegExp(`\\b(De|Het) ${kaal}\\b`, 'g'), 'Deze kaart')
    .replace(new RegExp(`\\b(de|het) ${kaal}\\b`, 'g'), 'deze kaart')
    .replace(new RegExp(`\\b${kaal}\\b`, 'g'), 'deze kaart');
}

const paarLabel = (c: Combinatie) => `${kaart(c.a).naam} + ${kaart(c.b).naam}`;
const kaart = (id: number) => lenormandKaarten.find((k) => k.id === id)!;

/** Sleutelwoorden die bij geen enkele andere kaart voorkomen. */
function uniekeSleutelwoorden(k: LenormandKaart): string[] {
  return k.sleutelwoorden.filter(
    (w) => !lenormandKaarten.some((o) => o.id !== k.id && o.sleutelwoorden.includes(w)),
  );
}

// ── Vraagsoorten over losse kaarten ──
// Elke maker geeft voor een kaart alle vragen die hij kan stellen; de ronde kiest er één uit.
type KaartVraagMaker = (k: LenormandKaart) => QuizVraag[];
const metId = (v: QuizVraag, id: string, label: string, kaartId: number): QuizVraag =>
  ({ ...v, vraagId: `vraag:${id}`, vraagLabel: label, kaarten: [kaartId] });

const GEBIEDEN = [['liefde', 'in de liefde'], ['werk', 'in werk'], ['gezondheid', 'bij gezondheid']] as const;

const kaartVragen: KaartVraagMaker[] = [
  // Nummer → kaart
  (k) => [metId(maakVraag('nummer', `Welke kaart heeft nummer ${k.id}?`, k.naam,
    andereKaarten(k.id).map((o) => o.naam),
    `Kaart ${k.id} is ${k.naam} ${k.symbool}.`), `nummer-kaart:${k.id}`, `Welke kaart heeft nummer ${k.id}?`, k.id)],

  // Kaart → nummer (afleiders dichtbij het echte nummer)
  (k) => {
    const dichtbij = schud([-3, -2, -1, 1, 2, 3].map((d) => k.id + d).filter((n) => n >= 1 && n <= 36)).slice(0, 3);
    return [metId(maakVraag('nummer', `Welk nummer heeft ${k.naam} ${k.symbool}?`, String(k.id), dichtbij.map(String),
      `${k.naam} is kaart ${k.id} van het deck.`), `kaart-nummer:${k.id}`, `Welk nummer heeft ${k.naam}?`, k.id)];
  },

  // Sleutelwoord → kaart (één vraag per uniek sleutelwoord)
  (k) => uniekeSleutelwoorden(k).map((woord) => metId(
    maakVraag('sleutelwoord', `Bij welke kaart hoort het sleutelwoord „${woord}”?`, k.naam,
      andereKaarten(k.id).map((o) => o.naam),
      `„${woord}” is een sleutelwoord van ${k.naam}. Alle sleutelwoorden: ${k.sleutelwoorden.join(', ')}.`),
    `woord-kaart:${k.id}:${woord}`, `Bij welke kaart hoort „${woord}”? (${k.naam})`, k.id)),

  // Kaart → sleutelwoorden
  (k) => {
    const rijtje = (x: LenormandKaart) => schud(x.sleutelwoorden).slice(0, 3).join(', ');
    return [metId(maakVraag('sleutelwoord', `Welke sleutelwoorden horen bij ${k.naam} ${k.symbool}?`, rijtje(k),
      andereKaarten(k.id).map(rijtje),
      `${k.naam}: ${k.sleutelwoorden.join(', ')}.`), `kaart-woorden:${k.id}`, `Welke sleutelwoorden horen bij ${k.naam}?`, k.id)];
  },

  // Omschrijving → kaart
  (k) => [metId(maakVraag('betekenis', 'Welke kaart past bij deze omschrijving?', k.naam,
    andereKaarten(k.id).map((o) => o.naam),
    k.betekenis, verbergNaam(k.betekenis, k)), `omschrijving-kaart:${k.id}`, `Welke kaart past bij de omschrijving? (${k.naam})`, k.id)],

  // Liefde / werk / gezondheid → kaart
  (k) => GEBIEDEN.map(([veld, label]) => metId(
    maakVraag('levensgebied', `Welke kaart betekent dit ${label}?`, k.naam,
      andereKaarten(k.id).map((o) => o.naam),
      `${k.naam} ${label}: ${k[veld]}`, verbergNaam(k[veld], k)),
    `${veld}-kaart:${k.id}`, `Welke kaart betekent dit ${label}? (${k.naam})`, k.id)),

  // Kaart → betekenis in een levensgebied
  (k) => GEBIEDEN.slice(0, 2).map(([veld, label]) => metId(
    maakVraag('levensgebied', `Wat betekent ${k.naam} ${k.symbool} ${label}?`, verbergNaam(k[veld], k),
      andereKaarten(k.id).map((o) => verbergNaam(o[veld], o)),
      `${k.naam} ${label}: ${k[veld]}`),
    `kaart-${veld}:${k.id}`, `Wat betekent ${k.naam} ${label}?`, k.id)),
];

// ── Vraagsoorten over combinaties ──
type CombiRichting = 'betekenis' | 'paar' | 'liefde' | 'werk' | 'advies';
const VERDIEPING = {
  liefde: { veld: 'l', vraag: 'in de liefde', label: 'in de liefde' },
  werk: { veld: 'w', vraag: 'in werk', label: 'in werk' },
  advies: { veld: 'ad', vraag: '', label: 'advies' },
} as const;

/** Welke vraagrichtingen kunnen voor dit paar (liefde/werk/advies alleen als de verdieping er is). */
function combiRichtingen(c: Combinatie): CombiRichting[] {
  return ['betekenis', 'paar', ...(['liefde', 'werk', 'advies'] as const).filter((r) => c[VERDIEPING[r].veld])];
}

function combinatieVraag(c: Combinatie, alle: Combinatie[], richting: CombiRichting): QuizVraag {
  // Afleiders bij voorkeur met één gedeelde kaart: dat maakt het echt nadenken
  const verwant = schud(alle.filter((x) => x !== c && (x.a === c.a || x.b === c.b)));
  const afleiders = [...verwant, ...schud(alle)].filter((x, i, arr) => x !== c && arr.indexOf(x) === i).slice(0, 3);
  const k1 = kaart(c.a);
  const k2 = kaart(c.b);
  const uitleg = `${k1.naam} ${k1.symbool} + ${k2.naam} ${k2.symbool}: ${c.m}`;
  const basis = { kaarten: [c.a, c.b] };

  if (richting === 'liefde' || richting === 'werk' || richting === 'advies') {
    const { veld, vraag, label } = VERDIEPING[richting];
    const tekst = (x: Combinatie) => x[veld] as string | undefined;
    const fout = [...verwant, ...schud(alle)].filter((x, i, arr) => x !== c && tekst(x) && arr.indexOf(x) === i).slice(0, 3).map((x) => tekst(x)!);
    const titel = richting === 'advies'
      ? `Welk advies hoort bij ${k1.naam} ${k1.symbool} + ${k2.naam} ${k2.symbool}?`
      : `Wat betekent ${k1.naam} ${k1.symbool} + ${k2.naam} ${k2.symbool} ${vraag}?`;
    return { ...maakVraag('combinatie', titel, tekst(c)!, fout, `${uitleg}\n${label[0].toUpperCase()}${label.slice(1)}: ${tekst(c)}`), ...basis,
      vraagId: `vraag:combi-${richting}:${c.a}-${c.b}`,
      vraagLabel: richting === 'advies' ? `Welk advies hoort bij ${k1.naam} + ${k2.naam}?` : `Wat betekent ${k1.naam} + ${k2.naam} ${vraag}?` };
  }

  if (richting === 'betekenis') {
    return { ...maakVraag('combinatie', `Wat betekent de combinatie ${k1.naam} ${k1.symbool} + ${k2.naam} ${k2.symbool}?`,
      c.m, afleiders.map((x) => x.m), uitleg), ...basis,
      vraagId: `vraag:combi-betekenis:${c.a}-${c.b}`, vraagLabel: `Wat betekent ${k1.naam} + ${k2.naam}?` };
  }
  return { ...maakVraag('combinatie', 'Welk kaartpaar hoort bij deze betekenis?', paarLabel(c),
    afleiders.map(paarLabel), uitleg, c.m), ...basis,
    vraagId: `vraag:combi-paar:${c.a}-${c.b}`, vraagLabel: `Welk kaartpaar hoort bij de betekenis van ${k1.naam} + ${k2.naam}?` };
}

/** Hoeveel verschillende vragen de quiz kan stellen (voor "x van y gedaan"). */
export function aantalMogelijkeVragen(combinaties: Combinatie[], niveau?: Niveau): number {
  const telt = (id: string) => !niveau || niveauVan(id) === niveau;
  const perKaart = lenormandKaarten.reduce((n, k) => n + kaartVragen.reduce((m, maker) => m + maker(k).filter((v) => telt(v.vraagId)).length, 0), 0);
  const perCombi = combinaties.reduce((n, c) => n + combiRichtingen(c).filter((r) => telt(`vraag:combi-${r}:`)).length, 0);
  return perKaart + perCombi + (telt('vraag:basis:') ? lenormandQuizVragen.length : 0);
}

/** Gewicht per voortgangssleutel ('kaart:14'): hoger = vaker vragen. Zonder voortgang: alles gelijk. */
export type Gewicht = (sleutel: string) => number;

/** Schudt met gewichten: zwaardere items komen vaker vooraan (Efraimidis–Spirakis). */
function gewogenSchud<T>(lijst: T[], gewicht: (x: T) => number): T[] {
  return lijst
    .map((x) => ({ x, k: Math.pow(Math.random(), 1 / Math.max(0.01, gewicht(x))) }))
    .sort((a, b) => b.k - a.k)
    .map((e) => e.x);
}

/**
 * Stelt een ronde samen van `aantal` vragen. Combinaties zijn optioneel (lazy geladen).
 * Met `gewicht` komen kaarten die vaak fout gaan (of nog nooit gevraagd zijn) vaker voorbij.
 */
export function maakRonde(
  aantal: number, onderwerp: QuizOnderwerp, combinaties: Combinatie[] | null,
  gewicht: Gewicht = () => 1, niveau?: Niveau,
): QuizVraag[] {
  const past = (vraagId: string) => !niveau || niveauVan(vraagId) === niveau;
  // Beginners krijgen nog geen combinaties; pro-rondes bestaan vooral uit combinaties
  const metCombinaties = onderwerp !== 'kaarten' && niveau !== 'beginner' && combinaties && combinaties.length > 0;
  const aandeelCombi = niveau === 'pro' ? 0.6 : 0.35;
  const aantalCombi = !metCombinaties ? 0 : onderwerp === 'combinaties' ? aantal : Math.round(aantal * aandeelCombi);
  const aantalBasis = onderwerp !== 'combinaties' && past('vraag:basis:') ? Math.min(3, aantal - aantalCombi) : 0;
  const aantalKaart = aantal - aantalCombi - aantalBasis;

  const vragen: QuizVraag[] = [];

  // Losse kaarten: elke kaart hooguit één keer per ronde. Uit alle mogelijke vragen over die kaart
  // krijgen vragen die nog nooit gesteld zijn of vaak fout gaan voorrang.
  for (const k of gewogenSchud(lenormandKaarten, (x) => gewicht(`kaart:${x.id}`))) {
    if (vragen.length >= aantalKaart) break;
    const kandidaten = kaartVragen.flatMap((maker) => maker(k)).filter((v) => past(v.vraagId));
    if (kandidaten.length) vragen.push(gewogenSchud(kandidaten, (v) => gewicht(v.vraagId))[0]);
  }

  // Combinaties: geen enkel paar twee keer
  if (metCombinaties) {
    const paarGewicht = (c: Combinatie) => (gewicht(`kaart:${c.a}`) + gewicht(`kaart:${c.b}`)) / 2;
    for (const c of gewogenSchud(combinaties!, paarGewicht).slice(0, aantalCombi)) {
      const richtingen = combiRichtingen(c).filter((r) => past(`vraag:combi-${r}:`));
      if (!richtingen.length) continue;
      const richting = gewogenSchud(richtingen, (r) => gewicht(`vraag:combi-${r}:${c.a}-${c.b}`))[0];
      vragen.push(combinatieVraag(c, combinaties!, richting));
    }
  }

  // Een paar handgeschreven basisvragen, met geschudde opties
  for (const b of schud(lenormandQuizVragen).slice(0, aantalBasis)) {
    vragen.push({ ...maakVraag('basis', b.vraag, b.opties[b.correct], b.opties.filter((_, i) => i !== b.correct), b.uitleg), vraagId: `vraag:basis:${b.id}` });
  }

  return schud(vragen);
}
