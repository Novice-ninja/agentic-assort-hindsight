// Optional private QA baseline. Never included in the public application build.
const http = require('http');
const fs = require('fs');
const path = require('path');
const publicRoot = path.resolve(__dirname, '../public');
const baselineRoot = path.resolve(__dirname, '../qa/baseline-public');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const candidates = [path.join(baselineRoot, pathname), path.join(publicRoot, pathname)];
  const safe = candidates.filter((p, i) => p.startsWith([baselineRoot, publicRoot][i] + path.sep));
  let file = safe.find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!file) file = path.join(baselineRoot, 'agentic-assort/index.html');
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Service-Worker-Allowed': '/' });
  fs.createReadStream(file).pipe(res);
}).listen(4180, '127.0.0.1', () => console.log('Private original frontend baseline: http://127.0.0.1:4180/agentic-assort/hindsight'));
