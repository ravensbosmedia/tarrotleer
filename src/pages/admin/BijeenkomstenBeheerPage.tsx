// Beheer: bijeenkomsten en privégesprekken plannen (zonder mail; uitnodigingsmails volgen na de Office 365-koppeling).
import React, { useCallback, useEffect, useState } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

type Soort = 'groep' | 'prive';
type Doelgroep = 'alle' | 'cursus' | 'personen';
interface Persoon { id: number; naam: string; email: string }
interface Bijeenkomst {
  id: number; soort: Soort; titel: string; omschrijving: string; start: string; duur_min: number; link: string; pincode: string;
  doelgroep: Doelgroep; cursus_slug: string; status: 'gepland' | 'geannuleerd'; door: string; genodigden: Persoon[];
}
interface Concept { id: number | null; soort: Soort; titel: string; omschrijving: string; start: string; duur_min: number; link: string; pincode: string; doelgroep: Doelgroep; cursus_slug: string; genodigden: Persoon[] }

const SERIF = "'Cormorant Garamond', Georgia, serif";
const label: React.CSSProperties = { display: 'block', fontSize: 12, color: '#E1D2E8', margin: '0.8rem 0 0.35rem' };
const klein: React.CSSProperties = { fontSize: 13, color: '#B9A9CC' };
const LINK: Record<Soort, string> = { groep: 'https://bijeenkomst.zen-flow.nl/', prive: 'https://gesprek.zen-flow.nl/' };
const nieuwConcept = (soort: Soort): Concept => ({ id: null, soort, titel: soort === 'prive' ? 'Persoonlijk gesprek' : '', omschrijving: '', start: '', duur_min: soort === 'prive' ? 45 : 60,
  link: LINK[soort], pincode: '', doelgroep: soort === 'prive' ? 'personen' : 'alle', cursus_slug: '', genodigden: [] });
const wanneer = (s: string) => new Date(`${s}:00`).toLocaleString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const voorbij = (b: Bijeenkomst) => new Date(`${b.start}:00`).getTime() + b.duur_min * 60_000 < Date.now();

