import React, { useState } from 'react';
import { useCursusQuizOpslaan } from '../../lib/voortgang';
import {
  BEREKENING_LESSEN, GETAL_BETEKENISSEN, QUIZ_VRAGEN, VOORBEELD_PERSOON,
  type QuizVraag,
} from '../../data/numerologie/cursusData';
import { POSITIE_INTERPRETATIES, type PosNaam } from '../../data/numerologie/positieInterpretaties';

type Tab = 'lessen' | 'betekenissen' | 'oefen' | 'voorbeeld' | 'quiz';

const GETAL_KLEUR: Record<number | string, string> = {
  1: '#F0A596', 2: '#3498db', 3: '#f39c12', 4: '#7BC98F',
  5: '#e67e22', 6: '#9b59b6', 7: '#1abc9c', 8: '#c0392b',
  9: '#2c3e50', 11: '#F1CB78', 22: '#8e44ad',
};

function reduceer(n: number, meester = true): number {
  if (meester && (n === 11 || n === 22)) return n;
  if (n <= 9) return n;
  const som = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  return reduceer(som, meester);
}

function berekenAlles(dag: number, maand: number, jaar: number) {
  const dagR = reduceer(dag);
  const maandR = reduceer(maand);
  const jaarSom = String(jaar).split('').reduce((a, d) => a + parseInt(d), 0);
  const jaarR = reduceer(jaarSom);
  const jaarLaatste2 = parseInt(String(jaar).slice(-2));
  const jaarL2som = String(jaarLaatste2).split('').reduce((a, d) => a + parseInt(d), 0);

  const bestuur = dagR;
  const levenspad = reduceer(dagR + maandR + jaarR);
  const levensles = reduceer(maand);
  const ziel = dagR;
  const geschenk = reduceer(jaarL2som);
  const verleden = reduceer(jaarSom);
  const fundament = reduceer(ziel + levensles);
  const projectie = reduceer(geschenk + ziel);
  const kern = reduceer(verleden + levensles);
  const doel = reduceer(dag + maand + jaar);

  return [
    { naam: "Bestuursgetal", getal: bestuur, stap: `${dag} → ${dag > 9 ? String(dag).split('').join('+') + ' = ' + dagR : dagR}` },
    { naam: "Levenspad", getal: levenspad, stap: `dag(${dagR}) + maand(${maandR}) + jaar(${jaarR}) = ${dagR + maandR + jaarR}` },
    { naam: "Levensles", getal: levensles, stap: `maand ${maand} → ${levensles}` },
    { naam: "Zielengetal", getal: ziel, stap: `dag ${dag} → ${ziel}` },
    { naam: "Geschenkgetal", getal: geschenk, stap: `${String(jaar).slice(-2)} → ${jaarL2som > 9 ? String(jaarL2som).split('').join('+') + ' = ' : ''}${geschenk}` },
    { naam: "Verledengetal", getal: verleden, stap: `${String(jaar).split('').join('+')} = ${jaarSom} → ${verleden}` },
    { naam: "Fundamentengetal", getal: fundament, stap: `Ziel(${ziel}) + Levensles(${levensles}) = ${ziel + levensles} → ${fundament}` },
    { naam: "Projectiegetal", getal: projectie, stap: `Geschenk(${geschenk}) + Ziel(${ziel}) = ${geschenk + ziel} → ${projectie}` },
    { naam: "Kerngetal", getal: kern, stap: `Verleden(${verleden}) + Levensles(${levensles}) = ${verleden + levensles} → ${kern}` },
    { naam: "Doelgetal", getal: doel, stap: `${maand} + ${dag} + ${jaar} = ${maand + dag + jaar} → ${doel}` },
  ];
}

function getArchetype(getal: number): string {
  const b = GETAL_BETEKENISSEN.find(g => String(g.getal) === String(getal));
  return b ? b.archetype : '?';
}

