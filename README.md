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

9. **Twee soorten pakket voor ChatGPT** (per cursus en per hoofdstuk): *Pakket herwerken* (inhoud verbeteren, met advies) en *Pakket taalronde* (`?soort=taalronde`, opdracht `sjablonen/academie-herwerken/00-OPDRACHT-TAALRONDE.md`: alleen B1-taal, *In het kort*, *Onthoud dit* en een meerkeuzetoets, de inhoud blijft gelijk). Bij elke nieuwe versie blijft de kopafbeelding automatisch staan als de nieuwe tekst er geen heeft. Import met `{ ookBewerkt: true, notitie }` vervangt ook al bewerkte hoofdstukken (vorige versie blijft bewaard).
10. **Pakket interactief** (`?soort=interactief`, opdracht `sjablonen/academie-interactief/00-OPDRACHT-INTERACTIEF.md`): zet een cursus om naar het interactieve formaat (stappen, blokken, meerkeuze) en noemt welke hoofdstukken nog een kopafbeelding missen. Een cursus-zip mag `NN-MM-*.png` bevatten; die worden bij de upload direct als kopafbeelding gekoppeld.
11. **Onderwijsvisie:** `sjablonen/ONDERWIJSVISIE.md` geldt voor alle cursussen en gaat als `00-ONDERWIJSVISIE.md` mee in ieder pakket.
12. **Printversie / PDF:** `/academie/<slug>/print` (en `?hoofdstuk=N`) toont de hele cursus of één hoofdstuk op papierformaat, met per stap het label `H<nr> · stap X van Y` zoals online, schrijflijnen bij Denk na en de antwoorden achterin. Opslaan als PDF via de printfunctie van de browser. Knoppen alleen voor beheerders.
8. **Goedkeuren door alle beheerders:** elke beheerder keurt zelf elk hoofdstuk en daarna de cursus als geheel goed (tabel `academie_goedkeuringen`). Een hoofdstuk krijgt pas de status *goedgekeurd* als **alle actieve beheerders** het hebben goedgekeurd. **Live zetten voor klanten** (`POST /api/admin/academie/:slug/live`) weigert de server zolang een beheerder een hoofdstuk of de cursus nog niet heeft goedgekeurd. Verandert de tekst van een hoofdstuk (bewerken, uploaden of import), dan vervallen de goedkeuringen van dat hoofdstuk en van de cursus, en gaat een live cursus automatisch offline.

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

## Zen Flow
Sinds 14-10-2026 ook bereikbaar op https://leren.zen-flow.nl (nginx `server_name`, certificaat uitgebreid). De voorpagina https://zen-flow.nl (project `/home/ubuntu/zen-flow-voorpagina`) maakt accounts aan en logt in via deze API (CORS alleen voor zen-flow.nl en www) en stuurt daarna door naar de leeromgeving. Volgende stap: de leeromgeving in Zen Flow-stijl.

## Trainersvideo's
Per cursus uploaden in Academie (beheer) (mp4/webm, tot 2 GB; nginx-locatie `/api/admin/academie/<slug>/video`). Bestanden in `data/academie-video/` (buiten academie-media; verwijderen = naar `archief/`), tabel `academie_videos` met hoofdstukken en tijdmarkeringen (`hoofdstuk | m:ss | omschrijving`). Afspelen via `/api/admin/academie/video/:id/bestand` (alleen beheerders, met Range). In de cursusspeler zien beheerders per hoofdstuk de video met springknoppen.

