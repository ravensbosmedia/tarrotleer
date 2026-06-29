import React, { useState, useMemo } from 'react';
import { calculateNumbers } from '../../utils/numerologieCalculations';
import { numberDescriptions } from '../../data/numerologie/getalBeschrijvingen';
import { numberMeanings } from '../../data/numerologie/getalBetekenissen';
import { letterMeanings } from '../../data/numerologie/letterBetekenissen';
import { nameNumberMeanings } from '../../data/numerologie/naamGetallen';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', goudDonker: '#7A5C00',
  bg: '#FDFAF4', bg2: '#F5F0E8', bg3: '#EDE6D6',
  tekst: '#2C2416', tekst2: '#6B5C3E', tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)', rand2: 'rgba(184,134,11,0.35)',
};

const VOWELS = new Set(['A','E','I','O','U']);

function letterWaarde(ch: string): number { return ch.toUpperCase().charCodeAt(0) - 64; }

function reduceer(n: number): number {
  if (n === 11 || n === 22) return n;
  while (n > 9) {
    n = Array.from(String(n)).reduce((s, d) => s + parseInt(d), 0);
    if (n === 11 || n === 22) return n;
  }
  return n;
}

function naamAnalyse(naam: string) {
  const letters = Array.from(naam.toUpperCase()).filter(c => /[A-Z]/.test(c));
  const totaal = letters.reduce((s, c) => s + letterWaarde(c), 0);
  const naamGetal = reduceer(totaal);
  const klinkers = letters.filter(c => VOWELS.has(c));
  const medeklinkers = letters.filter(c => !VOWELS.has(c));
  const klinkerSom = klinkers.reduce((s, c) => s + letterWaarde(c), 0);
  const medeklinkerSom = medeklinkers.reduce((s, c) => s + letterWaarde(c), 0);
  const zielenGetal = reduceer(klinkerSom);
  const persoonlijkheidsGetal = reduceer(medeklinkerSom);
  const woorden = naam.trim().split(/\s+/).map(w => {
    const wLetters = Array.from(w.toUpperCase()).filter(c => /[A-Z]/.test(c));
    const wSom = wLetters.reduce((s, c) => s + letterWaarde(c), 0);
    return { woord: w, letters: wLetters, som: wSom, getal: reduceer(wSom) };
  });
  const unicLetters = [...new Set(letters)].sort();
  return { letters, totaal, naamGetal, zielenGetal, persoonlijkheidsGetal, woorden, unicLetters, klinkerSom, medeklinkerSom };
}

function persoonlijkJaar(geboortedatum: string): { jaar: number; getal: number; stappen: string[] } {
  const [, month, day] = geboortedatum.split('-');
  const huidigJaar = new Date().getFullYear();
  const som = parseInt(day) + parseInt(month) + huidigJaar;
  const getal = reduceer(som);
  return {
    jaar: huidigJaar,
    getal,
    stappen: [
      `Geboortedag: ${parseInt(day)}`,
      `Geboortemaand: ${parseInt(month)}`,
      `Huidig jaar: ${huidigJaar}`,
      `Som: ${parseInt(day)} + ${parseInt(month)} + ${huidigJaar} = ${som}`,
      `Gereduceerd: ${getal}`,
    ],
  };
}

const CARD_KEYS = ['ruling','lesson','soul','gift','past','foundation','projection','core','purpose'] as const;

