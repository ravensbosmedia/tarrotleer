// Bezoekersstatistiek van zen-flow.nl en meditatie.zen-flow.nl (alleen beheerders).
// Zonder cookies: geteld uit het nginx-logboek door zen-flow-voorpagina/scripts/statistiek.py (elk uur), zie README.
import React, { useEffect, useState } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

interface Telling { weergaven: number; bezoekers: number }
interface Dag extends Telling { dag: string }
interface Crawler { bot: string; keer: number; laatst: string; paginas: { pad: string; keer: number }[] }
interface Site { vandaag: Telling; week: Telling; maand: Telling; dagen: Dag[]; paginas: ({ pad: string } & Telling)[]; bronnen: { bron: string; bezoeken: number }[]; crawlers: Crawler[]; fouten: { pad: string; keer: number }[] }
interface Data { bijgewerkt: string; sites: Record<string, Site> }

const SERIF = "'Cormorant Garamond', Georgia, serif";
const paneel: React.CSSProperties = { background: '#20162F', border: '0.5px solid rgba(239,180,255,0.22)', borderRadius: 10, padding: '1rem 1.2rem', marginBottom: 16 };
const kop: React.CSSProperties = { fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: '#FFF3DF', margin: '0 0 0.6rem' };
const cel: React.CSSProperties = { padding: '6px 8px', borderBottom: '0.5px solid rgba(239,180,255,0.12)', fontSize: 13.5, color: '#E0D5E9', verticalAlign: 'top' };
const getal: React.CSSProperties = { ...cel, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
const kopcel: React.CSSProperties = { ...cel, color: '#B9A9CC', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 };
const nl = (n: number) => n.toLocaleString('nl-NL');
const datumKort = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
const tijdNL = (t: string) => new Date(t).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const Tegel: React.FC<{ label: string; t: Telling }> = ({ label, t }) => (
  <div style={{ ...paneel, flex: '1 1 160px', marginBottom: 0, textAlign: 'center' }}>
    <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F1CB78' }}>{label}</div>
    <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1.1, color: '#FFF3DF' }}>{nl(t.bezoekers)}</div>
    <div style={{ fontSize: 12.5, color: '#B9A9CC' }}>bezoekers · {nl(t.weergaven)} paginaweergaven</div>
  </div>
);

