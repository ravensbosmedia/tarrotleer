import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };

const PYTHAGORAANS: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};

const VOORVOEGSELS = ['van der','van de','van den','van het','in de','van','de','het','der','ter','den',"'t",'te'];

function filterVV(naam: string): string {
  const delen = naam.toLowerCase().trim().split(/\s+/);
  const orig = naam.trim().split(/\s+/);
  const res: string[] = [];
  let i = 0;
  while (i < delen.length) {
    let skip = false;
    for (const vv of VOORVOEGSELS) {
      const vvD = vv.split(' ');
      if (vvD.length > 1 && i + vvD.length <= delen.length && delen.slice(i, i + vvD.length).join(' ') === vv) {
        i += vvD.length; skip = true; break;
      } else if (vvD.length === 1 && delen[i] === vv) {
        i++; skip = true; break;
      }
    }
    if (!skip) { res.push(orig[i]); i++; }
  }
  return res.join(' ');
}

function reduceer(n: number): number {
  if (n === 11 || n === 22) return n;
  if (n <= 9) return n;
  return reduceer(String(n).split('').reduce((a, d) => a + parseInt(d), 0));
}

const EXPRESSIE_BET: Record<number, { naam: string; beschrijving: string; talent: string; valkuil: string }> = {
  1: { naam: 'De Pionier', beschrijving: 'Je talent is leiden en beginnen. Anderen volgen jou omdat jij durf toont. Je expressie is direct, sterk en onvervangbaar.', talent: 'Leiderschap, initiatief, originele aanpak', valkuil: 'Overheersend, moeite met samenwerken' },
  2: { naam: 'De Mediator', beschrijving: 'Je talent is verbinden en verzorgen. Je expressie is zacht maar krachtig — je brengt mensen samen en lost spanningen op met elegantie.', talent: 'Diplomatie, harmonie, subtiliteit', valkuil: 'Kan onzichtbaar worden, negeert eigen behoeften' },
  3: { naam: 'De Verteller', beschrijving: 'Je talent is expressie zelf — woorden, beelden, muziek, humor. Je brengt licht in een ruimte. Je expressiegetal bevestigt dat communicatie jouw pad is.', talent: 'Charisma, creativiteit, verbale kracht', valkuil: 'Oppervlakkigheid, gebrek aan follow-through' },
  4: { naam: 'De Architect', beschrijving: 'Je talent is bouwen — systemen, ideeën, structuren. Je expressie is methodisch en betrouwbaar. Anderen vertrouwen op jou als fundament.', talent: 'Nauwkeurigheid, doorzettingsvermogen, betrouwbaarheid', valkuil: 'Rigiditeit, moeite met spontaniteit' },
  5: { naam: 'De Brugbouwer', beschrijving: 'Je talent is verbinden door vrijheid. Je expressiestijl is levendig, magnetisch en veelzijdig. Je brengt nieuwe ideeën van buiten naar binnen.', talent: 'Aanpassingsvermogen, charisma, avontuurlijke energie', valkuil: 'Onrust, moeite met één ding afmaken' },
  6: { naam: 'De Healer', beschrijving: 'Je talent is zorgen en helen. Je expressie draagt warmte en verantwoordelijkheid. Mensen vertrouwen je hun kwetsbaarheden toe.', talent: 'Empathie, esthetisch gevoel, zorgzaamheid', valkuil: 'Bemoeizucht, te veel verantwoordelijkheid nemen' },
  7: { naam: 'De Wijze', beschrijving: 'Je talent is diepgang en inzicht. Je expressie is bedachtzaam en nauwkeurig. Je analyses zijn zelden oppervlakkig.', talent: 'Analytisch denken, spirituele intelligentie, diepgang', valkuil: 'Afstandelijkheid, moeilijk te bereiken' },
  8: { naam: 'De Directeur', beschrijving: 'Je talent is organiseren en manifesteren. Je expressie is gezaghebbend en daadkrachtig. Je maakt dingen concreet.', talent: 'Autoriteit, besluitvaardigheid, zakelijk inzicht', valkuil: 'Controlegedrag, te resultaatgericht' },
  9: { naam: 'De Universalist', beschrijving: 'Je talent is humanisme en afronden. Je expressie raakt iedereen omdat ze van een diepe universele bron komt.', talent: 'Mededogen, artistiek vermogen, wijsheid', valkuil: 'Moeilijk aarden, kan verdriet meeslepen' },
  11: { naam: 'De Inspirator', beschrijving: 'Meestergetal. Je talent is inspireren op een bovenpersoonlijk niveau. Mensen voelen jouw aanwezigheid.', talent: 'Intuïtie, visie, spiritueel kanaal', valkuil: 'Overweldiging door eigen gevoeligheid' },
  22: { naam: 'De Meesterbouwer', beschrijving: 'Meestergetal. Je talent is grootschalige manifestatie. Je kunt dromen realiseren die voor anderen onbereikbaar lijken.', talent: 'Praktische visie, nalatenschap, leiderschap op grote schaal', valkuil: 'Gewicht van de verantwoordelijkheid' },
};

