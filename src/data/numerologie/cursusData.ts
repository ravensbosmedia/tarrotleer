export interface GetaalBetekenis {
  getal: number | "11" | "22";
  archetype: string;
  sleutelwoorden: string[];
  energie: string;
  positief: string;
  schaduw: string;
  werk: string;
  relaties: string;
  spiritueleLes: string;
  ontwikkelpunten: string;
  isMeestergetal?: boolean;
}

export const GETAL_BETEKENISSEN: GetaalBetekenis[] = [
  {
    getal: 1,
    archetype: "De Pionier",
    sleutelwoorden: ["leiderschap", "onafhankelijkheid", "initiatief", "individualiteit"],
    energie: "Naar voren bewegende, scheppende energie — de wil om iets in gang te zetten dat er nog niet was.",
    positief: "Doortastend, moedig, origineel, zelfstandig. Iemand met een 1 begint waar anderen wachten. Natuurlijke leider die liever de eerste stap zet dan in een rij staat.",
    schaduw: "Drammerig, eenzelvig, afgesneden van anderen. Kan moeite hebben met samenwerken of advies aannemen. Risico op egocentrisme.",
    werk: "Bloeit in zelfstandige rollen — ondernemer, founder, freelancer, regisseur. Heeft eigen ruimte nodig om koers te bepalen.",
    relaties: "Heeft een partner nodig die de ruimte respecteert en niet competitief is. Botst met andere 1's tenzij beiden eigen domein hebben.",
    spiritueleLes: "De les: leren dat ware kracht niet bestaat in alleen-staan, maar in moedig vooroplopen terwijl je verbonden blijft met anderen.",
    ontwikkelpunten: "Leren om hulp te accepteren zonder zwakte te voelen; leren wachten en luisteren.",
  },
  {
    getal: 2,
    archetype: "De Diplomaat",
    sleutelwoorden: ["samenwerking", "sensitiviteit", "balans", "harmonie"],
    energie: "Verbindende, ontvankelijke energie — de wil om bruggen te bouwen en spanning te verzachten.",
    positief: "Diplomatiek, empathisch, geduldig, intuïtief. Voelt feilloos sferen aan en weet wat een groep nodig heeft. Onmisbaar als bemiddelaar.",
    schaduw: "Conflict-vermijdend, te aanpassend, verliest zichzelf in de ander. Kan passief-agressief worden als eigen behoeften te lang worden onderdrukt.",
    werk: "Bloeit in teams, ondersteunende rollen, advies, therapie, HR. Niet de voorganger maar de onmisbare verbinder.",
    relaties: "Diep loyaal, zorgzaam. Risico: zichzelf wegcijferen voor de relatie. Gedijt bij een partner die emotionele ruimte teruggeeft.",
    spiritueleLes: "De les: leren dat zachtheid en kracht samen kunnen gaan; leren grenzen stellen zonder de verbinding te verbreken.",
    ontwikkelpunten: "Leren eigen behoeften te benoemen; leren dat 'nee' ook liefdevol kan zijn.",
  },
  {
    getal: 3,
    archetype: "De Communicator",
    sleutelwoorden: ["creativiteit", "expressie", "vreugde", "communicatie"],
    energie: "Naar buiten stromende, kleurrijke energie — de wil om iets innerlijks zichtbaar te maken in de wereld.",
    positief: "Creatief, charmant, optimistisch, taalvaardig. Brengt licht binnen waar het zwaar was. Werkt het beste als de creatieve flow vrij mag stromen.",
    schaduw: "Oppervlakkig, verstrooid, vluchtig. Kan beginnen zonder af te maken, of energie versnipperen over te veel projecten.",
    werk: "Bloeit in creatieve beroepen — schrijver, performer, ontwerper, leraar, marketeer. Heeft variatie en sociale interactie nodig.",
    relaties: "Speels, communicatief. Heeft een partner nodig die de creatieve uitingen ruimte geeft en niet probeert in te kaderen.",
    spiritueleLes: "De les: leren dat diepte óók in vreugde leeft; leren commitment toevoegen aan creativiteit zodat het iets oplevert dat blijvend is.",
    ontwikkelpunten: "Leren keuzes maken en doorzetten; leren dat focus expressie niet onderdrukt maar versterkt.",
  },
  {
    getal: 4,
    archetype: "De Bouwer",
    sleutelwoorden: ["stabiliteit", "structuur", "hard werken", "fundament"],
    energie: "Gegronde, methodische energie — de wil om dat wat blijvend is op te bouwen, steen voor steen.",
    positief: "Betrouwbaar, gedisciplineerd, praktisch, eerlijk. Maakt af waar anderen aan beginnen. Onmisbaar voor lange-termijn projecten.",
    schaduw: "Rigide, koppig, vasthoudend aan controle. Kan moeite hebben met verandering, spontaniteit of het loslaten van een plan dat niet meer werkt.",
    werk: "Bloeit in operationele, technische of organisatorische rollen — bouw, administratie, project management, ingenieurswerk.",
    relaties: "Trouw, betrouwbaar, een rots. Heeft een partner nodig die structuur waardeert maar ook af en toe lichtheid binnenbrengt.",
    spiritueleLes: "De les: leren dat niet alle waarheid in cijfers en feiten zit; leren vertrouwen op stroom en mysterie.",
    ontwikkelpunten: "Leren flexibel zijn zonder fundament te verliezen; leren dat regels middelen zijn, geen doelen.",
  },
  {
    getal: 5,
    archetype: "De Avonturier",
    sleutelwoorden: ["vrijheid", "verandering", "zintuigen", "veelzijdigheid"],
    energie: "Bewegende, ontdekkende energie — de wil om buiten de vertrouwde kaders te treden en het nieuwe te ervaren.",
    positief: "Veelzijdig, nieuwsgierig, sociaal, levendig. Komt overal door en kan zich aan elke situatie aanpassen.",
    schaduw: "Rusteloos, ongeduldig, hedonistisch. Risico op vluchten voor zwaarte, verslaving, of niets afmaken omdat het volgende avontuur lonkt.",
    werk: "Bloeit in dynamische rollen — sales, journalistiek, reizen, evenementen, alles met variatie. Verstikt in vaste routines.",
    relaties: "Wervelend, spannend, niet bezitterig. Heeft een partner nodig die zelf ook ademruimte zoekt en niet bezitterig wordt.",
    spiritueleLes: "De les: leren dat ware vrijheid van binnen komt, niet uit constante verandering buiten; leren stil te zitten en de diepte te ontdekken.",
    ontwikkelpunten: "Leren engagement aangaan zonder zich opgesloten te voelen; leren dat sommige beperkingen kracht geven.",
  },
  {
    getal: 6,
    archetype: "De Zorgdrager",
    sleutelwoorden: ["verantwoordelijkheid", "zorg", "harmonie", "familie"],
    energie: "Omarmende, dragende energie — de wil om voor het geheel te zorgen en harmonie te brengen.",
    positief: "Zorgzaam, verantwoordelijk, harmonieus, betrokken. Het natuurlijke zwaartepunt van een familie of gemeenschap.",
    schaduw: "Bemoeizuchtig, controlerend, perfectionistisch. Kan eigen leven uitstellen 'omdat anderen jou nodig hebben'. Co-afhankelijkheid loert.",
    werk: "Bloeit in zorg, onderwijs, ouderschap, advies, gemeenschapsrollen. Geeft betekenis aan wat 'gewoon werk' lijkt.",
    relaties: "Diep verbonden, dragend voor de hele familie. Risico: alle zorg geven en niets terug vragen, tot leegte ontstaat.",
    spiritueleLes: "De les: leren dat zorgen voor jezelf geen egoïsme is maar voorwaarde voor zorgen voor anderen; leren ontvangen.",
    ontwikkelpunten: "Leren delegeren; leren dat liefde óók grenzen kan stellen.",
  },
  {
    getal: 7,
    archetype: "De Zoeker",
    sleutelwoorden: ["spiritualiteit", "analyse", "mystiek", "introspectie"],
    energie: "Naar binnen gerichte, onderzoekende energie — de wil om voorbij de oppervlakte te kijken en de waarheid achter de schijn te vinden.",
    positief: "Diepzinnig, intuïtief, analytisch, wijs. Combineert vaak rationaliteit met mystieke gevoeligheid. Geweldige adviseurs en denkers.",
    schaduw: "Eenzelvig, cynisch, afstandelijk. Kan zich isoleren of zo kritisch worden dat verbinding moeilijk wordt.",
    werk: "Bloeit in onderzoek, analyse, therapie, spirituele begeleiding, wetenschap, filosofie. Heeft stilte en alleen-tijd nodig.",
    relaties: "Selectief, diepgaand. Niet snel intieme connecties, maar als de connectie er is, blijvend. Heeft een partner nodig die alleen-tijd respecteert.",
    spiritueleLes: "De les: leren dat verbinding net zo waardevol is als alleen-zijn; leren dat het hart óók weet wat het hoofd niet kan beredeneren.",
    ontwikkelpunten: "Leren openstellen; leren dat kwetsbaarheid geen zwakte is maar de basis voor diepe intimiteit.",
  },
  {
    getal: 8,
    archetype: "De Manifestant",
    sleutelwoorden: ["manifestatie", "macht", "materieel succes", "autoriteit"],
    energie: "Krachtige, structurerende energie — de wil om in de materiële wereld iets blijvends neer te zetten.",
    positief: "Daadkrachtig, ambitieus, organisatorisch sterk, financieel bewust. Brengt visie en uitvoering bij elkaar.",
    schaduw: "Machtshongerig, controlezuchtig, materialistisch. Risico: succes meten alleen in geld of status, en het innerlijke leven verwaarlozen.",
    werk: "Bloeit in leidinggevende rollen — directie, ondernemerschap, financiën, vastgoed, grote projecten. Wil verantwoordelijkheid en resultaat zien.",
    relaties: "Beschermend, voorzienend, sterk. Risico: relatie ondergeschikt maken aan ambitie. Heeft een partner nodig die zelfstandig is.",
    spiritueleLes: "De les: leren dat ware macht dienend is, niet overheersend; leren dat innerlijke rijkdom belangrijker is dan uiterlijk succes.",
    ontwikkelpunten: "Leren overgave; leren dat niet alles te managen of te plannen valt.",
  },
  {
    getal: 9,
    archetype: "De Oude Ziel",
    sleutelwoorden: ["voltooiing", "universele liefde", "humaniteit", "afronding"],
    energie: "Omvattende, afrondende energie — de wijsheid van wie de cyclus heeft gemaakt en bereid is los te laten.",
    positief: "Mededogend, ruimdenkend, idealistisch, dienend. Voelt zich verbonden met grote thema's — mensheid, kunst, geestelijke groei.",
    schaduw: "Wereldvreemd, melancholisch, niet kunnen loslaten van oud verdriet. Risico: het eigen geluk wegcijferen voor het 'grotere geheel'.",
    werk: "Bloeit in humanitaire, kunstzinnige of spirituele rollen — NGO's, kunst, onderwijs, healing, advies.",
    relaties: "Diep, mededogend, allesomvattend. Risico: zo idealistisch dat geen werkelijke partner aan het beeld voldoet.",
    spiritueleLes: "De les: leren dat afronden ruimte maakt voor nieuw; leren dat dienen niet hetzelfde is als zichzelf wegcijferen.",
    ontwikkelpunten: "Leren loslaten van het oude; leren dat je eigen geluk geen verraad is aan de mensheid.",
  },
  {
    getal: "11",
    archetype: "De Visionair",
    sleutelwoorden: ["intuïtie", "inspiratie", "spiritueel inzicht", "boodschapper"],
    energie: "Hoge, vibrerende energie — de combinatie van twee 1's: dubbele scheppingskracht, gekanaliseerd door spirituele gevoeligheid.",
    positief: "Hoogsensitief, visionair, inspirerend, mediamiek. Brengt boodschappen, inzichten en originele ideeën die anderen niet zien.",
    schaduw: "Overprikkeld, angstig, faalangst. Het meestergetal is een opdracht — als de drager er niet aan kan voldoen, kan het zwaar drukken.",
    werk: "Bloeit in inspirerende rollen — spiritueel leraar, coach, kunstenaar, boodschapper. Heeft praktische steun nodig om visie te aarden.",
    relaties: "Intens, sensitief, diepgaand. Heeft een partner nodig die emotioneel volwassen is en met de hooggevoeligheid kan omgaan.",
    spiritueleLes: "De les: leren de visie te aarden zonder hem te verraden; leren dat hooggevoeligheid een verantwoordelijkheid is, geen ziekte.",
    ontwikkelpunten: "Leren omgaan met overweldigende prikkels; zelfzorg (rust, natuur, meditatie) is onmisbaar.",
    isMeestergetal: true,
  },
  {
    getal: "22",
    archetype: "De Meester-Bouwer",
    sleutelwoorden: ["praktische manifestatie", "doelgericht idealisme", "blijvende structuren", "grote schaal"],
    energie: "Zeer krachtige, manifesterende energie — dubbele samenwerking + dubbele intuïtie, omgezet in concrete bouwwerken die generaties overstijgen.",
    positief: "Visionair én praktisch. Kan grote ideeën omzetten in werkelijkheid — instituten, bewegingen, gebouwen, systemen die de wereld dienen.",
    schaduw: "Verlammend perfectionisme, gevoel niet te kunnen voldoen aan de eigen droom. Risico: afhaken en terugvallen op 'gewone' 4.",
    werk: "Bloeit in grote, langlopende, betekenisvolle projecten — architectuur, sociale innovatie, leiderschap van bewegingen.",
    relaties: "Vraagt veel toewijding van de partner. Heeft iemand nodig die de missie deelt of er niet door bedreigd voelt.",
    spiritueleLes: "De les: leren dat de gave manifesteren een opdracht is — niet kiezen voor het kleine als het grote roept.",
    ontwikkelpunten: "Leren stappen nemen ondanks faalangst; onvolmaaktheid in uitvoering is beter dan perfecte onuitvoerbaarheid.",
    isMeestergetal: true,
  },
];

