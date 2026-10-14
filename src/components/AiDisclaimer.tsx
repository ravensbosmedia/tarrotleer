// Disclaimer bij AI-duidingen. De tekst is aan te passen door beheerders op /admin/teksten.
import React, { useEffect, useState } from 'react';

let teksten: Promise<Record<string, string>> | null = null;
export function haalTeksten(): Promise<Record<string, string>> {
  if (!teksten) teksten = fetch('/api/publiek/teksten').then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  return teksten;
}

export const AiDisclaimer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const [tekst, setTekst] = useState<string | null>(null);
  useEffect(() => { haalTeksten().then((t) => setTekst(t.disclaimer_ai || null)); }, []);
  if (!tekst) return null;
  return (
    <p style={{ fontSize: 12, color: '#B9A9CC', fontStyle: 'italic', lineHeight: 1.5, margin: '0.9rem 0 0', ...style }}>
      ⓘ {tekst}
    </p>
  );
};
