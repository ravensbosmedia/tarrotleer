import React from 'react';
import { TarotCard as TarotCardType } from '../types/cards';

interface Props {
  card: TarotCardType;
  isReversed?: boolean;
  onClick?: () => void;
  faceDown?: boolean;
  disabled?: boolean;
  selected?: boolean;
  selectionNumber?: number;
}

export const TarotCard: React.FC<Props> = ({ 
  card, 
  isReversed = false, 
  onClick, 
  faceDown = false,
  disabled = false,
  selected = false,
  selectionNumber
}) => {
  return (
    <div 
      className={`relative w-20 h-32 md:w-24 md:h-36 rounded-lg shadow-lg overflow-hidden cursor-pointer 
        transition-all duration-300 transform 
        ${isReversed ? 'rotate-180' : ''} 
        ${disabled ? 'opacity-25 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'} 
        ${selected ? 'ring-4 ring-purple-600 scale-105' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      {faceDown ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 p-0.5">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg">
            <div className="w-full h-full flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEwwIDMwbDMwIDMwIDMwLTMwTDMwIDB6TTMwIDUyLjVMMy43NSAzMCAzMCA3LjUgNTYuMjUgMzAgMzAgNTIuNXoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] bg-repeat">
              <div className="w-12 h-12 text-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <img 
          src={card.imageUrl} 
          alt={card.nameNL}
          className="w-full h-full object-cover"
        />
      )}
      {selected && selectionNumber !== undefined && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {selectionNumber}
        </div>
      )}
    </div>
  );
};