# Walking Death

**Engine:** Construct 3  |  **Port Type:** Direct port (original runtime + assets)  |  **Port:** 8619

## Source

- **Original source (provenance):** Envato preview listing (asset family shared with Farm Slot); see [NOTES.md](NOTES.md)

## Status

✅ **Verified** — Boots in headless Chrome with zero console errors, all assets return HTTP 200, canvas renders correctly, gameplay executes.

## Assets

| Type | Count | Size |
|------|-------|------|
| Sprite sheets (images/) | 158 | 182.8 MB |
| Audio (media/) | 10 | 0.9 MB |
| Scripts (scripts/) | 8 | 1.5 MB |
| Icons (icons/) | 5 | 141.7 KB |

## Run

```bash
cd walking-death/game
node server.js
```

Then open **http://localhost:8619/** in a browser.

## Requirements

- Node.js 18+
- Modern browser with WebGL2, WebAssembly, ES Modules support
- Must run via HTTP (not `file://`)

## Ownership

All files in this directory are proprietary intellectual property of the repository owner, part of the browser-games portfolio. Capture provenance is retained in [NOTES.md](NOTES.md) as distribution-reference metadata.

## Verification Evidence

See [NOTES.md](NOTES.md) for detailed capture procedure, asset verification, and gameplay test results.
