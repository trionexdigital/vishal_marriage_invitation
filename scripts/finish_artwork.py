"""Compress generated art and compose the local social-sharing preview."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'web'
for name, width in [('jasmine-garland', 1200), ('venue-watercolor', 1000)]:
    im = Image.open(OUT / f'{name}.png').convert('RGBA')
    im.thumbnail((width, width))
    im.save(OUT / f'{name}.webp', quality=88, method=6)
    print(name, im.size)

social = Image.new('RGB', (1200, 630), '#f5ecdb')
floral = Image.open(OUT / 'image-2-1440.webp').convert('RGB')
floral = ImageOps.fit(floral, (1200, 630))
social = Image.blend(social, floral, .52)
draw = ImageDraw.Draw(social)
draw.rectangle((30, 30, 1170, 600), outline='#b99863', width=2)
serif = str(next((OUT / 'fonts').glob('cormorant-*.ttf'), Path(r'C:\Windows\Fonts\georgia.ttf')))
sans = str(next((OUT / 'fonts').glob('lato-*.ttf'), Path(r'C:\Windows\Fonts\arial.ttf')))
def centered(text, y, size, color, font):
    draw.text((600,y), text, font=ImageFont.truetype(font,size), fill=color, anchor='mt')
centered("WITH LOVE & BLESSINGS", 110, 19, '#8e714a', sans)
centered("Vishal & Vishakha", 190, 100, '#513526', serif)
draw.line((480, 335, 720, 335), fill='#b99863', width=2)
centered("4 DECEMBER 2026", 372, 27, '#785936', sans)
centered("Rajgharana Resort · Shamli", 425, 32, '#7f6549', serif)
centered("YOU ARE WARMLY INVITED", 521, 16, '#8e714a', sans)
social.save(OUT / 'social-preview.jpg', quality=90, optimize=True)
print('Social preview ready')
