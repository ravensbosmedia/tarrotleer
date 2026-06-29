import { TarotCard } from '../../types/cards';

const img = (name: string) =>
  `/cards/${name.replace('.jpg', '.webp')}`;

export const wands: TarotCard[] = [
  {
    id: 22,
    name: "Ace of Wands",
    nameNL: "Aas van Staven",
    suit: "wands",
    number: 1,
    meaningUpright: "Inspiratie, nieuwe kansen, groei en potentieel",
    meaningReversed: "Vertraagde start, gemiste kansen, gebrek aan richting",
    description: "De Aas van Staven vertegenwoordigt het begin van nieuwe ondernemingen en creatieve projecten.",
    imageUrl: img("Wands01.jpg")
  },
  {
    id: 23,
    name: "Two of Wands",
    nameNL: "Twee van Staven",
    suit: "wands",
    number: 2,
    meaningUpright: "Toekomstplanning, vooruitgang, beslissingen",
    meaningReversed: "Angst voor verandering, speelruimte, desorganisatie",
    description: "De Twee van Staven staat voor het maken van keuzes en het plannen van de toekomst.",
    imageUrl: img("Wands02.jpg")
  },
  {
    id: 24,
    name: "Three of Wands",
    nameNL: "Drie van Staven",
    suit: "wands",
    number: 3,
    meaningUpright: "Expansie, vooruitgang, avontuur",
    meaningReversed: "Vertraging, teleurstelling, gebrek aan vooruitgang",
    description: "De Drie van Staven symboliseert groei, expansie en het zien van eerste resultaten.",
    imageUrl: img("Wands03.jpg")
  },
  {
    id: 25,
    name: "Four of Wands",
    nameNL: "Vier van Staven",
    suit: "wands",
    number: 4,
    meaningUpright: "Viering, harmonie, huwelijk, thuis",
    meaningReversed: "Transitie, gebrek aan ondersteuning, instabiliteit",
    description: "De Vier van Staven staat voor vieringen, mijlpalen en huiselijke harmonie.",
    imageUrl: img("Wands04.jpg")
  },
  {
    id: 26,
    name: "Five of Wands",
    nameNL: "Vijf van Staven",
    suit: "wands",
    number: 5,
    meaningUpright: "Competitie, conflict, strijd",
    meaningReversed: "Vermijding van conflict, harmonie na strijd",
    description: "De Vijf van Staven symboliseert competitie en conflicten.",
    imageUrl: img("Wands05.jpg")
  },
  {
    id: 27,
    name: "Six of Wands",
    nameNL: "Zes van Staven",
    suit: "wands",
    number: 6,
    meaningUpright: "Overwinning, succes, erkenning",
    meaningReversed: "Zelfkritiek, twijfel aan succes, slechte nieuws",
    description: "De Zes van Staven staat voor overwinning en publieke erkenning.",
    imageUrl: img("Wands06.jpg")
  },
  {
    id: 28,
    name: "Seven of Wands",
    nameNL: "Zeven van Staven",
    suit: "wands",
    number: 7,
    meaningUpright: "Uitdaging, competitie, verdediging",
    meaningReversed: "Overgave, overweldigd voelen, twijfel",
    description: "De Zeven van Staven symboliseert het verdedigen van je positie.",
    imageUrl: img("Wands07.jpg")
  },
  {
    id: 29,
    name: "Eight of Wands",
    nameNL: "Acht van Staven",
    suit: "wands",
    number: 8,
    meaningUpright: "Snelle actie, beweging, vooruitgang",
    meaningReversed: "Vertraging, frustratie, tegenslag",
    description: "De Acht van Staven staat voor snelle actie en vooruitgang.",
    imageUrl: img("Wands08.jpg")
  },
  {
    id: 30,
    name: "Nine of Wands",
    nameNL: "Negen van Staven",
    suit: "wands",
    number: 9,
    meaningUpright: "Volharding, uithoudingsvermogen, doorzetting",
    meaningReversed: "Uitputting, opgeven, overweldigd",
    description: "De Negen van Staven symboliseert volharding en de laatste verdedigingslinie.",
    imageUrl: img("Wands09.jpg")
  },
  {
    id: 31,
    name: "Ten of Wands",
    nameNL: "Tien van Staven",
    suit: "wands",
    number: 10,
    meaningUpright: "Lasten, verantwoordelijkheid, druk",
    meaningReversed: "Stress, burn-out, het opgeven van verantwoordelijkheden",
    description: "De Tien van Staven staat voor zware lasten en verantwoordelijkheden.",
    imageUrl: img("Wands10.jpg")
  },
  {
    id: 32,
    name: "Page of Wands",
    nameNL: "Schildknaap van Staven",
    suit: "wands",
    number: 11,
    meaningUpright: "Avontuur, enthousiasme, ontdekking",
    meaningReversed: "Instabiliteit, vertragingen, slecht nieuws",
    description: "De Schildknaap van Staven symboliseert enthousiasme en nieuwe ontdekkingen.",
    imageUrl: img("Wands11.jpg")
  },
  {
    id: 33,
    name: "Knight of Wands",
    nameNL: "Ridder van Staven",
    suit: "wands",
    number: 12,
    meaningUpright: "Actie, avontuur, impulsiviteit",
    meaningReversed: "Haast, ongeduld, agressie",
    description: "De Ridder van Staven staat voor energie en snelle actie.",
    imageUrl: img("Wands12.jpg")
  },
  {
    id: 34,
    name: "Queen of Wands",
    nameNL: "Koningin van Staven",
    suit: "wands",
    number: 13,
    meaningUpright: "Vertrouwen, vitaliteit, passie",
    meaningReversed: "Dominantie, jaloezie, onzekerheid",
    description: "De Koningin van Staven symboliseert zelfvertrouwen en charisma.",
    imageUrl: img("Wands13.jpg")
  },
  {
    id: 35,
    name: "King of Wands",
    nameNL: "Koning van Staven",
    suit: "wands",
    number: 14,
    meaningUpright: "Leiderschap, visie, ondernemerschap",
    meaningReversed: "Impulsiviteit, haast, intolerantie",
    description: "De Koning van Staven staat voor charismatisch leiderschap en visie.",
    imageUrl: img("Wands14.jpg")
  }
];