import React, { useMemo } from 'react';
import { TarotCard as TarotCardComponent } from './TarotCard';
import { TarotCard as TarotCardType } from '../types/cards';
import { Shuffle } from 'lucide-react';

interface Props {
  selectedCards: number[];
  getCardById: (id: number) => TarotCardType | undefined;
  positions: string[];
  onCardClick: (cardId: number, position: string) => void;
  showPositionDescriptions?: boolean;
  positionDescriptions?: string[];
  onDrawCard?: () => void;
}

// Plaats in het kruis (3×3 raster) voor kaart 1–6; kaart 7–10 vormen de staf ernaast.
// Kaart 2 ligt dwars over kaart 1, iets verschoven zodat beide afbeeldingen zichtbaar blijven.
const KRUIS_PLEK: Record<number, { kolom: number; rij: number }> = {
  0: { kolom: 2, rij: 2 },  // heden (met kaart 2 erover)
  2: { kolom: 2, rij: 3 },  // basis
  3: { kolom: 1, rij: 2 },  // verleden
  4: { kolom: 2, rij: 1 },  // kroon
  5: { kolom: 3, rij: 2 },  // toekomst
};

export const CelticCrossLayout: React.FC<Props> = ({
  selectedCards,
  getCardById,
  positions,
  onCardClick,
  showPositionDescriptions,
  positionDescriptions,
  onDrawCard
}) => {
  // Eén keer per legging bepalen welke kaarten omgekeerd liggen (niet bij elke render opnieuw)
  const omgekeerd = useMemo(
    () => new Map(selectedCards.map((id) => [id, Math.random() > 0.5])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCards.join(',')]
  );

  const kaartBeeld = (index: number, rotatie = 0) => {
    if (index >= selectedCards.length) {
      return (
        <button
          onClick={onDrawCard}
          className="w-20 h-32 md:w-24 md:h-36 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          style={{ transform: `rotate(${rotatie}deg)` }}
        >
          <Shuffle className="w-8 h-8 text-gray-400" />
        </button>
      );
    }
    const cardId = selectedCards[index];
    const card = getCardById(cardId);
    if (!card) return null;
    return (
      <div
        onClick={() => onCardClick(cardId, positions[index])}
        className="cursor-pointer"
        style={{ transform: `rotate(${rotatie}deg)` }}
        title={`${index + 1}. ${positions[index]} — ${card.nameNL}`}
      >
        <TarotCardComponent card={card} isReversed={omgekeerd.get(cardId)} />
      </div>
    );
  };

  const label = (index: number) => (
    <div className="mt-2 text-center">
      <p className="text-xs md:text-sm font-medium text-gray-600">{index + 1}. {positions[index]}</p>
      {showPositionDescriptions && positionDescriptions && (
        <p className="mt-1 text-xs text-gray-500 max-w-[140px] mx-auto">{positionDescriptions[index]}</p>
      )}
    </div>
  );

  const losseKaart = (index: number) => (
    <div className="flex flex-col items-center">
      {kaartBeeld(index)}
      {label(index)}
    </div>
  );

  return (
    <div className="w-full">
      {/* Telefoon: alle tien netjes onder elkaar in twee kolommen */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:hidden">
        {positions.slice(0, 10).map((_, i) => (
          <div key={i}>{losseKaart(i)}</div>
        ))}
      </div>

      {/* Groter scherm: het klassieke kruis met de staf ernaast */}
      <div className="hidden md:flex justify-center items-center gap-10 lg:gap-16 py-4">
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 items-center justify-items-center">
          {[0, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ gridColumn: KRUIS_PLEK[i].kolom, gridRow: KRUIS_PLEK[i].rij }}>
              {i === 0 ? (
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {kaartBeeld(0)}
                    {/* Kaart 2 dwars eroverheen, iets naar onderen; bij aanwijzen doorzichtig */}
                    <div className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity group-hover:opacity-25">
                      {kaartBeeld(1, 90)}
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-xs md:text-sm font-medium text-gray-600">1. {positions[0]}</p>
                    <p className="text-xs md:text-sm font-medium text-gray-600">2. {positions[1]}</p>
                  </div>
                </div>
              ) : (
                losseKaart(i)
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {[9, 8, 7, 6].map((i) => (
            <div key={i}>{losseKaart(i)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
