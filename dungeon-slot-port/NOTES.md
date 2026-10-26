# Dungeon Slot — local direct port

Captured from `https://showcase.tegagame.com/games/dungeon-slot/` and served locally as a Construct 3 HTML5 export.

## Run

```bash
node server.js
```

Open <http://127.0.0.1:8137/>.

## Provenance and distribution note

The game export was captured from the publicly served TegaGame showcase page. The repository's top-level `LICENSE` is MIT, but it does not establish redistribution rights for the third-party game artwork or audio. This port is intended for local development and parity testing; confirm the upstream rights before publishing or redistributing the captured assets.

The export includes the original Construct 3 runtime and assets, including `data.json`, WebP atlases, WebM audio, worker scripts, icons, and the loading logo. Runtime assets were staged from the same coherent source export; no substitute assets were used.

## Verification

A local boot audit (`local-browser-audit.json`, CDP-driven Chrome with error hooks installed before navigation) confirmed: canvas 784 × 441 renders with a non-trivial payload, 18 runtime resources with zero failed requests, and zero console errors, uncaught errors, or unhandled rejections.
