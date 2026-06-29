import React from 'react';
import { PendelSchijfConfig } from '../../data/pendel/schijven';

interface PendelSchijfProps {
  schijf: PendelSchijfConfig;
  grootte?: number;
  toonLabels?: boolean;
  gemarkeerdeIndex?: number;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function taartpunt(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function afkortenLabel(label: string, maxLen: number = 10): string {
  if (label.length <= maxLen) return label;
  return label.slice(0, maxLen - 1) + '…';
}

export const PendelSchijf: React.FC<PendelSchijfProps> = ({
  schijf,
  grootte = 400,
  toonLabels = true,
  gemarkeerdeIndex,
}) => {
  const cx = grootte / 2;
  const cy = schijf.type === 'halfrond' ? grootte / 2 : grootte / 2;
  const r = (grootte / 2) * 0.82;
  const innerR = 22;
  const n = schijf.segmenten.length;

  const renderTaart = () => {
    const hoekPerSegment = 360 / n;
    return schijf.segmenten.map((seg, i) => {
      const startAngle = i * hoekPerSegment;
      const endAngle = (i + 1) * hoekPerSegment;
      const midAngle = startAngle + hoekPerSegment / 2;
      const labelR = r * 0.68;
      const labelPos = polarToCartesian(cx, cy, labelR, midAngle);
      const isGemarkeerd = gemarkeerdeIndex === i;

      const kleur = seg.kleur ?? '#c4b5fd';
      const darkerKleur = isGemarkeerd ? '#fbbf24' : kleur;

      return (
        <g key={i}>
          <path
            d={taartpunt(cx, cy, r, startAngle, endAngle)}
            fill={darkerKleur}
            stroke="white"
            strokeWidth={isGemarkeerd ? 3 : 1.5}
            opacity={isGemarkeerd ? 1 : 0.92}
          />
          {toonLabels && (
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={n > 20 ? 8 : n > 12 ? 9 : 11}
              fill={isGemarkeerd ? '#1e1b4b' : '#1f2937'}
              fontWeight={isGemarkeerd ? 'bold' : 'normal'}
              style={{ userSelect: 'none' }}
            >
              {afkortenLabel(seg.label, n > 20 ? 6 : n > 12 ? 8 : 12)}
            </text>
          )}
        </g>
      );
    });
  };

  const renderHalfrond = () => {
    const hoekPerSegment = 180 / n;
    return schijf.segmenten.map((seg, i) => {
      const startAngle = i * hoekPerSegment - 90;
      const endAngle = (i + 1) * hoekPerSegment - 90;
      const midAngle = startAngle + hoekPerSegment / 2;
      const labelR = r * 0.68;
      const labelPos = polarToCartesian(cx, cy, labelR, midAngle + 90);
      const isGemarkeerd = gemarkeerdeIndex === i;

      const kleur = seg.kleur ?? '#c4b5fd';
      const darkerKleur = isGemarkeerd ? '#fbbf24' : kleur;

      const startAngleDraw = startAngle + 90;
      const endAngleDraw = endAngle + 90;

      return (
        <g key={i}>
          <path
            d={taartpunt(cx, cy, r, startAngleDraw, endAngleDraw)}
            fill={darkerKleur}
            stroke="white"
            strokeWidth={isGemarkeerd ? 3 : 1.5}
            opacity={isGemarkeerd ? 1 : 0.92}
          />
          {toonLabels && (
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={n > 15 ? 8 : 10}
              fill={isGemarkeerd ? '#1e1b4b' : '#1f2937'}
              fontWeight={isGemarkeerd ? 'bold' : 'normal'}
              style={{ userSelect: 'none' }}
            >
              {afkortenLabel(seg.label, n > 15 ? 5 : 8)}
            </text>
          )}
        </g>
      );
    });
  };

  const svgHoogte = schijf.type === 'halfrond' ? grootte / 2 + 20 : grootte;

  return (
    <>
      <style>{`
        @media print {
          body > *:not(.pendel-schijf-print) { display: none !important; }
          .pendel-schijf-print { display: block !important; }
        }
      `}</style>
      <div className="pendel-schijf-print flex flex-col items-center gap-2">
        <svg
          width={grootte}
          height={svgHoogte}
          viewBox={`0 0 ${grootte} ${svgHoogte}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {schijf.type === 'taart' && renderTaart()}
          {schijf.type === 'halfrond' && (
            <>
              {renderHalfrond()}
              {/* Basis lijn van halfrond */}
              <line
                x1={cx - r}
                y1={cy}
                x2={cx + r}
                y2={cy}
                stroke="#6b7280"
                strokeWidth={2}
              />
            </>
          )}

          {/* Middencirkel */}
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="white"
            stroke="#d1d5db"
            strokeWidth={2}
          />

          {/* Wijzer driehoek */}
          <polygon
            points={`${cx},${cy - innerR - 10} ${cx - 5},${cy - innerR + 2} ${cx + 5},${cy - innerR + 2}`}
            fill="#7c3aed"
          />

          {/* Schijfrand */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#6b7280"
            strokeWidth={2}
          />
        </svg>

        {/* Afdrukknop */}
        <button
          onClick={() => window.print()}
          className="mt-2 px-4 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 rounded-full text-sm font-medium transition-colors"
        >
          Afdrukken
        </button>
      </div>
    </>
  );
};

export default PendelSchijf;
