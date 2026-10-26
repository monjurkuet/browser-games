# Western Slot Port — Build Notes

## Source
- Preview URL: `https://previews.customer.envatousercontent.com/files/659692993/index.html`
- Engine: Phaser 3.88.2 (bundled as `js/phaser.js`)
- Configuration: `js/slotConfig3x5.js` — western 3×5, 20 lines, wild + scatter (free spins), line-bet multiplier

## Asset capture
All 113 runtime assets plus `index.html` (114 files) downloaded directly from the Envato preview CDN via `scripts/capture_envato_659692993.py`. The preview's Phaser loader queues every game file during `preload()`; all resolve locally. Verified via CDP audit against both original and local URLs.

| Category | Count | Notes |
|---|---|---|
| JS runtime | 7 | phaser.js, slotConfig3x5.js, mkutils.js, popups.js, state_machine.js, slot_classes.js, slotGame.js |
| UI sprites (png/) | 30 | Background, machine frame, reels, ropes, nails, wanted sign, panels, buttons, CoinSheet.png |
| GUI sprites (png/gui/) | 31 | Panels, buttons, logo, win panels, paytable, sound/music toggles, whiteBkg |
| Symbols (png/Symbols/) | 10 | Whiskey, Dice, Bag, Bandit2, Bandit1, Cuper, Gold, Silver, Wild, Scatter |
| Symbols blurred (png/SymbolsBlurred/) | 10 | Blurred variants for win effects |
| Symbol sheets (png/SymbolsSheet/) | 10 | Animated spritesheets |
| Audio (audio/) | 9 | box_click.ogg, mixkit_win.wav, button.wav, spin_sound.wav, win_coins.wav, lose.wav, background.wav, respin.wav, scatter.wav |
| Bitmap fonts (fonts/) | 6 | oldtown_48_0/1/2 .png + .xml (3 fonts) |
| HTML | 1 | index.html |

Total: 50,634,908 bytes (~50.6 MB)

## Local server
`server.js` is a hardened Node.js static server:
- Explicit MIME map (JS, PNG, WAV, OGG, MP3, XML, etc.)
- `Cache-Control: no-store` for HTML/JS/CSS/JSON/XML
- Path containment checks (pre-resolve and post-`realpath`)
- Only `GET`/`HEAD` allowed; 405 for others
- 400 for malformed percent-encoding or NUL bytes
- Binds `127.0.0.1` by default; `HOST` override for LAN access

## Verification
Ran `node scripts/audit_western_slot.mjs` (CDP-driven headless Chrome, original URL then local server):
- Original preview: boots to `IddleState`, HUD balance 100000 / total bet 20 / win 0
- Local port: identical state, identical HUD values, identical canvas payload length (12154)
- Zero console errors, uncaught errors, or unhandled rejections on both
- Canvas 784×469, `visibilityState: visible` on both
- Resource inventories match: the same 113 normalized game paths requested on both (the browser's favicon request 404s identically and produces no console error)

## Demo-build limitation
The Envato preview is a demo build whose spin control is non-interactive (`slotSpinButton.input` is not enabled; no programmatic spin entry point is exposed). Spin-cycle parity therefore cannot be exercised on either the original or the local copy. Separately, some features referenced in code (payline buttons, line bet controls, jackpot panel, handle) have `fileName: null` in config and are not visually present. The preview uses `selectedLines: 'all'` (20 lines) with fixed line bet UI.

## Attribution
All code, artwork, audio, and fonts © their respective creators (Envato / MKeyStudio). Captured for local portfolio/research use only.