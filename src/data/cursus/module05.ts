export interface Maanfase {
  id: string;
  naam: string;
  enNaam: string;
  emoji: string;
  verlichting: string;
  duur: string;
  faseType: string;
  energie: string;
  watTeDoen: string[];
  watVermijden: string[];
  spiritueleBetekenis: string;
  voorPraktijk: string;
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const MAANFASEN: Maanfase[] = [
  {
    id: 'nieuwe-maan',
    naam: 'Nieuwe Maan',
    enNaam: 'New Moon',
    emoji: '🌑',
    verlichting: '0%',
    duur: '~3 dagen',
    faseType: 'Wassend startpunt',
    energie: 'Innerlijk, stil, naar binnen gericht. De maan is niet zichtbaar — moment van bezinning en intentie-zetten voor de komende cyclus.',
    watTeDoen: ['Intenties zetten voor de komende 28 dagen', 'Mediteren, journaling, dromen noteren', 'Stil zijn, naar binnen luisteren', 'Nieuwe projecten starten in concept-fase'],
    watVermijden: ['Grote externe lanceringen (te vroeg)', 'Beslissingen forceren — laat ze rijpen', 'Veel sociale activiteit'],
    spiritueleBetekenis: 'De Nieuwe Maan is een nul-moment. Wat je nu intentioneert, draagt door de hele cyclus. Behandel het als een heilig begin.',
    voorPraktijk: 'Klanten met een Nieuwe Maan hebben behoefte aan stilte en intentie. Adviseer rust, niet actie.',
  },
  {
    id: 'wassende-halve',
    naam: 'Wassende Sikkel',
    enNaam: 'Waxing Crescent',
    emoji: '🌒',
    verlichting: '1-49%',
    duur: '~7 dagen',
    faseType: 'Wassend, opbouwend',
    energie: 'De maan begint zichtbaar te worden als een dunne sikkel. Energie groeit naar buiten — eerste stappen, eerste handelingen.',
    watTeDoen: ['Plannen concreet maken — papierwerk, lijsten', 'Eerste praktische stappen zetten', 'Mensen informeren over je intentie', 'Hulp en bondgenoten zoeken'],
    watVermijden: ['Twijfelen aan wat je tijdens nieuwe maan hebt geïntentioneerd', 'Te snel willen oogsten'],
    spiritueleBetekenis: 'Vertrouwen in het proces. De vorm van het plan begint zich te tonen, maar het is nog jong en kwetsbaar.',
    voorPraktijk: 'Klanten in deze fase hebben momentum nodig én bescherming voor het prille.',
  },
  {
    id: 'eerste-kwartier',
    naam: 'Eerste Kwartier',
    enNaam: 'First Quarter',
    emoji: '🌓',
    verlichting: '50%',
    duur: '~3 dagen',
    faseType: 'Wassend keerpunt',
    energie: 'Half-maan, exact 7 dagen na Nieuwe Maan. Een crisis-moment: obstakels duiken op, twijfel komt. Tijd om te beslissen of je doorgaat.',
    watTeDoen: ['Obstakels onder ogen zien en aanpakken', 'Beslissingen nemen — niet uitstellen', 'Doorzetten ondanks moeilijkheden', 'Bijstellen waar nodig'],
    watVermijden: ['Opgeven bij de eerste tegenslag', 'Vluchten in bezigheid om niet te hoeven beslissen'],
    spiritueleBetekenis: 'Test van toewijding. Wat je nu doorzet, kan tot Volle Maan groeien. Wat je nu opgeeft, valt weg.',
    voorPraktijk: 'Klanten voelen weerstand of crisis. Adviseer doorzetten als de intentie nog klopt, of bewust loslaten als die niet meer klopt.',
  },
  {
    id: 'wassende-bolle',
    naam: 'Wassende Bolle Maan',
    enNaam: 'Waxing Gibbous',
    emoji: '🌔',
    verlichting: '51-99%',
    duur: '~7 dagen',
    faseType: 'Wassend, verfijnend',
    energie: 'Bijna vol. Energie groeit naar piek. Dit is de fase van verfijning — niet starten of beslissen, maar perfectioneren.',
    watTeDoen: ['Details bijwerken', 'Kwaliteit verbeteren', 'Loose ends opruimen', 'Voorbereiden op zichtbaarheid (Volle Maan)'],
    watVermijden: ['Nieuwe grote dingen starten — wacht op nieuwe Nieuwe Maan', 'Perfectionisme tot verlamming'],
    spiritueleBetekenis: 'Geduldig finishing touches aanbrengen. De vorm staat — laat hem nu mooi worden.',
    voorPraktijk: 'Klanten willen vaak nieuwe dingen beginnen — adviseer: maak eerst af wat al loopt.',
  },
  {
    id: 'volle-maan',
    naam: 'Volle Maan',
    enNaam: 'Full Moon',
    emoji: '🌕',
    verlichting: '100%',
    duur: '~3 dagen',
    faseType: 'Piek, omslag',
    energie: 'Hoogste verlichting, hoogste energie. Wat tijdens Nieuwe Maan is gezaaid, is nu zichtbaar. Emoties zijn intens. Dingen komen aan het licht.',
    watTeDoen: ['Vieren wat is gemanifesteerd', 'Inzichten en doorbraken erkennen', 'Ritueel: loslaten wat niet meer past', 'Sociaal moment, samen zijn'],
    watVermijden: ['Belangrijke beslissingen onder extreme emotie', 'Conflict opstoken (lontje is korter)'],
    spiritueleBetekenis: 'Het keerpunt. Vanaf nu wordt het weer minder licht. Volle Maan is zowel feest als afsluiting.',
    voorPraktijk: 'Klanten kunnen zich onrustig, energiek of emotioneel voelen. Normaliseer dat. Adviseer ritueel (kaars, intentie loslaten).',
  },
  {
    id: 'afnemende-bolle',
    naam: 'Afnemende Bolle Maan',
    enNaam: 'Waning Gibbous',
    emoji: '🌖',
    verlichting: '99-51% afnemend',
    duur: '~7 dagen',
    faseType: 'Afnemend, delen',
    energie: 'Het licht neemt af, maar er is veel om te delen. Tijd om wijsheid en resultaten uit te wisselen.',
    watTeDoen: ['Vertellen, schrijven, lesgeven over wat je hebt geleerd', 'Dankbaarheid uitdrukken naar betrokkenen', 'Resultaten communiceren', 'Reflectie op wat is bereikt'],
    watVermijden: ['Nieuwe grote starts (te laat in cyclus)', 'Vasthouden aan wat los moet'],
    spiritueleBetekenis: 'Wijsheid wil gedeeld worden. Wat je voor jezelf hield kan nu naar buiten.',
    voorPraktijk: 'Klanten hebben behoefte aan reflectie en uiting. Goed moment voor sessies.',
  },
  {
    id: 'laatste-kwartier',
    naam: 'Laatste Kwartier',
    enNaam: 'Last Quarter',
    emoji: '🌗',
    verlichting: '50% afnemend',
    duur: '~3 dagen',
    faseType: 'Afnemend keerpunt',
    energie: 'Half-maan aan de andere kant. Net als Eerste Kwartier een crisis-moment: wat houd je vast dat los moet?',
    watTeDoen: ['Opruimen — fysiek én emotioneel', 'Vergeven, afscheid nemen', 'Slechte gewoonten loslaten', 'Niet-werkende projecten stoppen'],
    watVermijden: ['Vastklampen omdat "er nog iets goeds in zit"', 'Nieuwe verbintenissen aangaan'],
    spiritueleBetekenis: 'Reiniging. Wat je nu loslaat, geeft ruimte voor de Nieuwe Maan-intentie van de volgende cyclus.',
    voorPraktijk: 'Klanten voelen vermoeidheid of weerstand. Adviseer rust + bewust loslaten van wat niet meer dient.',
  },
  {
    id: 'afnemende-halve',
    naam: 'Afnemende Sikkel',
    enNaam: 'Waning Crescent',
    emoji: '🌘',
    verlichting: '49-1%',
    duur: '~7 dagen',
    faseType: 'Afnemend, voorbereiding',
    energie: 'De maan trekt zich bijna helemaal terug. Diepste introversie. Geen tijd voor doen — tijd voor zijn.',
    watTeDoen: ['Veel rusten, slapen', 'Mediteren, dromen, stille tijd', 'Reflecteren op de hele cyclus', 'Lichaam reinigen (vasten, water, zachte beweging)'],
    watVermijden: ['Grote projecten of inspanning', 'Belangrijke gesprekken', 'Te veel sociaal contact'],
    spiritueleBetekenis: 'Het allerlaatste licht voor de duisternis. Tijd om alles los te laten zodat je bij Nieuwe Maan opnieuw kunt beginnen met lege handen.',
    voorPraktijk: 'Klanten kunnen vermoeid, melancholisch of stil zijn. Normaliseer dat — het hoort bij de cyclus. Adviseer zelfzorg, geen forceren.',
  },
];

export const MODULE05_QUIZ: QuizVraag[] = [
  { vraag: 'Welke fase is de eerste in de cyclus?', opties: ['Volle Maan', 'Nieuwe Maan', 'Eerste Kwartier', 'Wassende Sikkel'], juist: 1, uitleg: 'Nieuwe Maan is fase 1 — het begin van de 29.5-daagse cyclus.' },
  { vraag: 'Hoeveel dagen duurt een complete maan-cyclus?', opties: ['14', '21', '29.5', '31'], juist: 2, uitleg: '~29.5 dagen (synodische maand).' },
  { vraag: 'Welke fase is een keerpunt waarop loslaten centraal staat?', opties: ['Wassende Bolle', 'Eerste Kwartier', 'Laatste Kwartier', 'Nieuwe Maan'], juist: 2, uitleg: 'Laatste Kwartier = bewust loslaten. Eerste Kwartier = doorzetten of bijstellen.' },
  { vraag: 'Klant wil nieuw project starten. Maanfase = Afnemende Sikkel. Advies?', opties: ['Doen! Energie is perfect', 'Wachten tot de Nieuwe Maan voor maximum effect', 'Maakt niet uit', 'Stoppen met dit project'], juist: 1, uitleg: 'Afnemende Sikkel is een terugtrekkende fase. Wachten tot Nieuwe Maan geeft de beste start-energie.' },
  { vraag: 'Volle Maan = welk percentage verlichting?', opties: ['50%', '75%', '100%', '0%'], juist: 2, uitleg: 'Volle Maan = 100% verlicht.' },
  { vraag: '"Wassend" betekent:', opties: ['Afnemend (na Volle Maan)', 'Groeiend (van Nieuwe naar Volle)', 'Statisch', 'Niet zichtbaar'], juist: 1, uitleg: 'Wassend = groeiend, van Nieuwe Maan richting Volle Maan.' },
  { vraag: 'Welke fase past bij "eerste actie na intentie"?', opties: ['Nieuwe Maan', 'Wassende Sikkel', 'Volle Maan', 'Afnemende Bolle'], juist: 1, uitleg: 'Wassende Sikkel = eerste concrete stappen na de intentie van Nieuwe Maan.' },
  { vraag: 'Klant voelt zich moe en melancholisch. Maanfase = Afnemende Sikkel. Wat is normaal?', opties: ['Dit is een ziekte', 'Volkomen passend bij de fase — adviseer rust en zelfzorg', 'Negeer de maanfase', 'Stop alle sessies'], juist: 1, uitleg: 'Afnemende Sikkel vraagt om rust en bezinning. Vermoeidheid en inwaartse energie zijn normaal.' },
  { vraag: 'Welke 2 fasen zijn "half-maan" (50%)?', opties: ['Wassende en Afnemende Sikkel', 'Eerste en Laatste Kwartier', 'Nieuwe en Volle Maan', 'Bolle en Sikkel fasen'], juist: 1, uitleg: 'Eerste Kwartier (50% wassend) en Laatste Kwartier (50% afnemend).' },
  { vraag: 'Beste fase om iets af te ronden of op te ruimen?', opties: ['Wassende Sikkel', 'Volle Maan', 'Laatste Kwartier', 'Nieuwe Maan'], juist: 2, uitleg: 'Laatste Kwartier = afronden, opruimen, loslaten.' },
];
