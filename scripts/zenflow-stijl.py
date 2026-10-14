#!/usr/bin/env python3
"""Zet de leeromgeving om naar de Zen Flow-stijl (zen-flow.nl), in fasen.

  python3 scripts/zenflow-stijl.py fase1|fase2|fase3|fase4 [--toepassen]

Fase 1: lettertypen overal (Cinzel → Cormorant Garamond, Crimson Pro → DM Sans) en de kleuren
in bestanden die al een donker thema hebben (bruin/goud → nachtblauw/paars/goud).
Lichte (crème) en Tailwind-pagina's volgen in fase 2 en 3, want daar hebben dezelfde kleurcodes
een andere rol (tekst i.p.v. achtergrond). Zonder --toepassen: alleen tellen (proefrun).
Zen Flow-kleuren: zie /home/ubuntu/zen-flow-voorpagina/bron/documentatie/STIJLGIDS.md
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
BESTANDEN = [p for p in (ROOT / 'src').rglob('*') if p.suffix in ('.tsx', '.ts', '.css')]

# Bruin/goud (Mystieke Kaarten) → Zen Flow, voor bestanden met een donker thema
DONKER = {
    '#1A1209': '#0D0C22', '#1A1208': '#0D0C22',   # pagina-achtergrond → middernacht
    '#2C2416': '#20162F',                         # paneel
    '#3A2E1C': '#2D2040',                         # lichter paneel
    '#B8860B': '#F1CB78', '#D4AF37': '#F1CB78',   # goud
    '#D4A537': '#FFC653',                         # licht goud
    '#F5EDD8': '#FFF3DF',                         # hoofdtekst
    '#D4CFC0': '#E0D5E9',                         # tweede tekst
    '#A89060': '#B9A9CC', '#9C8A6A': '#A99BC0',   # gedempte tekst
    '#7A6A4A': '#8E7FA8', '#6B5C3E': '#8E7FA8',
    '#7A5C00': '#E0B04A', '#C9A080': '#D9B48A',
}
RGBA = {(184, 134, 11): (241, 203, 120), (212, 175, 55): (241, 203, 120), (245, 237, 216): (255, 243, 223)}
LICHT = re.compile(r'#(FDFAF4|F5F0E8|EDE6D6)\b|pendel-pagina', re.I)
DONKER_TEKEN = re.compile(r'#(1A1209|1A1208|3A2E1C)\b', re.I)
# Met de hand omgezet (worden zowel op scherm als op papier gebruikt)
HANDMATIG = {'src/pages/academie/AcademiePrint.tsx', 'src/components/Markdown.tsx'}

def lettertypen(s):
    s = re.sub(r"'Crimson Pro',\s*Georgia,\s*serif", "'DM Sans', sans-serif", s)
    s = s.replace("'Crimson Pro'", "'DM Sans'").replace('Crimson Pro', 'DM Sans')
    s = s.replace("'Cinzel, serif'", "\"'Cormorant Garamond', Georgia, serif\"")  # JS-string tussen enkele quotes
    s = s.replace("'Cinzel'", "'Cormorant Garamond'").replace('Cinzel, serif', "'Cormorant Garamond', Georgia, serif")
    s = re.sub(r'\bCinzel\b', "'Cormorant Garamond'", s)
    return s

def kleuren(s):
    for oud, nieuw in DONKER.items():
        s = re.sub(re.escape(oud) + r'\b', nieuw, s, flags=re.I)
    for (r, g, b), (r2, g2, b2) in RGBA.items():
        s = re.sub(rf'rgba\(\s*{r}\s*,\s*{g}\s*,\s*{b}\s*,', f'rgba({r2},{g2},{b2},', s)
    return s

# Lichte (crème) pagina's → donker. Hier is donkerbruin tekst en crème achtergrond, dus een eigen tabel.
LICHT_NAAR_DONKER = {
    '#FDFAF4': '#0D0C22', '#F5F0E8': '#20162F', '#EDE6D6': '#2D2040',   # achtergronden
    '#2C2416': '#FFF3DF', '#6B5C3E': '#E0D5E9', '#9C8A6A': '#B9A9CC',   # tekst
    '#B8860B': '#F1CB78', '#7A5C00': '#E0B04A', '#D4A84B': '#FFC653', '#D4AF37': '#F1CB78',
    '#F5EDD8': '#2D2040',                                               # goudBleek = licht accentvlak → paars vlak
    '#C9A080': '#D9B48A',
    # goed/fout/let op: lichte vlakken → tinten op donker
    '#F0FDF4': 'rgba(95,167,119,0.15)', '#86EFAC': 'rgba(155,212,155,0.5)', '#15803D': '#9BD49B', '#16A34A': '#7BC98F',
    '#DC2626': '#F0A596', '#B91C1C': '#F0A596', '#FEF2F2': 'rgba(200,96,79,0.15)', '#FCA5A5': 'rgba(240,165,150,0.5)',
    '#FFF7ED': 'rgba(224,176,74,0.12)', '#FDBA74': 'rgba(224,176,74,0.5)', '#C2410C': '#F2B27A',
}
LICHT_RGBA = [
    (r'rgba\(\s*184\s*,\s*134\s*,\s*11\s*,\s*0?\.20\s*\)', 'rgba(239,180,255,0.22)'),   # rand → paars
    (r'rgba\(\s*184\s*,\s*134\s*,\s*11\s*,\s*0?\.35\s*\)', 'rgba(239,180,255,0.38)'),   # rand2 → paars
    (r'rgba\(\s*184\s*,\s*134\s*,\s*11\s*,', 'rgba(241,203,120,'),                     # overige goudtinten
    (r'rgba\(\s*44\s*,\s*36\s*,\s*22\s*,\s*0?\.72\s*\)', 'rgba(8,4,21,0.8)'),          # achtergrond van een venster
    (r'rgba\(\s*44\s*,\s*36\s*,\s*22\s*,', 'rgba(0,0,0,'),                             # schaduwen
]

def fase2(toepassen):
    n = 0
    for p in BESTANDEN:
        s0 = p.read_text()
        if not LICHT.search(s0) or str(p.relative_to(ROOT)) in HANDMATIG: continue
        s = lettertypen(s0)
        for oud, nieuw in LICHT_NAAR_DONKER.items():
            s = re.sub(re.escape(oud) + r'\b', nieuw, s, flags=re.I)
        for pat, nieuw in LICHT_RGBA:
            s = re.sub(pat, nieuw, s)
        # tekst op een gouden knop moet donker zijn (was wit op donkergoud)
        s = re.sub(r"(background: G\.goud, color: )'(#fff|#FFF|white)'", r"\1'#1C0D06'", s)
        if s != s0:
            n += 1; print('kleur', p.relative_to(ROOT))
            if toepassen: p.write_text(s)
    print({'fase2_bestanden': n}, '(toegepast)' if toepassen else '(proefrun)')

# Tailwind-pagina's (wit/paars) → Zen Flow. Klasse voor klasse; varianten (hover:, focus:, md: …) blijven behouden.
TW = {
    # vlakken
    'bg-white': 'bg-[#20162F]', 'bg-gray-50': 'bg-[#17112C]', 'bg-gray-100': 'bg-[#2D2040]', 'bg-gray-200': 'bg-[#3A2A52]',
    'bg-purple-50': 'bg-[#2D2040]', 'bg-purple-100': 'bg-[#3A2A52]', 'bg-purple-200': 'bg-[#482254]',
    'bg-purple-400': 'bg-[#B67AC9]', 'bg-purple-500': 'bg-[#F1CB78]', 'bg-purple-600': 'bg-[#F1CB78]', 'bg-purple-700': 'bg-[#FFC653]', 'bg-purple-800': 'bg-[#FFC653]',
    'bg-indigo-50': 'bg-[rgba(122,155,219,0.14)]', 'bg-blue-50': 'bg-[rgba(122,155,219,0.14)]',
    'bg-green-50': 'bg-[rgba(95,167,119,0.15)]', 'bg-green-100': 'bg-[rgba(95,167,119,0.22)]',
    'bg-red-50': 'bg-[rgba(200,96,79,0.15)]', 'bg-red-100': 'bg-[rgba(200,96,79,0.22)]',
    'bg-yellow-50': 'bg-[rgba(224,176,74,0.12)]', 'bg-amber-50': 'bg-[rgba(224,176,74,0.12)]', 'bg-orange-50': 'bg-[rgba(224,176,74,0.12)]', 'bg-orange-100': 'bg-[rgba(224,176,74,0.2)]',
    # verlopen
    'from-purple-50': 'from-[#20162F]', 'to-indigo-50': 'to-[#2D2040]', 'to-white': 'to-[#0D0C22]', 'from-white': 'from-[#0D0C22]',
    'from-purple-500': 'from-[#2D2040]', 'from-purple-600': 'from-[#2D2040]', 'from-purple-700': 'from-[#20162F]', 'from-purple-900': 'from-[#0D0C22]',
    'to-purple-700': 'to-[#20162F]', 'to-purple-800': 'to-[#17112C]', 'to-purple-900': 'to-[#0D0C22]',
    # tekst
    'text-gray-900': 'text-[#FFF3DF]', 'text-gray-800': 'text-[#FFF3DF]', 'text-gray-700': 'text-[#E0D5E9]', 'text-gray-600': 'text-[#CFC2DC]',
    'text-gray-500': 'text-[#B9A9CC]', 'text-gray-400': 'text-[#9A8CB3]',
    'text-purple-900': 'text-[#F1CB78]', 'text-purple-800': 'text-[#F1CB78]', 'text-purple-700': 'text-[#F1CB78]', 'text-purple-600': 'text-[#F1CB78]', 'text-purple-500': 'text-[#F1CB78]',
    'text-purple-200': 'text-[#E0D5E9]',
    'text-green-800': 'text-[#9BD49B]', 'text-green-700': 'text-[#9BD49B]', 'text-green-600': 'text-[#9BD49B]', 'text-green-500': 'text-[#9BD49B]',
    'text-red-800': 'text-[#F0A596]', 'text-red-700': 'text-[#F0A596]', 'text-red-600': 'text-[#F0A596]',
    'text-yellow-800': 'text-[#F2C27A]', 'text-amber-800': 'text-[#F2C27A]', 'text-orange-800': 'text-[#F2C27A]', 'text-orange-700': 'text-[#F2C27A]', 'text-orange-600': 'text-[#F2C27A]', 'text-orange-500': 'text-[#F2C27A]',
    'text-blue-800': 'text-[#AFC3EE]', 'text-indigo-800': 'text-[#AFC3EE]', 'text-pink-800': 'text-[#F3B6D9]',
    # randen en focus
    'border-gray-100': 'border-[rgba(194,146,189,0.25)]', 'border-gray-200': 'border-[rgba(194,146,189,0.3)]', 'border-gray-300': 'border-[rgba(194,146,189,0.45)]',
    'border-purple-100': 'border-[rgba(194,146,189,0.3)]', 'border-purple-200': 'border-[rgba(194,146,189,0.4)]', 'border-purple-400': 'border-[#EFB4FF]', 'border-purple-600': 'border-[#EFB4FF]',
    'border-yellow-100': 'border-[rgba(224,176,74,0.35)]', 'border-green-100': 'border-[rgba(155,212,155,0.35)]', 'border-red-400': 'border-[#F0A596]',
    'ring-purple-500': 'ring-[#F1CB78]', 'ring-purple-600': 'ring-[#F1CB78]',
}
TW_TEKEN = re.compile(r'\b(bg|text|border|from|to|ring)-(white|gray|purple|indigo|blue|green|red|yellow|amber|orange|pink)-?\d*\b')

def tw_klassen(s):
    for oud, nieuw in TW.items():
        s = re.sub(r'(?<=[\s"\'`:])' + re.escape(oud) + r'(?=[\s"\'`]|$)', nieuw, s)
    # tekst op een gouden knop moet donker zijn (was wit op paars)
    def knop(m):
        t = m.group(0)
        if 'bg-[#F1CB78]' in t or 'bg-[#FFC653]' in t:
            t = re.sub(r'(?<=[\s"\'`])text-white(?=[\s"\'`])', 'text-[#1C0D06]', t)
        return t
    return re.sub(r'"[^"\n]*"|\'[^\'\n]*\'|`[^`]*`', knop, s)

def fase3(toepassen):
    n = 0
    for p in BESTANDEN:
        if p.suffix != '.tsx': continue
        s0 = p.read_text()
        if not TW_TEKEN.search(s0) or str(p.relative_to(ROOT)) in HANDMATIG: continue
        s = tw_klassen(lettertypen(s0))
        if s != s0:
            n += 1; print('klassen', p.relative_to(ROOT))
            if toepassen: p.write_text(s)
    print({'fase3_bestanden': n}, '(toegepast)' if toepassen else '(proefrun)')

# Fase 4: Tailwind-onderdelen naar de gedeelde Zen Flow-bouwstenen (.zf-knop, .zf-knop-paars, .zf-kaart, .zf-veld, .zf-sectie)
WEG_KNOP = re.compile(r'^(bg-\S+|hover:bg-\S+|text-\[#1C0D06\]|text-\[#F1CB78\]|hover:text-\S+|text-white|py-\S+|px-\S+|p-\d+|rounded\S*|transition\S*|shadow\S*|font-\S+|border|border-\[#EFB4FF\]|text-(xs|sm|base|lg))$')
WEG_KAART = re.compile(r'^(rounded\S*|shadow\S*|hover:shadow\S*|transform|hover:-translate-y-\S+|transition-all|bg-\[#20162F\])$')
WEG_VELD = re.compile(r'^(p-\d+|px-\S+|py-\S+|border|border-\S+|rounded\S*|focus:\S+|bg-\S+|text-\S+)$')

def zf_klasse(t):
    """Werkt op de inhoud van één className-string (zonder aanhalingstekens)."""
    delen = t.split(' ')
    has = lambda x: x in delen
    knop_goud = has('bg-[#F1CB78]') and has('text-[#1C0D06]')
    knop_paars = has('border-[#EFB4FF]') and has('text-[#F1CB78]') and any(d.startswith(('py-', 'px-')) for d in delen)
    if knop_goud or knop_paars:
        rest = [d for d in delen if d and ('${' in d or not WEG_KNOP.match(d))]
        return ' '.join(['zf-knop' if knop_goud else 'zf-knop-paars'] + rest)
    if has('bg-[#20162F]') and any(d.startswith('rounded') for d in delen):
        klik = any(d.startswith(('hover:shadow', 'hover:-translate')) for d in delen)
        rest = [d for d in delen if d and ('${' in d or not WEG_KAART.match(d))]
        return ' '.join(['zf-kaart'] + (['zf-kaart-klik'] if klik else []) + rest)
    if any(d.startswith('focus:ring') for d in delen) and has('border') and not has('zf-knop'):
        rest = [d for d in delen if d and ('${' in d or not WEG_VELD.match(d))]
        return ' '.join(['zf-veld'] + rest)
    if any(d in ('text-xl', 'text-2xl') for d in delen) and has('text-[#F1CB78]') and any(d in ('font-bold', 'font-semibold') for d in delen):
        rest = [d for d in delen if d not in ('font-bold', 'font-semibold', 'text-[#F1CB78]', 'text-2xl')]
        return ' '.join(['zf-sectie' if has('text-2xl') else 'font-medium text-[#FFF3DF]'] + rest)
    return t

def fase4(toepassen):
    n = 0
    for p in BESTANDEN:
        if p.suffix != '.tsx': continue
        s0 = p.read_text()
        if 'bg-[#' not in s0 and 'border-[#EFB4FF]' not in s0: continue
        s = re.sub(r'className="([^"]*)"', lambda m: f'className="{zf_klasse(m.group(1))}"', s0)
        s = re.sub(r'className=\{`([^`]*)`\}', lambda m: 'className={`' + zf_klasse(m.group(1)) + '`}', s)
        s = s.replace('min-h-screen bg-[#2D2040]', 'zf-pagina').replace('min-h-screen bg-[#17112C]', 'zf-pagina')
        if s != s0:
            n += 1; print('bouwstenen', p.relative_to(ROOT))
            if toepassen: p.write_text(s)
    print({'fase4_bestanden': n}, '(toegepast)' if toepassen else '(proefrun)')

def fase1(toepassen):
    tot = {'lettertype': 0, 'kleur': 0}
    for p in BESTANDEN:
        s0 = p.read_text()
        s = lettertypen(s0)
        n_lt = s != s0
        donker = bool(DONKER_TEKEN.search(s)) and not LICHT.search(s) and str(p.relative_to(ROOT)) not in HANDMATIG
        s2 = kleuren(s) if donker else s
        if s2 != s0:
            tot['lettertype'] += n_lt; tot['kleur'] += (s2 != s)
            print(f"{'kleur+lt' if s2 != s else 'lettertype'}  {p.relative_to(ROOT)}")
            if toepassen: p.write_text(s2)
    print(tot, '(toegepast)' if toepassen else '(proefrun)')

if __name__ == '__main__':
    fasen = {'fase1': fase1, 'fase2': fase2, 'fase3': fase3, 'fase4': fase4}
    if len(sys.argv) < 2 or sys.argv[1] not in fasen: sys.exit(__doc__)
    fasen[sys.argv[1]]('--toepassen' in sys.argv)
