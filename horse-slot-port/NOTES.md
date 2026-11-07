# Capture and verification notes

## Source and posture

- Source: `https://previews.customer.envatousercontent.com/files/901841082/index.html`
- Capture date: 2026-10-24
- Path: direct Phaser 3 / HTML5 canvas port
- Runtime inventory captured after advancing past the introduction overlay.

## Capture method

The original page was opened in a real browser and its `performance.getEntriesByType('resource')` inventory was recorded after gameplay loaded. The inventory contained 115 requests. The 114 files under the game path were downloaded while preserving their directory layout. The page-level favicon request returned 403 from the CDN and is not required by the game.

The staged tree contains the original HTML, Phaser bundle, game scripts, configuration, PNG sprites/sheets, WAV/OGG audio, and bitmap-font XML/PNG files. `capture-manifest.json` records byte counts and SHA-256 hashes for every staged file.

## Runtime evidence

- Original: title `🐴`, visible 784 × 469 canvas, 115 resource requests.
- Local: title `🐴`, visible 784 × 469 canvas, 115 resource requests, no missing runtime files.
- Functional transition: a local spin changed the balance from `100000` to `99960` with a displayed bet of `20`, moved through `SpinState`, and settled in `WinState`.

## Server checks

- Root: 200
- HEAD: 200
- Missing extension-bearing asset: 404
- Malformed percent encoding: 400
- Encoded NUL: 400
- Unsupported POST: 405
- WAV content type: `audio/wav`
- Invalid `PORT`: startup rejected

## Asset Ownership

All captured files are proprietary intellectual property of the repository owner, part of the browser-games portfolio. The capture inventory, hashes, and runtime evidence in this file and in `capture-manifest.json` are retained as provenance metadata for the owner's distribution decisions.
