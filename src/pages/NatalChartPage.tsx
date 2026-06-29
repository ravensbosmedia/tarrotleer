import React, { useState, useRef, useEffect } from 'react';
import { HUIZEN, ASPECT_TYPES, PLANEET_BETEKENIS, PLANEET_IN_TEKEN, aspectTekst } from '../data/astrologie/interpretaties';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#0D0B14',
  bg2: '#1A1625', bg3: '#221E30', rand: 'rgba(184,134,11,0.25)', accent: 'rgba(184,134,11,0.12)',
};

const PLANEET_KLEUR: Record<string, string> = {
  Zon:'#FFD700', Maan:'#C0C0E0', Mercurius:'#A8C0E0', Venus:'#FFB6C1',
  Mars:'#FF6B6B', Jupiter:'#FFD8A8', Saturnus:'#B8A070', Uranus:'#70E0E0',
  Neptunus:'#7090FF', Pluto:'#C070C0',
};

interface KernPlaneet { teken: string; symbool: string; graad: number }
interface Planeet { naam: string; teken: string; symbool: string; graad: number; huis: number | null; retrograde: boolean }
interface Huis { huis: number; teken: string; symbool: string; graad: number }
interface Aspect { planeet1: string; planeet2: string; type: string; type_nl: string; hoek: number; orbit: number }
interface NatalData {
  naam: string; geboortedatum: string; geboortetijd: string; geboorteplaats: string; tijdzone: string;
  kern: { zon: KernPlaneet; maan: KernPlaneet; ascendant: KernPlaneet };
  planeten: Planeet[]; huizen: Huis[]; aspecten: Aspect[];
}
interface Suggestie { naam: string; land: string }

const invoerStijl: React.CSSProperties = {
  width:'100%', background:'rgba(255,255,255,0.05)', border:`0.5px solid rgba(184,134,11,0.25)`,
  borderRadius:8, padding:'10px 14px', color:'#F5EDD8',
  fontFamily:"'Crimson Pro', serif", fontSize:15, outline:'none', boxSizing:'border-box',
};
const label = (tekst: string, sub?: string): React.ReactNode => (
  <label style={{display:'block', fontFamily:"'Cinzel', serif", fontSize:10, letterSpacing:'0.1em', color:G.goud, marginBottom:'0.4rem', opacity:0.8}}>
    {tekst}{sub && <span style={{color:'rgba(245,237,216,0.3)', fontSize:9, marginLeft:6}}>{sub}</span>}
  </label>
);
const sectieHeader = (tekst: string) => (
  <div style={{fontFamily:"'Cinzel', serif", fontSize:11, letterSpacing:'0.12em', color:G.goud, marginBottom:'1rem', opacity:0.8, textTransform:'uppercase' as const}}>{tekst}</div>
);

