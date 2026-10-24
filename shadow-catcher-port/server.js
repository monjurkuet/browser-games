const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const port = Number(process.env.PORT || 8791);
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.ogg':'audio/ogg','.mp3':'audio/mpeg','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.xml':'application/xml'};
http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const rel=pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file=path.resolve(root, rel);
  if (!file.startsWith(root+path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file,(err,st)=>{
    if(err || !st.isFile()) { res.writeHead(404,{'Content-Type':'text/plain'}); return res.end('Not found'); }
    const ext=path.extname(file).toLowerCase();
    const headers={'Content-Type':mime[ext]||'application/octet-stream','Content-Length':st.size};
    if(['.html','.js','.mjs','.css','.json'].includes(ext)) headers['Cache-Control']='no-store';
    res.writeHead(200,headers); fs.createReadStream(file).pipe(res);
  });
}).listen(port,'0.0.0.0',()=>console.log(`Shadow Catcher running at http://localhost:${port}/`));
