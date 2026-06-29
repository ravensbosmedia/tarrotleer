import React, { useState, useEffect, useCallback } from 'react';
import { pendelQuizVragen, QuizVraag } from '../../data/pendel/quiz';

const HIGHSCORE_KEY = 'pendel_quiz_highscore';

const G = {
  goud: '#B8860B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#FDFAF4',
  bg2: '#F5F0E8',
  bg3: '#EDE6D6',
  tekst: '#2C2416',
  tekst2: '#6B5C3E',
  tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)',
  rand2: 'rgba(184,134,11,0.35)',
};

function schudVragen(vragen: QuizVraag[]): QuizVraag[] {
  const kopie = [...vragen];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export const QuizPage: React.FC = () => {
  const [vragen, setVragen]           = useState<QuizVraag[]>([]);
  const [huidigIndex, setHuidigIndex] = useState(0);
  const [gekozen, setGekozen]         = useState<number | null>(null);
  const [score, setScore]             = useState(0);
  const [isKlaar, setIsKlaar]         = useState(false);
  const [highscore, setHighscore]     = useState(0);

  const initialiseer = useCallback(() => {
    setVragen(schudVragen(pendelQuizVragen));
    setHuidigIndex(0);
    setGekozen(null);
    setScore(0);
    setIsKlaar(false);
  }, []);

  useEffect(() => {
    initialiseer();
    const opgeslagen = localStorage.getItem(HIGHSCORE_KEY);
    if (opgeslagen) setHighscore(parseInt(opgeslagen, 10));
  }, [initialiseer]);

  const handleAntwoord = (idx: number) => {
    if (gekozen !== null) return;
    setGekozen(idx);
    if (idx === vragen[huidigIndex].correct) setScore(s => s + 1);
  };

  const volgende = () => {
    if (huidigIndex + 1 >= vragen.length) {
      const finalScore = score + (gekozen === vragen[huidigIndex].correct ? 0 : 0);
      const pct = Math.round((score / vragen.length) * 100);
      const saved = parseInt(localStorage.getItem(HIGHSCORE_KEY) ?? '0', 10);
      if (pct > saved) {
        localStorage.setItem(HIGHSCORE_KEY, pct.toString());
        setHighscore(pct);
      }
      setIsKlaar(true);
    } else {
      setHuidigIndex(i => i + 1);
      setGekozen(null);
    }
  };

  if (vragen.length === 0) return null;

  const voortgangPct = (huidigIndex / vragen.length) * 100;
  const scorePct     = vragen.length > 0 ? Math.round((score / vragen.length) * 100) : 0;
  const vraag        = vragen[huidigIndex];

  // ── Resultaatscherm ──────────────────────────────────────────────────────
  if (isKlaar) {
    const boodschap =
      scorePct >= 80 ? 'Uitstekend! U beheerst de pendeltheorie goed.' :
      scorePct >= 60 ? 'Goed gedaan! Herhaal de lessen voor nog betere resultaten.' :
                       'Oefen nog wat — herlees de lessen en probeer opnieuw.';

    return (
      <div className="pendel-pagina">
        <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Test je kennis
            </p>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 400, color: G.tekst }}>
              Pendelquiz
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: 620, margin: '3rem auto', padding: '0 2rem' }}>
          <div style={{
            background: G.bg,
            border: `0.5px solid ${G.rand2}`,
            borderRadius: 8,
            padding: '2.5rem',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.10em', color: G.goud, marginBottom: '1rem', textTransform: 'uppercase' }}>
              Resultaat
            </p>
            <p style={{ fontSize: 56, fontWeight: 300, color: G.tekst, marginBottom: '0.4rem', lineHeight: 1 }}>
              {score}/{vragen.length}
            </p>
            <p style={{ fontSize: 24, color: G.tekst2, fontStyle: 'italic', marginBottom: '1.5rem' }}>
              {scorePct}% correct
            </p>
            <p style={{ fontSize: 16, color: G.tekst2, fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {boodschap}
            </p>

            {/* Highscore */}
            <div style={{
              display: 'inline-block',
              background: G.goudBleek,
              border: `0.5px solid ${G.rand2}`,
              borderRadius: 6,
              padding: '0.6rem 1.2rem',
              marginBottom: '1.8rem',
              fontSize: 14,
              color: G.goudDonker,
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.04em',
            }}>
              Beste score: {Math.max(scorePct, highscore)}%
              {scorePct >= highscore && scorePct > 0 && (
                <span style={{ marginLeft: 8, color: G.goud }}>✦ Nieuw record!</span>
              )}
            </div>

            <div>
              <button
                onClick={initialiseer}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 13, letterSpacing: '0.08em',
                  padding: '11px 28px',
                  background: G.goud, color: '#fff',
                  border: 'none', borderRadius: 4,
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = G.goudDonker)}
                onMouseOut={e => (e.currentTarget.style.background = G.goud)}
              >
                Opnieuw doen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz scherm ──────────────────────────────────────────────────────────
  return (
    <div className="pendel-pagina">
      {/* Header */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Test je kennis
          </p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 400, color: G.tekst, marginBottom: '0.3rem' }}>
            Pendelquiz
          </h1>
          <p style={{ fontSize: 16, fontStyle: 'italic', color: G.tekst2 }}>
            {vragen.length} vragen over de pendelleer
            {highscore > 0 && (
              <span style={{ marginLeft: 12, fontSize: 13, color: G.goudDonker, fontStyle: 'normal', fontFamily: "'Cinzel', serif" }}>
                Beste: {highscore}%
              </span>
            )}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: '2.5rem auto', padding: '0 2rem' }}>
        {/* Voortgangsinfo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', color: G.tekst3 }}>
            Vraag {huidigIndex + 1} van {vragen.length}
          </span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', color: G.goud }}>
            Score: {score}
          </span>
        </div>

        {/* Voortgangsbalk */}
        <div style={{ height: 2, background: G.bg3, borderRadius: 1, marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: G.goud, borderRadius: 1, width: `${voortgangPct}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Vraagkaart */}
        <div style={{
          background: G.bg,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 8,
          padding: '2rem',
          marginBottom: '1rem',
        }}>
          <p style={{ fontSize: 19, color: G.tekst, lineHeight: 1.55, marginBottom: '1.5rem' }}>
            {vraag.vraag}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {vraag.opties.map((optie, i) => {
              let bg = G.bg;
              let borderClr = G.rand2;
              let txtClr = G.tekst2;

              if (gekozen !== null) {
                if (i === vraag.correct) {
                  bg = '#E8F5E9'; borderClr = '#4CAF50'; txtClr = '#2E7D32';
                } else if (i === gekozen) {
                  bg = '#FFEBEE'; borderClr = '#EF5350'; txtClr = '#C62828';
                } else {
                  bg = G.bg; borderClr = G.rand; txtClr = G.tekst3;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAntwoord(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: `0.5px solid ${borderClr}`,
                    borderRadius: 6,
                    cursor: gekozen !== null ? 'default' : 'pointer',
                    fontSize: 15, color: txtClr,
                    background: bg,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    fontFamily: "'Crimson Pro', serif",
                  }}
                  onMouseOver={e => { if (gekozen === null) e.currentTarget.style.background = G.goudBleek; }}
                  onMouseOut={e => { if (gekozen === null) e.currentTarget.style.background = G.bg; }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: G.bg3, color: G.tekst3,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cinzel', serif", fontSize: 11,
                    flexShrink: 0,
                  }}>
                    {LETTERS[i]}
                  </span>
                  {optie}
                </button>
              );
            })}
          </div>

          {/* Uitleg */}
          {gekozen !== null && (
            <div style={{
              marginTop: '1.2rem',
              padding: '0.9rem 1.1rem',
              borderRadius: 6,
              background: gekozen === vraag.correct ? '#E8F5E9' : '#FFEBEE',
              border: `0.5px solid ${gekozen === vraag.correct ? '#A5D6A7' : '#EF9A9A'}`,
              color: gekozen === vraag.correct ? '#2E7D32' : '#C62828',
              fontSize: 15,
              lineHeight: 1.6,
              fontFamily: "'Crimson Pro', serif",
            }}>
              <strong>{gekozen === vraag.correct ? '✓ Goed! ' : '✗ Helaas. '}</strong>
              {vraag.uitleg}
            </div>
          )}
        </div>

        {/* Volgende knop */}
        {gekozen !== null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={initialiseer}
              style={{
                fontSize: 13, color: G.tekst3,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Crimson Pro', serif",
                textDecoration: 'underline',
              }}
            >
              Quiz opnieuw starten
            </button>
            <button
              onClick={volgende}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 13, letterSpacing: '0.06em',
                padding: '10px 24px',
                background: G.goud, color: '#fff',
                border: 'none', borderRadius: 4,
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = G.goudDonker)}
              onMouseOut={e => (e.currentTarget.style.background = G.goud)}
            >
              {huidigIndex + 1 >= vragen.length ? 'Resultaat bekijken' : 'Volgende vraag →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