export interface BerekingLes {
  nummer: number;
  naam: string;
  kort: string;
  watIsHet: string;        // het concept uitgelegd
  watVerteltHet: string;   // wat onthult dit over de persoon — in de praktijk
  inGesprek: string;       // hoe gebruik je dit in een sessie met een klant
  input: string;
  stappen: string[];
  voorbeeld: string;
  meestergetal?: string;
  verschil: string;
}

export const BEREKENING_LESSEN: BerekingLes[] = [
  {
    nummer: 1,
    naam: "Bestuursgetal",
    kort: "Hoe je jezelf dagelijks aanstuurt",
    watIsHet: "Het Bestuursgetal beschrijft jouw dagelijkse aanpak — de manier waarop jij je leven automatisch 'bestuurt'. Denk aan de auto-piloot die aan staat als je niet bewust nadenkt. Het is je standaard handelingsmodus: hoe je reageert, hoe je beginnen aanpakt, hoe je door de dag navigeert.",
    watVerteltHet: "Als adviseur zie je hierin: hoe iemand in actie komt, welke energie hij of zij instinctief toepast in alledaagse situaties, en waar de weerstand zit als die stijl geblokkeerd wordt. Het Bestuursgetal is zichtbaar in kleine dingen: hoe iemand een vergadering ingaat, hoe iemand omgaat met onverwachte wijzigingen, hoe iemand communiceert als hij niet nadenkt.",
    inGesprek: "Gebruik dit getal om te benoemen 'hoe iemand werkt' — niet wie hij is (dat is het Kerngetal) maar hoe hij dagelijks functioneert. Stel de vraag: 'Herken je dat je in je dagelijkse leven zo te werk gaat?' Dat opent het gesprek.",
    input: "Alleen de geboortedag",
    stappen: [
      "Pak alleen de dag (bv. 14)",
      "Tel de cijfers op: 1 + 4 = 5",
      "Als uitkomst 11 of 22 is → laat staan",
      "Als uitkomst > 9 en geen 11/22 → blijf optellen tot 1-9",
    ],
    voorbeeld: "Dag 14 → 1+4 = 5 → Bestuursgetal = 5",
    meestergetal: "Dag 29 → 2+9 = 11 → Bestuursgetal = 11 (meestergetal blijft)",
    verschil: "Anders dan het Levenspad (groot levensthema) of het Zielengetal (innerlijke wens) — het Bestuursgetal gaat over de praktische dag-aanpak.",
  },
  {
    nummer: 2,
    naam: "Levenspad",
    kort: "Hoofdles van je leven, je rode draad",
    watIsHet: "Het Levenspad is het belangrijkste getal in numerologie. Het beschrijft het overkoepelende thema dat door iemands hele leven loopt — de rode draad. Het is niet wat iemand al kan, maar het thema waarmee hij of zij steeds opnieuw wordt geconfronteerd, in alle levensfasen.",
    watVerteltHet: "Als adviseur zie je hierin het 'grote verhaal' van iemands leven. Het Levenspad verandert nooit — dit getal blijft het hele leven hetzelfde. Het toont in welke richting de persoon groeit, welke lessen steeds terugkomen, en wat de onderliggende opdracht is. Klanten herkennen dit getal vaak diep — 'ja, dit loopt inderdaad als een draad door mijn leven.'",
    inGesprek: "Begin hier. Het Levenspad geeft de context voor alle andere getallen. Introduceer het als: 'Dit is jouw levenslange thema — niet wat je al bent, maar waarheen je leven je steeds weer trekt.' Vraag dan: 'Op welke manier herken je dit in je leven tot nu toe?'",
    input: "Dag + maand + jaar afzonderlijk gereduceerd, dan opgeteld",
    stappen: [
      "Reduceer de dag (bv. 14 → 1+4 = 5)",
      "Reduceer de maand (bv. 7 → 7; of 12 → 1+2 = 3)",
      "Reduceer het jaar (bv. 1979 → 1+9+7+9 = 26 → 2+6 = 8)",
      "Tel de 3 op (bv. 5+7+8 = 20)",
      "Reduceer eindresultaat (20 → 2+0 = 2)",
    ],
    voorbeeld: "14-07-1979 → dag(5) + maand(7) + jaar(8) = 20 → 2+0 = 2",
    meestergetal: "Uitkomst op 11 of 22 → meestergetal — laat staan",
    verschil: "Het Bestuursgetal vertelt over de dagelijkse modus; het Levenspad over het overkoepelende levensthema dat door alles heen loopt.",
  },
  {
    nummer: 3,
    naam: "Levensles",
    kort: "Wat je in dit leven moet leren",
    watIsHet: "De Levensles toont het specifieke leergebied dat centraal staat in dit leven. Het gaat niet om wat iemand al goed kan, maar om wat hem of haar wordt aangeboden als groeigebied. Het is de les die het leven steeds opnieuw aanbiedt — in relaties, werk, uitdagingen. Niet als straf, maar als uitnodiging.",
    watVerteltHet: "Als adviseur zie je hierin: waar iemand weerstand ervaart (omdat het nog niet geleerd is), waar de groeipijn zit, en ook: welk potentieel er sluimert als die les wordt geïntegreerd. De Levensles is vaak iets dat iemand juist lastig vindt — 'dat is precies waar ik altijd mee worstel.' Dat is precies het punt.",
    inGesprek: "Introduceer dit als: 'Dit is wat het leven jou in dit leven te leren heeft — het is niet wat je al bent, maar wat er wacht als je dit omarmt.' Vraag: 'Op welke manier voel je dat dit thema steeds terugkomt in je leven?' Klanten hebben hier vaak een verhaal bij.",
    input: "Alleen de geboortemaand",
    stappen: [
      "Pak het maandnummer (1-12)",
      "Reduceer als nodig: maand 10 → 1+0 = 1; maand 11 → blijft 11; maand 12 → 1+2 = 3",
    ],
    voorbeeld: "Maand 7 → Levensles = 7",
    meestergetal: "Maand 11 → blijft 11 (meestergetal). November-geborenen krijgen automatisch meestergetal 11 als Levensles.",
    verschil: "Het Levenspad is wat je leven 'is'; de Levensles is wat je leven je probeert te léren.",
  },
  {
    nummer: 4,
    naam: "Zielengetal",
    kort: "Diepste innerlijke wens",
    watIsHet: "Het Zielengetal onthult wat iemand diep van binnen verlangt — onafhankelijk van wat hij naar buiten laat zien. Het is het verlangen van de ziel, niet van het verstand. Wat iemand 's avonds als hij alleen is echt voelt, waar hij naar uitziet, wat hem echt voedt — dat zit hier in.",
    watVerteltHet: "Als adviseur zie je hierin de innerlijke motivatie die iemand soms zelf niet goed kan verwoorden. Het Zielengetal is de stille stem achter de keuzes. Als iemand keuzes maakt die 'logisch' lijken maar hem niet voldoen, botst het Zielengetal met de buitenkant. Dit getal helpt verklaren waarom iemand ergens leeg van raakt.",
    inGesprek: "Introduceer dit als: 'Dit is wat jouw ziel van binnen echt wil — soms zegt het iets anders dan wat je rationeel zou kiezen.' Vraag: 'Herken je dit als een diep verlangen in jezelf? Iets wat er altijd al is?' Let op non-verbale reactie — dit raakt mensen often diep.",
    input: "Alleen de geboortedag (zelfde als Bestuursgetal — andere duiding)",
    stappen: [
      "Pak de dag (bv. 14)",
      "Tel de cijfers op (1+4 = 5)",
      "Meestergetal-check: 11 en 22 blijven staan",
    ],
    voorbeeld: "Dag 14 → 1+4 = 5 → Zielengetal = 5",
    meestergetal: "Dag 22 → blijft 22. Dag 29 → 2+9 = 11",
    verschil: "Bestuursgetal = hoe je doet. Zielengetal = wat je vanbinnen wilt. Numeriek gelijk, conceptueel anders: actie vs verlangen.",
  },
  {
    nummer: 5,
    naam: "Geschenkgetal",
    kort: "Talent dat je hebt meegekregen",
    watIsHet: "Het Geschenkgetal toont het aangeboren talent — iets wat iemand cadeau heeft gekregen bij geboorte, zonder dat er hard voor gewerkt hoeft te worden. Het is de energie die er gewoon 'is', de kwaliteit die anderen vaak eerder opmerken dan de persoon zelf. Een geschenk dat zo vanzelfsprekend is dat het haast onzichtbaar is.",
    watVerteltHet: "Als adviseur zie je hierin: wat iemand moeiteloos kan, wat hij als 'gewoon' beschouwt terwijl anderen het bijzonder vinden. Klanten zeggen hier vaak: 'Maar dat kan toch iedereen?' Nee — dat is precies het geschenk. Het helpt ook zelfvertrouwen opbouwen: 'Je hebt al wat je nodig hebt.'",
    inGesprek: "Introduceer dit als: 'Dit is een talent dat je al bij geboorte meekreeg — iets dat je makkelijk afgaat.' Vraag: 'Wat vinden anderen in jou bijzonder wat jij zelf gewoon vindt?' Dat antwoord van de klant bevestigt vaak precies dit getal.",
    input: "Alleen de laatste 2 cijfers van het geboortejaar",
    stappen: [
      "Pak laatste 2 cijfers van jaar (bv. 1979 → 79)",
      "Tel op (7+9 = 16)",
      "Reduceer (16 → 1+6 = 7)",
      "11/22 check: laat staan",
    ],
    voorbeeld: "1979 → 79 → 7+9 = 16 → 1+6 = 7 → Geschenkgetal = 7",
    meestergetal: "1992 → 92 → 9+2 = 11 → blijft 11 (meestergetal)",
    verschil: "Een talent (Geschenk) is iets dat van nature aanwezig is. Het Verledengetal gaat over de hele bagage; het Geschenk is het positieve cadeau.",
  },
  {
    nummer: 6,
    naam: "Verledengetal",
    kort: "Bagage uit vorige levens / familie-erfenis",
    watIsHet: "Het Verledengetal toont wat iemand meebrengt vanuit het verleden — de karmische bagage, de familielijn, patronen die al vóór de geboorte aanwezig waren. Denk aan ingesleten reacties die 'van huis uit' komen, of aan thema's die door de familie lopen. Het is het startpunt, niet het eindpunt.",
    watVerteltHet: "Als adviseur zie je hierin: waar iemand automatisch in terugvalt als het moeilijk wordt, welke oude patronen steeds opduiken, en ook welke krachten er vanuit de familielijn meekomen. Het Verledengetal is neutraal — het is bagage, geen veroordeling. Maar het helpt begrijpen waarom bepaalde patronen zo hardnekkig zijn.",
    inGesprek: "Introduceer dit als: 'Dit is wat je meebrengt uit je verleden — misschien heb je dit patroon ook in je familie gezien.' Vraag: 'Herken je dit als iets dat van huis uit is meegegeven — in je opvoeding of familie?' Dit opent diepgaande gesprekken.",
    input: "Alle 4 cijfers van het geboortejaar opgeteld",
    stappen: [
      "Tel alle 4 jaar-cijfers op (bv. 1979 → 1+9+7+9 = 26)",
      "Reduceer (26 → 2+6 = 8)",
      "11/22-check",
    ],
    voorbeeld: "1979 → 1+9+7+9 = 26 → 2+6 = 8 → Verledengetal = 8",
    meestergetal: "1939 → 1+9+3+9 = 22 → blijft 22 (meestergetal)",
    verschil: "Het Geschenk is wat van die bagage een talent werd; het Verleden is het volledige pakket aan invloeden.",
  },
  {
    nummer: 7,
    naam: "Fundamentengetal",
    kort: "Basis waarop je staat",
    watIsHet: "Het Fundamentengetal toont de basis waarop iemands leven rust — de onderliggende grond die alles draagt. Het is het resultaat van wat iemand vanbinnen wil (Ziel) gecombineerd met wat hij moet leren (Levensles). Dat samensmelten vormt het fundament: de diepste basis van waaruit hij leeft en handelt.",
    watVerteltHet: "Als adviseur zie je hierin: wat iemand nodig heeft om stabiel te blijven, wat zijn basisbehoeften zijn, en wat er misloopt als dat fundament aangetast wordt. Wanneer iemand functioneert vanuit zijn Fundamentengetal, is er rust. Wanneer hij er tegenin leeft, is er innerlijke spanning zonder dat hij kan zeggen waarom.",
    inGesprek: "Introduceer dit als: 'Dit is de grond waarop jij staat — wat je nodig hebt om je stabiel en thuis te voelen.' Vraag: 'Wanneer voel jij je echt op je best? In welke omstandigheden kom je het meest tot je recht?' Het antwoord raakt bijna altijd dit getal.",
    input: "Zielengetal + Levensles",
    stappen: [
      "Bereken eerst Zielengetal (les 4)",
      "Bereken eerst Levensles (les 3)",
      "Tel ze op",
      "Reduceer",
    ],
    voorbeeld: "Zielengetal 5 + Levensles 7 = 12 → 1+2 = 3 → Fundamentengetal = 3",
    meestergetal: "Als optelling 11 of 22 oplevert → meestergetal behouden",
    verschil: "Afgeleid getal — het thema dat ontstaat als je innerlijke wens (Ziel) en leeropdracht (Levensles) samensmelten.",
  },
  {
    nummer: 8,
    naam: "Projectiegetal",
    kort: "Hoe je naar buiten komt",
    watIsHet: "Het Projectiegetal beschrijft hoe iemand zichzelf naar buiten brengt — welke indruk hij bij anderen maakt, welke energie hij uitstraalt vóórdat mensen hem echt kennen. Het is de combinatie van zijn aangeboren talent (Geschenk) en zijn innerlijke wens (Ziel). Samen bepalen die hoe hij zichzelf 'lanceert' in de wereld.",
    watVerteltHet: "Als adviseur zie je hierin: hoe iemand overkomt op anderen — soms anders dan hij zichzelf beleeft. Het kan ook spanning verklaren: iemand die zichzelf als introvert ervaart maar naar buiten sterk en daadkrachtig overkomt. Of omgekeerd. Het Projectiegetal is wat anderen als eerste zien en voelen.",
    inGesprek: "Introduceer dit als: 'Dit is hoe anderen jou ervaren — je uitstraling.' Vraag: 'Wat zeggen mensen die je voor het eerst ontmoeten vaak over je? Welke eerste indruk maak je?' Dat spiegelt bijna altijd het Projectiegetal.",
    input: "Geschenkgetal + Zielengetal",
    stappen: [
      "Bereken Geschenkgetal (les 5)",
      "Bereken Zielengetal (les 4)",
      "Tel op",
      "Reduceer",
    ],
    voorbeeld: "Geschenk 7 + Ziel 5 = 12 → 1+2 = 3 → Projectiegetal = 3",
    meestergetal: "Bij 11 of 22 → meestergetal behouden",
    verschil: "Afgeleid getal — toont de buitenkant die ontstaat uit jouw talent (Geschenk) + innerlijke wens (Ziel).",
  },
  {
    nummer: 9,
    naam: "Kerngetal",
    kort: "Je essentie — wie je écht bent",
    watIsHet: "Het Kerngetal onthult de diepste essentie van een persoon — wie hij is als alles is afgepeld. Geen rollen, geen maskers, geen verwachtingen. Het is de combinatie van waar iemand vandaan komt (Verleden) en wat hij moet leren (Levensles). Samen vormen die de kern: de meest authentieke versie van die persoon.",
    watVerteltHet: "Als adviseur zie je hierin: wie iemand echt is, los van hoe hij zichzelf presenteert of wat anderen van hem verwachten. Het Kerngetal verschilt soms sterk van het Bestuursgetal (hoe hij doet) of het Projectiegetal (hoe anderen hem zien). Die spanning tussen Kern en buitenkant is een vruchtbaar gesprekspunt.",
    inGesprek: "Introduceer dit als: 'Dit is wie je bent in je diepste kern — als alle lagen eraf zijn.' Vraag: 'Wie ben jij als niemand kijkt? Wat is het meest authentieke van jezelf?' Dit raakt mensen soms onverwacht diep.",
    input: "Verledengetal + Levensles",
    stappen: [
      "Bereken Verledengetal (les 6)",
      "Bereken Levensles (les 3)",
      "Tel op",
      "Reduceer",
    ],
    voorbeeld: "Verleden 8 + Levensles 7 = 15 → 1+5 = 6 → Kerngetal = 6",
    meestergetal: "Bij 11 of 22 → meestergetal behouden",
    verschil: "Verschilt van Zielengetal (verlangen) en Levenspad (thema/route). Kern = wie je in essentie bent als alles is afgepeld.",
  },
  {
    nummer: 10,
    naam: "Doelgetal",
    kort: "Je levensdoel",
    watIsHet: "Het Doelgetal beschrijft de uiteindelijke bestemming van iemands leven — niet de weg (dat is het Levenspad) maar het eindpunt waar de weg naartoe leidt. Het is de richting waarin alles samenkomt. Sommige mensen raken hun Doelgetal pas op latere leeftijd — het is iets waarnaar toe wordt gegroeid.",
    watVerteltHet: "Als adviseur zie je hierin: de richting van iemands levensvervulling. Het Doelgetal is niet wat iemand nu al is, maar wat hij wil worden of wil bijdragen aan het einde van de rit. Het geeft antwoord op de vraag 'Waarvoor ben ik hier?' — niet als taak maar als richting.",
    inGesprek: "Introduceer dit als: 'Dit is je levensdoel — niet wat je moet presteren, maar de richting waarnaar je leven wil bewegen.' Vraag: 'Als je terugkijkt aan het einde van je leven, wat zou je dan willen dat je hebt bijgedragen of bereikt?' Dat antwoord raakt bijna altijd dit getal.",
    input: "Maand + dag + het volledige jaar opgeteld als rauwe getallen",
    stappen: [
      "Pak de getallen ongereduceerd (bv. maand 7, dag 14, jaar 1979)",
      "Tel ze op: 7 + 14 + 1979 = 2000",
      "Reduceer eindresultaat (2000 → 2+0+0+0 = 2)",
      "11/22-check",
    ],
    voorbeeld: "7 + 14 + 1979 = 2000 → 2+0+0+0 = 2 → Doelgetal = 2",
    meestergetal: "Als getallen een 11 of 22 als tussenstap vormen → meestergetal-regel toepassen",
    verschil: "Levenspad = de weg die je bewandelt; Doelgetal = waar de weg eindigt (de bestemming).",
  },
];

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number; // index van juist antwoord
  uitleg: string;
}