// Staafdiagram: bezoekers per dag (laatste 30 dagen), met tooltip bij aanwijzen
const Diagram: React.FC<{ dagen: Dag[] }> = ({ dagen }) => {
  const [actief, setActief] = useState<number | null>(null);
  const B = 720, H = 180, onder = 22, boven = 10, max = Math.max(1, ...dagen.map((d) => d.bezoekers));
  const stap = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / stap) * stap, breed = B / dagen.length;
  const y = (v: number) => boven + (H - onder - boven) * (1 - v / top);
  const a = actief != null ? dagen[actief] : null;
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${B} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Bezoekers per dag, laatste 30 dagen" onMouseLeave={() => setActief(null)}>
        {[0, top / 2, top].map((v) => (
          <g key={v}><line x1={0} x2={B} y1={y(v)} y2={y(v)} stroke="rgba(239,180,255,0.12)" strokeWidth={1} />
            <text x={2} y={y(v) - 3} fill="#B9A9CC" fontSize={10}>{nl(v)}</text></g>
        ))}
        {dagen.map((d, i) => {
          const h = Math.max(0, y(0) - y(d.bezoekers)), x = i * breed + 2, w = Math.max(2, breed - 4);
          return (
            <g key={d.dag} onMouseEnter={() => setActief(i)} onFocus={() => setActief(i)} tabIndex={0}>
              <rect x={i * breed} y={boven} width={breed} height={H - onder - boven} fill="transparent" />
              {h > 0 && <path d={`M${x},${y(0)} V${y(0) - h + Math.min(4, h)} q0,-${Math.min(4, h)} ${Math.min(4, w / 2)},-${Math.min(4, h)} H${x + w - Math.min(4, w / 2)} q${Math.min(4, w / 2)},0 ${Math.min(4, w / 2)},${Math.min(4, h)} V${y(0)} Z`}
                fill={actief === i ? '#FFEEB5' : '#F1CB78'} />}
              {(i % 5 === 4 || i === dagen.length - 1) && <text x={i * breed + breed / 2} y={H - 6} fill="#B9A9CC" fontSize={10} textAnchor="middle">{datumKort(d.dag)}</text>}
            </g>
          );
        })}
      </svg>
      {a && (
        <div style={{ position: 'absolute', top: 0, left: `min(calc(${((actief! + 0.5) / dagen.length) * 100}% + 8px), calc(100% - 170px))`, background: '#0D0C22', border: '0.5px solid rgba(239,180,255,0.38)', borderRadius: 6, padding: '6px 10px', fontSize: 12.5, color: '#E0D5E9', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <strong style={{ color: '#FFF3DF' }}>{new Date(a.dag + 'T12:00:00').toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' })}</strong><br />
          {nl(a.bezoekers)} bezoekers · {nl(a.weergaven)} weergaven
        </div>
      )}
    </div>
  );
};

export const StatistiekPage: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [site, setSite] = useState('zen-flow.nl');
  const [alsTabel, setAlsTabel] = useState(false);

  useEffect(() => {
    fetch('/api/admin/statistiek').then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Kon de statistiek niet laden'); setData(d); })
      .catch((e: Error) => setFout(e.message));
  }, []);

  if (fout) return <div className="zf-pagina" style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem', color: '#E0D5E9' }}>{fout}</div>;
  if (!data) return <div style={{ padding: '2rem', color: '#B9A9CC', textAlign: 'center' }}>Laden…</div>;
  const s = data.sites[site];
  const dertig = s.dagen.slice(-30);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem 3rem', color: '#E0D5E9' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F1CB78', margin: 0 }}>Beheer</p>
      <h1 style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 500, color: '#FFF3DF', margin: '0.2rem 0 0.4rem' }}>Statistiek</h1>
      <p style={{ fontSize: 13.5, color: '#B9A9CC', margin: '0 0 1rem' }}>
        Bijgewerkt {tijdNL(data.bijgewerkt)} (elk uur). Zonder cookies, geteld uit het serverlogboek; bezoekers = unieke bezoekers per dag, bots en eigen tests tellen niet mee.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.keys(data.sites).map((h) => (
          <button key={h} onClick={() => setSite(h)} style={{ ...(h === site ? ZF_KNOP : ZF_KNOP_PAARS), padding: '0.45rem 1rem', fontSize: 14 }} aria-pressed={h === site}>{h}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Tegel label="Vandaag" t={s.vandaag} /><Tegel label="Laatste 7 dagen" t={s.week} /><Tegel label="Laatste 30 dagen" t={s.maand} />
      </div>

      <div style={paneel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <h2 style={kop}>Bezoekers per dag</h2>
          <button onClick={() => setAlsTabel(!alsTabel)} style={{ background: 'none', border: 0, color: '#F1CB78', fontSize: 13, cursor: 'pointer' }}>{alsTabel ? 'Toon als diagram' : 'Toon als tabel'}</button>
        </div>
        {alsTabel ? (
          <div style={{ maxHeight: 320, overflow: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={kopcel}>Dag</th><th style={{ ...kopcel, textAlign: 'right' }}>Bezoekers</th><th style={{ ...kopcel, textAlign: 'right' }}>Weergaven</th></tr></thead>
            <tbody>{[...dertig].reverse().map((d) => <tr key={d.dag}><td style={cel}>{datumKort(d.dag)}</td><td style={getal}>{nl(d.bezoekers)}</td><td style={getal}>{nl(d.weergaven)}</td></tr>)}</tbody>
          </table></div>
        ) : <Diagram dagen={dertig} />}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ ...paneel, flex: '2 1 380px' }}>
          <h2 style={kop}>Pagina's <span style={{ fontSize: 14, color: '#B9A9CC' }}>· 30 dagen</span></h2>
          {s.paginas.length === 0 ? <p style={{ fontSize: 13.5, color: '#B9A9CC' }}>Nog geen bezoekers.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={kopcel}>Pagina</th><th style={{ ...kopcel, textAlign: 'right' }}>Bezoekers</th><th style={{ ...kopcel, textAlign: 'right' }}>Weergaven</th></tr></thead>
              <tbody>{s.paginas.map((p) => <tr key={p.pad}><td style={{ ...cel, wordBreak: 'break-all' }}><a href={`https://${site}${p.pad}`} target="_blank" rel="noreferrer" style={{ color: '#E0D5E9' }}>{p.pad}</a></td><td style={getal}>{nl(p.bezoekers)}</td><td style={getal}>{nl(p.weergaven)}</td></tr>)}</tbody>
            </table>)}
        </div>
        <div style={{ ...paneel, flex: '1 1 240px' }}>
          <h2 style={kop}>Waar komen ze vandaan?</h2>
          {s.bronnen.length === 0 ? <p style={{ fontSize: 13.5, color: '#B9A9CC' }}>Nog geen gegevens.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
              {s.bronnen.map((b) => <tr key={b.bron}><td style={cel}>{b.bron}</td><td style={getal}>{nl(b.bezoeken)}</td></tr>)}
            </tbody></table>)}
          <p style={{ fontSize: 12, color: '#B9A9CC', marginTop: 8 }}>Eerste bezoek van de dag per bezoeker. "Direct" = getypt, bladwijzer of app.</p>
        </div>
      </div>

      <div style={paneel}>
        <h2 style={kop}>Crawlers (zoekmachines en andere bots) <span style={{ fontSize: 14, color: '#B9A9CC' }}>· 30 dagen</span></h2>
        {s.crawlers.length === 0 ? <p style={{ fontSize: 13.5, color: '#B9A9CC' }}>Nog geen crawlers langs geweest.</p> : s.crawlers.map((c) => (
          <details key={c.bot} style={{ borderBottom: '0.5px solid rgba(239,180,255,0.12)', padding: '6px 0' }}>
            <summary style={{ cursor: 'pointer', fontSize: 14, color: '#FFF3DF', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ flex: '1 1 200px' }}>{c.bot}</span>
              <span style={{ color: '#B9A9CC', fontSize: 13 }}>{nl(c.keer)}× · laatst {tijdNL(c.laatst)}</span>
            </summary>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '6px 0' }}><tbody>
              {c.paginas.map((p) => <tr key={p.pad}><td style={{ ...cel, wordBreak: 'break-all' }}>{p.pad}</td><td style={getal}>{nl(p.keer)}×</td></tr>)}
            </tbody></table>
          </details>
        ))}
      </div>

      <div style={paneel}>
        <h2 style={kop}>Niet gevonden (404) <span style={{ fontSize: 14, color: '#B9A9CC' }}>· 30 dagen</span></h2>
        {s.fouten.length === 0 ? <p style={{ fontSize: 13.5, color: '#B9A9CC' }}>Geen kapotte links. 👍</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
            {s.fouten.map((f) => <tr key={f.pad}><td style={{ ...cel, wordBreak: 'break-all' }}>{f.pad}</td><td style={getal}>{nl(f.keer)}×</td></tr>)}
          </tbody></table>)}
      </div>
    </div>
  );
};
