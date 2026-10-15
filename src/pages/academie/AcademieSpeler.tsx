// Academie voor cursisten: overzicht, cursuspagina en een interactieve les die je stap voor stap doorloopt.
// Klanten zien alleen live cursussen; beheerders zien alles (met een melding "voorbeeld").
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Markdown, BLOK_STIJL, BlokWeergave } from '../../components/Markdown';
import { useOnderdeelVoortgang, slaRondeOp } from '../../lib/voortgang';
import { useAccount } from '../../lib/account';
import { maakStappen, haalVragen, Stap, Vraag } from '../../lib/lesOpbouw';
import { TrainersVideoBijHoofdstuk } from '../admin/TrainersVideos';

const G = {
  goud: '#F1CB78', goudBleek: '#FFF3DF', goudLicht: '#FFC653',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040', rand: 'rgba(241,203,120,0.25)',
  tekst2: 'rgba(255,243,223,0.75)', tekst3: 'rgba(255,243,223,0.5)', groen: '#5FA777', rood: '#C8604F',
};
const pagina: React.CSSProperties = { minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'DM Sans', serif" };
const knop: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.06em', padding: '11px 22px', borderRadius: 24,
  border: 'none', background: G.goud, color: G.bg, cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
};
const knopLicht: React.CSSProperties = { ...knop, background: 'transparent', color: G.goudBleek, border: `1px solid ${G.rand}` };

interface HoofdstukKort { nr: number; titel: string; afbeelding: string | null; stappen: number }
interface Cursus { slug: string; nr: number; titel: string; beschrijving: string; live: number; toegang?: boolean; hoofdstukken: HoofdstukKort[] }
interface LesVoortgang { stap?: number; klaar?: boolean; oefeningen?: Record<string, boolean>; antwoorden?: Record<string, string>; score?: { goed: number; totaal: number }; datum?: string }

async function haal<T>(pad: string): Promise<T> {
  const r = await fetch(pad);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `Fout ${r.status}`);
  return d as T;
}

const VoorbeeldMelding: React.FC<{ live: number }> = ({ live }) => {
  const { lid } = useAccount();
  if (live || lid?.rol !== 'admin') return null;
  return (
    <div style={{ background: '#2D2040', borderBottom: `1px solid ${G.rand}`, padding: '0.5rem 1rem', textAlign: 'center', fontSize: 14, color: G.tekst2 }}>
      👁 Voorbeeld voor beheerders — deze cursus is nog niet live en dus niet zichtbaar voor klanten.
    </div>
  );
};

