import React, { useState, useEffect } from 'react';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#0D0B14',
  bg2: '#1A1625', bg3: '#221E30', rand: 'rgba(184,134,11,0.25)',
  accent: 'rgba(184,134,11,0.12)',
};

interface MaanDag {
  datum: string;
  fase: string;
  emoji: string;
  verlichtingspercentage: number;
  faseWaarde: number;
}

interface MaanNu extends MaanDag {}

interface Kalender {
  maand: number;
  jaar: number;
  dagen: MaanDag[];
}

const MAANDEN_NL = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];
const DAGEN_NL = ['Zo','Ma','Di','Wo','Do','Vr','Za'];

const FASE_BESCHRIJVING: Record<string, string> = {
  'Nieuwe Maan':         'De maan is niet zichtbaar. Een tijd van nieuwe beginnen, intenties zetten en innerlijke reset. Plant zaadjes voor wat je wil laten groeien.',
  'Wassende Maansikkel': 'De maan begint te groeien. Energie bouwt op. Een goede tijd om actie te ondernemen op je intenties en plannen concreet te maken.',
  'Eerste Kwartier':     'De maan is half verlicht en groeit nog. Er kunnen obstakels opkomen. Toon vastberadenheid en zet door op je pad.',
  'Wassende Maan':       'Bijna vol, energie is hoog. Dit is een krachtige periode voor manifestatie, creativiteit en sociale verbindingen.',
  'Volle Maan':          'Maximale energie en licht. Emoties staan hoog, inzichten komen naar boven. Een tijd van hoogtepunten, voltooiing en dankbaarheid.',
  'Afnemende Maan':      'Na de piek begint de energie af te nemen. Een goede tijd om te reflecteren, te evalueren en overbodige dingen los te laten.',
  'Laatste Kwartier':    'De maan krimpt snel. Ruim op, sluit af en bereid je voor op een nieuwe cyclus. Laat gaan wat niet meer dient.',
  'Afnemende Maansikkel':'De cyclus nadert het einde. Rust, herstel en stille contemplatie. Bereid je voor op de nieuwe maan die eraan komt.',
};

