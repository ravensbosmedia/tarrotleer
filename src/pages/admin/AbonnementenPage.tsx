// Beheer: abonnementstypen voor de Academie-cursussen (zonder betaling) en toekennen aan leden.
// De toegangscontrole staat standaard UIT; zie abonnementen.ts en README "Abonnementstypen".
import React, { useCallback, useEffect, useState } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

interface Type { id: number; naam: string; beschrijving: string; looptijd_dagen: number | null; alle_cursussen: boolean; actief: boolean; cursussen: string[]; leden_actief: number }
interface Cursus { slug: string; nr: number; titel: string; live: number }
interface Lid { id: number; naam: string; email: string; rol: string }
interface Toekenning { id: number; type_id: number; naam: string; start: string; tot: string | null; notitie: string; door: string; status: 'actief' | 'gepland' | 'verlopen' }
interface Concept { id: number | null; naam: string; beschrijving: string; looptijd: string; alle: boolean; cursussen: string[] }

const SERIF = "'Cormorant Garamond', Georgia, serif";
const label: React.CSSProperties = { display: 'block', fontSize: 12, color: '#E1D2E8', margin: '0.8rem 0 0.35rem' };
const kop: React.CSSProperties = { fontFamily: SERIF, fontSize: 23, fontWeight: 500, margin: '0 0 0.5rem', color: '#FFF3DF' };
const klein: React.CSSProperties = { fontSize: 13, color: '#B9A9CC' };
const LEEG: Concept = { id: null, naam: '', beschrijving: '', looptijd: '', alle: false, cursussen: [] };
const looptijdTekst = (d: number | null) => (d === null ? 'onbeperkt' : d % 365 === 0 ? `${d / 365} jaar` : d % 30 === 0 ? `${d / 30} maanden` : `${d} dagen`);
const datumNL = (d: string | null) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) : 'onbeperkt');

