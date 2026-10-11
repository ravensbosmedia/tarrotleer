// Academie-beheer (alleen beheerders): cursussen beoordelen en hoofdstukken aanpassen.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Markdown } from '../../components/Markdown';
import { datumNL, useAccount } from '../../lib/account';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8',
  bg: '#1A1209', bg2: '#2C2416', bg3: '#3A2E1C', rand: 'rgba(184,134,11,0.25)',
  tekst2: 'rgba(245,237,216,0.72)', tekst3: 'rgba(245,237,216,0.5)',
};

type HStatus = 'te_beoordelen' | 'aangepast' | 'goedgekeurd';
type CStatus = 'concept' | 'in_beoordeling' | 'goedgekeurd';

// Status = label + kleur (kleur staat nooit alleen; het label staat er altijd bij)
const H_STATUS: Record<HStatus, { label: string; kleur: string }> = {
  te_beoordelen: { label: 'Te beoordelen', kleur: '#8FA3B8' },
  aangepast:     { label: 'Aangepast',     kleur: '#C9A227' },
  goedgekeurd:   { label: 'Goedgekeurd',   kleur: '#5FA777' },
};
const C_STATUS: Record<CStatus, { label: string; kleur: string }> = {
  concept:        { label: 'Concept',        kleur: '#8FA3B8' },
  in_beoordeling: { label: 'In beoordeling', kleur: '#C9A227' },
  goedgekeurd:    { label: 'Goedgekeurd',    kleur: '#5FA777' },
};

const pagina: React.CSSProperties = { minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'Crimson Pro', serif" };
const titelStijl: React.CSSProperties = { fontFamily: "'Cinzel', serif", fontSize: 22, letterSpacing: '0.12em', color: G.goud, margin: '0 0 0.3rem' };
const invoer: React.CSSProperties = {
  padding: '7px 10px', fontSize: 15, borderRadius: 8, border: `0.5px solid ${G.rand}`,
  background: G.bg, color: G.goudBleek, fontFamily: 'inherit',
};
const knop: React.CSSProperties = {
  fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', padding: '8px 16px', borderRadius: 8,
  border: 'none', background: G.goud, color: G.bg, cursor: 'pointer',
};
const knopLicht: React.CSSProperties = { ...knop, background: 'transparent', color: G.goudBleek, border: `0.5px solid ${G.rand}` };

const Badge: React.FC<{ label: string; kleur: string }> = ({ label, kleur }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: G.tekst2, whiteSpace: 'nowrap' }}>
    <span style={{ width: 9, height: 9, borderRadius: '50%', background: kleur }} />{label}
  </span>
);

const Balk: React.FC<{ goed: number; aangepast: number; totaal: number }> = ({ goed, aangepast, totaal }) => (
  <div style={{ display: 'flex', height: 6, background: G.bg3, borderRadius: 4, overflow: 'hidden', gap: 2 }} title={`${goed} goedgekeurd, ${aangepast} aangepast, ${totaal - goed - aangepast} te beoordelen`}>
    <div style={{ width: `${(goed / Math.max(1, totaal)) * 100}%`, background: H_STATUS.goedgekeurd.kleur }} />
    <div style={{ width: `${(aangepast / Math.max(1, totaal)) * 100}%`, background: H_STATUS.aangepast.kleur }} />
  </div>
);

async function api<T>(pad: string, opties?: RequestInit): Promise<T> {
  const r = await fetch(pad, { headers: { 'Content-Type': 'application/json' }, ...opties });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `Fout ${r.status}`);
  return d as T;
}

interface Beheerder { id: number; naam: string }

/** Wie heeft goedgekeurd: per beheerder een ✓ (groen) of ○, met de naam erbij (kleur is nooit het enige signaal). */
const GoedkeurChips: React.FC<{ beheerders: Beheerder[]; door: number[]; klein?: boolean }> = ({ beheerders, door, klein }) => (
  <span style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
    {beheerders.map((b) => {
      const ja = door.includes(b.id);
      return (
        <span key={b.id} title={`${b.naam}: ${ja ? 'goedgekeurd' : 'nog niet goedgekeurd'}`} style={{
          fontSize: klein ? 11 : 13, padding: klein ? '1px 7px' : '3px 9px', borderRadius: 10, whiteSpace: 'nowrap',
          border: `0.5px solid ${ja ? H_STATUS.goedgekeurd.kleur : G.rand}`,
          background: ja ? 'rgba(95,167,119,0.15)' : 'transparent', color: ja ? '#9bd49b' : G.tekst3,
        }}>{ja ? '✓' : '○'} {klein ? b.naam.split(' ')[0] : b.naam}</span>
      );
    })}
  </span>
);

/** Stuurt een gekozen bestand als ruwe body naar de server (met voortgang) en geeft het JSON-antwoord terug. */
function uploadBestand<T>(pad: string, bestand: File, type: string, voortgang?: (pct: number) => void): Promise<T> {
  return new Promise((ok, fout) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', pad);
    xhr.setRequestHeader('Content-Type', type);
    if (voortgang) xhr.upload.onprogress = (e) => { if (e.lengthComputable) voortgang(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      let d: Record<string, unknown> = {};
      try { d = JSON.parse(xhr.responseText); } catch { /* geen JSON */ }
      if (xhr.status >= 200 && xhr.status < 300) ok(d as T);
      else fout(new Error((d.error as string) || `Upload mislukt (${xhr.status})`));
    };
    xhr.onerror = () => fout(new Error('Upload mislukt: geen verbinding'));
    xhr.send(bestand);
  });
}