export const MaanfasePage: React.FC = () => {
  const [maanNu, setMaanNu] = useState<MaanNu | null>(null);
  const [kalender, setKalender] = useState<Kalender | null>(null);
  const [huidigeMaand, setHuidigeMaand] = useState(() => new Date().getMonth() + 1);
  const [huidigJaar, setHuidigJaar] = useState(() => new Date().getFullYear());
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    fetch('/api/maan/nu')
      .then(r => r.json())
      .then(d => setMaanNu(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setGeladen(false);
    fetch(`/api/maan/kalender?maand=${huidigeMaand}&jaar=${huidigJaar}`)
      .then(r => r.json())
      .then(d => { setKalender(d); setGeladen(true); })
      .catch(() => setGeladen(true));
  }, [huidigeMaand, huidigJaar]);

  function vorigeMaand() {
    if (huidigeMaand === 1) { setHuidigeMaand(12); setHuidigJaar(y => y - 1); }
    else setHuidigeMaand(m => m - 1);
  }
  function volgendeMaand() {
    if (huidigeMaand === 12) { setHuidigeMaand(1); setHuidigJaar(y => y + 1); }
    else setHuidigeMaand(m => m + 1);
  }

  // Bepaal de weekdag van de 1e van de maand (0=zo..6=za)
  const eersteWeekdag = kalender ? new Date(kalender.jaar, kalender.maand - 1, 1).getDay() : 0;

  const vandaagStr = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'Crimson Pro', serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: 52, marginBottom: '0.3rem' }}>
            {maanNu?.emoji ?? '🌕'}
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, letterSpacing: '0.15em', color: G.goud, margin: 0 }}>
            MAANFASE
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.45)', fontSize: 13, marginTop: '0.4rem', letterSpacing: '0.05em' }}>
            {new Date().toLocaleDateString('nl-NL', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </p>
        </div>

        {/* Huidige fase — grote kaart */}
        {maanNu && (
          <div style={{
            background: G.bg2, border: `0.5px solid ${G.rand}`,
            borderRadius: 20, padding: '2rem', marginBottom: '2.5rem',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
          }}>
            {/* Links: fase info */}
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, marginBottom: '0.8rem', opacity: 0.7 }}>
                HUIDIGE MAANFASE
              </div>
              <div style={{ fontSize: 22, fontFamily: "'Cinzel', serif", color: G.goudBleek, marginBottom: '1.2rem' }}>
                {maanNu.fase}
              </div>

              {/* Verlichtingsbalk */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(245,237,216,0.5)', marginBottom: '0.4rem' }}>
                  <span>Verlichting</span>
                  <span>{maanNu.verlichtingspercentage}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${maanNu.verlichtingspercentage}%`,
                    background: `linear-gradient(90deg, ${G.goud}88, ${G.goudBleek})`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Cyclus balk */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(245,237,216,0.5)', marginBottom: '0.4rem' }}>
                  <span>🌑 Nieuwe Maan</span>
                  <span>🌕 Volle Maan</span>
                </div>
                <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <div style={{
                    position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
                    left: `${maanNu.faseWaarde * 100}%`,
                    width: 14, height: 14, borderRadius: '50%',
                    background: G.goudBleek, border: `2px solid ${G.goud}`,
                    boxShadow: `0 0 8px ${G.goud}`,
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: 11, color: 'rgba(245,237,216,0.35)', marginTop: '0.4rem' }}>
                  Maancyclus: {Math.round(maanNu.faseWaarde * 100)}%
                </div>
              </div>
            </div>

            {/* Rechts: betekenis */}
            <div style={{ borderLeft: `0.5px solid ${G.rand}`, paddingLeft: '2rem' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, marginBottom: '0.8rem', opacity: 0.7 }}>
                BETEKENIS
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(245,237,216,0.85)', margin: 0 }}>
                {FASE_BESCHRIJVING[maanNu.fase] ?? ''}
              </p>
            </div>
          </div>
        )}

        {/* Maankalender */}
        <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 20, padding: '1.5rem 2rem' }}>

          {/* Kalender navigatie */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button onClick={vorigeMaand} style={{ background: 'none', border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '6px 14px', color: G.goudBleek, cursor: 'pointer', fontSize: 16 }}>‹</button>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: '0.12em', color: G.goud }}>
              {MAANDEN_NL[huidigeMaand - 1]} {huidigJaar}
            </span>
            <button onClick={volgendeMaand} style={{ background: 'none', border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '6px 14px', color: G.goudBleek, cursor: 'pointer', fontSize: 16 }}>›</button>
          </div>

          {/* Weekdag headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem', marginBottom: '0.3rem' }}>
            {DAGEN_NL.map(d => (
              <div key={d} style={{ textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(245,237,216,0.35)', padding: '0.3rem 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Kalender grid */}
          {geladen && kalender ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem' }}>
              {/* Lege cellen voor begin van maand */}
              {Array.from({ length: eersteWeekdag }).map((_, i) => (
                <div key={`leeg-${i}`} />
              ))}
              {/* Dagcellen */}
              {kalender.dagen.map(dag => {
                const isVandaag = dag.datum === vandaagStr;
                const isVolleMaan = dag.fase === 'Volle Maan';
                const isNieuweMaan = dag.fase === 'Nieuwe Maan';
                const isKwartier = dag.fase === 'Eerste Kwartier' || dag.fase === 'Laatste Kwartier';
                const dagNr = parseInt(dag.datum.slice(8));
                return (
                  <div
                    key={dag.datum}
                    title={`${dag.fase} — ${dag.verlichtingspercentage}%`}
                    style={{
                      textAlign: 'center', padding: '0.5rem 0.2rem', borderRadius: 8,
                      background: isVandaag ? G.accent : isVolleMaan ? 'rgba(245,237,216,0.08)' : 'transparent',
                      border: `0.5px solid ${isVandaag ? G.goud : isVolleMaan || isNieuweMaan || isKwartier ? G.rand : 'transparent'}`,
                      cursor: 'default',
                    }}
                  >
                    <div style={{ fontSize: isVolleMaan || isNieuweMaan ? 20 : 16, lineHeight: 1 }}>{dag.emoji}</div>
                    <div style={{
                      fontSize: 11, marginTop: '0.2rem', fontFamily: "'Cinzel', serif",
                      color: isVandaag ? G.goud : 'rgba(245,237,216,0.6)',
                      fontWeight: isVandaag ? 700 : 400,
                    }}>
                      {dagNr}
                    </div>
                    {(isVolleMaan || isNieuweMaan || isKwartier) && (
                      <div style={{ fontSize: 8, color: G.goud, marginTop: '0.1rem', letterSpacing: '0.04em' }}>
                        {dag.fase === 'Volle Maan' ? 'VOL' : dag.fase === 'Nieuwe Maan' ? 'NIEUW' : dag.fase.includes('Eerste') ? '1KW' : 'LKW'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: G.goud, fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.1em' }}>
              Laden...
            </div>
          )}

          {/* Legenda */}
          <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: `0.5px solid ${G.rand}`, flexWrap: 'wrap' }}>
            {[
              { emoji: '🌑', label: 'Nieuwe Maan' },
              { emoji: '🌓', label: 'Eerste Kwartier' },
              { emoji: '🌕', label: 'Volle Maan' },
              { emoji: '🌗', label: 'Laatste Kwartier' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 12, color: 'rgba(245,237,216,0.5)' }}>
                <span style={{ fontSize: 16 }}>{l.emoji}</span>
                {l.label}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: G.accent, border: `0.5px solid ${G.goud}` }} />
              <span style={{ color: G.goud }}>Vandaag</span>
            </div>
          </div>
        </div>

        {/* Gerelateerde tools */}
        <div style={{ maxWidth: 900, margin: '1.5rem auto 0', padding: '0 1.5rem 2rem' }}>
          <div style={{ borderTop: '0.5px solid rgba(184,134,11,0.15)', paddingTop: '1.25rem' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { to: '/cursus/module-05', label: 'Cursus: Maanfasen' },
                { to: '/sterrenbeelden', label: 'Sterrenbeelden' },
                { to: '/natal', label: 'Geboortehoroscoop' },
              ].map(l => (
                <a key={l.to} href={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaanfasePage;
