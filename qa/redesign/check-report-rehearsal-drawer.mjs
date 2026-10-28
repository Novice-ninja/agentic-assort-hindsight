import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/assort/hindsight', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'MutationObserver', 'getComputedStyle', 'DocumentFragment']) Object.defineProperty(globalThis, key, { value: key === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[key], configurable: true });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window); globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
dom.window.HTMLElement.prototype.scrollIntoView = function () {}; dom.window.scrollTo = () => {};
const React = await import('react'), { createRoot } = await import('react-dom/client'), { createServer } = await import('vite'), { default: createCache } = await import('@emotion/cache');
const unbound = createHttpServer(), server = await createServer({ plugins: [{ name: 'qa-workspace-host-only', enforce: 'pre', resolveId(source, importer) { if (source === '../context/WorkspaceContext' && importer?.endsWith('/components/GlobalFilterDrawer.tsx')) return '\0qa-workspace-host'; }, load(id) { if (id === '\0qa-workspace-host') return 'export const useWorkspace = () => globalThis.__reportDrawerWorkspace;'; } }], server: { middlewareMode: true, hmr: { server: unbound } }, appType: 'custom', logLevel: 'error' }), root = createRoot(document.getElementById('root'));
try {
  const ui = await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx'), lifecycle = await server.ssrLoadModule('/src/modules/hindsight/redesign/context/ReportStateContext.tsx'), data = await server.ssrLoadModule('/src/modules/hindsight/redesign/data/index.ts'), { GlobalFilterDrawer } = await server.ssrLoadModule('/src/modules/hindsight/redesign/components/GlobalFilterDrawer.tsx'), emotion = await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js');
  const dataset = data.getDefaultDataset(), scope = data.createDefaultScope('in-season', dataset), originalScope = structuredClone(scope), checks = [];
  let applied = 0, currentPanel;
  function Harness() {
    const [activePanel, setActivePanel] = React.useState('filters'); currentPanel = activePanel;
    globalThis.__reportDrawerWorkspace = { scope, dataset, activePanel, setActivePanel, role: 'merchant', applyScope() { applied++; } };
    return React.createElement(lifecycle.ReportStateProvider, { scopeKey: JSON.stringify(scope), evidenceDate: dataset.feeds.refreshedAt }, React.createElement(ui.WorkspaceCard, { title: 'Item performance' }, React.createElement('p', { style: { height: 300 } }, 'Canonical flooring rows')), React.createElement(GlobalFilterDrawer));
  }
  await React.act(async () => root.render(React.createElement(emotion.CacheProvider, { value: createCache({ key: 'reportdrawerqa' }) }, React.createElement(Harness))));
  const demo = [...document.querySelectorAll('*')].find(element => element.children.length === 0 && element.textContent === 'Demo settings'); assert(demo, 'Real FilterPanel demo navigation not found'); await React.act(async () => demo.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  const target = document.querySelector('[role="combobox"][aria-label="Report component rehearsal"]'); assert(target); assert.match(document.body.textContent, /does not send a production request/);
  checks.push({ name: 'Actual GlobalFilterDrawer Demo settings exposes a real Impact report selector and explicit rehearsal disclosure', pass: true });
  const state = document.querySelector('[role="combobox"][aria-label="Component rehearsal state"]'); assert(state); await React.act(async () => state.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  const failure = [...document.querySelectorAll('[role="option"]')].find(element => element.textContent.includes('Failed · component retry')); assert(failure, 'Actual state option not found'); await React.act(async () => failure.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  const show = [...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Show component state'); assert(show); assert(!show.disabled); await React.act(async () => show.click());
  assert.equal(currentPanel, null); assert.equal(applied, 0); assert.deepEqual(scope, originalScope); assert.equal(document.querySelector('[data-report-id="report-item-performance"]').dataset.reportState, 'failure');
  checks.push({ name: 'Actual recovered Select and Show action apply one report failure, close the drawer, and never call Apply scope or mutate its staged filters', pass: true });
  await React.act(async () => document.querySelector('button[aria-label="Retry Item performance"]').click()); assert.equal(document.querySelector('[data-report-id="report-item-performance"]').dataset.reportState, 'ready'); assert.equal(applied, 0); assert.deepEqual(scope, originalScope);
  checks.push({ name: 'Rehearsed failure is recovered by its actual component Retry button without applying filter drafts', pass: true });
  fs.writeFileSync('qa/redesign/report-rehearsal-drawer-checks.json', JSON.stringify({ requirement: 'HSP60-loading-error', kind: 'Actual GlobalFilterDrawer, ReportStateProvider, WorkspaceCard and Impact controls in jsdom; useWorkspace host is a semantic fixture', passed: checks.length, checkCount: checks.length, checks, limitations: ['Not a native Chrome or appearance test.', 'The host supplies real canonical dataset/default scope while recording Apply calls; production services are not invoked.'] }, null, 2) + '\n'); console.log(JSON.stringify({ passed: checks.length, checkCount: checks.length }));
} finally { await React.act(async () => root.unmount()); await server.close(); dom.window.close(); delete globalThis.__reportDrawerWorkspace; }
