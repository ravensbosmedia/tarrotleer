import React, { useState, useMemo } from 'react';
import { lenormandKaarten, lenormandSpreads } from '../../data/lenormand';
import { LenormandKaart, LenormandSpreadType } from '../../types/lenormand';
import { LenormandKaartVisueel, LenormandKaartRug } from '../../components/lenormand/LenormandKaartVisueel';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', goudDonker: '#7A5C00',
  bg: '#FDFAF4', bg2: '#F5F0E8', bg3: '#EDE6D6',
  tekst: '#2C2416', tekst2: '#6B5C3E', tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)', rand2: 'rgba(184,134,11,0.35)',
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
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: G.tekst3 }}>{i + 1}</div>
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
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.10em', color: G.goud, textTransform: 'uppercase', marginBottom: 4 }}>{positie}</div>
        )}
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 400, color: G.tekst, margin: '0 0 0.3rem' }}>
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
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
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

  const spread = useMemo(() => lenormandSpreads.find(s => s.id === actieveSpread)!, [actieveSpread]);

  const startLezing = () => {
    const geschud = melangeerDeck();
    setGetrokken(geschud.slice(0, spread.aantalKaarten));
    setOnthuldeIndices(spread.id === 'dag' ? new Set([0]) : new Set());
    setActieveKaart(null);
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

  const reset = () => { setFase('start'); setGetrokken([]); setOnthuldeIndices(new Set()); setActieveKaart(null); setVraag(''); };

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Mystieke Lenormand</p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: '0.6rem' }}>Leggingen</h1>
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
                    fontFamily: "'Cinzel', serif", textAlign: 'left',
                    padding: '1.2rem', borderRadius: 8,
                    border: `0.5px solid ${actieveSpread === s.id ? G.goud : G.rand2}`,
                    background: actieveSpread === s.id ? G.goudBleek : G.bg,
                    color: actieveSpread === s.id ? G.goudDonker : G.tekst2,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                >
                  <div style={{ fontSize: 15, marginBottom: '0.3rem' }}>{s.naam}</div>
                  <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 13, fontStyle: 'italic', opacity: 0.75, letterSpacing: 0 }}>{s.aantalKaarten} kaarten</div>
                  <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, marginTop: '0.5rem', lineHeight: 1.5, opacity: 0.7, letterSpacing: 0 }}>{s.beschrijving}</div>
                </button>
              ))}
            </div>

            {/* Vraag invoer */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Jouw vraag (optioneel)
              </label>
              <textarea
                rows={2}
                placeholder="Formuleer een open vraag voor meer diepgang…"
                value={vraag}
                onChange={e => setVraag(e.target.value)}
                style={{
                  fontFamily: "'Crimson Pro', serif", fontSize: 16, color: G.tekst,
                  background: G.bg, border: `0.5px solid ${G.rand2}`,
                  borderRadius: 6, padding: '0.8rem 1rem',
                  resize: 'none', outline: 'none', width: '100%', maxWidth: 500,
                }}
              />
            </div>

            <button
              onClick={startLezing}
              style={{
                fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.08em',
                padding: '12px 32px', borderRadius: 24,
                border: `0.5px solid ${G.goud}`,
                background: G.goudBleek, color: G.goudDonker,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
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
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', textAlign: 'center', maxWidth: 100 }}>
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

            {/* Knoppen */}
            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
              {onthuldeIndices.size < getrokken.length && spread.id !== 'dag' && spread.id !== 'tableau' && (
                <button onClick={onthulAlles} style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.07em', padding: '9px 20px', borderRadius: 20, border: `0.5px solid ${G.rand2}`, background: G.bg2, color: G.tekst2, cursor: 'pointer' }}>
                  Alle kaarten omdraaien
                </button>
              )}
              <button onClick={reset} style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.07em', padding: '9px 20px', borderRadius: 20, border: `0.5px solid ${G.rand}`, background: 'transparent', color: G.tekst3, cursor: 'pointer' }}>
                Nieuwe lezing
              </button>
            </div>
          </>
        )}

        {/* Info blok onderaan */}
        <div style={{ marginTop: '3rem', background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8, padding: '1.2rem 1.5rem', fontSize: 13, color: G.tekst2, lineHeight: 1.7 }}>
          <strong style={{ fontFamily: "'Cinzel', serif", color: G.goud }}>Lenormand lees-tip:</strong>{' '}
          In Lenormand is de combinatie van kaarten de sleutel. Lees niet elke kaart los, maar kijk hoe de buurkaarten elkaar beïnvloeden — de kaart rechts van een andere wijzigt de betekenis van de linker kaart.
        </div>
      </div>
    </div>
  );
};

export default LenormandLezingPage;
