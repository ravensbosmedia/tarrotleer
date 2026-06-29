import React, { useState, useMemo } from 'react';
import { allCards } from '../data/cards';
import { TarotCard as TarotCardType } from '../types/cards';
import { CardDetails } from '../components/CardDetails';
import { Search } from 'lucide-react';

const SUITS = [
  { value: 'all',       label: 'Alle kaarten' },
  { value: 'major',     label: 'Grote Arcana' },
  { value: 'wands',     label: 'Staven' },
  { value: 'cups',      label: 'Kelken' },
  { value: 'swords',    label: 'Zwaarden' },
  { value: 'pentacles', label: 'Pentakels' },
];

export const BibliotheekPage: React.FC = () => {
  const [suit, setSuit] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TarotCardType | null>(null);
  const [showReversed, setShowReversed] = useState(false);

  const filtered = useMemo(() => allCards.filter(c => {
    const matchSuit = suit === 'all' || c.suit === suit;
    const q = search.toLowerCase();
    const matchSearch = !q || c.nameNL.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      || c.meaningUpright.toLowerCase().includes(q);
    return matchSuit && matchSearch;
  }), [suit, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Kaartbibliotheek</h1>
          <p className="text-purple-200">Alle 78 Rider-Waite-Smith kaarten als naslagwerk</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam of betekenis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={suit}
            onChange={e => setSuit(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {SUITS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} kaarten gevonden</p>

        {/* Kaartenraster */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {filtered.map(card => (
            <div
              key={card.id}
              onClick={() => { setSelected(card); setShowReversed(false); }}
              className="cursor-pointer group"
            >
              <div className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                <img
                  src={card.imageUrl}
                  alt={card.nameNL}
                  loading="lazy"
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <p className="text-xs text-center mt-1 text-gray-600 leading-tight">{card.nameNL}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-purple-800">{selected.nameNL}</h3>
                <button
                  onClick={() => setShowReversed(!showReversed)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    showReversed
                      ? 'bg-purple-100 border-purple-400 text-purple-700'
                      : 'border-gray-300 text-gray-500 hover:border-purple-400'
                  }`}
                >
                  {showReversed ? 'Omgekeerd' : 'Rechtop'}
                </button>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6">
              <CardDetails card={selected} isReversed={showReversed} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
