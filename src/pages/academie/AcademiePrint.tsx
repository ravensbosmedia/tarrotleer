// Printversie van een Academie-cursus (hele cursus of één hoofdstuk), in de stijl van de leeromgeving
// maar licht van kleur voor papier. De browser maakt er een PDF van via "Afdrukken → Opslaan als PDF".
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Markdown, BLOK_STIJL, BlokWeergave } from '../../components/Markdown';
import { maakStappen, haalVragen, Vraag } from '../../lib/lesOpbouw';

// Zen Flow op papier: paarse accenten (goud is op wit slecht leesbaar), werkbalk in de schermstijl
const G = { goud: '#5B2E7A', inkt: '#20162F', grijs: '#6E6286', rand: 'rgba(91,46,122,0.3)', papier: '#FFFFFF', zacht: '#F7F2FA' };

interface Les { nr: number; titel: string; inhoud: string }
interface Cursus { slug: string; nr: number; titel: string; beschrijving: string; live: number; hoofdstukken: { nr: number; titel: string }[] }

async function haal<T>(pad: string): Promise<T> {
  const r = await fetch(pad);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `Fout ${r.status}`);
  return d as T;
}

const PRINT_CSS = `
  @page { size: A4; margin: 16mm 15mm 18mm; }
  .ap-root { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .ap-root h2, .ap-root h3 { break-after: avoid; page-break-after: avoid; }
  .ap-root p, .ap-root li { orphans: 3; widows: 3; }
  .ap-blok, .ap-vraag, .ap-root img, .ap-root details { break-inside: avoid; page-break-inside: avoid; }
  .ap-nieuwe-pagina { break-before: page; page-break-before: always; }
  .ap-root details > summary { list-style: none; font-weight: 600; }
  .ap-root details > summary::-webkit-details-marker { display: none; }
  @media screen { .ap-vel { box-shadow: 0 2px 18px rgba(0,0,0,0.25); margin: 0 auto 2rem; } }
  @media print {
    html, body { background: #fff !important; }
    .ap-geen-print { display: none !important; }
    .ap-vel { box-shadow: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; }
  }
`;

/** Blokken voor papier: Denk na krijgt schrijflijnen (afvinken kan alleen online). */
const papierBlok: BlokWeergave = (soort, inhoud, extra) => {
  const { icoon, kleur } = BLOK_STIJL[soort];
  return (
    <div className="ap-blok" style={{ border: `1px solid ${kleur}66`, borderLeft: `4px solid ${kleur}`, background: `${kleur}12`, borderRadius: 10, padding: '0.7rem 0.95rem', margin: '0.9rem 0' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12.5, letterSpacing: '0.06em', color: kleur, marginBottom: 4 }}>
        {icoon} {soort.toUpperCase()}{extra ? <span style={{ textTransform: 'none', opacity: 0.85 }}> {extra}</span> : null}
      </div>
      {inhoud}
      {soort === 'Denk na' && (
        <div style={{ marginTop: 4 }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ borderBottom: `1px dotted ${G.grijs}`, height: 30 }} />)}
        </div>
      )}
    </div>
  );
};

const Vragen: React.FC<{ vragen: Vraag[] }> = ({ vragen }) => (
  <div>
    {vragen.map((v) => (
      <div key={v.nr} className="ap-vraag" style={{ background: G.zacht, border: `1px solid ${G.rand}`, borderRadius: 10, padding: '0.6rem 0.9rem', margin: '0 0 0.6rem' }}>
        <div style={{ fontSize: 15.5, marginBottom: 4 }}><strong>{v.nr}.</strong> {v.vraag}</div>
        {v.opties.map((o) => (
          <div key={o.letter} style={{ fontSize: 15, lineHeight: 1.5, paddingLeft: 6 }}>☐ <strong style={{ color: G.goud }}>{o.letter})</strong> {o.tekst}</div>
        ))}
      </div>
    ))}
  </div>
);

