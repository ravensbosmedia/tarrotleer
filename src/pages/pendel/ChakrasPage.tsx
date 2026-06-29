import React, { useState } from 'react';
import { PendelAnimatie, PendelMode } from '../../components/pendel/PendelAnimatie';

const G = {
  goud: '#B8860B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#FDFAF4',
  bg2: '#F5F0E8',
  bg3: '#EDE6D6',
  tekst: '#2C2416',
  tekst2: '#6B5C3E',
  tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)',
  rand2: 'rgba(184,134,11,0.35)',
};

interface Chakra {
  nr: number;
  naam: string;
  sanskrit: string;
  kleur: string;
  kleurNaam: string;
  locatie: string;
  organen: string;
  thema: string;
  eigenschappen: string[];
  element: string;
  toon: string;
  openTeken: string;
  gesloten: string;
}

const chakras: Chakra[] = [
  {
    nr: 1,
    naam: 'Wortelchakra',
    sanskrit: 'Muladhara',
    kleur: '#EF4444',
    kleurNaam: 'Rood',
    locatie: 'Stuitbeen / basis van de wervelkolom',
    organen: 'Wervelkolom, botten, bloed, bijnieren, dikke darm',
    thema: 'Overleving, veiligheid, aarding',
    eigenschappen: ['Veiligheidsgevoel', 'Aarding in het heden', 'Lichamelijke vitaliteit', 'Stabiliteit'],
    element: 'Aarde',
    toon: 'DO (C)',
    openTeken: 'Pendel draait rechtsom → chakra is open en in balans',
    gesloten: 'Pendel draait linksom of nauwelijks → chakra vraagt aandacht',
  },
  {
    nr: 2,
    naam: 'Sacraalchakra',
    sanskrit: 'Svadhisthana',
    kleur: '#F97316',
    kleurNaam: 'Oranje',
    locatie: 'Onderbuik, ca. 3 cm onder de navel',
    organen: 'Voortplantingsorganen, nieren, blaas',
    thema: 'Creativiteit, seksualiteit, emoties',
    eigenschappen: ['Creativiteit', 'Vreugde', 'Emotionele openheid', 'Zinnelijkheid'],
    element: 'Water',
    toon: 'RE (D)',
    openTeken: 'Pendel draait rechtsom → creatieve energie stroomt vrij',
    gesloten: 'Pendel draait linksom of stilstaat → emotionele blokkade mogelijk',
  },
  {
    nr: 3,
    naam: 'Zonnevlecht',
    sanskrit: 'Manipura',
    kleur: '#EAB308',
    kleurNaam: 'Geel / goud',
    locatie: 'Middenrif, bovenbuik',
    organen: 'Lever, gal, maag, alvleesklier, milt',
    thema: 'Persoonlijke kracht, wilskracht, zelfvertrouwen',
    eigenschappen: ['Eigenwaarde', 'Doorzettingsvermogen', 'Leiderschap', 'Innerlijke kracht'],
    element: 'Vuur',
    toon: 'MI (E)',
    openTeken: 'Pendel draait groot rechtsom → sterke eigenwaarde en kracht',
    gesloten: 'Pendel draait linksom → lage zelfwaarde of machtsproblemen',
  },
  {
    nr: 4,
    naam: 'Hartchakra',
    sanskrit: 'Anahata',
    kleur: '#22C55E',
    kleurNaam: 'Groen / roze',
    locatie: 'Midden van de borst, hart',
    organen: 'Hart, longen, thymus, huid, armen en handen',
    thema: 'Liefde, mededogen, verbinding',
    eigenschappen: ['Onvoorwaardelijke liefde', 'Vergeving', 'Empathie', 'Innerlijke vrede'],
    element: 'Lucht',
    toon: 'FA (F)',
    openTeken: 'Pendel draait licht en groot rechtsom → warm, open hart',
    gesloten: 'Pendel draait linksom of beweegt nauwelijks → hartpijn of afsluiting',
  },
  {
    nr: 5,
    naam: 'Keelchakra',
    sanskrit: 'Vishuddha',
    kleur: '#3B82F6',
    kleurNaam: 'Lichtblauw / turquoise',
    locatie: 'Keel, hals',
    organen: 'Keel, stembanden, bronchiën, schildklier, nek, schouders',
    thema: 'Communicatie, expressie, waarheid',
    eigenschappen: ['Eerlijke communicatie', 'Zelfexpressie', 'Luisteren', 'Creativiteit via woord'],
    element: 'Ether / klank',
    toon: 'SOL (G)',
    openTeken: 'Pendel draait vlot rechtsom → vrije, authentieke communicatie',
    gesloten: 'Pendel draait linksom → moeite met spreken of luisteren',
  },
  {
    nr: 6,
    naam: 'Derde-oogchakra',
    sanskrit: 'Ajna',
    kleur: '#6366F1',
    kleurNaam: 'Indigoblauw',
    locatie: 'Midden van het voorhoofd, tussen de wenkbrauwen',
    organen: 'Ogen, voorhoofd, hypofyse, pinealklier, hersenen',
    thema: 'Intuïtie, inzicht, helderziendheid',
    eigenschappen: ['Intuïtief vermogen', 'Helder denken', 'Inzicht', 'Visualisatie'],
    element: 'Licht',
    toon: 'LA (A)',
    openTeken: 'Pendel draait rustig en wijd rechtsom → sterk intuïtief vermogen',
    gesloten: 'Pendel draait nauwelijks of linksom → geblokkeerde intuïtie',
  },
  {
    nr: 7,
    naam: 'Kruinchakra',
    sanskrit: 'Sahasrara',
    kleur: '#A855F7',
    kleurNaam: 'Violet / wit / goud',
    locatie: 'Schedeldak, bovenkant van het hoofd',
    organen: 'Grote hersenen, epifyse, zenuwstelsel',
    thema: 'Spiritualiteit, verlichting, verbinding met het hogere',
    eigenschappen: ['Spiritueel bewustzijn', 'Eenheidsgevoel', 'Geloof', 'Innerlijke rust'],
    element: 'Kosmische energie',
    toon: 'SI (B)',
    openTeken: 'Pendel draait wijd en vrij rechtsom → hoog bewustzijn, spirituele verbinding',
    gesloten: 'Pendel draait nauwelijks → gevoel van zinloosheid of ontkoppeling',
  },
];

