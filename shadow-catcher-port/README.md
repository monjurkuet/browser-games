# Shadow Catcher — direct HTML5 port

Local study copy of the Envato preview build for **Shadow Catcher — Responsive HTML5 Slot Game Template**.

## Run

```bash
cd shadow-catcher-port
node server.js
```

Open <http://localhost:8791/>. Set `PORT` to use a different port and `HOST` to bind to another interface (default: `127.0.0.1`).

## What was captured

- Original preview HTML, CSS, configuration, game logic, math module, sprite atlases, character/effect sheets, videos, and bank-loop audio.
- Runtime asset inventory was captured from the live preview and downloaded into the matching directory structure.
- A local Node server provides explicit MIME types, `no-store` for code/config files, and true 404 responses for missing assets.

## Verification

- The live preview boots at 784×469.
- The local build boots at `http://localhost:8791/` with the same title.
- Captured diagnostics report zero uncaught errors and zero unhandled promise rejections.
- The title/background scene renders, the continue overlay advances, and the main slot screen renders with reels, symbols, balance, bet size, and controls.
- Canvas output changes substantially after entering the game (hash payload expanded from ~12 KB on the initial black frame to ~876 KB on the rendered game frame).
- The original preview's `config/character-brand.json` layout configuration is included; it controls character scale and anchoring.
- All seven character animation manifests load, along with the four custom font atlases.
- Final automated audit: 784×469 canvas, visible document, 7/7 character manifests, zero console errors, zero unhandled rejections, and a non-empty rendered canvas (~778 KB data payload).

## Source

- CodeCanyon item: <https://codecanyon.net/item/shadow-catcher-responsive-html5-slot-game-template/65214801>
- Preview: <https://previews.customer.envatousercontent.com/files/878054016/index.html>
