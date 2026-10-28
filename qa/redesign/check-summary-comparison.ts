import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {aggregatePairs,comparisonWeekIds,createDefaultScope,getDefaultDataset,getTrend,selectScopedPairs} from '../../src/modules/hindsight/redesign/data';
const dataset=getDefaultDataset(),scope=createDefaultScope(),checks:string[]=[];
const near=(a:number|null,b:number)=>assert(a!==null&&Math.abs(a-b)<1e-6,`${a} != ${b}`);
for(const comparison of ['ly','previous','original','revision','none'] as const){
  const applied={...scope,comparison},pairs=selectScopedPairs(applied,dataset),total=aggregatePairs(pairs,dataset);
  const quantity=getTrend(applied,'quantity','window',dataset),gm=getTrend(applied,'gmRate','window',dataset);
  assert.equal(quantity.length,1);assert.equal(gm.length,1);
  near(quantity[0].actual.value,total.quantity.value!);near(gm[0].actual.value,total.gmRate.value!);
  if(comparison==='ly')near(quantity[0].comparison.value,total.lyQuantity.value!);
  if(['ly','previous'].includes(comparison)){
    const ids=new Set(pairs.map(pair=>pair.id)),weeks=new Set(comparisonWeekIds(applied,dataset));
    const facts=dataset.facts.filter(fact=>ids.has(`${fact.itemId}:${fact.storeId}`)&&weeks.has(fact.weekId));
    const sales=facts.reduce((sum,fact)=>sum+fact.netSales,0),margin=facts.reduce((sum,fact)=>sum+fact.netSales-fact.recognizedCogs!,0);
    near(gm[0].comparison.value,100*margin/sales);
  }
  if(comparison==='none'){assert.equal(quantity[0].comparison.state,'not-applicable');assert.equal(gm[0].comparison.state,'not-applicable');}
  checks.push(`Whole-window ${comparison} comparison uses the same exact cohort and weighted GM`);
}
const restricted=getTrend({...scope,access:'restricted-margin'},'gmRate','window',dataset)[0];
assert.equal(restricted.actual.state,'restricted');assert.equal(restricted.comparison.state,'restricted');
checks.push('Restricted margin remains withheld in whole-window summary comparison');
writeFileSync('qa/redesign/summary-comparison-checks.json',JSON.stringify({kind:'Actual selectors; no native layout claim',passed:checks.length,checks},null,2)+'\n');
console.log(`${checks.length} summary comparison groups passed`);
