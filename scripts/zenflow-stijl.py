#!/usr/bin/env python3
"""Zet de leeromgeving om naar de Zen Flow-stijl (zen-flow.nl), in fasen.

  python3 scripts/zenflow-stijl.py fase1 [--toepassen]

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
    if len(sys.argv) < 2 or sys.argv[1] != 'fase1': sys.exit(__doc__)
    fase1('--toepassen' in sys.argv)
