'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const project = path.resolve(__dirname, '../..');
const port = Number(process.env.PREVIEW_TEST_PORT || 5176);
const dist = process.env.PREVIEW_TEST_DIST || path.join(project, 'dist');
const checks = [];
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
const allFiles = files(dist);
function request(url, method = 'GET', accept = 'text/html') {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: url, method, headers: { Accept: accept } }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.end();
  });
}
async function check(name, url, status, expectedMime, method = 'GET', accept = 'text/html') {
  const result = await request(url, method, accept);
  assert.equal(result.status, status, name);
  if (expectedMime) assert.equal(result.headers['content-type'], expectedMime, name);
  if (method === 'HEAD') assert.equal(result.body.length, 0, name);
  checks.push({ name, path: url, method, status: result.status, mime: result.headers['content-type'], responseBytes: result.body.length });
  return result;
}
(async () => {
  const html = await check('HTML deep route fallback', '/agentic-assort/hindsight', 200, 'text/html; charset=utf-8');
  assert.match(html.body.toString(), /<html/);
  const canonical=await check('Canonical Assort deep route fallback', '/assort/hindsight', 200, 'text/html; charset=utf-8');
  assert.deepEqual(canonical.body,fs.readFileSync(path.join(dist,'index.html')));
  await check('Canonical Assort HEAD has no body', '/assort/hindsight', 200, 'text/html; charset=utf-8', 'HEAD');
  await check('Root HTML route', '/', 200, 'text/html; charset=utf-8');
  await check('HTML HEAD has no body', '/agentic-assort/hindsight', 200, 'text/html; charset=utf-8', 'HEAD');
  for (const [extension, expectedMime] of [
    ['.js', 'text/javascript; charset=utf-8'], ['.css', 'text/css; charset=utf-8'],
    ['.svg', 'image/svg+xml'], ['.woff2', 'font/woff2'], ['.json', 'application/json; charset=utf-8'],
  ]) {
    const sample = allFiles.find(file => file.endsWith(extension));
    assert.ok(sample, `No ${extension} file in dist`);
    await check(`${extension} asset MIME`, '/' + path.relative(dist, sample).split(path.sep).join('/'), 200, expectedMime);
  }
  const worker = await check('Service worker MIME', '/mockServiceWorker.js', 200, 'text/javascript; charset=utf-8');
  assert.equal(worker.headers['service-worker-allowed'], '/');
  await check('Missing JavaScript never becomes HTML', '/assets/does-not-exist.js', 404, 'text/plain; charset=utf-8');
  await check('Missing SVG never becomes HTML', '/vendor/does-not-exist.svg', 404, 'text/plain; charset=utf-8');
  await check('Missing extensionless asset never becomes HTML', '/vendor/does-not-exist', 404, 'text/plain; charset=utf-8');
  await check('Non-HTML route request has no fallback', '/agentic-assort/hindsight', 404, 'text/plain; charset=utf-8', 'GET', 'application/json');
  await check('GET API miss remains non-JSON for browser recovery', '/api/not-a-service', 404, 'text/plain; charset=utf-8');
  await check('Second API prefix never becomes HTML', '/agentic-assort-go/api/not-a-service', 404, 'text/plain; charset=utf-8');
  const post = await check('POST is not handled as a backend', '/api/not-a-service', 405, 'text/plain; charset=utf-8', 'POST');
  assert.equal(post.headers.allow, 'GET, HEAD');
  await check('Raw traversal guard', '/../package.json', 403, 'text/plain; charset=utf-8');
  await check('Encoded traversal guard', '/%2e%2e/package.json', 403, 'text/plain; charset=utf-8');
  await check('Encoded slash traversal guard', '/assets/%2e%2e%2f%2e%2e/package.json', 403, 'text/plain; charset=utf-8');
  await check('Backslash traversal guard', '/assets/%5c..%5cpackage.json', 403, 'text/plain; charset=utf-8');
  await check('Malformed encoding rejected', '/%zz', 400, 'text/plain; charset=utf-8');
  const result = { server: `http://127.0.0.1:${port}`, node: process.version, platform: process.platform, checks, passed: checks.length };
  fs.writeFileSync(path.join(__dirname, 'priority-preview-server-check.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ passed: checks.length }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
