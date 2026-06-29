import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };

const ARCHETYPES: Record<number, { naam: string; kernwoorden: string; beschrijving: string; uitdaging: string }> = {
  1: { naam: 'De Pionier', kernwoorden: 'Leiderschap · Initiatief · Onafhankelijkheid', beschrijving: 'Je bent hier om te leiden en nieuwe paden te openen. Jouw levensles draait om het vertrouwen op je eigen inzicht en het durven beginnen — ook als niemand je voorgaat.', uitdaging: 'Leren samenwerken en niet alles zelf te hoeven doen.' },
  2: { naam: 'De Diplomaat', kernwoorden: 'Samenwerking · Gevoeligheid · Balans', beschrijving: 'Je bent hier om te verbinden en te verzorgen. Je voelt de energie in elke ruimte aan. Jouw kracht ligt in subtiliteit, niet in kracht.', uitdaging: 'Eigen behoeften benoemen en niet verdwijnen in de ander.' },
  3: { naam: 'De Communicator', kernwoorden: 'Expressie · Creativiteit · Vreugde', beschrijving: 'Je bent hier om te inspireren via woord, beeld of kunst. Wanneer je creatief bent, ben je in je element. Vreugde is voor jou een spirituele praktijk.', uitdaging: 'Diepgang toevoegen naast alle vrolijkheid.' },
  4: { naam: 'De Bouwer', kernwoorden: 'Structuur · Betrouwbaarheid · Fundament', beschrijving: 'Je bent hier om blijvende dingen te bouwen — families, bedrijven, systemen. Anderen kunnen op jou bouwen. Jij bent het fundament.', uitdaging: 'Leren loslaten en niet alles zelf te controleren.' },
  5: { naam: 'De Avonturier', kernwoorden: 'Vrijheid · Verandering · Veelzijdigheid', beschrijving: 'Je bent hier om te ervaren. Elke ervaring is een les. Vrijheid is voor jou geen luxe — het is een noodzaak. Jij verbindt mensen en ideeën over grenzen heen.', uitdaging: 'Commitment leren aangaan zonder jezelf te verliezen.' },
  6: { naam: 'De Verzorger', kernwoorden: 'Verantwoordelijkheid · Harmonie · Thuis', beschrijving: 'Je bent hier om te zorgen en te helen — voor gezin, gemeenschap of de wereld. Schoonheid en harmonie zijn voor jou noodzakelijkheden, geen luxe.', uitdaging: 'Grenzen stellen en niet alles op jezelf nemen.' },
  7: { naam: 'De Zoeker', kernwoorden: 'Wijsheid · Analyse · Innerlijk weten', beschrijving: 'Je bent hier om de diepte te doorgronden. Je bent niet gemaakt voor oppervlakkigheid. Intuïtie en intellect werken bij jou samen tot iets unieks.', uitdaging: 'Verbinding met anderen aangaan ondanks behoefte aan eenzaamheid.' },
  8: { naam: 'De Manifesteerder', kernwoorden: 'Kracht · Succes · Verantwoordelijkheid', beschrijving: 'Je bent hier om te manifesteren — op materieel én spiritueel niveau. Jij leert de dans tussen persoonlijke macht en dienstbaarheid.', uitdaging: 'Macht hanteren zonder er door geconsumeerd te worden.' },
  9: { naam: 'De Humanist', kernwoorden: 'Mededogen · Afronden · Universele liefde', beschrijving: 'Je bent hier om te dienen aan iets groters. Je draagt een diepe wijsheid in je. Loslaten is jouw grootste les en grootste gave.', uitdaging: 'Leren loslaten — van verwachtingen, van mensen, van het verleden.' },
  11: { naam: 'De Inspirator', kernwoorden: 'Intuïtie · Visie · Spiritueel leiderschap', beschrijving: 'Meestergetal 11: je bent een kanaal voor hogere inzichten. Je hebt een sterk gevoel voor wat anderen nodig hebben. Je bent hier om te inspireren op een diep niveau.', uitdaging: 'De spanning tussen gevoeligheid en de wereld draagbaar houden.' },
  22: { naam: 'De Meesterbouwer', kernwoorden: 'Visie op grote schaal · Manifestatie · Erfenis', beschrijving: 'Meestergetal 22: je bent hier om grote dromen in werkelijkheid om te zetten. Jij combineert visie (11) met bouwkracht (4). Weinig mensen hebben dit potentieel.', uitdaging: 'Omgaan met de druk van grote verantwoordelijkheid.' },
};

