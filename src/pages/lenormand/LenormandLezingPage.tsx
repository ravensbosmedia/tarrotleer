import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';
import { Link } from 'react-router-dom';
import { bewaarLegging } from '../../lib/voortgang';
import { lenormandKaarten, lenormandSpreads } from '../../data/lenormand';
import { LenormandKaart, LenormandSpreadType } from '../../types/lenormand';
import { LenormandKaartVisueel, LenormandKaartRug } from '../../components/lenormand/LenormandKaartVisueel';

// ── Verbindingen: waarom vullen de buur-duo's elkaar aan (AI-uitleg) ─────────
const Verbindingen: React.FC<{
  kaarten: LenormandKaart[];
  uitleg: string[] | null;
  bezig: boolean;
}> = ({ kaarten, uitleg, bezig }) => {
  if (kaarten.length < 2) return null;

  const kernIndex = Math.floor(kaarten.length / 2); // middenkaart = thema
  const paren = kaarten.slice(0, -1).map((k, i) => ({ links: k, rechts: kaarten[i + 1] }));

  return (
    <div style={{ marginBottom: '1.5rem', background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 10, padding: '1.4rem 1.5rem' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: 4 }}>
        De verbindingen
      </div>
      <p style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic', margin: '0 0 1.1rem' }}>
        Lees de kaarten twee-aan-twee — waarom vullen ze elkaar aan? <strong style={{ color: G.tekst2 }}>{kaarten[kernIndex].naam}</strong> staat in het midden, dat is je hoofdthema.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {paren.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', paddingBottom: '0.8rem', borderBottom: i < paren.length - 1 ? `0.5px solid ${G.rand}` : 'none' }}>
            <div style={{ flexShrink: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: G.tekst, whiteSpace: 'nowrap', paddingTop: 1 }}>
              <span style={{ color: p.links.kleurDonker }}>{p.links.symbool} {p.links.naam}</span>
              <span style={{ color: G.goud, margin: '0 6px' }}>+</span>
              <span style={{ color: p.rechts.kleurDonker }}>{p.rechts.symbool} {p.rechts.naam}</span>
            </div>
            <div style={{ flex: 1 }}>
              {uitleg && uitleg[i] ? (
                <p style={{ fontSize: 14, color: G.tekst, lineHeight: 1.65, margin: 0 }}>{uitleg[i]}</p>
              ) : (
                <p style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic', margin: 0 }}>
                  {bezig ? 'Wordt geduid…' : 'Lees deze twee kaarten samen.'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const G = {
  goud: '#F1CB78', goudBleek: '#2D2040', goudDonker: '#E0B04A',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040',
  tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};

function melangeerDeck(): LenormandKaart[] {
  const kopie = [...lenormandKaarten];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

// ── Grand Tableau 9x4 raster ────────────────────────────────────────────────
const GrandTableau: React.FC<{ kaarten: LenormandKaart[]; onKlik: (k: LenormandKaart) => void }> = ({ kaarten, onKlik }) => (
  <div style={{ overflowX: 'auto' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '0.5rem', minWidth: 720 }}>
      {kaarten.map((k, i) => (
        <div key={k.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 9, color: G.tekst3 }}>{i + 1}</div>
          <LenormandKaartVisueel kaart={k} grootte={80} onClick={() => onKlik(k)} />
        </div>
      ))}
    </div>
  </div>
);

// ── Kaart detail paneel ─────────────────────────────────────────────────────
const KaartDetail: React.FC<{ kaart: LenormandKaart; positie?: string; onSluit: () => void }> = ({ kaart, positie, onSluit }) => (
  <div style={{ background: G.bg2, border: `0.5px solid ${kaart.kleur}55`, borderRadius: 10, padding: '1.5rem', position: 'relative' }}>
    <button onClick={onSluit} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: G.tekst3, cursor: 'pointer', fontSize: 18 }}>✕</button>
    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
      <LenormandKaartVisueel kaart={kaart} grootte={100} />
      <div style={{ flex: 1 }}>
        {positie && (
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.10em', color: G.goud, textTransform: 'uppercase', marginBottom: 4 }}>{positie}</div>
        )}
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: G.tekst, margin: '0 0 0.3rem' }}>
          {kaart.naam} <span style={{ fontSize: 13, color: G.tekst3 }}>#{kaart.id}</span>
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.7rem' }}>
          {kaart.sleutelwoorden.map(w => (
            <span key={w} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: `${kaart.kleur}18`, color: kaart.kleurDonker, border: `0.5px solid ${kaart.kleur}44` }}>{w}</span>
          ))}
        </div>
        <p style={{ fontSize: 14, color: G.tekst2, lineHeight: 1.7, margin: 0 }}>{kaart.betekenis}</p>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.7rem', marginTop: '1rem' }}>
      {[
        { label: 'Liefde', tekst: kaart.liefde },
        { label: 'Werk', tekst: kaart.werk },
        { label: 'Combinatietip', tekst: kaart.combinatieTip },
      ].map(({ label, tekst }) => (
        <div key={label} style={{ background: G.bg, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.7rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
          <p style={{ fontSize: 12, color: G.tekst2, margin: 0, lineHeight: 1.6 }}>{tekst}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Hoofd pagina ─────────────────────────────────────────────────────────────
export const LenormandLezingPage: React.FC = () => {
  const [actieveSpread, setActieveSpread] = useState<LenormandSpreadType>('drie');
  const [fase, setFase] = useState<'start' | 'lezing'>('start');
  const [getrokken, setGetrokken] = useState<LenormandKaart[]>([]);
  const [onthuldeIndices, setOnthuldeIndices] = useState<Set<number>>(new Set());
  const [actieveKaart, setActieveKaart] = useState<{ kaart: LenormandKaart; index: number } | null>(null);
  const [vraag, setVraag] = useState('');
  const [duiding, setDuiding] = useState<string | null>(null);
  const [duidingBezig, setDuidingBezig] = useState(false);
  const [duidingFout, setDuidingFout] = useState<string | null>(null);
  const [duoUitleg, setDuoUitleg] = useState<string[] | null>(null);
  const [duosBezig, setDuosBezig] = useState(false);
  const [bewaard, setBewaard] = useState<'nee' | 'bezig' | 'ja' | 'fout'>('nee');

  const bewaar = async () => {
    setBewaard('bezig');
    const id = await bewaarLegging({
      soort: 'lenormand',
      legging: spread.naam,
      vraag,
      kaarten: getrokken.map((k, i) => ({ id: k.id, naam: k.naam, positie: spread.posities[i] ?? `Kaart ${i + 1}` })),
      duiding: duiding ?? undefined,
      verbindingen: duoUitleg ?? undefined,
    });
    setBewaard(id ? 'ja' : 'fout');
  };
  const duosRef = useRef(false);

  const vraagDuiding = async () => {
    setDuidingBezig(true); setDuidingFout(null); setDuiding(null);
    try {
      const kaartenPayload = getrokken.map((k, i) => ({
        naam: k.naam,
        positie: spread.posities[i],
        betekenis: k.betekenis,
        sleutelwoorden: k.sleutelwoorden,
      }));
      const comboPayload = duoUitleg
        ? getrokken.slice(0, -1).map((k, i) => ({
            links: k.naam, rechts: getrokken[i + 1].naam, betekenis: duoUitleg[i] || '',
          })).filter((x) => x.betekenis)
        : [];
      const r = await fetch('/api/lenormand/duiding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vraag, legging: spread.naam, kaarten: kaartenPayload, combinaties: comboPayload }),
      });
      const j = await r.json();
      if (j.error) setDuidingFout(typeof j.error === 'string' ? j.error : 'Er ging iets mis');
      else setDuiding(j.duiding || '(leeg antwoord)');
    } catch {
      setDuidingFout('Kon de duiding niet ophalen.');
    } finally {
      setDuidingBezig(false);
    }
  };

  const spread = useMemo(() => lenormandSpreads.find(s => s.id === actieveSpread)!, [actieveSpread]);

  // Zodra alle kaarten van een lijn-legging open zijn: laat gpt-5.5 de buur-duo's uitleggen.
  // Ref-guard zorgt dat dit precies één keer per legging vuurt (deps bevatten géén setState-toggles).
  useEffect(() => {
    if (spread.id === 'tableau' || spread.id === 'dag') return;
    if (getrokken.length < 2 || onthuldeIndices.size !== getrokken.length) return;
    if (duosRef.current) return;
    duosRef.current = true;
    setDuosBezig(true);
    const duosPayload = getrokken.slice(0, -1).map((k, i) => ({
      links: { naam: k.naam, betekenis: k.betekenis },
      rechts: { naam: getrokken[i + 1].naam, betekenis: getrokken[i + 1].betekenis },
    }));
    fetch('/api/lenormand/duos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duos: duosPayload, vraag }),
    })
      .then((r) => r.json())
      .then((j) => setDuoUitleg(Array.isArray(j.uitleg) ? j.uitleg : []))
      .catch(() => setDuoUitleg([]))
      .finally(() => setDuosBezig(false));
  }, [onthuldeIndices, getrokken, spread, vraag]);

  const startLezing = () => {
    const geschud = melangeerDeck();
    setGetrokken(geschud.slice(0, spread.aantalKaarten));
    setOnthuldeIndices(spread.id === 'dag' ? new Set([0]) : new Set());
    setActieveKaart(null);
    setDuoUitleg(null); setDuosBezig(false); duosRef.current = false;
    setDuiding(null); setDuidingFout(null); setBewaard('nee');
    setFase('lezing');
  };

  const onthulKaart = (index: number) => {
    setOnthuldeIndices(prev => new Set([...prev, index]));
    setActieveKaart({ kaart: getrokken[index], index });
  };

  const onthulAlles = () => {
    setOnthuldeIndices(new Set(getrokken.map((_, i) => i)));
    setActieveKaart(null);
  };

  const reset = () => { setBewaard('nee'); setFase('start'); setGetrokken([]); setOnthuldeIndices(new Set()); setActieveKaart(null); setVraag(''); setDuiding(null); setDuidingFout(null); setDuoUitleg(null); setDuosBezig(false); duosRef.current = false; };

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Mystieke Lenormand</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: '0.6rem' }}>Leggingen</h1>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 520 }}>
            Kies een spreiding, formuleer een heldere vraag en trek je kaarten.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

        {fase === 'start' && (
          <>
            {/* Spread selectie */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {lenormandSpreads.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActieveSpread(s.id)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif", textAlign: 'left',
                    padding: '1.2rem', borderRadius: 8,
                    border: `0.5px solid ${actieveSpread === s.id ? G.goud : G.rand2}`,
                    background: actieveSpread === s.id ? G.goudBleek : G.bg,
                    color: actieveSpread === s.id ? G.goudDonker : G.tekst2,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                >
                  <div style={{ fontSize: 15, marginBottom: '0.3rem' }}>{s.naam}</div>
                  <div style={{ fontFamily: "'DM Sans', serif", fontSize: 13, fontStyle: 'italic', opacity: 0.75, letterSpacing: 0 }}>{s.aantalKaarten} kaarten</div>
                  <div style={{ fontFamily: "'DM Sans', serif", fontSize: 12, marginTop: '0.5rem', lineHeight: 1.5, opacity: 0.7, letterSpacing: 0 }}>{s.beschrijving}</div>
                </button>
              ))}
            </div>

            {/* Vraag invoer */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Jouw vraag (optioneel)
              </label>
              <textarea
                rows={2}
                placeholder="Formuleer een open vraag voor meer diepgang…"
                value={vraag}
                onChange={e => setVraag(e.target.value)}
                style={{
                  fontFamily: "'DM Sans', serif", fontSize: 16, color: G.tekst,
                  background: G.bg, border: `0.5px solid ${G.rand2}`,
                  borderRadius: 6, padding: '0.8rem 1rem',
                  resize: 'none', outline: 'none', width: '100%', maxWidth: 500,
                }}
              />
            </div>

            <button
              onClick={startLezing}
              style={{ ...ZF_KNOP }}
            >
              Schud en trek kaarten →
            </button>
          </>
        )}

        {fase === 'lezing' && (
          <>
            {/* Vraag banner */}
            {vraag && (
              <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.7rem 1.2rem', marginBottom: '1.5rem', fontSize: 15, fontStyle: 'italic', color: G.tekst2 }}>
                "{vraag}"
              </div>
            )}

            {/* Grand Tableau */}
            {spread.id === 'tableau' ? (
              <GrandTableau kaarten={getrokken} onKlik={k => {
                const idx = getrokken.indexOf(k);
                onthulKaart(idx);
              }} />
            ) : (
              /* Andere spreads: kaarten in een rij */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                {getrokken.map((kaart, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', textAlign: 'center', maxWidth: 100 }}>
                      {spread.posities[i]}
                    </div>
                    {onthuldeIndices.has(i) ? (
                      <LenormandKaartVisueel
                        kaart={kaart}
                        grootte={140}
                        selected={actieveKaart?.index === i}
                        onClick={() => setActieveKaart({ kaart, index: i })}
                      />
                    ) : (
                      <div onClick={() => onthulKaart(i)} style={{ cursor: 'pointer' }}>
                        <LenormandKaartRug grootte={140} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actieve kaart detail */}
            {actieveKaart && (
              <div style={{ marginBottom: '1.5rem' }}>
                <KaartDetail
                  kaart={actieveKaart.kaart}
                  positie={spread.posities[actieveKaart.index]}
                  onSluit={() => setActieveKaart(null)}
                />
              </div>
            )}

            {/* Verbindingen — buur-duo's van de lijn-legging */}
            {spread.id !== 'tableau' && spread.id !== 'dag' &&
              onthuldeIndices.size === getrokken.length && getrokken.length >= 2 && (
                <Verbindingen kaarten={getrokken} uitleg={duoUitleg} bezig={duosBezig} />
              )}

            {/* AI-duiding — gevoed met onze kaartbetekenissen + combinaties */}
            {spread.id !== 'tableau' && onthuldeIndices.size === getrokken.length && getrokken.length >= 1 && (
              <div style={{ marginBottom: '1.5rem' }}>
                {!duiding && !duidingBezig && (
                  <button onClick={vraagDuiding} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.07em', padding: '10px 22px', borderRadius: 22, border: 'none', background: G.goud, color: '#FFF3DF', cursor: 'pointer', fontWeight: 600 }}>
                    ✦ Vraag een samenvattende duiding
                  </button>
                )}
                {duidingBezig && (
                  <div style={{ fontSize: 14, color: G.tekst3, fontStyle: 'italic' }}>
                    De kaarten worden geduid…
                  </div>
                )}
                {duidingFout && (
                  <div style={{ fontSize: 14, color: '#F0A596' }}>{duidingFout}</div>
                )}
                {duiding && (
                  <div style={{ background: 'linear-gradient(160deg, #FFFDF7, #F7F1E4)', border: `0.5px solid ${G.rand2}`, borderRadius: 12, padding: '1.6rem 1.7rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase' }}>
                        Duiding van de legging
                      </div>
                      <button onClick={vraagDuiding} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.06em', padding: '4px 11px', borderRadius: 14, border: `0.5px solid ${G.rand2}`, background: 'transparent', color: G.tekst3, cursor: 'pointer' }}>
                        Opnieuw
                      </button>
                    </div>
                    <div style={{ fontSize: 15.5, color: G.tekst, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {duiding}
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, color: G.tekst3, marginTop: '1rem', letterSpacing: '0.05em' }}>
                      Op basis van onze kaartbetekenissen en combinaties · gpt-5.5
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Knoppen */}
            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
              {onthuldeIndices.size < getrokken.length && spread.id !== 'dag' && spread.id !== 'tableau' && (
                <button onClick={onthulAlles} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.07em', padding: '9px 20px', borderRadius: 20, border: `0.5px solid ${G.rand2}`, background: G.bg2, color: G.tekst2, cursor: 'pointer' }}>
                  Alle kaarten omdraaien
                </button>
              )}
              {onthuldeIndices.size === getrokken.length && getrokken.length > 0 && (
                bewaard === 'ja' ? (
                  <span style={{ alignSelf: 'center', fontSize: 13, color: '#9BD49B' }}>
                    ✓ Bewaard — zie <Link to="/voortgang#leggingen" style={{ color: G.goudDonker }}>Mijn voortgang</Link>
                  </span>
                ) : (
                  <button onClick={bewaar} disabled={bewaard === 'bezig'} style={{ ...ZF_KNOP_PAARS, opacity: bewaard === 'bezig' ? 0.6 : 1 }}>
                    {bewaard === 'bezig' ? 'Bewaren…' : bewaard === 'fout' ? 'Opnieuw proberen' : '💾 Bewaar legging'}
                  </button>
                )
              )}
              <button onClick={reset} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.07em', padding: '9px 20px', borderRadius: 20, border: `0.5px solid ${G.rand}`, background: 'transparent', color: G.tekst3, cursor: 'pointer' }}>
                Nieuwe lezing
              </button>
            </div>
          </>
        )}

        {/* Info blok onderaan */}
        <div style={{ marginTop: '3rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1.2rem 1.5rem', fontSize: 13, color: G.tekst2, lineHeight: 1.7 }}>
          <strong style={{ fontFamily: "'Cormorant Garamond', serif", color: G.goud }}>Lenormand lees-tip:</strong>{' '}
          In Lenormand is de combinatie van kaarten de sleutel. Lees niet elke kaart los, maar kijk hoe de buurkaarten elkaar beïnvloeden — de kaart rechts van een andere wijzigt de betekenis van de linker kaart.
        </div>
      </div>
    </div>
  );
};

export default LenormandLezingPage;
