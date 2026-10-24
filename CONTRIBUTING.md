# Contributing

This repository contains browser game ports for local study and development.

## Guidelines

- **Port fidelity**: Keep direct-port runtime and asset trees aligned with the original preview builds.
- **Engine separation**: Godot projects belong in a separate Godot workspace outside this browser-ports repository.
- **Server fixes**: Improvements to static servers (MIME types, URL handling, CORS) are the primary contribution area.
- **Documentation**: Update per-game NOTES.md and README.md when you verify or fix something.

## Usage

Each game directory contains a `server.js`. Run with Node.js:

```bash
cd <game-directory>
node server.js
```

Then open `http://localhost:<port>/` in a browser.

## Port Mapping

| Game | Port | Engine |
|------|------|--------|
| 777-slot-port | 8130 | Construct 3 |
| candy-kingdom-port | 8141 | Construct 3 |
| crazy-monkey-slot-machine | 8824 | Construct 3 |
| farm-slot-port | 8135 | Construct 3 |
| toyland-fortune | 8124 | Construct 3 |
| walking-death | 8619 | Construct 3 |
| zeus-slot-clone | 8124 | Construct 3 |
| dragon-blaze | 8154 | Construct 3 |
| shadow-catcher-port | 8791 | Custom HTML5/Canvas |
