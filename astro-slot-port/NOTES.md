# Capture and verification notes

## Source and posture

- URL: https://showcase.tegagame.com/games/slot-astro/
- Capture date: 2026-10-24
- Path: direct Construct 3 port
- Engine options found in `scripts/main.js`: `useWorker: true`, `workerMainUrl: "workermain.js"`, `engineScripts: ["scripts/c3runtime.js"]`, `exportType: "html5"`.
- Author metadata in `index.html`: `tegagame.com`.

## Capture method

Core export files were downloaded directly. Every asset path embedded in `data.json` was downloaded while preserving its directory. The C3 audio table was parsed separately because audio names are stored separately from the `media/` prefix. The live runtime inventory was used to confirm late requests.

## Integrity

- Staged files: 50
- Staged bytes: 9,417,023
- Manifest: `capture-manifest.json` (SHA-256 and byte size for every file)
- All 10 declared audio assets match `data.json` byte counts exactly.

## Runtime evidence

The original and local builds both initialize a visible 784 × 441 canvas. The local build loads the Construct 3 worker runtime, worker scripts, images, and audio from the local server. The local page remains visible during interaction, and the local server returns the expected MIME types for JavaScript, JSON, WebP, and WebM.

## Server checks

- Root: 200
- HEAD: 200
- Missing extension-bearing asset: 404
- Unsupported POST: 405
- Malformed percent encoding: 400
- Encoded NUL: 400
- Traversal: 403
- Invalid `PORT`: startup rejected

## Licensing / distribution posture

The original art, audio, and project data are third-party assets. No separate asset-grant or public-domain license was exposed by the target page or export metadata. This port is suitable for the repository's authorized local portfolio/research workflow, but the captured third-party assets should not be published or redistributed without permission from the rights holder.
