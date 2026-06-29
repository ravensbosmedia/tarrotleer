// Astrologische interpretaties — Nederlands
// Planeet in teken, huizen, aspecten

export const HUIZEN: Record<number, { naam: string; thema: string; beschrijving: string }> = {
  1:  { naam: "Huis van het Zelf",         thema: "Identiteit, uiterlijk, eerste indruk",    beschrijving: "Het eerste huis toont wie je bent aan de buitenwereld — jouw persoonlijkheid, lichaam en hoe anderen je als eerste zien. Het is het huis van nieuw begin en zelfexpressie." },
  2:  { naam: "Huis van Bezittingen",      thema: "Geld, waarden, materiële zekerheid",      beschrijving: "Het tweede huis gaat over wat je bezit en wat je waardeert. Niet alleen geld en spullen, maar ook je zelfwaarde en wat jou het gevoel van veiligheid geeft." },
  3:  { naam: "Huis van Communicatie",     thema: "Denken, spreken, korte reizen, broers/zussen", beschrijving: "Het derde huis regelt hoe je communiceert en denkt. Je dagelijkse contacten, schrijven, lezen, gesprekken en de relatie met broers en zussen vallen hieronder." },
  4:  { naam: "Huis van Thuis & Roots",    thema: "Familie, oorsprong, innerlijk fundament", beschrijving: "Het vierde huis is jouw privéwereld — je thuis, je familie, je roots. Het toont ook je innerlijke fundament: het gevoel van veiligheid dat je van binnenuit draagt." },
  5:  { naam: "Huis van Creativiteit",     thema: "Creativiteit, liefde, kinderen, plezier", beschrijving: "Het vijfde huis draait om zelfexpressie en plezier. Creativiteit, romantische liefde, spel, kinderen en alles wat je met passie doet vallen in dit zonnige huis." },
  6:  { naam: "Huis van Dagelijks Werk",   thema: "Gezondheid, routine, dienstverlening",    beschrijving: "Het zesde huis gaat over je dagelijkse ritme — werk, gezondheid, routines en hoe je anderen dient. Het toont hoe jij zorg draagt voor jezelf en je omgeving." },
  7:  { naam: "Huis van Partnerschap",     thema: "Relaties, huwelijk, samenwerking",        beschrijving: "Het zevende huis staat voor al je één-op-één relaties: romantisch, zakelijk of juridisch. Het spiegelt ook wat jij zoekt in anderen — en wat je soms bij jezelf mist." },
  8:  { naam: "Huis van Transformatie",    thema: "Dood, herboren worden, diepte, seksualiteit", beschrijving: "Het achtste huis is het huis van diepgaande verandering. Erfenissen, gedeelde middelen, seksualiteit, dood en wedergeboorte — alles wat je transformeert valt hieronder." },
  9:  { naam: "Huis van Wereldvisie",      thema: "Filosofie, religie, verre reizen, hogere kennis", beschrijving: "Het negende huis zoekt betekenis en waarheid. Filosofie, religie, hogere studies, verre reizen en je levensbeschouwing — dit huis stuwt je naar de horizon." },
  10: { naam: "Huis van Loopbaan",         thema: "Carrière, status, maatschappij, ambities", beschrijving: "Het tiende huis — de top van de horoscoop — toont je publieke leven, carrière en reputatie. Het is hoe de wereld jou ziet en wat je maatschappelijk wilt bereiken." },
  11: { naam: "Huis van Gemeenschap",      thema: "Vrienden, groepen, idealen, toekomst",    beschrijving: "Het elfde huis gaat over je plek in grotere gehelen — vrienden, sociale kringen, dromen voor de toekomst en idealen die je met anderen deelt." },
  12: { naam: "Huis van het Onderbewuste", thema: "Verborgen zaken, spiritualiteit, isolatie", beschrijving: "Het twaalfde huis is het meest mysterieuze — het huis van het onderbewuste, verborgen krachten, spirituele groei en wat je loslaat. Hier liggen je diepste angsten én je grootste wijsheid." },
};

