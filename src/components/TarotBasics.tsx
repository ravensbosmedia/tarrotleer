import React from 'react';
import { Flame, Droplets, Wind, Mountain } from 'lucide-react';

interface SuitInfo {
  name: string;
  element: string;
  icon: React.ComponentType;
  eigenschappen: string[];
  seizoen: string;
  beschrijving: string;
}

const suitInfo: SuitInfo[] = [
  {
    name: "Staven",
    element: "Vuur",
    icon: Flame,
    eigenschappen: [
      "Energie en creativiteit",
      "Ondernemingszin",
      "Spirituele groei",
      "Passie en ambitie"
    ],
    seizoen: "Lente",
    beschrijving: "Staven vertegenwoordigen het element vuur en staan voor creativiteit, passie en spirituele groei."
  },
  {
    name: "Kelken",
    element: "Water",
    icon: Droplets,
    eigenschappen: [
      "Emoties en gevoelens",
      "Relaties en liefde",
      "Intuïtie en dromen",
      "Innerlijke wereld"
    ],
    seizoen: "Zomer",
    beschrijving: "Kelken zijn verbonden met het element water en symboliseren emoties, relaties en intuïtie."
  },
  {
    name: "Zwaarden",
    element: "Lucht",
    icon: Wind,
    eigenschappen: [
      "Intellect en gedachten",
      "Communicatie",
      "Uitdagingen en conflicten",
      "Mentale helderheid"
    ],
    seizoen: "Herfst",
    beschrijving: "Zwaarden representeren het element lucht en staan voor het intellect, communicatie en mentale processen."
  },
  {
    name: "Pentakels",
    element: "Aarde",
    icon: Mountain,
    eigenschappen: [
      "Materiële zaken",
      "Werk en carrière",
      "Fysieke gezondheid",
      "Praktische aspecten"
    ],
    seizoen: "Winter",
    beschrijving: "Pentakels zijn verbonden met het element aarde en vertegenwoordigen materiële en praktische aspecten van het leven."
  }
];

export const TarotBasics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-purple-800 mb-8">De Basis van Tarot</h2>
      
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-purple-700 mb-4">Structuur van het Deck</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600 mb-3">Grote Arcana</h4>
            <p className="text-gray-700">
              22 kaarten (0-21) die de grote levenslessen en spirituele reizen vertegenwoordigen.
              Deze kaarten zijn de meest krachtige in het deck en tonen belangrijke archetypen en levensfasen.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600 mb-3">Kleine Arcana</h4>
            <p className="text-gray-700">
              56 kaarten verdeeld over vier suits, die dagelijkse situaties en ervaringen weerspiegelen.
              Elke suit heeft 10 genummerde kaarten en 4 hofkaarten.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-purple-700 mb-6">De Vier Suits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suitInfo.map((suit) => {
            const Icon = suit.icon;
            return (
              <div key={suit.name} className="bg-white border border-purple-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 text-purple-600 mr-2" />
                  <h4 className="text-xl font-semibold text-purple-600">{suit.name}</h4>
                </div>
                <p className="text-purple-700 font-medium mb-2">Element: {suit.element}</p>
                <p className="text-purple-700 font-medium mb-4">Seizoen: {suit.seizoen}</p>
                <ul className="text-gray-600 space-y-2">
                  {suit.eigenschappen.map((eigenschap, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      {eigenschap}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-purple-700 mb-6">Hofkaarten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Schildknaap",
              beschrijving: "Vertegenwoordigt nieuwe beginnen, leren en ontdekking"
            },
            {
              title: "Ridder",
              beschrijving: "Staat voor actie, beweging en het nastreven van doelen"
            },
            {
              title: "Koningin",
              beschrijving: "Symboliseert beheersing, nurturing en innerlijke wijsheid"
            },
            {
              title: "Koning",
              beschrijving: "Representeert meesterschap, autoriteit en voltooiing"
            }
          ].map((kaart) => (
            <div key={kaart.title} className="bg-purple-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold text-purple-600 mb-3">{kaart.title}</h4>
              <p className="text-gray-700">{kaart.beschrijving}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};