import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { haalQuizStats, slaRondeOp, maakGewicht, gewogenSchud, QuizStat } from '../lib/voortgang';
import { allCards } from '../data/cards';
import { TarotCard as TarotCardType } from '../types/cards';
import { RotateCcw, ThumbsUp, ThumbsDown, Shuffle } from 'lucide-react';

const SUITS = [
  { value: 'all',       label: 'Alles' },
  { value: 'major',     label: 'Grote Arcana' },
  { value: 'wands',     label: 'Staven' },
  { value: 'cups',      label: 'Kelken' },
  { value: 'swords',    label: 'Zwaarden' },
  { value: 'pentacles', label: 'Pentakels' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const FlashcardsPage: React.FC = () => {
  const [suit, setSuit] = useState('all');
  const [deck, setDeck] = useState<TarotCardType[]>(() => shuffle(allCards));
  const stats = useRef<QuizStat[]>([]);
  // Kaarten die je nog oefent (of nooit gezien hebt) komen vooraan in de stapel
  const schudGewogen = (kaarten: TarotCardType[]) =>
    gewogenSchud(kaarten, (c) => maakGewicht(stats.current)(`kaart:${c.id}`));

  useEffect(() => {
    haalQuizStats('tarot-flashcards').then((s) => { stats.current = s; setDeck(schudGewogen(allCards)); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isReversed] = useState(() => Math.random() > 0.5);
  const [known, setKnown] = useState(0);
  const [practice, setPractice] = useState(0);
  const [cardReversed, setCardReversed] = useState(false);

  const filteredDeck = deck.filter(c => suit === 'all' || c.suit === suit);
  const card = filteredDeck[index % filteredDeck.length];
  const progress = filteredDeck.length > 0 ? ((index % filteredDeck.length) + 1) : 0;

  const nextCard = useCallback((didKnow: boolean) => {
    if (didKnow) setKnown(k => k + 1); else setPractice(p => p + 1);
    // Per kaart bewaren of je hem kende (bij het account)
    if (card) slaRondeOp('tarot-flashcards', didKnow ? 1 : 0, 1, [{ sleutel: `kaart:${card.id}`, label: card.nameNL, goed: didKnow }], { ronde: false });
    setFlipped(false);
    setCardReversed(Math.random() > 0.5);
    setIndex(i => i + 1);
  }, [card]);

  const reset = () => {
    setDeck(schudGewogen(suit === 'all' ? allCards : allCards.filter(c => c.suit === suit)));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setPractice(0);
    setCardReversed(Math.random() > 0.5);
  };

  if (!card) return null;
  const done = index > 0 && index % filteredDeck.length === 0;

  return (
    <div className="min-h-screen bg-[#17112C]">
      <div className="bg-[#FFC653] text-[#1C0D06] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Flashcards</h1>
          <p className="text-[#E0D5E9]">Leer de kaarten kennen door ze te oefenen</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Controls */}
        <div className="flex gap-3 mb-6 items-center flex-wrap">
          <select
            value={suit}
            onChange={e => { setSuit(e.target.value); reset(); }}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F1CB78]"
          >
            {SUITS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={reset} className="flex items-center gap-1 text-sm text-[#F1CB78] hover:text-[#F1CB78]">
            <Shuffle className="w-4 h-4" /> Opnieuw schudden
          </button>
          <Link to="/voortgang" className="text-sm text-[#F1CB78] hover:underline">Mijn voortgang</Link>
          <div className="ml-auto flex gap-4 text-sm">
            <span className="text-[#9BD49B] font-medium">✓ {known}</span>
            <span className="text-[#F2C27A] font-medium">↺ {practice}</span>
          </div>
        </div>

        {/* Voortgangsbalk */}
        <div className="w-full bg-[#3A2A52] rounded-full h-2 mb-6">
          <div
            className="bg-[#F1CB78] h-2 rounded-full transition-all"
            style={{ width: `${(progress / filteredDeck.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-[#B9A9CC] mb-6 text-center">{progress} / {filteredDeck.length}</p>

        {done ? (
          <div className="text-center bg-[#20162F] rounded-2xl shadow-lg p-10">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-[#F1CB78] mb-2">Deck voltooid!</h2>
            <p className="text-[#CFC2DC] mb-6">Gekend: {known} · Nog oefenen: {practice}</p>
            <button onClick={reset} className="bg-[#F1CB78] text-[#1C0D06] px-6 py-2 rounded-lg hover:bg-[#FFC653]">
              Opnieuw beginnen
            </button>
          </div>
        ) : (
          <div className="bg-[#20162F] rounded-2xl shadow-lg overflow-hidden">
            {/* Kaart */}
            <div
              className="cursor-pointer select-none"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="flex justify-center p-8 bg-gradient-to-br from-[#20162F] to-[#2D2040]">
                <div className={`w-48 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 ${cardReversed ? 'rotate-180' : ''}`}>
                  {flipped ? (
                    <img src={card.imageUrl} alt={card.nameNL} className="w-full h-auto" />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-[#2D2040] to-[#0D0C22] flex items-center justify-center">
                      <span className="text-white/30 text-6xl">✦</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info (zichtbaar na flip) */}
              <div className={`px-8 pb-4 transition-opacity ${flipped ? 'opacity-100' : 'opacity-0 select-none'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-[#F1CB78]">{card.nameNL}</h2>
                  {cardReversed && (
                    <span className="text-xs px-2 py-0.5 bg-[#3A2A52] text-[#F1CB78] rounded-full">Omgekeerd</span>
                  )}
                </div>
                <p className="text-[#B9A9CC] text-sm mb-3">{card.name}</p>
                <p className="text-[#E0D5E9] leading-relaxed">
                  {cardReversed ? card.meaningReversed : card.meaningUpright}
                </p>
              </div>

              {!flipped && (
                <div className="px-8 pb-6 text-center text-[#9A8CB3] text-sm">
                  Klik op de kaart om te onthullen
                </div>
              )}
            </div>

            {/* Knoppen */}
            {flipped && (
              <div className="flex border-t">
                <button
                  onClick={() => nextCard(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[#F2C27A] hover:bg-[rgba(224,176,74,0.12)] transition-colors font-medium"
                >
                  <ThumbsDown className="w-5 h-5" /> Nog oefenen
                </button>
                <div className="w-px bg-[#3A2A52]" />
                <button
                  onClick={() => nextCard(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[#9BD49B] hover:bg-[rgba(95,167,119,0.15)] transition-colors font-medium"
                >
                  <ThumbsUp className="w-5 h-5" /> Ik kende dit!
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
