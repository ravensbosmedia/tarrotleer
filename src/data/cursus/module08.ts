export interface SyntheseStap {
  nummer: number;
  titel: string;
  beschrijving: string;
  details: string[];
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const SYNTHESE_STAPPEN: SyntheseStap[] = [
  {
    nummer: 1,
    titel: 'Verzamel alle data',
    beschrijving: 'Begin met een schone tabel waarin alle berekende getallen + tekens staan. Doe dit EERST, voor je conclusies trekt.',
    details: [
      'Geboortedatum: Levenspad, Bestuursgetal, Levensles, Zielengetal, Geschenk, Verleden, Fundamenten, Projectie, Kern, Doel',
      'Naam: Expression, Personality, Soul, Cornerstone, Capstone, Eerste Klinker',
      'Astrologie: Zonneteken, Element, Maanfase (transit)',
    ],
  },
  {
    nummer: 2,
    titel: 'Zoek patronen (3 soorten)',
    beschrijving: 'Kies 3-5 patronen, niet meer. De rest is achtergrondruis voor deze ene sessie.',
    details: [
      'Herhalingen: welk getal/archetype komt 2+ keer voor? Bv. 7 op Levensles én Geschenk = sterke 7-energie',
      'Overeenstemmingen: numerologie + sterrenbeeld die hetzelfde zeggen. Bv. LP 2 (Diplomaat) + Kreeft (zorg) = dubbelbevestiging',
      'Spanningen: twee getallen die in tegengestelde richting wijzen. Bv. Personality 4 (stabiel buiten) + Soul 3 (creatief verlangen) = conflict',
    ],
  },
  {
    nummer: 3,
    titel: 'Bouw het verhaal in 3 lagen',
    beschrijving: 'Laag 1: wie is deze persoon (50w). Laag 2: werkthema (80w). Laag 3: bruikbaar nu (50w).',
    details: [
      'Laag 1 — Kern (50 woorden): één of twee zinnen over de centrale energie. Concreet, niet generiek.',
      'Laag 2 — Werkthema (80 woorden): de spanning of het groeithema. Benoem OOK de schaduwzijde — geen vleiend verhaal.',
      'Laag 3 — Bruikbaar nu (50 woorden): concrete handelingen of bewustwording. Wat kan de klant morgen al doen?',
    ],
  },
  {
    nummer: 4,
    titel: 'Lees terug en snoei',
    beschrijving: 'Lees je eigen tekst alsof je de klant bent. Doel: max 200 woorden eindversie.',
    details: [
      'Herken ik mezelf? Of voelt het generiek?',
      'Word ik harder als persoon? (Dan was je te oordelend; herschrijven)',
      'Krijg ik iets om mee te doen? (Anders ontbreekt laag 3)',
      'Past de schaduw EVENZEER als het licht? (Anders ben je vleiend, niet eerlijk)',
    ],
  },
];

export const AI_PROMPT_TEKST = `Schrijf een persoonsomschrijving van {naam} (max 200 woorden, in NL).

Basisdata:
- Levenspad {n} ({archetype-naam})
- Bestuursgetal {n}
- Zielengetal {n}
- Expression {n}, Personality {n}, Soul {n}
- Cornerstone {letter}, Capstone {letter}
- Sterrenbeeld {x}, element {y}
- Vraag van de klant: "{vraag}"

Schrijf in 3 lagen:
1. Wie is deze persoon (kern-energie, 1-2 zinnen)
2. Wat is het werk-thema (groei-uitdaging, 3-4 zinnen — benoem ook schaduw)
3. Wat is bruikbaar nu (concreet handvat, 2-3 zinnen)

Toon: warm maar eerlijk. Geen voorspellingen. Spreek niet GENERIEK.
Vermijd: "veel potentieel", "krachtig", "uniek".`;

export const WANNEER_GEEN_AI = [
  'Eerste sessie met klant — schrijf zelf, dan voel je de data beter',
  'Klant in crisis — AI mist nuance',
  'Lastige spanning in de data — vraagt menselijke afweging',
  'Klant heeft trauma rond een thema — AI weet dat niet, jij wel',
];

export const WANNEER_WEL_AI = [
  'Voorbereiding — laat AI een eerste versie maken, bewerk zelf',
  'Veel klanten in korte tijd — efficiency',
  'Tweede mening — vergelijk jouw versie met AI',
  'Schrijfblokkade — AI breekt het op gang, dan neem jij over',
];

export const GOEDE_SYNTHESE_KENMERKEN = [
  { kenmerk: 'Coherent', beschrijving: 'Alle benoemde elementen vormen samen één verhaal, geen losse lijst' },
  { kenmerk: 'Eerlijk', beschrijving: 'Schaduwzijde wordt benoemd, niet weggepoetst' },
  { kenmerk: 'Bruikbaar', beschrijving: 'De klant krijgt handvatten voor wat ze ermee kan' },
  { kenmerk: 'Vibratief juist', beschrijving: 'Voelt herkenbaar, niet generiek' },
  { kenmerk: 'Compact', beschrijving: 'Max 200 woorden mondeling, max 400 voor uitgewerkt portret' },
];

export const MODULE08_QUIZ: QuizVraag[] = [
  { vraag: 'Meest gangbare lengte van een sessie-synthese?', opties: ['50 woorden', '200 woorden', '500 woorden', '1000 woorden'], juist: 1, uitleg: '~200 woorden voor een mondelinge sessie. Max 400 voor een uitgewerkt schriftelijk portret.' },
  { vraag: 'Wat mist in: "Je hebt veel potentieel en bent bijzonder."?', opties: ['Coherentie', 'Eerlijkheid', 'Specificiteit (vibratief juist)', 'Compactheid'], juist: 2, uitleg: '"Potentieel" en "bijzonder" zijn generiek — ze passen op iedereen. Synthese moet specifiek zijn.' },
  { vraag: 'Hoeveel datapunten benoem je in een 200-woord synthese?', opties: ['Alle 20', '10', '3-5', '1'], juist: 2, uitleg: '3-5 sleutelpunten. De rest is achtergrondruis voor die ene sessie.' },
  { vraag: 'Welke patroon-zoekstrategie is NIET geldig?', opties: ['Zoek herhalingen', 'Zoek overeenstemmingen', 'Zoek spanningen', 'Tel alle getallen op tot een totaal'], juist: 3, uitleg: 'Alle getallen optellen heeft geen numerologische zin. Patronen = herhalingen, overeenstemmingen, spanningen.' },
  { vraag: 'Wanneer gebruik je GEEN AI?', opties: ['Bij veel klanten', 'Bij klant in crisis', 'Als voorbereiding', 'Bij schrijfblokkade'], juist: 1, uitleg: 'Klant in crisis vraagt jouw oordeel en nuance — AI mist context en kan onbedoeld schaden.' },
  { vraag: 'Welke laag MIST in: "Maria is een Diplomaat (LP 2) met Stier-energie. Haar thema is balans tussen zorg en eigen behoefte."?', opties: ['Laag 1 (wie is ze)', 'Laag 2 (werk-thema)', 'Laag 3 (bruikbaar nu)', 'Compleet'], juist: 2, uitleg: 'Laag 3 (concreet handvat voor nu) ontbreekt.' },
  { vraag: 'Je schreef: "Frans gaat dit jaar verhuizen." Wat is hier mis?', opties: ['Te lang', 'Het is een voorspelling — numerologie wijst tendensen, geen feiten', 'Geen schaduw', 'Te generiek'], juist: 1, uitleg: 'Numerologie beschrijft tendensen en patronen, voorspelt geen specifieke events.' },
  { vraag: 'Vraag die je jezelf stelt bij het terug-lezen?', opties: ['"Klinkt het slim?"', '"Herken ik mezelf als ik de klant was?"', '"Heb ik alle 20 datapunten?"', '"Meer adjectieven?"'], juist: 1, uitleg: 'Zelfherkenning is de kwaliteitstoets — voelt het specifiek en raak, of generiek?' },
  { vraag: 'Teken van te-veel-vleiend zijn?', opties: ['Wisselende zinslengtes', 'Geen schaduwzijde benoemd', 'Concrete voorbeelden', 'Korte zinnen'], juist: 1, uitleg: 'Geen schaduw = geen geloofwaardigheid. Klanten voelen dat ze een vleiend verkooppraatje krijgen.' },
  { vraag: 'Rol van de adviseur ten opzichte van AI-output?', opties: ['Kopiëren-plakken', 'Generiek gebruiken', 'Ruwe AI-tekst nemen en bewerken naar wat deze klant op deze dag nodig heeft', 'Niet gebruiken'], juist: 2, uitleg: 'AI is grondstof. Jij maakt het persoonlijk, eerlijk en passend.' },
];
