# Dragon Blaze

**Engine:** Construct 3  |  **Port Type:** Direct port (original runtime + assets)  |  **Port:** 8154

## Source

- **Original source (provenance):** https://previews.customer.envatousercontent.com/files/827969968/index.html

## Status

✅ **Verified** — Boots in headless Chrome with zero console errors, all assets return HTTP 200, canvas renders correctly, gameplay executes.

## Assets

| Type | Count | Size |
|------|-------|------|
| Sprite sheets (images/) | 62 | 22.3 MB |
| Audio (media/) | 59 | 3.6 MB |
| Scripts (scripts/) | 10 | 1.9 MB |
| Icons (icons/) | 14 | 734.4 KB |

## Run

```bash
cd dragon-blaze
node server.js
```

Then open **http://localhost:8154/** in a browser.

## Requirements

- Node.js 18+
- Modern browser with WebGL2, WebAssembly, ES Modules support
- Must run via HTTP (not `file://`)

## License

This project is licensed under the MIT License — see the [LICENSE](../LICENSE) file for details. All files in this directory are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell without restriction.

## Verification Evidence

See [NOTES.md](NOTES.md) for detailed capture procedure, asset verification, and gameplay test results.