## Zen Flow-stijl (sinds 14-10-2026)
De leeromgeving gaat over naar de stijl van https://zen-flow.nl (stijlgids: `/home/ubuntu/zen-flow-voorpagina/bron/documentatie/STIJLGIDS.md`): middernacht `#0D0C22`, paneel `#20162F`, goud `#F1CB78`, tekst `#FFF3DF` / `#E0D5E9`, paarse randen `#EFB4FF`/`#C292BD`, gouden knop `linear-gradient(#FFEEB5,#FFC653 58%,#EEB153)`; koppen Cormorant Garamond, tekst DM Sans.
Omzetten gaat in fasen met `scripts/zenflow-stijl.py` (eerst proefrun, dan `--toepassen`):
- **Fase 1 (gedaan):** lettertypen overal; kleuren in de donkere pagina's (Academie, account, voortgang, horoscoop, cursusmodules, numerologie, beheer); menu, inlogscherm (`accounts.ts`), favicon, titel, naam "Zen Flow". Met de hand: `Markdown.tsx` (goud op scherm, paars op papier) en `AcademiePrint.tsx` (paarse accenten op wit).
- **Menu (gedaan):** uitklapmenu's, accountmenu en telefoonmenu in Zen Flow-stijl: DM Sans, gouden gloed bij aanwijzen, panelen `#20162F` met paarse rand `#C292BD`, hamburger zoals op zen-flow.nl.
- **Fase 2 (gedaan):** de lichte crème pagina's naar donker (startpagina, alle pendelpagina's + pendelanimatie, Lenormand, numerologie-analyse/huisnummer) met een eigen tabel (in deze bestanden is donkerbruin tekst en crème achtergrond); tekst op gouden knoppen donker gemaakt.
- **Fase 3 (gedaan):** de Tailwind-tarotpagina's (leggingen, flashcards, quiz, lessen, bibliotheek, invoer, tarot-componenten, beheer) via een klassentabel naar Zen Flow; witte tekst op gouden knoppen → `#1C0D06`. Ook omgezet: kristallen, rituelen, compatibiliteit, API-docs, numerologie-module 1, geboortehoroscoop, maanfase. `index.css`: standaard donkere achtergrond en Zen Flow-lettertypen.
- **Fase 4 — één uitstraling (gedaan):** gedeelde bouwstenen in `src/index.css` (`.zf-pagina`, `.zf-kop` + `.zf-label`/`.zf-titel`/`.zf-intro`, `.zf-inhoud`, `.zf-sectie`, `.zf-kaart`/`.zf-kaart-klik`, `.zf-knop` (goud), `.zf-knop-paars`, `.zf-veld`, `.zf-terug`) en voor inline-stijlen `src/lib/zenStijl.ts` (`ZF_KNOP`, `ZF_KNOP_PAARS`, `ZF`). Tarot (leggingen, legging, flashcards, quiz, lessen, bibliotheek, invoer en de tarot-onderdelen) gebruikt nu dezelfde paginakop, kaders en knoppen als Lenormand; de hoofdknoppen van Lenormand en pendel zijn de gouden Zen Flow-knop. Standaardrand (Tailwind-grijs) is zacht paars. **Nieuwe schermen: gebruik deze bouwstenen.**
- **Tarot-leggingen opnieuw opgebouwd (15-10-2026):** `src/pages/tarot/TarotLeggingPage.tsx` (routes `/tarot` en `/reading/:type`) volgt precies de opbouw van de Lenormand-leggingen: spreidingstegels, vraag, "Schud en trek kaarten" of "Kies zelf je kaarten" (geschudde ruggen), kaarten met Zen Flow-rug één voor één omdraaien (ook in het Keltisch kruis), detailpaneel onder de kaarten, duiding **op verzoek** (bespaart AI-tegoed), gesprek, bewaren, print/PDF (Keltisch kruis), lees-tip en "Meer over tarot". `CelticCrossLayout` kreeg `omgekeerdPerPositie`/`onthuld`/`onOnthul`/`kaartRug` (en toont nu dezelfde stand als het detail). `HomePage.tsx` en `ReadingPage.tsx` worden niet meer gebruikt (bewaard als archief).
- **Bewust niet omgezet:** de Lenormand-kaarten zelf (`LenormandKaartVisueel`, `data/lenormand/kaarten.ts`), de printbare pendelschijf en de printversie van de Academie (papier).
Niet aanpassen: "Mystieke Lenormand" (naam van het kaartspel). De kopafbeeldingen van de Academie bevatten nog de tekst "Mystieke Kaarten" (in de afbeelding zelf).

## Tekstgrootte
Knop **Aa** in het menu (op de telefoon bovenin het uitklapmenu): Normaal / Groter (115%) / Extra groot (130%). Per apparaat bewaard in `localStorage` (`zenflow-tekstgrootte`), toegepast via `html[data-tekst]` + CSS-`zoom` op `body` (`src/index.css`, `src/lib/tekstgrootte.ts`), zodat ook vaste px-maten meeschalen; bij printen altijd 100%. Wordt al in `main.tsx` toegepast, zodat de pagina niet verspringt.

## Openbaar voor zen-flow.nl (zonder inloggen, zonder AI) en Teksten
`publiek.ts` (vóór de toegangscontrole in server.ts): `/api/publiek/teksten`, `/api/publiek/dagkaart`, `/api/publiek/levenspad?datum=`, `/api/publiek/maandhoroscoop/:teken` (alleen GET; CORS alleen voor zen-flow.nl en www) en `/publiek/kaarten/*` (kaartafbeeldingen). Geen van deze roept AI aan; de maandhoroscoop gebruikt de bestaande AstroAPI-cache (`maandHoroscoop()` in server.ts, max. 12 calls per maand).
**Teksten (disclaimers)**: `/admin/teksten` (alleen beheerders; tabel `instellingen`; leeg opslaan = standaardtekst, zie `STANDAARD_TEKSTEN`). De AI-disclaimer (`<AiDisclaimer />`) is op verzoek van de gebruiker overal weggehaald (15-10-2026); de tekst `disclaimer_ai` blijft in het beheer bewaard maar wordt nergens getoond.

## Maandhoroscoop in makkelijke taal (B1) — 15-10-2026
`maandHoroscoop()` in server.ts: AstroAPI-tekst (max. één call per teken per maand) wordt **één keer per teken per maand** door gpt-5.5 herschreven naar B1 (korte zinnen, geen vaktermen, zelfde boodschap) en bewaard als `cache/astroapi/maand-JJJJ-MM-<teken>-b1.json`. Zowel zen-flow.nl als de horoscooppagina tonen die versie; lukt herschrijven niet, dan het origineel. Max. 12 AI-calls per maand, niet per bezoeker.
**Beheer → Maandhoroscopen** (`/admin/horoscopen`): per teken origineel naast de makkelijke versie, zelf aanpassen (opslaan = meteen zichtbaar; eerste AI-versie blijft bewaard als `…-b1.json.ai`), opnieuw laten herschrijven (vorige versie → `…-b1.json.vorige-<tijd>`), of een nog niet opgehaald teken ophalen.
`scripts/maandhoroscoop-klaarzetten.sh` zet alle 12 tekens klaar (eerste keer ±1 minuut per teken); bedoeld voor het begin van de maand (cron).

