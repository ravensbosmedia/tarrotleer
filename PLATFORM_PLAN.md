# Mystieke Kaarten — Platform Plan
**Versie:** 1.0 | **Datum:** 2026-05-27 | **Omgeving:** https://tarot.ownyourdot.me

---

## Wat we nu hebben (test-omgeving live)

### Infrastructuur
| Component | Detail |
|---|---|
| **Server** | Express (Node.js/TypeScript) op poort 4210 |
| **Frontend** | React 18 + TypeScript + Vite |
| **Beheer** | PM2 (processen: `tarot-app` p4210, `facturen-app` p5173) |
| **Live URL** | https://tarot.ownyourdot.me (Cloudflare Tunnel) |
| **Upload** | http://192.168.3.8:5173/upload.html (intern) |

### Modules al gebouwd
| Module | Pagina's | API |
|---|---|---|
| **Lenormand** | Leggingen, Bibliotheek, Flashcards, Quiz | — |
| **Tarot** | Leggingen, Bibliotheek, Flashcards, Quiz, Lessen | `/api/cards`, `/api/cards/random`, `/api/interpret` |
| **Pendel** | Lessen, Schijven, Oefeningen, Chakra's, Quiz | — |
| **Numerologie** | Profiel Analyse, Huisnummer | `/api/numerologie/analyse`, `/api/numerologie/naam`, `/api/numerologie/jaar`, `/api/numerologie/huisnummer` |

---

## Wat we gaan bouwen

### Architectuur uitbreiding
```
Browser
  └─► Express (port 4210)          ← bestaand
        ├── /api/horoscoop          ← nieuw (scraper + cache)
        ├── /api/maanfase           ← nieuw (JS berekening)
        ├── /api/natal              ← nieuw (brug naar Python)
        └── /api/...
  
  └─► FastAPI (port 4211)          ← nieuw (intern, Python)
        └── Kerykeion (ephemeris)   ← natal charts, planeten
```

---

## Module Roadmap

### Fase 1 — Horoscoop (Node.js)
**Tool:** `horoscopefree` door vitorebatista (npm)
- Scrapet horoscopen van gevalideerde bronnen
- Resultaat: Engelse tekst → vertaling naar NL via OpenAI
- Cache: JSON op schijf, ververst elke nacht 00:01 (PM2 cronjob)
- Chinees sterrenbeeld: aparte scraper, zelfde vertaal-flow

**Endpoints:**
```
GET /api/horoscoop/:teken           → dagelijkse horoscoop (NL)
GET /api/horoscoop/chinees/:teken   → Chinees sterrenbeeld (NL)
GET /api/horoscoop/vandaag          → alle 12 tekens
```

**Pagina:** `/sterrenbeelden` — teken kiezen, horoscoop tonen, chinees teken berekend uit geboortejaar

---

### Fase 2 — Astronomie (Node.js)
**Tool:** `suncalc` npm + Meeus-algoritmen (pure JS, geen externe API)
- Maanfase (percentage, naam, teken)
- Maankalender per maand
- Planeetposities (benaderd)

**Endpoints:**
```
GET /api/maan/nu                    → huidige maanfase
GET /api/maan/kalender?maand=5&jaar=2026
GET /api/planeten                   → posities vandaag
```

**Pagina:** `/astrologie` — live maanfase widget, kalender, planeetoverzicht

---

### Fase 3 — Natal Chart (Python microservice)
**Tool:** Kerykeion (Python wrapper om Swiss Ephemeris — open-source, gratis)
- Exacte planeetposities op geboortemoment
- Ascendant + 12 huizen berekening
- Output: JSON data + optioneel SVG chart

**Setup:**
- FastAPI service op poort 4211 (intern, via PM2)
- Express stuurt request door, geeft resultaat terug aan browser
- Gebruiker voert in: geboortedatum + tijd + geboorteplaats

**Endpoints (via Express, intern naar Python):**
```
GET /api/natal?datum=YYYY-MM-DD&tijd=HH:MM&plaats=Amsterdam
```

**Pagina:** `/natal` — geboortechart met planeten per huis

---

### Fase 4 — Data-modules (statische JSON databases)
Geen externe tool nodig — wij vullen de inhoud zelf.

| Module | Inhoud | Endpoint |
|---|---|---|
| **Kristallen** | ~50 kristallen, element, kleur, beschrijving | `/api/kristallen`, `/api/kristallen/:slug` |
| **Rituelen** | 20+ rituelen met stappen (volle maan, ochtend, etc.) | `/api/rituelen`, `/api/rituelen/:id` |
| **Quotes** | Dagelijkse spirituele quote (JSON bestand, 365 entries) | `/api/quote/vandaag` |
| **Compatibiliteit** | 12×12 scorematrix sterrenbeelden | `/api/compatibiliteit/:teken1/:teken2` |

---

### Fase 5 — Geavanceerd (later)
- **Namen** — naamanalyse: oorsprong, betekenis, vibratiel profiel (kleine database + OpenAI voor uitbreiding)
- **Persoonlijkheidsarchetype** — gecombineerd uit astro + numerologie input
- **Geocoding** — steden zoeken voor geboorteplaats (voor natal chart)

---

## Overzicht alle toekomstige API endpoints

```
/api/horoscoop/:teken
/api/horoscoop/chinees/:teken
/api/horoscoop/vandaag
/api/maan/nu
/api/maan/kalender
/api/planeten
/api/natal
/api/kristallen
/api/kristallen/:slug
/api/rituelen
/api/rituelen/:id
/api/quote/vandaag
/api/compatibiliteit/:teken1/:teken2
/api/namen (POST)
```

---

## Open-source tools die we gebruiken

| Tool | Taal | Waarvoor | Kosten |
|---|---|---|---|
| `horoscopefree` (vitorebatista) | Node.js | Horoscoop scrapen | Gratis |
| `suncalc` | Node.js | Maanfase, zonsopgang | Gratis |
| `Kerykeion` | Python | Natal charts, ephemeris | Gratis |
| `OpenAI` (al geïntegreerd) | — | Vertaling EN→NL | Per token |

---

## Wat de test-omgeving nu al kan

Elke nieuwe API wordt eerst op `https://tarot.ownyourdot.me/api/...` getest.  
Frontend pagina's zijn direct live na `npm run build && pm2 restart tarot-app`.  
Python service wordt apart gestart: `pm2 start kerykeion_service.py`.

---

*Plan opgesteld voor overleg met teamleider — versie 1.0*
