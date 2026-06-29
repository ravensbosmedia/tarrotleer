import React, { useState } from 'react';
import { RITUELEN, filterRituelen, RITUEEL_CATEGORIEEN, type Ritueel } from '../data/rituelen';

const NIVEAU_KLEUR: Record<string, string> = {
  Beginner: "#27ae60",
  Gevorderd: "#e67e22",
  Expert: "#e74c3c",
};

export function RituelenPage() {
  const [categorie, setCategorie] = useState('Alles');
  const [geselecteerd, setGeselecteerd] = useState<Ritueel | null>(null);

  const resultaten = filterRituelen(categorie);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0a1628 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🕯️</div>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Spirituele Rituelen
          </h1>
          <p style={{ color: '#a89060', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
            {RITUELEN.length} stap-voor-stap rituelen voor elke fase van je spirituele reis
          </p>
        </div>

        {/* Categoriefilter */}
        {!geselecteerd && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
            {RITUEEL_CATEGORIEEN.map(cat => (
              <button key={cat} onClick={() => setCategorie(cat)} style={{
                padding: '0.5rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: 'Cinzel, serif',
                background: categorie === cat ? '#d4af37' : 'rgba(212,175,55,0.12)',
                color: categorie === cat ? '#1a0a2e' : '#d4af37',
              }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Lijst */}
        {!geselecteerd && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resultaten.map(r => (
              <div key={r.id} onClick={() => setGeselecteerd(r)} style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                border: '1px solid rgba(212,175,55,0.2)', padding: '1.25rem',
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '0.75rem',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#d4af37')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)')}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem', fontFamily: 'Cinzel, serif', padding: '0.2rem 0.6rem',
                      borderRadius: 10, background: 'rgba(212,175,55,0.15)', color: '#d4af37',
                    }}>{r.categorie}</span>
                    <span style={{
                      fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 10,
                      background: NIVEAU_KLEUR[r.niveau] + '30', color: NIVEAU_KLEUR[r.niveau],
                      border: `1px solid ${NIVEAU_KLEUR[r.niveau]}50`,
                    }}>{r.niveau}</span>
                    {r.maanfase && (
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#c9a0dc' }}>
                        🌙 {r.maanfase}
                      </span>
                    )}
                  </div>
                  <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', margin: '0 0 0.25rem' }}>{r.naam}</h3>
                  <p style={{ color: '#a89060', fontFamily: 'Crimson Pro, serif', margin: 0, fontSize: '0.95rem' }}>
                    {r.intentie}
                  </p>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ color: '#7a6a4a', fontSize: '0.85rem' }}>⏱ {r.duur}</div>
                  <div style={{ color: '#7a6a4a', fontSize: '0.8rem', marginTop: '0.25rem' }}>{r.stappen.length} stappen</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail */}
        {geselecteerd && (
          <div>
            <button onClick={() => setGeselecteerd(null)} style={{
              background: 'transparent', border: '1px solid #d4af37', color: '#d4af37',
              padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', marginBottom: '1.5rem',
              fontFamily: 'Cinzel, serif',
            }}>
              ← Terug naar rituelen
            </button>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid #d4af37', padding: '2rem' }}>

              {/* Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'Cinzel, serif', padding: '0.25rem 0.75rem', borderRadius: 12, background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>{geselecteerd.categorie}</span>
                  <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: 12, background: NIVEAU_KLEUR[geselecteerd.niveau] + '30', color: NIVEAU_KLEUR[geselecteerd.niveau] }}>{geselecteerd.niveau}</span>
                  <span style={{ fontSize: '0.8rem', color: '#a89060' }}>⏱ {geselecteerd.duur}</span>
                  {geselecteerd.maanfase && <span style={{ fontSize: '0.8rem', color: '#c9a0dc' }}>🌙 {geselecteerd.maanfase}</span>}
                </div>
                <h2 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', fontSize: '1.6rem', margin: '0 0 0.75rem' }}>
                  🕯️ {geselecteerd.naam}
                </h2>
                <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  {geselecteerd.beschrijving}
                </p>
              </div>

              {/* Intentie */}
              <div style={{ background: 'rgba(212,175,55,0.07)', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', borderLeft: '3px solid #d4af37' }}>
                <strong style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', fontSize: '0.85rem' }}>✨ Intentie</strong>
                <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', margin: '0.5rem 0 0', fontSize: '1rem', lineHeight: 1.6 }}>
                  {geselecteerd.intentie}
                </p>
              </div>

              {/* Benodigdheden */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', marginBottom: '0.75rem', fontSize: '1rem' }}>🧺 Wat je nodig hebt</h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {geselecteerd.benodigdheden.map((item, i) => (
                    <li key={i} style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '1rem', marginBottom: '0.3rem' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Stappen */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', marginBottom: '1rem', fontSize: '1rem' }}>📜 Stap voor stap</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {geselecteerd.stappen.map((stap, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{
                        minWidth: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#d4af37', color: '#1a0a2e', fontFamily: 'Cinzel, serif', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0,
                      }}>{i + 1}</div>
                      <div>
                        <h4 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', margin: '0.3rem 0 0.4rem', fontSize: '0.95rem' }}>{stap.titel}</h4>
                        <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>{stap.beschrijving}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Afsluiting */}
              <div style={{ background: 'rgba(100,80,150,0.15)', borderRadius: 10, padding: '1.25rem', border: '1px solid rgba(180,120,220,0.3)' }}>
                <h3 style={{ color: '#c9a0dc', fontFamily: 'Cinzel, serif', margin: '0 0 0.75rem', fontSize: '1rem' }}>🌙 Afsluiting</h3>
                <p style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>
                  {geselecteerd.afsluiting}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