export const ASPECT_TYPES: Record<string, { naam: string; hoek: number; energie: string; beschrijving: string; kleur: string }> = {
  conjunctie: { naam: "Conjunctie", hoek: 0,   energie: "Intensief",   beschrijving: "Twee planeten versmelten hun energieën. Zeer krachtig — de thema's van beide planeten werken samen of botsen.",              kleur: "#FFD700" },
  sextiel:    { naam: "Sextiel",    hoek: 60,  energie: "Harmonisch",  beschrijving: "Een stimulerend aspect — de planeten ondersteunen elkaar en creëren kansen die met bewuste inzet benut kunnen worden.",          kleur: "#70E070" },
  vierkant:   { naam: "Vierkant",   hoek: 90,  energie: "Gespannen",   beschrijving: "Een uitdagend aspect dat spanning en wrijving geeft, maar ook de krachtigste motor voor groei en verandering is.",               kleur: "#FF6B6B" },
  driehoek:   { naam: "Driehoek",   hoek: 120, energie: "Vloeiend",    beschrijving: "Het meest harmonische aspect — energieën stromen moeiteloos samen. Talent en gemak, maar pas op voor zelfgenoegzaamheid.",        kleur: "#70BFFF" },
  oppositie:  { naam: "Oppositie",  hoek: 180, energie: "Polariserend", beschrijving: "Twee planeten staan recht tegenover elkaar. Er is spanning en bewustwording nodig — de kunst is balans vinden tussen beide polen.", kleur: "#FF9966" },
  quincunx:   { naam: "Quincunx",   hoek: 150, energie: "Aanpassen",   beschrijving: "Een subtiel aspect dat vraagt om voortdurende aanpassing. De planeten spreken niet dezelfde taal maar moeten toch samenwerken.",    kleur: "#CC88FF" },
};

// Planeet basisbetekenissen
export const PLANEET_BETEKENIS: Record<string, { thema: string; sleutelwoorden: string[] }> = {
  Zon:        { thema: "Identiteit, ego, levensdoel, vitaliteit",        sleutelwoorden: ["ego","zelfexpressie","vitaliteit","doel","bewustzijn"] },
  Maan:       { thema: "Emoties, instinct, gewoonten, moeder",           sleutelwoorden: ["gevoel","intuïtie","gewoonten","veiligheid","moeder"] },
  Mercurius:  { thema: "Communicatie, denken, leren, reizen",            sleutelwoorden: ["communicatie","logica","taal","analyse","mobiliteit"] },
  Venus:      { thema: "Liefde, schoonheid, waarden, relaties",          sleutelwoorden: ["liefde","esthetiek","harmonie","aantrekking","genot"] },
  Mars:       { thema: "Actie, energie, drive, seksualiteit, woede",     sleutelwoorden: ["actie","moed","energie","drift","assertiviteit"] },
  Jupiter:    { thema: "Groei, geluk, filosofie, expansie, overvloed",   sleutelwoorden: ["groei","wijsheid","optimisme","expansie","kansen"] },
  Saturnus:   { thema: "Structuur, discipline, beperkingen, lessen",     sleutelwoorden: ["structuur","verantwoordelijkheid","geduld","lessen","volwassenheid"] },
  Uranus:     { thema: "Vernieuwing, vrijheid, rebellie, plotselinge verandering", sleutelwoorden: ["revolutie","originaliteit","vrijheid","plotseling","vernieuwing"] },
  Neptunus:   { thema: "Spiritualiteit, illusie, dromen, compassie",     sleutelwoorden: ["spiritueel","dromen","illusie","compassie","mystiek"] },
  Pluto:      { thema: "Transformatie, macht, vernietiging en wedergeboorte", sleutelwoorden: ["transformatie","macht","diepte","wedergeboorte","intensiteit"] },
};

