import React from 'react';
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

export const CelticCrossLayout: React.FC<Props> = ({
  selectedCards,
  getCardById,
  positions,
  onCardClick,
  showPositionDescriptions,
  positionDescriptions,
  onDrawCard
}) => {
  const renderCard = (index: number, additionalClasses: string = '', rotation: number = 0) => {
    if (index >= selectedCards.length) {
      return (
        <button
          onClick={onDrawCard}
          className={`w-24 h-36 md:w-32 md:h-48 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors ${additionalClasses}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Shuffle className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
        </button>
      );
    }

    const cardId = selectedCards[index];
    const card = getCardById(cardId);
    const position = positions[index];
    if (!card) return null;
    const isReversed = Math.random() > 0.5;

    return (
      <div 
        onClick={() => onCardClick(cardId, position)}
        className={`cursor-pointer transform hover:scale-105 transition-transform ${additionalClasses}`}
      >
        <div 
          className="w-24 h-36 md:w-32 md:h-48"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <TarotCardComponent
            card={card}
            isReversed={isReversed}
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs md:text-sm font-medium text-gray-600">{position}</p>
          {showPositionDescriptions && positionDescriptions && (
            <p className="mt-1 text-xs text-gray-500 max-w-[150px] md:max-w-[200px] mx-auto">
              {positionDescriptions[index]}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="relative min-h-[800px] flex items-center justify-center">
        <div className="relative w-[800px] h-[800px]">
          {/* Centraal kruis */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Kaart 1 (Centrum) */}
            <div className="relative">
              {renderCard(0, 'z-20')}
              
              {/* Kaart 2 (Kruisend) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {renderCard(1, 'z-10', 90)}
              </div>
            </div>
          </div>

          {/* Kaart 3 (Onder/Basis) */}
          <div className="absolute left-1/2 bottom-[20%] -translate-x-1/2">
            {renderCard(2)}
          </div>

          {/* Kaart 4 (Links/Verleden) */}
          <div className="absolute left-[20%] top-1/2 -translate-y-1/2">
            {renderCard(3)}
          </div>

          {/* Kaart 5 (Boven/Kroon) */}
          <div className="absolute left-1/2 top-[20%] -translate-x-1/2">
            {renderCard(4)}
          </div>

          {/* Kaart 6 (Rechts/Toekomst) */}
          <div className="absolute right-[20%] top-1/2 -translate-y-1/2">
            {renderCard(5)}
          </div>

          {/* Verticale kolom (Kaarten 7-10) */}
          <div className="absolute right-0 top-[15%] space-y-4">
            {[6, 7, 8, 9].map((position) => (
              <div key={position} className="flex justify-end">
                {renderCard(position)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};