import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PLANETEN, MODULE06_QUIZ } from '../../data/cursus/module06';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };
type Tab = 'planeten' | 'overzicht' | 'quiz';

const CATEGORIE_KLEUR: Record<string, string> = {
  persoonlijk: '#C06840',
  sociaal: '#4080C0',
  transpersoonlijk: '#8060B0',
};

export const CursusModule06Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('planeten');
  const [openPlaneet, setOpenPlaneet] = useState<number | null>(null);
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);
  const score = quizIngediend ? MODULE06_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  const TABS = [
    { id: 'planeten' as Tab, label: '10 Planeten' },
    { id: 'overzicht' as Tab, label: 'Overzicht' },
    { id: 'quiz' as Tab, label: 'Quiz' },
  ];

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 06</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Planeten</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>10 planeten — 7 klassiek + 3 modern (transpersoonlijk)</p>
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

        {tab === 'planeten' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {(['persoonlijk', 'sociaal', 'transpersoonlijk'] as const).map(cat => (
                <div key={cat} style={{ background: CATEGORIE_KLEUR[cat] + '18', border: `0.5px solid ${CATEGORIE_KLEUR[cat]}44`, borderRadius: 8, padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: CATEGORIE_KLEUR[cat], letterSpacing: '0.08em', textTransform: 'uppercase' }}>{cat}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.55)', marginTop: '0.15rem' }}>
                    {PLANETEN.filter(p => p.categorie === cat).map(p => p.symbool).join(' ')}
                  </div>
                </div>
              ))}
            </div>
            {PLANETEN.map((planeet, i) => {
              const kleur = CATEGORIE_KLEUR[planeet.categorie];
              return (
                <div key={planeet.naam} style={{ marginBottom: '0.75rem', background: G.bg2, border: `0.5px solid ${openPlaneet === i ? kleur : 'rgba(184,134,11,0.2)'}`, borderRadius: 10 }}>
                  <button onClick={() => setOpenPlaneet(openPlaneet === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: 22, minWidth: 36, textAlign: 'center', color: kleur }}>{planeet.symbool}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{planeet.naam}</div>
                        <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.45)' }}>{planeet.categorie} · {planeet.snelheid.split('(')[0].trim()}</div>
                      </div>
                    </div>
                    <span style={{ color: kleur, fontSize: 16 }}>{openPlaneet === i ? '▲' : '▼'}</span>
                  </button>
                  {openPlaneet === i && (
                    <div style={{ padding: '0 1.25rem 1.25rem' }}>
                      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)', marginBottom: '1rem' }}>{planeet.energie}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Positief</div>
                          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.5, margin: 0 }}>{planeet.positief}</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Schaduw</div>
                          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.5, margin: 0 }}>{planeet.schaduw}</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ background: G.bg3, borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                          <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Regeert</div>
                          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0 }}>{planeet.regeert}</p>
                        </div>
                        <div style={{ background: G.bg3, borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                          <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Levensgebied</div>
                          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.4 }}>{planeet.levensgebied}</p>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(46,80,160,0.1)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                        <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>💬 In een chart</div>
                        <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{planeet.inEenChart}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'overzicht' && (
          <div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '1rem' }}>Alle 10 planeten in één oogopslag</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {PLANETEN.map((p, i) => {
                  const kleur = CATEGORIE_KLEUR[p.categorie];
                  return (
                    <div key={p.naam} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: i < 9 ? '0.5px solid rgba(184,134,11,0.1)' : 'none' }}>
                      <span style={{ fontSize: 18, minWidth: 28, color: kleur }}>{p.symbool}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{p.naam}</span>
                        <span style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)', marginLeft: '0.5rem' }}>— {p.energie.split(',')[0].substring(0, 40)}</span>
                      </div>
                      <span style={{ fontSize: 11, color: kleur, minWidth: 90, textAlign: 'right' }}>{p.categorie}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(192,104,64,0.1)', border: '0.5px solid rgba(192,104,64,0.3)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: '#C06840', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Persoonlijk</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0 }}>Zon, Maan, Mercurius, Venus, Mars. Snel bewegend — sterk persoonlijk karakter. Uniek per individu.</p>
              </div>
              <div style={{ background: 'rgba(64,128,192,0.1)', border: '0.5px solid rgba(64,128,192,0.3)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: '#4080C0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sociaal</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0 }}>Jupiter, Saturnus. Middentempo — verbinden het individu met de samenleving. Saturn-return is een grote levensmijlpaal.</p>
              </div>
              <div style={{ background: 'rgba(128,96,176,0.1)', border: '0.5px solid rgba(128,96,176,0.3)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: '#8060B0', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Transpersoonlijk</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0 }}>Uranus, Neptunus, Pluto. Langzaam — generatie-breed. Minder over individu, meer over collectief tijdperk.</p>
              </div>
              <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sleuteldata</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0 }}>Mercurius retrograde ~3x/jaar = communicatie-haperingen. Saturn-return ~28-30 = grote crisis+groei. Chiron-return ~50 jaar.</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Quiz — Module 6</h2>
            {MODULE06_QUIZ.map((v, qi) => (
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
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud }}>{score} / {MODULE06_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)', marginTop: '0.25rem' }}>{score >= 8 ? '✦ Uitstekend.' : score >= 6 ? 'Goed.' : 'Herhaal de planeten.'}</div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>Opnieuw</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-05" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 05: Maanfasen</Link>
          <Link to="/cursus/module-07" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>Module 07: Compatibiliteit →</Link>
        </div>
      </div>
    </div>
  );
};
