import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const G = { goud: '#B8860B', goudBleek: '#F5EDD8', bg: '#1A1208', bg2: '#2C2416', bg3: '#3A2E1C' };

const BETEKENISSEN: Record<number, { naam: string; energie: string; positief: string; schaduw: string; inPraktijk: string }> = {
  1: { naam: 'De Leider', energie: 'Onafhankelijkheid, initiatief, beginnersvermogen', positief: 'Daadkracht, zelfvertrouwen, visie, originaliteit', schaduw: 'Eigenwijs, ongeduldig, slecht in delegeren', inPraktijk: 'Iemand die problemen direct aanpakt. Geen lange vergaderingen — actie.' },
  2: { naam: 'De Partner', energie: 'Samenwerking, gevoeligheid, bemiddeling', positief: 'Empathie, geduld, diplomatiek vermogen', schaduw: 'Conflict-vermijdend, teveel aanpassen, vergeet zichzelf', inPraktijk: "Werkt het best in duo's of teams. Waardevolle achter-de-schermen kracht." },
  3: { naam: 'De Creatieveling', energie: 'Expressie, communicatie, vreugde', positief: 'Charisma, humor, creativiteit, verbale gave', schaduw: 'Oppervlakkig, moeite met focus, kan vluchtig zijn', inPraktijk: 'Sterk in presentaties, schrijven, verkoop of creatieve beroepen.' },
  4: { naam: 'De Bouwer', energie: 'Stabiliteit, systemen, betrouwbaarheid', positief: 'Doorzettingsvermogen, eerlijkheid, geduld, nauwkeurigheid', schaduw: 'Rigide, koppig, soms saaie uitvoering boven visie', inPraktijk: 'De persoon die afmaakt wat anderen beginnen. Onmisbaar fundament.' },
  5: { naam: 'De Avonturier', energie: 'Vrijheid, verandering, veelzijdigheid', positief: 'Aanpassingsvermogen, nieuwsgierigheid, energie, magnetisme', schaduw: 'Rusteloos, ongeduldig, moeite met commitment', inPraktijk: 'Gedijt in dynamische rollen. Niet geschikt voor rigide 9-tot-5 routines.' },
  6: { naam: 'De Verzorger', energie: 'Verantwoordelijkheid, harmonie, zorg', positief: 'Loyaliteit, warmte, esthetisch gevoel, betrokkenheid', schaduw: 'Bemoeizuchtig, te perfectionistisch, draagt te veel', inPraktijk: 'De spil van gezin of team. Onmisbaar maar moet grenzen bewaken.' },
  7: { naam: 'De Analist', energie: 'Diepte, inzicht, innerlijk weten', positief: 'Intelligentie, spirituele gevoeligheid, scherpzinnigheid', schaduw: 'Eenzelvig, cynisch, distantie van emotie', inPraktijk: 'Werkt het best alleen of met veel autonomie. Excellent in onderzoek.' },
  8: { naam: 'De Directeur', energie: 'Macht, structuur, materiële manifestatie', positief: 'Organisatietalent, doelgerichtheid, autoriteit, besluitvaardigheid', schaduw: 'Machtshongerig, controlerend, materialistisch', inPraktijk: 'Geboren leider in zakelijke context. Wil resultaten, geen excuses.' },
  9: { naam: 'De Idealist', energie: 'Universele liefde, afronden, mededogen', positief: 'Wijsheid, groothartigheid, artistiek vermogen', schaduw: 'Wereldvreemd, kan verdriet meeslepen, te idealistisch', inPraktijk: 'Sterk in humanitaire of artistieke rollen. Laat bijdragen na.' },
  11: { naam: 'De Inspirator', energie: 'Meestergetal — intuïtie, visie, spiritueel leiderschap', positief: 'Helderziendheid, inlevingsvermogen, inspiratiebron', schaduw: 'Overweldiging, spanning door hoge gevoeligheid', inPraktijk: 'Kanaal voor hogere ideeën. Werkt het best als inspiratiebron, niet als manager.' },
  22: { naam: 'De Meesterbouwer', energie: 'Meestergetal — grote-schaal manifestatie', positief: 'Visie verbonden met praktische kracht. Nalatenschap-energie.', schaduw: 'Overweldigende verantwoordelijkheid, perfectionisme op grote schaal', inPraktijk: 'Bouwt systemen, organisaties of bewegingen die generaties meegaan.' },
};

function reduceer(n: number): number {
  if (n === 11 || n === 22) return n;
  if (n <= 9) return n;
  return reduceer(String(n).split('').reduce((a, d) => a + parseInt(d), 0));
}

