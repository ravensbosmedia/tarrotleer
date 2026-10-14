import React from 'react';

// Eenvoudige, veilige Markdown-weergave: bouwt React-elementen (geen innerHTML), dus ingevoerde HTML
// wordt nooit uitgevoerd. Ondersteunt: ## / ### koppen, alinea's, - en 1. lijsten, **vet**, *cursief*,
// [links](https://…), ![afbeeldingen](/api/academie-media/… of https://…), regeleinde met twee spaties,
// en <details><summary>…</summary> … </details>.

interface Stijl { kop2: React.CSSProperties; kop3: React.CSSProperties; tekst: React.CSSProperties; link: string; rand: string; donker: boolean; open?: boolean }

/** Soorten blokken in een interactieve les: `> **Soort** (extra)` op de eerste regel. */
export type BlokSoort = 'In het kort' | 'Onthoud dit' | 'Voorbeeld' | 'Oefening' | 'Denk na' | 'Let op';
const BLOK_SOORTEN: BlokSoort[] = ['In het kort', 'Onthoud dit', 'Voorbeeld', 'Oefening', 'Denk na', 'Let op'];
export const BLOK_STIJL: Record<BlokSoort, { icoon: string; kleur: string }> = {
  'In het kort': { icoon: '🗝️', kleur: '#E0B04A' },
  'Onthoud dit': { icoon: '✨', kleur: '#E0B04A' },
  'Voorbeeld':   { icoon: '📖', kleur: '#8FA3B8' },
  'Oefening':    { icoon: '✍️', kleur: '#5FA777' },
  'Denk na':     { icoon: '💭', kleur: '#A78BCA' },
  'Let op':      { icoon: '⚠️', kleur: '#D08A3C' },
};

/** Optionele eigen weergave van een blok (de cursusspeler maakt Oefening en Denk na interactief). */
export type BlokWeergave = (soort: BlokSoort, inhoud: React.ReactNode, extra: string, sleutel: string, ruweTekst: string) => React.ReactNode | null;

/** Alleen afbeeldingen van onze eigen server of via https worden getoond. */
const veiligeBron = (src: string) => /^\/api\/academie-media\//.test(src) || /^https:\/\//.test(src);

const Afbeelding: React.FC<{ src: string; alt: string; los?: boolean }> = ({ src, alt, los }) => (
  <img src={src} alt={alt} loading="lazy"
    style={los
      ? { display: 'block', maxWidth: '100%', maxHeight: 520, margin: '0.8rem auto', borderRadius: 8 }
      : { maxWidth: '100%', verticalAlign: 'middle', borderRadius: 4 }} />
);

/** Inline opmaak: **vet**, *cursief*, ![afbeelding](url), [tekst](url). Links naar .md-bestanden worden gewone tekst. */
function inline(tekst: string, stijl: Stijl, sleutel = ''): React.ReactNode[] {
  const uit: React.ReactNode[] = [];
  const patroon = /!\[([^\]]*)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let laatste = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = patroon.exec(tekst))) {
    if (m.index > laatste) uit.push(tekst.slice(laatste, m.index));
    const k = `${sleutel}-${i++}`;
    if (m[2] !== undefined) uit.push(veiligeBron(m[2]) ? <Afbeelding key={k} src={m[2]} alt={m[1]} /> : `[afbeelding: ${m[1] || m[2]}]`);
    else if (m[3] !== undefined) uit.push(<strong key={k}>{inline(m[3], stijl, k)}</strong>);
    else if (m[4] !== undefined) uit.push(<em key={k}>{inline(m[4], stijl, k)}</em>);
    else if (/^https?:\/\//.test(m[6])) uit.push(<a key={k} href={m[6]} target="_blank" rel="noopener noreferrer" style={{ color: stijl.link }}>{m[5]}</a>);
    else uit.push(m[5]);
    laatste = m.index + m[0].length;
  }
  if (laatste < tekst.length) uit.push(tekst.slice(laatste));
  return uit;
}

/** Regels binnen een alinea: "twee spaties aan het eind" wordt een regeleinde. */
function alinea(regels: string[], stijl: Stijl, k: string) {
  return (
    <p key={k} style={stijl.tekst}>
      {regels.map((r, i) => (
        <React.Fragment key={i}>{inline(r.replace(/\s{2,}$/, ''), stijl, `${k}-${i}`)}{i < regels.length - 1 && (/\s{2,}$/.test(r) ? <br /> : ' ')}</React.Fragment>
      ))}
    </p>
  );
}

