import React, { useEffect, useState } from 'react';
import { laadCombinaties, Combinatie } from '../../data/lenormand/combinaties';
import { Link } from 'react-router-dom';
import { maakRonde, QuizVraag, QuizOnderwerp, Niveau, niveauVan } from '../../data/lenormand/quizGenerator';
import { lenormandKaarten } from '../../data/lenormand/kaarten';
import { haalVoortgang, haalQuizStats, slaRondeOp, maakGewicht, QuizAntwoord, QuizResultaat, QuizStat } from '../../lib/voortgang';

const G = {
  goud: '#F1CB78', goudBleek: '#2D2040', goudDonker: '#E0B04A',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040',
  tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};

const LETTERS = ['A', 'B', 'C', 'D'];

const ONDERWERPEN: { id: QuizOnderwerp; label: string; uitleg: string }[] = [
  { id: 'mix', label: 'Alles door elkaar', uitleg: 'Kaarten, combinaties en basiskennis' },
  { id: 'kaarten', label: 'De 36 kaarten', uitleg: 'Nummers, sleutelwoorden, betekenissen' },
  { id: 'combinaties', label: 'Combinaties', uitleg: 'Wat betekenen twee kaarten samen?' },
];
const AANTALLEN = [10, 20, 30];

const NIVEAUS: { id: Niveau | 'alles'; label: string; uitleg: string }[] = [
  { id: 'beginner', label: 'Beginner', uitleg: 'Nummers, sleutelwoorden en basiskennis' },
  { id: 'gevorderd', label: 'Gevorderd', uitleg: 'Omschrijvingen, levensgebieden en combinaties' },
  { id: 'pro', label: 'Pro', uitleg: 'Combinaties in liefde, werk en advies' },
  { id: 'alles', label: 'Alle niveaus', uitleg: 'Alles door elkaar' },
];

const kaartNaam = (id: number) => lenormandKaarten.find((k) => k.id === id)?.naam ?? `Kaart ${id}`;

/** Voortgangssleutels voor één beantwoorde vraag: per kaart, per vraagsoort en eventueel per combinatie/basisvraag. */
function antwoordSleutels(v: QuizVraag, goed: boolean): QuizAntwoord[] {
  const lijst: QuizAntwoord[] = v.kaarten.map((id) => ({ sleutel: `kaart:${id}`, label: kaartNaam(id), goed }));
  lijst.push({ sleutel: `soort:${v.soort}`, label: v.soort, goed });
  lijst.push({ sleutel: `niveau:${niveauVan(v.vraagId)}`, label: niveauVan(v.vraagId), goed });
  lijst.push({ sleutel: v.vraagId, label: v.vraagLabel, goed });   // elke afzonderlijke vraag
  if (v.soort === 'combinatie') lijst.push({ sleutel: `combi:${v.kaarten.join('-')}`, label: v.kaarten.map(kaartNaam).join(' + '), goed });
  return lijst;
}

const knopStijl: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: '0.08em', padding: '11px 28px', borderRadius: 24,
  border: `0.5px solid ${G.goud}`, background: G.goudBleek, color: G.goudDonker, cursor: 'pointer',
};

function boodschap(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1)   return 'Perfecte score — jij kent de Lenormand als je broekzak. Uitstekend!';
  if (pct >= 0.8)  return 'Indrukwekkend! Je Lenormand-kennis is sterk. Blijf oefenen voor perfectie.';
  if (pct >= 0.6)  return 'Goed bezig! Een solide basis. Herhaal de kaarten die je nog verrassen.';
  if (pct >= 0.4)  return 'Een redelijk begin. De Lenormand vraagt tijd — blijf oefenen met de flashcards.';
  return 'Geen zorgen — herhaling is de sleutel. Ga terug naar de bibliotheek en flashcards.';
}

const Hero: React.FC<{ titel: string; ondertitel?: string }> = ({ titel, ondertitel }) => (
  <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 1rem 2rem' }}>
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Mystieke Lenormand</p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: ondertitel ? '0.6rem' : 0 }}>{titel}</h1>
      {ondertitel && <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2 }}>{ondertitel}</p>}
    </div>
  </div>
);

