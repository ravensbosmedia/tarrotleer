// Beheer: vaste mails (welkomstmail, wachtwoord vergeten …). Tekst aanpassen, voorbeeld bekijken, testmail naar jezelf,
// per mail aan/uit. Versturen kan pas als mail is ingesteld (Office 365, zie README "Mail en wachtwoord vergeten").
import React, { useCallback, useEffect, useState } from 'react';
import { ZF_KNOP, ZF_KNOP_PAARS } from '../../lib/zenStijl';

interface Velden { onderwerp: string; titel: string; tekst: string; knop_tekst: string; knop_url: string; aan: boolean }
interface MailRij extends Velden {
  sleutel: string; naam: string; uitleg: string; kanUit: boolean; velden: string[]; aangepast: boolean; bijgewerkt: string | null; door: string | null;
  standaard: Omit<Velden, 'aan'>;
}
interface LogRij { tijd: string; aan: string; soort: string; onderwerp: string; status: string; fout: string }

const SERIF = "'Cormorant Garamond', Georgia, serif";
const label: React.CSSProperties = { display: 'block', fontSize: 12, color: '#E1D2E8', margin: '0.9rem 0 0.35rem' };
const cel: React.CSSProperties = { padding: '6px 8px', borderBottom: '0.5px solid rgba(239,180,255,0.12)', fontSize: 13, color: '#E0D5E9', verticalAlign: 'top' };

