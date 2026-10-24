const http = require('http');
const fs = require('fs');
const path = require('path');

const requestedPort = process.env.PORT ?? '8154';
const PORT = Number(requestedPort);
const HOST = process.env.HOST ?? '127.0.0.1';
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webm': 'audio/webm',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.ico': 'image/x-icon',
  '.manifest': 'application/manifest+json',
  '.webmanifest': 'application/manifest+json',
};

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(`Invalid PORT: ${requestedPort}`);
}

function isInsideRoot(filePath) {
  const relative = path.relative(ROOT, filePath);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(req, res, filePath) {
  const mimeType = getMimeType(filePath);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
      }
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': content.length,
      'Cache-Control': ['.html', '.js', '.mjs', '.css', '.json', '.wasm'].includes(ext) ? 'no-store' : 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    });
    if (req.method === 'HEAD') return res.end();
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('405 Method Not Allowed');
  }

  // Normalize URL path - decode %20 etc.
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('400 Bad Request');
  }
  if (urlPath === '/') urlPath = '/index.html';

  // Prevent directory traversal
  const requestedPath = path.normalize(path.join(ROOT, urlPath));
  if (!isInsideRoot(requestedPath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  // Check if file exists
  fs.stat(requestedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Explicit 404 for missing files with extensions - NEVER fallback to index.html
      if (path.extname(requestedPath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Not Found');
      }
      // Only fallback for directory-like paths
      serveFile(req, res, path.join(ROOT, 'index.html'));
      return;
    }
    serveFile(req, res, requestedPath);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Dragon Blaze running at http://${HOST}:${PORT}/`);
});
