export interface SterrenbeeldData {
  nlNaam: string;
  enNaam: string;
  symbool: string;
  datumVan: string;
  datumTot: string;
  element: 'Vuur' | 'Aarde' | 'Lucht' | 'Water';
  modaliteit: 'Cardinaal' | 'Vast' | 'Veranderlijk';
  heerser: string;
  kernwoorden: string[];
  positief: string;
  schaduw: string;
  inRelaties: string;
  inWerk: string;
}

export interface Element {
  naam: string;
  emoji: string;
  tekens: string[];
  energie: string;
  kernkwaliteit: string;
  schaduw: string;
  behoefte: string;
}

export interface Modaliteit {
  naam: string;
  emoji: string;
  tekens: string[];
  energie: string;
  kwaliteit: string;
  schaduw: string;
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const STERRENBEELDEN: SterrenbeeldData[] = [
  { nlNaam: 'Ram', enNaam: 'aries', symbool: '♈', datumVan: '21 mrt', datumTot: '19 apr', element: 'Vuur', modaliteit: 'Cardinaal', heerser: 'Mars', kernwoorden: ['initiatief', 'moed', 'actie', 'ongeduld', 'pionier'], positief: 'Doortastend, moedig, eerlijk, energiek. Begint waar anderen aarzelen. Brengt nieuwe richting in stagnatie.', schaduw: 'Impulsief, ongeduldig, kort lontje, kan anderen overrompelen of niet luisteren.', inRelaties: 'Vurig, direct, wil snel weten waar hij/zij staat. Heeft een partner nodig die niet bezitterig wordt maar wel terug-vuur biedt.', inWerk: 'Bloeit in start-ups, sport, leidinggevende rollen, alles waar tempo en autonomie tellen.' },
  { nlNaam: 'Stier', enNaam: 'taurus', symbool: '♉', datumVan: '20 apr', datumTot: '20 mei', element: 'Aarde', modaliteit: 'Vast', heerser: 'Venus', kernwoorden: ['stabiliteit', 'zintuiglijk genot', 'trouw', 'koppigheid', 'materieel'], positief: 'Standvastig, betrouwbaar, geniet van mooi en lekker, loyaal. Bouwt langzaam maar zeker.', schaduw: 'Koppig, traag in verandering, te gehecht aan bezit, kan obstinaat zijn.', inRelaties: 'Trouw en zinnelijk. Wil veiligheid en lichamelijk contact. Vraagt om geduld bij beslissingen.', inWerk: 'Bloeit in finance, landbouw, kunst, design, koken, vastgoed — alles tastbaar en duurzaam.' },
  { nlNaam: 'Tweelingen', enNaam: 'gemini', symbool: '♊', datumVan: '21 mei', datumTot: '20 jun', element: 'Lucht', modaliteit: 'Veranderlijk', heerser: 'Mercurius', kernwoorden: ['communicatie', 'nieuwsgierigheid', 'dualiteit', 'wendbaarheid', 'intellect'], positief: 'Spitsvondig, sociaal, veelzijdig, leergierig. Verbindt mensen via taal en ideeën.', schaduw: 'Vluchtig, oppervlakkig, kan dubbelzinnig of inconsequent zijn.', inRelaties: 'Verbale verbinding is essentieel. Verveelt snel zonder mentale prikkel.', inWerk: 'Bloeit in journalistiek, sales, onderwijs, marketing, IT — communicatie en variatie.' },
  { nlNaam: 'Kreeft', enNaam: 'cancer', symbool: '♋', datumVan: '21 jun', datumTot: '22 jul', element: 'Water', modaliteit: 'Cardinaal', heerser: 'Maan', kernwoorden: ['gevoel', 'zorg', 'familie', 'intuïtie', 'bescherming'], positief: 'Empathisch, beschermend, intuïtief, familiair. Bouwt warm thuis voor zichzelf en anderen.', schaduw: 'Stemmingswisselend, vasthoudend aan oude pijn, terugtrekkend in "schelp".', inRelaties: 'Diep emotioneel verbonden. Heeft veiligheid en trouw nodig. Kan kwetsend zijn als hij/zij zich bedreigd voelt.', inWerk: 'Bloeit in zorg, onderwijs, koken, ouderschap — alles met zorg en geheugen.' },
  { nlNaam: 'Leeuw', enNaam: 'leo', symbool: '♌', datumVan: '23 jul', datumTot: '22 aug', element: 'Vuur', modaliteit: 'Vast', heerser: 'Zon', kernwoorden: ['zelfexpressie', 'leiderschap', 'warmte', 'trots', 'stralend'], positief: 'Warm, genereus, theatraal, loyaal. Geeft anderen het gevoel dat ze gezien worden.', schaduw: 'IJdel, dominant, behoeftig aan bewondering, dramatisch.', inRelaties: 'Romantisch en aandachtgevend. Heeft erkenning en passie nodig.', inWerk: 'Bloeit in performance, leidinggevende rollen, kunsten — zichtbaarheid en hart.' },
  { nlNaam: 'Maagd', enNaam: 'virgo', symbool: '♍', datumVan: '23 aug', datumTot: '22 sep', element: 'Aarde', modaliteit: 'Veranderlijk', heerser: 'Mercurius', kernwoorden: ['analyse', 'dienstbaarheid', 'precisie', 'zorg', 'kritisch oog'], positief: 'Nauwkeurig, behulpzaam, analytisch, gezondheidsbewust. Vindt fouten die niemand ziet.', schaduw: 'Te kritisch op zichzelf én anderen, perfectionistisch, piekert over details.', inRelaties: 'Dienend en zorgzaam. Heeft een partner nodig die geduld heeft met analytisch denken.', inWerk: 'Bloeit in zorg, redactie, analyse, ambacht, onderzoek — precisie en dienstbaarheid.' },
  { nlNaam: 'Weegschaal', enNaam: 'libra', symbool: '♎', datumVan: '23 sep', datumTot: '22 okt', element: 'Lucht', modaliteit: 'Cardinaal', heerser: 'Venus', kernwoorden: ['balans', 'relaties', 'harmonie', 'esthetiek', 'diplomatie'], positief: 'Diplomatiek, charmant, eerlijk, esthetisch. Brengt mensen bijeen.', schaduw: 'Besluiteloos, conflict-vermijdend, te aanpassend, oppervlakkig charmant.', inRelaties: 'Bloeit in partnerschap — alleen-zijn voelt onaf. Risico: relatie te belangrijk maken.', inWerk: 'Bloeit in recht, design, advisering, HR, kunst.' },
  { nlNaam: 'Schorpioen', enNaam: 'scorpio', symbool: '♏', datumVan: '23 okt', datumTot: '21 nov', element: 'Water', modaliteit: 'Vast', heerser: 'Pluto', kernwoorden: ['transformatie', 'diepte', 'intensiteit', 'macht', 'mystiek'], positief: 'Intens, loyaal, scherp inzicht in motieven, transformerende kracht in crisis.', schaduw: 'Bezitterig, jaloers, wraakzuchtig, manipulatief.', inRelaties: 'Diep en exclusief — niets oppervlakkigs. Heeft een partner nodig die de diepte aankan.', inWerk: 'Bloeit in onderzoek, therapie, finance, alles met transformatie.' },
  { nlNaam: 'Boogschutter', enNaam: 'sagittarius', symbool: '♐', datumVan: '22 nov', datumTot: '21 dec', element: 'Vuur', modaliteit: 'Veranderlijk', heerser: 'Jupiter', kernwoorden: ['expansie', 'optimisme', 'filosofie', 'vrijheid', 'avontuur'], positief: 'Ruimdenkend, optimistisch, eerlijk, avontuurlijk, geïnteresseerd in betekenis.', schaduw: 'Te direct (kan kwetsen), rusteloos, belovend zonder leveren.', inRelaties: 'Wil vrijheid in de relatie. Heeft een partner nodig die mee-avontuurt.', inWerk: 'Bloeit in reizen, hoger onderwijs, filosofie, juridische zaken, sport.' },
  { nlNaam: 'Steenbok', enNaam: 'capricorn', symbool: '♑', datumVan: '22 dec', datumTot: '19 jan', element: 'Aarde', modaliteit: 'Cardinaal', heerser: 'Saturnus', kernwoorden: ['discipline', 'ambitie', 'verantwoordelijkheid', 'structuur', 'gezag'], positief: 'Verantwoordelijk, ambitieus, doorzettend, betrouwbaar. Bouwt voor de lange termijn.', schaduw: 'Te streng op zichzelf, pessimistisch, koud, geblokkeerd door plicht.', inRelaties: 'Trouw en verantwoordelijk. Heeft warmte van partner nodig om niet in plicht te verstijven.', inWerk: 'Bloeit in management, bouw, overheid, finance — lange-termijn opbouw.' },
  { nlNaam: 'Waterman', enNaam: 'aquarius', symbool: '♒', datumVan: '20 jan', datumTot: '18 feb', element: 'Lucht', modaliteit: 'Vast', heerser: 'Uranus', kernwoorden: ['vernieuwing', 'visie', 'onafhankelijkheid', 'gemeenschap', 'origineel'], positief: 'Origineel, visionair, gericht op het collectief, idealen-gedreven.', schaduw: 'Afstandelijk emotioneel, koppig in idealen, kan zich superieur voelen.', inRelaties: 'Vriendschap is basis. Heeft mentale verbinding nodig én ademruimte.', inWerk: 'Bloeit in tech, sociale innovatie, wetenschap, mensenrechten.' },
  { nlNaam: 'Vissen', enNaam: 'pisces', symbool: '♓', datumVan: '19 feb', datumTot: '20 mrt', element: 'Water', modaliteit: 'Veranderlijk', heerser: 'Neptunus', kernwoorden: ['mededogen', 'intuïtie', 'mystiek', 'kunst', 'grenzeloos'], positief: 'Mededogend, intuïtief, creatief, spiritueel openstaand, helend.', schaduw: 'Verliest grenzen, escapisme, slachtoffer-rol.', inRelaties: 'Diep empathisch en romantisch. Heeft een partner nodig die grenzen biedt zonder te beperken.', inWerk: 'Bloeit in kunst, muziek, therapie, spirituele begeleiding, healing.' },
];

export const ELEMENTEN: Element[] = [
  { naam: 'Vuur', emoji: '🔥', tekens: ['Ram', 'Leeuw', 'Boogschutter'], energie: 'Scheppend, actief, intuïtief, naar buiten gericht', kernkwaliteit: 'Vonk, inspiratie, beweging, zelfexpressie', schaduw: 'Opbrandend, ongeduldig, dominant', behoefte: 'Vrijheid om te bewegen en zichtbaarheid. Worden mat in te beperkte routines.' },
  { naam: 'Aarde', emoji: '🌍', tekens: ['Stier', 'Maagd', 'Steenbok'], energie: 'Stabiel, praktisch, tastbaar, opbouwend', kernkwaliteit: 'Materie, lichamelijkheid, duurzaamheid, betrouwbaarheid', schaduw: 'Vast in patroon, materialistisch, weinig flexibel', behoefte: 'Zekerheid en concrete resultaten. Gedijen op stappen die je kunt zien en aanraken.' },
  { naam: 'Lucht', emoji: '💨', tekens: ['Tweelingen', 'Weegschaal', 'Waterman'], energie: 'Mentaal, communicatief, sociaal, ideeën-gedreven', kernkwaliteit: 'Verbinding via taal en gedachten, perspectief, objectiviteit', schaduw: 'Afstandelijk emotioneel, te in het hoofd, vluchtig', behoefte: 'Mentale prikkels en sociale uitwisseling. Stikken in te zware emotionele dichtheid.' },
  { naam: 'Water', emoji: '💧', tekens: ['Kreeft', 'Schorpioen', 'Vissen'], energie: 'Voelend, intuïtief, verbindend, ondergronds', kernkwaliteit: 'Emotie, empathie, mystiek, diepte', schaduw: 'Stemmingswisselend, verliest grenzen, kan verdrinken in gevoel', behoefte: 'Emotionele veiligheid en intimiteit. Drogen op zonder gevoelsdiepte.' },
];

export const MODALITEITEN: Modaliteit[] = [
  { naam: 'Cardinaal', emoji: '⚡', tekens: ['Ram', 'Kreeft', 'Weegschaal', 'Steenbok'], energie: 'Starten, initiëren, leiden, actie-gericht', kwaliteit: 'Wie begint? Cardinale tekens. Ze starten de seizoenen.', schaduw: 'Beginnen veel maar maken weinig af' },
  { naam: 'Vast', emoji: '🔒', tekens: ['Stier', 'Leeuw', 'Schorpioen', 'Waterman'], energie: 'Stabiliseren, vasthouden, diep focussen', kwaliteit: 'Wie houdt vol? Vaste tekens. Ze stabiliseren het seizoen.', schaduw: 'Koppig, weinig flexibel, weerstand tegen verandering' },
  { naam: 'Veranderlijk', emoji: '🌪️', tekens: ['Tweelingen', 'Maagd', 'Boogschutter', 'Vissen'], energie: 'Aanpassen, communiceren, overgaan, brug-bouwen', kwaliteit: 'Wie verandert? Veranderlijke tekens. Ze vloeien de seizoenen in elkaar.', schaduw: 'Weinig richting, te beweeglijk, moeilijk te vatten' },
];

export const MODULE04_QUIZ: QuizVraag[] = [
  { vraag: 'Welk teken heeft Vuur als element én Cardinale modaliteit?', opties: ['Leeuw', 'Ram', 'Boogschutter', 'Stier'], juist: 1, uitleg: 'Ram = Vuur + Cardinaal. Leeuw = Vuur + Vast. Boogschutter = Vuur + Veranderlijk.' },
  { vraag: 'Heersende planeet van Schorpioen (modern)?', opties: ['Mars', 'Saturnus', 'Pluto', 'Mercurius'], juist: 2, uitleg: 'Pluto (modern). Klassiek was het Mars.' },
  { vraag: 'Welke 3 tekens zijn Watertekens?', opties: ['Ram, Leeuw, Boogschutter', 'Stier, Maagd, Steenbok', 'Tweelingen, Weegschaal, Waterman', 'Kreeft, Schorpioen, Vissen'], juist: 3, uitleg: 'Water: Kreeft, Schorpioen, Vissen.' },
  { vraag: 'Welk teken heeft Veranderlijke modaliteit én Aarde-element?', opties: ['Stier', 'Maagd', 'Steenbok', 'Tweelingen'], juist: 1, uitleg: 'Maagd = Aarde + Veranderlijk.' },
  { vraag: 'Welk teken heeft Venus als heerser (er zijn er twee)?', opties: ['Ram en Mars', 'Stier en Weegschaal', 'Kreeft en Vissen', 'Tweelingen en Maagd'], juist: 1, uitleg: 'Stier (sensueel Venus) en Weegschaal (relationeel Venus).' },
  { vraag: '"Vast Vuur" beschrijft welk teken?', opties: ['Ram', 'Leeuw', 'Boogschutter', 'Kreeft'], juist: 1, uitleg: 'Leeuw = Vuur + Vast.' },
  { vraag: 'Iemand met dominante Lucht-energie heeft behoefte aan:', opties: ['Emotionele veiligheid', 'Mentale prikkels en gesprek', 'Materiële zekerheid', 'Fysieke actie'], juist: 1, uitleg: 'Lucht = mentale verbinding, ideeën, communicatie.' },
  { vraag: 'Heersende planeet van Boogschutter?', opties: ['Mars', 'Jupiter', 'Saturnus', 'Neptunus'], juist: 1, uitleg: 'Jupiter heerst over Boogschutter (ook klassiek).' },
  { vraag: 'Welk teken is Cardinaal Water?', opties: ['Schorpioen', 'Kreeft', 'Vissen', 'Stier'], juist: 1, uitleg: 'Kreeft = Water + Cardinaal.' },
  { vraag: 'Welk element past het best bij "stabiel, praktisch, tastbaar"?', opties: ['Vuur', 'Aarde', 'Lucht', 'Water'], juist: 1, uitleg: 'Aarde = stabiel, praktisch, tastbaar, opbouwend.' },
];
