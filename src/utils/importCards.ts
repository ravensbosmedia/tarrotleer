import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { allCards } from '../data/cards';

export const importCardsToFirebase = async () => {
  try {
    const cardsCollection = collection(db, 'cards');
    
    for (const card of allCards) {
      await setDoc(doc(cardsCollection, card.id.toString()), {
        ...card
      });
    }
    
    return { success: true, message: 'Alle kaarten zijn succesvol geïmporteerd!' };
  } catch (error) {
    console.error('Error importing cards:', error);
    return { success: false, message: 'Er is een fout opgetreden bij het importeren.' };
  }
};