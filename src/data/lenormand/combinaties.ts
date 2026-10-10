// Lenormand 2-kaart combinaties — afgeleid van AuraLine's combinations-database.
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
  /** betrouwbaarheid (bijv. 'hoog', 'zeer hoog') */
  c: string;
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
