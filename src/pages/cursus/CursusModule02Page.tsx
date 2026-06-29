import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAAM_LESSEN, MODULE02_QUIZ, MODULE02_VOORBEELD, LETTERWAARDEN, KLINKERS } from '../../data/cursus/module02';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };

type Tab = 'lessen' | 'tabel' | 'oefenen' | 'voorbeeld' | 'quiz';

const TABS: { id: Tab; label: string }[] = [
  { id: 'lessen', label: 'De 3 Lessen' },
  { id: 'tabel', label: 'Letterwaarde Tabel' },
  { id: 'oefenen', label: 'Oefenen' },
  { id: 'voorbeeld', label: 'Voorbeeld' },
  { id: 'quiz', label: 'Quiz' },
];

function berekenNaamGetallen(naam: string) {
  const filter = ['van', 'de', 'het', 'der', 'ter', 'den', "'t", 'te'];
  const woorden = naam.toLowerCase().split(/\s+/).filter(w => !filter.includes(w));
  const gefilterd = woorden.join('').toUpperCase().replace(/[^A-Z]/g, '');

  let expression = 0, personality = 0, soul = 0;
  for (const ch of gefilterd) {
    const w = LETTERWAARDEN[ch] || 0;
    expression += w;
    if (KLINKERS.has(ch)) soul += w;
    else personality += w;
  }

  const reduceer = (n: number) => {
    while (n > 9 && n !== 11 && n !== 22) {
      n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
    }
    return n;
  };

  return {
    gefilterd,
    expression: reduceer(expression),
    personality: reduceer(personality),
    soul: reduceer(soul),
  };
}

