"""
Kerykeion FastAPI microservice — poort 4211
Geocoding: OpenStreetMap Nominatim (gratis, geen key nodig)
Timezone:  timezonefinder (offline, geen API nodig)
Ephemeris: Swiss Ephemeris via kerykeion
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from kerykeion import AstrologicalSubject, KerykeionChartSVG
from timezonefinder import TimezoneFinder
import urllib.request
import urllib.parse
import json
import time
import uvicorn

app = FastAPI(title="Kerykeion Natal Service", version="2.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:4210"], allow_methods=["GET"], allow_headers=["*"])

tf = TimezoneFinder()
_geo_cache: dict[str, dict] = {}
_last_nominatim_call = 0.0

TEKEN_NL = {
    "Ari": "Ram", "Tau": "Stier", "Gem": "Tweelingen", "Can": "Kreeft",
    "Leo": "Leeuw", "Vir": "Maagd", "Lib": "Weegschaal", "Sco": "Schorpioen",
    "Sag": "Boogschutter", "Cap": "Steenbok", "Aqu": "Waterman", "Pis": "Vissen",
}
TEKEN_EMOJI = {
    "Ram":"♈","Stier":"♉","Tweelingen":"♊","Kreeft":"♋","Leeuw":"♌","Maagd":"♍",
    "Weegschaal":"♎","Schorpioen":"♏","Boogschutter":"♐","Steenbok":"♑","Waterman":"♒","Vissen":"♓",
}
HUIS_ATTRS = [
    "first_house","second_house","third_house","fourth_house","fifth_house","sixth_house",
    "seventh_house","eighth_house","ninth_house","tenth_house","eleventh_house","twelfth_house",
]


def geocodeer(zoekterm: str) -> dict:
    """Zoek coördinaten via Nominatim + bepaal timezone offline."""
    global _last_nominatim_call
    sleutel = zoekterm.lower().strip()
    if sleutel in _geo_cache:
        return _geo_cache[sleutel]

    # Nominatim rate-limit: max 1 req/sec
    wacht = 1.0 - (time.time() - _last_nominatim_call)
    if wacht > 0:
        time.sleep(wacht)

    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode({
        "q": zoekterm, "format": "json", "limit": 1, "addressdetails": 0,
    })
    req = urllib.request.Request(url, headers={"User-Agent": "MystiekePlatform/1.0 (leerplatform)"})
    _last_nominatim_call = time.time()

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            resultaten = json.loads(resp.read())
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Nominatim niet bereikbaar: {e}")

    if not resultaten:
        raise HTTPException(status_code=404, detail=f"Stad '{zoekterm}' niet gevonden. Probeer een andere schrijfwijze.")

    r = resultaten[0]
    lat = float(r["lat"])
    lng = float(r["lon"])
    naam = r.get("display_name", zoekterm).split(",")[0].strip()

    tz = tf.timezone_at(lat=lat, lng=lng)
    if not tz:
        tz = "UTC"

    resultaat = {"lat": lat, "lng": lng, "tz": tz, "naam": naam}
    _geo_cache[sleutel] = resultaat
    return resultaat


def teken_nl(sign_str: str) -> str:
    return TEKEN_NL.get(sign_str[:3], sign_str)


def maak_subject(naam, jaar, maand, dag, uur, minuut, stad):
    geo = geocodeer(stad)
    subject = AstrologicalSubject(
        naam, jaar, maand, dag, uur, minuut,
        lat=geo["lat"], lng=geo["lng"], tz_str=geo["tz"],
    )
    return subject, geo


@app.get("/geocodeer")
def geocodeer_endpoint(q: str = Query(..., description="Stadsnaam om te zoeken")):
    """Zoek coördinaten van een stad — voor autocomplete in de frontend."""
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode({
        "q": q, "format": "json", "limit": 5, "addressdetails": 1,
    })
    req = urllib.request.Request(url, headers={"User-Agent": "MystiekePlatform/1.0"})
    global _last_nominatim_call
    wacht = 1.0 - (time.time() - _last_nominatim_call)
    if wacht > 0:
        time.sleep(wacht)
    _last_nominatim_call = time.time()
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            resultaten = json.loads(resp.read())
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

    steden = []
    for r in resultaten:
        lat = float(r["lat"])
        lng = float(r["lon"])
        tz = tf.timezone_at(lat=lat, lng=lng) or "UTC"
        naam = r.get("display_name", q).split(",")[0].strip()
        land = r.get("address", {}).get("country", "")
        steden.append({"naam": naam, "land": land, "lat": lat, "lng": lng, "tz": tz, "volledig": r.get("display_name","")})
    return {"resultaten": steden}


def bereken_aspecten(subject) -> list[dict]:
    """Bereken alle aspecten voor het natal chart."""
    try:
        from kerykeion.aspects.aspects_factory import AspectsFactory
        from kerykeion.schemas import AstrologicalSubjectModel
        model = AstrologicalSubjectModel(**subject.model_dump())
        result = AspectsFactory.natal_aspects(model)
        aspecten = []
        for a in result.aspects:
            aspecten.append({
                "planeet1": PLANEET_NL_MAP.get(a.p1_name, a.p1_name),
                "planeet2": PLANEET_NL_MAP.get(a.p2_name, a.p2_name),
                "type": a.aspect,
                "type_nl": ASPECT_NL.get(a.aspect, a.aspect),
                "hoek": ASPECT_HOEK.get(a.aspect, 0),
                "orbit": round(float(a.orbit), 1),
            })
        return aspecten
    except Exception as e:
        return []

PLANEET_NL_MAP = {
    "Sun":"Zon","Moon":"Maan","Mercury":"Mercurius","Venus":"Venus","Mars":"Mars",
    "Jupiter":"Jupiter","Saturn":"Saturnus","Uranus":"Uranus","Neptune":"Neptunus","Pluto":"Pluto",
}
ASPECT_NL = {
    "conjunction":"Conjunctie","sextile":"Sextiel","square":"Vierkant",
    "trine":"Driehoek","opposition":"Oppositie","quincunx":"Quincunx",
}
ASPECT_HOEK = {
    "conjunction":0,"sextile":60,"square":90,"trine":120,"opposition":180,"quincunx":150,
}

@app.get("/natal")
def natal_chart(
    naam: str = Query(...),
    jaar: int = Query(...),
    maand: int = Query(...),
    dag: int = Query(...),
    uur: int = Query(12),
    minuut: int = Query(0),
    stad: str = Query("Amsterdam"),
):
    try:
        subject, geo = maak_subject(naam, jaar, maand, dag, uur, minuut, stad)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    planeten = []
    for attr, naam_nl in [
        ("sun","Zon"),("moon","Maan"),("mercury","Mercurius"),("venus","Venus"),
        ("mars","Mars"),("jupiter","Jupiter"),("saturn","Saturnus"),
        ("uranus","Uranus"),("neptune","Neptunus"),("pluto","Pluto"),
    ]:
        try:
            obj = getattr(subject, attr)
            tn = teken_nl(obj.sign)
            planeten.append({
                "naam": naam_nl, "teken": tn, "symbool": TEKEN_EMOJI.get(tn,""),
                "graad": round(float(obj.position), 2),
                "huis": None,
                "retrograde": bool(getattr(obj, "retrograde", False)),
            })
        except Exception:
            pass

    huizen = []
    for i, attr in enumerate(HUIS_ATTRS, 1):
        try:
            h = getattr(subject, attr)
            tn = teken_nl(h.sign)
            huizen.append({"huis": i, "teken": tn, "symbool": TEKEN_EMOJI.get(tn,""), "graad": round(float(h.position), 2)})
        except Exception:
            pass

    asc = teken_nl(subject.first_house.sign)
    zon = teken_nl(subject.sun.sign)
    maan_t = teken_nl(subject.moon.sign)

    return {
        "naam": naam,
        "geboortedatum": f"{dag:02d}-{maand:02d}-{jaar}",
        "geboortetijd": f"{uur:02d}:{minuut:02d}",
        "geboorteplaats": geo["naam"],
        "tijdzone": geo["tz"],
        "coordinaten": {"lat": geo["lat"], "lng": geo["lng"]},
        "kern": {
            "zon":       {"teken": zon,   "symbool": TEKEN_EMOJI.get(zon,""),   "graad": round(float(subject.sun.position), 2)},
            "maan":      {"teken": maan_t,"symbool": TEKEN_EMOJI.get(maan_t,""),"graad": round(float(subject.moon.position), 2)},
            "ascendant": {"teken": asc,   "symbool": TEKEN_EMOJI.get(asc,""),   "graad": round(float(subject.first_house.position), 2)},
        },
        "planeten": planeten,
        "huizen": huizen,
        "aspecten": bereken_aspecten(subject),
    }


@app.get("/natal/svg")
def natal_svg(
    naam: str = Query(...),
    jaar: int = Query(...),
    maand: int = Query(...),
    dag: int = Query(...),
    uur: int = Query(12),
    minuut: int = Query(0),
    stad: str = Query("Amsterdam"),
):
    try:
        subject, _ = maak_subject(naam, jaar, maand, dag, uur, minuut, stad)
        chart = KerykeionChartSVG(subject)
        svg = chart.makeTemplate()
        return Response(content=svg, media_type="image/svg+xml")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/planeten/nu")
def planeten_nu():
    """Actuele planeetposities op basis van de huidige datum/tijd."""
    from datetime import datetime, timezone
    nu = datetime.now(timezone.utc)
    try:
        subject = AstrologicalSubject(
            "transit", nu.year, nu.month, nu.day, nu.hour, nu.minute,
            lat=52.3676, lng=4.9041, tz_str="Europe/Amsterdam",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    planeten_attrs = [
        ("sun","Zon"),("moon","Maan"),("mercury","Mercurius"),("venus","Venus"),
        ("mars","Mars"),("jupiter","Jupiter"),("saturn","Saturnus"),
        ("uranus","Uranus"),("neptune","Neptunus"),("pluto","Pluto"),
    ]
    planeten = []
    for attr, naam_nl in planeten_attrs:
        try:
            obj = getattr(subject, attr)
            tn = teken_nl(obj.sign)
            planeten.append({
                "naam": naam_nl,
                "teken": tn,
                "symbool": TEKEN_EMOJI.get(tn, ""),
                "graad": round(float(obj.position), 2),
                "retrograde": bool(getattr(obj, "retrograde", False)),
            })
        except Exception:
            pass

    return {
        "datum": nu.strftime("%Y-%m-%d"),
        "tijd_utc": nu.strftime("%H:%M"),
        "planeten": planeten,
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "kerykeion", "geocoding": "nominatim"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=4211, log_level="warning")
