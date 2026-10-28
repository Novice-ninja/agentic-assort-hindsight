import { http, HttpResponse, type RequestHandler } from 'msw';
import {
  CLUSTERS, DEFINITION_STATUS, getFlooringCategoryCluster, getFlooringClusterRows,
  getFlooringInsight, getFlooringMixRows, getFlooringStores, getFlooringWeekly,
  getFlooringTotals,
  type FlooringFilters,
} from '../../flooringDemo';
import { flooringRequestFilters } from '../../flooringDemo/requestScope';
import columnConfig from '../../pdfData/SM-column-config.json';

type Row=Record<string,unknown>;
interface ChartRequestBody extends Row {component?:string;type?:string;rollupType?:string;filters?:Row;encoding?:Row;}
const ok=(data:unknown,insight?:string)=>HttpResponse.json({status:true,message:'Successful',data,...(insight?{insight:{available:true,text:insight}}:{})});
const chartError=(message:string)=>HttpResponse.json({status:false,message,data:null});
const attr=(body:ChartRequestBody)=>String(body.filters?.attrKey ?? 'brand');
const versions=['ly','lly','optimisedLy','forecast','plan','optimisedLLy'] as const;
function metricKind(metric:unknown) {
  const key=String(metric??'qty_sold').toLowerCase();
  return /qty|slsu|units/.test(key)?'quantity':/gross_margin_pct|gross_margin_percentage|gm%/.test(key)?'gmRate':/gross_margin|gm\$/.test(key)?'gmDollars':/aur|asp/.test(key)?'asp':/revenue|sales|sls\$/.test(key)?'sales':'unavailable';
}
function regularPromoSales(body:ChartRequestBody,scope:FlooringFilters) {
  const rows=getFlooringWeekly(scope),isMonth=body.rollupType==='monthRollup'||body.encoding?.x==='month';
  const kind=metricKind(body.filters?.metric),totals=getFlooringTotals(scope);
  const active=(Array.isArray(body.encoding?.versions)?versions.filter(v=>(body.encoding!.versions as unknown[]).includes(v)):versions).filter(v=>!['optimisedLy','optimisedLLy','forecast'].includes(v));
  const dataset:Record<string,Row[]>={};
  const value=(row:typeof rows[number],version:typeof versions[number]):number|null=>{
    const prior=version==='lly',plan=version==='plan';
    if(kind==='quantity')return prior?row.lly:plan?row.actual*totals.planRevenue/Math.max(totals.sales,1):row.actual;
    if(kind==='sales')return prior?row.lySales:plan?row.planSales:row.sales;
    if(prior||plan)return null; // No prior/plan COGS or price-plan quantity feed is invented.
    if(kind==='gmDollars')return row.grossMargin;
    if(kind==='gmRate')return row.sales>0?row.grossMargin/row.sales*100:null;
    if(kind==='asp')return row.actual>0?row.sales/row.actual:null;
    return null;
  };
  active.forEach(version=>{
    if(!isMonth)dataset[version]=rows.map(r=>({week:r.week,metric:value(r,version)}));
    else {
      const groups=new Map<number,typeof rows>();rows.forEach(r=>{const month=Math.min(6,Math.ceil(r.week/4.34));groups.set(month,[...(groups.get(month)??[]),r]);});
      dataset[version]=[...groups].map(([month,points])=>{
        const values=points.map(r=>value(r,version));
        const sales=points.reduce((n,r)=>n+r.sales,0),units=points.reduce((n,r)=>n+r.actual,0),gm=points.reduce((n,r)=>n+r.grossMargin,0);
        const metric=values.some(v=>v===null)?null:kind==='gmRate'?sales>0?gm/sales*100:null:kind==='asp'?units>0?sales/units:null:values.reduce((n,v)=>n!+v!,0);
        return {month,metric};
      });
    }
  });
  return ok({chartType:'linechart',metric:body.filters?.metric??'qty_sold',rollupType:isMonth?'monthRollup':'weekRollup',dataset},getFlooringInsight('weekly',scope).join(' '));
}
function paretoChart(body:ChartRequestBody,scope:FlooringFilters) {
  // An already-mounted phase-one client may still ask for its phantom L3 axis.
  // Resolve that alias to the actual final flooring level; new global config has3 levels.
  const requestedLevel=String(body.filters?.levelHierarchy??'product_type'),resolvedLevel=requestedLevel==='l3_name'?'l2_name':requestedLevel;
  const kind=metricKind(body.filters?.metric),rows=getFlooringMixRows(resolvedLevel,scope);
  const amount=(r:typeof rows[number],prior=false):number|null=>kind==='quantity'?prior?r.lyUnits:r.units:kind==='sales'?prior?r.lyRevenue:r.sales:kind==='gmDollars'?prior?null:r.sales*r.gm/100:kind==='gmRate'?prior?null:r.gm:kind==='asp'?prior?r.lyUnits>0?r.lyRevenue/r.lyUnits:null:r.units>0?r.sales/r.units:null:null;
  rows.sort((a,b)=>(amount(b)??0)-(amount(a)??0));
  const additive=['quantity','sales','gmDollars'].includes(kind),total=rows.reduce((n,r)=>n+(amount(r)??0),0),denom=rows.reduce((n,r)=>n+(amount(r,true)??0),0);let current=0,prior=0;
  return ok({chartType:'linechart',metric:body.filters?.metric??'qty_sold',meta:{thresholdPct:80,requestedLevelHierarchy:requestedLevel,resolvedLevelHierarchy:resolvedLevel},dataset:{
    ly:rows.map(r=>{const share=additive&&total>0?(amount(r)??0)/total*100:null;return {department:r.name,contribution:share,cumulativeContribution:share===null?null:current+=share,metric:amount(r)};}),
    lly:rows.map(r=>{const share=additive&&denom>0?(amount(r,true)??0)/denom*100:null;return {department:r.name,contribution:share,cumulativeContribution:share===null?null:prior+=share,metric:amount(r,true)};}),
  }},additive?`Contribution is calculated from the selected ${kind==='quantity'?'selling-unit':'sales-dollar'} measure. Sub-category rows reconcile to the same SS26 scope.`:'Rates and prices are not additive contribution measures; cumulative share is unavailable.');
}
function categoryActVsPlanned(body:ChartRequestBody,scope:FlooringFilters) {
  const rows=getFlooringMixRows('category',scope);
  const kind=metricKind(body.filters?.metric),value=(r:typeof rows[number],prior=false)=>kind==='quantity'?prior?r.lyUnits:r.units:kind==='gmRate'?prior?null:r.gm:kind==='gmDollars'?prior?null:r.sales*r.gm/100:kind==='asp'?prior?r.lyUnits>0?r.lyRevenue/r.lyUnits:null:r.units>0?r.sales/r.units:null:kind==='sales'?prior?r.lyRevenue:r.sales:null;
  return ok({chartType:'barchart',metric:body.filters?.metric??'revenue',dataset:{ly:rows.map(r=>({department:r.name,metric:value(r)})),lly:rows.map(r=>({department:r.name,metric:value(r,true)}))}},getFlooringInsight('category',scope).join(' '));
}
function storeClusterBar(scope:FlooringFilters) {
  return ok({chartType:'barchart',metric:'sell_thru_pct',dataset:getFlooringClusterRows(scope)},getFlooringInsight('cluster',scope).join(' '));
}
function storeHexMap(scope:FlooringFilters) {
  const stores=getFlooringStores(scope);
  return ok({chartType:'storeHexMap',metric:'sell_thru_pct',stores,dataset:stores},getFlooringInsight('store',scope).join(' '));
}
function categoryClusterMetric(scope:FlooringFilters) {
  const cells=getFlooringCategoryCluster(scope),dataset:Record<string,Row[]>={};
  CLUSTERS.forEach(cluster=>{dataset[cluster]=cells.filter(r=>r.cluster===cluster).map(r=>({category:r.category,metric:r.metric}));});
  const red=cells.filter(c=>c.metric<=64).length,lowest=[...cells].sort((a,b)=>a.metric-b.metric)[0];
  const text=cells.length?`${red} of ${cells.length} flooring category × cluster combinations are at least 5 percentage points below the synthetic 69% benchmark. ${lowest.category} × Cluster ${lowest.cluster} is lowest at ${lowest.metric.toFixed(1)}% sell-through. All values are synthetic; definition TBC.`:'No flooring category × cluster cells match the applied scope.';
  return ok({chartType:'heatmap',metric:'sell_thru_pct',meta:{definitionStatus:DEFINITION_STATUS},dataset},text);
}
function attributeHeatmap(lens:string,scope:FlooringFilters) {
  const rows=getFlooringMixRows(lens,scope),clusters=getFlooringClusterRows(scope);
  return ok({chartType:'heatmap',metric:'sell_thru_pct',meta:{valueUniverse:{shown:rows.length,total:rows.length}},dataset:rows.flatMap(r=>clusters.map(c=>({cluster:c.cluster,[lens]:r.name,metric:c.metric})))},getFlooringInsight(lens,scope).join(' '));
}
function apiRows(lens:string,scope:FlooringFilters) {
  return getFlooringMixRows(lens,scope).map(r=>({
    attr_value:{value:r.name,significance:null},sales_revenue:r.sales,rev_share:r.salesShare,gross_margin_percentage:r.gm,sell_through_percentage:r.sellThroughPct,
    selling_skus:r.sellingSkus,quantity:r.units,ly_revenue:r.lyRevenue,plan_revenue:r.planRevenue,plr_baseline:r.plrBaseline,
    r4_sales:r.r4Sales,r13_sales:r.r13Sales,r52_sales:r.r52Sales,sales_per_sq_ft:r.salesPerSqFt,definition_status:r.definitionStatus,
    trend_yoy:{direction:r.growth>0?'up':r.growth<0?'down':'flat',delta:Math.abs(r.growth),deltaUnit:'percent',comparisonLabel:'vs LY',sentiment:r.growth>0?'positive':r.growth<0?'negative':'neutral'},
    signal:{value:r.action,sentiment:r.action==='Expand'?'positive':r.action==='Rationalize'?'negative':'neutral'},
  }));
}
const PERFORMANCE_LEAVES=[
  {column_name:'rev_share',label:'Sales share %',formatter:'0.0%',cellType:'progress',width:150},
  {column_name:'sell_through_percentage',label:'Sell-through',formatter:'0.0%',cellType:'text',width:120},
  {column_name:'gross_margin_percentage',label:'GM %',formatter:'0.0%',cellType:'text',width:110},
  {column_name:'sales_revenue',label:'Sales $',formatter:'$0.00a',cellType:'text',width:120},
  {column_name:'ly_revenue',label:'LY sales $',formatter:'$0.00a',cellType:'text',width:130},
  {column_name:'plan_revenue',label:'Plan $ · synthetic',formatter:'$0.00a',cellType:'text',width:160},
  {column_name:'plr_baseline',label:'PLR baseline $ · definition TBC',formatter:'$0.00a',cellType:'text',width:220},
  {column_name:'r4_sales',label:'R4 sales $ · definition TBC',formatter:'$0.00a',cellType:'text',width:210},
  {column_name:'r13_sales',label:'R13 sales $ · definition TBC',formatter:'$0.00a',cellType:'text',width:210},
  {column_name:'r52_sales',label:'R52 sales $ · definition TBC',formatter:'$0.00a',cellType:'text',width:210},
  {column_name:'sales_per_sq_ft',label:'Sales / sq ft · definition TBC',formatter:'$0,0.00',cellType:'text',width:220},
];
function columnConfigEntries() {
  return columnConfig.data.map(column=>({column_name:column.column,label:column.label,type:column.type,order_of_display:column.order,is_frozen:column.frozen,is_sortable:column.sortable,is_searchable:column.searchable,is_hidden:column.hidden,width:column.width,
    sub_headers:column.column==='performance'?PERFORMANCE_LEAVES.map((leaf,i)=>({...leaf,type:'number',order_of_display:column.order*100+i,is_frozen:false,is_sortable:true,is_searchable:false,is_hidden:false,sub_headers:[],extra:{cellType:leaf.cellType}})):[],
    ...(column.column==='trend_yoy'?{extra:{cellType:'trend'}}:column.column==='signal'?{extra:{cellType:'badge'}}:{}),
  }));
}
export const pdfChartHandlers:RequestHandler[]=[
  http.post('*/v1/hindsight/charts',async({request})=>{
    const body=await request.json().catch(()=>({})) as ChartRequestBody,scope=flooringRequestFilters(body);
    switch(body.component){
      case 'regular_and_promo_sales':return regularPromoSales(body,scope);
      case 'pareto_chart':return paretoChart(body,scope);
      case 'metric_by_catg_act_vs_planned':return categoryActVsPlanned(body,scope);
      case 'store_cluster_performance':return body.type==='storeHexMap'?storeHexMap(scope):body.type==='barchart'?storeClusterBar(scope):chartError(`Unsupported chart type${body.type}`);
      case 'category_cluster_metric':return categoryClusterMetric(scope);
      case 'attr_value_by_cluster':return attributeHeatmap(attr(body),scope);
      default:return chartError(`Unknown chart component${body.component}`);
    }
  }),
  http.get('*/v1/hindsight/attributes',({request})=>{const url=new URL(request.url);return ok({planCode:url.searchParams.get('planCode')??'',seasonCode:url.searchParams.get('seasonCode')??'',attributes:['brand','species','colour','finish'].map((key,i)=>({attrKey:key,label:key[0].toUpperCase()+key.slice(1),ordinal:i+1,valueCount:getFlooringMixRows(key).length,significance:'medium',isDefault:i===0}))});}),
  http.post('*/v1/hindsight/by-attribute/table',async({request})=>{const body=await request.json().catch(()=>({})) as ChartRequestBody,rows=apiRows(attr(body),flooringRequestFilters(body));return HttpResponse.json({status:true,message:'Successful',data:rows,total:rows.length,page:1,count:rows.length});}),
  http.get('*/v1/hindsight/by-attribute/column-config',()=>ok(columnConfigEntries())),
];
