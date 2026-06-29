import React, { useRef, useEffect, useState, useCallback } from 'react';

export type PendelMode = 'right' | 'left' | 'fb' | 'lr' | 'still';

export interface PendelAnimatieProps {
  mode?: PendelMode;
  width?: number;
  height?: number;
  showControls?: boolean;
  onModeChange?: (mode: PendelMode) => void;
}

// ── Canvas pendel engine (bovenaanzicht) ──────────────────────────────────
interface Engine {
  setMode: (m: PendelMode) => void;
  stop: () => void;
}

function createEngine(canvas: HTMLCanvasElement, startMode: PendelMode): Engine {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) * 0.34;
  let mode: PendelMode = startMode;
  let t = 0;
  let rafId = 0;

  function getPos(time: number): { x: number; y: number } {
    const s = 1.6;
    if (mode === 'right') { const a = time * s; return { x: cx + Math.sin(a) * R, y: cy + Math.cos(a) * R }; }
    if (mode === 'left')  { const a = -time * s; return { x: cx + Math.sin(a) * R, y: cy + Math.cos(a) * R }; }
    if (mode === 'fb')    { const d = Math.sin(time * s) * R; return { x: cx, y: cy + d }; }
    if (mode === 'lr')    { const d = Math.sin(time * s) * R; return { x: cx + d, y: cy }; }
    return { x: cx, y: cy };
  }

  function drawChain(tx: number, ty: number) {
    const dx = tx - cx, dy = ty - cy;
    const ang = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const startR = 18, steps = 14;
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const r = startR + (dist - 16) * f;
      const lx = cx + Math.cos(ang) * r;
      const ly = cy + Math.sin(ang) * r;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(ang + (i % 2 === 0 ? 0 : Math.PI / 2));
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.4, 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#D4A84B' : '#B87A0B';
      ctx.fill();
      ctx.strokeStyle = '#8B6914';
      ctx.lineWidth = 0.3;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPendel(px: number, py: number) {
    // Schaduw
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.beginPath();
    ctx.ellipse(px + 3, py + 3, 16, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#3A2800';
    ctx.fill();
    ctx.restore();

    // Gouden bob met radiaalgradiënt
    const g = ctx.createRadialGradient(px - 5, py - 5, 1, px, py, 16);
    g.addColorStop(0, '#F8F090');
    g.addColorStop(0.25, '#E0C040');
    g.addColorStop(0.6, '#B8860B');
    g.addColorStop(1, '#4A3000');
    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = '#7A5C00';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Gravuur ringen
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(70,45,0,0.22)'; ctx.lineWidth = 0.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(70,45,0,0.18)'; ctx.lineWidth = 0.5; ctx.stroke();

    // Middenpunt
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#2A1600'; ctx.fill();

    // Glinstering
    ctx.beginPath();
    ctx.ellipse(px - 5, py - 5, 5, 3, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fill();
  }

  function drawFingers() {
    const skin = '#E8C9A0', skinD = '#C9A080', nail = '#F5E8C0';

    // Wijsvinger links
    ctx.save(); ctx.translate(cx - 11, cy);
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 13, -0.08, 0, Math.PI * 2);
    ctx.fillStyle = skin; ctx.fill(); ctx.strokeStyle = skinD; ctx.lineWidth = 0.7; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -5, 4, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = nail; ctx.fill(); ctx.strokeStyle = skinD; ctx.lineWidth = 0.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 5, 5, 1.8, 0, 0, Math.PI * 2);
    ctx.strokeStyle = skinD; ctx.lineWidth = 0.4; ctx.stroke();
    ctx.restore();

    // Duim rechts
    ctx.save(); ctx.translate(cx + 11, cy + 2);
    ctx.beginPath(); ctx.ellipse(0, 0, 6, 11, 0.12, 0, Math.PI * 2);
    ctx.fillStyle = skin; ctx.fill(); ctx.strokeStyle = skinD; ctx.lineWidth = 0.7; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -4, 3.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = nail; ctx.fill(); ctx.strokeStyle = skinD; ctx.lineWidth = 0.4; ctx.stroke();
    ctx.restore();

    // Gouden ring — ketting hangt hier aan
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#D4A84B'; ctx.fill();
    ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#7A5C00'; ctx.fill();
  }

  function drawTrail(time: number) {
    if (mode === 'still') return;
    for (let i = 0; i < 40; i++) {
      const p = getPos(time - (40 - i) * 0.018);
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,134,11,${(i / 40) * 0.13})`;
      ctx.fill();
    }
  }

  function drawGuide() {
    if (mode === 'still') return;
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    if (mode === 'right' || mode === 'left') {
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    } else if (mode === 'fb') {
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    } else if (mode === 'lr') {
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawArrow(time: number) {
    if (mode === 'still') return;
    const s = 1.6;
    const pos = getPos(time);
    let ang = 0;
    if (mode === 'right')     ang = time * s + Math.PI / 2;
    else if (mode === 'left') ang = -time * s - Math.PI / 2;
    else if (mode === 'fb')   ang = Math.cos(time * s) > 0 ? Math.PI / 2 : -Math.PI / 2;
    else                      ang = Math.cos(time * s) > 0 ? 0 : Math.PI;

    const px = pos.x, py = pos.y, len = 18;
    const ex = px + Math.cos(ang) * len, ey = py + Math.sin(ang) * len;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - Math.cos(ang - 0.45) * 10, ey - Math.sin(ang - 0.45) * 10);
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - Math.cos(ang + 0.45) * 10, ey - Math.sin(ang + 0.45) * 10);
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawGuide();
    drawTrail(t);
    const pos = getPos(t);
    drawChain(pos.x, pos.y);
    drawArrow(t);
    drawPendel(pos.x, pos.y);
    drawFingers();
    t += 0.016;
    rafId = requestAnimationFrame(frame);
  }

  frame();

  return {
    setMode(m: PendelMode) { mode = m; t = 0; },
    stop() { cancelAnimationFrame(rafId); },
  };
}

// ── React component ────────────────────────────────────────────────────────
const LABELS: Record<PendelMode, string> = {
  right: '↻ Rechtsom',
  left:  '↺ Linksom',
  fb:    '↕ Voor–achter',
  lr:    '↔ Links–rechts',
  still: '— Stil',
};

const G = {
  goud:     '#B8860B',
  goudBleek:'#F5EDD8',
  goudDonker:'#7A5C00',
  rand2:    'rgba(184,134,11,0.35)',
  tekst3:   '#9C8A6A',
};

export const PendelAnimatie: React.FC<PendelAnimatieProps> = ({
  mode: initialMode = 'right',
  width  = 280,
  height = 280,
  showControls = true,
  onModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [activeMode, setActiveMode] = useState<PendelMode>(initialMode);

  // Start engine op mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    engineRef.current = createEngine(canvas, initialMode);
    return () => { engineRef.current?.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // bewust lege deps — engine start eenmalig

  // Mode wijzigen van buiten (controlled)
  useEffect(() => {
    if (initialMode !== activeMode) {
      setActiveMode(initialMode);
      engineRef.current?.setMode(initialMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode]);

  const handleModeClick = useCallback((m: PendelMode) => {
    setActiveMode(m);
    engineRef.current?.setMode(m);
    onModeChange?.(m);
  }, [onModeChange]);

  const btnStyle = (m: PendelMode): React.CSSProperties => ({
    fontFamily: "'Cinzel', serif",
    fontSize: 11,
    letterSpacing: '0.05em',
    padding: '5px 12px',
    borderRadius: 20,
    border: `0.5px solid ${m === activeMode ? G.goud : G.rand2}`,
    background: m === activeMode ? G.goudBleek : 'transparent',
    color: m === activeMode ? G.goudDonker : G.tekst3,
    cursor: 'pointer',
    transition: 'all 0.18s',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'block' }}
      />
      {showControls && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(Object.keys(LABELS) as PendelMode[]).map(m => (
            <button key={m} style={btnStyle(m)} onClick={() => handleModeClick(m)}>
              {LABELS[m]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Mapping vanuit oude lessen-data beweging namen → PendelMode
export const bewegingNaarMode: Record<string, PendelMode> = {
  rechtsdraaiend: 'right',
  linksdraaiend:  'left',
  'voor-achter':  'fb',
  'links-rechts': 'lr',
  stilstaand:     'still',
};

export default PendelAnimatie;
