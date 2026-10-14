import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { haalQuizStats, slaRondeOp, maakGewicht, gewogenSchud, QuizStat } from '../../lib/voortgang';
import { lenormandKaarten } from '../../data/lenormand';
import { LenormandKaart } from '../../types/lenormand';
import { LenormandKaartVisueel } from '../../components/lenormand/LenormandKaartVisueel';

const G = {
  goud: '#F1CB78', goudBleek: '#2D2040', goudDonker: '#E0B04A',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040',
  tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};

function schud<T>(arr: T[]): T[] {
  const k = [...arr];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

export const LenormandFlashcardsPage: React.FC = () => {
  const [deck, setDeck] = useState<LenormandKaart[]>(() => schud(lenormandKaarten));
  const [index, setIndex] = useState(0);
  const [omgedraaid, setOmgedraaid] = useState(false);
  const [gezien, setGezien] = useState<Set<number>>(new Set());
  const [telling, setTelling] = useState({ ken: 0, oefen: 0 });
  const stats = useRef<QuizStat[]>([]);
  // Kaarten die je nog oefent (of nooit gezien hebt) komen vooraan in de stapel
  const schudGewogen = () => gewogenSchud(lenormandKaarten, (k) => maakGewicht(stats.current)(`kaart:${k.id}`));

  useEffect(() => {
    haalQuizStats('lenormand-flashcards').then((s) => { stats.current = s; setDeck(schudGewogen()); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const kaart = deck[index];

  /** Bewaart per kaart of je hem kende en gaat door naar de volgende. */
  const beoordeel = (ken: boolean) => {
    slaRondeOp('lenormand-flashcards', ken ? 1 : 0, 1, [{ sleutel: `kaart:${kaart.id}`, label: kaart.naam, goed: ken }], { ronde: false });
    setTelling((t) => (ken ? { ...t, ken: t.ken + 1 } : { ...t, oefen: t.oefen + 1 }));
    volgende();
  };

  const volgende = () => {
    setGezien(prev => new Set([...prev, kaart.id]));
    setOmgedraaid(false);
    setIndex(prev => (prev + 1) % deck.length);
  };

  const vorige = () => {
    setOmgedraaid(false);
    setIndex(prev => (prev - 1 + deck.length) % deck.length);
  };

  const herstart = () => {
    setDeck(schudGewogen());
    setIndex(0);
    setOmgedraaid(false);
    setGezien(new Set());
    setTelling({ ken: 0, oefen: 0 });
  };

  const voortgang = Math.round((gezien.size / deck.length) * 100);

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Mystieke Lenormand</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: G.tekst, marginBottom: '0.6rem' }}>Flashcards</h1>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7 }}>
            Leer de 36 symbolen en hun betekenissen. Klik op de kaart om de uitleg te zien.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Voortgang */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: G.tekst3, marginBottom: 4 }}>
            <span>Kaart {index + 1} van {deck.length}</span>
            <span>{gezien.size} gezien · {voortgang}%</span>
          </div>
          <div style={{ height: 2, background: G.bg3, borderRadius: 1 }}>
            <div style={{ height: '100%', background: G.goud, borderRadius: 1, width: `${voortgang}%`, transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Kaart + flip */}
        <div
          onClick={() => setOmgedraaid(!omgedraaid)}
          style={{
            background: G.bg, border: `0.5px solid ${G.rand2}`,
            borderRadius: 12, padding: '2.5rem 2rem',
            cursor: 'pointer', transition: 'all 0.2s',
            marginBottom: '1.5rem', minHeight: 320,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <LenormandKaartVisueel kaart={kaart} grootte={160} />

          {!omgedraaid ? (
            <div style={{ textAlign: 'center', color: G.tekst3, fontStyle: 'italic', fontSize: 14 }}>
              Klik om de betekenis te onthullen
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: G.tekst, textAlign: 'center', marginBottom: '0.5rem' }}>
                {kaart.naam}
              </h2>

              {/* Sleutelwoorden */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center', marginBottom: '1rem' }}>
                {kaart.sleutelwoorden.map(w => (
                  <span key={w} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 10, background: `${kaart.kleur}18`, color: kaart.kleurDonker, border: `0.5px solid ${kaart.kleur}44` }}>{w}</span>
                ))}
              </div>

              <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.75, textAlign: 'center', fontStyle: 'italic', marginBottom: '1.2rem' }}>
                {kaart.betekenis}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {[
                  { label: '❤️ Liefde', tekst: kaart.liefde },
                  { label: '💼 Werk', tekst: kaart.werk },
                ].map(({ label, tekst }) => (
                  <div key={label} style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.8rem' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                    <p style={{ fontSize: 12, color: G.tekst2, margin: 0, lineHeight: 1.6 }}>{tekst}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '0.8rem', background: G.goudBleek, border: `0.5px solid ${G.rand2}`, borderRadius: 6, padding: '0.8rem' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.08em', color: G.goud, textTransform: 'uppercase', marginBottom: 3 }}>Combinatietip</div>
                <p style={{ fontSize: 12, color: G.tekst2, margin: 0, lineHeight: 1.6 }}>{kaart.combinatieTip}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigatie */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={vorige} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em', padding: '9px 18px', borderRadius: 20, border: `0.5px solid ${G.rand2}`, background: 'transparent', color: G.tekst3, cursor: 'pointer' }}>
            ← Vorige
          </button>
          <button
            onClick={() => beoordeel(false)}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em', padding: '9px 20px', borderRadius: 20, border: '0.5px solid rgba(224,176,74,0.5)', background: 'rgba(224,176,74,0.12)', color: '#F2B27A', cursor: 'pointer' }}
          >
            ↺ Nog oefenen
          </button>
          <button
            onClick={() => beoordeel(true)}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em', padding: '9px 20px', borderRadius: 20, border: '0.5px solid rgba(155,212,155,0.5)', background: 'rgba(95,167,119,0.15)', color: '#9BD49B', cursor: 'pointer' }}
          >
            ✓ Ken ik
          </button>
          <button onClick={herstart} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.06em', padding: '9px 18px', borderRadius: 20, border: `0.5px solid ${G.rand}`, background: 'transparent', color: G.tekst3, cursor: 'pointer' }}>
            Herstarten
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: G.tekst3, marginTop: '0.9rem' }}>
          <span style={{ color: '#9BD49B' }}>✓ {telling.ken}</span> · <span style={{ color: '#F2B27A' }}>↺ {telling.oefen}</span> deze ronde ·{' '}
          <Link to="/voortgang" style={{ color: G.goudDonker }}>Mijn voortgang</Link>
        </p>

        {/* Voortgang compleet */}
        {gezien.size === deck.length && (
          <div style={{ marginTop: '1.5rem', background: G.goudBleek, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: G.goudDonker, marginBottom: '0.3rem' }}>Alle 36 kaarten gezien ✦</div>
            <p style={{ fontSize: 13, color: G.tekst2, margin: 0 }}>Je hebt het volledige deck doorlopen. Doe de quiz om je kennis te testen!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LenormandFlashcardsPage;
