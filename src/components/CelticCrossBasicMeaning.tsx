import React from 'react';
import { ArrowDownUp } from 'lucide-react';
import { TarotCard } from '../types/cards';

interface Props {
  cards: TarotCard[];
  positions: string[];
}

interface CardInterpretationProps {
  card: TarotCard;
  position: string;
  positionNumber: number;
  meaning: string;
  isReversed: boolean;
  relation?: string;
}

const CardInterpretation: React.FC<CardInterpretationProps> = ({
  card,
  position,
  positionNumber,
  meaning,
  isReversed,
  relation
}) => {
  return (
    <div className="border border-gray-100 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-24 h-36 transform transition-transform ${isReversed ? 'rotate-180' : ''}`}>
            <img
              src={card.imageUrl}
              alt={card.nameNL}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-600">
            <ArrowDownUp className="w-4 h-4" />
            {isReversed ? 'Omgekeerd' : 'Rechtop'}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
              Positie {positionNumber}
            </span>
            <h5 className="text-lg font-semibold text-purple-700">
              {position}
            </h5>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Kaart: </span>
              {card.nameNL} ({card.name})
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Positie betekenis: </span>
              {meaning}
            </p>

            {/* Algemene betekenis van de stand */}
            <div className="mt-4 bg-purple-50 p-3 rounded-lg">
              <p className="font-medium text-purple-700 mb-2">
                {isReversed ? 'Omgekeerde Kaart Betekenis:' : 'Rechtopstaande Kaart Betekenis:'}
              </p>
              <ul className="space-y-1 text-gray-700">
                {isReversed ? (
                  <>
                    <li>• Energie is geblokkeerd of naar binnen gericht</li>
                    <li>• Subtielere of verborgen aspecten komen naar voren</li>
                    <li>• Uitnodiging tot diepere reflectie</li>
                    <li>• Mogelijke uitdagingen of leerpunten</li>
                    <li>• Innerlijke werk is nodig voor vooruitgang</li>
                  </>
                ) : (
                  <>
                    <li>• Natuurlijke energie van de kaart stroomt vrij</li>
                    <li>• Directe en heldere manifestatie van de betekenis</li>
                    <li>• Bewuste en actieve expressie van de energie</li>
                    <li>• Externe en zichtbare aspecten zijn dominant</li>
                    <li>• Krachten werken in harmonie met je intenties</li>
                  </>
                )}
              </ul>
            </div>

            {/* Specifieke kaart interpretatie */}
            <div className="mt-4">
              <p className="text-gray-700">
                <span className="font-medium">Specifieke interpretatie: </span>
                {isReversed ? card.meaningReversed : card.meaningUpright}
              </p>
            </div>

            {relation && (
              <p className="text-gray-700 mt-4">
                <span className="font-medium">Samenhang: </span>
                {relation}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const positionMeanings = [
  "De kern van je vraag of situatie - Deze kaart weerspiegelt de huidige energie en centrale thema.",
  "Wat je uitdaagt of tegenwerkt - Deze invloed kruist je pad en vraagt om aandacht.",
  "De basis of fundament - Dit zijn de onderliggende factoren die je situatie beïnvloeden.",
  "Het recente verleden - Deze energie is net voorbij maar heeft nog steeds invloed.",
  "De beste potentiële uitkomst - Dit is wat je kunt bereiken in deze situatie.",
  "De nabije toekomst - Deze energie komt naar je toe en vraagt om voorbereiding.",
  "Jouw houding en benadering - Zo sta je zelf in de situatie.",
  "Je omgeving en externe invloeden - Deze factoren beïnvloeden je van buitenaf.",
  "Je hoop en vrees - Dit zijn je innerlijke verwachtingen en zorgen.",
  "De uiteindelijke uitkomst - Dit is het meest waarschijnlijke resultaat."
];

export const CelticCrossBasicMeaning: React.FC<Props> = ({ cards, positions }) => {
  return (
    <div className="space-y-8">
      <div className="bg-purple-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-purple-700 mb-4">Basis Interpretatie</h3>
        <p className="text-gray-700 mb-4">
          Het Keltisch Kruis is een krachtige en veelzijdige legging die verschillende aspecten van je vraag of situatie belicht. 
          Elke positie heeft een specifieke betekenis die samen een compleet beeld vormen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <CardInterpretation
            key={index}
            card={card}
            position={positions[index]}
            positionNumber={index + 1}
            meaning={positionMeanings[index]}
            isReversed={Math.random() > 0.5}
            relation={index > 0 ? `Deze kaart heeft een directe relatie met positie ${index}.` : undefined}
          />
        ))}
      </div>
    </div>
  );
};