import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LETTER_BETEKENISSEN, LETTER_POSITIES, MODULE03_QUIZ, MODULE03_VOORBEELD } from '../../data/cursus/module03';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };
type Tab = 'posities' | 'alfabet' | 'oefenen' | 'voorbeeld' | 'quiz';

const VOORVOEGSELS = ['van der', 'van de', 'van den', 'van het', 'van \'t', 'in de', 'in het', 'op de', 'op het', 'van', 'de', 'het', 'der', 'ter', 'den', '\'t', 'te'];

function filterVoorvoegsel(naam: string): string {
  const delen = naam.toLowerCase().trim().split(/\s+/);
  const resultDelen: string[] = [];
  let i = 0;
  while (i < delen.length) {
    let overgeslagen = false;
    for (const vv of VOORVOEGSELS) {
      const vvDelen = vv.split(' ');
      if (vvDelen.length > 1 && i + vvDelen.length <= delen.length) {
        const kandidaat = delen.slice(i, i + vvDelen.length).join(' ');
        if (kandidaat === vv) { i += vvDelen.length; overgeslagen = true; break; }
      } else if (vvDelen.length === 1 && delen[i] === vv) {
        i++; overgeslagen = true; break;
      }
    }
    if (!overgeslagen) { resultDelen.push(naam.trim().split(/\s+/)[i]); i++; }
  }
  return resultDelen.join('').toUpperCase();
}

function analyseerNaam(input: string) {
  const gefilterd = filterVoorvoegsel(input);
  const letters = gefilterd.replace(/[^A-Z]/g, '').split('');
  if (letters.length === 0) return null;
  const cornerstone = letters[0];
  const capstone = letters[letters.length - 1];
  const eersteKlinker = letters.find(l => ['A','E','I','O','U'].includes(l)) || null;
  const cs = LETTER_BETEKENISSEN.find(lb => lb.letter === cornerstone);
  const cap = LETTER_BETEKENISSEN.find(lb => lb.letter === capstone);
  const ek = eersteKlinker ? LETTER_BETEKENISSEN.find(lb => lb.letter === eersteKlinker) : null;
  return { gefilterd, cornerstone, capstone, eersteKlinker, cs, cap, ek };
}

