import { useEffect, useState } from 'react';

export type Abonnement = 'gratis' | 'maand' | 'jaar';

export interface Lid {
  id: number;
  email: string;
  naam: string;
  rol: 'lid' | 'admin';
  abonnement: Abonnement;
  abonnement_tot: string | null;
  abonnement_actief: Abonnement;
  aangemaakt: string;
  laatst_ingelogd: string | null;
  actief: boolean;
}

export const ABONNEMENT_LABEL: Record<Abonnement, string> = {
  gratis: 'Gratis',
  maand: 'Maandabonnement',
  jaar: 'Jaarabonnement',
};

// Eén keer per paginabezoek ophalen en delen tussen componenten
let cache: Promise<Lid | null> | null = null;

export function haalAccount(vernieuw = false): Promise<Lid | null> {
  if (!cache || vernieuw) {
    cache = fetch('/api/auth/ik')
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return cache;
}

export function useAccount(): { lid: Lid | null; laden: boolean } {
  const [lid, setLid] = useState<Lid | null>(null);
  const [laden, setLaden] = useState(true);
  useEffect(() => {
    let actief = true;
    haalAccount().then((l) => { if (actief) { setLid(l); setLaden(false); } });
    return () => { actief = false; };
  }, []);
  return { lid, laden };
}

export async function uitloggen() {
  await fetch('/api/auth/uitloggen', { method: 'POST' });
  window.location.href = '/';
}

export function datumNL(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : `${iso.replace(' ', 'T')}Z`);
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}
