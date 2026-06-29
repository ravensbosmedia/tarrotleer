import React, { useState, useCallback } from 'react';
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

function buildQuestion(pool: TarotCardType[], mode: Mode) {
  const correct = pickRandom(pool);
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

  const next = useCallback(() => {
    setQuestion(buildQuestion(pool.length >= 4 ? pool : allCards, mode));
    setAnswered(null);
  }, [pool, mode]);

  const answer = (cardId: number) => {
    if (answered !== null) return;
    setAnswered(cardId);
    setTotal(t => t + 1);
    if (cardId === question.correct.id) setScore(s => s + 1);
  };

  const reset = () => {
    setScore(0);
    setTotal(0);
    setAnswered(null);
    setQuestion(buildQuestion(pool.length >= 4 ? pool : allCards, mode));
  };

  const { correct, isReversed, options } = question;
  const pct = total > 0 ? Math.round(score / total * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Quiz</h1>
          <p className="text-purple-200">Test je kennis van de tarotkaarten</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Instellingen */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select value={suit} onChange={e => { setSuit(e.target.value); reset(); }}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
            {SUITS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <div className="flex gap-1 bg-white border rounded-lg overflow-hidden">
            {([['betekenis', 'Betekenis raden'], ['naam', 'Naam raden']] as [Mode, string][]).map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); reset(); }}
                className={`px-3 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={reset} className="ml-auto flex items-center gap-1 text-sm text-purple-600">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Score */}
        <div className="flex gap-6 mb-6 text-center">
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <p className="text-3xl font-bold text-purple-700">{score}</p>
            <p className="text-xs text-gray-500">Goed</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <p className="text-3xl font-bold text-gray-700">{total}</p>
            <p className="text-xs text-gray-500">Totaal</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow p-4">
            <p className="text-3xl font-bold text-green-600">{pct}%</p>
            <p className="text-xs text-gray-500">Score</p>
          </div>
        </div>

        {/* Vraag */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 flex flex-col items-center gap-4 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className={`w-36 rounded-xl shadow-lg overflow-hidden ${isReversed ? 'rotate-180' : ''}`}>
              <img src={correct.imageUrl} alt="?" className="w-full h-auto" />
            </div>
            {isReversed && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Omgekeerd</span>}

            <h2 className="text-lg font-semibold text-gray-700 text-center">
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
              let style = 'border-2 border-gray-200 bg-white hover:border-purple-400';
              if (answered !== null) {
                if (isCorrect) style = 'border-2 border-green-500 bg-green-50';
                else if (isChosen) style = 'border-2 border-red-400 bg-red-50';
                else style = 'border-2 border-gray-100 bg-gray-50 opacity-60';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => answer(opt.id)}
                  disabled={answered !== null}
                  className={`text-left p-4 rounded-xl transition-all ${style}`}
                >
                  <div className="flex items-start gap-2">
                    {answered !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
                    {answered !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {mode === 'betekenis'
                          ? opt.nameNL
                          : (isReversed ? opt.meaningReversed : opt.meaningUpright)}
                      </p>
                      {mode === 'naam' && answered !== null && (
                        <p className="text-xs text-gray-400 mt-0.5">{opt.nameNL}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {answered !== null && (
            <div className="px-5 pb-5">
              <div className={`text-sm p-3 rounded-lg mb-3 ${answered === correct.id ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {answered === correct.id ? '✓ Correct!' : `✗ Het juiste antwoord was: ${correct.nameNL}`}
                <p className="mt-1 text-xs opacity-80">
                  {isReversed ? correct.meaningReversed : correct.meaningUpright}
                </p>
              </div>
              <button
                onClick={next}
                className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