async function api<T>(url: string, methode = 'GET', body?: unknown): Promise<T> {
  const r = await fetch(url, { method: methode, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Er ging iets mis');
  return d as T;
}

export const AbonnementenPage: React.FC = () => {
  const [data, setData] = useState<{ aan: boolean; typen: Type[]; cursussen: Cursus[] } | null>(null);
  const [concept, setConcept] = useState<Concept | null>(null);
  const [melding, setMelding] = useState<{ tekst: string; goed: boolean } | null>(null);
  const [leden, setLeden] = useState<Lid[]>([]);
  const [zoek, setZoek] = useState('');
  const [lidId, setLidId] = useState<number | null>(null);
  const [toek, setToek] = useState<Toekenning[]>([]);
  const [nieuw, setNieuw] = useState({ type_id: '', start: '', notitie: '' });

  const laad = useCallback(() => api<typeof data>('/api/admin/abonnementen').then(setData), []);
  useEffect(() => { laad(); api<Lid[]>('/api/admin/leden').then(setLeden).catch(() => {}); }, [laad]);
  useEffect(() => { if (lidId) api<Toekenning[]>(`/api/admin/leden/${lidId}/abonnementen`).then(setToek); else setToek([]); }, [lidId]);
  const toon = (tekst: string, goed = true) => { setMelding({ tekst, goed }); setTimeout(() => setMelding(null), 5000); };
  const doe = async (f: () => Promise<unknown>, ok: string) => { try { await f(); toon(ok); laad(); } catch (e) { toon((e as Error).message, false); } };

  async function zetControle(aan: boolean) {
    const tekst = aan
      ? 'Toegangscontrole AANZETTEN?\n\nDaarna openen leden een Academie-cursus alleen als die in hun abonnement zit. Leden zonder abonnement zien de cursussen wel, maar kunnen ze niet openen. Beheerders zien altijd alles.'
      : 'Toegangscontrole UITZETTEN? Dan kan iedereen weer alle live cursussen openen.';
    if (!confirm(tekst)) return;
    doe(() => api('/api/admin/abonnementen/toegang', 'PUT', { aan }), aan ? 'Toegangscontrole staat aan' : 'Toegangscontrole staat uit');
  }
  async function bewaarType() {
    if (!concept) return;
    const body = { naam: concept.naam, beschrijving: concept.beschrijving, looptijd_dagen: concept.looptijd === '' ? null : Number(concept.looptijd), alle_cursussen: concept.alle, cursussen: concept.cursussen };
    await doe(() => (concept.id ? api(`/api/admin/abonnementen/typen/${concept.id}`, 'PUT', body) : api('/api/admin/abonnementen/typen', 'POST', body)), 'Abonnement opgeslagen');
    setConcept(null);
  }
  async function kenToe() {
    if (!lidId || !nieuw.type_id) return;
    try {
      setToek(await api<Toekenning[]>(`/api/admin/leden/${lidId}/abonnementen`, 'POST', { type_id: Number(nieuw.type_id), start: nieuw.start || undefined, notitie: nieuw.notitie }));
      setNieuw({ type_id: '', start: '', notitie: '' }); toon('Abonnement toegekend'); laad();
    } catch (e) { toon((e as Error).message, false); }
  }
  async function beeindig(id: number) {
    if (!confirm('Dit abonnement beëindigen? De einddatum wordt gisteren. De geschiedenis blijft bewaard.')) return;
    try { setToek(await api<Toekenning[]>(`/api/admin/lid-abonnementen/${id}/beeindigen`, 'POST')); toon('Abonnement beëindigd'); laad(); } catch (e) { toon((e as Error).message, false); }
  }

  const gevonden = zoek.trim().length >= 2 ? leden.filter((l) => `${l.naam} ${l.email}`.toLowerCase().includes(zoek.trim().toLowerCase())).slice(0, 8) : [];
  const lid = leden.find((l) => l.id === lidId);
  const titelVan = (slug: string) => data?.cursussen.find((c) => c.slug === slug)?.titel ?? slug;

  return (
    <div className="zf-pagina">
      <div className="zf-kop"><div>
        <p className="zf-label">Beheer</p>
        <h1 className="zf-titel">Abonnementen</h1>
        <p className="zf-intro">Bepaal welke Academie-cursussen bij welk abonnement horen en ken abonnementen toe aan leden. Betalen komt later.</p>
      </div></div>
      <div className="zf-inhoud" style={{ maxWidth: 1000 }}>
        {melding && <p role="status" style={{ color: melding.goed ? '#9BD49B' : '#F1CB78', marginBottom: '1rem' }}>{melding.tekst}</p>}
        {!data && <p style={klein}>Laden…</p>}
        {data && (<>
          <div className="zf-kaart" style={{ padding: '1rem 1.3rem', marginBottom: '1.2rem', borderColor: data.aan ? '#F1CB78' : undefined }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 380px' }}>
                <h2 style={{ ...kop, margin: 0 }}>Toegangscontrole: {data.aan ? 'AAN' : 'UIT'}</h2>
                <p style={{ ...klein, margin: '0.3rem 0 0' }}>{data.aan
                  ? 'Leden openen een Academie-cursus alleen als die in hun abonnement zit. Beheerders zien altijd alles.'
                  : 'Iedereen met een account kan alle live Academie-cursussen openen (zoals nu). Abonnementen kun je al wel instellen en toekennen.'}</p>
              </div>
              <button style={data.aan ? ZF_KNOP_PAARS : ZF_KNOP} onClick={() => zetControle(!data.aan)}>{data.aan ? 'Zet uit' : 'Zet aan'}</button>
            </div>
          </div>

          <div className="zf-kaart" style={{ padding: '1.1rem 1.3rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={kop}>Abonnementstypen</h2>
              {!concept && <button style={ZF_KNOP_PAARS} onClick={() => setConcept({ ...LEEG })}>+ Nieuw abonnement</button>}
            </div>
            {data.typen.length === 0 && !concept && <p style={klein}>Nog geen abonnementen. Maak er een, bijvoorbeeld "Kennismaking" of "Alles".</p>}
            {data.typen.map((t) => (
              <div key={t.id} style={{ borderTop: '0.5px solid rgba(239,180,255,0.15)', padding: '0.8rem 0', opacity: t.actief ? 1 : 0.55 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 400px' }}>
                    <strong style={{ color: '#FFF3DF', fontSize: 16 }}>{t.naam}</strong>{!t.actief && <span style={{ ...klein, marginLeft: 8 }}>(gearchiveerd)</span>}
                    <div style={klein}>{looptijdTekst(t.looptijd_dagen)} · {t.leden_actief} {t.leden_actief === 1 ? 'lid' : 'leden'} actief</div>
                    {t.beschrijving && <div style={{ fontSize: 14, color: '#E0D5E9', marginTop: 4 }}>{t.beschrijving}</div>}
                    <div style={{ fontSize: 13, color: '#E0D5E9', marginTop: 4 }}>{t.alle_cursussen ? 'Alle cursussen, ook nieuwe' : t.cursussen.length ? t.cursussen.map(titelVan).join(' · ') : <em style={{ color: '#F1CB78' }}>nog geen cursussen gekozen</em>}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <button style={{ ...ZF_KNOP_PAARS, padding: '0.35rem 0.9rem', fontSize: 13 }} onClick={() => setConcept({ id: t.id, naam: t.naam, beschrijving: t.beschrijving, looptijd: t.looptijd_dagen === null ? '' : String(t.looptijd_dagen), alle: t.alle_cursussen, cursussen: t.cursussen })}>Bewerken</button>
                    <button style={{ ...ZF_KNOP_PAARS, padding: '0.35rem 0.9rem', fontSize: 13 }} onClick={() => doe(() => api(`/api/admin/abonnementen/typen/${t.id}`, 'PUT', { actief: !t.actief }), t.actief ? 'Gearchiveerd' : 'Teruggezet')}>{t.actief ? 'Archiveren' : 'Terugzetten'}</button>
                  </div>
                </div>
              </div>
            ))}
            {concept && (
              <div style={{ borderTop: '0.5px solid rgba(239,180,255,0.25)', paddingTop: '0.8rem', marginTop: '0.4rem' }}>
                <h3 style={{ ...kop, fontSize: 19 }}>{concept.id ? 'Abonnement bewerken' : 'Nieuw abonnement'}</h3>
                <label style={label} htmlFor="ab-naam">Naam</label>
                <input id="ab-naam" className="zf-veld" value={concept.naam} maxLength={80} onChange={(e) => setConcept({ ...concept, naam: e.target.value })} />
                <label style={label} htmlFor="ab-besch">Korte omschrijving <span style={{ color: '#B9A9CC' }}>(optioneel)</span></label>
                <input id="ab-besch" className="zf-veld" value={concept.beschrijving} maxLength={500} onChange={(e) => setConcept({ ...concept, beschrijving: e.target.value })} />
                <label style={label} htmlFor="ab-loop">Looptijd</label>
                <select id="ab-loop" className="zf-veld" value={concept.looptijd} onChange={(e) => setConcept({ ...concept, looptijd: e.target.value })}>
                  <option value="">Onbeperkt</option><option value="30">1 maand (30 dagen)</option><option value="90">3 maanden</option>
                  <option value="180">6 maanden</option><option value="365">1 jaar</option>
                  {concept.looptijd && !['30', '90', '180', '365'].includes(concept.looptijd) && <option value={concept.looptijd}>{concept.looptijd} dagen</option>}
                </select>
                <label style={{ ...label, display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#FFF3DF' }}>
                  <input type="checkbox" checked={concept.alle} onChange={(e) => setConcept({ ...concept, alle: e.target.checked })} style={{ width: 18, height: 18, accentColor: '#F1CB78' }} />
                  Alle cursussen (ook cursussen die later bijkomen)
                </label>
                {!concept.alle && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '4px 14px', marginTop: 6 }}>
                    {data.cursussen.map((c) => (
                      <label key={c.slug} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#E0D5E9', padding: '3px 0' }}>
                        <input type="checkbox" checked={concept.cursussen.includes(c.slug)} style={{ width: 16, height: 16, accentColor: '#F1CB78' }}
                          onChange={(e) => setConcept({ ...concept, cursussen: e.target.checked ? [...concept.cursussen, c.slug] : concept.cursussen.filter((s) => s !== c.slug) })} />
                        <span>{c.nr}. {c.titel}{!c.live && <span style={{ color: '#B9A9CC' }}> · nog niet live</span>}</span>
                      </label>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
                  <button style={ZF_KNOP} onClick={bewaarType} disabled={!concept.naam.trim()}>Opslaan</button>
                  <button style={ZF_KNOP_PAARS} onClick={() => setConcept(null)}>Annuleren</button>
                </div>
              </div>
            )}
          </div>

          <div className="zf-kaart" style={{ padding: '1.1rem 1.3rem' }}>
            <h2 style={kop}>Abonnement toekennen aan een lid</h2>
            <label style={label} htmlFor="ab-zoek">Zoek een lid op naam of e-mailadres</label>
            <input id="ab-zoek" className="zf-veld" value={zoek} onChange={(e) => setZoek(e.target.value)} placeholder="Minimaal 2 letters" />
            {gevonden.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {gevonden.map((l) => <button key={l.id} onClick={() => { setLidId(l.id); setZoek(''); }} style={{ ...ZF_KNOP_PAARS, padding: '0.3rem 0.8rem', fontSize: 13 }}>{l.naam} · {l.email}</button>)}
              </div>
            )}
            {lid && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: 15, color: '#FFF3DF', margin: '0 0 0.5rem' }}><strong>{lid.naam}</strong> <span style={klein}>{lid.email}{lid.rol === 'admin' ? ' · beheerder (ziet altijd alles)' : ''}</span></p>
                {toek.length === 0 ? <p style={klein}>Nog geen abonnementen.</p> : toek.map((a) => (
                  <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', padding: '6px 0', borderBottom: '0.5px solid rgba(239,180,255,0.12)' }}>
                    <span style={{ flex: '1 1 260px', fontSize: 14, color: '#E0D5E9' }}><strong style={{ color: '#FFF3DF' }}>{a.naam}</strong> · {datumNL(a.start)} t/m {datumNL(a.tot)}{a.notitie && <span style={klein}> · {a.notitie}</span>}</span>
                    <span style={{ fontSize: 12, color: a.status === 'actief' ? '#9BD49B' : a.status === 'gepland' ? '#F1CB78' : '#B9A9CC' }}>{a.status}</span>
                    {a.status !== 'verlopen' && <button style={{ ...ZF_KNOP_PAARS, padding: '0.25rem 0.8rem', fontSize: 12 }} onClick={() => beeindig(a.id)}>Beëindigen</button>}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: '0.8rem' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={label} htmlFor="ab-type">Abonnement</label>
                    <select id="ab-type" className="zf-veld" value={nieuw.type_id} onChange={(e) => setNieuw({ ...nieuw, type_id: e.target.value })}>
                      <option value="">Kies…</option>
                      {data.typen.filter((t) => t.actief).map((t) => <option key={t.id} value={t.id}>{t.naam} ({looptijdTekst(t.looptijd_dagen)})</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '0 1 170px' }}>
                    <label style={label} htmlFor="ab-start">Start <span style={{ color: '#B9A9CC' }}>(leeg = vandaag)</span></label>
                    <input id="ab-start" type="date" className="zf-veld" value={nieuw.start} onChange={(e) => setNieuw({ ...nieuw, start: e.target.value })} style={{ colorScheme: 'dark' }} />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={label} htmlFor="ab-not">Notitie <span style={{ color: '#B9A9CC' }}>(optioneel)</span></label>
                    <input id="ab-not" className="zf-veld" value={nieuw.notitie} maxLength={300} onChange={(e) => setNieuw({ ...nieuw, notitie: e.target.value })} placeholder="bv. tester, betaald via bank" />
                  </div>
                  <button style={ZF_KNOP} onClick={kenToe} disabled={!nieuw.type_id}>Toekennen</button>
                </div>
              </div>
            )}
          </div>
        </>)}
      </div>
    </div>
  );
};
