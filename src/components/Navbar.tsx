import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const lenormandLinks = [
  { to: '/lenormand/leggingen',  label: 'Leggingen' },
  { to: '/lenormand/bibliotheek',label: 'Bibliotheek' },
  { to: '/lenormand/flashcards', label: 'Flashcards' },
  { to: '/lenormand/quiz',       label: 'Quiz' },
];

const tarotLinks = [
  { to: '/',                  label: 'Leggingen' },
  { to: '/bibliotheek',       label: 'Bibliotheek' },
  { to: '/flashcards',        label: 'Flashcards' },
  { to: '/quiz',              label: 'Quiz' },
  { to: '/lessen',            label: 'Lessen' },
];

const pendelLinks = [
  { to: '/pendel/lessen',     label: 'Lessen' },
  { to: '/pendel/schijven',   label: 'Schijven' },
  { to: '/pendel/oefeningen', label: 'Oefeningen' },
  { to: '/pendel/chakras',    label: "Chakra's" },
  { to: '/pendel/quiz',       label: 'Quiz' },
];

const numerologieLinks = [
  { to: '/numerologie/analyse',        label: 'Profiel Analyse' },
  { to: '/numerologie/levenspad',      label: 'Levenspad' },
  { to: '/numerologie/naam-analyse',   label: 'Naam Analyse' },
  { to: '/numerologie/expressiegetal', label: 'Expressiegetal' },
  { to: '/numerologie/bestuursgetal',  label: 'Bestuursgetal' },
  { to: '/numerologie/huisnummer',     label: 'Huisnummer' },
  { to: '/numerologie/mobiel-nummer',  label: 'Persoonlijk Jaar' },
];

const cursusLinks = [
  { to: '/cursus',             label: 'Overzicht' },
  { to: '/cursus/module-01',   label: 'Module 1: Getallen' },
  { to: '/cursus/module-02',   label: 'Module 2: Naam' },
  { to: '/cursus/module-03',   label: 'Module 3: Letters' },
  { to: '/cursus/module-04',   label: 'Module 4: Sterrenbeelden' },
  { to: '/cursus/module-05',   label: 'Module 5: Maanfasen' },
  { to: '/cursus/module-06',   label: 'Module 6: Planeten' },
  { to: '/cursus/module-07',   label: 'Module 7: Compatibiliteit' },
  { to: '/cursus/module-08',   label: 'Module 8: Synthese' },
];

const astrologieLinks = [
  { to: '/sterrenbeelden',  label: 'Sterrenbeelden' },
  { to: '/maanfase',        label: 'Maanfase' },
  { to: '/natal',           label: 'Geboortehoroscoop' },
  { to: '/compatibiliteit', label: 'Compatibiliteit' },
];

const spiritueelLinks = [
  { to: '/kristallen', label: 'Kristallen' },
  { to: '/rituelen',   label: 'Rituelen' },
];

