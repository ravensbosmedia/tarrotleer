// Opbouw van een interactieve les: stappen (##-kopjes) en meerkeuzevragen.
// Gedeeld door de cursusspeler en controles/scripts, zodat ze precies hetzelfde herkennen.

export interface Stap { titel: string; md: string }
export interface Vraag { nr: number; vraag: string; opties: { letter: string; tekst: string }[]; goed?: string; uitleg?: string }

/** Verdeelt een hoofdstuk in stappen: elk ##-kopje is één scherm. De kopafbeelding komt bij de eerste stap. */
export function maakStappen(inhoud: string, titel: string): { afbeelding: string | null; stappen: Stap[] } {
  let tekst = inhoud.replace(/\r\n/g, '\n').trim();
  const afb = tekst.match(/^!\[[^\]]*\]\(([^)]+)\)\s*\n?/);
  const afbeelding = afb ? afb[1] : null;
  if (afb) tekst = tekst.slice(afb[0].length).trim();
  const delen = tekst.split(/^## /m);
  const inleiding = delen.shift()?.trim() || '';
  const stappen = delen.map((d) => {
    const regelEinde = d.indexOf('\n');
    return { titel: (regelEinde < 0 ? d : d.slice(0, regelEinde)).trim(), md: regelEinde < 0 ? '' : d.slice(regelEinde + 1).trim() };
  });
  if (!stappen.length) return { afbeelding, stappen: [{ titel, md: inleiding }] };
  if (inleiding) stappen[0].md = `${inleiding}\n\n${stappen[0].md}`;
  return { afbeelding, stappen };
}

/** Haalt meerkeuzevragen (**1. Vraag** + - A) …) en het antwoordenblok uit een stap. */
export function haalVragen(md: string): { rest: string; vragen: Vraag[] } {
  const regels = md.split('\n');
  const vragen: Vraag[] = [];
  const bewaar: string[] = [];
  for (let i = 0; i < regels.length; i++) {
    const v = regels[i].match(/^\s*\*\*(\d+)[.)]\s*(.+?)\*\*\s*$/);
    if (v) {
      const opties: { letter: string; tekst: string }[] = [];
      let j = i + 1;
      while (j < regels.length && (regels[j].trim() === '' || /^\s*-\s*[A-F]\)/.test(regels[j]))) {
        const o = regels[j].match(/^\s*-\s*([A-F])\)\s*(.+)$/);
        if (o) opties.push({ letter: o[1], tekst: o[2].trim() });
        else if (opties.length) break;
        j++;
      }
      if (opties.length >= 2) { vragen.push({ nr: Number(v[1]), vraag: v[2].trim(), opties }); i = j - 1; continue; }
    }
    bewaar.push(regels[i]);
  }
  if (!vragen.length) return { rest: md, vragen };
  // Antwoorden uit het <details>-blok: "1. B — uitleg"
  let rest = bewaar.join('\n');
  const blok = rest.match(/<details>\s*<summary>[^<]*antwoord[^<]*<\/summary>([\s\S]*?)<\/details>/i);
  if (blok) {
    for (const r of blok[1].split('\n')) {
      const a = r.match(/^\s*(\d+)[.)]\s*\**([A-F])\**\s*[).:]?\s*(?:[—–-]\s*)?(.*)$/);
      const q = a && vragen.find((x) => x.nr === Number(a[1]));
      if (q && a) { q.goed = a[2]; q.uitleg = a[3].trim(); }
    }
    if (vragen.every((q) => q.goed)) rest = rest.replace(blok[0], '');
  }
  return { rest: rest.trim(), vragen: vragen.every((q) => q.goed) ? vragen : [] };
}

