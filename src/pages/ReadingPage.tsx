import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCards } from '../config/localDB';
import { TarotCard as TarotCardType } from '../types/cards';
import { allCards as localCards } from '../data/cards';
import { TarotCard } from '../components/TarotCard';
import { CelticCrossLayout } from '../components/CelticCrossLayout';
import { CardDetails } from '../components/CardDetails';
import { TarotAIInterpretation } from '../components/TarotAIInterpretation';
import { TarotChat } from '../components/TarotChat';
import { CelticCrossBasicMeaning } from '../components/CelticCrossBasicMeaning';
import { ArrowLeft, Info, Shuffle, Clock, Activity, Compass, Printer, Download } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

type ReadingType = 'daily' | 'three' | 'celtic' | 'relationship' | 'career';

interface Reading {
  title: string;
  description: string;
  cardCount: number;
  positions: string[];
  positionDescriptions?: string[];
  positionIcons?: React.ComponentType[];
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
    positions: ["Verleden", "Heden", "Toekomst"],
    positionDescriptions: [
      "De gebeurtenissen en ervaringen die je hebben gevormd. Deze kaart toont invloeden uit het verleden die nog steeds doorwerken in je huidige situatie.",
      "Waar je nu staat en welke energieën op dit moment actief zijn. Deze kaart weerspiegelt je huidige omstandigheden en uitdagingen.",
      "De potentiële ontwikkelingen die voor je liggen. Deze kaart toont mogelijke uitkomsten gebaseerd op de huidige koers."
    ],
    positionIcons: [Clock, Activity, Compass]
  },
  celtic: {
    title: "Keltisch Kruis",
    description: "Diepgaande legging voor complexe vragen",
    cardCount: 10,
    positions: [
      "Huidige situatie",
      "Uitdaging",
      "Basis",
      "Verleden",
      "Kroon",
      "Toekomst",
      "Jouw houding",
      "Externe invloeden",
      "Hoop en vrees",
      "Uiteindelijke uitkomst"
    ],
    positionDescriptions: [
      "De kern van je vraag of situatie",
      "Wat je uitdaagt of tegenwerkt",
      "De basis of oorsprong van de situatie",
      "Recente verleden invloeden",
      "Je beste potentieel of wat je kunt bereiken",
      "Waar de situatie naartoe gaat",
      "Hoe je zelf in de situatie staat",
      "Je omgeving en externe factoren",
      "Je innerlijke gevoelens en verwachtingen",
      "Het mogelijke eindresultaat"
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

const ReadingPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [allCards, setAllCards] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [selectedCardDetails, setSelectedCardDetails] = useState<{
    card: TarotCardType;
    position: string;
    isReversed: boolean;
  } | null>(null);
  const [showPositionInfo, setShowPositionInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [vraagstelling, setVraagstelling] = useState('');
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [reversedStates, setReversedStates] = useState<boolean[]>([]);

  const currentReading = type && READINGS[type as ReadingType];

  useEffect(() => {
    try {
      const cardsData = getCards() as TarotCardType[];
      if (cardsData.length > 0) {
        setAllCards(cardsData.sort((a, b) => a.id - b.id));
      } else {
        setAllCards(localCards);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      setAllCards(localCards);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCardById = (id: number): TarotCardType | undefined => {
    return allCards.find(card => card.id === id);
  };

  const shuffleCards = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
      const count = currentReading?.cardCount || 0;
      const newCards = shuffledCards.slice(0, count);
      setSelectedCards(newCards.map(card => card.id));
      setReversedStates(Array.from({ length: count }, () => Math.random() > 0.5));
      setShowInterpretation(true);
      setIsShuffling(false);
    }, 1000);
  };

  const handleCardSelect = (cardId: number) => {
    if (!currentReading) return;

    setSelectedCards(prev => {
      const cardIndex = prev.indexOf(cardId);
      if (cardIndex !== -1) {
        // Verwijder de kaart als deze al geselecteerd was
        const newCards = [...prev];
        newCards.splice(cardIndex, 1);
        return newCards;
      } else if (prev.length < currentReading.cardCount) {
        // Voeg de kaart toe als er nog ruimte is
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const handleConfirmSelection = () => {
    if (selectedCards.length === currentReading?.cardCount) {
      setReversedStates(Array.from({ length: selectedCards.length }, () => Math.random() > 0.5));
      setShowInterpretation(true);
    }
  };

  const handleCardClick = (cardId: number, position: string) => {
    const card = getCardById(cardId);
    if (!card) return;
    const index = selectedCards.indexOf(cardId);
    setSelectedCardDetails({
      card,
      position,
      isReversed: reversedStates[index] ?? false
    });
  };

  const resetReading = () => {
    setSelectedCards([]);
    setSelectedCardDetails(null);
    setVraagstelling('');
    setShowInterpretation(false);
    setReversedStates([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!currentReading) return;
    
    const readingData = {
      title: currentReading.title,
      cards: selectedCards.map(id => getCardById(id)).filter((card): card is TarotCardType => card !== undefined),
      positions: currentReading.positions,
      vraagstelling: vraagstelling
    };

    await generatePDF(readingData);
  };

  if (!currentReading) {
    return <div>Ongeldige legging type</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">{currentReading.title}</h1>
          </div>
          <p className="text-purple-100">{currentReading.description}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setShowPositionInfo(!showPositionInfo)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <Info className="w-5 h-5" />
            <span>{showPositionInfo ? 'Verberg positie info' : 'Toon positie info'}</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {!showInterpretation && (
            <>
              {(type === 'three' || type === 'celtic') && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Je vraag of intentie (optioneel):
                  </label>
                  <input
                    type="text"
                    value={vraagstelling}
                    onChange={(e) => setVraagstelling(e.target.value)}
                    placeholder="Bijvoorbeeld: Wat moet ik weten over mijn huidige situatie?"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              )}

              <div className="text-center mb-8">
                <button
                  onClick={shuffleCards}
                  disabled={isShuffling}
                  className={`bg-purple-600 text-white py-3 px-6 rounded-lg flex items-center gap-2 mx-auto hover:bg-purple-700 transition-colors ${
                    isShuffling ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
                  {isShuffling ? 'Kaarten worden geschud...' : 'Schud de kaarten automatisch'}
                </button>
                <p className="text-gray-600 mt-2">of kies zelf je kaarten:</p>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {allCards.map((card) => {
                  const selectionIndex = selectedCards.indexOf(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardSelect(card.id)}
                    >
                      <TarotCard
                        card={card}
                        faceDown={true}
                        disabled={selectedCards.length >= currentReading.cardCount && selectionIndex === -1}
                        selected={selectionIndex !== -1}
                        selectionNumber={selectionIndex !== -1 ? selectionIndex + 1 : undefined}
                      />
                    </div>
                  );
                })}
              </div>

              {selectedCards.length > 0 && selectedCards.length === currentReading.cardCount && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleConfirmSelection}
                    className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Bevestig Keuze en Toon Interpretatie
                  </button>
                </div>
              )}
            </>
          )}

          {showInterpretation && selectedCards.length > 0 && (
            <>
              {type === 'celtic' && (
                <div className="flex justify-end gap-4 mb-6">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors print:hidden"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print Legging</span>
                  </button>
                  <button
                    onClick={handleSavePDF}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors print:hidden"
                  >
                    <Download className="w-5 h-5" />
                    <span>Opslaan als PDF</span>
                  </button>
                </div>
              )}

              {type === 'celtic' ? (
                <>
                  <CelticCrossLayout
                    selectedCards={selectedCards}
                    getCardById={getCardById}
                    positions={currentReading.positions}
                    onCardClick={handleCardClick}
                    showPositionDescriptions={showPositionInfo}
                    positionDescriptions={currentReading.positionDescriptions}
                  />

                  <CelticCrossBasicMeaning
                    cards={selectedCards.map(id => getCardById(id)).filter((card): card is TarotCardType => card !== undefined)}
                    positions={currentReading.positions}
                  />
                </>
              ) : (
                <div className="flex flex-wrap justify-center gap-8">
                  {Array.from({ length: currentReading.cardCount }).map((_, index) => {
                    const cardId = selectedCards[index];
                    const card = cardId !== undefined ? getCardById(cardId) : undefined;
                    const position = currentReading.positions[index];
                    const Icon = currentReading.positionIcons?.[index];

                    return (
                      <div key={index} className="text-center">
                        {card && (
                          <div
                            onClick={() => handleCardClick(card.id, position)}
                            className="cursor-pointer transform hover:scale-105 transition-transform"
                          >
                            <div className="w-32 h-48">
                              <TarotCard
                                card={card}
                                isReversed={reversedStates[index] ?? false}
                              />
                            </div>
                            {showPositionInfo && (
                              <div className="mt-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  {Icon && <Icon className="w-5 h-5 text-purple-600" />}
                                  <p className="font-medium text-gray-700">{position}</p>
                                </div>
                                {currentReading.positionDescriptions && (
                                  <p className="text-sm text-gray-500 mt-1 max-w-[200px] mx-auto">
                                    {currentReading.positionDescriptions[index]}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <TarotAIInterpretation
                cards={selectedCards.map(id => getCardById(id)).filter((card): card is TarotCardType => card !== undefined)}
                positions={currentReading.positions}
                vraagstelling={vraagstelling}
                readingType={type}
              />
              
              <TarotChat
                cards={selectedCards.map(id => getCardById(id)).filter((card): card is TarotCardType => card !== undefined)}
                positions={currentReading.positions}
              />

              <div className="mt-6 flex justify-center">
                <button
                  onClick={resetReading}
                  className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                >
                  Nieuwe Legging
                </button>
              </div>
            </>
          )}
        </div>

        {selectedCardDetails && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCardDetails(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
                <h3 className="text-xl font-bold text-purple-800">
                  {selectedCardDetails.card.nameNL}
                  {selectedCardDetails.position && (
                    <span className="ml-2 text-sm font-normal text-gray-400">
                      — {selectedCardDetails.position}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setSelectedCardDetails(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <CardDetails
                  card={selectedCardDetails.card}
                  isReversed={selectedCardDetails.isReversed}
                  position={selectedCardDetails.position}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadingPage;