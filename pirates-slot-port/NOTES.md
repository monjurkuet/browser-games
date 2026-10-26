# Pirates Slot Port — Build Notes

## Source
- Preview URL: `https://previews.customer.envatousercontent.com/files/659690412/index.html`
- Engine: Phaser 3.88.2 (bundled as `js/phaser.js`)
- Configuration: `js/slotConfig3x5.js` — pirates V2 3×5, 243 lines, ~85% RTP

## Asset capture
All 132 runtime assets downloaded directly from the Envato preview CDN via `scripts/capture_envato_659690412.py`. The preview's Phaser loader queues 122 files during `preload()`; all resolve locally. Verified via CDP audit against both original and local URLs.

| Category | Count | Notes |
|---|---|---|
| JS runtime | 7 | phaser.js, slotConfig3x5.js, mkutils.js, popups.js, state_machine.js, slot_classes.js, slotGame.js |
| UI sprites (png/) | 34 | Background, machine frame, reels, lanterns, panels, buttons, gui |
| Symbols (png/Symbols/) | 12 | Smoke, Spyglass, Saber, Peaks, Bag, Pistol, Cross, Hearts, Diamonds, Wild, Scatter, Jackpot |
| Symbols blurred (png/SymbolsBlurred/) | 12 | Blurred variants for win effects |
| Symbol sheets (png/SymbolsSheet/) | 12 | Animated spritesheets (281×281 frames) |
| Coin sheet | 1 | CoinSheet.png (113×113 frames) |
| Audio (audio/) | 8 | box_click.ogg/mp3, mixkit_win.wav, button.wav, spin_sound.wav, win_coins.wav, lose.wav, background.wav |
| Bitmap fonts (fonts/) | 6 | DosisEB_64_0/1/2 .png + .xml (3 fonts) |
| HTML | 1 | index.html |

Total: 41.2 MB

## Local server
`server.js` is a hardened Node.js static server:
- Explicit MIME map (JS, PNG, WAV, OGG, MP3, XML, etc.)
- `Cache-Control: no-store` for HTML/JS/CSS/JSON/XML
- Path containment checks (pre-resolve and post-`realpath`)
- Only `GET`/`HEAD` allowed; 405 for others
- 400 for malformed percent-encoding or NUL bytes
- Binds `127.0.0.1` by default; `HOST` override for LAN access

## Verification
Ran `node scripts/audit_pirates_slot.mjs` (CDP-driven headless Chrome):
- Original preview: `IddleState` → `NormalSpinState` (12 samples) → `WinState`, balance 100000 → 99757 (bet 243)
- Local port: identical state sequence, identical balance delta
- Zero console errors, uncaught errors, unhandled rejections on both
- Canvas 784×469, payload length 12154, `visibilityState: visible`
- Resource inventories match (132 entries each)

## Known differences from full game
The Envato preview is a demo build; some features referenced in code (payline buttons, line bet controls, wheel mini-game) have `fileName: null` in config and are not visually present. The preview uses `selectedLines: 'all'` (243 ways) with fixed line bet UI.

## Attribution
All code, artwork, audio, and fonts © their respective creators (Envato / MKeyStudio). Captured for local portfolio/research use only.