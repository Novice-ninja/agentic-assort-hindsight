import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {setupServer} from 'msw/node';
import {pdfDemoHandlers} from '../../src/mocks/handlers/pdf';
import {buildByItemHierarchyRows} from '../../src/modules/hindsight/services/byItemHierarchy';
import {normalizeByItemTableRow} from '../../src/modules/hindsight/services/byItemTableRows';
import {getFlooringTotals} from '../../src/mocks/flooringDemo';
const checks:{name:string;pass:true}[]=[];
const near=(a:number,b:number)=>assert(Math.abs(a-b)<.00001,`${a} != ${b}`);
const check=(name:string,fn:()=>void)=>{fn();checks.push({name,pass:true});};
const server=setupServer(...pdfDemoHandlers);server.listen({onUnhandledRequest:'error'});
try {
 const response=await fetch('http://localhost/agentic-assort-go/api/v1/plans/by-item/table-data',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({filters:{planCode:'PLAN-KB-001',hierarchyScope:[],pageSize:100}})});
 assert.equal(response.status,200);
 const raw=(await response.json() as any).data.rowData;
 const rows=raw.map(normalizeByItemTableRow),before=JSON.stringify(rows);
 const models=buildByItemHierarchyRows(rows,['l0_name','l1_name','l2_name']);
 const root=models.find(r=>r.id==='group:Flooring')!.cells;
 const total=getFlooringTotals();
 check('Actual API-normalized group retains full additive sales, units and synthetic baseline',()=>{
  near(root.revenue.value,8400000);near(root.qty_sold.value,182400);near(root.plr_baseline.value,8800000);near(root.r4_sales.value,total.r4Sales);
 });
 check('Full-scope GM, ST, area productivity and AUR are ratios of additive evidence',()=>{
  near(root.gross_margin_pct.value,31.6);near(root.sell_thru_pct.value,total.units/total.buyUnits*100);near(root.sales_per_sq_ft.value,100);near(root.aur.value,total.sales/total.units);
 });
 check('Every category group independently reconciles weighted ratios to its canonical facts',()=>{
  for(const name of ['Hardwood','Engineered Hardwood','Bamboo']){
   const t=getFlooringTotals({l1_name:[name]});
   const group=models.find(r=>r.id===`group:Flooring\u0001${name}`)!.cells;
   near(group.gross_margin_pct.value,t.gmPct);near(group.sell_thru_pct.value,t.sellThroughPct);near(group.sales_per_sq_ft.value,t.salesPerSqFt);
  }
 });
 check('Unknown markdown and WOH group rates remain unavailable instead of averaged',()=>{
  assert.equal(root.mark_down_pct,undefined);assert.equal(root.woh,undefined);
 });
 check('Leaf cells and ratio evidence survive normalization and grouping without mutation',()=>{
  assert.equal(JSON.stringify(rows),before);assert.equal(models.filter(r=>r.rowKind==='leaf').length,72);
  assert.deepEqual(rows[0].sales_per_sq_ft.aggregation,raw[0].sales_per_sq_ft.aggregation);
 });
 const numeric=(value:number,extra:any={})=>({value,format:'0.0%',...extra});
 const groupOf=(cells:any[])=>buildByItemHierarchyRows(cells.map((c,i)=>({styleId:{value:String(i)},l0_name:{value:'X'},...c})),['l0_name']).find(r=>r.rowKind==='group')!.cells;
 check('Zero-denominator and partial ratio evidence do not fabricate group values',()=>{
  assert.equal(groupOf([{custom_pct:numeric(0,{aggregation:{numerator:0,denominator:0,multiplier:100}})}]).custom_pct,undefined);
  assert.equal(groupOf([{custom_pct:numeric(10,{aggregation:{numerator:1,denominator:10,multiplier:100}})},{custom_pct:numeric(90)}]).custom_pct,undefined);
 });
 check('Unequal weights produce the ratio of totals rather than the arithmetic mean',()=>{
  const g=groupOf([{custom_pct:numeric(10,{aggregation:{numerator:1,denominator:10,multiplier:100}})},{custom_pct:numeric(90,{aggregation:{numerator:90,denominator:100,multiplier:100}})}]);
  near(g.custom_pct.value,91/110*100);assert.notEqual(g.custom_pct.value,50);
 });
 writeFileSync('qa/redesign/priority-rollup-checks.json',JSON.stringify({kind:'Actual API, normalization and grouped-ratio source checks; not browser acceptance',passed:checks.length,checks},null,2)+'\n');
 console.log(`${checks.length} grouped-ratio checks passed.`);
} finally { server.close(); }
