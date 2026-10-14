// Tekstgrootte van de leeromgeving (knop "Aa" in het menu). Per apparaat bewaard in localStorage.
// Werkt via CSS-zoom op <body> (index.css: html[data-tekst=…]), zodat ook vaste px-maten meeschalen.
import { useEffect, useState } from 'react';

export const TEKST_STANDEN = [
  { id: 'normaal', label: 'Normaal', factor: 1 },
  { id: 'groter', label: 'Groter', factor: 1.15 },
  { id: 'grootst', label: 'Extra groot', factor: 1.3 },
] as const;
export type TekstStand = typeof TEKST_STANDEN[number]['id'];
const SLEUTEL = 'zenflow-tekstgrootte';

export function leesTekstStand(): TekstStand {
  try {
    const w = localStorage.getItem(SLEUTEL);
    if (TEKST_STANDEN.some((s) => s.id === w)) return w as TekstStand;
  } catch { /* geen opslag beschikbaar */ }
  return 'normaal';
}

export function pasTekstStandToe(stand: TekstStand) {
  document.documentElement.dataset.tekst = stand;
}

export function useTekstStand(): [TekstStand, (s: TekstStand) => void] {
  const [stand, setStand] = useState<TekstStand>(leesTekstStand);
  useEffect(() => { pasTekstStandToe(stand); }, [stand]);
  const kies = (s: TekstStand) => {
    setStand(s);
    try { localStorage.setItem(SLEUTEL, s); } catch { /* niet bewaard, wel toegepast */ }
  };
  return [stand, kies];
}
