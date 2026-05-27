"""Generate tab bar icons for the habit app."""
from PIL import Image, ImageDraw

SIZE = 81
NORMAL_COLOR = '#999999'
ACTIVE_COLOR = '#43b581'
BG = (0, 0, 0, 0)

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_home(draw, color, s):
    c = hex_to_rgb(color)
    cx, cy = s // 2, s // 2
    w = 3
    pts_roof = [(cx, 14), (14, cy - 2), (s - 14, cy - 2)]
    draw.polygon(pts_roof, outline=c, fill=None)
    draw.line([(cx, 14), (14, cy - 2)], fill=c, width=w)
    draw.line([(cx, 14), (s - 14, cy - 2)], fill=c, width=w)
    draw.rectangle([20, cy - 2, s - 20, s - 16], outline=c, width=w)
    draw.rectangle([cx - 8, s - 34, cx + 8, s - 16], outline=c, width=w)

def draw_trophy(draw, color, s):
    c = hex_to_rgb(color)
    w = 3
    cx = s // 2
    draw.arc([18, 12, s - 18, s - 28], 0, 180, fill=c, width=w)
    draw.line([(18, 12 + (s - 28 - 12) // 2), (10, 12 + (s - 28 - 12) // 2)], fill=c, width=w)
    draw.arc([6, 16, 22, 36], 90, 270, fill=c, width=w)
    draw.line([(s - 18, 12 + (s - 28 - 12) // 2), (s - 10, 12 + (s - 28 - 12) // 2)], fill=c, width=w)
    draw.arc([s - 22, 16, s - 6, 36], 270, 90, fill=c, width=w)
    draw.line([(cx, s - 28), (cx, s - 18)], fill=c, width=w)
    draw.line([(cx - 14, s - 16), (cx + 14, s - 16)], fill=c, width=w)

def draw_chat(draw, color, s):
    c = hex_to_rgb(color)
    w = 3
    draw.rounded_rectangle([10, 10, s - 16, s - 30], radius=8, outline=c, width=w)
    draw.rounded_rectangle([20, 28, s - 10, s - 14], radius=8, outline=c, width=w)
    draw.line([(30, 24), (s - 30, 24)], fill=c, width=2)
    draw.line([(30, 32), (s - 22, 32)], fill=c, width=2)

def draw_person(draw, color, s):
    c = hex_to_rgb(color)
    w = 3
    cx = s // 2
    r = 12
    draw.ellipse([cx - r, 12, cx + r, 12 + 2 * r], outline=c, width=w)
    draw.arc([cx - 22, 40, cx + 22, s - 10], 0, 180, fill=c, width=w)
    draw.line([(cx - 22, 40 + (s - 10 - 40) // 2), (cx - 22, s - 10)], fill=c, width=w)
    draw.line([(cx + 22, 40 + (s - 10 - 40) // 2), (cx + 22, s - 10)], fill=c, width=w)

icons = {
    'tab-home': draw_home,
    'tab-rank': draw_trophy,
    'tab-community': draw_chat,
    'tab-my': draw_person,
}

import os
out_dir = os.path.join(os.path.dirname(__file__), 'static')
os.makedirs(out_dir, exist_ok=True)

for name, draw_fn in icons.items():
    for suffix, color in [('', NORMAL_COLOR), ('-active', ACTIVE_COLOR)]:
        img = Image.new('RGBA', (SIZE, SIZE), BG)
        draw = ImageDraw.Draw(img)
        draw_fn(draw, color, SIZE)
        path = os.path.join(out_dir, f'{name}{suffix}.png')
        img.save(path)
        print(f'  [OK] {name}{suffix}.png')

print(f'\nAll icons saved to {out_dir}')