async function api<T>(url: string, methode = 'GET', body?: unknown): Promise<T> {
  const r = await fetch(url, { method: methode, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Er ging iets mis');
  return d as T;
}

export const BijeenkomstenBeheerPage: React.FC = () => {
  const [lijst, setLijst] = useState<Bijeenkomst[] | null>(null);
  const [leden, setLeden] = useState<Persoon[]>([]);
  const [cursussen, setCursussen] = useState<{ slug: string; nr: number; titel: string }[]>([]);
  const [concept, setConcept] = useState<Concept | null>(null);
  const [zoek, setZoek] = useState('');
  const [melding, setMelding] = useState<{ tekst: string; goed: boolean } | null>(null);
  const [toonOud, setToonOud] = useState(false);

  const laad = useCallback(() => api<Bijeenkomst[]>('/api/admin/bijeenkomsten').then(setLijst), []);
  useEffect(() => {
    laad();
    api<Persoon[]>('/api/admin/leden').then(setLeden).catch(() => {});
    api<{ cursussen: { slug: string; nr: number; titel: string }[] }>('/api/admin/abonnementen').then((d) => setCursussen(d.cursussen)).catch(() => {});
  }, [laad]);
  const toon = (tekst: string, goed = true) => { setMelding({ tekst, goed }); setTimeout(() => setMelding(null), 5000); };

  async function bewaar() {
    if (!concept) return;
    const body = { ...concept, genodigden: concept.genodigden.map((p) => p.id) };
    try {
      if (concept.id) await api(`/api/admin/bijeenkomsten/${concept.id}`, 'PUT', body); else await api('/api/admin/bijeenkomsten', 'POST', body);
      toon(concept.soort === 'prive' ? 'Gesprek opgeslagen. Het lid ziet het nu onder Bijeenkomsten.' : 'Bijeenkomst opgeslagen. De genodigden zien hem nu onder Bijeenkomsten.');
      setConcept(null); laad();
    } catch (e) { toon((e as Error).message, false); }
  }
  async function zetStatus(b: Bijeenkomst, status: 'gepland' | 'geannuleerd') {
    if (status === 'geannuleerd' && !confirm(`"${b.titel}" annuleren? De genodigden zien hem dan niet meer.`)) return;
    try { await api(`/api/admin/bijeenkomsten/${b.id}`, 'PUT', { status }); toon(status === 'geannuleerd' ? 'Geannuleerd' : 'Weer gepland'); laad(); } catch (e) { toon((e as Error).message, false); }
  }

  const gevonden = concept && zoek.trim().length >= 2
    ? leden.filter((l) => !concept.genodigden.some((g) => g.id === l.id) && `${l.naam} ${l.email}`.toLowerCase().includes(zoek.trim().toLowerCase())).slice(0, 8) : [];
  const zichtbaar = (lijst || []).filter((b) => toonOud || (!voorbij(b) && b.status === 'gepland'));
  const doelTekst = (b: Bijeenkomst) => b.soort === 'prive' ? `met ${b.genodigden[0]?.naam ?? '—'}`
    : b.doelgroep === 'alle' ? 'alle leden' : b.doelgroep === 'cursus' ? `leden van ${cursussen.find((c) => c.slug === b.cursus_slug)?.titel ?? b.cursus_slug}` : `${b.genodigden.length} genodigde(n)`;

  return (
    <div className="zf-pagina">
      <div className="zf-kop"><div>
        <p className="zf-label">Beheer</p>
        <h1 className="zf-titel">Bijeenkomsten</h1>
        <p className="zf-intro">Plan online bijeenkomsten en privégesprekken. Genodigden zien ze in hun leeromgeving onder Bijeenkomsten, met de link en een agenda-item. Uitnodigingsmails komen na de koppeling met Office 365.</p>
      </div></div>
      <div className="zf-inhoud" style={{ maxWidth: 960 }}>
        {melding && <p role="status" style={{ color: melding.goed ? '#9BD49B' : '#F1CB78', marginBottom: '1rem' }}>{melding.tekst}</p>}
        {!concept && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            <button style={ZF_KNOP} onClick={() => setConcept(nieuwConcept('groep'))}>+ Bijeenkomst plannen</button>
            <button style={ZF_KNOP_PAARS} onClick={() => setConcept(nieuwConcept('prive'))}>+ Privégesprek plannen</button>
          </div>
        )}

        {concept && (
          <div className="zf-kaart" style={{ padding: '1.2rem 1.4rem', marginBottom: '1.4rem' }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, margin: '0 0 0.3rem' }}>{concept.id ? 'Bewerken' : concept.soort === 'prive' ? 'Nieuw privégesprek' : 'Nieuwe bijeenkomst'}</h2>
            <label style={label} htmlFor="bk-titel">Titel</label>
            <input id="bk-titel" className="zf-veld" value={concept.titel} maxLength={120} onChange={(e) => setConcept({ ...concept, titel: e.target.value })} placeholder={concept.soort === 'prive' ? 'Persoonlijk gesprek' : 'bv. Maandelijkse bijeenkomst — vragen over de kaarten'} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px' }}>
                <label style={label} htmlFor="bk-start">Datum en tijd (Nederlandse tijd)</label>
                <input id="bk-start" type="datetime-local" className="zf-veld" value={concept.start} onChange={(e) => setConcept({ ...concept, start: e.target.value })} style={{ colorScheme: 'dark' }} />
              </div>
              <div style={{ flex: '0 1 160px' }}>
                <label style={label} htmlFor="bk-duur">Duur</label>
                <select id="bk-duur" className="zf-veld" value={concept.duur_min} onChange={(e) => setConcept({ ...concept, duur_min: Number(e.target.value) })}>
                  {[30, 45, 60, 75, 90, 120, 150, 180].map((m) => <option key={m} value={m}>{m < 60 ? `${m} min` : `${Math.floor(m / 60)} uur${m % 60 ? ` ${m % 60} min` : ''}`}</option>)}
                </select>
              </div>
            </div>
            <label style={label} htmlFor="bk-oms">Omschrijving <span style={{ color: '#B9A9CC' }}>(optioneel; wat gaan we doen?)</span></label>
            <textarea id="bk-oms" className="zf-veld" rows={4} value={concept.omschrijving} maxLength={2000} onChange={(e) => setConcept({ ...concept, omschrijving: e.target.value })} style={{ resize: 'vertical', lineHeight: 1.6 }} />

            {concept.soort === 'groep' && (<>
              <label style={label}>Wie nodig je uit?</label>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 14, color: '#E0D5E9' }}>
                {([['alle', 'Alle leden'], ['cursus', 'Leden van één cursus'], ['personen', 'Losse personen']] as const).map(([w, t]) => (
                  <label key={w} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="radio" name="doelgroep" checked={concept.doelgroep === w} onChange={() => setConcept({ ...concept, doelgroep: w })} style={{ accentColor: '#F1CB78' }} />{t}
                  </label>
                ))}
              </div>
              {concept.doelgroep === 'cursus' && (
                <select className="zf-veld" value={concept.cursus_slug} onChange={(e) => setConcept({ ...concept, cursus_slug: e.target.value })} style={{ marginTop: 8 }} aria-label="Cursus">
                  <option value="">Kies een cursus…</option>
                  {cursussen.map((c) => <option key={c.slug} value={c.slug}>{c.nr}. {c.titel}</option>)}
                </select>
              )}
              {concept.doelgroep === 'cursus' && <p style={{ ...klein, marginTop: 6 }}>Uitgenodigd zijn: leden die met deze cursus bezig zijn, of die hem in een actief abonnement hebben.</p>}
            </>)}

            {(concept.soort === 'prive' || concept.doelgroep === 'personen') && (<>
              <label style={label} htmlFor="bk-zoek">{concept.soort === 'prive' ? 'Met welk lid?' : 'Genodigden'}</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {concept.genodigden.map((g) => (
                  <span key={g.id} style={{ background: '#2D2040', border: '0.5px solid rgba(239,180,255,0.38)', borderRadius: 20, padding: '3px 6px 3px 12px', fontSize: 13, color: '#FFF3DF' }}>
                    {g.naam} <button onClick={() => setConcept({ ...concept, genodigden: concept.genodigden.filter((x) => x.id !== g.id) })} aria-label={`${g.naam} weghalen`} style={{ background: 'none', border: 0, color: '#F1CB78', cursor: 'pointer', fontSize: 15 }}>×</button>
                  </span>
                ))}
              </div>
              {!(concept.soort === 'prive' && concept.genodigden.length === 1) && (<>
                <input id="bk-zoek" className="zf-veld" value={zoek} onChange={(e) => setZoek(e.target.value)} placeholder="Zoek op naam of e-mailadres (minimaal 2 letters)" />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                  {gevonden.map((l) => <button key={l.id} onClick={() => { setConcept({ ...concept, genodigden: [...concept.genodigden, l] }); setZoek(''); }} style={{ ...ZF_KNOP_PAARS, padding: '0.3rem 0.8rem', fontSize: 13 }}>{l.naam} · {l.email}</button>)}
                </div>
              </>)}
            </>)}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={label} htmlFor="bk-link">Link naar de bijeenkomst</label>
                <input id="bk-link" className="zf-veld" value={concept.link} maxLength={300} onChange={(e) => setConcept({ ...concept, link: e.target.value })} />
              </div>
              <div style={{ flex: '0 1 160px' }}>
                <label style={label} htmlFor="bk-pin">Pincode <span style={{ color: '#B9A9CC' }}>(optioneel)</span></label>
                <input id="bk-pin" className="zf-veld" value={concept.pincode} inputMode="numeric" maxLength={8} onChange={(e) => setConcept({ ...concept, pincode: e.target.value.replace(/\D/g, '') })} />
              </div>
            </div>
            <p style={{ ...klein, marginTop: 6 }}>De pincode stel je in het bijeenkomstportaal in; genodigden zien hem hier in hun leeromgeving.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
              <button style={ZF_KNOP} onClick={bewaar}>Opslaan</button>
              <button style={ZF_KNOP_PAARS} onClick={() => { setConcept(null); setZoek(''); }}>Annuleren</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, margin: '0 0 0.6rem', color: '#FFF3DF' }}>{toonOud ? 'Alle bijeenkomsten' : 'Gepland'}</h2>
          <label style={{ ...klein, display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={toonOud} onChange={(e) => setToonOud(e.target.checked)} style={{ accentColor: '#F1CB78' }} /> ook voorbije en geannuleerde</label>
        </div>
        {lijst === null && <p style={klein}>Laden…</p>}
        {lijst && zichtbaar.length === 0 && <p style={klein}>Nog niets gepland.</p>}
        {zichtbaar.map((b) => (
          <div key={b.id} className="zf-kaart" style={{ padding: '0.9rem 1.2rem', marginBottom: '0.7rem', opacity: b.status === 'geannuleerd' || voorbij(b) ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 380px' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F1CB78' }}>{b.soort === 'prive' ? 'Privégesprek' : 'Bijeenkomst'}{b.status === 'geannuleerd' ? ' · geannuleerd' : voorbij(b) ? ' · voorbij' : ''}</div>
                <strong style={{ color: '#FFF3DF', fontSize: 17 }}>{b.titel}</strong>
                <div style={{ fontSize: 14, color: '#E0D5E9' }}>{wanneer(b.start)} · {b.duur_min} min · {doelTekst(b)}{b.pincode ? ' · met pincode' : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                {b.status === 'gepland' && <button style={{ ...ZF_KNOP_PAARS, padding: '0.3rem 0.9rem', fontSize: 13 }} onClick={() => setConcept({ id: b.id, soort: b.soort, titel: b.titel, omschrijving: b.omschrijving, start: b.start, duur_min: b.duur_min, link: b.link, pincode: b.pincode, doelgroep: b.doelgroep, cursus_slug: b.cursus_slug, genodigden: b.genodigden })}>Bewerken</button>}
                <button style={{ ...ZF_KNOP_PAARS, padding: '0.3rem 0.9rem', fontSize: 13 }} onClick={() => zetStatus(b, b.status === 'gepland' ? 'geannuleerd' : 'gepland')}>{b.status === 'gepland' ? 'Annuleren' : 'Weer plannen'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
