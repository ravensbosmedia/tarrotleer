import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { haalAlleVoortgang, haalQuizStats, pctGoed, verwijderVoortgang, QuizResultaat, QuizStat, VoortgangItem, OpgeslagenLegging } from '../lib/voortgang';
import { tarotLesTitels } from './LessenPage';
import { pendelLessen, pendelVideos } from '../data/pendel/lessen';
import { lenormandKaarten } from '../data/lenormand/kaarten';
import { useAccount } from '../lib/account';
import { VragenTabel } from '../components/VragenTabel';
import { laadCombinaties } from '../data/lenormand/combinaties';
import { aantalMogelijkeVragen, niveauVan } from '../data/lenormand/quizGenerator';
import { pendelQuizVragen } from '../data/pendel/quiz';

const NIVEAU_LABEL = { beginner: '1 Beginner', gevorderd: '2 Gevorderd', pro: '3 Pro' } as const;

/** Niveau + soort vraag uit de vaste vraagcode, bv. 'vraag:combi-paar:14-34' → '2 Gevorderd · Combinaties'. */
function lenormandGroep(sleutel: string): string {
  const soort = sleutel.split(':')[1] || '';
  const naam = soort.startsWith('combi') ? 'Combinaties'
    : soort.includes('nummer') ? 'Nummers'
    : soort.includes('woord') ? 'Sleutelwoorden'
    : soort.startsWith('omschrijving') ? 'Omschrijvingen'
    : soort === 'basis' ? 'Basiskennis'
    : 'Liefde, werk, gezondheid';
  return `${NIVEAU_LABEL[niveauVan(sleutel)]} · ${naam}`;
}

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8',
  bg: '#1A1209', bg2: '#2C2416', bg3: '#3A2E1C', rand: 'rgba(184,134,11,0.25)',
  tekst2: 'rgba(245,237,216,0.72)', tekst3: 'rgba(245,237,216,0.5)',
};

// Beheersing per kaart/vraag: label + kleur (kleur is nooit de enige aanwijzing; het % staat erbij)
const NIVEAU = {
  sterk:    { label: 'Sterk',      kleur: '#5FA777' },
  redelijk: { label: 'Redelijk',   kleur: '#C9A227' },
  zwak:     { label: 'Oefenen',    kleur: '#C8604F' },
  nieuw:    { label: 'Nog niet gevraagd', kleur: 'rgba(245,237,216,0.18)' },
};
function niveau(pct: number | null): keyof typeof NIVEAU {
  if (pct === null) return 'nieuw';
  return pct >= 80 ? 'sterk' : pct >= 50 ? 'redelijk' : 'zwak';
}

const SOORT_LABEL: Record<string, string> = {
  nummer: 'Nummers', sleutelwoord: 'Sleutelwoorden', betekenis: 'Omschrijvingen',
  levensgebied: 'Liefde, werk, gezondheid', combinatie: 'Combinaties', basis: 'Basiskennis',
  betekenis_tarot: 'Betekenis raden', naam: 'Naam raden',
};

const MODULES = [
  { id: 'module-01', naam: 'Getallen', groep: 'Numerologie' },
  { id: 'module-02', naam: 'Naam', groep: 'Numerologie' },
  { id: 'module-03', naam: 'Letters', groep: 'Numerologie' },
  { id: 'module-04', naam: 'Sterrenbeelden', groep: 'Astrologie' },
  { id: 'module-05', naam: 'Maanfasen', groep: 'Astrologie' },
  { id: 'module-06', naam: 'Planeten', groep: 'Astrologie' },
  { id: 'module-07', naam: 'Compatibiliteit', groep: 'Astrologie' },
  { id: 'module-08', naam: 'Synthese', groep: 'Afronding' },
];
const AFGEROND_PCT = 70;

