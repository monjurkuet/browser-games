# Construct 3 Game Structure & File Discovery

## Asset Location Patterns

### iframe Embedding
Construct 3 games on construct.net are often embedded via iframe:
- Page URL: `https://construct.net/en/free-online-games/<id>/play`
- iframe data-src: `https://construct-arcade.com/<id>/<version>/index.html`

The actual game files are served from construct-arcade.com, not games.construct.net.

### CDN Asset Discovery
Assets are typically stored at:
- `https://construct-arcade.com/<game-id>/<version>/<path>`
- `https://construct-static.com/uploads/.../` for shared assets

## Required Files for Direct Port

### Core Files
- `index.html` - Game entry point
- `appmanifest.json` - PWA manifest
- `data.json` - Game configuration and state
- `style.css` - Game CSS

### Scripts
- `scripts/main.js` - Main game logic (ES module)
- `scripts/c3runtime.js` - Construct 3 runtime
- `scripts/supportcheck.js` - Browser compatibility
- `scripts/offlineclient.js` - Offline handling
- `scripts/register-sw.js` - Service worker registration
- `workermain.js` - Worker entry point
- `scripts/dispatchworker.js` - Event dispatch worker
- `scripts/jobworker.js` - Job scheduler worker

### Missing/Stubs
- `scriptsInEvents.js` - May need to be created as empty stub
- `previewworker.js` - May need to be created as empty stub

### Assets
- `icons/` - Game icons (16, 32, 114, 128, 256 png)
- `images/` - Sprite sheets (shared-0-sheet*.webp, sprite32-sheet*.png)
- `media/` - Audio files (*.webm)

## File Discovery Commands

### Find all URLs in HTML
```python
import re
import requests

html = requests.get(url).text
urls = re.findall(r'(https://[^\s"\']+)', html)
```

### Look for asset references in main.js
```python
# Find file patterns
file_refs = re.findall(r'"([^"]+\.(?:js|json|webp|png|webm|xml))"', main_js_content)
```

### Check Construct 3 game data structure
```python
# Search for sprite sheet names in data.json
sprite_refs = re.findall(r'"images/([^"]+\.png)"', json_content)
```

## Server Configuration

### Critical MIME Types for Construct 3
```javascript
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
    '.wasm': 'application/wasm',           // REQUIRED
    '.webp': 'image/webp',                  // REQUIRED
    '.webm': 'video/webm',                  // REQUIRED
    '.png': 'image/png',
    '.xml': 'application/xml',
    '.manifest': 'application/manifest+json'
};
```

### Common Issues
1. **Worker MIME type errors**: Serve `.js` files with `application/javascript`
2. **Magic bytes guessing**: Some CDNs return raw bytes, sniff `0x1f 0x8b` for gzip
3. **External icon references**: Replace construct-static.com URLs with local icons

## Verification Checklist

- [ ] All directory structures preserved from original
- [ ] server.js running with correct MIME types
- [ ] Game loads without console errors
- [ ] Canvas renders correctly
- [ ] Spin functionality works
- [ ] All assets load (check Network tab)