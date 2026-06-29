import React, { useState } from 'react';
import { TEKENS, TEKEN_EMOJI, TEKEN_ELEMENT, ELEMENT_KLEUR, berekenCompatibiliteit, type Teken } from '../data/compatibiliteit';

const NIVEAU_KLEUR: Record<string, string> = {
  Uitstekend: "#27ae60",
  Goed: "#3498db",
  Gemiddeld: "#e67e22",
  Uitdagend: "#e74c3c",
};

export function CompatibiliteitPage() {
  const [teken1, setTeken1] = useState<Teken | null>(null);
  const [teken2, setTeken2] = useState<Teken | null>(null);

  const resultaat = teken1 && teken2 ? berekenCompatibiliteit(teken1, teken2) : null;

  const reset = () => { setTeken1(null); setTeken2(null); };

  const TekenKiezer = ({ geselecteerd, onKies, titel }: { geselecteerd: Teken | null, onKies: (t: Teken) => void, titel: string }) => (
    <div>
      <div style={{ color: '#a89060', fontFamily: 'Cinzel, serif', fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'center' }}>{titel}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {TEKENS.map(t => (
          <button key={t} onClick={() => onKies(t)} style={{
            padding: '0.5rem 0.25rem', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: geselecteerd === t ? '#d4af37' : 'rgba(255,255,255,0.07)',
            color: geselecteerd === t ? '#1a0a2e' : '#d4cfc0',
            fontFamily: 'Crimson Pro, serif', fontSize: '0.8rem', textAlign: 'center',
            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
          }}>
            <span style={{ fontSize: '1.3rem' }}>{TEKEN_EMOJI[t]}</span>
            <span style={{ fontSize: '0.75rem' }}>{t}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0a1628 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💞</div>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Sterrenbeelden Compatibiliteit
          </h1>
          <p style={{ color: '#a89060', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
            Ontdek de astrologische harmonie tussen twee tekens
          </p>
        </div>

        {/* Kiezers */}
        {!resultaat && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(212,175,55,0.3)', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'center' }}>
              <TekenKiezer geselecteerd={teken1} onKies={setTeken1} titel="Jouw sterrenbeeld" />
              <div style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', fontSize: '1.5rem', textAlign: 'center' }}>×</div>
              <TekenKiezer geselecteerd={teken2} onKies={setTeken2} titel="Partner/vriend sterrenbeeld" />
            </div>

            {teken1 && teken2 && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button onClick={() => {}} style={{
                  padding: '0.75rem 2rem', background: '#d4af37', border: 'none', borderRadius: 25,
                  color: '#1a0a2e', fontFamily: 'Cinzel, serif', fontSize: '1rem', cursor: 'default',
                }}>
                  ✨ {teken1} {TEKEN_EMOJI[teken1]} × {teken2} {TEKEN_EMOJI[teken2]}
                </button>
              </div>
            )}

            {!teken1 && (
              <p style={{ textAlign: 'center', color: '#7a6a4a', fontFamily: 'Crimson Pro, serif', marginTop: '1.5rem' }}>
                Kies beide sterrenbeelden om de compatibiliteit te zien
              </p>
            )}
          </div>
        )}

        {/* Resultaat */}
        {resultaat && teken1 && teken2 && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: `1px solid ${NIVEAU_KLEUR[resultaat.niveau]}50`, padding: '2rem', marginBottom: '1.5rem' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  {TEKEN_EMOJI[teken1]} × {TEKEN_EMOJI[teken2]}
                </div>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '1.5rem', margin: '0 0 0.25rem' }}>
                  {teken1} & {teken2}
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', background: ELEMENT_KLEUR[TEKEN_ELEMENT[teken1]] + '30', color: ELEMENT_KLEUR[TEKEN_ELEMENT[teken1]], border: `1px solid ${ELEMENT_KLEUR[TEKEN_ELEMENT[teken1]]}50` }}>
                    {TEKEN_ELEMENT[teken1]}
                  </span>
                  <span style={{ color: '#7a6a4a' }}>×</span>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', background: ELEMENT_KLEUR[TEKEN_ELEMENT[teken2]] + '30', color: ELEMENT_KLEUR[TEKEN_ELEMENT[teken2]], border: `1px solid ${ELEMENT_KLEUR[TEKEN_ELEMENT[teken2]]}50` }}>
                    {TEKEN_ELEMENT[teken2]}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem', fontFamily: 'Cinzel, serif', color: NIVEAU_KLEUR[resultaat.niveau], lineHeight: 1 }}>
                  {resultaat.score}/10
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{
                    padding: '0.4rem 1.25rem', borderRadius: 20, fontSize: '0.9rem', fontFamily: 'Cinzel, serif',
                    background: NIVEAU_KLEUR[resultaat.niveau] + '25', color: NIVEAU_KLEUR[resultaat.niveau],
                    border: `1px solid ${NIVEAU_KLEUR[resultaat.niveau]}50`,
                  }}>{resultaat.niveau}</span>
                </div>
                {/* Score balk */}
                <div style={{ maxWidth: 300, margin: '1rem auto 0', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${resultaat.score * 10}%`, background: NIVEAU_KLEUR[resultaat.niveau], borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Samenvatting */}
              <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'center', marginBottom: '2rem' }}>
                {resultaat.samenvatting}
              </p>

              {/* Sterktes & uitdagingen */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(39,174,96,0.08)', borderRadius: 10, padding: '1.25rem', border: '1px solid rgba(39,174,96,0.25)' }}>
                  <h3 style={{ color: '#27ae60', fontFamily: 'Cinzel, serif', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>✓ Sterktes</h3>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {resultaat.sterktes.map((s, i) => (
                      <li key={i} style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: 'rgba(231,76,60,0.08)', borderRadius: 10, padding: '1.25rem', border: '1px solid rgba(231,76,60,0.25)' }}>
                  <h3 style={{ color: '#e74c3c', fontFamily: 'Cinzel, serif', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>⚡ Uitdagingen</h3>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {resultaat.uitdagingen.map((u, i) => (
                      <li key={i} style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{u}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Volledige matrix knop */}
            <div style={{ textAlign: 'center' }}>
              <button onClick={reset} style={{
                padding: '0.75rem 2rem', background: 'transparent', border: '1px solid #d4af37',
                color: '#d4af37', borderRadius: 25, fontFamily: 'Cinzel, serif', cursor: 'pointer', fontSize: '0.9rem',
              }}>
                ← Nieuwe combinatie proberen
              </button>
            </div>
          </div>
        )}

        {/* Alle tekens overzicht */}
        {!resultaat && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#a89060', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>
              Elementen & Tekens
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {(['Vuur', 'Aarde', 'Lucht', 'Water'] as const).map(el => (
                <div key={el} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '1rem', border: `1px solid ${ELEMENT_KLEUR[el]}30` }}>
                  <div style={{ color: ELEMENT_KLEUR[el], fontFamily: 'Cinzel, serif', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {el}
                  </div>
                  <div style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '0.9rem' }}>
                    {TEKENS.filter(t => TEKEN_ELEMENT[t] === el).map(t => `${TEKEN_EMOJI[t]} ${t}`).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Gerelateerde tools */}
        <div style={{ borderTop: '0.5px solid rgba(184,134,11,0.15)', paddingTop: '1.25rem', paddingBottom: '2rem', marginTop: '1rem' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { to: '/sterrenbeelden', label: 'Sterrenbeelden' },
              { to: '/cursus/module-07', label: 'Cursus: Compatibiliteit' },
              { to: '/cursus/module-04', label: 'Cursus: Sterrenbeelden' },
            ].map(l => (
              <a key={l.to} href={l.to} style={{ fontSize: '0.75rem', color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