export const CursusModule03Page: React.FC = () => {
  const [tab, setTab] = useState<Tab>('posities');
  const [openPositie, setOpenPositie] = useState<number | null>(null);
  const [geselecteerdeLetterIdx, setGeselecteerdeLetterIdx] = useState<number | null>(null);
  const [naamInput, setNaamInput] = useState('');
  const [quizAntwoorden, setQuizAntwoorden] = useState<Record<number, number>>({});
  const [quizIngediend, setQuizIngediend] = useState(false);
  const score = quizIngediend ? MODULE03_QUIZ.filter((v, i) => quizAntwoorden[i] === v.juist).length : 0;

  const analyse = naamInput.trim().length > 0 ? analyseerNaam(naamInput) : null;

  const TABS = [
    { id: 'posities' as Tab, label: '3 Posities' },
    { id: 'alfabet' as Tab, label: 'A–Z' },
    { id: 'oefenen' as Tab, label: 'Oefenen' },
    { id: 'voorbeeld' as Tab, label: 'Voorbeeld' },
    { id: 'quiz' as Tab, label: 'Quiz' },
  ];

  const geselecteerdeLetter = geselecteerdeLetterIdx !== null ? LETTER_BETEKENISSEN[geselecteerdeLetterIdx] : null;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/cursus" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Cursus Overzicht</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Module 03</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Letter-analyse</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Cornerstone, Capstone & Eerste Klinker — plus de symboliek van alle 26 letters</p>
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

        {tab === 'posities' && (
          <div>
            <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>
                De letter-analyse is een <strong style={{ color: G.goudBleek }}>verfijning</strong> van de naam-getallen — gebruik het nadat Expression, Personality en Soul er staan.
                De 3 sleutelposities geven de energie van <em>hoe</em> iemand beweegt, niet alleen <em>wie</em> iemand is.
              </p>
            </div>
            {LETTER_POSITIES.map((pos, i) => (
              <div key={pos.id} style={{ marginBottom: '0.75rem', background: G.bg2, border: `0.5px solid ${openPositie === i ? G.goud : 'rgba(184,134,11,0.2)'}`, borderRadius: 10 }}>
                <button onClick={() => setOpenPositie(openPositie === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goudBleek }}>{pos.naam}</div>
                    <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)', marginTop: '0.1rem' }}>{pos.kort}</div>
                  </div>
                  <span style={{ color: G.goud, fontSize: 16 }}>{openPositie === i ? '▲' : '▼'}</span>
                </button>
                {openPositie === i && (
                  <div style={{ padding: '0 1.25rem 1.25rem' }}>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,237,216,0.80)', marginBottom: '1rem' }}>{pos.watIsHet}</p>
                    <div style={{ background: G.bg3, borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Berekening</div>
                      <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{pos.berekening}</p>
                    </div>
                    <div style={{ background: 'rgba(184,134,11,0.08)', borderRadius: 8, padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Voorbeeld</div>
                      <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{pos.voorbeeld}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'alfabet' && (
          <div>
            <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)', marginBottom: '1rem' }}>Klik op een letter voor de volledige betekenis.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {LETTER_BETEKENISSEN.map((lb, idx) => (
                <button key={lb.letter} onClick={() => setGeselecteerdeLetterIdx(geselecteerdeLetterIdx === idx ? null : idx)} style={{
                  background: geselecteerdeLetterIdx === idx ? G.goud : (lb.isKlinker ? 'rgba(184,134,11,0.15)' : G.bg2),
                  border: `0.5px solid ${geselecteerdeLetterIdx === idx ? G.goud : (lb.isKlinker ? 'rgba(184,134,11,0.4)' : 'rgba(184,134,11,0.2)')}`,
                  borderRadius: 8, padding: '0.5rem 0', cursor: 'pointer', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: geselecteerdeLetterIdx === idx ? '#1A1208' : G.goudBleek }}>{lb.letter}</div>
                  <div style={{ fontSize: 10, color: geselecteerdeLetterIdx === idx ? '#2C2416' : 'rgba(184,134,11,0.7)' }}>{lb.waarde}</div>
                </button>
              ))}
            </div>
            {geselecteerdeLetter && (
              <div style={{ background: G.bg2, border: `0.5px solid ${G.goud}`, borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 36, color: G.goud, width: 60, height: 60, background: 'rgba(184,134,11,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{geselecteerdeLetter.letter}</div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: G.goudBleek }}>{geselecteerdeLetter.archetype}</div>
                    <div style={{ fontSize: 12, color: 'rgba(184,134,11,0.6)' }}>Waarde {geselecteerdeLetter.waarde} · {geselecteerdeLetter.isKlinker ? 'Klinker' : 'Medeklinker'}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, marginBottom: '1rem' }}>{geselecteerdeLetter.energie}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Positief</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{geselecteerdeLetter.positief}</p>
                  </div>
                  <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Schaduw</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{geselecteerdeLetter.schaduw}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: geselecteerdeLetter.alsEersteKlinker ? '0.75rem' : 0 }}>
                  <div style={{ background: G.bg3, borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Als Cornerstone</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.5 }}>{geselecteerdeLetter.alsCornerstone}</p>
                  </div>
                  <div style={{ background: G.bg3, borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Als Capstone</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.70)', margin: 0, lineHeight: 1.5 }}>{geselecteerdeLetter.alsCapstone}</p>
                  </div>
                </div>
                {geselecteerdeLetter.alsEersteKlinker && (
                  <div style={{ background: 'rgba(46,80,160,0.1)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Als Eerste Klinker</div>
                    <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{geselecteerdeLetter.alsEersteKlinker}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'oefenen' && (
          <div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Volledige naam (inclusief tussenvoegsels)
              </label>
              <input
                value={naamInput}
                onChange={e => setNaamInput(e.target.value)}
                placeholder="b.v. Maria van der Heuvel"
                style={{ width: '100%', background: G.bg3, border: `0.5px solid rgba(184,134,11,0.3)`, borderRadius: 8, padding: '10px 14px', color: G.goudBleek, fontSize: 15, fontFamily: "'Crimson Pro', Georgia, serif", boxSizing: 'border-box' }}
              />
            </div>
            {analyse && (
              <div>
                <div style={{ background: 'rgba(184,134,11,0.06)', border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: 13, color: 'rgba(245,237,216,0.55)' }}>
                  Na filter: <strong style={{ color: G.goudBleek }}>{analyse.gefilterd}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: 'Cornerstone', letter: analyse.cornerstone, data: analyse.cs, color: G.goud },
                    { label: 'Capstone', letter: analyse.capstone, data: analyse.cap, color: '#7A9BDB' },
                    { label: 'Eerste Klinker', letter: analyse.eersteKlinker || '—', data: analyse.ek, color: '#5CB87A' },
                  ].map(item => (
                    <div key={item.label} style={{ background: G.bg2, border: `0.5px solid rgba(184,134,11,0.2)`, borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: item.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.label}</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 28, color: item.color, marginBottom: '0.3rem' }}>{item.letter}</div>
                      {item.data && (
                        <>
                          <div style={{ fontSize: 11, color: G.goudBleek, marginBottom: '0.25rem' }}>{item.data.archetype}</div>
                          <div style={{ fontSize: 10, color: 'rgba(184,134,11,0.6)' }}>waarde {item.data.waarde}</div>
                        </>
                      )}
                      {!item.data && item.letter === '—' && <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.35)' }}>geen klinker gevonden</div>}
                    </div>
                  ))}
                </div>
                {analyse.cs && (
                  <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.1rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Cornerstone {analyse.cornerstone} — als opstap-energie</div>
                    <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{analyse.cs.alsCornerstone}</p>
                  </div>
                )}
                {analyse.cap && (
                  <div style={{ background: G.bg2, border: '0.5px solid rgba(60,80,180,0.2)', borderRadius: 10, padding: '1.1rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Capstone {analyse.capstone} — afrond-energie</div>
                    <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{analyse.cap.alsCapstone}</p>
                  </div>
                )}
                {analyse.ek && analyse.eersteKlinker && (
                  <div style={{ background: 'rgba(92,184,122,0.06)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 10, padding: '1.1rem' }}>
                    <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Eerste Klinker {analyse.eersteKlinker} — vanbinnen drijvende kracht</div>
                    <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{analyse.ek.alsEersteKlinker ?? analyse.ek.energie}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'voorbeeld' && (
          <div>
            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '0.25rem' }}>{MODULE03_VOORBEELD.origineleNaam}</h3>
              <div style={{ fontSize: 13, color: 'rgba(245,237,216,0.45)', marginBottom: '1rem' }}>Na filter: <strong style={{ color: G.goudBleek }}>{MODULE03_VOORBEELD.naFilterNaam}</strong></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {MODULE03_VOORBEELD.posities.map(p => (
                  <div key={p.positie} style={{ background: G.bg3, borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{p.positie.split(' ')[0]}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, color: G.goud }}>{p.letter}</div>
                    <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.55)', marginTop: '0.2rem' }}>{p.archetype}</div>
                  </div>
                ))}
              </div>
              {MODULE03_VOORBEELD.lezingen.map((l, i) => (
                <div key={i} style={{ background: 'rgba(184,134,11,0.06)', borderLeft: `2px solid rgba(184,134,11,0.3)`, borderRadius: '0 6px 6px 0', padding: '0.6rem 0.75rem', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{l}</p>
                </div>
              ))}
              <div style={{ background: 'rgba(46,80,160,0.1)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 8, padding: '0.75rem 1rem', marginTop: '1rem' }}>
                <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Spanningsveld</div>
                <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{MODULE03_VOORBEELD.spanningsveld}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goud, marginBottom: '1.5rem' }}>Quiz — Module 3</h2>
            {MODULE03_QUIZ.map((v, qi) => (
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
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: G.goud }}>{score} / {MODULE03_QUIZ.length}</div>
                <div style={{ fontSize: 14, color: 'rgba(245,237,216,0.65)', marginTop: '0.25rem' }}>{score >= 8 ? '✦ Uitstekend.' : score >= 6 ? 'Goed.' : 'Herhaal de letter-posities.'}</div>
                <button onClick={() => { setQuizIngediend(false); setQuizAntwoorden({}); }} style={{ marginTop: '1rem', padding: '8px 18px', background: 'transparent', border: `0.5px solid ${G.goud}`, borderRadius: 6, color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 11, cursor: 'pointer' }}>Opnieuw</button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <Link to="/cursus/module-02" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Module 02: Naam-getallen</Link>
          <Link to="/cursus/module-04" style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>Module 04: Sterrenbeelden →</Link>
        </div>
      </div>
    </div>
  );
};
