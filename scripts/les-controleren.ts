// Controleert een interactieve les (Markdown) zoals de cursusspeler hem ziet:
//   node node_modules/.bin/tsx scripts/les-controleren.ts <bestand.md>
import { readFileSync } from 'fs';
import { maakStappen, haalVragen } from '../src/lib/lesOpbouw.ts';

const t = readFileSync(process.argv[2], 'utf8').replace(/^#\s.+\n+/, '');
const { afbeelding, stappen } = maakStappen(t, 'les');
let fouten = 0;
console.log(`afbeelding: ${afbeelding ? 'ja' : 'nee'} | stappen: ${stappen.length}`);
for (const s of stappen) {
  const { vragen } = haalVragen(s.md);
  const blokken = (s.md.match(/^> \*\*([^*]+)\*\*/gm) || []).map((b) => b.slice(4, -2));
  const woorden = s.md.split(/\s+/).filter(Boolean).length;
  const lang = s.md.replace(/^\s*(?:>\s*)?(?:[-*]|\d+[.)])\s.*$/gm, '').replace(/^>\s?/gm, '').replace(/\[[^\]]*\]\([^)]*\)/g, 'link')
    .split(/(?<=[.!?])\s+|\n/).filter((z) => z.split(/\s+/).filter(Boolean).length > 20);
  const mcZonderAntwoord = /^\s*\*\*\d+[.)]/m.test(s.md) && /^\s*-\s*[A-D]\)/m.test(s.md) && !vragen.length;
  if (woorden > 260 || lang.length || mcZonderAntwoord) fouten++;
  console.log(`  ${s.titel.slice(0, 40).padEnd(40)} ${String(woorden).padStart(4)} w | ${blokken.join(', ') || '-'}${vragen.length ? ` | MC ${vragen.length}` : ''}${mcZonderAntwoord ? ' | ⚠ MC niet herkend' : ''}${lang.length ? ` | ⚠ ${lang.length} lange zin(nen)` : ''}`);
}
console.log(fouten ? `⚠ ${fouten} stap(pen) met aandachtspunten` : '✓ alles in orde');
