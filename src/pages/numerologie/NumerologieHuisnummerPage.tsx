import React, { useState, useMemo } from 'react';
import { numberDescriptions } from '../../data/numerologie/getalBeschrijvingen';

const G = {
  goud: '#B8860B',
  goudBleek: '#F5EDD8',
  goudDonker: '#7A5C00',
  bg: '#FDFAF4',
  bg2: '#F5F0E8',
  bg3: '#EDE6D6',
  tekst: '#2C2416',
  tekst2: '#6B5C3E',
  tekst3: '#9C8A6A',
  rand: 'rgba(184,134,11,0.20)',
  rand2: 'rgba(184,134,11,0.35)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sumDigits(input: string): { digits: string; total: number; steps: string[] } {
  const digits = input.replace(/[^0-9]/g, '');
  if (!digits) return { digits: '', total: 0, steps: [] };
  const total = Array.from(digits).reduce((s, d) => s + parseInt(d), 0);
  const steps: string[] = [`Cijfers: ${Array.from(digits).join(' + ')} = ${total}`];
  return { digits, total, steps };
}

function reduceToSingle(n: number, steps: string[]): number {
  if (n === 0) return 0;
  let current = n;
  while (current > 9) {
    const next = Array.from(String(current)).reduce((s, d) => s + parseInt(d), 0);
    steps.push(`Reduceer: ${Array.from(String(current)).join(' + ')} = ${next}`);
    current = next;
  }
  return current;
}

// ─── ResultBlock ──────────────────────────────────────────────────────────────

interface ResultBlockProps {
  result: number;
  steps: string[];
  inputLabel: string;
  inputValue: string;
  extraContext?: string; // extra paragraph before desc
}

