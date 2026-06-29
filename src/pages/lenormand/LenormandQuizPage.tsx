import React, { useState, useMemo } from 'react';
import { lenormandQuizVragen } from '../../data/lenormand';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', goudDonker: '#7A5C00',
  bg: '#FDFAF4', bg2: '#F5F0E8', bg3: '#EDE6D6',
  tekst: '#2C2416', tekst2: '#6B5C3E', tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)', rand2: 'rgba(184,134,11,0.35)',
};

const LETTERS = ['A', 'B', 'C', 'D'];

function schud<T>(arr: T[]): T[] {
  const k = [...arr];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

function boodschap(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1)   return 'Perfecte score — jij kent de Lenormand als je broekzak. Uitstekend!';
  if (pct >= 0.8)  return 'Indrukwekkend! Je Lenormand-kennis is sterk. Blijf oefenen voor perfectie.';
  if (pct >= 0.6)  return 'Goed bezig! Een solide basis. Herhaal de kaarten die je nog verrassen.';
  if (pct >= 0.4)  return 'Een redelijk begin. De Lenormand vraagt tijd — blijf oefenen met de flashcards.';
  return 'Geen zorgen — herhaling is de sleutel. Ga terug naar de bibliotheek en flashcards.';
}

export const LenormandQuizPage: React.FC = () => {
  const [vragen] = useState(() => schud(lenormandQuizVragen));
  const [vraagIndex, setVraagIndex] = useState(0);
  const [gekozen, setGekozen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [klaar, setKlaar] = useState(false);
  const [highscore, setHighscore] = useState<number>(() => {
    const opgeslagen = localStorage.getItem('lenormand-quiz-highscore');
    return opgeslagen ? parseInt(opgeslagen, 10) : 0;
  });

  const vraag = vragen[vraagIndex];
  const totaal = vragen.length;
  const nieuweRecord = klaar && score > highscore;

  const kiesOptie = (i: number) => {
    if (gekozen !== null) return;
    setGekozen(i);
    if (i === vraag.correct) setScore(s => s + 1);
  };

  const volgende = () => {
    if (vraagIndex + 1 >= totaal) {
      const nieuweScore = gekozen === vraag.correct ? score + 1 : score;
      const finaalScore = vraagIndex === 0 ? (gekozen === vraag.correct ? 1 : 0) : nieuweScore;
      // Gebruik de al-bijgehouden score
      const eindScore = score + (gekozen === vraag.correct ? 1 : 0);
      if (eindScore > highscore) {
        setHighscore(eindScore);
        localStorage.setItem('lenormand-quiz-highscore', String(eindScore));
      }
      setKlaar(true);
    } else {
      setVraagIndex(i => i + 1);
      setGekozen(null);
    }
  };

  const herstart = () => {
    setVraagIndex(0);
    setGekozen(null);
    setScore(0);
    setKlaar(false);
  };

  if (klaar) {
    const eindScore = score;
    return (
      <div className="pendel-pagina">
        <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Mystieke Lenormand</p>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 400, color: G.tekst }}>Quiz resultaat</h1>
          </div>
        </div>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 56, fontWeight: 400, color: G.goudDonker, marginBottom: '0.3rem' }}>
            {eindScore}<span style={{ fontSize: 28, color: G.tekst3 }}>/{totaal}</span>
          </div>
          {nieuweRecord && (
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goud, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✦ Nieuw record!</div>
          )}
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
            {boodschap(eindScore, totaal)}
          </p>
          <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1rem 1.5rem', display: 'inline-block', marginBottom: '2rem', fontSize: 14, color: G.tekst2 }}>
            Highscore: <strong style={{ color: G.goudDonker }}>{Math.max(eindScore, highscore)}/{totaal}</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center' }}>
            <button onClick={herstart} style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em', padding: '11px 28px', borderRadius: 24, border: `0.5px solid ${G.goud}`, background: G.goudBleek, color: G.goudDonker, cursor: 'pointer' }}>
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const voortgangPct = (vraagIndex / totaal) * 100;

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Mystieke Lenormand</p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: '0.6rem' }}>Quiz</h1>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2 }}>
            Test je kennis van de 36 Lenormand-symbolen.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Voortgang */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: G.tekst3, marginBottom: 4 }}>
            <span>Vraag {vraagIndex + 1} van {totaal}</span>
            <span>Score: {score}</span>
          </div>
          <div style={{ height: 2, background: G.bg3, borderRadius: 1 }}>
            <div style={{ height: '100%', background: G.goud, borderRadius: 1, width: `${voortgangPct}%`, transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Vraag */}
        <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '1.8rem', marginBottom: '1.2rem' }}>
          <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: 19, color: G.tekst, lineHeight: 1.65, margin: 0 }}>
            {vraag.vraag}
          </p>
        </div>

        {/* Opties */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {vraag.opties.map((optie, i) => {
            const isCorrect = i === vraag.correct;
            const isGekozen = gekozen === i;
            let bg = G.bg;
            let borderColor = G.rand2;
            let textColor = G.tekst2;
            if (gekozen !== null) {
              if (isCorrect) { bg = '#F0FDF4'; borderColor = '#86EFAC'; textColor = '#15803D'; }
              else if (isGekozen) { bg = '#FEF2F2'; borderColor = '#FCA5A5'; textColor = '#B91C1C'; }
            }

            return (
              <button
                key={i}
                onClick={() => kiesOptie(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.9rem 1.1rem', borderRadius: 8,
                  border: `0.5px solid ${borderColor}`,
                  background: bg, color: textColor,
                  cursor: gekozen !== null ? 'default' : 'pointer',
                  transition: 'all 0.15s', textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0,
                  background: gekozen !== null && isCorrect ? '#22C55E' : gekozen !== null && isGekozen ? '#EF4444' : G.bg3,
                  color: gekozen !== null && (isCorrect || isGekozen) ? 'white' : G.tekst3,
                  border: `0.5px solid ${gekozen !== null && isCorrect ? '#22C55E' : gekozen !== null && isGekozen ? '#EF4444' : G.rand}`,
                }}>
                  {LETTERS[i]}
                </span>
                <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 16 }}>{optie}</span>
              </button>
            );
          })}
        </div>

        {/* Uitleg na antwoord */}
        {gekozen !== null && (
          <>
            <div style={{
              padding: '1rem 1.2rem', borderRadius: 8, marginBottom: '1.2rem',
              background: gekozen === vraag.correct ? '#F0FDF4' : '#FEF2F2',
              border: `0.5px solid ${gekozen === vraag.correct ? '#86EFAC' : '#FCA5A5'}`,
              fontSize: 14, color: gekozen === vraag.correct ? '#15803D' : '#B91C1C',
              lineHeight: 1.7,
            }}>
              <strong>{gekozen === vraag.correct ? '✓ Goed!' : '✗ Helaas.'}</strong>
              <div style={{ marginTop: '0.4rem', color: G.tekst2 }}>{vraag.uitleg}</div>
            </div>
            <button
              onClick={volgende}
              style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em', padding: '11px 28px', borderRadius: 24, border: `0.5px solid ${G.goud}`, background: G.goudBleek, color: G.goudDonker, cursor: 'pointer' }}
            >
              {vraagIndex + 1 >= totaal ? 'Resultaat bekijken →' : 'Volgende vraag →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LenormandQuizPage;
