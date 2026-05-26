import React from 'react';
import { Eye, Palette, Sparkles, Brain } from 'lucide-react';

interface ExampleCard {
  name: string;
  letterlijk: string[];
  symbolisch: string[];
  intuitief: string[];
}

const voorbeeldKaart: ExampleCard = {
  name: "De Zon",
  letterlijk: [
    "Een stralende zon aan de hemel",
    "Een kind op een wit paard",
    "Zonnebloemen op de voorgrond",
    "Een blauwe lucht",
    "Een rode vlag in de hand van het kind"
  ],
  symbolisch: [
    "De zon staat voor succes en vreugde",
    "Het kind symboliseert onschuld en puurheid",
    "Het witte paard betekent vrijheid en kracht",
    "Zonnebloemen vertegenwoordigen groei en vitaliteit",
    "De rode vlag staat voor overwinning en energie"
  ],
  intuitief: [
    "Een gevoel van warmte en blijdschap",
    "Optimisme en positieve energie",
    "Het gevoel dat alles mogelijk is",
    "Een nieuw begin met veel potentie",
    "Innerlijke vreugde en levenslust"
  ]
};

interface KleurBetekenis {
  kleur: string;
  betekenis: string;
  voorbeelden: string[];
  bgClass: string;
  textClass: string;
}

const kleurBetekenissen: KleurBetekenis[] = [
  {
    kleur: "Rood",
    betekenis: "Energie en Passie",
    voorbeelden: [
      "Zoals het vuur in je hart",
      "De warmte van verliefdheid",
      "De kracht om te sporten",
      "Moed om iets nieuws te proberen"
    ],
    bgClass: "bg-red-50",
    textClass: "text-red-800"
  },
  {
    kleur: "Blauw",
    betekenis: "Rust en Emotie",
    voorbeelden: [
      "Kalm als een rustige zee",
      "Diep als je gedachten",
      "Vredig als een heldere hemel",
      "Stromend als water"
    ],
    bgClass: "bg-blue-50",
    textClass: "text-blue-800"
  },
  {
    kleur: "Geel",
    betekenis: "Wijsheid en Vrolijkheid",
    voorbeelden: [
      "Helder als zonlicht",
      "Stralend als een glimlach",
      "Warm als een zomerdag",
      "Licht als een nieuwe dag"
    ],
    bgClass: "bg-yellow-50",
    textClass: "text-yellow-800"
  },
  {
    kleur: "Groen",
    betekenis: "Groei en Harmonie",
    voorbeelden: [
      "Fris als nieuwe blaadjes",
      "Gezond als de natuur",
      "Groeiend als een plant",
      "Helend als kruiden"
    ],
    bgClass: "bg-green-50",
    textClass: "text-green-800"
  }
];

export const TarotInterpretationGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-purple-800 mb-8">
        Tarot Lezen voor Beginners
      </h2>

      {/* Introductie */}
      <div className="mb-12 bg-purple-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-purple-700 mb-4">
          Hoe lees je een tarotkaart?
        </h3>
        <p className="text-gray-700">
          Het lezen van tarotkaarten is als het leren van een nieuwe taal. We beginnen met wat we 
          direct kunnen zien (letterlijk niveau), ontdekken dan wat de symbolen betekenen 
          (symbolisch niveau), en uiteindelijk voelen we wat de kaart ons persoonlijk vertelt 
          (intuïtief niveau).
        </p>
      </div>

      {/* De drie niveaus uitgelegd */}
      <div className="grid grid-cols-1 gap-8 mb-12">
        {/* Letterlijk Niveau */}
        <div className="border border-purple-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Eye className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-2xl font-semibold text-purple-700">
              1. Letterlijk Niveau: Wat zie je?
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            Dit is het makkelijkste niveau - je beschrijft gewoon wat je ziet op de kaart, 
            alsof je een foto beschrijft aan iemand anders.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-purple-600 mb-2">
              Voorbeeld met De Zon kaart:
            </h4>
            <ul className="space-y-2">
              {voorbeeldKaart.letterlijk.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Symbolisch Niveau */}
        <div className="border border-purple-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Palette className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-2xl font-semibold text-purple-700">
              2. Symbolisch Niveau: Wat betekent het?
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            Nu kijken we naar de diepere betekenis van wat we zien. Elk symbool en elke 
            kleur heeft een speciale betekenis.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-purple-600 mb-2">
              Voorbeeld met De Zon kaart:
            </h4>
            <ul className="space-y-2">
              {voorbeeldKaart.symbolisch.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kleurenbetekenis */}
          <h4 className="font-semibold text-purple-600 mb-4">Kleuren en hun betekenis:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kleurBetekenissen.map((kleur) => (
              <div
                key={kleur.kleur}
                className={`${kleur.bgClass} ${kleur.textClass} p-4 rounded-lg`}
              >
                <h5 className="font-semibold mb-2">{kleur.kleur}: {kleur.betekenis}</h5>
                <ul className="space-y-1">
                  {kleur.voorbeelden.map((voorbeeld, index) => (
                    <li key={index} className="text-sm">• {voorbeeld}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Intuïtief Niveau */}
        <div className="border border-purple-100 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-2xl font-semibold text-purple-700">
              3. Intuïtief Niveau: Wat voel je?
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            Dit is waar je je eigen gevoel en intuïtie laat spreken. Wat vertelt de kaart 
            jou persoonlijk? Welke gevoelens of herinneringen roept het op?
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-600 mb-2">
              Voorbeeld met De Zon kaart:
            </h4>
            <ul className="space-y-2">
              {voorbeeldKaart.intuitief.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tips voor beginners */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-xl font-semibold text-purple-700">Tips voor beginners</h3>
        </div>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Begin altijd met wat je letterlijk ziet, voordat je naar diepere betekenissen zoekt
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Er zijn geen "foute" interpretaties - vertrouw op je intuïtie
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Neem de tijd om elke kaart goed te bekijken en te voelen
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Maak notities van je interpretaties om je ontwikkeling te volgen
          </li>
        </ul>
      </div>
    </div>
  );
};