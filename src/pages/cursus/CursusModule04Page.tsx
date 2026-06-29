import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STERRENBEELDEN, ELEMENTEN, MODALITEITEN, MODULE04_QUIZ } from '../../data/cursus/module04';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };
type Tab = 'tekens' | 'elementen' | 'modaliteiten' | 'oefenen' | 'quiz';
const TABS: { id: Tab; label: string }[] = [
  { id: 'tekens', label: '12 Tekens' },
  { id: 'elementen', label: 'Elementen' },
  { id: 'modaliteiten', label: 'Modaliteiten' },
  { id: 'oefenen', label: 'Voorbeeld' },
  { id: 'quiz', label: 'Quiz' },
];
const ELEMENT_KLEUR: Record<string, string> = { Vuur: '#C04020', Aarde: '#60A050', Lucht: '#4080C0', Water: '#2060A0' };

export const CursusModule04Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('tekens');
  const [openTeken, setOpenTeken] = useState<number | null>(null);
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);
  const score = quizIngediend ? MODULE04_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 04</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Sterrenbeelden</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>12 tekens · 4 elementen · 3 modaliteiten</p>
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

        {tab === 'tekens' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {STERRENBEELDEN.map((s, i) => (
                <button key={s.enNaam} onClick={() => setOpenTeken(openTeken === i ? null : i)} style={{
                  background: openTeken === i ? `${ELEMENT_KLEUR[s.element]}22` : G.bg2,
                  border: `0.5px solid ${openTeken === i ? ELEMENT_KLEUR[s.element] : 'rgba(184,134,11,0.2)'}`,
                  borderRadius: 8, padding: '0.75rem 0.5rem', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, marginBottom: '0.25rem' }}>{s.symbool}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goudBleek }}>{s.nlNaam}</div>
                  <div style={{ fontSize: 10, color: ELEMENT_KLEUR[s.element], marginTop: '0.2rem' }}>{s.element}</div>
                </button>
              ))}
            </div>
            {openTeken !== null && (() => {
              const s = STERRENBEELDEN[openTeken];
              return (
                <div style={{ background: G.bg2, border: `0.5px solid ${ELEMENT_KLEUR[s.element]}55`, borderRadius: 10, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: 40 }}>{s.symbool}</div>
                    <div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: G.goudBleek }}>{s.nlNaam}</div>
                      <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.55)' }}>{s.datumVan} – {s.datumTot} · {s.element} · {s.modaliteit} · {s.heerser}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {s.kernwoorden.map(k => (
                      <span key={k} style={{ background: `${ELEMENT_KLEUR[s.element]}22`, border: `0.5px solid ${ELEMENT_KLEUR[s.element]}55`, borderRadius: 12, padding: '2px 10px', fontSize: 12, color: G.goudBleek }}>{k}</span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Positief</div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(245,237,216,0.75)', margin: 0 }}>{s.positief}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Schaduw</div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(245,237,216,0.75)', margin: 0 }}>{s.schaduw}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>In relaties</div>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(245,237,216,0.65)', margin: 0 }}>{s.inRelaties}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>In werk</div>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(245,237,216,0.65)', margin: 0 }}>{s.inWerk}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {tab === 'elementen' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {ELEMENTEN.map(e => (
              <div key={e.naam} style={{ background: G.bg2, border: `0.5px solid ${ELEMENT_KLEUR[e.naam]}44`, borderRadius: 10, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 28 }}>{e.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: ELEMENT_KLEUR[e.naam] }}>{e.naam}</div>
                    <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.55)' }}>{e.tekens.join(' · ')}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { label: 'Energie', val: e.energie },
                    { label: 'Kernkwaliteit', val: e.kernkwaliteit },
                    { label: 'Schaduw', val: e.schaduw },
                    { label: 'Behoefte', val: e.behoefte },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(245,237,216,0.75)', margin: 0 }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'modaliteiten' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {MODALITEITEN.map(m => (
              <div key={m.naam} style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 28 }}>{m.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud }}>{m.naam}</div>
                    <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.55)' }}>{m.tekens.join(' · ')}</div>
                  </div>
                </div>
                {[
                  { label: 'Energie', val: m.energie },
                  { label: 'Kwaliteit', val: m.kwaliteit },
                  { label: 'Schaduw', val: m.schaduw },
                ].map(({ label, val }) => (
                  <div key={label} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}: </span>
                    <span style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)' }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === 'oefenen' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Voorbeeld — Frans (geboren 14-07-1979)</h2>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.8)', marginBottom: '1rem' }}>14 juli valt tussen 21 juni en 22 juli → <strong style={{ color: G.goud }}>Kreeft ♋</strong></p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Teken', val: 'Kreeft' },
                  { label: 'Element', val: 'Water' },
                  { label: 'Modaliteit', val: 'Cardinaal' },
                  { label: 'Heerser', val: 'Maan' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goudBleek }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Samenspel met numerologie</div>
                {[
                  'Kreeft versterkt Levenspad 2 — beide gaan over verbinding en zorg',
                  'Kreeft + Soul 3 — gevoelig én expressie-verlangend',
                  'Kreeft (Cardinaal) + Levenspad 2 — leidende rol in zorg en verbinding',
                  'Personality 4 (stoïcijn) vs Kreeft-natuur (gevoelig) — de buitenkant verbergt de gevoeligheid',
                ].map((p, i) => (
                  <p key={i} style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, marginBottom: '0.4rem' }}>• {p}</p>
                ))}
              </div>
              <div style={{ background: 'rgba(184,134,11,0.08)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 14, color: 'rgba(245,237,216,0.7)', lineHeight: 1.7 }}>
                <strong style={{ color: G.goud }}>Sessie-tip:</strong> In een gesprek benoem je: Frans heeft een gevoelige Kreeft-natuur maar laat dat niet altijd zien (Personality 4 verbergt het). Het is veilig voor hem om de Kreeft-energie meer ruimte te geven — vooral in vertrouwde relaties.
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '0.5rem' }}>Quiz — Module 4</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.55)', marginBottom: '1.5rem' }}>10 vragen over sterrenbeelden</p>
            {MODULE04_QUIZ.map((v, qi) => (
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
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud, marginBottom: '0.25rem' }}>{score} / {MODULE04_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)' }}>{score >= 8 ? '✦ Uitstekend.' : score >= 6 ? 'Goed — bekijk de uitleg bij foute antwoorden.' : 'Herhaal de lessen.'}</div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>Opnieuw</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-03" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 03: Letter-analyse</Link>
          <Link to="/cursus/module-05" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>Module 05: Maanfasen →</Link>
        </div>
      </div>
    </div>
  );
};
