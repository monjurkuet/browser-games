# Western Slot — direct HTML5/Phaser port

A local direct port of the Envato customer preview at:

`https://previews.customer.envatousercontent.com/files/659692993/index.html`

## Run

```bash
node western-slot-port/server.js
```

Open `http://127.0.0.1:8802/`. Override the port with `PORT=...`; the server binds to `127.0.0.1` by default.

## Contents

- `index.html` and `js/`: original Phaser 3 game runtime and western-themed slot configuration
- `png/`: original sprites, animated symbol sheets, UI panels, and bitmap-font atlases
- `audio/`: original game audio
- `fonts/`: original bitmap fonts
- `capture-manifest.json`: byte size, SHA-256, and content type for every captured file
- `original-browser-audit.json` / `local-browser-audit.json`: retained console, resource-inventory, canvas, and HUD-state evidence
- `server.js`: hardened static server with explicit MIME types and true 404 responses

## Verification

- Captured all 113 runtime-requested game files plus `index.html` (114 files, 50,634,908 bytes).
- Original and local post-boot inventories contain the same 113 normalized game paths; no missing or extra runtime files.
- The local build renders a visible 784 × 469 western-themed slot canvas and has no console errors, uncaught errors, or unhandled rejections.
- Both original and local initialize the Phaser state machine to `IddleState` with identical HUD values (balance 100000, total bet 20, win 0) and identical canvas payload length. The preview is a demo build whose spin control is non-interactive, so spin-cycle parity cannot be exercised on either copy; the limitation is identical on the original.
- Server checks: root/HEAD 200, missing asset 404, malformed percent-encoding 400, encoded NUL 400, encoded traversal 403, POST 405, WAV `audio/wav`, invalid port rejected.

## Distribution posture

The captured game code, artwork, audio, and fonts are third-party Envato preview assets. This directory is prepared for the repository's authorized local portfolio/research workflow; do not publish or redistribute these assets without the rights holder's permission.