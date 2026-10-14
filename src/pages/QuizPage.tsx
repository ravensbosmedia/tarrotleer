import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { haalQuizStats, slaRondeOp, maakGewicht, QuizStat } from '../lib/voortgang';
import { allCards } from '../data/cards';
import { TarotCard as TarotCardType } from '../types/cards';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

type Mode = 'naam' | 'betekenis' | 'kaart';

const SUITS = [
  { value: 'all', label: 'Alle kaarten' },
  { value: 'major', label: 'Grote Arcana' },
  { value: 'wands', label: 'Staven' },
  { value: 'cups', label: 'Kelken' },
  { value: 'swords', label: 'Zwaarden' },
  { value: 'pentacles', label: 'Pentakels' },
];

function pickRandom<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter(x => x !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Kiest een kaart, met voorkeur voor kaarten die vaak fout gaan of nog niet gevraagd zijn. */
function pickGewogen(pool: TarotCardType[], gewicht?: (sleutel: string) => number): TarotCardType {
  if (!gewicht) return pickRandom(pool);
  const g = pool.map((c) => gewicht(`kaart:${c.id}`));
  let r = Math.random() * g.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) { r -= g[i]; if (r <= 0) return pool[i]; }
  return pool[pool.length - 1];
}

function buildQuestion(pool: TarotCardType[], mode: Mode, gewicht?: (sleutel: string) => number) {
  const correct = pickGewogen(pool, gewicht);
  const isReversed = Math.random() > 0.5;

  // 3 foute opties
  const wrong = pool.filter(c => c.id !== correct.id);
  const distractors: TarotCardType[] = [];
  while (distractors.length < 3) {
    const pick = pickRandom(wrong);
    if (!distractors.find(d => d.id === pick.id)) distractors.push(pick);
  }

  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

  return { correct, isReversed, options, mode };
}

