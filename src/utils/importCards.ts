import { setCard } from '../config/localDB';
import { allCards } from '../data/cards';

export const importCardsToLocalStorage = () => {
  try {
    for (const card of allCards) {
      setCard(card.id, { ...card });
    }
    return { success: true, message: 'Alle kaarten zijn succesvol geïmporteerd!' };
  } catch (error) {
    console.error('Error importing cards:', error);
    return { success: false, message: 'Er is een fout opgetreden bij het importeren.' };
  }
};
