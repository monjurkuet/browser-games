const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const realRoot = fs.realpathSync(root);
const requestedPort = process.env.PORT ?? '8801';
const port = Number(requestedPort);
const host = process.env.HOST ?? '127.0.0.1';

if (!/^\d+$/.test(requestedPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${requestedPort}`);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'audio/webm',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function isInsideRoot(file) {
  const relative = path.relative(realRoot, file);
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
  if (pathname.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad request');
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (!isInsideRoot(file)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.realpath(file, (realpathError, realFile) => {
    if (realpathError) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    if (!isInsideRoot(realFile)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    fs.stat(realFile, (error, stat) => {
      if (error || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
      }

      const extension = path.extname(realFile).toLowerCase();
      const headers = {
        'Content-Type': mime[extension] || 'application/octet-stream',
        'Content-Length': stat.size,
      };
      if (['.html', '.js', '.mjs', '.css', '.json', '.xml'].includes(extension)) {
        headers['Cache-Control'] = 'no-store';
      }

      if (req.method === 'HEAD') {
        res.writeHead(200, headers);
        return res.end();
      }

      res.writeHead(200, headers);
      const stream = fs.createReadStream(realFile);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
        }
        res.end('Not found');
      });
      stream.pipe(res);
    });
  });
});

server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Pirates Slot running at http://${host}:${port}/`);
});