export const QUIZ_VRAGEN: QuizVraag[] = [
  {
    vraag: "Welke getallen blijven volgens de reductie-regel altijd intact (worden niet verder gereduceerd tot 1-9)?",
    opties: ["13 en 19", "11 en 22", "11 en 33", "22 en 33"],
    juist: 1,
    uitleg: "11 en 22 zijn de twee meestergetallen die niet verder worden gereduceerd.",
  },
  {
    vraag: "Wat is het verschil tussen Bestuursgetal en Zielengetal?",
    opties: [
      "Andere formule, ander cijfer",
      "Zelfde formule, andere duiding",
      "Bestuursgetal gebruikt maand, Zielengetal gebruikt dag",
      "Geen verschil — synoniemen",
    ],
    juist: 1,
    uitleg: "Beide worden berekend door de dag te reduceren. Het Bestuursgetal = hoe je handelt; het Zielengetal = wat je vanbinnen wilt.",
  },
  {
    vraag: "Welk getal wordt berekend uit alleen de laatste 2 cijfers van het geboortejaar?",
    opties: ["Verledengetal", "Doelgetal", "Geschenkgetal", "Kerngetal"],
    juist: 2,
    uitleg: "Het Geschenkgetal = laatste 2 cijfers van jaar opgeteld en gereduceerd. Het Verledengetal gebruikt alle 4 cijfers van het jaar.",
  },
  {
    vraag: "Welke twee getallen worden opgeteld om het Kerngetal te krijgen?",
    opties: ["Geschenk + Ziel", "Verleden + Levensles", "Ziel + Levensles", "Maand + Dag"],
    juist: 1,
    uitleg: "Kerngetal = Verledengetal + Levensles. (Fundamentengetal = Ziel + Levensles; Projectiegetal = Geschenk + Ziel)",
  },
  {
    vraag: "Welk getal beschrijft 'wat je in dit leven moet leren'?",
    opties: ["Levenspad", "Kerngetal", "Levensles", "Doelgetal"],
    juist: 2,
    uitleg: "Levensles = wat je moet leren. Levenspad = de rode draad van je leven. Doelgetal = je bestemming. Kerngetal = wie je in essentie bent.",
  },
  {
    vraag: "Welk archetype hoort bij getal 7?",
    opties: ["De Pionier", "De Zorgdrager", "De Zoeker", "De Communicator"],
    juist: 2,
    uitleg: "Getal 7 = De Zoeker — diepzinnig, analytisch, spiritueel. Getal 1 = Pionier, 6 = Zorgdrager, 3 = Communicator.",
  },
  {
    vraag: "Een klant heeft Levenspad 11. Wat is NIET correct?",
    opties: [
      "Het is een meestergetal",
      "Kan zwaar voelen als 'opdracht' niet gedragen wordt",
      "Reduceert automatisch naar 2 in de duiding",
      "Vraagt om aarding van visie",
    ],
    juist: 2,
    uitleg: "Meestergetallen reduceren NIET automatisch. Bij overweldiging kan iemand functioneren op 2-niveau, maar het potentieel blijft 11.",
  },
  {
    vraag: "Wat is de berekening van het Doelgetal?",
    opties: [
      "Maand + dag + heel jaar opgeteld als rauwe getallen",
      "Maand × dag × jaar",
      "Levenspad + Kerngetal",
      "Som van alle 10 getallen",
    ],
    juist: 0,
    uitleg: "Doelgetal = maand + dag + het volledige jaar (ongereduceerd) opgeteld, dan pas reduceren. Bv: 7 + 14 + 1979 = 2000 → 2.",
  },
  {
    vraag: "Geboortejaar 1939 — wat is het Verledengetal?",
    opties: ["4", "7", "22", "8"],
    juist: 2,
    uitleg: "1+9+3+9 = 22 → meestergetal! Blijft 22.",
  },
  {
    vraag: "Welk getal beschrijft 'hoe je naar buiten komt' — de combinatie van talent en innerlijke wens?",
    opties: ["Fundamentengetal", "Projectiegetal", "Kerngetal", "Bestuursgetal"],
    juist: 1,
    uitleg: "Projectiegetal = Geschenkgetal + Zielengetal. Geschenk = talent, Ziel = innerlijke wens. Samen = hoe je jezelf naar buiten projecteert.",
  },
];

