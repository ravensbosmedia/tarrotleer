import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useAccount, uitloggen, ABONNEMENT_LABEL } from '../lib/account';

interface NavLink { to: string; label: string }
interface Sectie {
  id: string;
  label: string;
  match: (p: string) => boolean;
  links: NavLink[];
}

const SECTIES: Sectie[] = [
  {
    id: 'lenormand', label: 'Lenormand',
    match: (p) => p.startsWith('/lenormand'),
    links: [
      { to: '/lenormand/leggingen',   label: 'Leggingen' },
      { to: '/lenormand/bibliotheek', label: 'Bibliotheek' },
      { to: '/lenormand/combinaties', label: 'Combinaties' },
      { to: '/lenormand/flashcards',  label: 'Flashcards' },
      { to: '/lenormand/quiz',        label: 'Quiz' },
    ],
  },
  {
    id: 'tarot', label: 'Tarot',
    match: (p) => p.startsWith('/tarot') || p.startsWith('/reading') ||
      ['/bibliotheek', '/flashcards', '/quiz', '/lessen'].includes(p),
    links: [
      { to: '/tarot',       label: 'Leggingen' },
      { to: '/bibliotheek', label: 'Bibliotheek' },
      { to: '/flashcards',  label: 'Flashcards' },
      { to: '/quiz',        label: 'Quiz' },
      { to: '/lessen',      label: 'Lessen' },
    ],
  },
  {
    id: 'pendel', label: 'Pendel',
    match: (p) => p.startsWith('/pendel'),
    links: [
      { to: '/pendel/lessen',     label: 'Lessen' },
      { to: '/pendel/schijven',   label: 'Schijven' },
      { to: '/pendel/oefeningen', label: 'Oefeningen' },
      { to: '/pendel/chakras',    label: "Chakra's" },
      { to: '/pendel/quiz',       label: 'Quiz' },
    ],
  },
  {
    id: 'numerologie', label: 'Numerologie',
    match: (p) => p.startsWith('/numerologie'),
    links: [
      { to: '/numerologie/analyse',        label: 'Profiel Analyse' },
      { to: '/numerologie/levenspad',      label: 'Levenspad' },
      { to: '/numerologie/naam-analyse',   label: 'Naam Analyse' },
      { to: '/numerologie/expressiegetal', label: 'Expressiegetal' },
      { to: '/numerologie/bestuursgetal',  label: 'Bestuursgetal' },
      { to: '/numerologie/huisnummer',     label: 'Huisnummer' },
      { to: '/numerologie/mobiel-nummer',  label: 'Persoonlijk Jaar' },
    ],
  },
  {
    id: 'astrologie', label: 'Astrologie',
    match: (p) => ['/sterrenbeelden', '/maanfase', '/natal', '/compatibiliteit'].includes(p),
    links: [
      { to: '/sterrenbeelden',  label: 'Sterrenbeelden' },
      { to: '/maanfase',        label: 'Maanfase' },
      { to: '/natal',           label: 'Geboortehoroscoop' },
      { to: '/compatibiliteit', label: 'Compatibiliteit' },
    ],
  },
  {
    id: 'spiritueel', label: 'Spiritueel',
    match: (p) => p.startsWith('/kristallen') || p.startsWith('/rituelen'),
    links: [
      { to: '/kristallen', label: 'Kristallen' },
      { to: '/rituelen',   label: 'Rituelen' },
    ],
  },
  {
    id: 'cursus', label: 'Cursus',
    match: (p) => p.startsWith('/cursus') || p.startsWith('/academie'),
    links: [
      { to: '/academie',         label: 'Spirituele Academie' },
      { to: '/cursus',           label: 'Overzicht' },
      { to: '/cursus/module-01', label: 'Module 1: Getallen' },
      { to: '/cursus/module-02', label: 'Module 2: Naam' },
      { to: '/cursus/module-03', label: 'Module 3: Letters' },
      { to: '/cursus/module-04', label: 'Module 4: Sterrenbeelden' },
      { to: '/cursus/module-05', label: 'Module 5: Maanfasen' },
      { to: '/cursus/module-06', label: 'Module 6: Planeten' },
      { to: '/cursus/module-07', label: 'Module 7: Compatibiliteit' },
      { to: '/cursus/module-08', label: 'Module 8: Synthese' },
    ],
  },
];

