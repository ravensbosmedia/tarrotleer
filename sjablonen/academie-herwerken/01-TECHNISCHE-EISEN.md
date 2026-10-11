# Technische eisen (nodig om de zip terug te uploaden op de website)

De website leest de opgeleverde zip automatisch in. Houd je daarom aan deze punten:

1. **Bestandsnamen ongewijzigd laten.** Elk hoofdstuk heet `NN-MM-naam.md` (NN = cursusnummer, MM = hoofdstuknummer). De website herkent hoofdstukken aan deze nummers. Een nieuw bestand of andere nummering wordt niet ingelezen.
2. **De eerste regel blijft de titel:** `# Hoofdstuk N — Titel`. Je mag de titel verbeteren, maar houd dit formaat aan.
3. **De afbeeldingsregel bovenaan ongewijzigd laten.** Veel hoofdstukken hebben direct na de titel een regel die begint met `![` en een adres met `/api/academie-media/` bevat. Dat is de kopafbeelding van de website. Kopieer die regel **letterlijk uit het aangeleverde hoofdstuk** (niet inkorten, geen voorbeeld of puntjes ervan maken) en laat hem als eerste regel na de titel staan.
4. **Kopjes in Markdown:** gebruik `## Welkom`, `## Leerdoelen`, `## Uitleg`, `## Toepassing`, `## Praktijkoefening`, `## Kennistoets` en `## Afronden` als hoofdindeling. Binnen de uitleg mag je `### tussenkopjes` gebruiken. Zet **In het kort** (onder Welkom) en **Onthoud dit** (onder Afronden) als vetgedrukte regel met daaronder een lijstje (zie 02-TAAL-EN-ONTHOUDEN.md).
5. **Kennistoets:** meerkeuzevragen in dit formaat, met de antwoorden en uitleg in een uitklapblok:

   ```
   **1. Vraag?**
   - A) …
   - B) …
   - C) …
   - D) …

   <details>
   <summary>Antwoorden</summary>

   1. B — korte uitleg waarom.

   </details>
   ```

6. **Toegestane opmaak:** `##` en `###` kopjes, `**vet**`, `*cursief*`, lijsten met `-` of `1.`, en het `<details>`-blok. Geen tabellen, geen nieuwe afbeeldingen, geen andere HTML.
7. **Oplevering:** één zip met **alleen de hoofdstukbestanden** (`NN-MM-naam.md`), in dezelfde map en met dezelfde bestandsnamen als in dit pakket. Zet elk hoofdstuk er **één keer** in. Stop de instructiebestanden van dit pakket (00-, 01-, 02-, 03-…) niet terug in de zip. Een rapport mag erbij als `RAPPORT.md`.
