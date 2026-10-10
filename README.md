# Mystieke Kaarten — leerplatform

Een Nederlandstalig leerplatform voor **tarot, Lenormand, pendelen, numerologie en astrologie**, met quizzen, flashcards, lessen, een cursus van 8 modules, leggingen met AI-duiding en voortgang per account.

- **Live:** https://leren.fb-techlabs.com (inloggen of gratis account maken)
- **Repo:** https://github.com/ravensbosmedia/tarrotleer
- **Server:** VPS `vpstest`, map `/home/ubuntu/tarrotleer`

---

## Onderdelen

| Onderdeel | Pagina's | Wat het doet |
|---|---|---|
| **Tarot** | `/tarot`, `/reading/:type`, `/bibliotheek`, `/flashcards`, `/quiz`, `/lessen` | 78 kaarten (lokaal in `public/cards/*.webp`), leggingen (dagkaart, 3 kaarten, Keltisch kruis, relatie, carrière) met AI-duiding en chat, flashcards, doorlopende quiz, lessen |
| **Lenormand** | `/lenormand/leggingen`, `/bibliotheek`, `/combinaties`, `/flashcards`, `/quiz` | 36 kaarten met foto's, leggingen met verbindingen en AI-duiding, 1260 combinaties (met liefde, werk en advies), quiz met 6791 vragen in 3 niveaus |
| **Pendel** | `/pendel/lessen`, `/schijven`, `/oefeningen`, `/chakras`, `/quiz` | lessen en video's, pendelschijven, quiz |
| **Numerologie** | `/numerologie/*` | profielanalyse, levenspad, naam, expressie-, bestuurs- en huisnummer |
| **Astrologie** | `/sterrenbeelden`, `/maanfase`, `/natal`, `/compatibiliteit` | dag- en maandhoroscoop, maankalender, geboortehoroscoop (Kerykeion), compatibiliteit |
| **Cursus** | `/cursus`, `/cursus/module-01` t/m `-08` | numerologie (1–3), astrologie (4–7), synthese (8), elk met quiz |
| **Account** | `/account`, `/voortgang`, `/admin/leden` | account en wachtwoord, voortgang en opgeslagen leggingen, ledenbeheer (alleen beheerders) |

## Techniek

