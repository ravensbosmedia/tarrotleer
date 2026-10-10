// Voortgang per account (opgeslagen op de server)
import { useEffect, useRef } from 'react';

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