/** Eén hoofdstuk, alle stappen onder elkaar. Geeft de toetsvragen terug voor de antwoordenlijst. */
const HoofdstukPrint: React.FC<{ les: Les; eerste: boolean }> = ({ les, eerste }) => {
  const { afbeelding, stappen } = useMemo(() => maakStappen(les.inhoud, les.titel), [les]);
  return (
    <section className={eerste ? undefined : 'ap-nieuwe-pagina'}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.12em', color: G.goud }}>HOOFDSTUK {les.nr} <span style={{ letterSpacing: 0, color: G.grijs, fontFamily: 'inherit' }}>· {stappen.length} stappen</span></div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 25, color: G.inkt, margin: '2px 0 0.8rem', lineHeight: 1.25 }}>{les.titel}</h1>
      {afbeelding && <img src={afbeelding} alt="" style={{ width: '100%', borderRadius: 10, display: 'block', margin: '0 0 1rem' }} />}
      {stappen.map((s, i) => {
        const { rest, vragen } = haalVragen(s.md);
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, margin: '1.4rem 0 0.5rem', borderBottom: `1px solid ${G.rand}`, paddingBottom: 3, breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17.5, color: G.goud, margin: 0, letterSpacing: '0.03em' }}>{s.titel}</h2>
              <span style={{ fontSize: 12.5, color: G.grijs, whiteSpace: 'nowrap', border: `1px solid ${G.rand}`, borderRadius: 12, padding: '1px 9px' }}>H{les.nr} · stap {i + 1} van {stappen.length}</span>
            </div>
            {rest && <Markdown tekst={rest} donker={false} blokWeergave={papierBlok} uitgeklapt />}
            {vragen.length > 0 && <><Vragen vragen={vragen} /><p style={{ fontSize: 13.5, color: G.grijs, fontStyle: 'italic' }}>De antwoorden staan achterin.</p></>}
          </div>
        );
      })}
    </section>
  );
};

