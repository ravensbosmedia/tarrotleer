import React, { useEffect, useMemo, useState } from 'react';
import { Lid, Abonnement, ABONNEMENT_LABEL, datumNL } from '../../lib/account';

const G = {
  goud: '#F1CB78', goudBleek: '#FFF3DF',
  bg: '#0D0C22', bg2: '#20162F', rand: 'rgba(241,203,120,0.25)',
};

type LidMetTelling = Lid & { voortgang_items: number };

const invoer: React.CSSProperties = {
  padding: '7px 9px', fontSize: 15, borderRadius: 8, border: `0.5px solid ${G.rand}`,
  background: G.bg, color: G.goudBleek, fontFamily: 'inherit',
};
const label: React.CSSProperties = { fontSize: 12, opacity: 0.6, display: 'block', marginBottom: 3 };

export const LedenPage: React.FC = () => {
  const [leden, setLeden] = useState<LidMetTelling[] | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [zoek, setZoek] = useState('');
  const [status, setStatus] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch('/api/admin/leden')
      .then(async (r) => { if (!r.ok) throw new Error((await r.json()).error); return r.json(); })
      .then(setLeden)
      .catch((e) => setFout(e.message || 'Kon leden niet laden'));
  }, []);

  async function wijzig(id: number, wijziging: Record<string, unknown>) {
    setStatus((s) => ({ ...s, [id]: 'Opslaan…' }));
    const r = await fetch(`/api/admin/leden/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(wijziging),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setStatus((s) => ({ ...s, [id]: d.error || 'Mislukt' })); return; }
    setLeden((l) => l && l.map((x) => (x.id === id ? { ...x, ...d } : x)));
    setStatus((s) => ({ ...s, [id]: 'Opgeslagen ✓' }));
  }

  function resetWachtwoord(lid: Lid) {
    const nieuw = window.prompt(`Nieuw wachtwoord voor ${lid.naam} (minimaal 8 tekens):`);
    if (nieuw) wijzig(lid.id, { nieuw_wachtwoord: nieuw });
  }

  const gefilterd = useMemo(() => {
    const z = zoek.trim().toLowerCase();
    return (leden || []).filter((l) => !z || l.naam.toLowerCase().includes(z) || l.email.includes(z));
  }, [leden, zoek]);

  const telling = useMemo(() => {
    const t: Record<Abonnement, number> = { gratis: 0, maand: 0, jaar: 0 };
    (leden || []).forEach((l) => { t[l.abonnement_actief]++; });
    return t;
  }, [leden]);

  return (
    <div style={{ minHeight: '100vh', background: G.bg, color: G.goudBleek, fontFamily: "'DM Sans', serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: '0.15em', color: G.goud, textAlign: 'center', margin: '0 0 0.5rem' }}>
          LEDEN
        </h1>
        {leden && (
          <p style={{ textAlign: 'center', opacity: 0.65, margin: '0 0 1.5rem', fontSize: 15 }}>
            {leden.length} accounts · {telling.gratis} gratis · {telling.maand} maand · {telling.jaar} jaar
          </p>
        )}

        {fout && <p style={{ textAlign: 'center', color: '#ff9a8a' }}>{fout}</p>}
        {!leden && !fout && <p style={{ textAlign: 'center', opacity: 0.6 }}>Laden…</p>}

        {leden && (
          <>
            <input
              placeholder="Zoek op naam of e-mail"
              value={zoek} onChange={(e) => setZoek(e.target.value)}
              style={{ ...invoer, width: '100%', marginBottom: '1rem', fontSize: 16, padding: '10px 12px' }}
            />
            {gefilterd.map((l) => (
              <div key={l.id} style={{
                background: G.bg2, border: `0.5px solid ${l.actief ? G.rand : 'rgba(255,120,100,0.35)'}`,
                borderRadius: 14, padding: '1rem 1.2rem', marginBottom: '0.8rem', opacity: l.actief ? 1 : 0.7,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
                  <div>
                    <strong style={{ fontSize: 17 }}>{l.naam}</strong>
                    {l.rol === 'admin' && <span style={{ fontSize: 11, marginLeft: 8, color: G.goud, fontFamily: "'Cormorant Garamond', serif" }}>BEHEERDER</span>}
                    <div style={{ opacity: 0.7, fontSize: 15, wordBreak: 'break-all' }}>{l.email}</div>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.55, textAlign: 'right' }}>
                    Lid sinds {datumNL(l.aangemaakt)}<br />
                    Laatst ingelogd {datumNL(l.laatst_ingelogd)} · {l.voortgang_items} voortgangsitems
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.9rem', alignItems: 'flex-end' }}>
                  <div>
                    <span style={label}>Abonnement</span>
                    <select value={l.abonnement} onChange={(e) => wijzig(l.id, { abonnement: e.target.value })} style={invoer}>
                      {(Object.keys(ABONNEMENT_LABEL) as Abonnement[]).map((a) => (
                        <option key={a} value={a}>{ABONNEMENT_LABEL[a]}</option>
                      ))}
                    </select>
                  </div>
                  {l.abonnement !== 'gratis' && (
                    <div>
                      <span style={label}>Geldig t/m {l.abonnement_actief === 'gratis' && <span style={{ color: '#ff9a8a' }}>(verlopen)</span>}</span>
                      <input
                        type="date" value={l.abonnement_tot || ''}
                        onChange={(e) => e.target.value && wijzig(l.id, { abonnement_tot: e.target.value })}
                        style={invoer}
                      />
                    </div>
                  )}
                  <div>
                    <span style={label}>Rol</span>
                    <select value={l.rol} onChange={(e) => wijzig(l.id, { rol: e.target.value })} style={invoer}>
                      <option value="lid">Lid</option>
                      <option value="admin">Beheerder</option>
                    </select>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, paddingBottom: 6 }}>
                    <input type="checkbox" checked={!l.actief} onChange={(e) => wijzig(l.id, { actief: !e.target.checked })} />
                    Geblokkeerd
                  </label>
                  <button onClick={() => resetWachtwoord(l)} style={{ ...invoer, cursor: 'pointer' }}>
                    Wachtwoord resetten
                  </button>
                  {status[l.id] && <span style={{ fontSize: 13, opacity: 0.75, paddingBottom: 6 }}>{status[l.id]}</span>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