function berekenBestuursgetal(dag: number): { getal: number; stappen: string[] } {
  if (dag <= 9) return { getal: dag, stappen: [`Dag ${dag} — al een enkel cijfer`] };
  const s1 = String(dag).split('').reduce((a, d) => a + parseInt(d), 0);
  const bg = reduceer(s1);
  const stappen = [`Dag: ${String(dag).split('').join(' + ')} = ${s1}`, ...(s1 !== bg ? [`Reduceer: ${s1} → ${bg}`] : [])];
  return { getal: bg, stappen };
}

export const NumerologieBestuursgetalPage: React.FC = () => {
  const [dagInput, setDagInput] = useState('');
  const [resultaat, setResultaat] = useState<{ getal: number; stappen: string[] } | null>(null);

  function bereken() {
    const dag = parseInt(dagInput);
    if (!dag || dag < 1 || dag > 31) return;
    setResultaat(berekenBestuursgetal(dag));
  }

  const bet = resultaat ? BETEKENISSEN[resultaat.getal] : null;

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.goudBleek, fontFamily: "'Crimson Pro', Georgia, serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', fontSize: 13, color: 'rgba(245,237,216,0.45)' }}>
          <Link to="/numerologie/analyse" style={{ color: 'rgba(184,134,11,0.7)', textDecoration: 'none' }}>← Profiel Analyse</Link>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Numerologie</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: G.goud, marginBottom: '0.5rem' }}>Bestuursgetal</h1>
          <p style={{ color: 'rgba(245,237,216,0.65)', fontSize: 15 }}>Afgeleid van de geboortedag — hoe jij van nature beweegt en handelt</p>
        </div>

        <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Geboortedag (1–31)</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input type="number" min={1} max={31} value={dagInput} onChange={e => setDagInput(e.target.value)} placeholder="bv. 14"
              style={{ width: 100, background: G.bg3, border: '0.5px solid rgba(184,134,11,0.3)', borderRadius: 8, padding: '10px 14px', color: G.goudBleek, fontSize: 18, fontFamily: "'Cinzel', serif", textAlign: 'center' }} />
            <button onClick={bereken} style={{ padding: '10px 24px', background: G.goud, border: 'none', borderRadius: 8, color: '#1A1208', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Bereken</button>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(245,237,216,0.40)', marginTop: '0.5rem', margin: '0.5rem 0 0' }}>Alleen de dag van de maand — niet het volledige datum.</p>
        </div>

        {resultaat && bet && (
          <div>
            <div style={{ background: G.bg2, border: `1px solid ${G.goud}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bestuursgetal</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 64, color: G.goud, lineHeight: 1 }}>{resultaat.getal}</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: G.goudBleek, marginTop: '0.5rem' }}>{bet.naam}</div>
              <div style={{ fontSize: 13, color: 'rgba(184,134,11,0.7)', marginTop: '0.25rem' }}>{bet.energie}</div>
            </div>

            <div style={{ background: G.bg2, border: '0.5px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: G.goud, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Berekening</div>
              {resultaat.stappen.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'rgba(245,237,216,0.65)', fontFamily: 'monospace', padding: '2px 0' }}>{s}</div>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(92,184,122,0.08)', border: '0.5px solid rgba(92,184,122,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#5CB87A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Positief</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{bet.positief}</p>
              </div>
              <div style={{ background: 'rgba(200,80,80,0.08)', border: '0.5px solid rgba(200,80,80,0.2)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ fontSize: 10, fontFamily: "'Cinzel', serif", color: '#DB7A7A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Schaduw</div>
                <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.75)', margin: 0, lineHeight: 1.5 }}>{bet.schaduw}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(46,80,160,0.1)', border: '0.5px solid rgba(60,80,180,0.25)', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: '#7A9BDB', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>💬 In de praktijk</div>
              <p style={{ fontSize: 14, color: 'rgba(245,237,216,0.75)', lineHeight: 1.6, margin: 0 }}>{bet.inPraktijk}</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(184,134,11,0.15)' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: 'rgba(184,134,11,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gerelateerde tools</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[{to:'/numerologie/levenspad',label:'Levenspad'},{to:'/numerologie/naam-analyse',label:'Naam Analyse'},{to:'/numerologie/mobiel-nummer',label:'Persoonlijk Jaar'},{to:'/cursus/module-01',label:'Cursus Module 1'}].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(184,134,11,0.8)', border: '0.5px solid rgba(184,134,11,0.25)', borderRadius: 14, padding: '5px 12px', textDecoration: 'none', fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
