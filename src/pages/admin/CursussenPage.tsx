import React, { useEffect, useRef, useState } from 'react';
import { datumNL } from '../../lib/account';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8',
  bg: '#1A1209', bg2: '#2C2416', bg3: '#3A2E1C', rand: 'rgba(184,134,11,0.25)',
  tekst2: 'rgba(245,237,216,0.72)', tekst3: 'rgba(245,237,216,0.5)',
};

type Status = 'nieuw' | 'in_behandeling' | 'concept' | 'goedgekeurd' | 'afgewezen';

interface Upload {
  id: number; bestand: string; origineel: string; grootte: number;
  geupload_door: string; datum: string; status: Status; notitie: string;
}

// Status met label, uitleg en kleur (kleur staat nooit alleen: het label staat erbij)
const STATUS: Record<Status, { label: string; uitleg: string; kleur: string }> = {
  nieuw:          { label: 'Nieuw',          uitleg: 'Geüpload, nog niet bekeken',              kleur: '#8FA3B8' },
  in_behandeling: { label: 'In behandeling', uitleg: 'Wordt gelezen en omgezet naar een cursus', kleur: '#C9A227' },
  concept:        { label: 'Concept klaar',  uitleg: 'Klaar om door jou te beoordelen',          kleur: '#D08A3C' },
  goedgekeurd:    { label: 'Goedgekeurd',    uitleg: 'Staat in de cursus voor bezoekers',        kleur: '#5FA777' },
  afgewezen:      { label: 'Afgewezen',      uitleg: 'Wordt niet gebruikt',                      kleur: '#C8604F' },
};

