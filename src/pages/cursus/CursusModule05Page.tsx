import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MAANFASEN, MODULE05_QUIZ } from '../../data/cursus/module05';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };
type Tab = 'fasen' | 'cyclus' | 'quiz';

export const CursusModule05Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('fasen');
  const [openFase, setOpenFase] = useState<number | null>(null);
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);
  const score = quizIngediend ? MODULE05_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  const TABS = [
    { id: 'fasen' as Tab, label: '8 Fasen' },
    { id: 'cyclus' as Tab, label: 'De Cyclus' },
    { id: 'quiz' as Tab, label: 'Quiz' },
  ];

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 05</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Maanfasen</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>8 fasen van de maancyclus (~29.5 dagen)</p>
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

        {tab === 'fasen' && (
          <div>
            {/* Wassend/Afnemend info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>🌙 Wassend</div>
                <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0 }}>Van Nieuwe Maan → Volle Maan. Groei-energie, naar buiten, beginnen, opbouwen.</p>
              </div>
              <div style={{ background: 'rgba(30,60,120,0.12)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>🌑 Afnemend</div>
                <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0 }}>Van Volle Maan → Nieuwe Maan. Loslaat-energie, naar binnen, afronden, opruimen.</p>
              </div>
            </div>

            {MAANFASEN.map((fase, i) => {
              const isWassend = i < 4;
              const kleur = isWassend ? G.goud : '#7A9BDB';
              return (
                <div key={fase.id} style={{ marginBottom: '0.75rem', background: G.bg2, border: `0.5px solid ${openFase === i ? kleur : 'rgba(184,134,11,0.2)'}`, borderRadius: 10 }}>
                  <button onClick={() => setOpenFase(openFase === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: 24 }}>{fase.emoji}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{fase.naam}</div>
                        <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)' }}>{fase.verlichting} · {fase.duur} · {fase.faseType}</div>
                      </div>
                    </div>
                    <span style={{ color: kleur, fontSize: 16 }}>{openFase === i ? '▲' : '▼'}</span>
                  </button>
                  {openFase === i && (
                    <div style={{ padding: '0 1.25rem 1.25rem' }}>
                      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)', marginBottom: '1rem' }}>{fase.energie}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Wat te doen</div>
                          {fase.watTeDoen.map((w, wi) => <p key={wi} style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.5, marginBottom: '0.2rem' }}>• {w}</p>)}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Wat te vermijden</div>
                          {fase.watVermijden.map((w, wi) => <p key={wi} style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.5, marginBottom: '0.2rem' }}>• {w}</p>)}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(184,134,11,0.08)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Spirituele betekenis</div>
                        <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{fase.spiritueleBetekenis}</p>
                      </div>
                      <div style={{ background: 'rgba(46,80,160,0.1)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                        <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>💬 In de advies-praktijk</div>
                        <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{fase.voorPraktijk}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'cyclus' && (
          <div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '1rem' }}>De 8 fasen in volgorde</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MAANFASEN.map((fase, i) => (
                  <div key={fase.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: i < 7 ? '0.5px solid rgba(184,134,11,0.1)' : 'none' }}>
                    <span style={{ fontSize: 20, minWidth: 30 }}>{fase.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{fase.naam}</span>
                      <span style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)', marginLeft: '0.5rem' }}>— {fase.faseType}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(184,134,11,0.6)', minWidth: 60, textAlign: 'right' }}>{fase.verlichting}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '1rem' }}>De hoofdregel voor de praktijk</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)' }}>
                Vraagt een klant om advies over een nieuw project? Check eerst: zit je in een <strong style={{ color: G.goudBleek }}>wassende of afnemende fase</strong>?
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.75)' }}>
                <strong style={{ color: '#5CB87A' }}>Wassend</strong> = goed moment om te starten, op te bouwen, zichtbaar te worden.
                <br />
                <strong style={{ color: '#7A9BDB' }}>Afnemend</strong> = adviseer afronden, opruimen, en wachten tot de volgende Nieuwe Maan.
              </p>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Quiz — Module 5</h2>
            {MODULE05_QUIZ.map((v, qi) => (
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
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud }}>{score} / {MODULE05_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)', marginTop: '0.25rem' }}>{score >= 8 ? '✦ Uitstekend.' : score >= 6 ? 'Goed.' : 'Herhaal de fasen.'}</div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>Opnieuw</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-04" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 04: Sterrenbeelden</Link>
          <Link to="/cursus/module-06" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>Module 06: Planeten →</Link>
        </div>
      </div>
    </div>
  );
};
