/**
 * Execute the actual UI export declarations, without mounting React or downloading a file.
 * Re-run:
 * node_modules/.bin/esbuild qa/redesign/priority-actual-export-columns-check.ts --bundle --platform=node --packages=external --alias:@design-system=./src/design-system --alias:@mocks=./src/mocks --outfile=/private/tmp/priority-actual-export-columns.cjs
 * NODE_PATH="$PWD/node_modules" node /private/tmp/priority-actual-export-columns.cjs
 * <bundled-python> qa/redesign/validate-priority-actual-export-columns.py
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { transformSync } from 'esbuild';
import { buildWorkbookBytes } from '../../src/shared/components/data/excelExport/writeWorkbook';
import {
  DEFINITION_STATUS, FLOORING_DEFINITIONS, FLOORING_DEMO_LABEL,
  getFlooringMixRows, getFlooringTotals,
} from '../../src/mocks/flooringDemo';
import { makeSalesMixRows } from '../../src/modules/hindsight/components/attributes/salesMixData';

const projectRoot = process.cwd();
const outputDirectory = '/private/tmp/priority-actual-ui-exports';
mkdirSync(outputDirectory, { recursive: true });
const sources = {
  summary: 'src/modules/hindsight/components/attributes/SalesMixChartCard.tsx',
  breakdown: 'src/modules/hindsight/components/attributes/SalesMixBreakdownTable.tsx',
} as const;
const bambooScope = [{ levelNo: 'l1_name', levelName: 'Category', selectedValues: ['Bamboo'] }];
const gridState = {
  filters: { sales: { filterType: 'number', type: 'greaterThan', filter: 100000 } },
  sort: [{ colId: 'sales', sort: 'desc' }],
};

function findNode(source: ts.SourceFile, predicate: (node: ts.Node) => boolean): ts.Node {
  let found: ts.Node | undefined;
  function visit(node: ts.Node) {
    if (found) return;
    if (predicate(node)) { found = node; return; }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!found) throw new Error(`Required declaration was not found in ${source.fileName}`);
  return found;
}

function evaluateExpression(expression: string, values: Record<string, unknown> = {}): any {
  const code = transformSync(`module.exports = (${expression});`, { loader: 'ts', format: 'cjs' }).code;
  const module = { exports: undefined as any };
  // Only the selected, inspected local AST expression runs; no component/import body runs.
  new Function('module', ...Object.keys(values), code)(module, ...Object.values(values));
  return module.exports;
}

const manifest: any = {
  kind: 'Actual Sales Mix UI column and metadata declaration regression; no browser download claim',
  extraction: 'TypeScript AST selects EXPORT_COLUMNS plus useExcelDownload getMetadata/fileName properties; esbuild transpiles those pure declarations only.',
  outputDirectory,
  sources: {},
  variants: [],
  expectedFull: JSON.parse(readFileSync(join(projectRoot, 'src/mocks/flooringDemo/story-contract.json'), 'utf8')).totals,
  expectedBamboo: getFlooringTotals({ hierarchyScope: bambooScope }),
};

for (const [surface, relativePath] of Object.entries(sources)) {
  const text = readFileSync(join(projectRoot, relativePath), 'utf8');
  const source = ts.createSourceFile(relativePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declaration = findNode(source, node => ts.isVariableDeclaration(node) && node.name.getText(source) === 'EXPORT_COLUMNS') as ts.VariableDeclaration;
  const options = (findNode(source, node => ts.isCallExpression(node) && node.expression.getText(source) === 'useExcelDownload') as ts.CallExpression).arguments[0] as ts.ObjectLiteralExpression;
  const property = (name: string) => options.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(source) === name) as ts.PropertyAssignment;
  const columns = evaluateExpression(declaration.initializer!.getText(source));
  const metadataExpression = property('getMetadata').initializer.getText(source);
  const fileNameExpression = property('fileName').initializer.getText(source);
  const sourceHash = createHash('sha256').update(text).digest('hex');
  manifest.sources[surface] = { path: relativePath, sha256: sourceHash, columnIds: columns.map((column: any) => column.id) };
  for (const scopeName of ['full', 'bamboo'] as const) {
    const scope = scopeName === 'bamboo' ? bambooScope : [];
    const filters = scope.length ? { hierarchyScope: scope } : {};
    const allRows = surface === 'summary' ? makeSalesMixRows('brand', filters) : getFlooringMixRows('brand', filters);
    // The additional filtered variant deliberately uses the same row collection that a
    // filtered client grid passes to the writer. Actual AG Grid/browser traversal is separate.
    const variants = surface === 'breakdown' ? ['all', 'filtered'] : ['all'];
    for (const rowSelection of variants) {
      const rows = rowSelection === 'filtered' ? allRows.filter((row: any) => row.name === 'Woodland Reserve') : allRows;
      const values = {
        FLOORING_DEMO_LABEL, FLOORING_DEFINITIONS, DEFINITION_STATUS,
        scope, attributeId: 'brand', planCode: 'PLAN1001',
        gridRef: { current: { getExportViewState: () => rowSelection === 'filtered' ? gridState : { filters: {}, sort: [] } } },
      };
      const metadata = evaluateExpression(metadataExpression, values)();
      const fileName = evaluateExpression(fileNameExpression, values);
      const name = `${surface}-${scopeName}-${rowSelection}`;
      const path = join(outputDirectory, `${name}.xlsx`);
      writeFileSync(path, buildWorkbookBytes({ rows, columns, fileName: `${name}.xlsx`, sheetName: 'Sales Mix', metadata }));
      manifest.variants.push({
        name, surface, scope: scopeName, rowSelection, path, fileName, rowCount: rows.length,
        expectedRows: rows.map((row: any) => Object.fromEntries(columns.map((column: any) => [column.header, column.value(row)]))),
      });
    }
  }
}
writeFileSync(join(outputDirectory, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ variants: manifest.variants.length, sources: manifest.sources, outputDirectory }, null, 2));