const kop: React.CSSProperties = { fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.12em', color: G.goud, margin: '0 0 1rem' };
const kaart: React.CSSProperties = { background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 16, padding: '1.4rem', marginBottom: '1.2rem' };

const Tegel: React.FC<{ waarde: string; label: string; sub?: string }> = ({ waarde, label, sub }) => (
  <div style={{ background: G.bg3, borderRadius: 12, padding: '0.9rem 1rem', minWidth: 0 }}>
    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, color: G.goudBleek, lineHeight: 1.1 }}>{waarde}</div>
    <div style={{ fontSize: 14, color: G.tekst2, marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: G.tekst3, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Tegels: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.7rem', marginBottom: '1.2rem' }}>{children}</div>
);

/** Horizontale balk met het percentage erbij (één kleur: het gaat om hoeveel). */
const Balk: React.FC<{ label: string; stat: QuizStat }> = ({ label, stat }) => {
  const pct = pctGoed(stat) ?? 0;
  return (
    <div style={{ marginBottom: '0.6rem' }} title={`${stat.goed} goed, ${stat.fout} fout`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: G.tekst2, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color: G.goudBleek }}>{pct}% <span style={{ color: G.tekst3 }}>({stat.goed + stat.fout})</span></span>
      </div>
      <div style={{ height: 6, background: G.bg3, borderRadius: 4 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: G.goud, borderRadius: 4 }} />
      </div>
    </div>
  );
};

/** Lijstje van de zwakste of sterkste onderdelen (minstens 2 keer gevraagd). */
function topLijst(stats: QuizStat[], prefix: string, richting: 'zwak' | 'sterk', n = 5): QuizStat[] {
  return stats
    .filter((s) => s.sleutel.startsWith(prefix) && s.goed + s.fout >= 2)
    .sort((a, b) => {
      const d = (pctGoed(a) ?? 0) - (pctGoed(b) ?? 0);
      return richting === 'zwak' ? d || b.fout - a.fout : -d || b.goed - a.goed;
    })
    .filter((s) => richting === 'zwak' ? (pctGoed(s) ?? 100) < 80 : (pctGoed(s) ?? 0) >= 80)
    .slice(0, n);
}

const Lijst: React.FC<{ titel: string; items: QuizStat[]; leeg: string }> = ({ titel, items, leeg }) => (
  <div>
    <div style={{ fontSize: 13, color: G.tekst3, marginBottom: 6 }}>{titel}</div>
    {items.length === 0 ? (
      <div style={{ fontSize: 14, color: G.tekst3, fontStyle: 'italic' }}>{leeg}</div>
    ) : items.map((s) => (
      <div key={s.sleutel} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 15, padding: '3px 0', borderBottom: `0.5px solid ${G.rand}` }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
        <span style={{ color: G.tekst2, flexShrink: 0 }}>{pctGoed(s)}% <span style={{ color: G.tekst3 }}>({s.goed}/{s.goed + s.fout})</span></span>
      </div>
    ))}
  </div>
);

const pct = (r: QuizResultaat | undefined) =>
  r && r.totaal_vragen ? `${Math.round((r.totaal_goed / r.totaal_vragen) * 100)}%` : '—';

