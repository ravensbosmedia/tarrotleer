export type PendelCategorie = 'basis' | 'bewegingen' | 'schijven' | 'gevorderd' | 'videos';

export interface PendelLes {
  id: string;
  nummer: number;
  titel: string;
  categorie: PendelCategorie;
  niveau: 'beginner' | 'gevorderd';
  heeftAnimatie?: boolean;
  inhoud: PendelLesInhoud[];
}

export interface PendelLesInhoud {
  type: 'tekst' | 'lijst' | 'genummerd' | 'tip' | 'waarschuwing' | 'beweging';
  tekst?: string;
  items?: string[];
  beweging?: 'rechtsdraaiend' | 'linksdraaiend' | 'voor-achter' | 'links-rechts' | 'stilstaand';
}

export interface PendelVideo {
  id: string;
  titel: string;
  youtubeId: string;
  beschrijving: string;
  geschiktVoor: string;
}

export const pendelVideos: PendelVideo[] = [
  {
    id: 'video-1',
    titel: 'Pendelen met pendelmat — hoe werkt dat?',
    youtubeId: '907XVXWoruk',
    beschrijving: 'Praktische demonstratie van pendelen met een pendelmat met ja, nee en misschien opties.',
    geschiktVoor: 'Beginners · Les 6 (JA/NEE)',
  },
  {
    id: 'video-2',
    titel: 'Leren pendelen',
    youtubeId: '9lHqSDUs-xI',
    beschrijving: 'Basisinstructie voor het leren pendelen — van houding tot eerste oefeningen.',
    geschiktVoor: 'Beginners · Les 1–2',
  },
  {
    id: 'video-3',
    titel: 'Hoe Werkt een Pendel? Uitleg en Basics voor Beginners',
    youtubeId: 'pqQ3vxJ_nvg',
    beschrijving: 'Uitgebreide uitleg over hoe een pendel werkt en de basis voor beginners.',
    geschiktVoor: 'Beginners · Les 1',
  },
  {
    id: 'video-4',
    titel: 'Pendelen, hoe werkt dat?',
    youtubeId: 'gfYBSWZnOTQ',
    beschrijving: 'Uitleg over hoe pendelen werkt via contact met energie en het onderbewuste.',
    geschiktVoor: 'Les 3 (Geestelijke basishouding)',
  },
];

