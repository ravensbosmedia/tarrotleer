// Beheer: vaste teksten zoals de disclaimers (alleen beheerders). Leeg opslaan = standaardtekst terug.
import React, { useEffect, useState } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

interface Tekst { sleutel: string; waarde: string; standaard: string; aangepast: boolean; bijgewerkt: string | null; door: string | null }
const UITLEG: Record<string, { titel: string; waar: string }> = {
  disclaimer_algemeen: { titel: 'Disclaimer — gratis functies', waar: 'Op zen-flow.nl onder "Probeer het zelf" (dagkaart, levenspad, maandhoroscoop).' },
  disclaimer_ai: { titel: 'Disclaimer — AI-duidingen (niet in gebruik)', waar: 'Wordt op dit moment nergens getoond (op verzoek weggehaald, 15-10-2026). Bewaard voor als hij later weer nodig is.' },
};

export const TekstenPage: React.FC = () => {
  const [lijst, setLijst] = useState<Tekst[] | null>(null);
  const [concept, setConcept] = useState<Record<string, string>>({});
  const [melding, setMelding] = useState<string | null>(null);
  const laad = () => fetch('/api/admin/teksten').then((r) => r.json()).then((d: Tekst[]) => { setLijst(d); setConcept(Object.fromEntries(d.map((t) => [t.sleutel, t.waarde]))); });
  useEffect(() => { laad(); }, []);

  async function bewaar(sleutel: string, waarde: string) {
    const r = await fetch(`/api/admin/teksten/${sleutel}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ waarde }) });
    setMelding(r.ok ? 'Opgeslagen ✓ — de nieuwe tekst staat meteen op de site.' : 'Opslaan mislukt'); setTimeout(() => setMelding(null), 3000);
    laad();
  }

  return (
    <div className="zf-pagina">
      <div className="zf-kop"><div>
        <p className="zf-label">Beheer</p>
        <h1 className="zf-titel">Teksten</h1>
        <p className="zf-intro">Pas hier de vaste teksten aan, zoals de disclaimers. Een wijziging staat direct op zen-flow.nl en in de leeromgeving.</p>
      </div></div>
      <div className="zf-inhoud" style={{ maxWidth: 860 }}>
        {melding && <p style={{ color: '#9BD49B', marginBottom: '1rem' }}>{melding}</p>}
        {!lijst && <p style={{ color: '#B9A9CC' }}>Laden…</p>}
        {lijst?.map((t) => (
          <div key={t.sleutel} className="zf-kaart" style={{ padding: '1.3rem 1.4rem', marginBottom: '1.2rem' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 500, margin: '0 0 0.2rem' }}>{UITLEG[t.sleutel]?.titel ?? t.sleutel}</h2>
            <p style={{ fontSize: 13, color: '#B9A9CC', margin: '0 0 0.8rem' }}>{UITLEG[t.sleutel]?.waar}</p>
            <textarea className="zf-veld" rows={4} value={concept[t.sleutel] ?? ''} onChange={(e) => setConcept((c) => ({ ...c, [t.sleutel]: e.target.value }))} style={{ resize: 'vertical', lineHeight: 1.6 }} />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: '0.8rem' }}>
              <button style={ZF_KNOP} onClick={() => bewaar(t.sleutel, concept[t.sleutel] ?? '')} disabled={(concept[t.sleutel] ?? '') === t.waarde}>Opslaan</button>
              {t.aangepast && <button style={ZF_KNOP_PAARS} onClick={() => { if (confirm('De standaardtekst terugzetten?')) bewaar(t.sleutel, ''); }}>Standaardtekst terugzetten</button>}
              <span style={{ fontSize: 12, color: '#B9A9CC' }}>{t.aangepast ? `Aangepast${t.door ? ` door ${t.door}` : ''}${t.bijgewerkt ? ` op ${t.bijgewerkt.slice(0, 16).replace('T', ' ')}` : ''}` : 'Standaardtekst'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
