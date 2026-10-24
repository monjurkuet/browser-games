# Capture and verification notes

## Source and posture

- Source: `https://previews.customer.envatousercontent.com/files/730070676/index.html`
- Capture date: 2026-10-24
- Path: direct Phaser 3 / HTML5 canvas port
- Runtime inventory captured after the game loaded and a spin resolved.

## Capture method

The original page was opened in a real browser and its `performance.getEntriesByType('resource')` inventory was recorded after gameplay loaded. The inventory contained 121 requests: 119 files under the game path, the page document, and two attempts to request the CDN's page-level favicon. The 119 game files plus `index.html` were downloaded while preserving their directory layout. The favicon is not a game runtime dependency.

- The staged tree contains the original HTML, Phaser bundle, game scripts, configuration, PNG sprites/sheets, WAV/OGG audio, and bitmap-font XML/PNG files. `capture-manifest.json` records byte counts, SHA-256 hashes, and content types for every staged file.
- `original-browser-audit.json` and `local-browser-audit.json` retain the pre-navigation error hooks, console results, normalized resource inventories, canvas facts, and sampled state-machine transitions for both builds. `scripts/audit_gladiator_slot.mjs` starts an isolated local server, drives headless Chrome through the original and local pages, exercises a spin, and regenerates these artifacts. `scripts/verify_gladiator_slot.py` runs that browser audit by default and then validates manifest hashes, compares the 119 original and local runtime paths, and validates the console/gameplay assertions; `--skip-browser` performs artifact-only validation.

## Runtime evidence

- Original: empty HTML document title, visible 784 × 469 canvas, 119 game-path requests.
- Local: the same empty HTML document title, visible 784 × 469 canvas, the same 119 normalized game-path requests, and zero missing or extra runtime paths.
- Local console audit: zero uncaught errors, zero unhandled rejections, and zero `console.error` calls.
- Functional transition: the retained local audit moved from `IddleState` through `NormalSpinState` to a resolved state and debited the 20-credit bet. The retained original audit independently completed the same staged transition. Outcomes vary because the reel result is randomized; the state-machine progression and balance accounting are the parity evidence.

## Server checks

- Root: 200
- HEAD: 200
- Missing extension-bearing asset: 404
- Malformed percent encoding: 400
- Encoded NUL: 400
- Unsupported POST: 405
- WAV content type: `audio/wav`
- Invalid `PORT`: startup rejected

## Licensing / distribution posture

No separate asset-grant or public-domain license was exposed by the preview or capture metadata. The captured code and assets remain third-party material. This port is suitable for the repository's authorized local portfolio/research workflow, but the captured files should not be published or redistributed without permission from the rights holder.