export const NatalChartPage: React.FC = () => {
  const [form, setForm] = useState({ naam:'', datum:'', tijd:'12:00', stad:'' });
  const [suggesties, setSuggesties] = useState<Suggestie[]>([]);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>|null>(null);
  const [resultaat, setResultaat] = useState<NatalData|null>(null);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState('');
  const [actieveTab, setActieveTab] = useState<'kern'|'planeten'|'aspecten'|'huizen'>('kern');
  const sugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (sugRef.current && !sugRef.current.contains(e.target as Node)) setSuggesties([]); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  function stadTypen(v: string) {
    setForm(f => ({...f, stad:v}));
    if (timer) clearTimeout(timer);
    if (v.length < 2) { setSuggesties([]); return; }
    setTimer(setTimeout(async () => {
      try { const r = await fetch(`/api/natal/geocodeer?q=${encodeURIComponent(v)}`); const d = await r.json(); setSuggesties(d.resultaten ?? []); }
      catch { setSuggesties([]); }
    }, 500));
  }

  function kiesStad(s: Suggestie) {
    setForm(f => ({...f, stad: s.naam + (s.land ? `, ${s.land}` : '')}));
    setSuggesties([]);
  }

  async function bereken() {
    if (!form.naam || !form.datum || !form.stad) { setFout('Vul naam, geboortedatum en geboorteplaats in.'); return; }
    setFout(''); setLaden(true); setResultaat(null);
    const [jaar,maand,dag] = form.datum.split('-');
    const [uur,minuut] = form.tijd.split(':');
    const p = new URLSearchParams({naam:form.naam, jaar, maand, dag, uur:uur??'12', minuut:minuut??'0', stad:form.stad});
    try {
      const r = await fetch(`/api/natal?${p}`);
      const d = await r.json();
      if (d.error) setFout(d.error); else { setResultaat(d); setActieveTab('kern'); }
    } catch { setFout('Kon geboortehoroscoop niet berekenen.'); }
    finally { setLaden(false); }
  }

  const tabStijl = (id: typeof actieveTab): React.CSSProperties => ({
    fontFamily:"'Cinzel', serif", fontSize:11, letterSpacing:'0.08em', padding:'7px 16px', borderRadius:16,
    border:`0.5px solid ${actieveTab===id ? G.goud : G.rand}`, background: actieveTab===id ? G.goud : 'transparent',
    color: actieveTab===id ? G.bg : G.goudBleek, cursor:'pointer', transition:'all 0.18s',
  });

  return (
    <div style={{minHeight:'100vh', background:G.bg, color:G.goudBleek, fontFamily:"'Crimson Pro', serif"}}>
      <div style={{maxWidth:1000, margin:'0 auto', padding:'2.5rem 1.5rem'}}>

        {/* Header */}
        <div style={{textAlign:'center', marginBottom:'2.5rem'}}>
          <div style={{fontSize:48, marginBottom:'0.4rem'}}>☌</div>
          <h1 style={{fontFamily:"'Cinzel', serif", fontSize:26, letterSpacing:'0.15em', color:G.goud, margin:0}}>GEBOORTEHOROSCOOP</h1>
          <p style={{color:'rgba(245,237,216,0.45)', fontSize:13, marginTop:'0.4rem'}}>Exacte planeetposities · Aspecten · Interpretaties · Swiss Ephemeris</p>
        </div>

        {/* Formulier */}
        <div style={{background:G.bg2, border:`0.5px solid ${G.rand}`, borderRadius:16, padding:'2rem', marginBottom:'2rem'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem'}}>
            <div>
              {label('NAAM')}
              <input style={invoerStijl} placeholder="Jouw naam" value={form.naam} onChange={e => setForm(f => ({...f,naam:e.target.value}))} onKeyDown={e => e.key==='Enter' && bereken()} />
            </div>
            <div style={{position:'relative'}} ref={sugRef}>
              {label('GEBOORTEPLAATS', '— elke stad ter wereld')}
              <input style={invoerStijl} placeholder="Typ een stad..." value={form.stad} onChange={e => stadTypen(e.target.value)} onKeyDown={e => e.key==='Enter' && suggesties.length>0 && kiesStad(suggesties[0])} autoComplete="off" />
              {suggesties.length>0 && (
                <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:G.bg3,border:`0.5px solid ${G.rand}`,borderRadius:8,marginTop:2,overflow:'hidden',boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
                  {suggesties.map((s,i) => (
                    <button key={i} onClick={() => kiesStad(s)}
                      style={{display:'block',width:'100%',textAlign:'left',padding:'10px 14px',background:'none',border:'none',color:G.goudBleek,cursor:'pointer',borderBottom:i<suggesties.length-1?`0.5px solid ${G.rand}`:'none',fontFamily:"'Crimson Pro', serif",fontSize:14}}
                      onMouseEnter={e=>(e.currentTarget.style.background=G.accent)} onMouseLeave={e=>(e.currentTarget.style.background='none')}>
                      {s.naam}{s.land && <span style={{color:'rgba(245,237,216,0.4)',fontSize:12,marginLeft:8}}>{s.land}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              {label('GEBOORTEDATUM')}
              <input type="date" style={invoerStijl} value={form.datum} onChange={e => setForm(f => ({...f,datum:e.target.value}))} />
            </div>
            <div>
              {label('GEBOORTETIJD', '— zo nauwkeurig mogelijk')}
              <input type="time" style={invoerStijl} value={form.tijd} onChange={e => setForm(f => ({...f,tijd:e.target.value}))} />
            </div>
          </div>
          {fout && <p style={{color:'#FF6B6B',fontSize:14,margin:'0 0 1rem'}}>{fout}</p>}
          <button onClick={bereken} disabled={laden} style={{width:'100%',background:laden?'rgba(184,134,11,0.4)':G.goud,color:G.bg,border:'none',borderRadius:10,padding:'12px',fontFamily:"'Cinzel', serif",fontSize:13,letterSpacing:'0.12em',cursor:laden?'default':'pointer',transition:'all 0.18s'}}>
            {laden ? 'Berekenen via Swiss Ephemeris...' : 'BEREKEN GEBOORTEHOROSCOOP'}
          </button>
        </div>

        {/* Resultaat */}
        {resultaat && (
          <div>
            {/* Info + tabs */}
            <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
              <div style={{fontFamily:"'Cinzel', serif",fontSize:18,color:G.goud}}>{resultaat.naam}</div>
              <div style={{fontSize:13,color:'rgba(245,237,216,0.5)',marginTop:'0.3rem'}}>
                {resultaat.geboortedatum} · {resultaat.geboortetijd} · {resultaat.geboorteplaats} · {resultaat.tijdzone}
              </div>
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',marginTop:'1.2rem',flexWrap:'wrap'}}>
                {(['kern','planeten','aspecten','huizen'] as const).map(t => (
                  <button key={t} style={tabStijl(t)} onClick={() => setActieveTab(t)}>
                    {t==='kern'?'De Drie Kernpunten':t==='planeten'?'Alle Planeten':t==='aspecten'?'Aspecten':' De 12 Huizen'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── TAB: KERN ── */}
            {actieveTab==='kern' && (
              <div style={{display:'grid',gap:'1.5rem'}}>
                {[
                  {key:'zon',      label:'ZON ☉',       sub:'Jouw identiteit & levensdoel',    kleur:'#FFD700', planeetNaam:'Zon'},
                  {key:'maan',     label:'MAAN ☽',      sub:'Jouw emoties & innerlijk leven',   kleur:'#C0C0E0', planeetNaam:'Maan'},
                  {key:'ascendant',label:'ASCENDANT ↑',  sub:'Hoe anderen jou als eerste zien',  kleur:G.goud,    planeetNaam:'Ascendant'},
                ].map(({key,label:lbl,sub,kleur,planeetNaam}) => {
                  const data = resultaat.kern[key as keyof typeof resultaat.kern];
                  const interpretatie = PLANEET_IN_TEKEN[planeetNaam]?.[data.teken];
                  return (
                    <div key={key} style={{background:G.bg2,border:`0.5px solid ${G.rand}`,borderRadius:16,padding:'2rem',display:'grid',gridTemplateColumns:'180px 1fr',gap:'2rem',alignItems:'start'}}>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontFamily:"'Cinzel', serif",fontSize:9,letterSpacing:'0.12em',color:kleur,opacity:0.8,marginBottom:'0.8rem'}}>{lbl}</div>
                        <div style={{fontSize:44}}>{data.symbool}</div>
                        <div style={{fontFamily:"'Cinzel', serif",fontSize:16,color:kleur,marginTop:'0.5rem',letterSpacing:'0.08em'}}>{data.teken}</div>
                        <div style={{fontSize:12,color:'rgba(245,237,216,0.4)',marginTop:'0.3rem'}}>{data.graad}°</div>
                        <div style={{fontSize:11,color:'rgba(245,237,216,0.3)',marginTop:'0.3rem'}}>{sub}</div>
                      </div>
                      <div style={{borderLeft:`0.5px solid ${G.rand}`,paddingLeft:'2rem'}}>
                        {interpretatie
                          ? <p style={{fontSize:15,lineHeight:1.85,color:'rgba(245,237,216,0.9)',margin:0}}>{interpretatie}</p>
                          : <p style={{color:'rgba(245,237,216,0.4)',fontSize:14}}>Geen interpretatie beschikbaar.</p>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TAB: PLANETEN ── */}
            {actieveTab==='planeten' && (
              <div style={{display:'grid',gap:'0.8rem'}}>
                {resultaat.planeten.map(p => {
                  const interp = PLANEET_IN_TEKEN[p.naam]?.[p.teken];
                  const huis = p.huis ? resultaat.huizen.find(h => h.huis===p.huis) : null;
                  const huisInfo = p.huis ? HUIZEN[p.huis] : null;
                  return (
                    <details key={p.naam} style={{background:G.bg2,border:`0.5px solid ${G.rand}`,borderRadius:12,overflow:'hidden'}}>
                      <summary style={{padding:'1rem 1.2rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'1rem',listStyle:'none'}}>
                        <span style={{fontFamily:"'Cinzel', serif",fontSize:12,color:PLANEET_KLEUR[p.naam]??G.goudBleek,minWidth:100,letterSpacing:'0.06em'}}>
                          {p.naam}{p.retrograde && <span style={{fontSize:10,opacity:0.6,marginLeft:4}}>℞</span>}
                        </span>
                        <span style={{fontSize:22}}>{p.symbool}</span>
                        <span style={{fontSize:14,color:G.goudBleek}}>{p.teken}</span>
                        <span style={{fontSize:12,color:'rgba(245,237,216,0.4)',marginLeft:'auto'}}>{p.graad}°{huis?` · Huis ${p.huis}`:''}</span>
                        <span style={{fontSize:12,color:'rgba(245,237,216,0.3)'}}>▾</span>
                      </summary>
                      <div style={{padding:'0 1.2rem 1.2rem',borderTop:`0.5px solid ${G.rand}`}}>
                        <div style={{paddingTop:'1rem'}}>
                          {interp && <p style={{fontSize:14,lineHeight:1.8,color:'rgba(245,237,216,0.85)',margin:'0 0 0.8rem'}}>{interp}</p>}
                          {huisInfo && (
                            <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'0.8rem 1rem',fontSize:13,color:'rgba(245,237,216,0.6)'}}>
                              <span style={{color:G.goud,fontFamily:"'Cinzel', serif",fontSize:10,letterSpacing:'0.06em'}}>HUIS {p.huis} — {huisInfo.naam.toUpperCase()}</span>
                              <br/>{huisInfo.thema}
                            </div>
                          )}
                          {!interp && !huisInfo && <p style={{color:'rgba(245,237,216,0.4)',fontSize:13}}>Dit is een generationele planeet — de invloed is collectief en subtiel.</p>}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            )}

            {/* ── TAB: ASPECTEN ── */}
            {actieveTab==='aspecten' && (
              <div>
                <div style={{background:G.bg2,border:`0.5px solid ${G.rand}`,borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                  {sectieHeader('Wat zijn aspecten?')}
                  <p style={{fontSize:14,lineHeight:1.8,color:'rgba(245,237,216,0.75)',margin:0}}>
                    Aspecten zijn de hoeken tussen planeten in jouw chart. Ze laten zien hoe de energieën van planeten samenwerken of botsen — en bepalen voor een groot deel jouw karakter, uitdagingen en talenten. Een klein orbit betekent een sterk, nauwkeurig aspect.
                  </p>
                  <div style={{display:'flex',gap:'0.8rem',marginTop:'1rem',flexWrap:'wrap'}}>
                    {Object.values(ASPECT_TYPES).map(a => (
                      <span key={a.naam} style={{padding:'3px 10px',borderRadius:10,border:`0.5px solid ${a.kleur}44`,background:`${a.kleur}15`,color:a.kleur,fontSize:11,fontFamily:"'Cinzel', serif",letterSpacing:'0.06em'}}>
                        {a.naam} {a.hoek}°
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gap:'0.6rem'}}>
                  {resultaat.aspecten.length === 0 && (
                    <p style={{color:'rgba(245,237,216,0.4)',textAlign:'center'}}>Geen aspecten berekend.</p>
                  )}
                  {resultaat.aspecten.map((a,i) => {
                    const aspInfo = ASPECT_TYPES[a.type_nl?.toLowerCase()] ?? ASPECT_TYPES[a.type?.toLowerCase()] ?? null;
                    const tekst = aspectTekst(a.planeet1, a.type_nl || a.type, a.planeet2);
                    return (
                      <div key={i} style={{background:G.bg2,border:`0.5px solid ${aspInfo?.kleur??G.rand}22`,borderLeft:`3px solid ${aspInfo?.kleur??G.goud}`,borderRadius:10,padding:'0.9rem 1.2rem',display:'grid',gridTemplateColumns:'1fr auto',gap:'1rem',alignItems:'center'}}>
                        <div>
                          <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.4rem'}}>
                            <span style={{fontFamily:"'Cinzel', serif",fontSize:12,color:PLANEET_KLEUR[a.planeet1]??G.goudBleek}}>{a.planeet1}</span>
                            <span style={{color:aspInfo?.kleur??G.goud,fontSize:13,fontWeight:700}}>{a.type_nl}</span>
                            <span style={{fontFamily:"'Cinzel', serif",fontSize:12,color:PLANEET_KLEUR[a.planeet2]??G.goudBleek}}>{a.planeet2}</span>
                          </div>
                          {tekst && <div style={{fontSize:13,color:'rgba(245,237,216,0.65)',lineHeight:1.6}}>{tekst}</div>}
                          {aspInfo && <div style={{fontSize:11,color:'rgba(245,237,216,0.35)',marginTop:'0.3rem'}}>{aspInfo.beschrijving}</div>}
                        </div>
                        <div style={{textAlign:'right',minWidth:70}}>
                          <div style={{fontFamily:"'Cinzel', serif",fontSize:11,color:aspInfo?.kleur??G.goud}}>{a.hoek}°</div>
                          <div style={{fontSize:11,color:'rgba(245,237,216,0.35)'}}>orbit {a.orbit}°</div>
                          <div style={{fontSize:10,color:'rgba(245,237,216,0.25)',marginTop:'0.2rem'}}>{aspInfo?.energie}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TAB: HUIZEN ── */}
            {actieveTab==='huizen' && (
              <div style={{display:'grid',gap:'0.7rem'}}>
                {resultaat.huizen.map(h => {
                  const info = HUIZEN[h.huis];
                  const planeten = resultaat.planeten.filter(p => p.huis===h.huis);
                  return (
                    <div key={h.huis} style={{background:G.bg2,border:`0.5px solid ${G.rand}`,borderRadius:12,padding:'1.2rem 1.5rem'}}>
                      <div style={{display:'grid',gridTemplateColumns:'60px 1fr',gap:'1rem',alignItems:'start'}}>
                        <div style={{textAlign:'center'}}>
                          <div style={{fontFamily:"'Cinzel', serif",fontSize:9,color:G.goud,opacity:0.7}}>HUIS</div>
                          <div style={{fontFamily:"'Cinzel', serif",fontSize:22,color:G.goud}}>{h.huis}</div>
                          <div style={{fontSize:20}}>{h.symbool}</div>
                          <div style={{fontSize:11,color:'rgba(245,237,216,0.5)'}}>{h.teken}</div>
                        </div>
                        <div>
                          <div style={{fontFamily:"'Cinzel', serif",fontSize:12,color:G.goudBleek,letterSpacing:'0.06em',marginBottom:'0.3rem'}}>{info?.naam}</div>
                          <div style={{fontSize:12,color:G.goud,marginBottom:'0.5rem',opacity:0.8}}>{info?.thema}</div>
                          <div style={{fontSize:13,color:'rgba(245,237,216,0.7)',lineHeight:1.7}}>{info?.beschrijving}</div>
                          {planeten.length>0 && (
                            <div style={{marginTop:'0.6rem',display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                              {planeten.map(p => (
                                <span key={p.naam} style={{fontSize:11,padding:'2px 8px',borderRadius:8,background:`${PLANEET_KLEUR[p.naam]??G.goud}22`,border:`0.5px solid ${PLANEET_KLEUR[p.naam]??G.goud}44`,color:PLANEET_KLEUR[p.naam]??G.goudBleek}}>
                                  {p.naam} {p.symbool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* Gerelateerde tools */}
        <div style={{ borderTop: '0.5px solid rgba(184,134,11,0.15)', paddingTop: '1.25rem', paddingBottom: '2rem', marginTop: '0.5rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { to: '/sterrenbeelden', label: 'Sterrenbeelden' },
              { to: '/maanfase', label: 'Maanfase' },
              { to: '/cursus/module-06', label: 'Cursus: Planeten' },
              { to: '/cursus/module-04', label: 'Cursus: Sterrenbeelden' },
            ].map(l => (
              <a key={l.to} href={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChartPage;