// Zon in teken
const ZON: Record<string, string> = {
  Ram:         "Jij bent een pionier — vol energie, direct en moedig. Je hebt het nodig om voorop te lopen en dingen op jouw manier te doen. Je initiatief en zelfvertrouwen zijn grote krachten, maar leer ook geduld en anderen de ruimte te geven.",
  Stier:       "Jij bent stabiel, geduldig en sensueel. Je houdt van schoonheid, comfort en zekerheid. Je bent trouw en betrouwbaar, maar kunt koppig zijn als je je veiligheid bedreigd voelt. Leer loslaten — het leven vraagt soms flexibiliteit.",
  Tweelingen:  "Jij bent nieuwsgierig, veelzijdig en communicatief. Je hoofd werkt snel en je hebt van alles interesse. Je bent geestig en aanpasbaar, maar soms moeilijk te grijpen. Oefen je in diepgang en volharding.",
  Kreeft:      "Jij bent intens voelend, beschermend en intuïtief. Je thuis en familie zijn heilig voor jou. Je hebt een sterk empathisch vermogen, maar pas op dat je je niet te veel verliest in de gevoelens van anderen.",
  Leeuw:       "Jij bent creatief, hartelijk en geboren leider. Je hebt het podium nodig — niet uit ijdelheid, maar omdat je oprecht iets te geven hebt. Zorg dat je trots niet omslaat in arrogantie.",
  Maagd:       "Jij bent analytisch, nauwkeurig en dienstbaar. Je ziet details die anderen missen en wilt alles verbeteren. Je grootste valkuil is perfectionisme dat leidt tot zelfkritiek. Vertrouw meer op je eigen goedheid.",
  Weegschaal:  "Jij bent diplomatiek, rechtvaardig en esthetisch ingesteld. Relaties en harmonie zijn voor jou essentieel. Je bent uitstekend in het zien van beide kanten, maar dit kan ook besluiteloosheid opleveren.",
  Schorpioen:  "Jij bent intens, diepgaand en transformatief. Je ziet door oppervlakkigheid heen en zoekt naar de waarheid achter de dingen. Je passie is groot — zowel in liefde als in doorzettingsvermogen.",
  Boogschutter:"Jij bent avontuurlijk, optimistisch en vrijheidslievend. Je zoekt betekenis en waarheid — op reis, in filosofie of spiritualiteit. Je enthousiasme is aanstekelijk, maar bewaak ook je focus.",
  Steenbok:    "Jij bent ambitieus, gedisciplineerd en pragmatisch. Je hebt een natuurlijk gevoel voor structuur en lange termijn denken. Succes komt via geduld en volharding. Vergeet echter niet te genieten van de weg.",
  Waterman:    "Jij bent origineel, onafhankelijk en toekomstgericht. Je denkt buiten de kaders en streeft naar een betere wereld. Je hebt unieke ideeën, maar pas op dat je afstandelijkheid je niet isoleert van mensen.",
  Vissen:      "Jij bent intuïtief, empathisch en spiritueel. Je voelt de wereld dieper dan de meeste mensen en hebt een rijke innerlijke wereld. Stel grenzen zodat je medeleven je niet uitput.",
};

// Maan in teken
const MAAN: Record<string, string> = {
  Ram:         "Jouw emoties komen snel en direct. Je reageert instinctief en hebt behoefte aan onmiddellijke emotionele bevrediging. Je voelt je goed als je initiatief kunt nemen. Leer ook met trage emoties om te gaan.",
  Stier:       "Jij voelt je veilig bij rust, comfort en vertrouwde patronen. Emotionele zekerheid is voor jou essentieel. Verandering voelt bedreigend, maar loslaten geeft groei.",
  Tweelingen:  "Jouw gevoelens bewegen snel en zijn sterk verbonden met je gedachten. Je verwerkt emoties door erover te praten of te schrijven. Vertrouw ook op je gevoel zonder het direct te analyseren.",
  Kreeft:      "De Maan is hier thuis — jij voelt diep en intuitief. Je emotionele geheugen is sterk en je hebt een warm nest nodig. Pas op dat je je niet te veel afsluit uit zelfbescherming.",
  Leeuw:       "Jij wil emotional gezien en erkend worden. Waardering voelt als emotionele voeding. Je bent royaal met genegenheid, maar hebt ook bewondering nodig om je goed te voelen.",
  Maagd:       "Jij verwerkt gevoelens analytisch — je wilt begrijpen waarom je iets voelt. Je zorgt voor anderen door praktisch te helpen. Leer dat gevoelens niet altijd logisch zijn, en dat is oké.",
  Weegschaal:  "Jij hebt emotioneel behoefte aan harmonie en gelijkwaardigheid. Conflict maakt je van streek. Je zoekt balans in relaties maar vermijdt soms confrontaties die noodzakelijk zijn.",
  Schorpioen:  "Jouw emoties zijn diep, intens en soms verborgen. Je voelt alles vol kracht maar laat weinig zien. Vertrouwen is heilig voor jou — als het gebroken is, gaat het nooit meer vanzelf.",
  Boogschutter:"Jij hebt ruimte nodig om emotioneel te ademen. Beknelling in relaties voelt verstikkend. Je verwerkt gevoelens het best via beweging, natuur of filosofische gesprekken.",
  Steenbok:    "Jij houdt gevoelens onder controle. Je hebt geleerd sterk te zijn, maar dat heeft soms een prijs. Echte kwetsbaarheid tonen voelt moeilijk maar is de weg naar diepe verbinding.",
  Waterman:    "Jij benadert gevoelens op een zekere afstand — je begrijpt ze intellectueel, maar laten ze je overspoelen is moeilijker. Je hebt vrienden nodig die jou kennen zonder dat je alles hoeft uit te leggen.",
  Vissen:      "Jij bent als een spons voor emoties — van jezelf én van anderen. Je intuïtie is sterk, je empathie grenzeloos. Leer onderscheid maken tussen eigen gevoelens en die je van anderen opneemt.",
};

