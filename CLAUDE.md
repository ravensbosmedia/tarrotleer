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
- **Academie:** alles onder `/admin/academie` en `/api/admin/academie*` is alleen voor beheerders. Bewerkte hoofdstukken nooit overschrijven bij een nieuwe import; elke wijziging gaat via de PUT-route, zodat er een versie wordt bewaard.
