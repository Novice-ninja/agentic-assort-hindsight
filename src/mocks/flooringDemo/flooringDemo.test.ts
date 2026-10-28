import assert from 'node:assert/strict';
import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {setupServer} from 'msw/node';
import {pdfDemoHandlers} from '../handlers/pdf';
import {applyFlooringScope,getFlooringScope} from '../../modules/hindsight/priority/flooringScope';
import {
  allocate, BRANDS, CATEGORIES, CLUSTERS, DEFINITION_STATUS, FLOORING_DEFINITIONS,
  flooringItems, flooringItemStores, flooringTotals, getFlooringCategoryCluster,
  getFlooringClusterRows,getFlooringInsight,getFlooringMixRows,getFlooringNarratives,
  getFlooringStores,getFlooringTotals,getFlooringWeekly,selectFlooringItems,
  getFlooringSwatchForItem,
} from './index';
import {getPlaceholderImageForItem} from '../../modules/hindsight/services/placeholderItemImages';
import {buildByItemColumns} from '../../modules/hindsight/services/byItemColumns';
import {buildParetoHierarchyChartFilters} from '../../modules/hindsight/services/visualHierarchy';

const checks:string[]=[];
const near=(actual:number,expected:number,eps=.00001)=>assert(Math.abs(actual-expected)<eps,`${actual} != ${expected}`);
const cents=(n:number)=>Math.round(n*100);
const sum=(a:number[])=>a.reduce((n,v)=>n+v,0);
function check(name:string,fn:()=>void){fn();checks.push(name);}
const full={hierarchyScope:[]};
check('Largest-remainder allocations conserve whole units and cents, including small residuals.',()=>{
  assert.deepEqual(allocate(5,[1,1,1]),[2,2,1]);
  near(sum(allocate(10.03,[1,2,3,4,5,6,7,8,9],2)),10.03);
});
check('One 72-row ledger reconciles sales8.4M, quantity182400 and weighted GM31.6%.',()=>{
  const t=flooringTotals;
  assert.equal(t.sales,8400000);assert.equal(t.units,182400);assert.equal(t.itemCount,72);
  assert.equal(t.grossMargin,2654400);assert.equal(t.gmPct,31.6);
  assert.equal(new Set(flooringItems.map(i=>i.styleId)).size,72);
  assert.equal(new Set(flooringItems.map(i=>i.article)).size,72);
  assert(flooringItems.every(i=>CATEGORIES.includes(i.l1_name as any)&&!i.name.includes('Laminate')));
});
check('Five genuine brand names and one exact share dictionary replace style-name brands.',()=>{
  const rows=getFlooringMixRows('brand');assert.deepEqual(rows.map(r=>r.name),[...BRANDS]);
  near(sum(rows.map(r=>r.sales)),8400000);near(sum(rows.map(r=>r.salesShare)),100);
  near(rows[0].salesShare,27.4);assert.equal(sum(rows.map(r=>r.sellingSkus)),72);
  assert(!rows.some(r=>['Northport','Hillside','Seashell'].includes(r.name)));
});
check('Every actual attribute changes grouping and keeps the same sales/quantity/area totals.',()=>{
  const signatures=new Set<string>();
  for(const lens of ['brand','species','colour','finish','category','product_type']){
    const rows=getFlooringMixRows(lens);near(sum(rows.map(r=>r.sales)),8400000);assert.equal(sum(rows.map(r=>r.units)),182400);
    near(sum(rows.map(r=>r.allocatedAreaSqFt)),84000);near(sum(rows.map(r=>r.plrBaseline)),8800000);
    signatures.add(rows.map(r=>r.name).join('|'));
  }
  assert.equal(signatures.size,6);assert.equal(getFlooringMixRows('collar').length,0);
});
check('Rolling measures are separate completed-week sums; area productivity is a ratio, with definitions TBC.',()=>{
  const weeks=getFlooringWeekly(),t=getFlooringTotals();
  near(sum(weeks.map(w=>w.sales)),t.sales);assert.equal(sum(weeks.map(w=>w.actual)),t.units);
  near(sum(weeks.slice(-4).map(w=>w.sales)),t.r4Sales);near(sum(weeks.slice(-13).map(w=>w.sales)),t.r13Sales);
  assert(t.r4Sales<t.r13Sales&&t.r13Sales<t.sales&&t.r52Sales>t.sales);
  assert.equal(t.plrBaseline,8800000);assert.equal(t.planRevenue,8600000);assert.equal(t.salesPerSqFt,100);
  assert(FLOORING_DEFINITIONS.salesPerSqFt.includes('not selling-unit AUR'));assert(FLOORING_DEFINITIONS.plrBaseline.includes('not a recovered'));
  assert.equal(t.definitionStatus,DEFINITION_STATUS);
});
check('All 45 original stores aggregate stable style-store leaves and reconcile every additive total.',()=>{
  const stores=getFlooringStores(),t=getFlooringTotals();
  assert.equal(stores.length,45);assert.equal(stores[0].storeId,'ST1001');assert.equal(stores.at(-1)!.storeId,'ST1045');
  assert.equal(flooringItemStores.length,72*45);
  near(sum(stores.map(s=>s.sales)),t.sales);assert.equal(sum(stores.map(s=>s.quantity)),t.units);
  near(sum(stores.map(s=>s.onHandCost)),t.ohCost);assert.equal(sum(stores.map(s=>s.sellableQty)),t.sellableUnits);
  assert.equal(sum(stores.map(s=>s.buyUnits)),t.buyUnits);assert(stores.every(s=>s.value>=0&&s.value<=100&&CLUSTERS.includes(s.cluster as any)));
  const northport=flooringItemStores.filter(p=>p.styleId==='1000037');assert.equal(cents(sum(northport.map(p=>p.sales))),160000000);assert(northport.every(p=>p.sellableQty===0));
});
check('A-F cluster rates recompute from supply; flooring grid is3x6 and contains no invented categories.',()=>{
  const cells=getFlooringCategoryCluster(),clusters=getFlooringClusterRows();assert.equal(cells.length,18);
  assert.deepEqual([...new Set(cells.map(c=>c.category))],[...CATEGORIES]);
  assert.equal(clusters[0].cluster,'A');assert(clusters[0].metric>clusters.at(-1)!.metric);
  assert(cells.every(c=>c.metric>=0&&c.metric<=100));
});
check('One explicit scope yields identical item/brand/store totals; both Select-All recipe shapes work.',()=>{
  const scope=[{levelNo:'l1_name',selectedValues:['Hardwood']}],t=getFlooringTotals(scope);
  const items=selectFlooringItems(scope),mix=getFlooringMixRows('brand',scope),stores=getFlooringStores(scope);
  near(sum(items.map(i=>i.revenue)),t.sales);near(sum(mix.map(r=>r.sales)),t.sales);near(sum(stores.map(r=>r.sales)),t.sales);
  assert(t.sales>0&&t.sales<8400000);
  const a=getFlooringTotals([{levelNo:'l1_name',selectAll:true,except:['Bamboo']}]);
  const b=getFlooringTotals([{levelNo:'l1_name',select_all:true,except:['Bamboo']}]);assert.deepEqual(a,b);
  const empty=[{levelNo:'l1_name',selectAll:true,except:[...CATEGORIES]}];
  assert.equal(getFlooringTotals(empty).itemCount,0);assert.equal(getFlooringStores(empty).length,0);assert.equal(getFlooringClusterRows(empty).length,0);
  assert.equal(getFlooringTotals([{levelNo:'l1_name',selectedValues:[]}]).itemCount,0);assert.equal(getFlooringTotals({l1_name:[]}).itemCount,0);
  assert.equal(getFlooringTotals({hierarchyScope:[]}).itemCount,72);
  assert.deepEqual(getFlooringTotals([{levelNo:'l1_name',selectAll:true,search:['hardwood'],exceptSearch:['engineered']}]),t);
});
check('Narratives are chart-specific, sentence-case prose with no double stops or apparel claims.',()=>{
  const brand=getFlooringInsight('article_brand_name'),color=getFlooringInsight('color'),type=getFlooringInsight('product_type');
  assert.notDeepEqual(brand,color);assert.notDeepEqual(color,type);
  const all=JSON.stringify({...getFlooringNarratives(),brand,color,type});
  assert(!/Footwear|Outlet|Premium|\.\./.test(all));assert(all.includes('1000037'));assert(all.includes('definition TBC'));
});
const actualWorkspaceScope = [
  {levelNo:'l0_name',selectedValues:['Flooring']},
  {levelNo:'l1_name',selectedValues:[...CATEGORIES]},
  {levelNo:'l2_name',selectedValues:[...new Set(flooringItems.map(item=>item.l2_name))]},
];
check('Workspace hierarchy AND local chart cuts intersect, including empty, conflicting and Select-All recipes.',()=>{
  const solid=getFlooringTotals({l2_name:['Solid Hardwood']});
  const selected={filters:{levelHierarchy:'l2_name',levelHierarchyValue:['Solid Hardwood']},hierarchyScope:actualWorkspaceScope};
  assert.deepEqual(getFlooringTotals(selected),solid);
  assert.equal(getFlooringTotals({l1_name:['Hardwood'],hierarchyScope:[{levelNo:'l1_name',selectedValues:['Bamboo']}]}).itemCount,0);
  assert.equal(getFlooringTotals({levelHierarchy:'l2_name',levelHierarchyValue:[],hierarchyScope:actualWorkspaceScope}).itemCount,0);
  const recipe=[{levelNo:'l1_name',selectAll:true,search:['hardwood'],exceptSearch:['engineered']}];
  assert.equal(getFlooringTotals({l1_name:['Bamboo'],hierarchyScope:recipe}).itemCount,0);
  assert.deepEqual(getFlooringTotals({l1_name:['Hardwood'],hierarchyScope:recipe}),getFlooringTotals({l1_name:['Hardwood']}));
});
const server=setupServer(...pdfDemoHandlers);server.listen({onUnhandledRequest:'error'});
const post=async(path:string,body:unknown={})=>{const response=await fetch(`http://localhost/agentic-assort-go/api/v1/${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});assert.equal(response.status,200,path);return response.json() as Promise<any>;};
const get=async(path:string)=>{const response=await fetch(`http://localhost/agentic-assort-go/api/v1/${path}`);assert.equal(response.status,200,path);return response.json() as Promise<any>;};
try {
  const kpis=await post('plans/product-performance/kpis',{planCode:'PLAN-KB-001',...full});
  const table=await post('plans/by-item/table-data',{filters:{planCode:'PLAN-KB-001',...full}});
  const summary=await post('plans/by-item/summary',{planCode:'PLAN-KB-001',...full});
  const mix=await post('hindsight/by-attribute/table',{filters:{attrKey:'brand',...full}});
  const contribution=await get('plans/product-performance/contribution?planCode=PLAN-KB-001');
  assert.equal(kpis.data.kpis.find((k:any)=>k.key==='revenue').value,8400000);
  near(sum(table.data.rowData.map((r:any)=>r.revenue.value)),8400000);
  assert.equal(summary.data.cards.kpis.find((k:any)=>k.key==='sls$').value,8400000);
  near(sum(mix.data.map((r:any)=>r.sales_revenue)),8400000);
  near(contribution.data.cards.find((c:any)=>c.dimension==='article_brand_name').segments.find((s:any)=>s.label==='Woodland Reserve').percentage,27.4);
  checks.push('Actual Overview, By Item and Sales Mix endpoint responses reconcile and share the same brand percentages.');
  const row=table.data.rowData.find((r:any)=>r.styleId.value==='1000037');
  const recommendations=await post('hindsight/overview/recommendations',{recommendationType:'missedOpportunities',top:50,...full});
  const northport=recommendations.data.products.find((p:any)=>p.article==='NOR-WO-DWR');
  assert.equal(northport.product_id,row.styleId.value);assert.equal(northport.style_id,row.styleId.value);
  assert.equal(row.revenue.value,1600000);near(row.revenue.change.value,-29.3,.00001);
  assert.equal(row.revenue.change.metric,'vs LY');
  assert.equal(northport.summary,row.aiRecommendation.narration);assert(northport.summary.includes('in-stock')&&northport.summary.includes('stockouts'));
  checks.push('Northport1000037 has the same identity, sales and supply-constrained explanation in Overview and By Item.');
  const columns=buildByItemColumns(row);
  for(const field of ['ly_revenue','plan_revenue','plr_baseline','r4_sales','r13_sales','r52_sales','sales_per_sq_ft'])assert(columns.some(c=>c.field===field));
  assert(columns.filter(c=>c.field.startsWith('r4')||c.field.startsWith('r13')||c.field.startsWith('r52')||c.field==='sales_per_sq_ft'||c.field==='plr_baseline').every(c=>c.headerName.includes('TBC')));
  const mixConfig=await get('hindsight/by-attribute/column-config');
  assert(mixConfig.data.flatMap((c:any)=>c.sub_headers).some((c:any)=>c.column_name==='plr_baseline'&&c.label.includes('TBC')));
  checks.push('Existing dynamic table contracts expose LY, Plan, original PLR baseline, R4/R13/R52 and sales/area placeholder columns.');
  for(const [field,expected] of [['gross_margin_pct',31.6],['sell_thru_pct',flooringTotals.sellThroughPct],['sales_per_sq_ft',100],['aur',8400000/182400]] as const){
    const bases=table.data.rowData.map((r:any)=>r[field].aggregation);
    assert(bases.every((b:any)=>typeof b.numerator==='number'&&b.denominator>0));
    near(sum(bases.map((b:any)=>b.numerator))/sum(bases.map((b:any)=>b.denominator))*bases[0].multiplier,expected);
  }
  assert(!('aggregation' in row.woh));
  checks.push('Ratio cells carry additive numerator/denominator evidence for weighted group rolls; WOH has no invented group basis.');
  for(const lens of ['brand','species','colour','finish']){
    const data=await post('hindsight/by-attribute/table',{filters:{attrKey:lens,...full}});near(sum(data.data.map((r:any)=>r.sales_revenue)),8400000);
    const chart=await post('hindsight/charts',{component:'attr_value_by_cluster',filters:{attrKey:lens,...full}});assert.equal(chart.data.meta.valueUniverse.total,getFlooringMixRows(lens).length);
  }
  const category=await post('hindsight/charts',{component:'category_cluster_metric',filters:full});
  assert.equal(Object.values(category.data.dataset).flat().length,18);assert(category.insight.text.includes('of18')||category.insight.text.includes('of 18'));
  const stores=await post('hindsight/charts',{component:'store_cluster_performance',type:'storeHexMap',filters:full});assert.equal(stores.data.stores.length,45);near(sum(stores.data.stores.map((s:any)=>s.sales)),8400000);
  const values=await post('filters/values',{attributes:['l1_name']});assert(!values.data.values.l1_name.some((v:any)=>v.value==='Laminate'));
  checks.push('All four attribute APIs, derived18-cell category grid and45-store response use flooring-only canonical facts.');
  const hierarchy=await post('filters/values',{attributes:['l0_name','l1_name','l2_name']});
  assert.equal(hierarchy.data.values.l0_name[0].styleCount,72);assert.equal(sum(hierarchy.data.values.l1_name.map((v:any)=>v.styleCount)),72);
  assert.equal(hierarchy.data.values.l2_name.length,5);assert.equal(sum(hierarchy.data.values.l2_name.map((v:any)=>v.styleCount)),72);
  const bamboo=await post('filters/values',{attributes:['l2_name'],filters:[{key:'l0_name',operator:'in',values:['Flooring']},{key:'l1_name',operator:'in',values:['Bamboo']}]});
  assert.equal(bamboo.data.values.l2_name.length,1);assert.equal(bamboo.data.values.l2_name[0].value,'Stranded Bamboo');assert.equal(bamboo.data.values.l2_name[0].styleCount,getFlooringTotals({l1_name:['Bamboo']}).itemCount);
  const scopedSearch=await post('filters/values',{attributes:['l2_name'],search:'Solid',filters:[{key:'l1_name',select_all:true,search:['hardwood'],except_search:['engineered']}]});
  assert.equal(scopedSearch.data.values.l2_name.length,1);assert.equal(scopedSearch.data.values.l2_name[0].value,'Solid Hardwood');assert.equal(scopedSearch.data.values.l2_name[0].styleCount,selectFlooringItems({l2_name:['Solid Hardwood']}).length);
  checks.push('Hierarchy options and dependent/search counts derive from72 actual styles; Bamboo cascades to its one12-style subcategory.');
  const globalConfig=await get('global-config');assert.deepEqual(globalConfig.data.hierarchy.levelHierarchies,['l0_name','l1_name','l2_name']);
  const strip=hierarchy.data.values;
  const groups=['l0_name','l1_name','l2_name'].map(key=>({key,label:key,mandatory:false,values:strip[key].map((v:any)=>({id:v.value,label:v.label}))}));
  const generated=buildParetoHierarchyChartFilters(groups,strip.l1_name.map((v:any)=>v.value),globalConfig.data.hierarchy.levelHierarchies)!;
  assert.equal(generated.levelHierarchy,'l2_name');
  const generatedChart=await post('hindsight/charts',{component:'pareto_chart',filters:{metric:'qty_sold',...generated,...generated.hierarchyScope}});assert(generatedChart.data.dataset.ly.length>0);assert.equal(sum(generatedChart.data.dataset.ly.map((r:any)=>r.metric)),182400);
  const staleAxis=await post('hindsight/charts',{component:'pareto_chart',filters:{metric:'qty_sold',levelHierarchy:'l3_name',...full}});assert.equal(staleAxis.data.meta.resolvedLevelHierarchy,'l2_name');assert.equal(sum(staleAxis.data.dataset.ly.map((r:any)=>r.metric)),182400);
  checks.push('Actual Pareto hierarchy helper uses the real three-level master; stale L3 requests resolve explicitly to its represented last level.');
  const pareto=await post('hindsight/charts',{component:'pareto_chart',filters:{...full,metric:'qty_sold',levelHierarchy:'l2_name'}});
  assert.equal(sum(pareto.data.dataset.ly.map((r:any)=>r.metric)),182400);assert.equal(sum(pareto.data.dataset.lly.map((r:any)=>r.metric)),175048);near(pareto.data.dataset.ly.at(-1).cumulativeContribution,100);
  const dollars=await post('hindsight/charts',{component:'pareto_chart',filters:{...full,metric:'revenue',levelHierarchy:'l2_name'}});near(sum(dollars.data.dataset.ly.map((r:any)=>r.metric)),8400000);
  const weekly=await post('hindsight/charts',{component:'regular_and_promo_sales',filters:{...full,metric:'qty_sold'}});assert.equal(sum(weekly.data.dataset.ly.map((r:any)=>r.metric)),182400);
  const weeklySummary=await post('summarize',{cardType:'chart',metric:'qty_sold',series:[{name:'LY',data:weekly.data.dataset.ly.map((r:any)=>({label:String(r.week),value:r.metric}))}]});
  const paretoSummary=await post('summarize',{cardType:'chart',metric:'qty_sold',series:[{name:'LY',data:pareto.data.dataset.ly.map((r:any)=>({label:r.department,value:r.metric}))}]});
  assert.notDeepEqual(weeklySummary.response,paretoSummary.response);assert(weeklySummary.response[0].includes('182,400'));assert(paretoSummary.response[0].includes('sub-category'));
  checks.push('Pareto and weekly charts respect the selected unit/dollar metric, reconcile periods, and receive distinct chart-specific narratives.');
  const actualChartFilters={planCode:'PLAN-KB-001',metric:'qty_sold',levelHierarchy:'l2_name',levelHierarchyValue:['Solid Hardwood'],hierarchyScope:actualWorkspaceScope};
  const narrowedWeekly=await post('hindsight/charts',{component:'regular_and_promo_sales',filters:actualChartFilters});
  assert.equal(sum(narrowedWeekly.data.dataset.ly.map((r:any)=>r.metric)),getFlooringTotals({l2_name:['Solid Hardwood']}).units);
  const narrowedPareto=await post('hindsight/charts',{component:'pareto_chart',filters:actualChartFilters});
  assert.equal(narrowedPareto.data.dataset.ly.length,1);assert.equal(narrowedPareto.data.dataset.ly[0].department,'Solid Hardwood');
  const actualHeatmap=await post('hindsight/charts',{component:'category_cluster_metric',filters:{l0_name:['Flooring'],l1_name:[...CATEGORIES],hierarchyScope:actualWorkspaceScope}});
  for(const categoryName of CATEGORIES) for(const cluster of CLUSTERS){
    const expectedStores=getFlooringStores({l1_name:[categoryName]}).filter(store=>store.cluster===cluster);
    const expectedUnits=sum(expectedStores.map(store=>store.quantity)),expectedSupply=sum(expectedStores.map(store=>store.buyUnits));
    const cell=actualHeatmap.data.dataset[cluster].find((row:any)=>row.category===categoryName);
    near(cell.metric,expectedUnits/expectedSupply*100);
  }
  checks.push('Actual nonempty workspace chart requests honor local Weekly/Pareto selections and category-cluster cells reconcile to their own category leaves.');
  const tops=await post('hindsight/overview/recommendations',{recommendationType:'topStyleColors',top:50,...full});
  const topRows=tops.data.products;assert(topRows.length===50);assert(topRows.every((r:any,i:number)=>r.rank===i+1&&(i===0||r.revenue.value<=topRows[i-1].revenue.value)));
  checks.push('Top Performing cards rank the actual canonical sales values after scope filtering and before pagination.');
  const manifest=JSON.parse(await readFile('public/demo-flooring/manifest.json','utf8'));
  assert.equal(manifest.items.length,72);assert.equal(new Set(manifest.items.map((i:any)=>i.styleId)).size,72);
  for(const item of manifest.items){
    const svg=await readFile(`public${item.url}`,'utf8');
    assert(svg.includes('not authentic product photography'));assert(svg.includes('<svg '));assert(!/href=|<script/i.test(svg));
    assert.equal(createHash('sha256').update(svg).digest('hex'),item.sha256);
    assert.equal(getFlooringSwatchForItem(item.styleId),item.url);assert.equal(getPlaceholderImageForItem(item.article),item.url);
  }
  const visuals=await post('plans/by-item/visual-view',{filters:{planCode:'PLAN-KB-001',...full,pageSize:100}});
  assert.equal(visuals.data.items.length,72);
  for(const item of visuals.data.items)assert.equal(item.product.imageUrl,`/demo-flooring/${item.product.styleId}.svg`);
  for(const item of table.data.rowData)assert.equal(item.styleDescription.image.url,`/demo-flooring/${item.styleId.value}.svg`);
  const nextTops=await post('hindsight/overview/recommendations',{recommendationType:'topStyleColors',top:50,cursor:tops.data.pagination.cursor,...full});
  const allTops=[...topRows,...nextTops.data.products];assert.equal(new Set(allTops.map((p:any)=>p.styleId)).size,72);
  assert(allTops.every((p:any)=>p.imageUrl===`/demo-flooring/${p.styleId}.svg`));
  assert.equal(getPlaceholderImageForItem('unknown-style'),'/demo-flooring/neutral.svg');
  const thumbnailSource=await readFile('src/modules/hindsight/components/cells/ItemThumbnail.tsx','utf8');
  assert(thumbnailSource.includes('const fromApi = canonicalSwatch ??'));assert(!thumbnailSource.includes('@assets/images/item-thumbnail-placeholder'));
  checks.push('All72 canonical products use valid code-native illustrative SVGs in visual/table/top APIs; cached, lazy and failure fallback paths contain no apparel imagery.');
  const scope=[{levelName:'Category',levelNo:'l1_name',selectedValues:['Hardwood']}];applyFlooringScope(scope as any);
  const scopedOverview=await post('plans/product-performance/kpis',{planCode:'PLAN-KB-001'}),scopedSummary=await post('plans/by-item/summary',{planCode:'PLAN-KB-001'}),scopedMix=await post('hindsight/by-attribute/table',{filters:{attrKey:'brand',planCode:'PLAN-KB-001'}});
  const expected=getFlooringTotals(scope).sales;
  assert.equal(scopedOverview.data.kpis[0].value,expected);assert.equal(scopedSummary.data.cards.kpis[0].value,expected);near(sum(scopedMix.data.map((r:any)=>r.sales_revenue)),expected);
  applyFlooringScope([]);assert.equal(getFlooringScope().length,0);
  checks.push('Shared applied scope reaches requests omitting hierarchy and reconciles all three tabs after Apply.');
  for(const [label,recipe] of [['full',[]],['Bamboo',[{levelName:'Category',levelNo:'l1_name',selectedValues:['Bamboo']}]],['empty',[{levelName:'Category',levelNo:'l1_name',selectedValues:[]}]],['all',[]]] as const){
    applyFlooringScope(recipe as any);
    const total=getFlooringTotals({hierarchyScope:recipe});
    const narrative=await post('plans/PLAN-KB-001/hindsight-summary',{refresh:true});
    const banner=await post('summarize',{cardType:'segment',dimension:'kpi',planCode:'PLAN-KB-001'});
    const color=await post('summarize',{cardType:'segment',dimension:'color',planCode:'PLAN-KB-001'});
    const copy=JSON.stringify({narrative:narrative.summary,banner:banner.response,color:color.response});
    if(label==='Bamboo'){
      assert.equal(total.itemCount,12);assert.equal(total.units,23836);near(total.sales,1049808.28);
      assert(!copy.includes('Northport'));assert(!copy.includes('8.40M'));assert(!copy.includes('182,400'));
      assert(banner.response[0].includes('23,836'));assert(narrative.summary.assortment_and_attributes.includes('12 canonical styles'));
      assert(color.response[0].includes('Walnut'));assert(color.response[0].includes('39.6%'));
    }else if(label==='empty'){
      assert.deepEqual(banner.response,[]);assert.deepEqual(color.response,[]);assert(!copy.includes('Northport'));assert(narrative.summary.assortment_and_attributes.includes('No flooring styles'));
    }else assert(copy.includes('Northport')&&banner.response[0].includes('182,400'));
  }
  const explicitNarrative=await post('plans/PLAN-KB-001/hindsight-summary',{hierarchy_scope:[{levelNo:'l1_name',selectedValues:['Bamboo']}]});
  assert(!JSON.stringify(explicitNarrative.summary).includes('Northport'));
  applyFlooringScope([{levelName:'Category',levelNo:'l1_name',selectedValues:['Bamboo']}],'PLAN-KB-002');
  const otherPlan=await post('summarize',{cardType:'segment',dimension:'kpi',plan_code:'PLAN-KB-002'});assert(otherPlan.response[0].includes('23,836'));assert(!JSON.stringify(otherPlan.response).includes('Northport'));
  checks.push('Fresh summary, color insight and all narrative sections follow full→Bamboo→empty→all, explicit body scope and nondefault plan aliases without off-scope product claims.');
  const override=await post('plans/by-item/recommendation',{planCode:'PLAN-KB-001',drop:['NOR-WO-DWR']});assert.equal(override.data.items[0].workingPlan.value,'drop');
  const refetch=await post('plans/by-item/table-data',{filters:{planCode:'PLAN-KB-001',...full}});assert.equal(refetch.data.rowData.find((r:any)=>r.article.value==='NOR-WO-DWR').workingPlan.value,'drop');
  await post('plans/by-item/recommendation',{planCode:'PLAN-KB-001',clear:['NOR-WO-DWR']});
  checks.push('Local recommendation save/refetch/clear still works with the canonical data adaptation.');
} finally {server.close();}
await writeFile('src/mocks/flooringDemo/test-results.json',JSON.stringify({status:'passed',checkCount:checks.length,checks,source:'Priority fix-list A1-A4/C4',synthetic:true},null,2));
console.log(JSON.stringify({status:'passed',checkCount:checks.length,checks},null,2));
