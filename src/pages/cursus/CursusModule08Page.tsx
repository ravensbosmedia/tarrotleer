import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SYNTHESE_STAPPEN, AI_PROMPT_TEKST, WANNEER_GEEN_AI, WANNEER_WEL_AI, GOEDE_SYNTHESE_KENMERKEN, MODULE08_QUIZ } from '../../data/cursus/module08';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };
type Tab = 'methode' | 'kenmerken' | 'ai' | 'quiz';

export const CursusModule08Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('methode');
  const [openStap, setOpenStap] = useState<number | null>(null);
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);
  const score = quizIngediend ? MODULE08_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  const TABS = [
    { id: 'methode' as Tab, label: '4 Stappen' },
    { id: 'kenmerken' as Tab, label: 'Goede Synthese' },
    { id: 'ai' as Tab, label: 'AI & Adviseur' },
    { id: 'quiz' as Tab, label: 'Quiz' },
  ];

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 08</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Synthese</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Van data naar verhaal — de 4-stappen-methode</p>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
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

        {tab === 'methode' && (
          <div>
            <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>
                Het moeilijkste vak: alle losse berekeningen samenvoegen tot één coherente, eerlijke en bruikbare persoonsomschrijving. Doel: <strong style={{ color: G.goudBleek }}>max 200 woorden</strong>, 3 lagen, specifiek en herkenbaar.
              </p>
            </div>
            {SYNTHESE_STAPPEN.map((stap, i) => (
              <div key={stap.nummer} style={{ marginBottom: '0.75rem', background: G.bg2, border: `0.5px solid ${openStap === i ? G.goud : 'rgba(184,134,11,0.2)'}`, borderRadius: 10 }}>
                <button onClick={() => setOpenStap(openStap === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: G.goud, width: 36, textAlign: 'center' }}>{stap.nummer}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{stap.titel}</div>
                      <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)', marginTop: '0.1rem' }}>{stap.beschrijving.substring(0, 60)}…</div>
                    </div>
                  </div>
                  <span style={{ color: G.goud, fontSize: 16 }}>{openStap === i ? '▲' : '▼'}</span>
                </button>
                {openStap === i && (
                  <div style={{ padding: '0 1.25rem 1.25rem' }}>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)', marginBottom: '1rem' }}>{stap.beschrijving}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {stap.details.map((d, di) => (
                        <div key={di} style={{ background: 'rgba(184,134,11,0.06)', borderLeft: '2px solid rgba(184,134,11,0.3)', borderRadius: '0 6px 6px 0', padding: '0.6rem 0.75rem' }}>
                          <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'kenmerken' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {GOEDE_SYNTHESE_KENMERKEN.map((k, i) => (
                <div key={i} style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: G.goud, minWidth: 90, letterSpacing: '0.06em' }}>{k.kenmerk}</div>
                  <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{k.beschrijving}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(46,80,160,0.1)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 10, padding: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: '#7A9BDB', marginBottom: '0.75rem' }}>De 3-lagen-structuur</h3>
              {[
                { n: 1, label: 'Kern (50 woorden)', beschrijving: 'Wie is deze persoon? Centrale energie in 1-2 zinnen. Concreet, niet generiek.' },
                { n: 2, label: 'Werkthema (80 woorden)', beschrijving: 'De spanning of het groeithema. Benoem OOK de schaduwzijde — geen vleiend verhaal.' },
                { n: 3, label: 'Bruikbaar nu (50 woorden)', beschrijving: 'Concrete handelingen of bewustwording. Wat kan de klant morgen al doen?' },
              ].map(l => (
                <div key={l.n} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: l.n < 3 ? '0.5px solid rgba(184,134,11,0.1)' : 'none' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: G.goud, minWidth: 28 }}>{l.n}</div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: G.goudBleek, marginBottom: '0.2rem' }}>{l.label}</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.65)', margin: 0, lineHeight: 1.5 }}>{l.beschrijving}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'ai' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.25)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Wanneer GEEN AI</div>
                {WANNEER_GEEN_AI.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#DB7A7A', fontSize: 14, marginTop: '0.1rem' }}>✕</span>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.25)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Wanneer WEL AI</div>
                {WANNEER_WEL_AI.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#5CB87A', fontSize: 14, marginTop: '0.1rem' }}>✓</span>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '0.75rem' }}>AI Prompt Template</h3>
              <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.55)', marginBottom: '0.75rem' }}>
                Vervang <code style={{ background: 'rgba(184,134,11,0.15)', borderRadius: 4, padding: '1px 5px', fontSize: 12 }}>{'{n}'}</code>, <code style={{ background: 'rgba(184,134,11,0.15)', borderRadius: 4, padding: '1px 5px', fontSize: 12 }}>{'{naam}'}</code> etc. met de werkelijke data voor de klant.
              </p>
              <div style={{ background: G.bg3, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '1rem', fontFamily: 'monospace', fontSize: 12, color: 'rgba(245,237,216,0.75)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {AI_PROMPT_TEKST}
              </div>
            </div>
            <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginTop: '1rem' }}>
              <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: G.goudBleek }}>Rol van de adviseur:</strong> AI is grondstof. Jij maakt het persoonlijk, eerlijk en passend voor <em>deze</em> klant, op <em>deze</em> dag.
              </p>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Quiz — Module 8</h2>
            {MODULE08_QUIZ.map((v, qi) => (
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
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud }}>{score} / {MODULE08_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)', marginTop: '0.25rem' }}>{score >= 8 ? '✦ Cursus voltooid.' : score >= 6 ? 'Goed. Herhaal synthese-stappen.' : 'Herhaal de 4 stappen en kenmerken.'}</div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>Opnieuw</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-07" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 07: Compatibiliteit</Link>
        </div>
      </div>
    </div>
  );
};
