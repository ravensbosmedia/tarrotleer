import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PendelAnimatie, PendelMode } from '../../components/pendel/PendelAnimatie';
import { PendelSchijf } from '../../components/pendel/PendelSchijf';
import { pendelSchijven } from '../../data/pendel/schijven';

const G = {
  goud: '#B8860B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#FDFAF4',
  bg2: '#F5F0E8',
  bg3: '#EDE6D6',
  tekst: '#2C2416',
  tekst2: '#6B5C3E',
  tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)',
  rand2: 'rgba(184,134,11,0.35)',
};

// ── Oefening 1: JA/NEE ─────────────────────────────────────────────────────

const JaNeeOefening: React.FC = () => {
  const [vraag, setVraag] = useState('');
  const [fase, setFase] = useState<'invoer' | 'animerend' | 'resultaat'>('invoer');
  const [resultaat, setResultaat] = useState<'JA' | 'NEE' | null>(null);
  const [beweging, setBewoeging] = useState<PendelMode>('still');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPendelen = () => {
    if (!vraag.trim()) return;
    const isJa = Math.random() > 0.5;
    setBewoeging(isJa ? 'right' : 'left');
    setFase('animerend');
    timerRef.current = setTimeout(() => {
      setResultaat(isJa ? 'JA' : 'NEE');
      setFase('resultaat');
    }, 4000);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFase('invoer');
    setResultaat(null);
    setVraag('');
    setBewoeging('still');
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div>
      <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.7, marginBottom: '1.5rem' }}>
        Stel een gesloten vraag — een vraag waarop het antwoord <em>JA</em> of <em>NEE</em> is.
        Houd de pendel stil boven je hand, concentreer je op je vraag en observeer de beweging.
      </p>

      {fase === 'invoer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            rows={3}
            placeholder="Typ hier je JA/NEE vraag… (bijv: Is het voor mij goed om vandaag te rusten?)"
            value={vraag}
            onChange={e => setVraag(e.target.value)}
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: 16, color: G.tekst,
              background: G.bg, border: `0.5px solid ${G.rand2}`,
              borderRadius: 6, padding: '0.9rem 1rem',
              resize: 'none', outline: 'none',
              lineHeight: 1.6,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={startPendelen}
              disabled={!vraag.trim()}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 13, letterSpacing: '0.08em',
                padding: '10px 28px', borderRadius: 24,
                border: `0.5px solid ${G.goud}`,
                background: G.goudBleek, color: G.goudDonker,
                cursor: vraag.trim() ? 'pointer' : 'not-allowed',
                opacity: vraag.trim() ? 1 : 0.45,
                transition: 'all 0.15s',
              }}
            >
              Pendel →
            </button>
            <span style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic' }}>
              Rechtsom = JA · Linksom = NEE (bij de meeste mensen)
            </span>
          </div>
        </div>
      )}

      {(fase === 'animerend' || fase === 'resultaat') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

          {/* Vraag label */}
          <div style={{
            background: G.bg2, border: `0.5px solid ${G.rand2}`,
            borderRadius: 6, padding: '0.8rem 1.2rem',
            fontSize: 16, fontStyle: 'italic', color: G.tekst2,
            alignSelf: 'stretch', textAlign: 'center',
          }}>
            "{vraag}"
          </div>

          {/* Pendel canvas groot */}
          <PendelAnimatie mode={beweging} width={280} height={280} showControls={false} />

          {fase === 'animerend' && (
            <p style={{
              fontSize: 15, fontStyle: 'italic', color: G.goud,
              letterSpacing: '0.04em',
            }}>
              De pendel beweegt — wacht rustig op het antwoord…
            </p>
          )}

          {fase === 'resultaat' && resultaat && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 44, fontWeight: 700,
                color: resultaat === 'JA' ? '#16A34A' : '#DC2626',
                padding: '0.6rem 2.5rem',
                background: resultaat === 'JA' ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${resultaat === 'JA' ? '#86EFAC' : '#FCA5A5'}`,
                borderRadius: 12,
                letterSpacing: '0.1em',
              }}>
                {resultaat}
              </div>

              <div style={{
                background: G.bg2, border: `0.5px solid ${G.rand}`,
                borderRadius: 6, padding: '1rem 1.2rem',
                fontSize: 14, color: G.tekst2, lineHeight: 1.7,
                alignSelf: 'stretch',
              }}>
                {resultaat === 'JA' ? (
                  <><strong style={{ color: G.tekst }}>↻ Rechtsom (met de klok mee)</strong> — Bij de meeste mensen is dit het JA-signaal. De pendel bevestigt een positieve resonantie met je vraag.</>
                ) : (
                  <><strong style={{ color: G.tekst }}>↺ Linksom (tegen de klok in)</strong> — Bij de meeste mensen is dit het NEE-signaal. De pendel geeft aan dat er geen positieve resonantie is.</>
                )}
                <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: `0.5px solid ${G.rand}`, color: G.goud, fontSize: 13 }}>
                  Kalibreer altijd zelf welke beweging JA of NEE voor jou betekent.
                </div>
              </div>

              <button
                onClick={reset}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 12, letterSpacing: '0.08em',
                  padding: '8px 20px', borderRadius: 20,
                  border: `0.5px solid ${G.rand2}`,
                  background: 'transparent', color: G.tekst3,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                Nieuwe vraag
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Oefening 2: Schijf Oefening ────────────────────────────────────────────

const SchijfOefening: React.FC = () => {
  const [geselecteerdeSchijfId, setGeselecteerdeSchijfId] = useState(pendelSchijven[0].id);
  const [gemarkeerdeIndex, setGemarkeerdeIndex] = useState<number | null>(null);
  const [isAnimerend, setIsAnimerend] = useState(false);
  const [pendelModus, setPendelModus] = useState<PendelMode>('still');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const huidigeSchijf = pendelSchijven.find(s => s.id === geselecteerdeSchijfId) ?? pendelSchijven[0];

  const pendelOpSchijf = () => {
    if (isAnimerend) return;
    setGemarkeerdeIndex(null);
    setIsAnimerend(true);
    setPendelModus('lr');
    timerRef.current = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * huidigeSchijf.segmenten.length);
      setGemarkeerdeIndex(randomIndex);
      setIsAnimerend(false);
      setPendelModus('still');
    }, 3000);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const gekozenSegment = gemarkeerdeIndex !== null ? huidigeSchijf.segmenten[gemarkeerdeIndex] : null;

  return (
    <div>
      <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.7, marginBottom: '1.5rem' }}>
        Kies een pendel schijf hieronder, formuleer je vraag en klik op "Pendel". De pendel beweegt
        en wijst naar een segment dat je antwoord geeft.
      </p>

      {/* Schijf selectie */}
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
          Kies een schijf
        </label>
        <select
          value={geselecteerdeSchijfId}
          onChange={e => { setGeselecteerdeSchijfId(e.target.value); setGemarkeerdeIndex(null); setPendelModus('still'); }}
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: 15, color: G.tekst,
            background: G.bg, border: `0.5px solid ${G.rand2}`,
            borderRadius: 6, padding: '0.6rem 0.8rem',
            outline: 'none', width: '100%', maxWidth: 320,
          }}
        >
          {pendelSchijven.map(s => (
            <option key={s.id} value={s.id}>{s.naam}</option>
          ))}
        </select>
      </div>

      {/* Schijf + pendel side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PendelSchijf
            schijf={huidigeSchijf}
            grootte={240}
            toonLabels={true}
            gemarkeerdeIndex={gemarkeerdeIndex ?? undefined}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <PendelAnimatie mode={pendelModus} width={200} height={200} showControls={false} />
          <button
            onClick={pendelOpSchijf}
            disabled={isAnimerend}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 13, letterSpacing: '0.08em',
              padding: '10px 24px', borderRadius: 24,
              border: `0.5px solid ${G.goud}`,
              background: isAnimerend ? G.bg3 : G.goudBleek,
              color: isAnimerend ? G.tekst3 : G.goudDonker,
              cursor: isAnimerend ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {isAnimerend ? 'Pendelen…' : 'Pendel op schijf →'}
          </button>
        </div>
      </div>

      {/* Resultaat */}
      {gekozenSegment && (
        <div style={{
          background: G.goudBleek, border: `0.5px solid ${G.rand2}`,
          borderRadius: 8, padding: '1.2rem 1.4rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          {gekozenSegment.kleur && (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: gekozenSegment.kleur, flexShrink: 0, border: `1px solid ${G.rand2}` }} />
          )}
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.tekst, marginBottom: '0.2rem' }}>
              {gekozenSegment.label}
            </div>
            {gekozenSegment.beschrijving && (
              <div style={{ fontSize: 14, color: G.tekst2, fontStyle: 'italic' }}>{gekozenSegment.beschrijving}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Oefening 3: Lichaamsharmonie ───────────────────────────────────────────

interface Stap {
  titel: string;
  instructie: string;
  duur: number;
  pendel?: PendelMode;
}

const stappen: Stap[] = [
  {
    titel: 'Stap 1 — Positie innemen',
    instructie: 'Ga rechtop zitten of staan. Ontspan je schouders, laat je armen los hangen. Adem een paar keer diep in en uit.',
    duur: 30,
    pendel: 'still',
  },
  {
    titel: 'Stap 2 — Ademhaling',
    instructie: 'Adem drie keer diep in door de neus (4 tel), houd vast (2 tel), adem uit door de mond (6 tel). Voel hoe je lichaam tot rust komt.',
    duur: 45,
    pendel: 'still',
  },
  {
    titel: 'Stap 3 — Lichaamssignaal',
    instructie: 'Voel in welke richting je lichaam wil neigen — vooruit, achteruit, links of rechts. Laat het toe zonder weerstand. Forceer niets.',
    duur: 60,
    pendel: 'fb',
  },
  {
    titel: 'Stap 4 — Noteren',
    instructie: 'Noteer de richting die je voelde. Dit is je persoonlijke lichaamssignaal. Welke richting was het?',
    duur: 30,
    pendel: 'still',
  },
  {
    titel: 'Stap 5 — Vergelijken met pendel',
    instructie: 'Pak je pendel. Herhaal de vraag. Vergelijk de pendelbeweging met je lichaamssignaal. Zijn ze consistent?',
    duur: 60,
    pendel: 'right',
  },
];

const LichaamsharmonieOefening: React.FC = () => {
  const [huidigeStap, setHuidigeStap] = useState(0);
  const [restTijd, setRestTijd] = useState(stappen[0].duur);
  const [actief, setActief] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setRestTijd(prev => {
        if (prev <= 1) {
          setHuidigeStap(prevStap => {
            const volgende = prevStap + 1;
            if (volgende >= stappen.length) {
              setActief(false);
              setKlaar(true);
              stopTimer();
              return prevStap;
            }
            setRestTijd(stappen[volgende].duur);
            return volgende;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (actief) startTimer();
    else stopTimer();
    return stopTimer;
  }, [actief, startTimer, stopTimer]);

  const reset = () => {
    stopTimer();
    setHuidigeStap(0);
    setRestTijd(stappen[0].duur);
    setActief(false);
    setKlaar(false);
  };

  const totaalDuur = stappen.reduce((acc, s) => acc + s.duur, 0);
  const verlopenTijd = stappen.slice(0, huidigeStap).reduce((acc, s) => acc + s.duur, 0) + (stappen[huidigeStap]?.duur - restTijd);
  const voortgangPct = Math.min(100, (verlopenTijd / totaalDuur) * 100);
  const pendelModus: PendelMode = actief ? (stappen[huidigeStap]?.pendel ?? 'still') : 'still';

  if (klaar) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: '#16A34A', marginBottom: '0.5rem' }}>✓</div>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 400, color: G.tekst, marginBottom: '0.5rem' }}>Oefening voltooid</h3>
        <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
          Goed gedaan. Noteer je bevindingen en vergelijk je lichaamssignalen met je pendelresultaten over meerdere sessies om patronen te ontdekken.
        </p>
        <button
          onClick={reset}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 12, letterSpacing: '0.08em',
            padding: '9px 22px', borderRadius: 20,
            border: `0.5px solid ${G.goud}`,
            background: G.goudBleek, color: G.goudDonker,
            cursor: 'pointer',
          }}
        >
          Opnieuw starten
        </button>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.7, marginBottom: '1.5rem' }}>
        Een begeleide oefening in 5 stappen om je lichaams- en pendelsignalen te leren herkennen en vergelijken.
      </p>

      {/* Voortgangsbalk */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: G.tekst3, marginBottom: 4 }}>
          <span>Stap {huidigeStap + 1} van {stappen.length}</span>
          <span>{Math.floor(verlopenTijd / 60)}:{String(verlopenTijd % 60).padStart(2, '0')} / {Math.floor(totaalDuur / 60)}:{String(totaalDuur % 60).padStart(2, '0')}</span>
        </div>
        <div style={{ height: 3, background: G.bg3, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: G.goud, borderRadius: 2, width: `${voortgangPct}%`, transition: 'width 1s linear' }} />
        </div>
      </div>

      {/* Huidige stap + pendel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.4rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.goud, marginBottom: '0.5rem' }}>
            {stappen[huidigeStap].titel}
          </div>
          <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.8, margin: 0 }}>
            {stappen[huidigeStap].instructie}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 28, fontWeight: 700,
              color: restTijd <= 10 && actief ? '#DC2626' : G.goudDonker,
            }}>
              {restTijd}
            </span>
            <span style={{ fontSize: 12, color: G.tekst3 }}>seconden</span>
          </div>
        </div>
        <PendelAnimatie mode={pendelModus} width={200} height={200} showControls={false} />
      </div>

      {/* Stappen overzicht */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.2rem' }}>
        {stappen.map((stap, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            padding: '0.5rem 0.7rem', borderRadius: 5, fontSize: 13,
            background: i === huidigeStap ? G.goudBleek : 'transparent',
            color: i < huidigeStap ? G.tekst3 : i === huidigeStap ? G.tekst : G.tekst3,
            textDecoration: i < huidigeStap ? 'line-through' : 'none',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 'bold',
              background: i < huidigeStap ? '#D1FAE5' : i === huidigeStap ? G.goud : G.bg3,
              color: i < huidigeStap ? '#16A34A' : i === huidigeStap ? 'white' : G.tekst3,
            }}>
              {i < huidigeStap ? '✓' : i + 1}
            </span>
            {stap.titel}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: G.tekst3 }}>{stap.duur}s</span>
          </div>
        ))}
      </div>

      {/* Besturingsknoppen */}
      <div style={{ display: 'flex', gap: '0.7rem' }}>
        {!actief ? (
          <button
            onClick={() => setActief(true)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12, letterSpacing: '0.08em',
              padding: '9px 22px', borderRadius: 20,
              border: `0.5px solid ${G.goud}`,
              background: G.goudBleek, color: G.goudDonker,
              cursor: 'pointer',
            }}
          >
            {verlopenTijd === 0 ? 'Starten' : 'Hervatten'}
          </button>
        ) : (
          <button
            onClick={() => setActief(false)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12, letterSpacing: '0.08em',
              padding: '9px 22px', borderRadius: 20,
              border: `0.5px solid ${G.rand2}`,
              background: G.bg3, color: G.tekst2,
              cursor: 'pointer',
            }}
          >
            Pauzeren
          </button>
        )}
        <button
          onClick={reset}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 12, letterSpacing: '0.08em',
            padding: '9px 20px', borderRadius: 20,
            border: `0.5px solid ${G.rand}`,
            background: 'transparent', color: G.tekst3,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// ── Hoofd pagina ────────────────────────────────────────────────────────────

type TabId = 'janee' | 'schijf' | 'lichaam';

const tabs: { id: TabId; label: string; sub: string }[] = [
  { id: 'janee',  label: 'JA / NEE',        sub: 'Stel een vraag en pendel' },
  { id: 'schijf', label: 'Schijf',           sub: 'Pendel op een schijf' },
  { id: 'lichaam',label: 'Lichaamsharmonie', sub: 'Begeleide oefening' },
];

export const OefeningenPage: React.FC = () => {
  const [actieveTab, setActieveTab] = useState<TabId>('janee');

  return (
    <div className="pendel-pagina">

      {/* ── Hero ── */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.7rem' }}>
            Praktisch oefenen
          </p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 400, color: G.tekst, marginBottom: '0.7rem' }}>
            Pendel Oefeningen
          </h1>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 560 }}>
            Drie interactieve oefeningen om je pendelvaardigheid te ontwikkelen — van een eenvoudige JA/NEE sessie tot het werken met schijven en lichaamsresonantie.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActieveTab(tab.id)}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 12, letterSpacing: '0.06em',
                padding: '10px 20px', borderRadius: 24,
                border: `0.5px solid ${actieveTab === tab.id ? G.goud : G.rand2}`,
                background: actieveTab === tab.id ? G.goudBleek : 'transparent',
                color: actieveTab === tab.id ? G.goudDonker : G.tekst3,
                cursor: 'pointer', transition: 'all 0.18s',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', letterSpacing: 0 }}>{tab.sub}</span>
            </button>
          ))}
        </div>

        {/* ── Oefening inhoud ── */}
        <div style={{
          background: G.bg, border: `0.5px solid ${G.rand2}`,
          borderRadius: 10, padding: '2rem',
        }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 400, color: G.tekst, marginBottom: '0.3rem' }}>
            {tabs.find(t => t.id === actieveTab)?.label}
          </h2>
          <div style={{ width: 40, height: 1, background: G.goud, opacity: 0.5, marginBottom: '1.5rem' }} />

          {actieveTab === 'janee'  && <JaNeeOefening />}
          {actieveTab === 'schijf' && <SchijfOefening />}
          {actieveTab === 'lichaam'&& <LichaamsharmonieOefening />}
        </div>

        {/* ── Tip ── */}
        <div style={{
          marginTop: '2rem',
          background: G.bg2, border: `0.5px solid ${G.rand}`,
          borderRadius: 8, padding: '1rem 1.4rem',
          fontSize: 13, color: G.tekst2, lineHeight: 1.7,
        }}>
          <strong style={{ fontFamily: "'Cinzel', serif", color: G.goud }}>Tip:</strong>{' '}
          Kalibreer je pendel vóór elke sessie met de Controleschijf. Houd je hoofd vrij van wensdenken en accepteer het antwoord dat je krijgt — ook als het je verrast.
        </div>
      </div>
    </div>
  );
};

export default OefeningenPage;