export const AcademiePrint: React.FC = () => {
  const { slug = '' } = useParams();
  const [zoek, setZoek] = useSearchParams();
  const keuze = zoek.get('hoofdstuk');
  const [cursus, setCursus] = useState<Cursus | null>(null);
  const [lessen, setLessen] = useState<Les[] | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    setLessen(null);
    haal<Cursus>(`/api/academie/${slug}`).then(async (c) => {
      setCursus(c);
      const nrs = keuze ? [Number(keuze)] : c.hoofdstukken.map((h) => h.nr);
      const l = await Promise.all(nrs.map((nr) => haal<Les>(`/api/academie/${slug}/${nr}`)));
      setLessen(l);
    }).catch((e) => setFout(e.message));
  }, [slug, keuze]);

  useEffect(() => {
    if (cursus) document.title = `${cursus.titel}${keuze ? ` — hoofdstuk ${keuze}` : ''} — Zen Flow`;
  }, [cursus, keuze]);

  const antwoorden = useMemo(() => (lessen || []).map((l) => ({
    les: l,
    ...(() => {
      const st = maakStappen(l.inhoud, l.titel).stappen;
      const i = st.findIndex((s) => haalVragen(s.md).vragen.length);
      return { vragen: st.flatMap((s) => haalVragen(s.md).vragen), stap: i + 1, totaal: st.length };
    })(),
  })).filter((a) => a.vragen.length), [lessen]);

  if (fout) return <p style={{ padding: '2rem', textAlign: 'center' }}>{fout} — <Link to="/academie">naar de Academie</Link></p>;

  return (
    <div className="ap-root" style={{ background: '#E9E3D6', minHeight: '100vh', color: G.inkt, fontFamily: "'DM Sans', serif" }}>
      <style>{PRINT_CSS}</style>

      {/* Werkbalk (niet op papier) */}
      <div className="ap-geen-print" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0D0C22', color: '#FFF3DF', padding: '0.7rem 1rem', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to={`/academie/${slug}`} style={{ color: '#F1CB78' }}>← Terug</Link>
        <label style={{ fontSize: 15 }}>Afdrukken:{' '}
          <select value={keuze || ''} onChange={(e) => setZoek(e.target.value ? { hoofdstuk: e.target.value } : {})}
            style={{ fontSize: 15, padding: '4px 8px', borderRadius: 6, maxWidth: '70vw' }}>
            <option value="">Hele cursus</option>
            {cursus?.hoofdstukken.map((h) => <option key={h.nr} value={h.nr}>Hoofdstuk {h.nr}: {h.titel}</option>)}
          </select>
        </label>
        <button disabled={!lessen} onClick={() => window.print()} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: 12, padding: '10px 20px', borderRadius: 28, border: '1px solid #FFF2C3', background: lessen ? 'linear-gradient(#FFEEB5,#FFC653 58%,#EEB153)' : '#6b5a7a', color: '#1C0D06', cursor: lessen ? 'pointer' : 'wait' }}>
          🖨 Afdrukken / opslaan als PDF
        </button>
        <span style={{ fontSize: 13, opacity: 0.7 }}>Tip: kies bij "Bestemming" voor "Opslaan als PDF" en zet "Achtergrondafbeeldingen" aan.</span>
      </div>

      <div className="ap-vel" style={{ background: G.papier, maxWidth: 820, padding: '2.2rem 2.4rem', marginTop: '1.5rem' }}>
        {!cursus || !lessen ? <p style={{ textAlign: 'center', color: G.grijs }}>Cursus laden…</p> : (
          <>
            {/* Voorblad (alleen bij de hele cursus) */}
            {!keuze && (
              <section style={{ textAlign: 'center', minHeight: '235mm', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: '0.2em', color: G.goud }}>ZEN FLOW · SPIRITUELE ACADEMIE</div>
                <div style={{ fontSize: 46, margin: '1.6rem 0 1rem', color: G.goud }}>✦</div>
                <div style={{ fontSize: 15, color: G.grijs }}>Cursus {cursus.nr}</div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: G.inkt, margin: '0.3rem 0 0.8rem', lineHeight: 1.2 }}>{cursus.titel}</h1>
                {cursus.beschrijving && <p style={{ fontSize: 17, color: G.grijs, lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>{cursus.beschrijving}</p>}
              </section>
            )}

            {/* Inhoudsopgave (alleen bij de hele cursus) */}
            {!keuze && (
              <section className="ap-nieuwe-pagina">
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: G.goud, margin: '0 0 1rem' }}>Inhoud</h1>
                {lessen.map((l) => (
                  <div key={l.nr} style={{ display: 'flex', gap: 12, fontSize: 17, padding: '0.4rem 0', borderBottom: `1px dotted ${G.rand}` }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", color: G.goud, minWidth: 28 }}>{l.nr}</span><span style={{ flex: 1 }}>{l.titel}</span><span style={{ fontSize: 14, color: G.grijs }}>{maakStappen(l.inhoud, l.titel).stappen.length} stappen</span>
                  </div>
                ))}
                {antwoorden.length > 0 && (
                  <div style={{ display: 'flex', gap: 12, fontSize: 17, padding: '0.4rem 0' }}><span style={{ minWidth: 28 }} /><em>Bijlage: antwoorden van Test jezelf</em></div>
                )}
              </section>
            )}

            {lessen.map((l, i) => (
              <div key={l.nr} className={!keuze && i === 0 ? 'ap-nieuwe-pagina' : undefined}>
                <HoofdstukPrint les={l} eerste={i === 0} />
              </div>
            ))}

            {/* Antwoorden achterin */}
            {antwoorden.length > 0 && (
              <section className="ap-nieuwe-pagina">
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: G.goud, margin: '0 0 0.8rem' }}>Bijlage: antwoorden van Test jezelf</h1>
                {antwoorden.map(({ les, vragen, stap, totaal }) => (
                  <div key={les.nr} className="ap-blok" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15.5, color: G.inkt, margin: '0 0 0.3rem' }}>Hoofdstuk {les.nr} — {les.titel} <span style={{ fontSize: 12.5, color: G.grijs, fontFamily: "'DM Sans', serif" }}>(H{les.nr} · stap {stap} van {totaal})</span></h3>
                    {vragen.map((v) => (
                      <div key={v.nr} style={{ fontSize: 15, lineHeight: 1.5, margin: '0 0 0.2rem' }}><strong>{v.nr}. {v.goed}</strong>{v.uitleg ? ` — ${v.uitleg}` : ''}</div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            <p style={{ textAlign: 'center', fontSize: 12.5, color: G.grijs, marginTop: '2rem' }}>© Zen Flow · Spirituele Academie · leren.zen-flow.nl</p>
          </>
        )}
      </div>
    </div>
  );
};
