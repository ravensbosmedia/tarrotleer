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
    <div className="zf-pagina">
      <div className="zf-kop">
        <div>
          <p className="zf-label">Tarot</p>
          <h1 className="zf-titel">Kaartbibliotheek</h1>
          <p className="zf-intro">Alle 78 Rider-Waite-Smith kaarten als naslagwerk</p>
        </div>
      </div>

      <div className="zf-inhoud">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9A8CB3]" />
            <input
              type="text"
              placeholder="Zoek op naam of betekenis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="zf-veld w-full pl-9 pr-3"
            />
          </div>
          <select
            value={suit}
            onChange={e => setSuit(e.target.value)}
            className="zf-veld"
          >
            {SUITS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <p className="text-sm text-[#B9A9CC] mb-4">{filtered.length} kaarten gevonden</p>

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
              <p className="text-xs text-center mt-1 text-[#CFC2DC] leading-tight">{card.nameNL}</p>
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
            className="zf-kaart max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-[#FFF3DF] text-xl">{selected.nameNL}</h3>
                <button
                  onClick={() => setShowReversed(!showReversed)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    showReversed
                      ? 'bg-[#3A2A52] border-[#EFB4FF] text-[#F1CB78]'
                      : 'border-[rgba(194,146,189,0.45)] text-[#B9A9CC] hover:border-[#EFB4FF]'
                  }`}
                >
                  {showReversed ? 'Omgekeerd' : 'Rechtop'}
                </button>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#9A8CB3] hover:text-[#CFC2DC] text-2xl">×</button>
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
