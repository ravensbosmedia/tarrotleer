import React, { useState, useEffect } from 'react';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', goudDonker: '#7A5C00',
  bg: '#1A1209', bg2: '#2C2416', bg3: '#3A2E1C',
  accent: 'rgba(184,134,11,0.15)', rand: 'rgba(184,134,11,0.25)',
};

const TEKENS = [
  { slug:'aries',       naam:'Ram',          symbool:'♈', periode:'21 mrt – 19 apr', element:'Vuur',  planeet:'Mars' },
  { slug:'taurus',      naam:'Stier',         symbool:'♉', periode:'20 apr – 20 mei', element:'Aarde', planeet:'Venus' },
  { slug:'gemini',      naam:'Tweelingen',    symbool:'♊', periode:'21 mei – 20 jun', element:'Lucht', planeet:'Mercurius' },
  { slug:'cancer',      naam:'Kreeft',        symbool:'♋', periode:'21 jun – 22 jul', element:'Water', planeet:'Maan' },
  { slug:'leo',         naam:'Leeuw',         symbool:'♌', periode:'23 jul – 22 aug', element:'Vuur',  planeet:'Zon' },
  { slug:'virgo',       naam:'Maagd',         symbool:'♍', periode:'23 aug – 22 sep', element:'Aarde', planeet:'Mercurius' },
  { slug:'libra',       naam:'Weegschaal',    symbool:'♎', periode:'23 sep – 22 okt', element:'Lucht', planeet:'Venus' },
  { slug:'scorpio',     naam:'Schorpioen',    symbool:'♏', periode:'23 okt – 21 nov', element:'Water', planeet:'Pluto' },
  { slug:'sagittarius', naam:'Boogschutter',  symbool:'♐', periode:'22 nov – 21 dec', element:'Vuur',  planeet:'Jupiter' },
  { slug:'capricorn',   naam:'Steenbok',      symbool:'♑', periode:'22 dec – 19 jan', element:'Aarde', planeet:'Saturnus' },
  { slug:'aquarius',    naam:'Waterman',      symbool:'♒', periode:'20 jan – 18 feb', element:'Lucht', planeet:'Uranus' },
  { slug:'pisces',      naam:'Vissen',        symbool:'♓', periode:'19 feb – 20 mrt', element:'Water', planeet:'Neptunus' },
];

const ELEMENT_KLEUR: Record<string, string> = {
  Vuur: '#C0392B', Aarde: '#7D6608', Lucht: '#2E86C1', Water: '#1A5276'
};

const CHINEES_TEKENS = [
  { slug:'rat',     naam:'Rat',     emoji:'🐀', jaren:'1948, 1960, 1972, 1984, 1996, 2008, 2020' },
  { slug:'ox',      naam:'Os',      emoji:'🐂', jaren:'1949, 1961, 1973, 1985, 1997, 2009, 2021' },
  { slug:'tiger',   naam:'Tijger',  emoji:'🐅', jaren:'1950, 1962, 1974, 1986, 1998, 2010, 2022' },
  { slug:'rabbit',  naam:'Konijn',  emoji:'🐇', jaren:'1951, 1963, 1975, 1987, 1999, 2011, 2023' },
  { slug:'dragon',  naam:'Draak',   emoji:'🐉', jaren:'1952, 1964, 1976, 1988, 2000, 2012, 2024' },
  { slug:'snake',   naam:'Slang',   emoji:'🐍', jaren:'1953, 1965, 1977, 1989, 2001, 2013, 2025' },
  { slug:'horse',   naam:'Paard',   emoji:'🐎', jaren:'1954, 1966, 1978, 1990, 2002, 2014, 2026' },
  { slug:'goat',    naam:'Geit',    emoji:'🐐', jaren:'1955, 1967, 1979, 1991, 2003, 2015, 2027' },
  { slug:'monkey',  naam:'Aap',     emoji:'🐒', jaren:'1956, 1968, 1980, 1992, 2004, 2016, 2028' },
  { slug:'rooster', naam:'Haan',    emoji:'🐓', jaren:'1957, 1969, 1981, 1993, 2005, 2017, 2029' },
  { slug:'dog',     naam:'Hond',    emoji:'🐕', jaren:'1958, 1970, 1982, 1994, 2006, 2018, 2030' },
  { slug:'pig',     naam:'Varken',  emoji:'🐖', jaren:'1959, 1971, 1983, 1995, 2007, 2019, 2031' },
];

