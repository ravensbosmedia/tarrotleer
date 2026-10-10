# Technische eisen (nodig om de zip terug te uploaden op de website)

De website leest de opgeleverde zip automatisch in. Houd je daarom aan deze punten:

1. **Bestandsnamen ongewijzigd laten.** Elk hoofdstuk heet `NN-MM-naam.md` (NN = cursusnummer, MM = hoofdstuknummer). De website herkent hoofdstukken aan deze nummers. Een nieuw bestand of andere nummering wordt niet ingelezen.
2. **De eerste regel blijft de titel:** `# Hoofdstuk N — Titel`. Je mag de titel verbeteren, maar houd dit formaat aan.
3. **De afbeeldingsregel bovenaan ongewijzigd laten.** Veel hoofdstukken beginnen met een regel als `![Alt-tekst](/api/academie-media/…png)`. Dat is de kopafbeelding van de website: laat die regel precies zoals hij is staan, als eerste regel na de titel.
4. **Kopjes in Markdown:** gebruik `## Welkom`, `## Leerdoelen`, `## Uitleg`, `## Toepassing`, `## Praktijkoefening`, `## Kennistoets` en `## Afronden` als hoofdindeling. Binnen de uitleg mag je `### tussenkopjes` gebruiken.
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
7. **Oplevering:** één zip met dezelfde map en dezelfde bestandsnamen als in dit pakket. Extra bestanden (zoals een rapport) mogen erbij en worden genegeerd.
