// Voortgang per account (opgeslagen op de server via /api/voortgang)

export interface VoortgangItem<T = Record<string, unknown>> {
  onderdeel: string;
  item: string;
  data: T;
  bijgewerkt: string;
}

export async function haalVoortgang<T = Record<string, unknown>>(onderdeel: string, item: string): Promise<T | null> {
  try {
    const r = await fetch('/api/voortgang');
    if (!r.ok) return null;
    const lijst: VoortgangItem<T>[] = await r.json();
    return lijst.find((v) => v.onderdeel === onderdeel && v.item === item)?.data ?? null;
  } catch {
    return null;
  }
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
