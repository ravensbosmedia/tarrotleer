import { majorArcana } from './major';
import { wands } from './wands';
import { cups } from './cups';
import { swords } from './swords';
import { pentacles } from './pentacles';
import { TarotCard } from '../../types/cards';

export const allCards: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
];

export const getCardById = (id: number): TarotCard | undefined => {
  return allCards.find(card => card.id === id);
};