export const MailsPage: React.FC = () => {
  const [data, setData] = useState<{ ingesteld: boolean; mails: MailRij[] } | null>(null);
  const [gekozen, setGekozen] = useState('welkom');
  const [concept, setConcept] = useState<Velden | null>(null);
  const [voorbeeld, setVoorbeeld] = useState<{ onderwerp: string; html: string } | null>(null);
  const [melding, setMelding] = useState<{ tekst: string; goed: boolean } | null>(null);
  const [log, setLog] = useState<LogRij[]>([]);

  const laad = useCallback(() => fetch('/api/admin/mails').then((r) => r.json()).then(setData), []);
  useEffect(() => { laad(); fetch('/api/admin/mails/log').then((r) => r.json()).then(setLog).catch(() => {}); }, [laad]);
  const mail = data?.mails.find((m) => m.sleutel === gekozen) ?? null;
  useEffect(() => { if (mail) setConcept({ onderwerp: mail.onderwerp, titel: mail.titel, tekst: mail.tekst, knop_tekst: mail.knop_tekst, knop_url: mail.knop_url, aan: mail.aan }); }, [mail]);

  // Voorbeeld bijwerken terwijl je typt (met een korte pauze)
  useEffect(() => {
    if (!concept) return;
    const t = setTimeout(() => {
      fetch(`/api/admin/mails/${gekozen}/voorbeeld`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(concept) })
        .then(async (r) => { const d = await r.json(); if (r.ok) setVoorbeeld(d); }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [concept, gekozen]);

  const toon = (tekst: string, goed = true) => { setMelding({ tekst, goed }); setTimeout(() => setMelding(null), 5000); };
  const gewijzigd = !!(mail && concept && (['onderwerp', 'titel', 'tekst', 'knop_tekst', 'knop_url', 'aan'] as const).some((k) => concept[k] !== mail[k]));

  async function bewaar(body: object, ok: string) {
    const r = await fetch(`/api/admin/mails/${gekozen}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { toon(ok); laad(); } else toon(d.error || 'Opslaan mislukt', false);
  }
  async function testmail() {
    if (gewijzigd) { toon('Sla eerst op; de testmail gebruikt de opgeslagen tekst.', false); return; }
    const r = await fetch(`/api/admin/mails/${gekozen}/test`, { method: 'POST' });
    const d = await r.json().catch(() => ({}));
    toon(r.ok ? `Testmail verstuurd naar ${d.aan}` : d.error || 'Versturen mislukt', r.ok);
    fetch('/api/admin/mails/log').then((x) => x.json()).then(setLog).catch(() => {});
  }
  const zet = (k: keyof Velden, v: string | boolean) => setConcept((c) => (c ? { ...c, [k]: v } : c));

  return (
    <div className="zf-pagina">
      <div className="zf-kop"><div>
        <p className="zf-label">Beheer</p>
        <h1 className="zf-titel">Mails</h1>
        <p className="zf-intro">De vaste mails die Zen Flow automatisch verstuurt. Pas de tekst aan, bekijk het voorbeeld en stuur een testmail naar jezelf.</p>
      </div></div>
      <div className="zf-inhoud" style={{ maxWidth: 1100 }}>
        {data && !data.ingesteld && (
          <div className="zf-kaart" style={{ padding: '0.9rem 1.2rem', marginBottom: '1.2rem', borderColor: '#F1CB78' }}>
            <strong style={{ color: '#FFF3DF' }}>Mail is nog niet ingesteld.</strong>{' '}
            <span style={{ color: '#E0D5E9', fontSize: 14 }}>Je kunt de teksten al schrijven en bekijken. Versturen (ook een testmail) kan pas na de koppeling met Office 365.</span>
          </div>
        )}
        {melding && <p role="status" style={{ color: melding.goed ? '#9BD49B' : '#F1CB78', marginBottom: '1rem' }}>{melding.tekst}</p>}
        {!data && <p style={{ color: '#B9A9CC' }}>Laden…</p>}

        {data && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {data.mails.map((m) => (
              <button key={m.sleutel} onClick={() => setGekozen(m.sleutel)} aria-pressed={m.sleutel === gekozen}
                style={{ ...(m.sleutel === gekozen ? ZF_KNOP : ZF_KNOP_PAARS), padding: '0.45rem 1rem', fontSize: 14 }}>
                {m.naam} <span style={{ opacity: 0.75, fontSize: 12 }}>· {m.aan ? 'aan' : 'uit'}</span>
              </button>
            ))}
          </div>
        )}

        {mail && concept && (
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div className="zf-kaart" style={{ flex: '1 1 400px', padding: '1.2rem 1.4rem', minWidth: 0 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, margin: '0 0 0.2rem' }}>{mail.naam}</h2>
              <p style={{ fontSize: 13, color: '#B9A9CC', margin: '0 0 0.4rem' }}>{mail.uitleg}</p>
              {mail.kanUit ? (
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#FFF3DF', margin: '0.6rem 0' }}>
                  <input type="checkbox" checked={concept.aan} onChange={(e) => zet('aan', e.target.checked)} style={{ width: 18, height: 18, accentColor: '#F1CB78' }} />
                  Deze mail automatisch versturen
                </label>
              ) : <p style={{ fontSize: 13, color: '#E0D5E9', margin: '0.6rem 0' }}>Deze mail staat altijd aan.</p>}
              <label style={label} htmlFor="m-onderwerp">Onderwerp</label>
              <input id="m-onderwerp" className="zf-veld" value={concept.onderwerp} onChange={(e) => zet('onderwerp', e.target.value)} maxLength={200} />
              <label style={label} htmlFor="m-titel">Titel in de mail</label>
              <input id="m-titel" className="zf-veld" value={concept.titel} onChange={(e) => zet('titel', e.target.value)} maxLength={200} />
              <label style={label} htmlFor="m-tekst">Tekst <span style={{ color: '#B9A9CC' }}>(lege regel = nieuwe alinea)</span></label>
              <textarea id="m-tekst" className="zf-veld" rows={12} value={concept.tekst} onChange={(e) => zet('tekst', e.target.value)} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 160px' }}>
                  <label style={label} htmlFor="m-knop">Tekst op de knop <span style={{ color: '#B9A9CC' }}>(leeg = geen knop)</span></label>
                  <input id="m-knop" className="zf-veld" value={concept.knop_tekst} onChange={(e) => zet('knop_tekst', e.target.value)} maxLength={80} />
                </div>
                {mail.kanUit && (
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={label} htmlFor="m-url">Link van de knop</label>
                    <input id="m-url" className="zf-veld" value={concept.knop_url} onChange={(e) => zet('knop_url', e.target.value)} maxLength={500} />
                  </div>
                )}
              </div>
              <p style={{ fontSize: 12.5, color: '#B9A9CC', marginTop: '0.8rem' }}>
                Invulvelden: {mail.velden.map((v) => <code key={v} style={{ color: '#F1CB78', marginRight: 8 }}>{`{${v}}`}</code>)}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: '0.8rem' }}>
                <button style={ZF_KNOP} disabled={!gewijzigd} onClick={() => bewaar(concept, 'Opgeslagen ✓')}>Opslaan</button>
                <button style={ZF_KNOP_PAARS} onClick={testmail} disabled={!data?.ingesteld} title={data?.ingesteld ? '' : 'Kan pas als mail is ingesteld'}>Testmail naar mij</button>
                {mail.aangepast && <button style={ZF_KNOP_PAARS} onClick={() => { if (confirm('De standaardtekst terugzetten? Je eigen tekst gaat verloren.')) bewaar({ standaard: true }, 'Standaardtekst teruggezet'); }}>Standaardtekst terugzetten</button>}
              </div>
              <p style={{ fontSize: 12, color: '#B9A9CC', marginTop: '0.6rem' }}>
                {mail.aangepast ? `Aangepast${mail.door ? ` door ${mail.door}` : ''}${mail.bijgewerkt ? ` op ${mail.bijgewerkt.slice(0, 16)}` : ''}` : 'Standaardtekst'}
              </p>
            </div>

            <div style={{ flex: '1 1 380px', minWidth: 0 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F1CB78', margin: '0 0 0.4rem' }}>Voorbeeld (met voorbeeldnaam Sanne)</p>
              {voorbeeld && <p style={{ fontSize: 14, color: '#FFF3DF', margin: '0 0 0.5rem' }}><span style={{ color: '#B9A9CC' }}>Onderwerp:</span> {voorbeeld.onderwerp}</p>}
              <iframe title="Voorbeeld van de mail" srcDoc={voorbeeld?.html ?? ''} sandbox="" style={{ width: '100%', height: 620, border: '0.5px solid rgba(239,180,255,0.22)', borderRadius: 10, background: '#0D0C22' }} />
            </div>
          </div>
        )}

        <div className="zf-kaart" style={{ padding: '1.1rem 1.3rem', marginTop: '1.4rem' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, margin: '0 0 0.6rem' }}>Verstuurde mails <span style={{ fontSize: 14, color: '#B9A9CC' }}>· laatste 100</span></h2>
          {log.length === 0 ? <p style={{ fontSize: 13.5, color: '#B9A9CC' }}>Nog geen mails verstuurd.</p> : (
            <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Tijd (UTC)', 'Aan', 'Soort', 'Onderwerp', 'Status'].map((h) => <th key={h} style={{ ...cel, color: '#B9A9CC', fontSize: 11, textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>)}</tr></thead>
              <tbody>{log.map((l, i) => (
                <tr key={i}><td style={{ ...cel, whiteSpace: 'nowrap' }}>{l.tijd.slice(0, 16)}</td><td style={cel}>{l.aan}</td><td style={cel}>{l.soort}</td><td style={cel}>{l.onderwerp}</td>
                  <td style={{ ...cel, color: l.status === 'verstuurd' ? '#9BD49B' : '#F1CB78' }} title={l.fout}>{l.status}{l.fout ? ' ⓘ' : ''}</td></tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </div>
  );
};
