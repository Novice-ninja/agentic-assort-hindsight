import seedItems from '../pdfData/BI-items.json';
import seedStores from '../pdfData/OV-store-map.json';
import missedSeeds from '../pdfData/OV-missed-opps.json';

/** One illustrative SS26 flooring ledger for the priority three-tab walkthrough. */
export const FLOORING_DEMO_LABEL = 'SS26 coherent flooring demo';
export const DEFINITION_STATUS = 'Synthetic · definition TBC';
export const DEMO_AS_OF = '2026-07-31';
export const FLOORING_NEUTRAL_SWATCH='/demo-flooring/neutral.svg';
export const BRANDS = ['Woodland Reserve', 'Westridge', 'American Spirit', 'Lifescapes', 'Bruce'] as const;
export const CATEGORIES = ['Hardwood', 'Engineered Hardwood', 'Bamboo'] as const;
export const CLUSTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export const FLOORING_DEFINITIONS = {
  scope: 'Illustrative SS26 Flooring, 72 canonical style-colour rows and 45 stores. Not client actuals.',
  sales: 'Signed net sales in USD; all tables and charts aggregate the same canonical style-colour facts.',
  quantity: 'Synthetic selling units; pack size and canonical flooring UOM require F&D confirmation.',
  r4Sales: 'Synthetic net sales in the last 4 completed prototype weeks ending 26 Jul 2026; fiscal calendar definition TBC.',
  r13Sales: 'Synthetic net sales in the last 13 completed prototype weeks ending 26 Jul 2026; fiscal calendar definition TBC.',
  r52Sales: 'Synthetic net sales in the last 52 completed prototype weeks ending 26 Jul 2026; fiscal calendar definition TBC.',
  salesPerSqFt: 'Season net sales / allocated selling area in sq ft. Area allocation and whether F&D intends selling-area productivity or another measure are definition TBC. This is not selling-unit AUR.',
  plrBaseline: 'Synthetic original approved SS26 sales target, frozen at 8.8M for this demo; not a recovered client PLR.',
  planRevenue: 'Synthetic latest SS26 sales plan, 8.6M for the full scope; distinct from original PLR baseline.',
  sellThrough: 'Synthetic season net sold units / season available supply units. Inventory opening, receipts and adjustment policy are definition TBC.',
  stocks: 'Single synthetic end-of-season snapshot at 31 Jul 2026. Stock is not summed over weeks.',
} as const;

