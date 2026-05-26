import React from 'react';
import { Book, Palette, Sparkles } from 'lucide-react';

interface TimelineEvent {
  jaar: string;
  titel: string;
  beschrijving: string;
}

const historischeEvents: TimelineEvent[] = [
  {
    jaar: "Oude Egypte",
    titel: "Egyptische Wortels",
    beschrijving: "Verbonden met het Book of Thoth en oude mystieke tradities"
  },
  {
    jaar: "1377",
    titel: "Eerste Documentatie",
    beschrijving: "Eerste geschreven vermelding door Johannes"
  },
  {
    jaar: "14e/15e eeuw",
    titel: "Italiaanse Ontwikkeling",
    beschrijving: "Evolutie van spelkaarten naar divinatie instrumenten"
  },
  {
    jaar: "1909",
    titel: "Rider-Waite Deck",
    beschrijving: "Publicatie van het invloedrijke Rider-Waite deck"
  }
];

interface KleurSymboliek {
  kleur: string;
  betekenis: string;
  bgClass: string;
  textClass: string;
}

const kleuren: KleurSymboliek[] = [
  {
    kleur: "Geel",
    betekenis: "Intellect en communicatie",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800"
  },
  {
    kleur: "Blauw",
    betekenis: "Emotie en spiritualiteit",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800"
  },
  {
    kleur: "Rood",
    betekenis: "Passie en energie",
    bgClass: "bg-red-100",
    textClass: "text-red-800"
  },
  {
    kleur: "Groen",
    betekenis: "Groei en overvloed",
    bgClass: "bg-green-100",
    textClass: "text-green-800"
  },
  {
    kleur: "Paars",
    betekenis: "Mystiek en wijsheid",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800"
  },
  {
    kleur: "Wit",
    betekenis: "Zuiverheid en potentie",
    bgClass: "bg-gray-50",
    textClass: "text-gray-800"
  },
  {
    kleur: "Zwart",
    betekenis: "Mystery en het onbekende",
    bgClass: "bg-gray-900",
    textClass: "text-white"
  }
];

export const TarotHistory: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-purple-800 mb-8">Geschiedenis en Symboliek van Tarot</h2>

      {/* Historische Timeline */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Book className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-2xl font-semibold text-purple-700">Historische Ontwikkeling</h3>
        </div>
        <div className="space-y-6">
          {historischeEvents.map((event, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                <div className="w-0.5 h-full bg-purple-200"></div>
              </div>
              <div className="pb-6">
                <span className="text-sm text-purple-600 font-semibold">{event.jaar}</span>
                <h4 className="text-lg font-semibold text-gray-800 mt-1">{event.titel}</h4>
                <p className="text-gray-600 mt-1">{event.beschrijving}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rider-Waite Sectie */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Palette className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-2xl font-semibold text-purple-700">Het Rider-Waite Legacy</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600 mb-3">Arthur Edward Waite</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Occult geleerde (1857-1942)</li>
              <li>• Lid van de Golden Dawn</li>
              <li>• Auteur van "The Key to the Tarot"</li>
              <li>• Ontwikkelde symbolische interpretatie</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600 mb-3">Pamela Colman Smith</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Kunstenaar (1878-1951)</li>
              <li>• Theatrale achtergrond</li>
              <li>• Unieke artistieke stijl</li>
              <li>• Innovatieve kaartontwerpen</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Symboliek */}
      <div>
        <div className="flex items-center mb-6">
          <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-2xl font-semibold text-purple-700">Kleurensymboliek</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kleuren.map((kleur, index) => (
            <div
              key={index}
              className={`${kleur.bgClass} ${kleur.textClass} p-4 rounded-lg`}
            >
              <h4 className="font-semibold">{kleur.kleur}</h4>
              <p>{kleur.betekenis}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};