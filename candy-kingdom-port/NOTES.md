# Candy Kingdom — Capture and Verification Notes

## Source and port type

- Source: `https://previews.customer.envatousercontent.com/files/901226125/index.html`
- Engine: Construct 3
- Port type: direct port using the original runtime and assets
- Local port: `8141`

## Capture method

1. Loaded the live Envato preview in headed Chrome.
2. Confirmed the export loads `scripts/c3main.js`, `scripts/c3runtime.js`, `data.json`, and runtime assets.
3. Enumerated all asset paths from `data.json` and the live resource timeline.
4. Downloaded the HTML, CSS, manifest, service worker, runtime/project scripts, fonts, icons, images, audio, and game data from the preview host.
5. Added a local Node static server with explicit MIME types and extension-safe 404 behavior.

The export runs with `useWorker: false` (`scripts/main.js`), so `workermain.js`, `xmldom.js`, and `xpath.js` are not required for this build. Those three paths return 403 from the preview host and were not fabricated locally.

## Asset inventory

| Group | Count | Notes |
|---|---:|---|
| WebP atlases | 20 | Paths enumerated from `data.json` |
| WebM audio | 13 | Includes `media/freespin.webm` and big-win effects |
| PNG icons/backgrounds | 8 | Includes PWA icon sizes and loading logo |
| Runtime/project scripts | 11 | Construct runtime, bootstrap, worker helpers, project events |
| Font | 1 | `fonts/Carre-JWja.ttf` |
| Core files | 5 | `index.html`, `style.css`, `appmanifest.json`, `sw.js`, `data.json` |

Total captured payload is approximately 15.8 MB.

## Verification — 2026-10-24

### Static server

- `GET /` returned HTTP 200 and title `Candy Kingdom`.
- `GET /data.json` returned HTTP 200 with `application/json; charset=utf-8`.
- `GET /media/freespin.webm` returned HTTP 200 with `audio/webm`.
- Missing paths return HTTP 404 rather than being replaced by HTML.

### Browser runtime

- Local game booted to title `🐴 Candy Kingdom`.
- The Construct canvas was created and rendered at a 264 × 469 internal portrait size (native landscape 784 × 469 viewport).
- Browser visibility was explicitly checked with `Page.bringToFront`; `document.visibilityState` became `visible`.
- Runtime resource timeline shows the engine, game data, all startup image atlases, font, and startup audio loaded successfully.
- Captured `error`, `unhandledrejection`, and `console.error` hooks reported **zero errors**.
- Canvas frame hashes changed across four gameplay clicks, proving the game is actively animating/interactive rather than merely displaying a static canvas.
- No gameplay interaction produced a console exception.

## Files

```text
candy-kingdom-port/
├── index.html
├── style.css
├── appmanifest.json
├── sw.js
├── data.json
├── server.js
├── scripts/
├── images/
├── media/
├── icons/
└── fonts/
```

## License

Original game assets and runtime are copyrighted by their respective owners. This is a local direct-port copy for study and is not represented as a redistributable asset pack.