const MAX_MB = 300;
const mb = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`;

const invoer: React.CSSProperties = {
  padding: '7px 9px', fontSize: 15, borderRadius: 8, border: `0.5px solid ${G.rand}`,
  background: G.bg, color: G.goudBleek, fontFamily: 'inherit',
};

export const CursussenPage: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[] | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [voortgang, setVoortgang] = useState<number | null>(null);
  const [melding, setMelding] = useState<string | null>(null);
  const [sleep, setSleep] = useState(false);
  const [notities, setNotities] = useState<Record<number, string>>({});
  const invoerRef = useRef<HTMLInputElement>(null);

  const laad = () =>
    fetch('/api/admin/cursus-uploads')
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); return r.json(); })
      .then(setUploads)
      .catch((e) => setFout(e.message || 'Kon uploads niet laden'));

  useEffect(() => { laad(); }, []);

  // XMLHttpRequest i.p.v. fetch: zo is de uploadvoortgang te tonen
  function upload(bestand: File) {
    setMelding(null);
    if (!bestand.name.toLowerCase().endsWith('.zip')) { setMelding('Kies een .zip-bestand.'); return; }
    if (bestand.size > MAX_MB * 1024 * 1024) { setMelding(`Het bestand is groter dan ${MAX_MB} MB.`); return; }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/admin/cursus-upload?naam=${encodeURIComponent(bestand.name)}`);
    xhr.setRequestHeader('Content-Type', 'application/zip');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setVoortgang(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      setVoortgang(null);
      if (xhr.status === 200) { setMelding(`✓ ${bestand.name} is geüpload.`); laad(); }
      else { try { setMelding(JSON.parse(xhr.responseText).error); } catch { setMelding(`Upload mislukt (${xhr.status}).`); } }
    };
    xhr.onerror = () => { setVoortgang(null); setMelding('Upload mislukt: geen verbinding.'); };
    setVoortgang(0);
    xhr.send(bestand);
  }

  async function wijzig(id: number, wijziging: Partial<Pick<Upload, 'status' | 'notitie'>>) {
    const r = await fetch(`/api/admin/cursus-uploads/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(wijziging),
    });
    if (r.ok) { const d = await r.json(); setUploads((l) => l && l.map((u) => (u.id === id ? d : u))); }
  }

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'Crimson Pro', serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, letterSpacing: '0.15em', color: G.goud, textAlign: 'center', margin: '0 0 0.4rem' }}>
          CURSUSSEN
        </h1>
        <p style={{ textAlign: 'center', color: G.tekst3, margin: '0 0 2rem', fontSize: 15 }}>
          Upload cursusmateriaal als zip. Het wordt omgezet naar een cursus en verschijnt pas na jouw goedkeuring.
        </p>

        {/* Uploadvak */}
        <div
          onDragOver={(e) => { e.preventDefault(); setSleep(true); }}
          onDragLeave={() => setSleep(false)}
          onDrop={(e) => { e.preventDefault(); setSleep(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
          onClick={() => voortgang === null && invoerRef.current?.click()}
          style={{
            border: `1.5px dashed ${sleep ? G.goud : G.rand}`, background: sleep ? 'rgba(184,134,11,0.08)' : G.bg2,
            borderRadius: 16, padding: '2rem 1rem', textAlign: 'center', cursor: voortgang === null ? 'pointer' : 'default', marginBottom: '1rem',
          }}
        >
          <input ref={invoerRef} type="file" accept=".zip,application/zip" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
          {voortgang === null ? (
            <>
              <div style={{ fontSize: 34, marginBottom: 6 }}>📦</div>
              <div style={{ fontSize: 17 }}>Sleep je zip hierheen of <span style={{ color: G.goud, textDecoration: 'underline' }}>kies een bestand</span></div>
              <div style={{ fontSize: 13, color: G.tekst3, marginTop: 4 }}>Alleen .zip, maximaal {MAX_MB} MB</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, marginBottom: 8 }}>Bezig met uploaden… {voortgang}%</div>
              <div style={{ height: 8, background: G.bg3, borderRadius: 4, maxWidth: 420, margin: '0 auto' }}>
                <div style={{ width: `${voortgang}%`, height: '100%', background: G.goud, borderRadius: 4, transition: 'width 0.2s' }} />
              </div>
            </>
          )}
        </div>
        {melding && <p style={{ textAlign: 'center', fontSize: 15, color: melding.startsWith('✓') ? '#9bd49b' : '#ff9a8a', margin: '0 0 1.5rem' }}>{melding}</p>}

        {/* Uitleg van de stappen */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', margin: '0 0 1.8rem', fontSize: 13, color: G.tekst2 }}>
          {(Object.keys(STATUS) as Status[]).map((s, i) => (
            <span key={s} title={STATUS[s].uitleg} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {i > 0 && i < 4 && <span style={{ color: G.tekst3 }}>→</span>}
              {i === 4 && <span style={{ color: G.tekst3 }}>of</span>}
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: STATUS[s].kleur, display: 'inline-block' }} />
              {STATUS[s].label}
            </span>
          ))}
        </div>

        {/* Lijst */}
        {fout && <p style={{ textAlign: 'center', color: '#ff9a8a' }}>{fout}</p>}
        {uploads && uploads.length === 0 && <p style={{ textAlign: 'center', color: G.tekst3, fontStyle: 'italic' }}>Nog geen uploads.</p>}
        {uploads?.map((u) => (
          <div key={u.id} style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderLeft: `4px solid ${STATUS[u.status].kleur}`, borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
              <div>
                <strong style={{ fontSize: 17, wordBreak: 'break-all' }}>{u.origineel}</strong>
                <div style={{ fontSize: 13, color: G.tekst3 }}>#{u.id} · {mb(u.grootte)} · {datumNL(u.datum)} · door {u.geupload_door}</div>
              </div>
              <a href={`/api/admin/cursus-uploads/${u.id}/download`} style={{ fontSize: 14, color: G.goud }}>Downloaden</a>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '0.8rem' }}>
              <label style={{ fontSize: 12, color: G.tekst3 }}>Status<br />
                <select value={u.status} onChange={(e) => wijzig(u.id, { status: e.target.value as Status })} style={invoer}>
                  {(Object.keys(STATUS) as Status[]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 12, color: G.tekst3, flex: '1 1 240px' }}>Notitie<br />
                <input
                  value={notities[u.id] ?? u.notitie}
                  onChange={(e) => setNotities((n) => ({ ...n, [u.id]: e.target.value }))}
                  onBlur={() => { if (notities[u.id] !== undefined && notities[u.id] !== u.notitie) wijzig(u.id, { notitie: notities[u.id] }); }}
                  placeholder="Bijv. voor welke module, of wat er anders moet"
                  style={{ ...invoer, width: '100%' }}
                />
              </label>
            </div>
            <div style={{ fontSize: 13, color: G.tekst3, marginTop: 6 }}>{STATUS[u.status].uitleg}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
