// Leden: komende bijeenkomsten en privégesprekken waarvoor je bent uitgenodigd, met link, pincode en agenda-item.
import React, { useEffect, useState } from 'react';

interface Bijeenkomst { id: number; soort: 'groep' | 'prive'; titel: string; omschrijving: string; start: string; duur_min: number; link: string; pincode: string }

const SERIF = "'Cormorant Garamond', Georgia, serif";
const wanneer = (start: string, duur: number) => {
  const d = new Date(`${start}:00`);   // Nederlandse tijd; de leeromgeving wordt in Nederland gebruikt
  const eind = new Date(d.getTime() + duur * 60_000);
  const tijd = (x: Date) => x.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  return `${d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })} · ${tijd(d)}–${tijd(eind)}`;
};

export const BijeenkomstenPage: React.FC = () => {
  const [lijst, setLijst] = useState<Bijeenkomst[] | null>(null);
  useEffect(() => { fetch('/api/bijeenkomsten').then((r) => r.json()).then(setLijst).catch(() => setLijst([])); }, []);

  return (
    <div className="zf-pagina">
      <div className="zf-kop"><div>
        <p className="zf-label">Samen</p>
        <h1 className="zf-titel">Bijeenkomsten</h1>
        <p className="zf-intro">Online bijeenkomsten en gesprekken waarvoor je bent uitgenodigd. Je doet mee via de link; je hebt alleen je naam nodig (en soms een pincode).</p>
      </div></div>
      <div className="zf-inhoud" style={{ maxWidth: 820 }}>
        {lijst === null && <p style={{ color: '#B9A9CC' }}>Laden…</p>}
        {lijst?.length === 0 && (
          <div className="zf-kaart" style={{ padding: '1.2rem 1.4rem' }}>
            <p style={{ margin: 0, color: '#E0D5E9' }}>Er staan op dit moment geen bijeenkomsten voor je gepland. Zodra er een is, zie je die hier.</p>
          </div>
        )}
        {lijst?.map((b) => (
          <div key={b.id} className="zf-kaart" style={{ padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F1CB78', margin: 0 }}>{b.soort === 'prive' ? 'Privégesprek' : 'Bijeenkomst'}</p>
            <h2 style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 500, color: '#FFF3DF', margin: '0.2rem 0 0.3rem' }}>{b.titel}</h2>
            <p style={{ fontSize: 15, color: '#FFF3DF', margin: '0 0 0.5rem', textTransform: 'capitalize' }}>{wanneer(b.start, b.duur_min)}</p>
            {b.omschrijving && <p style={{ fontSize: 15, color: '#E0D5E9', lineHeight: 1.6, margin: '0 0 0.6rem', whiteSpace: 'pre-wrap' }}>{b.omschrijving}</p>}
            {b.pincode && <p style={{ fontSize: 14, color: '#E0D5E9', margin: '0 0 0.6rem' }}>Pincode: <strong style={{ color: '#F1CB78', letterSpacing: '0.1em' }}>{b.pincode}</strong></p>}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: '0.6rem' }}>
              <a className="zf-knop" href={b.link} target="_blank" rel="noopener noreferrer">Deelnemen →</a>
              <a className="zf-knop-paars" href={`/api/bijeenkomsten/${b.id}/agenda.ics`}>Zet in mijn agenda</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
