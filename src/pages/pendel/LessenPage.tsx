import React, { useState } from 'react';
import { pendelLessen, pendelVideos, PendelCategorie, PendelLes, PendelLesInhoud } from '../../data/pendel/lessen';
import { PendelAnimatie, PendelMode, bewegingNaarMode } from '../../components/pendel/PendelAnimatie';

const STORAGE_KEY_PREFIX = 'pendel_les_';
const STORAGE_VIDEO_PREFIX = 'pendel_video_';

// ─── Kleurstijlen ──────────────────────────────────────────────────────────
const G = {
  goud: '#B8860B',
  goudLicht: '#D4A84B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#FDFAF4',
  bg2: '#F5F0E8',
  bg3: '#EDE6D6',
  tekst: '#2C2416',
  tekst2: '#6B5C3E',
  tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)',
  rand2: 'rgba(184,134,11,0.35)',
};

const catLabels: Record<PendelCategorie, string> = {
  basis: 'Basis',
  bewegingen: 'Pendelbewegingen',
  schijven: 'Werken met schijven',
  gevorderd: 'Gevorderd',
  videos: "Extra Video's",
};

const catSecties: Array<{ cat: PendelCategorie; label: string; range: string }> = [
  { cat: 'basis',       label: 'Basis',                  range: 'lessen 1–4' },
  { cat: 'bewegingen',  label: 'Pendelbewegingen',        range: 'lessen 5–7' },
  { cat: 'schijven',    label: 'Werken met schijven',     range: 'lessen 8–14' },
  { cat: 'gevorderd',   label: 'Gevorderd',               range: 'lessen 15–18' },
];

// ─── Lesinhoud renderer ────────────────────────────────────────────────────
const LesInhoud: React.FC<{ inhoud: PendelLesInhoud[] }> = ({ inhoud }) => (
  <div style={{ fontSize: 16, lineHeight: 1.8, color: G.tekst2 }}>
    {inhoud.map((item, idx) => {
      switch (item.type) {
        case 'tekst':
          return <p key={idx} style={{ marginBottom: '0.9rem' }}>{item.tekst}</p>;

        case 'lijst':
          return (
            <div key={idx} style={{ marginBottom: '0.9rem' }}>
              {item.tekst && (
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.tekst, marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  {item.tekst}
                </p>
              )}
              <ul style={{ paddingLeft: '1.4rem', margin: 0 }}>
                {item.items?.map((r, j) => (
                  <li key={j} style={{ marginBottom: '0.3rem' }}>{r}</li>
                ))}
              </ul>
            </div>
          );

        case 'genummerd':
          return (
            <div key={idx} style={{ marginBottom: '0.9rem' }}>
              {item.tekst && (
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.tekst, marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  {item.tekst}
                </p>
              )}
              <ol style={{ paddingLeft: '1.4rem', margin: 0 }}>
                {item.items?.map((r, j) => (
                  <li key={j} style={{ marginBottom: '0.3rem' }}>{r}</li>
                ))}
              </ol>
            </div>
          );

        case 'tip':
          return (
            <div key={idx} style={{
              background: '#F0FDF4',
              border: '0.5px solid #86EFAC',
              borderRadius: 6,
              padding: '0.9rem 1.1rem',
              marginBottom: '0.9rem',
              display: 'flex',
              gap: '0.6rem',
            }}>
              <span style={{ color: '#16A34A', fontWeight: 600, flexShrink: 0 }}>💡 Tip:</span>
              <p style={{ margin: 0, color: '#15803D' }}>{item.tekst}</p>
            </div>
          );

        case 'waarschuwing':
          return (
            <div key={idx} style={{
              background: '#FFF7ED',
              border: '0.5px solid #FDBA74',
              borderRadius: 6,
              padding: '0.9rem 1.1rem',
              marginBottom: '0.9rem',
              display: 'flex',
              gap: '0.6rem',
            }}>
              <span style={{ color: '#EA580C', fontWeight: 600, flexShrink: 0 }}>⚠️ Let op:</span>
              <p style={{ margin: 0, color: '#C2410C' }}>{item.tekst}</p>
            </div>
          );

        case 'beweging':
          return (
            <div key={idx} style={{
              background: G.bg2,
              border: `0.5px solid ${G.rand2}`,
              borderRadius: 8,
              padding: '1.2rem',
              marginBottom: '0.9rem',
              textAlign: 'center',
            }}>
              {item.tekst && (
                <p style={{ color: G.tekst, marginBottom: '1rem', fontStyle: 'italic' }}>{item.tekst}</p>
              )}
              {item.beweging && (
                <PendelAnimatie
                  mode={bewegingNaarMode[item.beweging] ?? 'still'}
                  width={220}
                  height={220}
                  showControls={true}
                />
              )}
            </div>
          );

        default:
          return null;
      }
    })}
  </div>
);