export const pendelLessen: PendelLes[] = [
  // ─── CATEGORIE: BASIS ────────────────────────────────────────────────────
  {
    id: 'les-01',
    nummer: 1,
    titel: 'Wat is pendelen?',
    categorie: 'basis',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Een pendel is een gewicht (steen, metaal of kristal) aan een ketting of draad. De pendel werkt via het ideomotorisch effect: onbewuste spierbewegingen in je hand worden versterkt zichtbaar via de pendel. Iedereen kan leren pendelen. Het vereist concentratie, een open mind en oefening. De pendel geeft geen magische antwoorden — hij verbindt je met je eigen onderbewustzijn.',
      },
      {
        type: 'lijst',
        tekst: 'Toepassingen van pendelen',
        items: [
          'Ja/Nee vragen beantwoorden',
          'Energievelden meten',
          'Wateraders en storingsvelden opsporen',
          "Chakra's en meridianen onderzoeken",
          'Kleuren en supplementen testen',
          'Meditatietechnieken kiezen',
          'Verloren voorwerpen terugvinden via de Letterschijf',
        ],
      },
      {
        type: 'waarschuwing',
        tekst: 'Wanneer NIET pendelen: als je ziek bent, als je depressief of psychisch overprikkeld bent, als je gespannen of moe bent, nooit voor diagnostische doeleinden, nooit voor egoïstische redenen (geld, roem, geschenken).',
      },
      {
        type: 'tip',
        tekst: 'Begin altijd met eenvoudige, verifieerbare vragen om je pendelrespons te kalibreren. Hoe meer je oefent, hoe sterker en betrouwbaarder je resultaten worden.',
      },
    ],
  },
  {
    id: 'les-02',
    nummer: 2,
    titel: 'De eerste stappen — Houding',
    categorie: 'basis',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'De houding bij het pendelen is essentieel voor een betrouwbaar resultaat. Een verkeerde houding leidt tot spierspanning die de pendel ongewild beïnvloedt.',
      },
      {
        type: 'genummerd',
        tekst: 'Stap voor stap instructie',
        items: [
          'Houd de pendel losjes aan de ketting vast (tussen duim en wijsvinger)',
          'De lengte van de ketting dient tussen 15 en 20 cm te bedragen',
          'Uw hand zit losjes aan uw pols — geen spanning',
          'Houd uw bovenlichaam en uw rug recht. Uw elleboog rust op de tafel',
          'Uw vrije hand legt u open en plat op de tafel',
          'U ademt rustig. U bent ontspannen',
          'Alle afleidingen in uw omgeving heeft u uitgeschakeld (geraas, radio, televisie enz.)',
          'U moet niet moe of gespannen zijn',
          'Pendel niet als u ziek, depressief of psychisch overprikkeld bent',
        ],
      },
      {
        type: 'tip',
        tekst: 'De kettinglengte van 15–20 cm is niet willekeurig. Bij deze lengte heeft de pendel genoeg amplitude om duidelijke bewegingen te maken, maar reageert hij nog precies genoeg op kleine spierbewegingen.',
      },
      {
        type: 'waarschuwing',
        tekst: 'Oefen dagelijks 5 minuten. Hoe meer uw lichaam de houding kent, hoe betrouwbaarder de signalen worden.',
      },
    ],
  },
  {
    id: 'les-03',
    nummer: 3,
    titel: 'Geestelijke basishouding',
    categorie: 'basis',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Neem deze basisregels altijd in acht bij het pendelen. Pendelen vereist een open, neutrale geesteshouding. Uw onderbewuste reageert op verwachtingen — als u het antwoord al "weet", stuurt u onbewust de pendel.',
      },
      {
        type: 'genummerd',
        tekst: 'De negen grondbeginselen',
        items: [
          'Houd uw hoofd vrij van alle vooroordelen en wensen',
          'Schakel alle bijgedachten uit die niets met het pendelen te maken hebben',
          'Pendel nooit om egoïstische redenen — niet om geld, roem of geschenken te krijgen',
          'Orakel niet en pendel de toekomst ook niet voor anderen',
          'Voer altijd een controle uit en houd geen enkel pendelresultaat voor onfeilbaar',
          "Ga niet 'diagnosticeren' met de pendel",
          'Stel altijd concrete vragen waarop nauwkeurige antwoorden mogelijk zijn',
          'Wees altijd geduldig. Sommige resultaten hebben tijd nodig om zich aan u te tonen (vooral bij beginners)',
          'Als u veel oefent zullen de resultaten na verloop van tijd krachtiger worden',
        ],
      },
      {
        type: 'tekst',
        tekst: 'Hoe meer u afgeleid bent en hoe minder u geconcentreerd bent, des te vager is het pendelresultaat. Vraag nooit waarom de pendel iets doet. Neem daarom altijd alle basisregels in acht.',
      },
      {
        type: 'tip',
        tekst: "Stel vóór elk pendelmoment de intentie: 'Ik vraag om eerlijke, onbeïnvloede informatie voor het hoogste welzijn.'",
      },
    ],
  },
  {
    id: 'les-04',
    nummer: 4,
    titel: 'Zelfcontrole en pendelvermogen',
    categorie: 'basis',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Het is belangrijk dat u uw pendelresultaten voortdurend controleert en ze kritisch analyseert. Om dat te vergemakkelijken zijn er pendelschijven die voor elke belangrijke vraagstelling uw pendelconditie en eventueel verkeerde houding aanwijzen.',
      },
      {
        type: 'tekst',
        tekst: 'Dat met kleine correcties (bijv. een andere plaats of een andere tijd) snel en efficiënt kan veranderen. Let er daarbij op dat tegenover een pendelvermogen van 70% in ieder geval 30% kans op verkeerde houding staat.',
      },
      {
        type: 'tip',
        tekst: 'Zorg ervoor dat uw pendelvermogen tijdens het pendelen zeer hoog (meer dan 85%) is. Als dat niet het geval is, gebruikt u de schijf "Foutief pendelresultaat" om de oorzaak te achterhalen.',
      },
      {
        type: 'lijst',
        tekst: 'Zelfcontroletests voor elke sessie',
        items: [
          'Test eerst een bekende vraag waarvan je het antwoord weet (bv: "Heet ik [naam]?")',
          'Controleer daarna het tegenovergestelde ("Heet ik [andere naam]?")',
          'Komt het resultaat overeen? Dan is je kalibratie betrouwbaar',
          'Komen resultaten niet overeen? Rust eerst uit en probeer later opnieuw',
          'Elk belangrijk resultaat dient u te controleren met de Controleschijf',
        ],
      },
      {
        type: 'waarschuwing',
        tekst: 'BESEF ALTIJD: Geen enkel pendelresultaat is onfeilbaar. Gebruik pendelresultaten altijd als aanvulling op uw eigen intuïtie en gezond verstand, nooit als absolute waarheid.',
      },
    ],
  },

  // ─── CATEGORIE: BEWEGINGEN ────────────────────────────────────────────────
  {
    id: 'les-05',
    nummer: 5,
    titel: 'De vier bewegingsrichtingen',
    categorie: 'bewegingen',
    niveau: 'beginner',
    heeftAnimatie: true,
    inhoud: [
      {
        type: 'tekst',
        tekst: 'De vastgestelde bewegingspatronen zullen maatgevend zijn voor uw toekomstige pendelen. Als ze eenmaal zijn vastgesteld, dient u ze nooit te veranderen.',
      },
      {
        type: 'beweging',
        beweging: 'rechtsdraaiend',
        tekst: 'RECHTSDRAAIEND — cirkelbewegingen met de klok mee. Bij de meeste mensen: JA, positief, mannelijk principe.',
      },
      {
        type: 'beweging',
        beweging: 'linksdraaiend',
        tekst: 'LINKSDRAAIEND — cirkelbewegingen tegen de klok in. Bij de meeste mensen: NEE, negatief, vrouwelijk principe.',
      },
      {
        type: 'beweging',
        beweging: 'voor-achter',
        tekst: 'VAN VOOR NAAR ACHTER — verticale slingering. Kan JA of een zoekende beweging betekenen.',
      },
      {
        type: 'beweging',
        beweging: 'links-rechts',
        tekst: 'VAN RECHTS NAAR LINKS — horizontale slingering. Kan NEE of neutraal betekenen.',
      },
      {
        type: 'tekst',
        tekst: 'Om correct te kunnen pendelen is het nodig dat u eerst uw eigen individuele pendelbewegingen vaststelt. Daarvoor houdt u uw pendel boven de controleschijf. Neem een paar diepe, kalme ademhalingen, bevrijd uzelf van alle storende gedachten en vraag innerlijk, zonder de woorden uit te spreken: "Wat betekent bij mij een JA?"',
      },
      {
        type: 'tip',
        tekst: 'Accepteer uw eigen aanwijzing. Doe precies hetzelfde met NEE en met "Kan ik niet of wil ik niet beantwoorden". Als u in het begin moeite heeft, stoot u even tegen de pendel en stel de vraag opnieuw.',
      },
    ],
  },
  {
    id: 'les-06',
    nummer: 6,
    titel: 'De juiste vraagstelling',
    categorie: 'bewegingen',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Als u JA respectievelijk NEE heeft vastgesteld, kunt u elke willekeurige vraag stellen die met ja of nee te beantwoorden is. Oefen eerst met een paar eenvoudige vragen om enig zelfvertrouwen te krijgen.',
      },
      {
        type: 'tekst',
        tekst: 'Bedenk daarbij altijd: hoe concreter de vraag, des te concreter het antwoord. Neem de tijd voor het pendelen.',
      },
      {
        type: 'lijst',
        tekst: 'Kenmerken van een goede pendelbare vraag',
        items: [
          'Gesloten vraag — te beantwoorden met JA of NEE',
          'Concreet en specifiek — geen vage of dubbele vragen',
          'Gesteld in de tegenwoordige tijd',
          'Eén vraag tegelijk — nooit meerdere in één zin',
          'Neutraal geformuleerd — niet sturend of emotioneel geladen',
        ],
      },
      {
        type: 'lijst',
        tekst: 'Voorbeelden: slechte vs goede vragen',
        items: [
          'SLECHT: "Wordt het goed?" → GOED: "Is deze aanpak op dit moment het meest geschikt?"',
          'SLECHT: "Is hij de ware voor mij en zal ik hem trouwen?" → GOED: "Is deze relatie nu goed voor mij?"',
          'SLECHT: "Wanneer kom ik geld tekort?" → GOED: "Is mijn financiële situatie op dit moment stabiel?"',
        ],
      },
      {
        type: 'tip',
        tekst: 'Pas als u zelfverzekerd met deze vraagtechniek weet om te gaan, kunt u tot de volgende stap overgaan — het werken met pendelschijven.',
      },
    ],
  },
  {
    id: 'les-07',
    nummer: 7,
    titel: 'Werken met uw lichaamsgevoel',
    categorie: 'bewegingen',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Gewenningsoefening: U gaat midden in een vertrek staan. Dan heft u uw vrije hand tot voor uw borst, met de palm naar beneden. Met de andere hand houdt u de pendel boven het middelpunt van de rug van de vrije hand. U maakt zich vrij van alle gedachten en probeert gevoelsmatig uw omgeving te begrijpen.',
      },
      {
        type: 'lijst',
        tekst: 'Hoe u de beweging interpreteert',
        items: [
          'POSITIEF: Pendel beweegt van vingers naar onderarm (voor-achter / langs de arm) — u voelt zich prettig op deze plek, de energie is in orde',
          'NEGATIEF: Pendel beweegt dwars over de hand (links-rechts) — slingerpatroon beïnvloedt uw lichaamsharmonie negatief',
        ],
      },
      {
        type: 'tip',
        tekst: "Doe deze oefening op verschillende plaatsen in het vertrek om alle 'positieve' en 'negatieve' plekken vast te stellen. Noteer uw bevindingen.",
      },
      {
        type: 'tekst',
        tekst: 'Met wat meer ervaring kunt u ook meteen boven voorwerpen pendelen. Een betrouwbaardere methode is echter die waarbij uw hand boven het voorwerp zweeft. Hoe sterker u lichamelijk betrokken bent, des te sterker is het slingerresultaat.',
      },
    ],
  },
  {
    id: 'les-08',
    nummer: 8,
    titel: 'Het testen van voorwerpen',
    categorie: 'bewegingen',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Als u zeker bent van uw lichamelijk gevoel, kunt u zich wagen aan het uitpendelen van voorwerpen. Houd daarbij uw hand boven het voorwerp en concentreer u alleen op het voorwerp. Denk aan niets anders — leef u helemaal in!',
      },
      {
        type: 'lijst',
        tekst: 'Pendelrichtingen bij voorwerpen',
        items: [
          'RECHTSDRAAIEND = positieve uitslag (het voorwerp is goed voor u)',
          'LINKSDRAAIEND = negatieve uitslag (het voorwerp is niet goed voor u)',
          'VOOR-ACHTER of LINKS-RECHTS = neutrale of onduidelijke uitslag',
        ],
      },
      {
        type: 'tekst',
        tekst: 'Test verschillende dingen uit uw omgeving: voedsel, medicijnen, edelstenen, kleuren. Ga pas verder met de volgende oefening als u deze methode goed onder de knie heeft.',
      },
      {
        type: 'tip',
        tekst: 'Als bij het testen andere pendelrichtingen worden waargenomen, komt dat omdat de concentratie niet goed was, de verkeerde vraag is gesteld of op dat moment geen antwoord mogelijk was. Gebruik dan ja/nee-vragen voor verduidelijking.',
      },
    ],
  },
  {
    id: 'les-09',
    nummer: 9,
    titel: 'Voorwerpen voor anderen testen',
    categorie: 'bewegingen',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Houd de pendel tussen het voorwerp en de hand van de ander. Als de pendel van het voorwerp naar de hand van de ander of rechtsom slingert, is dat "positief". Slingert hij tussen de hand en het voorwerp heen en weer of linksom, dan is het resultaat "negatief".',
      },
      {
        type: 'lijst',
        tekst: 'Interpretatiegids',
        items: [
          'Rechtsom of van voorwerp naar hand van de ander = POSITIEF voor die persoon',
          'Linksom of heen-en-weer = NEGATIEF voor die persoon',
          'Onduidelijke beweging = concentratie verbeteren of de vraag herformuleren',
        ],
      },
      {
        type: 'waarschuwing',
        tekst: "Pendelen voor een ander vereist altijd expliciete toestemming van die persoon. Deel resultaten neutraal mee — vermijd absolute uitspraken zoals 'dit is zeker zo'.",
      },
      {
        type: 'tip',
        tekst: 'Controleer vooraf altijd of uw pendelvermogen voldoende is (minimaal 80%) voordat u voor een ander pendelt.',
      },
    ],
  },

  // ─── CATEGORIE: SCHIJVEN ─────────────────────────────────────────────────
  {
    id: 'les-10',
    nummer: 10,
    titel: 'Werken met de Controleschijf',
    categorie: 'schijven',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'De pendelschijven bieden een groot aantal pendelmogelijkheden die een zo groot mogelijke bandbreedte aan pendelmogelijkheden weergeven. Test telkens voordat u aan de slag gaat uw pendelvermogen van dat moment.',
      },
      {
        type: 'tekst',
        tekst: 'De uitspraak die u krijgt heeft betrekking op uw situatie van dat moment en kan op een ander tijdstip of op een andere plaats wezenlijk anders zijn. Let steeds op de zelfcontrole en gebruik daarvoor de controleschijf.',
      },
      {
        type: 'lijst',
        tekst: 'De vier segmenten van de Controleschijf',
        items: [
          'JUIST — uw pendelresultaat is betrouwbaar en correct',
          'ONJUIST — het resultaat klopt niet; gebruik de schijf Foutief pendelresultaat',
          'WENSDENKEN — uw eigen verwachting beïnvloedt het resultaat; stel opnieuw in',
          'INVLOED — externe factoren (mensen, storingen) verstoren het resultaat',
        ],
      },
      {
        type: 'waarschuwing',
        tekst: 'BESEF ALTIJD: Geen enkel antwoord is onfeilbaar! Controleer elk belangrijk resultaat met de Controleschijf.',
      },
    ],
  },
  {
    id: 'les-11',
    nummer: 11,
    titel: 'Foutief pendelresultaat — oorzaken',
    categorie: 'schijven',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Als uw pendelvermogen te gering is of de Controleschijf "onjuist" aangeeft, gebruikt u de schijf "Foutief pendelresultaat" om de redenen te achterhalen en eventueel op te heffen.',
      },
      {
        type: 'lijst',
        tekst: 'Mogelijke oorzaken van foute pendelresultaten',
        items: [
          'Verkramping / verkeerde lichaamshouding',
          'Gebrekkige concentratie / te zwakke geesteskracht',
          'Tattwa-beïnvloeding (kosmische slingerritmen op bepaalde tijden)',
          'Te egoïstische vraag',
          'Te sterk wensdenken (vooropgezette mening)',
          'Storingen in de eigen auravelden',
          'Verkeerde vraagstelling (niet concreet genoeg)',
          'Verkeerde pendeltijd (vlak na eten, laat op de avond)',
          'Overmoeide pendeling / te veel gedachten / opgewonden toestand',
          'Te weinig innerlijke/uiterlijke rust',
          'Invloed van anderen die aanwezig zijn',
          'Lichamelijke zwakte door ziekte of overmoeidheid',
          'Oorzaak onbekend',
        ],
      },
      {
        type: 'tip',
        tekst: 'Sommige antwoorden op deze schijf verbieden tijdelijk elke pendelactiviteit. Wees in dat geval eerlijk tegenover uzelf en laat de pendel zo nodig voor korte of lange tijd met rust.',
      },
    ],
  },
  {
    id: 'les-12',
    nummer: 12,
    titel: 'De Letterschijf gebruiken',
    categorie: 'schijven',
    niveau: 'beginner',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'De letterschijf biedt zeer veel mogelijkheden. We nemen als voorbeeld dat u een voorwerp heeft verloren en wilt weten waar het ligt. De intentie van uw vraag is met één woord op het juiste antwoord te komen.',
      },
      {
        type: 'genummerd',
        tekst: 'Werkwijze stap voor stap',
        items: [
          "Vraag met de Getallenschijf: 'Hoeveel letters heeft het juiste woord?'",
          "Vraag dan met de Letterschijf: 'Hoe luidt de eerste letter?'",
          'Noteer de letter waarop de pendel uitwijkt',
          "Vraag steeds de volgende letter: 'Hoe luidt de tweede letter?' etc.",
          'Herhaal totdat het hele woord gevormd is',
          "Controleer: 'Is dit het volledige woord?' (JA/NEE)",
          'Het antwoord kan uit meerdere woorden bestaan — vraag dan eerst het aantal woorden',
        ],
      },
      {
        type: 'lijst',
        tekst: 'De Letterschijf bevat',
        items: [
          'Het volledige alfabet A t/m Z (26 letters)',
          'Woorden: ja / nee / man / vrouw / altijd / vaak / nooit',
          'Extra opties: af / toe / en / laat het / doe het / geen antwoord',
        ],
      },
      {
        type: 'tip',
        tekst: 'Toepassingen: verloren voorwerpen terugvinden, namen van mensen of geneesmiddelen bepalen, en voor alle mogelijke doelen waarbij een woord het antwoord is. Ga er creatief mee om!',
      },
    ],
  },
  {
    id: 'les-13',
    nummer: 13,
    titel: 'Storingsvelden opsporen',
    categorie: 'schijven',
    niveau: 'gevorderd',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Als u een storingsveld heeft gevonden (via de lichaamsharmonie-oefening), kunt u met de stralingsintensiteitsschijf eerst de kracht testen. Daarna onderzoekt u de aard van de straling met de storingsveldenschijf.',
      },
      {
        type: 'lijst',
        tekst: 'Stralingsintensiteit (van licht naar zwaar)',
        items: [
          'Gezonde straling — geen schadelijke invloed',
          'Licht ziekteverwekkende straling — voorzichtigheid geboden',
          'Ziekteverwekkende straling — vermijd langdurige blootstelling',
          'Levensbedreigende straling — onmiddellijke actie vereist',
        ],
      },
      {
        type: 'lijst',
        tekst: 'Soorten storingsvelden (via storingsveldenschijf)',
        items: [
          'Stralingsvrije zone',
          'Currynet / kruising',
          'Wereldnet / kruising',
          'Wereldnet (Hartmann-net)',
          'Verwerpingen / Curry',
          'Verwerping (aardbreuk)',
          'Waterader',
          'Waterader / kruising',
          'Waterader / verwerping',
          'Waterader / Currynet',
          'Currynet (enkelvoudig)',
        ],
      },
      {
        type: 'tip',
        tekst: 'Gebruik een plattegrond van de ruimte en markeer positieve en negatieve plekken. Zo krijgt u een energetische kaart van uw leefomgeving.',
      },
    ],
  },
  {
    id: 'les-14',
    nummer: 14,
    titel: "Chakra's pendelen",
    categorie: 'schijven',
    niveau: 'gevorderd',
    inhoud: [
      {
        type: 'tekst',
        tekst: "Met de chakraschijf onderzoek je de energetische toestand van de 7 hoofdchakra's. Houd de pendel boven de schijf en vraag welk chakra aandacht nodig heeft. Gebruik daarna de Chakra-energie schijf (van -100% onderenergie via 0% evenwichtig naar +100% bovenenergie) om de energiebalans per chakra te meten.",
      },
      {
        type: 'lijst',
        tekst: "De 7 hoofdchakra's met bijbehorende organen en kleuren",
        items: [
          '1e chakra — Wortelchakra (Muladhara) · Kleur: Rood · Organen: wervelkolom, botten, rectum, darm, bloed, bijnieren',
          '2e chakra — Sacraalchakra (Svadhisthana) · Kleur: Oranje · Organen: voortplanting, nieren, spijsvertering, prostaat, eierstokken, testikels',
          '3e chakra — Zonnevlechtchakra (Manipura) · Kleur: Geel/goudgeel · Organen: lever, maag, gal, autonoom zenuwstelsel, pancreas',
          '4e chakra — Hartchakra (Anahata) · Kleur: Groen/roze · Organen: hart, longen, borst, huid, bloedsom, thymus, handen',
          '5e chakra — Keelchakra (Vishuddha) · Kleur: Lichtblauw · Organen: stem, keel, bronchiën, long boven, schildklier, bijschildklier',
          '6e chakra — Derde Oog (Ajna) · Kleur: Indigoblauw/violet · Organen: neus, oren, ogen, gezicht, hypofyse, kleine hersenen',
          '7e chakra — Kruinchakra (Sahasrara) · Kleur: Violet/wit/goud · Organen: schedel, grote hersenen, pijnappelklier',
        ],
      },
      {
        type: 'tip',
        tekst: "Pendel eerst WELK chakra aandacht nodig heeft (via de chakraschijf), en daarna HOE STERK de on- of overactiviteit is (via de chakra-energie schijf). Zo krijgt u een compleet beeld.",
      },
    ],
  },
  {
    id: 'les-15',
    nummer: 15,
    titel: 'Meridianen pendelen',
    categorie: 'schijven',
    niveau: 'gevorderd',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'De 14 meridianen uit de traditionele Chinese geneeskunde kunnen met de pendel worden onderzocht op blokkades of overactiviteit. Gebruik de Meridiaanschijf om te bepalen welke meridiaan aandacht nodig heeft.',
      },
      {
        type: 'lijst',
        tekst: 'De 14 meridianen op de Meridiaanschijf',
        items: [
          'Maag (Yang)',
          'Milt / Pancreas (Yin)',
          'Hart (Yin)',
          'Dunne darm (Yang)',
          'Blaas (Yang)',
          'Nier (Yin)',
          'Bloedsomloop / Seks (Yin)',
          'Drievoudige verwarmer (Yang)',
          'Galblaas (Yang)',
          'Lever (Yin)',
          'Long (Yin)',
          'Centraal bloedvat — Ren Mai (Yin)',
          'Gouverneursbloedbaan — Du Mai (Yang)',
          'Dikke darm (Yang)',
        ],
      },
      {
        type: 'tip',
        tekst: 'Yang-meridianen (holle organen) stromen van boven naar beneden; yin-meridianen (volle organen) stromen van beneden naar boven. De twee centrale meridianen (Du Mai en Ren Mai) verbinden alle meridianen.',
      },
      {
        type: 'waarschuwing',
        tekst: 'Pendelresultaten over meridianen zijn geen medische diagnose. Raadpleeg bij gezondheidsklachten altijd een arts of erkend therapeut.',
      },
    ],
  },

  // ─── CATEGORIE: GEVORDERD ─────────────────────────────────────────────────
  {
    id: 'les-16',
    nummer: 16,
    titel: 'Stralingsintensiteiten — Bovis-eenheden',
    categorie: 'gevorderd',
    niveau: 'gevorderd',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Elke plaats en elk voorwerp heeft zijn eigen trilling. De Fransman A. Bovis heeft voor radiëstesisten een meetschaal opgesteld die bekend is als de "biometer" en die voor elke meting van stralingswaarden te gebruiken is. BE staat voor Bovis-eenheid.',
      },
      {
        type: 'lijst',
        tekst: 'Drie hoofdtoepassingen van de Bovis-biometer',
        items: [
          'De intensiteit van aardstralen en plaatsen meten',
          'De energetische vitale straling van levensmiddelen vaststellen',
          'De stralingsintensiteit van vibraties die invloed op mensen hebben bepalen',
        ],
      },
      {
        type: 'lijst',
        tekst: 'De Bovis-schaal — betekenis per bereik',
        items: [
          '0–2.000 BE: Kruising van storingsvelden — schadelijk voor het menselijk organisme, groeistoornissen mogelijk',
          '2.000–6.000 BE: Storingsveld — schadelijk voor menselijk organisme',
          '6.500–8.000 BE: Neutrale zone — geen noemenswaardige invloed',
          '8.000–10.000 BE: Beste waarde / volledige vitaliteit',
          '10.000–13.500 BE: Energetisch en etherisch gebied van het lichaam',
          '13.500–18.000 BE: Spiritueel en esoterisch gebied',
          'Vanaf 18.000 BE: Kosmische stralingsgebieden, heilige en sacrale plaatsen',
        ],
      },
      {
        type: 'tip',
        tekst: 'Test de Bovis-waarde van uw slaapplaats. Een waarde onder 6.500 BE op de plek waar uw hoofd rust is een signaal om uw bed te verplaatsen of het storingsveld te neutraliseren.',
      },
    ],
  },
  {
    id: 'les-17',
    nummer: 17,
    titel: 'Kleuren pendelen',
    categorie: 'gevorderd',
    niveau: 'gevorderd',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'Kleuren hebben energetische eigenschappen en kunnen via de pendel worden getest op harmonie met een persoon of situatie. Vraag eerst: "Heb ik meerdere kleuren nodig?"',
      },
      {
        type: 'lijst',
        tekst: 'Toepassingsmethoden voor kleuren',
        items: [
          'Via kleding',
          'Via woninginrichting',
          'Via edelstenen',
          'Met kleurige huidoliën',
          'Visualisering / meditatie',
          "Mandala's kleuren",
          'Via de voeding',
          'Met prisma\'s',
          'Met planten',
          'Bestraling met gekleurd licht',
        ],
      },
      {
        type: 'lijst',
        tekst: 'De kleurenschijf — alle tinten',
        items: [
          'Rood tinten: rood, vuurrood, rozrood, roze',
          'Oranje tinten: donkeroranje, lichtoranje, oranje, geeloranje',
          'Geel tinten: geel, lichtgeel, mosterdgeel, goud',
          'Groen tinten: groen, grasgroen, jadegroen, donkergroen, appelgroen, olijfgroen',
          'Blauw tinten: blauw, lichtblauw, koningsblauw, grijsblauw',
          'Overige: grijs, zilver, wit, zwart, violet, indigo, purper, bruin, bruinrood, donkerrood',
        ],
      },
      {
        type: 'tip',
        tekst: 'Pendel ook de toepassingsmethode: via kleding, edelstenen, meditatie of voeding. Zo krijgt u niet alleen de kleur maar ook de manier van toepassen.',
      },
    ],
  },
  {
    id: 'les-18',
    nummer: 18,
    titel: 'Meditatietechnieken via pendel kiezen',
    categorie: 'gevorderd',
    niveau: 'gevorderd',
    inhoud: [
      {
        type: 'tekst',
        tekst: 'De pendel kan helpen bij het kiezen van de meditatiemethode die op dit moment het beste aansluit bij uw energetische staat. Gebruik de Meditatietechniekenschijf voor een overzicht van alle beschikbare methoden.',
      },
      {
        type: 'lijst',
        tekst: 'Technieken op de Meditatietechniekenschijf',
        items: [
          'Edelsteenmeditatie',
          'Dynamische meditatie',
          'Chakrameditatie',
          'Autogene training',
          'Ademmeditatie (Pranayama)',
          'Loopmeditatie',
          'Licht-/kleurmeditatie',
          'Kundalini meditatie',
          'Luisteren en zwijgen',
          'Gebed',
          'Tai chi',
          'Mantrameditatie',
          'Natuurervaring',
          'Mandalameditatie',
          'Yoga',
          'Visuele meditatie',
          'Transcendente meditatie',
          'Zenmeditatie',
          'Meditatiemuziek',
        ],
      },
      {
        type: 'tip',
        tekst: 'Pendel ook hoe lang u de gekozen techniek het beste kunt beoefenen (gebruik de Getallenschijf voor minuten). En pendel achteraf: was deze techniek vandaag effectief?',
      },
    ],
  },
];
