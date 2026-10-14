import React, { useState } from 'react';
import { RITUELEN, filterRituelen, RITUEEL_CATEGORIEEN, type Ritueel } from '../data/rituelen';

const NIVEAU_KLEUR: Record<string, string> = {
  Beginner: "#7BC98F",
  Gevorderd: "#e67e22",
  Expert: "#F0A596",
};

export function RituelenPage() {
  const [categorie, setCategorie] = useState('Alles');
  const [geselecteerd, setGeselecteerd] = useState<Ritueel | null>(null);

  const resultaten = filterRituelen(categorie);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #20162F 0%, #0D0C22 50%, #080718 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🕯️</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#F1CB78', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Spirituele Rituelen
          </h1>
          <p style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', fontSize: '1.1rem' }}>
            {RITUELEN.length} stap-voor-stap rituelen voor elke fase van je spirituele reis
          </p>
        </div>

        {/* Categoriefilter */}
        {!geselecteerd && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
            {RITUEEL_CATEGORIEEN.map(cat => (
              <button key={cat} onClick={() => setCategorie(cat)} style={{
                padding: '0.5rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: "'Cormorant Garamond', Georgia, serif",
                background: categorie === cat ? '#F1CB78' : 'rgba(241,203,120,0.12)',
                color: categorie === cat ? '#20162F' : '#F1CB78',
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
                border: '1px solid rgba(241,203,120,0.2)', padding: '1.25rem',
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '0.75rem',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#F1CB78')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(241,203,120,0.2)')}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem', fontFamily: "'Cormorant Garamond', Georgia, serif", padding: '0.2rem 0.6rem',
                      borderRadius: 10, background: 'rgba(241,203,120,0.15)', color: '#F1CB78',
                    }}>{r.categorie}</span>
                    <span style={{
                      fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 10,
                      background: NIVEAU_KLEUR[r.niveau] + '30', color: NIVEAU_KLEUR[r.niveau],
                      border: `1px solid ${NIVEAU_KLEUR[r.niveau]}50`,
                    }}>{r.niveau}</span>
                    {r.maanfase && (
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#E7B6F5' }}>
                        🌙 {r.maanfase}
                      </span>
                    )}
                  </div>
                  <h3 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0 0 0.25rem' }}>{r.naam}</h3>
                  <p style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', margin: 0, fontSize: '0.95rem' }}>
                    {r.intentie}
                  </p>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ color: '#8E7FA8', fontSize: '0.85rem' }}>⏱ {r.duur}</div>
                  <div style={{ color: '#8E7FA8', fontSize: '0.8rem', marginTop: '0.25rem' }}>{r.stappen.length} stappen</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail */}
        {geselecteerd && (
          <div>
            <button onClick={() => setGeselecteerd(null)} style={{
              background: 'transparent', border: '1px solid #F1CB78', color: '#F1CB78',
              padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', marginBottom: '1.5rem',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
              ← Terug naar rituelen
            </button>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid #F1CB78', padding: '2rem' }}>

              {/* Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: "'Cormorant Garamond', Georgia, serif", padding: '0.25rem 0.75rem', borderRadius: 12, background: 'rgba(241,203,120,0.15)', color: '#F1CB78' }}>{geselecteerd.categorie}</span>
                  <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: 12, background: NIVEAU_KLEUR[geselecteerd.niveau] + '30', color: NIVEAU_KLEUR[geselecteerd.niveau] }}>{geselecteerd.niveau}</span>
                  <span style={{ fontSize: '0.8rem', color: '#B9A9CC' }}>⏱ {geselecteerd.duur}</span>
                  {geselecteerd.maanfase && <span style={{ fontSize: '0.8rem', color: '#E7B6F5' }}>🌙 {geselecteerd.maanfase}</span>}
                </div>
                <h2 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', margin: '0 0 0.75rem' }}>
                  🕯️ {geselecteerd.naam}
                </h2>
                <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  {geselecteerd.beschrijving}
                </p>
              </div>

              {/* Intentie */}
              <div style={{ background: 'rgba(241,203,120,0.07)', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', borderLeft: '3px solid #F1CB78' }}>
                <strong style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem' }}>✨ Intentie</strong>
                <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', margin: '0.5rem 0 0', fontSize: '1rem', lineHeight: 1.6 }}>
                  {geselecteerd.intentie}
                </p>
              </div>

              {/* Benodigdheden */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: '0.75rem', fontSize: '1rem' }}>🧺 Wat je nodig hebt</h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {geselecteerd.benodigdheden.map((item, i) => (
                    <li key={i} style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', marginBottom: '0.3rem' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Stappen */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: '1rem', fontSize: '1rem' }}>📜 Stap voor stap</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {geselecteerd.stappen.map((stap, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{
                        minWidth: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#F1CB78', color: '#20162F', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0,
                      }}>{i + 1}</div>
                      <div>
                        <h4 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0.3rem 0 0.4rem', fontSize: '0.95rem' }}>{stap.titel}</h4>
                        <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>{stap.beschrijving}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Afsluiting */}
              <div style={{ background: 'rgba(100,80,150,0.15)', borderRadius: 10, padding: '1.25rem', border: '1px solid rgba(180,120,220,0.3)' }}>
                <h3 style={{ color: '#E7B6F5', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0 0 0.75rem', fontSize: '1rem' }}>🌙 Afsluiting</h3>
                <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>
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
