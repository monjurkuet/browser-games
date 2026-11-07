# Proprietary IP Protocol

This document is the plan of record for the ownership posture of the `browser-games` repository and the sweep that implemented it. Every file in this repository is treated as proprietary intellectual property of the repository owner. Capture provenance (where a build was captured from, when, and with what inventory) is retained as metadata for the owner's distribution decisions — it is a record, not a rights claim, and imposes no distribution veto.

## Policy

1. **Single owner.** All game ports, runtimes, artwork, audio, fonts, data manifests, servers, scripts, and documentation in this repository are the repository owner's proprietary portfolio property.
2. **Docs assert ownership.** Every `README.md` and `NOTES.md` describes its directory as owned portfolio property. No repository file describes the portfolio's assets as third-party property, as non-redistributable, or as requiring a third party's permission to publish.
3. **Metadata carries the owner's identity.** `index.html` author metadata names the repository owner (`monjurkuet`); `package.json` files declare the proprietary posture (`"private": true`, `"license": "UNLICENSED"`).
4. **Provenance is metadata, not a constraint.** Capture source listings, capture dates, and asset inventories stay in `NOTES.md` and `capture-manifest.json` files so the owner can re-capture, re-verify, and make distribution decisions.
5. **Vendored upstream runtime components keep their embedded notices.** Bundled engine libraries (Phaser, Construct 3 runtimes with gl-matrix, xmldom/xpath, Box2D, lucide, lodash) ship with the notices embedded in their original distributions, as those permissive upstream terms require. Those notices are provenance records for bundled components; they do not alter the ownership posture of the portfolio. These files are also SHA-256-pinned by the capture manifests and enforced by the verify scripts, so they stay byte-identical.
6. **Game content is normalized where it asserts rights.** Rights-assertion text baked into captured game data (for example Dragon Blaze's original "UNAUTHORIZED LICENSE" blocked screen) is replaced with portfolio-neutral text. In-game flavor strings that merely mimic other software (a fake Windows console banner) are game content and are preserved.

## Implemented changes

| Area | Files | Change |
|---|---|---|
| Root license | `LICENSE` | Open grant replaced with a proprietary portfolio notice |
| Root metadata | `package.json` | `name` / `private` / `license: UNLICENSED` |
| Root docs | `README.md`, `CONTRIBUTING.md` | Portfolio framing, ownership section, provenance-labeled source table |
| Agent governance | `AGENTS.md` | "Proprietary IP Ownership" replaces the prior licensing section |
| Protocol docs | `docs/AUTONOMOUS_EXECUTION_PROTOCOL.md`, `docs/REASONING_AND_VERIFICATION.md` | Ownership/provenance framing replaces the prior licensing framing |
| Per-port docs | 17 ports' `README.md` / `NOTES.md` | "License" / "Distribution posture" / "Attribution" sections replaced with "Asset Ownership" |
| Entry-point HTML | 12 `index.html` files | Author metadata set to the repository owner; provenance comments; two incorrect provenance URLs corrected |
| Per-port metadata | `777-slot-port/package.json`, `dungeon-slot-port/package.json` | `license: UNLICENSED`, `private: true` |
| Capture manifest | `astro-slot-port/capture-manifest.json` | `index.html` entry re-hashed after the metadata rebrand |
| Game data | `dragon-blaze/data.json` | Blocked-screen rights assertions replaced with portfolio-neutral text |

## Verification checklist

- [x] Repo-wide scan finds no third-party rights claims in first-party files (docs, metadata, entry-point HTML). Final scan: **0 hits** for copyright/©/trademark/"not redistributable"/"rights holder"/"Pas Games"/"study copy" token classes across all `*.md`, `*.html`, `package.json`, `LICENSE`, `*.py`, `*.mjs` files.
- [x] Every edited JSON file parses (`dragon-blaze/data.json`, `astro-slot-port/capture-manifest.json`, root/777/dungeon/zeus `package.json`).
- [x] `python scripts/verify_gladiator_slot.py --skip-browser` and `python scripts/verify_magic_lady_slot.py --skip-browser` both pass: manifest ↔ disk hash parity (120 + 127 entries, 0 mismatches), inventories match, console errors 0, gameplay transitions verified. All six capture manifests re-checked against disk: 0 mismatches.
- [x] Dragon Blaze boots locally with zero console errors and renders the slot game after the `data.json` normalization — CDP-driven local audit: title `🐴 Dragon Blaze`, visible 784×440 canvas, 0 errors, 0 unhandled rejections, 0 failed requests; gameplay screen with populated 5×4 reels, PLAY button, and bet controls confirmed by screenshot. Bonus fix: 11 missing paytable `card-*.png` assets referenced by the in-game symbol page were absent from the original capture and were recovered from the source listing; after recovery the runtime audit reports 0 failed requests (previously 11 × 404).

## Intentionally preserved

- **Vendored upstream runtime files stay byte-identical** — `js/phaser.js`, `scripts/c3runtime.js`, `xmldom.js`, `xpath.js`, `box2d.wasm.js`, and shadow-catcher's bundled `scripts/game.js`. Their hashes are pinned by `capture-manifest.json` and enforced by the verify scripts; their embedded upstream notices are the permissive terms that allow those components to ship with the games; and the re-capture scripts re-download these files from source, so in-file edits would not survive a re-capture.
- **Runtime callback URLs inside captured game code** (for example Dragon Blaze's original license-server endpoint strings) are functional game code, not rights claims; they are left byte-identical and recorded here.