// ─── NumberCard ───────────────────────────────────────────────────────────────
const NumberCard: React.FC<{
  keyName: string; result: number; steps: string[];
  expanded: boolean; onToggle: () => void;
}> = ({ keyName, result, steps, expanded, onToggle }) => {
  const meaning = numberMeanings[keyName];
  const desc = numberDescriptions[result as keyof typeof numberDescriptions];
  return (
    <div onClick={onToggle} style={{
      background: expanded ? G.goudBleek : G.bg,
      border: `0.5px solid ${expanded ? G.rand2 : G.rand}`,
      borderRadius: 10, padding: '1.4rem', cursor: 'pointer', transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 700, color: G.goud, lineHeight: 1, minWidth: 48 }}>
          {result}
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
            {meaning?.title ?? keyName}
          </div>
          <div style={{ fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.5 }}>
            {meaning?.description}
          </div>
          {desc && !expanded && (
            <div style={{ fontSize: 13, color: G.tekst3, fontFamily: "'Crimson Pro', serif", fontStyle: 'italic', marginTop: 4 }}>
              {desc.title}
            </div>
          )}
        </div>
      </div>
      <div style={{ fontSize: 11, color: G.tekst3, textAlign: 'right' }}>
        {expanded ? '▲ Verberg' : '▼ Details'}
      </div>
      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `0.5px solid ${G.rand2}` }}>
          <p style={{ fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7, marginBottom: '1rem' }}>
            {meaning?.details}
          </p>
          {steps.length > 0 && (
            <div style={{ background: G.bg3, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.8rem 1rem', marginBottom: '1rem' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Berekening</p>
              {steps.map((s, i) => <p key={i} style={{ fontSize: 13, color: G.tekst2, fontFamily: "'Crimson Pro', serif", margin: '0.2rem 0', lineHeight: 1.6 }}>{s}</p>)}
            </div>
          )}
          {desc && (
            <div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.tekst, marginBottom: '0.3rem' }}>{desc.title}</p>
              <p style={{ fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7, marginBottom: '0.8rem' }}>{desc.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: '#16A34A', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Kwaliteiten</p>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {desc.positives.map((p, i) => <li key={i} style={{ fontSize: 13, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.6 }}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: '#DC2626', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Uitdagingen</p>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {desc.negatives.map((n, i) => <li key={i} style={{ fontSize: 13, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.6 }}>{n}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MiniGetal card ───────────────────────────────────────────────────────────
const MiniGetal: React.FC<{ getal: number; label: string; sub?: string; kleur?: string }> = ({ getal, label, sub, kleur }) => {
  const desc = numberDescriptions[getal as keyof typeof numberDescriptions];
  return (
    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.2rem', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 700, color: kleur ?? G.goud, lineHeight: 1, marginBottom: '0.3rem' }}>{getal}</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.08em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{label}</div>
      {desc && <div style={{ fontSize: 13, color: G.tekst2, fontStyle: 'italic', fontFamily: "'Crimson Pro', serif" }}>{desc.title}</div>}
      {sub && <div style={{ fontSize: 12, color: G.tekst3, fontFamily: "'Crimson Pro', serif", marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  );
};

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export const NumerologieAnalysePage: React.FC = () => {
  const [geboortedatum, setGeboortedatum] = useState('');
  const [naam, setNaam] = useState('');
  const [berekend, setBerekend] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [toonAlleLetters, setToonAlleLetters] = useState(false);

  const numbers = useMemo(() => {
    if (!berekend || !geboortedatum) return null;
    return calculateNumbers(geboortedatum, naam || undefined);
  }, [berekend, geboortedatum, naam]);

  const naamData = useMemo(() => {
    if (!berekend || !naam.trim()) return null;
    return naamAnalyse(naam);
  }, [berekend, naam]);

  const pjaar = useMemo(() => {
    if (!berekend || !geboortedatum) return null;
    return persoonlijkJaar(geboortedatum);
  }, [berekend, geboortedatum]);

  const lifePath = numbers?.lifePath;
  const lifePathDesc = lifePath ? numberDescriptions[lifePath.result as keyof typeof numberDescriptions] : null;

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.7rem' }}>Numerologie</p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 400, color: G.tekst, marginBottom: '0.7rem' }}>Volledig Profiel</h1>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 580, fontFamily: "'Crimson Pro', serif" }}>
            Ontdek al je persoonlijke getallen — levenspad, naamanalyse met elk woord en letter, persoonlijk jaar en meer.
          </p>
        </div>
      </div>

      <section style={{ maxWidth: 1100, margin: '2.5rem auto', padding: '0 2rem' }}>

        {/* ── Invoer ── */}
        <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '2rem', marginBottom: '2.5rem', maxWidth: 560 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 400, color: G.tekst, marginBottom: '1.4rem' }}>Bereken jouw profiel</h2>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Geboortedatum</label>
            <input type="date" value={geboortedatum} onChange={e => { setGeboortedatum(e.target.value); setBerekend(false); }}
              style={{ width: '100%', padding: '0.6rem 0.8rem', fontFamily: "'Crimson Pro', serif", fontSize: 16, color: G.tekst, background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Volledige naam <span style={{ fontStyle: 'italic', textTransform: 'none', fontSize: 11 }}>(optioneel — voor- en achternaam)</span>
            </label>
            <input type="text" value={naam} onChange={e => { setNaam(e.target.value); setBerekend(false); }} placeholder="bijv. Maria van den Berg"
              style={{ width: '100%', padding: '0.6rem 0.8rem', fontFamily: "'Crimson Pro', serif", fontSize: 16, color: G.tekst, background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => { setBerekend(true); setExpandedCard(null); }} disabled={!geboortedatum}
            style={{ fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: '0.08em', color: !geboortedatum ? G.tekst3 : '#fff', background: !geboortedatum ? G.bg3 : G.goud, border: `0.5px solid ${!geboortedatum ? G.rand : G.goudDonker}`, borderRadius: 6, padding: '0.75rem 2rem', cursor: !geboortedatum ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
            Bereken profiel →
          </button>
        </div>

        {berekend && numbers && (
          <>
            {/* ── Levenspad ── */}
            {lifePath && (
              <div style={{ background: G.goudBleek, border: `1px solid ${G.rand2}`, borderRadius: 12, padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 72, fontWeight: 700, color: G.goud, lineHeight: 1, minWidth: 80 }}>{lifePath.result}</div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goudDonker, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Levenspad — Meest Belangrijk</p>
                    <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 400, color: G.tekst, marginBottom: '0.4rem' }}>{lifePathDesc?.title ?? ''}</h2>
                    <p style={{ fontSize: 16, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7, marginBottom: '1rem' }}>{lifePathDesc?.description}</p>
                    <div style={{ background: 'rgba(255,255,255,0.55)', border: `0.5px solid ${G.rand2}`, borderRadius: 6, padding: '0.9rem 1.1rem', marginBottom: '1rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Stap voor stap berekening</p>
                      {lifePath.steps.map((s, i) => <p key={i} style={{ fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif", margin: '0.25rem 0', lineHeight: 1.6 }}>{s}</p>)}
                    </div>
                    {lifePathDesc && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        <div>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: '#16A34A', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Kwaliteiten</p>
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {lifePathDesc.positives.map((p, i) => <li key={i} style={{ fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7 }}>{p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: '#DC2626', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Uitdagingen</p>
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {lifePathDesc.negatives.map((n, i) => <li key={i} style={{ fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7 }}>{n}</li>)}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Persoonlijk Jaar ── */}
            {pjaar && (
              <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '1.5rem', marginBottom: '2rem' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Persoonlijk Jaar {pjaar.jaar}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 56, fontWeight: 700, color: G.goud, lineHeight: 1 }}>{pjaar.getal}</div>
                  <div style={{ flex: 1 }}>
                    {numberDescriptions[pjaar.getal as keyof typeof numberDescriptions] && (
                      <>
                        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 400, color: G.tekst, marginBottom: '0.3rem' }}>
                          {numberDescriptions[pjaar.getal as keyof typeof numberDescriptions].title}
                        </h3>
                        <p style={{ fontSize: 15, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7, marginBottom: '0.5rem' }}>
                          {numberDescriptions[pjaar.getal as keyof typeof numberDescriptions].description}
                        </p>
                      </>
                    )}
                    <div style={{ fontSize: 12, color: G.tekst3, fontFamily: "'Crimson Pro', serif" }}>
                      {pjaar.stappen.join(' · ')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Alle getallen ── */}
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Jouw 9 numerologische getallen — klik voor details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {CARD_KEYS.map(key => {
                const entry = numbers[key];
                if (!entry) return null;
                return (
                  <NumberCard key={key} keyName={key} result={entry.result} steps={entry.steps}
                    expanded={expandedCard === key} onToggle={() => setExpandedCard(p => p === key ? null : key)} />
                );
              })}
            </div>

            {/* ── Naam analyse ── */}
            {naam.trim() && naamData && (
              <div style={{ borderTop: `0.5px solid ${G.rand}`, paddingTop: '2.5rem', marginBottom: '2.5rem' }}>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Naam Analyse</p>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 400, color: G.tekst, marginBottom: '1.5rem' }}>{naam}</h2>

                {/* Letter-voor-letter raster */}
                <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.10em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '1rem' }}>Letter voor letter</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {naamData.letters.map((ch, i) => {
                      const val = letterWaarde(ch);
                      const isVowel = VOWELS.has(ch);
                      return (
                        <div key={i} style={{ textAlign: 'center', minWidth: 36 }}>
                          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 600, color: isVowel ? '#2563EB' : G.tekst, marginBottom: 2 }}>{ch}</div>
                          <div style={{ fontSize: 12, color: isVowel ? '#2563EB' : G.goud, fontFamily: "'Cinzel', serif" }}>{val}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 13, color: G.tekst3, fontFamily: "'Crimson Pro', serif" }}>
                    <span style={{ color: '#2563EB' }}>■</span> Klinkers (ziengetal) &nbsp;·&nbsp; <span style={{ color: G.goud }}>■</span> Medeklinkers (persoonlijkheidsgetal)
                  </div>
                  <div style={{ marginTop: '0.7rem', fontSize: 14, color: G.tekst2, fontFamily: "'Crimson Pro', serif" }}>
                    Totaal: {naamData.letters.map(letterWaarde).join(' + ')} = <strong>{naamData.totaal}</strong> → gereduceerd: <strong style={{ color: G.goud }}>{naamData.naamGetal}</strong>
                  </div>
                </div>

                {/* 3 kerngetal-kaarten */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <MiniGetal getal={naamData.naamGetal} label="Naamgetal" sub="Alle letters" />
                  <MiniGetal getal={naamData.zielenGetal} label="Zielengetal" sub={`Klinkers: som ${naamData.klinkerSom}`} kleur="#2563EB" />
                  <MiniGetal getal={naamData.persoonlijkheidsGetal} label="Persoonlijkheidsgetal" sub={`Medeklinkers: som ${naamData.medeklinkerSom}`} kleur="#7C3AED" />
                </div>

                {/* Naamgetal betekenis */}
                {nameNumberMeanings[naamData.naamGetal as keyof typeof nameNumberMeanings] && (
                  <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.2rem', marginBottom: '1.5rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Naamgetal {naamData.naamGetal} — betekenis</p>
                    <p style={{ fontSize: 13, color: G.goud, fontFamily: "'Cinzel', serif", letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                      {nameNumberMeanings[naamData.naamGetal as keyof typeof nameNumberMeanings].keywords}
                    </p>
                    <p style={{ fontSize: 15, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.7, margin: 0 }}>
                      {nameNumberMeanings[naamData.naamGetal as keyof typeof nameNumberMeanings].description}
                    </p>
                  </div>
                )}

                {/* Per woord */}
                {naamData.woorden.length > 1 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.10em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.8rem' }}>Per naam-deel</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                      {naamData.woorden.map((w, i) => (
                        <div key={i} style={{ background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1rem 1.2rem', minWidth: 130 }}>
                          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.tekst, marginBottom: '0.3rem' }}>{w.woord}</div>
                          <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, color: G.tekst3, marginBottom: '0.5rem' }}>
                            {w.letters.join('+')} = {w.som}
                          </div>
                          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 28, color: G.goud, fontWeight: 700 }}>{w.getal}</div>
                          {numberDescriptions[w.getal as keyof typeof numberDescriptions] && (
                            <div style={{ fontSize: 12, color: G.tekst3, fontStyle: 'italic', fontFamily: "'Crimson Pro', serif" }}>
                              {numberDescriptions[w.getal as keyof typeof numberDescriptions].title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Letter betekenissen */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.10em', color: G.tekst3, textTransform: 'uppercase', margin: 0 }}>
                      Betekenis per letter ({toonAlleLetters ? naamData.unicLetters.length : Math.min(3, naamData.unicLetters.length)} van {naamData.unicLetters.length})
                    </p>
                    {naamData.unicLetters.length > 3 && (
                      <button onClick={() => setToonAlleLetters(!toonAlleLetters)}
                        style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.06em', padding: '4px 12px', borderRadius: 12, border: `0.5px solid ${G.rand2}`, background: 'transparent', color: G.tekst3, cursor: 'pointer' }}>
                        {toonAlleLetters ? 'Minder tonen' : `Alle ${naamData.unicLetters.length} tonen`}
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.8rem' }}>
                    {(toonAlleLetters ? naamData.unicLetters : naamData.unicLetters.slice(0, 3)).map(letter => {
                      const lm = letterMeanings[letter as keyof typeof letterMeanings];
                      const isVowel = VOWELS.has(letter);
                      return (
                        <div key={letter} style={{ background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: isVowel ? '#2563EB' : G.goud }}>{letter}</span>
                            <span style={{ fontSize: 12, color: G.tekst3 }}>{isVowel ? 'klinker' : 'medeklinker'} · waarde {letterWaarde(letter)}</span>
                          </div>
                          <p style={{ fontSize: 13, color: G.tekst2, fontFamily: "'Crimson Pro', serif", lineHeight: 1.65, margin: 0 }}>
                            {lm?.meaning ?? '—'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reset */}
            <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
              <button onClick={() => { setBerekend(false); setExpandedCard(null); setToonAlleLetters(false); }}
                style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.06em', color: G.tekst3, background: 'transparent', border: `0.5px solid ${G.rand2}`, borderRadius: 6, padding: '0.6rem 1.6rem', cursor: 'pointer' }}>
                Nieuw profiel berekenen
              </button>
            </div>
          </>
        )}

        {/* Gerelateerde tools */}
        <div style={{ borderTop: '0.5px solid rgba(184,134,11,0.15)', paddingTop: '1.25rem', paddingBottom: '2rem', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Losse calculators</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { to: '/numerologie/levenspad', label: 'Levenspad' },
              { to: '/numerologie/naam-analyse', label: 'Naam Analyse' },
              { to: '/numerologie/expressiegetal', label: 'Expressiegetal' },
              { to: '/numerologie/bestuursgetal', label: 'Bestuursgetal' },
              { to: '/numerologie/huisnummer', label: 'Huisnummer' },
              { to: '/numerologie/mobiel-nummer', label: 'Persoonlijk Jaar' },
              { to: '/cursus/module-01', label: 'Cursus Module 1' },
            ].map(l => (
              <a key={l.to} href={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
