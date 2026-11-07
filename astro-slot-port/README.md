# Astro Slot — Construct 3 direct port

A local direct port of **Slot Astro**, captured from:

- Source: https://showcase.tegagame.com/games/slot-astro/
- Engine: Scirra Construct 3, HTML5 worker-mode export
- Native resolution: 784 × 441

## Run

```bash
node server.js
```

Open <http://127.0.0.1:8157/>.

Optional environment overrides:

```bash
PORT=8157 HOST=127.0.0.1 node server.js
```

## Verification

The captured tree includes `capture-manifest.json`, which records the SHA-256 and byte size of every staged file. All ten audio files declared by `data.json` match their declared byte counts exactly.

A local boot audit (`local-browser-audit.json`, CDP-driven Chrome with error hooks installed before navigation) confirmed: canvas 784 × 441 renders with a non-trivial payload, 20 runtime resources with zero failed requests, and zero console errors, uncaught errors, or unhandled rejections.

The local server provides the MIME types required by Construct 3, returns true 404s, rejects malformed paths and traversal, supports only `GET`/`HEAD`, and disables caching for HTML/JavaScript/CSS/JSON.

## Notes

All files in this directory are proprietary intellectual property of the repository owner, part of the browser-games portfolio. The build was captured from the TegaGame showcase listing above; capture provenance and the file manifest are retained in [NOTES.md](NOTES.md) as distribution-reference metadata. Entry-point HTML metadata carries the portfolio's ownership branding; every other staged file matches its capture-manifest hash.
