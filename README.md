# browser-games

Educational collection of browser game ports for local study and reverse-engineering reference.

## Games

| Game | Engine | Port Type | Port | Status | Source |
|------|--------|-----------|------|--------|--------|
| [777-slot-port](777-slot-port) | Construct 3 | Direct port | 8130 | ✅ Verified | [construct-arcade.com](https://construct-arcade.com/50913/57353/index.html) |
| [crazy-monkey-slot-machine](crazy-monkey-slot-machine) | Construct 3 | Direct port | 8824 | ✅ Verified | [Envato](https://previews.customer.envatousercontent.com/files/348452483/index.html) |
| [farm-slot-port](farm-slot-port) | Construct 3 | Direct port | 8135 | ✅ Verified | [Envato](https://previews.customer.envatousercontent.com/files/816530950/index.html) |
| [toyland-fortune](toyland-fortune) | Construct 3 | Direct port | 8124 | ✅ Verified | [CodeCanyon](https://codecanyon.net/item/toyland-fortune-html5-game/65042715) |
| [walking-death](walking-death) | Construct 3 | Direct port | 8619 | ✅ Verified | Pas Games (Envato) |
| [zeus-slot-clone](zeus-slot-clone/c3-direct-port) | Construct 3 | Direct port | 8124 | ✅ Verified | [CodeCanyon](https://preview.codecanyon.net/item/zeus-slot-html5-game/full_screen_preview/64947875) |
| [candy-kingdom-port](candy-kingdom-port) | Construct 3 | Direct port | 8141 | ✅ Verified | [Envato](https://previews.customer.envatousercontent.com/files/901226125/index.html) |
| [dragon-blaze](dragon-blaze) | Construct 3 | Direct port | 8154 | ✅ Verified | [Envato](https://previews.customer.envatousercontent.com/files/827969968/index.html) |
| [shadow-catcher-port](shadow-catcher-port) | Custom HTML5/Canvas | Direct port | 8791 | ✅ Verified | [Envato](https://previews.customer.envatousercontent.com/files/878054016/index.html) |

## Quick Start

Each game is a self-contained static server:

```bash
# Example: 777 Slot Machine
cd 777-slot-port
node server.js
# Opens http://localhost:8130/
```

All games require HTTP(S) — they **will not work** via `file://` protocol due to:
- Web Workers / Service Workers
- ES Module loading
- WebAssembly instantiation
- Cross-origin resource policies

## Repository Structure

```
browser-games/
├── 777-slot-port/              # Construct 3 direct port
├── candy-kingdom-port/         # Construct 3 direct port
├── crazy-monkey-slot-machine/  # Construct 3 direct port
├── farm-slot-port/             # Construct 3 direct port
├── toyland-fortune/            # Construct 3 direct port
├── walking-death/              # Construct 3 direct port (in game/ subdir)
├── zeus-slot-clone/
│   └── c3-direct-port/         # Construct 3 direct port
├── dragon-blaze/               # Construct 3 direct port
└── shadow-catcher-port/        # Custom HTML5/Canvas direct port
```

Each game directory contains:
- `server.js` — Node.js static server with correct MIME types
- `index.html` — Game entry point
- `data.json` — Game definition (reels, paytables, audio table, layout)
- `scripts/` — Runtime scripts (c3runtime.js, main.js, workers)
- `images/` — Sprite sheets (PNG/WebP)
- `media/` — Audio (Opus in WebM / Ogg Vorbis)
- `icons/` — PWA icons
- `README.md` / `NOTES.md` — Game-specific documentation

## Verification Status

The listed ports have been booted in headless Chrome and verified:
- ✅ Zero console errors
- ✅ All referenced assets return HTTP 200
- ✅ Canvas renders at expected resolution
- ✅ Game logic executes (spin cycles, balance updates, etc.)

See each game's documentation for detailed verification evidence.

## Asset Recovery

Missing audio assets were recovered from original Envato/CodeCanyon previews via same-origin browser fetch (documented in each game's `NOTES.md`). Files are byte-identical to original CDN assets.

## Related Work

- [bet-listening](https://github.com/monjurkuet/bet-listening) — Live trial automation pipeline
- [wild-bounty-clone](https://github.com/monjurkuet/wild-bounty-clone) — Clean-room PG Soft Wild Bounty rebuild