export const VOORBEELD_PERSOON = {
  naam: "Frans Bemelmans",
  datum: "14-07-1979",
  dag: 14,
  maand: 7,
  jaar: 1979,
  getallen: [
    { naam: "Bestuursgetal", getal: 5, berekening: "14 → 1+4 = 5", archetype: "De Avonturier" },
    { naam: "Levenspad", getal: 2, berekening: "dag(5) + maand(7) + jaar(8) = 20 → 2+0 = 2", archetype: "De Diplomaat" },
    { naam: "Levensles", getal: 7, berekening: "maand 7 → 7", archetype: "De Zoeker" },
    { naam: "Zielengetal", getal: 5, berekening: "14 → 1+4 = 5", archetype: "De Avonturier" },
    { naam: "Geschenkgetal", getal: 7, berekening: "79 → 7+9 = 16 → 1+6 = 7", archetype: "De Zoeker" },
    { naam: "Verledengetal", getal: 8, berekening: "1979 → 1+9+7+9 = 26 → 2+6 = 8", archetype: "De Manifestant" },
    { naam: "Fundamentengetal", getal: 3, berekening: "Ziel(5) + Levensles(7) = 12 → 1+2 = 3", archetype: "De Communicator" },
    { naam: "Projectiegetal", getal: 3, berekening: "Geschenk(7) + Ziel(5) = 12 → 1+2 = 3", archetype: "De Communicator" },
    { naam: "Kerngetal", getal: 6, berekening: "Verleden(8) + Levensles(7) = 15 → 1+5 = 6", archetype: "De Zorgdrager" },
    { naam: "Doelgetal", getal: 2, berekening: "7 + 14 + 1979 = 2000 → 2+0+0+0 = 2", archetype: "De Diplomaat" },
  ],
  patronen: [
    "Dubbele 5 (Bestuur + Ziel) — sterk gedreven door avontuur en vrijheid, zowel dagelijks als vanbinnen",
    "Dubbele 7 (Levensles + Geschenk) — grote spirituele/onderzoekende opdracht én een talent op dat gebied",
    "Dubbele 3 (Fundament + Projectie) — staat op creatieve basis en komt creatief naar buiten",
    "Dubbele 2 (Levenspad + Doel) — levensweg én bestemming gaan over verbinding en diplomatie",
  ],
  spanning: "Spanning tussen 5 (vrijheid) en 2 (samenwerking) — hoe blijf je in verbinding zonder vrijheid op te geven?",
};
