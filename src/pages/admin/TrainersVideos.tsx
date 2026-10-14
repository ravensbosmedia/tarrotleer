// Trainersvideo's: alleen voor beheerders. Upload per cursus, koppelen aan hoofdstukken en tijdmarkeringen per hoofdstuk.
// In de cursusspeler zien beheerders bij een hoofdstuk de video met knoppen die naar het juiste fragment springen.
import React, { useCallback, useEffect, useRef, useState } from 'react';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1209', bg2: '#2C2416', bg3: '#3A2E1C',
  rand: 'rgba(184,134,11,0.25)', tekst2: 'rgba(245,237,216,0.75)', tekst3: 'rgba(245,237,216,0.5)',
};
const knop: React.CSSProperties = {
  fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.05em', padding: '8px 16px', borderRadius: 20,
  border: 'none', background: G.goud, color: G.bg, cursor: 'pointer',
};
const knopLicht: React.CSSProperties = { ...knop, background: 'transparent', color: G.goudBleek, border: `0.5px solid ${G.rand}` };
const veld: React.CSSProperties = { width: '100%', padding: '6px 10px', borderRadius: 8, border: `1px solid ${G.rand}`, background: G.bg, color: G.goudBleek, fontFamily: 'inherit', fontSize: 14 };

export interface TrainersVideo { id: number; titel: string; grootte: number; hoofdstukken: string; markeringen: string; geupload_door: string; datum: string }
export interface Markering { hoofdstuk: number; seconden: number; tijd: string; label: string }