export const LenormandQuizPage: React.FC = () => {
  const [combinaties, setCombinaties] = useState<Combinatie[] | null>(null);
  const [onderwerp, setOnderwerp] = useState<QuizOnderwerp>('mix');
  const [aantal, setAantal] = useState(20);
  const [niveau, setNiveau] = useState<Niveau | 'alles'>('beginner');
  const [vragen, setVragen] = useState<QuizVraag[] | null>(null);  // null = keuzescherm
  const [vraagIndex, setVraagIndex] = useState(0);
  const [gekozen, setGekozen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [klaar, setKlaar] = useState(false);
  const [resultaat, setResultaat] = useState<QuizResultaat | null>(null);
  const [nieuwRecord, setNieuwRecord] = useState(false);
  const [stats, setStats] = useState<QuizStat[]>([]);
  const [antwoorden, setAntwoorden] = useState<{ vraag: QuizVraag; goed: boolean }[]>([]);

  useEffect(() => {
    laadCombinaties().then(setCombinaties).catch(() => setCombinaties([]));
    haalVoortgang<QuizResultaat>('lenormand-quiz', 'resultaat').then((r) => {
      setResultaat(r);
      // Verder op het niveau van de vorige ronde
      const vorig = r?.laatste?.niveau as Niveau | 'alles' | undefined;
      if (vorig && NIVEAUS.some((n) => n.id === vorig)) setNiveau(vorig);
    });
    haalQuizStats('lenormand-quiz').then(setStats);
  }, []);

  const start = () => {
    // Kaarten die vaak fout gaan (of nog nooit gevraagd zijn) komen vaker voorbij
    const o = niveau === 'beginner' && onderwerp === 'combinaties' ? 'kaarten' : onderwerp;
    setVragen(maakRonde(aantal, o, combinaties, maakGewicht(stats), niveau === 'alles' ? undefined : niveau));
    setAntwoorden([]);
    setVraagIndex(0);
    setGekozen(null);
    setScore(0);
    setKlaar(false);
    setNieuwRecord(false);
  };

  const kiesOptie = (i: number) => {
    if (gekozen !== null || !vragen) return;
    setGekozen(i);
    const goed = i === vragen[vraagIndex].correct;
    if (goed) setScore((s) => s + 1);
    setAntwoorden((a) => [...a, { vraag: vragen[vraagIndex], goed }]);
  };

  const volgende = () => {
    if (!vragen) return;
    if (vraagIndex + 1 < vragen.length) {
      setVraagIndex((i) => i + 1);
      setGekozen(null);
      return;
    }
    // Ronde klaar: score en goed/fout per kaart bewaren bij het account
    setKlaar(true);
    const lijst = antwoorden.flatMap((a) => antwoordSleutels(a.vraag, a.goed));
    slaRondeOp('lenormand-quiz', score, vragen.length, lijst, { extra: { onderwerp, niveau } }).then((r) => {
      if (!r) return;
      setResultaat(r);
      setNieuwRecord(!!r.nieuw_record);
      haalQuizStats('lenormand-quiz').then(setStats);
    });
  };

  // ── Keuzescherm ──
  if (!vragen) {
    const combiLaden = onderwerp !== 'kaarten' && combinaties === null;
    return (
      <div className="pendel-pagina">
        <Hero titel="Quiz" ondertitel="Elke ronde nieuwe vragen — uit de 36 kaarten en 1260 combinaties." />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 1rem' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.1em', color: G.goud, marginBottom: '0.7rem' }}>NIVEAU</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem', marginBottom: '1.8rem' }}>
            {NIVEAUS.map((n) => (
              <button key={n.id} onClick={() => setNiveau(n.id)} style={{
                textAlign: 'left', padding: '0.8rem 0.9rem', borderRadius: 10, cursor: 'pointer',
                border: `0.5px solid ${niveau === n.id ? G.goud : G.rand2}`,
                background: niveau === n.id ? G.goudBleek : G.bg,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: niveau === n.id ? G.goudDonker : G.tekst }}>{n.label}</div>
                <div style={{ fontSize: 13, color: G.tekst3, marginTop: 3, lineHeight: 1.35 }}>{n.uitleg}</div>
              </button>
            ))}
          </div>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.1em', color: G.goud, marginBottom: '0.7rem' }}>WAAROVER?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem', marginBottom: '1.8rem' }}>
            {ONDERWERPEN.map((o) => {
              const uit = niveau === 'beginner' && o.id === 'combinaties';
              return (
              <button key={o.id} onClick={() => !uit && setOnderwerp(o.id)} disabled={uit} title={uit ? 'Combinaties komen vanaf Gevorderd' : undefined} style={{
                opacity: uit ? 0.45 : 1,
                textAlign: 'left', padding: '0.9rem 1rem', borderRadius: 10, cursor: uit ? 'not-allowed' : 'pointer',
                border: `0.5px solid ${onderwerp === o.id ? G.goud : G.rand2}`,
                background: onderwerp === o.id ? G.goudBleek : G.bg,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: onderwerp === o.id ? G.goudDonker : G.tekst }}>{o.label}</div>
                <div style={{ fontSize: 14, color: G.tekst3, marginTop: 3 }}>{uit ? 'Vanaf Gevorderd' : o.uitleg}</div>
              </button>
              );
            })}
          </div>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.1em', color: G.goud, marginBottom: '0.7rem' }}>HOEVEEL VRAGEN?</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {AANTALLEN.map((n) => (
              <button key={n} onClick={() => setAantal(n)} style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 14, padding: '9px 22px', borderRadius: 20, cursor: 'pointer',
                border: `0.5px solid ${aantal === n ? G.goud : G.rand2}`,
                background: aantal === n ? G.goudBleek : G.bg, color: aantal === n ? G.goudDonker : G.tekst2,
              }}>{n}</button>
            ))}
          </div>

          <button onClick={start} disabled={combiLaden} style={{ ...knopStijl, opacity: combiLaden ? 0.6 : 1 }}>
            {combiLaden ? 'Combinaties laden…' : 'Start de quiz →'}
          </button>

          {resultaat && resultaat.rondes > 0 && (
            <div style={{ marginTop: '2rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1rem 1.2rem', fontSize: 15, color: G.tekst2, lineHeight: 1.7 }}>
              Je hebt <strong>{resultaat.rondes}</strong> {resultaat.rondes === 1 ? 'ronde' : 'rondes'} gespeeld ·
              beste score <strong style={{ color: G.goudDonker }}>{resultaat.beste_pct}%</strong> ·
              in totaal {resultaat.totaal_goed} van {resultaat.totaal_vragen} goed
            </div>
          )}
        </div>
      </div>
    );
  }

  const totaal = vragen.length;

  // ── Resultaat ──
  if (klaar) {
    return (
      <div className="pendel-pagina">
        <Hero titel="Quiz resultaat" />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 400, color: G.goudDonker, marginBottom: '0.3rem' }}>
            {score}<span style={{ fontSize: 28, color: G.tekst3 }}>/{totaal}</span>
          </div>
          {nieuwRecord && (
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: G.goud, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✦ Nieuw record!</div>
          )}
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 2rem' }}>
            {boodschap(score, totaal)}
          </p>
          {resultaat && (
            <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1rem 1.5rem', display: 'inline-block', marginBottom: '2rem', fontSize: 14, color: G.tekst2 }}>
              Beste score: <strong style={{ color: G.goudDonker }}>{resultaat.beste_pct}%</strong> · {resultaat.rondes} rondes gespeeld
            </div>
          )}
          {(() => {
            const fout = [...new Set(antwoorden.filter((a) => !a.goed).flatMap((a) => a.vraag.kaarten))];
            return fout.length > 0 && (
              <div style={{ textAlign: 'left', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1rem 1.2rem', marginBottom: '1.5rem', fontSize: 15, color: G.tekst2, lineHeight: 1.6 }}>
                <strong style={{ color: G.tekst }}>Nog even oefenen:</strong> {fout.map(kaartNaam).join(', ')}.
                <div style={{ fontSize: 13, color: G.tekst3, marginTop: 4 }}>Deze kaarten komen in je volgende rondes vaker terug.</div>
              </div>
            );
          })()}
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={start} style={knopStijl}>Nieuwe ronde</button>
            <button onClick={() => setVragen(null)} style={{ ...knopStijl, background: 'transparent' }}>Ander onderwerp</button>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: 14 }}>
            <Link to="/voortgang" style={{ color: G.goudDonker }}>Bekijk je voortgang per kaart →</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Vraag ──
  const vraag = vragen[vraagIndex];
  const voortgangPct = (vraagIndex / totaal) * 100;

  return (
    <div className="pendel-pagina">
      <Hero titel="Quiz" ondertitel={`${NIVEAUS.find((n) => n.id === niveau)?.label} · ${ONDERWERPEN.find((o) => o.id === onderwerp)?.label}`} />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: G.tekst3, marginBottom: 4 }}>
            <span>Vraag {vraagIndex + 1} van {totaal}</span>
            <span>Score: {score}</span>
          </div>
          <div style={{ height: 2, background: G.bg3, borderRadius: 1 }}>
            <div style={{ height: '100%', background: G.goud, borderRadius: 1, width: `${voortgangPct}%`, transition: 'width 0.4s' }} />
          </div>
        </div>

        <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '1.6rem', marginBottom: '1.2rem' }}>
          <p style={{ fontFamily: "'DM Sans', serif", fontSize: 19, color: G.tekst, lineHeight: 1.65, margin: 0 }}>
            {vraag.vraag}
          </p>
          {vraag.citaat && (
            <p style={{ fontFamily: "'DM Sans', serif", fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.65, margin: '0.8rem 0 0', paddingLeft: '0.9rem', borderLeft: `2px solid ${G.goud}` }}>
              {vraag.citaat}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {vraag.opties.map((optie, i) => {
            const isCorrect = i === vraag.correct;
            const isGekozen = gekozen === i;
            let bg = G.bg;
            let borderColor = G.rand2;
            let textColor = G.tekst2;
            if (gekozen !== null) {
              if (isCorrect) { bg = 'rgba(95,167,119,0.15)'; borderColor = 'rgba(155,212,155,0.5)'; textColor = '#9BD49B'; }
              else if (isGekozen) { bg = 'rgba(200,96,79,0.15)'; borderColor = 'rgba(240,165,150,0.5)'; textColor = '#F0A596'; }
            }
            return (
              <button
                key={i}
                onClick={() => kiesOptie(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.9rem 1.1rem', borderRadius: 8,
                  border: `0.5px solid ${borderColor}`,
                  background: bg, color: textColor,
                  cursor: gekozen !== null ? 'default' : 'pointer',
                  transition: 'all 0.15s', textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0,
                  background: gekozen !== null && isCorrect ? '#22C55E' : gekozen !== null && isGekozen ? '#EF4444' : G.bg3,
                  color: gekozen !== null && (isCorrect || isGekozen) ? 'white' : G.tekst3,
                  border: `0.5px solid ${gekozen !== null && isCorrect ? '#22C55E' : gekozen !== null && isGekozen ? '#EF4444' : G.rand}`,
                }}>
                  {LETTERS[i]}
                </span>
                <span style={{ fontFamily: "'DM Sans', serif", fontSize: 16 }}>{optie}</span>
              </button>
            );
          })}
        </div>

        {gekozen !== null && (
          <>
            <div style={{
              padding: '1rem 1.2rem', borderRadius: 8, marginBottom: '1.2rem',
              background: gekozen === vraag.correct ? 'rgba(95,167,119,0.15)' : 'rgba(200,96,79,0.15)',
              border: `0.5px solid ${gekozen === vraag.correct ? 'rgba(155,212,155,0.5)' : 'rgba(240,165,150,0.5)'}`,
              fontSize: 14, color: gekozen === vraag.correct ? '#9BD49B' : '#F0A596',
              lineHeight: 1.7,
            }}>
              <strong>{gekozen === vraag.correct ? '✓ Goed!' : '✗ Helaas.'}</strong>
              <div style={{ marginTop: '0.4rem', color: G.tekst2 }}>{vraag.uitleg}</div>
            </div>
            <button onClick={volgende} style={knopStijl}>
              {vraagIndex + 1 >= totaal ? 'Resultaat bekijken →' : 'Volgende vraag →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LenormandQuizPage;