const G = {
  goud: '#B8860B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#2C2416',
  bg2: '#3A2E1C',
};

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [sectie, setSectie] = useState<'lenormand' | 'tarot' | 'pendel' | 'numerologie' | 'astrologie' | 'spiritueel' | 'cursus'>(() => {
    if (pathname.startsWith('/cursus')) return 'cursus';
    if (pathname.startsWith('/pendel')) return 'pendel';
    if (pathname.startsWith('/numerologie')) return 'numerologie';
    if (pathname.startsWith('/kristallen') || pathname.startsWith('/rituelen')) return 'spiritueel';
    if (pathname.startsWith('/sterrenbeelden') || pathname.startsWith('/maanfase') || pathname.startsWith('/natal') || pathname.startsWith('/compatibiliteit')) return 'astrologie';
    if (pathname.startsWith('/lenormand') || pathname === '/') return 'lenormand';
    return 'tarot';
  });

  const activeLinks =
    sectie === 'lenormand'   ? lenormandLinks   :
    sectie === 'tarot'       ? tarotLinks       :
    sectie === 'numerologie' ? numerologieLinks :
    sectie === 'astrologie'  ? astrologieLinks  :
    sectie === 'spiritueel'  ? spiritueelLinks  :
    sectie === 'cursus'      ? cursusLinks      :
    pendelLinks;

  const tabStyle = (id: 'lenormand' | 'tarot' | 'pendel' | 'numerologie' | 'astrologie' | 'spiritueel' | 'cursus'): React.CSSProperties => ({
    fontFamily: "'Cinzel', serif",
    fontSize: 11,
    letterSpacing: '0.10em',
    padding: '4px 12px',
    borderRadius: 14,
    border: `0.5px solid ${sectie === id ? G.goud : 'rgba(184,134,11,0.25)'}`,
    background: sectie === id ? G.goud : 'transparent',
    color: sectie === id ? '#2C2416' : 'rgba(245,237,216,0.65)',
    cursor: 'pointer',
    transition: 'all 0.18s',
    textTransform: 'uppercase' as const,
  });

  const linkStyle = (to: string): React.CSSProperties => {
    const active = pathname === to || (to !== '/' && to !== '/lenormand/leggingen' && pathname.startsWith(to));
    return {
      fontFamily: "'Cinzel', serif",
      fontSize: 11,
      letterSpacing: '0.07em',
      padding: '5px 11px',
      borderRadius: 16,
      border: `0.5px solid ${active ? G.goud : 'transparent'}`,
      background: active ? 'rgba(184,134,11,0.15)' : 'transparent',
      color: active ? G.goudBleek : 'rgba(245,237,216,0.70)',
      textDecoration: 'none',
      transition: 'all 0.15s',
      whiteSpace: 'nowrap' as const,
    };
  };

  return (
    <nav style={{
      background: G.bg,
      borderBottom: `0.5px solid rgba(184,134,11,0.25)`,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 52 }}>

        {/* Logo */}
        <Link to="/lenormand/leggingen" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 14, letterSpacing: '0.12em',
          color: G.goudBleek,
          textDecoration: 'none', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ fontSize: 16, opacity: 0.85 }}>✦</span>
          Mystieke Kaarten
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          {/* Sectie tabs */}
          <div style={{ display: 'flex', gap: '0.3rem', marginRight: '0.8rem', paddingRight: '0.8rem', borderRight: '0.5px solid rgba(184,134,11,0.2)' }}>
            <button style={tabStyle('lenormand')} onClick={() => setSectie('lenormand')}>Lenormand</button>
            <button style={tabStyle('tarot')} onClick={() => setSectie('tarot')}>Tarot</button>
            <button style={tabStyle('pendel')} onClick={() => setSectie('pendel')}>Pendel</button>
            <button style={tabStyle('numerologie')} onClick={() => setSectie('numerologie')}>Numerologie</button>
            <button style={tabStyle('astrologie')} onClick={() => setSectie('astrologie')}>Astrologie</button>
            <button style={tabStyle('spiritueel')} onClick={() => setSectie('spiritueel')}>Spiritueel</button>
            <button style={tabStyle('cursus')} onClick={() => setSectie('cursus')}>Cursus</button>
          </div>

          {/* Pagina links */}
          {activeLinks.map(l => (
            <Link key={l.to} to={l.to} style={linkStyle(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: G.goudBleek, cursor: 'pointer' }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: G.bg2, borderTop: `0.5px solid rgba(184,134,11,0.2)`, padding: '1rem 1.5rem' }}>
          {/* Sectie tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem' }}>
            <button style={tabStyle('lenormand')} onClick={() => { setSectie('lenormand'); }}>Lenormand</button>
            <button style={tabStyle('tarot')} onClick={() => { setSectie('tarot'); }}>Tarot</button>
            <button style={tabStyle('pendel')} onClick={() => { setSectie('pendel'); }}>Pendel</button>
            <button style={tabStyle('numerologie')} onClick={() => { setSectie('numerologie'); }}>Numerologie</button>
            <button style={tabStyle('astrologie')} onClick={() => { setSectie('astrologie'); }}>Astrologie</button>
            <button style={tabStyle('spiritueel')} onClick={() => { setSectie('spiritueel'); }}>Spiritueel</button>
            <button style={tabStyle('cursus')} onClick={() => { setSectie('cursus'); }}>Cursus</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {activeLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{ ...linkStyle(l.to), display: 'block', padding: '8px 12px' }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
