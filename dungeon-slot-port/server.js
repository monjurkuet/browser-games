const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 8137);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = path.resolve(__dirname);
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.wasm': 'application/wasm',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webm': 'audio/webm', '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
  '.ico': 'image/x-icon', '.manifest': 'application/manifest+json'
};
function mime(file) { return MIME_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream'; }
function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body);
}
const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method Not Allowed');
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { return send(res, 400, 'Bad Request'); }
  if (pathname.includes('\0')) return send(res, 400, 'Bad Request');
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(path.join(ROOT, pathname));
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden');
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, '404 Not Found');
    const type = mime(file);
    const headers = { 'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control': type.includes('text/html') || type.includes('javascript') || type.includes('json') || type.includes('css') ? 'no-store' : 'public, max-age=31536000' };
    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(PORT, HOST, () => console.log(`Dungeon Slot server: http://${HOST}:${PORT}/`));
