# Next Tram website

Showcase site for [Next Tram](https://github.com/mateusmorgado/next-tram). Plain HTML, CSS and JS, no build step.

```bash
npx serve .        # or any static server
```

## Files

| File | What it is |
|---|---|
| `index.html` | All sections |
| `styles.css` | Design tokens at the top (dark first, light via `prefers-color-scheme`) |
| `main.js` | Hero countdown, assistant timer, walk-time slider, scroll reveal |
| `assets/img/` | Screenshots copied from the app repo (sample departures) |
| `assets/video/` | Put your videos here |

## Adding the videos

There are two marked slots in `index.html` (search for `VIDEO SLOT`):

- **Hero**: `assets/video/hey-google.mp4`, portrait (9:14 works best), the "Hey Google, when is the tram?" clip.
- **Watch**: `assets/video/watch.mp4`, square, shown in a round frame.

Replace the `<div class="slot-placeholder">…</div>` inside each slot with the `<video>` line given in the comment above it. Keep `muted` and `playsinline` so it autoplays on phones.

## Deploying

Any static host works. For GitHub Pages: Settings → Pages → deploy from the `main` branch, root folder.
