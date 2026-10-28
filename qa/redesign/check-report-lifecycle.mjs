import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/assort/hindsight', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'MutationObserver', 'getComputedStyle']) Object.defineProperty(globalThis, key, { value: key === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[key], configurable: true });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window); globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
dom.window.HTMLElement.prototype.scrollIntoView = function () {}; dom.window.scrollTo = () => {};
const React = await import('react'), { createRoot } = await import('react-dom/client'), { createServer } = await import('vite'), { default: createCache } = await import('@emotion/cache');
const unbound = createHttpServer(), server = await createServer({ server: { middlewareMode: true, hmr: { server: unbound } }, appType: 'custom', logLevel: 'error' }), root = createRoot(document.getElementById('root'));
const checks = [];
try {
  const ui = await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx');
  const lifecycle = await server.ssrLoadModule('/src/modules/hindsight/redesign/context/ReportStateContext.tsx');
  const emotion = await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js');
  let api, changeScope, changeStoreVisibility, scopeValue, mounts = 0;
  const originalScope = { category: 'Flooring', productIds: ['A01', 'A02'], storeIds: ['ST1001'], localSelection: { pairIds: ['A01:ST1001'] }, hiddenColumns: ['gmRate'] };
  const reportA = lifecycle.reportIdForTitle('Item performance'), reportB = lifecycle.reportIdForTitle('Store performance');
  function Probe() { api = lifecycle.useReportStates(); return null; }
  function StatefulBody({ category }) {
    const [selected, setSelected] = React.useState(false), [sort, setSort] = React.useState('desc');
    React.useEffect(() => { mounts++; }, []);
    return React.createElement('div', { 'data-stateful-body': true, style: { height: 300 } }, React.createElement('p', null, `${category} source values`), React.createElement(ui.DesignCheckbox, { checked: selected, 'aria-label': 'Select exact row', onChange: event => setSelected(event.target.checked) }), React.createElement(ui.Button, { onClick: () => setSort(value => value === 'desc' ? 'asc' : 'desc') }, `Sort ${sort}`), React.createElement('output', { 'aria-label': 'Preserved table state' }, JSON.stringify({ selected, sort, hidden: ['gmRate'] })));
  }
  function Harness() {
    const [scope, setScope] = React.useState(originalScope); changeScope = setScope; scopeValue = scope;
    const [showStore, setShowStore] = React.useState(true); changeStoreVisibility = setShowStore;
    return React.createElement(lifecycle.ReportStateProvider, { scopeKey: JSON.stringify(scope), evidenceDate: '2026-07-31T08:00:00Z' }, React.createElement(Probe), React.createElement(ui.WorkspaceCard, { title: 'Item performance', actions: React.createElement(ui.Button, null, 'Item evidence options') }, React.createElement(StatefulBody, { category: scope.category })), showStore && React.createElement(ui.WorkspaceCard, { title: 'Store performance' }, React.createElement('div', { 'data-other-body': true, style: { height: 180 } }, '45 store source rows')), React.createElement(ui.WorkspaceCard, { title: 'Membership history' }, React.createElement(ui.DataState, { state: 'missing', title: 'Range feed not connected' })), React.createElement(ui.WorkspaceCard, { title: 'Empty local cut' }, React.createElement(ui.DataState, { state: 'empty', title: 'No matching pairs' })));
  }
  await React.act(async () => root.render(React.createElement(emotion.CacheProvider, { value: createCache({ key: 'reportqa' }) }, React.createElement(Harness))));
  assert.deepEqual(api.components.map(component => component.id).sort(), ['report-empty-local-cut', 'report-item-performance', 'report-membership-history', 'report-store-performance']);
  assert(api.components.every(component => component.title.length));
  checks.push({ name: 'Actual WorkspaceCards register stable semantic IDs and readable titles', pass: true });
  const card = id => document.querySelector(`[data-report-id="${id}"]`), body = document.querySelector('[data-stateful-body]');
  await React.act(async () => { document.querySelector('input[aria-label="Select exact row"]').click(); [...body.querySelectorAll('button')].find(button => button.textContent === 'Sort desc').click(); });
  const stateBefore = body.querySelector('output').textContent; assert.match(stateBefore, /"selected":true/); assert.match(stateBefore, /"sort":"asc"/);
  await React.act(async () => api.setPhase(reportA, 'loading'));
  assert.equal(card(reportA).dataset.reportState, 'loading'); assert.equal(card(reportB).dataset.reportState, 'ready');
  assert(card(reportA).querySelector('[role="status"][aria-label="Loading Item performance"]'));
  assert(card(reportA).querySelector('[aria-busy="true"]')); assert(body.parentElement.hasAttribute('inert')); assert.equal(body.parentElement.getAttribute('aria-hidden'), 'true');
  assert.strictEqual(document.querySelector('[data-stateful-body]'), body); assert.equal(body.style.height, '300px'); assert(!card(reportA).querySelector('button[aria-label^="Retry"]'));
  assert(!document.body.textContent.match(/apparel|footwear|outlet/i)); assert.deepEqual(scopeValue, originalScope);
  checks.push({ name: 'Loading affects one report, retains the original mounted body footprint, hides it semantically, and preserves scope and selected rows', pass: true });
  await React.act(async () => { api.setPhase(reportA, 'failure'); api.setPhase(reportB, 'failure'); });
  assert.equal(document.querySelectorAll('button[aria-label^="Retry "]').length, 2);
  await React.act(async () => card(reportA).querySelector('button[aria-label="Retry Item performance"]').click());
  assert.equal(card(reportA).dataset.reportState, 'ready'); assert.equal(card(reportB).dataset.reportState, 'failure'); assert.equal(api.getState(reportA).retryCount, 1);
  assert.strictEqual(document.querySelector('[data-stateful-body]'), body); assert.equal(body.querySelector('output').textContent, stateBefore); assert.equal(mounts, 1); assert(!body.parentElement.hasAttribute('inert')); assert.deepEqual(scopeValue, originalScope);
  assert.strictEqual(document.activeElement, card(reportA).querySelector('h2'));
  checks.push({ name: 'Real Impact Retry button restores only the failed card; unrelated failure, child identity, selection, sort and hidden columns survive', pass: true });
  await React.act(async () => api.setPhase(reportA, 'retained-failure'));
  assert.match(card(reportA).querySelector('[role="alert"]').textContent, /Source refreshed 2026-07-31T08:00:00Z/);
  assert.match(card(reportA).querySelector('[role="alert"]').textContent, /Local rehearsal/); assert.equal(body.parentElement.getAttribute('aria-hidden'), null); assert(!body.parentElement.hasAttribute('inert')); assert.equal(body.querySelector('output').textContent, stateBefore);
  checks.push({ name: 'Retained failure keeps current evidence readable with its exact source refresh timestamp and explicit local-rehearsal disclosure', pass: true });
  const missing = card('report-membership-history'), empty = card('report-empty-local-cut');
  assert.match(missing.textContent, /Range feed not connected/); assert.match(empty.textContent, /No matching pairs/); assert(!missing.querySelector('button[aria-label^="Retry"]')); assert(!empty.querySelector('button[aria-label^="Retry"]'));
  checks.push({ name: 'Legitimate missing-feed and empty-result states remain distinct and do not acquire misleading retry actions', pass: true });
  await React.act(async () => changeScope({ ...originalScope, category: 'Bamboo', productIds: ['B01'] }));
  assert.equal(card(reportA).dataset.reportState, 'ready'); assert.equal(card(reportB).dataset.reportState, 'ready'); assert.match(body.textContent, /Bamboo source values/); assert(!body.textContent.includes('Flooring source values')); assert.equal(body.querySelector('output').textContent, stateBefore); assert.equal(mounts, 1);
  await React.act(async () => changeScope(originalScope)); assert.equal(card(reportA).dataset.reportState, 'ready'); assert.equal(card(reportB).dataset.reportState, 'ready');
  checks.push({ name: 'New scope clears component rehearsals without remounting the table or flashing an unrelated category; returning Back does not reactivate a stale failure', pass: true });
  await React.act(async () => api.setPhase(reportA, 'loading')); await React.act(async () => api.retry(reportA)); assert.equal(card(reportA).dataset.reportState, 'loading'); await React.act(async () => api.setPhase(reportA, 'ready'));
  assert.equal(card(reportA).dataset.reportState, 'ready'); assert.equal(api.getState(reportA).retryCount, 0);
  checks.push({ name: 'Retry is limited to actual failure states; Ready rehearsal restores a loading card without invoking any workspace reset', pass: true });
  await React.act(async () => changeStoreVisibility(false)); assert(!api.components.some(component => component.id === reportB)); assert(api.components.some(component => component.id === reportA)); assert.strictEqual(document.querySelector('[data-stateful-body]'), body);
  await React.act(async () => root.unmount()); assert.equal(document.querySelectorAll('[data-report-id]').length, 0);
  checks.push({ name: 'A removed report deregisters from the live target list without remounting neighboring content; workspace cleanup succeeds', pass: true });
  const result = { requirement: 'HSP60-loading-error', kind: 'Actual React provider + WorkspaceCard + recovered Impact controls mounted in jsdom', passed: checks.length, checkCount: checks.length, checks, limitations: ['Not a Chrome or pixel-layout assertion; root owns native walkthrough.', 'The local synchronous dataset has explicit rehearsal controls, not production network requests.', 'A production request adapter, response cache and service retry policy remain external integrations.'] };
  fs.writeFileSync('qa/redesign/report-lifecycle-component-checks.json', JSON.stringify(result, null, 2) + '\n'); console.log(JSON.stringify({ passed: checks.length, checkCount: checks.length }));
} finally { if (document.getElementById('root')?.hasChildNodes()) await React.act(async () => root.unmount()); await server.close(); dom.window.close(); }
