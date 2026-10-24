const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);
const requestedPort = process.env.PORT ?? '8791';
const port = Number(requestedPort);
const host = process.env.HOST ?? '127.0.0.1';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${requestedPort}`);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
};

function isInsideRoot(file) {
  const relative = path.relative(root, file);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain' });
    return res.end('Method not allowed');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad request');
  }

  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, rel);
  if (!isInsideRoot(file)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }

    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
    };
    if (['.html', '.js', '.mjs', '.css', '.json'].includes(ext)) {
      headers['Cache-Control'] = 'no-store';
    }

    if (req.method === 'HEAD') {
      res.writeHead(200, headers);
      return res.end();
    }

    res.writeHead(200, headers);
    const stream = fs.createReadStream(file);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    });
    stream.pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`Shadow Catcher running at http://${host}:${port}/`);
});