/** Markeringen als regels "5 | 7:10 | ZWAVE – kleine indrukken" (hoofdstuk | tijd | omschrijving). */
export function leesMarkeringen(tekst: string): Markering[] {
  return tekst.split('\n').map((r) => r.split('|').map((x) => x.trim())).flatMap(([h, t, ...rest]) => {
    const m = (t || '').match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/);
    if (!h || !/^\d+$/.test(h) || !m) return [];
    const seconden = Number(m[1] || 0) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    return [{ hoofdstuk: Number(h), seconden, tijd: t, label: rest.join(' | ') }];
  });
}
const hoortBij = (v: TrainersVideo, nr: number) => !v.hoofdstukken || v.hoofdstukken.split(',').map(Number).includes(nr);
const mb = (n: number) => (n > 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(1)} GB` : `${Math.round(n / 1024 ** 2)} MB`);
const videoUrl = (id: number) => `/api/admin/academie/video/${id}/bestand`;

function uploadVideo(pad: string, f: File, voortgang: (pct: number) => void): Promise<TrainersVideo> {
  return new Promise((ok, fout) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', pad);
    xhr.setRequestHeader('Content-Type', f.type || 'video/mp4');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) voortgang(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      let d: Record<string, unknown> = {};
      try { d = JSON.parse(xhr.responseText); } catch { /* geen JSON */ }
      if (xhr.status >= 200 && xhr.status < 300) ok(d as unknown as TrainersVideo);
      else fout(new Error((d.error as string) || `Upload mislukt (${xhr.status})`));
    };
    xhr.onerror = () => fout(new Error('Upload mislukt: geen verbinding'));
    xhr.send(f);
  });
}

/** Video met springknoppen; `markeringen` zijn al gefilterd op het hoofdstuk. */
const SpelerMetMarkeringen: React.FC<{ v: TrainersVideo; markeringen: Markering[] }> = ({ v, markeringen }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const spring = (s: number) => { const el = ref.current; if (!el) return; el.currentTime = s; void el.play(); };
  return (
    <div>
      <video ref={ref} src={videoUrl(v.id)} controls preload="metadata" style={{ width: '100%', borderRadius: 10, background: '#000', display: 'block' }} />
      {markeringen.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {markeringen.map((m, i) => (
            <button key={i} onClick={() => spring(m.seconden)} style={{ ...knopLicht, fontFamily: 'inherit', fontSize: 13, padding: '5px 12px', letterSpacing: 0 }} title={`Spring naar ${m.tijd}`}>
              ▶ {m.tijd}{m.label ? ` · ${m.label}` : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═════ Beheer: blok op de cursuspagina ═════
export const TrainersVideos: React.FC<{ slug: string }> = ({ slug }) => {
  const [lijst, setLijst] = useState<TrainersVideo[] | null>(null);
  const [verslag, setVerslag] = useState<string | null>(null);
  const kiezer = useRef<HTMLInputElement>(null);
  const laad = useCallback(() => { fetch(`/api/admin/academie/${slug}/videos`).then((r) => r.json()).then(setLijst).catch(() => setLijst([])); }, [slug]);
  useEffect(() => { laad(); }, [laad]);

  async function upload(f: File) {
    if (!/\.(mp4|m4v|mov|webm)$/i.test(f.name)) { setVerslag('Kies een video (mp4 of webm).'); return; }
    setVerslag('Uploaden… 0%');
    try {
      await uploadVideo(`/api/admin/academie/${slug}/video?naam=${encodeURIComponent(f.name)}`, f, (pct) => setVerslag(pct < 100 ? `Uploaden… ${pct}% (${mb(f.size)})` : 'Geüpload — bezig met opslaan…'));
      setVerslag('✓ Video geüpload. Vul hieronder de hoofdstukken en tijdmarkeringen in.');
      laad();
    } catch (e) { setVerslag((e as Error).message); }
  }

  return (
    <div style={{ background: G.bg2, border: `1px solid ${G.rand}`, borderRadius: 12, padding: '1rem 1.1rem', margin: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", color: G.goud, fontSize: 15, letterSpacing: '0.05em' }}>🎬 TRAINERSVIDEO'S</div>
          <div style={{ fontSize: 13, color: G.tekst3 }}>Alleen zichtbaar voor beheerders — ook als de cursus live staat. Tot 2 GB (mp4 of webm).</div>
        </div>
        <button style={knop} onClick={() => kiezer.current?.click()}>⬆ Video uploaden</button>
        <input ref={kiezer} type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.m4v,.mov,.webm" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void upload(f); }} />
      </div>
      {verslag && <p style={{ fontSize: 14, margin: '0.6rem 0 0', color: verslag.startsWith('✓') ? '#9bd49b' : G.tekst2 }}>{verslag}</p>}
      {lijst?.map((v) => <VideoBeheer key={v.id} v={v} opnieuw={laad} />)}
      {lijst && lijst.length === 0 && <p style={{ fontSize: 14, color: G.tekst3, margin: '0.6rem 0 0', fontStyle: 'italic' }}>Nog geen video's bij deze cursus.</p>}
    </div>
  );
};

const VideoBeheer: React.FC<{ v: TrainersVideo; opnieuw: () => void }> = ({ v, opnieuw }) => {
  const [titel, setTitel] = useState(v.titel);
  const [hoofdstukken, setHoofdstukken] = useState(v.hoofdstukken);
  const [markeringen, setMarkeringen] = useState(v.markeringen);
  const [melding, setMelding] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const geldig = leesMarkeringen(markeringen);
  const regels = markeringen.split('\n').filter((r) => r.trim()).length;

  async function bewaar() {
    const r = await fetch(`/api/admin/academie/video/${v.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titel, hoofdstukken, markeringen }) });
    setMelding(r.ok ? 'Opgeslagen ✓' : 'Opslaan mislukt'); setTimeout(() => setMelding(null), 2500);
    if (r.ok) opnieuw();
  }
  async function weg() {
    if (!confirm(`Video "${v.titel}" verwijderen? Het bestand wordt gearchiveerd op de server.`)) return;
    const r = await fetch(`/api/admin/academie/video/${v.id}`, { method: 'DELETE' });
    if (r.ok) opnieuw();
  }

  return (
    <div style={{ borderTop: `1px solid ${G.rand}`, marginTop: '0.9rem', paddingTop: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>{v.titel} <span style={{ fontSize: 13, color: G.tekst3 }}>· {mb(v.grootte)} · {v.datum.slice(0, 10)} · {v.hoofdstukken ? `hoofdstuk ${v.hoofdstukken.replace(/,/g, ', ')}` : 'alle hoofdstukken'} · {geldig.length} markering(en)</span></span>
        <span style={{ display: 'flex', gap: 6 }}>
          <button style={knopLicht} onClick={() => setOpen(!open)}>{open ? 'Sluiten' : 'Bekijken / bewerken'}</button>
          <button style={{ ...knopLicht, color: '#f0a596' }} onClick={weg}>Verwijderen</button>
        </span>
      </div>
      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginTop: 10 }}>
          <SpelerMetMarkeringen v={v} markeringen={geldig} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: G.tekst2 }}>
            <label>Titel<input style={veld} value={titel} onChange={(e) => setTitel(e.target.value)} /></label>
            <label>Bij hoofdstukken <span style={{ color: G.tekst3 }}>(bijv. 1, 2, 5 — leeg = alle hoofdstukken)</span>
              <input style={veld} value={hoofdstukken} onChange={(e) => setHoofdstukken(e.target.value)} placeholder="leeg = alle hoofdstukken" /></label>
            <label>Tijdmarkeringen <span style={{ color: G.tekst3 }}>— één per regel: <code>hoofdstuk | tijd | omschrijving</code></span>
              <textarea style={{ ...veld, minHeight: 150, fontFamily: 'monospace', fontSize: 13 }} value={markeringen} onChange={(e) => setMarkeringen(e.target.value)}
                placeholder={'1 | 0:18 | Rosita – iedereen ontvangt anders\n5 | 7:10 | ZWAVE – kleine indrukken\n5 | 15:32 | Heldervoelen'} /></label>
            {regels > geldig.length && <span style={{ color: '#E0B04A' }}>⚠ {regels - geldig.length} regel(s) niet herkend — gebruik bijv. <code>5 | 7:10 | omschrijving</code></span>}
            <span><button style={knop} onClick={bewaar}>Opslaan</button> {melding && <span style={{ marginLeft: 8 }}>{melding}</span>}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ═════ Cursusspeler: bij een hoofdstuk (alleen beheerders) ═════
