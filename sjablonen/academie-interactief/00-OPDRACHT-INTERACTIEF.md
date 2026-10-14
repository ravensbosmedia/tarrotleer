# OPDRACHT VOOR CHATGPT: MAAK VAN DEZE CURSUS EEN INTERACTIEVE ONLINE CURSUS

Je krijgt een zip met één cursus van de **Spirituele Academie van Mystieke Kaarten**. Op de website klikt de cursist elk hoofdstuk **stap voor stap** door, als een interactieve les. Jouw taak: zet **alle hoofdstukken** uit de map met hoofdstukken om naar dat formaat, en lever het resultaat als **één zip** op.

Lees ook `00-ONDERWIJSVISIE.md`: die visie geldt voor toon en woordkeuze (warm, eerst ervaren, "een indruk delen" in plaats van "beweren").

Werk **hoofdstuk voor hoofdstuk**, met je Python-omgeving. Lees eerst alle hoofdstukken, zodat je weet wat waar behandeld wordt en geen dingen dubbel doet. Stop niet na één hoofdstuk: de opdracht is pas klaar als alle hoofdstukken zijn omgezet en de zip klaarstaat.

---

## 1. Opbouw van elk hoofdstuk

1. **Eerste regel:** `# Hoofdstuk N — Titel`. Neem de titel over; verbeter hem alleen als hij echt onduidelijk is.
2. **Tweede regel (na een lege regel):** de afbeeldingsregel die begint met `![` en `/api/academie-media/` bevat. **Neem die letterlijk over**: geen tekens veranderen, niet inkorten en geen voorbeeld of puntjes ervan maken. Heeft het hoofdstuk zo'n regel niet, laat hem dan weg.
3. **Daarna de stappen.** Elk `## Kopje` is één scherm voor de cursist.
   - **Zoveel stappen als de inhoud nodig heeft:** minimaal 10. Een lang hoofdstuk krijgt gewoon meer stappen (20, 30 of meer is prima). **Kort de inhoud nooit in om op een aantal stappen uit te komen.**
   - **Elke stap 80 tot 220 woorden**, met **één onderwerp** en een korte, duidelijke titel (bijv. `## Wat is afstemmen?` of `## Voorbeeld: Eva in de tram`).
   - De **eerste stap** heet altijd `## Welkom`: een korte, nieuwsgierig makende inleiding met daarin het blok **In het kort**.
   - De **laatste twee stappen** heten altijd `## Test jezelf` en `## Afronden`.
   - Geen `###`-kopjes en geen tabellen. Een tabel zet je om naar korte lijstjes.

## 2. Interactieve blokken

Een blok is een citaat met een **vetgedrukt woord op de eerste regel**. **Elke regel van het blok begint met `> `.** Gebruik precies deze zes soorten:

```
> **In het kort**
> - Eerste kernpunt in één korte zin.
> - Tweede kernpunt.
> - Derde kernpunt.
```
→ Altijd in `## Welkom`, precies 3 punten.

```
> **Voorbeeld**
> Een kort, herkenbaar verhaal van 3 tot 6 zinnen, met een (fictieve) naam.
```
→ Voor uitgewerkte voorbeelden en casussen.

```
> **Oefening** (ongeveer 10 minuten)
> 1. Eerste stap.
> 2. Tweede stap.
> 3. Derde stap.
```
→ Voor oefeningen, begeleide scripts en opdrachten. De cursist kan aanvinken: *Ik heb deze oefening gedaan*. Zet de tijdsduur tussen haakjes als die bekend is.

```
> **Denk na**
> Eén vraag waarover de cursist zelf iets opschrijft.
```
→ Voor reflectie- en toepassingsvragen. De cursist krijgt een tekstvak. **Hooguit 4 per hoofdstuk**, kies de beste. Elke **Denk na** bevat maar **één** vraag.

```
> **Let op**
> Een belangrijke waarschuwing of grens, bijv. wanneer iemand beter naar de huisarts gaat.
```
→ Voor veiligheid, grenzen en doorverwijzen.

```
> **Onthoud dit**
> - Drie tot vijf korte zinnen met de kern.
> - Eventueel een ezelsbruggetje.
```
→ Altijd in `## Afronden`.

Een uitwerking verbergen (bijv. bij een casus) doe je zo:

```
<details>
<summary>Bekijk de uitwerking</summary>

Tekst van de uitwerking.

</details>
```

## 3. Test jezelf: meerkeuzevragen

In de stap `## Test jezelf` staan **5 meerkeuzevragen** over de **kern** van het hoofdstuk, in **precies** dit formaat, met daarna **één** antwoordenblok:

```
**1. Wat doe je als eerste bij een indruk?**
- A) Je trekt meteen een conclusie
- B) Je beschrijft eerst wat je precies waarneemt
- C) Je vraagt een ander om bevestiging
- D) Je negeert de indruk

**2. Volgende vraag?**
- A) …
- B) …
- C) …
- D) …

<details>
<summary>Antwoorden</summary>

1. B — Je begint met waarnemen: wat zie, hoor of voel je precies?
2. C — Korte uitleg waarom.

</details>
```

- Precies **één goed antwoord** per vraag. De foute antwoorden zijn **geloofwaardig**, niet belachelijk.
- Wissel af waar het goede antwoord staat (niet steeds B).
- Gebruik de bestaande kennistoets en lesstof als basis.

