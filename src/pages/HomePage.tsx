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
    <div className="zf-pagina">
      <div className="zf-kop">
        <div>
          <p className="zf-label">Tarot</p>
          <h1 className="zf-titel">Leggingen</h1>
          <p className="zf-intro">Trek kaarten en krijg inzicht in je situatie</p>
        </div>
      </div>

      <main className="zf-inhoud">
        {/* Basis Informatie Secties */}
        <div className="space-y-4 mb-12">
          {sections.map((section) => {
            const Component = section.component;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="zf-kaart overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#17112C] transition-colors"
                >
                  <div>
                    <h2 className="font-medium text-[#FFF3DF] text-xl">{section.title}</h2>
                    <p className="text-[#CFC2DC] mt-1">{section.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-[#F1CB78]" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#F1CB78]" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="border-t border-[rgba(194,146,189,0.25)]">
                    <Component />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leggingen */}
        <h2 className="zf-sectie mb-6">Kies je Legging</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {(Object.entries(READINGS) as [ReadingType, Reading][]).map(([type, info]) => (
            <button
              key={type}
              onClick={() => navigate(`/reading/${type}`)}
              className="zf-kaart zf-kaart-klik p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-6 h-6 text-[#F1CB78]" />
                <h3 className="font-medium text-[#FFF3DF] text-xl">{info.title}</h3>
              </div>
              <p className="text-[#CFC2DC]">{info.description}</p>
              <div className="mt-4 text-sm text-[#F1CB78]">
                {info.cardCount} kaart{info.cardCount > 1 ? 'en' : ''}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};