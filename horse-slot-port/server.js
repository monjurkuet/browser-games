const http = require('http');
const fs = require('fs');
const path = require('path');

const requestedPort = process.env.PORT || '8161';
const PORT = Number(requestedPort);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.wasm': 'application/wasm', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webm': 'audio/webm', '.mp4': 'video/mp4', '.ogg': 'audio/ogg', '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject', '.ico': 'image/x-icon'
};

if (!/^\d+$/.test(requestedPort) || !Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(`Invalid PORT: ${requestedPort}`);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('405 Method Not Allowed');
  }
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); }
  catch { res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('400 Bad Request'); }
  if (urlPath.includes('\0')) { res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('400 Bad Request'); }
  if (urlPath === '/') urlPath = '/index.html';
  const target = path.resolve(ROOT, '.' + path.posix.normalize(urlPath));
  const relative = path.relative(ROOT, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('403 Forbidden');
  }
  fs.stat(target, (err, stats) => {
    if (err || !stats.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 Not Found'); }
    fs.readFile(target, (readErr, body) => {
      if (readErr) { res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('500 Internal Server Error'); }
      const ext = path.extname(target).toLowerCase();
      const noStore = ['.html', '.js', '.mjs', '.css', '.json', '.xml'].includes(ext);
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Content-Length': body.length,
        'Cache-Control': noStore ? 'no-store' : 'public, max-age=3600'
      });
      if (req.method === 'HEAD') return res.end();
      res.end(body);
    });
  });
});
server.on('error', error => { console.error(`Server error: ${error.message}`); process.exitCode = 1; });
server.listen(PORT, HOST, () => console.log(`Horse slot server: http://${HOST}:${PORT}/`));
