# Next Tram website

Showcase site for [Next Tram](https://github.com/mateusmorgado/next-tram). Plain HTML, CSS and JS, no build step. GSAP, ScrollTrigger and Lenis load from public CDNs; without them the page still reads fully (effects fall back to IntersectionObserver).

```bash
npx serve .        # or: python3 -m http.server
```

## Files

| File | What it is |
|---|---|
| `index.html` | All sections |
| `styles.css` | Design tokens at the top (one dark look, tram-yellow accent) |
| `main.js` | Hero film reel, scroll choreography, live demos (app, walk slider, watch) |
| `assets/video/` | `ask`, `leave`, `run` films at 720p and 1080p, plus posters |
| `assets/img/photo/` | Tram photos at 1200 and 2400 px, WebP and JPG |

## Films

The hero cuts between the three films (`ask` → `leave` → `run`), and `leave` and `run` return later as full-bleed sections. `leave` and `run` have the app's dark UI composited onto the phone and watch screens.

To replace a film, encode it with no audio and `faststart`, for example:

```bash
ffmpeg -i input.mp4 -an -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart assets/video/leave-1080.mp4
ffmpeg -i input.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart assets/video/leave-720.mp4
```

Screens narrower than 1200 px get the 720p files.

## Deploying

Any static host works. For GitHub Pages: Settings → Pages → deploy from the branch, root folder.
