import { TarotCard } from '../../types/cards';

const img = (name: string) =>
  `/cards/${name.replace('.jpg', '.webp')}`;

export const pentacles: TarotCard[] = [
  {
    id: 64,
    name: "Ace of Pentacles",
    nameNL: "Aas van Pentakels",
    suit: "pentacles",
    number: 1,
    meaningUpright: "Nieuwe financiële kansen, manifestatie, overvloed",
    meaningReversed: "Gemiste kansen, materiële zorgen, slechte investeringen",
    description: "De Aas van Pentakels vertegenwoordigt nieuwe materiële en financiële mogelijkheden.",
    imageUrl: img("Pents01.jpg")
  },
  {
    id: 65,
    name: "Two of Pentacles",
    nameNL: "Twee van Pentakels",
    suit: "pentacles",
    number: 2,
    meaningUpright: "Balans, aanpassing, jongleren met taken",
    meaningReversed: "Onbalans, desorganisatie",
    description: "De Twee van Pentakels staat voor het balanceren van verschillende aspecten.",
    imageUrl: img("Pents02.jpg")
  },
  {
    id: 66,
    name: "Three of Pentacles",
    nameNL: "Drie van Pentakels",
    suit: "pentacles",
    number: 3,
    meaningUpright: "Samenwerking, vakmanschap, vaardigheid",
    meaningReversed: "Gebrek aan teamwork, demotivatie",
    description: "De Drie van Pentakels symboliseert samenwerking en expertise.",
    imageUrl: img("Pents03.jpg")
  },
  {
    id: 67,
    name: "Four of Pentacles",
    nameNL: "Vier van Pentakels",
    suit: "pentacles",
    number: 4,
    meaningUpright: "Zekerheid, conservatisme, vasthouden",
    meaningReversed: "Verlies, loslaten, verandering",
    description: "De Vier van Pentakels staat voor materiële zekerheid.",
    imageUrl: img("Pents04.jpg")
  },
  {
    id: 68,
    name: "Five of Pentacles",
    nameNL: "Vijf van Pentakels",
    suit: "pentacles",
    number: 5,
    meaningUpright: "Armoede, isolatie, zorgen",
    meaningReversed: "Herstel, spirituele groei",
    description: "De Vijf van Pentakels symboliseert materiële moeilijkheden.",
    imageUrl: img("Pents05.jpg")
  },
  {
    id: 69,
    name: "Six of Pentacles",
    nameNL: "Zes van Pentakels",
    suit: "pentacles",
    number: 6,
    meaningUpright: "Vrijgevigheid, delen, ontvangen",
    meaningReversed: "Schuld, egoïsme, ongelijkheid",
    description: "De Zes van Pentakels staat voor geven en ontvangen.",
    imageUrl: img("Pents06.jpg")
  },
  {
    id: 70,
    name: "Seven of Pentacles",
    nameNL: "Zeven van Pentakels",
    suit: "pentacles",
    number: 7,
    meaningUpright: "Geduld, evaluatie, investering",
    meaningReversed: "Angst, gebrek aan vooruitgang",
    description: "De Zeven van Pentakels symboliseert geduld en evaluatie.",
    imageUrl: img("Pents07.jpg")
  },
  {
    id: 71,
    name: "Eight of Pentacles",
    nameNL: "Acht van Pentakels",
    suit: "pentacles",
    number: 8,
    meaningUpright: "Vakmanschap, toewijding, vaardigheid",
    meaningReversed: "Perfectionisme, demotivatie",
    description: "De Acht van Pentakels staat voor het ontwikkelen van vaardigheden.",
    imageUrl: img("Pents08.jpg")
  },
  {
    id: 72,
    name: "Nine of Pentacles",
    nameNL: "Negen van Pentakels",
    suit: "pentacles",
    number: 9,
    meaningUpright: "Onafhankelijkheid, luxe, zelfverzekerdheid",
    meaningReversed: "Materiële verliezen, afhankelijkheid",
    description: "De Negen van Pentakels symboliseert materieel succes.",
    imageUrl: img("Pents09.jpg")
  },
  {
    id: 73,
    name: "Ten of Pentacles",
    nameNL: "Tien van Pentakels",
    suit: "pentacles",
    number: 10,
    meaningUpright: "Rijkdom, erfenis, familie",
    meaningReversed: "Financiële problemen, familieconflicten",
    description: "De Tien van Pentakels staat voor materiële en familiale welvaart.",
    imageUrl: img("Pents10.jpg")
  },
  {
    id: 74,
    name: "Page of Pentacles",
    nameNL: "Schildknaap van Pentakels",
    suit: "pentacles",
    number: 11,
    meaningUpright: "Manifestatie, studie, reflectie",
    meaningReversed: "Gebrek aan vooruitgang, luiheid",
    description: "De Schildknaap van Pentakels symboliseert nieuwe kansen.",
    imageUrl: img("Pents11.jpg")
  },
  {
    id: 75,
    name: "Knight of Pentacles",
    nameNL: "Ridder van Pentakels",
    suit: "pentacles",
    number: 12,
    meaningUpright: "Hard werken, betrouwbaarheid, routine",
    meaningReversed: "Luiheid, stagnatie, saaiheid",
    description: "De Ridder van Pentakels staat voor toewijding en hard werken.",
    imageUrl: img("Pents12.jpg")
  },
  {
    id: 76,
    name: "Queen of Pentacles",
    nameNL: "Koningin van Pentakels",
    suit: "pentacles",
    number: 13,
    meaningUpright: "Overvloed, verzorging, praktisch",
    meaningReversed: "Financiële problemen, jaloezie",
    description: "De Koningin van Pentakels symboliseert praktische wijsheid.",
    imageUrl: img("Pents13.jpg")
  },
  {
    id: 77,
    name: "King of Pentacles",
    nameNL: "Koning van Pentakels",
    suit: "pentacles",
    number: 14,
    meaningUpright: "Overvloed, zekerheid, discipline",
    meaningReversed: "Corruptie, materialisme",
    description: "De Koning van Pentakels staat voor materieel succes en stabiliteit.",
    imageUrl: img("Pents14.jpg")
  }
];