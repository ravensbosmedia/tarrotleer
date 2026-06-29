export interface Stap {
  titel: string;
  beschrijving: string;
}

export interface Ritueel {
  id: string;
  naam: string;
  categorie: string;
  duur: string;
  niveau: "Beginner" | "Gevorderd" | "Expert";
  maanfase?: string;
  benodigdheden: string[];
  intentie: string;
  beschrijving: string;
  stappen: Stap[];
  afsluiting: string;
}

export const RITUELEN: Ritueel[] = [
  {
    id: "volle-maan-release",
    naam: "Volle Maan Loslaten",
    categorie: "Maanritueel",
    duur: "30-45 minuten",
    niveau: "Beginner",
    maanfase: "Volle Maan",
    benodigdheden: ["Papier en pen", "Vuurvaste schaal", "Aansteker", "Wit of zilver kaars", "Optioneel: amethist of maansteen"],
    intentie: "Loslaten van wat je niet langer dient — oude gewoontes, relaties, negatieve gedachten en blokkades.",
    beschrijving: "De volle maan is het krachtigste moment voor loslaten en afsluiting. De maan staat op zijn hoogtepunt en trekt — net als de vloed — alles naar de oppervlakte wat je klaar bent te laten gaan.",
    stappen: [
      {
        titel: "Heilige ruimte creëren",
        beschrijving: "Zoek een rustige plek waar je niet gestoord wordt. Steek de kaars aan. Leg eventueel je kristallen voor je. Neem drie diepe ademhalingen. Zeg hardop of in gedachten: 'Ik creëer een heilige ruimte voor mijn ritueel.'"
      },
      {
        titel: "Gronden en centren",
        beschrijving: "Sluit je ogen. Voel de verbinding met de aarde onder je. Stel je voor dat er wortels vanuit je voeten de aarde ingaan. Adem vijf keer diep in en uit."
      },
      {
        titel: "Schrijven",
        beschrijving: "Schrijf op het papier alles wat je wil loslaten. Wees eerlijk en specifiek. Schrijf in de ik-vorm: 'Ik laat los...' Het kan gaan om: angsten, relaties, gewoontes, zelfkritiek, oude overtuigingen, situaties die niet meer werken."
      },
      {
        titel: "Hardop uitspreken",
        beschrijving: "Lees je lijst hardop voor. Voel de woorden. Sommige kunnen emoties losmaken — dat is oké en zelfs goed. Je geeft ze toestemming om te vertrekken."
      },
      {
        titel: "Verbranden",
        beschrijving: "Verbrand het papier veilig in de vuurvaste schaal. Kijk hoe de vlammen het papier transformeren. Zeg: 'Met dankbaarheid laat ik dit los. Het is gedaan.' Zorg dat het volledig as is."
      },
      {
        titel: "Afsluiten en dankbaarheid",
        beschrijving: "Neem een moment om dankbaar te zijn. Dankbaar voor de lessen die het gebrachte ervaringen je gaven. Blow out de kaars en visualiseer hoe met de rook alles wat je losliet naar het universum verdwijnt."
      }
    ],
    afsluiting: "Drink een glas water om de energie te verankeren. Begraven of verstrooien de as buiten als je wilt. Slaap goed — dromen na een loslaatritueel zijn vaak betekenisvol.",
  },
  {
    id: "nieuwe-maan-intentie",
    naam: "Nieuwe Maan Intenties Zetten",
    categorie: "Maanritueel",
    duur: "20-30 minuten",
    niveau: "Beginner",
    maanfase: "Nieuwe Maan",
    benodigdheden: ["Dagboek of notitieboek", "Pen", "Zwarte of donkerblauwe kaars", "Optioneel: citrien of karneool"],
    intentie: "Nieuwe intenties planten voor de komende maancyclus — zaad-zaaien voor wat je wil aantrekken en groeien.",
    beschrijving: "De nieuwe maan is de donkere maan — het begin van een nieuwe cyclus. Net als een zaad in donkere aarde kiemen je intenties in de stille, potentieel rijke ruimte van deze maanfase.",
    stappen: [
      {
        titel: "Ruimte reinigen",
        beschrijving: "Ruim de plek op waar je het ritueel doet. Een opgeruimde ruimte staat voor een vrij, open mind. Optioneel: rook wierook of salie om de ruimte energetisch te reinigen."
      },
      {
        titel: "Stil worden",
        beschrijving: "Steek de kaars aan. Zit comfortabel. Sluit je ogen. Vraag jezelf: 'Wat wil ik echt in de komende vier weken manifesteren?' Laat gedachten en beelden opkomen zonder ze te oordelen."
      },
      {
        titel: "Intenties schrijven",
        beschrijving: "Open je ogen en schrijf maximaal tien intenties op. Schrijf in de tegenwoordige tijd alsof het al werkelijkheid is: 'Ik ben gezond en vol energie', 'Ik trek een liefdevolle relatie aan', 'Ik floreer in mijn werk.' Wees specifiek maar niet rigide."
      },
      {
        titel: "Visualiseren",
        beschrijving: "Sluit je ogen opnieuw. Lees mentaal je intenties door. Visualiseer bij elke intentie hoe het voelt als het werkelijkheid is. Gebruik alle zintuigen in je verbeelding."
      },
      {
        titel: "Energie inladen",
        beschrijving: "Houd je dagboek of notitieboek in je handen. Stel je voor dat de energie van de nieuwe maan — vruchtbaar, potentieel, krachtig — je intenties laadt. Zeg: 'Ik zaai deze zaden met liefde en vertrouwen.'"
      }
    ],
    afsluiting: "Bewaar je intenties op een speciale plek. Lees ze elke ochtend het eerste week. Vertrouw op het proces — de maan werkt.",
  },
  {
    id: "ochtend-grond-ritueel",
    naam: "Ochtendgrond Ritueel",
    categorie: "Dagelijks",
    duur: "10-15 minuten",
    niveau: "Beginner",
    benodigdheden: ["Rustieke plek", "Optioneel: hematiet of rode jaspis", "Een glas water"],
    intentie: "De dag beginnen gegrond, gecentreerd en intentioneel — verbonden met je lichaam en de aarde.",
    beschrijving: "De ochtend is de krachtigste tijd om de toon te zetten voor de rest van de dag. Dit korte ritueel helpt je wakker worden op ziel-niveau, niet alleen fysiologisch.",
    stappen: [
      {
        titel: "Water drinken",
        beschrijving: "Voor iets anders: drink bewust een glas water. Zeg dank voor het water. Stel je voor hoe het elke cel van je lichaam hydrateert en activeert."
      },
      {
        titel: "Lichaamscan",
        beschrijving: "Zit rechtop. Sluit je ogen. Scan je lichaam van teen tot kruin. Merk op wat je voelt, zonder oordeel. Ademhaal drie keer diep."
      },
      {
        titel: "Aarden",
        beschrijving: "Voel je voeten op de grond (of je zitbenen als je zit). Stel je voor dat wortels vanuit je onderste chakra de aarde ingaan. Neem een moment om echt aanwezig te zijn in je lichaam."
      },
      {
        titel: "Dagintentie",
        beschrijving: "Stel één intentie voor de dag. Niet een to-do, maar een manier van zijn: 'Vandaag ben ik geduldig', 'Vandaag ben ik aanwezig', 'Vandaag kies ik voor vreugde.' Herhaal het drie keer."
      },
      {
        titel: "Dankbaarheid",
        beschrijving: "Noem drie dingen waarvoor je dankbaar bent — hoe klein ook. Dankbaarheid is de snelste weg naar positieve energie en manifestatievermogen."
      }
    ],
    afsluiting: "Open je ogen. Neem een diepe adem. Je bent klaar voor de dag.",
  },
  {
    id: "chakra-balans-meditatie",
    naam: "Chakra Balans Meditatie",
    categorie: "Meditatie",
    duur: "20-30 minuten",
    niveau: "Beginner",
    benodigdheden: ["Rustige plek om te liggen", "Optioneel: 7 kristallen (één per chakra)", "Zachte muziek"],
    intentie: "Alle zeven chakra's balanceren en reinigen voor energetisch welzijn en vitale levensenergie.",
    beschrijving: "Chakra's zijn energiecentra in het subtiele lichaam. Wanneer ze geblokkeerd of onevenwichtig zijn, kan dit zich uiten als fysieke klachten, emotionele moeilijkheden of mentale onrust. Deze meditatie reinigt en balanceert elk centrum.",
    stappen: [
      {
        titel: "Comfortabel liggen",
        beschrijving: "Ga op je rug liggen. Leg eventueel de kristallen op de bijbehorende chakrapunten. Sluit je ogen. Ontspan volledig."
      },
      {
        titel: "Basischakra (Rood)",
        beschrijving: "Focus op de basis van je wervelkolom. Visualiseer een helder rood licht dat draait. Adem in rood licht, adem uit spanning. Voel je verbinding met de aarde. Herhaal: 'Ik ben veilig. Ik ben gegrond.' (3 minuten)"
      },
      {
        titel: "Sacralchakra (Oranje)",
        beschrijving: "Ga naar je onderbuik. Visualiseer oranje licht. Voel creativiteit en levensplezier stromen. Herhaal: 'Ik voel en ik vloeï.' (3 minuten)"
      },
      {
        titel: "Zonnevlecht (Geel)",
        beschrijving: "Middenrif en maaggebied. Geel licht stroomt. Voel je persoonlijke kracht en zelfvertrouwen groeien. Herhaal: 'Ik doe en ik kan.' (3 minuten)"
      },
      {
        titel: "Hartchakra (Groen)",
        beschrijving: "Midden van de borst. Groen licht expandeert. Open je hart voor liefde — voor jezelf en anderen. Herhaal: 'Ik bemin en ik word bemind.' (3 minuten)"
      },
      {
        titel: "Keelchakra (Blauw)",
        beschrijving: "Keel en nek. Helder blauw licht. Voël de vrijheid om je waarheid te spreken. Herhaal: 'Ik spreek mijn waarheid.' (3 minuten)"
      },
      {
        titel: "Voorhoofdchakra (Indigo)",
        beschrijving: "Punt tussen de wenkbrauwen. Indigo licht. Vertrouw op je intuïtie en innerlijk weten. Herhaal: 'Ik zie en ik weet.' (3 minuten)"
      },
      {
        titel: "Kruinchakra (Violet/Wit)",
        beschrijving: "Bovenkant van het hoofd. Violet of wit licht stroomt naar boven. Voel de verbinding met het universum en je hogere zelf. Herhaal: 'Ik ben.' (3 minuten)"
      },
      {
        titel: "Integreren",
        beschrijving: "Stel je voor hoe een gouden licht door alle chakra's stroomt van boven naar beneden — ze verbindt en balanceert. Neem twee minuten om te rusten in deze verbonden staat."
      }
    ],
    afsluiting: "Beweeg langzaam je vingers en tenen. Kom voorzichtig terug. Drink wat water. Noteer eventueel ervaringen in een dagboek.",
  },
  {
    id: "bescherming-ritueel",
    naam: "Energetisch Beschermingsritueel",
    categorie: "Bescherming",
    duur: "15-20 minuten",
    niveau: "Beginner",
    benodigdheden: ["Witte kaars", "Zwarte toermalijn of obsidiaan", "Zout (keukenzout of zeezout)", "Salie of palo santo (optioneel)"],
    intentie: "Een krachtig energetisch schild creëren dat negatieve energie, psychische aanvallen en uitputtende energieën op afstand houdt.",
    beschrijving: "We nemen elke dag energieën op van onze omgeving, mensen om ons heen en onze eigen gedachten. Dit ritueel bouwt een beschermende laag op je energetisch lichaam.",
    stappen: [
      {
        titel: "Reinigen",
        beschrijving: "Begin met het reinigen van je ruimte. Strooi eventueel zout in de hoeken van de kamer (zuivert negatieve energie). Verbrand salie of palo santo als je dit hebt. Stel je voor hoe de ruimte helder en zuiver wordt."
      },
      {
        titel: "Aarden",
        beschrijving: "Steek de witte kaars aan. Zit rechtop met je voeten plat op de grond. Houd de zwarte toermalijn in je handen. Neem drie diepe adem­halingen en voel de grond onder je."
      },
      {
        titel: "Lichtschild visualiseren",
        beschrijving: "Sluit je ogen. Stel je voor dat er wit of goud licht vanuit je hartchakra naar alle kanten uitstraalt. Dit licht omhult je volledig — als een ei of cocon van licht. Zeg: 'Ik ben omhuld door goddelijk licht.'"
      },
      {
        titel: "Schild activeren",
        beschrijving: "Stel je voor dat dit lichtschild een spiegel-laag heeft aan de buitenkant die negatieve energie terugkaatst naar zijn bron. Zeg drie keer: 'Alleen het hoogste goed kan bij mij komen. Al het andere keert terug.'"
      },
      {
        titel: "Verankeren",
        beschrijving: "Leg de toermalijn op de grond voor je. Visualiseer hoe het beschermingsschild verankerd is aan de aarde. Het is stabiel, sterk en permanent."
      }
    ],
    afsluiting: "Laat de kaars uitbranden (of blaas hem uit met de intentie om het schild te behouden). Draag de toermalijn die dag bij je. Herhaal zo vaak als nodig.",
  },
  {
    id: "tarot-ceremoneel",
    naam: "Ceremonieel Tarot Ritueel",
    categorie: "Tarot",
    duur: "30-60 minuten",
    niveau: "Gevorderd",
    benodigdheden: ["Tarotdeck", "Altaarkleed", "Kaars", "Kristal naar keuze", "Dagboek", "Incense"],
    intentie: "Verbinding maken met je hogere zelf en de archetypische wijsheid van de tarot voor diepgaande begeleiding.",
    beschrijving: "Het behandelen van tarot als ceremonie — niet als spel — transformeert de leeservaring volledig. Door intentie en ritueel creëer je een heilige container voor echte zelfreflectie en spirituele begeleiding.",
    stappen: [
      {
        titel: "Altaar opzetten",
        beschrijving: "Leg je altaarkleed neer. Zet de kaars erop, leg je kristal en zet je tarotdeck voor je. Verbrand incense. Neem een moment om te zien hoe mooi de ruimte eruit ziet."
      },
      {
        titel: "Meditatieve staat",
        beschrijving: "Sluit je ogen. Adem diep in en uit. Stel je voor dat je omhoog zweeft boven je dagelijks leven. Vanuit deze hogere positie zie je je leven in zijn totaliteit."
      },
      {
        titel: "Vraag formuleren",
        beschrijving: "Wat wil je weten? Formuleer een open vraag — niet ja/nee. Goede vragen: 'Wat heb ik nodig om te zien?', 'Hoe kan ik groeien in [situatie]?', 'Wat is de energie rondom [onderwerp]?'"
      },
      {
        titel: "Schudden met intentie",
        beschrijving: "Houd het deck in beide handen. Concentreer je op je vraag. Schud terwijl je dit doet. Voel de verbinding met de kaarten. Stop wanneer het goed voelt."
      },
      {
        titel: "Kaart(en) trekken",
        beschrijving: "Trek één tot drie kaarten. Leg ze face-down. Neem een moment voor je ze omkeert. Vraag jezelf: 'Wat zie ik?' voordat je de traditionele betekenis opzoekt."
      },
      {
        titel: "Diep lezen",
        beschrijving: "Bekijk elke kaart. Wat valt je op? Welke emotie roept het op? Schrijf in je dagboek wat de kaart voor jou betekent in relatie tot je vraag. Lees daarna de traditionele betekenis als aanvulling."
      }
    ],
    afsluiting: "Bedank de kaarten en je hogere zelf. Dek het deck af. Sluit je dagboek. Laat de kaars uitbranden of blaas hem bewust uit.",
  },
  {
    id: "manifestatie-ritueel",
    naam: "Manifestatie Bord Ritueel",
    categorie: "Manifestatie",
    duur: "45-60 minuten",
    niveau: "Beginner",
    maanfase: "Nieuwe Maan of Was Gibbous",
    benodigdheden: ["Tijdschriften of printafbeeldingen", "Schaar", "Lijm", "Karton of canvas", "Markers/stiften", "Citrien of groene aventurijn"],
    intentie: "Je dromen en doelen visualiseren en energetisch activeren via een manifestatiebord.",
    beschrijving: "Een manifestatiebord is meer dan een collage — het is een energetisch ankerpunt voor je intenties. Door het regelmatig te bekijken, programmeer je je onderbewuste op de frequentie van je wensen.",
    stappen: [
      {
        titel: "Reflecteren",
        beschrijving: "Beantwoord eerst: Wat wil ik in de komende 6-12 maanden manifesteren? Denk in categorieën: carrière, liefde, gezondheid, reizen, spirituele groei, woonsituatie."
      },
      {
        titel: "Beelden verzamelen",
        beschrijving: "Zoek afbeeldingen die resoneren met je wensen. Geen perfectionisme — volg je gevoel. Het gevoel dat een beeld geeft is belangrijker dan letterlijke juistheid."
      },
      {
        titel: "Bord samenstellen",
        beschrijving: "Leg de beelden op het karton. Experimenteer met plaatsing voor je lijmt. Voeg woorden, quotes en kleuren toe die je inspireren. Maak het mooi — dit is voor jou."
      },
      {
        titel: "Activeren",
        beschrijving: "Leg het bord voor je. Houd het kristal in je handen. Sluit je ogen. Stel je voor hoe elk ding op het bord al werkelijkheid is in je leven. Voel de blijdschap en dankbaarheid."
      },
      {
        titel: "Affirmatie",
        beschrijving: "Zeg hardop of schrijf: 'Dit of iets beters manifesteert zich voor het hoogste goed van allen betrokken. Ik sta dit toe.' Leg het kristal op het bord."
      }
    ],
    afsluiting: "Hang het bord op een plek waar je het dagelijks ziet. Bekijk het elke ochtend 2 minuten. Wees open voor hoe de manifestaties plaatsvinden — het hoeft niet op jouw verwachte manier te zijn.",
  },
  {
    id: "slaap-ritueel",
    naam: "Heilzaam Slaap Ritueel",
    categorie: "Dagelijks",
    duur: "15-20 minuten",
    niveau: "Beginner",
    benodigdheden: ["Lavendel essentieel olie", "Maansteen of amethist", "Dagboek", "Optioneel: schaal met zout"],
    intentie: "De dag afsluiten, energie reinigen en overgaan naar helende, herstellende slaap.",
    beschrijving: "De overgang van dag naar nacht is een heilig moment. Hoe je de dag afsluit beïnvloedt de kwaliteit van je slaap en de verwerking die je onderbewuste doet.",
    stappen: [
      {
        titel: "Energetisch douchen",
        beschrijving: "Als je een echte douche neemt — visualiseer dan hoe het water niet alleen je lichaam maar ook de dag-energie afwast. Stel je voor dat alles wat je niet langer nodig hebt, wegstroomt."
      },
      {
        titel: "Ruimte bereiden",
        beschrijving: "Dep een druppel lavendel op je kussen of polsen. Leg je kristallen naast het bed. Dim het licht. Zet telefoon op 'niet storen'."
      },
      {
        titel: "Dag verwerken",
        beschrijving: "Schrijf drie minuten in je dagboek: wat ging goed vandaag? Wat wil je morgen anders? Wat dankje je voor? Het schrijven zet de dag af in je brein."
      },
      {
        titel: "Loslaten",
        beschrijving: "Lig in bed. Scan je lichaam. Ontspan bewust elk lichaamsdeel van voeten naar kruin. Als gedachten komen, stel je ze voor als wolken die voorbijdrijven — je hoeft ze niet te volgen."
      },
      {
        titel: "Droomintentie",
        beschrijving: "Stel een intentie voor je dromen: 'Vanavond ontvang ik duidelijkheid over [onderwerp]' of simpelweg 'Ik rust en herstel diep.' Herhaal dit rustig terwijl je wegdoezelt."
      }
    ],
    afsluiting: "Vertrouw op het proces. Dromen verwerken wat het bewustzijn niet kan. Houd een droomdagboek bij het bed om herinneringen te noteren.",
  },
  {
    id: "zelf-liefde-bad",
    naam: "Ritueel Zelfliefde Bad",
    categorie: "Genezing",
    duur: "45-60 minuten",
    niveau: "Beginner",
    benodigdheden: ["Bad", "Rozenbladsels of rozenwater", "Himalayazout of zeezout", "Rozenkwarts", "Roze of witte kaarsen", "Lavendel olie"],
    intentie: "Diepe zelfliefde, emotionele genezing en energetische reiniging via het element water.",
    beschrijving: "Water heeft het vermogen om energie op te nemen en te transformeren. Dit bad is een ceremonie van zelfzorg en zelfliefde — een krachtige praktijk voor iedereen die de relatie met zichzelf wil verdiepen.",
    stappen: [
      {
        titel: "Voorbereiding",
        beschrijving: "Vul het bad. Voeg handvol zeezout toe (reinigt energie), rozenbladsels (liefdesenergie), enkele druppels lavendelolie. Steek de kaarsen aan. Dim eventueel de verlichting."
      },
      {
        titel: "Aanspreking",
        beschrijving: "Sta voor het bad. Bedank het water voor zijn zuiverende kracht. Stel je voor dat dit bad vol is met zelfliefde-energie — roze en goud licht."
      },
      {
        titel: "Intrede",
        beschrijving: "Stap langzaam in het bad. Voel het warme water om je heen. Leg de rozenkwarts op de rand of houd hem vast."
      },
      {
        titel: "Liefdevolle woorden",
        beschrijving: "Spreek hardop of in gedachten vriendelijke woorden naar jezelf. Wat zou je zeggen tegen een geliefde vriend in nood? Zeg dat nu tegen jezelf. 'Ik houd van je. Je bent genoeg. Je bent waardevol.'"
      },
      {
        titel: "Intentioneel weken",
        beschrijving: "Lig rustig. Laat het water zijn werk doen. Visualiseer hoe alle negativiteit, zelfkritiek en pijn het water in trekt en oplost. Voel hoe je lichter wordt."
      }
    ],
    afsluiting: "Als je het bad verlaat: stel je voor dat het water alle opgeloste negatieve energie meeneemt door de afvoer. Droog je af met een schone handdoek. Smeer jezelf in met je favoriete bodylotion als daad van zelfliefde.",
  },
  {
    id: "salie-reiniging",
    naam: "Ruimtereiniging met Salie",
    categorie: "Reiniging",
    duur: "15-20 minuten",
    niveau: "Beginner",
    benodigdheden: ["Sagebundel of losse salie", "Vuurvaste schaal of abalone schelp", "Aansteker", "Veer (optioneel)"],
    intentie: "Negatieve, stagnerende of zware energie uit een ruimte, object of persoon reinigen.",
    beschrijving: "Salie verbranden is een van de meest eeuwenoude reinigingspraktijken ter wereld, gebruikt in culturen van de Americas tot Europa. De rook neutraliseert negatieve ionen en verandert de energetische kwaliteit van een ruimte.",
    stappen: [
      {
        titel: "Voorbereiding",
        beschrijving: "Open ramen en deuren zodat de rook (met de negatieve energie) weg kan. Vul de vuurvaste schaal met een beetje zand of zout als basis."
      },
      {
        titel: "Aansteken",
        beschrijving: "Steek het sagebundel aan. Laat het even vlammen, blaas dan uit zodat het smeult en rook produceert."
      },
      {
        titel: "Reinigen (persoon)",
        beschrijving: "Begin bij jezelf: wuif de rook rond je lichaam van hoofd tot teen, en ook achter je rug. Vraag dat alle energie die jou niet toebehoort losgelaten wordt."
      },
      {
        titel: "Reinigen (ruimte)",
        beschrijving: "Loop met de klok mee door de ruimte. Begin bij de deur. Wuif de rook in alle hoeken, langs de ramen, deuren en elektronische apparaten. Doe dit rustig en bewust."
      },
      {
        titel: "Afsluiten",
        beschrijving: "Keer terug naar het midden van de ruimte. Vraag dat de ruimte gevuld wordt met licht, liefde en positieve energie. Doof het bundel veilig door het in zand te drukken."
      }
    ],
    afsluiting: "Laat de ramen nog 10-15 minuten open. Bedank de salie voor zijn reinigende werk. Je ruimte is energetisch gereset.",
  },
];

export function vindRitueel(id: string): Ritueel | undefined {
  return RITUELEN.find(r => r.id === id);
}

export function filterRituelen(categorie?: string): Ritueel[] {
  if (!categorie || categorie === "Alles") return RITUELEN;
  return RITUELEN.filter(r => r.categorie === categorie);
}

export const RITUEEL_CATEGORIEEN = ["Alles", "Maanritueel", "Meditatie", "Dagelijks", "Bescherming", "Tarot", "Manifestatie", "Genezing", "Reiniging"];