function reduceer(n: number, meester = true): number {
  if (meester && (n === 11 || n === 22)) return n;
  if (n <= 9) return n;
  const som = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  return reduceer(som, meester);
}

function berekenLevenspad(dag: number, maand: number, jaar: number) {
  const dagR = reduceer(dag, false);
  const maandR = reduceer(maand, false);
  const jaarSom = String(jaar).split('').reduce((a, d) => a + parseInt(d), 0);
  const jaarR = reduceer(jaarSom, false);
  const totaal = dagR + maandR + jaarR;
  const lp = reduceer(totaal, true);
  const stappen = [
    `Dag: ${dag} → ${dagR}`,
    `Maand: ${maand} → ${maandR}`,
    `Jaar: ${jaar} → ${jaarSom} → ${jaarR}`,
    `Totaal: ${dagR} + ${maandR} + ${jaarR} = ${totaal}`,
    ...(totaal !== lp ? [`Reduceer: ${totaal} → ${lp}`] : []),
  ];
  return { getal: lp, stappen };
}

export const NumerologieLevenspadPage: React.FC = () => {
  const [geboortedatum, setGeboortedatum] = useState('');
  const [resultaat, setResultaat] = useState<{ getal: number; stappen: string[] } | null>(null);

  function bereken() {
    if (!geboortedatum) return;
    const [jaar, maand, dag] = geboortedatum.split('-').map(Number);
    if (!jaar || !maand || !dag) return;
    setResultaat(berekenLevenspad(dag, maand, jaar));
  }

  const arch = resultaat ? ARCHETYPES[resultaat.getal] : null;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/numerologie/analyse" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Profiel Analyse</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Numerologie</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Levenspad</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Het meest fundamentele getal — jouw hoofdles in dit leven</p>
        </div>

        <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Geboortedatum</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input type="date" value={geboortedatum} onChange={e => setGeboortedatum(e.target.value)}
              style={{ flex: 1, minWidth: 180, background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, padding: '10px 14px', color: G.goudBleek, fontSize: 15, fontFamily: "'Crimson Pro', Georgia, serif" }} />
            <button onClick={bereken} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Bereken</button>
          </div>
        </div>

        {resultaat && arch && (
          <div>
            <div style={{ background: G.bg2, border: `1px solid ${G.goud}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Jouw Levenspad</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 64, color: G.goud, lineHeight: 1 }}>{resultaat.getal}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goudBleek, marginTop: '0.5rem' }}>{arch.naam}</div>
              <div style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', marginTop: '0.25rem' }}>{arch.kernwoorden}</div>
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Berekening</div>
              {resultaat.stappen.map((s, i) => (
                <div key={i} style={{ fontSize: 13, color: 'rgba(245,237,216,0.65)', padding: '3px 0', fontFamily: 'monospace' }}>{s}</div>
              ))}
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,216,0.85)', margin: 0 }}>{arch.beschrijving}</p>
            </div>

            <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.25)', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Uitdaging</div>
              <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{arch.uitdaging}</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[{to:'/numerologie/bestuursgetal',label:'Bestuursgetal'},{to:'/numerologie/naam-analyse',label:'Naam Analyse'},{to:'/numerologie/mobiel-nummer',label:'Persoonlijk Jaar'},{to:'/cursus/module-01',label:'Cursus Module 1'}].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
