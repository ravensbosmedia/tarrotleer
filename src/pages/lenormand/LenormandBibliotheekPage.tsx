import React, { useState, useMemo } from 'react';
import { lenormandKaarten } from '../../data/lenormand';
import { LenormandKaart } from '../../types/lenormand';
import { LenormandKaartVisueel } from '../../components/lenormand/LenormandKaartVisueel';

const G = {
  goud: '#F1CB78', goudBleek: '#2D2040', goudDonker: '#E0B04A',
  bg: '#0D0C22', bg2: '#20162F', bg3: '#2D2040',
  tekst: '#FFF3DF', tekst2: '#E0D5E9', tekst3: '#B9A9CC',
  rand: 'rgba(239,180,255,0.22)', rand2: 'rgba(239,180,255,0.38)',
};

const InfoRij: React.FC<{ label: string; tekst: string; kleur?: string }> = ({ label, tekst, kleur }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.10em', color: kleur ?? G.tekst3, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 14, color: G.tekst2, lineHeight: 1.65 }}>{tekst}</div>
  </div>
);

const KaartModal: React.FC<{ kaart: LenormandKaart; onSluit: () => void }> = ({ kaart, onSluit }) => (
  <div
    onClick={onSluit}
    style={{
      position: 'fixed', inset: 0, background: 'rgba(20,15,5,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 60, padding: '1rem',
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: G.bg, border: `0.5px solid ${G.rand2}`,
        borderRadius: 12, width: '100%', maxWidth: 680,
        maxHeight: '90vh', overflowY: 'auto',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <LenormandKaartVisueel kaart={kaart} grootte={140} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Kaart {kaart.id}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: G.tekst, marginBottom: '0.5rem' }}>
            {kaart.naam}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
            {kaart.sleutelwoorden.map(w => (
              <span key={w} style={{
                fontSize: 11, padding: '2px 9px', borderRadius: 10,
                background: `${kaart.kleur}18`, color: kaart.kleurDonker,
                border: `0.5px solid ${kaart.kleur}44`,
              }}>{w}</span>
            ))}
          </div>
          <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.75, fontStyle: 'italic' }}>{kaart.betekenis}</p>
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
        {[
          { label: 'Liefde & Relaties', tekst: kaart.liefde, kleur: '#F0A596' },
          { label: 'Werk & Carrière',   tekst: kaart.werk,   kleur: '#2563EB' },
          { label: 'Gezondheid',        tekst: kaart.gezondheid, kleur: '#7BC98F' },
          { label: 'Combinatietip',     tekst: kaart.combinatieTip, kleur: G.goud },
        ].map(({ label, tekst, kleur }) => (
          <div key={label} style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '0.9rem' }}>
            <InfoRij label={label} tekst={tekst} kleur={kleur} />
          </div>
        ))}
      </div>

      {/* Positief / Negatief */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(95,167,119,0.15)', border: '0.5px solid rgba(155,212,155,0.5)', borderRadius: 6, padding: '0.9rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.10em', color: '#7BC98F', textTransform: 'uppercase', marginBottom: 4 }}>Positief aspect</div>
          <p style={{ fontSize: 14, color: '#9BD49B', margin: 0 }}>{kaart.positief}</p>
        </div>
        <div style={{ background: 'rgba(200,96,79,0.15)', border: '0.5px solid rgba(240,165,150,0.5)', borderRadius: 6, padding: '0.9rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.10em', color: '#F0A596', textTransform: 'uppercase', marginBottom: 4 }}>Uitdagend aspect</div>
          <p style={{ fontSize: 14, color: '#F0A596', margin: 0 }}>{kaart.negatief}</p>
        </div>
      </div>

      <button
        onClick={onSluit}
        style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.08em',
          padding: '9px 24px', borderRadius: 20,
          border: `0.5px solid ${G.rand2}`,
          background: 'transparent', color: G.tekst3, cursor: 'pointer',
        }}
      >
        Sluiten
      </button>
    </div>
  </div>
);

export const LenormandBibliotheekPage: React.FC = () => {
  const [zoek, setZoek] = useState('');
  const [geselecteerd, setGeselecteerd] = useState<LenormandKaart | null>(null);

  const gefilterd = useMemo(() => {
    const q = zoek.toLowerCase().trim();
    if (!q) return lenormandKaarten;
    return lenormandKaarten.filter(k =>
      k.naam.toLowerCase().includes(q) ||
      k.sleutelwoorden.some(w => w.toLowerCase().includes(q)) ||
      k.betekenis.toLowerCase().includes(q) ||
      String(k.id) === q
    );
  }, [zoek]);

  return (
    <div className="pendel-pagina">
      {/* Hero */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.7rem' }}>
            Mystieke Lenormand
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 400, color: G.tekst, marginBottom: '0.7rem' }}>
            Kaarten Bibliotheek
          </h1>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 560 }}>
            Alle 36 Lenormand-symbolen met hun betekenis, combinatietips en toepassingen in liefde, werk en gezondheid.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Zoekbalk */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Zoek op naam, sleutelwoord of nummer…"
            value={zoek}
            onChange={e => setZoek(e.target.value)}
            style={{
              fontFamily: "'DM Sans', serif", fontSize: 16, color: G.tekst,
              background: G.bg, border: `0.5px solid ${G.rand2}`,
              borderRadius: 6, padding: '0.7rem 1rem', outline: 'none',
              flex: 1, maxWidth: 420,
            }}
          />
          {zoek && (
            <span style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic' }}>
              {gefilterd.length} kaart{gefilterd.length !== 1 ? 'en' : ''}
            </span>
          )}
        </div>

        {/* Kaarten raster */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem' }}>
          {gefilterd.map(kaart => (
            <div key={kaart.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
              onClick={() => setGeselecteerd(kaart)}
            >
              <LenormandKaartVisueel kaart={kaart} grootte={130} />
              <div style={{ fontSize: 11, color: G.tekst3, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.04em', textAlign: 'center', maxWidth: 85 }}>
                {kaart.sleutelwoorden[0]}
              </div>
            </div>
          ))}
        </div>

        {gefilterd.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: G.tekst3, fontStyle: 'italic' }}>
            Geen kaarten gevonden voor "{zoek}"
          </div>
        )}
      </div>

      {geselecteerd && <KaartModal kaart={geselecteerd} onSluit={() => setGeselecteerd(null)} />}
    </div>
  );
};

export default LenormandBibliotheekPage;
