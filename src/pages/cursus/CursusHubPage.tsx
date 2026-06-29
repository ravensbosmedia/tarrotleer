import React from 'react';
import { Link } from 'react-router-dom';

const G = {
  goud: '#B8860B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#1A1208',
  bg2: '#2C2416',
  bg3: '#3A2E1C',
};

const MODULES = [
  {
    nr: '01',
    titel: 'Geboortedatum-getallen',
    subtitel: '10 getallen uit je geboortedatum',
    beschrijving: 'Leer de 10 fundamentele getallen berekenen die AuraLine haalt uit iemands geboortedatum: van Bestuursgetal tot Doelgetal.',
    path: '/cursus/module-01',
    kleur: '#8B4513',
    emoji: '📅',
    beschikbaar: true,
    lessen: 10,
  },
  {
    nr: '02',
    titel: 'Naam-getallen',
    subtitel: 'Expression, Personality & Soul',
    beschrijving: 'De Pythagoreaanse letterwaardetabel. Bereken de 3 naam-getallen die laten zien hoe iemand zich uitdrukt, overkomt en wat zij/hij diep verlangt.',
    path: '/cursus/module-02',
    kleur: '#2E5090',
    emoji: '✍️',
    beschikbaar: true,
    lessen: 3,
  },
  {
    nr: '03',
    titel: 'Letter-analyse',
    subtitel: 'Cornerstone, Capstone & Eerste Klinker',
    beschrijving: 'De 3 sleutelposities in een naam plus de symbolische betekenis van alle 26 letters A t/m Z.',
    path: '/cursus/module-03',
    kleur: '#5C3070',
    emoji: '🔤',
    beschikbaar: true,
    lessen: 29,
  },
  {
    nr: '04',
    titel: 'Sterrenbeelden',
    subtitel: '12 tekens, 4 elementen, 3 modaliteiten',
    beschrijving: 'Alle 12 zonnetekens met hun energie, element, modaliteit en heersende planeet. Hoe combineer je sterrenbeelden met numerologie?',
    path: '/cursus/module-04',
    kleur: '#1A5C3A',
    emoji: '♈',
    beschikbaar: true,
    lessen: 12,
  },
  {
    nr: '05',
    titel: 'Maanfasen',
    subtitel: '8 fasen van de maancyclus',
    beschrijving: 'De spirituele werking van de 8 maanfasen. Hoe pas je de maanfase toe in een advies-sessie?',
    path: '/cursus/module-05',
    kleur: '#1A3A5C',
    emoji: '🌕',
    beschikbaar: true,
    lessen: 8,
  },
  {
    nr: '06',
    titel: 'Planeten',
    subtitel: '10 planeten — persoonlijk & transpersoonlijk',
    beschrijving: '7 klassieke + 3 moderne planeten. Wat vertelt elke planeet over iemands energie, levensgebied en ontwikkelingsthema?',
    path: '/cursus/module-06',
    kleur: '#5C1A1A',
    emoji: '🪐',
    beschikbaar: true,
    lessen: 10,
  },
  {
    nr: '07',
    titel: 'Numerologische Compatibiliteit',
    subtitel: 'Levenspad-combinaties & scores',
    beschrijving: 'De AuraLine compatibiliteits-matrix. Welke Levenspad-combinaties zijn hoog, medium of uitdagend — en wat betekent dat echt?',
    path: '/cursus/module-07',
    kleur: '#8B4570',
    emoji: '💞',
    beschikbaar: true,
    lessen: 13,
  },
  {
    nr: '08',
    titel: 'Synthese',
    subtitel: 'Van data naar verhaal',
    beschrijving: 'Het moeilijkste vak: alle losse berekeningen samenvoegen tot één coherente, eerlijke en bruikbare persoonsomschrijving.',
    path: '/cursus/module-08',
    kleur: '#5C5C1A',
    emoji: '✨',
    beschikbaar: true,
    lessen: 4,
  },
];

export const CursusHubPage: React.FC = () => {
  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>✦</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, color: G.goud, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            AuraLine Cursus
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.70)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Leerplatform voor adviseurs. Leer alle berekeningen, betekenissen en technieken die AuraLine gebruikt — zodat je de output kunt duiden en uitleggen.
          </p>
        </div>

        {/* Werkvolgorde */}
        <div style={{ background: 'rgba(184,134,11,0.08)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goud, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Aanbevolen werkvolgorde</p>
          <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.7, margin: 0 }}>
            Start met <strong style={{ color: G.goudBleek }}>Module 1-3</strong> voor je eigen geboortedatum + naam →
            doe <strong style={{ color: G.goudBleek }}>Module 4-6</strong> voor astrologische context →
            <strong style={{ color: G.goudBleek }}> Module 7</strong> voor compatibiliteit →
            sluit af met <strong style={{ color: G.goudBleek }}>Module 8</strong> om alles samen te brengen.
          </p>
        </div>

        {/* Module grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {MODULES.map((mod) => (
            <Link
              key={mod.nr}
              to={mod.path}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: G.bg2,
                border: `0.5px solid rgba(184,134,11,0.20)`,
                borderRadius: 12,
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = G.goud; (e.currentTarget as HTMLElement).style.background = G.bg3; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,11,0.20)'; (e.currentTarget as HTMLElement).style.background = G.bg2; }}
              >
                {/* Module nummer + emoji */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: 10,
                    background: mod.kleur + '33',
                    border: `1px solid ${mod.kleur}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {mod.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Module {mod.nr}
                    </div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goudBleek, lineHeight: 1.3 }}>
                      {mod.titel}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'rgba(184,134,11,0.75)', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}>
                  {mod.subtitel}
                </p>

                <p style={{ fontSize: 13.5, color: 'rgba(245,237,216,0.70)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                  {mod.beschrijving}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'rgba(245,237,216,0.40)' }}>
                    {mod.lessen} {mod.lessen === 1 ? 'les' : 'lessen'}
                  </span>
                  <span style={{ fontSize: 12, color: G.goud, fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}>
                    Start →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '3rem', textAlign: 'center', color: 'rgba(245,237,216,0.35)', fontSize: 12 }}>
          <p>Elke module heeft theorie, berekening, voorbeeld, oefeningen en een quiz.</p>
        </div>
      </div>
    </div>
  );
};
