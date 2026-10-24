# Magic Lady Slot — direct HTML5/Phaser port

A local direct port of the Envato customer preview at:

`https://previews.customer.envatousercontent.com/files/901663093/index.html`

## Run

```bash
node magic-lady-slot-port/server.js
```

Open `http://127.0.0.1:8893/`. Override with `PORT=...`; `HOST` defaults to `127.0.0.1`.

## Contents

- `index.html`, `js/`: original Phaser 3 runtime, game scripts, and configuration
- `png/`: original symbols, animated sheets, panels, wheel, and bitmap-font atlases
- `audio/`, `fonts/`: original game audio and bitmap fonts
- `capture-manifest.json`: byte size, SHA-256, and content type for every captured file
- `original-browser-audit.json`, `local-browser-audit.json`: regenerated browser evidence
- `server.js`: hardened static server with explicit MIME types and true 404 responses

## Verification

Run from the repository root:

```bash
python scripts/verify_magic_lady_slot.py
```

This starts an isolated local server, launches Chrome over CDP, audits the original and local pages, exercises a spin, regenerates both audit files, then validates hashes, exact runtime inventories, console health, and gameplay transitions. `--skip-browser` validates retained artifacts only.

## Distribution posture

The captured code and assets are third-party Envato preview material prepared for the repository's authorized local portfolio/research workflow. Do not publish or redistribute them without rights-holder permission.