// Ascendant in teken
const ASCENDANT: Record<string, string> = {
  Ram:         "Je komt op anderen over als direct, energiek en daadkrachtig. Mensen zien jou als iemand die actie onderneemt. Je hebt een magnetisch, zelfverzekerd voorkomen — soms urgenter dan je innerlijk bent.",
  Stier:       "Je uitstraling is rustig, betrouwbaar en aards. Mensen voelen zich op hun gemak bij jou. Je oogt stabiel en geduldig. Schoonheid en kwaliteit zijn zichtbaar in hoe je jezelf presenteert.",
  Tweelingen:  "Je komt over als levendig, geestig en veelzijdig. Je geeft een gevoel van beweeglijkheid en communicatief gemak. Mensen zien jou als iemand die altijd wel iets interessants te vertellen heeft.",
  Kreeft:      "Je uitstraling is warm en zorgzaam. Mensen vertrouwen je snel en zoeken emotionele nabijheid bij je. Je beschermt je innerlijke wereld met een zachte maar gesloten buitenkant.",
  Leeuw:       "Je hebt een natuurlijke aanwezigheid. Je straalt warmte, zelfvertrouwen en charisma uit. Mensen worden aangetrokken door jouw uitstraling — je lijkt altijd klaar voor het podium.",
  Maagd:       "Je komt over als betrouwbaar, nauwkeurig en bescheiden. Mensen zien je als bekwaam en behulpzaam. Je kiest woorden zorgvuldig en presenteert jezelf met precisie.",
  Weegschaal:  "Je uitstraling is charmant, evenwichtig en esthetisch. Mensen ervaren jou als diplomatiek en aangenaam. Je wil graag dat het eerste contact harmonisch verloopt.",
  Schorpioen:  "Je hebt een intense, doordringende uitstraling. Mensen voelen dat er meer achter je zit dan je laat zien. Je blik alleen al kan indruk maken. Mysterie is jouw eerste indruk.",
  Boogschutter:"Je komt over als open, enthousiast en vrij. Mensen zien jou als iemand met grote dromen en een ruime blik op de wereld. Je lach en directheid zijn aanstekelijk.",
  Steenbok:    "Je uitstraling is serieus, competent en gezaghebbend. Mensen nemen jou direct au sérieux. Je presenteert jezelf professioneel — soms formeler dan je van binnen bent.",
  Waterman:    "Je komt over als origineel, onafhankelijk en soms verrassend. Mensen weten niet precies wat ze van jou moeten verwachten, en dat is precies zoals jij het wil.",
  Vissen:      "Je uitstraling is zacht, dromerig en ongrijpbaar. Mensen voelen een zekere zachtheid en diepte in jou. Je grenzen zijn minder zichtbaar — zorg dat je jezelf niet weggeeft in het contact.",
};

