import React, { useState } from 'react';
import { KRISTALLEN, filterKristallen, type Kristal } from '../data/kristallen';

const ELEMENT_KLEUR: Record<string, string> = {
  Vuur: "#e74c3c", Aarde: "#8B6914", Lucht: "#3498db", Water: "#1abc9c",
};

const ELEMENT_EMOJI: Record<string, string> = {
  Vuur: "🔥", Aarde: "🌿", Lucht: "💨", Water: "💧",
};

export function KristallenPage() {
  const [zoekterm, setZoekterm] = useState('');
  const [geselecteerd, setGeselecteerd] = useState<Kristal | null>(null);
  const [filterElement, setFilterElement] = useState('Alles');

  const elementen = ['Alles', 'Vuur', 'Aarde', 'Lucht', 'Water', 'Storm'];

  const resultaten = filterKristallen(zoekterm).filter(k =>
    filterElement === 'Alles' || k.element === filterElement
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0a1628 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💎</div>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Kristallen Bibliotheek
          </h1>
          <p style={{ color: '#a89060', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
            Ontdek de helende kracht en spirituele eigenschappen van {KRISTALLEN.length} kristallen
          </p>
        </div>

        {/* Zoek & filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            value={zoekterm}
            onChange={e => setZoekterm(e.target.value)}
            placeholder="Zoek op naam, kleur, chakra of eigenschap..."
            style={{
              flex: 1, minWidth: 200, padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.07)', border: '1px solid #d4af37',
              borderRadius: 8, color: '#fff', fontFamily: 'Crimson Pro, serif', fontSize: '1rem',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {elementen.map(el => (
              <button key={el} onClick={() => setFilterElement(el)} style={{
                padding: '0.5rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: 'Cinzel, serif',
                background: filterElement === el ? '#d4af37' : 'rgba(212,175,55,0.15)',
                color: filterElement === el ? '#1a0a2e' : '#d4af37',
                transition: 'all 0.2s',
              }}>
                {el !== 'Alles' && ELEMENT_EMOJI[el]} {el}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {!geselecteerd && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {resultaten.map(k => (
              <div key={k.slug} onClick={() => setGeselecteerd(k)} style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                border: '1px solid rgba(212,175,55,0.2)', padding: '1.25rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4af37')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem', fontFamily: 'Cinzel, serif', padding: '0.2rem 0.6rem',
                    borderRadius: 10, color: '#1a0a2e',
                    background: ELEMENT_KLEUR[k.element] || '#888',
                  }}>{k.element}</span>
                  <span style={{ color: '#a89060', fontSize: '0.8rem' }}>{ELEMENT_EMOJI[k.element]}</span>
                </div>
                <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', margin: '0.5rem 0', fontSize: '1rem' }}>
                  {k.naam}
                </h3>
                <div style={{ color: '#a89060', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {k.kleur.join(' · ')}
                </div>
                <div style={{ color: '#7a6a4a', fontSize: '0.8rem' }}>
                  {k.chakra}
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {k.zoekwoorden.slice(0, 2).map(w => (
                    <span key={w} style={{
                      fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 8,
                      background: 'rgba(212,175,55,0.1)', color: '#c9a227', border: '1px solid rgba(212,175,55,0.2)',
                    }}>{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail weergave */}
        {geselecteerd && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid #d4af37', padding: '2rem' }}>
            <button onClick={() => setGeselecteerd(null)} style={{
              background: 'transparent', border: '1px solid #d4af37', color: '#d4af37',
              padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', marginBottom: '1.5rem',
              fontFamily: 'Cinzel, serif',
            }}>
              ← Terug
            </button>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '1.8rem', margin: 0 }}>
                💎 {geselecteerd.naam}
              </h2>
              <span style={{
                padding: '0.3rem 0.8rem', borderRadius: 12, fontFamily: 'Cinzel, serif', fontSize: '0.85rem',
                background: ELEMENT_KLEUR[geselecteerd.element] || '#888', color: '#1a0a2e',
              }}>{ELEMENT_EMOJI[geselecteerd.element]} {geselecteerd.element}</span>
            </div>

            {/* Meta-info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Kleur', waarde: geselecteerd.kleur.join(', ') },
                { label: 'Chakra', waarde: geselecteerd.chakra },
                { label: 'Element', waarde: geselecteerd.element },
                { label: 'Hardheid', waarde: `Mohs ${geselecteerd.hardheid}` },
              ].map(({ label, waarde }) => (
                <div key={label} style={{ background: 'rgba(212,175,55,0.08)', borderRadius: 8, padding: '0.75rem', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <div style={{ color: '#a89060', fontSize: '0.75rem', fontFamily: 'Cinzel, serif', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>{waarde}</div>
                </div>
              ))}
            </div>

            {/* Zoekwoorden */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#a89060', fontSize: '0.85rem', fontFamily: 'Cinzel, serif', marginBottom: '0.5rem' }}>Sleutelwoorden</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {geselecteerd.zoekwoorden.map(w => (
                  <span key={w} style={{
                    padding: '0.3rem 0.75rem', borderRadius: 12, fontSize: '0.85rem',
                    background: 'rgba(212,175,55,0.12)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.25)',
                  }}>{w}</span>
                ))}
              </div>
            </div>

            {/* Beschrijving */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', marginBottom: '0.75rem', fontSize: '1rem' }}>Over {geselecteerd.naam}</h3>
              <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                {geselecteerd.beschrijving}
              </p>
            </div>

            {/* Gebruik */}
            <div style={{ background: 'rgba(212,175,55,0.07)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(212,175,55,0.2)' }}>
              <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', margin: '0 0 0.75rem', fontSize: '1rem' }}>✨ Hoe te gebruiken</h3>
              <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                {geselecteerd.gebruik}
              </p>
            </div>

            {geselecteerd.voorzichtigheid && (
              <div style={{ background: 'rgba(231,76,60,0.08)', borderRadius: 10, padding: '1rem', border: '1px solid rgba(231,76,60,0.3)' }}>
                <strong style={{ color: '#e74c3c', fontFamily: 'Cinzel, serif', fontSize: '0.9rem' }}>⚠️ Voorzichtigheid</strong>
                <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
                  {geselecteerd.voorzichtigheid}
                </p>
              </div>
            )}
          </div>
        )}

        {resultaten.length === 0 && !geselecteerd && (
          <div style={{ textAlign: 'center', color: '#a89060', fontFamily: 'Crimson Pro, serif', padding: '3rem' }}>
            Geen kristallen gevonden voor "{zoekterm}". Probeer een andere zoekterm.
          </div>
        )}
      </div>
    </div>
  );
}
