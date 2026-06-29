import React, { useState } from 'react';

interface Parameter {
  naam: string;
  type: string;
  verplicht: boolean;
  beschrijving: string;
  voorbeeld?: string;
}

interface Endpoint {
  methode: 'GET' | 'POST';
  pad: string;
  beschrijving: string;
  parameters?: Parameter[];
  voorbeeld: string;
  responsVoorbeeld?: string;
}

interface Module {
  naam: string;
  emoji: string;
  kleur: string;
  beschrijving: string;
  endpoints: Endpoint[];
}

const MODULES: Module[] = [
  {
    naam: "Tarot Kaarten",
    emoji: "🃏",
    kleur: "#8e44ad",
    beschrijving: "78 tarotkaarten met betekenissen, symbolen en interpretaties via OpenAI.",
    endpoints: [
      {
        methode: "GET",
        pad: "/api/cards",
        beschrijving: "Alle 78 tarotkaarten",
        voorbeeld: "/api/cards",
        responsVoorbeeld: '[{"id":1,"nameNL":"De Dwaas","suit":"major","keywords":["vrijheid","avontuur"],...}]',
      },
      {
        methode: "GET",
        pad: "/api/cards/random",
        beschrijving: "Willekeurige kaart met kans op omgekeerde positie",
        voorbeeld: "/api/cards/random",
        responsVoorbeeld: '{"id":5,"nameNL":"De Hogepriesteres","isReversed":false,...}',
      },
      {
        methode: "GET",
        pad: "/api/cards/:id",
        beschrijving: "Specifieke kaart op ID",
        parameters: [{ naam: "id", type: "number", verplicht: true, beschrijving: "Kaart ID (1–78)", voorbeeld: "22" }],
        voorbeeld: "/api/cards/22",
      },
      {
        methode: "GET",
        pad: "/api/cards/suit/:suit",
        beschrijving: "Alle kaarten van een suite",
        parameters: [{ naam: "suit", type: "string", verplicht: true, beschrijving: "major | wands | cups | swords | pentacles", voorbeeld: "major" }],
        voorbeeld: "/api/cards/suit/major",
      },
      {
        methode: "POST",
        pad: "/api/interpret",
        beschrijving: "AI-interpretatie van een tarotlegging (vereist OpenAI API key)",
        parameters: [
          { naam: "cards", type: "array", verplicht: true, beschrijving: "Array van kaartobjecten met nameNL en isReversed" },
          { naam: "question", type: "string", verplicht: false, beschrijving: "De vraag van de gebruiker" },
          { naam: "spread", type: "string", verplicht: false, beschrijving: "Naam van de legging (bv. 'Drie kaarten')" },
        ],
        voorbeeld: '/api/interpret (POST met body: {"cards":[{"nameNL":"De Zon","isReversed":false}],"question":"Wat brengt de toekomst?"})',
        responsVoorbeeld: '{"interpretation":"De Zon straalt positieve energie uit..."}',
      },
    ],
  },
  {
    naam: "Horoscoop",
    emoji: "♈",
    kleur: "#e74c3c",
    beschrijving: "Dagelijkse horoscopen voor 12 westerse tekens en het Chinese sterrenbeeld. Cache wordt elke nacht bijgewerkt.",
    endpoints: [
      {
        methode: "GET",
        pad: "/api/horoscoop/vandaag",
        beschrijving: "Alle 12 horoscopen van vandaag",
        voorbeeld: "/api/horoscoop/vandaag",
        responsVoorbeeld: '{"datum":"2026-05-28","tekens":{"aries":{"naam":"Ram","horoscoop":"..."},...}}',
      },
      {
        methode: "GET",
        pad: "/api/horoscoop/:teken",
        beschrijving: "Horoscoop voor één specifiek teken",
        parameters: [{ naam: "teken", type: "string", verplicht: true, beschrijving: "aries | taurus | gemini | cancer | leo | virgo | libra | scorpio | sagittarius | capricorn | aquarius | pisces", voorbeeld: "aries" }],
        voorbeeld: "/api/horoscoop/aries",
        responsVoorbeeld: '{"datum":"2026-05-28","naam":"Ram","horoscoop":"Vandaag staat..."}',
      },
      {
        methode: "GET",
        pad: "/api/horoscoop/chinees/:jaar",
        beschrijving: "Chinees sterrenbeeld op basis van geboortejaar",
        parameters: [{ naam: "jaar", type: "number", verplicht: true, beschrijving: "Geboortejaar (1900–2100)", voorbeeld: "1990" }],
        voorbeeld: "/api/horoscoop/chinees/1990",
        responsVoorbeeld: '{"jaar":1990,"slug":"horse","naam":"Paard","emoji":"🐎"}',
      },
    ],
  },
  {
    naam: "Maanfase",
    emoji: "🌙",
    kleur: "#2c3e50",
    beschrijving: "Berekend via suncalc (offline, geen externe API). Exacte maanfase voor elke datum.",
    endpoints: [
      {
        methode: "GET",
        pad: "/api/maan/nu",
        beschrijving: "Huidige maanfase",
        voorbeeld: "/api/maan/nu",
        responsVoorbeeld: '{"datum":"2026-05-28","fase":"Wassende Maan","emoji":"🌔","verlichtingspercentage":62,"faseWaarde":0.3821}',
      },
      {
        methode: "GET",
        pad: "/api/maan/kalender",
        beschrijving: "Maanfase per dag van een maand",
        parameters: [
          { naam: "maand", type: "number", verplicht: false, beschrijving: "Maand (1–12), standaard huidige maand", voorbeeld: "6" },
          { naam: "jaar", type: "number", verplicht: false, beschrijving: "Jaar, standaard huidig jaar", voorbeeld: "2026" },
        ],
        voorbeeld: "/api/maan/kalender?maand=6&jaar=2026",
        responsVoorbeeld: '{"maand":6,"jaar":2026,"dagen":[{"datum":"2026-06-01","fase":"Afnemende Maansikkel","emoji":"🌘",...},...]}',
      },
    ],
  },
  {
    naam: "Natal Chart (Geboortehoroscoop)",
    emoji: "⭐",
    kleur: "#d4af37",
    beschrijving: "Berekend via Kerykeion (Swiss Ephemeris) — Python microservice op poort 4211. Exacte planeetposities, huizen en aspecten.",
    endpoints: [
      {
        methode: "GET",
        pad: "/api/natal",
        beschrijving: "Volledig geboortehoroscoop met planeten, huizen en aspecten",
        parameters: [
          { naam: "naam", type: "string", verplicht: true, beschrijving: "Naam van de persoon", voorbeeld: "Maria" },
          { naam: "jaar", type: "number", verplicht: true, beschrijving: "Geboortejaar", voorbeeld: "1990" },
          { naam: "maand", type: "number", verplicht: true, beschrijving: "Geboortemaand (1–12)", voorbeeld: "6" },
          { naam: "dag", type: "number", verplicht: true, beschrijving: "Geboortedag (1–31)", voorbeeld: "15" },
          { naam: "uur", type: "number", verplicht: false, beschrijving: "Geboorteuur (0–23), standaard 12", voorbeeld: "14" },
          { naam: "minuut", type: "number", verplicht: false, beschrijving: "Geboorteminuut (0–59), standaard 0", voorbeeld: "30" },
          { naam: "stad", type: "string", verplicht: false, beschrijving: "Geboortestad (worldwide via OpenStreetMap), standaard Amsterdam", voorbeeld: "Rotterdam" },
        ],
        voorbeeld: "/api/natal?naam=Maria&jaar=1990&maand=6&dag=15&uur=14&minuut=30&stad=Rotterdam",
        responsVoorbeeld: '{"kern":{"zon":{"teken":"Tweelingen","graad":24.05},"maan":{"teken":"Vissen"},"ascendant":{"teken":"Maagd"}},"planeten":[...],"huizen":[...],"aspecten":[...]}',
      },
      {
        methode: "GET",
        pad: "/api/natal/svg",
        beschrijving: "SVG-afbeelding van het geboortewiel",
        parameters: [
          { naam: "naam, jaar, maand, dag", type: "string/number", verplicht: true, beschrijving: "Zelfde als /api/natal" },
        ],
        voorbeeld: "/api/natal/svg?naam=Maria&jaar=1990&maand=6&dag=15",
        responsVoorbeeld: "(SVG afbeelding — direct in <img src=...> te gebruiken)",
      },
      {
        methode: "GET",
        pad: "/api/natal/geocodeer",
        beschrijving: "Steden zoeken voor autocomplete (OpenStreetMap Nominatim)",
        parameters: [{ naam: "q", type: "string", verplicht: true, beschrijving: "Zoekterm voor stad", voorbeeld: "Amster" }],
        voorbeeld: "/api/natal/geocodeer?q=Amster",
        responsVoorbeeld: '{"resultaten":[{"naam":"Amsterdam","land":"Nederland","lat":52.37,"lng":4.89,"tz":"Europe/Amsterdam"},...]}',
      },
    ],
  },
  {
    naam: "Numerologie",
    emoji: "🔢",
    kleur: "#27ae60",
    beschrijving: "Alle numerologische berekeningen: levenspad, bestuursgetal, naam-getallen en meer. Puur JavaScript, geen externe API.",
    endpoints: [
      {
        methode: "GET",
        pad: "/api/numerologie/analyse",
        beschrijving: "Volledig numerologisch profiel op basis van geboortedatum (en optioneel naam)",
        parameters: [
          { naam: "datum", type: "string", verplicht: true, beschrijving: "Geboortedatum in formaat YYYY-MM-DD", voorbeeld: "1990-06-15" },
          { naam: "naam", type: "string", verplicht: false, beschrijving: "Volledige naam voor naam-getallen", voorbeeld: "Maria Jansen" },
        ],
        voorbeeld: "/api/numerologie/analyse?datum=1990-06-15&naam=Maria Jansen",
        responsVoorbeeld: '{"getallen":{"lifePath":{"result":9},"ruling":{"result":6},...},"naamAnalyse":{"naamGetal":7,"zielenGetal":3,...}}',
      },
      {
        methode: "GET",
        pad: "/api/numerologie/naam",
        beschrijving: "Naam-getallen: naamgetal, zielengetal, persoonlijkheidsgetal",
        parameters: [{ naam: "naam", type: "string", verplicht: true, beschrijving: "Naam om te analyseren", voorbeeld: "Maria Jansen" }],
        voorbeeld: "/api/numerologie/naam?naam=Maria Jansen",
        responsVoorbeeld: '{"naamGetal":7,"zielenGetal":3,"persoonlijkheidsGetal":4,"woorden":[...]}',
      },
      {
        methode: "GET",
        pad: "/api/numerologie/jaar",
        beschrijving: "Persoonlijk jaargetal voor huidig of opgegeven jaar",
        parameters: [
          { naam: "datum", type: "string", verplicht: true, beschrijving: "Geboortedatum YYYY-MM-DD", voorbeeld: "1990-06-15" },
          { naam: "jaar", type: "number", verplicht: false, beschrijving: "Jaar waarvoor berekend wordt, standaard huidig jaar", voorbeeld: "2027" },
        ],
        voorbeeld: "/api/numerologie/jaar?datum=1990-06-15&jaar=2027",
        responsVoorbeeld: '{"jaar":2027,"getal":5}',
      },
      {
        methode: "GET",
        pad: "/api/numerologie/huisnummer",
        beschrijving: "Numerologische waarde van een huisnummer",
        parameters: [{ naam: "nummer", type: "string", verplicht: true, beschrijving: "Huisnummer (ook met letters zoals 12B)", voorbeeld: "12B" }],
        voorbeeld: "/api/numerologie/huisnummer?nummer=12B",
        responsVoorbeeld: '{"invoer":"12B","getal":3,"stappen":["1 + 2 = 3"]}',
      },
    ],
  },
];

