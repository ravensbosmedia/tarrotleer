import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { TEKST_STANDEN, useTekstStand } from '../lib/tekstgrootte';
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
      { to: '/cursus',           label: 'Numerologie & astrologie (8 modules)' },
    ],
  },
];

const G = {
  goud: '#F1CB78', goudBleek: '#FFF3DF', goudDonker: '#E0B04A',
  bg: '#0C0A20', bg2: '#20162F', bg3: '#151029',
};
// Zen Flow-menu (zie zen-flow.nl): DM Sans, gouden gloed bij aanwijzen, panelen met paarse rand
const SANS = "'DM Sans', sans-serif";
const PANEEL: React.CSSProperties = {
  background: G.bg2, border: '1px solid #C292BD', borderRadius: 13, padding: 8,
  boxShadow: '0 0 40px rgba(172,85,178,0.23), 0 14px 32px rgba(0,0,0,0.5)',
};
const itemStijl = (actief: boolean): React.CSSProperties => ({
  display: 'block', fontFamily: SANS, fontSize: 14, padding: '10px 14px', borderRadius: 8,
  color: actief ? G.goud : '#E0D5E9', background: actief ? 'rgba(239,180,255,0.14)' : 'transparent',
  textDecoration: 'none', transition: 'all 0.12s', whiteSpace: 'nowrap',
});
const zweefAan = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.background = 'rgba(239,180,255,0.10)'; e.currentTarget.style.color = G.goud; };
const zweefUit = (actief: boolean) => (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.background = actief ? 'rgba(239,180,255,0.14)' : 'transparent'; e.currentTarget.style.color = actief ? G.goud : '#E0D5E9';
};

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);   // welke desktop-dropdown is open
  const [mobiel, setMobiel] = useState(false);             // mobiel menu open?
  const [mobielSectie, setMobielSectie] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { lid } = useAccount();
  const [tekstStand, kiesTekstStand] = useTekstStand();
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
                    fontFamily: SANS, fontSize: 13, fontWeight: 500,
                    padding: '8px 12px', borderRadius: 20, border: 'none',
                    background: isOpen ? 'rgba(239,180,255,0.10)' : 'transparent',
                    color: isActief || isOpen ? G.goud : 'rgba(255,243,223,0.85)',
                    textShadow: isOpen ? '0 0 15px #E361FF' : 'none',
                    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                  <ChevronDown size={13} style={{ opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }} />
                </button>

                {/* Dropdown */}
                {/* paddingTop i.p.v. marginTop: geen gat tussen knop en lijst, anders sluit de hover */}
                {isOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 4, zIndex: 60 }}>
                  <div style={{ ...PANEEL, minWidth: 220 }}>
                    {s.links.map((l) => {
                      const actief = linkActief(l.to);
                      return (
                        <Link
                          key={l.to} to={l.to}
                          style={itemStijl(actief)}
                          onMouseEnter={zweefAan}
                          onMouseLeave={zweefUit(actief)}
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

        {/* Desktop: tekstgrootte */}
        <div
          className="hidden md:block"
          style={{ position: 'relative', marginLeft: 'auto' }}
          onMouseEnter={() => openSectie('__tekst')}
          onMouseLeave={() => sluitVertraagd('__tekst')}
        >
          <button
            onClick={() => klikSectie('__tekst')}
            aria-expanded={open === '__tekst'}
            aria-label="Tekstgrootte aanpassen"
            title="Tekstgrootte"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, lineHeight: 1, padding: '6px 14px', borderRadius: 30,
              border: '1px solid #B67AC9', background: open === '__tekst' ? 'rgba(239,180,255,0.10)' : 'transparent', color: G.goud, cursor: 'pointer',
            }}
          >
            A<span style={{ fontSize: 14 }}>a</span>
          </button>
          {open === '__tekst' && (
            <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 4, zIndex: 60 }}>
              <div style={{ ...PANEEL, minWidth: 200 }}>
                <div style={{ padding: '6px 14px 8px', color: G.goud, fontSize: 10, fontFamily: SANS, letterSpacing: '2px' }}>TEKSTGROOTTE</div>
                {TEKST_STANDEN.map((t) => (
                  <button key={t.id} onClick={() => { kiesTekstStand(t.id); setOpen(null); }} style={{ ...itemStijl(tekstStand === t.id), width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: Math.round(16 * t.factor), width: 26 }}>A</span>
                    {t.label}{tekstStand === t.id ? ' ✓' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop: accountmenu */}
        {lid && (
          <div
            className="hidden md:block"
            style={{ position: 'relative' }}
            onMouseEnter={() => openSectie('__account')}
            onMouseLeave={() => sluitVertraagd('__account')}
          >
            <button
              onClick={() => klikSectie('__account')}
              aria-expanded={open === '__account'}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 30,
                border: '1px solid #B67AC9', background: open === '__account' ? 'rgba(239,180,255,0.10)' : 'transparent',
                color: G.goudBleek, fontFamily: SANS, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <User size={15} /> {lid.naam.split(' ')[0]}
              <ChevronDown size={13} style={{ opacity: 0.6 }} />
            </button>
            {open === '__account' && (
              <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 4, zIndex: 60 }}>
                <div style={{ ...PANEEL, minWidth: 230 }}>
                  <div style={{ padding: '8px 14px 12px', borderBottom: '1px solid rgba(194,146,189,0.35)', marginBottom: 6 }}>
                    <div style={{ color: G.goudBleek, fontSize: 21, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>{lid.naam}</div>
                    <div style={{ color: G.goud, fontSize: 10, fontFamily: SANS, letterSpacing: '2px', marginTop: 4 }}>
                      {ABONNEMENT_LABEL[lid.abonnement_actief].toUpperCase()}
                    </div>
                  </div>
                  {[
                    { to: '/voortgang', label: 'Mijn voortgang' },
                    { to: '/account', label: 'Mijn account' },
                    ...(lid.rol === 'admin' ? [{ to: '/admin/leden', label: 'Leden beheren' }, { to: '/admin/academie', label: 'Academie (beheer)' }, { to: '/admin/cursussen', label: 'Cursus-uploads' }, { to: '/admin/teksten', label: 'Teksten (disclaimers)' }] : []),
                  ].map((l) => (
                    <Link key={l.to} to={l.to} style={itemStijl(linkActief(l.to))} onMouseEnter={zweefAan} onMouseLeave={zweefUit(linkActief(l.to))}>{l.label}</Link>
                  ))}
                  <button onClick={uitloggen} style={{
                    ...itemStijl(false), width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', color: '#B9A9CC',
                    marginTop: 4, borderTop: '1px solid rgba(194,146,189,0.25)', borderRadius: 0,
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
          style={{ marginLeft: 'auto', background: 'none', border: '1px solid #B17BC6', borderRadius: 5, padding: '5px 9px', color: G.goud, cursor: 'pointer', display: 'flex' }}
          aria-label="Menu"
        >
          {mobiel ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile: accordion per sectie */}
      {mobiel && (
        <div className="md:hidden" style={{ background: G.bg3, borderTop: '1px solid #A77AB9', borderBottom: '1px solid #A77AB9', padding: '0.5rem 0', maxHeight: '75vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.5rem 0.9rem', borderBottom: '1px solid rgba(194,146,189,0.18)' }}>
            <span style={{ color: G.goud, fontSize: 10, fontFamily: SANS, letterSpacing: '2px', marginRight: 'auto' }}>TEKSTGROOTTE</span>
            {TEKST_STANDEN.map((t) => (
              <button key={t.id} onClick={() => kiesTekstStand(t.id)} aria-label={`Tekst ${t.label.toLowerCase()}`} aria-pressed={tekstStand === t.id} style={{
                minWidth: 44, minHeight: 40, borderRadius: 20, cursor: 'pointer', fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: Math.round(16 * t.factor), lineHeight: 1,
                border: `1px solid ${tekstStand === t.id ? G.goud : '#B67AC9'}`,
                background: tekstStand === t.id ? 'rgba(241,203,120,0.15)' : 'transparent', color: tekstStand === t.id ? G.goud : G.goudBleek,
              }}>A</button>
            ))}
          </div>
          {SECTIES.map((s) => {
            const openSectie = mobielSectie === s.id;
            const isActief = activeId === s.id;
            return (
              <div key={s.id} style={{ borderBottom: '1px solid rgba(194,146,189,0.18)' }}>
                <button
                  onClick={() => setMobielSectie(openSectie ? null : s.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontFamily: SANS, fontSize: 15, fontWeight: 500,
                    padding: '14px 1.5rem', border: 'none', background: 'transparent',
                    color: isActief || openSectie ? G.goud : G.goudBleek, cursor: 'pointer',
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
                          style={{ ...itemStijl(actief), fontSize: 15, padding: '11px 1rem', whiteSpace: 'normal' }}
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
              <div style={{ color: G.goud, fontSize: 10, fontFamily: SANS, letterSpacing: '2px', padding: '6px 0', textTransform: 'uppercase' }}>
                {lid.naam} · {ABONNEMENT_LABEL[lid.abonnement_actief]}
              </div>
              <Link to="/voortgang" style={{ color: '#E0D5E9', fontFamily: SANS, fontSize: 15, padding: '9px 0', textDecoration: 'none' }}>Mijn voortgang</Link>
              <Link to="/account" style={{ color: '#E0D5E9', fontFamily: SANS, fontSize: 15, padding: '9px 0', textDecoration: 'none' }}>Mijn account</Link>
              {lid.rol === 'admin' && (
                <>
                  <Link to="/admin/leden" style={{ color: '#E0D5E9', fontFamily: SANS, fontSize: 15, padding: '9px 0', textDecoration: 'none' }}>Leden beheren</Link>
                  <Link to="/admin/academie" style={{ color: '#E0D5E9', fontFamily: SANS, fontSize: 15, padding: '9px 0', textDecoration: 'none' }}>Academie (beheer)</Link>
                  <Link to="/admin/cursussen" style={{ color: '#E0D5E9', fontFamily: SANS, fontSize: 15, padding: '9px 0', textDecoration: 'none' }}>Cursus-uploads</Link>
                  <Link to="/admin/teksten" style={{ color: '#E0D5E9', fontFamily: SANS, fontSize: 15, padding: '9px 0', textDecoration: 'none' }}>Teksten (disclaimers)</Link>
                </>
              )}
              <button onClick={uitloggen} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#B9A9CC', fontFamily: SANS, fontSize: 15, padding: '9px 0', cursor: 'pointer' }}>Uitloggen</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