## 4. Afronden

In `## Afronden` staan een korte afsluiting (1–3 zinnen), het blok **Onthoud dit**, en daaronder (als die er waren) de **bronnen** als gewone lijst met links. Neem bronnen letterlijk over.

## 5. Taal: makkelijk Nederlands (B1)

- **Korte zinnen:** gemiddeld 10 tot 15 woorden, **nooit langer dan 20 woorden**. Splits een lange zin in twee of drie korte.
- **Gewone woorden.** Leg een vakbegrip de eerste keer uit in één korte zin.
- Spreek de cursist aan met **je en jij**. Schrijf actief.
- Alinea's van hooguit 4 zinnen.
- Warm, rustig en respectvol. Spirituele begrippen als traditie of overtuiging, niet als bewezen feit; geen genezingsbeloften, geen medisch, juridisch of financieel advies.

## 6. Inhoud: niets kwijtraken, niets verzinnen

- **Alle** begrippen, uitleg, voorbeelden, oefeningen, waarschuwingen, verwijzingen naar andere hoofdstukken en bronnen blijven behouden. Je **verdeelt** de stof, **vereenvoudigt** de taal en maakt het **interactief**.
- **De omgezette tekst is minstens 75% zo lang als het origineel** (tel de woorden met Python). Korter mag alleen door kortere zinnen en dubbele zinnen weg te halen, niet door voorbeelden, uitleg, oefenstappen of scripts weg te laten.
- Begeleide scripts, werkbladen en portfolio-opdrachten blijven **volledig** (alle stappen en vragen), verdeeld over meerdere stappen als dat nodig is.
- **Voeg geen nieuwe feiten, bronnen of claims toe.**

## 7. Afbeeldingen (alleen waar nodig)

- Heeft een hoofdstuk **geen** afbeeldingsregel, of past de titel in de bestaande afbeelding niet meer bij de (nieuwe) hoofdstuktitel? **Maak dan één nieuwe kopafbeelding** met je beeldgenerator, in deze vaste stijl:

  > Create ONE finished landscape 16:9 chapter cover for Mystieke Kaarten Spirituele Academie. Course "[cursustitel]", chapter "[hoofdstuktitel]". Lesson focus: [één zin over de kern]. Invent a distinctive concrete symbolic scene closely illustrating THIS chapter (different from other chapters). Unified refined painterly photorealistic style: warm cream, muted sage green, lavender, gentle gold, natural textures and warm soft light, serene welcoming spiritual learning atmosphere. Clear uncluttered composition with generous readable title space. Include exact Dutch title "[hoofdstuktitel]", small label "Cursus [NN] · Hoofdstuk [MM]", subtle footer "Mystieke Kaarten". Elegant highly readable serif typography. Match literal spelling. If people appear they are adult and fully clothed. Avoid horror, supernatural claims, medical claims, additional text, watermark. A complete standalone chapter image, not a grid.

- **Bestandsnaam:** precies dezelfde naam als het hoofdstukbestand, maar met `.png`. Bijvoorbeeld `01-11-eindopdracht-en-beoordeling.md` → `01-11-eindopdracht-en-beoordeling.png`.
- Zet **geen** afbeeldingsregel voor een nieuwe afbeelding in de tekst: de website koppelt de afbeelding zelf aan de hand van de bestandsnaam.
- Heeft een hoofdstuk al een passende afbeeldingsregel? Maak dan **geen** nieuwe afbeelding.

## 8. Controle vóór oplevering (met Python, per hoofdstuk)

Controleer en herstel tot alles klopt:
- [ ] Eerste regel `# Hoofdstuk N — …`, en de afbeeldingsregel letterlijk overgenomen (als die er was).
- [ ] Minimaal 10 stappen; elke stap 80 tot 220 woorden.
- [ ] Aantal woorden per hoofdstuk is **minstens 75%** van het origineel. Noem in het rapport per hoofdstuk: woorden origineel → nieuw.
- [ ] Eerste stap `## Welkom` met **In het kort** (3 punten). Laatste stappen `## Test jezelf` en `## Afronden` met **Onthoud dit**.
- [ ] **Geen enkele zin langer dan 20 woorden** (behalve titels, antwoordopties en bronnen).
- [ ] 5 meerkeuzevragen, elk met A–D, en voor elke vraag een regel `N. X — uitleg` in het antwoordenblok.
- [ ] Elke blokregel begint met `> `; alleen de zes blokken uit punt 2.
- [ ] Geen tabellen, geen `###`, geen andere HTML dan `<details>` en `<summary>`.
- [ ] Niets inhoudelijks weggelaten en niets nieuws toegevoegd.

## 9. Oplevering

Lever **één zip** op, met daarin:
- **alle omgezette hoofdstukbestanden** (`NN-MM-naam.md`), met **dezelfde bestandsnamen** als in de aangeleverde zip, **elk hoofdstuk één keer**;
- eventuele **nieuwe afbeeldingen** (`NN-MM-naam.png`);
- **niets anders**: geen opdrachtbestanden, geen oude versies en geen tweede map met hoofdstukken. Een kort `RAPPORT.md` mag erbij.

Geef daarnaast in de chat een kort rapport: welke hoofdstukken zijn omgezet, hoeveel stappen en woorden (origineel → nieuw) elk heeft, welke afbeeldingen je hebt gemaakt, en wat er nog aandacht nodig heeft.
