import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MATRIX, MODULE07_QUIZ } from '../../data/cursus/module07';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };
type Tab = 'matrix' | 'oefenen' | 'quiz';

const SCORE_KLEUR = { Hoog: '#5CB87A', Medium: '#B8860B', Uitdagend: '#DB7A7A' };
const SCORE_BG = { Hoog: 'rgba(92,184,122,0.12)', Medium: 'rgba(184,134,11,0.12)', Uitdagend: 'rgba(200,80,80,0.12)' };
const SCORE_BORDER = { Hoog: 'rgba(92,184,122,0.3)', Medium: 'rgba(184,134,11,0.3)', Uitdagend: 'rgba(200,80,80,0.3)' };

const ARCHETYPES: Record<number, string> = {
  1: 'Pionier', 2: 'Diplomaat', 3: 'Creatief', 4: 'Bouwer', 5: 'Avonturier',
  6: 'Zorgend', 7: 'Zoeker', 8: 'Manifest', 9: 'Oude Ziel',
};

function zoekCombinatie(a: number, b: number) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return MATRIX.find(m => {
    if (m.combinatie === 'Zelfde Levenspad') return a === b;
    const delen = m.combinatie.split(' + ').map(Number);
    return (delen[0] === min && delen[1] === max) || (delen[0] === max && delen[1] === min);
  }) || null;
}