// ─── Hero pendel (canvas engine) ──────────────────────────────────────────
const HeroPendel: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.10em', color: G.tekst3, textTransform: 'uppercase', marginBottom: 10 }}>
      Live demonstratie
    </p>
    <PendelAnimatie mode="right" width={300} height={300} showControls={true} />
  </div>
);

// ─── Hoofdpagina ───────────────────────────────────────────────────────────
type CatFilter = PendelCategorie | 'alle';
type NivFilter = 'alle' | 'beginner' | 'gevorderd';

function getVoltooide(): string[] {
  return pendelLessen
    .filter(l => localStorage.getItem(STORAGE_KEY_PREFIX + l.id) === 'voltooid')
    .map(l => l.id);
}

export const LessenPage: React.FC = () => {
  const [catFilter, setCatFilter]   = useState<CatFilter>('alle');
  const [nivFilter, setNivFilter]   = useState<NivFilter>('alle');
  const [openLes, setOpenLes]       = useState<PendelLes | null>(null);
  const [voltooide, setVoltooide]   = useState<string[]>(getVoltooide);
  const [bekendeVideos, setBekendeVideos] = useState<Set<string>>(() => {
    const s = new Set<string>();
    pendelVideos.forEach(v => {
      if (localStorage.getItem(STORAGE_VIDEO_PREFIX + v.id) === 'bekeken') s.add(v.id);
    });
    return s;
  });

  const markeerVoltooid = (lesId: string) => {
    localStorage.setItem(STORAGE_KEY_PREFIX + lesId, 'voltooid');
    setVoltooide(getVoltooide());
  };
  const markeerBekeken = (videoId: string) => {
    localStorage.setItem(STORAGE_VIDEO_PREFIX + videoId, 'bekeken');
    setBekendeVideos(prev => new Set([...prev, videoId]));
  };

  const aantalVoltooide = voltooide.length;
  const totaal = pendelLessen.length;
  const voortgangPct = totaal > 0 ? Math.round((aantalVoltooide / totaal) * 100) : 0;

  const toonVideos = catFilter === 'alle' || catFilter === 'videos';
  const gefilterd = catFilter === 'videos'
    ? []
    : pendelLessen.filter(l => {
        const catOk = catFilter === 'alle' || l.categorie === catFilter;
        const nivOk = nivFilter === 'alle' || l.niveau === nivFilter;
        return catOk && nivOk;
      });

  // Groepeer gefilterde lessen per categorie
  const grouped = catSecties
    .map(s => ({
      ...s,
      lessen: gefilterd.filter(l => l.categorie === s.cat),
    }))
    .filter(s => s.lessen.length > 0);

  const isVoltooid = (id: string) => voltooide.includes(id);

  // ── Lesson card ──────────────────────────────────────────────────────────
  const LesKaart: React.FC<{ les: PendelLes }> = ({ les }) => {
    const [hover, setHover] = useState(false);
    const voltooid = isVoltooid(les.id);
    return (
      <div
        onClick={() => setOpenLes(les)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: '1.4rem',
          borderRight: `0.5px solid ${G.rand}`,
          borderBottom: `0.5px solid ${G.rand}`,
          cursor: 'pointer',
          background: hover ? G.goudBleek : G.bg,
          transition: 'background 0.15s',
          position: 'relative',
        }}
      >
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          letterSpacing: '0.10em',
          color: voltooid ? G.goud : G.tekst3,
          marginBottom: '0.45rem',
        }}>
          Les {String(les.nummer).padStart(2, '0')}{voltooid ? ' ✓' : ''}
        </div>
        <div style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4, marginBottom: '0.4rem', color: G.tekst }}>
          {les.titel}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
          {les.heeftAnimatie && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#F3E5F5', color: '#6A1B9A', border: '0.5px solid rgba(106,27,154,0.2)' }}>
              Animatie
            </span>
          )}
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: G.bg3, color: G.tekst3, border: `0.5px solid ${G.rand}` }}>
            {les.niveau === 'beginner' ? 'Beginner' : 'Gevorderd'}
          </span>
        </div>
      </div>
    );
  };

  // ── Modal ────────────────────────────────────────────────────────────────
  const Modal: React.FC = () => {
    if (!openLes) return null;
    const voltooid = isVoltooid(openLes.id);

    return (
      <div
        onClick={e => { if (e.target === e.currentTarget) setOpenLes(null); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(44,36,22,0.72)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          overflowY: 'auto', padding: '2rem 1rem',
        }}
      >
        <div style={{
          background: G.bg,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 8,
          width: '100%', maxWidth: 720,
          padding: '2.4rem',
          position: 'relative',
          margin: 'auto',
        }}>
          {/* Sluit */}
          <button
            onClick={() => setOpenLes(null)}
            style={{
              position: 'absolute', top: '1.2rem', right: '1.2rem',
              fontSize: 22, color: G.tekst3, background: 'none', border: 'none', cursor: 'pointer',
              lineHeight: 1, fontFamily: 'sans-serif',
            }}
          >×</button>

          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Les {String(openLes.nummer).padStart(2, '0')} · {catLabels[openLes.categorie]}
          </p>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 400, color: G.tekst, marginBottom: '1.5rem' }}>
            {openLes.titel}
          </h2>

          {/* Animatie in modal indien van toepassing */}
          {openLes.heeftAnimatie && (
            <div style={{
              display: 'flex', justifyContent: 'center',
              padding: '1.2rem', background: G.bg2, borderRadius: 8,
              border: `0.5px solid ${G.rand}`, marginBottom: '1.5rem',
            }}>
              <PendelAnimatie
                mode={bewegingNaarMode[openLes.inhoud.find(i => i.type === 'beweging')?.beweging ?? 'stilstaand'] ?? 'right'}
                width={220}
                height={220}
                showControls={true}
              />
            </div>
          )}

          <LesInhoud inhoud={openLes.inhoud} />

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '2rem', paddingTop: '1.4rem',
            borderTop: `0.5px solid ${G.rand}`,
          }}>
            <span style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic' }}>
              {openLes.niveau === 'beginner' ? 'Beginnersniveau' : 'Gevorderd niveau'}
            </span>
            {voltooid ? (
              <span style={{ fontSize: 13, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 6 }}>
                ✓ Les voltooid
              </span>
            ) : (
              <button
                onClick={() => markeerVoltooid(openLes.id)}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 13, letterSpacing: '0.06em',
                  padding: '10px 22px',
                  background: G.goud, color: '#fff',
                  border: 'none', borderRadius: 4,
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = G.goudDonker)}
                onMouseOut={e => (e.currentTarget.style.background = G.goud)}
              >
                Les voltooien →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Categorie / niveau knoppen helper ───────────────────────────────────
  const FilterBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 12, letterSpacing: '0.05em',
        padding: '6px 16px', borderRadius: 20,
        border: `0.5px solid ${active ? G.goud : G.rand2}`,
        background: active ? G.goud : 'transparent',
        color: active ? '#fff' : G.tekst3,
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="pendel-pagina">

      {/* ── Hero ── */}
      <section style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '4rem 2rem 3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Stap voor stap pendelen leren
            </p>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 400, lineHeight: 1.2, marginBottom: '1.2rem', color: G.tekst }}>
              Pendelcursus
            </h1>
            <p style={{ fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, marginBottom: '1.8rem', maxWidth: 460 }}>
              Van basishouding tot gevorderde schijftechnieken — leer pendelen op je eigen tempo met interactieve lessen en animaties.
            </p>

            {/* Voortgangsbalk */}
            <div style={{ marginBottom: '1.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: G.tekst3, marginBottom: 8 }}>
                <span>Voortgang</span>
                <span>{aantalVoltooide} van {totaal} lessen voltooid · <strong style={{ color: G.goud }}>{voortgangPct}%</strong></span>
              </div>
              <div style={{ height: 3, background: G.bg3, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: G.goud, borderRadius: 2, width: `${voortgangPct}%`, transition: 'width 1s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="#lessen" style={{
                fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em',
                padding: '10px 24px', background: G.goud, color: '#fff',
                border: 'none', borderRadius: 4, cursor: 'pointer', textDecoration: 'none',
              }}>
                Begin met lessen
              </a>
              <a href="#videos" style={{
                fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em',
                padding: '10px 24px', background: 'transparent', color: G.tekst2,
                border: `0.5px solid ${G.rand2}`, borderRadius: 4, textDecoration: 'none',
              }}>
                Bekijk video's
              </a>
            </div>
          </div>

          {/* Hero pendel animatie */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroPendel />
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div id="lessen" style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '0.75rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, flexShrink: 0 }}>Categorie:</span>
            <FilterBtn active={catFilter === 'alle'}    onClick={() => setCatFilter('alle')}>Alle lessen</FilterBtn>
            <FilterBtn active={catFilter === 'basis'}   onClick={() => setCatFilter('basis')}>Basis</FilterBtn>
            <FilterBtn active={catFilter === 'bewegingen'} onClick={() => setCatFilter('bewegingen')}>Pendelbewegingen</FilterBtn>
            <FilterBtn active={catFilter === 'schijven'} onClick={() => setCatFilter('schijven')}>Werken met schijven</FilterBtn>
            <FilterBtn active={catFilter === 'gevorderd'} onClick={() => setCatFilter('gevorderd')}>Gevorderd</FilterBtn>
            <FilterBtn active={catFilter === 'videos'}  onClick={() => setCatFilter('videos')}>Video's</FilterBtn>
          </div>
          {catFilter !== 'videos' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, flexShrink: 0 }}>Niveau:</span>
              <FilterBtn active={nivFilter === 'alle'}      onClick={() => setNivFilter('alle')}>Alle niveaus</FilterBtn>
              <FilterBtn active={nivFilter === 'beginner'}  onClick={() => setNivFilter('beginner')}>Beginner</FilterBtn>
              <FilterBtn active={nivFilter === 'gevorderd'} onClick={() => setNivFilter('gevorderd')}>Gevorderd</FilterBtn>
            </div>
          )}
        </div>
      </div>

      {/* ── Lessen grid ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {grouped.map(sectie => (
          <div key={sectie.cat}>
            {/* Sectielabel */}
            <div style={{
              padding: '0.65rem 2rem',
              fontFamily: "'Cinzel', serif",
              fontSize: 11, letterSpacing: '0.12em',
              color: G.tekst3, textTransform: 'uppercase',
              background: G.bg2,
              borderBottom: `0.5px solid ${G.rand}`,
              borderTop: `0.5px solid ${G.rand}`,
            }}>
              {sectie.label} — {sectie.range}
            </div>
            {/* Kaarten */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              borderBottom: `0.5px solid ${G.rand}`,
            }}>
              {sectie.lessen.map(les => <LesKaart key={les.id} les={les} />)}
            </div>
          </div>
        ))}

        {gefilterd.length === 0 && catFilter !== 'videos' && (
          <p style={{ textAlign: 'center', padding: '4rem', color: G.tekst3, fontStyle: 'italic' }}>
            Geen lessen gevonden voor deze filters.
          </p>
        )}
      </div>

      {/* ── Video's ── */}
      {toonVideos && (
        <section id="videos" style={{ maxWidth: 1100, margin: '3rem auto 0', padding: '0 2rem 3rem', borderTop: `0.5px solid ${G.rand}`, paddingTop: '3rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Extra leermaterial
          </p>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 400, color: G.tekst, marginBottom: '0.4rem' }}>
            Video Lessen
          </h2>
          <p style={{ fontSize: 16, fontStyle: 'italic', color: G.tekst2, marginBottom: '2rem' }}>
            Aanvullende video's van ervaren pendelmeesters.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.4rem' }}>
            {pendelVideos.map(video => {
              const bekeken = bekendeVideos.has(video.id);
              return (
                <VideoKaart
                  key={video.id}
                  video={video}
                  bekeken={bekeken}
                  onBekeken={() => markeerBekeken(video.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── Modal overlay ── */}
      <Modal />
    </div>
  );
};

// ─── Video kaart component ─────────────────────────────────────────────────
const VideoKaart: React.FC<{
  video: { id: string; titel: string; youtubeId: string; beschrijving: string; geschiktVoor: string };
  bekeken: boolean;
  onBekeken: () => void;
}> = ({ video, bekeken, onBekeken }) => {
  const [geladen, setGeladen] = useState(false);

  return (
    <div style={{
      border: `0.5px solid rgba(184,134,11,0.35)`,
      borderRadius: 8,
      overflow: 'hidden',
      background: '#FDFAF4',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {/* Thumbnail / embed */}
      {!geladen ? (
        <div
          onClick={() => { setGeladen(true); onBekeken(); }}
          style={{
            position: 'relative', background: '#1a1a2e',
            aspectRatio: '16/9', cursor: 'pointer', overflow: 'hidden',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 320 180" style={{ position: 'absolute', inset: 0 }}>
            <rect width={320} height={180} fill="#1a1a2e" />
            <circle cx={160} cy={90} r={60} fill="rgba(184,134,11,0.12)" />
            <polygon points="145,70 145,110 185,90" fill="rgba(255,255,255,0.08)" />
            <text x={160} y={148} textAnchor="middle" fontFamily="'Cinzel', serif" fontSize={11} fill="rgba(255,255,255,0.35)" letterSpacing={2}>
              PENDELEN
            </text>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 52, height: 52, background: 'rgba(184,134,11,0.88)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={20} height={20} viewBox="0 0 20 20"><polygon points="6,4 16,10 6,16" fill="white" /></svg>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ aspectRatio: '16/9', position: 'relative' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.titel}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div style={{ padding: '1rem 1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: '0.3rem' }}>
          <span style={{ fontSize: 15, color: '#2C2416', lineHeight: 1.4 }}>{video.titel}</span>
          {bekeken && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#E8F5E9', color: '#2E7D32', flexShrink: 0, border: '0.5px solid #A5D6A7' }}>
              Bekeken
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#9C8A6A', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '0.6rem' }}>{video.beschrijving}</p>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#F5EDD8', color: '#7A5C00', border: '0.5px solid rgba(184,134,11,0.35)' }}>
          {video.geschiktVoor}
        </span>
      </div>
    </div>
  );
};

export default LessenPage;
