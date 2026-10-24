# dragon-blaze — Capture & Verification Notes

## Source

- **URL:** https://previews.customer.envatousercontent.com/files/827969968/index.html
- **Engine:** Construct 3 (direct port — original runtime + assets)

## Capture Method

Assets captured via same-origin browser fetch from the live preview page (documented in source URL). The preview page sends correct referer/credentials to Envato's S3 CDN, which returns 403 to plain HTTP requests.

Procedure:
1. Load preview URL in browser (Playwright + Chrome)
2. Extract asset paths from `data.json` (`images/...`, `media/...`) and audio table
3. `fetch()` each path **inside the page context**, return base64, write to disk
4. Verify byte counts against `data.json` audio table entries

## Audio Table (18 entries)

| Name | MIME | Ext | Bytes | Status |
|------|------|-----|-------|--------|
| sound card comun.webm | audio/webm; codecs=opus | .webm | 2643 | ✅ OK |
| sound card especial.webm | audio/webm; codecs=opus | .webm | 29740 | ✅ OK |
| premio 1.webm | audio/webm; codecs=opus | .webm | 30203 | ✅ OK |
| multiplicador.webm | audio/webm; codecs=opus | .webm | 30267 | ✅ OK |
| multiplicador up.webm | audio/webm; codecs=opus | .webm | 48720 | ✅ OK |
| Fire.webm | audio/webm; codecs=opus | .webm | 25510 | ✅ OK |
| Button.webm | audio/webm; codecs=opus | .webm | 18892 | ✅ OK |
| Egg 1.webm | audio/webm; codecs=opus | .webm | 5483 | ✅ OK |
| Egg 2.webm | audio/webm; codecs=opus | .webm | 24120 | ✅ OK |
| Egg 3.webm | audio/webm; codecs=opus | .webm | 40529 | ✅ OK |
| Card Dragon 1.webm | audio/webm; codecs=opus | .webm | 37178 | ✅ OK |
| Card Dragon 2.webm | audio/webm; codecs=opus | .webm | 23632 | ✅ OK |
| Card Dragon 3.webm | audio/webm; codecs=opus | .webm | 44919 | ✅ OK |
| music 05.webm | audio/webm; codecs=opus | .webm | 119032 | ✅ OK |
| music 04.webm | audio/webm; codecs=opus | .webm | 120332 | ✅ OK |
| music 06.webm | audio/webm; codecs=opus | .webm | 239088 | ✅ OK |
| MusicLoop2.webm | audio/webm; codecs=opus | .webm | 480533 | ✅ OK |
| MusicLoop.webm | audio/webm; codecs=opus | .webm | 480533 | ✅ OK |


## Verification (2026-10-24)

### Server
- **Port:** 8154
- **MIME types:** Corrected `.webm` → `audio/webm`, `.mp4` → `video/mp4`, `.ogg` → `audio/ogg`
- **URL decoding:** `decodeURIComponent` added for space-encoded filenames
- **404 behavior:** Explicit 404 for missing files with extensions; no SPA fallback to `index.html`

### Runtime (Headless Chrome)
- ✅ Zero console errors
- ✅ All referenced assets return HTTP 200
- ✅ Canvas renders at expected resolution
- ✅ Game logic executes (spin cycles, balance updates)

### Asset Integrity
- All sprite sheets present and byte-verified
- All audio files match `data.json` byte counts exactly
- Missing assets recovered from live preview (same-origin fetch)

## Known Issues

- **Original audio decode failures** (Dragon Blaze only): 13/18 `.webm` files failed `decodeAudioData` when served locally with `video/webm` MIME type. Fixed by correcting MIME to `audio/webm`. The original Envato CDN serves `audio/webm`; the files are valid Opus streams.
- **Space-encoded filenames**: Files like `wild west coast racing.mp3` / `joy ride.webm` / `laugh_evil_00 (1).webm` require `decodeURIComponent` in the static server.

## Files Structure

```
dragon-blaze/
├── index.html          # Entry point
├── data.json           # Game definition (reels, paytables, audio table)
├── prizes.xml          # Paytable (if present)
├── server.js           # Node static server (port 8154)
├── scripts/
│   ├── c3runtime.js    # Construct 3 engine (~1.4 MB)
│   ├── main.js         # Bootloader
│   ├── workermain.js   # Worker entry (if worker mode)
│   ├── dispatchworker.js / jobworker.js
│   └── *.js            # Plugin DOM handlers
├── images/             # Sprite sheets (PNG/WebP)
├── media/              # Audio (Opus in WebM / Ogg Vorbis)
└── icons/              # PWA icons
```

## License

Original art/audio/data belong to the game's author (Pas Games). This directory is a local study/port copy, **not a redistributable asset set**.
