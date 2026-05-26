export type CardSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: number;
  name: string;
  nameNL: string;
  suit: CardSuit;
  number: number;
  meaningUpright: string;
  meaningReversed: string;
  description: string;
  imageUrl: string;
  extendedDescription?: string;
  loveReading?: string;
}