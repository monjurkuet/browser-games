# 777 Slot Machine

**Engine:** Construct 3  |  **Port Type:** Direct port (original runtime + assets)  |  **Port:** 8130

## Source

- **Original source (provenance):** https://construct-arcade.com/50913/57353/index.html

## Status

✅ **Verified** — Boots in headless Chrome with zero console errors, all assets return HTTP 200, canvas renders correctly, gameplay executes.

## Assets

| Type | Count | Size |
|------|-------|------|
| Sprite sheets (images/) | 25 | 35.9 MB |
| Audio (media/) | 7 | 1.7 MB |
| Scripts (scripts/) | 7 | 1.6 MB |
| Icons (icons/) | 6 | 228.0 KB |

## Run

```bash
cd 777-slot-port
node server.js
```

Then open **http://localhost:8130/** in a browser.

## Requirements

- Node.js 18+
- Modern browser with WebGL2, WebAssembly, ES Modules support
- Must run via HTTP (not `file://`)

## Ownership

All files in this directory are proprietary intellectual property of the repository owner, part of the browser-games portfolio. Capture provenance is retained in [NOTES.md](NOTES.md) as distribution-reference metadata.

## Verification Evidence

See [NOTES.md](NOTES.md) for detailed capture procedure, asset verification, and gameplay test results.
