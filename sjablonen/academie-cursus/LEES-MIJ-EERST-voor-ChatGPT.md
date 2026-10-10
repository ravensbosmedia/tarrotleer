# Opdracht voor ChatGPT: maak een nieuwe cursus voor de Academie van Mystieke Kaarten

Je maakt een **nieuwe cursus** voor een Nederlandstalig spiritueel leerplatform. Het resultaat wordt als **zip** geüpload en automatisch ingelezen. Volg de opbouw daarom **precies**: mapnamen, bestandsnamen en kopjes worden door de computer gelezen.

## 1. Mappen en bestanden

```
Nieuwe_Cursus/
├── 00-START-HIER.md
└── {{NR}}-korte-naam-van-de-cursus/
    ├── {{NR}}-01-titel-van-hoofdstuk-1.md
    ├── {{NR}}-02-titel-van-hoofdstuk-2.md
    └── …
```

- Gebruik als cursusnummer **{{NR}}** (twee cijfers). Dat nummer is nog vrij.
- De map heet `{{NR}}-korte-naam` (kleine letters, woorden gescheiden door streepjes, zonder spaties of leestekens).
- Elk hoofdstuk heet `{{NR}}-MM-korte-titel.md`, waarbij MM het hoofdstuknummer is (01, 02, …).
- Je mag meerdere cursussen in één zip zetten, elk met een eigen map en een eigen vrij nummer ({{NR}}, {{NR2}}, …).

## 2. Het bestand 00-START-HIER.md

Per cursus één regel in precies dit formaat (die wordt gebruikt als titel van de cursus):

```
## {{NR}}. Titel van de cursus
```

## 3. Opbouw van elk hoofdstuk

Elk hoofdstuk begint met deze kop:

```
# Hoofdstuk 1 — Titel van het hoofdstuk

**Cursus:** Titel van de cursus
**Academie:** Mystieke Kaarten
**Duur:** circa 20–30 minuten
**Niveau:** basis
```

Daarna volgen deze kopjes, in deze volgorde:

`## Welkom` · `## Leerdoelen` · `## Uitleg` · `## Toepassing` · `## Praktijkoefening` · `## Kennistoets` · `## Afronden`

## 4. Inhoud: wat er in een goed hoofdstuk staat

- **Uitleg:** 400–700 woorden **echte, specifieke kennis** over het onderwerp van dít hoofdstuk: achtergrond, tradities, begrippen, voorbeelden. Geen algemene zinnen die in elk hoofdstuk zouden passen.
- **Praktijkoefening:** een concrete oefening in genummerde stappen.
- **Kennistoets:** 4 meerkeuzevragen en 1 open reflectievraag. De antwoorden staan in een uitklapblok:

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

- **Toon:** warm, helder, spreek de lezer aan met je/jij.
- **Verantwoord:** behandel spirituele begrippen als traditie of overtuiging. Beloof geen genezing en geef geen medische, juridische of financiële adviezen. Noem grenzen en wanneer iemand beter naar een arts of andere deskundige kan gaan.
- **Opmaak:** gebruik alleen `## kopjes`, `**vet**`, `*cursief*`, lijsten met `-` of `1.` en het `<details>`-blok. Geen tabellen, afbeeldingen of andere HTML.

## 5. Voorbeeld

In de map `Nieuwe_Cursus` van deze zip staat een voorbeeldcursus met twee uitgewerkte hoofdstukken. Gebruik die als voorbeeld voor stijl en opbouw. **Neem de voorbeeldinhoud niet over** en vervang `NN` door het echte cursusnummer.

## 6. Bestaande cursussen (niet dubbel maken)

{{BESTAAND}}

## 7. Opleveren

Lever de cursus als **zip** met de map `Nieuwe_Cursus/` erin, of geef per bestand de volledige inhoud, zodat ik de zip zelf kan maken. De zip wordt geüpload via **Academie (beheer) → Nieuwe cursus uploaden**.
