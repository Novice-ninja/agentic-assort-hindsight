import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import * as data from '../../src/modules/hindsight/redesign/data';
import { buildWorkbookBytes } from '../../src/modules/hindsight/redesign/helpers/exportWorkbook';

const file='src/modules/hindsight/redesign/views/MixView.tsx';
const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let initializer:ts.Expression|undefined;
function visit(node:ts.Node){if(ts.isVariableDeclaration(node)&&node.name.getText(source)==='exportView')initializer=node.initializer;ts.forEachChild(node,visit)}
visit(source);
assert(initializer&&ts.isArrowFunction(initializer),'The active MixView export adapter must be located in the real source.');
const adapter=initializer.getText(source);
const dataset=data.getDefaultDataset();
const scope={...data.createDefaultScope('in-season',dataset),window:'SEASON' as const};
const pairs=data.selectScopedPairs(scope,dataset);
const total=data.aggregatePairs(pairs,dataset);
const rows=data.getMixRows(scope,'brand',dataset,pairs);
const reports:object[]=[];
const output='qa/redesign/mix-export-model-controls';
mkdirSync(output,{recursive:true});

function run(name:string,groups:typeof rows,leaves:typeof pairs=pairs,applied=scope){
  const currentTotal=data.aggregatePairs(leaves,dataset);
  let capture:any;
  const fn=new Function('exportRows','lens','rows','pairs','effectiveScope','dataset','state','settings','localSelection','total',`return (${adapter});`)(
    (...args:unknown[])=>capture=args,'brand',groups,leaves,applied,dataset,{search:name==='woodland'?'Woodland':''},{measure:'sales'},null,currentTotal);
  fn();
  assert(capture,'Actual source adapter must invoke the shared workbook writer.');
  const [title,exportedRows,exportedScope,options]=capture;
  const selectedIds=new Set(groups.flatMap(row=>row.pairIds));
  assert.deepEqual(options.contributingPairs.map((pair:any)=>pair.id),leaves.filter(pair=>selectedIds.has(pair.id)).map(pair=>pair.id));
  assert.deepEqual(options.viewState.visibleGroupIds,groups.map(row=>row.id));
  assert.equal(options.viewState.shareDenominator.pairCount,leaves.length);
  assert.equal(options.viewState.shareDenominator.sales.value,currentTotal.sales.value);
  assert.equal(options.viewState.exportedContributingPairCount,options.contributingPairs.length);
  assert.equal(exportedScope,applied,'Export retains the applied scope; text search is a view cut.');
  assert.deepEqual(exportedRows,groups,'Displayed group metrics, order and unrenormalized shares must be preserved.');
  writeFileSync(`${output}/${name}.xlsx`,buildWorkbookBytes(title,exportedRows,exportedScope,options));
  reports.push({name,groups:groups.length,contributingPairs:options.contributingPairs.length,parentPairs:leaves.length,parentSales:currentTotal.sales.value});
  return capture;
}

run('all-brands',rows);
const woodland=rows.filter(row=>row.label.includes('Woodland'));
const woodlandArgs=run('woodland',woodland);
assert.equal(woodland.length,1);
assert.equal(woodland[0].skuCount,19);
assert.equal(woodland[0].sales.value,2301600);
assert.equal(woodland[0].salesShare.value,27.4);
assert.equal(woodlandArgs[3].contributingPairs.length,855);
assert.equal(data.aggregatePairs(woodlandArgs[3].contributingPairs,dataset).sales.value,2301600);
const diagonal=pairs.filter(pair=>['1000037:ST1001','1000444:ST1002'].includes(pair.id));
assert.equal(diagonal.length,2);
const diagonalScope={...scope,pairIds:diagonal.map(pair=>pair.id)};
const diagonalGroups=data.getMixRows(diagonalScope,'brand',dataset,diagonal);
run('exact-diagonal',diagonalGroups,diagonal,diagonalScope);
run('no-matching-groups',[]);
run('restricted-woodland',woodland,pairs,{...scope,access:'restricted-margin'});
const result={status:'passed',checks:5,actualUIAdapterSource:file,method:'Executed the active exportView initializer with canonical selector results, captured its real writer arguments, and built XLSX bytes. These are generated model controls, not browser downloads.',fixtures:reports};
writeFileSync('qa/redesign/mix-export-adapter-checks.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
