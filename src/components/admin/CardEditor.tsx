import React, { useState, useEffect } from 'react';
import { getCards, updateCard } from '../../config/localDB';
import { TarotCard } from '../../types/cards';
import { ImportButton } from './ImportButton';
import { RotateCw, CheckCircle2, Search } from 'lucide-react';

export const CardEditor: React.FC = () => {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const [updatedCards, setUpdatedCards] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const cardsData = getCards() as TarotCard[];
      setCards(cardsData.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error('Error fetching cards:', error);
      setMessage('Er is een fout opgetreden bij het laden van de kaarten.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCardSelect = (card: TarotCard) => {
    setSelectedCard({
      ...card,
      name: card.name || '',
      nameNL: card.nameNL || '',
      meaningUpright: card.meaningUpright || '',
      meaningReversed: card.meaningReversed || '',
      description: card.description || '',
      imageUrl: card.imageUrl || '',
      extendedDescription: card.extendedDescription || '',
      loveReading: card.loveReading || ''
    });
    setIsReversed(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

    try {
      updateCard(selectedCard.id, {
        name: selectedCard.name || '',
        nameNL: selectedCard.nameNL || '',
        meaningUpright: selectedCard.meaningUpright || '',
        meaningReversed: selectedCard.meaningReversed || '',
        description: selectedCard.description || '',
        imageUrl: selectedCard.imageUrl || '',
        extendedDescription: selectedCard.extendedDescription || '',
        loveReading: selectedCard.loveReading || ''
      });

      setMessage('Kaart succesvol bijgewerkt!');
      setUpdatedCards([...updatedCards, selectedCard.id]);
      setTimeout(() => setMessage(''), 3000);

      setCards(cards.map(card =>
        card.id === selectedCard.id ? selectedCard : card
      ));
    } catch (error) {
      console.error('Error updating card:', error);
      setMessage('Er is een fout opgetreden bij het opslaan.');
    }
  };

  const toggleRotation = () => {
    setIsReversed(!isReversed);
  };

  const filteredCards = cards.filter(card =>
    card.nameNL.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.id.toString().includes(searchTerm)
  );

  const getSuitName = (suit: string) => {
    switch (suit) {
      case 'wands': return 'Staven';
      case 'cups': return 'Kelken';
      case 'swords': return 'Zwaarden';
      case 'pentacles': return 'Pentakels';
      case 'major': return 'Grote Arcana';
      default: return suit;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Kaarten Beheren</h2>

      <ImportButton onImported={() => {
        const cardsData = getCards() as TarotCard[];
        setCards(cardsData.sort((a, b) => a.id - b.id));
      }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoek kaarten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  selectedCard?.id === card.id
                    ? 'bg-purple-100 text-purple-800'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.nameNL || card.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{card.nameNL || card.name}</span>
                    <span className="text-sm text-gray-500">
                      {getSuitName(card.suit)} • #{card.id}
                    </span>
                  </div>
                </div>
                {updatedCards.includes(card.id) && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedCard ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-48 h-72 rounded-lg shadow-lg overflow-hidden transition-transform duration-500 ${
                      isReversed ? 'rotate-180' : ''
                    }`}
                  >
                    {selectedCard.imageUrl ? (
                      <img
                        src={selectedCard.imageUrl}
                        alt={selectedCard.nameNL || selectedCard.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Geen afbeelding</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={toggleRotation}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <RotateCw size={20} />
                    <span>Draai kaart</span>
                  </button>
                  <div className="text-sm text-gray-600 text-center mt-2">
                    {isReversed ? 'Omgekeerd' : 'Rechtop'}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedCard.nameNL || selectedCard.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isReversed ? selectedCard.meaningReversed : selectedCard.meaningUpright}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Kaart Bewerken</h3>
              {message && (
                <div className={`p-4 rounded mb-4 ${
                  message.includes('fout') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Engelse Naam
                    </label>
                    <input
                      type="text"
                      value={selectedCard.name}
                      onChange={(e) => setSelectedCard({...selectedCard, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nederlandse Naam
                    </label>
                    <input
                      type="text"
                      value={selectedCard.nameNL}
                      onChange={(e) => setSelectedCard({...selectedCard, nameNL: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rechtop Betekenis
                  </label>
                  <textarea
                    value={selectedCard.meaningUpright}
                    onChange={(e) => setSelectedCard({...selectedCard, meaningUpright: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Omgekeerde Betekenis
                  </label>
                  <textarea
                    value={selectedCard.meaningReversed}
                    onChange={(e) => setSelectedCard({...selectedCard, meaningReversed: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschrijving
                  </label>
                  <textarea
                    value={selectedCard.description}
                    onChange={(e) => setSelectedCard({...selectedCard, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uitgebreide Beschrijving
                  </label>
                  <textarea
                    value={selectedCard.extendedDescription}
                    onChange={(e) => setSelectedCard({...selectedCard, extendedDescription: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liefdeslezing
                  </label>
                  <textarea
                    value={selectedCard.loveReading}
                    onChange={(e) => setSelectedCard({...selectedCard, loveReading: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Afbeelding URL
                  </label>
                  <input
                    type="url"
                    value={selectedCard.imageUrl}
                    onChange={(e) => setSelectedCard({...selectedCard, imageUrl: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                  >
                    Opslaan
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              Selecteer een kaart om te bewerken
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