/** Knop die een verborgen bestandskiezer opent. */
const BestandKnop: React.FC<{ label: string; accept: string; onKies: (f: File) => void; stijl?: React.CSSProperties }> = ({ label, accept, onKies, stijl }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onKies(f); e.target.value = ''; }} />
      <button style={stijl ?? knopLicht} onClick={() => ref.current?.click()}>{label}</button>
    </>
  );
};

// ═════════════ Overzicht van alle cursussen ═════════════
interface CursusRij {
  id: number; slug: string; nr: number; titel: string; status: CStatus; hoofdstukken: number; goedgekeurd: number; aangepast: number; bijgewerkt: string;
  live: number; per_beheerder: Record<string, number>; cursus_goedgekeurd_door: number[];
}

export const AcademieOverzichtPage: React.FC = () => {
  const [cursussen, setCursussen] = useState<CursusRij[] | null>(null);
  const [beheerders, setBeheerders] = useState<Beheerder[]>([]);
  const [fout, setFout] = useState<string | null>(null);
  const [verslag, setVerslag] = useState<string | null>(null);
  const laadOverzicht = useCallback(() => {
    api<{ beheerders: Beheerder[]; cursussen: CursusRij[] }>('/api/admin/academie')
      .then((d) => { setBeheerders(d.beheerders); setCursussen(d.cursussen); })
      .catch((e) => setFout(e.message));
  }, []);
  useEffect(() => { laadOverzicht(); }, [laadOverzicht]);

  // Nieuwe cursus(sen): eerst als upload bewaren, daarna meteen importeren
  async function nieuweCursus(f: File) {
    if (!f.name.toLowerCase().endsWith('.zip')) { setVerslag('Kies een .zip-bestand.'); return; }
    setVerslag('Uploaden… 0%');
    try {
      const upload = await uploadBestand<{ id: number }>(`/api/admin/cursus-upload?naam=${encodeURIComponent(f.name)}`, f, 'application/zip',
        (pct) => setVerslag(pct < 100 ? `Uploaden… ${pct}%` : 'Geüpload — bezig met importeren (bij een grote zip met afbeeldingen kan dit even duren)…'));
      setVerslag('Geüpload — bezig met importeren (bij een grote zip met afbeeldingen kan dit even duren)…');
      const d = await api<{ nieuweCursussen: number; nieuweHoofdstukken: number; bijgewerkt: number; overgeslagen: number; bewerktOvergeslagen: string[]; afbeeldingen: number }>(`/api/admin/academie/importeer/${upload.id}`, { method: 'POST' });
      setVerslag(d.nieuweCursussen || d.nieuweHoofdstukken || d.bijgewerkt || d.bewerktOvergeslagen.length
        ? `✓ ${d.nieuweCursussen} nieuwe cursus(sen), ${d.nieuweHoofdstukken} nieuwe hoofdstukken, ${d.bijgewerkt ?? 0} bijgewerkt` +
        `${d.afbeeldingen ? `, ${d.afbeeldingen} afbeeldingen` : ''}${d.overgeslagen ? ` · ${d.overgeslagen} ongewijzigd` : ''}` +
        `${d.bewerktOvergeslagen?.length ? ` · ${d.bewerktOvergeslagen.length} al bewerkt en niet overschreven (nieuwe versie staat klaar onder ‘Origineel’): ${d.bewerktOvergeslagen.join(', ')}` : ''}`
        : d.overgeslagen ? `Alle ${d.overgeslagen} hoofdstukken waren al gelijk; er is niets veranderd.`
        : 'Er is niets nieuws gevonden. Controleer of de mappen en bestanden de opbouw uit het sjabloon volgen (bijv. 21-naam/21-01-titel.md).');
      laadOverzicht();
    } catch (e) { setVerslag((e as Error).message); }
  }

  const totaal = (cursussen || []).reduce((s, c) => s + c.hoofdstukken, 0);
  const goed = (cursussen || []).reduce((s, c) => s + (c.goedgekeurd || 0), 0);
  const aangepast = (cursussen || []).reduce((s, c) => s + (c.aangepast || 0), 0);

  return (
    <div style={pagina}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={titelStijl}>ACADEMIE — BEHEER</h1>
        <p style={{ color: G.tekst3, margin: '0 0 1.5rem', fontSize: 15 }}>
          Alleen zichtbaar voor beheerders. Beoordeel en verbeter elke cursus hoofdstuk voor hoofdstuk.{' '}
          <Link to="/admin/cursussen" style={{ color: G.goud }}>Alle uploads →</Link>
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.6rem' }}>
          <BestandKnop label="⬆ Nieuwe cursus uploaden (.zip)" accept=".zip,application/zip" onKies={nieuweCursus} stijl={knop} />
          <a href="/api/admin/academie-sjabloon" style={{ ...knopLicht, textDecoration: 'none' }}>⬇ Sjabloon voor ChatGPT (.zip)</a>
        </div>
        <p style={{ fontSize: 13, color: G.tekst3, margin: '0 0 1.2rem' }}>
          Geef het sjabloon aan ChatGPT: daarin staat precies hoe een cursus moet zijn opgebouwd, met een voorbeeld en het eerstvolgende vrije cursusnummer. De zip die ChatGPT maakt, upload je hier.
        </p>
        {verslag && <p style={{ fontSize: 14, margin: '0 0 1.2rem', color: verslag.startsWith('✓') ? '#9bd49b' : G.tekst2 }}>{verslag}</p>}
        {fout && <p style={{ color: '#ff9a8a' }}>{fout}</p>}
        {cursussen && cursussen.length === 0 && (
          <p style={{ color: G.tekst3, fontStyle: 'italic' }}>Nog geen cursussen. Importeer eerst een zip via <Link to="/admin/cursussen" style={{ color: G.goud }}>Uploads</Link>.</p>
        )}
        {cursussen && cursussen.length > 0 && (
          <>
            <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 15, marginBottom: 8 }}>
                <span><strong>{goed}</strong> van {totaal} hoofdstukken goedgekeurd · {aangepast} aangepast · {totaal - goed - aangepast} te beoordelen</span>
                <span style={{ color: G.tekst3 }}>{cursussen.length} cursussen</span>
              </div>
              <Balk goed={goed} aangepast={aangepast} totaal={totaal} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.8rem' }}>
              {cursussen.map((c) => (
                <Link key={c.id} to={`/admin/academie/${c.slug}`} style={{ textDecoration: 'none', color: G.goudBleek, background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 12, padding: '1rem 1.1rem', display: 'block' }}>
                  <div style={{ fontSize: 12, color: G.tekst3 }}>Cursus {c.nr}</div>
                  <div style={{ fontSize: 17, margin: '2px 0 8px', lineHeight: 1.3 }}>{c.titel}</div>
                  <Balk goed={c.goedgekeurd || 0} aangepast={c.aangepast || 0} totaal={c.hoofdstukken} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13, color: G.tekst2 }}>
                    <span>{c.goedgekeurd || 0}/{c.hoofdstukken} door iedereen goedgekeurd</span>
                    {c.live ? <span style={{ fontSize: 12, color: '#9bd49b', fontFamily: "'Cinzel', serif" }}>● LIVE</span> : <Badge {...C_STATUS[c.status]} />}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: G.tekst3, lineHeight: 1.6 }}>
                    {beheerders.map((b) => (
                      <div key={b.id}>
                        {b.naam}: {c.per_beheerder?.[b.id] || 0}/{c.hoofdstukken} hoofdstukken
                        {c.cursus_goedgekeurd_door?.includes(b.id) ? ' · cursus ✓' : ''}
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═════════════ Eén cursus met zijn hoofdstukken ═════════════
interface HoofdstukKort { id: number; nr: number; titel: string; status: HStatus; notitie: string; bijgewerkt: string; bijgewerkt_door: string; gewijzigd: number; lengte: number; heeft_advies: number; goedgekeurd_door: number[] }
interface Goedkeuring { lid_id: number; naam: string; datum: string }
interface CursusDetail {
  id: number; slug: string; nr: number; titel: string; beschrijving: string; status: CStatus; advies: string; hoofdstukken: HoofdstukKort[];
  live: number; live_sinds: string; beheerders: Beheerder[]; cursus_goedkeuringen: Goedkeuring[];
}

export const AcademieCursusPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [c, setC] = useState<CursusDetail | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [opgeslagen, setOpgeslagen] = useState<string | null>(null);
  const [uploadVerslag, setUploadVerslag] = useState<string | null>(null);
  const [goedMelding, setGoedMelding] = useState<string[] | null>(null);
  const { lid } = useAccount();

  async function cursusGoedkeuren(goed: boolean) {
    try {
      const d = await api<{ ontbreekt: string[] }>(`/api/admin/academie/${slug}/goedkeuren`, { method: 'POST', body: JSON.stringify({ goed }) });
      setGoedMelding(d.ontbreekt.length ? ['Nog nodig voordat de cursus live kan:', ...d.ontbreekt] : ['✓ Alle beheerders hebben alles goedgekeurd — de cursus mag live.']);
      laadCursus();
    } catch (e) { setGoedMelding([(e as Error).message]); }
  }

  async function zetLive(live: boolean) {
    const r = await fetch(`/api/admin/academie/${slug}/live`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ live }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) setGoedMelding([d.error || 'Live zetten mislukt', ...(d.ontbreekt || [])]);
    else { setGoedMelding([live ? '✓ De cursus staat live voor klanten.' : 'De cursus is offline gehaald.']); laadCursus(); }
  }

  const laadCursus = useCallback(() => { api<CursusDetail>(`/api/admin/academie/${slug}`).then(setC).catch((e) => setFout(e.message)); }, [slug]);
  useEffect(() => { laadCursus(); }, [laadCursus]);

  async function uploadZip(f: File) {
    if (!f.name.toLowerCase().endsWith('.zip')) { setUploadVerslag('Kies een .zip-bestand.'); return; }
    setUploadVerslag('Uploaden… 0%');
    try {
      const d = await uploadBestand<{ gewijzigd: string[]; ongewijzigd: number; onbekend: string[]; genegeerd: string[]; dubbel: string[] }>(`/api/admin/academie/${slug}/upload`, f, 'application/zip',
        (pct) => setUploadVerslag(pct < 100 ? `Uploaden… ${pct}%` : 'Geüpload — bezig met verwerken…'));
      setUploadVerslag(`${d.dubbel.length ? '⚠' : '✓'} ${d.gewijzigd.length} hoofdstuk(ken) bijgewerkt${d.gewijzigd.length ? `: ${d.gewijzigd.join(', ')}` : ''} · ${d.ongewijzigd} ongewijzigd` +
        (d.dubbel.length ? ` · ⚠ NIET aangepast omdat de zip twee verschillende versies bevat — haal de oude map uit de zip en upload opnieuw: ${d.dubbel.join(' | ')}` : '') +
        (d.onbekend.length ? ` · niet herkend: ${d.onbekend.join(', ')}` : '') +
        (d.genegeerd.length ? ` · genegeerd (geen hoofdstuk): ${d.genegeerd.join(', ')}` : ''));
      laadCursus();
    } catch (e) { setUploadVerslag((e as Error).message); }
  }

  async function wijzig(w: Partial<Pick<CursusDetail, 'titel' | 'beschrijving' | 'status' | 'advies'>>) {
    const d = await api<CursusDetail>(`/api/admin/academie/${slug}`, { method: 'PATCH', body: JSON.stringify(w) });
    setC((x) => x && { ...x, ...d, hoofdstukken: x.hoofdstukken });
    setOpgeslagen('Opgeslagen ✓');
    setTimeout(() => setOpgeslagen(null), 2000);
  }

  if (fout) return <div style={pagina}><p style={{ padding: '2rem', color: '#ff9a8a' }}>{fout}</p></div>;
  if (!c) return <div style={pagina}><p style={{ padding: '2rem', color: G.tekst3 }}>Laden…</p></div>;
  const goed = c.hoofdstukken.filter((h) => h.status === 'goedgekeurd').length;
  const aangepast = c.hoofdstukken.filter((h) => h.status === 'aangepast').length;

  return (
    <div style={pagina}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <p style={{ fontSize: 14, margin: '0 0 0.8rem' }}><Link to="/admin/academie" style={{ color: G.goud }}>← Alle cursussen</Link></p>
        <div style={{ fontSize: 13, color: G.tekst3 }}>Cursus {c.nr}</div>
        <input defaultValue={c.titel} onBlur={(e) => e.target.value !== c.titel && wijzig({ titel: e.target.value })}
          style={{ ...invoer, width: '100%', fontSize: 22, fontFamily: "'Cinzel', serif", margin: '4px 0 10px' }} aria-label="Titel van de cursus" />
        <textarea defaultValue={c.beschrijving} placeholder="Korte beschrijving van de cursus (voor het overzicht)"
          onBlur={(e) => e.target.value !== c.beschrijving && wijzig({ beschrijving: e.target.value })}
          style={{ ...invoer, width: '100%', minHeight: 60, resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', margin: '0.8rem 0 1.4rem' }}>
          <label style={{ fontSize: 13, color: G.tekst3 }}>Status cursus{' '}
            <select value={c.status} onChange={(e) => wijzig({ status: e.target.value as CStatus })} style={invoer}>
              {(Object.keys(C_STATUS) as CStatus[]).map((s) => <option key={s} value={s}>{C_STATUS[s].label}</option>)}
            </select>
          </label>
          {opgeslagen && <span style={{ fontSize: 13, color: '#9bd49b' }}>{opgeslagen}</span>}
          <span style={{ marginLeft: 'auto', fontSize: 14, color: G.tekst2 }}>{goed}/{c.hoofdstukken.length} goedgekeurd</span>
        </div>
        {/* Goedkeuring door alle beheerders + live zetten */}
        {(() => {
          const ikGoed = c.cursus_goedkeuringen.some((g) => g.lid_id === lid?.id);
          const ikAlleHoofdstukken = c.hoofdstukken.every((h) => h.goedgekeurd_door.includes(lid?.id ?? -1));
          const iedereen = c.beheerders.every((b) => c.cursus_goedkeuringen.some((g) => g.lid_id === b.id))
            && c.hoofdstukken.every((h) => c.beheerders.every((b) => h.goedgekeurd_door.includes(b.id)));
          return (
            <div style={{ background: G.bg2, border: `0.5px solid ${c.live ? H_STATUS.goedgekeurd.kleur : G.rand}`, borderRadius: 12, padding: '1rem 1.2rem', margin: '0 0 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <strong style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em', color: G.goud }}>✓ GOEDKEURING EN LIVE ZETTEN</strong>
                <span style={{ fontSize: 14, color: c.live ? '#9bd49b' : G.tekst3 }}>
                  {c.live ? `● Live voor klanten sinds ${datumNL(c.live_sinds)}` : '○ Niet live (alleen zichtbaar voor beheerders)'}
                </span>
              </div>
              <div style={{ fontSize: 14, color: G.tekst2, margin: '8px 0' }}>
                Cursus goedgekeurd door: <GoedkeurChips beheerders={c.beheerders} door={c.cursus_goedkeuringen.map((g) => g.lid_id)} />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ikGoed
                  ? <button style={knopLicht} onClick={() => cursusGoedkeuren(false)}>Mijn goedkeuring van de cursus intrekken</button>
                  : <button style={{ ...knop, opacity: ikAlleHoofdstukken ? 1 : 0.55 }} onClick={() => cursusGoedkeuren(true)}
                      title={ikAlleHoofdstukken ? '' : 'Keur eerst alle hoofdstukken goed'}>✓ Ik keur deze cursus goed</button>}
                {c.live
                  ? <button style={knopLicht} onClick={() => zetLive(false)}>Offline halen</button>
                  : <button style={{ ...knop, background: H_STATUS.goedgekeurd.kleur, opacity: iedereen ? 1 : 0.5 }} onClick={() => zetLive(true)}
                      title={iedereen ? '' : 'Kan pas als alle beheerders de cursus en alle hoofdstukken hebben goedgekeurd'}>● Live zetten voor klanten</button>}
              </div>
              <p style={{ fontSize: 12, color: G.tekst3, margin: '8px 0 0' }}>
                Live zetten kan pas als <strong>alle beheerders</strong> elk hoofdstuk én de cursus als geheel hebben goedgekeurd.
                Verandert er daarna iets aan een hoofdstuk, dan vervallen de goedkeuringen en gaat de cursus automatisch offline.
              </p>
              {goedMelding && (
                <ul style={{ fontSize: 14, margin: '8px 0 0', paddingLeft: '1.1rem', color: goedMelding[0].startsWith('✓') ? '#9bd49b' : G.tekst2 }}>
                  {goedMelding.map((m, i) => <li key={i} style={{ listStyle: i === 0 ? 'none' : 'disc', marginLeft: i === 0 ? '-1.1rem' : 0 }}>{m}</li>)}
                </ul>
              )}
            </div>
          );
        })()}

        {/* Beoordeling + pakket voor ChatGPT */}
        <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 12, padding: '1rem 1.2rem', margin: '0 0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em', color: G.goud }}>💡 BEOORDELING EN ADVIES</strong>
            <a href={`/api/admin/academie/${c.slug}/chatgpt-pakket`} style={{ ...knop, textDecoration: 'none' }}>⬇ Pakket voor ChatGPT (.zip)</a>
          </div>
          <textarea key={c.advies} defaultValue={c.advies} placeholder="Nog geen beoordeling voor deze cursus."
            onBlur={(e) => e.target.value !== c.advies && wijzig({ advies: e.target.value })}
            style={{ ...invoer, width: '100%', minHeight: 120, resize: 'vertical', lineHeight: 1.55 }} />
          <p style={{ fontSize: 12, color: G.tekst3, margin: '6px 0 0' }}>
            Het pakket bevat jullie herwerk-opdracht, de technische eisen, dit advies plus het advies per hoofdstuk, en de huidige hoofdstukken.
            Geef het aan ChatGPT en upload de zip die je terugkrijgt hieronder met <em>Upload nieuwe versie</em>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <a href={`/api/admin/academie/${c.slug}/download`} style={{ ...knopLicht, textDecoration: 'none' }}>⬇ Download cursus (.zip)</a>
          <BestandKnop label="⬆ Upload nieuwe versie (.zip)" accept=".zip,application/zip" onKies={uploadZip} />
          <span style={{ fontSize: 12, color: G.tekst3 }}>Hoofdstukken worden herkend aan het nummer in de bestandsnaam (bijv. 06-03-amethist.md). Vorige versies blijven bewaard.</span>
        </div>
        {uploadVerslag && <p style={{ fontSize: 14, margin: '0 0 1rem', color: uploadVerslag.startsWith('✓') ? '#9bd49b' : G.tekst2 }}>{uploadVerslag}</p>}
        <Balk goed={goed} aangepast={aangepast} totaal={c.hoofdstukken.length} />

        <div style={{ marginTop: '1.2rem' }}>
          {c.hoofdstukken.map((h) => (
            <Link key={h.id} to={`/admin/academie/h/${h.id}`} style={{
              display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
              padding: '0.8rem 1rem', marginBottom: 6, background: G.bg2, borderRadius: 10, textDecoration: 'none', color: G.goudBleek,
              borderLeft: `4px solid ${H_STATUS[h.status].kleur}`,
            }}>
              <span style={{ fontSize: 16 }}>
                <span style={{ color: G.tekst3, marginRight: 8 }}>{h.nr}.</span>{h.titel}
                {h.heeft_advies ? <span style={{ fontSize: 13, marginLeft: 8 }} title="Er is advies voor dit hoofdstuk">💡</span> : null}
                {h.notitie && <span style={{ fontSize: 13, color: G.tekst3, marginLeft: 8 }}>· 📝 {h.notitie.slice(0, 60)}</span>}
              </span>
              <span style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, color: G.tekst3, flexWrap: 'wrap' }}>
                {h.gewijzigd ? <span>bewerkt {datumNL(h.bijgewerkt)}</span> : <span>origineel</span>}
                <GoedkeurChips beheerders={c.beheerders} door={h.goedgekeurd_door} klein />
                <Badge {...H_STATUS[h.status]} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═════════════ Hoofdstuk-editor ═════════════
interface Versie { id: number; titel: string; datum: string; door: string; reden: string; lengte: number }
interface HoofdstukDetail {
  id: number; nr: number; titel: string; inhoud: string; origineel: string; status: HStatus; notitie: string; advies: string;
  bijgewerkt: string; bijgewerkt_door: string;
  beheerders: Beheerder[]; goedkeuringen: Goedkeuring[];
  cursus: { slug: string; titel: string; nr: number };
  buren: { id: number; nr: number; titel: string }[];
  versies: Versie[];
}
type Weergave = 'naast' | 'bewerken' | 'voorbeeld';

export const AcademieHoofdstukPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [h, setH] = useState<HoofdstukDetail | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [titel, setTitel] = useState('');
  const [inhoud, setInhoud] = useState('');
  const [status, setStatus] = useState<HStatus>('te_beoordelen');
  const [notitie, setNotitie] = useState('');
  const [advies, setAdvies] = useState('');
  const [reden, setReden] = useState('opgeslagen');
  const [melding, setMelding] = useState<string | null>(null);
  const [weergave, setWeergave] = useState<Weergave>(() => (window.innerWidth > 1000 ? 'naast' : 'bewerken'));
  const [toon, setToon] = useState<'niets' | 'origineel' | 'versies'>('niets');
  const [versieTekst, setVersieTekst] = useState<{ id: number; titel: string; inhoud: string } | null>(null);
  const [wens, setWens] = useState('');
  const { lid } = useAccount();

  /** Goedkeuring van de ingelogde beheerder; bij niet-opgeslagen wijzigingen eerst opslaan. */
  async function keurGoed(goed: boolean) {
    if (!h) return;
    if (goed && gewijzigdRef.current) await opslaan();
    try {
      await api(`/api/admin/academie/hoofdstuk/${h.id}/goedkeuren`, { method: 'POST', body: JSON.stringify({ goed }) });
      setMelding(goed ? 'Jouw goedkeuring is opgeslagen ✓' : 'Jouw goedkeuring is ingetrokken');
      setTimeout(() => setMelding(null), 2500);
      laad();
    } catch (e) { setMelding((e as Error).message); }
  }

  const laad = useCallback(() => {
    api<HoofdstukDetail>(`/api/admin/academie/hoofdstuk/${id}`).then((d) => {
      setH(d); setTitel(d.titel); setInhoud(d.inhoud); setStatus(d.status); setNotitie(d.notitie); setAdvies(d.advies || ''); setReden('opgeslagen');
      setVersieTekst(null); setToon('niets');
    }).catch((e) => setFout(e.message));
  }, [id]);
  useEffect(() => { laad(); }, [laad]);

  const gewijzigd = !!h && (titel !== h.titel || inhoud !== h.inhoud || status !== h.status || notitie !== h.notitie || advies !== (h.advies || ''));
  const gewijzigdRef = useRef(false);
  gewijzigdRef.current = gewijzigd;

  // Waarschuwen bij weggaan met niet-opgeslagen wijzigingen
  useEffect(() => {
    const f = (e: BeforeUnloadEvent) => { if (gewijzigdRef.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', f);
    return () => window.removeEventListener('beforeunload', f);
  }, []);

  const opslaan = useCallback(async (nieuweStatus?: HStatus) => {
    if (!h) return;
    try {
      await api(`/api/admin/academie/hoofdstuk/${h.id}`, {
        method: 'PUT', body: JSON.stringify({ titel, inhoud, status: nieuweStatus ?? status, notitie, advies, reden }),
      });
      setMelding('Opgeslagen ✓');
      setTimeout(() => setMelding(null), 2500);
      laad();
    } catch (e) { setMelding((e as Error).message); }
  }, [h, titel, inhoud, status, notitie, advies, reden, laad]);

  // Ctrl/Cmd + S = opslaan
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); opslaan(); } };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [opslaan]);

  function naar(doel: number) {
    if (gewijzigd && !window.confirm('Je hebt niet-opgeslagen wijzigingen. Toch verdergaan?')) return;
    navigate(`/admin/academie/h/${doel}`);
  }

  // Geen AI-aanroep op de server (kost tegoed): we maken een kant-en-klare opdracht voor ChatGPT in de browser
  function chatgptOpdracht(): string {
    if (!h) return '';
    return `Je bent een ervaren Nederlandse docent en redacteur voor een spirituele online academie (Mystieke Kaarten).
Herschrijf het hoofdstuk hieronder zodat het ECHTE, specifieke inhoud heeft over het onderwerp in de titel, in plaats van algemene sjabloonzinnen.

Regels:
- Behoud deze kopjes in Markdown: ## Welkom, ## Leerdoelen, ## Uitleg, ## Toepassing, ## Praktijkoefening, ## Kennistoets, ## Afronden.
- Uitleg: 400–700 woorden concrete kennis (achtergrond, tradities, begrippen, voorbeelden), specifiek voor dit hoofdstuk.
- Praktijkoefening: een specifieke, uitvoerbare oefening in genummerde stappen.
- Kennistoets: 4 meerkeuzevragen (vraag vetgedrukt, opties als "- A) …" t/m "- D) …") plus 1 open reflectievraag.
  Zet de juiste antwoorden met korte uitleg in een blok:
  <details>
  <summary>Antwoorden</summary>
  …
  </details>
- Toon: warm, helder, je/jij. Spirituele begrippen als traditie of overtuiging; geen genezingsbeloften en geen medische, juridische of financiële adviezen; benoem grenzen en doorverwijzen waar passend.
- Geef ALLEEN de Markdown van het hoofdstuk terug, zonder titelregel, in één codeblok zodat ik het makkelijk kan kopiëren.
${wens.trim() ? `\nExtra wens: ${wens.trim()}\n` : ''}
Cursus: ${h.cursus.titel}
Hoofdstukken van deze cursus: ${h.buren.map((b) => `${b.nr}. ${b.titel}`).join(' | ')}
Dit hoofdstuk: ${h.nr}. ${titel}

Huidige tekst:
${inhoud}`;
  }

  async function kopieerOpdracht() {
    const tekst = chatgptOpdracht();
    try {
      await navigator.clipboard.writeText(tekst);
    } catch {
      // Terugval voor browsers zonder klembord-toegang
      const t = document.createElement('textarea');
      t.value = tekst; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
    setMelding('Opdracht gekopieerd ✓ — plak hem in ChatGPT');
    setTimeout(() => setMelding(null), 4000);
  }

  async function plakUitKlembord() {
    try {
      const tekst = (await navigator.clipboard.readText()).replace(/^```(?:markdown|md)?\s*\n?/i, '').replace(/\n?```\s*$/, '').trim();
      if (!tekst) { setMelding('Het klembord is leeg'); return; }
      setInhoud(tekst); setReden('tekst uit ChatGPT geplakt');
      if (status === 'te_beoordelen') setStatus('aangepast');
      setMelding('Geplakt in de editor — controleer en sla op');
    } catch {
      setMelding('Plakken werd geweigerd door de browser; plak met Ctrl+V in het tekstvak');
    }
  }

  async function uploadMd(f: File) {
    if (!h) return;
    if (!/\.(md|markdown|txt|zip)$/i.test(f.name)) { setMelding('Kies een .md-bestand of een zip met het hoofdstuk'); return; }
    if (gewijzigd && !window.confirm('Je hebt niet-opgeslagen wijzigingen in de editor. Die gaan verloren als je een nieuwe versie uploadt. Doorgaan?')) return;
    try {
      const d = await uploadBestand<{ gewijzigd: boolean }>(`/api/admin/academie/hoofdstuk/${h.id}/upload`, f, /\.zip$/i.test(f.name) ? 'application/zip' : 'text/markdown');
      setMelding(d.gewijzigd ? 'Nieuwe versie geüpload ✓ (vorige versie bewaard)' : 'Het bestand is gelijk aan de huidige tekst — niets veranderd');
      laad();
    } catch (e) { setMelding((e as Error).message); }
  }

  async function bekijkVersie(v: Versie) {
    const d = await api<{ id: number; titel: string; inhoud: string }>(`/api/admin/academie/versie/${v.id}`);
    setVersieTekst(d);
  }

  if (fout) return <div style={pagina}><p style={{ padding: '2rem', color: '#ff9a8a' }}>{fout}</p></div>;
  if (!h) return <div style={pagina}><p style={{ padding: '2rem', color: G.tekst3 }}>Laden…</p></div>;

  const index = h.buren.findIndex((b) => b.id === h.id);
  const vorige = h.buren[index - 1];
  const volgende = h.buren[index + 1];
  const tekstvak = (
    <textarea value={inhoud} onChange={(e) => setInhoud(e.target.value)} spellCheck
      style={{ ...invoer, width: '100%', minHeight: '65vh', fontFamily: 'ui-monospace, Menlo, Consolas, monospace', fontSize: 14, lineHeight: 1.6, resize: 'vertical' }}
      aria-label="Inhoud van het hoofdstuk (Markdown)" />
  );
  const voorbeeld = (
    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '1rem 1.3rem', minHeight: '65vh', overflow: 'auto' }}>
      <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goudBleek, margin: '0 0 0.5rem' }}>Hoofdstuk {h.nr} — {titel}</h1>
      <Markdown tekst={inhoud} />
    </div>
  );

  return (
    <div style={pagina}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        {/* Kop met navigatie */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.8rem', fontSize: 14 }}>
          <Link to={`/admin/academie/${h.cursus.slug}`} style={{ color: G.goud }} onClick={(e) => { if (gewijzigd && !window.confirm('Niet-opgeslagen wijzigingen gaan verloren. Doorgaan?')) e.preventDefault(); }}>
            ← Cursus {h.cursus.nr}: {h.cursus.titel}
          </Link>
          <span style={{ display: 'flex', gap: 8 }}>
            <button style={knopLicht} disabled={!vorige} onClick={() => vorige && naar(vorige.id)}>← Vorige</button>
            <span style={{ color: G.tekst3, alignSelf: 'center' }}>{index + 1} / {h.buren.length}</span>
            <button style={knopLicht} disabled={!volgende} onClick={() => volgende && naar(volgende.id)}>Volgende →</button>
          </span>
        </div>

        {/* Titel + status + opslaan */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
          <label style={{ flex: '1 1 320px', fontSize: 12, color: G.tekst3 }}>Hoofdstuk {h.nr} — titel<br />
            <input value={titel} onChange={(e) => setTitel(e.target.value)} style={{ ...invoer, width: '100%', fontSize: 18 }} />
          </label>
          <label style={{ fontSize: 12, color: G.tekst3 }}>Status<br />
            <select value={status} onChange={(e) => setStatus(e.target.value as HStatus)} style={invoer}>
              {(['te_beoordelen', 'aangepast'] as HStatus[]).map((s) => <option key={s} value={s}>{H_STATUS[s].label}</option>)}
              {status === 'goedgekeurd' && <option value="goedgekeurd">Goedgekeurd (door iedereen)</option>}
            </select>
          </label>
          <button style={{ ...knop, opacity: gewijzigd ? 1 : 0.6 }} onClick={() => opslaan()} title="Ctrl/Cmd + S">Opslaan</button>
          {h.goedkeuringen.some((g) => g.lid_id === lid?.id)
            ? <button style={knopLicht} onClick={() => keurGoed(false)}>Mijn goedkeuring intrekken</button>
            : <button style={{ ...knop, background: H_STATUS.goedgekeurd.kleur }} onClick={() => keurGoed(true)}>✓ Ik keur dit hoofdstuk goed</button>}
          {melding && <span style={{ fontSize: 13, color: melding.includes('✓') ? '#9bd49b' : '#ff9a8a', alignSelf: 'center' }}>{melding}</span>}
          {gewijzigd && !melding && <span style={{ fontSize: 13, color: '#E0B04A', alignSelf: 'center' }}>● Niet opgeslagen</span>}
        </div>

        <div style={{ fontSize: 14, color: G.tekst2, marginBottom: '0.8rem', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          Goedgekeurd door: <GoedkeurChips beheerders={h.beheerders} door={h.goedkeuringen.map((g) => g.lid_id)} />
          {h.goedkeuringen.length > 0 && (
            <span style={{ fontSize: 12, color: G.tekst3 }}>
              ({h.goedkeuringen.map((g) => `${g.naam.split(' ')[0]} ${new Date(`${g.datum.replace(' ', 'T')}Z`).toLocaleDateString('nl-NL')}`).join(', ')})
            </span>
          )}
          <span style={{ fontSize: 12, color: G.tekst3 }}>· Wijzig je de tekst, dan vervallen de goedkeuringen.</span>
        </div>

        <label style={{ display: 'block', fontSize: 12, color: G.tekst3, marginBottom: '0.8rem' }}>Notitie (alleen voor beheerders)<br />
          <input value={notitie} onChange={(e) => setNotitie(e.target.value)} placeholder="Bijv. ‘nog een voorbeeld toevoegen’ of ‘toets controleren’" style={{ ...invoer, width: '100%' }} />
        </label>

        <details open={!!advies} style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '0.7rem 1rem', marginBottom: '0.8rem' }}>
          <summary style={{ cursor: 'pointer', fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.06em', color: G.goud }}>
            💡 Advies voor dit hoofdstuk {advies ? '' : '(nog leeg)'}
          </summary>
          <textarea value={advies} onChange={(e) => setAdvies(e.target.value)} placeholder="Wat moet er in dit hoofdstuk beter? Dit advies gaat mee in het pakket voor ChatGPT."
            style={{ ...invoer, width: '100%', minHeight: 110, marginTop: 8, resize: 'vertical', lineHeight: 1.55 }} />
        </details>

        {/* Weergave-keuze */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '0.7rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {([['naast', 'Naast elkaar'], ['bewerken', 'Bewerken'], ['voorbeeld', 'Voorbeeld']] as [Weergave, string][]).map(([w, l]) => (
            <button key={w} onClick={() => setWeergave(w)} style={{ ...knopLicht, ...(weergave === w ? { background: G.bg3, borderColor: G.goud } : {}) }}>{l}</button>
          ))}
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href={`/api/admin/academie/hoofdstuk/${h.id}/chatgpt-pakket`} style={{ ...knop, textDecoration: 'none' }} title="Opdracht, eisen, taaleis, advies en dit hoofdstuk in één zip">⬇ Pakket voor ChatGPT (.zip)</a>
            <a href={`/api/admin/academie/hoofdstuk/${h.id}/download`} style={{ ...knopLicht, textDecoration: 'none' }} title="Alleen de tekst, laatst opgeslagen versie">⬇ Alleen tekst (.md)</a>
            <BestandKnop label="⬆ Upload nieuwe versie (.md of .zip)" accept=".md,.markdown,.txt,.zip,text/markdown,text/plain,application/zip" onKies={uploadMd} />
            <button onClick={() => setToon(toon === 'origineel' ? 'niets' : 'origineel')} style={knopLicht}>Origineel</button>
            <button onClick={() => setToon(toon === 'versies' ? 'niets' : 'versies')} style={knopLicht}>Versies ({h.versies.length})</button>
          </span>
        </div>

        {weergave === 'naast' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>{tekstvak}{voorbeeld}</div>
        ) : weergave === 'bewerken' ? tekstvak : voorbeeld}
        <p style={{ fontSize: 12, color: G.tekst3, margin: '0.4rem 0 0' }}>
          Opmaak: <code>## Kop</code>, <code>**vet**</code>, <code>*cursief*</code>, <code>- punt</code>, <code>1. stap</code>, en
          antwoorden verbergen met <code>&lt;details&gt;&lt;summary&gt;Antwoorden&lt;/summary&gt; … &lt;/details&gt;</code>.
        </p>

        {/* Origineel / versies */}
        {toon === 'origineel' && (
          <div style={{ marginTop: '1rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '1rem 1.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>Origineel uit de zip</strong>
              <button style={knopLicht} onClick={() => { setInhoud(h.origineel); setReden('origineel teruggezet'); }}>Origineel in editor zetten</button>
            </div>
            <Markdown tekst={h.origineel} />
          </div>
        )}
        {toon === 'versies' && (
          <div style={{ marginTop: '1rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '1rem 1.3rem' }}>
            <strong>Eerdere versies</strong>
            {h.versies.length === 0 && <p style={{ color: G.tekst3, fontStyle: 'italic' }}>Nog geen eerdere versies.</p>}
            {h.versies.map((v) => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', padding: '6px 0', borderBottom: `0.5px solid ${G.rand}`, fontSize: 14 }}>
                <span>{new Date(`${v.datum.replace(' ', 'T')}Z`).toLocaleString('nl-NL')} · {v.door} · <span style={{ color: G.tekst3 }}>{v.reden}</span></span>
                <button style={knopLicht} onClick={() => bekijkVersie(v)}>Bekijken</button>
              </div>
            ))}
            {versieTekst && (
              <div style={{ marginTop: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong>Versie: {versieTekst.titel}</strong>
                  <button style={knopLicht} onClick={() => { setTitel(versieTekst.titel); setInhoud(versieTekst.inhoud); setReden('oude versie teruggezet'); }}>Deze versie in editor zetten</button>
                </div>
                <Markdown tekst={versieTekst.inhoud} />
              </div>
            )}
          </div>
        )}

        {/* Verbeteren met ChatGPT in de browser (geen kosten op de server) */}
        <div style={{ marginTop: '1.2rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '1rem 1.3rem' }}>
          <strong style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em', color: G.goud }}>✦ VERBETEREN MET CHATGPT</strong>
          <ol style={{ fontSize: 14, color: G.tekst2, margin: '6px 0 10px', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
            <li>Klik op <strong>Kopieer opdracht</strong>: de schrijfopdracht en de huidige tekst gaan naar je klembord.</li>
            <li>Plak in ChatGPT (in je browser) en kopieer het antwoord.</li>
            <li>Klik op <strong>Plak in editor</strong> (of plak zelf met Ctrl+V), controleer en sla op.</li>
          </ol>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input value={wens} onChange={(e) => setWens(e.target.value)} placeholder="Optioneel: wens, bijv. ‘meer over de geschiedenis’ of ‘eenvoudiger taal’" style={{ ...invoer, flex: '1 1 300px' }} />
            <button style={knop} onClick={kopieerOpdracht}>📋 Kopieer opdracht</button>
            <button style={knopLicht} onClick={plakUitKlembord}>Plak in editor</button>
            <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" style={{ ...knopLicht, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>ChatGPT openen ↗</a>
          </div>
        </div>

        <p style={{ fontSize: 12, color: G.tekst3, marginTop: '1rem' }}>
          Laatst bewerkt {datumNL(h.bijgewerkt)} door {h.bijgewerkt_door || '—'}.
        </p>
      </div>
    </div>
  );
};