const G = {
  goud: '#F1CB78', goudBleek: '#FFF3DF', goudDonker: '#E0B04A',
  bg: '#0C0A20', bg2: '#20162F', bg3: '#17112C',
};

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);   // welke desktop-dropdown is open
  const [mobiel, setMobiel] = useState(false);             // mobiel menu open?
  const [mobielSectie, setMobielSectie] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { lid } = useAccount();
  const sluitTimer = useRef<number | null>(null);   // vertraagd sluiten bij mouseleave
  const hoverOpenTijd = useRef(0);                  // moment waarop hover het menu opende

  const annuleerSluiten = () => {
    if (sluitTimer.current !== null) { window.clearTimeout(sluitTimer.current); sluitTimer.current = null; }
  };
  const openSectie = (id: string) => {
    annuleerSluiten();
    if (open !== id) { hoverOpenTijd.current = Date.now(); setOpen(id); }
  };
  const sluitVertraagd = (id: string) => {
    annuleerSluiten();
    sluitTimer.current = window.setTimeout(() => setOpen((cur) => (cur === id ? null : cur)), 250);
  };
  // Klik op de knop: niet meteen weer dichtklappen als hover (of een tik op touch) hem net opende
  const klikSectie = (id: string) => {
    annuleerSluiten();
    if (open === id && Date.now() - hoverOpenTijd.current > 400) setOpen(null);
    else setOpen(id);
  };
  useEffect(() => annuleerSluiten, []);

  const activeId = SECTIES.find((s) => s.match(pathname))?.id ?? null;

  // Sluit menu's bij navigatie
  useEffect(() => { setOpen(null); setMobiel(false); }, [pathname]);

  // Sluit desktop-dropdown bij klik buiten de nav
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const linkActief = (to: string) =>
    pathname === to || (to !== '/' && pathname.startsWith(to));

  return (
    <nav ref={navRef} style={{
      background: G.bg,
      borderBottom: `1px solid rgba(232,182,110,0.4)`,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 56 }}>

        {/* Logo → startpagina */}
        <Link to="/" style={{
          fontFamily: "Georgia, serif", fontSize: 18, letterSpacing: '1.8px',
          color: '#F5D392', textDecoration: 'none', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '0.45rem', lineHeight: 1,
        }}>
          <span style={{ fontSize: 30 }}>☾</span>
          <span>ZEN FLOW<small style={{ display: 'block', fontSize: 10, letterSpacing: '2.5px', marginTop: 4, opacity: 0.85 }}>LEEROMGEVING</small></span>
        </Link>

        {/* Desktop: top-level secties met dropdowns */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.15rem', marginLeft: '1rem' }}>
          {SECTIES.map((s) => {
            const isOpen = open === s.id;
            const isActief = activeId === s.id;
            return (
              <div
                key={s.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => openSectie(s.id)}
                onMouseLeave={() => sluitVertraagd(s.id)}
              >
                <button
                  onClick={() => klikSectie(s.id)}
                  aria-expanded={isOpen}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.08em',
                    padding: '7px 13px', borderRadius: 8, border: 'none',
                    background: isOpen ? G.bg2 : 'transparent',
                    color: isActief ? G.goud : 'rgba(255,243,223,0.78)',
                    cursor: 'pointer', textTransform: 'uppercase',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                  <ChevronDown size={13} style={{ opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }} />
                </button>

                {/* Dropdown */}
                {/* paddingTop i.p.v. marginTop: geen gat tussen knop en lijst, anders sluit de hover */}
                {isOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 4, zIndex: 60 }}>
                  <div style={{
                    minWidth: 200, background: G.bg2,
                    border: '0.5px solid rgba(241,203,120,0.30)', borderRadius: 10,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.45)', padding: 6,
                  }}>
                    {s.links.map((l) => {
                      const actief = linkActief(l.to);
                      return (
                        <Link
                          key={l.to} to={l.to}
                          style={{
                            display: 'block', fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 12.5, letterSpacing: '0.04em',
                            padding: '9px 12px', borderRadius: 7,
                            color: actief ? G.goudBleek : 'rgba(255,243,223,0.74)',
                            background: actief ? 'rgba(241,203,120,0.18)' : 'transparent',
                            textDecoration: 'none', transition: 'all 0.12s', whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => { if (!actief) (e.currentTarget.style.background = 'rgba(241,203,120,0.10)'); }}
                          onMouseLeave={(e) => { if (!actief) (e.currentTarget.style.background = 'transparent'); }}
                        >
                          {l.label}
                        </Link>
                      );
                    })}
                  </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: accountmenu */}
        {lid && (
          <div
            className="hidden md:block"
            style={{ position: 'relative', marginLeft: 'auto' }}
            onMouseEnter={() => openSectie('__account')}
            onMouseLeave={() => sluitVertraagd('__account')}
          >
            <button
              onClick={() => klikSectie('__account')}
              aria-expanded={open === '__account'}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: 'none',
                background: open === '__account' ? G.bg2 : 'transparent', color: 'rgba(255,243,223,0.85)',
                fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <User size={15} /> {lid.naam.split(' ')[0]}
              <ChevronDown size={13} style={{ opacity: 0.6 }} />
            </button>
            {open === '__account' && (
              <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 4, zIndex: 60 }}>
                <div style={{
                  minWidth: 210, background: G.bg2, border: '0.5px solid rgba(241,203,120,0.30)', borderRadius: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.45)', padding: 6,
                }}>
                  <div style={{ padding: '8px 12px 10px', borderBottom: '0.5px solid rgba(241,203,120,0.2)', marginBottom: 4 }}>
                    <div style={{ color: G.goudBleek, fontSize: 14 }}>{lid.naam}</div>
                    <div style={{ color: G.goud, fontSize: 11, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.06em', marginTop: 2 }}>
                      {ABONNEMENT_LABEL[lid.abonnement_actief].toUpperCase()}
                    </div>
                  </div>
                  {[
                    { to: '/voortgang', label: 'Mijn voortgang' },
                    { to: '/account', label: 'Mijn account' },
                    ...(lid.rol === 'admin' ? [{ to: '/admin/leden', label: 'Leden beheren' }, { to: '/admin/academie', label: 'Academie (beheer)' }, { to: '/admin/cursussen', label: 'Cursus-uploads' }] : []),
                  ].map((l) => (
                    <Link key={l.to} to={l.to} style={{
                      display: 'block', fontFamily: "'Cormorant Garamond', serif", fontSize: 12.5, letterSpacing: '0.04em',
                      padding: '9px 12px', borderRadius: 7, color: 'rgba(255,243,223,0.8)', textDecoration: 'none',
                    }}>{l.label}</Link>
                  ))}
                  <button onClick={uitloggen} style={{
                    display: 'block', width: '100%', textAlign: 'left', fontFamily: "'Cormorant Garamond', serif", fontSize: 12.5,
                    letterSpacing: '0.04em', padding: '9px 12px', borderRadius: 7, border: 'none', background: 'transparent',
                    color: 'rgba(255,243,223,0.6)', cursor: 'pointer',
                  }}>Uitloggen</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobiel((v) => !v)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: G.goudBleek, cursor: 'pointer', display: 'flex' }}
          aria-label="Menu"
        >
          {mobiel ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile: accordion per sectie */}
      {mobiel && (
        <div className="md:hidden" style={{ background: G.bg3, borderTop: '0.5px solid rgba(241,203,120,0.20)', padding: '0.5rem 0', maxHeight: '75vh', overflowY: 'auto' }}>
          {SECTIES.map((s) => {
            const openSectie = mobielSectie === s.id;
            const isActief = activeId === s.id;
            return (
              <div key={s.id} style={{ borderBottom: '0.5px solid rgba(241,203,120,0.10)' }}>
                <button
                  onClick={() => setMobielSectie(openSectie ? null : s.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.08em',
                    padding: '13px 1.5rem', border: 'none', background: 'transparent',
                    color: isActief ? G.goud : G.goudBleek, cursor: 'pointer', textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                  <ChevronDown size={16} style={{ opacity: 0.6, transform: openSectie ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }} />
                </button>
                {openSectie && (
                  <div style={{ padding: '0 1rem 0.6rem' }}>
                    {s.links.map((l) => {
                      const actief = linkActief(l.to);
                      return (
                        <Link
                          key={l.to} to={l.to}
                          style={{
                            display: 'block', fontFamily: "'Cormorant Garamond', serif", fontSize: 13,
                            padding: '10px 1rem', borderRadius: 7,
                            color: actief ? G.goudBleek : 'rgba(255,243,223,0.72)',
                            background: actief ? 'rgba(241,203,120,0.16)' : 'transparent',
                            textDecoration: 'none',
                          }}
                        >
                          {l.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {lid && (
            <div style={{ padding: '0.6rem 1.5rem 0.4rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ color: G.goud, fontSize: 11, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.06em', padding: '6px 0' }}>
                {lid.naam} · {ABONNEMENT_LABEL[lid.abonnement_actief]}
              </div>
              <Link to="/voortgang" style={{ color: G.goudBleek, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: '8px 0', textDecoration: 'none' }}>Mijn voortgang</Link>
              <Link to="/account" style={{ color: G.goudBleek, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: '8px 0', textDecoration: 'none' }}>Mijn account</Link>
              {lid.rol === 'admin' && (
                <>
                  <Link to="/admin/leden" style={{ color: G.goudBleek, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: '8px 0', textDecoration: 'none' }}>Leden beheren</Link>
                  <Link to="/admin/academie" style={{ color: G.goudBleek, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: '8px 0', textDecoration: 'none' }}>Academie (beheer)</Link>
                  <Link to="/admin/cursussen" style={{ color: G.goudBleek, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: '8px 0', textDecoration: 'none' }}>Cursus-uploads</Link>
                </>
              )}
              <button onClick={uitloggen} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'rgba(255,243,223,0.6)', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, padding: '8px 0', cursor: 'pointer' }}>Uitloggen</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
