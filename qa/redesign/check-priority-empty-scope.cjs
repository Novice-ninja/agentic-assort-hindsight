/** Real hierarchy hook and contribution adapter checks; browser acceptance is separate. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
fs.mkdirSync(path.join(root, '.local'), { recursive: true });
const temporary = fs.mkdtempSync(path.join(root, '.local/empty-scope-'));
const checks = [];
const check = (name, fn) => { fn(); checks.push({ name, pass: true }); };
(async () => {
  try {
    const outfile = path.join(temporary, 'subjects.cjs');
    await esbuild.build({ absWorkingDir: root, stdin: { contents: `export * from './src/modules/hindsight/hooks/useVisualHierarchyFilter';export * from './src/modules/hindsight/services/productContribution';export * from './src/modules/hindsight/services/summarizePayload';export * from './src/modules/appConfig/services/componentScope';`, resolveDir: root, loader: 'ts' }, bundle: true, packages: 'external', platform: 'node', format: 'cjs', outfile, logLevel: 'silent', plugins: [{ name: 'isolate-config-and-strip', setup(build) {
      build.onResolve({ filter: /^@modules\/appConfig$/ }, () => ({ path: 'config', namespace: 'empty-scope' }));
      build.onResolve({ filter: /^\.\/usePlanFilterStrip$/ }, () => ({ path: 'strip', namespace: 'empty-scope' }));
      build.onLoad({ filter: /.*/, namespace: 'empty-scope' }, args => ({ loader: 'js', contents: args.path === 'strip' ? 'export const usePlanFilterStrip=()=>globalThis.__emptyStrip;' : `export const useComponentConfig=()=>({hierarchyDropdownEnabled:globalThis.__emptyEnabled});export const useGlobalConfig=()=>({hierarchy:{levelHierarchies:['l0_name','l1_name','l2_name']}});` }));
    } }] });
    const subject = require(outfile);
    const run = mode => {
      let value;
      function Host() { value = subject.useVisualHierarchyFilter({ module: 'hindsight', view: 'overview', component: 'regularPromoSales' }, 'PLAN-KB-001', { mode }); return null; }
      renderToStaticMarkup(React.createElement(Host));
      return value;
    };
    global.__emptyEnabled = true;
    for (const mode of ['default', 'pareto']) {
      global.__emptyStrip = { status: 'loading', groups: [] };
      check(`${mode}: loading hierarchy is distinct from an empty result`, () => assert.equal(run(mode).empty, false));
      global.__emptyStrip = { status: 'succeeded', groups: ['l0_name', 'l1_name', 'l2_name'].map(key => ({ key, label: key, values: [] })) };
      check(`${mode}: completed empty scope has no chart request or loading dropdown`, () => {
        const result = run(mode); assert.equal(result.empty, true); assert.equal(result.chartFilters, null); assert.equal(result.visible, false); assert.equal(result.disabled, true);
      });
      global.__emptyStrip = { status: 'succeeded', groups: [['l0_name', 'Flooring'], ['l1_name', 'Bamboo'], ['l2_name', 'Stranded Bamboo']].map(([key, id]) => ({ key, label: key, values: [{ id, label: id }] })) };
      check(`${mode}: restoring a populated scope yields chart filters again`, () => { const result = run(mode); assert.equal(result.empty, false); assert(result.chartFilters); });
    }
    const source = JSON.parse(fs.readFileSync(path.join(root, 'src/mocks/pdfData/OV-contribution.json')));
    const wire = source.data.map(card => ({ dimension: card.dimension, title: card.cardTitle, segments: [] }));
    const allCards = subject.toContributionDataList(wire);
    const configured = wire.slice(0, 3);
    const cards = subject.scopeToConfiguredDimensions(allCards, {dimensionList:configured.map(card=>card.dimension)});
    check('Empty contribution cards retain all three dimension identities and corresponding headings', () => {
      assert.equal(cards.length, 3); assert.deepEqual(cards.map(card => card.instanceId), configured.map(card => `contribution-${card.dimension}`));
      const titles = Object.fromEntries(configured.map(card => [`contribution-${card.dimension}`, card.title]));
      assert.deepEqual(cards.map(card => titles[card.instanceId]), configured.map(card => card.title)); assert.equal(new Set(Object.values(titles)).size, 3);
    });
    check('No contribution segments means no insight request payload', () => assert(cards.every(card => subject.buildSummarizePayload(card) === null)));
    fs.writeFileSync(path.join(__dirname, 'priority-empty-scope-checks.json'), JSON.stringify({ kind: 'Actual hierarchy hook SSR and pure adapter checks; not browser acceptance', passed: checks.length, checks }, null, 2) + '\n');
    console.log(`${checks.length} empty-scope checks passed.`);
  } finally {
    delete global.__emptyStrip; delete global.__emptyEnabled;
    fs.rmSync(temporary, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