/** Eén opgeslagen legging: inklapbaar, met kaarten, duiding en verwijderknop. */
const LeggingRij: React.FC<{ legging: OpgeslagenLegging; onVerwijder: () => void }> = ({ legging, onVerwijder }) => {
  const [open, setOpen] = useState(false);
  const datum = new Date(legging.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '0.8rem 0' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', background: 'none', border: 'none', color: G.goudBleek, textAlign: 'left', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <span style={{ fontSize: 17 }}>
            <span style={{ color: G.goud, marginRight: 8 }}>{open ? '▾' : '▸'}</span>
            {legging.legging} <span style={{ color: G.tekst3, fontSize: 13 }}>· {legging.soort === 'tarot' ? 'Tarot' : 'Lenormand'}</span>
          </span>
          <span style={{ fontSize: 13, color: G.tekst3 }}>{datum}</span>
        </div>
        <div style={{ fontSize: 14, color: G.tekst2, marginTop: 3, paddingLeft: 20 }}>
          {legging.vraag ? <>„{legging.vraag}” · </> : null}{legging.kaarten.map((k) => k.naam).join(', ')}
        </div>
      </button>
      {open && (
        <div style={{ paddingLeft: 20, marginTop: '0.8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6, marginBottom: '0.8rem' }}>
            {legging.kaarten.map((k, i) => (
              <div key={i} style={{ background: G.bg3, borderRadius: 8, padding: '6px 10px', fontSize: 14 }}>
                <div style={{ color: G.tekst3, fontSize: 12 }}>{i + 1}. {k.positie}</div>
                <div>{k.naam}{k.omgekeerd ? ' (omgekeerd)' : ''}</div>
              </div>
            ))}
          </div>
          {legging.duidingPerKaart?.length ? (
            <div style={{ marginBottom: '0.8rem' }}>
              {legging.duidingPerKaart.map((t, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.65, color: G.tekst2, margin: '0 0 0.6rem', whiteSpace: 'pre-wrap' }}>{t}</p>
              ))}
            </div>
          ) : null}
          {legging.verbindingen?.length ? (
            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ fontSize: 13, color: G.tekst3, marginBottom: 4 }}>Verbindingen</div>
              {legging.verbindingen.map((t, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: G.tekst2, margin: '0 0 0.4rem' }}>
                  {legging.kaarten[i]?.naam} + {legging.kaarten[i + 1]?.naam}: {t}
                </p>
              ))}
            </div>
          ) : null}
          {legging.duiding && (
            <p style={{ fontSize: 15, lineHeight: 1.7, color: G.goudBleek, margin: '0 0 0.8rem', whiteSpace: 'pre-wrap' }}>{legging.duiding}</p>
          )}
          <button
            onClick={() => { if (window.confirm('Deze legging verwijderen?')) onVerwijder(); }}
            style={{ background: 'none', border: `0.5px solid ${G.rand}`, color: G.tekst3, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}
          >
            Verwijderen
          </button>
        </div>
      )}
    </div>
  );
};

/** Flashcards: hoeveel kaarten geoefend, hoeveel je kent, en welke nog oefenen. */
const FlashcardBlok: React.FC<{ titel: string; stats: QuizStat[]; totaal: number; link: string }> = ({ titel, stats, totaal, link }) => {
  const kaarten = stats.filter((s) => s.sleutel.startsWith('kaart:'));
  const bekend = kaarten.filter((s) => (pctGoed(s) ?? 0) >= 80).length;
  const oefenen = kaarten.filter((s) => (pctGoed(s) ?? 100) < 50)
    .sort((a, b) => (pctGoed(a) ?? 0) - (pctGoed(b) ?? 0) || b.fout - a.fout).slice(0, 8);
  return (
    <div>
      <div style={{ fontSize: 15, color: G.goudBleek, marginBottom: 6 }}>{titel}</div>
      <Tegels>
        <Tegel waarde={`${kaarten.length}/${totaal}`} label="kaarten geoefend" />
        <Tegel waarde={String(bekend)} label="ken je goed" sub="80% of vaker ‘ken ik’" />
        <Tegel waarde={String(kaarten.reduce((n, s) => n + s.goed + s.fout, 0))} label="keer geoefend" />
      </Tegels>
      {oefenen.length > 0 && (
        <p style={{ fontSize: 14, color: G.tekst2, margin: '0 0 0.4rem' }}>
          <span style={{ color: G.tekst3 }}>Nog oefenen:</span> {oefenen.map((s) => s.label).join(', ')}
        </p>
      )}
      <p style={{ margin: '0 0 1.2rem', fontSize: 14 }}><Link to={link} style={{ color: G.goud }}>Naar de flashcards →</Link></p>
    </div>
  );
};

