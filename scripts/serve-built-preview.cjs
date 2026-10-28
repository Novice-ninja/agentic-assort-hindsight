#!/usr/bin/env node
'use strict';

// Static frontend hosting only. Local API behavior remains in the browser fixtures.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const dist = fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, '..', 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('Built frontend missing. Keep dist beside this server, or run npm run build in the source project.');
  process.exit(1);
}
const root = fs.realpathSync(dist);
const portText = process.env.PORT ?? '5174';
if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) {
  console.error('PORT must be an integer from 1 to 65535.');
  process.exit(1);
}
const port = Number(portText);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.eot': 'application/vnd.ms-fontobject',
  '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
function inside(file) {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}
function reply(request, response, status, text, extra = {}) {
  const body = Buffer.from(text + '\n');
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extra,
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}
function existingFile(file) {
  try {
    const resolved = fs.realpathSync(file);
    if (!inside(resolved)) return { forbidden: true };
    const stat = fs.statSync(resolved);
    return stat.isFile() ? { file: resolved, stat } : {};
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return {};
    throw error;
  }
}
const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return reply(request, response, 405, 'This preview server hosts static frontend files only.', { Allow: 'GET, HEAD' });
  }
  let pathname;
  try {
    // Decode the original path before URL normalization so encoded traversal is rejected.
    pathname = decodeURIComponent((request.url ?? '/').split(/[?#]/, 1)[0]);
  } catch {
    return reply(request, response, 400, 'Malformed request path.');
  }
  if (!pathname.startsWith('/') || pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..')) {
    return reply(request, response, 403, 'Forbidden request path.');
  }
  const candidate = path.resolve(root, '.' + pathname);
  if (!inside(candidate)) return reply(request, response, 403, 'Forbidden request path.');
  try {
    let match = existingFile(candidate);
    if (match.forbidden) return reply(request, response, 403, 'Forbidden request path.');
    const acceptsHtml = /(?:^|,)\s*text\/html(?:\s*;[^,]*)?(?:,|$)/i.test(request.headers.accept ?? '');
    const reserved = /^\/(?:api(?:\/|$)|agentic-assort-go\/api(?:\/|$)|assets(?:\/|$)|vendor(?:\/|$))/i.test(pathname);
    if (!match.file && acceptsHtml && !reserved && !path.posix.extname(pathname)) {
      match = existingFile(path.join(root, 'index.html'));
    }
    if (!match.file) return reply(request, response, 404, 'Static file not found.');
    response.writeHead(200, {
      'Content-Type': mime[path.extname(match.file).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': match.stat.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      ...(path.basename(match.file) === 'mockServiceWorker.js' ? { 'Service-Worker-Allowed': '/' } : {}),
    });
    if (request.method === 'HEAD') return response.end();
    const stream = fs.createReadStream(match.file);
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  } catch {
    if (!response.headersSent) reply(request, response, 500, 'Unable to read the static file.');
    else response.destroy();
  }
});
server.on('error', (error) => {
  console.error(`Cannot start local preview: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Local preview: http://127.0.0.1:${port}/assort/hindsight`);
  console.log('Static frontend only. Keep this terminal open; press Ctrl+C to stop.');
});
