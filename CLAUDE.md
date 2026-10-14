# CLAUDE.md — Mystieke Kaarten (leren.fb-techlabs.com)

Zie `README.md` voor het overzicht van onderdelen, techniek, accounts, voortgang en scripts. Antwoord de gebruiker in het Nederlands.

## Geheugen (inventaris)
Dit project hoort bij platform: Tarot leren

## Werkafspraken en valkuilen

- **Na wijzigingen aan `src/` of `public/`:** draai `npm run build`. De server levert `dist/`. Een herstart (`sudo systemctl restart tarrot-server`) is alleen nodig na wijzigingen aan `server.ts` of `accounts.ts`. Live zetten, herstarten en pushen gebeurt alleen met akkoord van de gebruiker.
- **Typecontrole:** `npx tsc --noEmit -p tsconfig.app.json`. Er zijn ±22 bestaande fouten; kijk of het aantal niet stijgt. `npx tsc -p .` controleert niets, omdat `tsconfig.json` alleen verwijzingen bevat.
- **gpt-5.5:** gebruik `max_completion_tokens` en geen `temperature`. AI loopt alleen via de server; zet nooit een key in de frontend.
- **AstroAPI:** het gratis plan geeft 50 calls per maand. Gebruik het alleen voor de maandhoroscoop, bewaar elk antwoord permanent en houd de teller in stand. Nooit per bezoeker of per dag aanroepen.
- **`.gitignore`:** de databaseregel moet `/data/` zijn. `data/` sloot eerder ook `src/data/` uit, waardoor nieuwe bestanden daar niet op GitHub kwamen. Controleer na het toevoegen van bestanden in `src/data/` met `git status --ignored`.
- **Voortgang:** gebruik de helpers in `src/lib/voortgang.ts`: `slaRondeOp`, `useOnderdeelVoortgang`, `bewaarLegging`, `useCursusQuizOpslaan`. Quizvragen hebben een vaste vraagcode; houd codes stabiel, anders gaat de voortgang per vraag verloren.
- **Stabiele props voor AI-componenten:** geef arrays aan `TarotAIInterpretation` mee via `useMemo`. Anders wordt de duiding bij elke render opnieuw opgehaald, en dat kost tegoed.
- **Combinaties opnieuw genereren:** gebruik de scripts in `scripts/` (zie README). Doe eerst een proef met `--proef` en laat de gebruiker de kwaliteit beoordelen. De bronnen worden alleen in eigen woorden gebruikt.
- **Testen tegen de live database:** maak een tijdelijk account aan (bijvoorbeeld `…@example.com`) en verwijder het na de test. Alles in `quiz_stats` en `voortgang` gaat dan mee weg (cascade).
- **Geheimen:** noem van `.env` alleen de namen van de variabelen. Zet nooit wachtwoorden of keys in commits, het werklog of de documentatie.
- **Academie:** alles onder `/admin/academie` en `/api/admin/academie*` is alleen voor beheerders. Bewerkte hoofdstukken nooit overschrijven bij een nieuwe import; elke wijziging gaat via de PUT-route, zodat er een versie wordt bewaard. Geen AI-aanroepen (OpenAI) in de Academie toevoegen: de gebruiker verbetert teksten zelf via ChatGPT in de browser.
- **Onderwijsvisie (alle 21 cursussen):** `sjablonen/ONDERWIJSVISIE.md` is leidend bij het schrijven, herwerken en beoordelen van Academie-inhoud: eerst ervaren, gevoelens mogen bestaan, warm en spiritueel begeleiden, "een indruk delen" in plaats van "beweren", eerlijk zonder garanties. Het bestand gaat automatisch mee in ieder ChatGPT-pakket als `00-ONDERWIJSVISIE.md`.
- **Zen Flow (sinds 14-10-2026):** de leeromgeving is ook bereikbaar op **leren.zen-flow.nl** en wordt de Zen Flow-leeromgeving (stijl van de voorpagina `/home/ubuntu/zen-flow-voorpagina`). De voorpagina zen-flow.nl maakt accounts aan via `/api/auth/registreer` en `/api/auth/login`; CORS staat in `accounts.ts` alleen open voor `https://zen-flow.nl` en `https://www.zen-flow.nl`. Houd de auth-API en de sessiecookie (SameSite=Lax) compatibel. Logboek: `/home/ubuntu/zen-flow/docs/VERHUIZING-MEDITATIE-ZEN-FLOW.md`.
- **Stijl:** nieuwe of aangepaste schermen gebruiken de Zen Flow-kleuren en -lettertypen (zie README, kopje "Zen Flow-stijl"), niet meer het oude bruin/goud (`#1A1209`, `#B8860B`, Cinzel, Crimson Pro).