/** Lessen: x van y gelezen, met de nog niet gelezen lessen inklapbaar. */
const LessenBlok: React.FC<{ titel: string; lessen: { id: string; titel: string }[]; klaar: Set<string>; link: string; woord?: string }> = ({ titel, lessen, klaar, link, woord = 'gelezen' }) => {
  const aantal = lessen.filter((l) => klaar.has(l.id)).length;
  const open = lessen.filter((l) => !klaar.has(l.id));
  const p = lessen.length ? Math.round((aantal / lessen.length) * 100) : 0;
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 4 }}>
        <Link to={link} style={{ color: G.goudBleek, textDecoration: 'none' }}>{titel}</Link>
        <span style={{ color: G.tekst2 }}>{aantal} van {lessen.length} {woord} · <span style={{ color: G.goudBleek }}>{p}%</span></span>
      </div>
      <div style={{ height: 6, background: G.bg3, borderRadius: 4 }}>
        <div style={{ width: `${p}%`, height: '100%', background: G.goud, borderRadius: 4 }} />
      </div>
      {open.length > 0 && aantal > 0 && (
        <details style={{ marginTop: 6 }}>
          <summary style={{ cursor: 'pointer', fontSize: 13, color: G.tekst3 }}>Nog te doen ({open.length})</summary>
          <div style={{ fontSize: 14, color: G.tekst2, marginTop: 4, lineHeight: 1.6 }}>{open.map((l) => l.titel).join(' · ')}</div>
        </details>
      )}
    </div>
  );
};

