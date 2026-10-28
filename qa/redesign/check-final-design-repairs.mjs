import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/assort/hindsight', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'MutationObserver', 'getComputedStyle', 'DocumentFragment']) Object.defineProperty(globalThis, key, { value: key === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[key], configurable: true });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window); globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
dom.window.HTMLElement.prototype.scrollIntoView = function () {}; dom.window.scrollTo = () => {};
// jsdom has no layout engine. Supply visibility only for the original getFocusable helper;
// exact native dimensions and rendered appearance remain the parent's Chrome acceptance.
Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetParent', { configurable: true, get() { return this.hidden ? null : document.body; } });
const React = await import('react'), { createRoot } = await import('react-dom/client'), { createServer } = await import('vite'), { default: createCache } = await import('@emotion/cache');
const unbound = createHttpServer(), server = await createServer({ plugins: [{ name: 'qa-chart-and-grid-hosts', enforce: 'pre', transform(code,id) { if(id.endsWith('/views/ScreenChart.tsx')) code=code.replace("'highcharts-react-official'","'virtual:qa-chart-host'"); if(id.endsWith('/components/ui.tsx')) code=code.replaceAll("'@shared/components/data'","'virtual:qa-grid-host'"); return code; }, resolveId(source) { if (source === 'virtual:qa-chart-host') return '\0qa-chart-host'; if (source === 'virtual:qa-grid-host') return '\0qa-grid-host'; }, load(id) {
  if (id === '\0qa-chart-host') return "import React from 'react'; export default function ChartHost(props){ globalThis.__qaChartOptions=props.options; return React.createElement('div',{'data-qa-chart-host':true}); }";
  if (id === '\0qa-grid-host') return "import React from 'react'; export function DataGrid({rows,columns,ariaLabel,getRowId}){ return React.createElement('div',{role:'table','aria-label':ariaLabel},rows.map(row=>React.createElement('div',{key:getRowId(row),role:'row'},columns.map(column=>React.createElement('div',{key:column.id,role:'cell'},column.render?.(row)??column.value?.(row)??''))))); } export const DataTable=DataGrid;";
} }], server: { middlewareMode: true, hmr: { server: unbound } }, appType: 'custom', logLevel: 'error' }), root = createRoot(document.getElementById('root'));
try {
  const { ScreenChart } = await server.ssrLoadModule('/src/modules/hindsight/redesign/views/ScreenChart.tsx'), { MaterialDialog } = await server.ssrLoadModule('/src/modules/hindsight/redesign/views/ByItemView.tsx'), ui = await server.ssrLoadModule('/src/modules/hindsight/redesign/components/ui.tsx'), emotion = await server.ssrLoadModule('/vendor/impact-ui/dist/node_modules/@emotion/react/dist/emotion-react.browser.esm.js'), preview = await server.ssrLoadModule('/src/modules/hindsight/components/cells/ItemThumbnail.module.css'), modalStyles = await server.ssrLoadModule('/src/shared/components/primitives/Modal/Modal.module.css');
  const cache = createCache({ key: 'finaldsqa' }), checks = [], selections = [];
  const wrap = child => React.createElement(emotion.CacheProvider, { value: cache }, child);
  const points = [1, 2, 3].map(number => ({ id: `W${number}`, label: `Week ${number}`, start: `2026-07-${String(number * 7 - 6).padStart(2, '0')}`, end: `2026-07-${String(number * 7).padStart(2, '0')}`, actual: { value: number * 100, unit: 'USD', state: 'ok' }, comparison: { value: number * 90, unit: 'USD', state: 'ok' } }));
  await React.act(async () => root.render(wrap(React.createElement(ScreenChart, { points, metric: 'sales', comparisonLabel: 'Matched LY', onSelectWeeks: ids => selections.push(ids), selectedWeeks: ['W2'] }))));
  assert(!document.querySelector('[aria-label="Inspect a fiscal week"]')); assert(!document.body.textContent.includes('View contributing items:'));
  assert.equal([...document.getElementById('root').querySelectorAll('button')].filter(button => !button.closest('details')).length, 0);
  const details = document.querySelector('details'); assert(details); assert.equal(details.open, false); assert.equal(details.querySelectorAll('button[aria-label^="Inspect "]').length, 3);
  checks.push({ name: 'Actual ScreenChart removes the redundant default date-button cloud and keeps exact interval actions inside its collapsed data alternative', pass: true });
  details.open = true; const rowAction = document.querySelector('button[aria-label="Inspect Week 2 contributing items"]'); assert.equal(rowAction.getAttribute('aria-pressed'), 'true');
  await React.act(async () => rowAction.click()); assert.deepEqual(selections.pop(), ['W2']); assert.equal(points.length, 3);
  checks.push({ name: 'Keyboard-focusable chart-data row action emits its exact interval ID and preserves controlled selection state', pass: true });
  const options = globalThis.__qaChartOptions; options.plotOptions.series.point.events.click.call({ index: 2 }); assert.deepEqual(selections.pop(), ['W3']);
  const zoom = options.chart.events.selection({ xAxis: [{ min: .5, max: 2 }] }); assert.equal(zoom, false); assert.deepEqual(selections.pop(), ['W2', 'W3']);
  assert.equal(options.series[0].color, '#7A5CFF'); assert.equal(options.series[1].color, '#4BCFFF');
  checks.push({ name: 'Production chart click and zoom-selection callbacks remain intact with exact week sets and the original actual/LY palette', pass: true });
  let navigated = 0;
  const row = { id: '1000037', name: 'Northport flooring', product: { imageUrl: '/flooring-demo/1000037.svg' } };
  function PreviewHarness() { const [open, setOpen] = React.useState(false); return React.createElement(React.Fragment, null, React.createElement(ui.Button, { 'aria-label': 'Enlarge material', onClick: () => setOpen(true) }, 'Enlarge'), open && React.createElement(MaterialDialog, { row, onClose: () => setOpen(false), onOpen: () => { navigated++; setOpen(false); } })); }
  await React.act(async () => root.render(wrap(React.createElement(PreviewHarness))));
  const trigger = document.querySelector('button[aria-label="Enlarge material"]'); trigger.focus(); await React.act(async () => trigger.click());
  const dialog = document.querySelector('[data-testid="hindsight-item-image-preview"]'); assert(dialog); assert(!document.getElementById('root').contains(dialog)); assert(dialog.classList.contains(modalStyles.default.dialog)); assert(dialog.classList.contains(preview.default.previewDialog)); assert(dialog.querySelector('img').classList.contains(preview.default.previewImage)); assert.equal(dialog.getAttribute('aria-modal'), 'true'); assert.equal(navigated, 0);
  checks.push({ name: 'Actual MaterialDialog portals the original shared Modal and exact ItemThumbnail preview classes, and opening an image does not navigate', pass: true });
  const close = dialog.querySelector('button[aria-label="Close material illustration"]'), openItem = [...dialog.querySelectorAll('button')].find(button => button.textContent.trim() === 'Open item performance'); assert.strictEqual(document.activeElement, close);
  await React.act(async () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))); assert.strictEqual(document.activeElement, openItem);
  await React.act(async () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))); assert.strictEqual(document.activeElement, close);
  await React.act(async () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))); assert(!document.querySelector('[role="dialog"]')); assert.strictEqual(document.activeElement, trigger); assert.equal(navigated, 0);
  checks.push({ name: 'Original Modal focus trap, Escape close and trigger focus restoration work through the real image-preview component', pass: true });
  await React.act(async () => trigger.click()); await React.act(async () => document.querySelector('[data-testid="hindsight-item-image-preview"]').parentElement.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))); assert(!document.querySelector('[role="dialog"]')); assert.strictEqual(document.activeElement, trigger);
  await React.act(async () => trigger.click()); await React.act(async () => document.querySelector('button[aria-label="Close material illustration"]').click()); assert(!document.querySelector('[role="dialog"]')); assert.equal(navigated, 0);
  await React.act(async () => trigger.click()); await React.act(async () => [...document.querySelectorAll('[role="dialog"] button')].find(button => button.textContent.trim() === 'Open item performance').click()); assert.equal(navigated, 1); assert(!document.querySelector('[role="dialog"]'));
  checks.push({ name: 'Original backdrop close and explicit Close work independently; only Open item performance requests the separate item route', pass: true });
  fs.writeFileSync('qa/redesign/final-design-repair-checks.json', JSON.stringify({ kind: 'Actual ScreenChart and MaterialDialog React components; original Modal and Impact buttons in jsdom; chart and DataGrid renderer hosts are semantic stand-ins', passed: checks.length, checkCount: checks.length, checks, limitations: ['No native Chrome or pixel-layout assertion.', 'Highcharts rendering and AG Grid layout are not exercised; the production callback/options and accessible row renderers are exercised.', 'The original Modal visibility helper receives a jsdom-only offsetParent fixture because jsdom has no layout engine.'] }, null, 2) + '\n'); console.log(JSON.stringify({ passed: checks.length, checkCount: checks.length }));
} finally { await React.act(async () => root.unmount()); await server.close(); dom.window.close(); delete globalThis.__qaChartOptions; }
