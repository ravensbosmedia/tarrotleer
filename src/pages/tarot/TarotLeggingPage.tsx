// Tarot-leggingen in dezelfde opbouw en stijl als de Lenormand-leggingen (Zen Flow):
// spreiding kiezen → vraag → schudden (of zelf kiezen) → kaarten één voor één omdraaien
// → detail per kaart → duiding op verzoek → gesprek, bewaren, nieuwe lezing.
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { bewaarLegging } from '../../lib/voortgang';
import { getCards } from '../../config/localDB';
import { allCards as localCards } from '../../data/cards';
import { TarotCard as TarotKaart } from '../../types/cards';
import { TarotCard } from '../../components/TarotCard';
import { CelticCrossLayout } from '../../components/CelticCrossLayout';
import { CelticCrossBasicMeaning } from '../../components/CelticCrossBasicMeaning';
import { TarotAIInterpretation } from '../../components/TarotAIInterpretation';
import { TarotChat } from '../../components/TarotChat';
import { TarotBasics } from '../../components/TarotBasics';
import { TarotHistory } from '../../components/TarotHistory';
import { TarotInterpretation } from '../../components/TarotInterpretation';
import { TarotInterpretationGuide } from '../../components/TarotInterpretationGuide';
import { generatePDF } from '../../utils/pdfGenerator';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

