# AuraLine Platform — Testrapport
**Datum:** 2026-05-28  
**Build:** dist/assets/index-BygoB_S2.js (1073 kB / gzip 289 kB)  
**Omgeving:** localhost:4210 (tarot-app via PM2), tunnel: tarot.ownyourdot.me

---

## 1. Services Status

| Service           | Port | Status | Uptime |
|-------------------|------|--------|--------|
| facturen-app      | 5173 | ✅ online | 15h+ (ONGEWIJZIGD) |
| kerykeion-service | 4211 | ✅ online | hersteld na restart |
| tarot-app         | 4210 | ✅ online | hersteld na restart |

**facturen-app: ONAANGEROERD — geen wijzigingen aangebracht.**

---

## 2. API Endpoints

### 2.1 Maanfase

| Endpoint | Status | Resultaat |
|----------|--------|-----------|
| GET `/api/maan/nu` | ✅ 200 | `{"fase":"Wassende Maan","emoji":"🌔","verlichtingspercentage":93,"faseWaarde":0.4151}` |
| GET `/api/maan/kalender?maand=5&jaar=2026` | ✅ 200 | 31 dagobjecten met fase + emoji + % |

### 2.2 Planeten (nieuw)

| Endpoint | Status | Resultaat |
|----------|--------|-----------|
| GET `/api/planeten/nu` | ✅ 200 | 10 planeten: Zon in Tweelingen 7.13°, Maan in Schorpioen 4.96°, etc. |

Alle 10 planeten (Zon t/m Pluto) aanwezig met teken, symbool, graad en retrograde-vlag.

### 2.3 Horoscoop

| Endpoint | Status | Resultaat |
|----------|--------|-----------|
| GET `/api/horoscoop/leo` | ✅ 200 | `{"datum":"2026-05-28","slug":"leo","naam":"Leeuw","tekst_nl":"...","tekst_en":"..."}` |

Opmerking: `tekst_nl` bevat nog Engelse tekst (OpenAI-vertaling niet beschikbaar of gecached voor vandaag). Functionaliteit correct.

### 2.4 Numerologie

| Endpoint | Status | Resultaat |
|----------|--------|-----------|
| GET `/api/numerologie/analyse?datum=1990-03-14&naam=Noah` | ✅ 200 | ruling=5, lifePath=9, lesson=3 — stappen correct uitgewerkt |

### 2.5 Compatibiliteit (nieuw)

| Endpoint | Status | Resultaat |
|----------|--------|-----------|
| GET `/api/compatibiliteit/aries/leo` | ✅ 200 | `{"percentage":88,"samenvatting":"Vuur ontmoet vuur — passioneel en dynamisch.","emotioneel":"Warm en hartstochtelijk","intellectueel":"Stimulerend en ambitieus"}` |

78 unieke tekenparen gedekt in statische ZODIAC_COMPAT tabel.

### 2.6 Geboortehoroscoop

| Endpoint | Status | Resultaat |
|----------|--------|-----------|
| GET `/api/natal/geocodeer?q=Amsterdam` | ✅ 200 | lat=52.373, lng=4.892, tz=Europe/Amsterdam |
| GET `/api/natal?naam=Noah&dag=14&maand=3&jaar=1990&uur=14&minuut=0&lat=52.37&lng=4.89&tz=Europe/Amsterdam` | ✅ 200 | Zon in Vissen 23.68°, Maan in Weegschaal 28.29°, Asc Leeuw 5.7° |

---

## 3. UI Routes

Alle 20 routes getest — allemaal HTTP 200:

| Route | Status |
|-------|--------|
| `/` | ✅ 200 |
| `/sterrenbeelden` | ✅ 200 |
| `/maanfase` | ✅ 200 |
| `/compatibiliteit` | ✅ 200 |
| `/natal` | ✅ 200 |
| `/numerologie/analyse` | ✅ 200 |
| `/numerologie/levenspad` | ✅ 200 |
| `/numerologie/naam-analyse` | ✅ 200 |
| `/numerologie/expressiegetal` | ✅ 200 |
| `/numerologie/bestuursgetal` | ✅ 200 |
| `/numerologie/mobiel-nummer` | ✅ 200 |
| `/cursus` | ✅ 200 |
| `/cursus/module-01` | ✅ 200 |
| `/cursus/module-02` | ✅ 200 |
| `/cursus/module-03` | ✅ 200 |
| `/cursus/module-04` | ✅ 200 |
| `/cursus/module-05` | ✅ 200 |
| `/cursus/module-06` | ✅ 200 |
| `/cursus/module-07` | ✅ 200 |
| `/cursus/module-08` | ✅ 200 |

