# Contributing

This repository contains educational ports of Construct 3 games for study purposes.

## Guidelines

- **No asset redistribution**: Game assets (images, audio, data.json) are copyrighted by their original authors. This repo contains local study copies only.
- **Clean-room rebuilds welcome**: If you create clean-room implementations using CC0/royalty-free assets, PRs are welcome.
- **Server fixes only**: Improvements to static servers (MIME types, URL handling, CORS) are the primary contribution area.
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
| crazy-monkey-slot-machine | 8824 | Construct 3 |
| farm-slot-port | 8135 | Construct 3 |
| toyland-fortune | 8124 | Construct 3 |
| walking-death | 8619 | Construct 3 |
| zeus-slot-clone | 8124 | Construct 3 |
| dragon-blaze | 8154 | Godot 4 (C#) |
| shadow-catcher-port | 8791 | Custom HTML5/Canvas |