export const QuizPage: React.FC = () => {
  const [suit, setSuit] = useState('all');
  const [mode, setMode] = useState<Mode>('betekenis');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);  // card id van gekozen antwoord

  const pool = allCards.filter(c => suit === 'all' || c.suit === suit);
  const [question, setQuestion] = useState(() => buildQuestion(allCards, mode));
  const stats = useRef<QuizStat[]>([]);   // voortgang per kaart, voor de weging

  useEffect(() => { haalQuizStats('tarot-quiz').then((s) => { stats.current = s; }); }, []);

  const next = useCallback(() => {
    setQuestion(buildQuestion(pool.length >= 4 ? pool : allCards, mode, maakGewicht(stats.current)));
    setAnswered(null);
  }, [pool, mode]);

  const answer = (cardId: number) => {
    if (answered !== null) return;
    setAnswered(cardId);
    setTotal(t => t + 1);
    const goed = cardId === question.correct.id;
    if (goed) setScore(s => s + 1);
    // Elk antwoord meteen bewaren (doorlopende quiz, dus geen 'ronde')
    const sleutel = `kaart:${question.correct.id}`;
    slaRondeOp('tarot-quiz', goed ? 1 : 0, 1, [
      { sleutel, label: question.correct.nameNL, goed },
      { sleutel: `modus:${mode}`, label: mode, goed },
    ], { ronde: false });
    const bestaand = stats.current.find((s) => s.sleutel === sleutel);
    if (bestaand) { if (goed) bestaand.goed++; else bestaand.fout++; }
    else stats.current.push({ onderdeel: 'tarot-quiz', sleutel, label: question.correct.nameNL, goed: goed ? 1 : 0, fout: goed ? 0 : 1, laatst: '' });
  };

  const reset = () => {
    setScore(0);
    setTotal(0);
    setAnswered(null);
    setQuestion(buildQuestion(pool.length >= 4 ? pool : allCards, mode, maakGewicht(stats.current)));
  };

  const { correct, isReversed, options } = question;
  const pct = total > 0 ? Math.round(score / total * 100) : 0;

  return (
    <div className="zf-pagina">
      <div className="zf-kop">
        <div>
          <p className="zf-label">Tarot</p>
          <h1 className="zf-titel">Quiz</h1>
          <p className="zf-intro">Test je kennis van de tarotkaarten</p>
        </div>
      </div>

      <div className="zf-inhoud max-w-2xl">
        {/* Instellingen */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select value={suit} onChange={e => { setSuit(e.target.value); reset(); }}
            className="zf-veld">
            {SUITS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <div className="zf-kaart flex gap-1 border overflow-hidden">
            {([['betekenis', 'Betekenis raden'], ['naam', 'Naam raden']] as [Mode, string][]).map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); reset(); }}
                className={`px-3 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-[#F1CB78] text-[#1C0D06]' : 'text-[#CFC2DC] hover:bg-[#17112C]'}`}>
                {l}
              </button>
            ))}
          </div>
          <Link to="/voortgang" className="ml-auto self-center text-sm text-[#F1CB78] hover:underline">Mijn voortgang</Link>
          <button onClick={reset} className="flex items-center gap-1 text-sm text-[#F1CB78]">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Score */}
        <div className="flex gap-6 mb-6 text-center">
          <div className="zf-kaart flex-1 p-4">
            <p className="text-3xl font-bold text-[#F1CB78]">{score}</p>
            <p className="text-xs text-[#B9A9CC]">Goed</p>
          </div>
          <div className="zf-kaart flex-1 p-4">
            <p className="text-3xl font-bold text-[#E0D5E9]">{total}</p>
            <p className="text-xs text-[#B9A9CC]">Totaal</p>
          </div>
          <div className="zf-kaart flex-1 p-4">
            <p className="text-3xl font-bold text-[#9BD49B]">{pct}%</p>
            <p className="text-xs text-[#B9A9CC]">Score</p>
          </div>
        </div>

        {/* Vraag */}
        <div className="zf-kaart overflow-hidden">
          <div className="p-6 flex flex-col items-center gap-4 bg-gradient-to-br from-[#20162F] to-[#2D2040]">
            <div className={`w-36 rounded-xl shadow-lg overflow-hidden ${isReversed ? 'rotate-180' : ''}`}>
              <img src={correct.imageUrl} alt="?" className="w-full h-auto" />
            </div>
            {isReversed && <span className="text-xs bg-[#3A2A52] text-[#F1CB78] px-2 py-0.5 rounded-full">Omgekeerd</span>}

            <h2 className="text-lg font-semibold text-[#E0D5E9] text-center">
              {mode === 'betekenis'
                ? 'Wat is de betekenis van deze kaart?'
                : 'Welke kaart is dit?'}
            </h2>
          </div>

          {/* Antwoordopties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
            {options.map(opt => {
              const isCorrect = opt.id === correct.id;
              const isChosen = opt.id === answered;
              let style = 'border-2 border-[rgba(194,146,189,0.3)] bg-[#20162F] hover:border-[#EFB4FF]';
              if (answered !== null) {
                if (isCorrect) style = 'border-2 border-green-500 bg-[rgba(95,167,119,0.15)]';
                else if (isChosen) style = 'border-2 border-[#F0A596] bg-[rgba(200,96,79,0.15)]';
                else style = 'border-2 border-[rgba(194,146,189,0.25)] bg-[#17112C] opacity-60';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => answer(opt.id)}
                  disabled={answered !== null}
                  className={`text-left p-4 rounded-xl transition-all ${style}`}
                >
                  <div className="flex items-start gap-2">
                    {answered !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#9BD49B] shrink-0 mt-0.5" />}
                    {answered !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-medium text-[#FFF3DF] text-sm">
                        {mode === 'betekenis'
                          ? opt.nameNL
                          : (isReversed ? opt.meaningReversed : opt.meaningUpright)}
                      </p>
                      {mode === 'naam' && answered !== null && (
                        <p className="text-xs text-[#9A8CB3] mt-0.5">{opt.nameNL}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {answered !== null && (
            <div className="px-5 pb-5">
              <div className={`text-sm p-3 rounded-lg mb-3 ${answered === correct.id ? 'bg-[rgba(95,167,119,0.15)] text-[#9BD49B]' : 'bg-[rgba(200,96,79,0.15)] text-[#F0A596]'}`}>
                {answered === correct.id ? '✓ Correct!' : `✗ Het juiste antwoord was: ${correct.nameNL}`}
                <p className="mt-1 text-xs opacity-80">
                  {isReversed ? correct.meaningReversed : correct.meaningUpright}
                </p>
              </div>
              <button
                onClick={next}
                className="zf-knop w-full"
              >
                Volgende kaart →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
