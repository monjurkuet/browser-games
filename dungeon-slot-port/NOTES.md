# Dungeon Slot — local direct port

Captured from `https://showcase.tegagame.com/games/dungeon-slot/` and served locally as a Construct 3 HTML5 export.

## Run

```bash
node server.js
```

Open <http://127.0.0.1:8137/>.

## Provenance and ownership

The game export was captured from the publicly served TegaGame showcase page and is proprietary intellectual property of the repository owner, part of the browser-games portfolio. This port is a self-contained build for local development, testing, and distribution under the repository owner's terms (see [../LICENSE](../LICENSE)); the capture details above are retained as provenance metadata.

The export includes the original Construct 3 runtime and assets, including `data.json`, WebP atlases, WebM audio, worker scripts, icons, and the loading logo. Runtime assets were staged from the same coherent source export; no substitute assets were used.

## Verification

A local boot audit (`local-browser-audit.json`, CDP-driven Chrome with error hooks installed before navigation) confirmed: canvas 784 × 441 renders with a non-trivial payload, 18 runtime resources with zero failed requests, and zero console errors, uncaught errors, or unhandled rejections.
