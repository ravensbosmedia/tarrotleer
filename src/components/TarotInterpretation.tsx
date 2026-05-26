import React from 'react';
import { Eye, Compass, Layers, Clock } from 'lucide-react';

interface InterpretationLevel {
  title: string;
  aspects: string[];
  description: string;
}

const interpretationLevels: InterpretationLevel[] = [
  {
    title: "Letterlijk Niveau",
    aspects: [
      "Fysieke beschrijving",
      "Concrete gebeurtenissen",
      "Directe acties",
      "Materiële aspecten",
      "Dagelijkse realiteit"
    ],
    description: "Het meest directe niveau van interpretatie, gericht op wat je daadwerkelijk ziet in de kaart."
  },
  {
    title: "Symbolisch Niveau",
    aspects: [
      "Universele symbolen",
      "Kleurenbetekenis",
      "Getallensymboliek",
      "Elementaire symbolen",
      "Astrologische connecties"
    ],
    description: "De diepere betekenislaag die werkt met universele symbolen en archetypen."
  },
  {
    title: "Intuïtief Niveau",
    aspects: [
      "Eerste indrukken",
      "Emotionele respons",
      "Spontane inzichten",
      "Persoonlijke associaties",
      "Energetische waarneming"
    ],
    description: "Het niveau waar je intuïtie en persoonlijke inzichten een hoofdrol spelen."
  }
];

interface TimeAspect {
  phase: string;
  aspects: string[];
  description: string;
}

const timeAspects: TimeAspect[] = [
  {
    phase: "Verleden",
    aspects: [
      "Karmische invloeden",
      "Vorige ervaringen",
      "Patronen uit het verleden",
      "Onafgemaakte zaken",
      "Levenslessen"
    ],
    description: "Wat achter ons ligt en ons heeft gevormd"
  },
  {
    phase: "Heden",
    aspects: [
      "Actuele situatie",
      "Directe invloeden",
      "Momentele energie",
      "Dagelijkse realiteit",
      "Beslissingsmomenten"
    ],
    description: "De huidige situatie en energie"
  },
  {
    phase: "Toekomst",
    aspects: [
      "Potentiële ontwikkelingen",
      "Waarschijnlijke uitkomsten",
      "Mogelijke paden",
      "Tendensen",
      "Waarschuwingen en kansen"
    ],
    description: "Mogelijke ontwikkelingen en potentieel"
  }
];

interface LifeDomain {
  domain: string;
  icon: React.ComponentType;
  aspects: string[];
}

const lifeDomains: LifeDomain[] = [
  {
    domain: "Spiritueel/Ziel",
    icon: Eye,
    aspects: [
      "Levensdoel",
      "Spirituele groei",
      "Hogere leiding",
      "Innerlijke wijsheid",
      "Zielsverbindingen"
    ]
  },
  {
    domain: "Mentaal/Geest",
    icon: Compass,
    aspects: [
      "Gedachtepatronen",
      "Overtuigingen",
      "Besluitvorming",
      "Leerprocessen",
      "Communicatie"
    ]
  },
  {
    domain: "Emotioneel/Hart",
    icon: Layers,
    aspects: [
      "Gevoelsleven",
      "Relationele dynamiek",
      "Emotionele groei",
      "Hartenwensen",
      "Innerlijke balans"
    ]
  },
  {
    domain: "Fysiek/Lichaam",
    icon: Clock,
    aspects: [
      "Materiële zaken",
      "Gezondheid",
      "Praktische aspecten",
      "Fysieke omgeving",
      "Lichamelijke signalen"
    ]
  }
];

export const TarotInterpretation: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-purple-800 mb-8">Tarot Interpretatie</h2>

      {/* Kaartposities */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-purple-700 mb-6">Kaartposities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600 mb-3">Rechtopstaande Kaarten</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Natuurlijke energie van de kaart</li>
              <li>• Actieve manifestatie</li>
              <li>• Directe en duidelijke boodschap</li>
              <li>• Positieve of neutrale betekenis</li>
              <li>• Vrij stromende energie</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600 mb-3">Omgekeerde Kaarten</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Geblokkeerde of vertraagde energie</li>
              <li>• Interne manifestatie</li>
              <li>• Uitdaging of les</li>
              <li>• Waarschuwing of aandachtspunt</li>
              <li>• Behoefte aan extra aandacht</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interpretatieniveaus */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-purple-700 mb-6">Interpretatieniveaus</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interpretationLevels.map((level) => (
            <div key={level.title} className="bg-white border border-purple-100 rounded-lg p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-purple-600 mb-3">{level.title}</h4>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <ul className="space-y-2">
                {level.aspects.map((aspect, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    {aspect}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tijdsaspecten */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-purple-700 mb-6">Tijdsaspecten</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timeAspects.map((time) => (
            <div key={time.phase} className="bg-purple-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold text-purple-600 mb-3">{time.phase}</h4>
              <p className="text-gray-600 mb-4">{time.description}</p>
              <ul className="space-y-2">
                {time.aspects.map((aspect, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    {aspect}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Levensdomeinen */}
      <div>
        <h3 className="text-2xl font-semibold text-purple-700 mb-6">Levensdomeinen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lifeDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div key={domain.domain} className="bg-white border border-purple-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 text-purple-600 mr-2" />
                  <h4 className="text-lg font-semibold text-purple-600">{domain.domain}</h4>
                </div>
                <ul className="space-y-2">
                  {domain.aspects.map((aspect, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      {aspect}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};