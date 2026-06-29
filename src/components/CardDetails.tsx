import React from 'react';
import { TarotCard as TarotCardType } from '../types/cards';

interface Props {
  card: TarotCardType;
  isReversed: boolean;
  position?: string;
}

export const CardDetails: React.FC<Props> = ({ card, isReversed, position }) => {
  const suitName = () => {
    switch (card.suit) {
      case 'wands': return 'Staven';
      case 'cups': return 'Kelken';
      case 'swords': return 'Zwaarden';
      case 'pentacles': return 'Pentakels';
      case 'major': return 'Grote Arcana';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">

      {/* Linker kolom: grote kaartafbeelding */}
      <div className="flex flex-col items-center gap-3 md:w-56 shrink-0">
        <div
          className={`w-44 rounded-xl shadow-2xl overflow-hidden transition-transform duration-500 ${
            isReversed ? 'rotate-180' : ''
          }`}
        >
          <img
            src={card.imageUrl}
            alt={card.nameNL}
            className="w-full h-auto"
          />
        </div>
        <div className="text-center">
          <p className="font-bold text-purple-800 text-lg">{card.nameNL}</p>
          <p className="text-gray-400 text-sm">{card.name}</p>
          {isReversed && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              Omgekeerd
            </span>
          )}
          {position && (
            <p className="mt-1 text-sm text-gray-500 italic">{position}</p>
          )}
        </div>
      </div>

      {/* Rechter kolom: tekst */}
      <div className="flex-1 min-w-0">

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">
            {isReversed ? 'Omgekeerde betekenis' : 'Betekenis'}
          </h4>
          <p className="text-gray-800 leading-relaxed">
            {isReversed ? card.meaningReversed : card.meaningUpright}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">
            Beschrijving
          </h4>
          <p className="text-gray-700 leading-relaxed">{card.description}</p>
        </div>

        {card.extendedDescription && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">
              Uitgebreide beschrijving
            </h4>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
              {card.extendedDescription}
            </div>
          </div>
        )}

        {card.loveReading && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">
              In de liefde
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm">{card.loveReading}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex gap-4 text-sm text-gray-500">
          <span><span className="font-medium text-purple-600">Arcana:</span> {suitName()}</span>
          <span><span className="font-medium text-purple-600">Nummer:</span> {card.number}</span>
        </div>
      </div>
    </div>
  );
};
