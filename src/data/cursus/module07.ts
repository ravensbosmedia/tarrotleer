export interface CompatibiliteitCombinatie {
  combinatie: string;
  score: 'Hoog' | 'Medium' | 'Uitdagend';
  titel: string;
  waarom: string;
  valkuil: string;
  advies: string;
}

export interface QuizVraag {
  vraag: string;
  opties: string[];
  juist: number;
  uitleg: string;
}

export const MATRIX: CompatibiliteitCombinatie[] = [
  { combinatie: 'Zelfde Levenspad', score: 'Hoog', titel: 'Gedeeld begrip', waarom: 'Beide mensen begrijpen vanaf de eerste minuut wat de ander beweegt. Wereldvisie matcht diep.', valkuil: 'Weinig wrijving = weinig groei. Kan stagneren of "gezellig oppervlakkig" worden. Twee 4\'en vergeten te spelen; twee 5\'en landen nergens.', advies: 'Bewust ruimte maken voor groei buiten de gedeelde zone.' },
  { combinatie: '1 + 9', score: 'Hoog', titel: 'Pionier + Oude Ziel', waarom: 'Scheppen + voltooien is de complete cyclus. De 1 begint, de 9 rondt af. Beiden hebben een groot "waarom".', valkuil: '1 wil altijd nieuw, 9 wil afronden — kan botsen bij beslissingen. 1 vindt 9 soms te zwaar; 9 vindt 1 soms te oppervlakkig.', advies: 'Elkaars cyclus respecteren. 1 leert afronden is waardevol; 9 leert nieuw beginnen is oké.' },
  { combinatie: '2 + 4', score: 'Hoog', titel: 'Diplomaat + Bouwer', waarom: '2 brengt harmonie, 4 brengt structuur. Samen: een warm thuis op stevige grond.', valkuil: 'Kan saai worden — veiligheid boven avontuur. Beiden conflictvermijdend.', advies: 'Bewust nieuwe ervaringen opzoeken om uit comfort-zone te treden.' },
  { combinatie: '2 + 8', score: 'Hoog', titel: 'Diplomaat + Manifest', waarom: '2\'s warmte ondersteunt 8\'s ambitie. 8 zorgt voor het materiële, 2 zorgt voor het emotionele.', valkuil: '8 kan 2 overrompelen met drive; 2 kan zich klein voelen naast 8\'s autoriteit.', advies: '8 leert luisteren naar 2\'s wijsheid; 2 leert haar/zijn behoeften benoemen.' },
  { combinatie: '3 + 6', score: 'Hoog', titel: 'Creatief + Zorgend', waarom: '3 brengt vreugde en expressie, 6 brengt warmte en zorg. Samen: een huis vol kunst en gezelligheid.', valkuil: '6 kan 3 willen "opvoeden"; 3 kan 6 verveelend vinden.', advies: 'Ruimte voor beide modi — 3 mag spelen, 6 mag zorgen.' },
  { combinatie: '3 + 9', score: 'Hoog', titel: 'Creatief + Universeel', waarom: 'Beide kunstzinnig en betekenis-zoekend. Samen: groot creatief project of gedeeld idealisme.', valkuil: 'Beiden vluchten in dromen — wie doet de afwas? Praktische zaken kunnen blijven liggen.', advies: 'Bewust 1 nuchtere partner-rol delen.' },
  { combinatie: '5 + 7', score: 'Medium', titel: 'Avonturier + Zoeker', waarom: 'Beide non-conformistisch op verschillende manieren. 5 zoekt buiten, 7 zoekt binnen.', valkuil: '5 wil reizen + ervaringen, 7 wil stilte + studie. Een vakantie samen kan al een test zijn.', advies: 'Elkaars manier van zoeken respecteren. 5 leert: innerlijk reizen is ook avontuur; 7 leert: ervaring brengt ook wijsheid.' },
  { combinatie: '1 + 5', score: 'Medium', titel: 'Pionier + Avonturier', waarom: 'Beide vrij, beide initiatief-nemend. Veel energie samen.', valkuil: '1 wil leiden, 5 wil zwerven. Geen van beiden wil zich settelen.', advies: 'Beide ruimte voor eigen koers — geen "we doen alles samen".' },
  { combinatie: '4 + 8', score: 'Medium', titel: 'Bouwer + Manifest', waarom: 'Beide ambitieus en gericht op resultaat. Bouwen samen iets blijvends.', valkuil: 'Beide kunnen workaholic worden. Emoties krijgen weinig ruimte.', advies: 'Bewust tijd voor speelsheid en intimiteit.' },
  { combinatie: '6 + 9', score: 'Medium', titel: 'Zorgend + Universeel', waarom: 'Beiden willen dienen en betekenisvol bezig zijn. Gedeelde idealen.', valkuil: 'Beide kunnen zichzelf wegcijferen — wie zorgt voor het paar zelf?', advies: 'Bewuste ruimte voor "wij twee" — niet alle energie naar buiten.' },
  { combinatie: '1 + 4', score: 'Uitdagend', titel: 'Pionier vs Bouwer', waarom: 'Tegengestelde grondhoudingen kunnen leerrijke aanvulling zijn.', valkuil: '1 wil meteen, 4 wil eerst plan. 1 vindt 4 traag; 4 vindt 1 roekeloos.', advies: 'De 1 kan met de 4 langere termijn dingen bouwen; de 4 kan met de 1 nieuwe richting kiezen. Duidelijke afspraken over wie wat beslist.' },
  { combinatie: '2 + 5', score: 'Uitdagend', titel: 'Diplomaat vs Avonturier', waarom: 'Tegengestelde basisbehoeften: veiligheid versus vrijheid.', valkuil: '2 voelt zich verlaten als 5 wegrent; 5 voelt zich opgesloten als 2 te dichtbij komt.', advies: 'Werkt alleen met expliciete commitment-gesprekken — "wat vragen we van elkaar?".' },
  { combinatie: '3 + 8', score: 'Uitdagend', titel: 'Creatief vs Manifest', waarom: 'Als beiden elkaar als bondgenoot zien kan dit een krachtig partnerschap zijn.', valkuil: '8 vindt 3 te onserieus; 3 voelt zich gekooid door 8\'s plicht.', advies: '3 maakt 8\'s leven lichter (humor, kleur); 8 helpt 3 creatief talent in concrete vorm te zetten.' },
];

