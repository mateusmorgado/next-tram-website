# Draws the tram-signal pointer: the bar + chevron of a German tram signal in
# amber LED dots, tilted to the classic mouse-pointer angle (tip up-left).
# Run: python3 tools/make-cursor.py [outdir]   (writes signal*.png, prints hotspot)
import math, sys
from PIL import Image, ImageDraw, ImageFilter

SLOPE = 0.62      # chevron half-opening (dy/dx), as on the signal
INNER = 3.6       # how far the chevron inner vertex sits behind the tip
DEPTH = 9         # chevron depth in dots
BAR_X = (-13, -11)  # bar columns (behind the chevron, with a gap)
BAR_Y = 2          # bar half-height


def glyph():
    pts = []
    for x in range(-14, 1):
        for y in range(-8, 9):
            if -DEPTH <= x <= 0 and (-x) * SLOPE + 0.35 >= abs(y) >= (-INNER - x) * SLOPE + 0.35 - 0.7:
                pts.append((x, y))
            elif BAR_X[0] <= x <= BAR_X[1] and abs(y) <= BAR_Y:
                pts.append((x, y))
    return pts


def layout(angle_deg, pitch, margin):
    """Rotate so the chevron points along angle_deg (0 = right, 90 = up), screen coords."""
    a = math.radians(angle_deg)
    ca, sa = math.cos(a), math.sin(a)
    pts = []
    for x, y in glyph():
        # glyph frame: +x forward, +y to the side; screen: y grows downward
        sx = (x * ca - y * sa) * pitch
        sy = -(x * sa + y * ca) * pitch
        pts.append((sx, sy))
    minx = min(p[0] for p in pts); miny = min(p[1] for p in pts)
    ox, oy = margin - minx, margin - miny
    return [(px + ox, py + oy) for px, py in pts], (ox, oy)


def render(s, angle, pitch, R, dot, core, glowc, glowa, coreR=0.5, size=44, margin=3.4):
    pts, (hx, hy) = layout(angle, pitch, margin)
    SS = 8; S = s * SS; W = size * S
    img = Image.new('RGBA', (W, W), (0, 0, 0, 0))

    def layer(rad, fill, blur=0):
        m = Image.new('L', (W, W), 0); d = ImageDraw.Draw(m)
        for x, y in pts:
            cx, cy, rr = x * S, y * S, rad * S
            d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=fill)
        return m.filter(ImageFilter.GaussianBlur(blur * S)) if blur else m

    img.paste(Image.new('RGBA', (W, W), (16, 17, 20, 240)), (0, 0), layer(R + 1.6, 255))
    img.paste(Image.new('RGBA', (W, W), glowc + (255,)), (0, 0), layer(R + 1.1, glowa, 0.9))
    img.paste(Image.new('RGBA', (W, W), dot + (255,)), (0, 0), layer(R, 255))
    img.paste(Image.new('RGBA', (W, W), core + (255,)), (0, 0), layer(R * coreR, 255))
    ext = (max(p[0] for p in pts), max(p[1] for p in pts))
    return img.resize((size * s, size * s), Image.LANCZOS), (hx, hy), ext


ANGLE, PITCH, R = 122, 2.6, 1.07

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'assets/cursor'
    for s in (1, 2):
        suf = '' if s == 1 else '@2x'
        im, hot, ext = render(s, ANGLE, PITCH, R, (255, 150, 20), (255, 214, 120), (255, 140, 0), 80)
        im.save(f'{out}/signal{suf}.png', optimize=True)
        im, hot, ext = render(s, ANGLE, PITCH, R, (255, 165, 25), (255, 236, 170), (255, 160, 20), 170, 0.6)
        im.save(f'{out}/signal-link{suf}.png', optimize=True)
    print('hotspot', round(hot[0]), round(hot[1]), 'extent', ext)
