# Pirates Slot — direct HTML5/Phaser port

A local direct port of the Envato customer preview at:

`https://previews.customer.envatousercontent.com/files/659690412/index.html`

## Run

```bash
node pirates-slot-port/server.js
```

Open `http://127.0.0.1:8801/`. Override the port with `PORT=...`; the server binds to `127.0.0.1` by default.

## Contents

- `index.html` and `js/`: original Phaser 3 game runtime and pirates-themed slot configuration
- `png/`: original sprites, animated symbol sheets, UI panels, and bitmap-font atlases
- `audio/`: original game audio
- `fonts/`: original bitmap fonts
- `capture-manifest.json`: byte size, SHA-256, and content type for every captured file
- `original-browser-audit.json` / `local-browser-audit.json`: retained console, resource-inventory, canvas, and gameplay-transition evidence
- `server.js`: hardened static server with explicit MIME types and true 404 responses

## Verification

- Captured all 132 runtime-requested game files plus `index.html` (133 files, 41,160,656 bytes).
- Original and local post-gameplay inventories contain the same 132 normalized game paths; no missing or extra runtime files.
- The local build renders a visible 784 × 469 pirates-themed slot canvas and has no console errors, uncaught errors, or unhandled rejections.
- A reproducible local spin transitioned from `IddleState` through `NormalSpinState` to `WinState` and debited the 243-credit bet. The original independently completed the same staged transition; outcomes vary because the reel result is randomized.
- Server checks: root/HEAD 200, missing asset 404, malformed encoding 400, encoded NUL 400, POST 405, WAV `audio/wav`, invalid port rejected.

## Distribution posture

The captured game code, artwork, audio, and fonts are third-party Envato preview assets. This directory is prepared for the repository's authorized local portfolio/research workflow; do not publish or redistribute these assets without the rights holder's permission.