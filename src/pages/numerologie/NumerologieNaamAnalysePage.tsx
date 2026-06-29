import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };

const PYTHAGORAANS: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};
const KLINKERS = new Set(['A','E','I','O','U']);
const VOORVOEGSELS = ['van der','van de','van den','van het','in de','van','de','het','der','ter','den',"'t",'te'];

function filterVV(naam: string): string {
  const delen = naam.toLowerCase().trim().split(/\s+/);
  const orig = naam.trim().split(/\s+/);
  const res: string[] = [];
  let i = 0;
  while (i < delen.length) {
    let skip = false;
    for (const vv of VOORVOEGSELS) {
      const vvD = vv.split(' ');
      if (vvD.length > 1 && i + vvD.length <= delen.length && delen.slice(i, i + vvD.length).join(' ') === vv) {
        i += vvD.length; skip = true; break;
      } else if (vvD.length === 1 && delen[i] === vv) {
        i++; skip = true; break;
      }
    }
    if (!skip) { res.push(orig[i]); i++; }
  }
  return res.join(' ');
}

function reduceer(n: number): number {
  if (n === 11 || n === 22) return n;
  if (n <= 9) return n;
  return reduceer(String(n).split('').reduce((a, d) => a + parseInt(d), 0));
}

const ARCHETYPE: Record<number, string> = {
  1:'Pionier',2:'Diplomaat',3:'Creatieveling',4:'Bouwer',5:'Avonturier',
  6:'Verzorger',7:'Zoeker',8:'Manifesteerder',9:'Humanist',11:'Inspirator',22:'Meesterbouwer',
};

function analyseer(naam: string) {
  const gefilterd = filterVV(naam);
  const letters = gefilterd.toUpperCase().replace(/[^A-Z]/g, '').split('');
  if (!letters.length) return null;
  const klinkers = letters.filter(l => KLINKERS.has(l));
  const medeklinkers = letters.filter(l => !KLINKERS.has(l));
  const expressie = reduceer(letters.reduce((a, l) => a + (PYTHAGORAANS[l] ?? 0), 0));
  const ziel = reduceer(klinkers.reduce((a, l) => a + (PYTHAGORAANS[l] ?? 0), 0));
  const persoonlijkheid = reduceer(medeklinkers.reduce((a, l) => a + (PYTHAGORAANS[l] ?? 0), 0));
  return { gefilterd, letters, expressie, ziel, persoonlijkheid };
}

export const NumerologieNaamAnalysePage: React.FC = () => {
  const [naam, setNaam] = useState('');
  const [res, setRes] = useState<ReturnType<typeof analyseer>>(null);

  const GETALLEN_INFO = [
    { key: 'expressie', label: 'Expressiegetal', sub: 'Alle letters', color: G.goud, uitleg: 'Hoe jij je talent naar buiten brengt. Wat anderen als eerste van je zien.' },
    { key: 'ziel', label: 'Zielengetal', sub: 'Alleen klinkers', color: '#7A9BDB', uitleg: 'Je diepste verlangen. Wat je vanbinnen drijft — vaak onzichtbaar voor de buitenwereld.' },
    { key: 'persoonlijkheid', label: 'Persoonlijkheidsgetal', sub: 'Alleen medeklinkers', color: '#5CB87A', uitleg: 'Hoe anderen je ervaren bij een eerste ontmoeting. De façade die je draagt.' },
  ] as const;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/numerologie/analyse" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Profiel Analyse</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Numerologie</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Naam Analyse</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Expressie · Ziel · Persoonlijkheid — via de Pythagoreaanse letterwaardetabel</p>
        </div>

        <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Volledige naam (inclusief tussenvoegsels)</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input value={naam} onChange={e => setNaam(e.target.value)} onKeyDown={e => e.key === 'Enter' && setRes(analyseer(naam))} placeholder="bv. Maria van der Heuvel"
              style={{ flex: 1, minWidth: 220, background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, padding: '10px 14px', color: G.goudBleek, fontSize: 15, fontFamily: "'Crimson Pro', Georgia, serif" }} />
            <button onClick={() => setRes(analyseer(naam))} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Analyseer</button>
          </div>
        </div>

        {res && (
          <div>
            <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.40)', marginBottom: '1rem' }}>Na filter: <strong style={{ color: 'rgba(245,237,216,0.65)' }}>{res.gefilterd}</strong></div>

            {/* Letterwaarde tabel */}
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '1rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {res.letters.map((l, i) => (
                  <div key={i} style={{ textAlign: 'center', minWidth: 36 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: KLINKERS.has(l) ? '#7A9BDB' : G.goudBleek }}>{l}</div>
                    <div style={{ fontSize: 11, color: KLINKERS.has(l) ? '#7A9BDB' : 'rgba(184,134,11,0.6)' }}>{PYTHAGORAANS[l]}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.35)', marginTop: '0.5rem' }}>
                <span style={{ color: '#7A9BDB' }}>Blauw</span> = klinker · Goud = medeklinker
              </div>
            </div>

            {/* 3 getallen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {GETALLEN_INFO.map(gi => (
                <div key={gi.key} style={{ background: G.bg2, border: `0.5px solid rgba(184,134,11,0.2)`, borderRadius: 12, padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: gi.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{gi.label}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 42, color: gi.color, lineHeight: 1 }}>{res[gi.key]}</div>
                  <div style={{ fontSize: 12, color: G.goudBleek, marginTop: '0.3rem' }}>{ARCHETYPE[res[gi.key]] ?? ''}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.40)', marginTop: '0.15rem' }}>{gi.sub}</div>
                </div>
              ))}
            </div>

            {/* Uitleg per getal */}
            {GETALLEN_INFO.map(gi => (
              <div key={gi.key} style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.15)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: gi.color, minWidth: 36, textAlign: 'center' }}>{res[gi.key]}</div>
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: gi.color, letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{gi.label}</div>
                  <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.70)', lineHeight: 1.5, margin: 0 }}>{gi.uitleg}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[{to:'/numerologie/expressiegetal',label:'Expressiegetal'},{to:'/numerologie/levenspad',label:'Levenspad'},{to:'/numerologie/analyse',label:'Compleet Profiel'},{to:'/cursus/module-02',label:'Cursus Module 2'}].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