// Zelfde kleurenset als de Lenormand-leggingen
const G = {
  goud: '#F1CB78', goudBleek: '#2D2040', goudDonker: '#E0B04A',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040',
  tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'DM Sans', sans-serif";
const klein: React.CSSProperties = { fontFamily: SERIF, fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase' };

type Soort = 'daily' | 'three' | 'celtic' | 'relationship' | 'career';
interface Spreiding { id: Soort; naam: string; beschrijving: string; aantal: number; posities: string[]; uitleg?: string[] }

const SPREIDINGEN: Spreiding[] = [
  { id: 'daily', naam: 'Dagkaart', beschrijving: 'Eén kaart als inspiratie voor je dag.', aantal: 1, posities: ['Dagkaart'] },
  { id: 'three', naam: 'Drie kaarten', beschrijving: 'Verleden, heden en toekomst.', aantal: 3, posities: ['Verleden', 'Heden', 'Toekomst'],
    uitleg: ['Ervaringen die je hebben gevormd en nog doorwerken.', 'Waar je nu staat en wat er nu speelt.', 'Waar de huidige koers naartoe kan gaan.'] },
  { id: 'relationship', naam: 'Relatielegging', beschrijving: 'Inzicht in je relatie of liefdesleven.', aantal: 5, posities: ['Jouw energie', 'Energie van de ander', 'Verbinding', 'Uitdagingen', 'Mogelijkheden'] },
  { id: 'career', naam: 'Werklegging', beschrijving: 'Richting voor je werk en loopbaan.', aantal: 4, posities: ['Huidige positie', 'Uitdagingen', 'Kansen', 'Beste pad vooruit'] },
  { id: 'celtic', naam: 'Keltisch kruis', beschrijving: 'Diepgaande legging voor een complexe vraag.', aantal: 10,
    posities: ['Huidige situatie', 'Uitdaging', 'Basis', 'Verleden', 'Kroon', 'Toekomst', 'Jouw houding', 'Externe invloeden', 'Hoop en vrees', 'Uiteindelijke uitkomst'],
    uitleg: ['De kern van je vraag of situatie', 'Wat je uitdaagt of tegenwerkt', 'De basis of oorsprong van de situatie', 'Recente invloeden uit het verleden',
      'Je beste mogelijkheid of wat je kunt bereiken', 'Waar de situatie naartoe gaat', 'Hoe je zelf in de situatie staat', 'Je omgeving en invloeden van buiten',
      'Je innerlijke gevoelens en verwachtingen', 'Het mogelijke eindresultaat'] },
];

const ARCANA: Record<string, string> = { major: 'Grote Arcana', wands: 'Staven', cups: 'Kelken', swords: 'Zwaarden', pentacles: 'Pentakels' };

function schud<T>(lijst: T[]): T[] {
  const kopie = [...lijst];
  for (let i = kopie.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [kopie[i], kopie[j]] = [kopie[j], kopie[i]]; }
  return kopie;
}

// ── Kaart (voorkant en rug) in Zen Flow-stijl ────────────────────────────────
const KaartRug: React.FC<{ breedte?: number }> = ({ breedte = 112 }) => (
  <div style={{
    width: breedte, height: Math.round(breedte * 1.7), borderRadius: Math.round(breedte * 0.08),
    background: 'linear-gradient(150deg, #2D2040, #17112C)', border: `1px solid ${G.goud}88`,
    boxShadow: 'inset 0 0 0 4px #17112C, inset 0 0 0 5px rgba(241,203,120,0.35), 0 4px 14px rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: G.goud, fontFamily: 'Georgia, serif',
    fontSize: Math.round(breedte * 0.36), transition: 'transform .18s', userSelect: 'none',
  }}>☾</div>
);

const KaartVoorkant: React.FC<{ kaart: TarotKaart; omgekeerd: boolean; breedte?: number; geselecteerd?: boolean; onClick?: () => void }> = ({ kaart, omgekeerd, breedte = 112, geselecteerd, onClick }) => (
  <div onClick={onClick} style={{
    width: breedte, height: Math.round(breedte * 1.7), borderRadius: Math.round(breedte * 0.08), overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
    border: `${geselecteerd ? 2 : 1}px solid ${geselecteerd ? G.goud : G.rand2}`,
    boxShadow: geselecteerd ? '0 0 0 3px rgba(241,203,120,0.25), 0 6px 18px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.35)', transition: 'all .2s', position: 'relative',
  }}>
    <img src={kaart.imageUrl} alt={kaart.nameNL} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: omgekeerd ? 'rotate(180deg)' : 'none' }} />
    {omgekeerd && <span style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', fontSize: 10, background: 'rgba(13,12,34,0.75)', color: G.tekst2, padding: '1px 7px', borderRadius: 8, fontFamily: SANS }}>omgekeerd</span>}
  </div>
);

// ── Detailpaneel van één kaart (zoals bij Lenormand) ─────────────────────────
const KaartDetail: React.FC<{ kaart: TarotKaart; omgekeerd: boolean; positie?: string; uitleg?: string; onSluit: () => void }> = ({ kaart, omgekeerd, positie, uitleg, onSluit }) => {
  const [meer, setMeer] = useState(false);
  const vakjes = [
    { label: 'Beschrijving', tekst: kaart.description },
    ...(kaart.loveReading ? [{ label: 'In de liefde', tekst: kaart.loveReading }] : []),
    { label: omgekeerd ? 'Rechtop betekent' : 'Omgekeerd betekent', tekst: omgekeerd ? kaart.meaningUpright : kaart.meaningReversed },
  ];
  return (
    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '1.5rem', position: 'relative' }}>
      <button onClick={onSluit} aria-label="Sluiten" style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: G.tekst3, cursor: 'pointer', fontSize: 18 }}>✕</button>
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <KaartVoorkant kaart={kaart} omgekeerd={omgekeerd} breedte={100} />
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          {positie && <div style={{ fontFamily: SERIF, fontSize: 10, letterSpacing: '0.10em', color: G.goud, textTransform: 'uppercase', marginBottom: 4 }}>{positie}</div>}
          {uitleg && <div style={{ fontSize: 12, color: G.tekst3, fontStyle: 'italic', marginBottom: 6 }}>{uitleg}</div>}
          <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: G.tekst, margin: '0 0 0.4rem' }}>
            {kaart.nameNL} <span style={{ fontSize: 13, color: G.tekst3 }}>{kaart.name}</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.7rem' }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(241,203,120,0.12)', color: G.goud, border: `0.5px solid ${G.goud}55` }}>{ARCANA[kaart.suit] ?? kaart.suit} · {kaart.number}</span>
            {omgekeerd && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(239,180,255,0.12)', color: G.tekst2, border: `0.5px solid ${G.rand2}` }}>omgekeerd</span>}
          </div>
          <p style={{ fontSize: 14.5, color: G.tekst2, lineHeight: 1.7, margin: 0 }}>{omgekeerd ? kaart.meaningReversed : kaart.meaningUpright}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.7rem', marginTop: '1rem' }}>
        {vakjes.map(({ label, tekst }) => (
          <div key={label} style={{ background: G.bg, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.7rem' }}>
            <div style={{ ...klein, fontSize: 10, marginBottom: 3 }}>{label}</div>
            <p style={{ fontSize: 12.5, color: G.tekst2, margin: 0, lineHeight: 1.6 }}>{tekst}</p>
          </div>
        ))}
      </div>
      {kaart.extendedDescription && (
        <div style={{ marginTop: '0.8rem' }}>
          <button onClick={() => setMeer(!meer)} style={{ background: 'none', border: 'none', color: G.goud, cursor: 'pointer', fontFamily: SANS, fontSize: 13, padding: 0 }}>
            {meer ? 'Minder lezen ▴' : 'Uitgebreide beschrijving ▾'}
          </button>
          {meer && <p style={{ fontSize: 13, color: G.tekst2, lineHeight: 1.7, whiteSpace: 'pre-line', margin: '0.5rem 0 0' }}>{kaart.extendedDescription}</p>}
        </div>
      )}
    </div>
  );
};

// ── Meer over tarot (de vroegere uitlegblokken) ──────────────────────────────
const UITLEG = [
  { id: 'basis', titel: 'Tarot basis', tekst: 'De fundamenten van tarot en de betekenis van de kaarten.', Onderdeel: TarotBasics },
  { id: 'geschiedenis', titel: 'Geschiedenis', tekst: 'Hoe tarot zich door de eeuwen heen ontwikkelde.', Onderdeel: TarotHistory },
  { id: 'interpretatie', titel: 'Interpreteren', tekst: 'De kunst van het lezen van de kaarten.', Onderdeel: TarotInterpretation },
  { id: 'gids', titel: 'Beginnersgids', tekst: 'Een complete gids voor wie net begint.', Onderdeel: TarotInterpretationGuide },
];

export const TarotLeggingPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const [deck, setDeck] = useState<TarotKaart[]>([]);
  const [soort, setSoort] = useState<Soort>(SPREIDINGEN.some((s) => s.id === type) ? (type as Soort) : 'three');
  const [fase, setFase] = useState<'start' | 'kiezen' | 'lezing'>('start');
  const [vraag, setVraag] = useState('');
  const [gekozen, setGekozen] = useState<number[]>([]);           // kaart-id's bij zelf kiezen
  const [kiesVolgorde, setKiesVolgorde] = useState<TarotKaart[]>([]); // geschud, zodat de ruggen niet steeds op dezelfde plek liggen
  const [getrokken, setGetrokken] = useState<TarotKaart[]>([]);
  const [omgekeerd, setOmgekeerd] = useState<boolean[]>([]);
  const [onthuld, setOnthuld] = useState<Set<number>>(new Set());
  const [actief, setActief] = useState<number | null>(null);
  const [duidingGevraagd, setDuidingGevraagd] = useState(false);
  const [duidingPerKaart, setDuidingPerKaart] = useState<string[] | null>(null);
  const [bewaard, setBewaard] = useState<'nee' | 'bezig' | 'ja' | 'fout'>('nee');
  const [openUitleg, setOpenUitleg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const kaarten = getCards() as TarotKaart[];
      setDeck(kaarten.length ? [...kaarten].sort((a, b) => a.id - b.id) : localCards);
    } catch { setDeck(localCards); }
  }, []);

  const spreiding = useMemo(() => SPREIDINGEN.find((s) => s.id === soort)!, [soort]);
  const alleOpen = getrokken.length > 0 && onthuld.size === getrokken.length;

  const legNeer = (kaarten: TarotKaart[]) => {
    setGetrokken(kaarten);
    setOmgekeerd(kaarten.map(() => Math.random() > 0.5));
    setOnthuld(spreiding.id === 'daily' ? new Set([0]) : new Set());
    setActief(spreiding.id === 'daily' ? 0 : null);
    setDuidingGevraagd(false); setDuidingPerKaart(null); setBewaard('nee');
    setFase('lezing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const schudEnTrek = () => legNeer(schud(deck).slice(0, spreiding.aantal));
  const kiesZelf = (id: number) => setGekozen((g) => (g.includes(id) ? g.filter((x) => x !== id) : g.length < spreiding.aantal ? [...g, id] : g));
  const onthul = (i: number) => { setOnthuld((o) => new Set([...o, i])); setActief(i); };
  const alleOmdraaien = () => { setOnthuld(new Set(getrokken.map((_, i) => i))); setActief(null); };
  const opnieuw = () => { setFase('start'); setGetrokken([]); setGekozen([]); setOnthuld(new Set()); setActief(null); setVraag(''); setDuidingGevraagd(false); setDuidingPerKaart(null); setBewaard('nee'); };

  const bewaar = async () => {
    setBewaard('bezig');
    const id = await bewaarLegging({
      soort: 'tarot', legging: spreiding.naam, vraag,
      kaarten: getrokken.map((k, i) => ({ id: k.id, naam: k.nameNL, positie: spreiding.posities[i], omgekeerd: omgekeerd[i] ?? false })),
      duidingPerKaart: duidingPerKaart ?? undefined,
    });
    setBewaard(id ? 'ja' : 'fout');
  };
  const pdf = () => generatePDF({ title: spreiding.naam, cards: getrokken, positions: spreiding.posities, vraagstelling: vraag });

  const kleineKnop: React.CSSProperties = { ...ZF_KNOP_PAARS, minHeight: 38, padding: '9px 20px', fontSize: 11 };

  return (
    <div className="pendel-pagina">
      {/* Kop (gelijk aan Lenormand) */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: SERIF, fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Tarot</p>
          <h1 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: '0.6rem' }}>Leggingen</h1>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 560 }}>
            Kies een legging, formuleer een heldere vraag en trek je kaarten.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {(fase === 'start' || fase === 'kiezen') && (
          <>
            {/* Spreiding kiezen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {SPREIDINGEN.map((s) => {
                const aan = soort === s.id;
                return (
                  <button key={s.id} onClick={() => { setSoort(s.id); setGekozen([]); }} style={{
                    fontFamily: SERIF, textAlign: 'left', padding: '1.2rem', borderRadius: 8,
                    border: `0.5px solid ${aan ? G.goud : G.rand2}`, background: aan ? G.goudBleek : G.bg,
                    color: aan ? G.goudDonker : G.tekst2, cursor: 'pointer', transition: 'all 0.18s',
                  }}>
                    <div style={{ fontSize: 17, marginBottom: '0.3rem' }}>{s.naam}</div>
                    <div style={{ fontFamily: SANS, fontSize: 13, fontStyle: 'italic', opacity: 0.75 }}>{s.aantal} {s.aantal === 1 ? 'kaart' : 'kaarten'}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12, marginTop: '0.5rem', lineHeight: 1.5, opacity: 0.75 }}>{s.beschrijving}</div>
                  </button>
                );
              })}
            </div>

            {/* Vraag */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ ...klein, display: 'block', marginBottom: '0.5rem' }}>Jouw vraag (optioneel)</label>
              <textarea rows={2} placeholder="Formuleer een open vraag voor meer diepgang…" value={vraag} onChange={(e) => setVraag(e.target.value)}
                style={{ fontFamily: SANS, fontSize: 16, color: G.tekst, background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 6, padding: '0.8rem 1rem', resize: 'none', outline: 'none', width: '100%', maxWidth: 500 }} />
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={schudEnTrek} disabled={!deck.length} style={ZF_KNOP}>Schud en trek kaarten →</button>
              <button onClick={() => { setKiesVolgorde(schud(deck)); setFase(fase === 'kiezen' ? 'start' : 'kiezen'); setGekozen([]); }} style={ZF_KNOP_PAARS}>
                {fase === 'kiezen' ? 'Toch laten schudden' : 'Kies zelf je kaarten'}
              </button>
            </div>

            {/* Zelf kiezen: alle kaarten met de rug boven */}
            {fase === 'kiezen' && (
              <div style={{ marginTop: '1.8rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '1.3rem 1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ ...klein, color: G.goud, letterSpacing: '0.12em' }}>Kies {spreiding.aantal} {spreiding.aantal === 1 ? 'kaart' : 'kaarten'} · {gekozen.length} gekozen</div>
                  {gekozen.length === spreiding.aantal && (
                    <button onClick={() => legNeer(gekozen.map((id) => deck.find((k) => k.id === id)!).filter(Boolean))} style={ZF_KNOP}>Leg deze kaarten neer →</button>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {kiesVolgorde.map((k) => {
                    const nr = gekozen.indexOf(k.id);
                    return (
                      <div key={k.id} onClick={() => kiesZelf(k.id)}>
                        <TarotCard card={k} faceDown selected={nr !== -1} selectionNumber={nr !== -1 ? nr + 1 : undefined} disabled={gekozen.length >= spreiding.aantal && nr === -1} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {fase === 'lezing' && (
          <>
            {vraag && (
              <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.7rem 1.2rem', marginBottom: '1.5rem', fontSize: 15, fontStyle: 'italic', color: G.tekst2 }}>
                "{vraag}"
              </div>
            )}
            <div style={{ ...klein, marginBottom: '1rem', color: G.goud, letterSpacing: '0.12em' }}>
              {spreiding.naam}{!alleOpen ? ' · klik op een kaart om hem om te draaien' : ''}
            </div>

            {spreiding.id === 'celtic' ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <CelticCrossLayout
                  selectedCards={getrokken.map((k) => k.id)}
                  getCardById={(id) => getrokken.find((k) => k.id === id)}
                  positions={spreiding.posities}
                  onCardClick={(id) => setActief(getrokken.findIndex((k) => k.id === id))}
                  omgekeerdPerPositie={omgekeerd}
                  onthuld={onthuld}
                  onOnthul={onthul}
                  kaartRug={() => <KaartRug breedte={88} />}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                {getrokken.map((kaart, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ ...klein, fontSize: 10, textAlign: 'center', maxWidth: 120 }}>{spreiding.posities[i]}</div>
                    {onthuld.has(i)
                      ? <KaartVoorkant kaart={kaart} omgekeerd={omgekeerd[i]} geselecteerd={actief === i} onClick={() => setActief(i)} />
                      : <div onClick={() => onthul(i)} style={{ cursor: 'pointer' }} title="Klik om om te draaien"><KaartRug /></div>}
                  </div>
                ))}
              </div>
            )}

            {actief !== null && getrokken[actief] && onthuld.has(actief) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <KaartDetail kaart={getrokken[actief]} omgekeerd={omgekeerd[actief]} positie={spreiding.posities[actief]} uitleg={spreiding.uitleg?.[actief]} onSluit={() => setActief(null)} />
              </div>
            )}

            {alleOpen && spreiding.id === 'celtic' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <CelticCrossBasicMeaning cards={getrokken} positions={spreiding.posities} />
              </div>
            )}

            {/* Duiding op verzoek (zoals bij Lenormand) */}
            {alleOpen && (
              <div style={{ marginBottom: '1.5rem' }}>
                {!duidingGevraagd ? (
                  <button onClick={() => setDuidingGevraagd(true)} style={ZF_KNOP}>✦ Vraag een duiding van je legging</button>
                ) : (
                  <TarotAIInterpretation cards={getrokken} positions={spreiding.posities} vraagstelling={vraag} readingType={spreiding.id} onInterpretatie={setDuidingPerKaart} />
                )}
              </div>
            )}

            {alleOpen && <div style={{ marginBottom: '1.5rem' }}><TarotChat cards={getrokken} positions={spreiding.posities} /></div>}

            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {!alleOpen && spreiding.id !== 'daily' && <button onClick={alleOmdraaien} style={kleineKnop}>Alle kaarten omdraaien</button>}
              {alleOpen && (bewaard === 'ja' ? (
                <span style={{ fontSize: 13, color: '#9BD49B' }}>✓ Bewaard — zie <Link to="/voortgang#leggingen" style={{ color: G.goud }}>Mijn voortgang</Link></span>
              ) : (
                <button onClick={bewaar} disabled={bewaard === 'bezig'} style={{ ...kleineKnop, opacity: bewaard === 'bezig' ? 0.6 : 1 }}>
                  {bewaard === 'bezig' ? 'Bewaren…' : bewaard === 'fout' ? 'Opnieuw proberen' : '💾 Bewaar legging'}
                </button>
              ))}
              {alleOpen && spreiding.id === 'celtic' && (
                <>
                  <button onClick={() => window.print()} style={kleineKnop} className="print:hidden">🖨 Print</button>
                  <button onClick={pdf} style={kleineKnop} className="print:hidden">⬇ PDF</button>
                </>
              )}
              <button onClick={opnieuw} style={{ ...kleineKnop, background: 'transparent', boxShadow: 'none', borderColor: G.rand2, color: G.tekst3 }}>Nieuwe lezing</button>
            </div>
          </>
        )}

        {/* Lees-tip (zoals bij Lenormand) */}
        <div style={{ marginTop: '3rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1.2rem 1.5rem', fontSize: 13.5, color: G.tekst2, lineHeight: 1.7 }}>
          <strong style={{ fontFamily: SERIF, color: G.goud, fontSize: 16 }}>Tarot lees-tip:</strong>{' '}
          Lees de kaarten niet alleen los, maar kijk welk verhaal ze samen vertellen. Een omgekeerde kaart laat vaak een geblokkeerde of meer naar binnen gerichte kant van dezelfde betekenis zien.
        </div>

        {/* Meer over tarot */}
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, color: G.tekst, margin: '0 0 1rem' }}>Meer over tarot</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {UITLEG.map(({ id, titel, tekst, Onderdeel }) => {
              const open = openUitleg === id;
              return (
                <div key={id} style={{ background: G.bg2, border: `0.5px solid ${open ? G.goud : G.rand2}`, borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setOpenUitleg(open ? null : id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '1rem 1.3rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span>
                      <span style={{ display: 'block', fontFamily: SERIF, fontSize: 20, color: G.tekst }}>{titel}</span>
                      <span style={{ display: 'block', fontSize: 13, color: G.tekst3, marginTop: 2 }}>{tekst}</span>
                    </span>
                    <ChevronDown size={20} style={{ color: G.goud, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s', flexShrink: 0 }} />
                  </button>
                  {open && <div style={{ borderTop: `0.5px solid ${G.rand}` }}><Onderdeel /></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotLeggingPage;
