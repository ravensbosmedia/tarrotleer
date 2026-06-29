import { TarotCard } from '../../types/cards';

const img = (name: string) =>
  `/cards/${name.replace('.jpg', '.webp')}`;

export const cups: TarotCard[] = [
  {
    id: 36,
    name: "Ace of Cups",
    nameNL: "Aas van Kelken",
    suit: "cups",
    number: 1,
    meaningUpright: "Nieuwe gevoelens, intuïtie, intimiteit, liefde",
    meaningReversed: "Emotionele blokkades, gemiste kansen in relaties",
    description: "De Aas van Kelken symboliseert het begin van emotionele ervaringen en spirituele connecties.",
    imageUrl: img("Cups01.jpg")
  },
  {
    id: 37,
    name: "Two of Cups",
    nameNL: "Twee van Kelken",
    suit: "cups",
    number: 2,
    meaningUpright: "Partnership, harmonie, verbinding",
    meaningReversed: "Disharmonie, gebroken relaties",
    description: "De Twee van Kelken staat voor partnerships en emotionele verbindingen.",
    imageUrl: img("Cups02.jpg")
  },
  {
    id: 38,
    name: "Three of Cups",
    nameNL: "Drie van Kelken",
    suit: "cups",
    number: 3,
    meaningUpright: "Viering, vriendschap, gemeenschap",
    meaningReversed: "Overmatigheid, roddels, isolatie",
    description: "De Drie van Kelken symboliseert vieringen en sociale verbindingen.",
    imageUrl: img("Cups03.jpg")
  },
  {
    id: 39,
    name: "Four of Cups",
    nameNL: "Vier van Kelken",
    suit: "cups",
    number: 4,
    meaningUpright: "Contemplatie, apathie, herbeoordeling",
    meaningReversed: "Nieuwe kansen, opwekking",
    description: "De Vier van Kelken staat voor contemplatie en herbeoordeling.",
    imageUrl: img("Cups04.jpg")
  },
  {
    id: 40,
    name: "Five of Cups",
    nameNL: "Vijf van Kelken",
    suit: "cups",
    number: 5,
    meaningUpright: "Verlies, spijt, teleurstelling",
    meaningReversed: "Acceptatie, vooruitgang, vinden van hoop",
    description: "De Vijf van Kelken symboliseert verlies en teleurstelling.",
    imageUrl: img("Cups05.jpg")
  },
  {
    id: 41,
    name: "Six of Cups",
    nameNL: "Zes van Kelken",
    suit: "cups",
    number: 6,
    meaningUpright: "Nostalgie, herinneringen, onschuld",
    meaningReversed: "Vastzitten in het verleden, naïviteit",
    description: "De Zes van Kelken staat voor nostalgie en jeugdherinneringen.",
    imageUrl: img("Cups06.jpg")
  },
  {
    id: 42,
    name: "Seven of Cups",
    nameNL: "Zeven van Kelken",
    suit: "cups",
    number: 7,
    meaningUpright: "Keuzes, illusies, dromen",
    meaningReversed: "Duidelijkheid, focus, wijsheid",
    description: "De Zeven van Kelken symboliseert keuzes en mogelijkheden.",
    imageUrl: img("Cups07.jpg")
  },
  {
    id: 43,
    name: "Eight of Cups",
    nameNL: "Acht van Kelken",
    suit: "cups",
    number: 8,
    meaningUpright: "Vertrek, loslaten, zoeken naar waarheid",
    meaningReversed: "Stagnatie, angst voor verandering",
    description: "De Acht van Kelken staat voor het zoeken naar een diepere betekenis.",
    imageUrl: img("Cups08.jpg")
  },
  {
    id: 44,
    name: "Nine of Cups",
    nameNL: "Negen van Kelken",
    suit: "cups",
    number: 9,
    meaningUpright: "Tevredenheid, voldoening, wensen",
    meaningReversed: "Materialisme, ontevredenheid",
    description: "De Negen van Kelken symboliseert emotionele vervulling.",
    imageUrl: img("Cups09.jpg")
  },
  {
    id: 45,
    name: "Ten of Cups",
    nameNL: "Tien van Kelken",
    suit: "cups",
    number: 10,
    meaningUpright: "Harmonie, liefde, geluk",
    meaningReversed: "Gebroken familie, disharmonie",
    description: "De Tien van Kelken staat voor harmonie en geluk in relaties.",
    imageUrl: img("Cups10.jpg")
  },
  {
    id: 46,
    name: "Page of Cups",
    nameNL: "Schildknaap van Kelken",
    suit: "cups",
    number: 11,
    meaningUpright: "Creativiteit, intuïtie, nieuwe ideeën",
    meaningReversed: "Emotionele blokkades, slecht nieuws",
    description: "De Schildknaap van Kelken symboliseert nieuwe emotionele ervaringen.",
    imageUrl: img("Cups11.jpg")
  },
  {
    id: 47,
    name: "Knight of Cups",
    nameNL: "Ridder van Kelken",
    suit: "cups",
    number: 12,
    meaningUpright: "Romantiek, charme, verbeelding",
    meaningReversed: "Misleiding, manipulatie",
    description: "De Ridder van Kelken staat voor romantiek en creativiteit.",
    imageUrl: img("Cups12.jpg")
  },
  {
    id: 48,
    name: "Queen of Cups",
    nameNL: "Koningin van Kelken",
    suit: "cups",
    number: 13,
    meaningUpright: "Compassie, zorg, emotionele stabiliteit",
    meaningReversed: "Emotionele instabiliteit, manipulatie",
    description: "De Koningin van Kelken symboliseert emotionele intelligentie.",
    imageUrl: img("Cups13.jpg")
  },
  {
    id: 49,
    name: "King of Cups",
    nameNL: "Koning van Kelken",
    suit: "cups",
    number: 14,
    meaningUpright: "Emotionele beheersing, balans, wijsheid",
    meaningReversed: "Emotionele manipulatie, ongevoeligheid",
    description: "De Koning van Kelken staat voor emotionele wijsheid en beheersing.",
    imageUrl: img("Cups14.jpg")
  }
];