// Mercurius in teken
const MERCURIUS: Record<string, string> = {
  Ram:        "Je denkt snel en direct — je hebt geen geduld voor omwegen. Je woorden komen krachtig uit maar soms te snel.",
  Stier:      "Je denkt grondig en langzaam. Je weegt woorden zorgvuldig maar eenmaal beslist sta je er vast in.",
  Tweelingen: "Je bent hier thuis. Je geest is snel, veelzijdig en altijd bezig. Je communiceert met gemak.",
  Kreeft:     "Je denken is sterk verbonden met gevoel en intuïtie. Je onthoudt alles emotioneel gekleurd.",
  Leeuw:      "Je communiceert met flair en overtuiging. Je hebt een aangeboren gevoel voor drama en expressie.",
  Maagd:      "Je analyseert scherp en precies. Details ontgaan je nooit. Je communiceert helder en praktisch.",
  Weegschaal: "Je weegt alle kanten af voor je spreekt. Je bent diplomatiek en kiest woorden zorgvuldig.",
  Schorpioen: "Je denkt diep en doordringend. Je ziet door oppervlakkigheid heen en houdt van directe eerlijkheid.",
  Boogschutter:"Je denkt in grote lijnen en brede concepten. Details interesseren je minder dan het grote plaatje.",
  Steenbok:   "Je communiceert zakelijk, gestructureerd en doelgericht. Woorden zijn voor jou instrumenten.",
  Waterman:   "Je denkt origineel en verrassend. Je combineert ideeën op manieren die anderen niet zien.",
  Vissen:     "Je denken is intuïtief en associatief. Logica en gevoel lopen bij jou door elkaar.",
};

// Venus in teken
const VENUS: Record<string, string> = {
  Ram:        "Je bent direct en pittig in liefde. Je houdt van de spanning van de achtervolging. Passie boven geduld.",
  Stier:      "Je bent hier in haar domiciel. Zintuiglijk, trouw, sensueel — je houdt van comfort en echte verbinding.",
  Tweelingen: "Je houdt van variatie en geestelijke stimulatie in relaties. Saai is een dealbreaker voor jou.",
  Kreeft:     "Je bent zorgzaam en beschermend in liefde. Veiligheid en emotionele binding zijn essentieel.",
  Leeuw:      "Je liefde is warm, royaal en dramatisch. Je houdt van grandeur en wil vergast worden — en verrasten.",
  Maagd:      "Je toont liefde door te zorgen en te helpen. Je bent kritisch maar ook diep toegewijd.",
  Weegschaal: "Venus is hier thuis. Je bent charmant, harmonieus en zoekt de perfecte balans in relaties.",
  Schorpioen: "Je liefde is intens, exclusief en diep. Passie en jaloezie zijn twee kanten van dezelfde medaille.",
  Boogschutter:"Je houdt van avontuur en vrijheid in liefde. Een partner die jou ruimte geeft én inspireert.",
  Steenbok:   "Je bent serieus en trouw in relaties. Je investeert voor de lange termijn en verwacht hetzelfde.",
  Waterman:   "Je waardeert vrijheid en vriendschap als basis voor liefde. Bezitterigheid is een breekpunt.",
  Vissen:     "Jouw liefde kent geen grenzen. Je bent romantisch, empathisch en soms idealistisch in relaties.",
};