function blokken(md: string, stijl: Stijl, prefix = 'b', blokWeergave?: BlokWeergave): React.ReactNode[] {
  const regels = md.replace(/\r\n/g, '\n').split('\n');
  const uit: React.ReactNode[] = [];
  let i = 0;
  let n = 0;
  while (i < regels.length) {
    const r = regels[i];
    const k = `${prefix}${n++}`;
    if (!r.trim()) { i++; continue; }

    // <details> … </details>
    if (/^<details>/i.test(r.trim())) {
      const binnen: string[] = [];
      let samenvatting = 'Meer';
      i++;
      while (i < regels.length && !/^<\/details>/i.test(regels[i].trim())) {
        const s = regels[i].match(/<summary>(.*?)<\/summary>/i);
        if (s) samenvatting = s[1];
        else if (!/^<\/?summary>/i.test(regels[i].trim())) binnen.push(regels[i]);
        i++;
      }
      i++;
      uit.push(
        <details key={k} open={stijl.open || undefined} style={{ border: `0.5px solid ${stijl.rand}`, borderRadius: 8, padding: '0.6rem 0.9rem', margin: '0.8rem 0' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{inline(samenvatting, stijl, k)}</summary>
          <div style={{ marginTop: '0.6rem' }}>{blokken(binnen.join('\n'), stijl, `${k}d`, blokWeergave)}</div>
        </details>,
      );
      continue;
    }

    // Citaatblok (`> …`): gewoon citaat of een les-blok zoals `> **Oefening** (10 minuten)`
    if (/^\s*>/.test(r)) {
      const binnen: string[] = [];
      while (i < regels.length && /^\s*>/.test(regels[i])) { binnen.push(regels[i].replace(/^\s*>\s?/, '')); i++; }
      const kopRegel = binnen[0]?.trim().match(/^\*\*([^*]+)\*\*\s*:?\s*(.*)$/);
      const soort = kopRegel && BLOK_SOORTEN.find((x) => x.toLowerCase() === kopRegel[1].trim().replace(/:$/, '').toLowerCase());
      if (soort) {
        const extra = (kopRegel![2] || '').trim();
        const rest = binnen.slice(1).join('\n');
        const inhoud = <>{blokken(rest, stijl, `${k}q`, blokWeergave)}</>;
        const eigen = blokWeergave?.(soort, inhoud, extra, k, rest);
        if (eigen) { uit.push(<React.Fragment key={k}>{eigen}</React.Fragment>); continue; }
        const { icoon, kleur } = BLOK_STIJL[soort];
        uit.push(
          <div key={k} style={{ border: `1px solid ${kleur}55`, borderLeft: `4px solid ${kleur}`, background: `${kleur}14`, borderRadius: 10, padding: '0.8rem 1rem', margin: '1rem 0' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.06em', color: kleur, marginBottom: 6 }}>
              {icoon} {soort.toUpperCase()}{extra ? <span style={{ fontFamily: 'inherit', textTransform: 'none', opacity: 0.8 }}> {extra}</span> : null}
            </div>
            {inhoud}
          </div>,
        );
      } else {
        uit.push(
          <blockquote key={k} style={{ borderLeft: `3px solid ${stijl.rand}`, margin: '1rem 0', padding: '0.2rem 0 0.2rem 1rem', fontStyle: 'italic' }}>
            {blokken(binnen.join('\n'), stijl, `${k}q`, blokWeergave)}
          </blockquote>,
        );
      }
      continue;
    }

    // Afbeelding op een eigen regel: groot en gecentreerd, met het alt-bijschrift eronder
    const losseAfb = r.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (losseAfb) {
      uit.push(veiligeBron(losseAfb[2]) ? (
        <figure key={k} style={{ margin: '1rem 0', textAlign: 'center' }}>
          <Afbeelding src={losseAfb[2]} alt={losseAfb[1]} los />
          {losseAfb[1] && <figcaption style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{losseAfb[1]}</figcaption>}
        </figure>
      ) : <p key={k} style={stijl.tekst}>[afbeelding: {losseAfb[1] || losseAfb[2]}]</p>);
      i++;
      continue;
    }

    const kop = r.match(/^(#{1,4})\s+(.+)$/);
    if (kop) {
      uit.push(kop[1].length <= 2
        ? <h2 key={k} style={stijl.kop2}>{inline(kop[2], stijl, k)}</h2>
        : <h3 key={k} style={stijl.kop3}>{inline(kop[2], stijl, k)}</h3>);
      i++;
      continue;
    }

    // Tabel: | kop | kop | met daaronder |---|---|
    if (/^\s*\|.*\|\s*$/.test(r) && /^\s*\|?\s*:?-{2,}/.test(regels[i + 1] || '')) {
      const cellen = (x: string) => x.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const kopCellen = cellen(r);
      i += 2;
      const rijen: string[][] = [];
      while (i < regels.length && /^\s*\|/.test(regels[i])) { rijen.push(cellen(regels[i])); i++; }
      const cel: React.CSSProperties = { border: `1px solid ${stijl.rand}`, padding: '0.4rem 0.6rem', verticalAlign: 'top', textAlign: 'left' };
      uit.push(
        <div key={k} style={{ overflowX: 'auto', margin: '0.8rem 0 1rem' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 15, lineHeight: 1.5, color: stijl.tekst.color }}>
            <thead><tr>{kopCellen.map((c, j) => <th key={j} style={{ ...cel, background: stijl.donker ? 'rgba(239,180,255,0.12)' : 'rgba(91,46,122,0.08)', fontWeight: 600 }}>{inline(c, stijl, `${k}h${j}`)}</th>)}</tr></thead>
            <tbody>{rijen.map((rij, ri) => <tr key={ri} style={{ breakInside: 'avoid' }}>{kopCellen.map((_, j) => <td key={j} style={cel}>{inline(rij[j] || '', stijl, `${k}r${ri}-${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Lijsten (ook geneste regels met inspringing horen bij het vorige punt)
    const isPunt = (x: string) => /^\s{0,3}[-*]\s+/.test(x);
    const isNummer = (x: string) => /^\s{0,3}\d+[.)]\s+/.test(x);
    if (isPunt(r) || isNummer(r)) {
      const genummerd = isNummer(r);
      const items: string[] = [];
      while (i < regels.length && regels[i].trim() && (genummerd ? isNummer(regels[i]) : isPunt(regels[i]) || /^\s{2,}\S/.test(regels[i]))) {
        if (genummerd ? isNummer(regels[i]) : isPunt(regels[i])) items.push(regels[i].replace(/^\s*(?:[-*]|\d+[.)])\s+/, ''));
        else items[items.length - 1] += ' ' + regels[i].trim();
        i++;
      }
      const Lijst = genummerd ? 'ol' : 'ul';
      // Een genummerde lijst begint bij het nummer uit de tekst (bijv. antwoorden 5–7 na een tussenregel)
      const start = genummerd ? Number(r.match(/\d+/)?.[0] || 1) : undefined;
      uit.push(
        <Lijst key={k} start={start !== 1 ? start : undefined} style={{ ...stijl.tekst, paddingLeft: '1.4rem' }}>
          {items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}>{inline(it, stijl, `${k}-${j}`)}</li>)}
        </Lijst>,
      );
      continue;
    }

    // Gewone alinea tot een lege regel of een nieuw blok
    const alineaRegels: string[] = [];
    while (i < regels.length && regels[i].trim() && !/^(#{1,4}\s|<details>|\s{0,3}[-*]\s|\s{0,3}\d+[.)]\s|\s*>|\s*\|.*\|\s*$)/i.test(regels[i])) {
      alineaRegels.push(regels[i]);
      i++;
    }
    if (alineaRegels.length) uit.push(alinea(alineaRegels, stijl, k));
    else i++;
  }
  return uit;
}

export const Markdown: React.FC<{ tekst: string; donker?: boolean; blokWeergave?: BlokWeergave; uitgeklapt?: boolean }> = ({ tekst, donker = true, blokWeergave, uitgeklapt }) => {
  const kleur = donker ? '#FFF3DF' : '#20162F';
  const accent = donker ? '#F1CB78' : '#5B2E7A';   // Zen Flow: goud op het scherm, paars op papier
  const stijl: Stijl = {
    kop2: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: accent, margin: '1.6rem 0 0.6rem' },
    kop3: { fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 500, color: accent, margin: '1.2rem 0 0.4rem' },
    tekst: { fontSize: 16, lineHeight: 1.75, color: kleur, margin: '0 0 0.9rem' },
    link: donker ? '#FFC653' : '#5B2E7A',
    rand: donker ? 'rgba(239,180,255,0.3)' : 'rgba(91,46,122,0.3)',
    donker,
    open: uitgeklapt,
  };
  return <div>{blokken(tekst, stijl, 'b', blokWeergave)}</div>;
};
