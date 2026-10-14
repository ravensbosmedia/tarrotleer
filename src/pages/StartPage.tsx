import React from 'react';
import { Link } from 'react-router-dom';

const G = {
  goud: '#F1CB78', goudBleek: '#2D2040', goudDonker: '#E0B04A',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040',
  tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};

interface Groep {
  id: string;
  icoon: string;
  titel: string;
  omschrijving: string;
  accent: string;
  links: { to: string; label: string }[];
}

const GROEPEN: Groep[] = [
  {
    id: 'lenormand', icoon: '🃏', titel: 'Lenormand', accent: '#F1CB78',
    omschrijving: '36 heldere, directe kaarten — sterk in combinaties en dagelijkse vragen.',
    links: [
      { to: '/lenormand/leggingen',   label: 'Leggingen' },
      { to: '/lenormand/bibliotheek', label: 'Bibliotheek' },
      { to: '/lenormand/combinaties', label: 'Combinaties' },
      { to: '/lenormand/flashcards',  label: 'Flashcards' },
      { to: '/lenormand/quiz',        label: 'Quiz' },
    ],
  },
  {
    id: 'tarot', icoon: '🔮', titel: 'Tarot', accent: '#7C3AED',
    omschrijving: '78 kaarten met diepe symboliek — van dagkaart tot Keltisch Kruis.',
    links: [
      { to: '/tarot',       label: 'Leggingen' },
      { to: '/bibliotheek', label: 'Bibliotheek' },
      { to: '/flashcards',  label: 'Flashcards' },
      { to: '/quiz',        label: 'Quiz' },
      { to: '/lessen',      label: 'Lessen' },
    ],
  },
  {
    id: 'pendel', icoon: '🔗', titel: 'Pendel', accent: '#0E7490',
    omschrijving: 'Peil ja/nee-vragen en chakra-energie met de pendel.',
    links: [
      { to: '/pendel/lessen',     label: 'Lessen' },
      { to: '/pendel/schijven',   label: 'Schijven' },
      { to: '/pendel/oefeningen', label: 'Oefeningen' },
      { to: '/pendel/chakras',    label: "Chakra's" },
      { to: '/pendel/quiz',       label: 'Quiz' },
    ],
  },
  {
    id: 'numerologie', icoon: '🔢', titel: 'Numerologie', accent: '#B45309',
    omschrijving: 'De getallen achter je naam, geboortedatum en omgeving.',
    links: [
      { to: '/numerologie/analyse',      label: 'Profiel Analyse' },
      { to: '/numerologie/levenspad',    label: 'Levenspad' },
      { to: '/numerologie/naam-analyse', label: 'Naam Analyse' },
      { to: '/numerologie/huisnummer',   label: 'Huisnummer' },
      { to: '/numerologie/mobiel-nummer',label: 'Persoonlijk Jaar' },
    ],
  },
  {
    id: 'astrologie', icoon: '✨', titel: 'Astrologie', accent: '#1D4ED8',
    omschrijving: 'Sterrenbeelden, maanfasen, planeten en geboortehoroscoop.',
    links: [
      { to: '/sterrenbeelden',  label: 'Sterrenbeelden' },
      { to: '/maanfase',        label: 'Maanfase' },
      { to: '/natal',           label: 'Geboortehoroscoop' },
      { to: '/compatibiliteit', label: 'Compatibiliteit' },
    ],
  },
  {
    id: 'spiritueel', icoon: '🕯️', titel: 'Spiritueel', accent: '#9BD49B',
    omschrijving: 'Werk met kristallen en rituelen voor balans en intentie.',
    links: [
      { to: '/kristallen', label: 'Kristallen' },
      { to: '/rituelen',   label: 'Rituelen' },
    ],
  },
  {
    id: 'cursus', icoon: '📚', titel: 'Cursus', accent: '#9333EA',
    omschrijving: 'Gestructureerd leren in 8 modules — van getallen tot synthese.',
    links: [
      { to: '/cursus',           label: 'Overzicht' },
      { to: '/cursus/module-01', label: 'Module 1' },
      { to: '/cursus/module-02', label: 'Module 2' },
      { to: '/cursus/module-03', label: 'Module 3' },
    ],
  },
];

export const StartPage: React.FC = () => {
  return (
    <div style={{ background: G.bg, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        borderBottom: `0.5px solid ${G.rand}`,
        padding: '4rem 2rem 3rem',
        background: 'radial-gradient(circle at 50% 0%, rgba(241,203,120,0.07), transparent 60%)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 46, marginBottom: '0.4rem', opacity: 0.9, fontFamily: 'Georgia, serif' }}>☾</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.18em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            Leerplatform voor jouw spirituele reis
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 46, fontWeight: 400, color: G.tekst, marginBottom: '1rem', lineHeight: 1.15 }}>
            Zen Flow
          </h1>
          <p style={{ fontSize: 19, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            Leer en oefen Lenormand, Tarot, Pendel, Numerologie en Astrologie.
            Kies hieronder een discipline en spring direct naar wat je zoekt.
          </p>
        </div>
      </div>

      {/* Groepen-grid */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '3rem 2rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.4rem' }}>
          {GROEPEN.map((groep) => (
            <div key={groep.id} style={{
              background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 14,
              padding: '1.6rem', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 10px rgba(120,90,10,0.05)',
            }}>
              {/* Kop */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.7rem' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, background: `${groep.accent}14`, border: `0.5px solid ${groep.accent}33`,
                }}>
                  {groep.icoon}
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: G.tekst, margin: 0 }}>
                  {groep.titel}
                </h2>
              </div>

              <p style={{ fontSize: 14, color: G.tekst2, lineHeight: 1.6, marginBottom: '1.1rem', minHeight: 44 }}>
                {groep.omschrijving}
              </p>

              {/* Snelkoppelingen */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: 'auto' }}>
                {groep.links.map((l) => (
                  <Link key={l.to} to={l.to} style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.03em',
                    padding: '6px 13px', borderRadius: 16, textDecoration: 'none',
                    color: G.tekst2, background: G.bg2, border: `0.5px solid ${G.rand}`,
                    transition: 'all 0.14s', whiteSpace: 'nowrap',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${groep.accent}12`;
                      e.currentTarget.style.borderColor = `${groep.accent}55`;
                      e.currentTarget.style.color = groep.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = G.bg2;
                      e.currentTarget.style.borderColor = G.rand;
                      e.currentTarget.style.color = G.tekst2;
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