// Mars in teken
const MARS: Record<string, string> = {
  Ram:        "Mars is hier thuis — je hebt een enorme directe energie. Je handelt snel, moedig en zonder omwegen.",
  Stier:      "Je energie is traag op gang maar onverstoorbaar. Als je in beweging bent, stop je niet meer.",
  Tweelingen: "Je energie wordt aangewakkerd door ideeën. Je handelt vanuit je hoofd, snel en veelzijdig.",
  Kreeft:     "Je energie is emotioneel gedreven. Je vecht voor wie je liefhebt maar trekt je terug als je pijn hebt.",
  Leeuw:      "Je hebt een fiere, zelfbewuste energie. Je handelt vanuit trots en wil graag schitteren.",
  Maagd:      "Je energie is precies en doelgericht. Je werkt hard maar wil dat alles klopt voor je begint.",
  Weegschaal: "Je hebt moeite met directe confrontatie. Je energie gaat naar het bewaren van de vrede.",
  Schorpioen: "Intense, geconcentreerde wil. Je hebt een enorm doorzettingsvermogen en legt je nooit neer.",
  Boogschutter:"Je energie is enthousiast en doelengedreven. Je hebt vrijheid nodig om je drive te voelen.",
  Steenbok:   "Je energie is gedisciplineerd en strategisch. Je werkt systematisch naar je doelen toe.",
  Waterman:   "Je energie is onvoorspelbaar en vernieuwend. Je wilt handelen voor een groter ideaal.",
  Vissen:     "Je energie is subtiel en intuïtief. Je handelt vanuit gevoel, soms zonder duidelijk plan.",
};

// Jupiter in teken
const JUPITER: Record<string, string> = {
  Ram:        "Je groeit via initiatief en durf. Nieuwe starts brengen jou voorspoed.",
  Stier:      "Je groeit via geduld en materiële investering. Kwaliteit en stabiliteit brengen overvloed.",
  Tweelingen: "Je groeit via kennis, contacten en communicatie. Leergierigheid opent deuren.",
  Kreeft:     "Je groeit via emotionele verbinding en zorg voor anderen. Thuis is je fundament voor expansie.",
  Leeuw:      "Je groeit via zelfexpressie en creativiteit. Durf je licht te laten schijnen.",
  Maagd:      "Je groeit via dienstverlening en verfijning van vaardigheden. Nuttig zijn brengt voldoening.",
  Weegschaal: "Je groeit via samenwerking en rechtvaardigheid. Relaties zijn jouw poort naar meer.",
  Schorpioen: "Je groeit via diepgang en transformatie. Wat je loslaat maakt ruimte voor overvloed.",
  Boogschutter:"Jupiter is hier thuis. Je groeit via avontuur, studie en filosofie. De wereld is jouw klaslokaal.",
  Steenbok:   "Je groeit via discipline en geduld. Langetermijninvestering geeft de meeste vrucht.",
  Waterman:   "Je groeit via originaliteit en gemeenschapszin. Innovatieve ideeën brengen jou voorspoed.",
  Vissen:     "Je groeit via spirituele overgave en compassie. Vertrouwen in het grotere geheel opent deuren.",
};

// Saturnus in teken
const SATURNUS: Record<string, string> = {
  Ram:        "Je levensles: leer handelen zonder impulsiviteit. Ongeduld en eigenwijsheid zijn je valkuilen.",
  Stier:      "Je levensles: vertrouw op materiële zekerheid zonder er aan vast te houden. Leer loslaten.",
  Tweelingen: "Je levensles: communiceer met diepgang. Oppervlakkigheid houdt je klein.",
  Kreeft:     "Je levensles: bouw een emotioneel fundament zonder angst. Kwetsbaarheid is kracht.",
  Leeuw:      "Je levensles: erkenning verdienen door authenticiteit, niet door prestatie.",
  Maagd:      "Je levensles: streef naar excellentie maar accepteer onvolmaaktheid — ook bij jezelf.",
  Weegschaal: "Je levensles: leer eerlijk zijn in relaties, ook als het disharmonie geeft.",
  Schorpioen: "Je levensles: omarm transformatie in plaats van controle te houden. Laat vertrouwen toe.",
  Boogschutter:"Je levensles: zoek wijsheid via discipline, niet alleen via vrijheid.",
  Steenbok:   "Saturnus is hier thuis. Ambitie en verantwoordelijkheid zijn je sterkste krachten.",
  Waterman:   "Je levensles: vernieuw niet uit rebellie maar vanuit visie. Structuur en vrijheid kunnen samengaan.",
  Vissen:     "Je levensles: stel grenzen zonder je gevoel te verliezen. Realisme en spiritualiteit gaan samen.",
};