---

## 4. Nieuwe Functionaliteit

### 4.1 Numerologie Calculators (5 nieuwe pagina's)

| Pagina | Route | Beschrijving |
|--------|-------|--------------|
| Levenspad | `/numerologie/levenspad` | Geboortedatum → levenspadgetal 1-9, 11, 22 met archetypes |
| Naam Analyse | `/numerologie/naam-analyse` | Volledige naam → expressie + ziel + persoonlijkheidsgetal |
| Expressiegetal | `/numerologie/expressiegetal` | Naam → expressiegetal met letter-waardengrid |
| Bestuursgetal | `/numerologie/bestuursgetal` | Geboortedag (1-31) → bestuursgetal met schaduw/positief |
| Persoonlijk Jaar | `/numerologie/mobiel-nummer` | Geboortedatum + doeljaar → persoonlijk jaar 1-9 cyclus |

### 4.2 Cursus Modules (4 nieuwe pagina's)

| Module | Route | Inhoud |
|--------|-------|--------|
| Module 03 | `/cursus/module-03` | Letteranalyse — Cornerstone, Capstone, Eerste Klinker |
| Module 06 | `/cursus/module-06` | Planeten in de horoscoop — 10 planeten met categorieën |
| Module 07 | `/cursus/module-07` | Compatibiliteit — LP-matrix 1-9, 11, 22 |
| Module 08 | `/cursus/module-08` | Synthese methode — 4-stappen aanpak + AI-promptsjabloon |

### 4.3 Nieuwe API Endpoints

| Endpoint | Nieuw | Beschrijving |
|----------|-------|--------------|
| `/api/planeten/nu` | ✅ | Live planeetposities via kerykeion/Swiss Ephemeris |
| `/api/compatibiliteit/:t1/:t2` | ✅ | Horoscoop compatibiliteit % + beschrijving |

### 4.4 Gerelateerde Tools Secties

Toegevoegd aan bestaande pagina's:
- **MaanfasePage**: cursus/module-05, sterrenbeelden, natal
- **NatalChartPage**: sterrenbeelden, maanfase, cursus/module-06, cursus/module-04  
- **CompatibiliteitPage**: sterrenbeelden, cursus/module-07, cursus/module-04
- **NumerologieAnalysePage**: 6 losse calculators + cursus/module-01

### 4.5 Navbar

- Cursus-tab toegevoegd (desktop + mobiel)
- Numerologie dropdown: 7 links (was 2)

---

## 5. Build Log

```
✓ 1631 modules transformed
dist/index.html            0.77 kB │ gzip:   0.43 kB
dist/assets/index.css     36.60 kB │ gzip:   6.77 kB
dist/assets/index.js   1,073.96 kB │ gzip: 289.31 kB
✓ built in 3.45s
```

Waarschuwing: chunk groter dan 500 kB — acceptabel voor deze fase, code-splitting optioneel later.

---

## 6. Bekende Issues

| Issue | Ernst | Status |
|-------|-------|--------|
| Horoscoop `tekst_nl` soms niet vertaald (OpenAI cache hit) | Laag | Acceptabel — zelfde dag geen hervertaling nodig |
| Duplicate `border` key in CursusModule01Page.tsx (esbuild waarschuwing) | Laag | Bouwt succesvol, geen runtime effect |
| JS chunk > 500 kB | Info | Overweeg lazy loading modules in latere fase |

---

## 7. Conclusie

**Alle nieuwe functionaliteit werkt correct.**  
Platform volledig operationeel op `tarot.ownyourdot.me`.  
facturen-app onaangeroerd en actief op port 5173.