export const CursusModule07Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('matrix');
  const [openCombinatie, setOpenCombinatie] = useState<number | null>(null);
  const [lp1, setLp1] = useState<number>(1);
  const [lp2, setLp2] = useState<number>(2);
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);
  const score = quizIngediend ? MODULE07_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  const oefenResultaat = zoekCombinatie(lp1, lp2);

  const TABS = [
    { id: 'matrix' as Tab, label: 'Compat. Matrix' },
    { id: 'oefenen' as Tab, label: 'Oefenen' },
    { id: 'quiz' as Tab, label: 'Quiz' },
  ];

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 07</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Numerologische Compatibiliteit</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Levenspad-combinaties — Hoog / Medium / Uitdagend</p>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '2rem' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '6px 14px', borderRadius: 16, cursor: 'pointer', transition: 'all 0.15s',
              border: `0.5px solid ${tab === t.id ? G.goud : 'rgba(184,134,11,0.25)'}`,
              background: tab === t.id ? G.goud : 'transparent',
              color: tab === t.id ? '#2C2416' : 'rgba(245,237,216,0.65)',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'matrix' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(['Hoog', 'Medium', 'Uitdagend'] as const).map(s => (
                <div key={s} style={{ background: SCORE_BG[s], border: `0.5px solid ${SCORE_BORDER[s]}`, borderRadius: 8, padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontFamily: "'Cinzel', serif", color: SCORE_KLEUR[s], letterSpacing: '0.06em' }}>{s}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.55)', marginTop: '0.1rem' }}>
                    {MATRIX.filter(m => m.score === s).length} combinaties
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(184,134,11,0.06)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1.25rem', fontSize: 13, color: 'rgba(245,237,216,0.65)' }}>
              <strong style={{ color: G.goudBleek }}>Basis:</strong> Levenspad-getal. Voor meestergetallen: 11→2, 22→4 bij matrix-lookup. De meester-laag blijft in je analyse.
            </div>
            {MATRIX.map((comb, i) => {
              const kleur = SCORE_KLEUR[comb.score];
              return (
                <div key={i} style={{ marginBottom: '0.75rem', background: G.bg2, border: `0.5px solid ${openCombinatie === i ? kleur : 'rgba(184,134,11,0.2)'}`, borderRadius: 10 }}>
                  <button onClick={() => setOpenCombinatie(openCombinatie === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ background: SCORE_BG[comb.score], border: `0.5px solid ${SCORE_BORDER[comb.score]}`, borderRadius: 8, padding: '4px 10px', fontFamily: "'Cinzel', serif", fontSize: 11, color: kleur, whiteSpace: 'nowrap' }}>{comb.score}</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{comb.combinatie}</div>
                        <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)' }}>{comb.titel}</div>
                      </div>
                    </div>
                    <span style={{ color: kleur, fontSize: 16 }}>{openCombinatie === i ? '▲' : '▼'}</span>
                  </button>
                  {openCombinatie === i && (
                    <div style={{ padding: '0 1.25rem 1.25rem' }}>
                      <div style={{ background: SCORE_BG[comb.score], border: `0.5px solid ${SCORE_BORDER[comb.score]}`, borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(245,237,216,0.80)', margin: 0 }}>{comb.waarom}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                          <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Valkuil</div>
                          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.5 }}>{comb.valkuil}</p>
                        </div>
                        <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                          <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Advies</div>
                          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.5 }}>{comb.advies}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'oefenen' && (
          <div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '1rem' }}>Kies twee Levenspaden</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[{ label: 'Persoon 1', val: lp1, set: setLp1 }, { label: 'Persoon 2', val: lp2, set: setLp2 }].map(item => (
                  <div key={item.label}>
                    <label style={{ display: 'block', fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{item.label}</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {[1,2,3,4,5,6,7,8,9,11,22].map(n => (
                        <button key={n} onClick={() => item.set(n)} style={{
                          padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                          fontFamily: "'Cinzel', serif",
                          background: item.val === n ? G.goud : G.bg3,
                          border: `0.5px solid ${item.val === n ? G.goud : 'rgba(184,134,11,0.25)'}`,
                          color: item.val === n ? '#1A1208' : G.goudBleek,
                        }}>{n}</button>
                      ))}
                    </div>
                    {ARCHETYPES[item.val <= 9 ? item.val : item.val === 11 ? 2 : 4] && (
                      <div style={{ fontSize: 12, color: 'rgba(184,134,11,0.6)', marginTop: '0.4rem' }}>
                        {item.val} — {ARCHETYPES[item.val <= 9 ? item.val : item.val === 11 ? 2 : 4]}
                        {item.val > 9 ? ` (meestergetal → ${item.val === 11 ? 2 : 4} voor matrix)` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {oefenResultaat ? (
              <div style={{ background: G.bg2, border: `0.5px solid ${SCORE_BORDER[oefenResultaat.score]}`, borderRadius: 10, padding: '1.25rem' }}>
                <div style={{ display: 'flex', align: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: SCORE_BG[oefenResultaat.score], border: `0.5px solid ${SCORE_BORDER[oefenResultaat.score]}`, borderRadius: 8, padding: '6px 14px', fontFamily: "'Cinzel', serif", fontSize: 14, color: SCORE_KLEUR[oefenResultaat.score] }}>{oefenResultaat.score}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: G.goudBleek, alignSelf: 'center' }}>{oefenResultaat.combinatie} — {oefenResultaat.titel}</div>
                </div>
                <div style={{ background: SCORE_BG[oefenResultaat.score], borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(245,237,216,0.80)', margin: 0 }}>{oefenResultaat.waarom}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Valkuil</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.5 }}>{oefenResultaat.valkuil}</p>
                  </div>
                  <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Advies</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.5 }}>{oefenResultaat.advies}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.15)', borderRadius: 10, padding: '1.5rem', textAlign: 'center', color: 'rgba(245,237,216,0.45)', fontSize: 14 }}>
                Combinatie niet gevonden in de AuraLine matrix. Probeer een andere combinatie.
              </div>
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Quiz — Module 7</h2>
            {MODULE07_QUIZ.map((v, qi) => (
              <div key={qi} style={{ background: G.bg2, border: `0.5px solid ${quizIngediend ? (quizAntwoorden[qi] === v.juist ? 'rgba(92,184,122,0.4)' : 'rgba(200,80,80,0.4)') : 'rgba(184,134,11,0.2)'}`, borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: 'rgba(184,134,11,0.6)', marginBottom: '0.5rem' }}>Vraag {qi + 1}</div>
                <p style={{ fontSize: 15, color: G.goudBleek, marginBottom: '0.75rem' }}>{v.vraag}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {v.opties.map((opt, oi) => (
                    <button key={oi} onClick={() => !quizIngediend && setQuizAntwoorden(p => ({ ...p, [qi]: oi }))} style={{
                      background: quizAntwoorden[qi] === oi ? (quizIngediend ? (oi === v.juist ? 'rgba(92,184,122,0.2)' : 'rgba(200,80,80,0.2)') : 'rgba(184,134,11,0.2)') : (quizIngediend && oi === v.juist ? 'rgba(92,184,122,0.1)' : 'transparent'),
                      border: `0.5px solid ${quizAntwoorden[qi] === oi ? G.goud : 'rgba(184,134,11,0.2)'}`, borderRadius: 6, padding: '8px 12px', textAlign: 'left', cursor: quizIngediend ? 'default' : 'pointer', color: G.goudBleek, fontSize: 14,
                    }}>{String.fromCharCode(97 + oi)}) {opt}</button>
                  ))}
                </div>
                {quizIngediend && <div style={{ marginTop: '0.75rem', fontSize: 13, color: 'rgba(245,237,216,0.65)', background: 'rgba(184,134,11,0.08)', borderRadius: 6, padding: '0.5rem 0.75rem' }}>{v.uitleg}</div>}
              </div>
            ))}
            {!quizIngediend ? (
              <button onClick={() => setQuizIngediend(true)} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Controleer antwoorden</button>
            ) : (
              <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 10, padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud }}>{score} / {MODULE07_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)', marginTop: '0.25rem' }}>{score >= 8 ? '✦ Uitstekend.' : score >= 6 ? 'Goed.' : 'Herhaal de matrix.'}</div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>Opnieuw</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-06" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 06: Planeten</Link>
          <Link to="/cursus/module-08" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>Module 08: Synthese →</Link>
        </div>
      </div>
    </div>
  );
};
