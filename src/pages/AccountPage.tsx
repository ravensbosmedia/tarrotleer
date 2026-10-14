import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, uitloggen, ABONNEMENT_LABEL, datumNL } from '../lib/account';

const G = {
  goud: '#F1CB78', goudBleek: '#FFF3DF',
  bg: '#0D0C22', bg2: '#20162F', rand: 'rgba(241,203,120,0.25)',
};

const kop: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.1em', color: G.goud, margin: '0 0 0.8rem',
};
const kaart: React.CSSProperties = {
  background: G.bg2, border: `0.5px solid ${G.rand}`, borderRadius: 16, padding: '1.5rem', marginBottom: '1.2rem',
};
const veld: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 16, borderRadius: 9, border: `0.5px solid ${G.rand}`,
  background: G.bg, color: G.goudBleek, fontFamily: 'inherit', marginTop: 4,
};
const knop: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.08em', padding: '9px 18px', borderRadius: 9,
  border: 'none', background: G.goud, color: G.bg, cursor: 'pointer', marginTop: '1rem',
};

export const AccountPage: React.FC = () => {
  const { lid, laden } = useAccount();
  const [oud, setOud] = useState('');
  const [nieuw, setNieuw] = useState('');
  const [melding, setMelding] = useState<{ ok: boolean; tekst: string } | null>(null);

  async function wijzigWachtwoord(e: React.FormEvent) {
    e.preventDefault();
    setMelding(null);
    const r = await fetch('/api/auth/wachtwoord', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oud, nieuw }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { setMelding({ ok: true, tekst: 'Je wachtwoord is gewijzigd.' }); setOud(''); setNieuw(''); }
    else setMelding({ ok: false, tekst: d.error || 'Wijzigen mislukt' });
  }

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'DM Sans', serif" }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: '0.15em', color: G.goud, textAlign: 'center', margin: '0 0 2rem' }}>
          MIJN ACCOUNT
        </h1>

        {laden || !lid ? (
          <p style={{ textAlign: 'center', opacity: 0.6 }}>Laden…</p>
        ) : (
          <>
            <div style={kaart}>
              <h2 style={kop}>GEGEVENS</h2>
              <div style={{ fontSize: 17, lineHeight: 1.8 }}>
                <div><strong>{lid.naam}</strong></div>
                <div style={{ opacity: 0.75 }}>{lid.email}</div>
                <div style={{ opacity: 0.55, fontSize: 14 }}>Lid sinds {datumNL(lid.aangemaakt)}</div>
              </div>
            </div>

            <div style={kaart}>
              <h2 style={kop}>ABONNEMENT</h2>
              <div style={{ fontSize: 20, color: G.goud }}>{ABONNEMENT_LABEL[lid.abonnement_actief]}</div>
              {lid.abonnement !== 'gratis' && (
                <div style={{ fontSize: 15, opacity: 0.75, marginTop: 4 }}>
                  {lid.abonnement_actief === 'gratis'
                    ? `Je ${ABONNEMENT_LABEL[lid.abonnement].toLowerCase()} is verlopen op ${datumNL(lid.abonnement_tot)}.`
                    : `Geldig tot en met ${datumNL(lid.abonnement_tot)}.`}
                </div>
              )}
              <p style={{ fontSize: 15, opacity: 0.6, margin: '0.8rem 0 0' }}>
                Alle onderdelen zijn op dit moment gratis te gebruiken.
              </p>
            </div>

            <div style={kaart}>
              <h2 style={kop}>WACHTWOORD WIJZIGEN</h2>
              <form onSubmit={wijzigWachtwoord}>
                <label style={{ fontSize: 14, opacity: 0.75 }}>Huidig wachtwoord
                  <input type="password" autoComplete="current-password" value={oud} onChange={(e) => setOud(e.target.value)} style={veld} required />
                </label>
                <div style={{ height: 10 }} />
                <label style={{ fontSize: 14, opacity: 0.75 }}>Nieuw wachtwoord (minimaal 8 tekens)
                  <input type="password" autoComplete="new-password" minLength={8} value={nieuw} onChange={(e) => setNieuw(e.target.value)} style={veld} required />
                </label>
                <button type="submit" style={knop}>Opslaan</button>
                {melding && (
                  <p style={{ fontSize: 15, color: melding.ok ? '#9bd49b' : '#ff9a8a', margin: '0.6rem 0 0' }}>{melding.tekst}</p>
                )}
              </form>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {lid.rol === 'admin' && (
                <Link to="/admin/leden" style={{ ...knop, textDecoration: 'none', background: 'transparent', color: G.goud, border: `0.5px solid ${G.goud}` }}>
                  Leden beheren
                </Link>
              )}
              <button onClick={uitloggen} style={{ ...knop, background: 'transparent', color: G.goudBleek, border: `0.5px solid ${G.rand}` }}>
                Uitloggen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
