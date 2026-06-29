import { LenormandSpread } from '../../types/lenormand';

export const lenormandSpreads: LenormandSpread[] = [
  {
    id: 'dag',
    naam: 'Dagkaart',
    aantalKaarten: 1,
    beschrijving: 'Trek één kaart als boodschap of thema voor vandaag. Ideaal voor dagelijkse reflectie.',
    posities: ['De boodschap van vandaag'],
  },
  {
    id: 'drie',
    naam: '3 Kaarten',
    aantalKaarten: 3,
    beschrijving: 'Verleden · Heden · Toekomst. Of: Situatie · Advies · Uitkomst. Een klassieke Lenormand-lijn.',
    posities: ['Verleden / Situatie', 'Heden / Advies', 'Toekomst / Uitkomst'],
  },
  {
    id: 'vijf',
    naam: '5 Kaarten',
    aantalKaarten: 5,
    beschrijving: 'Een Lenormand-lijn van 5: de middelste kaart is het thema, links en rechts geven context en uitkomst.',
    posities: ['Verre achtergrond', 'Directe context', 'Kern / Thema', 'Advies', 'Uitkomst'],
  },
  {
    id: 'tableau',
    naam: 'Grand Tableau',
    aantalKaarten: 36,
    beschrijving: 'Alle 36 kaarten uitgelegd in een 9×4 raster. De klassieke Lenormand-methode voor een volledig levensoverzicht.',
    posities: Array.from({ length: 36 }, (_, i) => `Positie ${i + 1}`),
  },
];
