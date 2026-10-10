import React, { useEffect, useMemo, useState } from 'react';
import { lenormandKaarten } from '../../data/lenormand';
import { LenormandKaart } from '../../types/lenormand';
import { LenormandKaartVisueel } from '../../components/lenormand/LenormandKaartVisueel';
import {
  Combinatie,
  laadCombinaties,
  vindCombinatie,
} from '../../data/lenormand/combinaties';

const G = {
  goud: '#B8860B', goudBleek: '#F5EDD8', goudDonker: '#7A5C00',
  bg: '#FDFAF4', bg2: '#F5F0E8', bg3: '#EDE6D6',
  tekst: '#2C2416', tekst2: '#6B5C3E', tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)', rand2: 'rgba(184,134,11,0.35)',
};

const Slot: React.FC<{
  kaart: LenormandKaart | null;
  label: string;
  onWis: () => void;
}> = ({ kaart, label, onWis }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: 8 }}>
      {label}
    </div>
    {kaart ? (
      <div onClick={onWis} title="Klik om te wissen" style={{ cursor: 'pointer', display: 'inline-block' }}>
        <LenormandKaartVisueel kaart={kaart} grootte={150} />
      </div>
    ) : (
      <div style={{
        width: Math.round(150 * 0.65), height: 150,
        borderRadius: 11, border: `1.5px dashed ${G.rand2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: G.tekst3, fontSize: 30, background: G.bg2,
      }}>
        ✦
      </div>
    )}
  </div>
);

export const LenormandCombinatiesPage: React.FC = () => {
  const [combinaties, setCombinaties] = useState<Combinatie[] | null>(null);
  const [fout, setFout] = useState(false);
  const [a, setA] = useState<LenormandKaart | null>(null);
  const [b, setB] = useState<LenormandKaart | null>(null);
  const [zoek, setZoek] = useState('');

  useEffect(() => {
    laadCombinaties().then(setCombinaties).catch(() => setFout(true));
  }, []);

  const kies = (k: LenormandKaart) => {
    if (a && a.id === k.id) { setA(null); return; }
    if (b && b.id === k.id) { setB(null); return; }
    if (!a) { setA(k); return; }
    if (!b) { setB(k); return; }
    // beide vol → start opnieuw met deze kaart
    setA(k); setB(null);
  };

  const resultaat = useMemo(() => {
    if (!combinaties || !a || !b) return null;
    return {
      heen: vindCombinatie(combinaties, a.id, b.id),
      terug: vindCombinatie(combinaties, b.id, a.id),
    };
  }, [combinaties, a, b]);

  const gefilterd = useMemo(() => {
    const q = zoek.toLowerCase().trim();
    if (!q) return lenormandKaarten;
    return lenormandKaarten.filter(
      (k) => k.naam.toLowerCase().includes(q) || String(k.id) === q ||
        k.sleutelwoorden.some((w) => w.toLowerCase().includes(q))
    );
  }, [zoek]);

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.7rem' }}>
            Mystieke Lenormand
          </p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 400, color: G.tekst, marginBottom: '0.7rem' }}>
            Kaartcombinaties
          </h1>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 620 }}>
            De kern van het Lenormand-lezen: kaarten krijgen pas betekenis in combinatie.
            Kies twee kaarten en lees hoe ze samen spreken — alle 1260 paren, gebaseerd op onze kaartbetekenissen en Nederlandse en Engelse bronnen.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Gekozen paar + resultaat */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Slot kaart={a} label="Eerste kaart" onWis={() => setA(null)} />
          <div style={{ fontSize: 34, color: G.goud, opacity: 0.7, fontFamily: "'Cinzel', serif" }}>+</div>
          <Slot kaart={b} label="Tweede kaart" onWis={() => setB(null)} />
        </div>

        {fout && (
          <p style={{ textAlign: 'center', color: '#B91C1C', marginBottom: '1.5rem' }}>
            Combinatie-database kon niet geladen worden.
          </p>
        )}

        {resultaat && (a && b) && (
          <div style={{ background: G.bg, border: `0.5px solid ${G.rand2}`, borderRadius: 12, padding: '1.8rem', marginBottom: '2.5rem', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 400, color: G.tekst, margin: 0 }}>
                {a!.naam} <span style={{ color: G.goud }}>+</span> {b!.naam}
              </h2>
            </div>

            {resultaat.heen?.k?.length ? (
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.06em', color: G.goudDonker, margin: '0 0 0.8rem' }}>
                {resultaat.heen.k.join(' · ')}
              </p>
            ) : null}

            {resultaat.heen ? (
              <p style={{ fontSize: 17, color: G.tekst, lineHeight: 1.8, margin: '0 0 1.2rem' }}>
                {resultaat.heen.m}
              </p>
            ) : (
              <p style={{ fontSize: 15, color: G.tekst3, fontStyle: 'italic', margin: '0 0 1.2rem' }}>
                Geen directe duiding gevonden voor dit paar.
              </p>
            )}

            {/* Per levensgebied: liefde, werk en advies */}
            {resultaat.heen && (resultaat.heen.l || resultaat.heen.w || resultaat.heen.ad) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.7rem', margin: '0 0 1.2rem' }}>
                {([
                  ['❤️', 'In de liefde', resultaat.heen.l],
                  ['💼', 'In werk', resultaat.heen.w],
                  ['✦', 'Advies', resultaat.heen.ad],
                ] as const).filter(([, , tekst]) => tekst).map(([icoon, titel, tekst]) => (
                  <div key={titel} style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 10, padding: '0.8rem 1rem' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.goudDonker, textTransform: 'uppercase', marginBottom: 4 }}>
                      {icoon} {titel}
                    </div>
                    <p style={{ fontSize: 15, color: G.tekst, lineHeight: 1.6, margin: 0 }}>{tekst}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {resultaat.heen?.bronnen?.length ? (
              <p style={{ fontSize: 12, color: G.tekst3, margin: '0 0 1.2rem' }}>
                Gebaseerd op onze kaartbetekenissen en o.a.{' '}
                {resultaat.heen.bronnen.map((b, i) => (
                  <React.Fragment key={b.u}>
                    {i > 0 && ', '}
                    <a href={b.u} target="_blank" rel="noopener noreferrer" style={{ color: G.tekst2 }}>{b.n}</a>
                  </React.Fragment>
                ))}
              </p>
            ) : null}

            {/* Omgekeerde leesrichting, als die anders luidt */}
            {resultaat.terug && resultaat.terug.m && resultaat.terug.m !== resultaat.heen?.m && (
              <div style={{ borderTop: `0.5px solid ${G.rand}`, paddingTop: '1.1rem' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.10em', color: G.tekst3, textTransform: 'uppercase', marginBottom: 5 }}>
                  Omgekeerd gelezen ({b!.naam} + {a!.naam})
                </div>
                <p style={{ fontSize: 14, color: G.tekst2, lineHeight: 1.7, margin: 0 }}>
                  {resultaat.terug.m}
                </p>
              </div>
            )}
          </div>
        )}

        {!a && !b && !fout && (
          <p style={{ textAlign: 'center', color: G.tekst3, fontStyle: 'italic', marginBottom: '2rem' }}>
            {combinaties ? 'Kies hieronder twee kaarten om hun gezamenlijke betekenis te zien.' : 'Database laden…'}
          </p>
        )}

        {/* Kaartkiezer */}
        <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Zoek kaart op naam of nummer…"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            style={{
              width: '100%', maxWidth: 360, padding: '9px 14px',
              borderRadius: 20, border: `0.5px solid ${G.rand2}`,
              background: G.bg, color: G.tekst, fontSize: 14, outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: '0.7rem' }}>
          {gefilterd.map((k) => {
            const gekozen = (a && a.id === k.id) || (b && b.id === k.id);
            return (
              <div key={k.id} style={{ display: 'flex', justifyContent: 'center' }}>
                <LenormandKaartVisueel
                  kaart={k}
                  grootte={104}
                  onClick={() => kies(k)}
                  selected={!!gekozen}
                  dimmed={!!(a && b && !gekozen)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LenormandCombinatiesPage;