// ─── Lichaam silhouet met chakra-punten ────────────────────────────────────
const LichaamDiagram: React.FC<{ actief: number | null; onKlik: (nr: number) => void }> = ({ actief, onKlik }) => {
  const chakraPosities: Record<number, { x: number; y: number }> = {
    1: { x: 130, y: 338 },
    2: { x: 130, y: 302 },
    3: { x: 130, y: 260 },
    4: { x: 130, y: 215 },
    5: { x: 130, y: 175 },
    6: { x: 130, y: 133 },
    7: { x: 130, y:  90 },
  };

  return (
    <svg width={260} height={420} viewBox="0 0 260 420" style={{ display: 'block' }}>
      {/* Hoofd */}
      <ellipse cx={130} cy={55} rx={32} ry={38} fill="#F0D4B0" stroke="#C9A080" strokeWidth={0.8} />
      {/* Nek */}
      <rect x={118} y={88} width={24} height={22} fill="#F0D4B0" stroke="#C9A080" strokeWidth={0.5} />
      {/* Schouders / bovenlichaam */}
      <path d="M70,108 Q95,100 118,110 L118,280 L90,285 L85,370 Q83,375 80,375 L68,375 Q65,375 64,370 L60,285 L55,108 Z"
        fill="#E8C9A0" stroke="#C9A080" strokeWidth={0.8} />
      <path d="M190,108 Q165,100 142,110 L142,280 L170,285 L175,370 Q177,375 180,375 L192,375 Q195,375 196,370 L200,285 L205,108 Z"
        fill="#E8C9A0" stroke="#C9A080" strokeWidth={0.8} />
      {/* Armen links */}
      <path d="M57,110 Q42,120 35,180 Q30,220 32,250 L44,248 Q44,220 50,185 Q56,148 68,120 Z"
        fill="#F0D4B0" stroke="#C9A080" strokeWidth={0.5} />
      {/* Armen rechts */}
      <path d="M203,110 Q218,120 225,180 Q230,220 228,250 L216,248 Q216,220 210,185 Q204,148 192,120 Z"
        fill="#F0D4B0" stroke="#C9A080" strokeWidth={0.5} />
      {/* Romp */}
      <path d="M68,108 Q95,98 130,96 Q165,98 192,108 L196,280 L170,285 L142,280 L118,280 L90,285 L64,280 Z"
        fill="#EED5B0" stroke="#C9A080" strokeWidth={0.8} />
      {/* Benen */}
      <rect x={90}  y={280} width={34} height={95} rx={6} fill="#E8C9A0" stroke="#C9A080" strokeWidth={0.6} />
      <rect x={136} y={280} width={34} height={95} rx={6} fill="#E8C9A0" stroke="#C9A080" strokeWidth={0.6} />
      {/* Voeten */}
      <ellipse cx={107} cy={376} rx={18} ry={8} fill="#E8C9A0" stroke="#C9A080" strokeWidth={0.5} />
      <ellipse cx={153} cy={376} rx={18} ry={8} fill="#E8C9A0" stroke="#C9A080" strokeWidth={0.5} />

      {/* Chakra punten */}
      {chakras.map(ch => {
        const pos = chakraPosities[ch.nr];
        const isActief = actief === ch.nr;
        return (
          <g key={ch.nr} onClick={() => onKlik(ch.nr)} style={{ cursor: 'pointer' }}>
            {/* Gloed als actief */}
            {isActief && (
              <circle cx={pos.x} cy={pos.y} r={24}
                fill={ch.kleur} opacity={0.18}
                style={{ animation: 'kristal-adem 2s ease-in-out infinite' }}
              />
            )}
            {/* Chakra cirkel */}
            <circle
              cx={pos.x} cy={pos.y} r={isActief ? 14 : 11}
              fill={ch.kleur}
              stroke="white"
              strokeWidth={isActief ? 2.5 : 1.5}
              opacity={isActief ? 1 : 0.85}
              style={{ transition: 'r 0.2s, stroke-width 0.2s' }}
            />
            {/* Nummer */}
            <text x={pos.x} y={pos.y + 4} textAnchor="middle"
              fontSize={isActief ? 10 : 9}
              fill="white" fontFamily="'Cinzel', serif" fontWeight="bold">
              {ch.nr}
            </text>
            {/* Label rechts */}
            <text x={pos.x + 20} y={pos.y + 4} textAnchor="start"
              fontSize={9.5} fill={isActief ? G.goud : G.tekst3}
              fontFamily="'Cinzel', serif" style={{ transition: 'fill 0.2s' }}>
              {ch.naam}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Hoofdpagina ───────────────────────────────────────────────────────────
export const ChakrasPage: React.FC = () => {
  const [actief, setActief] = useState<number | null>(null);
  const [pendelBeweging, setPendelBeweging] = useState<PendelMode>('still');

  const handleChakraKlik = (nr: number) => {
    setActief(prev => prev === nr ? null : nr);
    setPendelBeweging('still');
  };

  const actiefChakra = chakras.find(c => c.nr === actief) ?? null;

  return (
    <div className="pendel-pagina">

      {/* ── Hero ── */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.14em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.7rem' }}>
            Energiecentra van het lichaam
          </p>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 38, fontWeight: 400, color: G.tekst, marginBottom: '0.7rem' }}>
            De 7 Chakra's
          </h1>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: G.tekst2, lineHeight: 1.7, maxWidth: 580 }}>
            Leer de chakra's kennen, begrijp hun betekenis en ontdek hoe je met de pendel kunt bepalen of ze open, gesloten of uit balans zijn.
          </p>
        </div>
      </div>

      {/* ── Uitleg: hoe pendelen met chakra's ── */}
      <section style={{ maxWidth: 1100, margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>

          <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.8rem' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 400, color: G.tekst, marginBottom: '1rem' }}>
              Hoe pendel je boven een chakra?
            </h2>
            <ol style={{ paddingLeft: '1.3rem', color: G.tekst2, lineHeight: 1.9, fontSize: 15 }}>
              <li>Laat de persoon ontspannen liggen of zitten</li>
              <li>Houd de pendel <strong style={{ color: G.tekst }}>15–20 cm boven het chakrapunt</strong></li>
              <li>Concentreer je op de vraag: <em>"Is dit chakra in balans?"</em></li>
              <li>Wacht rustig tot de pendel vanzelf begint te bewegen</li>
              <li>Observeer de richting <em>en</em> de grootte van de beweging</li>
              <li>Controleer altijd met de Controleschijf</li>
            </ol>
          </div>

          <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.8rem' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 400, color: G.tekst, marginBottom: '1rem' }}>
              Wat betekent de beweging?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: 15, color: G.tekst2 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>↻</span>
                <div>
                  <strong style={{ color: '#16A34A' }}>Rechtsom (met de klok mee)</strong><br />
                  Chakra is <strong>open en in balans</strong>. Hoe groter de cirkel, hoe meer energie.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>↺</span>
                <div>
                  <strong style={{ color: '#DC2626' }}>Linksom (tegen de klok in)</strong><br />
                  Chakra is <strong>geblokkeerd of gesloten</strong>. Energie stroomt niet vrij.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>↔</span>
                <div>
                  <strong style={{ color: '#CA8A04' }}>Heen en weer (lineair)</strong><br />
                  Chakra is <strong>gedeeltelijk actief</strong> maar niet volledig vrij.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>◼</span>
                <div>
                  <strong style={{ color: '#7C3AED' }}>Nauwelijks beweging</strong><br />
                  Chakra is <strong>vrijwel gesloten</strong> of heel laag in energie.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactief gedeelte ── */}
        <div style={{ borderTop: `0.5px solid ${G.rand}`, paddingTop: '2.5rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Interactief
          </p>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 400, color: G.tekst, marginBottom: '0.4rem' }}>
            Klik op een chakra om meer te leren
          </h2>
          <p style={{ fontSize: 15, fontStyle: 'italic', color: G.tekst2, marginBottom: '2rem' }}>
            Selecteer een chakra in het lichaaamsdiagram. Gebruik dan de pendel animatie om te oefenen met de juiste bewegingsrichting.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem', alignItems: 'flex-start' }}>

            {/* Lichaam diagram */}
            <div>
              <LichaamDiagram actief={actief} onKlik={handleChakraKlik} />
              <p style={{ fontSize: 12, color: G.tekst3, fontStyle: 'italic', textAlign: 'center', marginTop: 8 }}>
                Klik op een chakra-punt
              </p>
            </div>

            {/* Chakra detail + pendel */}
            <div>
              {!actiefChakra ? (
                <div style={{
                  background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 8,
                  padding: '2rem', textAlign: 'center', color: G.tekst3, fontStyle: 'italic',
                }}>
                  <div style={{ fontSize: 32, marginBottom: '0.5rem' }}>☯</div>
                  <p>Selecteer een chakra in het diagram om de uitleg en pendel-oefening te zien.</p>
                </div>
              ) : (
                <div>
                  {/* Chakra header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    marginBottom: '1.5rem', padding: '1.2rem 1.4rem',
                    background: `${actiefChakra.kleur}18`,
                    border: `0.5px solid ${actiefChakra.kleur}50`,
                    borderRadius: 8,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: actiefChakra.kleur, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontFamily: "'Cinzel', serif", fontWeight: 'bold', fontSize: 16,
                    }}>
                      {actiefChakra.nr}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 400, color: G.tekst, margin: 0 }}>
                        {actiefChakra.naam}
                      </h3>
                      <span style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic' }}>
                        {actiefChakra.sanskrit} · Kleur: {actiefChakra.kleurNaam} · Element: {actiefChakra.element}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '1rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Locatie</p>
                      <p style={{ fontSize: 14, color: G.tekst2, margin: 0 }}>{actiefChakra.locatie}</p>
                    </div>
                    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '1rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Thema</p>
                      <p style={{ fontSize: 14, color: G.tekst2, margin: 0 }}>{actiefChakra.thema}</p>
                    </div>
                    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '1rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Organen</p>
                      <p style={{ fontSize: 13, color: G.tekst2, margin: 0 }}>{actiefChakra.organen}</p>
                    </div>
                    <div style={{ background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 6, padding: '1rem' }}>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Toon</p>
                      <p style={{ fontSize: 14, color: G.tekst2, margin: 0 }}>{actiefChakra.toon}</p>
                    </div>
                  </div>

                  {/* Eigenschappen */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.08em', color: G.tekst3, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Kwaliteiten</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {actiefChakra.eigenschappen.map((e, i) => (
                        <span key={i} style={{
                          fontSize: 12, padding: '3px 10px',
                          borderRadius: 20,
                          background: `${actiefChakra.kleur}22`,
                          color: actiefChakra.kleur,
                          border: `0.5px solid ${actiefChakra.kleur}44`,
                        }}>{e}</span>
                      ))}
                    </div>
                  </div>

                  {/* Pendel oefening */}
                  <div style={{ background: G.bg2, border: `0.5px solid ${G.rand2}`, borderRadius: 8, padding: '1.4rem' }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.06em', color: G.goud, marginBottom: '0.4rem' }}>
                      Pendel oefening — {actiefChakra.naam}
                    </p>
                    <p style={{ fontSize: 13, color: G.tekst3, fontStyle: 'italic', marginBottom: '1.2rem' }}>
                      Kies een beweging om te simuleren wat je zou zien als je boven dit chakra pendelt.
                    </p>

                    {/* Grote pendel centraal */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
                      <PendelAnimatie mode={pendelBeweging} width={240} height={240} showControls={false} />
                    </div>

                    {/* 4 status-knoppen als pill-row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.2rem' }}>
                      {[
                        { b: 'right' as PendelMode, label: '↻ Open en in balans',     kleur: '#16A34A', sub: 'Rechtsom · chakra actief' },
                        { b: 'left'  as PendelMode, label: '↺ Geblokkeerd',            kleur: '#DC2626', sub: 'Linksom · energie blokkeert' },
                        { b: 'lr'    as PendelMode, label: '↔ Gedeeltelijk actief',   kleur: '#CA8A04', sub: 'Heen-weer · partieel vrij' },
                        { b: 'still' as PendelMode, label: '◼ Vrijwel gesloten',       kleur: '#7C3AED', sub: 'Stil · weinig energie' },
                      ].map(({ b, label, kleur, sub }) => (
                        <button
                          key={b}
                          onClick={() => setPendelBeweging(b)}
                          style={{
                            fontFamily: "'Crimson Pro', serif",
                            fontSize: 14, textAlign: 'left',
                            padding: '8px 12px', borderRadius: 6,
                            border: `0.5px solid ${pendelBeweging === b ? kleur : G.rand2}`,
                            background: pendelBeweging === b ? `${kleur}14` : G.bg,
                            color: pendelBeweging === b ? kleur : G.tekst3,
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 11, opacity: 0.75 }}>{sub}</div>
                        </button>
                      ))}
                    </div>

                    {/* Interpretatie */}
                    <div style={{
                      paddingTop: '1rem', borderTop: `0.5px solid ${G.rand}`,
                      fontSize: 14, color: G.tekst2, lineHeight: 1.7,
                    }}>
                      <div style={{ marginBottom: '0.4rem' }}>
                        <strong style={{ color: '#16A34A' }}>✓ Open: </strong>{actiefChakra.openTeken}
                      </div>
                      <div>
                        <strong style={{ color: '#DC2626' }}>✗ Geblokkeerd: </strong>{actiefChakra.gesloten}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Alle chakra's overzicht ── */}
        <div style={{ borderTop: `0.5px solid ${G.rand}`, paddingTop: '2.5rem', marginTop: '3rem' }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.12em', color: G.goud, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Compleet overzicht
          </p>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 400, color: G.tekst, marginBottom: '2rem' }}>
            Alle 7 chakra's
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {chakras.map(ch => (
              <ChakraKaart key={ch.nr} chakra={ch} actief={actief === ch.nr} onClick={() => handleChakraKlik(ch.nr)} />
            ))}
          </div>
        </div>

        {/* ── Belangrijke noot ── */}
        <div style={{
          marginTop: '3rem', marginBottom: '3rem',
          background: G.goudBleek, border: `0.5px solid ${G.rand2}`,
          borderRadius: 8, padding: '1.5rem 1.8rem',
        }}>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: '0.06em', color: G.goudDonker, marginBottom: '0.5rem' }}>
            Belangrijke opmerking
          </p>
          <p style={{ fontSize: 15, color: G.tekst2, lineHeight: 1.7, margin: 0 }}>
            Pendelen boven chakra's is een aanvullend hulpmiddel voor zelfkennis en bewustwording — geen medische diagnostiek.
            Gebruik de bevindingen als richting voor persoonlijke groei, meditatie of gesprek met een energetisch therapeut.
            Controleer je resultaten altijd met de <strong style={{ color: G.goud }}>Controleschijf</strong> en wees eerlijk of er sprake kan zijn van wensdenken.
          </p>
        </div>
      </section>
    </div>
  );
};

// ─── Kleine chakra kaart ───────────────────────────────────────────────────
const ChakraKaart: React.FC<{ chakra: Chakra; actief: boolean; onClick: () => void }> = ({ chakra, actief, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: actief ? `${chakra.kleur}12` : hover ? G.goudBleek : G.bg,
        border: `0.5px solid ${actief ? chakra.kleur + '80' : hover ? G.goud : G.rand2}`,
        borderRadius: 8, padding: '1.2rem',
        cursor: 'pointer', transition: 'all 0.2s',
        transform: hover && !actief ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: chakra.kleur, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: "'Cinzel', serif", fontWeight: 'bold', fontSize: 13,
        }}>
          {chakra.nr}
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: G.tekst }}>{chakra.naam}</div>
          <div style={{ fontSize: 12, color: G.tekst3, fontStyle: 'italic' }}>{chakra.sanskrit}</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: G.tekst2, lineHeight: 1.5, margin: 0 }}>{chakra.thema}</p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: `${chakra.kleur}22`, color: chakra.kleur, border: `0.5px solid ${chakra.kleur}44` }}>
          {chakra.kleurNaam}
        </span>
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: G.bg3, color: G.tekst3, border: `0.5px solid ${G.rand}` }}>
          {chakra.element}
        </span>
      </div>
    </div>
  );
};

export default ChakrasPage;
