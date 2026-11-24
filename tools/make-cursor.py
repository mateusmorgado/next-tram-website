# Draws the tram-signal LED mouse pointer (assets/cursor/*.png). Run: python3 tools/make-cursor.py
import sys
from PIL import Image, ImageDraw, ImageFilter
G='''
X
XX
XXX
XXXX
XXXXX
XXXXXX
XXXXXXX
XXXXXXXX
XXXXX
XX.XX
X...XX
.....XX
'''
P,R,M=2.5,1.0,1.5
def render(s, dot, core, glowc, glowa, coreR=0.5):
    pts=[(x,y) for y,l in enumerate(G.strip('\n').split('\n')) for x,c in enumerate(l) if c=='X']
    SS=8; S=s*SS; W=32*S
    img=Image.new('RGBA',(W,W),(0,0,0,0))
    def layer(rad, fill, blur=0):
        m=Image.new('L',(W,W),0); d=ImageDraw.Draw(m)
        for x,y in pts:
            cx=(M+x*P+R)*S; cy=(M+y*P+R)*S; rr=rad*S
            d.ellipse([cx-rr,cy-rr,cx+rr,cy+rr],fill=fill)
        return m.filter(ImageFilter.GaussianBlur(blur*S)) if blur else m
    img.paste(Image.new('RGBA',(W,W),(16,17,20,240)),(0,0),layer(R+1.35,255))
    img.paste(Image.new('RGBA',(W,W),glowc+(255,)),(0,0),layer(R+0.9,glowa,0.8))
    img.paste(Image.new('RGBA',(W,W),dot+(255,)),(0,0),layer(R,255))
    img.paste(Image.new('RGBA',(W,W),core+(255,)),(0,0),layer(R*coreR,255))
    return img.resize((32*s,32*s),Image.LANCZOS)
out=sys.argv[1] if len(sys.argv) > 1 else 'assets/cursor'
for s in (1,2):
    suf='' if s==1 else '@2x'
    render(s,(255,150,20),(255,214,120),(255,140,0),70).save(f'{out}/signal{suf}.png',optimize=True)
    render(s,(255,165,25),(255,236,170),(255,160,20),160,0.6).save(f'{out}/signal-link{suf}.png',optimize=True)