export const VoortgangPage: React.FC = () => {
  const { lid } = useAccount();
  const [items, setItems] = useState<VoortgangItem[] | null>(null);
  const [stats, setStats] = useState<QuizStat[]>([]);
  const [lenormandTotaal, setLenormandTotaal] = useState<number | undefined>();

  useEffect(() => {
    Promise.all([haalAlleVoortgang(), haalQuizStats()]).then(([v, s]) => { setItems(v); setStats(s); });
    laadCombinaties().then((c) => setLenormandTotaal(aantalMogelijkeVragen(c))).catch(() => {});
  }, []);

  const res = useMemo(() => {
    const m: Record<string, QuizResultaat> = {};
    (items || []).filter((i) => i.item === 'resultaat').forEach((i) => { m[i.onderdeel] = i.data as unknown as QuizResultaat; });
    return m;
  }, [items]);

  const per = (onderdeel: string) => stats.filter((s) => s.onderdeel === onderdeel);
  const lenormand = per('lenormand-quiz');
  const tarot = per('tarot-quiz');
  const pendel = per('pendel-quiz');
  const lenKaart = new Map(lenormand.filter((s) => s.sleutel.startsWith('kaart:')).map((s) => [s.sleutel, s]));
  const klaarIn = (onderdeel: string) => new Set((items || []).filter((i) => i.onderdeel === onderdeel).map((i) => i.item));
  const leggingen = (items || [])
    .filter((i) => i.onderdeel === 'leggingen')
    .map((i) => ({ id: i.item, legging: i.data as unknown as OpgeslagenLegging }))
    .sort((a, b) => b.legging.datum.localeCompare(a.legging.datum));
  const lessenGelezen = klaarIn('tarot-lessen').size + klaarIn('pendel-lessen').size;

  const verwijderLegging = async (id: string) => {
    setItems((l) => (l || []).filter((i) => !(i.onderdeel === 'leggingen' && i.item === id)));
    await verwijderVoortgang('leggingen', id);
  };

  // Link "Mijn voortgang#leggingen" springt naar de leggingen zodra de pagina geladen is
  useEffect(() => {
    if (items && window.location.hash === '#leggingen') document.getElementById('leggingen')?.scrollIntoView({ behavior: 'smooth' });
  }, [items]);

  const alleRes = Object.values(res);
  const totaalVragen = alleRes.reduce((a, r) => a + (r.totaal_vragen || 0), 0);
  const totaalGoed = alleRes.reduce((a, r) => a + (r.totaal_goed || 0), 0);
  const modulesAf = MODULES.filter((m) => (res[`cursus-${m.id}`]?.beste_pct || 0) >= AFGEROND_PCT).length;
  const lenGeoefend = [...lenKaart.values()].length;

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'Crimson Pro', serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, letterSpacing: '0.15em', color: G.goud, textAlign: 'center', margin: '0 0 0.4rem' }}>
          MIJN VOORTGANG
        </h1>
        <p style={{ textAlign: 'center', color: G.tekst3, margin: '0 0 2rem', fontSize: 15 }}>
          {lid ? `${lid.naam} — ` : ''}wat gaat goed en wat verdient nog aandacht
        </p>

        {!items ? (
          <p style={{ textAlign: 'center', color: G.tekst3 }}>Laden…</p>
        ) : (
          <>
            <Tegels>
              <Tegel waarde={String(totaalVragen)} label="vragen beantwoord" />
              <Tegel waarde={totaalVragen ? `${Math.round((totaalGoed / totaalVragen) * 100)}%` : '—'} label="goed beantwoord" />
              <Tegel waarde={`${modulesAf}/${MODULES.length}`} label="cursusmodules afgerond" sub={`vanaf ${AFGEROND_PCT}% in de quiz`} />
              <Tegel waarde={`${lenGeoefend}/36`} label="Lenormand-kaarten geoefend" />
              <Tegel waarde={String(lessenGelezen)} label="lessen afgerond" sub="tarot + pendel" />
              <Tegel waarde={String(leggingen.length)} label="leggingen bewaard" />
            </Tegels>

            {/* ── Cursus ── */}
            <div style={kaart}>
              <h2 style={kop}>CURSUS</h2>
              {MODULES.map((m, i) => {
                const r = res[`cursus-${m.id}`];
                const af = (r?.beste_pct || 0) >= AFGEROND_PCT;
                const fout = topLijst(per(`cursus-${m.id}`), 'vraag:', 'zwak', 3);
                return (
                  <div key={m.id} style={{ padding: '0.7rem 0', borderBottom: i < MODULES.length - 1 ? `0.5px solid ${G.rand}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <Link to={`/cursus/${m.id}`} style={{ color: G.goudBleek, textDecoration: 'none', fontSize: 17 }}>
                        <span style={{ color: af ? NIVEAU.sterk.kleur : G.tekst3, marginRight: 8 }}>{af ? '✓' : '○'}</span>
                        Module {i + 1}: {m.naam} <span style={{ color: G.tekst3, fontSize: 13 }}>· {m.groep}</span>
                      </Link>
                      <span style={{ fontSize: 14, color: G.tekst2 }}>
                        {r ? <>beste {r.beste_score ? `${r.beste_score.score}/${r.beste_score.totaal}` : `${r.beste_pct}%`} · {r.rondes}× gemaakt{af ? ' · afgerond' : ''}</> : 'quiz nog niet gemaakt'}
                      </span>
                    </div>
                    {fout.length > 0 && (
                      <div style={{ fontSize: 13, color: G.tekst3, marginTop: 4, paddingLeft: 22 }}>
                        Vaak fout: {fout.map((s) => `„${s.label.length > 70 ? s.label.slice(0, 70) + '…' : s.label}”`).join(' · ')}
                      </div>
                    )}
                  </div>
                );
              })}
              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', color: G.goud, fontSize: 15 }}>Alle cursusvragen bekijken</summary>
                <div style={{ marginTop: '0.8rem' }}>
                  <VragenTabel
                    vragen={stats.filter((x) => x.onderdeel.startsWith('cursus-') && x.sleutel.startsWith('vraag:'))
                      .map((x) => ({ ...x, sleutel: `${x.onderdeel}|${x.sleutel}` }))}
                    groep={(k) => { const i = MODULES.findIndex((m) => k.startsWith(`cursus-${m.id}|`)); return i >= 0 ? `Module ${i + 1}: ${MODULES[i].naam}` : 'Overig'; }}
                  />
                </div>
              </details>
            </div>

            {/* ── Lenormand ── */}
            <div style={kaart}>
              <h2 style={kop}>LENORMAND-QUIZ</h2>
              <Tegels>
                <Tegel waarde={String(res['lenormand-quiz']?.rondes || 0)} label="rondes gespeeld" />
                <Tegel waarde={res['lenormand-quiz'] ? `${res['lenormand-quiz'].beste_pct}%` : '—'} label="beste ronde" />
                <Tegel waarde={pct(res['lenormand-quiz'])} label="gemiddeld goed" />
              </Tegels>

              <div style={{ fontSize: 13, color: G.tekst3, marginBottom: 8 }}>Per kaart</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 6, marginBottom: '0.8rem' }}>
                {lenormandKaarten.map((k) => {
                  const s = lenKaart.get(`kaart:${k.id}`);
                  const p = s ? pctGoed(s) : null;
                  const n = NIVEAU[niveau(p)];
                  return (
                    <div key={k.id} title={s ? `${k.naam}: ${s.goed} goed, ${s.fout} fout` : `${k.naam}: nog niet gevraagd`} style={{
                      background: G.bg3, borderRadius: 8, padding: '6px 8px', borderLeft: `4px solid ${n.kleur}`,
                    }}>
                      <div style={{ fontSize: 12, color: G.tekst3 }}>{k.id} {k.symbool}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.naam.replace(/^(De|Het) /, '')}</div>
                      <div style={{ fontSize: 13, color: p === null ? G.tekst3 : G.goudBleek }}>{p === null ? '—' : `${p}%`}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: 13, color: G.tekst2, marginBottom: '1.2rem' }}>
                {Object.values(NIVEAU).map((n) => (
                  <span key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: n.kleur, display: 'inline-block' }} />{n.label}
                  </span>
                ))}
                <span style={{ color: G.tekst3 }}>sterk ≥ 80%, oefenen &lt; 50%</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.4rem' }}>
                <div>
                  {lenormand.some((x) => x.sleutel.startsWith('niveau:')) && (
                    <>
                      <div style={{ fontSize: 13, color: G.tekst3, marginBottom: 8 }}>Per niveau</div>
                      {(['beginner', 'gevorderd', 'pro'] as const).map((n) => {
                        const st = lenormand.find((x) => x.sleutel === `niveau:${n}`);
                        return st ? <Balk key={n} label={NIVEAU_LABEL[n].slice(2)} stat={st} /> : null;
                      })}
                      <div style={{ height: 12 }} />
                    </>
                  )}
                  <div style={{ fontSize: 13, color: G.tekst3, marginBottom: 8 }}>Per soort vraag</div>
                  {lenormand.filter((s) => s.sleutel.startsWith('soort:')).sort((a, b) => (pctGoed(b) ?? 0) - (pctGoed(a) ?? 0)).map((s) => (
                    <Balk key={s.sleutel} label={SOORT_LABEL[s.label] || s.label} stat={s} />
                  ))}
                  {!lenormand.some((s) => s.sleutel.startsWith('soort:')) && <div style={{ fontSize: 14, color: G.tekst3, fontStyle: 'italic' }}>Speel een ronde om dit te zien.</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Lijst titel="Hier mag je nog op oefenen" items={topLijst(lenormand, 'kaart:', 'zwak')} leeg="Nog niets — mooi zo, of nog te weinig gespeeld." />
                  <Lijst titel="Combinaties die lastig zijn" items={topLijst(lenormand, 'combi:', 'zwak', 4).length ? topLijst(lenormand, 'combi:', 'zwak', 4) : lenormand.filter((s) => s.sleutel.startsWith('combi:') && s.fout > 0).slice(0, 4)} leeg="Nog geen lastige combinaties." />
                </div>
              </div>
              <div style={{ marginTop: '1.6rem' }}>
                <div style={{ fontSize: 13, color: G.tekst3, marginBottom: 8 }}>Alle vragen</div>
                <VragenTabel vragen={lenormand.filter((x) => x.sleutel.startsWith('vraag:'))} totaalMogelijk={lenormandTotaal} groep={lenormandGroep} />
              </div>
              <p style={{ margin: '1rem 0 0', fontSize: 14 }}><Link to="/lenormand/quiz" style={{ color: G.goud }}>Naar de Lenormand-quiz →</Link></p>
            </div>

            {/* ── Tarot ── */}
            <div style={kaart}>
              <h2 style={kop}>TAROT-QUIZ</h2>
              <Tegels>
                <Tegel waarde={String(res['tarot-quiz']?.totaal_vragen || 0)} label="vragen beantwoord" />
                <Tegel waarde={pct(res['tarot-quiz'])} label="goed" />
                <Tegel waarde={`${tarot.filter((s) => s.sleutel.startsWith('kaart:')).length}/78`} label="kaarten geoefend" />
              </Tegels>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.4rem' }}>
                <Lijst titel="Hier mag je nog op oefenen" items={topLijst(tarot, 'kaart:', 'zwak')} leeg="Nog niets, of nog te weinig gespeeld." />
                <Lijst titel="Deze ken je goed" items={topLijst(tarot, 'kaart:', 'sterk')} leeg="Kaarten die je minstens 2× goed hebt, komen hier." />
              </div>
              <p style={{ margin: '1rem 0 0', fontSize: 14 }}><Link to="/quiz" style={{ color: G.goud }}>Naar de tarotquiz →</Link></p>
            </div>

            {/* ── Pendel ── */}
            <div style={kaart}>
              <h2 style={kop}>PENDELQUIZ</h2>
              <Tegels>
                <Tegel waarde={String(res['pendel-quiz']?.rondes || 0)} label="rondes gespeeld" />
                <Tegel waarde={res['pendel-quiz'] ? `${res['pendel-quiz'].beste_pct}%` : '—'} label="beste ronde" />
                <Tegel waarde={pct(res['pendel-quiz'])} label="gemiddeld goed" />
              </Tegels>
              <VragenTabel vragen={pendel.filter((x) => x.sleutel.startsWith('vraag:'))} totaalMogelijk={pendelQuizVragen.length} />
              <p style={{ margin: '1rem 0 0', fontSize: 14 }}><Link to="/pendel/quiz" style={{ color: G.goud }}>Naar de pendelquiz →</Link></p>
            </div>

            {/* ── Flashcards ── */}
            <div style={kaart}>
              <h2 style={kop}>FLASHCARDS</h2>
              <FlashcardBlok titel="Tarot" stats={per('tarot-flashcards')} totaal={78} link="/flashcards" />
              <FlashcardBlok titel="Lenormand" stats={per('lenormand-flashcards')} totaal={36} link="/lenormand/flashcards" />
            </div>

            {/* ── Lessen ── */}
            <div style={kaart}>
              <h2 style={kop}>LESSEN</h2>
              <LessenBlok titel="Tarotlessen" lessen={tarotLesTitels} klaar={klaarIn('tarot-lessen')} link="/lessen" />
              <LessenBlok titel="Pendellessen" lessen={pendelLessen.map((l) => ({ id: l.id, titel: l.titel }))} klaar={klaarIn('pendel-lessen')} link="/pendel/lessen" woord="voltooid" />
              <LessenBlok titel="Pendelvideo's" lessen={pendelVideos.map((v) => ({ id: v.id, titel: v.titel }))} klaar={klaarIn('pendel-videos')} link="/pendel/lessen" woord="bekeken" />
            </div>

            {/* ── Opgeslagen leggingen ── */}
            <div style={kaart} id="leggingen">
              <h2 style={kop}>MIJN LEGGINGEN</h2>
              {leggingen.length === 0 ? (
                <p style={{ fontSize: 15, color: G.tekst3, fontStyle: 'italic', margin: 0 }}>
                  Nog geen leggingen bewaard. Leg een <Link to="/tarot" style={{ color: G.goud }}>tarotlegging</Link> of{' '}
                  <Link to="/lenormand/leggingen" style={{ color: G.goud }}>Lenormand-legging</Link> en klik op „Bewaar legging”.
                </p>
              ) : leggingen.map((l) => (
                <LeggingRij key={l.id} legging={l.legging} onVerwijder={() => verwijderLegging(l.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