// ═════════════ Overzicht van alle cursussen ═════════════
export const AcademieOverzicht: React.FC = () => {
  const [cursussen, setCursussen] = useState<(Omit<Cursus, 'hoofdstukken'> & { hoofdstukken: number; afbeelding: string | null })[] | null>(null);
  useEffect(() => { haal<typeof cursussen>('/api/academie').then(setCursussen).catch(() => setCursussen([])); }, []);
  return (
    <div style={pagina}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, letterSpacing: '0.14em', color: G.goud, textAlign: 'center', margin: '0 0 0.4rem' }}>SPIRITUELE ACADEMIE</h1>
        <p style={{ textAlign: 'center', color: G.tekst2, fontSize: 17, margin: '0 0 2rem' }}>Cursussen die je stap voor stap volgt, in je eigen tempo.</p>
        {cursussen === null && <p style={{ textAlign: 'center', color: G.tekst3 }}>Laden…</p>}
        {cursussen && cursussen.length === 0 && <p style={{ textAlign: 'center', color: G.tekst3, fontStyle: 'italic' }}>De eerste cursussen komen binnenkort online.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {cursussen?.map((c) => (
            <Link key={c.slug} to={`/academie/${c.slug}`} style={{ textDecoration: 'none', color: G.goudBleek, background: G.bg2, border: `1px solid ${G.rand}`, borderRadius: 14, overflow: 'hidden', display: 'block' }}>
              {c.afbeelding && <img src={c.afbeelding} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />}
              <div style={{ padding: '0.9rem 1.1rem' }}>
                <div style={{ fontSize: 12, color: G.tekst3 }}>Cursus {c.nr} · {c.hoofdstukken} hoofdstukken {!c.live && <span style={{ color: '#E0B04A' }}>· niet live</span>}{c.toegang === false && <span style={{ color: '#E0B04A' }}> · 🔒 niet in je abonnement</span>}</div>
                <div style={{ fontSize: 19, marginTop: 2 }}>{c.titel}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═════════════ Cursuspagina ═════════════
export const AcademieCursus: React.FC = () => {
  const { slug = '' } = useParams();
  const [c, setC] = useState<Cursus | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const voortgang = useOnderdeelVoortgang<LesVoortgang>(`academie-${slug}`);
  const { lid } = useAccount();
  useEffect(() => { haal<Cursus>(`/api/academie/${slug}`).then(setC).catch((e) => setFout(e.message)); }, [slug]);

  if (fout) return <div style={pagina}><p style={{ padding: '2rem', textAlign: 'center' }}>{fout} — <Link to="/academie" style={{ color: G.goud }}>naar de Academie</Link></p></div>;
  if (!c) return <div style={pagina}><p style={{ padding: '2rem', textAlign: 'center', color: G.tekst3 }}>Laden…</p></div>;

  const status = (nr: number) => voortgang.items.get(`h${nr}`);
  const klaar = c.hoofdstukken.filter((h) => status(h.nr)?.klaar).length;
  const volgende = c.hoofdstukken.find((h) => !status(h.nr)?.klaar) || c.hoofdstukken[0];
  const begonnen = c.hoofdstukken.some((h) => status(h.nr));
  const pct = Math.round((klaar / Math.max(1, c.hoofdstukken.length)) * 100);

  return (
    <div style={pagina}>
      <VoorbeeldMelding live={c.live} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 3rem' }}>
        <p style={{ margin: '0 0 1rem', fontSize: 15 }}><Link to="/academie" style={{ color: G.goud }}>← Alle cursussen</Link></p>
        {c.hoofdstukken[0]?.afbeelding && <img src={c.hoofdstukken[0].afbeelding} alt="" style={{ width: '100%', borderRadius: 14, display: 'block', marginBottom: '1.2rem' }} />}
        <div style={{ fontSize: 13, color: G.tekst3 }}>Cursus {c.nr}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: G.goud, margin: '4px 0 0.6rem', letterSpacing: '0.04em' }}>{c.titel}</h1>
        {c.beschrijving && <p style={{ fontSize: 18, color: G.tekst2, lineHeight: 1.6, margin: '0 0 1rem' }}>{c.beschrijving}</p>}
        {lid?.rol === 'admin' && <p style={{ margin: '0 0 1rem' }}><Link to={`/academie/${c.slug}/print`} style={{ ...knopLicht, padding: '7px 16px', fontSize: 12 }}>🖨 Printversie / PDF</Link></p>}

        <div style={{ background: G.bg2, border: `1px solid ${G.rand}`, borderRadius: 14, padding: '1rem 1.2rem', margin: '1rem 0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px' }}>
              <div style={{ fontSize: 15, color: G.tekst2, marginBottom: 6 }}>{klaar} van {c.hoofdstukken.length} hoofdstukken afgerond · {pct}%</div>
              <div style={{ height: 8, background: G.bg3, borderRadius: 4 }}><div style={{ width: `${pct}%`, height: '100%', background: G.goud, borderRadius: 4 }} /></div>
            </div>
            {c.toegang === false && (
              <div style={{ flex: '1 1 100%', fontSize: 15, color: G.tekst2 }}>🔒 Deze cursus zit niet in je abonnement. Je ziet wel wat erin staat; openen kan als de cursus bij je abonnement hoort.</div>
            )}
            {volgende && c.toegang !== false && (
              <Link to={`/academie/${c.slug}/${volgende.nr}`} style={knop}>
                {klaar === c.hoofdstukken.length ? 'Opnieuw bekijken' : begonnen ? 'Ga verder →' : 'Start de cursus →'}
              </Link>
            )}
          </div>
        </div>

        {c.hoofdstukken.map((h) => {
          const st = status(h.nr);
          const label = st?.klaar ? '✓ Afgerond' : st ? `Bezig · stap ${(st.stap ?? 0) + 1} van ${h.stappen || '?'}` : `${h.stappen} stappen`;
          return (
            <Link key={h.nr} to={`/academie/${c.slug}/${h.nr}`} style={{
              display: 'flex', gap: 14, alignItems: 'center', textDecoration: 'none', color: G.goudBleek, background: G.bg2,
              border: `1px solid ${st?.klaar ? `${G.groen}88` : G.rand}`, borderRadius: 12, padding: '0.6rem', marginBottom: 8,
            }}>
              {h.afbeelding
                ? <img src={h.afbeelding} alt="" loading="lazy" style={{ width: 96, height: 54, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                : <div style={{ width: 96, height: 54, borderRadius: 8, background: G.bg3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G.goud, fontFamily: "'Cormorant Garamond', serif" }}>{h.nr}</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: G.tekst3 }}>Hoofdstuk {h.nr}</div>
                <div style={{ fontSize: 17, lineHeight: 1.3 }}>{h.titel}</div>
              </div>
              <div style={{ fontSize: 13, color: st?.klaar ? '#9bd49b' : G.tekst3, whiteSpace: 'nowrap', paddingRight: 6 }}>{label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// ═════════════ Les: stappen, blokken en meerkeuze ═════════════
const Quiz: React.FC<{ vragen: Vraag[]; onKlaar: (goed: number, antwoorden: { vraag: Vraag; goed: boolean }[]) => void }> = ({ vragen, onKlaar }) => {
  const [gekozen, setGekozen] = useState<Record<number, string>>({});
  const gemeld = useRef(false);
  const aantalGoed = vragen.filter((v) => gekozen[v.nr] === v.goed).length;
  const alles = vragen.every((v) => gekozen[v.nr]);
  useEffect(() => {
    if (alles && !gemeld.current) { gemeld.current = true; onKlaar(aantalGoed, vragen.map((v) => ({ vraag: v, goed: gekozen[v.nr] === v.goed }))); }
  }, [alles]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      {vragen.map((v) => {
        const keuze = gekozen[v.nr];
        return (
          <div key={v.nr} style={{ background: G.bg3, borderRadius: 12, padding: '0.9rem 1rem', margin: '0 0 0.9rem' }}>
            <div style={{ fontSize: 17, marginBottom: 8 }}><strong>{v.nr}.</strong> {v.vraag}</div>
            {v.opties.map((o) => {
              const isGoed = o.letter === v.goed;
              const isGekozen = keuze === o.letter;
              const kleur = !keuze ? G.rand : isGoed ? G.groen : isGekozen ? G.rood : G.rand;
              return (
                <button key={o.letter} disabled={!!keuze} onClick={() => setGekozen((g) => ({ ...g, [v.nr]: o.letter }))} style={{
                  display: 'flex', gap: 10, width: '100%', textAlign: 'left', alignItems: 'flex-start', margin: '0 0 6px', padding: '0.6rem 0.8rem',
                  borderRadius: 10, border: `1.5px solid ${kleur}`, background: keuze && (isGoed || isGekozen) ? `${kleur}22` : 'transparent',
                  color: G.goudBleek, cursor: keuze ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 16, lineHeight: 1.45,
                }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", color: keuze ? kleur : G.goud, minWidth: 18 }}>{keuze && isGoed ? '✓' : keuze && isGekozen ? '✗' : o.letter}</span>
                  <span>{o.tekst}</span>
                </button>
              );
            })}
            {keuze && (
              <div style={{ fontSize: 15, marginTop: 6, color: keuze === v.goed ? '#9bd49b' : '#f0a596', lineHeight: 1.5 }}>
                <strong>{keuze === v.goed ? 'Goed!' : `Helaas — het goede antwoord is ${v.goed}.`}</strong> <span style={{ color: G.tekst2 }}>{v.uitleg}</span>
              </div>
            )}
          </div>
        );
      })}
      {alles && (
        <div style={{ textAlign: 'center', fontSize: 18, color: G.goud, margin: '0.6rem 0' }}>
          Je had {aantalGoed} van de {vragen.length} goed. {aantalGoed === vragen.length ? 'Prachtig! 🌟' : aantalGoed >= vragen.length / 2 ? 'Goed bezig!' : 'Lees de uitleg nog eens rustig na.'}
        </div>
      )}
    </div>
  );
};

export const AcademieLes: React.FC = () => {
  const { slug = '', nr = '1' } = useParams();
  const navigate = useNavigate();
  const [les, setLes] = useState<{ cursus: { slug: string; titel: string; nr: number; live: number }; nr: number; titel: string; inhoud: string; hoofdstukken: { nr: number; titel: string }[] } | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [stap, setStap] = useState(0);
  const [afgerond, setAfgerond] = useState(false);
  const voortgang = useOnderdeelVoortgang<LesVoortgang>(`academie-${slug}`);
  const { lid } = useAccount();
  const item = `h${nr}`;
  const data = voortgang.items.get(item) || {};
  const dataRef = useRef<LesVoortgang>(data);
  dataRef.current = data;
  const bovenkant = useRef<HTMLDivElement>(null);
  const hersteld = useRef<string | null>(null);

  useEffect(() => {
    setLes(null); setFout(null); setAfgerond(false); setStap(0); hersteld.current = null;
    haal<NonNullable<typeof les>>(`/api/academie/${slug}/${nr}`).then(setLes).catch((e) => setFout(e.message));
  }, [slug, nr]);

  // Ga verder waar je gebleven was (één keer per hoofdstuk, zodra de voortgang geladen is)
  useEffect(() => {
    if (voortgang.laden || !les || hersteld.current === item) return;
    hersteld.current = item;
    const d = voortgang.items.get(item);
    if (d?.stap && !d.klaar) setStap(d.stap);
  }, [voortgang.laden, les, item]); // eslint-disable-line react-hooks/exhaustive-deps

  const { afbeelding, stappen } = useMemo(() => (les ? maakStappen(les.inhoud, les.titel) : { afbeelding: null, stappen: [] as Stap[] }), [les]);
  const huidig = stappen[stap];
  const bewaar = useCallback((wijziging: Partial<LesVoortgang>) => {
    voortgang.zet(item, { ...dataRef.current, ...wijziging, datum: new Date().toISOString() });
  }, [voortgang, item]);

  const naarStap = useCallback((n: number) => {
    const doel = Math.max(0, Math.min(stappen.length - 1, n));
    setStap(doel);
    if (!dataRef.current.klaar) bewaar({ stap: doel });
    bovenkant.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [stappen.length, bewaar]);

  const rondAf = useCallback(() => {
    bewaar({ klaar: true, stap: 0 });
    setAfgerond(true);
    bovenkant.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [bewaar]);

  // Pijltjestoetsen (niet tijdens typen)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA' || afgerond) return;
      if (e.key === 'ArrowRight' && stap < stappen.length - 1) naarStap(stap + 1);
      if (e.key === 'ArrowLeft' && stap > 0) naarStap(stap - 1);
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [stap, stappen.length, naarStap, afgerond]);

  // Interactieve blokken: Oefening (afvinken) en Denk na (eigen antwoord, bewaard)
  const blokWeergave: BlokWeergave = (soort, inhoud, extra, sleutel) => {
    const id = `${stap}-${sleutel}`;
    const { icoon, kleur } = BLOK_STIJL[soort];
    const kader = (kinderen: React.ReactNode) => (
      <div style={{ border: `1px solid ${kleur}55`, borderLeft: `4px solid ${kleur}`, background: `${kleur}14`, borderRadius: 12, padding: '0.9rem 1rem', margin: '1rem 0' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.06em', color: kleur, marginBottom: 6 }}>
          {icoon} {soort.toUpperCase()}{extra ? <span style={{ textTransform: 'none', opacity: 0.8 }}> {extra}</span> : null}
        </div>
        {inhoud}
        {kinderen}
      </div>
    );
    if (soort === 'Oefening') {
      const gedaan = !!dataRef.current.oefeningen?.[id];
      return kader(
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, cursor: 'pointer', fontSize: 16 }}>
          <input type="checkbox" checked={gedaan} onChange={(e) => bewaar({ oefeningen: { ...(dataRef.current.oefeningen || {}), [id]: e.target.checked } })} style={{ width: 20, height: 20, accentColor: G.groen }} />
          {gedaan ? '✓ Gedaan' : 'Ik heb deze oefening gedaan'}
        </label>,
      );
    }
    if (soort === 'Denk na') {
      return kader(
        <textarea defaultValue={dataRef.current.antwoorden?.[id] || ''} placeholder="Schrijf hier je antwoord. Alleen jij kunt dit zien."
          onBlur={(e) => { if (e.target.value !== (dataRef.current.antwoorden?.[id] || '')) bewaar({ antwoorden: { ...(dataRef.current.antwoorden || {}), [id]: e.target.value } }); }}
          style={{ width: '100%', minHeight: 90, marginTop: 8, padding: '0.6rem 0.8rem', borderRadius: 10, border: `1px solid ${G.rand}`, background: G.bg, color: G.goudBleek, fontFamily: 'inherit', fontSize: 16, lineHeight: 1.5, resize: 'vertical' }} />,
      );
    }
    return null;
  };

  if (fout) return <div style={pagina}><p style={{ padding: '2rem', textAlign: 'center' }}>{fout} — <Link to="/academie" style={{ color: G.goud }}>naar de Academie</Link></p></div>;
  if (!les || !huidig) return <div style={pagina}><p style={{ padding: '2rem', textAlign: 'center', color: G.tekst3 }}>Laden…</p></div>;

  const index = les.hoofdstukken.findIndex((h) => h.nr === les.nr);
  const volgendHoofdstuk = les.hoofdstukken[index + 1];
  const { rest, vragen } = haalVragen(huidig.md);
  const laatste = stap === stappen.length - 1;

  return (
    <div style={pagina}>
      <VoorbeeldMelding live={les.cursus.live} />
      <div ref={bovenkant} style={{ maxWidth: 760, margin: '0 auto', padding: '1.2rem 1rem 3rem', scrollMarginTop: 70 }}>
        {/* Kop */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', flexWrap: 'wrap', fontSize: 14, marginBottom: 8 }}>
          <Link to={`/academie/${slug}`} style={{ color: G.goud }}>← {les.cursus.titel}</Link>
          <span style={{ color: G.tekst3 }}>
            {lid?.rol === 'admin' && <Link to={`/academie/${slug}/print?hoofdstuk=${les.nr}`} style={{ color: G.goud, marginRight: 12 }} title="Dit hoofdstuk afdrukken of opslaan als PDF">🖨 Print</Link>}
            Hoofdstuk {les.nr} van {les.hoofdstukken.length}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 23, color: G.goud, margin: '0 0 0.8rem', letterSpacing: '0.03em', lineHeight: 1.3 }}>{les.titel}</h1>
        {lid?.rol === 'admin' && <TrainersVideoBijHoofdstuk slug={slug} nr={les.nr} />}

        {afgerond ? (
          <div style={{ background: G.bg2, border: `1px solid ${G.groen}88`, borderRadius: 16, padding: '2rem 1.4rem', textAlign: 'center' }}>
            <div style={{ fontSize: 46 }}>🌟</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: G.goud, fontSize: 22, margin: '0.4rem 0' }}>Hoofdstuk afgerond!</h2>
            {data.score && <p style={{ fontSize: 17, color: G.tekst2, margin: '0 0 1rem' }}>Je toets: {data.score.goed} van {data.score.totaal} goed.</p>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              {volgendHoofdstuk
                ? <button style={knop} onClick={() => navigate(`/academie/${slug}/${volgendHoofdstuk.nr}`)}>Volgend hoofdstuk: {volgendHoofdstuk.titel} →</button>
                : <span style={{ fontSize: 17, color: '#9bd49b' }}>Je hebt de hele cursus doorlopen. Gefeliciteerd!</span>}
              <Link to={`/academie/${slug}`} style={knopLicht}>Naar het cursusoverzicht</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Voortgang in stappen (klikbaar) */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 6 }} aria-label={`Stap ${stap + 1} van ${stappen.length}`}>
              {stappen.map((s, i) => (
                <button key={i} onClick={() => naarStap(i)} title={s.titel} style={{
                  flex: 1, height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
                  background: i < stap ? G.goud : i === stap ? G.goudLicht : G.bg3,
                }} />
              ))}
            </div>
            <div style={{ fontSize: 13, color: G.tekst3, marginBottom: '1rem' }}>Stap {stap + 1} van {stappen.length}</div>

            <div style={{ background: G.bg2, border: `1px solid ${G.rand}`, borderRadius: 16, padding: '1.3rem 1.4rem', minHeight: 260 }}>
              {stap === 0 && afbeelding && <img src={afbeelding} alt="" style={{ width: '100%', borderRadius: 10, display: 'block', margin: '0 0 1rem' }} />}
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: G.goud, margin: '0 0 0.8rem' }}>{huidig.titel}</h2>
              {rest && <Markdown key={`${nr}-${stap}`} tekst={rest} blokWeergave={blokWeergave} />}
              {vragen.length > 0 && (
                <Quiz key={`q-${nr}-${stap}`} vragen={vragen} onKlaar={(goed, antwoorden) => {
                  bewaar({ score: { goed, totaal: vragen.length } });
                  slaRondeOp(`academie-${slug}`, goed, vragen.length, antwoorden.map((a) => ({ sleutel: `vraag:h${nr}-${a.vraag.nr}`, label: a.vraag.vraag, goed: a.goed })));
                }} />
              )}
            </div>

            {/* Navigatie */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: '1.2rem' }}>
              <button style={{ ...knopLicht, visibility: stap > 0 ? 'visible' : 'hidden' }} onClick={() => naarStap(stap - 1)}>← Vorige</button>
              <span style={{ fontSize: 13, color: G.tekst3 }}>{stap + 1} / {stappen.length}</span>
              {laatste
                ? <button style={{ ...knop, background: G.groen }} onClick={rondAf}>Hoofdstuk afronden ✓</button>
                : <button style={knop} onClick={() => naarStap(stap + 1)}>Volgende →</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