export const CursusModule02Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('lessen');
  const [openLes, setOpenLes] = useState<number | null>(0);
  const [naamInput, setNaamInput] = useState('');
  const [naamResultaat, setNaamResultaat] = useState<ReturnType<typeof berekenNaamGetallen> | null>(null);
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);

  const score = quizIngediend ? MODULE02_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 02</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Naam-getallen</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Expression · Personality · Soul — de 3 Pythagoreaanse naam-getallen</p>
        </div>

        {/* Tabs */}
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

        {/* LESSEN TAB */}
        {tab === 'lessen' && (
          <div>
            <div style={{ marginBottom: '1rem', background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13.5, color: 'rgba(245,237,216,0.7)' }}>
              Naam-getallen gaan een laag dieper dan geboortedatum-getallen. Ze tonen wie je <em>werd</em> door je naam — de sociale en karmische laag.
            </div>
            {NAAM_LESSEN.map((les, idx) => (
              <div key={les.id} style={{ marginBottom: '0.75rem', background: G.bg2, border: `0.5px solid ${openLes === idx ? G.goud : 'rgba(184,134,11,0.2)'}`, borderRadius: 10 }}>
                <button onClick={() => setOpenLes(openLes === idx ? null : idx)} style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(184,134,11,0.15)', border: '1px solid rgba(184,134,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goud, flexShrink: 0 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek }}>{les.naam}</div>
                      <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.5)' }}>{les.kort}</div>
                    </div>
                  </div>
                  <span style={{ color: G.goud, fontSize: 16 }}>{openLes === idx ? '▲' : '▼'}</span>
                </button>

                {openLes === idx && (
                  <div style={{ padding: '0 1.25rem 1.25rem' }}>
                    {/* Wat is het */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', color: '#E8A030', textTransform: 'uppercase', marginBottom: '0.4rem' }}>📘 Wat is dit getal?</div>
                      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.85)', margin: 0 }}>{les.watIsHet}</p>
                    </div>

                    {/* Wat vertelt het */}
                    <div style={{ background: 'rgba(46,120,80,0.12)', border: '0.5px solid rgba(46,120,80,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', color: '#5CB87A', textTransform: 'uppercase', marginBottom: '0.4rem' }}>🔍 Wat vertelt dit over de persoon?</div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)', margin: 0 }}>{les.watVerteltHet}</p>
                    </div>

                    {/* In gesprek */}
                    <div style={{ background: 'rgba(46,80,160,0.12)', border: '0.5px solid rgba(46,80,160,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', color: '#7A9BDB', textTransform: 'uppercase', marginBottom: '0.4rem' }}>💬 Hoe gebruik je dit in een gesprek?</div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)', margin: 0 }}>{les.inGesprek}</p>
                    </div>

                    {/* Berekening */}
                    <div style={{ background: G.bg3, border: '0.5px solid rgba(184,134,11,0.15)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.75rem' }}>⚙️ Berekening</div>
                      <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.6)', marginBottom: '0.5rem' }}>Input: {les.input}</div>
                      <ol style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                        {les.stappen.map((s, si) => (
                          <li key={si} style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, marginBottom: '0.2rem' }}>{s}</li>
                        ))}
                      </ol>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: 6, color: G.goudBleek }}>
                        Voorbeeld: {les.voorbeeld}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* LETTERWAARDE TABEL */}
        {tab === 'tabel' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Pythagoreaanse Letterwaarde-tabel</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {[1,2,3,4,5,6,7,8,9].map(w => {
                const letters = Object.entries(LETTERWAARDEN).filter(([, v]) => v === w).map(([l]) => l);
                return (
                  <div key={w} style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: G.goud, marginBottom: '0.5rem' }}>{w}</div>
                    <div style={{ fontSize: 16, color: G.goudBleek, letterSpacing: '0.1em' }}>{letters.join(' · ')}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '1rem' }}>Klinkers vs Medeklinkers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Klinkers (= Ziel)</div>
                  <div style={{ fontSize: 18, letterSpacing: '0.15em', color: G.goudBleek }}>A · E · I · O · U</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.55)', marginTop: '0.4rem', lineHeight: 1.6 }}>Open klank — wat van binnen leeft. → Soul Number</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Medeklinkers (= Masker)</div>
                  <div style={{ fontSize: 14, letterSpacing: '0.1em', color: 'rgba(245,237,216,0.7)' }}>B C D F G H J K L M N P Q R S T V W X Y Z</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.55)', marginTop: '0.4rem', lineHeight: 1.6 }}>Belemmerde klank — hoe anderen je zien. → Personality Number</div>
                </div>
              </div>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(184,134,11,0.08)', borderRadius: 6, fontSize: 13.5, color: 'rgba(245,237,216,0.7)' }}>
                <strong style={{ color: G.goud }}>Y</strong> telt in AuraLine altijd als medeklinker (waarde 7) — ook al klinkt het soms als een klinker.
              </div>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(184,134,11,0.08)', borderRadius: 6, fontSize: 13.5, color: 'rgba(245,237,216,0.7)' }}>
                <strong style={{ color: G.goud }}>NL voorvoegsels</strong> worden gefilterd: van · de · het · der · ter · den · 't · te
              </div>
            </div>
          </div>
        )}

        {/* OEFENEN TAB */}
        {tab === 'oefenen' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Naam-getallen Berekenen</h2>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: G.goud, marginBottom: '0.5rem' }}>
                Volledige naam
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={naamInput}
                  onChange={e => setNaamInput(e.target.value)}
                  placeholder="bijv. Maria van der Heuvel"
                  style={{ flex: 1, minWidth: 200, padding: '10px 14px', background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, color: G.goudBleek, fontFamily: "'Crimson Pro', serif", fontSize: 15 }}
                />
                <button
                  onClick={() => naamInput.trim() && setNaamResultaat(berekenNaamGetallen(naamInput))}
                  style={{ padding: '10px 20px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}
                >
                  Bereken
                </button>
              </div>
            </div>

            {naamResultaat && (
              <div>
                <div style={{ marginBottom: '1rem', fontSize: 13, color: 'rgba(245,237,216,0.5)' }}>
                  Na filter: <span style={{ color: G.goudBleek, fontFamily: 'monospace' }}>{naamResultaat.gefilterd}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                  {[
                    { naam: 'Expression', getal: naamResultaat.expression, beschrijving: 'Alle letters', kleur: '#E8A030' },
                    { naam: 'Personality', getal: naamResultaat.personality, beschrijving: 'Medeklinkers', kleur: '#7A9BDB' },
                    { naam: 'Soul', getal: naamResultaat.soul, beschrijving: 'Klinkers', kleur: '#5CB87A' },
                  ].map(r => (
                    <div key={r.naam} style={{ background: G.bg2, border: `0.5px solid ${r.kleur}44`, borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, fontFamily: "'Cinzel', serif", color: r.kleur, marginBottom: '0.25rem' }}>{r.getal}</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: G.goudBleek, marginBottom: '0.2rem' }}>{r.naam}</div>
                      <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)' }}>{r.beschrijving}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VOORBEELD TAB */}
        {tab === 'voorbeeld' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Voorbeeld — {MODULE02_VOORBEELD.naam}</h2>

            {/* Letter tabel */}
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goud, marginBottom: '1rem' }}>Letter-uitsplitsing</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Letter', 'Waarde', 'Type'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(184,134,11,0.2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULE02_VOORBEELD.tabel.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid rgba(184,134,11,0.1)' }}>
                      <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontSize: 15, color: G.goudBleek }}>{r.letter}</td>
                      <td style={{ padding: '6px 10px', fontSize: 14, color: G.goud }}>{r.waarde}</td>
                      <td style={{ padding: '6px 10px', fontSize: 13 }}>
                        <span style={{ color: r.type === 'klinker' ? '#5CB87A' : '#7A9BDB', fontSize: 12, fontFamily: "'Cinzel', serif" }}>
                          {r.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Uitkomsten */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {MODULE02_VOORBEELD.uitkomsten.map(u => (
                <div key={u.naam} style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontFamily: "'Cinzel', serif", color: G.goud, marginBottom: '0.25rem' }}>{u.getal}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: G.goudBleek, marginBottom: '0.2rem' }}>{u.naam}</div>
                  <div style={{ fontSize: 12, color: 'rgba(184,134,11,0.7)' }}>{u.archetype}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.4)', fontFamily: 'monospace', marginTop: '0.25rem' }}>{u.berekening}</div>
                </div>
              ))}
            </div>

            {/* Dynamiek */}
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goud, marginBottom: '1rem' }}>Spanningsveld & Dynamiek</h3>
              {MODULE02_VOORBEELD.dynamiek.map((d, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(245,237,216,0.75)', marginBottom: '0.5rem' }}>• {d}</p>
              ))}
            </div>

            <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '1rem', fontSize: 14, color: 'rgba(245,237,216,0.7)', lineHeight: 1.7 }}>
              <strong style={{ color: G.goud }}>Combinatie met Module 1:</strong> {MODULE02_VOORBEELD.combinatieMetModule1}
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '0.5rem' }}>Quiz — Module 2</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.55)', marginBottom: '1.5rem' }}>10 vragen over naam-getallen</p>

            {MODULE02_QUIZ.map((v, qi) => (
              <div key={qi} style={{ background: G.bg2, border: `0.5px solid ${quizIngediend ? (quizAntwoorden[qi] === v.juist ? 'rgba(92,184,122,0.4)' : 'rgba(200,80,80,0.4)') : 'rgba(184,134,11,0.2)'}`, borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: 'rgba(184,134,11,0.6)', marginBottom: '0.5rem' }}>Vraag {qi + 1}</div>
                <p style={{ fontSize: 15, color: G.goudBleek, marginBottom: '0.75rem' }}>{v.vraag}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {v.opties.map((opt, oi) => (
                    <button key={oi} onClick={() => !quizIngediend && setQuizAntwoorden(p => ({ ...p, [qi]: oi }))} style={{
                      background: quizAntwoorden[qi] === oi
                        ? (quizIngediend ? (oi === v.juist ? 'rgba(92,184,122,0.2)' : 'rgba(200,80,80,0.2)') : 'rgba(184,134,11,0.2)')
                        : (quizIngediend && oi === v.juist ? 'rgba(92,184,122,0.1)' : 'transparent'),
                      border: `0.5px solid ${quizAntwoorden[qi] === oi ? G.goud : 'rgba(184,134,11,0.2)'}`,
                      borderRadius: 6, padding: '8px 12px', textAlign: 'left', cursor: quizIngediend ? 'default' : 'pointer',
                      color: G.goudBleek, fontSize: 14, transition: 'all 0.15s',
                    }}>
                      {String.fromCharCode(97 + oi)}) {opt}
                    </button>
                  ))}
                </div>
                {quizIngediend && (
                  <div style={{ marginTop: '0.75rem', fontSize: 13, color: 'rgba(245,237,216,0.65)', background: 'rgba(184,134,11,0.08)', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                    {v.uitleg}
                  </div>
                )}
              </div>
            ))}

            {!quizIngediend ? (
              <button onClick={() => setQuizIngediend(true)} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>
                Controleer antwoorden
              </button>
            ) : (
              <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 10, padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud, marginBottom: '0.25rem' }}>{score} / {MODULE02_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)' }}>
                  {score >= 8 ? '✦ Uitstekend — je beheerst de naam-getallen.' : score >= 6 ? 'Goed — lees de uitleg bij de foute antwoorden.' : 'Herhaal de lessen en probeer opnieuw.'}
                </div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>
                  Opnieuw
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigatie */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-01" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 01: Geboortedatum-getallen</Link>
          <Link to="/cursus/module-03" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>Module 03: Letter-analyse →</Link>
        </div>
      </div>
    </div>
  );
};
