# Capture and verification notes

## Source and posture

- Source: `https://previews.customer.envatousercontent.com/files/901663093/index.html`
- Capture date: 2026-10-24
- Path: direct Phaser 3 / HTML5 canvas port
- Runtime inventory: recorded in a real browser after the title and gameplay assets loaded

## Capture method

The original page was opened in Chrome and `performance.getEntriesByType('resource')` was recorded. The 126 runtime-requested game files plus `index.html` were downloaded while preserving directory layout, for 127 files and 38,539,019 bytes. `capture-manifest.json` records byte counts, SHA-256 hashes, and content types. `scripts/capture_envato_901663093.py` reproduces the capture from the retained inventory using path-contained staging.

## Runtime evidence

- Original and local each request the same 126 normalized game paths; manifest and runtime inventories match exactly.
- Both audits completed `IddleState → SpinState → WinState` (outcomes are randomized).
- Both original and local consoles have zero uncaught errors, unhandled rejections, or `console.error` calls.
- `scripts/audit_magic_lady_slot.mjs` regenerates the browser audits; `scripts/verify_magic_lady_slot.py` runs it by default and then checks hashes, inventories, consoles, and state transitions.

## Asset Ownership

All captured files are proprietary intellectual property of the repository owner, part of the browser-games portfolio. The capture inventory, hashes, and audits referenced above are retained as provenance metadata for the owner's distribution decisions.
