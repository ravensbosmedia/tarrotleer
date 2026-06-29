import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'gevorderd';
  category: 'basis' | 'interpretatie' | 'leggingen' | 'gevorderd';
  content: React.ReactNode;
}

const lessons: Lesson[] = [
  // ─── BASIS ───────────────────────────────────────────────────────────────
  {
    id: 'wat-is-tarot',
    title: 'Wat is tarot?',
    level: 'beginner',
    category: 'basis',
    content: (
      <div className="space-y-3 text-gray-700 leading-relaxed">
        <p>Tarot is een systeem van 78 kaarten dat gebruikt wordt voor zelfreflectie, meditatie en inzicht. De kaarten zijn geen toekomstvoorspelling maar een spiegel — ze helpen je bewust te worden van patronen, mogelijkheden en blinde vlekken.</p>
        <p>Het Rider-Waite-Smith deck (1909) is het meest gebruikte deck ter wereld. De beelden zijn rijk aan symboliek: kleuren, figuren, getallen en achtergronden dragen allemaal betekenis.</p>
        <p><strong>Belangrijk:</strong> Tarot werkt het beste als hulpmiddel voor reflectie, niet als absolute waarheid. Jij bepaalt de betekenis in jouw situatie.</p>
      </div>
    )
  },
  {
    id: 'opbouw-deck',
    title: 'Opbouw van het deck (78 kaarten)',
    level: 'beginner',
    category: 'basis',
    content: (
      <div className="space-y-4 text-gray-700">
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-bold text-purple-800 mb-2">Grote Arcana — 22 kaarten (0–21)</h4>
          <p>Grote levenslessen en universele archetypen. Van De Dwaas (0) tot De Wereld (21). Dit zijn de meest krachtige kaarten en vertegenwoordigen grote overgangsperiodes in je leven.</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-bold text-indigo-800 mb-2">Kleine Arcana — 56 kaarten</h4>
          <p>Dagelijkse situaties, verdeeld in 4 suits van elk 14 kaarten (Aas t/m 10 + Schildknaap, Ridder, Koningin, Koning).</p>
          <ul className="mt-3 space-y-1.5">
            <li>🔥 <strong>Staven (Wands)</strong> — Vuur · Passie, creativiteit, energie, ambitie</li>
            <li>💧 <strong>Kelken (Cups)</strong> — Water · Emoties, relaties, intuïtie, dromen</li>
            <li>💨 <strong>Zwaarden (Swords)</strong> — Lucht · Gedachten, conflicten, communicatie</li>
            <li>🌍 <strong>Pentakels (Pentacles)</strong> — Aarde · Geld, werk, lichaam, praktische zaken</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'grote-arcana',
    title: 'De Grote Arcana uitgelegd',
    level: 'beginner',
    category: 'basis',
    content: (
      <div className="space-y-3 text-gray-700">
        <p>De 22 kaarten van de Grote Arcana vertellen samen het verhaal van <strong>De Dwaas</strong> — een reis door het leven van totale onschuld naar volledig bewustzijn. Dit noemen we ook wel "De Dwaasreis".</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {[
            ['0', 'De Dwaas', 'Begin, onschuld, spontaniteit'],
            ['I', 'De Magiër', 'Manifestatie, wilskracht'],
            ['II', 'De Hogepriesteres', 'Intuïtie, kennis'],
            ['III', 'De Keizerin', 'Vruchtbaarheid, moederlijkheid'],
            ['IV', 'De Keizer', 'Autoriteit, structuur'],
            ['V', 'De Hogepriester', 'Traditie, spirituele gids'],
            ['VI', 'De Geliefden', 'Liefde, keuzes'],
            ['VII', 'De Strijdwagen', 'Wilskracht, overwinning'],
            ['VIII', 'Kracht', 'Moed, zachte kracht'],
            ['IX', 'De Kluizenaar', 'Bezinning, wijsheid'],
            ['X', 'Het Wiel van Fortuin', 'Karma, cycli'],
            ['XI', 'Gerechtigheid', 'Eerlijkheid, waarheid'],
            ['XII', 'De Gehangene', 'Overgave, nieuw perspectief'],
            ['XIII', 'De Dood', 'Transitie, verandering'],
            ['XIV', 'Matigheid', 'Balans, geduld'],
            ['XV', 'De Duivel', 'Gebondenheid, schaduwzelf'],
            ['XVI', 'De Toren', 'Plotselinge verandering'],
            ['XVII', 'De Ster', 'Hoop, inspiratie'],
            ['XVIII', 'De Maan', 'Illusie, onderbewuste'],
            ['XIX', 'De Zon', 'Positiviteit, succes'],
            ['XX', 'Het Oordeel', 'Innerlijke roeping'],
            ['XXI', 'De Wereld', 'Voltooiing, heelheid'],
          ].map(([nr, naam, sleutel]) => (
            <div key={nr} className="flex gap-2 bg-gray-50 rounded p-2">
              <span className="text-purple-500 font-mono text-xs w-8 shrink-0">{nr}</span>
              <div>
                <span className="font-medium text-gray-800">{naam}</span>
                <span className="text-gray-400 text-xs block">{sleutel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'omgekeerde-kaarten',
    title: 'Omgekeerde kaarten (reversals)',
    level: 'beginner',
    category: 'basis',
    content: (
      <div className="space-y-3 text-gray-700 leading-relaxed">
        <p>Een omgekeerde kaart (upside-down) heeft een aangepaste betekenis. Dit betekent <strong>niet</strong> het tegenovergestelde — eerder een verzwakking, internalisering of blokkade van de rechtopstaande energie.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-semibold text-green-800 mb-1">Rechtop</h4>
            <p className="text-sm">De energie stroomt vrij en wordt actief uitgedrukt in het leven.</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <h4 className="font-semibold text-orange-800 mb-1">Omgekeerd</h4>
            <p className="text-sm">De energie is geblokkeerd, naar binnen gericht, of vraagt om meer aandacht.</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">Sommige lezers gebruiken nooit omgekeerde kaarten — beiden zijn geldige werkwijzen.</p>
      </div>
    )
  },

  // ─── INTERPRETATIE ────────────────────────────────────────────────────────
  {
    id: 'kaart-lezen',
    title: 'Hoe lees je een kaart? — stap voor stap',
    level: 'beginner',
    category: 'interpretatie',
    content: (
      <div className="space-y-4 text-gray-700">
        <p className="leading-relaxed">Veel beginners leren lijstjes met trefwoorden, maar echte interpretatie gaat verder. Gebruik deze stappen als leidraad bij elke kaart.</p>

        <div className="space-y-3">
          {[
            {
              stap: '1', kleur: 'purple',
              titel: 'Eerste indruk — vertrouw je intuïtie',
              tekst: 'Kijk naar de kaart zonder na te denken. Wat trekt je aandacht? Welk gevoel geeft de kaart je? Angstig, rustig, hoopvol? Die eerste reactie is vaak de juiste boodschap voor jou op dit moment.',
            },
            {
              stap: '2', kleur: 'blue',
              titel: 'Verken het beeld — wat zie je?',
              tekst: 'Beschrijf letterlijk wat er op de kaart staat: de figuren, de achtergrond, de kleuren, de symbolen. Vraag jezelf: wat doen de mensen? Hoe zien ze eruit? Wat staat er op de voorgrond versus de achtergrond?',
            },
            {
              stap: '3', kleur: 'indigo',
              titel: 'Suit en getal — de context',
              tekst: 'Welke suit is het? Staven (actie, passie), Kelken (gevoel, relaties), Zwaarden (gedachten, conflict), Pentakels (praktisch, materieel). Welk getal? Een Aas is een zaad; een 10 is een afronding. Dit geeft meteen richting.',
            },
            {
              stap: '4', kleur: 'violet',
              titel: 'Rechtop of omgekeerd?',
              tekst: 'Omgekeerd betekent meestal dat de energie van de kaart geblokkeerd, ingetrokken of overmatig aanwezig is. De Ster omgekeerd is niet "geen hoop" — het kan zijn dat je de hoop moeilijk kunt voelen, of dat je teveel op anderen leunt voor inspiratie.',
            },
            {
              stap: '5', kleur: 'green',
              titel: 'Koppel aan je vraag of positie',
              tekst: 'Hoe past dit beeld bij je vraag of de positie in de legging? De Dood in de "uitkomst"-positie is geen rampspelling — het zegt: deze situatie eindigt, er komt een transformatie. Lees altijd in context.',
            },
            {
              stap: '6', kleur: 'yellow',
              titel: 'Formuleer een boodschap',
              tekst: 'Vat de betekenis samen in één zin die direct tot jou spreekt. Niet: "De Kelken Vijf betekent verlies." Maar: "Wat heb ik verloren, en mis ik daardoor de twee kelken achter me die nog intact zijn?"',
            },
          ].map(({ stap, kleur, titel, tekst }) => (
            <div key={stap} className={`flex gap-3 bg-${kleur}-50 rounded-lg p-4`}>
              <span className={`text-${kleur}-600 font-bold text-lg w-6 shrink-0`}>{stap}</span>
              <div>
                <h4 className={`font-semibold text-${kleur}-800 mb-1`}>{titel}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{tekst}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
          <strong>Oefening:</strong> Trek één kaart. Beschrijf het beeld hardop of op papier zonder de betekenis op te zoeken. Koppel het aan iets in je leven. Kijk daarna pas in de bibliotheek wat de officiële betekenis is — je zult verrast zijn hoe dicht je vaak zit.
        </div>
      </div>
    )
  },
  {
    id: 'kaartcombinaties',
    title: 'Kaartcombinaties — kaarten die met elkaar spreken',
    level: 'gevorderd',
    category: 'interpretatie',
    content: (
      <div className="space-y-5 text-gray-700">
        <p className="leading-relaxed">Eén kaart zegt iets; meerdere kaarten samen vertellen een verhaal. Combinaties laten zien hoe energieën elkaar versterken, tegenwerken of nuanceren. Dit is het hart van tarot lezen.</p>

        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-bold text-purple-800 mb-3">Stap 1 — De dominante energie vinden</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Kijk welke suit het meest voorkomt:</strong></p>
            <ul className="space-y-1 ml-3">
              <li>🔥 Veel Staven → De lezing gaat over actie, ambitie en energie. Iemand staat aan het begin van iets nieuws, of er is veel beweging.</li>
              <li>💧 Veel Kelken → Emoties staan centraal: liefde, verdriet, relaties, dromen. De vraagsteller voelt intens.</li>
              <li>💨 Veel Zwaarden → Conflict, beslissingen of mentale stress. Er is spanning in het denken of communiceren.</li>
              <li>🌍 Veel Pentakels → Praktische, materiële zaken: werk, geld, gezondheid. Aandacht voor het tastbare.</li>
            </ul>
            <p className="mt-2"><strong>Veel Grote Arcana?</strong> De situatie heeft een dieper, levensveranderend karakter. Weinig Grote Arcana = de situatie is dagdagelijks en oplosbaar.</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-3">Stap 2 — Getallen en patronen</h4>
          <div className="space-y-2 text-sm">
            <p>Als meerdere kaarten hetzelfde getal hebben, versterkt dat de betekenis:</p>
            <ul className="space-y-1 ml-3">
              <li><strong>Meerdere Aasen</strong> → Krachtig nieuw begin, meerdere deuren openen tegelijk</li>
              <li><strong>Meerdere Drieën</strong> → Groei en uitbreiding in meerdere levensdomeinen</li>
              <li><strong>Meerdere Vijven</strong> → Turbulentie, conflict of uitdaging op meerdere fronten</li>
              <li><strong>Meerdere Tienen</strong> → Afsluiting van meerdere cycli, tijd om los te laten</li>
              <li><strong>Meerdere Hoven</strong> (Schildknaap/Ridder/Koningin/Koning) → Mensen of persoonlijkheidsaspecten spelen een grote rol</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-bold text-green-800 mb-3">Stap 3 — Energieën die samenwerken</h4>
          <div className="space-y-2 text-sm">
            <p>Sommige combinaties versterken elkaar en vertellen een duidelijk verhaal:</p>
            <div className="space-y-2 mt-2">
              {[
                ['De Ster + De Zon', 'Grote hoop, optimisme en doorbraak na een moeilijke periode. Dingen vallen eindelijk op hun plek.'],
                ['De Magiër + Aas van Staven', 'De kracht én het gereedschap om iets nieuws te creëren. Dit is het moment om te beginnen.'],
                ['De Maan + Kelken Vijf', 'Diepe verwarring en verdriet. Onverwerkt verlies belemmert het zicht op wat er nog is.'],
                ['De Dood + De Ster', 'Transformatie gevolgd door hoop. Iets eindigt zodat iets beters kan beginnen.'],
                ['De Toren + De Wereld', 'Een abrupte ineenstorting die uiteindelijk leidt tot voltooiing en bevrijding.'],
                ['Koningin van Kelken + Twee van Kelken', 'Een emotioneel rijpe verbinding, of de roep om je hart open te stellen in een relatie.'],
              ].map(([combo, uitleg]) => (
                <div key={combo} className="bg-white rounded p-3 border border-green-100">
                  <p className="font-semibold text-green-800 text-xs">{combo}</p>
                  <p className="text-gray-600 mt-0.5">{uitleg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-bold text-orange-800 mb-3">Stap 4 — Spanningsvelden</h4>
          <div className="space-y-2 text-sm">
            <p>Tegengestelde kaarten duiden op conflict of een keuze die gemaakt moet worden:</p>
            <div className="space-y-2 mt-2">
              {[
                ['De Duivel + De Gehangene', 'Gebonden zijn én bewust overgave — er is iets wat je vasthoudt, maar ook de kans om het anders te zien.'],
                ['Gerechtigheid + De Maan', 'Spanning tussen rationele waarheid en irrationele angsten of illusies.'],
                ['Ridder van Zwaarden + Vier van Kelken', 'Enerzijds drang tot actie, anderzijds apathie of navel­staren. Iemand aarzelt terwijl actie vereist is.'],
              ].map(([combo, uitleg]) => (
                <div key={combo} className="bg-white rounded p-3 border border-orange-100">
                  <p className="font-semibold text-orange-800 text-xs">{combo}</p>
                  <p className="text-gray-600 mt-0.5">{uitleg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
          <strong>Gouden tip:</strong> Lees eerst élke kaart apart. Vat dan samen: "Wat is het overkoepelende verhaal?" Zoek de rode draad, niet de som van losse betekenissen. De kaarten voeren een gesprek — jij bent de vertaler.
        </div>
      </div>
    )
  },

  // ─── LEGGINGEN ───────────────────────────────────────────────────────────
  {
    id: 'dagkaart',
    title: 'De Dagkaart — uitgelegd',
    level: 'beginner',
    category: 'leggingen',
    content: (
      <div className="space-y-4 text-gray-700">
        <p className="leading-relaxed">De dagkaart is de eenvoudigste maar misschien wel krachtigste oefening in tarot. Elke ochtend één kaart trekken verbindt je aan jezelf én aan de energie van de dag.</p>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-2">Waarvoor dient de dagkaart?</h4>
          <ul className="text-sm space-y-1.5 list-disc list-inside text-gray-700">
            <li>Een focuspunt voor de dag — wat verdient mijn aandacht?</li>
            <li>Zelfreflectie — wat leeft er in mij op dit moment?</li>
            <li>Oefening in interpretatie — één kaart per dag verdiept je kennis snel</li>
            <li>Patronen ontdekken — over een week zie je welke thema's terugkomen</li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-bold text-purple-800 mb-2">Hoe doe je het — ochtend</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
            <li>Neem een rustig moment (voor je telefoon pakt, voor de drukte begint)</li>
            <li>Houd de kaarten even vast, adem in. Stel innerlijk een vraag: <em>"Wat is vandaag belangrijk voor mij?"</em> of <em>"Welke energie kan ik vandaag inzetten?"</em></li>
            <li>Trek één kaart. Kijk eerst naar het beeld — wat valt op?</li>
            <li>Schrijf in 2 zinnen op wat de kaart jou op dit moment zegt.</li>
          </ol>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-bold text-green-800 mb-2">Avond — reflectie</h4>
          <p className="text-sm text-gray-700">Kijk 's avonds terug: <em>"Hoe heeft de energie van deze kaart zich vandaag gemanifesteerd?"</em> Dit hoeft niet letterlijk te zijn — de Kelken Twee was niet per se een ontmoeting met iemand, maar misschien had je een gesprek vol verbinding. Die koppeling maakt je een betere lezer.</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800 mb-2">Voorbeeldinterpretaties</h4>
          <div className="space-y-2 text-sm">
            {[
              ['De Kracht', 'Vandaag vraagt om zachte kracht. Forceer niets — benader uitdagingen met geduld en zelfvertrouwen in plaats van dwang.'],
              ['Zwaarden Drie (omgekeerd)', 'Oud verdriet komt misschien naar boven. Geef het ruimte, maar laat het je dag niet overnemen.'],
              ['Aas van Pentakels', 'Er is een kans in het praktische domein — werk, geld of gezondheid. Houd je ogen open voor een concrete mogelijkheid.'],
              ['De Maan', 'Dingen zijn misschien niet wat ze lijken. Vertrouw vandaag meer op gevoel dan op logica alleen.'],
            ].map(([kaart, uitleg]) => (
              <div key={kaart} className="bg-white rounded p-3 border border-yellow-100">
                <p className="font-semibold text-yellow-800">{kaart}</p>
                <p className="text-gray-600 mt-0.5">{uitleg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'drie-kaarten',
    title: 'De Drie-Kaarten Legging — uitgelegd',
    level: 'beginner',
    category: 'leggingen',
    content: (
      <div className="space-y-4 text-gray-700">
        <p className="leading-relaxed">De drie-kaarten legging is de meest veelzijdige en gebruikte legging. Drie kaarten, één verhaal. De posities kun je aanpassen aan je vraag — hieronder de meestgebruikte varianten.</p>

        <div className="bg-purple-50 rounded-lg p-5">
          <h4 className="font-bold text-purple-800 mb-3">Variant 1 — Verleden · Heden · Toekomst</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { pos: '1', naam: 'Verleden', uitleg: 'Wat heeft geleid tot de huidige situatie? Welke ervaringen, beslissingen of patronen zijn relevant?' },
              { pos: '2', naam: 'Heden', uitleg: 'Waar sta je nu? Dit is de kern van de situatie — de energie die actief is op dit moment.' },
              { pos: '3', naam: 'Toekomst', uitleg: 'Waar leidt dit naartoe als de huidige energie voortduurt? Geen vaste bestemming, maar een waarschijnlijke richting.' },
            ].map(({ pos, naam, uitleg }) => (
              <div key={pos} className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-1">{pos}</div>
                <p className="font-semibold text-purple-800 text-sm">{naam}</p>
                <p className="text-xs text-gray-500 mt-1 text-left">{uitleg}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600"><strong>Hoe lees je het:</strong> Begin bij kaart 1 (het verhaal begint hier), ga naar kaart 2 (wat speelt er nu), en kaart 3 laat zien waar het naartoe gaat. Zoek de <em>rode draad</em> — het thema dat alle drie kaarten verbindt.</p>
        </div>

        <div className="bg-green-50 rounded-lg p-5">
          <h4 className="font-bold text-green-800 mb-3">Variant 2 — Situatie · Actie · Uitkomst</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { pos: '1', naam: 'Situatie', uitleg: 'Wat is de aard van het vraagstuk? De kaart beschrijft de context en de huidige staat van zaken.' },
              { pos: '2', naam: 'Actie', uitleg: 'Wat kun je doen? Welke stap of houding helpt je vooruit? Dit is praktisch advies.' },
              { pos: '3', naam: 'Uitkomst', uitleg: 'Wat is het resultaat als je de actie onderneemt? Let op: dit is geen garantie, maar een richting.' },
            ].map(({ pos, naam, uitleg }) => (
              <div key={pos} className="bg-white rounded-lg p-3 border border-green-100 text-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-1">{pos}</div>
                <p className="font-semibold text-green-800 text-sm">{naam}</p>
                <p className="text-xs text-gray-500 mt-1 text-left">{uitleg}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">Goed voor concrete vraagstukken: "Hoe ga ik om met...?" of "Wat doe ik met...?"</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-5">
          <h4 className="font-bold text-indigo-800 mb-3">Variant 3 — Geest · Hart · Lichaam</h4>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { pos: '1', naam: 'Geest', uitleg: 'Wat denk je over de situatie? Welke overtuigingen of gedachten spelen een rol?' },
              { pos: '2', naam: 'Hart', uitleg: 'Wat voel je? Welke emoties of verlangens zijn aanwezig, ook de onuitgesproken?' },
              { pos: '3', naam: 'Lichaam', uitleg: 'Hoe uit dit zich in je dagelijkse leven, je gedrag of je fysieke welzijn?' },
            ].map(({ pos, naam, uitleg }) => (
              <div key={pos} className="bg-white rounded-lg p-3 border border-indigo-100 text-center">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-1">{pos}</div>
                <p className="font-semibold text-indigo-800 text-sm">{naam}</p>
                <p className="text-xs text-gray-500 mt-1 text-left">{uitleg}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">Goed voor zelfreflectie en het begrijpen van hoe een situatie je als geheel beïnvloedt.</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800 mb-2">Andere varianten</h4>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[
              ['Ik · Jij · Wij', 'Voor relatievragen — de energie van jezelf, de ander, en de relatie zelf'],
              ['Kracht · Uitdaging · Advies', 'Wat heb ik, wat staat me in de weg, wat moet ik weten?'],
              ['Wat laat ik los · Wat hou ik vast · Wat omarm ik', 'Voor overgangsmomenten, jaareinde, nieuwe fase'],
              ['Oorzaak · Gevoel · Les', 'Begrijpen waarom iets pijn doet en wat het je leert'],
            ].map(([naam, uitleg]) => (
              <div key={naam} className="bg-white rounded p-2 border border-yellow-100">
                <p className="font-semibold text-yellow-800 text-xs">{naam}</p>
                <p className="text-gray-500">{uitleg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'relatie-legging',
    title: 'De Relatie Legging — uitgelegd',
    level: 'beginner',
    category: 'leggingen',
    content: (
      <div className="space-y-4 text-gray-700">
        <p className="leading-relaxed">De relatie legging geeft inzicht in de dynamiek tussen twee mensen: een romantische partner, een vriend, een familielid of een collega. Vijf kaarten belichten elk een aspect van de verbinding.</p>

        <div className="bg-pink-50 rounded-lg p-5">
          <h4 className="font-bold text-pink-800 mb-4">De vijf posities</h4>
          <div className="space-y-3">
            {[
              { nr: '1', naam: 'Jouw energie', uitleg: 'Hoe kom jij de relatie in? Welke stemming, houding of verwachting breng jij mee? Dit is niet wie jij bent, maar wie je op dit moment bent in deze relatie.' },
              { nr: '2', naam: "De ander's energie", uitleg: "Wat brengt de ander mee? Let op: dit is jouw perceptie van de ander, niet per se de objectieve waarheid. Interessant om te zien of je echt ziet wat er is, of wat je wilt zien." },
              { nr: '3', naam: 'De verbinding', uitleg: 'Wat is de kern van de relatie? Welk thema of welke energie kenmerkt de band tussen jullie? Dit kan iets moois zijn (wederzijds begrip) of een terugkerend patroon (conflict, afhankelijkheid).' },
              { nr: '4', naam: 'De uitdaging', uitleg: 'Wat is de grootste hindernis of het grootste groeipunt in deze relatie? Niet per se negatief — een uitdaging kan ook de aanzet zijn tot verdieping.' },
              { nr: '5', naam: 'Het potentieel', uitleg: 'Waar kan de relatie naartoe groeien als beide partijen bewust met de uitdagingen omgaan? Dit is de beste uitkomst, niet de garantie.' },
            ].map(({ nr, naam, uitleg }) => (
              <div key={nr} className="flex gap-3 bg-white rounded-lg p-3 border border-pink-100">
                <div className="w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{nr}</div>
                <div>
                  <p className="font-semibold text-pink-800">{naam}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{uitleg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
          <strong>Leestip:</strong> Begin met kaarten 1 en 2 apart. Welke energie brengt elke persoon mee? Dan kaart 3 — is de verbinding in balans met wat beiden meebrengen? Kaart 4 laat zien waar spanning zit, en kaart 5 geeft perspectief. Lees het als een gesprek, niet als een rapport.
        </div>
      </div>
    )
  },
  {
    id: 'carriere-legging',
    title: 'De Carrière Legging — uitgelegd',
    level: 'beginner',
    category: 'leggingen',
    content: (
      <div className="space-y-4 text-gray-700">
        <p className="leading-relaxed">De carrière legging geeft richting bij werkvragen: loopbaankeuzes, nieuwe projecten, werksfeer of professionele ontwikkeling. Vier kaarten geven een helder beeld.</p>

        <div className="bg-amber-50 rounded-lg p-5">
          <h4 className="font-bold text-amber-800 mb-4">De vier posities</h4>
          <div className="space-y-3">
            {[
              { nr: '1', naam: 'Huidige positie', uitleg: 'Waar sta je nu in je werk of carrière? Dit is een eerlijk beeld van de situatie zoals die op dit moment is — niet zoals je die wenst of vreest.' },
              { nr: '2', naam: 'Uitdagingen', uitleg: 'Wat staat je in de weg? Wat zijn de obstakels — van buitenaf (omstandigheden, mensen) of van binnenuit (twijfel, angst, patronen)?' },
              { nr: '3', naam: 'Kansen', uitleg: 'Welke mogelijkheden zijn er? Wat zie je misschien over het hoofd? Deze kaart vraagt je de blik te verbreden naar wat er wél aanwezig is.' },
              { nr: '4', naam: 'Beste pad vooruit', uitleg: 'Wat is de meest vruchtbare richting of aanpak? Dit is advies — welke energie of actie past het beste bij dit moment in je carrière?' },
            ].map(({ nr, naam, uitleg }) => (
              <div key={nr} className="flex gap-3 bg-white rounded-lg p-3 border border-amber-100">
                <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{nr}</div>
                <div>
                  <p className="font-semibold text-amber-800">{naam}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{uitleg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <h4 className="font-bold text-amber-800 mb-2">Welke kaarten zijn betekenisvol in een carrière-legging?</h4>
          <div className="space-y-1.5 text-sm">
            {[
              ['Pentakels in het algemeen', 'Goed teken — praktische energie, concrete resultaten, financiële stabiliteit'],
              ['Staven in het algemeen', 'Passie en ambitie zijn aanwezig — of er is te veel vuur zonder richting'],
              ['De Magiër', 'Je hebt alle middelen die je nodig hebt — gebruik ze'],
              ['De Kracht', 'Vertrouw op je eigen capaciteiten; leid met zachte kracht'],
              ['De Toren', 'Iets in je werksituatie staat op instorten — of dat is nu juist nodig voor vernieuwing'],
              ['Zwaarden Tien', 'Een situatie heeft zijn einde bereikt; het is tijd om verder te gaan'],
            ].map(([kaart, uitleg]) => (
              <div key={kaart} className="flex gap-2">
                <span className="text-amber-500 shrink-0">▸</span>
                <span><strong>{kaart}:</strong> {uitleg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'keltisch-kruis',
    title: 'Het Keltisch Kruis — 10 posities uitgelegd',
    level: 'gevorderd',
    category: 'leggingen',
    content: (
      <div className="space-y-4 text-gray-700">
        <p className="leading-relaxed">Het Keltisch Kruis is de meest gebruikte diepgaande legging. Tien kaarten belichten de situatie vanuit meerdere hoeken: innerlijk en uiterlijk, verleden en toekomst, bewust en onbewust. Het is een volledig beeld van een vraagstuk.</p>

        <div className="bg-purple-50 rounded-lg p-4 text-sm">
          <p className="font-semibold text-purple-800 mb-1">Leesformule</p>
          <p>Lees het Keltisch Kruis in twee blokken: eerst het <strong>innerlijk kruis</strong> (posities 1–6) dat de situatie beschrijft, dan de <strong>staf</strong> (posities 7–10) die de weg vooruit laat zien.</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">Het innerlijk kruis</h4>
          {[
            { nr: '1', naam: 'Huidige situatie (de kern)', kleur: 'purple', uitleg: 'De centrale kaart. Dit is de essentie van de vraag of de situatie op dit moment. Alles draait hieromheen.' },
            { nr: '2', naam: 'De kruising (uitdaging)', kleur: 'indigo', uitleg: 'Dwars over de eerste kaart gelegd. Dit is wat de situatie compliceert, blokkeert of juist in beweging zet. Let op: dit kan ook iets positiefs zijn dat teveel invloed heeft.' },
            { nr: '3', naam: 'Verleden (wat eraan voorafging)', kleur: 'blue', uitleg: 'Wat heeft geleid tot de huidige situatie? Een recente ervaring, beslissing of patroon dat relevant is.' },
            { nr: '4', naam: 'Nabije toekomst (wat eraan komt)', kleur: 'cyan', uitleg: 'Wat staat er korte termijn te gebeuren als er niets verandert? Dit is een richting, geen absolute voorspelling.' },
            { nr: '5', naam: 'Bewuste invloeden', kleur: 'teal', uitleg: 'Wat weet je, denk je of geloof je over de situatie? Dit zijn de gedachten, doelen of verwachtingen die je bewust hebt.' },
            { nr: '6', naam: 'Onbewuste invloeden', kleur: 'green', uitleg: 'Wat beïnvloedt de situatie zonder dat je het volledig beseft? Verborgen angsten, onbewuste verlangens, of een patroon dat je nog niet ziet.' },
          ].map(({ nr, naam, kleur, uitleg }) => (
            <div key={nr} className={`flex gap-3 bg-${kleur}-50 rounded-lg p-3 border border-${kleur}-100`}>
              <div className={`w-7 h-7 bg-${kleur}-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0`}>{nr}</div>
              <div>
                <p className={`font-semibold text-${kleur}-800`}>{naam}</p>
                <p className="text-sm text-gray-600 mt-0.5">{uitleg}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-gray-800">De staf (rechterkolom)</h4>
          {[
            { nr: '7', naam: 'Jouw houding', kleur: 'yellow', uitleg: 'Hoe sta jij in deze situatie? Welke energie of houding breng je mee — bewust of onbewust? Soms confronterend: je dénkt open te zijn, maar de kaart laat iets anders zien.' },
            { nr: '8', naam: 'Externe invloeden', kleur: 'orange', uitleg: 'Welke invloed hebben anderen of de omgeving? Dit zijn de mensen, omstandigheden of systemen die van buitenaf op je situatie inwerken.' },
            { nr: '9', naam: 'Hoop en vrees', kleur: 'red', uitleg: 'De dubbele kaart — wat hoop je te bereiken én wat vrees je dat er zal gebeuren? Soms is het antwoord hetzelfde: je hoopt én vreest hetzelfde tegelijk. Dat is een krachtige boodschap.' },
            { nr: '10', naam: 'Uiteindelijke uitkomst', kleur: 'purple', uitleg: 'De conclusie van de legging. Waar leidt dit naartoe als alle energie en invloeden in aanmerking worden genomen? Lees deze kaart altijd in relatie tot de andere negen — ze is niet op zichzelf te begrijpen.' },
          ].map(({ nr, naam, kleur, uitleg }) => (
            <div key={nr} className={`flex gap-3 bg-${kleur}-50 rounded-lg p-3 border border-${kleur}-100`}>
              <div className={`w-7 h-7 bg-${kleur}-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0`}>{nr}</div>
              <div>
                <p className={`font-semibold text-${kleur}-800`}>{naam}</p>
                <p className="text-sm text-gray-600 mt-0.5">{uitleg}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
          <strong>Leestip:</strong> Na het leggen, zoek verbanden: Is er overeenstemming tussen positie 5 (bewust) en positie 6 (onbewust)? Wijkt positie 7 (jouw houding) af van wat positie 8 (de buitenwereld) zegt? Vertel het verhaal van de legging van begin tot eind, alsof je het aan iemand anders uitlegt.
        </div>
      </div>
    )
  },

  // ─── GEVORDERD ────────────────────────────────────────────────────────────
  {
    id: 'numerologie',
    title: 'Numerologie in tarot',
    level: 'gevorderd',
    category: 'gevorderd',
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Elk getal in de Kleine Arcana draagt een universele betekenis:</p>
        <div className="space-y-2 text-sm">
          {[
            ['Aas (1)', 'Begin, potentie, zuivere energie van de suit'],
            ['2', 'Balans, keuze, samenwerking, dualiteit'],
            ['3', 'Groei, creativiteit, eerste resultaten'],
            ['4', 'Stabiliteit, fundament, consolidatie'],
            ['5', 'Conflict, verandering, uitdaging'],
            ['6', 'Harmonie, terugkeer na conflict, delen'],
            ['7', 'Reflectie, spiritualiteit, overdenking'],
            ['8', 'Beweging, kracht, actie, verandering'],
            ['9', 'Voltooiing nadert, hoogtepunt, bezinning'],
            ['10', 'Afsluiting van cyclus, overvloed of overbelasting'],
            ['Schildknaap', 'Nieuweling, boodschapper, lerende energie'],
            ['Ridder', 'Actie, beweging, het principe in volle gang'],
            ['Koningin', 'Innerlijke kracht, gevoel, meesterschap'],
            ['Koning', 'Meesterschap, leiderschap, uiterlijke kracht'],
          ].map(([nr, uitleg]) => (
            <div key={nr} className="flex gap-3 py-1.5 border-b border-gray-100">
              <span className="font-semibold text-purple-700 w-28 shrink-0">{nr}</span>
              <span className="text-gray-600">{uitleg}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'symboliek',
    title: 'Symboliek in de Rider-Waite kaarten',
    level: 'gevorderd',
    category: 'gevorderd',
    content: (
      <div className="space-y-3 text-gray-700 text-sm">
        <p className="text-base">De RWS kaarten staan vol bewuste symboliek. Hier zijn de meest voorkomende elementen:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            ['🔴 Rood', 'Passie, actie, energie, gevaar'],
            ['🔵 Blauw', 'Emotie, intuïtie, kalmte, waarheid'],
            ['🟡 Geel', 'Intellect, bewustzijn, optimisme, de zon'],
            ['🟢 Groen', 'Groei, natuur, hoop, vruchtbaarheid'],
            ['⚪ Wit', 'Zuiverheid, onschuld, nieuw begin'],
            ['🏔 Bergen', 'Uitdagingen, hoogtepunten, aspiratie'],
            ['🌊 Water', 'Onderbewuste, emoties, het onbekende'],
            ['☀ Zon', 'Bewustzijn, succes, vitaliteit'],
            ['🌙 Maan', 'Onderbewuste, cyclus, illusie'],
            ['⭐ Sterren', 'Hoop, goddelijke gids, inspiratie'],
            ['🌹 Rode roos', 'Passie, verlangens, het hart'],
            ['🌸 Witte lelie', 'Zuiverheid, onschuld, spiritualiteit'],
          ].map(([sym, uitleg]) => (
            <div key={sym} className="flex gap-2 bg-gray-50 rounded p-2">
              <span className="w-28 shrink-0 font-medium">{sym}</span>
              <span className="text-gray-500">{uitleg}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
];

const CATEGORIES = [
  { value: 'all', label: 'Alles' },
  { value: 'basis', label: 'Basis' },
  { value: 'interpretatie', label: 'Interpretatie' },
  { value: 'leggingen', label: 'Leggingen' },
  { value: 'gevorderd', label: 'Gevorderd' },
] as const;

export const LessenPage: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [category, setCategory] = useState<'all' | 'basis' | 'interpretatie' | 'leggingen' | 'gevorderd'>('all');
  const [level, setLevel] = useState<'all' | 'beginner' | 'gevorderd'>('all');

  const filtered = lessons.filter(l =>
    (category === 'all' || l.category === category) &&
    (level === 'all' || l.level === level)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Lessen</h1>
          <p className="text-purple-200">Gestructureerde uitleg — van kaart lezen tot complexe leggingen</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === value ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-purple-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {([['all', 'Alle niveaus'], ['beginner', 'Beginner'], ['gevorderd', 'Gevorderd']] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setLevel(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  level === v ? 'bg-gray-700 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(lesson => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === lesson.id ? null : lesson.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    lesson.level === 'beginner' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {lesson.level}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">
                    {lesson.category}
                  </span>
                  <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                </div>
                {open === lesson.id
                  ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
                  : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 ml-2" />}
              </button>
              {open === lesson.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">{lesson.content}</div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-12">Geen lessen gevonden voor deze selectie.</p>
          )}
        </div>
      </div>
    </div>
  );
};
