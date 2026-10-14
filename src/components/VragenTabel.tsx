import React, { useMemo, useState } from 'react';
import { pctGoed, QuizStat } from '../lib/voortgang';

const G = {
  goud: '#F1CB78', goudBleek: '#FFF3DF',
  bg: '#0D0C22', bg3: '#2D2040', rand: 'rgba(241,203,120,0.25)',
  tekst2: 'rgba(255,243,223,0.72)', tekst3: 'rgba(255,243,223,0.5)',
};
const NIVEAU_KLEUR = (p: number) => (p >= 80 ? '#5FA777' : p >= 50 ? '#C9A227' : '#C8604F');

type Sortering = 'fout' | 'vaakst' | 'recent' | 'alfabet';
const SORTERINGEN: { id: Sortering; label: string }[] = [
  { id: 'fout', label: 'Meest fout' },
  { id: 'vaakst', label: 'Vaakst gedaan' },
  { id: 'recent', label: 'Laatst gedaan' },
  { id: 'alfabet', label: 'Alfabetisch' },
];

const invoer: React.CSSProperties = {
  padding: '7px 10px', fontSize: 15, borderRadius: 8, border: `0.5px solid ${G.rand}`,
  background: G.bg, color: G.goudBleek, fontFamily: 'inherit',
};

interface Props {
  /** alleen de vraag-statistieken (sleutels die met 'vraag:' beginnen) */
  vragen: QuizStat[];
  /** totaal aantal verschillende vragen dat bestaat, voor "x van y" */
  totaalMogelijk?: number;
  /** groepeert een vraag (bv. 'Nummers', 'Combinaties'); zonder deze functie geen filter */
  groep?: (sleutel: string) => string;
}

function datumKort(s: string): string {
  if (!s) return '—';
  return new Date(`${s.replace(' ', 'T')}Z`).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

export const VragenTabel: React.FC<Props> = ({ vragen, totaalMogelijk, groep }) => {
  const [filter, setFilter] = useState('alle');
  const [sortering, setSortering] = useState<Sortering>('fout');
  const [zoek, setZoek] = useState('');
  const [toon, setToon] = useState(25);

  const groepen = useMemo(
    () => (groep ? [...new Set(vragen.map((v) => groep(v.sleutel)))].sort() : []),
    [vragen, groep],
  );

  const lijst = useMemo(() => {
    const z = zoek.trim().toLowerCase();
    const l = vragen.filter((v) =>
      (filter === 'alle' || groep?.(v.sleutel) === filter) && (!z || v.label.toLowerCase().includes(z)));
    const n = (v: QuizStat) => v.goed + v.fout;
    return l.sort((a, b) => {
      switch (sortering) {
        case 'fout': return (pctGoed(a) ?? 0) - (pctGoed(b) ?? 0) || b.fout - a.fout;
        case 'vaakst': return n(b) - n(a);
        case 'recent': return b.laatst.localeCompare(a.laatst);
        default: return a.label.localeCompare(b.label, 'nl');
      }
    });
  }, [vragen, filter, sortering, zoek, groep]);

  const keerTotaal = vragen.reduce((s, v) => s + v.goed + v.fout, 0);
  const goedTotaal = vragen.reduce((s, v) => s + v.goed, 0);
  const beheerst = vragen.filter((v) => v.goed > 0 && v.fout === 0 || (pctGoed(v) ?? 0) >= 80).length;

  if (vragen.length === 0) {
    return <div style={{ fontSize: 14, color: G.tekst3, fontStyle: 'italic' }}>Nog geen vragen beantwoord.</div>;
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: G.tekst2, margin: '0 0 0.8rem', lineHeight: 1.6 }}>
        <strong style={{ color: G.goudBleek }}>{vragen.length}</strong>
        {totaalMogelijk ? <> van de {totaalMogelijk}</> : null} verschillende vragen gedaan ·
        in totaal <strong style={{ color: G.goudBleek }}>{keerTotaal}×</strong> beantwoord
        ({keerTotaal ? Math.round((goedTotaal / keerTotaal) * 100) : 0}% goed) ·
        {' '}<strong style={{ color: G.goudBleek }}>{beheerst}</strong> beheerst
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
        <input placeholder="Zoek een vraag" value={zoek} onChange={(e) => { setZoek(e.target.value); setToon(25); }} style={{ ...invoer, flex: '1 1 180px' }} />
        {groep && (
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setToon(25); }} style={invoer}>
            <option value="alle">Alle soorten</option>
            {groepen.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
        <select value={sortering} onChange={(e) => setSortering(e.target.value as Sortering)} style={invoer}>
          {SORTERINGEN.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ color: G.tekst3, textAlign: 'left' }}>
              <th style={{ padding: '6px 8px 6px 0', fontWeight: 400 }}>Vraag</th>
              <th style={{ padding: 6, fontWeight: 400, textAlign: 'right' }}>Keer</th>
              <th style={{ padding: 6, fontWeight: 400, textAlign: 'right' }}>Goed</th>
              <th style={{ padding: 6, fontWeight: 400, textAlign: 'right' }}>Fout</th>
              <th style={{ padding: 6, fontWeight: 400, textAlign: 'right' }}>%</th>
              <th style={{ padding: '6px 0 6px 6px', fontWeight: 400, textAlign: 'right' }}>Laatst</th>
            </tr>
          </thead>
          <tbody>
            {lijst.slice(0, toon).map((v) => {
              const p = pctGoed(v) ?? 0;
              return (
                <tr key={v.sleutel} style={{ borderTop: `0.5px solid ${G.rand}` }}>
                  <td style={{ padding: '7px 8px 7px 0', color: G.goudBleek, lineHeight: 1.35 }}>
                    <span style={{ display: 'inline-block', width: 4, height: 14, borderRadius: 2, background: NIVEAU_KLEUR(p), marginRight: 8, verticalAlign: 'middle' }} />
                    {v.label}
                  </td>
                  <td style={{ padding: 6, textAlign: 'right', color: G.tekst2 }}>{v.goed + v.fout}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: G.tekst2 }}>{v.goed}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: G.tekst2 }}>{v.fout}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: G.goudBleek }}>{p}%</td>
                  <td style={{ padding: '7px 0 7px 6px', textAlign: 'right', color: G.tekst3, whiteSpace: 'nowrap' }}>{datumKort(v.laatst)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {lijst.length > toon && (
        <button onClick={() => setToon((t) => t + 50)} style={{ ...invoer, marginTop: '0.8rem', cursor: 'pointer' }}>
          Toon meer ({lijst.length - toon} over)
        </button>
      )}
      {lijst.length === 0 && <div style={{ fontSize: 14, color: G.tekst3, marginTop: 8 }}>Geen vragen gevonden.</div>}
    </div>
  );
};
