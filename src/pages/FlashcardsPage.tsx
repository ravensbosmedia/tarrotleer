import React, { useState, useCallback } from 'react';
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
    setFlipped(false);
    setCardReversed(Math.random() > 0.5);
    setIndex(i => i + 1);
  }, []);

  const reset = () => {
    setDeck(shuffle(suit === 'all' ? allCards : allCards.filter(c => c.suit === suit)));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setPractice(0);
    setCardReversed(Math.random() > 0.5);
  };

  if (!card) return null;
  const done = index > 0 && index % filteredDeck.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Flashcards</h1>
          <p className="text-purple-200">Leer de kaarten kennen door ze te oefenen</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Controls */}
        <div className="flex gap-3 mb-6 items-center flex-wrap">
          <select
            value={suit}
            onChange={e => { setSuit(e.target.value); reset(); }}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {SUITS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={reset} className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800">
            <Shuffle className="w-4 h-4" /> Opnieuw schudden
          </button>
          <div className="ml-auto flex gap-4 text-sm">
            <span className="text-green-600 font-medium">✓ {known}</span>
            <span className="text-orange-500 font-medium">↺ {practice}</span>
          </div>
        </div>

        {/* Voortgangsbalk */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${(progress / filteredDeck.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mb-6 text-center">{progress} / {filteredDeck.length}</p>

        {done ? (
          <div className="text-center bg-white rounded-2xl shadow-lg p-10">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-purple-700 mb-2">Deck voltooid!</h2>
            <p className="text-gray-600 mb-6">Gekend: {known} · Nog oefenen: {practice}</p>
            <button onClick={reset} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Opnieuw beginnen
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Kaart */}
            <div
              className="cursor-pointer select-none"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="flex justify-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className={`w-48 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 ${cardReversed ? 'rotate-180' : ''}`}>
                  {flipped ? (
                    <img src={card.imageUrl} alt={card.nameNL} className="w-full h-auto" />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
                      <span className="text-white/30 text-6xl">✦</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info (zichtbaar na flip) */}
              <div className={`px-8 pb-4 transition-opacity ${flipped ? 'opacity-100' : 'opacity-0 select-none'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-purple-800">{card.nameNL}</h2>
                  {cardReversed && (
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">Omgekeerd</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-3">{card.name}</p>
                <p className="text-gray-700 leading-relaxed">
                  {cardReversed ? card.meaningReversed : card.meaningUpright}
                </p>
              </div>

              {!flipped && (
                <div className="px-8 pb-6 text-center text-gray-400 text-sm">
                  Klik op de kaart om te onthullen
                </div>
              )}
            </div>

            {/* Knoppen */}
            {flipped && (
              <div className="flex border-t">
                <button
                  onClick={() => nextCard(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-orange-500 hover:bg-orange-50 transition-colors font-medium"
                >
                  <ThumbsDown className="w-5 h-5" /> Nog oefenen
                </button>
                <div className="w-px bg-gray-200" />
                <button
                  onClick={() => nextCard(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-green-600 hover:bg-green-50 transition-colors font-medium"
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
