#!/usr/bin/env node
/**
 * Zet beoordelingsadvies in de Academie: per cursus (academie_cursussen.advies) en per hoofdstuk
 * (academie_hoofdstukken.advies). Invoer: een map met submappen per cursus, elk met _advies.json:
 *   {"cursus": 6, "cursus_advies": "…", "hoofdstukken": [{"nr": 1, "advies": "…"}, …]}
 *
 *   node scripts/advies-importeren.mjs <map>
 */
import Database from 'better-sqlite3';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const map = process.argv[2];
if (!map || !existsSync(map)) { console.error('Gebruik: node scripts/advies-importeren.mjs <map>'); process.exit(1); }

const db = new Database(join(ROOT, 'data', 'leren.db'));
const cursus = db.prepare('SELECT id, nr, titel FROM academie_cursussen WHERE nr = ?');
const zetCursus = db.prepare('UPDATE academie_cursussen SET advies = ? WHERE id = ?');
const zetHoofdstuk = db.prepare('UPDATE academie_hoofdstukken SET advies = ? WHERE cursus_id = ? AND nr = ?');

for (const sub of readdirSync(map).sort()) {
  const pad = join(map, sub, '_advies.json');
  if (!existsSync(pad)) continue;
  const a = JSON.parse(readFileSync(pad, 'utf-8'));
  const c = cursus.get(a.cursus);
  if (!c) { console.log(`cursus ${a.cursus}: niet gevonden, overgeslagen`); continue; }
  let n = 0;
  db.transaction(() => {
    if (a.cursus_advies) zetCursus.run(String(a.cursus_advies).trim(), c.id);
    for (const h of a.hoofdstukken || []) n += zetHoofdstuk.run(String(h.advies || '').trim(), c.id, h.nr).changes;
  })();
  console.log(`cursus ${c.nr} (${c.titel}): cursusadvies ${a.cursus_advies ? 'ja' : 'nee'}, ${n} hoofdstukken`);
}
