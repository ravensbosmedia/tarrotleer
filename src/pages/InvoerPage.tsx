import React, { useState, useMemo } from 'react';
import { allCards } from '../data/cards';
import { TarotCard } from '../types/cards';
import { Search, RotateCcw, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Spread definities ────────────────────────────────────────────────────

type SpreadId = 'dagkaart' | 'drie' | 'situatie-actie' | 'relatie' | 'carriere' | 'keltisch';

interface Spread {
  id: SpreadId;
  label: string;
  beschrijving: string;
  posities: string[];
}

const SPREADS: Spread[] = [
  {
    id: 'dagkaart',
    label: 'Dagkaart',
    beschrijving: 'Eén kaart voor focus en reflectie van de dag.',
    posities: ['Dagkaart'],
  },
  {
    id: 'drie',
    label: 'Verleden · Heden · Toekomst',
    beschrijving: 'Drie kaarten die de tijdslijn van de situatie belichten.',
    posities: ['Verleden', 'Heden', 'Toekomst'],
  },
  {
    id: 'situatie-actie',
    label: 'Situatie · Actie · Uitkomst',
    beschrijving: 'Wat speelt er, wat te doen, wat volgt.',
    posities: ['Situatie', 'Actie', 'Uitkomst'],
  },
  {
    id: 'relatie',
    label: 'Relatie Legging',
    beschrijving: 'Vijf kaarten voor inzicht in de dynamiek tussen twee mensen.',
    posities: ['Jouw energie', "De ander's energie", 'De verbinding', 'De uitdaging', 'Het potentieel'],
  },
  {
    id: 'carriere',
    label: 'Carrière Legging',
    beschrijving: 'Vier kaarten voor werk en loopbaanvragen.',
    posities: ['Huidige positie', 'Uitdagingen', 'Kansen', 'Beste pad vooruit'],
  },
  {
    id: 'keltisch',
    label: 'Keltisch Kruis',
    beschrijving: 'Tien kaarten voor een diepgaande analyse van een vraagstuk.',
    posities: [
      'Huidige situatie (kern)',
      'De kruising (uitdaging)',
      'Verleden',
      'Nabije toekomst',
      'Bewuste invloeden',
      'Onbewuste invloeden',
      'Jouw houding',
      'Externe invloeden',
      'Hoop en vrees',
      'Uiteindelijke uitkomst',
    ],
  },
];

// ─── Posities uitleg ──────────────────────────────────────────────────────

const POSITIE_UITLEG: Record<SpreadId, string[]> = {
  dagkaart: [
    'Welke energie of les staat vandaag centraal voor jou? Wat vraagt je aandacht?',
  ],
  drie: [
    'Wat heeft geleid tot de huidige situatie? Welke ervaringen of patronen zijn relevant?',
    'Waar sta je nu? De kern van de situatie zoals die op dit moment speelt.',
    'Waar leidt dit naartoe als de huidige energie voortduurt? Een waarschijnlijke richting.',
  ],
  'situatie-actie': [
    'Wat is de aard van het vraagstuk? De context en de huidige staat van zaken.',
    'Wat kun je doen? Welke stap of houding helpt je vooruit?',
    'Wat is het resultaat als je de actie onderneemt? Een richting, geen garantie.',
  ],
  relatie: [
    'Hoe kom jij de relatie in? Welke stemming of houding breng jij mee op dit moment?',
    'Wat brengt de ander mee? Dit is jouw perceptie — interessant om te toetsen.',
    'Wat is de kern van de relatie? Welk thema kenmerkt de band tussen jullie?',
    'Wat is de grootste hindernis of het grootste groeipunt in deze relatie?',
    'Waar kan de relatie naartoe groeien als beiden bewust met de uitdagingen omgaan?',
  ],
  carriere: [
    'Waar sta je nu in je werk of carrière? Een eerlijk beeld van de situatie.',
    'Wat staat je in de weg? Obstakels van buitenaf of patronen van binnenuit.',
    'Welke mogelijkheden zijn er? Wat zie je misschien over het hoofd?',
    'Wat is de meest vruchtbare richting of aanpak op dit moment in je carrière?',
  ],
  keltisch: [
    'De centrale kaart — de essentie van de vraag. Alles draait hieromheen.',
    'Wat compliceert of blokkeert de situatie? Kan ook iets positiefs zijn dat te dominant is.',
    'Wat heeft geleid tot de huidige situatie? Een recent patroon of beslissing.',
    'Wat staat er korte termijn te gebeuren als er niets verandert?',
    'Wat weet of denk je over de situatie? Bewuste doelen en verwachtingen.',
    'Wat beïnvloedt de situatie onbewust? Verborgen angsten of verlangens.',
    'Hoe sta jij in deze situatie? Welke energie breng jij mee?',
    'Welke invloed hebben anderen of de omgeving van buitenaf?',
    'Wat hoop je én wat vrees je? Soms is dat hetzelfde — een krachtige boodschap.',
    'De conclusie. Lees dit altijd in relatie tot de andere negen kaarten.',
  ],
};

// ─── Synthese logica ─────────────────────────────────────────────────────

interface GekozeneKaart {
  kaart: TarotCard;
  omgekeerd: boolean;
}

const SUIT_LABEL: Record<string, string> = {
  wands: 'Staven (Vuur)',
  cups: 'Kelken (Water)',
  swords: 'Zwaarden (Lucht)',
  pentacles: 'Pentakels (Aarde)',
  major: 'Grote Arcana',
};

const SUIT_THEMA: Record<string, string> = {
  wands: 'passie, ambitie en creatieve energie',
  cups: 'emoties, relaties en innerlijk gevoel',
  swords: 'gedachten, communicatie en conflict',
  pentacles: 'praktische zaken, werk en het tastbare',
  major: 'grote levenslessen en archetypische krachten',
};

function dominanteSuit(kaarten: GekozeneKaart[]): string | null {
  const telling: Record<string, number> = {};
  for (const { kaart } of kaarten) {
    telling[kaart.suit] = (telling[kaart.suit] ?? 0) + 1;
  }
  const gesorteerd = Object.entries(telling).sort((a, b) => b[1] - a[1]);
  if (gesorteerd.length === 0) return null;
  const [suit, count] = gesorteerd[0];
  if (count < 2 && kaarten.length > 2) return null;
  return suit;
}

function spreadVerhaal(spread: SpreadId, kaarten: GekozeneKaart[]): string[] {
  const n = (i: number) => kaarten[i]?.kaart.nameNL ?? '?';
  const rev = (i: number) => kaarten[i]?.omgekeerd ? ' (omgekeerd)' : '';
  const lines: string[] = [];

  if (spread === 'dagkaart') {
    lines.push(`Jouw dagkaart is ${n(0)}${rev(0)}. Deze kaart vraagt je vandaag bewust te zijn van de energie die hij vertegenwoordigt — niet als een vaste uitkomst, maar als een lens waardoor je de dag bekijkt.`);
    if (kaarten[0]?.omgekeerd) {
      lines.push(`Omdat de kaart omgekeerd ligt, speelt deze energie mogelijk meer op de achtergrond of vraagt hij om aandacht op een manier die je nog niet helemaal ziet. Neem even de tijd om je af te vragen: waar voel ik dit in mijn lichaam of gedachten?`);
    }
  }

  if (spread === 'drie') {
    lines.push(`Het verhaal begint in het verleden met ${n(0)}${rev(0)}. Dit is de energie die de situatie heeft gevoed — bewust of onbewust.`);
    lines.push(`In het heden staat ${n(1)}${rev(1)} centraal. Dit is het actieve thema, de energie die nu het meest aanwezig is in je leven of situatie.`);
    lines.push(`De richting die dit opgaat wordt getoond door ${n(2)}${rev(2)}. Lees dit niet als een garantie maar als: als de huidige energie doorzet, is dit de meest waarschijnlijke uitkomst.`);
    lines.push(`Let op hoe deze drie kaarten een boog vormen. Is er progressie, een spanning, of een terugkeer? Het patroon tussen ${n(0)} en ${n(2)} vertelt de kern van het verhaal.`);
  }

  if (spread === 'situatie-actie') {
    lines.push(`De situatie wordt beschreven door ${n(0)}${rev(0)} — dit is het landschap waarbinnen de vraag zich afspeelt.`);
    lines.push(`De actie die het beste past is ${n(1)}${rev(1)}. Vraag jezelf: welk aspect van deze kaart resoneer ik het meest? Dat is de concrete tip voor jou.`);
    lines.push(`Als je die richting inslaat, laat ${n(2)}${rev(2)} zien waar dat naartoe leidt. De spanning (of harmonie) tussen de actiekaart en de uitkomstkaart vertelt je of het pad recht is of nog bijstelling vraagt.`);
  }

  if (spread === 'relatie') {
    lines.push(`Jij brengt de energie van ${n(0)}${rev(0)} mee. De ander staat in de energie van ${n(1)}${rev(1)}.`);
    lines.push(`Kijk naar de verhouding tussen deze twee kaarten. Zijn ze complementair (bijv. Vuur en Lucht — beweging en ideeën samen), of staan ze op gespannen voet (bijv. Zwaarden en Kelken — hoofd versus hart)?`);
    lines.push(`De verbindingskaart ${n(2)}${rev(2)} laat zien wat de kern van jullie band is — het thema dat jullie samen creëren, bewust of niet.`);
    lines.push(`De uitdaging (${n(3)}${rev(3)}) is het groeipunt. De potentiekaart (${n(4)}${rev(4)}) laat zien waar de relatie naartoe kan wanneer jullie met die uitdaging bewust omgaan.`);
  }

  if (spread === 'carriere') {
    lines.push(`Je huidige positie (${n(0)}${rev(0)}) schetst de realiteit van dit moment. Erken wat er is, ook als het niet is wat je wilt.`);
    lines.push(`De uitdagingskaart ${n(1)}${rev(1)} wijst op wat je tegenhoudt. Is dit extern (omstandigheden) of intern (overtuigingen, angst, patroon)?`);
    lines.push(`${n(2)}${rev(2)} laat zien welke kans er is — misschien iets wat je al ziet, misschien iets wat je over het hoofd ziet omdat je te gefocust bent op de obstakels.`);
    lines.push(`Het beste pad vooruit via ${n(3)}${rev(3)} is het advies van de legging. Combineer dit met de kanskaart: hoe pak jij die kans het beste aan met de energie van deze kaart?`);
  }

  if (spread === 'keltisch') {
    lines.push(`De kern van je legging is ${n(0)}${rev(0)}, met als directe uitdaging ${n(1)}${rev(1)}. Dit is de centrale spanning: de situatie én wat haar compliceert.`);
    lines.push(`Het verleden (${n(2)}${rev(2)}) verklaart hoe je hier gekomen bent. De nabije toekomst (${n(3)}${rev(3)}) geeft aan waar het naartoe neigt als er niets verandert.`);
    lines.push(`Wat je bewust denkt of weet staat in ${n(4)}${rev(4)}. Wat onbewust speelt toont ${n(5)}${rev(5)}. De spanning tussen deze twee kaarten is vaak het interessantst: komt wat je denkt overeen met wat er werkelijk in je leeft?`);
    lines.push(`Jouw houding (${n(6)}${rev(6)}) en de externe invloeden (${n(7)}${rev(7)}) vormen samen de context. Hoe verhoudt jouw energie zich tot wat er van buiten op je afkomt?`);
    lines.push(`De hoop-en-vreeskaart ${n(8)}${rev(8)} is bijzonder — het is zowel wat je hoopt als wat je vreest. Soms zijn dat dezelfde dingen. De uiteindelijke uitkomst ${n(9)}${rev(9)} sluit de legging af: dit is de richting die de totaliteit aangeeft.`);
  }

  return lines;
}

interface SyntheseProps {
  spread: Spread;
  kaarten: GekozeneKaart[];
}

const Synthese: React.FC<SyntheseProps> = ({ spread, kaarten }) => {
  const dominant = dominanteSuit(kaarten);
  const aantalMajor = kaarten.filter(k => k.kaart.suit === 'major').length;
  const aantalOmgekeerd = kaarten.filter(k => k.omgekeerd).length;
  const verhaalRegels = spreadVerhaal(spread.id, kaarten);

  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl p-6 space-y-5">
      <h4 className="text-lg font-bold flex items-center gap-2">
        <span className="text-yellow-300">✦</span>
        De kaarten samen — het verhaal van deze legging
      </h4>

      {/* Energieanalyse */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-300">{aantalMajor}</p>
          <p className="text-xs text-purple-200 mt-0.5">Grote Arcana</p>
          <p className="text-xs text-white/60 mt-1">
            {aantalMajor === 0
              ? 'Dagelijks, praktisch vraagstuk'
              : aantalMajor >= Math.ceil(kaarten.length / 2)
              ? 'Diep, levensbeschouwelijk thema'
              : 'Mix van dagelijks en archetype'}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-300">{aantalOmgekeerd}</p>
          <p className="text-xs text-purple-200 mt-0.5">Omgekeerd</p>
          <p className="text-xs text-white/60 mt-1">
            {aantalOmgekeerd === 0
              ? 'Energie stroomt vrij'
              : aantalOmgekeerd >= Math.ceil(kaarten.length / 2)
              ? 'Veel energie naar binnen gericht'
              : 'Deels geblokkeerd of intern'}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-sm font-bold text-green-300">{dominant ? SUIT_LABEL[dominant] : 'Gemengd'}</p>
          <p className="text-xs text-purple-200 mt-0.5">Dominant element</p>
          <p className="text-xs text-white/60 mt-1">
            {dominant ? `Thema: ${SUIT_THEMA[dominant]}` : 'Meerdere levensgebieden betrokken'}
          </p>
        </div>
      </div>

      {/* Spreadverhaal */}
      <div className="space-y-3">
        {verhaalRegels.map((regel, i) => (
          <p key={i} className="text-sm text-white/90 leading-relaxed">
            {regel}
          </p>
        ))}
      </div>

      {/* Reflectievraag */}
      <div className="border-t border-white/20 pt-4">
        <p className="text-xs text-purple-300 font-semibold uppercase tracking-wide mb-1">Reflectievraag</p>
        <p className="text-sm text-white/80 italic">
          {spread.id === 'dagkaart' && 'Aan het einde van de dag: hoe heeft de energie van deze kaart zich gemanifesteerd — groot of klein?'}
          {spread.id === 'drie' && 'Welk thema verbindt alle drie de kaarten? Zoek het woord dat over alle drie past — dat is de kernboodschap van deze legging.'}
          {spread.id === 'situatie-actie' && 'Is de actie die de kaart aangeeft iets wat je al wist maar nog niet deed? Of verrast het je?'}
          {spread.id === 'relatie' && 'Als je de verbindingskaart bekijkt: herken je dit als het thema in jullie relatie? Wat wil je daarmee doen?'}
          {spread.id === 'carriere' && 'De kanskaart en het beste pad vooruit — hoe concreet kun jij dit vertalen naar één kleine stap deze week?'}
          {spread.id === 'keltisch' && 'Welke kaart in deze legging verraste je het meest — en waarom? Dat is vaak de boodschap die het diepst raakt.'}
        </p>
      </div>
    </div>
  );
};

// ─── Kaart zoeker component ───────────────────────────────────────────────

interface KaartKiezerProps {
  positie: string;
  positieIndex: number;
  spread: SpreadId;
  gekozen: { kaart: TarotCard; omgekeerd: boolean } | null;
  onKies: (kaart: TarotCard, omgekeerd: boolean) => void;
  onVerwijder: () => void;
}

const KaartKiezer: React.FC<KaartKiezerProps> = ({ positie, positieIndex, spread, gekozen, onKies, onVerwijder }) => {
  const [open, setOpen] = useState(false);
  const [zoek, setZoek] = useState('');
  const [omgekeerd, setOmgekeerd] = useState(false);

  const resultaten = useMemo(() => {
    if (!zoek) return allCards.slice(0, 20);
    const q = zoek.toLowerCase();
    return allCards.filter(c =>
      c.nameNL.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.suit.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [zoek]);

  const uitleg = POSITIE_UITLEG[spread]?.[positieIndex] ?? '';

  if (gekozen) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-start gap-4 p-4">
          {/* Kaartafbeelding */}
          <div className={`w-16 rounded-lg overflow-hidden shadow shrink-0 ${gekozen.omgekeerd ? 'rotate-180' : ''}`}>
            <img src={gekozen.kaart.imageUrl} alt={gekozen.kaart.nameNL} className="w-full h-auto" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-medium text-purple-500">Positie {positieIndex + 1}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{positie}</span>
              {gekozen.omgekeerd && (
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Omgekeerd</span>
              )}
            </div>
            <p className="font-semibold text-gray-800">{gekozen.kaart.nameNL}</p>
            <p className="text-sm text-gray-500">{gekozen.kaart.name}</p>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
              {gekozen.omgekeerd ? gekozen.kaart.meaningReversed : gekozen.kaart.meaningUpright}
            </p>
            <p className="text-xs text-purple-600 mt-2 italic">{uitleg}</p>
          </div>

          {/* Acties */}
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={onVerwijder}
              className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Wijzig
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm flex items-center justify-center shrink-0">
          {positieIndex + 1}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-700">{positie}</p>
          <p className="text-xs text-gray-400 mt-0.5">Klik om een kaart te selecteren</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          <p className="text-xs text-purple-600 italic">{uitleg}</p>

          {/* Omgekeerd toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOmgekeerd(!omgekeerd)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                omgekeerd
                  ? 'bg-orange-100 border-orange-300 text-orange-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              {omgekeerd ? 'Omgekeerd' : 'Rechtop'}
            </button>
            <span className="text-xs text-gray-400">Stond de kaart omgekeerd?</span>
          </div>

          {/* Zoekbalk */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Zoek op naam (bv. Maan, Kelken, Dood...)"
              value={zoek}
              onChange={e => setZoek(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Kaartresultaten */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {resultaten.map(kaart => (
              <button
                key={kaart.id}
                onClick={() => {
                  onKies(kaart, omgekeerd);
                  setOpen(false);
                  setZoek('');
                }}
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
              >
                <div className={`w-8 rounded overflow-hidden shrink-0 ${omgekeerd ? 'rotate-180' : ''}`}>
                  <img src={kaart.imageUrl} alt={kaart.nameNL} className="w-full h-auto" />
                </div>
                <span className="text-xs text-gray-700 leading-tight">{kaart.nameNL}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Hoofdpagina ──────────────────────────────────────────────────────────

export const InvoerPage: React.FC = () => {
  const [gekozenSpread, setGekozenSpread] = useState<Spread | null>(null);
  const [kaarten, setKaarten] = useState<(GekozeneKaart | null)[]>([]);
  const [toonSamenvatting, setToonSamenvatting] = useState(false);

  const kiesSpread = (spread: Spread) => {
    setGekozenSpread(spread);
    setKaarten(new Array(spread.posities.length).fill(null));
    setToonSamenvatting(false);
  };

  const zetKaart = (index: number, kaart: TarotCard, omgekeerd: boolean) => {
    setKaarten(prev => {
      const nieuw = [...prev];
      nieuw[index] = { kaart, omgekeerd };
      return nieuw;
    });
  };

  const verwijderKaart = (index: number) => {
    setKaarten(prev => {
      const nieuw = [...prev];
      nieuw[index] = null;
      return nieuw;
    });
  };

  const allesIngevuld = gekozenSpread && kaarten.every(k => k !== null);
  const aantalIngevuld = kaarten.filter(k => k !== null).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Mijn Legging Invoeren</h1>
          <p className="text-purple-200">Heb je al kaarten getrokken? Voer ze hier in en krijg uitleg per positie.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Stap 1 — Legging kiezen */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {gekozenSpread ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Legging: {gekozenSpread.label}
                <button
                  onClick={() => { setGekozenSpread(null); setKaarten([]); setToonSamenvatting(false); }}
                  className="text-sm font-normal text-purple-600 hover:underline ml-2"
                >
                  Wijzig
                </button>
              </span>
            ) : 'Stap 1 — Kies een legging'}
          </h2>

          {!gekozenSpread && (
            <div className="grid sm:grid-cols-2 gap-3">
              {SPREADS.map(spread => (
                <button
                  key={spread.id}
                  onClick={() => kiesSpread(spread)}
                  className="bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md hover:border-purple-300 border border-transparent transition-all"
                >
                  <p className="font-semibold text-purple-800">{spread.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{spread.posities.length} kaart{spread.posities.length > 1 ? 'en' : ''} · {spread.beschrijving}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stap 2 — Kaarten invoeren */}
        {gekozenSpread && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">
                Stap 2 — Voer de kaarten in
              </h2>
              <span className="text-sm text-gray-400">{aantalIngevuld} / {gekozenSpread.posities.length}</span>
            </div>

            <div className="space-y-3 mb-6">
              {gekozenSpread.posities.map((positie, i) => (
                <KaartKiezer
                  key={i}
                  positie={positie}
                  positieIndex={i}
                  spread={gekozenSpread.id}
                  gekozen={kaarten[i] ?? null}
                  onKies={(kaart, omgekeerd) => zetKaart(i, kaart, omgekeerd)}
                  onVerwijder={() => verwijderKaart(i)}
                />
              ))}
            </div>

            {/* Samenvatting knop */}
            {allesIngevuld && (
              <button
                onClick={() => setToonSamenvatting(!toonSamenvatting)}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                {toonSamenvatting ? 'Verberg samenvatting' : 'Bekijk volledige lezing'}
              </button>
            )}

            {/* Volledige samenvatting */}
            {toonSamenvatting && allesIngevuld && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-4">
                  <h3 className="text-xl font-bold">{gekozenSpread.label}</h3>
                  <p className="text-purple-200 text-sm mt-0.5">{gekozenSpread.beschrijving}</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {kaarten.map((item, i) => {
                    if (!item) return null;
                    return (
                      <div key={i} className="flex gap-4 p-5">
                        <div className={`w-16 rounded-lg overflow-hidden shadow shrink-0 ${item.omgekeerd ? 'rotate-180' : ''}`}>
                          <img src={item.kaart.imageUrl} alt={item.kaart.nameNL} className="w-full h-auto" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold text-purple-500 uppercase tracking-wide">
                              {gekozenSpread.posities[i]}
                            </span>
                            {item.omgekeerd && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Omgekeerd</span>
                            )}
                          </div>
                          <p className="font-bold text-gray-800 text-lg">{item.kaart.nameNL}</p>
                          <p className="text-sm text-gray-400 mb-2">{item.kaart.name}</p>
                          <p className="text-gray-700 leading-relaxed">
                            {item.omgekeerd ? item.kaart.meaningReversed : item.kaart.meaningUpright}
                          </p>
                          {item.kaart.description && (
                            <p className="text-sm text-gray-500 mt-2 italic">{item.kaart.description}</p>
                          )}
                          <p className="text-xs text-purple-600 mt-2 italic border-t border-purple-50 pt-2">
                            {POSITIE_UITLEG[gekozenSpread.id]?.[i]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Synthese — het verhaal van alle kaarten samen */}
                <div className="p-5">
                  <Synthese
                    spread={gekozenSpread}
                    kaarten={kaarten.filter((k): k is GekozeneKaart => k !== null)}
                  />
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t text-center">
                  <button
                    onClick={() => { setGekozenSpread(null); setKaarten([]); setToonSamenvatting(false); }}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Nieuwe legging invoeren
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
