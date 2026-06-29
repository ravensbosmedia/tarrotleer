export interface LetterBetekenis {
  letter: string;
  waarde: number;
  archetype: string;
  energie: string;
  positief: string;
  schaduw: string;
  alsCornerstone: string;
  alsCapstone: string;
  alsEersteKlinker: string | null;
  isKlinker: boolean;
}

export interface LetterPositie {
  id: string;
  naam: string;
  kort: string;
  watIsHet: string;
  berekening: string;
  voorbeeld: string;
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const LETTER_POSITIES: LetterPositie[] = [
  {
    id: 'cornerstone',
    naam: 'Cornerstone',
    kort: 'Eerste letter — hoe je nieuwe situaties aanpakt',
    watIsHet: 'De Cornerstone is de eerste letter van de naam (na NL voorvoegsel-filter). Het toont de "opstap-energie" — hoe iemand een nieuwe situatie aanvliegt, de energie waarmee hij/zij begint.',
    berekening: '1. Filter NL voorvoegsels (van, de, der, etc.)\n2. Pak de eerste letter van wat overblijft\n3. Zoek de betekenis op in de letter-betekenissen',
    voorbeeld: '"Maria van der Heuvel" → filter → "MariaHeuvel" → Cornerstone = M',
  },
  {
    id: 'capstone',
    naam: 'Capstone',
    kort: 'Laatste letter — hoe je dingen afmaakt',
    watIsHet: 'De Capstone is de laatste letter van de naam. Het toont de "kroon-energie" — hoe iemand dingen afrondt, afsluit, voltooit. Sommige letters maken makkelijk af (T, S), andere blijven hangen (A, O).',
    berekening: '1. Filter NL voorvoegsels\n2. Pak de laatste letter van wat overblijft\n3. Zoek de betekenis op in de letter-betekenissen',
    voorbeeld: '"Maria van der Heuvel" → "MariaHeuvel" → Capstone = L',
  },
  {
    id: 'eersteKlinker',
    naam: 'Eerste Klinker',
    kort: 'Eerste klinker — innerlijke drijfveer',
    watIsHet: 'De Eerste Klinker (A, E, I, O, U) is de vóór-talige drijfveer — wat iemand vanbinnen beweegt vóórdat er een woord uitkomt. Subtieler dan de Cornerstone, maar dieper.',
    berekening: '1. Filter NL voorvoegsels\n2. Loop letter voor letter totdat je een klinker (A/E/I/O/U) tegenkomt\n3. Zoek de betekenis op in de letter-betekenissen',
    voorbeeld: '"Maria van der Heuvel" → "MariaHeuvel" → M(mk), A(klinker!) → Eerste Klinker = A',
  },
];

export const LETTER_BETEKENISSEN: LetterBetekenis[] = [
  { letter: 'A', waarde: 1, archetype: 'De Pionier-letter', energie: 'Onafhankelijke, beginnende, leidende energie', positief: 'Initiatief, durf, zelfstandigheid, originaliteit', schaduw: 'Eigenwijs, ongeduldig, slecht in delegeren', alsCornerstone: 'Begint elke nieuwe situatie zelf, neemt het voortouw zonder te wachten', alsCapstone: 'Sluit af door zelf het laatste woord te hebben — eigenheid blijft staan', alsEersteKlinker: 'De pionier-letter vanbinnen: onafhankelijkheid, eigenheid, de wens om zelf te beginnen', isKlinker: true },
  { letter: 'B', waarde: 2, archetype: 'De Verbinder-letter', energie: 'Samenwerkende, ontvankelijke, dragende energie', positief: 'Sensitiviteit, empathie, partnerschap, geduld', schaduw: 'Conflict-vermijdend, te aanpassend, kan zichzelf wegcijferen', alsCornerstone: 'Treedt voorzichtig binnen, luistert eerst voordat hij/zij positie kiest', alsCapstone: 'Sluit zacht af — laat ruimte voor de ander om óók af te ronden', alsEersteKlinker: null, isKlinker: false },
  { letter: 'C', waarde: 3, archetype: 'De Expressie-letter', energie: 'Creatieve, communicatieve, vrolijke energie', positief: 'Charme, expressie, optimisme, sociale gave', schaduw: 'Oppervlakkig, vluchtig, moeite met focus', alsCornerstone: 'Stapt in met enthousiasme en woorden — maakt sfeer voordat de inhoud start', alsCapstone: 'Sluit af met een laatste verhaal, grap of expressief gebaar', alsEersteKlinker: null, isKlinker: false },
  { letter: 'D', waarde: 4, archetype: 'De Structuur-letter', energie: 'Stabiele, bouwende, gedisciplineerde energie', positief: 'Doortastendheid, betrouwbaarheid, praktisch denken', schaduw: 'Rigide, koppig, te controlerend', alsCornerstone: 'Begint met een plan — eerst structuur, dan actie', alsCapstone: 'Sluit definitief af — geen losse einden, het is klaar', alsEersteKlinker: null, isKlinker: false },
  { letter: 'E', waarde: 5, archetype: 'De Vrijheids-letter', energie: 'Bewegende, veelzijdige, vrije energie', positief: 'Aanpassingsvermogen, nieuwsgierigheid, levendigheid', schaduw: 'Rusteloos, ongeduldig, moeite met commitment', alsCornerstone: 'Stapt actief en zoekend binnen — wil meteen rondkijken', alsCapstone: 'Sluit losjes af — laat ruimte voor "misschien zien we elkaar weer"', alsEersteKlinker: 'De vrijheids-letter vanbinnen: behoefte aan beweging, variatie en onafhankelijkheid', isKlinker: true },
  { letter: 'F', waarde: 6, archetype: 'De Zorg-letter', energie: 'Verantwoordelijke, beschermende, dragende energie', positief: 'Familiezin, betrokkenheid, harmonie zoekend', schaduw: 'Bemoeizuchtig, perfectionistisch, draagt te veel', alsCornerstone: 'Begint met aandacht voor het welzijn van anderen in de situatie', alsCapstone: 'Sluit af met zorg dat iedereen goed achterblijft', alsEersteKlinker: null, isKlinker: false },
  { letter: 'G', waarde: 7, archetype: 'De Wijsheid-letter', energie: 'Diepzinnige, onderzoekende, intuïtieve energie', positief: 'Diepgang, intelligentie, spirituele gevoeligheid', schaduw: 'Eenzelvig, cynisch, afstandelijk', alsCornerstone: 'Begint met observatie — verzamelt eerst inzicht voordat hij/zij beweegt', alsCapstone: 'Sluit af met een reflectie of een wijze stilte', alsEersteKlinker: null, isKlinker: false },
  { letter: 'H', waarde: 8, archetype: 'De Manifest-letter', energie: 'Krachtige, structurerende, materieel-gerichte energie', positief: 'Daadkracht, autoriteit, organisatie, materieel succes', schaduw: 'Machtshongerig, controle-zuchtig, te materialistisch', alsCornerstone: 'Stapt binnen met overtuiging — heeft een doel en gaat ervoor', alsCapstone: 'Sluit af met een definitief resultaat — zichtbaar succes', alsEersteKlinker: null, isKlinker: false },
  { letter: 'I', waarde: 9, archetype: 'De Oude-Ziel-letter', energie: 'Omvattende, mededogende, idealistische energie', positief: 'Mededogen, universele liefde, kunstzinnigheid', schaduw: 'Wereldvreemd, melancholisch, vasthoudend aan oud verdriet', alsCornerstone: 'Treedt diep en zacht binnen — voelt het grotere geheel aan', alsCapstone: 'Sluit af met loslaten — wat geweest is, mag gaan', alsEersteKlinker: 'De oude-ziel-letter vanbinnen: mededogen, de wens om te dienen en te helen', isKlinker: true },
  { letter: 'J', waarde: 1, archetype: 'De Pionier-letter (variant)', energie: 'Initiërende, beginnende, leidende energie', positief: 'Initiatief, oprechtheid, zelfvertrouwen', schaduw: 'Eigenwijs, ongeduldig, dominant', alsCornerstone: 'Begint met overtuiging — wil de leiding voor de aanpak', alsCapstone: 'Sluit af door als laatste te vertrekken — laat indruk na', alsEersteKlinker: null, isKlinker: false },
  { letter: 'K', waarde: 2, archetype: 'De Verbinder-letter (variant)', energie: 'Bemiddelende, intuïtieve energie; meestergetal-potentie als 11', positief: 'Diplomatie, intuïtie, samenwerking', schaduw: 'Te gevoelig, kan overweldigd raken', alsCornerstone: 'Stapt voorzichtig binnen, voelt de sfeer', alsCapstone: 'Sluit harmonieus af — verbinding behouden boven gelijk hebben', alsEersteKlinker: null, isKlinker: false },
  { letter: 'L', waarde: 3, archetype: 'De Lichte-letter', energie: 'Creatieve, expressieve, zichtbare energie', positief: 'Communicatief, charmant, kunstzinnig', schaduw: 'Wisselvallig, oppervlakkig, vlucht in vorm', alsCornerstone: 'Begint met woorden — een grapje, een opmerking, een verhaal', alsCapstone: 'Sluit af met een laatste expressie — een groet, een statement', alsEersteKlinker: null, isKlinker: false },
  { letter: 'M', waarde: 4, archetype: 'De Bouwer-letter', energie: 'Stabiele, dragende, methodische energie', positief: 'Hardwerkend, betrouwbaar, gegrond, eerlijk', schaduw: 'Star, te serieus, perfectionistisch', alsCornerstone: 'Begint met een fundament — eerst de basis, dan de opbouw', alsCapstone: 'Sluit af met afgemaakt werk — niets blijft onaf', alsEersteKlinker: null, isKlinker: false },
  { letter: 'N', waarde: 5, archetype: 'De Beweger-letter', energie: 'Veelzijdige, communicatieve, beweeglijke energie', positief: 'Nieuwsgierig, aanpassend, alert', schaduw: 'Rusteloos, prikkelbaar, snel verveeld', alsCornerstone: 'Begint met beweging — niet stil-staan, maar verkennen', alsCapstone: 'Sluit af met een open einde — wie weet wat morgen brengt', alsEersteKlinker: null, isKlinker: false },
  { letter: 'O', waarde: 6, archetype: 'De Omvatter-letter', energie: 'Cyclische, dragende, omarmende energie', positief: 'Volledigheid, zorg, trouw, emotionele diepte', schaduw: 'Vast in patroon, controlebehoefte, jaloersheid', alsCornerstone: 'Treedt binnen door eerst de hele situatie te omvatten', alsCapstone: 'Sluit af met een rond, compleet gevoel — alles op zijn plek', alsEersteKlinker: 'De omvatter-letter vanbinnen: behoefte aan volledigheid, trouw en emotionele diepte', isKlinker: true },
  { letter: 'P', waarde: 7, archetype: 'De Denker-letter', energie: 'Analytische, observerende, intuïtieve energie', positief: 'Spirituele gevoeligheid, inzicht, scherp denken', schaduw: 'Te in het hoofd, achterdochtig, afstandelijk', alsCornerstone: 'Begint met een analytische blik — eerst overzien, dan handelen', alsCapstone: 'Sluit af met een conclusie of een kritische observatie', alsEersteKlinker: null, isKlinker: false },
  { letter: 'Q', waarde: 8, archetype: 'De Onverwachte-letter', energie: 'Krachtige, ongebruikelijke, originele energie', positief: 'Originaliteit, daadkracht, ongewone aanpak', schaduw: 'Excentriek, controlerend op vreemde manieren', alsCornerstone: 'Stapt op onverwachte wijze binnen — niet zoals anderen verwachten', alsCapstone: 'Sluit af met iets dat blijft hangen — verrassend slot', alsEersteKlinker: null, isKlinker: false },
  { letter: 'R', waarde: 9, archetype: 'De Mededogen-letter', energie: 'Krachtige, dienende, omvattende energie', positief: 'Universele empathie, doelgerichtheid, dienstbaarheid', schaduw: 'Ongeduldig met onrecht, zwaarmoedig, draagt te veel', alsCornerstone: 'Begint vanuit een groter doel — niet voor zichzelf, voor iets/iemand anders', alsCapstone: 'Sluit af met een bijdrage aan het geheel', alsEersteKlinker: null, isKlinker: false },
  { letter: 'S', waarde: 1, archetype: 'De Stroom-letter', energie: 'Wendbare, instinctieve, beginnende energie', positief: 'Intuïtie, snelheid, persoonlijke kracht', schaduw: 'Impulsief, defensief, kan zelfvergeten zijn', alsCornerstone: 'Stapt binnen met instinct — niet eerst denken, gewoon doen', alsCapstone: 'Sluit af met een snelle, definitieve actie — geen lang afscheid', alsEersteKlinker: null, isKlinker: false },
  { letter: 'T', waarde: 2, archetype: 'De Stabiele-Verbinder-letter', energie: 'Standvastige, samenwerkende, brede energie', positief: 'Geduld, samenwerking, brede schouders', schaduw: 'Te aanpassend, kan in slachtofferrol komen', alsCornerstone: 'Begint stabiel en dragend — kalm, niet haastig', alsCapstone: 'Sluit af met een kalm "tot ziens" — geen drama', alsEersteKlinker: null, isKlinker: false },
  { letter: 'U', waarde: 3, archetype: 'De Open-Beker-letter', energie: 'Ontvankelijke, kunstzinnige, openhartige energie', positief: 'Emotionele openheid, intuïtie, creativiteit', schaduw: 'Te open, kwetsbaar, neemt alles binnen', alsCornerstone: 'Treedt open binnen — laat zich raken door wat hij/zij tegenkomt', alsCapstone: 'Sluit af door iets te ontvangen — een omhelzing, een woord', alsEersteKlinker: 'De open-beker-letter vanbinnen: behoefte aan emotionele openheid en ontvangen', isKlinker: true },
  { letter: 'V', waarde: 4, archetype: 'De Aarder-letter', energie: 'Praktische, stabiliserende, krachtige energie', positief: 'Werkkracht, betrouwbaarheid, blijvende impact', schaduw: 'Star, materialistisch, koppig', alsCornerstone: 'Begint stevig op de grond — "laten we praktisch zijn"', alsCapstone: 'Sluit af met blijvende structuur — iets dat morgen nog staat', alsEersteKlinker: null, isKlinker: false },
  { letter: 'W', waarde: 5, archetype: 'De Veelzijdige-letter', energie: 'Beweeglijke, creatieve, veelzijdige energie', positief: 'Verandering, communicatie, brede interesses', schaduw: 'Vluchtig, weinig focus, snel verveeld', alsCornerstone: 'Stapt levendig binnen — meerdere petten tegelijk', alsCapstone: 'Sluit af met een nieuw idee — niet echt afgesloten, eerder doorlopend', alsEersteKlinker: null, isKlinker: false },
  { letter: 'X', waarde: 6, archetype: 'De Kruis-letter', energie: 'Brede, zorgende, samenkomende energie', positief: 'Bemiddeling, zorg, koppeling van werelden', schaduw: 'Lijdt voor anderen, te idealistisch in zorg', alsCornerstone: 'Begint door eerst de mensen rondom te zien — context voor de inhoud', alsCapstone: 'Sluit af met aandacht voor relaties — relatie boven taak', alsEersteKlinker: null, isKlinker: false },
  { letter: 'Y', waarde: 7, archetype: 'De Zoeker-letter', energie: 'Onderzoekende, beslissende, spirituele energie', positief: 'Diepe intuïtie, beslissingsvermogen, mystiek inzicht', schaduw: 'Twijfel, isolatie, te lang aarzelen', alsCornerstone: 'Begint met een vraag — "wat is hier eigenlijk aan de hand?"', alsCapstone: 'Sluit af met een keuze (na aarzeling) of laat bewust open', alsEersteKlinker: null, isKlinker: false },
  { letter: 'Z', waarde: 8, archetype: 'De Vol-Kracht-letter', energie: 'Krachtige, manifesterende, daadkrachtige energie', positief: 'Daadkracht, snel resultaat, autoriteit', schaduw: 'Kort lontje, dominantie, machtsmisbruik', alsCornerstone: 'Stapt binnen met aanwezigheid — vult de ruimte', alsCapstone: 'Sluit af met een definitief eindpunt — geen ruimte voor twijfel', alsEersteKlinker: null, isKlinker: false },
];

export const MODULE03_QUIZ: QuizVraag[] = [
  {
    vraag: 'Welke letter is de Cornerstone van "Jan van Dijk" in AuraLine\'s analyse?',
    opties: ['J', 'V', 'D', 'N'],
    juist: 0,
    uitleg: '"Jan van Dijk" → filter "van" → "JanDijk" → Cornerstone = J',
  },
  {
    vraag: 'Welke letter is de Eerste Klinker van "Sven"?',
    opties: ['S', 'E', 'V', 'Geen klinker'],
    juist: 1,
    uitleg: 'Sven: S=medeklinker, V=medeklinker, E=klinker → Eerste Klinker = E',
  },
  {
    vraag: 'Cornerstone H betekent:',
    opties: ['Aarzelend beginnen', 'Stapt binnen met overtuiging — heeft een doel en gaat ervoor', 'Begint met emotie', 'Geen specifieke energie'],
    juist: 1,
    uitleg: 'H (waarde 8) is de Manifest-letter — stapt binnen met daadkracht en doel.',
  },
  {
    vraag: '"Maria van der Heuvel" — Cornerstone is:',
    opties: ['V', 'D', 'M', 'H'],
    juist: 2,
    uitleg: '"Maria van der Heuvel" → filter "van" en "der" → "MariaHeuvel" → Cornerstone = M',
  },
  {
    vraag: 'Eerste Klinker E (waarde 5) — wat drijft deze persoon vanbinnen?',
    opties: ['Stabiliteit en zekerheid', 'Vrijheid en verandering', 'Materieel succes', 'Spirituele zoektocht'],
    juist: 1,
    uitleg: 'E is de Vrijheids-letter (waarde 5) — vanbinnen drijft behoefte aan beweging, variatie en onafhankelijkheid.',
  },
  {
    vraag: 'Welke letter is ALTIJD een medeklinker in AuraLine?',
    opties: ['E', 'Y', 'A', 'I'],
    juist: 1,
    uitleg: 'Y heeft in AuraLine altijd waarde 7 als medeklinker, ook al klinkt het soms als een klinker.',
  },
  {
    vraag: 'Capstone L — hoe sluit deze persoon doorgaans af?',
    opties: ['Lang, emotioneel afscheid', 'Definitief en snel', 'Met een laatste expressie — verhaal, groet, statement', 'Open einde'],
    juist: 2,
    uitleg: 'L is de Lichte-letter (waarde 3) — sluit af met expressie, een gebaar, niet zwaar.',
  },
  {
    vraag: 'Welk voorvoegsel filtert AuraLine NIET uit?',
    opties: ['van', 'der', 'ten', 'den'],
    juist: 2,
    uitleg: '"ten" staat niet in AuraLine\'s filter. Gefilterd worden: van, de, het, der, ter, den, \'t, te.',
  },
  {
    vraag: 'Iemand met Cornerstone A en Capstone A:',
    opties: ['Onmogelijk', 'Pionier-energie van begin tot eind, consistent in modus', 'Heel zacht', 'Per definitie meestergetal'],
    juist: 1,
    uitleg: 'Dubbele A = pionier-energie zowel bij de start als de afsluiting — consistente, onafhankelijke stijl.',
  },
  {
    vraag: 'Letter-analyse is vooral nuttig:',
    opties: ['Als vervanging van de naam-getallen', 'Als verfijning nadat de naam-getallen er staan', 'Alleen bij vrouwen', 'Alleen bij Nederlandse namen'],
    juist: 1,
    uitleg: 'Letter-analyse is fijnzinnig — niet doorslaggevend, maar verfijnend. Gebruik het om een profiel scherper te maken nadat de getallen er staan.',
  },
];

export const MODULE03_VOORBEELD = {
  origineleNaam: 'Maria van der Heuvel',
  naFilterNaam: 'MariaHeuvel',
  posities: [
    { positie: 'Cornerstone (eerste)', letter: 'M', waarde: 4, archetype: 'De Bouwer-letter' },
    { positie: 'Capstone (laatste)', letter: 'L', waarde: 3, archetype: 'De Lichte-letter' },
    { positie: 'Eerste Klinker', letter: 'A', waarde: 1, archetype: 'De Pionier-letter' },
  ],
  lezingen: [
    'Cornerstone M (4): Maria pakt nieuwe situaties stevig en gestructureerd aan — eerst plan, dan actie. Mensen ervaren haar opstap als degelijk en georganiseerd.',
    'Capstone L (3): Ze sluit dingen creatief af — een laatste verhaal, een lichte noot. Niet definitief, eerder met flair.',
    'Eerste Klinker A (1): Vanbinnen drijft pioniers-energie — onafhankelijkheid, eigenheid. Mensen zien eerst de M (stabiele bouwer), maar er gist een A (pionier) onder.',
  ],
  spanningsveld: 'M (stabiel) vs A (pionier): buitenkant is degelijk, vanbinnen broeit ondernemerschap. Beste in een rol met eigen initiatief binnen stabiele structuur.',
};
