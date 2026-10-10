// Lenormand 2-kaart combinaties — eigen synthese (gpt-5.5) op basis van onze kaartbetekenissen
// en de opgehaalde bronnen (online-orakels.nl, labyrinthos.co); zie scripts/combinaties-genereren.mjs.
// Het JSON-bestand staat in public/lenormand/combinaties.json (lazy fetch).

export interface Combinatie {
  /** id van de eerste kaart */
  a: number;
  /** id van de tweede kaart */
  b: number;
  /** betekenis van het paar */
  m: string;
  /** thema's */
  t: string[];
  /** drie kernwoorden */
  k?: string[];
  /** betekenis in de liefde */
  l?: string;
  /** betekenis in werk */
  w?: string;
  /** advies */
  ad?: string;
  /** bronnen waarop de duiding steunt (naam + link) */
  bronnen?: { n: string; u: string }[];
  /** oud veld (betrouwbaarheid), niet meer gebruikt */
  c?: string;
}

let cache: Combinatie[] | null = null;
let laden: Promise<Combinatie[]> | null = null;

/** Laadt (en cachet) de volledige combinatie-database. */
export async function laadCombinaties(): Promise<Combinatie[]> {
  if (cache) return cache;
  if (!laden) {
    laden = fetch('/lenormand/combinaties.json')
      .then((r) => {
        if (!r.ok) throw new Error('combinaties.json niet gevonden');
        return r.json();
      })
      .then((d: Combinatie[]) => {
        cache = d;
        return d;
      });
  }
  return laden;
}

/** Zoekt de betekenis voor het geordende paar (a → b). */
export function vindCombinatie(
  lijst: Combinatie[],
  a: number,
  b: number
): Combinatie | undefined {
  return lijst.find((c) => c.a === a && c.b === b);
}