export const MODULE07_QUIZ: QuizVraag[] = [
  { vraag: 'Welk getal gebruikt AuraLine als basis voor compatibiliteits-berekening?', opties: ['Expression Number', 'Levenspad', 'Soul Number', 'Zonneteken'], juist: 1, uitleg: 'Levenspad is het meest fundamentele getal — hoofdles van het leven.' },
  { vraag: 'Combinatie 2 + 4 wordt geclassificeerd als:', opties: ['Hoog', 'Medium', 'Uitdagend', 'Neutraal'], juist: 0, uitleg: '2 + 4 = Hoog. Diplomaat + Bouwer = harmonie + structuur.' },
  { vraag: 'Combinatie 1 + 4 wordt geclassificeerd als:', opties: ['Hoog', 'Medium', 'Uitdagend', 'Hoog vanwege gedeeld initiatief'], juist: 2, uitleg: '1 + 4 = Uitdagend. Vrijheid (1) versus structuur (4) botsen fundamenteel.' },
  { vraag: 'Wat is de juiste interpretatie van een "Uitdagende" score?', opties: ['De relatie gaat falen', 'De partners moeten uit elkaar', 'Veel groei mogelijk, vraagt bewust werk', 'Negeer deze klanten'], juist: 2, uitleg: 'Uitdagend = tegengestelde grondhouding, maar veel groeipotentieel als beiden reflecteren.' },
  { vraag: 'Twee mensen met hetzelfde Levenspad — score?', opties: ['Altijd hoog', 'Altijd uitdagend', 'Hoog volgens AuraLine', 'Niet in matrix'], juist: 2, uitleg: 'Zelfde Levenspad = Hoog (gedeeld begrip). Risico: te weinig wrijving.' },
  { vraag: 'Frans (Levenspad 2) + Partner (Levenspad 8):', opties: ['Hoog', 'Medium', 'Uitdagend', 'Onmogelijk'], juist: 0, uitleg: '2 + 8 = Hoog. Diplomaat + Manifest.' },
  { vraag: 'Klant: "Onze match is laag, we moeten stoppen." Beste reactie?', opties: ['"Ja, helaas"', '"De matrix toont een dynamiek, geen oordeel — relaties hangen af van hoe je met verschillen omgaat"', '"Probeer eerst astrologie"', '"Bereken opnieuw"'], juist: 1, uitleg: 'Compatibiliteits-scores zijn gespreksopdeners, geen voorspellingen.' },
  { vraag: 'Bij meestergetal-Levenspad (11 of 22) in AuraLine\'s matrix:', opties: ['Eigen unieke combinaties', 'Reduceert naar gewoon cijfer (11→2, 22→4)', 'Negeert de match', 'Markeert altijd hoog'], juist: 1, uitleg: 'AuraLine reduceert voor matrix-lookup, maar de meester-laag blijft in je analyse.' },
  { vraag: 'Naast Levenspad — welk getal geeft een dieper compat.-beeld?', opties: ['Bestuursgetal', 'Verledengetal', 'Soul Number', 'Capstone-letter'], juist: 2, uitleg: 'Soul Number geeft de diepste verlangen-laag — versterkt of verzacht de LP-match.' },
  { vraag: 'Combinatie 3 + 9 — wat mist er praktisch?', opties: ['Beide te serieus', 'Beide te creatief en idealistisch — wie doet het dagelijkse werk?', 'Te veel structuur', 'Te weinig empathie'], juist: 1, uitleg: '3 + 9 = Hoog qua vibe, maar beiden vluchten in dromen. Praktische taken blijven liggen.' },
];