export const TrainersVideoBijHoofdstuk: React.FC<{ slug: string; nr: number }> = ({ slug, nr }) => {
  const [lijst, setLijst] = useState<TrainersVideo[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => { fetch(`/api/admin/academie/${slug}/videos`).then((r) => (r.ok ? r.json() : [])).then(setLijst).catch(() => setLijst([])); }, [slug]);
  const hier = lijst.filter((v) => hoortBij(v, nr));
  if (!hier.length) return null;
  return (
    <div style={{ background: G.bg3, border: `1px dashed ${G.goud}`, borderRadius: 12, padding: '0.6rem 0.9rem', margin: '0 0 1rem' }}>
      <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: G.goud, cursor: 'pointer', fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.05em', padding: 0 }}>
        🎬 TRAINERSVIDEO BIJ DIT HOOFDSTUK {open ? '▴' : '▾'} <span style={{ fontFamily: 'inherit', color: G.tekst3, letterSpacing: 0, textTransform: 'none' }}>· alleen zichtbaar voor beheerders</span>
      </button>
      {open && hier.map((v) => (
        <div key={v.id} style={{ marginTop: 10 }}>
          <div style={{ fontSize: 15, marginBottom: 6 }}>{v.titel}</div>
          <SpelerMetMarkeringen v={v} markeringen={leesMarkeringen(v.markeringen).filter((m) => m.hoofdstuk === nr)} />
        </div>
      ))}
    </div>
  );
};
