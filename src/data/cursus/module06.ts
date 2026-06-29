export interface Planeet {
  naam: string;
  symbool: string;
  type: 'klassiek (lichtbron)' | 'klassiek (binnenplaneet)' | 'klassiek (buitenplaneet)' | 'klassiek (sociale planeet)' | 'modern (transpersoonlijk)';
  categorie: 'persoonlijk' | 'sociaal' | 'transpersoonlijk';
  snelheid: string;
  regeert: string;
  huis: string;
  energie: string;
  levensgebied: string;
  positief: string;
  schaduw: string;
  inEenChart: string;
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const PLANETEN: Planeet[] = [
  {
    naam: 'Zon',
    symbool: '☉',
    type: 'klassiek (lichtbron)',
    categorie: 'persoonlijk',
    snelheid: '1 teken per maand (12 maanden voor volledige ronde)',
    regeert: 'Leeuw',
    huis: '5e Huis',
    energie: 'Het centrale "ik" — vitaliteit, doel, eigen identiteit, levenskracht',
    levensgebied: 'Zelfexpressie, vader-archetype, creativiteit, leiderschap, gezondheid (hart)',
    positief: 'Stralend, levend, doelbewust, vrijgevig',
    schaduw: 'IJdel, dominant, ego-gedreven',
    inEenChart: 'Je zonneteken (Module 4) is hoe je Zon-energie zich uitdrukt — wat geeft je leven licht?',
  },
  {
    naam: 'Maan',
    symbool: '☽',
    type: 'klassiek (lichtbron)',
    categorie: 'persoonlijk',
    snelheid: '1 teken per ~2.5 dagen (28 dagen voor volledige ronde)',
    regeert: 'Kreeft',
    huis: '4e Huis',
    energie: 'Emotie, intuïtie, instinct, behoefte aan veiligheid, moeder-archetype',
    levensgebied: 'Familie, thuis, kinderjaren, gewoonten, automatische reacties',
    positief: 'Empathisch, beschermend, intuïtief, gevoelig',
    schaduw: 'Stemmingswisselend, defensief, vasthoudend aan oude pijn',
    inEenChart: 'Je Maanteken (vraagt geboortetijd voor exactheid) toont je emotionele binnenwereld — hoe je je veilig voelt.',
  },
  {
    naam: 'Mercurius',
    symbool: '☿',
    type: 'klassiek (binnenplaneet)',
    categorie: 'persoonlijk',
    snelheid: '~88 dagen rond Zon, vaak retrograde (~3x per jaar)',
    regeert: 'Tweelingen + Maagd',
    huis: '3e + 6e Huis',
    energie: 'Geest, taal, denken, leren, kort transport, broers/zussen',
    levensgebied: 'Communicatie, studie, dagelijks contact, mentale processen',
    positief: 'Spitsvondig, leergierig, communicatief, analytisch',
    schaduw: 'Vluchtig, manipulatief in taal, te in het hoofd',
    inEenChart: 'Mercurius retrograde (3x per jaar ~3 weken) = communicatie-haperingen. Voorzichtig met contracten en beslissingen.',
  },
  {
    naam: 'Venus',
    symbool: '♀',
    type: 'klassiek (binnenplaneet)',
    categorie: 'persoonlijk',
    snelheid: '~225 dagen rond Zon',
    regeert: 'Stier + Weegschaal',
    huis: '2e + 7e Huis',
    energie: 'Verbinding, schoonheid, plezier, geld als waarde',
    levensgebied: 'Liefdesrelaties, esthetiek, kunst, persoonlijk inkomen',
    positief: 'Charmant, harmoniezoekend, esthetisch, sensueel',
    schaduw: 'Materialistisch, oppervlakkig charmant, conflictvermijdend',
    inEenChart: 'Je Venus-teken toont WAT en HOE je liefhebt. Venus in Stier = tastbaar comfort; Venus in Waterman = vriendschap en vrijheid.',
  },
  {
    naam: 'Mars',
    symbool: '♂',
    type: 'klassiek (buitenplaneet)',
    categorie: 'persoonlijk',
    snelheid: '~687 dagen (bijna 2 jaar) rond Zon',
    regeert: 'Ram (modern) / Schorpioen (klassiek)',
    huis: '1e + 8e Huis',
    energie: 'Strijd, fysieke energie, seksuele drift, doelgerichte actie',
    levensgebied: 'Sport, conflict, beslissingen, mannelijkheid (in iedereen)',
    positief: 'Daadkrachtig, moedig, gepassioneerd, eerlijk',
    schaduw: 'Agressief, ongeduldig, conflict-zoekend, impulsief',
    inEenChart: 'Je Mars-teken toont hoe je actie onderneemt en vecht. Mars in Stier = traag maar onstuitbaar; Mars in Tweelingen = via woorden.',
  },
  {
    naam: 'Jupiter',
    symbool: '♃',
    type: 'klassiek (sociale planeet)',
    categorie: 'sociaal',
    snelheid: '~12 jaar rond Zon (1 jaar per teken)',
    regeert: 'Boogschutter (modern) / Vissen (klassiek)',
    huis: '9e + 12e Huis',
    energie: 'Groei, ruimdenkendheid, hoger onderwijs, betekenis, optimisme',
    levensgebied: 'Filosofie, reizen, hoger onderwijs, wet, religie/spiritualiteit, overvloed',
    positief: 'Optimistisch, gul, ruimdenkend, betekenis-gevend',
    schaduw: 'Overmoedig, overbeloven, dogmatisch, overdaad',
    inEenChart: 'Je Jupiter-teken toont waar je natuurlijk groei en geluk ervaart. Jupiter wisselt elk jaar van teken.',
  },
  {
    naam: 'Saturnus',
    symbool: '♄',
    type: 'klassiek (sociale planeet)',
    categorie: 'sociaal',
    snelheid: '~29.5 jaar rond Zon (~2.5 jaar per teken)',
    regeert: 'Steenbok (modern) / Waterman (klassiek)',
    huis: '10e + 11e Huis',
    energie: 'Verantwoordelijkheid, autoriteit, structuur, tijd, beperking',
    levensgebied: 'Carrière, autoriteit, regels, plicht, ouderdom, lange-termijn-werk',
    positief: 'Volwassen, verantwoordelijk, doorzettend, betrouwbaar',
    schaduw: 'Streng, somber, ploegerig, te plichtsbewust',
    inEenChart: 'Saturn-return (rond 28-30 jaar en 58-60 jaar) = Saturnus keert terug op geboorteplaats. Vaak crisis + groei.',
  },
  {
    naam: 'Uranus',
    symbool: '♅',
    type: 'modern (transpersoonlijk)',
    categorie: 'transpersoonlijk',
    snelheid: '~84 jaar rond Zon (~7 jaar per teken)',
    regeert: 'Waterman',
    huis: '11e Huis',
    energie: 'Onverwacht, rebellie, originaliteit, technologie, plotse veranderingen',
    levensgebied: 'Sociale vernieuwing, technologie, doorbraken, vriendschap, vrijheidsdrang',
    positief: 'Origineel, visionair, vrij denkend, vernieuwend',
    schaduw: 'Chaotisch, afstandelijk emotioneel, rebellerend zonder doel',
    inEenChart: 'Generatie-planeet (~7 jaar per teken). Uranus-transit = plotse verandering.',
  },
  {
    naam: 'Neptunus',
    symbool: '♆',
    type: 'modern (transpersoonlijk)',
    categorie: 'transpersoonlijk',
    snelheid: '~165 jaar rond Zon (~14 jaar per teken)',
    regeert: 'Vissen',
    huis: '12e Huis',
    energie: 'Spirituele zoektocht, mystiek, kunst, escapisme, ego-oplossing',
    levensgebied: 'Spiritualiteit, kunst, mystiek, verslaving, dromen',
    positief: 'Mededogend, mystiek, kunstzinnig, intuïtief',
    schaduw: 'Verwarrend, escapistisch, verslaving-gevoelig, slachtoffer-rol',
    inEenChart: 'Generatie-planeet (~14 jaar). Bewustzijn van Neptunus-aspecten helpt verslaving te voorkomen.',
  },
  {
    naam: 'Pluto',
    symbool: '♇',
    type: 'modern (transpersoonlijk)',
    categorie: 'transpersoonlijk',
    snelheid: '~248 jaar rond Zon (~20+ jaar per teken)',
    regeert: 'Schorpioen',
    huis: '8e Huis',
    energie: 'Diepe transformatie, macht en onmacht, taboes, het onbewuste, regeneratie',
    levensgebied: 'Geheime krachten, controle/macht, intieme transformatie, diepe psychologische processen',
    positief: 'Transformatief, scherpzinnig, regeneratief, moedig in het diepe',
    schaduw: 'Manipulatief, macht-spelen, obsessief, destructief',
    inEenChart: 'Sterkste generatie-planeet (20+ jaar per teken). Plutonische transits zijn langdurig en transformerend.',
  },
];

export const MODULE06_QUIZ: QuizVraag[] = [
  { vraag: 'Welke planeet regeert Leeuw?', opties: ['Maan', 'Zon', 'Mars', 'Jupiter'], juist: 1, uitleg: 'Zon regeert Leeuw.' },
  { vraag: 'Welke planeet wordt vaak retrograde en verstoort communicatie?', opties: ['Venus', 'Mars', 'Mercurius', 'Jupiter'], juist: 2, uitleg: 'Mercurius retrograde (3x per jaar, ~3 weken).' },
  { vraag: 'Hoe lang doet Saturnus over één teken?', opties: ['1 jaar', '~2.5 jaar', '~7 jaar', '~14 jaar'], juist: 1, uitleg: 'Saturnus = ~2.5 jaar per teken (30 jaar / 12 tekens).' },
  { vraag: 'Welke 3 planeten zijn "transpersoonlijk" (generatie-gebonden)?', opties: ['Mars, Jupiter, Saturnus', 'Zon, Maan, Mercurius', 'Uranus, Neptunus, Pluto', 'Venus, Mars, Saturnus'], juist: 2, uitleg: 'Uranus, Neptunus, Pluto zijn transpersoonlijk.' },
  { vraag: 'Rond welke leeftijd gebeurt de eerste Saturn-return?', opties: ['18', '28-30', '40', '50'], juist: 1, uitleg: 'Eerste Saturn-return bij ~28-30 jaar. Tweede bij ~58-60 jaar.' },
  { vraag: 'Welke planeet regeert Kreeft?', opties: ['Zon', 'Maan', 'Venus', 'Neptunus'], juist: 1, uitleg: 'Maan regeert Kreeft.' },
  { vraag: 'Wat symboliseert Venus in een chart?', opties: ['Strijd en actie', 'Liefde, waarde, schoonheid', 'Discipline en plicht', 'Mystiek'], juist: 1, uitleg: 'Venus = verbinding, schoonheid, wat je waardeert en aantrekt.' },
  { vraag: 'Pluto wisselt ongeveer hoe vaak van teken?', opties: ['Elk jaar', 'Elke 2 jaar', 'Elke 7 jaar', 'Elke 20+ jaar'], juist: 3, uitleg: 'Pluto = traagste, 20+ jaar per teken.' },
  { vraag: 'Welke planeet leidt "plotse veranderingen en rebellie" in?', opties: ['Saturnus', 'Uranus', 'Maan', 'Mars'], juist: 1, uitleg: 'Uranus = onverwacht, rebellie, vernieuwing.' },
  { vraag: 'Welke planeet symboliseert "expansie, geluk en betekenis"?', opties: ['Saturnus', 'Mars', 'Jupiter', 'Venus'], juist: 2, uitleg: 'Jupiter = expansie, geluk, ruimdenkendheid.' },
];
