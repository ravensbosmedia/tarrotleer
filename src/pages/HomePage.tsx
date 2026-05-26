import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { TarotBasics } from '../components/TarotBasics';
import { TarotHistory } from '../components/TarotHistory';
import { TarotInterpretation } from '../components/TarotInterpretation';
import { TarotInterpretationGuide } from '../components/TarotInterpretationGuide';

type ReadingType = 'daily' | 'three' | 'celtic' | 'relationship' | 'career';

interface Reading {
  title: string;
  description: string;
  cardCount: number;
  positions: string[];
}

const READINGS: Record<ReadingType, Reading> = {
  daily: {
    title: "Dagkaart",
    description: "Trek één kaart voor inzicht in je dag",
    cardCount: 1,
    positions: ["Dagkaart"]
  },
  three: {
    title: "3 Kaarten Legging",
    description: "Verleden, heden en toekomst",
    cardCount: 3,
    positions: ["Verleden", "Heden", "Toekomst"]
  },
  celtic: {
    title: "Keltisch Kruis",
    description: "Diepgaande legging voor complexe vragen",
    cardCount: 10,
    positions: [
      "Huidige situatie",
      "Uitdaging",
      "Verleden",
      "Toekomst",
      "Bewuste invloeden",
      "Onbewuste invloeden",
      "Jouw houding",
      "Externe invloeden",
      "Hoop en vrees",
      "Uiteindelijke uitkomst"
    ]
  },
  relationship: {
    title: "Relatie Legging",
    description: "Inzicht in je relatie of liefdeleven",
    cardCount: 5,
    positions: [
      "Jouw energie",
      "Partner's energie",
      "Verbinding",
      "Uitdagingen",
      "Potentieel"
    ]
  },
  career: {
    title: "Carrière Legging",
    description: "Begeleiding voor je werkende leven",
    cardCount: 4,
    positions: [
      "Huidige positie",
      "Uitdagingen",
      "Kansen",
      "Beste pad vooruit"
    ]
  }
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'basics',
      title: 'Tarot Basis',
      description: 'Leer de fundamenten van tarot en de betekenis van de kaarten.',
      component: TarotBasics
    },
    {
      id: 'history',
      title: 'Geschiedenis',
      description: 'Ontdek de rijke historie en ontwikkeling van tarot door de eeuwen heen.',
      component: TarotHistory
    },
    {
      id: 'interpretation',
      title: 'Interpretatie',
      description: 'Verdiep je in de kunst van het interpreteren van tarotkaarten.',
      component: TarotInterpretation
    },
    {
      id: 'guide',
      title: 'Beginnersgids',
      description: 'Een complete gids voor wie net begint met tarot.',
      component: TarotInterpretationGuide
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Tarot Leggingen</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Basis Informatie Secties */}
        <div className="space-y-4 mb-12">
          {sections.map((section) => {
            const Component = section.component;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-purple-700">{section.title}</h2>
                    <p className="text-gray-600 mt-1">{section.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-purple-600" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    <Component />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leggingen */}
        <h2 className="text-2xl font-bold text-purple-800 mb-6">Kies je Legging</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {(Object.entries(READINGS) as [ReadingType, Reading][]).map(([type, info]) => (
            <button
              key={type}
              onClick={() => navigate(`/reading/${type}`)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-700">{info.title}</h3>
              </div>
              <p className="text-gray-600">{info.description}</p>
              <div className="mt-4 text-sm text-purple-500">
                {info.cardCount} kaart{info.cardCount > 1 ? 'en' : ''}
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Tarot Leggingen - Alle rechten voorbehouden</p>
        </div>
      </footer>
    </div>
  );
};