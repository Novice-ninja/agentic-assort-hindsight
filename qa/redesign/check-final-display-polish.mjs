import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import esbuild from 'esbuild';
const require = createRequire(import.meta.url), base = 'src/modules/hindsight/redesign', before = JSON.parse(fs.readFileSync('qa/redesign/final-display-polish-before.json', 'utf8')), checks = [];
const compiled = await esbuild.build({ stdin: { contents: "export {formatUnit} from './src/modules/hindsight/redesign/data/format'; export {staticTokenVars,themeColorVars} from './src/design-system/cssVars'; export {light} from './src/design-system/themes/light';", resolveDir: process.cwd(), loader: 'ts' }, bundle: true, platform: 'node', format: 'cjs', write: false, logLevel: 'silent' });
const apiModule = { exports: {} }; new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, apiModule, apiModule.exports); const api = apiModule.exports;
for (const file of ['views/overview.module.css', 'views/views.module.css', 'views/screens.module.css']) {
  const actual = fs.readFileSync(path.join(base, file), 'utf8'); assert.equal(actual, before[file].source.replaceAll('var(--color-bg)', 'var(--color-surface-muted)').replaceAll('var(--color-text)', 'var(--color-text-primary)'));
  assert(!actual.includes('var(--color-bg)')); assert(!actual.includes('var(--color-text)'));
  checks.push({ name: `${file}: only undefined aliases were replaced by real semantic tokens`, pass: true });
}
const cssVars = { ...api.staticTokenVars(), ...api.themeColorVars(api.light) }; assert(cssVars['--color-surface-muted']); assert(cssVars['--color-text-primary']); assert(!cssVars['--color-bg']); assert(!cssVars['--color-text']);
checks.push({ name: 'Replacement aliases exist in the actual design-system variable generator and light theme', pass: true });
function parse(file, source = fs.readFileSync(path.join(base, file), 'utf8')) { return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); }
function nodes(root, predicate) { const result = []; function walk(node) { if (predicate(node)) result.push(node); ts.forEachChild(node, walk); } walk(root); return result; }
function execute(expression, bindings = {}) {
  const code = ts.transpileModule(`export default (${expression});`, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} }; new Function('require', 'module', 'exports', 'formatUnit', ...Object.keys(bindings), code)(require, mod, mod.exports, api.formatUnit, ...Object.values(bindings)); return mod.exports.default;
}
const sources = { case: parse('views/CaseDetailView.tsx'), log: parse('views/DecisionsView.tsx'), chart: parse('views/ScreenChart.tsx') };
for (const [name, source] of [['Case compatible unit', sources.case], ['Rule threshold unit', sources.log]]) {
  const option = nodes(source, node => ts.isArrowFunction(node) && node.parameters[0]?.name.getText(source) === 'unit' && ts.isJsxElement(node.body) && node.body.openingElement.tagName.getText(source) === 'option')[0]; assert(option);
  const render = execute(option.getText(source));
  for (const [value, label] of [['SELLING_UNIT_TBC', 'selling units (TBC)'], ['SQFT', 'sq ft'], ['EA', 'each']]) { const element = render(value); assert.equal(element.props.value, value); assert.equal(element.props.children, label); }
  checks.push({ name: `${name}: actual option renderer changes only readable labels while retaining exact canonical values`, pass: true });
}
const logFunction = nodes(sources.log, node => ts.isFunctionDeclaration(node) && node.name?.text === 'DecisionLog')[0];
const quantityColumn = nodes(logFunction, node => ts.isObjectLiteralExpression(node) && node.properties.some(property => ts.isPropertyAssignment(property) && property.name.getText(sources.log) === 'key' && property.initializer.getText(sources.log) === "'quantity'"))[0];
const renderer = quantityColumn.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(sources.log) === 'render').initializer;
const quantity = execute(renderer.getText(sources.log)); assert.equal(quantity({ quantity: 200, uom: 'SELLING_UNIT_TBC' }), '200 selling units (TBC)'); assert.equal(quantity({ quantity: 0, uom: 'EA' }), '0 each'); assert.equal(quantity({ quantity: undefined }), 'Not applicable'); assert.equal(quantity({ quantity: 200 }), '200 Unit unavailable');
checks.push({ name: 'Actual Decision log quantity renderer preserves numeric zero/absence and displays humane or explicitly unavailable units', pass: true });
const caseQuantity = nodes(sources.case, node => ts.isConditionalExpression(node) && node.condition.getText(sources.case) === 'decision.quantity === undefined')[0]; assert(caseQuantity);
assert.equal(execute(`decision => ${caseQuantity.getText(sources.case)}`)({ quantity: 200, uom: 'SELLING_UNIT_TBC' }), '200 selling units (TBC)');
const chartTitle = nodes(sources.chart, node => ts.isPropertyAssignment(node) && node.name.getText(sources.chart) === 'text' && node.initializer.getText(sources.chart).includes('formatUnit(points[0]?.actual.unit'))[0]; assert(chartTitle);
assert.equal(execute(`(metric, points) => ${chartTitle.initializer.getText(sources.chart)}`)('quantity', [{ actual: { unit: 'SELLING_UNIT_TBC' } }]), 'Quantity (selling units (TBC))');
checks.push({ name: 'Actual case quantity and chart-axis expressions remove raw UOM enums without changing measured values', pass: true });
// Check the actual mutation/export expressions, not a separately rewritten mock payload.
for (const [file, callee] of [['views/CaseDetailView.tsx', 'saveDraft'], ['views/DecisionsView.tsx', 'exportRows']]) {
  const current = parse(file), previous = parse(file, before[file].source);
  const calls = source => nodes(source, node => ts.isCallExpression(node) && node.expression.getText(source) === callee).map(node => node.getText(source));
  assert.deepEqual(calls(current), calls(previous));
  checks.push({ name: `${file}: actual ${callee} payload expressions remain byte-for-byte unchanged`, pass: true });
}
fs.writeFileSync('qa/redesign/final-display-polish-checks.json', JSON.stringify({ kind: 'Actual TSX renderer expressions, original design-system variable generator and source mutation/export contracts; not browser appearance', passed: checks.length, checkCount: checks.length, checks }, null, 2) + '\n'); console.log(JSON.stringify({ passed: checks.length, checkCount: checks.length }));
