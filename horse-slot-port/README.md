# Horse Slot — direct HTML5/Phaser port

A local direct port of the Envato customer preview at:

`https://previews.customer.envatousercontent.com/files/901841082/index.html`

## Run

```bash
node horse-slot-port/server.js
```

Open `http://127.0.0.1:8161/`. Override the port with `PORT=...`; the server binds to `127.0.0.1` by default.

## Contents

- `index.html` and `js/`: original Phaser 3 game runtime and configuration
- `png/`: original sprites, symbol sheets, UI panels, and font atlases
- `audio/`: original game audio
- `fonts/`: original bitmap fonts
- `capture-manifest.json`: byte size and SHA-256 for every captured file
- `server.js`: hardened static server with explicit MIME types and true 404s

## Verification

- Captured 114 runtime files (55,874,273 bytes) from the original's post-introduction resource inventory.
- The local build renders a visible 784 × 469 canvas with title `🐴`.
- Original and local runtime inventories both contain 115 requests (including the original page's cross-origin favicon request).
- A local spin transitioned through `SpinState` to a settled `WinState`; the displayed balance changed from `100000` to `99960` for a bet of `20`.
- Server checks: root/HEAD 200, missing asset 404, malformed encoding 400, encoded NUL 400, POST 405, WAV `audio/wav`, invalid port rejected.

## Distribution posture

The captured game code, artwork, audio, and fonts are third-party Envato preview assets. This directory is prepared for the repository's authorized local portfolio/research workflow; do not publish or redistribute these assets without the rights holder's permission.
