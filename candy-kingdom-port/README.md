# Candy Kingdom — Direct Port

**Engine:** Construct 3  
**Port type:** Direct port (original runtime and assets)  
**Local URL:** http://localhost:8141/

## Source

- Envato preview: https://previews.customer.envatousercontent.com/files/901226125/index.html
- Game title: Candy Kingdom
- Author credit embedded in the export: `tegagame.com`

## Run

```bash
cd candy-kingdom-port
node server.js
```

Open <http://localhost:8141/>. Set `PORT` to use a different port and `HOST` to bind to another interface (default: `127.0.0.1`). The game must be served over HTTP; it cannot run from `file://`.

## Requirements

- Node.js 18+
- A modern browser with WebGL, ES modules, and service-worker support

## Captured files

- Construct runtime and project scripts
- `data.json` game definition
- 20 WebP image atlases
- 13 WebM audio files
- Font, icons, manifest, service worker, and source HTML/CSS

The server returns explicit 404s for missing files (there is no SPA fallback), correct WebM audio MIME types, and `no-store` headers for HTML/JavaScript/CSS/JSON.

## Verification

See [NOTES.md](NOTES.md) for the capture inventory and runtime test results.

## License notice

The original art, audio, game data, and runtime belong to their respective copyright holders. This directory is a local direct-port study copy and is not a redistributable asset set. See the repository-level license and contribution notes.
