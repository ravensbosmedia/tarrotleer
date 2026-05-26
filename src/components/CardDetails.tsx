import React from 'react';
import { TarotCard as TarotCardType } from '../types/cards';

interface Props {
  card: TarotCardType;
  isReversed: boolean;
}

export const CardDetails: React.FC<Props> = ({ card, isReversed }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">{card.nameNL} ({card.name})</h3>
      
      {/* Basis betekenis */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-purple-700 mb-2">Betekenis:</h4>
        <p className="text-gray-700">{isReversed ? card.meaningReversed : card.meaningUpright}</p>
      </div>

      {/* Beschrijving */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-purple-700 mb-2">Beschrijving:</h4>
        <p className="text-gray-700">{card.description}</p>
      </div>

      {/* Uitgebreide beschrijving */}
      {card.extendedDescription && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-purple-700 mb-2">Uitgebreide Beschrijving:</h4>
          <div className="text-gray-700 whitespace-pre-line">{card.extendedDescription}</div>
        </div>
      )}

      {/* Liefdeslezing */}
      {card.loveReading && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-purple-700 mb-2">In de Liefde:</h4>
          <p className="text-gray-700">{card.loveReading}</p>
        </div>
      )}

      {/* Extra informatie */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-purple-600">Arcana:</span>
            <span className="ml-2 text-gray-700">
              {card.suit === 'major' ? 'Grote Arcana' : 'Kleine Arcana'}
            </span>
          </div>
          {card.suit !== 'major' && (
            <div>
              <span className="font-semibold text-purple-600">Reeks:</span>
              <span className="ml-2 text-gray-700">
                {card.suit === 'wands' && 'Staven'}
                {card.suit === 'cups' && 'Kelken'}
                {card.suit === 'swords' && 'Zwaarden'}
                {card.suit === 'pentacles' && 'Pentakels'}
              </span>
            </div>
          )}
          <div>
            <span className="font-semibold text-purple-600">Nummer:</span>
            <span className="ml-2 text-gray-700">{card.number}</span>
          </div>
        </div>
      </div>
    </div>
  );
};