export const NumerologieExpressiegetalPage: React.FC = () => {
  const [naam, setNaam] = useState('');
  const [res, setRes] = useState<{ getal: number; gefilterd: string; letters: Array<{l: string; w: number}> } | null>(null);

  function bereken() {
    if (!naam.trim()) return;
    const gefilterd = filterVV(naam);
    const letters = gefilterd.toUpperCase().replace(/[^A-Z]/g, '').split('').map(l => ({ l, w: PYTHAGORAANS[l] ?? 0 }));
    if (!letters.length) return;
    const som = letters.reduce((a, x) => a + x.w, 0);
    const getal = reduceer(som);
    setRes({ getal, gefilterd, letters });
  }

  const bet = res ? EXPRESSIE_BET[res.getal] : null;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/numerologie/naam-analyse" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Naam Analyse</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Numerologie</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Expressiegetal</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Alle letters van je naam — hoe jij je talent naar de wereld brengt</p>
        </div>

        <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Volledige naam</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input value={naam} onChange={e => setNaam(e.target.value)} onKeyDown={e => e.key === 'Enter' && bereken()} placeholder="bv. Frans Bemelmans"
              style={{ flex: 1, minWidth: 200, background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, padding: '10px 14px', color: G.goudBleek, fontSize: 15, fontFamily: "'Crimson Pro', Georgia, serif" }} />
            <button onClick={bereken} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Bereken</button>
          </div>
        </div>

        {res && bet && (
          <div>
            <div style={{ background: G.bg2, border: `1px solid ${G.goud}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Expressiegetal</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 64, color: G.goud, lineHeight: 1 }}>{res.getal}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goudBleek, marginTop: '0.5rem' }}>{bet.naam}</div>
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
              <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: 'rgba(184,134,11,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Letterwaarden (alle letters tellen mee)</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {res.letters.map((x, i) => (
                  <div key={i} style={{ textAlign: 'center', minWidth: 32 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: G.goudBleek }}>{x.l}</div>
                    <div style={{ fontSize: 11, color: 'rgba(184,134,11,0.6)' }}>{x.w}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(245,237,216,0.40)', marginTop: '0.5rem' }}>Som: {res.letters.reduce((a,x)=>a+x.w,0)} → {res.getal}</div>
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1.25rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(245,237,216,0.85)', margin: 0 }}>{bet.beschrijving}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Talent</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{bet.talent}</p>
              </div>
              <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Valkuil</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{bet.valkuil}</p>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[{to:'/numerologie/naam-analyse',label:'Naam Analyse (compleet)'},{to:'/numerologie/levenspad',label:'Levenspad'},{to:'/cursus/module-02',label:'Cursus Module 2'}].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
