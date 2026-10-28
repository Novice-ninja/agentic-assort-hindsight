/** Read the actual workbook scope recipes and replay the real local API/column adapters. */
import { readFileSync, writeFileSync } from 'node:fs';
import { setupServer } from 'msw/node';
import { pdfByItemHandlers } from '../../src/mocks/handlers/pdf/byItem';
import { normalizeByItemTableRow } from '../../src/modules/hindsight/services/byItemTableRows';
import { buildByItemColumns } from '../../src/modules/hindsight/services/byItemColumns';
import { buildByItemExportColumns } from '../../src/modules/hindsight/services/export/byItemExportConfig';
import { getFlooringMixRows, getFlooringTotals, selectFlooringItems } from '../../src/mocks/flooringDemo';
import ts from 'typescript';
import { transformSync } from 'esbuild';

function actualColumns(file: string) {
  const text = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let initializer: ts.Expression | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'EXPORT_COLUMNS') initializer = node.initializer;
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!initializer) throw new Error('Missing actual UI EXPORT_COLUMNS: '+file);
  const code = transformSync(`module.exports=(${initializer.getText(source)});`, {loader:'ts',format:'cjs'}).code;
  const module = {exports:undefined as any};
  new Function('module',code)(module);
  return module.exports as {header:string;value:(row:any)=>unknown}[];
}

async function main() {
  const recipes = JSON.parse(readFileSync('qa/redesign/priority-browser-export-recipes.json','utf8'));
  const server = setupServer(...pdfByItemHandlers);
  server.listen({onUnhandledRequest:'error'});
  const expected: any = {};
  try {
    for (const recipe of recipes) {
      const filters = {planCode:recipe.planCode,hierarchyScope:recipe.hierarchyScope};
      const items = selectFlooringItems(filters);
      let rows: any[], columns: {header:string;value:(row:any)=>unknown}[];
      if (recipe.file.includes('/by-item-')) {
        const response = await fetch('http://localhost/agentic-assort-go/api/v1/plans/by-item/table-data', {
          method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({filters:{...filters,pageSize:100}}),
        });
        if (!response.ok) throw new Error('Canonical table API failed: '+response.status);
        const body = await response.json() as any;
        rows = body.data.rowData.map(normalizeByItemTableRow);
        columns = buildByItemExportColumns(buildByItemColumns(rows[0]));
      } else {
        const mix = getFlooringMixRows('brand',filters);
        const summary = recipe.file.includes('summary');
        rows = summary ? mix.map(row=>({name:row.name,totalSkus:row.sellingSkus,share:row.salesShare,vsLy:row.growth,productivity:row.productivity})) : mix;
        columns = actualColumns(`src/modules/hindsight/components/attributes/${summary?'SalesMixChartCard':'SalesMixBreakdownTable'}.tsx`);
      }
      expected[recipe.file] = {
        source: recipe.file.includes('/by-item-') ? 'Actual MSW local table endpoint → real normalizer → real export column adapter' : 'Canonical scoped Sales Mix facts → actual UI EXPORT_COLUMNS extracted by AST',
        scope:filters,totals:getFlooringTotals(filters),canonicalIds:items.map(item=>item.styleId),
        rows:rows.map(row=>Object.fromEntries(columns.map(column=>[column.header,column.value(row)]))),
      };
    }
  } finally { server.close(); }
  writeFileSync('qa/redesign/priority-browser-export-expectations.json',JSON.stringify(expected,null,2)+'\n');
  console.log('Expected canonical API/column data captured for '+Object.keys(expected).length+' actual browser files. No XLSX was modified or authored.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
