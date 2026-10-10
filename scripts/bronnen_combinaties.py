#!/usr/bin/env python3
"""
Leest de opgehaalde combinatiepagina's (cache/bronnen/*.html) uit en zet per kaartpaar
wat de bronnen zeggen in cache/bronnen/paren.json:

  {"14-29": [{"bron": "online-orakels.nl", "url": "...", "kernwoorden": "...", "tekst": "..."}], ...}

Bronnen: online-orakels.nl (NL, 36 pagina's "lenormandkaart-combinaties-<kaart>") en
labyrinthos.co (EN, 36 pagina's "<card>-lenormand-card-meaning-and-combinations").
De teksten zijn alleen invoer voor de eigen synthese (scripts/combinaties-genereren.mjs);
ze worden niet letterlijk op het platform getoond.
"""
import glob, html, json, os, re

MAP = os.path.join(os.path.dirname(__file__), '..', 'cache', 'bronnen')

# Kaartnamen zoals de bronnen ze gebruiken → ons kaartnummer
NL = {
    'ruiter': 1, 'klaverbladen': 2, 'klaver': 2, 'schip': 3, 'huis': 4, 'boom': 5, 'wolken': 6, 'slang': 7,
    'lijkkist': 8, 'doodskist': 8, 'kist': 8, 'ruiker': 9, 'boeket': 9, 'zeis': 10, 'roede': 11, 'zweep': 11,
    'vogels': 12, 'kindje': 13, 'kind': 13, 'vos': 14, 'beer': 15, 'ster': 16, 'sterren': 16, 'ooievaar': 17,
    'hond': 18, 'toren': 19, 'tuin': 20, 'park': 20, 'berg': 21, 'weg': 22, 'kruispunt': 22, 'muizen': 23,
    'hart': 24, 'ring': 25, 'boek': 26, 'brief': 27, 'heer': 28, 'man': 28, 'dame': 29, 'vrouw': 29,
    'lelie': 30, 'lelies': 30, 'zon': 31, 'maan': 32, 'sleutel': 33, 'vissen': 34, 'vis': 34, 'anker': 35, 'kruis': 36,
}
EN = {
    'rider': 1, 'clover': 2, 'ship': 3, 'house': 4, 'tree': 5, 'clouds': 6, 'snake': 7, 'coffin': 8,
    'bouquet': 9, 'flowers': 9, 'scythe': 10, 'whip': 11, 'broom': 11, 'birds': 12, 'owls': 12, 'child': 13,
    'fox': 14, 'bear': 15, 'stars': 16, 'star': 16, 'stork': 17, 'dog': 18, 'tower': 19, 'garden': 20,
    'mountain': 21, 'crossroads': 22, 'crossroad': 22, 'paths': 22, 'path': 22, 'mice': 23, 'heart': 24,
    'ring': 25, 'book': 26, 'letter': 27, 'man': 28, 'gentleman': 28, 'woman': 29, 'lady': 29, 'lily': 30,
    'lilies': 30, 'sun': 31, 'moon': 32, 'key': 33, 'fish': 34, 'anchor': 35, 'cross': 36,
}


def tekst(fragment: str) -> str:
    t = re.sub(r'<br\s*/?>', '\n', fragment)
    t = html.unescape(re.sub(r'<[^>]+>', '', t))
    return re.sub(r'\n\s*\n+', '\n', t).strip()


def kaart_nl(naam: str):
    w = re.sub(r'^(de|het)\s+', '', naam.strip().lower())
    return NL.get(w)


def online_orakels(paren):
    for pad in sorted(glob.glob(os.path.join(MAP, 'oo-*.html'))):
        s = open(pad, encoding='utf-8', errors='ignore').read()
        slug = os.path.basename(pad)[3:-5]
        url = f'https://online-orakels.nl/lenormand/lenormandkaart-combinaties-{slug}'
        eigen = kaart_nl(slug.replace('-', ' '))
        for m in re.finditer(r'<h3[^>]*>\s*<a [^>]*>\s*(.*?)\s*</a>\s*</h3>\s*<p[^>]*>(.*?)</p>', s, re.S):
            titel = tekst(m.group(1))
            delen = re.split(r'\s+en\s+', titel, maxsplit=1)
            if len(delen) != 2:
                continue
            a, b = kaart_nl(delen[0]), kaart_nl(delen[1])
            if not a or not b or a == b or a != eigen:
                continue
            inhoud = m.group(2)
            kern = re.search(r'<strong>(.*?)</strong>', inhoud, re.S)
            paren.setdefault(f'{a}-{b}', []).append({
                'bron': 'online-orakels.nl', 'url': url, 'titel': titel,
                'kernwoorden': tekst(kern.group(1)) if kern else '',
                'tekst': tekst(re.sub(r'<strong>.*?</strong>', '', inhoud, count=1, flags=re.S))[:1500],
            })


def labyrinthos(paren):
    for pad in sorted(glob.glob(os.path.join(MAP, 'lab-*.html'))):
        s = open(pad, encoding='utf-8', errors='ignore').read()
        slug = os.path.basename(pad)[4:-5]
        url = f'https://labyrinthos.co/blogs/lenormand-cards/{slug}-lenormand-card-meaning-and-combinations'
        eigen = EN.get(slug.split('-')[-1]) or EN.get(slug.replace('the-', '').split('-')[0])
        if not eigen:
            continue
        # Combinaties staan in een tabel: <td>14. Fox</td><td>betekenis</td>
        for m in re.finditer(r'<tr>\s*<td>\s*(\d{1,2})\.\s*([^<]*?)\s*</td>\s*<td>(.*?)</td>\s*</tr>', s, re.S):
            b = int(m.group(1))
            uitleg = tekst(m.group(3))
            if not 1 <= b <= 36 or b == eigen or len(uitleg) < 5:
                continue
            paren.setdefault(f'{eigen}-{b}', []).append({
                'bron': 'labyrinthos.co', 'url': url, 'titel': f'{slug} + {m.group(2).strip()}',
                'kernwoorden': '', 'tekst': uitleg[:600],
            })


if __name__ == '__main__':
    paren = {}
    online_orakels(paren)
    labyrinthos(paren)
    json.dump(paren, open(os.path.join(MAP, 'paren.json'), 'w'), ensure_ascii=False)
    per_bron = {}
    for lijst in paren.values():
        for x in lijst:
            per_bron[x['bron']] = per_bron.get(x['bron'], 0) + 1
    print(f'{len(paren)} paren met bronnen', per_bron)
