import type React from 'react';

/** Zen Flow-bouwstenen voor inline-stijlen (gelijk aan de klassen .zf-* in index.css en aan zen-flow.nl). */
export const ZF = {
  goud: '#F1CB78', tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  bg: '#0D0C22', paneel: '#20162F', paneel2: '#2D2040',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};

const knopBasis: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 44, padding: '12px 26px',
  borderRadius: 28, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, lineHeight: 1.2,
  textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all .2s',
};
/** Gouden hoofdknop (zoals "Begin jouw spirituele reis" op zen-flow.nl). */
export const ZF_KNOP: React.CSSProperties = {
  ...knopBasis, border: '1px solid #FFF2C3', background: 'linear-gradient(#FFEEB5, #FFC653 58%, #EEB153)', color: '#1C0D06',
  boxShadow: 'inset 0 0 7px #FFF1AF, 0 0 16px #FFA33B55',
};
/** Paarse tweede knop. */
export const ZF_KNOP_PAARS: React.CSSProperties = {
  ...knopBasis, border: '1px solid #EFB4FF', background: 'linear-gradient(#322040, #160D24)', color: '#fff', fontWeight: 600,
  boxShadow: '0 0 12px #BF60ED55, inset 0 0 12px #C45FE62A',
};
