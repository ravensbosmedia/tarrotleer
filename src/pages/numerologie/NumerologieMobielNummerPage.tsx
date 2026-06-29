import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };

const JAAR_BET: Record<number, { thema: string; beschrijving: string; focus: string; vermijd: string }> = {
  1: { thema: 'Nieuw Begin', beschrijving: 'Dit jaar plant je zaden voor de komende 9 jaar. Start nieuwe projecten, zet stappen die je al uitgesteld hebt. De energie is er — gebruik hem.', focus: 'Initiëren, beginnen, onafhankelijk handelen', vermijd: 'Terugkijken, stilstaan, wachten op toestemming' },
  2: { thema: 'Samenwerking', beschrijving: 'Dit jaar draait om geduld en verbinding. Forceer niets — laat dingen rijpen. Relaties zijn cruciaal dit jaar. Luister meer dan je spreekt.', focus: 'Samenwerken, relaties verzorgen, geduld oefenen', vermijd: 'Overhaaste beslissingen, conflicten opzoeken' },
  3: { thema: 'Expressie', beschrijving: 'Dit jaar is voor expressie en vreugde. Schrijf, spreek, maak kunst, lach meer. Sociale energie is hoog. Maak gebruik van je creativiteit.', focus: 'Creatief zijn, jezelf uitdrukken, plezier maken', vermijd: 'Je energie verspreiden over te veel projecten' },
  4: { thema: 'Bouwen', beschrijving: 'Dit jaar draait om fundament leggen. Hard werken loont. Zet systemen op, organiseer, bouw iets blijvends. Geen shortcuts — degelijk werk.', focus: 'Structuur aanbrengen, praktisch werken, verbeteren', vermijd: 'Impulsieve beslissingen, springen zonder plan' },
  5: { thema: 'Verandering', beschrijving: 'Dit jaar brengt beweging en verrassingen. Sta open voor het onverwachte. Reizen, nieuwe mensen, nieuwe ervaringen — dit jaar zit er vol mee.', focus: 'Flexibel zijn, nieuwe ervaringen omarmen, durven veranderen', vermijd: 'Vasthouden aan het oude, angst voor verandering' },
  6: { thema: 'Verantwoordelijkheid', beschrijving: 'Dit jaar draait om thuis, familie en zorg. Relaties vragen aandacht. Zorg goed voor degenen om je heen — maar ook voor jezelf.', focus: 'Familie, huis, relaties, gezondheid', vermijd: 'Te veel verantwoordelijkheid van anderen overnemen' },
  7: { thema: 'Innerlijk Werk', beschrijving: 'Dit jaar nodigt uit tot reflectie en studie. Ga naar binnen. Mediteer, lees, onderzoek. Antwoorden komen via stilte, niet via drukte.', focus: 'Contemplatie, studie, spirituele verdieping', vermijd: 'Overmatige sociale verplichtingen, leegte vermijden' },
  8: { thema: 'Manifestatie', beschrijving: 'Dit jaar is krachtig voor materiële doelen. Ambitieuze stappen worden beloond. Wees strategisch en daadkrachtig — de energie ondersteunt succes.', focus: 'Zakelijke doelen, financiën, carrière, autoriteit', vermijd: 'Kansen laten liggen, te bescheiden zijn' },
  9: { thema: 'Afronden', beschrijving: 'Dit jaar sluit een 9-jarige cyclus af. Laat los wat klaar is. Vergeef, ruim op, zeg vaarwel. Maak ruimte voor het nieuwe jaar 1 dat nadert.', focus: 'Loslaten, afronden, vergeven, opruimen', vermijd: 'Vasthouden aan het verleden, nieuwe dingen beginnen' },
};

function reduceer(n: number): number {
  if (n === 11 || n === 22) return n;
  if (n <= 9) return n;
  return reduceer(String(n).split('').reduce((a, d) => a + parseInt(d), 0));
}