- **Frontend:** React 18 + TypeScript + Vite + Tailwind. De server levert de **gebouwde `dist/`**, dus na elke wijziging aan `src/` of `public/` is `npm run build` nodig.
- **Server:** Express (`server.ts`, via `tsx`) op poort **4210**, achter nginx (`/etc/nginx/sites-available/leren.fb-techlabs.com`, Let's Encrypt).
- **Accounts en voortgang:** `accounts.ts` met SQLite (`better-sqlite3`), database `data/leren.db` (niet in git).
- **Geboortehoroscoop:** Python/FastAPI-service met Kerykeion op poort **4211** (`venv/`).
- **AI:** OpenAI **gpt-5.5**, alleen via de server; de key komt nooit in de browser. gpt-5.5 is een reasoning-model: gebruik `max_completion_tokens` en geen eigen `temperature`.

### Services (systemd)

| Service | Wat |
|---|---|
| `tarrot-server` | Express op 4210 (`tarrot-server.service` in de repo) |
| `tarrot-kerykeion` | FastAPI op 4211 (`tarrot-kerykeion.service`) |

```bash
npm run build                          # frontend opnieuw bouwen (geen herstart nodig)
sudo systemctl restart tarrot-server   # alleen nodig na wijzigingen aan server.ts / accounts.ts
journalctl -u tarrot-server -f         # logboek
```

### Omgevingsvariabelen (`.env`, zie `.env.example`)

| Naam | Waarvoor |
|---|---|
| `OPENAI_API_KEY` | AI-duidingen, chat, daghoroscoop |
| `PORT` | 4210 |
| `ADMIN_EMAIL` | dit adres krijgt bij aanmelden of inloggen automatisch beheerrechten |
| `ASTROAPI_KEY` | astrology-api.io (maandhoroscoop) |
| `ASTROAPI_MAANDLIMIET` | harde grens op het aantal AstroAPI-calls per maand (standaard 45; het gratis plan geeft 50) |

---

## Accounts en abonnementen

- Zonder geldige sessie levert de server een **inlog- en aanmeldpagina** (die verving in oktober 2026 de pincode). Iedereen kan gratis een account maken.
- Wachtwoorden worden met **scrypt** gehasht. De sessiecookie `tl_sessie` is HttpOnly en Secure en blijft 30 dagen geldig. Er geldt een rem van 10 pogingen per kwartier per IP.
- Elk account heeft een **abonnementstype `gratis` / `maand` / `jaar`** met een datum `abonnement_tot`. Na die datum valt het account automatisch terug op `gratis`. Op dit moment is **alles gratis**; het veld staat klaar voor betaling (Mollie).
- Beheerders zetten het abonnement, de rol, blokkeren en een wachtwoordreset via **`/admin/leden`**. Wachtwoord-vergeten per e-mail bestaat nog niet.

## Voortgang

Alles wordt per account op de server bewaard:

| Wat | Waar | Hoe |
|---|---|---|
| Quizzen (Lenormand, tarot, pendel, cursusmodules) | tabel `quiz_stats` + voortgang-item `resultaat` | goed/fout per **sleutel** (`kaart:14`, `vraag:combi-advies:14-29`, `soort:…`, `niveau:…`); rondes, beste score, totalen |
| Flashcards | `quiz_stats` (`tarot-flashcards`, `lenormand-flashcards`) | per kaart ken ik / nog oefenen |
| Lessen | `voortgang` (`tarot-lessen`, `pendel-lessen`, `pendel-videos`) | per les voltooid |
| Leggingen | `voortgang` (`leggingen`) | kaarten, vraag, duiding, verbindingen |

Kaarten en vragen die vaak fout gaan, of nog nooit gevraagd zijn, krijgen een hoger **gewicht** en komen vaker terug (`maakGewicht` in `src/lib/voortgang.ts`). Een cursusmodule telt als afgerond bij **70%** in de quiz.

**API:** `GET/PUT/DELETE /api/voortgang`, `POST /api/quiz/ronde`, `GET /api/quiz/stats`, `GET /api/auth/ik`.

## Academie (losse cursussen — alleen beheerders)

Nieuwe, losse cursussen (los van de bestaande cursus numerologie/astrologie) komen binnen als zip en worden door beheerders beoordeeld en verbeterd. **Niets hiervan is zichtbaar voor gewone leden.**

1. **Uploaden:** `/admin/cursussen` (zip tot 300 MB → `data/uploads/cursussen/`, `cursussen.ts`; nginx heeft een eigen location met 300 MB voor deze route).
2. **Importeren:** knop *Importeren in Academie* (`academie.ts`). Mappen `NN-naam/NN-MM-hoofdstuk.md` worden cursussen en hoofdstukken; titels komen uit `00-START-HIER.md`. Opnieuw importeren overschrijft geen bewerkte hoofdstukken.
3. **Beoordelen:** `/admin/academie` (voortgang over alle cursussen) → `/admin/academie/:slug` (hoofdstukken met status) → `/admin/academie/h/:id` (editor: Markdown met voorbeeldweergave, status *te beoordelen / aangepast / goedgekeurd*, notitie, origineel, versiegeschiedenis met terugzetten, Ctrl+S). Verbeteren gebeurt **met ChatGPT in de browser** (abonnement), niet via de API: *Kopieer opdracht* zet een schrijfopdracht met de huidige tekst op het klembord, *Plak in editor* zet het antwoord terug. De server doet hier bewust geen AI-aanroepen (kosten).

4. **Download en upload:** per hoofdstuk *Download (.md)* en *Upload nieuwe versie (.md)*, per cursus *Download cursus (.zip)* en *Upload nieuwe versie (.zip)*. Hoofdstukken worden herkend aan het nummer in de bestandsnaam (`06-03-amethist.md`). Alleen gewijzigde hoofdstukken worden bijgewerkt, en de vorige versie blijft bewaard.
6. **Afbeeldingen:** bij het importeren worden afbeeldingen (png, jpg, webp, gif, svg) uit de zip uitgepakt naar `data/academie-media/u<uploadId>/…`. Verwijzingen in de tekst (`![alt](pad)` of `<img src>`, relatief aan het .md-bestand) worden omgezet naar `/api/academie-media/…`. Die route is voorlopig alleen voor beheerders. Uploads tot **1 GB**; zowel het uploaden als het importeren blokkeert de server niet.
7. **Opnieuw importeren:** hoofdstukken die nog niet bewerkt zijn, krijgen de nieuwe versie (de vorige blijft bewaard). Bij al bewerkte hoofdstukken wordt alleen het *origineel* bijgewerkt, zodat je de nieuwe versie met één knop kunt overnemen.
5. **Nieuwe cursussen:** op `/admin/academie` staan *Sjabloon voor ChatGPT (.zip)* (uitleg plus voorbeeldcursus uit `sjablonen/academie-cursus/`, aangevuld met de bestaande cursussen en het eerstvolgende vrije nummer) en *Nieuwe cursus uploaden (.zip)* (upload en import in één keer). Een onveranderd sjabloon importeert niets, omdat de voorbeeldmap `NN-…` heet.

Tabellen: `academie_cursussen`, `academie_hoofdstukken`, `academie_versies` (elke opslag bewaart de vorige versie), `cursus_uploads`. De weergave van Markdown (`src/components/Markdown.tsx`) bouwt React-elementen en voert nooit HTML uit.

## Lenormand-quiz

`src/data/lenormand/quizGenerator.ts` maakt elke ronde nieuwe vragen. Elke vraag heeft een vaste **vraagcode**, los van de geschudde antwoorden, zodat de voortgang per vraag klopt.

| Niveau | Vraagsoorten | Aantal |
|---|---|---|
| Beginner | nummer ↔ kaart, sleutelwoorden, 20 basisvragen | 275 |
| Gevorderd | omschrijving → kaart, liefde/werk/gezondheid → kaart, combinatie (betekenis en kaartpaar) | 2664 |
| Pro | kaart in liefde/werk, combinatie in liefde/werk en advies | 3852 |

## Lenormand-combinaties

`public/lenormand/combinaties.json` bevat 1260 paren. Elk paar heeft een duiding `m`, kernwoorden `k`, thema's `t`, liefde `l`, werk `w`, advies `ad` en bronlinks `bronnen`. Het is een **eigen synthese door gpt-5.5** op basis van onze kaartbetekenissen en de combinatiepagina's van online-orakels.nl en labyrinthos.co. Er is niets letterlijk overgenomen.

```bash
python3 scripts/bronnen_combinaties.py                                   # cache/bronnen/*.html → cache/bronnen/paren.json
node node_modules/.bin/tsx scripts/combinaties-genereren.mjs [--proef 8]  # duiding + kernwoorden (hervatbaar)
node node_modules/.bin/tsx scripts/combinaties-verdiepen.mjs [--proef 5]  # liefde / werk / advies (hervatbaar)
```

De ruwe bronpagina's staan in `cache/bronnen/` (niet in git). Oude versies worden bewaard in `cache/archief/`. De vroegere AuraLine-basis was onbruikbaar: die had alleen fragmenten van 150 tekens met verkeerde automatische thema's.

## Horoscoop (zuinig met AstroAPI)

- **Daghoroscoop:** één gpt-5.5-call per dag voor alle 12 tekens, met de echte maanstand. De server maakt hem vooraf (bij het opstarten en elk halfuur een controle) en zet hem in `cache/daghoroscoop-DATUM.json`.
- **Maandhoroscoop:** via AstroAPI, maximaal 12 calls per maand. Elk antwoord wordt **permanent** bewaard in `cache/astroapi/`. Een harde teller stopt bij `ASTROAPI_MAANDLIMIET`; het verbruik staat op `GET /api/astroapi/verbruik`. Roep AstroAPI nooit per bezoeker of per dag aan.
- Het oude script dat horoscope.com scrapete staat in `scripts/archief/` en wordt niet meer gebruikt. `scripts/weekhoroscoop-refresh.mjs` vult nog `/api/horoscoop/week`.

## Back-up

Elke nacht om 03:30 draait `/home/ubuntu/backups/tarrotleer/backup.sh` via cron. Het script maakt eerst een consistente kopie van de SQLite-database en pakt daarna de projectmap in, inclusief `.env`, `cache/` en `data/`, maar zonder `node_modules`, `venv` en `dist`. Back-ups worden 14 dagen bewaard.

## Ontwikkelen

```bash
npm install
npx tsc --noEmit -p tsconfig.app.json   # typecontrole (let op: `-p .` controleert niets)
npm run build
```

Testen van de server zonder de live site te raken: kopieer `server.ts` met een andere `PORT` (bijvoorbeeld 4299) en start die met `tsx`. Gebruik daarbij een tijdelijk testaccount en verwijder het daarna weer.
