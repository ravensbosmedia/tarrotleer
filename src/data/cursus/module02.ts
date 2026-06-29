export interface NaamLes {
  id: string;
  naam: string;
  kort: string;
  watIsHet: string;
  watVerteltHet: string;
  inGesprek: string;
  input: string;
  stappen: string[];
  voorbeeld: string;
  bron: string;
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const LETTERWAARDEN: Record<string, number> = {
  A:1, J:1, S:1,
  B:2, K:2, T:2,
  C:3, L:3, U:3,
  D:4, M:4, V:4,
  E:5, N:5, W:5,
  F:6, O:6, X:6,
  G:7, P:7, Y:7,
  H:8, Q:8, Z:8,
  I:9, R:9,
};

export const KLINKERS = new Set(['A','E','I','O','U']);

export const NAAM_LESSEN: NaamLes[] = [
  {
    id: 'expression',
    naam: 'Expression Number',
    kort: 'Wat je uitdrukt in de wereld',
    watIsHet: 'Het Expression Number is de som van ALLE letters van de volledige naam — klinkers én medeklinkers. Het laat zien hoe je je uitdrukt, je "merk" in interactie met de wereld.',
    watVerteltHet: 'Het Expression Number toont wat je in de wereld uitstraalt — hoe mensen je ervaren als je jezelf bent. Het is de samenvoeging van je innerlijke wereld (klinkers) en je buitenkant (medeklinkers). Geen masker, geen diepste wens — de volledige uitdrukking.',
    inGesprek: '"Je naam drukt je als geheel uit. Als ik je Expression zie, zie ik hoe jij je presenteert aan de wereld — zowel wat je voelt als hoe je dat toont. Is dat hoe je jezelf ook ervaart?"',
    input: 'Alle letters van de volledige naam (na NL-voorvoegsel filter)',
    stappen: [
      'Filter NL voorvoegsels uit de naam (van, de, het, der, ter, den, \'t, te)',
      'Geef elke letter zijn Pythagoreaanse waarde (A=1, B=2, ... Z=8, I/R=9)',
      'Tel alle waarden bij elkaar op',
      'Reduceer tot 1-9 (meestergetallen 11 en 22 niet reduceren)',
    ],
    voorbeeld: 'Frans Bemelmans: F(6)+R(9)+A(1)+N(5)+S(1) + B(2)+E(5)+M(4)+E(5)+L(3)+M(4)+A(1)+N(5)+S(1) = 52 → 5+2 = 7',
    bron: 'src/utils/numerologieNaam.ts → expressionNumber()',
  },
  {
    id: 'personality',
    naam: 'Personality Number',
    kort: 'Hoe anderen jou zien — je masker',
    watIsHet: 'Het Personality Number komt uit alleen de medeklinkers van de naam. Het toont wat je naar buiten projecteert zonder het te beseffen — de eerste indruk die mensen krijgen vóórdat ze je echt kennen.',
    watVerteltHet: 'Dit is je "verpakking" — de laag die zichtbaar is bij het eerste contact. Het Personality Number verklaart waarom mensen je soms anders inschatten dan je jezelf ervaart. Een 4 hier betekent dat anderen je als stabiel en gestructureerd zien, ook als je vanbinnen iets heel anders ervaart.',
    inGesprek: '"Hoe beschrijven mensen jou als ze je voor het eerst ontmoeten? Herken je dat beeld? Het Personality Number laat precies die eerste indruk zien — jouw buitenste laag."',
    input: 'Alleen medeklinkers (B,C,D,F,G,H,J,K,L,M,N,P,Q,R,S,T,V,W,X,Y,Z)',
    stappen: [
      'Filter NL voorvoegsels uit de naam',
      'Pak alleen de medeklinkers',
      'Geef elke medeklinker zijn waarde',
      'Tel op en reduceer (11/22 niet reduceren)',
    ],
    voorbeeld: 'Frans Bemelmans medeklinkers: F(6)+R(9)+N(5)+S(1) + B(2)+M(4)+L(3)+M(4)+N(5)+S(1) = 40 → 4+0 = 4',
    bron: 'src/utils/numerologieNaam.ts → personalityNumber()',
  },
  {
    id: 'soul',
    naam: 'Soul Number / Zielsverlangen',
    kort: 'Wat je diep van binnen verlangt',
    watIsHet: 'Het Soul Number komt uit alleen de klinkers (A, E, I, O, U). Het is het verborgenste getal — het toont wat je hart stil verlangt, het deel dat alleen zichtbaar wordt in intimiteit.',
    watVerteltHet: 'Dit getal raakt mensen diep omdat het gaat over hun ware innerlijk. Het is het verlangen vóór alle sociale lagen. Als iemand zegt "ik voel me nooit helemaal mezelf", dan zit de sleutel vaak hier. Het Soul Number is wat je nodig hebt om echt gelukkig te zijn.',
    inGesprek: '"Als niemand kijkt, wat verlang je dan echt? Dit getal gaat voorbij je werk, je rol, je masker. Het is de stille stem achter al je keuzes." — Dit is het getal dat mensen het meest raakt, gebruik het met zorg.',
    input: 'Alleen klinkers (A, E, I, O, U — Y telt altijd als medeklinker in AuraLine)',
    stappen: [
      'Filter NL voorvoegsels uit de naam',
      'Pak alleen de klinkers (A, E, I, O, U)',
      'Geef elke klinker zijn waarde',
      'Tel op en reduceer (11/22 niet reduceren)',
    ],
    voorbeeld: 'Frans Bemelmans klinkers: A(1) + E(5)+E(5)+A(1) = 12 → 1+2 = 3',
    bron: 'src/utils/numerologieNaam.ts → soulNumber()',
  },
];

export const MODULE02_QUIZ: QuizVraag[] = [
  {
    vraag: 'Welke letter heeft waarde 9 in de Pythagoreaanse tabel?',
    opties: ['A', 'I', 'Y', 'R'],
    juist: 3,
    uitleg: 'R heeft waarde 9. I heeft ook waarde 9. Y is in AuraLine altijd medeklinker met waarde 7.',
  },
  {
    vraag: 'Welk naam-getal gebruikt ALLE letters (klinkers + medeklinkers)?',
    opties: ['Soul Number', 'Personality Number', 'Expression Number', 'Levenspad'],
    juist: 2,
    uitleg: 'Expression Number telt alle letters van de naam op — zowel klinkers als medeklinkers.',
  },
  {
    vraag: 'Welk naam-getal toont "hoe anderen jou eerst zien"?',
    opties: ['Expression', 'Personality', 'Soul', 'Bestuursgetal'],
    juist: 1,
    uitleg: 'Personality Number = de medeklinkers = je buitenkant = de eerste indruk bij anderen.',
  },
  {
    vraag: 'Welke letter beschouwt AuraLine ALTIJD als medeklinker?',
    opties: ['E', 'Y', 'W', 'H'],
    juist: 1,
    uitleg: 'Y heeft in AuraLine altijd waarde 7 als medeklinker. In sommige tradities wordt Y soms als klinker gezien, maar AuraLine kiest voor consistentie.',
  },
  {
    vraag: 'Soul Number van "Anna" (A-N-N-A)?',
    opties: ['1', '2', '3', '5'],
    juist: 1,
    uitleg: 'Anna: klinkers = A(1) + A(1) = 2. Medeklinkers N+N worden niet meegeteld bij Soul.',
  },
  {
    vraag: 'Welk voorvoegsel filtert AuraLine NIET uit?',
    opties: ['van', 'den', 'le (Frans)', 'der'],
    juist: 2,
    uitleg: '"le" is Frans/niet-NL. AuraLine filtert alleen: van, de, het, der, ter, den, \'t, te.',
  },
  {
    vraag: 'Iemand heeft Personality 4 en Soul 3. Wat is een goed advies?',
    opties: [
      'Verander je naam',
      'Onderdruk de creativiteit voor betrouwbaarheid',
      'Geef de creatieve kant ruimte naast de gestructureerde buitenkant',
      'Negeer het Soul getal',
    ],
    juist: 2,
    uitleg: 'Personality 4 is de stabiele buitenkant, Soul 3 verlangt naar creatieve expressie. Beide kanten ruimte geven is gezond.',
  },
  {
    vraag: 'Verschil tussen Expression Number en Levenspad?',
    opties: [
      'Geen verschil',
      'Expression komt uit naam, Levenspad uit geboortedatum',
      'Expression is altijd hoger',
      'Levenspad gebruikt ook letters',
    ],
    juist: 1,
    uitleg: 'Expression Number = naam. Levenspad = geboortedatum. Twee compleet verschillende bronnen.',
  },
  {
    vraag: 'Soul Number van "Sven" (S-V-E-N)?',
    opties: ['5', '11', '6', '2'],
    juist: 0,
    uitleg: 'Sven: enige klinker is E = 5. Soul Number = 5.',
  },
  {
    vraag: 'Welke waarde heeft de letter K?',
    opties: ['1', '2', '3', '7'],
    juist: 1,
    uitleg: 'K heeft waarde 2 (Pythagoreaans: A=1, B=2, C=3... K=11→2). Andere letters met waarde 2: B en T.',
  },
];

export const MODULE02_VOORBEELD = {
  naam: 'Frans Bemelmans',
  tabel: [
    { letter: 'F', waarde: 6, type: 'medeklinker' },
    { letter: 'R', waarde: 9, type: 'medeklinker' },
    { letter: 'A', waarde: 1, type: 'klinker' },
    { letter: 'N', waarde: 5, type: 'medeklinker' },
    { letter: 'S', waarde: 1, type: 'medeklinker' },
    { letter: 'B', waarde: 2, type: 'medeklinker' },
    { letter: 'E', waarde: 5, type: 'klinker' },
    { letter: 'M', waarde: 4, type: 'medeklinker' },
    { letter: 'E', waarde: 5, type: 'klinker' },
    { letter: 'L', waarde: 3, type: 'medeklinker' },
    { letter: 'M', waarde: 4, type: 'medeklinker' },
    { letter: 'A', waarde: 1, type: 'klinker' },
    { letter: 'N', waarde: 5, type: 'medeklinker' },
    { letter: 'S', waarde: 1, type: 'medeklinker' },
  ],
  uitkomsten: [
    { naam: 'Expression', getal: 7, archetype: 'Zoeker', berekening: '52 → 5+2 = 7' },
    { naam: 'Personality', getal: 4, archetype: 'Bouwer', berekening: '40 → 4+0 = 4' },
    { naam: 'Soul', getal: 3, archetype: 'Communicator', berekening: '12 → 1+2 = 3' },
  ],
  dynamiek: [
    'Buiten ≠ binnen: Personality 4 (gestructureerd) vs Soul 3 (creatief vrij). Stabiele buitenkant, creatief verlangen vanbinnen.',
    'Expression 7 (denker) vs Personality 4 (doener): anderen zien een praktische bouwer, maar horen een filosoof als ze luisteren.',
    'Soul 3 wil eruit: expressie via schrijven, muziek of vertellen is voor Frans gezond — anders blijft de Soul ondergeschikt.',
  ],
  combinatieMetModule1: 'Frans heeft uit geboortedatum: Levenspad 2, Levensles 7, Geschenk 7. Sterke 7-energie (Expression + Levensles + Geschenk) — dit is écht een Zoeker. De 4-buitenkant zorgt voor draagvermogen, het 3-zielsverlangen zorgt dat hij niet in isolement blijft.',
};