function berekenPersoonlijkJaar(dag: number, maand: number, doelJaar: number): { getal: number; stappen: string[] } {
  const jaarSom = String(doelJaar).split('').reduce((a, d) => a + parseInt(d), 0);
  const totaal = dag + maand + jaarSom;
  const getal = reduceer(totaal);
  return {
    getal,
    stappen: [
      `Dag: ${dag}`,
      `Maand: ${maand}`,
      `Jaar ${doelJaar}: ${String(doelJaar).split('').join(' + ')} = ${jaarSom}`,
      `Totaal: ${dag} + ${maand} + ${jaarSom} = ${totaal}`,
      ...(totaal !== getal ? [`Reduceer: ${totaal} → ${getal}`] : []),
    ],
  };
}

export const NumerologieMobielNummerPage: React.FC = () => {
  const [geboortedatum, setGeboortedatum] = useState('');
  const [doelJaar, setDoelJaar] = useState(new Date().getFullYear());
  const [resultaat, setResultaat] = useState<{ getal: number; stappen: string[] } | null>(null);

  function bereken() {
    if (!geboortedatum) return;
    const [, maand, dag] = geboortedatum.split('-').map(Number);
    if (!maand || !dag) return;
    setResultaat(berekenPersoonlijkJaar(dag, maand, doelJaar));
  }

  const bet = resultaat ? JAAR_BET[resultaat.getal] : null;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/numerologie/analyse" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Profiel Analyse</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Numerologie</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Persoonlijk Jaar</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Welke energie domineert jouw jaar — en wat betekent dat concreet?</p>
        </div>

        <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Geboortedatum</label>
              <input type="date" value={geboortedatum} onChange={e => setGeboortedatum(e.target.value)}
                style={{ width: '100%', background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, padding: '10px 14px', color: G.goudBleek, fontSize: 15, fontFamily: "'Crimson Pro', Georgia, serif", boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Jaar</label>
              <input type="number" value={doelJaar} onChange={e => setDoelJaar(parseInt(e.target.value))}
                style={{ width: 90, background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, padding: '10px 10px', color: G.goudBleek, fontSize: 15, fontFamily: "'Cinzel', serif", textAlign: 'center' }} />
            </div>
          </div>
          <button onClick={bereken} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Bereken</button>
        </div>

        {resultaat && bet && (
          <div>
            <div style={{ background: G.bg2, border: `1px solid ${G.goud}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Persoonlijk Jaar {doelJaar}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 64, color: G.goud, lineHeight: 1 }}>{resultaat.getal}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: G.goudBleek, marginTop: '0.5rem' }}>{bet.thema}</div>
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Berekening</div>
              {resultaat.stappen.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'rgba(245,237,216,0.65)', fontFamily: 'monospace', padding: '2px 0' }}>{s}</div>)}
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,216,0.85)', margin: 0 }}>{bet.beschrijving}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Focus</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{bet.focus}</p>
              </div>
              <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Vermijd</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{bet.vermijd}</p>
              </div>
            </div>

            {/* 9-jaar cyclus context */}
            <div style={{ background: 'rgba(184,134,11,0.06)', border: '0.5px solid rgba(184,134,11,0.15)', borderRadius: 10, padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <div key={n} style={{ textAlign: 'center', padding: '4px 8px', borderRadius: 6, background: n === resultaat.getal ? G.goud : 'transparent', border: `0.5px solid ${n === resultaat.getal ? G.goud : 'rgba(184,134,11,0.2)'}` }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: n === resultaat.getal ? '#1A1208' : 'rgba(184,134,11,0.6)' }}>{n}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(245,237,216,0.35)', textAlign: 'center', marginTop: '0.4rem' }}>9-jarige cyclus — jij zit nu in jaar {resultaat.getal}</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[{to:'/numerologie/levenspad',label:'Levenspad'},{to:'/numerologie/bestuursgetal',label:'Bestuursgetal'},{to:'/numerologie/analyse',label:'Compleet Profiel'},{to:'/cursus/module-01',label:'Cursus Module 1'}].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