const ResultBlock: React.FC<ResultBlockProps> = ({
  result,
  steps,
  inputLabel,
  inputValue,
  extraContext,
}) => {
  const desc = numberDescriptions[result as keyof typeof numberDescriptions];
  if (!desc) return null;

  return (
    <div>
      {/* Result number + title */}
      <div
        style={{
          background: G.goudBleek,
          border: `1px solid ${G.rand2}`,
          borderRadius: 12,
          padding: '2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 72,
            fontWeight: 700,
            color: G.goud,
            lineHeight: 1,
            minWidth: 72,
          }}
        >
          {result}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: '0.12em',
              color: G.tekst3,
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
            }}
          >
            {inputLabel}: {inputValue}
          </p>
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 22,
              fontWeight: 400,
              color: G.tekst,
              marginBottom: '0.5rem',
            }}
          >
            {desc.title}
          </h3>
          <p
            style={{
              fontSize: 16,
              color: G.tekst2,
              fontFamily: "'Crimson Pro', serif",
              lineHeight: 1.7,
            }}
          >
            {desc.description}
          </p>
        </div>
      </div>

      {/* Calculation steps */}
      <div
        style={{
          background: G.bg3,
          border: `0.5px solid ${G.rand}`,
          borderRadius: 6,
          padding: '0.9rem 1.1rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 11,
            letterSpacing: '0.08em',
            color: G.tekst3,
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Berekening
        </p>
        {steps.map((step, i) => (
          <p
            key={i}
            style={{
              fontSize: 13,
              color: G.tekst2,
              fontFamily: "'Crimson Pro', serif",
              margin: '0.2rem 0',
              lineHeight: 1.6,
            }}
          >
            {step}
          </p>
        ))}
        <p
          style={{
            fontSize: 14,
            color: G.goud,
            fontFamily: "'Cinzel', serif",
            marginTop: '0.4rem',
          }}
        >
          Uitkomst: {result}
        </p>
      </div>

      {/* Extra context if provided */}
      {extraContext && (
        <p
          style={{
            fontSize: 15,
            color: G.tekst2,
            fontFamily: "'Crimson Pro', serif",
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            fontStyle: 'italic',
          }}
        >
          {extraContext}
        </p>
      )}

      {/* Practical interpretation */}
      <div
        style={{
          background: G.bg2,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 10,
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 12,
            letterSpacing: '0.08em',
            color: G.tekst3,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          Wat dit betekent
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          <div>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                letterSpacing: '0.06em',
                color: '#16A34A',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Positieve energie
            </p>
            <ul style={{ paddingLeft: '1rem', margin: 0 }}>
              {desc.positives.map((p, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    color: G.tekst2,
                    fontFamily: "'Crimson Pro', serif",
                    lineHeight: 1.7,
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                letterSpacing: '0.06em',
                color: '#DC2626',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Aandachtspunten
            </p>
            <ul style={{ paddingLeft: '1rem', margin: 0 }}>
              {desc.negatives.map((n, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14,
                    color: G.tekst2,
                    fontFamily: "'Crimson Pro', serif",
                    lineHeight: 1.7,
                  }}
                >
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Huisnummer Tab ───────────────────────────────────────────────────────────

const HuisnummerTab: React.FC = () => {
  const [invoer, setInvoer] = useState('');
  const [berekend, setBerekend] = useState(false);

  const berekening = useMemo(() => {
    if (!berekend || !invoer.trim()) return null;
    const steps: string[] = [];
    const { digits, total } = sumDigits(invoer);
    if (!digits) return null;

    // Show letter stripping note if there were letters
    const lettersStripped = invoer.replace(/[^a-zA-Z]/g, '');
    if (lettersStripped) {
      steps.push(`Letters (${lettersStripped.toUpperCase()}) worden genegeerd — alleen cijfers tellen`);
    }
    steps.push(`Cijfers: ${Array.from(digits).join(' + ')} = ${total}`);

    let result = total;
    if (result > 9) {
      result = reduceToSingle(total, steps);
    } else {
      steps.push(`${total} is al een enkel cijfer`);
    }

    return { result, steps };
  }, [berekend, invoer]);

  const extraContext =
    berekening
      ? `Dit huisnummer draagt de energie van het getal ${berekening.result}. De numerologische trilling van je woning beïnvloedt de sfeer, de ervaringen en het soort energie dat in je huis aanwezig is.`
      : undefined;

  return (
    <div>
      {/* Form */}
      <div
        style={{
          background: G.bg2,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 10,
          padding: '1.8rem',
          marginBottom: '2rem',
          maxWidth: 480,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 17,
            fontWeight: 400,
            color: G.tekst,
            marginBottom: '1.2rem',
          }}
        >
          Voer je huisnummer in
        </h2>
        <p
          style={{
            fontSize: 14,
            color: G.tekst3,
            fontFamily: "'Crimson Pro', serif",
            fontStyle: 'italic',
            marginBottom: '1rem',
          }}
        >
          Letters zoals "12A" of "45B" worden automatisch genegeerd — alleen de cijfers tellen.
        </p>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            style={{
              display: 'block',
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: '0.08em',
              color: G.tekst3,
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            Huisnummer
          </label>
          <input
            type="text"
            value={invoer}
            onChange={e => { setInvoer(e.target.value); setBerekend(false); }}
            placeholder="bijv. 42 of 12A"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              fontFamily: "'Crimson Pro', serif",
              fontSize: 18,
              color: G.tekst,
              background: G.bg,
              border: `0.5px solid ${G.rand2}`,
              borderRadius: 6,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={() => setBerekend(true)}
          disabled={!invoer.trim() || !/\d/.test(invoer)}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            letterSpacing: '0.08em',
            color: (!invoer.trim() || !/\d/.test(invoer)) ? G.tekst3 : '#fff',
            background: (!invoer.trim() || !/\d/.test(invoer)) ? G.bg3 : G.goud,
            border: `0.5px solid ${(!invoer.trim() || !/\d/.test(invoer)) ? G.rand : G.goudDonker}`,
            borderRadius: 6,
            padding: '0.7rem 1.8rem',
            cursor: (!invoer.trim() || !/\d/.test(invoer)) ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          Bereken →
        </button>
      </div>

      {/* Result */}
      {berekend && berekening && (
        <ResultBlock
          result={berekening.result}
          steps={berekening.steps}
          inputLabel="Huisnummer"
          inputValue={invoer}
          extraContext={extraContext}
        />
      )}

      {/* Info box */}
      <div
        style={{
          background: G.goudBleek,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 8,
          padding: '1.2rem 1.4rem',
          marginTop: '1.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 12,
            letterSpacing: '0.06em',
            color: G.goudDonker,
            marginBottom: '0.4rem',
          }}
        >
          Over huisnummer numerologie
        </p>
        <p
          style={{
            fontSize: 14,
            color: G.tekst2,
            fontFamily: "'Crimson Pro', serif",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          In de numerologie gelooft men dat elk huis een unieke energetische trilling heeft die wordt
          bepaald door het huisnummer. Dit getal beïnvloedt de sfeer, de relaties en de ervaringen
          van de mensen die er wonen. Appartementnummers (bijv. 3B) tellen alleen de cijfers.
        </p>
      </div>
    </div>
  );
};

// ─── Telefoonnummer Tab ───────────────────────────────────────────────────────

const TelefoonnummerTab: React.FC = () => {
  const [invoer, setInvoer] = useState('');
  const [berekend, setBerekend] = useState(false);

  const berekening = useMemo(() => {
    if (!berekend || !invoer.trim()) return null;
    const steps: string[] = [];
    const digits = invoer.replace(/[^0-9]/g, '');
    if (!digits) return null;

    if (digits.length < invoer.replace(/\s|-/g, '').length) {
      steps.push('Spaties en koppeltekens worden verwijderd');
    }

    const total = Array.from(digits).reduce((s, d) => s + parseInt(d), 0);
    steps.push(`Cijfers: ${Array.from(digits).join(' + ')} = ${total}`);

    let result = total;
    if (result > 9) {
      result = reduceToSingle(total, steps);
    } else {
      steps.push(`${total} is al een enkel cijfer`);
    }

    return { result, steps, digits };
  }, [berekend, invoer]);

  const extraContext =
    berekening
      ? `Je telefoonnummer draagt de trilling van het getal ${berekening.result}. Dit getal kleurt de aard van de communicatie en verbindingen die via dit nummer verlopen.`
      : undefined;

  return (
    <div>
      {/* Form */}
      <div
        style={{
          background: G.bg2,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 10,
          padding: '1.8rem',
          marginBottom: '2rem',
          maxWidth: 480,
        }}
      >
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 17,
            fontWeight: 400,
            color: G.tekst,
            marginBottom: '1.2rem',
          }}
        >
          Voer je telefoonnummer in
        </h2>
        <p
          style={{
            fontSize: 14,
            color: G.tekst3,
            fontFamily: "'Crimson Pro', serif",
            fontStyle: 'italic',
            marginBottom: '1rem',
          }}
        >
          Spaties en koppeltekens worden automatisch verwijderd. Voer het nummer in zoals je wilt —
          bijv. 06-12345678 of +31 6 12345678.
        </p>

        <div style={{ marginBottom: '1.2rem' }}>
          <label
            style={{
              display: 'block',
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: '0.08em',
              color: G.tekst3,
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            Telefoonnummer
          </label>
          <input
            type="tel"
            value={invoer}
            onChange={e => { setInvoer(e.target.value); setBerekend(false); }}
            placeholder="bijv. 06 12 34 56 78"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              fontFamily: "'Crimson Pro', serif",
              fontSize: 18,
              color: G.tekst,
              background: G.bg,
              border: `0.5px solid ${G.rand2}`,
              borderRadius: 6,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={() => setBerekend(true)}
          disabled={!invoer.trim() || !/\d/.test(invoer)}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            letterSpacing: '0.08em',
            color: (!invoer.trim() || !/\d/.test(invoer)) ? G.tekst3 : '#fff',
            background: (!invoer.trim() || !/\d/.test(invoer)) ? G.bg3 : G.goud,
            border: `0.5px solid ${(!invoer.trim() || !/\d/.test(invoer)) ? G.rand : G.goudDonker}`,
            borderRadius: 6,
            padding: '0.7rem 1.8rem',
            cursor: (!invoer.trim() || !/\d/.test(invoer)) ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          Bereken →
        </button>
      </div>

      {/* Result */}
      {berekend && berekening && (
        <ResultBlock
          result={berekening.result}
          steps={berekening.steps}
          inputLabel="Telefoonnummer"
          inputValue={invoer}
          extraContext={extraContext}
        />
      )}

      {/* Info box */}
      <div
        style={{
          background: G.goudBleek,
          border: `0.5px solid ${G.rand2}`,
          borderRadius: 8,
          padding: '1.2rem 1.4rem',
          marginTop: '1.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 12,
            letterSpacing: '0.06em',
            color: G.goudDonker,
            marginBottom: '0.4rem',
          }}
        >
          Over telefoonnummer numerologie
        </p>
        <p
          style={{
            fontSize: 14,
            color: G.tekst2,
            fontFamily: "'Crimson Pro', serif",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Net als huisnummers draagt elk telefoonnummer een numerologische trilling. De betekenis
          vertelt je iets over de aard van de verbindingen en communicatie die via dit nummer
          verlopen — zakelijk, relationeel of spiritueel. Gebruik de duiding als reflectie, niet als
          absolute voorspelling.
        </p>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'huisnummer' | 'telefoonnummer';

export const NumerologieHuisnummerPage: React.FC = () => {
  const [actieveTab, setActieveTab] = useState<Tab>('huisnummer');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'huisnummer', label: 'Huisnummer' },
    { id: 'telefoonnummer', label: 'Telefoonnummer' },
  ];

  return (
    <div className="pendel-pagina">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: `0.5px solid ${G.rand}`, padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: '0.14em',
              color: G.goud,
              textTransform: 'uppercase',
              marginBottom: '0.7rem',
            }}
          >
            Getallenleer
          </p>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 38,
              fontWeight: 400,
              color: G.tekst,
              marginBottom: '0.7rem',
            }}
          >
            Huisnummer &amp; Telefoonnummer
          </h1>
          <p
            style={{
              fontSize: 18,
              fontStyle: 'italic',
              color: G.tekst2,
              lineHeight: 1.7,
              maxWidth: 580,
              fontFamily: "'Crimson Pro', serif",
            }}
          >
            Ontdek de numerologische trilling van je huisnummer of telefoonnummer. Elk getal draagt
            een unieke energie die invloed heeft op de sfeer en verbindingen in je leven.
          </p>
        </div>
      </div>

      {/* ── Tabs + Content ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '3rem auto', padding: '0 2rem' }}>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: `0.5px solid ${G.rand2}`,
            marginBottom: '2.5rem',
          }}
        >
          {tabs.map(tab => {
            const active = actieveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActieveTab(tab.id)}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 14,
                  letterSpacing: '0.07em',
                  color: active ? G.goud : G.tekst3,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? `2px solid ${G.goud}` : '2px solid transparent',
                  padding: '0.6rem 1.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {actieveTab === 'huisnummer' && <HuisnummerTab />}
        {actieveTab === 'telefoonnummer' && <TelefoonnummerTab />}

        {/* Footer note */}
        <div
          style={{
            marginTop: '3rem',
            marginBottom: '3rem',
            background: G.bg2,
            border: `0.5px solid ${G.rand}`,
            borderRadius: 8,
            padding: '1.2rem 1.4rem',
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              letterSpacing: '0.06em',
              color: G.goudDonker,
              marginBottom: '0.4rem',
            }}
          >
            Opmerking
          </p>
          <p
            style={{
              fontSize: 14,
              color: G.tekst2,
              fontFamily: "'Crimson Pro', serif",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Numerologie is een spiritueel reflectiehulpmiddel. De getalduidingen bieden inzicht en
            inspiratie — geen absolute voorspellingen. Gebruik de betekenissen als aanknopingspunt
            voor bewustwording en persoonlijke groei.
          </p>
        </div>
      </section>
    </div>
  );
};
