# Formaat voor een interactieve les (Academie — Mystieke Kaarten)

De website toont elk hoofdstuk als **interactieve les**: de cursist klikt stap voor stap door korte schermen. De website herkent de onderdelen hieronder aan de opmaak. Houd je daar **precies** aan.

## 1. Bovenaan

```
# Hoofdstuk 3 — Titel van het hoofdstuk

![Alt-tekst](/api/academie-media/…)      ← bestaande kopafbeelding letterlijk overnemen (als die er is)
```

Daarna volgen de **stappen**.

## 2. Stappen: elk `##`-kopje is één scherm

- Elk `## Kopje` begint een nieuwe stap. De cursist ziet één stap tegelijk.
- **Houd een stap kort: 80 tot 220 woorden.** Is het langer? Maak er twee stappen van.
- Een hoofdstuk heeft meestal **8 tot 16 stappen**.
- Een stap heeft één onderwerp en een duidelijke, korte titel, zoals `## Wat is afstemmen?` of `## Voorbeeld: Mila in de tram`.
- De eerste stap heet altijd `## Welkom`. Daarin staan een korte inleiding en het blok **In het kort**.
- De laatste stappen zijn altijd `## Test jezelf` en daarna `## Afronden` (met het blok **Onthoud dit**).
- Gebruik geen `###`-kopjes. Maak dan liever een nieuwe stap.

## 3. Interactieve blokken (als citaat met een vetgedrukt woord op de eerste regel)

Elk blok begint met `> **Soort**` en elke volgende regel begint ook met `> `.

```
> **In het kort**
> - Eerste kernpunt in één korte zin.
> - Tweede kernpunt.
> - Derde kernpunt.
```

```
> **Voorbeeld**
> Een kort, herkenbaar verhaal (3 tot 6 zinnen).
```

```
> **Oefening** (ongeveer 10 minuten)
> 1. Eerste stap.
> 2. Tweede stap.
> 3. Derde stap.
```
De cursist kan aanvinken: *Ik heb deze oefening gedaan*.

```
> **Denk na**
> Een vraag waarover de cursist zelf iets opschrijft.
```
De cursist krijgt een tekstvak; het antwoord wordt bewaard en is alleen voor hem of haar zichtbaar.

```
> **Let op**
> Een belangrijke waarschuwing of grens (bijv. wanneer je beter naar een huisarts gaat).
```

```
> **Onthoud dit**
> - Drie tot vijf korte zinnen met de kern.
> - Eventueel een ezelsbruggetje.
```

## 4. Test jezelf (meerkeuze)

In de stap `## Test jezelf` staan **4 tot 6 meerkeuzevragen** in precies dit formaat, gevolgd door één uitklapblok met de antwoorden:

```
**1. Wat is de eerste stap van de vierstapsladder?**
- A) Interpreteren
- B) Waarnemen
- C) Controleren
- D) Conclusie trekken

**2. Volgende vraag?**
- A) …
- B) …
- C) …
- D) …

<details>
<summary>Antwoorden</summary>

1. B — Je begint altijd met waarnemen: wat zie, hoor of voel je precies?
2. D — Korte uitleg waarom.

</details>
```

- Precies één goed antwoord per vraag. De foute antwoorden zijn geloofwaardig, niet belachelijk.
- De uitleg zegt kort **waarom** het antwoord goed is.
- Vraag naar de kern van het hoofdstuk, niet naar details.

## 5. Antwoorden of uitwerkingen verbergen

Wil je ergens anders een uitwerking verbergen (bijv. bij een casus), gebruik dan:

```
<details>
<summary>Bekijk de uitwerking</summary>

Tekst van de uitwerking.

</details>
```

## 6. Taal

Makkelijke taal (B1): korte zinnen (10 tot 15 woorden, nooit meer dan 20), gewone woorden, spreek de cursist aan met je en jij. Zie `02-TAAL-EN-ONTHOUDEN.md`.

## 7. Wat je NIET doet

- Geen tabellen, geen andere HTML dan `<details>`, geen nieuwe afbeeldingen.
- De inhoud niet veranderen: alle begrippen, voorbeelden, oefeningen, waarschuwingen en bronnen blijven. Je verdeelt, vereenvoudigt de taal en maakt het interactief.
- Een bronnenlijst zet je in de stap `## Afronden`, onder het blok **Onthoud dit**, als gewone lijst met links.
