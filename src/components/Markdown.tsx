import React from 'react';

// Eenvoudige, veilige Markdown-weergave: bouwt React-elementen (geen innerHTML), dus ingevoerde HTML
// wordt nooit uitgevoerd. Ondersteunt: ## / ### koppen, alinea's, - en 1. lijsten, **vet**, *cursief*,
// [links](https://…), regeleinde met twee spaties, en <details><summary>…</summary> … </details>.

interface Stijl { kop2: React.CSSProperties; kop3: React.CSSProperties; tekst: React.CSSProperties; link: string; rand: string }

/** Inline opmaak: **vet**, *cursief*, [tekst](url). Links naar .md-bestanden worden gewone tekst. */
function inline(tekst: string, stijl: Stijl, sleutel = ''): React.ReactNode[] {
  const uit: React.ReactNode[] = [];
  const patroon = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let laatste = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = patroon.exec(tekst))) {
    if (m.index > laatste) uit.push(tekst.slice(laatste, m.index));
    const k = `${sleutel}-${i++}`;
    if (m[1] !== undefined) uit.push(<strong key={k}>{inline(m[1], stijl, k)}</strong>);
    else if (m[2] !== undefined) uit.push(<em key={k}>{inline(m[2], stijl, k)}</em>);
    else if (/^https?:\/\//.test(m[4])) uit.push(<a key={k} href={m[4]} target="_blank" rel="noopener noreferrer" style={{ color: stijl.link }}>{m[3]}</a>);
    else uit.push(m[3]);
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

function blokken(md: string, stijl: Stijl, prefix = 'b'): React.ReactNode[] {
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
        <details key={k} style={{ border: `0.5px solid ${stijl.rand}`, borderRadius: 8, padding: '0.6rem 0.9rem', margin: '0.8rem 0' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{inline(samenvatting, stijl, k)}</summary>
          <div style={{ marginTop: '0.6rem' }}>{blokken(binnen.join('\n'), stijl, `${k}d`)}</div>
        </details>,
      );
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
      uit.push(
        <Lijst key={k} style={{ ...stijl.tekst, paddingLeft: '1.4rem' }}>
          {items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}>{inline(it, stijl, `${k}-${j}`)}</li>)}
        </Lijst>,
      );
      continue;
    }

    // Gewone alinea tot een lege regel of een nieuw blok
    const alineaRegels: string[] = [];
    while (i < regels.length && regels[i].trim() && !/^(#{1,4}\s|<details>|\s{0,3}[-*]\s|\s{0,3}\d+[.)]\s)/i.test(regels[i])) {
      alineaRegels.push(regels[i]);
      i++;
    }
    if (alineaRegels.length) uit.push(alinea(alineaRegels, stijl, k));
    else i++;
  }
  return uit;
}

export const Markdown: React.FC<{ tekst: string; donker?: boolean }> = ({ tekst, donker = true }) => {
  const kleur = donker ? '#F5EDD8' : '#2C2416';
  const stijl: Stijl = {
    kop2: { fontFamily: "'Cinzel', serif", fontSize: 18, letterSpacing: '0.06em', color: '#B8860B', margin: '1.6rem 0 0.6rem' },
    kop3: { fontFamily: "'Cinzel', serif", fontSize: 15, color: '#B8860B', margin: '1.2rem 0 0.4rem' },
    tekst: { fontSize: 16, lineHeight: 1.75, color: kleur, margin: '0 0 0.9rem' },
    link: '#D4A537',
    rand: 'rgba(184,134,11,0.3)',
  };
  return <div>{blokken(tekst, stijl)}</div>;
};