type SeedItem = typeof seedItems.data.items[number];
export interface FlooringItem extends SeedItem {
  lyRevenue: number; lyUnits: number; planRevenue: number; plrBaseline: number;
  r4Sales: number; r13Sales: number; r52Sales: number; allocatedAreaSqFt: number;
  salesPerSqFt: number; ohCost: number; sellableUnits: number;
  definitionStatus: string; availabilityReason: string;
  imageUrl:string;
}
export interface FlooringTotals {
  sales: number; units: number; lyRevenue: number; lyUnits: number;
  planRevenue: number; plrBaseline: number; r4Sales: number; r13Sales: number; r52Sales: number;
  allocatedAreaSqFt: number; salesPerSqFt: number; grossMargin: number; gmPct: number;
  buyUnits: number; buyDollars: number; sellThroughPct: number; itemCount: number;
  ohCost: number; sellableUnits: number; definitionStatus: string;
}
export interface FlooringMixRow {
  name: string; sellingSkus: number; sales: number; units: number; lyRevenue: number; lyUnits:number;
  planRevenue: number; plrBaseline: number; r4Sales: number; r13Sales: number; r52Sales: number;
  allocatedAreaSqFt: number; salesPerSqFt: number; growth: number; salesShare: number;
  skuShare: number; productivity: number; gm: number; returns: number;
  sellThroughPct: number;
  action: 'Expand'|'Hold'|'Rationalize'; definitionStatus: string;
}
export interface FlooringStore {
  storeId: string; name: string; cluster: string; lat: number; lon: number; value: number;
  sales: number; quantity: number; gmRate: number; onHandCost: number; sellableQty: number;
  buyUnits: number; allocatedAreaSqFt: number; salesPerSqFt: number;
  definitionStatus: string; sourceLabel: string;
}
export type FlooringFilters = Record<string, unknown> | readonly unknown[];
type FilterRecord = Record<string, unknown>;
const filterRecord = (filters: FlooringFilters): FilterRecord => Array.isArray(filters) ? { hierarchyScope: filters } : filters as FilterRecord;
const sum = (a: number[]) => a.reduce((n, v) => n + v, 0);
const round = (n: number, places = 2) => Math.round(n * 10 ** places) / 10 ** places;
const pct = (a: number, b: number) => b > 0 ? a / b * 100 : 0;
/** Largest remainder allocation preserves every additive total, including after rounding. */
export function allocate(total: number, weights: number[], precision = 0): number[] {
  const scale = 10 ** precision, target = Math.round(total * scale), denom = sum(weights);
  if (!weights.length) return [];
  const exact = weights.map(w => target * (denom > 0 ? w / denom : 1 / weights.length));
  const out = exact.map(Math.floor);
  const order = exact.map((v, i) => ({ i, remainder: v - out[i] })).sort((a,b) => b.remainder - a.remainder || a.i - b.i);
  const remaining=target-sum(out);
  for (let i = 0; i < remaining; i++) out[order[i % order.length].i]++;
  return out.map(n => n / scale);
}
const brandMap: Record<string, string> = {
  'Woodland Reserve':'Woodland Reserve', Westridge:'Westridge', 'American Spirit':'American Spirit',
  Lifescapes:'Lifescapes', Bruce:'Bruce', 'Eco Forest':'Woodland Reserve',
  'Manor House':'Lifescapes', Dimensions:'Bruce', Viviano:'American Spirit',
  Aquaguard:'Woodland Reserve', 'Aquaguard Whispercore':'Westridge', 'Not Specified':'Bruce',
};
const normalized = seedItems.data.items.map((item, i) => {
  const laminate = item.l1_name === 'Laminate';
  const category = laminate ? i % 2 ? 'Hardwood' : 'Engineered Hardwood' : item.l1_name;
  const productType = laminate ? category === 'Hardwood' ? 'Solid Hardwood' : 'Water Resistant Engineered' : item.l2_name;
  return { ...item, brand: brandMap[item.brand] ?? BRANDS[i % BRANDS.length], l0_name:'Flooring', l1_name:category, l2_name:productType,
    name: item.name.replace(/Click Laminate/g, productType), };
});
const brandSales = [2301600, 1839600, 1696800, 1461600, 1100400]; // 27.4/21.9/20.2/17.4/13.1; exactly8.4M.
const revenues = normalized.map(() => 0);
BRANDS.forEach((brand, b) => {
  const indices = normalized.flatMap((i, index) => i.brand === brand ? [index] : []);
  const fixed = indices.find(index => normalized[index].styleId === '1000037');
  const remaining = indices.filter(index => index !== fixed);
  if (fixed !== undefined) revenues[fixed] = 1600000;
  const values = allocate(brandSales[b] - (fixed === undefined ? 0 : 1600000), remaining.map(index => normalized[index].revenue), 2);
  remaining.forEach((index, j) => { revenues[index] = values[j]; });
});
const units = allocate(182400, normalized.map((i, j) => revenues[j] / Math.max(1, i.aur)));
const lyRevenues = allocate(8400000 / 1.068 - 1600000 / .707, normalized.map((i, j) => i.styleId === '1000037' ? 0 : revenues[j] / Math.max(.2, 1 + i.growthVsLy / 100)), 2);
const northportIndex = normalized.findIndex(i => i.styleId === '1000037');
lyRevenues[northportIndex] = round(1600000 / .707);
const lyUnits = allocate(175048, normalized.map((i,j) => units[j] / Math.max(.2, 1 + i.unitsGrowthVsLy / 100)));
const buys = allocate(281481, normalized.map((i,j) => units[j] / Math.max(.3, i.stPct / 100)));
const margins = allocate(2654400, normalized.map((i,j) => revenues[j] * Math.max(.12, i.gmPct / 100)) , 2);
const plans = allocate(8600000, revenues, 2), baselines = allocate(8800000, revenues, 2);
const areas = allocate(84000, normalized.map((_i,j) => Math.sqrt(revenues[j])));
const weights26 = [5,5.5,6,6.5,7,7.5,8,11.5,12,8.5,8,8,7.8,7,6.5,6.5,8,7,5,4.5,4.5,6,4.5,4.5,4.5,4];
const seasonWeeks = revenues.map(sales => allocate(sales, weights26, 2));
const beforeWeeks = revenues.map((sales, i) => allocate(sales * (.82 + i % 5 * .03), weights26, 2));
const missedArticles=new Set(missedSeeds.data.map(i=>i.article));
export const flooringItems: FlooringItem[] = normalized.map((item, i) => {
  const r4 = sum(seasonWeeks[i].slice(-4)), r13 = sum(seasonWeeks[i].slice(-13));
  const isNorthport = item.styleId === '1000037';
  const available = Math.max(buys[i], units[i]);
  const sellable = isNorthport ? 0 : Math.max(0, available - units[i]);
  const reason = isNorthport
    ? 'High in-stock run-rate, but intermittent stockouts constrained season sales: -29.3% vs LY. Strong local demand and lower full-season sales can coexist. Validate supply before increasing the buy.'
    : missedArticles.has(item.article)
      ? `Demand and stock are uneven: Cluster A–B stores are stocked out in this synthetic snapshot while other stores hold stock. Full-season sales are ${pct(revenues[i]-lyRevenues[i],lyRevenues[i]).toFixed(1)}% vs LY. Review redistribution before increasing the buy.`
      : `Synthetic ${pct(units[i],available).toFixed(1)}% sell-through; compare demand, stock and margin before changing the range.`;
  return { ...item, revenue:revenues[i], units:units[i], lyRevenue:lyRevenues[i], lyUnits:lyUnits[i],
    growthVsLy:pct(revenues[i] - lyRevenues[i], lyRevenues[i]), unitsGrowthVsLy:pct(units[i] - lyUnits[i], lyUnits[i]),
    buyUnits:available, buyDollars:round(available * revenues[i] / Math.max(units[i],1) * .58),
    aur:round(revenues[i] / Math.max(units[i],1)), grossMargin:margins[i], gmPct:pct(margins[i],revenues[i]),
    stPct:pct(units[i],available), stEopPct:pct(units[i],available),
    ros:round(units[i] / 26 / 45), woh:isNorthport ? 0 : round(sellable / Math.max(units[i]/26,1),1),
    mdPct:12, narration:reason, aiVerdict:isNorthport ? 'keep' : item.aiVerdict,
    r4Sales:round(r4), r13Sales:round(r13), r52Sales:round(sum(beforeWeeks[i])+revenues[i]),
    allocatedAreaSqFt:areas[i], salesPerSqFt:round(revenues[i]/areas[i]),
    planRevenue:plans[i], plrBaseline:baselines[i], sellableUnits:sellable,
    ohCost:round(sellable * revenues[i] / Math.max(units[i],1) * .58),
    definitionStatus:DEFINITION_STATUS, availabilityReason:reason,imageUrl:`/demo-flooring/${item.styleId}.svg` };
});
const swatchByIdentity=new Map(flooringItems.flatMap(item=>[item.styleId,item.article,item.name].map(key=>[key.toLowerCase(),item.imageUrl] as const)));
/** Canonical demo imagery, never an assertion of authentic product photography. */
export function getFlooringSwatchForItem(identity:string):string|null{return swatchByIdentity.get(identity.trim().toLowerCase())??null;}
const aliases: Record<string,keyof FlooringItem> = { category:'l1_name', department:'l1_name', division:'l0_name', subcategory:'l2_name', color:'colour', article_brand_name:'brand', product_type:'l2_name', productId:'styleId' };
export function selectFlooringItems(filters: FlooringFilters = {}): FlooringItem[] {
  const include = new Map<keyof FlooringItem,string[]>(), exclude = new Map<keyof FlooringItem,string[]>();
  const add = (rawKey:string, raw:unknown, blocked=false,allowEmpty=false) => {
    const key = aliases[rawKey] ?? rawKey as keyof FlooringItem;
    if (!(key in flooringItems[0])) return;
    const values = (Array.isArray(raw) ? raw : [raw]).filter(v => typeof v === 'string').map(v => v.toLowerCase());
    if (values.length || allowEmpty) {
      const clauses = blocked ? exclude : include;
      const previous = clauses.get(key);
      // Values inside a clause are OR. Independent workspace/chart clauses are AND.
      // Exclusions combine as a union: not A AND not B is not (A OR B).
      clauses.set(key, previous === undefined ? values : blocked
        ? [...new Set([...previous, ...values])]
        : previous.filter(value => values.includes(value)));
    }
  };
  const walk = (record:FilterRecord) => {
    if(typeof record.levelHierarchy==='string'&&Array.isArray(record.levelHierarchyValue))add(record.levelHierarchy,record.levelHierarchyValue,false,true);
    Object.entries(record).forEach(([k,v]) => {
      if (k === 'filters' && v && typeof v === 'object' && !Array.isArray(v)) walk(v as FilterRecord);
      else if ((k === 'hierarchyScope' || k === 'filter') && Array.isArray(v)) v.forEach(raw => {
        if (!raw || typeof raw !== 'object') return;
        const entry = raw as FilterRecord, key = String(entry.levelNo ?? entry.levelName ?? entry.key ?? entry.attribute ?? '');
        const selected = entry.selectedValues ?? entry.values ?? (entry.selection as FilterRecord | undefined)?.values;
        if (entry.select_all === true||entry.selectAll===true) {
          const field=aliases[key]??key as keyof FlooringItem;
          if(!(field in flooringItems[0]))return;
          const strings=(raw:unknown)=>(Array.isArray(raw)?raw:typeof raw==='string'?[raw]:[]).filter(v=>typeof v==='string') as string[];
          const search=strings(entry.search).map(v=>v.toLowerCase()),exceptSearch=strings(entry.except_search??entry.exceptSearch).map(v=>v.toLowerCase()),except=strings(entry.except).map(v=>v.toLowerCase());
          const allowed=[...new Set(flooringItems.map(i=>String(i[field])))].filter(value=>{
            const lower=value.toLowerCase();return !except.includes(lower)&&(!search.length||search.some(term=>lower.includes(term)))&&!exceptSearch.some(term=>lower.includes(term));
          });
          add(key,[...allowed,...strings(entry.include)],false,true);
        } else add(key,selected,false,Array.isArray(selected)&&selected.length===0);
      });
      else add(k,v,false,Array.isArray(v)&&v.length===0);
    });
  };
  walk(filterRecord(filters));
  return flooringItems.filter(item => [...include].every(([k,v]) => v.includes(String(item[k]).toLowerCase())) && [...exclude].every(([k,v]) => !v.includes(String(item[k]).toLowerCase())));
}
export function totalsFor(items: readonly FlooringItem[]): FlooringTotals {
  const s = (key:keyof FlooringItem) => round(sum(items.map(i => Number(i[key]) || 0)));
  const sales=s('revenue'), quantity=s('units'), buyUnits=s('buyUnits'), grossMargin=s('grossMargin'), area=s('allocatedAreaSqFt');
  return {sales,units:quantity,lyRevenue:s('lyRevenue'),lyUnits:s('lyUnits'),planRevenue:s('planRevenue'),plrBaseline:s('plrBaseline'),
    r4Sales:s('r4Sales'),r13Sales:s('r13Sales'),r52Sales:s('r52Sales'),allocatedAreaSqFt:area,salesPerSqFt:area ? sales/area : 0,
    grossMargin,gmPct:pct(grossMargin,sales),buyUnits,buyDollars:s('buyDollars'),sellThroughPct:pct(quantity,buyUnits),itemCount:items.length,
    ohCost:s('ohCost'),sellableUnits:s('sellableUnits'),definitionStatus:DEFINITION_STATUS};
}
export function getFlooringTotals(filters: FlooringFilters = {}): FlooringTotals {return totalsFor(selectFlooringItems(filters));}
export const flooringTotals = getFlooringTotals();
export function getFlooringMixRows(lens = 'brand',filters:FlooringFilters = {}):FlooringMixRow[] {
  const key = aliases[lens] ?? lens as keyof FlooringItem;
  if (!['brand','species','colour','finish','l1_name','l2_name'].includes(key)) return [];
  const items=selectFlooringItems(filters), total=totalsFor(items);
  const groups=new Map<string,FlooringItem[]>();
  items.forEach(i => {const label=String(i[key] ?? 'Unknown');groups.set(label,[...(groups.get(label)??[]),i]);});
  return [...groups].map(([name,rows]) => {
    const t=totalsFor(rows), salesShare=pct(t.sales,total.sales),skuShare=pct(rows.length,total.itemCount),productivity=skuShare ? salesShare/skuShare : 0,growth=pct(t.sales-t.lyRevenue,t.lyRevenue);
    return {name,sellingSkus:rows.length,sales:t.sales,units:t.units,lyRevenue:t.lyRevenue,lyUnits:t.lyUnits,planRevenue:t.planRevenue,plrBaseline:t.plrBaseline,
      r4Sales:t.r4Sales,r13Sales:t.r13Sales,r52Sales:t.r52Sales,allocatedAreaSqFt:t.allocatedAreaSqFt,salesPerSqFt:t.salesPerSqFt,
      growth,salesShare,skuShare,productivity,gm:t.gmPct,sellThroughPct:t.sellThroughPct,returns:round(2 + name.length % 4*.4,1),
      action:productivity < .85 ? 'Rationalize' as const : growth > 0 ? 'Expand' as const : 'Hold' as const,definitionStatus:DEFINITION_STATUS};
  }).sort((a,b)=>b.sales-a.sales);
}
const storeWeights=seedStores.data.rows.map((s,i)=>({A:1.5,B:1.3,C:1.05,D:.9,E:.75,F:.6}[s.cluster] ?? 1)*(1+i%4*.04));
const supplyWeights=seedStores.data.rows.map((s,i)=>storeWeights[i]/({A:.79,B:.75,C:.68,D:.62,E:.55,F:.49}[s.cluster]??.65));
/** Stable style × store leaves; filtered store totals add these facts rather than re-allocating totals. */
export const flooringItemStores=flooringItems.flatMap(item=>{
  const stocks=seedStores.data.rows.map((s,i)=>missedArticles.has(item.article)&&['A','B'].includes(s.cluster)?0:storeWeights[i]);
  const sales=allocate(item.revenue,storeWeights,2),units=allocate(item.units,storeWeights),gm=allocate(item.grossMargin,storeWeights,2),oh=allocate(item.ohCost,stocks,2),qty=allocate(item.sellableUnits,stocks),area=allocate(item.allocatedAreaSqFt,storeWeights),buys=allocate(item.buyUnits,supplyWeights);
  return seedStores.data.rows.map((store,i)=>({styleId:item.styleId,article:item.article,storeId:store.storeId,sales:sales[i],quantity:units[i],gmDollars:gm[i],onHandCost:oh[i],sellableQty:qty[i],allocatedAreaSqFt:area[i],buyUnits:buys[i]}));
});
export function getFlooringStores(filters:FlooringFilters = {}):FlooringStore[] {
  const ids=new Set(selectFlooringItems(filters).map(i=>i.styleId));
  if(!ids.size)return [];
  return seedStores.data.rows.map(s=>{
    const rows=flooringItemStores.filter(row=>row.storeId===s.storeId&&ids.has(row.styleId));
    const total=(key:keyof typeof rows[number])=>round(sum(rows.map(row=>Number(row[key])||0)));
    const sales=total('sales'),units=total('quantity'),gm=total('gmDollars'),area=total('allocatedAreaSqFt'),buys=total('buyUnits');
    return {storeId:s.storeId,name:s.store,cluster:s.cluster,lat:s.latitude,lon:s.longitude,
      value:pct(units,buys),sales,quantity:units,gmRate:pct(gm,sales),onHandCost:total('onHandCost'),sellableQty:total('sellableQty'),buyUnits:buys,
      allocatedAreaSqFt:area,salesPerSqFt:area?sales/area:0,definitionStatus:DEFINITION_STATUS,sourceLabel:FLOORING_DEMO_LABEL};
  });
}
export function getFlooringClusterRows(filters:FlooringFilters={}) {
  const stores=getFlooringStores(filters);
  if(!stores.length)return [];
  return CLUSTERS.map(cluster=>{const rows=stores.filter(s=>s.cluster===cluster);return {cluster,metric:pct(sum(rows.map(s=>s.quantity)),sum(rows.map(s=>s.buyUnits)))};});
}
export function getFlooringCategoryCluster(filters:FlooringFilters={}) {
  const record=filterRecord(filters), present=new Set(selectFlooringItems(filters).map(i=>i.l1_name));
  return CATEGORIES.filter(category=>present.has(category)).flatMap(category=>getFlooringClusterRows({...record,l1_name:[category]}).map(row=>({...row,category})));
}
export function getFlooringWeekly(filters:FlooringFilters={}) {
  const items=selectFlooringItems(filters),positions=items.map(i=>flooringItems.indexOf(i));
  const amount=(key:'units'|'revenue'|'lyUnits'|'lyRevenue'|'planRevenue'|'plrBaseline'|'grossMargin',j:number)=>sum(positions.map(i=>allocate(flooringItems[i][key],weights26,key.toLowerCase().includes('units')?0:2)[j]));
  return weights26.map((_v,j)=>({week:j+1,actual:amount('units',j),ly:amount('units',j),lly:amount('lyUnits',j),optimisedLy:amount('units',j),forecast:amount('units',j),plan:amount('units',j),optimisedLLy:amount('lyUnits',j),sales:amount('revenue',j),lySales:amount('lyRevenue',j),planSales:amount('planRevenue',j),plrBaselineSales:amount('plrBaseline',j),grossMargin:amount('grossMargin',j)}));
}
export function getFlooringSummarize(body:Record<string,unknown>,filters:FlooringFilters={}):string[] {
  if(body.cardType!=='chart')return getFlooringInsight(String(body.dimension??body.component??body.promptKey??'kpi'),filters);
  const series=Array.isArray(body.series)?body.series as {name?:string;data?:{label?:string;value?:number;cluster?:string}[]}[]:[];
  const points=series[0]?.data?.filter(p=>typeof p.value==='number'&&typeof p.label==='string')??[];
  if(!points.length)return [];
  const metric=String(body.metric??''),unit=/qty|slsu|units/i.test(metric)?'selling units':/revenue|sales|sls\$/i.test(metric)?'USD':metric;
  if(/pct|percentage|gm%|st%|aur|asp/i.test(metric))return [];
  if(points.every(p=>/^\d+$/.test(p.label!)))return [`The ${points.length} displayed prototype periods total ${sum(points.map(p=>p.value!)).toLocaleString('en-US',{maximumFractionDigits:2})} ${unit} for SS26.`, 'Weekly and monthly views aggregate the same facts; calendar alignment remains definition TBC.'];
  const productTypes=new Set(flooringItems.map(i=>i.l2_name));
  if(points.every(p=>productTypes.has(p.label!))) {
    const total=sum(points.map(p=>p.value!)),lead=[...points].sort((a,b)=>b.value!-a.value!)[0];
    return [`${lead.label} leads this sub-category cut with ${lead.value!.toLocaleString('en-US',{maximumFractionDigits:2})} ${unit}${total>0?` (${pct(lead.value!,total).toFixed(1)}% of the displayed total)`:''}.`,'Contribution and cumulative percentages are derived from the selected additive metric, not from another measure.'];
  }
  if(points.some(p=>p.cluster))return ['This heatmap compares the current flooring cut across Clusters A–F.','The percentages are synthetic absolute sell-through rates, not sales growth.'];
  return []; // An unrecognized chart gets no repeated generic scorecard narrative.
}
export function getFlooringNarratives(filters:FlooringFilters={}) {
  const t=getFlooringTotals(filters),lead=getFlooringMixRows('brand',filters).slice(0,2),product=getFlooringMixRows('product_type',filters)[0],clusters=getFlooringClusterRows(filters),best=clusters[0],worst=clusters.at(-1)!;
  if(!t.itemCount)return {assortmentAndAttributes:'<p>No flooring styles match the applied scope.</p>',whatsWorking:'<p>No matching style facts to summarize.</p>',whatsNotWorking:'<p>Change the product filters to review an available cut.</p>',whereToAdjust:'<p>No range or buy decision is suggested for an empty scope.</p>'};
  const northport=selectFlooringItems(filters).find(i=>i.styleId==='1000037');
  const growth=pct(t.sales-t.lyRevenue,t.lyRevenue);
  return {
    assortmentAndAttributes:`<p>The synthetic SS26 Flooring scope delivered <green>$${(t.sales/1e6).toFixed(2)}M in net sales (${growth>=0?'+':''}${growth.toFixed(1)}% vs LY)</green> across ${t.itemCount} canonical styles. ${lead.map(r=>r.name).join(' and ')} contribute ${sum(lead.map(r=>r.salesShare)).toFixed(1)}% of sales. All views use this same ledger.</p>`,
    whatsWorking:`<ul><li>${product?`${product.name} is the leading product type at ${product.salesShare.toFixed(1)}% of sales`:'No product types match the current scope'}.</li><li>Cluster ${best.cluster} leads at <green>${best.metric.toFixed(1)}% sell-through</green> versus ${t.sellThroughPct.toFixed(1)}% for the chain.</li><li>Gross margin is <green>${t.gmPct.toFixed(1)}%</green>, calculated from the same $${(t.grossMargin/1e6).toFixed(2)}M margin dollars.</li></ul>`,
    whatsNotWorking:`<ul><li>${northport?'Northport 1000037 has strong in-stock demand, but intermittent stockouts constrained full-season sales to <red>-29.3% vs LY</red>':'Review the scoped product trends together with store availability; broader-category exceptions do not apply to this cut'}.</li><li>Cluster ${worst.cluster} trails at <red>${worst.metric.toFixed(1)}% sell-through</red>; review demand and supply before allocating.</li><li>Rolling windows, sales per sq ft and PLR baseline remain <red>synthetic, definition TBC</red>.</li></ul>`,
    whereToAdjust:`<ol><li>${northport?'Validate the existing supply pipeline for Northport before increasing its buy':'Validate the open supply for the selected products before changing their buys'}.</li><li>Review store-level availability and the A–F cluster cuts before redistributing stock.</li><li>Confirm F&amp;D fiscal-week, selling-area and original-PLR definitions before using the placeholder measures for decisions.</li></ol>`,
  };
}
export function getFlooringInsight(dimension='kpi',filters:FlooringFilters={}):string[] {
  const lens=dimension==='color'?'colour':dimension==='article_brand_name'?'brand':dimension;
  const rows=getFlooringMixRows(lens,filters),totals=getFlooringTotals(filters);
  if(!totals.itemCount)return [];
  if(rows.length)return [`${rows[0].name} leads ${lens.replaceAll('_',' ')} sales at ${rows[0].salesShare.toFixed(1)}% of the synthetic SS26 scope.`,`${rows[0].sellingSkus} of ${totals.itemCount} canonical styles contribute $${(rows[0].sales/1e6).toFixed(2)}M; this is the same dataset used by By Item and Sales Mix.`];
  if(dimension.includes('cluster')||dimension.includes('store'))return ['Clusters A–F use the same 45 stores and absolute sell-through percentages.','Cluster A leads; Cluster F trails. Review the store table and availability before moving stock.'];
  if(dimension.includes('week')||dimension.includes('sales'))return [`The 26 synthetic weekly quantities sum to ${totals.units.toLocaleString('en-US')} selling units in the applied scope.`,'The full season is visible; rolling windows use the fixed completed-week cutoff and remain definition TBC.'];
  return [`$${(totals.sales/1e6).toFixed(2)}M sales, ${totals.units.toLocaleString('en-US')} selling units and ${totals.gmPct.toFixed(1)}% GM reconcile across all three tabs.`,...(selectFlooringItems(filters).some(i=>i.styleId==='1000037')?['Northport has strong local demand and a supply constraint, while full-season sales are lower than LY.']:[]),'Synthetic demonstration only; rolling-window, area and PLR definitions require F&D confirmation.'];
}
