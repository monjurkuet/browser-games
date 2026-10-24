# Magic Ace — clean-room HTML5 slot

A functional, IP-safe clone inspired by JDB's **Magic Ace** mechanics:

- 5 × 3 reels with 243 ways to win
- Card ranks A–2, golden symbols, and joker wilds
- Cascading wins with a Booming Multiplier up to ×5
- Free Spins purchase (50× stake), starting multiplier ×2
- Extra Bet toggle, adjustable stake, paytable overlay
- Responsive portrait layout with a hardened local static server

This project does **not** contain JDB's original artwork, audio, fonts, game code, paytable, or branding. It is a clean-room implementation and should not be represented as the official game.

## Run

```bash
cd magic-ace-slot-port
node server.js
```

Open <http://127.0.0.1:8139/>.

Optional environment variables:

- `PORT` — decimal port number (default `8139`)
- `HOST` — bind address (default `127.0.0.1`)

## Provenance

Behavior reference: the public Magic Ace product description at <https://www.jdbgaming.com/en/games/slot/magic-ace>, captured 2026-10-24. Implementation and presentation are original and use no extracted JDB assets.