function chineesVoorJaar(jaar: number): typeof CHINEES_TEKENS[0] {
  const volgorde = ['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig'];
  const slug = volgorde[((jaar - 2020) % 12 + 12) % 12];
  return CHINEES_TEKENS.find(t => t.slug === slug)!;
}

type Tab = 'westers' | 'chinees';

export const HoroscoopPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('westers');
  const [geselecteerd, setGeselecteerd] = useState<string | null>(null);
  const [horoscoop, setHoroscoop] = useState<string | null>(null);
  const [laden, setLaden] = useState(false);
  const [geboortejaar, setGeboortejaar] = useState('');
  const [chineesResultaat, setChineesResultaat] = useState<typeof CHINEES_TEKENS[0] | null>(null);

  const vandaag = new Date().toLocaleDateString('nl-NL', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  async function laadHoroscoop(teken: string) {
    setGeselecteerd(teken);
    setHoroscoop(null);
    setLaden(true);
    try {
      const r = await fetch(`/api/horoscoop/${teken}`);
      const d = await r.json();
      setHoroscoop(d.tekst_nl ?? d.tekst_en ?? 'Geen horoscoop beschikbaar.');
    } catch {
      setHoroscoop('Kon horoscoop niet laden.');
    } finally {
      setLaden(false);
    }
  }

  function berekenChinees() {
    const jaar = parseInt(geboortejaar);
    if (!jaar || jaar < 1900 || jaar > 2025) return;
    setChineesResultaat(chineesVoorJaar(jaar));
  }

  const huidigTeken = TEKENS.find(t => t.slug === geselecteerd);

  const tabStyle = (id: Tab): React.CSSProperties => ({
    fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em',
    padding: '8px 24px', borderRadius: 20,
    border: `0.5px solid ${tab === id ? G.goud : G.rand}`,
    background: tab === id ? G.goud : 'transparent',
    color: tab === id ? G.bg : G.goudBleek,
    cursor: 'pointer', transition: 'all 0.18s',
  });

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'Crimson Pro', serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: 48, marginBottom: '0.5rem' }}>✦</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, letterSpacing: '0.15em', color: G.goud, margin: 0 }}>
            STERRENBEELDEN
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.5)', fontSize: 14, marginTop: '0.5rem', letterSpacing: '0.05em' }}>
            {vandaag}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button style={tabStyle('westers')} onClick={() => setTab('westers')}>Westers</button>
            <button style={tabStyle('chinees')} onClick={() => setTab('chinees')}>Chinees</button>
          </div>
        </div>

        {/* ─── WESTERS ─── */}
        {tab === 'westers' && (
          <div>
            {/* Teken grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.8rem', marginBottom: '2rem' }}>
              {TEKENS.map(t => {
                const actief = geselecteerd === t.slug;
                return (
                  <button
                    key={t.slug}
                    onClick={() => laadHoroscoop(t.slug)}
                    style={{
                      background: actief ? G.accent : 'rgba(255,255,255,0.03)',
                      border: `0.5px solid ${actief ? G.goud : G.rand}`,
                      borderRadius: 12, padding: '1rem 0.8rem',
                      cursor: 'pointer', transition: 'all 0.18s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    <span style={{ fontSize: 28, color: actief ? G.goud : G.goudBleek }}>{t.symbool}</span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.1em', color: actief ? G.goud : G.goudBleek }}>
                      {t.naam.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(245,237,216,0.4)', letterSpacing: '0.04em' }}>{t.periode}</span>
                    <span style={{
                      fontSize: 9, padding: '2px 8px', borderRadius: 8,
                      background: ELEMENT_KLEUR[t.element] + '33',
                      border: `0.5px solid ${ELEMENT_KLEUR[t.element]}55`,
                      color: ELEMENT_KLEUR[t.element],
                      letterSpacing: '0.06em',
                    }}>{t.element}</span>
                  </button>
                );
              })}
            </div>

            {/* Horoscoop panel */}
            {geselecteerd && (
              <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 16, padding: '2rem' }}>
                {laden ? (
                  <p style={{ textAlign: 'center', color: G.goud, letterSpacing: '0.1em', fontFamily: "'Cinzel', serif", fontSize: 12 }}>
                    Laden...
                  </p>
                ) : huidigTeken && horoscoop ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: 48, color: G.goud }}>{huidigTeken.symbool}</span>
                      <div>
                        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: G.goud, margin: 0, letterSpacing: '0.1em' }}>
                          {huidigTeken.naam}
                        </h2>
                        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                          {[
                            { label: huidigTeken.element, kleur: ELEMENT_KLEUR[huidigTeken.element] },
                            { label: `♃ ${huidigTeken.planeet}`, kleur: G.goud },
                            { label: huidigTeken.periode, kleur: 'rgba(245,237,216,0.5)' },
                          ].map(b => (
                            <span key={b.label} style={{ fontSize: 12, color: b.kleur, letterSpacing: '0.04em' }}>{b.label}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ borderTop: `0.5px solid ${G.rand}`, paddingTop: '1.5rem' }}>
                      <p style={{ fontSize: 16, lineHeight: 1.8, color: G.goudBleek, margin: 0 }}>{horoscoop}</p>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {!geselecteerd && (
              <p style={{ textAlign: 'center', color: 'rgba(245,237,216,0.35)', fontSize: 14, letterSpacing: '0.05em' }}>
                Kies je sterrenbeeld hierboven
              </p>
            )}
          </div>
        )}

        {/* ─── CHINEES ─── */}
        {tab === 'chinees' && (
          <div>
            {/* Geboortejaar invoer */}
            <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 16, padding: '2rem', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: '0.1em', color: G.goud, marginTop: 0, textAlign: 'center' }}>
                BEREKEN JOUW TEKEN
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="number"
                  placeholder="Geboortejaar (bijv. 1990)"
                  value={geboortejaar}
                  onChange={e => setGeboortejaar(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && berekenChinees()}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: `0.5px solid ${G.rand}`,
                    borderRadius: 8, padding: '10px 14px', color: G.goudBleek,
                    fontFamily: "'Crimson Pro', serif", fontSize: 15, outline: 'none',
                  }}
                />
                <button
                  onClick={berekenChinees}
                  style={{
                    background: G.goud, color: G.bg, border: 'none', borderRadius: 8,
                    padding: '10px 18px', cursor: 'pointer',
                    fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em',
                  }}
                >
                  Berekenen
                </button>
              </div>

              {chineesResultaat && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1.2rem', background: G.accent, borderRadius: 12, border: `0.5px solid ${G.rand}` }}>
                  <div style={{ fontSize: 52 }}>{chineesResultaat.emoji}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: G.goud, letterSpacing: '0.12em', marginTop: '0.3rem' }}>
                    {chineesResultaat.naam.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.45)', marginTop: '0.5rem', letterSpacing: '0.04em' }}>
                    {chineesResultaat.jaren}
                  </div>
                </div>
              )}
            </div>

            {/* Alle 12 Chinese tekens */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.7rem' }}>
              {CHINEES_TEKENS.map(t => (
                <div
                  key={t.slug}
                  style={{
                    background: chineesResultaat?.slug === t.slug ? G.accent : 'rgba(255,255,255,0.03)',
                    border: `0.5px solid ${chineesResultaat?.slug === t.slug ? G.goud : G.rand}`,
                    borderRadius: 12, padding: '1rem 0.8rem', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 32 }}>{t.emoji}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goudBleek, letterSpacing: '0.08em', marginTop: '0.4rem' }}>
                    {t.naam.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(245,237,216,0.35)', marginTop: '0.3rem' }}>{t.jaren.split(',')[0]}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoroscoopPage;
