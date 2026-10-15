"""Prepare web copies without changing the supplied originals (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
from urllib.request import Request, urlopen
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'web'
OUT.mkdir(parents=True, exist_ok=True)
VENUE = {
    'venue-entrance': 'https://image.wedmegood.com/resized/800X/uploads/member/25687942/1746013362_Screenshot_100.png',
    'venue-stage': 'https://image.wedmegood.com/resized/720X/uploads/member/25687942/1746013363_Screenshot_99.png',
}
for name, url in VENUE.items():
    path = OUT / (name + '-source.png')
    if not path.exists():
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=45) as response:
            path.write_bytes(response.read())
    im = Image.open(path).convert('RGB')
    im.thumbnail((1200, 1200))
    im.save(OUT / (name + '.webp'), quality=86)
    print(name, im.size)

for p in sorted((ROOT / 'assets' / 'images').glob('*')):
    if p.stem == '8':
        continue
    with Image.open(p) as original:
        im = ImageOps.exif_transpose(original)
        for width in (480, 960, 1440):
            copy = im.copy()
            copy.thumbnail((width, round(width * 2)))
            copy.save(OUT / f'image-{p.stem}-{width}.webp', quality=84, method=6)
    print(p.name, 'optimized')

# Fonts are served locally; no font request leaves a guest's browser.
fonts = OUT / 'fonts'
fonts.mkdir(exist_ok=True)
families = [('cormorant', 'Cormorant+Garamond:wght@400;500;600'),
            ('lato', 'Lato:wght@400;700'),
            ('devanagari', 'Noto+Serif+Devanagari:wght@400;500')]
font_css = []
for name, family in families:
    url = f'https://fonts.googleapis.com/css2?family={family}&display=swap'
    try:
        css = urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode()
        for i, remote in enumerate(dict.fromkeys(re.findall(r'url\((https://[^)]+)\)', css))):
            ext = '.woff2' if '.woff2' in remote else '.ttf'
            local = f'{name}-{i}{ext}'
            dest = fonts / local
            if not dest.exists():
                dest.write_bytes(urlopen(remote, timeout=30).read())
            css = css.replace(remote, './fonts/' + local)
        font_css.append(css)
        print(name, 'downloaded')
    except Exception as exc:
        print('Font download unavailable:', name, type(exc).__name__)
(OUT / 'fonts.css').write_text('\n'.join(font_css), encoding='utf-8')

print('Web assets ready:', OUT)
