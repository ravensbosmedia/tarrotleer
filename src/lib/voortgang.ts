// Voortgang per account (opgeslagen op de server)
import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoortgangItem<T = Record<string, unknown>> {
  onderdeel: string;
  item: string;
  data: T;
  bijgewerkt: string;
}

export interface QuizAntwoord {
  /** bv. 'kaart:14' of 'vraag:3' */
  sleutel: string;
  /** leesbare naam voor het overzicht, bv. 'De Vos' of de vraagtekst */
  label: string;
  goed: boolean;
}

export interface QuizResultaat {
  rondes: number;
  beste_pct: number;
  beste_score: { score: number; totaal: number } | null;
  laatste: { score: number; totaal: number; datum: string; [k: string]: unknown } | null;
  totaal_goed: number;
  totaal_vragen: number;
  nieuw_record?: boolean;
}

export interface QuizStat {
  onderdeel: string;
  sleutel: string;
  label: string;
  goed: number;
  fout: number;
  laatst: string;
}

export async function haalAlleVoortgang(): Promise<VoortgangItem[]> {
  try {
    const r = await fetch('/api/voortgang');
    return r.ok ? r.json() : [];
  } catch {
    return [];
  }
}

export async function haalVoortgang<T = Record<string, unknown>>(onderdeel: string, item: string): Promise<T | null> {
  const lijst = await haalAlleVoortgang();
  return (lijst.find((v) => v.onderdeel === onderdeel && v.item === item)?.data as T) ?? null;
}

export async function slaVoortgangOp(onderdeel: string, item: string, data: unknown): Promise<boolean> {
  try {
    const r = await fetch('/api/voortgang', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onderdeel, item, data }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

/** Bewaart een quizronde: goed/fout per sleutel en de score. `ronde: false` telt alleen antwoorden. */
export async function slaRondeOp(
  onderdeel: string, score: number, totaal: number, antwoorden: QuizAntwoord[],
  opties: { ronde?: boolean; extra?: Record<string, unknown> } = {},
): Promise<QuizResultaat | null> {
  try {
    const r = await fetch('/api/quiz/ronde', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onderdeel, score, totaal, antwoorden, ronde: opties.ronde !== false, extra: opties.extra }),
    });
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}

export async function haalQuizStats(onderdeel?: string): Promise<QuizStat[]> {
  try {
    const r = await fetch('/api/quiz/stats');
    if (!r.ok) return [];
    const lijst: QuizStat[] = await r.json();
    return onderdeel ? lijst.filter((s) => s.onderdeel === onderdeel) : lijst;
  } catch {
    return [];
  }
}

/**
 * Gewicht per sleutel om zwakke onderdelen vaker te vragen:
 * nog nooit gevraagd = 2, vaak fout = tot 4, altijd goed = 0.5.
 */
export function maakGewicht(stats: QuizStat[]): (sleutel: string) => number {
  const per = new Map(stats.map((s) => [s.sleutel, s]));
  return (sleutel) => {
    const s = per.get(sleutel);
    if (!s) return 2;
    const totaal = s.goed + s.fout;
    return 0.5 + 3.5 * (s.fout + 0.5) / (totaal + 1);
  };
}

/** Percentage goed, of null als er te weinig antwoorden zijn. */
export function pctGoed(s: QuizStat, minimaal = 1): number | null {
  const n = s.goed + s.fout;
  return n >= minimaal ? Math.round((s.goed / n) * 100) : null;
}

/**
 * Voor de cursusmodules: bewaart de quiz zodra hij wordt ingediend.
 * `antwoorden` mag een array of object zijn (index → gekozen optie).
 */
export function useCursusQuizOpslaan(
  module: string,
  vragen: { vraag: string; juist: number }[],
  antwoorden: Record<number, number | null> | (number | null)[],
  ingediend: boolean,
) {
  const opgeslagen = useRef(false);
  useEffect(() => {
    if (!ingediend) { opgeslagen.current = false; return; }
    if (opgeslagen.current) return;
    opgeslagen.current = true;
    const lijst: QuizAntwoord[] = vragen.map((v, i) => ({
      sleutel: `vraag:${i}`,
      label: v.vraag,
      goed: (antwoorden as Record<number, number | null>)[i] === v.juist,
    }));
    const score = lijst.filter((a) => a.goed).length;
    slaRondeOp(`cursus-${module}`, score, vragen.length, lijst);
  }, [ingediend]); // eslint-disable-line react-hooks/exhaustive-deps
}

export async function verwijderVoortgang(onderdeel: string, item: string): Promise<boolean> {
  try {
    const r = await fetch(`/api/voortgang?onderdeel=${encodeURIComponent(onderdeel)}&item=${encodeURIComponent(item)}`, { method: 'DELETE' });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Alle items van één onderdeel (bv. 'tarot-lessen' → per les { voltooid: true }),
 * met functies om een item te zetten of te verwijderen. Wijzigingen worden direct getoond.
 */
export function useOnderdeelVoortgang<T = Record<string, unknown>>(onderdeel: string) {
  const [items, setItems] = useState<Map<string, T>>(new Map());
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    let actief = true;
    haalAlleVoortgang().then((lijst) => {
      if (!actief) return;
      setItems(new Map(lijst.filter((v) => v.onderdeel === onderdeel).map((v) => [v.item, v.data as T])));
      setLaden(false);
    });
    return () => { actief = false; };
  }, [onderdeel]);

  const zet = useCallback((item: string, data: T) => {
    setItems((m) => new Map(m).set(item, data));
    return slaVoortgangOp(onderdeel, item, data);
  }, [onderdeel]);

  const verwijder = useCallback((item: string) => {
    setItems((m) => { const n = new Map(m); n.delete(item); return n; });
    return verwijderVoortgang(onderdeel, item);
  }, [onderdeel]);

  return { items, laden, zet, verwijder };
}

// ── Opgeslagen leggingen ──
export interface OpgeslagenKaart { id: number; naam: string; positie: string; omgekeerd?: boolean }
export interface OpgeslagenLegging {
  soort: 'tarot' | 'lenormand';
  legging: string;          // naam van de legging, bv. 'Keltisch Kruis'
  vraag: string;
  kaarten: OpgeslagenKaart[];
  duiding?: string;         // samenvattende duiding (tekst)
  duidingPerKaart?: string[];
  /** Lenormand: uitleg van de buur-duo's (kaart 1+2, 2+3, …) */
  verbindingen?: string[];
  datum: string;
}

/** Bewaart een legging bij het account en geeft het item-id terug (of null bij een fout). */
export async function bewaarLegging(legging: Omit<OpgeslagenLegging, 'datum'>): Promise<string | null> {
  const item = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const ok = await slaVoortgangOp('leggingen', item, { ...legging, datum: new Date().toISOString() });
  return ok ? item : null;
}

/** Schudt met gewichten: zwaardere items komen vaker vooraan (Efraimidis–Spirakis). */
export function gewogenSchud<T>(lijst: T[], gewicht: (x: T) => number): T[] {
  return lijst
    .map((x) => ({ x, k: Math.pow(Math.random(), 1 / Math.max(0.01, gewicht(x))) }))
    .sort((a, b) => b.k - a.k)
    .map((e) => e.x);
}