export function CursusModule01Page() {
  const [tab, setTab] = useState<Tab>('lessen');
  const [openLes, setOpenLes] = useState<number | null>(0);
  const [openGetal, setOpenGetal] = useState<number | null>(null);

  // Oefenpagina
  const [dag, setDag] = useState('');
  const [maand, setMaand] = useState('');
  const [jaar, setJaar] = useState('');
  const [oefenResultaat, setOefenResultaat] = useState<ReturnType<typeof berekenAlles> | null>(null);

  // Quiz
  const [quizAntwoorden, setQuizAntwoorden] = useState<(number | null)[]>(Array(QUIZ_VRAGEN.length).fill(null));
  const [quizKlaar, setQuizKlaar] = useState(false);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'lessen', label: 'De 10 Lessen', emoji: '📖' },
    { id: 'betekenissen', label: 'Getalbetekenissen', emoji: '🔢' },
    { id: 'oefen', label: 'Oefenen', emoji: '✏️' },
    { id: 'voorbeeld', label: 'Voorbeeld', emoji: '👤' },
    { id: 'quiz', label: 'Quiz', emoji: '🎯' },
  ];

  const quizScore = quizAntwoorden.filter((a, i) => a === QUIZ_VRAGEN[i].juist).length;
  useCursusQuizOpslaan('module-01', QUIZ_VRAGEN, quizAntwoorden, quizKlaar);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #20162F 0%, #0D0C22 50%, #080718 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔢</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#F1CB78', fontSize: '1.8rem', margin: '0 0 0.25rem' }}>
            Module 1 — Geboortedatum-getallen
          </h1>
          <p style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', margin: '0 0 0.5rem' }}>
            AuraLine Cursus — 10 getallen uit jouw geboortedatum
          </p>
          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.75rem', background: 'rgba(241,203,120,0.15)', color: '#F1CB78' }}>10 berekeningen</span>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.75rem', background: 'rgba(241,203,120,0.15)', color: '#F1CB78' }}>11 betekenissen</span>
            <span style={{ padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.75rem', background: 'rgba(241,203,120,0.15)', color: '#F1CB78' }}>10 quizvragen</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.5rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.82rem',
              background: tab === t.id ? '#F1CB78' : 'rgba(241,203,120,0.12)',
              color: tab === t.id ? '#20162F' : '#F1CB78',
            }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Lessen */}
        {tab === 'lessen' && (
          <div>
            <div style={{ background: 'rgba(241,203,120,0.07)', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(241,203,120,0.2)' }}>
              <strong style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem' }}>🏆 De gouden regel</strong>
              <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', margin: '0.5rem 0 0', fontSize: '1rem' }}>
                Alle getallen worden gereduceerd tot één cijfer (1-9), <strong style={{ color: '#F1CB78' }}>behalve meestergetallen 11 en 22 — die blijven intact.</strong>
              </p>
            </div>

            {BEREKENING_LESSEN.map((les, idx) => (
              <div key={les.nummer} style={{ marginBottom: '0.75rem' }}>
                <div
                  onClick={() => setOpenLes(openLes === idx ? null : idx)}
                  style={{
                    background: openLes === idx ? 'rgba(241,203,120,0.1)' : 'rgba(255,255,255,0.05)',
                    borderRadius: openLes === idx ? '10px 10px 0 0' : 10,
                    border: '1px solid rgba(241,203,120,0.2)', padding: '1rem 1.25rem',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F1CB78', color: '#20162F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 'bold', flexShrink: 0 }}>
                      {les.nummer}
                    </div>
                    <div>
                      <div style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem' }}>{les.naam}</div>
                      <div style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>{les.kort}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#8E7FA8', fontSize: '0.8rem', fontFamily: 'monospace' }}>input: {les.input.split(' ')[0].toLowerCase()}</span>
                    <span style={{ color: '#F1CB78' }}>{openLes === idx ? '▲' : '▼'}</span>
                  </div>
                </div>

                {openLes === idx && (
                  <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(241,203,120,0.15)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '1.25rem' }}>

                    {/* WAT IS HET */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>📘 WAT IS HET?</div>
                      <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>{les.watIsHet}</p>
                    </div>

                    {/* WAT VERTELT HET */}
                    <div style={{ background: 'rgba(123,201,143,0.07)', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem', border: '1px solid rgba(123,201,143,0.2)' }}>
                      <div style={{ color: '#7BC98F', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>🔍 WAT VERTELT DIT OVER DE PERSOON?</div>
                      <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>{les.watVerteltHet}</p>
                    </div>

                    {/* IN GESPREK */}
                    <div style={{ background: 'rgba(52,152,219,0.07)', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(52,152,219,0.2)' }}>
                      <div style={{ color: '#3498db', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>💬 HOE GEBRUIK JE DIT IN EEN GESPREK?</div>
                      <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>{les.inGesprek}</p>
                    </div>

                    {/* Scheidslijn */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
                      <div style={{ color: '#8E7FA8', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', letterSpacing: '0.08em', marginBottom: '1rem' }}>⚙️ BEREKENING</div>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ color: '#B9A9CC', fontSize: '0.75rem', fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: '0.4rem' }}>INPUT</div>
                        <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem' }}>{les.input}</div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ color: '#B9A9CC', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', marginBottom: '0.4rem' }}>STAPPEN</div>
                        {les.stappen.map((stap, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.35rem' }}>
                            <span style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', minWidth: 20 }}>{i + 1}.</span>
                            <span style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem' }}>{stap}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: 'rgba(241,203,120,0.08)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ color: '#B9A9CC', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', marginBottom: '0.3rem' }}>VOORBEELD</div>
                        <code style={{ color: '#F1CB78', fontFamily: 'monospace', fontSize: '0.9rem' }}>{les.voorbeeld}</code>
                      </div>

                      {les.meestergetal && (
                        <div style={{ background: 'rgba(180,120,220,0.08)', borderRadius: 8, padding: '0.75rem', border: '1px solid rgba(180,120,220,0.2)', marginBottom: '0.75rem' }}>
                          <div style={{ color: '#E7B6F5', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', marginBottom: '0.3rem' }}>⭐ BIJ MEESTERGETALLEN</div>
                          <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>{les.meestergetal}</div>
                        </div>
                      )}
                    </div>

                    {/* Positie-specifieke interpretaties */}
                    {POSITIE_INTERPRETATIES[les.naam as PosNaam] && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                        <div style={{ color: '#8E7FA8', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                          📖 WAT BETEKENT ELK GETAL OP DEZE POSITIE?
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {([1,2,3,4,5,6,7,8,9,11,22] as const).map(g => {
                            const tekst = POSITIE_INTERPRETATIES[les.naam as PosNaam]?.[g];
                            if (!tekst) return null;
                            const kleur = GETAL_KLEUR[g] || '#F1CB78';
                            const archetype = GETAL_BETEKENISSEN.find(gb => String(gb.getal) === String(g))?.archetype || '';
                            return (
                              <div key={g} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ minWidth: 34, height: 34, borderRadius: '50%', background: kleur + '25', border: `1px solid ${kleur}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem', fontWeight: 'bold', color: kleur, flexShrink: 0 }}>
                                  {g}
                                </div>
                                <div>
                                  <div style={{ color: kleur, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', marginBottom: '0.2rem' }}>{archetype}</div>
                                  <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', lineHeight: 1.65 }}>{tekst}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab: Betekenissen */}
        {tab === 'betekenissen' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {GETAL_BETEKENISSEN.map((g, idx) => (
                <button key={String(g.getal)} onClick={() => setOpenGetal(openGetal === idx ? null : idx)} style={{
                  padding: '0.75rem 0.5rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: openGetal === idx ? (GETAL_KLEUR[g.getal as number] || '#F1CB78') : 'rgba(255,255,255,0.07)',
                  color: openGetal === idx ? '#fff' : '#E0D5E9',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                }}>
                  <span style={{ fontSize: '1.4rem', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 'bold' }}>{g.getal}</span>
                  <span style={{ fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>{g.archetype.replace('De ', '')}</span>
                  {g.isMeestergetal && <span style={{ fontSize: '0.6rem', color: openGetal === idx ? '#ffe' : '#E7B6F5' }}>⭐</span>}
                </button>
              ))}
            </div>

            {openGetal !== null && (() => {
              const g = GETAL_BETEKENISSEN[openGetal];
              const kleur = GETAL_KLEUR[g.getal as number] || '#F1CB78';
              return (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: `1px solid ${kleur}50`, padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: kleur, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>
                      {g.getal}
                    </div>
                    <div>
                      <h2 style={{ color: kleur, fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0 0 0.25rem', fontSize: '1.3rem' }}>{g.archetype}</h2>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {g.sleutelwoorden.map(w => (
                          <span key={w} style={{ padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.75rem', background: kleur + '20', color: kleur }}>{w}</span>
                        ))}
                        {g.isMeestergetal && <span style={{ padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.75rem', background: 'rgba(180,120,220,0.15)', color: '#E7B6F5' }}>⭐ Meestergetal</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                      { label: 'Energie', tekst: g.energie, kleur: '#B9A9CC' },
                      { label: '✓ Positieve uitdrukking', tekst: g.positief, kleur: '#7BC98F' },
                      { label: '⚡ Schaduwzijde', tekst: g.schaduw, kleur: '#F0A596' },
                      { label: '💼 Werk & Carrière', tekst: g.werk, kleur: '#3498db' },
                      { label: '❤️ Relaties', tekst: g.relaties, kleur: '#e91e8c' },
                      { label: '🌟 Spirituele les', tekst: g.spiritueleLes, kleur: '#F1CB78' },
                      { label: '🌱 Ontwikkelpunten', tekst: g.ontwikkelpunten, kleur: '#8e44ad' },
                    ].map(({ label, tekst, kleur: lkleur }) => (
                      <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '0.75rem', borderLeft: `2px solid ${lkleur}` }}>
                        <div style={{ color: lkleur, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', marginBottom: '0.3rem' }}>{label}</div>
                        <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>{tekst}</div>
                      </div>
                    ))}

                    {g.isMeestergetal && (
                      <div style={{ background: 'rgba(180,120,220,0.08)', borderRadius: 8, padding: '0.75rem', border: '1px solid rgba(180,120,220,0.25)' }}>
                        <div style={{ color: '#E7B6F5', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.75rem', marginBottom: '0.3rem' }}>⭐ IN DE PRAKTIJK</div>
                        <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', lineHeight: 1.6 }}>
                          Pas de duiding aan op de positie: <strong>Op Levenspad</strong> = hoofdthema heel leven · <strong>Op Bestuursgetal</strong> = dagelijkse manifestatie · <strong>Op Zielengetal</strong> = innerlijk verlangen · <strong>Op Geschenkgetal</strong> = talent in deze energie.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Tab: Oefenen */}
        {tab === 'oefen' && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(241,203,120,0.25)', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0 0 1.25rem', fontSize: '1.1rem' }}>✏️ Bereken jouw 10 getallen</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Dag', value: dag, set: setDag, placeholder: 'bv. 14', min: 1, max: 31 },
                  { label: 'Maand', value: maand, set: setMaand, placeholder: 'bv. 7', min: 1, max: 12 },
                  { label: 'Jaar', value: jaar, set: setJaar, placeholder: 'bv. 1979', min: 1900, max: 2020 },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label}>
                    <label style={{ color: '#B9A9CC', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      style={{
                        width: '100%', padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(241,203,120,0.3)',
                        borderRadius: 8, color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const d = parseInt(dag), m = parseInt(maand), j = parseInt(jaar);
                  if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && j >= 1900 && j <= 2020) {
                    setOefenResultaat(berekenAlles(d, m, j));
                  }
                }}
                style={{ padding: '0.75rem 2rem', background: '#F1CB78', border: 'none', borderRadius: 25, color: '#20162F', fontFamily: "'Cormorant Garamond', Georgia, serif", cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Bereken alle 10 getallen
              </button>
            </div>

            {oefenResultaat && (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(241,203,120,0.2)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(241,203,120,0.15)' }}>
                  <h3 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: 0 }}>Jouw 10 getallen — {dag}-{maand}-{jaar}</h3>
                </div>
                {oefenResultaat.map((r, i) => {
                  const kleur = GETAL_KLEUR[r.getal] || '#F1CB78';
                  const archetype = getArchetype(r.getal);
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto auto', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 1.5rem', borderBottom: i < oefenResultaat.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ color: '#8E7FA8', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem' }}>{i + 1}</div>
                      <div>
                        <div style={{ color: '#E0D5E9', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem' }}>{r.naam}</div>
                        <div style={{ color: '#8E7FA8', fontFamily: 'monospace', fontSize: '0.75rem' }}>{r.stap}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: kleur, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', fontWeight: 'bold' }}>{r.getal}</div>
                        {(r.getal === 11 || r.getal === 22) && <div style={{ color: '#E7B6F5', fontSize: '0.65rem' }}>⭐ meestergetal</div>}
                      </div>
                      <div style={{ padding: '0.2rem 0.5rem', borderRadius: 8, fontSize: '0.72rem', background: kleur + '20', color: kleur, whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {archetype}
                      </div>
                    </div>
                  );
                })}

                {/* Patronen analyse */}
                <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(241,203,120,0.15)', background: 'rgba(241,203,120,0.05)' }}>
                  <div style={{ color: '#B9A9CC', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem', marginBottom: '0.75rem' }}>PATRONEN IN JOUW PROFIEL</div>
                  {(() => {
                    const tellingen: Record<number, number> = {};
                    oefenResultaat.forEach(r => { tellingen[r.getal] = (tellingen[r.getal] || 0) + 1; });
                    const dubbel = Object.entries(tellingen).filter(([, v]) => v >= 2).map(([g, v]) => `${v}× getal ${g} (${getArchetype(parseInt(g))})`);
                    const meestergetallen = oefenResultaat.filter(r => r.getal === 11 || r.getal === 22).map(r => `${r.naam} = ${r.getal}`);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {dubbel.length > 0 && (
                          <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem' }}>
                            <span style={{ color: '#F1CB78' }}>Dominante getallen:</span> {dubbel.join(' · ')}
                          </div>
                        )}
                        {meestergetallen.length > 0 && (
                          <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem' }}>
                            <span style={{ color: '#E7B6F5' }}>⭐ Meestergetallen:</span> {meestergetallen.join(' · ')}
                          </div>
                        )}
                        {dubbel.length === 0 && meestergetallen.length === 0 && (
                          <div style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>Gevarieerd profiel — geen dominant herhalend getal.</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Voorbeeld */}
        {tab === 'voorbeeld' && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(241,203,120,0.25)', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0 0 0.25rem', fontSize: '1.2rem' }}>
                👤 {VOORBEELD_PERSOON.naam}
              </h2>
              <p style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
                Geboortedatum: {VOORBEELD_PERSOON.datum}
              </p>

              {VOORBEELD_PERSOON.getallen.map((g, i) => {
                const kleur = GETAL_KLEUR[g.getal] || '#F1CB78';
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto auto', gap: '0.75rem', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: '#8E7FA8', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem' }}>{i + 1}</div>
                    <div>
                      <div style={{ color: '#E0D5E9', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem' }}>{g.naam}</div>
                      <div style={{ color: '#8E7FA8', fontFamily: 'monospace', fontSize: '0.75rem' }}>{g.berekening}</div>
                    </div>
                    <div style={{ color: kleur, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'right' }}>{g.getal}</div>
                    <div style={{ padding: '0.2rem 0.5rem', borderRadius: 8, fontSize: '0.72rem', background: kleur + '20', color: kleur, textAlign: 'center' }}>{g.archetype}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(241,203,120,0.15)', padding: '1.5rem' }}>
              <h3 style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", margin: '0 0 1rem', fontSize: '1rem' }}>🔍 Wat valt op?</h3>
              {VOORBEELD_PERSOON.patronen.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#F1CB78', flexShrink: 0 }}>•</span>
                  <span style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(240,165,150,0.08)', borderRadius: 8, border: '1px solid rgba(240,165,150,0.2)' }}>
                <strong style={{ color: '#F0A596', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem' }}>⚡ Spanningsveld</strong>
                <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>{VOORBEELD_PERSOON.spanning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Quiz */}
        {tab === 'quiz' && (
          <div>
            {!quizKlaar ? (
              <div>
                <p style={{ color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', marginBottom: '1.5rem' }}>
                  10 vragen — antwoord alle vragen en klik dan op 'Controleer antwoorden'.
                </p>
                {QUIZ_VRAGEN.map((vraag: QuizVraag, qi) => (
                  <div key={qi} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(241,203,120,0.15)', padding: '1.25rem', marginBottom: '1rem' }}>
                    <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1.05rem', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                      <strong style={{ color: '#F1CB78', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.85rem' }}>Vraag {qi + 1}</strong><br />
                      {vraag.vraag}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {vraag.opties.map((optie, oi) => (
                        <button key={oi} onClick={() => {
                          const nieuw = [...quizAntwoorden];
                          nieuw[qi] = oi;
                          setQuizAntwoorden(nieuw);
                        }} style={{
                          padding: '0.6rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem',
                          background: quizAntwoorden[qi] === oi ? 'rgba(241,203,120,0.2)' : 'rgba(255,255,255,0.05)',
                          color: quizAntwoorden[qi] === oi ? '#F1CB78' : '#E0D5E9',
                          border: quizAntwoorden[qi] === oi ? '1px solid #F1CB78' : '1px solid transparent',
                        }}>
                          {String.fromCharCode(97 + oi)}) {optie}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={() => setQuizKlaar(true)}
                    disabled={quizAntwoorden.some(a => a === null)}
                    style={{
                      padding: '0.75rem 2rem', background: quizAntwoorden.every(a => a !== null) ? '#F1CB78' : 'rgba(241,203,120,0.3)',
                      border: 'none', borderRadius: 25, color: '#20162F', fontFamily: "'Cormorant Garamond', Georgia, serif",
                      cursor: quizAntwoorden.every(a => a !== null) ? 'pointer' : 'not-allowed', fontSize: '0.95rem',
                    }}
                  >
                    Controleer antwoorden ({quizAntwoorden.filter(a => a !== null).length}/10 beantwoord)
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Score */}
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(241,203,120,0.3)', padding: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', Georgia, serif", color: quizScore >= 8 ? '#7BC98F' : quizScore >= 6 ? '#e67e22' : '#F0A596' }}>
                    {quizScore}/10
                  </div>
                  <div style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', fontSize: '1.1rem', margin: '0.5rem 0' }}>
                    {quizScore >= 9 ? 'Uitstekend! De stof zit volledig.' : quizScore >= 7 ? 'Goed! Herlees de berekeningen even.' : 'Doe Module 1 nog eens door, focus op de reductieregels.'}
                  </div>
                  <button onClick={() => { setQuizAntwoorden(Array(QUIZ_VRAGEN.length).fill(null)); setQuizKlaar(false); }} style={{
                    marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'transparent', border: '1px solid #F1CB78', color: '#F1CB78', borderRadius: 20, cursor: 'pointer', fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}>
                    Opnieuw proberen
                  </button>
                </div>

                {/* Antwoorden per vraag */}
                {QUIZ_VRAGEN.map((vraag: QuizVraag, qi) => {
                  const goed = quizAntwoorden[qi] === vraag.juist;
                  return (
                    <div key={qi} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: `1px solid ${goed ? 'rgba(123,201,143,0.3)' : 'rgba(240,165,150,0.3)'}`, padding: '1.25rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#B9A9CC', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem' }}>Vraag {qi + 1}</span>
                        <span style={{ color: goed ? '#7BC98F' : '#F0A596', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.8rem' }}>{goed ? '✓ Goed' : '✗ Fout'}</span>
                      </div>
                      <p style={{ color: '#E0D5E9', fontFamily: 'DM Sans, sans-serif', margin: '0 0 0.75rem' }}>{vraag.vraag}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {vraag.opties.map((optie, oi) => {
                          const isGekozen = quizAntwoorden[qi] === oi;
                          const isJuist = oi === vraag.juist;
                          return (
                            <div key={oi} style={{
                              padding: '0.4rem 0.75rem', borderRadius: 6, fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
                              background: isJuist ? 'rgba(123,201,143,0.12)' : isGekozen && !isJuist ? 'rgba(240,165,150,0.12)' : 'transparent',
                              color: isJuist ? '#7BC98F' : isGekozen && !isJuist ? '#F0A596' : '#8E7FA8',
                              border: isJuist ? '1px solid rgba(123,201,143,0.3)' : isGekozen && !isJuist ? '1px solid rgba(240,165,150,0.3)' : '1px solid transparent',
                            }}>
                              {String.fromCharCode(97 + oi)}) {optie} {isJuist ? '✓' : isGekozen && !isJuist ? '✗' : ''}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(241,203,120,0.07)', borderRadius: 6, color: '#B9A9CC', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
                        💡 {vraag.uitleg}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
