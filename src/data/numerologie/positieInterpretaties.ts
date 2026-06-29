// Positie-specifieke interpretaties: wat betekent getal X op positie Y?
// 10 posities × 11 getallen (1-9, 11, 22) = 110 unieke interpretaties

export type PosNaam =
  | "Bestuursgetal"
  | "Levenspad"
  | "Levensles"
  | "Zielengetal"
  | "Geschenkgetal"
  | "Verledengetal"
  | "Fundamentengetal"
  | "Projectiegetal"
  | "Kerngetal"
  | "Doelgetal";

export type GetalKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22;

// Record<positie, Record<getal, tekst>>
export const POSITIE_INTERPRETATIES: Record<PosNaam, Record<GetalKey, string>> = {

  // ── 1. BESTUURSGETAL ─────────────────────────────────────────────────────────
  Bestuursgetal: {
    1: "In je dagelijkse aanpak ben je een pionier. Je grijpt initiatief, gaat voorop en werkt het liefst zelfstandig. Je auto-piloot is actie en leiderschap — zelfs in kleine dingen.",
    2: "Dagelijks stuur jij jezelf via samenwerking en aanvoelen. Je 'wacht even' van nature, observeert de sfeer en zoekt de weg van minste weerstand. Jij bent de stille kracht die verbindt.",
    3: "Jouw dagelijkse aanpak is creatief en communicatief. Je benadert problemen speels, zoekt de mens in de situatie en brengt vaak lichtheid mee. Jij praat en denkt en maakt.",
    4: "Als bestuurder werk je methodisch en gedegen. Stap voor stap, geen halve maatregelen. Anderen kunnen op je bouwen — wat jij begint, maak je af op je eigen solide manier.",
    5: "Je dagelijkse stijl is beweeglijk en flexibel. Je schakelt snel, zoekt variatie en vervelen is de grootste demotivator. Jij inspireert door energie, niet door protocol.",
    6: "Van nature neem jij verantwoordelijkheid. Je herkent wat anderen nodig hebben en stapt in. Je dagelijkse auto-piloot is zorgen, harmonie bewaren en orde scheppen voor het geheel.",
    7: "Jij stuurt jezelf via reflectie en analyse. Voordat je handelt, denk je. Je werkt liever alleen en diep dan snel en oppervlakkig. Rust en focus zijn jouw dagelijkse brandstof.",
    8: "Je aanpak is doelgericht en resultaatgedreven. Jij ziet de grote lijn, organiseert en stuurt bij. In jouw handen worden plannen werkelijkheid — efficiëntie is jouw taal.",
    9: "Je aansturing gaat via overzicht en universele blik. Je ziet patronen waar anderen details zien. Jij handelt vanuit het grotere plaatje en bent het meest gemotiveerd als je iets bijdraagt aan het geheel.",
    11: "Jouw dagelijkse auto-piloot loopt via intuïtie en gevoel voor de ander. Je vangt subtiele signalen op die anderen missen. Dat is je kracht én je uitdaging — het vraagt aarding om niet te overprikkelen.",
    22: "Je dagelijkse aanpak is ambities plus praktijk. Jij wil niet alleen doen, maar bouwen — iets dat blijft. Dat geeft je energie, maar vraagt ook dat je kleine stappen accepteert op weg naar het grote.",
  },

  // ── 2. LEVENSPAD ─────────────────────────────────────────────────────────────
  Levenspad: {
    1: "Jouw rode draad is onafhankelijkheid en pionierschap. Het leven brengt je steeds in situaties waar je moet leren leiden, initiëren en op eigen benen staan. Je grote les: durf voorop te gaan zónder anderen af te snijden.",
    2: "Je levenspad gaat over samenwerking en gevoeligheid. Keer op keer leer je verbinding, diplomatie en het vinden van balans tussen jouw behoeften en die van anderen. Je kracht: diepe empathie.",
    3: "Creativiteit en zelfexpressie zijn je levensthema. Het leven nodigt je uit om te communiceren, te creëren en vreugde te brengen. Je leert dat jouw stem, jouw ideeën, jouw verhaal — de moeite waard zijn.",
    4: "Je levenspad is bouwen en fundament leggen. Je leert dat solide resultaat vraagt om geduld, discipline en consistent werken. Wie voor jou opengaat, ontdekt een rots van betrouwbaarheid.",
    5: "Vrijheid en verandering zijn jouw rode draad. Je leven brengt avontuur, wisselingen en de voortdurende uitdaging om bewegingsvrijheid te combineren met diepgang en verbinding.",
    6: "Zorg, verantwoordelijkheid en harmonie zijn jouw levensthema. Je leert dat voor anderen zorgen mooi is — mits je ook voor jezelf zorgt. Het leven leert jou grenzen stellen vanuit liefde.",
    7: "Je levenspad gaat over verdieping, analyse en spirituele groei. Het leven trekt je steeds naar binnen — naar studie, introspectie, mystiek. Je grote les: vertrouwen opbouwen zonder alles te hoeven begrijpen.",
    8: "Macht, manifestatie en materieel succes zijn jouw levensthema. Je leert hoe je op grote schaal iets opbouwt én hoe je macht verantwoord en dienend gebruikt. Resultaten spreken jouw taal.",
    9: "Je rode draad is voltooiing, loslaten en universele betrokkenheid. Het leven brengt cycli van afronden en opnieuw beginnen. Je leert dat jouw wijsheid anderen dient, zolang je ook voor jezelf kiest.",
    11: "Je levenspad is dat van de visionair. Je bent hier om te inspireren, inzichten te brengen en anderen te verlichten. Dat is een prachtige én zware opdracht. Je leert je hooggevoeligheid als gave te dragen, niet als last.",
    22: "Je levenspad is het grootst denkbare: iets bouwen dat generaties overstijgt. Je combineert visie met uitvoering op een manier die weinigen kunnen. Je leert dat klein beginnen geen verraad is aan je grote droom.",
  },

  // ── 3. LEVENSLES ─────────────────────────────────────────────────────────────
  Levensles: {
    1: "Jij leert in dit leven om zelfstandig te staan en je eigen koers te varen. Afhankelijkheid is jouw valkuil; leiderschap jouw groeipad. De les: durf te zijn wie je bent, ook als niemand volgt.",
    2: "Jouw levensles is samenwerken en voelen. Je leert dat verbinding geen zwakte is maar kracht. De les: jouw behoeften tellen ook — zeg ze, ook als dat ongemakkelijk voelt.",
    3: "Je leert jezelf uitdrukken — in woorden, kunst, aanwezigheid. De neiging om jezelf weg te cijferen of onzichtbaar te houden is precies wat je los mag laten. De les: jouw stem telt.",
    4: "Jouw levensles is discipline, geduld en structuur. Je leert dat langdurig werken aan iets waardevollers is dan snelle resultaten. De les: vertrouw het proces ook als het traag gaat.",
    5: "Je leert omgaan met vrijheid en verandering — en de diepte die alleen ontstaat als je lang genoeg blijft. De les: ware avontuur zit ook in de stilte en in het commitment.",
    6: "Jij leert verantwoordelijkheid — voor jezelf én voor anderen. Maar ook: dat overdragen en loslaten net zo liefdevol is als dragen. De les: zorg zonder jezelf te verliezen.",
    7: "Je levensles is vertrouwen en verdieping. Je leert dat niet alles bewijsbaar of verklaarbaar hoeft te zijn. De les: laat intuïtie naast intellect bestaan.",
    8: "Jij leert hoe je materiële kracht opbouwt en verantwoord inzet. Macht is niet vies — maar vraagt bewustzijn. De les: succes dienen, niet bezitten.",
    9: "Je leert loslaten — van oude pijn, voltooide fases, de behoefte alles te controleren. De les: afronden maakt ruimte voor nieuw, en dat is een daad van moed.",
    11: "Jouw levensles is je hooggevoeligheid integreren. Je leert dat jij anders functioneert dan de meeste mensen — en dat dat een opdracht is, geen probleem. De les: breng je visie de wereld in zonder jezelf te verliezen.",
    22: "Je leert op grote schaal te manifesteren. De les: jij hebt de gave om dromen werkelijk te maken — maar dat vraagt doen, ook als het nog niet perfect is.",
  },

  // ── 4. ZIELENGETAL ───────────────────────────────────────────────────────────
  Zielengetal: {
    1: "Vanbinnen verlangt jouw ziel naar onafhankelijkheid en erkenning als individu. Je wil leiden, initiëren en je eigen stempel zetten — ook als je dat naar buiten niet altijd laat zien.",
    2: "Je ziel verlangt naar verbinding, harmonie en gehoord worden. Diep van binnen wil je erbij horen, samenwerken en liefde geven én ontvangen. Alleen zijn voelt voor jou als een gemis.",
    3: "Jouw ziel wil zich uitdrukken — creatief, vrolijk, vrij. Vanbinnen leeft een verlangen naar spel, creativiteit en contact. Als je dat onderdrukt, voel je je grijs.",
    4: "Je ziel verlangt naar zekerheid en fundament. Vanbinnen wil je een solide leven bouwen — iets wat duurzaam is, iets wat staat. Stabiliteit geeft jouw ziel rust.",
    5: "Vanbinnen brandt een verlangen naar vrijheid, beleving en verandering. Jouw ziel wil leven — proeven, zien, voelen. Vastzitten in routine is innerlijk een marteling.",
    6: "Je ziel verlangt ernaar om te zorgen en te verbinden. Vanbinnen ben jij de hoeder van anderen. Dit verlangen is mooi — zolang je ook jezelf in de zorgkring opneemt.",
    7: "Jouw ziel wil verstaan wat anderen niet zien. Vanbinnen ben je een zoeker — naar waarheid, diepte, mystiek. Oppervlakkigheid voedt je niet; diepgang wel.",
    8: "Diep van binnen verlangt jouw ziel naar invloed en resultaat. Je wil iets bouwen, leiden en zien dat jouw inspanningen vruchten dragen. Succesvol zijn voelt voor jou als bevestiging van wie je bent.",
    9: "Je ziel verlangt naar betekenis en het grotere geheel. Vanbinnen ben je een idealist die de wereld beter wil maken. Zinloosheid is voor jou het ergste gevoel.",
    11: "Jouw ziel verlangt naar spirituele verbinding en het doorgeven van inzicht. Vanbinnen ben je een boodschapper — je voelt dat je hier bent voor iets dat groter is dan jezelf.",
    22: "Je ziel verlangt naar het realiseren van iets groots en blijvends. Vanbinnen draagt je een droom die generaties kan raken. Dat verlangen mag er zijn — en vraagt ook concrete stappen.",
  },

  // ── 5. GESCHENKGETAL ─────────────────────────────────────────────────────────
  Geschenkgetal: {
    1: "Je hebt een aangeboren talent voor initiatief en leiderschap. Zonder er hard voor te hoeven werken kom jij als eerste in actie. Anderen kijken naar jou als het gaat om starten.",
    2: "Jij hebt een natuurlijk talent voor diplomatie en aanvoelen. Je leest sferen feilloos, lost spanningen op voor ze uitbreken en brengt mensen samen. Dat gaat je moeiteloos af.",
    3: "Je aangeboren gave is communicatie en creativiteit. Woorden, ideeën, verbinding — dat stroomt bij jou. Anderen zoeken jou op als ze inspiratie nodig hebben.",
    4: "Jouw cadeau is betrouwbaarheid en organisatievermogen. Jij bouwt structuur waar chaos was. Anderen kunnen op je rekenen — dat weten ze snel.",
    5: "Je hebt een aangeboren talent voor aanpassing en verbinding met allerlei mensen. Jij floreert in nieuwe situaties, maakt snel contact en ziet kansen waar anderen muren zien.",
    6: "Jouw gave is zorgen en harmonie brengen. Je voelt feilloos wat een groep of persoon nodig heeft en handelt daarnaar. Dat is een zeldzaam en waardevol talent.",
    7: "Je aangeboren gave is diepgang en analyse. Jij ziet sneller verbanden en patronen dan anderen. In onderzoek, contemplatie en reflectie ben je van nature sterk.",
    8: "Jij hebt een aangeboren talent voor manifestatie en organisatie op grote schaal. Middelen, mensen en plannen samenbrengen tot resultaat — dat gaat je als vanzelf.",
    9: "Je gave is wijsheid en empathie voor het grote plaatje. Jij snapt instinctief wat er leeft bij mensen en in de tijd. Dat maakt je een natuurlijke gids.",
    11: "Jouw aangeboren gave is spirituele gevoeligheid en inspiratie. Jij ontvangt inzichten en brengt ze moeiteloos over. Anderen voelen jouw aanwezigheid als bijzonder.",
    22: "Je hebt een uitzonderlijk aangeboren talent: grote visies omzetten in werkelijkheid. Jij ziet zowel het grote plaatje als de concrete stap. Dat is een zeldzame combinatie.",
  },

  // ── 6. VERLEDENGETAL ─────────────────────────────────────────────────────────
  Verledengetal: {
    1: "Jij draagt de energie van doorzetting en zelfstandigheid mee uit het verleden. Er is een sterke basis van individualiteit in jouw familielijn of eerdere ervaringen. Dat geeft kracht én de neiging om alles alleen te willen doen.",
    2: "Uit je verleden draag je sensitiviteit en aanpassingsvermogen mee. Er is een diepgeworteld patroon van voor anderen leven, samenwerken of op de achtergrond blijven. Bewustzijn helpt je dit patroon bewust te kiezen in plaats van automatisch te herhalen.",
    3: "Jouw verleden is gekleurd door creativiteit en expressie — of juist door het onderdrukken ervan. Je draagt een karmisch verlangen om jezelf te laten zien. Dit leven is kans om dat eindelijk te doen.",
    4: "Uit het verleden draag je hard werken en plichtsbewustzijn mee. Er is een erfenis van 'bouwen en doorzetten'. Dat is een kracht, maar ook een uitnodiging om ook te leren rusten.",
    5: "Jij draagt de energie van verandering en avontuur mee. In het verleden waren er veel wisselingen, reizen of situaties die vroegen om flexibiliteit. Nu is de uitdaging: ook diepte cultiveren.",
    6: "Uit je verleden draag je zorg en verantwoordelijkheidsgevoel mee — misschien ook overmatige zorg. Er is een patroon van opvangen en dragen. Dit leven leer je ook ontvangen.",
    7: "Jouw verleden is doordrenkt van zoeken, studeren en isolatie. Je draagt de energie van de kluizenaar mee — een diep verlangen naar waarheid. Nu is de vraag: kun je die wijsheid ook delen?",
    8: "Uit het verleden draag je ambitie en machtspatronen mee. Er is een karmische relatie met geld, status of autoriteit — positief of uitdagend. Dit leven leer je macht bewust en dienstbaar te gebruiken.",
    9: "Jij draagt de energie van afsluiting en universele liefde mee. Er is een diepgeworteld patroon van geven en loslaten. Dit leven mag je ook voor jezelf kiezen.",
    11: "Uit je verleden draag je de energie van de visionair en gevoeligheid mee. Er zijn ervaringen van buiten de boot vallen of niet begrepen worden. Dit leven leer je je gave te omarmen.",
    22: "Jij draagt een zware maar prachtige bagage: de energie van de grote bouwer. In het verleden zijn er grote plannen geweest — afgemaakt of niet. Dit leven is de kans om de droom te voltooien.",
  },

  // ── 7. FUNDAMENTENGETAL ──────────────────────────────────────────────────────
  Fundamentengetal: {
    1: "Jouw basis in het leven is onafhankelijkheid en zelfvertrouwen. Alles staat of valt met jouw vermogen om op jezelf te vertrouwen. Als die fundering stevig is, kun je bergen verzetten.",
    2: "Je staat op een fundament van verbinding en sensitiviteit. Jij bloeit als er harmonie en samenwerking is. Dat is jouw grond — verzorg die bewust.",
    3: "Jouw basis is creativiteit en expressie. Jij functioneert het best als je je vrij voelt om jezelf te uiten. Creëren, communiceren, spelen — dat voedt jouw fundament.",
    4: "Je staat op een fundament van structuur en discipline. Orde, routine en hard werken zijn voor jou geen keurslijf maar veiligheid. Jij bloeit in een georganiseerde omgeving.",
    5: "Jouw basis is vrijheid en beweging. Jij functioneert het best als je niet vastgezet wordt — in denken, in werken, in leven. Flexibiliteit is jouw fundament.",
    6: "Je staat op een fundament van zorg en verantwoordelijkheid. Jij bloeit wanneer je voor anderen kunt zorgen én wanneer je ook zelf gedragen wordt. Wederkerigheid is jouw grond.",
    7: "Jouw basis is reflectie en verdieping. Jij functioneert het best als je ruimte hebt voor stilte, studie en nadenken. Zonder die ruimte verlies je je grond.",
    8: "Je staat op een fundament van ambitie en doelgerichtheid. Jij hebt resultaat nodig om je stabiel te voelen. Werk aan iets wat telt — dat voedt jouw basis.",
    9: "Jouw basis is betekenis en bijdrage. Jij functioneert het best als je weet dat wat je doet ertoe doet. Zinloosheid ondermijnt jouw fundament het snelst.",
    11: "Je staat op een fundament van intuïtie en inspiratie. Jij bloeit als je kunt handelen vanuit gevoel en visie. Dwingen en controleren werkt averechts voor jou.",
    22: "Jouw basis is het verbinden van droom en daad. Jij functioneert het best als je aan iets groots bouwt. Dat geeft jou aarding én vleugels tegelijk.",
  },

  // ── 8. PROJECTIEGETAL ────────────────────────────────────────────────────────
  Projectiegetal: {
    1: "Naar buiten kom jij over als zelfstandig, assertief en besluitvaardig. Anderen zien een leider in jou — ook als jij dat zelf niet zo voelt. Jij introduceert jezelf door actie.",
    2: "Je straalt rust en diplomatie uit. Anderen voelen zich bij jou gehoord en op hun gemak. Je projecteert warmte en samenwerking — mensen zoeken jou op voor verbinding.",
    3: "Jij komt naar buiten als creatief, charmant en communicatief. Anderen zien een entertainende, lichte persoonlijkheid. Jouw eerste indruk is: dit is iemand die dingen weet te verwoorden.",
    4: "Je projecteert betrouwbaarheid en degelijkheid. Anderen zien iemand die dingen voor elkaar krijgt, afmaakt en er is als het moeilijk wordt. Jouw uitstraling is: solide.",
    5: "Jij straalt energie, openheid en avontuurzin uit. Anderen ervaren jou als dynamisch en veelzijdig. Je bent diegene die de sfeer losser maakt — jij brengt leven in de brouwerij.",
    6: "Je projecteert warmte en zorg. Anderen voelen zich direct veilig bij jou. Je straalt betrokkenheid uit en mensen vertellen je spontaan hun verhaal. Jij bent de veilige haven.",
    7: "Jij komt naar buiten als rustig, bedachtzaam en diepzinnig. Anderen zien iemand die niet zomaar alles zegt maar als hij spreekt, het de moeite waard is. Mysterieus en wijs is jouw uitstraling.",
    8: "Je projecteert kracht en autoriteit. Anderen zien een leider die weet waar hij naartoe gaat. Jij straalt daadkracht en beslissingszekerheid uit — mensen vertrouwen je hun projecten toe.",
    9: "Jij straalt wijsheid en medeleven uit. Anderen voelen dat je groter denkt dan alleen de situatie. Je projecteert universele betrokkenheid — mensen zoeken jou op voor advies en perspectief.",
    11: "Je projecteert iets bijzonders — anderen voelen het ook al kunnen ze het niet altijd benoemen. Jij straalt diepte, intuïtie en een zeker 'weten' uit. Mensen zijn aangetrokken tot jouw energie.",
    22: "Jij komt over als iemand met een missie. Anderen voelen jouw doelgerichtheid en het grote waarvoor je staat. Je projecteert betekenis — en trekt mensen aan die ook iets willen opbouwen.",
  },

  // ── 9. KERNGETAL ─────────────────────────────────────────────────────────────
  Kerngetal: {
    1: "In de kern ben jij een pionier. Als alles is afgepeld, blijft er een mens over die onafhankelijk is, initiatief neemt en het liefst eigen koers vaart. Dat is je wezen.",
    2: "Jij bent in de kern een verbinder. Jouw diepste essentie is gevoeligheid, empathie en de wil om bruggen te bouwen. Samenwerking zit in je DNA.",
    3: "In de kern ben jij een creatieve ziel. Jouw essentie is expressie, communicatie en vreugde. Als je jezelf mag zijn, stroomt dat er van nature uit.",
    4: "Jij bent in de kern een bouwer. Jouw diepste essentie is de wil om iets solide en duurzaams neer te zetten. Betrouwbaar en standvastig — dat is wie je ten diepste bent.",
    5: "In de kern ben jij een vrije ziel. Jouw essentie is verandering, beweging en beleving. Vast en zeker is niet jouw aard — diversiteit en aanpassing zijn dat wel.",
    6: "Jij bent in de kern een zorgdrager. Jouw diepste essentie is liefde en verantwoordelijkheidsgevoel voor anderen. Dat is geen keuze — het is wie je bent.",
    7: "In de kern ben jij een zoeker. Jouw essentie is de drang om te begrijpen, te verdiepen en de waarheid te vinden. Oppervlakkigheid voelt voor jou als vreemd terrein.",
    8: "Jij bent in de kern een manifestant. Jouw diepste essentie is doelgerichtheid en de wil om iets in de wereld te realiseren. Resultaat en invloed zijn voor jou niet bijzaak.",
    9: "In de kern ben jij een oude ziel. Jouw essentie is wijsheid, overzicht en diepe betrokkenheid bij het grotere geheel. Loslaten en dienen zijn voor jou de diepste waarheden.",
    11: "Jij bent in de kern een visionair. Jouw diepste essentie is spirituele gevoeligheid en het vermogen om inzichten te ontvangen en over te brengen. Dat is je roeping.",
    22: "In de kern ben jij een meester-bouwer. Jouw essentie is het verbinden van grote visie met concrete realisatie. Jij bent geboren om iets te scheppen dat groter is dan jezelf.",
  },

  // ── 10. DOELGETAL ────────────────────────────────────────────────────────────
  Doelgetal: {
    1: "Je levensdoel is pionierschap en leiderschap. Je bent hier om iets te initiëren dat er nog niet was. Het leven stuurt je naar situaties waar jouw durf en zelfstandigheid het verschil maken.",
    2: "Jouw bestemming is verbinding en harmonie. Je bent hier om bruggen te bouwen, te bemiddelen en samen te werken aan iets moois. Je doel is niet solo — maar in verbondenheid.",
    3: "Je levensdoel is creatieve expressie en communicatie. Je bent hier om jouw stem te laten horen — via kunst, woorden, onderwijs of gewoon aanwezigheid. Jij bent hier om iets te brengen.",
    4: "Jouw bestemming is bouwen en fundament leggen. Je bent hier om iets concreets en duurzaams neer te zetten — in werk, in relaties, in de samenleving. Het doel is structuur en zekerheid voor anderen.",
    5: "Je levensdoel is vrijheid leven en vrijheid brengen. Je bent hier om te laten zien dat anders-zijn mag. Jij baant paden voor mensen die gevangen zitten in conventie.",
    6: "Jouw bestemming is zorg en harmonie op grotere schaal. Je bent hier om bij te dragen aan welzijn — van je familie, gemeenschap of de wereld. Jij bent de hoeder.",
    7: "Je levensdoel is verdieping en spirituele wijsheid. Je bent hier om te zoeken, te leren en wat je vindt door te geven. Jij bent de denker, de gids, de stille wijze.",
    8: "Jouw bestemming is manifestatie en verantwoordelijk leiderschap. Je bent hier om iets groots op te bouwen en te laten zien dat macht en integriteit samen kunnen gaan.",
    9: "Je levensdoel is voltooiing en universele liefde. Je bent hier om te dienen, los te laten en anderen te inspireren door jouw wijsheid en medeleven. Een leven van betekenis.",
    11: "Jouw bestemming is inspireren en verlichten. Je bent hier als boodschapper — om visioenen, inzichten en hoop door te geven. Een bijzondere en zware opdracht, maar ook een prachtige.",
    22: "Je levensdoel is het bouwen van iets dat generaties overstijgt. Je bent hier om op grote schaal iets te realiseren dat de wereld ten goede verandert. De meest ambitieuze bestemming die er is.",
  },
};

export function getInterpretatie(positie: PosNaam, getal: number): string {
  const pos = POSITIE_INTERPRETATIES[positie];
  if (!pos) return '';
  return pos[getal as GetalKey] ?? '';
}
