import React, { useState, useRef } from 'react';
import { pendelSchijven, PendelSchijfConfig } from '../../data/pendel/schijven';
import { PendelSchijf } from '../../components/pendel/PendelSchijf';

const G = {
  goud: '#F1CB78',
  goudLicht: '#FFC653',
  goudBleek: '#2D2040',
  goudDonker: '#E0B04A',
  bg: '#0D0C22',
  bg2: '#20162F',
  bg3: '#2D2040',
  tekst: '#FFF3DF',
  tekst2: '#E0D5E9',
  tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)',
  rand2: 'rgba(239,180,255,0.38)',
};

// ─── SVG download helper ───────────────────────────────────────────────────
function downloadSvg(svgEl: SVGSVGElement, bestandsnaam: string) {
  const serializer = new XMLSerializer();
  let svgStr = serializer.serializeToString(svgEl);
  // Voeg XML-declaratie en xmlns toe indien nodig
  if (!svgStr.includes('xmlns=')) {
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = bestandsnaam;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Modal ─────────────────────────────────────────────────────────────────
const SchijfModal: React.FC<{
  schijf: PendelSchijfConfig;
  onSluit: () => void;
}> = ({ schijf, onSluit }) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [uitlegOpen, setUitlegOpen] = useState(false);

  const handleDownload = () => {
    const svg = svgRef.current?.querySelector('svg') as SVGSVGElement | null;
    if (svg) downloadSvg(svg, `${schijf.naam.toLowerCase().replace(/\s+/g, '-')}.svg`);
  };

  const handlePrint = () => {
    const svg = svgRef.current?.querySelector('svg') as SVGSVGElement | null;
    if (!svg) return;
    const serializer = new XMLSerializer();
    let svgStr = serializer.serializeToString(svg);
    if (!svgStr.includes('xmlns=')) {
      svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>${schijf.naam}</title>
        <style>
          body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: white; }
          svg { max-width: 90vmin; max-height: 90vmin; }
          @media print { @page { margin: 1cm; } }
        </style>
      </head><body>${svgStr}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onSluit(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,4,21,0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: '2rem 1rem',
      }}
    >
      <div style={{
        background: G.bg,
        border: `0.5px solid ${G.rand2}`,
        borderRadius: 8,
        width: '100%', maxWidth: 680,
        padding: '2rem',
        position: 'relative',
        margin: 'auto',
      }}>
        <button
          onClick={onSluit}
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', fontSize: 22, color: G.tekst3, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
        >×</button>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Pendelschijf
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: G.tekst, marginBottom: '0.5rem' }}>
          {schijf.naam}
        </h2>
        <p style={{ fontSize: 15, color: G.tekst2, fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {schijf.beschrijving}
        </p>

        {/* SVG schijf */}
        <div ref={svgRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <PendelSchijf schijf={schijf} grootte={380} toonLabels={true} />
        </div>

        {/* Segmentenlijst collapsable */}
        <div style={{ marginBottom: '1.2rem' }}>
          <button
            onClick={() => setUitlegOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em',
              color: G.goud, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            {uitlegOpen ? '▾' : '▸'} Segmenten ({schijf.segmenten.length})
          </button>
          {uitlegOpen && (
            <div style={{ marginTop: '0.8rem', maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
              {schijf.segmenten.map((seg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '0.4rem 0.5rem', borderRadius: 4, marginBottom: 2 }}>
                  <span style={{
                    marginTop: 3, width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                    background: seg.kleur ?? '#c4b5fd', border: '0.5px solid rgba(0,0,0,0.1)',
                  }} />
                  <div>
                    <span style={{ fontWeight: 500, fontSize: 13, color: G.tekst }}>{seg.label}</span>
                    {seg.beschrijving && (
                      <p style={{ fontSize: 12, color: G.tekst3, margin: 0 }}>{seg.beschrijving}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Knoppen */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', borderTop: `0.5px solid ${G.rand}`, paddingTop: '1.2rem' }}>
          <button
            onClick={handleDownload}
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em',
              padding: '9px 20px', background: G.goudBleek, color: G.goudDonker,
              border: `0.5px solid ${G.rand2}`, borderRadius: 4, cursor: 'pointer',
            }}
          >
            ↓ Download SVG
          </button>
          <button
            onClick={handlePrint}
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em',
              padding: '9px 20px', background: G.goud, color: '#1C0D06',
              border: 'none', borderRadius: 4, cursor: 'pointer',
            }}
          >
            🖨 Afdrukken
          </button>
          <button
            onClick={onSluit}
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em',
              padding: '9px 20px', background: 'transparent', color: G.tekst3,
              border: `0.5px solid ${G.rand2}`, borderRadius: 4, cursor: 'pointer',
            }}
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Hoofdpagina ───────────────────────────────────────────────────────────
export const SchijvenPage: React.FC = () => {
  const [geselecteerd, setGeselecteerd] = useState<PendelSchijfConfig | null>(null);

  return (
    <div className="pendel-pagina">
      {/* Header */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.7rem' }}>
            Digitale hulpmiddelen
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: '0.5rem' }}>
            Pendelschijven
          </h1>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 560 }}>
            Houd je pendel boven een schijf en concentreer je op je vraag. Klik op een schijf om hem te vergroten, te downloaden of af te drukken.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {pendelSchijven.map(schijf => (
            <SchijfKaart
              key={schijf.id}
              schijf={schijf}
              onClick={() => setGeselecteerd(schijf)}
            />
          ))}
        </div>
      </div>

      {geselecteerd && (
        <SchijfModal schijf={geselecteerd} onSluit={() => setGeselecteerd(null)} />
      )}
    </div>
  );
};

// ─── Schijf kaart ──────────────────────────────────────────────────────────
const SchijfKaart: React.FC<{
  schijf: PendelSchijfConfig;
  onClick: () => void;
}> = ({ schijf, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? G.goudBleek : G.bg,
        border: `0.5px solid ${hover ? G.goud : G.rand2}`,
        borderRadius: 8,
        padding: '1.4rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? `0 4px 16px rgba(0,0,0,0.08)` : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', pointerEvents: 'none', marginBottom: '0.75rem' }}>
        <PendelSchijf schijf={schijf} grootte={140} toonLabels={true} />
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: G.tekst, marginBottom: '0.25rem' }}>
        {schijf.naam}
      </div>
      <div style={{ fontSize: 12, color: G.tekst3, fontStyle: 'italic', marginBottom: '0.6rem' }}>
        {schijf.segmenten.length} segmenten
      </div>
      <div style={{ fontSize: 11, color: G.goud, letterSpacing: '0.04em' }}>
        Klik om te openen →
      </div>
    </div>
  );
};

export default SchijvenPage;
