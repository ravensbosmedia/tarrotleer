// Beheer van de maandhoroscopen: per sterrenbeeld het origineel van AstroAPI naast de makkelijke versie (B1).
// De makkelijke versie is wat bezoekers zien (zen-flow.nl en de leeromgeving); beheerders kunnen die aanpassen.
import React, { useCallback, useEffect, useState } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

interface Status { teken: string; naam: string; opgehaald: boolean; makkelijk: boolean; aangepastDoor: string | null; bijgewerkt: string | null }
interface Gebied { area: string; title?: string; prediction: string }
interface Cyclus { date: string; phase?: string; interpretation?: string | null }
interface Versie { thema: string | null; gebieden: Gebied[]; tips: string[]; maancycli: Cyclus[] }
interface Detail { maand: string; teken: string; naam: string; origineel: Versie | null; makkelijk: Versie | null; meta: { gemaakt?: string; aangepastDoor?: string | null; bijgewerkt?: string | null } | null }

const kolom: React.CSSProperties = { flex: '1 1 300px', minWidth: 0 };
const origStijl: React.CSSProperties = { fontSize: 13.5, color: '#B9A9CC', lineHeight: 1.6, background: '#17112C', border: '0.5px solid rgba(239,180,255,0.22)', borderRadius: 6, padding: '0.6rem 0.8rem', margin: 0, whiteSpace: 'pre-wrap' };
const kopje: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 500, margin: '1.4rem 0 0.4rem', color: '#FFF3DF' };
const klein: React.CSSProperties = { fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F1CB78', marginBottom: 4 };

const Rij: React.FC<{ origineel: string | null | undefined; waarde: string; onChange: (v: string) => void }> = ({ origineel, waarde, onChange }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
    <div style={kolom}><div style={klein}>Origineel (AstroAPI)</div><p style={origStijl}>{origineel || '—'}</p></div>
    <div style={kolom}><div style={klein}>Makkelijke taal (wordt getoond)</div>
      <textarea className="zf-veld" value={waarde} onChange={(e) => onChange(e.target.value)} rows={Math.max(3, Math.ceil(waarde.length / 70))} style={{ fontSize: 14, lineHeight: 1.6, resize: 'vertical' }} />
    </div>
  </div>
);

export const HoroscoopBeheerPage: React.FC = () => {
  const [lijst, setLijst] = useState<{ maand: string; tekens: Status[] } | null>(null);
  const [gekozen, setGekozen] = useState<string>('aries');
  const [detail, setDetail] = useState<Detail | null>(null);
  const [concept, setConcept] = useState<Versie | null>(null);
  const [melding, setMelding] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);

  const laadLijst = useCallback(() => fetch('/api/admin/horoscoop/maand').then((r) => r.json()).then(setLijst), []);
  const laadDetail = useCallback((t: string) => {
    setDetail(null); setConcept(null);
    fetch(`/api/admin/horoscoop/maand/${t}`).then((r) => r.json()).then((d: Detail) => { setDetail(d); setConcept(d.makkelijk ? JSON.parse(JSON.stringify(d.makkelijk)) : null); });
  }, []);
  useEffect(() => { laadLijst(); }, [laadLijst]);
  useEffect(() => { laadDetail(gekozen); }, [gekozen, laadDetail]);
  const meld = (t: string) => { setMelding(t); setTimeout(() => setMelding(null), 4000); };

  async function bewaar() {
    if (!concept) return;
    const r = await fetch(`/api/admin/horoscoop/maand/${gekozen}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(concept) });
    meld(r.ok ? 'Opgeslagen ✓ — bezoekers zien nu jouw tekst.' : 'Opslaan mislukt'); laadLijst(); laadDetail(gekozen);
  }
  async function herschrijf() {
    if (!confirm(detail?.origineel ? 'Opnieuw laten herschrijven door AI? Jouw aanpassingen worden vervangen (de vorige versie wordt bewaard). Kost één AI-call.' : 'Dit sterrenbeeld ophalen bij AstroAPI en herschrijven? Kost één AstroAPI-call en één AI-call.')) return;
    setBezig(true); meld('Bezig… dit duurt ongeveer een minuut.');
    const r = await fetch(`/api/admin/horoscoop/maand/${gekozen}/herschrijf`, { method: 'POST' });
    setBezig(false); meld(r.ok ? 'Klaar ✓' : 'Mislukt — probeer het later opnieuw.'); laadLijst(); laadDetail(gekozen);
  }

  const zet = (pad: (v: Versie) => void) => setConcept((c) => { if (!c) return c; const n: Versie = JSON.parse(JSON.stringify(c)); pad(n); return n; });
  const st = lijst?.tekens.find((t) => t.teken === gekozen);

  return (
    <div className="zf-pagina">
      <div className="zf-kop"><div>
        <p className="zf-label">Beheer</p>
        <h1 className="zf-titel">Maandhoroscopen</h1>
        <p className="zf-intro">Links de tekst van AstroAPI, rechts de makkelijke versie (B1) die bezoekers zien op zen-flow.nl en in de leeromgeving. Pas de makkelijke versie gerust aan.</p>
      </div></div>
      <div className="zf-inhoud">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.2rem' }}>
          {lijst?.tekens.map((t) => (
            <button key={t.teken} onClick={() => setGekozen(t.teken)} style={{ ...ZF_KNOP_PAARS, minHeight: 36, padding: '7px 14px', fontSize: 11, borderColor: gekozen === t.teken ? '#F1CB78' : '#EFB4FF', color: gekozen === t.teken ? '#F1CB78' : '#fff' }}>
              {t.makkelijk ? (t.aangepastDoor ? '✎ ' : '✓ ') : t.opgehaald ? '… ' : '○ '}{t.naam}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#B9A9CC', marginBottom: '1rem' }}>✓ makkelijke versie klaar · ✎ aangepast door een beheerder · … wel opgehaald, nog niet herschreven · ○ nog niet opgehaald · maand {lijst?.maand}</p>
        {melding && <p style={{ color: '#9BD49B', marginBottom: '0.8rem' }}>{melding}</p>}

        {!detail && <p style={{ color: '#B9A9CC' }}>Laden…</p>}
        {detail && (
          <div className="zf-kaart" style={{ padding: '1.3rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 500, margin: 0 }}>{detail.naam}</h2>
              <span style={{ fontSize: 12, color: '#B9A9CC' }}>
                {detail.meta ? `AI-versie ${detail.meta.gemaakt?.slice(0, 10) ?? ''}${detail.meta.aangepastDoor ? ` · aangepast door ${detail.meta.aangepastDoor} op ${detail.meta.bijgewerkt?.slice(0, 16).replace('T', ' ')}` : ''}` : st?.opgehaald ? 'Nog geen makkelijke versie' : 'Nog niet opgehaald'}
              </span>
            </div>

            {!concept && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#E0D5E9' }}>{detail.origineel ? 'Er is nog geen makkelijke versie van deze maand.' : 'Dit sterrenbeeld is deze maand nog niet opgehaald.'}</p>
                <button style={ZF_KNOP} onClick={herschrijf} disabled={bezig}>{detail.origineel ? 'Nu herschrijven' : 'Ophalen en herschrijven'}</button>
              </div>
            )}

            {concept && detail.origineel && (
              <>
                <div style={kopje}>Thema van de maand</div>
                <Rij origineel={detail.origineel.thema} waarde={concept.thema ?? ''} onChange={(v) => zet((n) => { n.thema = v; })} />

                <div style={kopje}>Levensgebieden</div>
                {concept.gebieden.map((g, i) => (
                  <div key={g.area}>
                    <div style={{ fontSize: 14, color: '#F1CB78', margin: '0.6rem 0 0.3rem' }}>{g.title ?? g.area}</div>
                    <Rij origineel={detail.origineel!.gebieden.find((o) => o.area === g.area)?.prediction} waarde={g.prediction} onChange={(v) => zet((n) => { n.gebieden[i].prediction = v; })} />
                  </div>
                ))}

                <div style={kopje}>Tips</div>
                {concept.tips.map((t, i) => (
                  <Rij key={i} origineel={detail.origineel!.tips[i]} waarde={t} onChange={(v) => zet((n) => { n.tips[i] = v; })} />
                ))}

                {concept.maancycli.length > 0 && <div style={kopje}>Maanfasen</div>}
                {concept.maancycli.map((c, i) => (
                  <div key={c.date}>
                    <div style={{ fontSize: 14, color: '#F1CB78', margin: '0.6rem 0 0.3rem' }}>{c.phase} · {c.date}</div>
                    <Rij origineel={detail.origineel!.maancycli.find((o) => o.date === c.date)?.interpretation} waarde={c.interpretation ?? ''} onChange={(v) => zet((n) => { n.maancycli[i].interpretation = v; })} />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: '1.2rem', position: 'sticky', bottom: 0, background: '#20162F', padding: '0.8rem 0', borderTop: '0.5px solid rgba(239,180,255,0.22)' }}>
                  <button style={ZF_KNOP} onClick={bewaar} disabled={bezig}>Opslaan</button>
                  <button style={ZF_KNOP_PAARS} onClick={() => setConcept(JSON.parse(JSON.stringify(detail.makkelijk)))} disabled={bezig}>Wijzigingen ongedaan maken</button>
                  <button style={ZF_KNOP_PAARS} onClick={herschrijf} disabled={bezig}>Opnieuw laten herschrijven (AI)</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
