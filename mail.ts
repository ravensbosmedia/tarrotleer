// ─── Mail versturen (Microsoft 365 via de Graph-API) ────────────────────
// Gebruikt door: wachtwoord vergeten (accounts.ts), vaste mails/welkomstmail (mails.ts), bijeenkomsten.
// Instellingen in .env (alleen de NAMEN staan hier; de waarden zet de gebruiker zelf):
//   MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET  app-registratie in Microsoft Entra, recht Mail.Send (toepassing),
//                                                 beperkt tot de afzendermailbox
//   MAIL_AFZENDER                                 bv. noreply@zen-flow.nl (gedeelde mailbox)
//   MAIL_MODUS=bestand                            alleen voor tests: mails worden in data/mail-test/ gezet, niet verstuurd
// Zonder deze instellingen is mail "niet ingesteld": de functies die mail nodig hebben blijven dan uit.
import Database from 'better-sqlite3';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface Mail { aan: string; onderwerp: string; html: string; tekst: string; soort: string }

const modus = () => (process.env.MAIL_MODUS || '').trim();
export function mailIngesteld(): boolean {
  if (modus() === 'bestand') return true;
  return ['MS_TENANT_ID', 'MS_CLIENT_ID', 'MS_CLIENT_SECRET', 'MAIL_AFZENDER'].every((k) => (process.env[k] || '').trim() !== '');
}

let db: Database.Database | null = null;
function logDb(root: string) {
  if (!db) {
    db = new Database(join(root, 'data', 'leren.db'));
    db.exec(`CREATE TABLE IF NOT EXISTS mail_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, tijd TEXT NOT NULL DEFAULT (datetime('now')),
      aan TEXT NOT NULL, soort TEXT NOT NULL, onderwerp TEXT NOT NULL, status TEXT NOT NULL, fout TEXT NOT NULL DEFAULT ''
    )`);
  }
  return db;
}

let token: { waarde: string; tot: number } | null = null;
async function graphToken(): Promise<string> {
  if (token && token.tot > Date.now() + 60_000) return token.waarde;
  const r = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(process.env.MS_TENANT_ID!.trim())}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID!.trim(), client_secret: process.env.MS_CLIENT_SECRET!.trim(),
      scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials',
    }),
  });
  const d = await r.json().catch(() => ({})) as { access_token?: string; expires_in?: number; error?: string };
  if (!r.ok || !d.access_token) throw new Error(`Inloggen bij Microsoft mislukt (${r.status} ${d.error || ''})`.trim());
  token = { waarde: d.access_token, tot: Date.now() + (d.expires_in || 3600) * 1000 };
  return token.waarde;
}

/** Verstuurt één mail. Gooit een fout als het niet lukt; elke poging komt in mail_log (zonder de inhoud). */
export async function verstuurMail(root: string, m: Mail): Promise<void> {
  const log = logDb(root).prepare('INSERT INTO mail_log (aan, soort, onderwerp, status, fout) VALUES (?, ?, ?, ?, ?)');
  try {
    if (!mailIngesteld()) throw new Error('Mail is nog niet ingesteld');
    if (modus() === 'bestand') {
      const map = join(root, 'data', 'mail-test'); mkdirSync(map, { recursive: true });
      writeFileSync(join(map, `${Date.now()}-${m.soort}.json`), JSON.stringify(m, null, 2));
    } else {
      const afzender = process.env.MAIL_AFZENDER!.trim();
      const r = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(afzender)}/sendMail`, {
        method: 'POST', headers: { Authorization: `Bearer ${await graphToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: { subject: m.onderwerp, body: { contentType: 'HTML', content: m.html }, toRecipients: [{ emailAddress: { address: m.aan } }] },
          saveToSentItems: false,
        }),
      });
      if (r.status !== 202) throw new Error(`Microsoft weigerde de mail (${r.status}) ${(await r.text()).slice(0, 200)}`);
    }
    log.run(m.aan, m.soort, m.onderwerp, 'verstuurd', '');
  } catch (e) {
    log.run(m.aan, m.soort, m.onderwerp, 'mislukt', String((e as Error).message).slice(0, 300));
    throw e;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** Zen Flow-opmaak voor mail (tabellen + inline stijlen, werkt in Outlook en Gmail).
 *  `alineas` = platte tekst per alinea; `knop` = optionele gouden knop. */
export function mailHtml(titel: string, alineas: string[], knop?: { tekst: string; url: string }, voet?: string): string {
  const p = alineas.map((a) => `<p style="margin:0 0 14px;font:15px/1.6 Arial,sans-serif;color:#E0D5E9">${esc(a).replace(/\n/g, '<br>')}</p>`).join('');
  const k = knop ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px"><tr><td style="border-radius:28px;background:#FFC653">
    <a href="${esc(knop.url)}" style="display:inline-block;padding:13px 26px;font:bold 13px Arial,sans-serif;color:#1C0D06;text-decoration:none;text-transform:uppercase;letter-spacing:.5px">${esc(knop.tekst)}</a></td></tr></table>
    <p style="margin:0 0 14px;font:12px/1.5 Arial,sans-serif;color:#B9A9CC">Werkt de knop niet? Kopieer dan deze link in je browser:<br><span style="color:#F1CB78;word-break:break-all">${esc(knop.url)}</span></p>` : '';
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titel)}</title></head>
<body style="margin:0;padding:0;background:#0D0C22"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0D0C22"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#20162F;border:1px solid #C292BD;border-radius:12px">
<tr><td style="padding:28px 28px 8px;text-align:center;font:20px Georgia,serif;letter-spacing:2px;color:#F5D392">☾<br>ZEN FLOW</td></tr>
<tr><td style="padding:8px 28px 24px"><h1 style="margin:0 0 16px;font:normal 26px/1.2 Georgia,serif;color:#FFF3DF">${esc(titel)}</h1>${p}${k}</td></tr>
<tr><td style="padding:14px 28px 22px;border-top:1px solid #4a3560;font:12px/1.5 Arial,sans-serif;color:#B9A9CC">${esc(voet || 'Zen Flow · Leerplatform voor jouw spirituele reis · zen-flow.nl')}</td></tr>
</table></td></tr></table></body></html>`;
}
