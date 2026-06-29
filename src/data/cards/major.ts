import { TarotCard } from '../../types/cards';

const img = (name: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=400`;

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    nameNL: "De Dwaas",
    suit: "major",
    number: 0,
    meaningUpright: "Nieuw begin, onschuld, spontaniteit, vrije geest",
    meaningReversed: "Roekeloosheid, risico's nemen, onbezonnenheid",
    description: "De Dwaas staat voor nieuwe avonturen en het nemen van een sprong in het onbekende. Het symboliseert pure potentie en onschuld.",
    imageUrl: img("RWS_Tarot_00_Fool.jpg")
  },
  {
    id: 1,
    name: "The Magician",
    nameNL: "De Magiër",
    suit: "major",
    number: 1,
    meaningUpright: "Manifestatie, wilskracht, vaardigheden, concentratie",
    meaningReversed: "Manipulatie, onzekerheid, slechte planning, misbruik van talenten",
    description: "De Magiër verbeeldt de universele wet van manifestatie. Waar je je aandacht op richt, manifesterrt zich.",
    imageUrl: img("RWS_Tarot_01_Magician.jpg"),
    extendedDescription: "Op de tarotkaart De Magiër zien we een man afgebeeld die een wit onderkleed draagt met daaroverheen een rode mantel. Zijn rechterhand is naar boven gericht en zijn linkerhand naar de grond. Hij beeldt als het ware het hermetische principe 'zo boven, zo beneden' uit.\n\nDe Magiër verbeeldt de universele wet van manifestatie. Deze wet zegt dat waar je aan denkt, waar je over praat, waar je je aandacht op richt, zich moet manifesteren.",
    loveReading: "De Magiër is egocentrisch en dit kan een struikelblok zijn voor een relatie. Je bent misschien erg op jezelf gericht, erg bezig met hoe jezelf overkomt, wat je zelf wilt bereiken en hoe je gezien wilt worden."
  },
  {
    id: 2,
    name: "The High Priestess",
    nameNL: "De Hogepriesteres",
    suit: "major",
    number: 2,
    meaningUpright: "Intuïtie, het onderbewuste, innerlijke kennis, wijsheid",
    meaningReversed: "Verborgen agenda's, teruggetrokkenheid, verwaarlozen van innerlijke stem",
    description: "De Hogepriesteres vertegenwoordigt intuïtie, mysterie en innerlijke wijsheid. Ze nodigt je uit om naar binnen te kijken.",
    imageUrl: img("RWS_Tarot_02_High_Priestess.jpg")
  },
  {
    id: 3,
    name: "The Empress",
    nameNL: "De Keizerin",
    suit: "major",
    number: 3,
    meaningUpright: "Vruchtbaarheid, overvloed, moederlijkheid, natuur, creativiteit",
    meaningReversed: "Afhankelijkheid, verstikking, gebrek aan groei",
    description: "De Keizerin symboliseert vruchtbaarheid, schoonheid en overvloed. Ze staat voor de creatieve kracht van de natuur.",
    imageUrl: img("RWS_Tarot_03_Empress.jpg")
  },
  {
    id: 4,
    name: "The Emperor",
    nameNL: "De Keizer",
    suit: "major",
    number: 4,
    meaningUpright: "Autoriteit, structuur, stabiliteit, leiderschap, discipline",
    meaningReversed: "Tirannie, rigiditeit, gebrek aan discipline, dominantie",
    description: "De Keizer staat voor autoriteit, structuur en vaderlijke bescherming. Hij vertegenwoordigt orde en stabiliteit.",
    imageUrl: img("RWS_Tarot_04_Emperor.jpg")
  },
  {
    id: 5,
    name: "The Hierophant",
    nameNL: "De Hogepriester",
    suit: "major",
    number: 5,
    meaningUpright: "Traditie, spirituele wijsheid, religie, conformiteit, onderwijs",
    meaningReversed: "Rebellie, subversiviteit, nieuwe benaderingen, niet-conventioneel",
    description: "De Hogepriester vertegenwoordigt traditie, instituties en spirituele begeleiding. Hij verbindt het aardse met het goddelijke.",
    imageUrl: img("RWS_Tarot_05_Hierophant.jpg")
  },
  {
    id: 6,
    name: "The Lovers",
    nameNL: "De Geliefden",
    suit: "major",
    number: 6,
    meaningUpright: "Liefde, harmonie, waarden, keuzes, afstemming",
    meaningReversed: "Disharmonie, onevenwichtigheid, verkeerde keuzes",
    description: "De Geliefden symboliseren liefde, verbinding en de belangrijke keuzes in het leven die van het hart komen.",
    imageUrl: img("RWS_Tarot_06_Lovers.jpg")
  },
  {
    id: 7,
    name: "The Chariot",
    nameNL: "De Strijdwagen",
    suit: "major",
    number: 7,
    meaningUpright: "Wilskracht, overwinning, vastberadenheid, controle, zelfbeheersing",
    meaningReversed: "Gebrek aan controle, agressie, het ontbreken van richting",
    description: "De Strijdwagen staat voor wilskracht, overwinning en het overwinnen van obstakels door vastberadenheid.",
    imageUrl: img("RWS_Tarot_07_Chariot.jpg")
  },
  {
    id: 8,
    name: "Strength",
    nameNL: "Kracht",
    suit: "major",
    number: 8,
    meaningUpright: "Moed, zachte kracht, geduld, innerlijke kracht, mededogen",
    meaningReversed: "Twijfel, zwakte, onzekerheid, gebrek aan zelfvertrouwen",
    description: "Kracht vertegenwoordigt innerlijke moed en het vermogen om moeilijkheden te overwinnen met zachtheid en geduld.",
    imageUrl: img("RWS_Tarot_08_Strength.jpg")
  },
  {
    id: 9,
    name: "The Hermit",
    nameNL: "De Kluizenaar",
    suit: "major",
    number: 9,
    meaningUpright: "Bezinning, innerlijke gids, solitude, introspectie, wijsheid zoeken",
    meaningReversed: "Isolatie, eenzaamheid, teruggetrokkenheid, het vermijden van de wereld",
    description: "De Kluizenaar symboliseert de zoektocht naar innerlijke wijsheid door bezinning en terugtrekking uit de wereld.",
    imageUrl: img("RWS_Tarot_09_Hermit.jpg")
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameNL: "Het Wiel van Fortuin",
    suit: "major",
    number: 10,
    meaningUpright: "Geluk, karma, levenscycli, bestemming, cruciaal keerpunt",
    meaningReversed: "Tegenslag, weerstand tegen verandering, pech",
    description: "Het Wiel van Fortuin staat voor de cycli van het leven, karma en de constante verandering van de fortuin.",
    imageUrl: img("RWS_Tarot_10_Wheel_of_Fortune.jpg")
  },
  {
    id: 11,
    name: "Justice",
    nameNL: "Gerechtigheid",
    suit: "major",
    number: 11,
    meaningUpright: "Eerlijkheid, waarheid, oorzaak en gevolg, wet, onpartijdigheid",
    meaningReversed: "Oneerlijkheid, onrechtvaardigheid, gebrek aan verantwoordelijkheid",
    description: "Gerechtigheid vertegenwoordigt eerlijkheid, waarheid en het principe van oorzaak en gevolg.",
    imageUrl: img("RWS_Tarot_11_Justice.jpg")
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameNL: "De Gehangene",
    suit: "major",
    number: 12,
    meaningUpright: "Overgave, loslaten, nieuw perspectief, opoffering, wachten",
    meaningReversed: "Vastzitten, vertragen, weerstand tegen opoffering",
    description: "De Gehangene nodigt uit tot overgave en het bekijken van situaties vanuit een ander perspectief.",
    imageUrl: img("RWS_Tarot_12_Hanged_Man.jpg")
  },
  {
    id: 13,
    name: "Death",
    nameNL: "De Dood",
    suit: "major",
    number: 13,
    meaningUpright: "Eindigen, overgang, verandering, transformatie, loslaten",
    meaningReversed: "Weerstand tegen verandering, vastzitten, niet kunnen loslaten",
    description: "De Dood symboliseert niet letterlijk de dood, maar het einde van een fase en het begin van iets nieuws.",
    imageUrl: img("RWS_Tarot_13_Death.jpg")
  },
  {
    id: 14,
    name: "Temperance",
    nameNL: "Matigheid",
    suit: "major",
    number: 14,
    meaningUpright: "Balans, matigheid, geduld, doel, kalmte",
    meaningReversed: "Onbalans, overmatigheid, gebrek aan langetermijnvisie",
    description: "Matigheid staat voor balans, harmonie en het vinden van de gulden middenweg in het leven.",
    imageUrl: img("RWS_Tarot_14_Temperance.jpg")
  },
  {
    id: 15,
    name: "The Devil",
    nameNL: "De Duivel",
    suit: "major",
    number: 15,
    meaningUpright: "Gebondenheid, materialisme, verslaving, seksualiteit, schaduwzelf",
    meaningReversed: "Bevrijding, loslaten van beperkingen, terugwinnen van controle",
    description: "De Duivel symboliseert gebondenheid aan materiële zaken, verslavingen en de schaduwkanten van de menselijke natuur.",
    imageUrl: img("RWS_Tarot_15_Devil.jpg")
  },
  {
    id: 16,
    name: "The Tower",
    nameNL: "De Toren",
    suit: "major",
    number: 16,
    meaningUpright: "Plotselinge verandering, chaos, openbaring, verstoring, ontwaken",
    meaningReversed: "Vermijden van ramp, angst voor verandering, het uitstellen van het onvermijdelijke",
    description: "De Toren staat voor plotselinge, ingrijpende veranderingen die oude structuren neerwerpen om ruimte te maken voor het nieuwe.",
    imageUrl: img("RWS_Tarot_16_Tower.jpg")
  },
  {
    id: 17,
    name: "The Star",
    nameNL: "De Ster",
    suit: "major",
    number: 17,
    meaningUpright: "Hoop, inspiratie, sereniteit, vernieuwing, spiritualiteit",
    meaningReversed: "Wanhoop, gebrek aan geloof, ontmoediging",
    description: "De Ster symboliseert hoop, inspiratie en geloof in de toekomst. Na een moeilijke periode schijnt er licht.",
    imageUrl: img("RWS_Tarot_17_Star.jpg")
  },
  {
    id: 18,
    name: "The Moon",
    nameNL: "De Maan",
    suit: "major",
    number: 18,
    meaningUpright: "Illusie, angst, het onderbewuste, verwarring, complexiteit",
    meaningReversed: "Verwarring vrijgeven, innerlijke verwarring, angst overwinnen",
    description: "De Maan vertegenwoordigt het onderbewuste, dromen en de illusies die onze perceptie beïnvloeden.",
    imageUrl: img("RWS_Tarot_18_Moon.jpg")
  },
  {
    id: 19,
    name: "The Sun",
    nameNL: "De Zon",
    suit: "major",
    number: 19,
    meaningUpright: "Positiviteit, vreugde, succes, vitaliteit, zelfvertrouwen",
    meaningReversed: "Innerlijk kind, pessimisme, gebrek aan succes",
    description: "De Zon staat voor succes, vreugde en positieve energie. Het is een van de meest gunstige kaarten in het deck.",
    imageUrl: img("RWS_Tarot_19_Sun.jpg")
  },
  {
    id: 20,
    name: "Judgement",
    nameNL: "Het Oordeel",
    suit: "major",
    number: 20,
    meaningUpright: "Reflectie, innerlijke roeping, absolution, opwekking, vernieuwing",
    meaningReversed: "Zelftwijfel, niet gehoor geven aan de innerlijke roeping, zelfkritiek",
    description: "Het Oordeel nodigt uit tot zelfreflectie en het beantwoorden van een hogere roeping om te groeien en te transformeren.",
    imageUrl: img("RWS_Tarot_20_Judgement.jpg")
  },
  {
    id: 21,
    name: "The World",
    nameNL: "De Wereld",
    suit: "major",
    number: 21,
    meaningUpright: "Voltooiing, integratie, prestatie, succes, heelheid",
    meaningReversed: "Onvoltooidheid, geen afsluiting, stagnatie",
    description: "De Wereld symboliseert de voltooiing van een cyclus en de harmonieuze integratie van alle levenservaringen.",
    imageUrl: img("RWS_Tarot_21_World.jpg")
  }
];