const METHODE_KLEUR: Record<string, string> = {
  GET: "#27ae60",
  POST: "#e67e22",
};

export function ApiDocsPage() {
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openEndpoint, setOpenEndpoint] = useState<string | null>(null);
  const [gekopieerd, setGekopieerd] = useState<string | null>(null);

  const kopieer = (tekst: string, id: string) => {
    navigator.clipboard.writeText(tekst);
    setGekopieerd(id);
    setTimeout(() => setGekopieerd(null), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0a1628 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📡</div>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '2rem', marginBottom: '0.5rem' }}>
            API Overzicht
          </h1>
          <p style={{ color: '#a89060', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Mystieke Kaarten Platform — alle beschikbare endpoints
          </p>
          <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}>
              Base URL: https://tarot.ownyourdot.me
            </span>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', background: 'rgba(39,174,96,0.1)', color: '#27ae60', border: '1px solid rgba(39,174,96,0.3)' }}>
              {MODULES.reduce((sum, m) => sum + m.endpoints.length, 0)} endpoints
            </span>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', background: 'rgba(52,152,219,0.1)', color: '#3498db', border: '1px solid rgba(52,152,219,0.3)' }}>
              {MODULES.length} modules
            </span>
          </div>
        </div>

        {/* Snel overzicht tabel */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(212,175,55,0.2)', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '1rem', marginBottom: '1rem' }}>Snel Overzicht</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {MODULES.flatMap(m => m.endpoints.map(e => (
              <div key={e.pad} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.3rem 0' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 'bold', background: METHODE_KLEUR[e.methode] + '25', color: METHODE_KLEUR[e.methode], minWidth: 40, textAlign: 'center' }}>
                  {e.methode}
                </span>
                <span style={{ color: '#d4af37', flex: 1 }}>{e.pad}</span>
                <span style={{ color: '#7a6a4a', fontSize: '0.8rem', fontFamily: 'Crimson Pro, serif' }}>{e.beschrijving}</span>
              </div>
            )))}
          </div>
        </div>

        {/* Modules */}
        {MODULES.map(module => (
          <div key={module.naam} style={{ marginBottom: '1.5rem' }}>
            <div
              onClick={() => setOpenModule(openModule === module.naam ? null : module.naam)}
              style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: openModule === module.naam ? '12px 12px 0 0' : 12,
                border: `1px solid ${module.kleur}40`, padding: '1rem 1.5rem',
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = module.kleur + '80')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = module.kleur + '40')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{module.emoji}</span>
                <div>
                  <h2 style={{ fontFamily: 'Cinzel, serif', color: module.kleur, margin: 0, fontSize: '1rem' }}>{module.naam}</h2>
                  <p style={{ color: '#7a6a4a', fontFamily: 'Crimson Pro, serif', margin: 0, fontSize: '0.85rem' }}>{module.beschrijving}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#7a6a4a', fontSize: '0.8rem' }}>{module.endpoints.length} endpoints</span>
                <span style={{ color: module.kleur, fontSize: '1.2rem' }}>{openModule === module.naam ? '▲' : '▼'}</span>
              </div>
            </div>

            {openModule === module.naam && (
              <div style={{ border: `1px solid ${module.kleur}40`, borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                {module.endpoints.map((ep, idx) => {
                  const epId = `${module.naam}-${idx}`;
                  const isOpen = openEndpoint === epId;
                  return (
                    <div key={ep.pad} style={{ borderBottom: idx < module.endpoints.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <div
                        onClick={() => setOpenEndpoint(isOpen ? null : epId)}
                        style={{ padding: '0.85rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', background: isOpen ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 'bold', background: METHODE_KLEUR[ep.methode] + '25', color: METHODE_KLEUR[ep.methode], minWidth: 40, textAlign: 'center' }}>
                          {ep.methode}
                        </span>
                        <span style={{ fontFamily: 'monospace', color: '#d4cfc0', fontSize: '0.9rem', flex: 1 }}>{ep.pad}</span>
                        <span style={{ color: '#7a6a4a', fontFamily: 'Crimson Pro, serif', fontSize: '0.85rem' }}>{ep.beschrijving}</span>
                        <span style={{ color: '#7a6a4a' }}>{isOpen ? '▲' : '▼'}</span>
                      </div>

                      {isOpen && (
                        <div style={{ padding: '1rem 1.5rem 1.25rem', background: 'rgba(0,0,0,0.2)' }}>

                          {/* Parameters */}
                          {ep.parameters && ep.parameters.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ color: '#a89060', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', marginBottom: '0.5rem' }}>PARAMETERS</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {ep.parameters.map(p => (
                                  <div key={p.naam} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                    <code style={{ color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                      {p.naam}
                                    </code>
                                    <span style={{ color: '#3498db', fontSize: '0.8rem', fontFamily: 'monospace' }}>{p.type}</span>
                                    <span style={{ padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.7rem', background: p.verplicht ? 'rgba(231,76,60,0.15)' : 'rgba(39,174,96,0.1)', color: p.verplicht ? '#e74c3c' : '#27ae60' }}>
                                      {p.verplicht ? 'verplicht' : 'optioneel'}
                                    </span>
                                    <span style={{ color: '#a89060', fontFamily: 'Crimson Pro, serif', fontSize: '0.9rem', flex: 1 }}>{p.beschrijving}</span>
                                    {p.voorbeeld && (
                                      <span style={{ color: '#7a6a4a', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                        bv. <em style={{ color: '#d4cfc0' }}>{p.voorbeeld}</em>
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Voorbeeld */}
                          <div style={{ marginBottom: ep.responsVoorbeeld ? '0.75rem' : 0 }}>
                            <div style={{ color: '#a89060', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', marginBottom: '0.4rem' }}>VOORBEELD</div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                              <code style={{
                                flex: 1, fontFamily: 'monospace', fontSize: '0.82rem', color: '#d4cfc0',
                                background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.75rem', borderRadius: 6,
                                wordBreak: 'break-all', display: 'block',
                              }}>
                                {ep.voorbeeld}
                              </code>
                              <button
                                onClick={() => kopieer(ep.voorbeeld, epId + '-example')}
                                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', borderRadius: 6, padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                              >
                                {gekopieerd === epId + '-example' ? '✓ Gekopieerd' : 'Kopieer'}
                              </button>
                            </div>
                          </div>

                          {/* Response voorbeeld */}
                          {ep.responsVoorbeeld && (
                            <div>
                              <div style={{ color: '#a89060', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', marginBottom: '0.4rem' }}>RESPONSE VOORBEELD</div>
                              <code style={{
                                fontFamily: 'monospace', fontSize: '0.8rem', color: '#7a9a7a',
                                background: 'rgba(0,0,0,0.3)', padding: '0.6rem 0.75rem', borderRadius: 6,
                                wordBreak: 'break-all', display: 'block',
                              }}>
                                {ep.responsVoorbeeld}
                              </code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Technische info */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(212,175,55,0.15)', padding: '1.5rem', marginTop: '2rem' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', fontSize: '1rem', marginBottom: '1rem' }}>⚙️ Technische details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: "Express Server", waarde: "Node.js + TypeScript — poort 4210" },
              { label: "Python Service", waarde: "FastAPI + Kerykeion — poort 4211 (intern)" },
              { label: "Ephemeris", waarde: "Swiss Ephemeris via Kerykeion" },
              { label: "Geocoding", waarde: "OpenStreetMap Nominatim (gratis)" },
              { label: "Maanfase", waarde: "suncalc npm (offline berekening)" },
              { label: "AI interpretatie", waarde: "OpenAI gpt-3.5-turbo (vereist key)" },
              { label: "Horoscoop cache", waarde: "JSON op schijf, dagelijks ververst" },
              { label: "CORS", waarde: "Alleen https://tarot.ownyourdot.me" },
            ].map(({ label, waarde }) => (
              <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ color: '#a89060', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', marginBottom: '0.3rem' }}>{label}</div>
                <div style={{ color: '#d4cfc0', fontFamily: 'Crimson Pro, serif', fontSize: '0.9rem' }}>{waarde}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#7a6a4a', fontFamily: 'Crimson Pro, serif', fontSize: '0.85rem' }}>
          Mystieke Kaarten Platform — v2.0 — intern gebruik
        </div>
      </div>
    </div>
  );
}
