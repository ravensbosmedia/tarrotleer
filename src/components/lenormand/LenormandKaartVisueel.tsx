import React, { useState } from 'react';
import { LenormandKaart } from '../../types/lenormand';

interface Props {
  kaart: LenormandKaart;
  grootte?: number;
  omgekeerd?: boolean;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
}

export const LenormandKaartVisueel: React.FC<Props> = ({
  kaart,
  grootte = 120,
  omgekeerd = false,
  onClick,
  selected = false,
  dimmed = false,
}) => {
  // Toon de echte kaartafbeelding zodra die in public/lenormand/ staat;
  // ontbreekt het bestand (of laadt het niet), dan valt de kaart terug op het symbool.
  const [afbFout, setAfbFout] = useState(false);
  const toonAfbeelding = !!kaart.afbeelding && !afbFout;

  const breedte = Math.round(grootte * 0.65);
  const hoogte = grootte;
  const fontSize = Math.round(grootte * 0.28);
  const numFontSize = Math.round(grootte * 0.085);
  const naamFontSize = Math.round(grootte * 0.09);

  return (
    <div
      onClick={onClick}
      style={{
        width: breedte,
        height: hoogte,
        borderRadius: Math.round(grootte * 0.07),
        background: `linear-gradient(145deg, ${kaart.kleur}22 0%, ${kaart.kleurDonker}18 100%)`,
        border: `${selected ? 2 : 1}px solid ${selected ? kaart.kleur : kaart.kleur + '55'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${Math.round(grootte * 0.06)}px ${Math.round(grootte * 0.04)}px`,
        cursor: onClick ? 'pointer' : 'default',
        transform: omgekeerd ? 'rotate(180deg)' : 'none',
        opacity: dimmed ? 0.35 : 1,
        transition: 'all 0.2s',
        boxShadow: selected
          ? `0 0 0 3px ${kaart.kleur}44, 0 4px 12px ${kaart.kleur}33`
          : '0 2px 6px rgba(0,0,0,0.08)',
        flexShrink: 0,
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {toonAfbeelding ? (
        <>
          {/* Echte kaartafbeelding (vult de kaart) */}
          <img
            src={kaart.afbeelding}
            alt={kaart.naam}
            onError={() => setAfbFout(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Nummer-badge */}
          <div style={{
            position: 'absolute',
            top: Math.round(grootte * 0.04),
            left: Math.round(grootte * 0.05),
            fontFamily: "'Cinzel', serif",
            fontSize: numFontSize,
            color: '#fff',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            zIndex: 2,
          }}>
            {kaart.id}
          </div>
          {/* Naam-balk onderaan voor leesbaarheid */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            padding: `${Math.round(grootte * 0.07)}px ${Math.round(grootte * 0.04)}px ${Math.round(grootte * 0.04)}px`,
            background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)',
            fontFamily: "'Cinzel', serif",
            fontSize: naamFontSize,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.2,
            fontWeight: 500,
            letterSpacing: '0.02em',
            zIndex: 2,
          }}>
            {kaart.naam}
          </div>
        </>
      ) : (
        <>
          {/* Decoratieve hoek-ornament */}
          <div style={{
            position: 'absolute', top: 4, left: 4, right: 4,
            height: 1, background: `${kaart.kleur}33`,
          }} />
          <div style={{
            position: 'absolute', bottom: 4, left: 4, right: 4,
            height: 1, background: `${kaart.kleur}33`,
          }} />

          {/* Nummer */}
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: numFontSize,
            color: kaart.kleur,
            fontWeight: 600,
            letterSpacing: '0.05em',
            opacity: 0.85,
          }}>
            {kaart.id}
          </div>

          {/* Symbool */}
          <div style={{ fontSize: fontSize, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>
            {kaart.symbool}
          </div>

          {/* Naam */}
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: naamFontSize,
            color: kaart.kleurDonker,
            textAlign: 'center',
            lineHeight: 1.2,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            {kaart.naam}
          </div>
        </>
      )}
    </div>
  );
};

// Rug van de kaart (onbekende kaart)
export const LenormandKaartRug: React.FC<{ grootte?: number }> = ({ grootte = 120 }) => {
  const breedte = Math.round(grootte * 0.65);
  return (
    <div style={{
      width: breedte,
      height: grootte,
      borderRadius: Math.round(grootte * 0.07),
      background: 'linear-gradient(145deg, #2C2416 0%, #4A3822 100%)',
      border: '1px solid rgba(184,134,11,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        width: '75%', height: '85%',
        border: '1px solid rgba(184,134,11,0.3)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'repeating-linear-gradient(45deg, rgba(184,134,11,0.04) 0px, rgba(184,134,11,0.04) 2px, transparent 2px, transparent 8px)',
      }}>
        <span style={{ fontSize: Math.round(grootte * 0.2), opacity: 0.4 }}>✦</span>
      </div>
    </div>
  );
};

export default LenormandKaartVisueel;
