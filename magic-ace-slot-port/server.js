const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const portRaw = process.env.PORT || '8139';
if (!/^\d+$/.test(portRaw)) throw new Error('PORT must be a decimal integer');
const port = Number(portRaw);
const host = process.env.HOST || '127.0.0.1';
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.ico':'image/x-icon','.webm':'audio/webm','.mp4':'video/mp4','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.xml':'application/xml','.wasm':'application/wasm','.woff':'font/woff','.woff2':'font/woff2'};

http.createServer((req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); return res.end('Method Not Allowed'); }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); return res.end('Bad Request'); }
  if (pathname.includes('\0')) { res.writeHead(400); return res.end('Bad Request'); }
  let target = path.resolve(root, '.' + pathname);
  let rel = path.relative(root, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(target, (err, stat) => {
    if (!err && stat.isDirectory()) target = path.join(target, 'index.html');
    fs.realpath(target, (realErr, real) => {
      if (realErr) { res.writeHead(404); return res.end('Not Found'); }
      const realRel = path.relative(root, real);
      if (realRel.startsWith('..') || path.isAbsolute(realRel)) { res.writeHead(403); return res.end('Forbidden'); }
      fs.stat(real, (err2, st) => {
        if (err2 || !st.isFile()) { res.writeHead(404); return res.end('Not Found'); }
        const ext = path.extname(real).toLowerCase();
        const headers = {'Content-Type': mime[ext] || 'application/octet-stream', 'Content-Length': st.size, 'X-Content-Type-Options':'nosniff'};
        if (['.html','.js','.css','.json'].includes(ext)) headers['Cache-Control'] = 'no-store';
        res.writeHead(200, headers);
        if (req.method === 'HEAD') return res.end();
        const stream = fs.createReadStream(real);
        stream.on('error', () => { if (!res.headersSent) res.writeHead(404); res.end(); });
        stream.pipe(res);
      });
    });
  });
}).listen(port, host, () => console.log(`Magic Ace running at http://${host}:${port}`));
