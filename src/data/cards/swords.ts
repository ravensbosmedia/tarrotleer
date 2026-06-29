import { TarotCard } from '../../types/cards';

const img = (name: string) =>
  `/cards/${name.replace('.jpg', '.webp')}`;

export const swords: TarotCard[] = [
  {
    id: 50,
    name: "Ace of Swords",
    nameNL: "Aas van Zwaarden",
    suit: "swords",
    number: 1,
    meaningUpright: "Mentale helderheid, doorbraak, nieuwe inzichten, waarheid",
    meaningReversed: "Verwarring, chaos, gebrek aan duidelijkheid, leugens",
    description: "De Aas van Zwaarden staat voor mentale kracht, nieuwe ideeën en de kracht van de waarheid.",
    imageUrl: img("Swords01.jpg")
  },
  {
    id: 51,
    name: "Two of Swords",
    nameNL: "Twee van Zwaarden",
    suit: "swords",
    number: 2,
    meaningUpright: "Moeilijke keuzes, patstelling, geblokkeerde emoties, besluiteloosheid",
    meaningReversed: "Minste van twee kwaden, geen goede keuze, verwarring",
    description: "De Twee van Zwaarden staat voor een moeilijke keuze waarbij beide opties nadelen hebben.",
    imageUrl: img("Swords02.jpg")
  },
  {
    id: 52,
    name: "Three of Swords",
    nameNL: "Drie van Zwaarden",
    suit: "swords",
    number: 3,
    meaningUpright: "Hartpijn, verdriet, verlies, verdriet, scheiding",
    meaningReversed: "Herstel, vergiffenis, voorbij de pijn bewegen",
    description: "De Drie van Zwaarden symboliseert emotionele pijn, verdriet en hartbreak.",
    imageUrl: img("Swords03.jpg")
  },
  {
    id: 53,
    name: "Four of Swords",
    nameNL: "Vier van Zwaarden",
    suit: "swords",
    number: 4,
    meaningUpright: "Rust, herstel, contemplatie, meditatie, stilte",
    meaningReversed: "Uitputting, burn-out, diep ingeslapen zijn",
    description: "De Vier van Zwaarden staat voor rust na strijd en de noodzaak van herstel.",
    imageUrl: img("Swords04.jpg")
  },
  {
    id: 54,
    name: "Five of Swords",
    nameNL: "Vijf van Zwaarden",
    suit: "swords",
    number: 5,
    meaningUpright: "Conflict, verlies, eerloze overwinning, strijd",
    meaningReversed: "Verzoening, spijt na conflict, vrede sluiten",
    description: "De Vijf van Zwaarden symboliseert een overwinning die ten koste gaat van anderen.",
    imageUrl: img("Swords05.jpg")
  },
  {
    id: 55,
    name: "Six of Swords",
    nameNL: "Zes van Zwaarden",
    suit: "swords",
    number: 6,
    meaningUpright: "Overgang, verandering, rust na storm, verder gaan",
    meaningReversed: "Emotionele bagage, weerstand tegen verandering, onvoltooide zaken",
    description: "De Zes van Zwaarden staat voor een rustige overgang naar betere tijden.",
    imageUrl: img("Swords06.jpg")
  },
  {
    id: 56,
    name: "Seven of Swords",
    nameNL: "Zeven van Zwaarden",
    suit: "swords",
    number: 7,
    meaningUpright: "Bedrog, list, heimelijkheid, ontlopen van verantwoordelijkheid",
    meaningReversed: "Geweten, schuldgevoelens, terugkomen op iets, eerlijkheid",
    description: "De Zeven van Zwaarden symboliseert sluwheid, bedrog of het vermijden van confrontatie.",
    imageUrl: img("Swords07.jpg")
  },
  {
    id: 57,
    name: "Eight of Swords",
    nameNL: "Acht van Zwaarden",
    suit: "swords",
    number: 8,
    meaningUpright: "Gevangen voelen, beperkingen, isolatie, zelf opgelegde ketens",
    meaningReversed: "Zelfbevrijding, nieuwe perspectieven, vrijheid",
    description: "De Acht van Zwaarden staat voor het gevoel van gevangen zijn, vaak door eigen gedachten.",
    imageUrl: img("Swords08.jpg")
  },
  {
    id: 58,
    name: "Nine of Swords",
    nameNL: "Negen van Zwaarden",
    suit: "swords",
    number: 9,
    meaningUpright: "Angst, nachtmerries, negatief denken, trauma",
    meaningReversed: "Hoop, het overwinnen van angst, zorgen loslaten",
    description: "De Negen van Zwaarden symboliseert angst, zorgen en de last van negatieve gedachten.",
    imageUrl: img("Swords09.jpg")
  },
  {
    id: 59,
    name: "Ten of Swords",
    nameNL: "Tien van Zwaarden",
    suit: "swords",
    number: 10,
    meaningUpright: "Door het verwerven van geestelijk inzicht weer verder kunnen groeien. Einde en nieuw begin.",
    meaningReversed: "Vasthouden aan oude gedachtepatronen, weerstand tegen verandering",
    description: "De Tien van Zwaarden duidt op het einde van een situatie en de dageraad van een nieuw begin.",
    imageUrl: img("Swords10.jpg"),
    extendedDescription: "De meeste cursisten schrikken wanneer ze Tarotkaart Zwaarden Tien voor het eerst zien. Dit is echter helemaal niet nodig. Hoewel ik me niet kan voorstellen dat iemand graag op het strand ligt met zwaarden in zijn rug en oor, zijn er positieve elementen aanwezig op deze kaart.\n\nDe afgebeelde persoon maakt met zijn rechterhand het gebaar van de kerkelijke zegening. Was de lucht op Zwaarden Negen nog geheel zwart, op Zwaarden Tien zien we dat er een nieuwe ochtend aanbreekt.\n\n\"Je kunt een probleem niet oplossen met de denkwijze die het heeft veroorzaakt.\" (Albert Einstein)",
    loveReading: "Zwaarden Tien duidt erop dat je gedachten de oorzaak zijn van je lijden. Verander je gedachten en je verandert je realiteit."
  },
  {
    id: 60,
    name: "Page of Swords",
    nameNL: "Schildknaap van Zwaarden",
    suit: "swords",
    number: 11,
    meaningUpright: "Waakzaam, schrander, opmerkzaam, nieuwsgierig, communicatief",
    meaningReversed: "Overmatige angst, paranoia, roddels, oneerlijkheid",
    description: "De Schildknaap van Zwaarden staat voor waakzaamheid en een scherpe geest.",
    imageUrl: img("Swords11.jpg"),
    extendedDescription: "De Schildknaap van Zwaarden heeft tien vogels boven zich. Hij is voortdurend op zijn hoede. Die houding van angst en achterdocht kost enorm veel energie. De positievere kant van de Schildknaap van Zwaarden is zijn snelle, oplettende geest.",
    loveReading: "Zwaarden Schildknaap duidt op een angstige jongeman die overal gevaar ziet. Breng jezelf naar het heden en kijk of dat gevaar nu ook werkelijk aanwezig is."
  },
  {
    id: 61,
    name: "Knight of Swords",
    nameNL: "Ridder van Zwaarden",
    suit: "swords",
    number: 12,
    meaningUpright: "Ambitieus, actiegericht, gedreven, direct, analytisch",
    meaningReversed: "Roekeloosheid, agressie, impulsiviteit, bot gedrag",
    description: "De Ridder van Zwaarden stormt vooruit met vastberadenheid en energie. Hij handelt snel maar soms zonder na te denken.",
    imageUrl: img("Swords12.jpg")
  },
  {
    id: 62,
    name: "Queen of Swords",
    nameNL: "Koningin van Zwaarden",
    suit: "swords",
    number: 13,
    meaningUpright: "Heeft veel geleden en heeft daardoor veel wijsheid opgedaan. Intelligent en onafhankelijk. Rechtvaardig.",
    meaningReversed: "Bitterheid, hardheid, onvermogen om los te laten",
    description: "De Koningin van Zwaarden staat voor wijsheid door ervaring en rechtvaardigheid.",
    imageUrl: img("Swords13.jpg"),
    extendedDescription: "De Koningin van Zwaarden heeft een heldere en rustige geest. Door de geestelijke, spirituele ontwikkeling die zij heeft doorgemaakt, wordt zij nog zelden geplaagd door negatieve gedachten. Zij heeft rechtvaardigheid hoog in het vaandel staan.",
    loveReading: "Zwaarden Koningin wordt gezien als een scherpzinnige dame. Ze heeft een goed verstand en weet verstandige beslissingen te nemen. Ze kan anderen goed raad geven."
  },
  {
    id: 63,
    name: "King of Swords",
    nameNL: "Koning van Zwaarden",
    suit: "swords",
    number: 14,
    meaningUpright: "Mentale kracht, autoriteit, waarheid, ethiek, analytisch denken",
    meaningReversed: "Manipulatief, tiranniek, misbruik van macht, wreed",
    description: "De Koning van Zwaarden staat voor intellectueel gezag, eerlijkheid en het vermogen om helder en rechtvaardig te oordelen.",
    imageUrl: img("Swords14.jpg")
  }
];