// Uranus, Neptunus, Pluto — generationeel, kortere tekst
const URANUS: Record<string, string> = {
  Ram:"Generatie van revolutie en radicale vernieuwing van identiteit.",
  Stier:"Generatie die materiële systemen en waarden fundamenteel verandert.",
  Tweelingen:"Generatie die communicatie en informatiestromen transformeert.",
  Kreeft:"Generatie die familiestructuren en thuisconcept herziet.",
  Leeuw:"Generatie die creatief leiderschap en entertainment vernieuwt.",
  Maagd:"Generatie die werk, gezondheid en technologie revolutioneert.",
  Weegschaal:"Generatie die relaties en rechtvaardigheid opnieuw definieert.",
  Schorpioen:"Generatie die macht en transformatie radicaal ter discussie stelt.",
  Boogschutter:"Generatie die filosofie, geloof en reizen vernieuwt.",
  Steenbok:"Generatie die instituties en structuren omvormt.",
  Waterman:"Uranus is thuis — generatie van technologische revolutie en humanisme.",
  Vissen:"Generatie die spiritualiteit en verbeelding bevrijdt.",
};

const NEPTUNUS: Record<string, string> = {
  Ram:"Generatie met spiritueel pionierisme en mystiek idealisme.",
  Stier:"Generatie die materiële schoonheid en aards mysterie verbindt.",
  Tweelingen:"Generatie die taal en communicatie spiritueel transformeert.",
  Kreeft:"Generatie met diepe spirituele binding aan huis en familie.",
  Leeuw:"Generatie die kunst en spiritualiteit tot groot verhaal maakt.",
  Maagd:"Generatie die spiritualiteit via praktisch dienstwerk uitdrukt.",
  Weegschaal:"Generatie met spiritueel ideaal van wereldvrede en harmonie.",
  Schorpioen:"Generatie met diep verlangen naar mystieke transformatie.",
  Boogschutter:"Generatie met spiritueel avontuur en zoektocht naar waarheid.",
  Steenbok:"Generatie die spirituele discipline en structuur verbindt.",
  Waterman:"Generatie met visie op een spiritueel verbonden mensheid.",
  Vissen:"Neptunus is thuis — generatie van diepe spiritualiteit en universeel medeleven.",
};

const PLUTO: Record<string, string> = {
  Ram:"Generatie van radicale transformatie van het individu.",
  Stier:"Generatie die materiële macht transformeert.",
  Tweelingen:"Generatie die informatie als macht transformeert.",
  Kreeft:"Generatie met transformatie van familie en natie.",
  Leeuw:"Generatie die macht en creativiteit diepgaand transformeert.",
  Maagd:"Generatie die werk, gezondheid en analyse transformeert.",
  Weegschaal:"Generatie die relaties en rechtvaardigheid transformeert.",
  Schorpioen:"Pluto is thuis — generatie van intense transformatie, dood en wedergeboorte.",
  Boogschutter:"Generatie die geloof, filosofie en mondiale systemen transformeert.",
  Steenbok:"Generatie die macht, instituties en economie transformeert.",
  Waterman:"Generatie die collectieve systemen en technologie transformeert.",
  Vissen:"Generatie die spiritualiteit en het onderbewuste transformeert.",
};

export const PLANEET_IN_TEKEN: Record<string, Record<string, string>> = {
  Zon: ZON, Maan: MAAN, Ascendant: ASCENDANT,
  Mercurius: MERCURIUS, Venus: VENUS, Mars: MARS,
  Jupiter: JUPITER, Saturnus: SATURNUS,
  Uranus: URANUS, Neptunus: NEPTUNUS, Pluto: PLUTO,
};

// Aspect interpretatie template
export function aspectTekst(planeet1: string, type: string, planeet2: string): string {
  const p1 = PLANEET_BETEKENIS[planeet1];
  const p2 = PLANEET_BETEKENIS[planeet2];
  const asp = ASPECT_TYPES[type.toLowerCase()];
  if (!p1 || !p2 || !asp) return '';
  return `Jouw ${planeet1} en ${planeet2} staan in ${asp.naam.toLowerCase()} — ${asp.energie.toLowerCase()} energieuitwisseling. Dit raakt aan ${p1.thema.split(',')[0].toLowerCase()} én ${p2.thema.split(',')[0].toLowerCase()}.`;
}
