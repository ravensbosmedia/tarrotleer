export interface QuizVraag {
  id: number;
  vraag: string;
  opties: string[];
  correct: number;
  uitleg: string;
}

// De 20 meest essentiële vragen voor de pendelcursus
export const pendelQuizVragen: QuizVraag[] = [
  {
    id: 1,
    vraag: 'Hoe lang moet de ketting zijn bij het pendelen?',
    opties: ['5–10 cm', '15–20 cm', '25–30 cm', '30–40 cm'],
    correct: 1,
    uitleg: '15–20 cm is de optimale lengte voor duidelijke maar precieze bewegingen.',
  },
  {
    id: 2,
    vraag: 'Welke lichaamshouding is correct bij het pendelen?',
    opties: [
      'Rug gebogen, voeten gekruist',
      'Rug recht, elleboog op tafel, vrije hand plat op tafel',
      'Staand pendelen zonder tafel',
      'Liggen op de rug',
    ],
    correct: 1,
    uitleg: 'Een rechte rug met elleboog op tafel en vrije hand plat zorgt voor minimale spierspanning en maximale gevoeligheid.',
  },
  {
    id: 3,
    vraag: 'Wanneer mag je ABSOLUUT niet pendelen?',
    opties: [
      'Als het regent buiten',
      'Als je ziek, depressief of psychisch overprikkeld bent',
      'Als je honger hebt',
      'Als je muziek speelt',
    ],
    correct: 1,
    uitleg: 'Ziekte, depressie en psychische overprikkeling beïnvloeden de betrouwbaarheid van je pendelresultaten ernstig.',
  },
  {
    id: 4,
    vraag: 'Wat betekent een rechtsdraaiende beweging bij het testen van een voorwerp?',
    opties: ['Negatieve uitslag', 'Geen antwoord', 'Positieve uitslag', 'Fout resultaat'],
    correct: 2,
    uitleg: 'Rechtsdraaiend (met de klok mee) geeft een positieve uitslag aan bij het testen van voorwerpen.',
  },
  {
    id: 5,
    vraag: 'Welke schijf gebruik je om te controleren of je pendelresultaat juist is?',
    opties: ['Procentschijf', 'Letterschijf', 'Controleschijf', 'Getallenschijf'],
    correct: 2,
    uitleg: 'De Controleschijf is het eerste hulpmiddel dat je gebruikt vóór elke pendelsessie.',
  },
  {
    id: 6,
    vraag: 'Hoeveel procent pendelvermogen heb je minimaal nodig voor betrouwbare resultaten?',
    opties: ['50%', '65%', '75%', '85%'],
    correct: 3,
    uitleg: 'Een pendelvermogen van minimaal 85% wordt aanbevolen. Onder de 70% is de kans op fouten te groot.',
  },
  {
    id: 7,
    vraag: 'Wat is het ideomotorisch effect?',
    opties: [
      'Een soort meditatie',
      'Onbewuste spierbewegingen die de pendel laten bewegen',
      'Een type storingsveld',
      'Een chakra-energie meting',
    ],
    correct: 1,
    uitleg: 'Het ideomotorisch effect zijn onbewuste kleine spierbewegingen die door gedachten worden aangestuurd en via de pendel zichtbaar worden.',
  },
  {
    id: 8,
    vraag: "Hoeveel hoofdchakra's zijn er?",
    opties: ['5', '6', '7', '8'],
    correct: 2,
    uitleg: "Er zijn 7 hoofdchakra's, van het wortelchakra (Muladhara) tot het kruinchakra (Sahasrara).",
  },
  {
    id: 9,
    vraag: 'Welke kleur hoort bij het hartchakra (4e chakra)?',
    opties: ['Rood', 'Geel', 'Groen / roze', 'Blauw'],
    correct: 2,
    uitleg: 'Het hartchakra (Anahata) is verbonden met de kleuren groen en roze.',
  },
  {
    id: 10,
    vraag: 'Welke beweging bij het pendelen boven een chakra betekent dat het chakra open en in balans is?',
    opties: ['Linksom (tegen de klok in)', 'Stilstaan', 'Rechtsom (met de klok mee)', 'Heen en weer'],
    correct: 2,
    uitleg: 'Rechtsom draaien (met de klok mee) geeft aan dat een chakra open, actief en in balans is. Linksom betekent geblokkeerd.',
  },
  {
    id: 11,
    vraag: 'Welke stelling over pendelen is JUIST?',
    opties: [
      'Pendelen geeft altijd 100% correcte antwoorden',
      'Alleen speciaal begaafde mensen kunnen pendelen',
      'Geen enkel pendelantwoord is onfeilbaar — altijd controleren',
      'Je moet een dure pendel hebben voor goede resultaten',
    ],
    correct: 2,
    uitleg: 'Iedereen kan leren pendelen, maar geen enkel resultaat is onfeilbaar. Controleer altijd met de Controleschijf.',
  },
  {
    id: 12,
    vraag: "Wat doe je als de Controleschijf 'onjuist' aangeeft?",
    opties: [
      'Doorgaan met pendelen',
      "De schijf 'Foutief pendelresultaat' gebruiken om de oorzaak te vinden",
      'Een andere pendel pakken',
      'Harder concentreren',
    ],
    correct: 1,
    uitleg: "De schijf 'Foutief pendelresultaat' helpt je de specifieke oorzaak van het onbetrouwbare resultaat te identificeren.",
  },
  {
    id: 13,
    vraag: 'Welke kleur hoort bij het 1e chakra (wortelchakra)?',
    opties: ['Oranje', 'Geel', 'Rood', 'Violet'],
    correct: 2,
    uitleg: 'Het wortelchakra (Muladhara) is verbonden met de kleur rood en staat voor stabiliteit en overleving.',
  },
  {
    id: 14,
    vraag: 'Waarvoor gebruik je de Procentschijf?',
    opties: [
      'Om kleuren te bepalen',
      'Om percentagewaarden te bepalen (bijv. vitaliteit, effectiviteit, dosering)',
      "Om chakra's te identificeren",
      'Om letters te spellen',
    ],
    correct: 1,
    uitleg: 'De Procentschijf (0–200%) is ideaal voor kwantitatieve vragen. Boven 100% betekent overmaat of overactiviteit.',
  },
  {
    id: 15,
    vraag: 'Wat is een Bovis-eenheid (BE)?',
    opties: [
      'Een maat voor temperatuur',
      'Een meetschaal voor stralingsintensiteit van plaatsen en voorwerpen',
      'Een type pendel',
      'Een meditatietechniek',
    ],
    correct: 1,
    uitleg: 'André Bovis ontwikkelde deze meetschaal (de biometer) voor het meten van levensenergie en stralingsintensiteit.',
  },
  {
    id: 16,
    vraag: 'Wat is een waterader in de context van storingsvelden?',
    opties: [
      'Een waterleiding in huis',
      'Een ondergrondse waterstroom die straling kan veroorzaken',
      'Een type pendel gemaakt van water',
      'Een meditatietechniek',
    ],
    correct: 1,
    uitleg: 'Een waterader is een ondergrondse waterstroom waarvan de uitstraling de leefsituatie kan beïnvloeden.',
  },
  {
    id: 17,
    vraag: 'Hoe pendel je voor een ander persoon?',
    opties: [
      'Houd de pendel direct boven zijn hoofd',
      'Houd de pendel tussen het voorwerp en de hand van de ander',
      'Laat de ander de pendel vasthouden',
      'Pendel nooit voor anderen',
    ],
    correct: 1,
    uitleg: 'Bij het pendelen voor anderen houd je de pendel tussen het voorwerp en de hand van de ander in — zo test je de wisselwerking.',
  },
  {
    id: 18,
    vraag: 'Wat betekent een linksdraaiende beweging bij het testen van een voorwerp of lichaam?',
    opties: ['Positieve uitslag', 'Negatieve uitslag', 'Neutraal', 'Onbekend'],
    correct: 1,
    uitleg: 'Linksdraaiend (tegen de klok in) geeft een negatieve uitslag aan bij het testen van voorwerpen of het lichaam.',
  },
  {
    id: 19,
    vraag: 'Welke JA-beweging is het meest voorkomend bij pendelen?',
    opties: ['Linksdraaiend', 'Stilstaand', 'Rechtsdraaiend of voor-achter', 'Horizontaal'],
    correct: 2,
    uitleg: 'Bij de meeste mensen is rechtsdraaiend of voor-achter het JA-signaal, maar kalibreer dit altijd persoonlijk.',
  },
  {
    id: 20,
    vraag: 'Welke van de 9 basisregels is het BELANGRIJKST bij het pendelen?',
    opties: [
      'Altijd een dure kristallen pendel gebruiken',
      'Alleen oefenen op volle maan',
      'Houd je hoofd vrij van vooroordelen en controleer elk resultaat',
      'Schrijf alle resultaten op in een speciaal boek',
    ],
    correct: 2,
    uitleg: 'De gouden regel: houd geen enkel antwoord voor onfeilbaar. Een vrije geest zonder wensdenken en altijd controleren zijn de basis van betrouwbaar pendelen.',
  },
];
