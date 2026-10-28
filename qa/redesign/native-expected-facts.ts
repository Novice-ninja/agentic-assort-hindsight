import {writeFileSync} from 'node:fs';
import * as a from '../../src/modules/hindsight/redesign/data';
const data=a.getDefaultDataset();
const pick=(total:any)=>Object.fromEntries(['sales','comparisonSales','salesChange','salesChangePct','quantity','gmDollars','gmRate','ohCost','physicalOh','sellableOh','openInbound','velocity','itemCount','storeCount','pairCount','rangedPairCount','stockoutPairCount','openCaseCount','impactedPairCount','impactedSkuCount','rangedSkuCount','storeExposureWeeks','salesPerStoreWeek'].map(key=>[key,total[key]]));
const windows=['R4','R13','R52','SEASON'] as const;
const scopes:any={};
for(const window of windows){const scope={...a.createDefaultScope('in-season',data),window};const total=a.aggregatePairs(a.selectScopedPairs(scope,data),data);const weeks=a.selectedWeekIds(scope,data).map(id=>data.weeks.find(week=>week.id===id)!);scopes[window]={scope,dates:[weeks[0]?.start,weeks.at(-1)?.end],weekCount:weeks.length,total:pick(total)};}
const plrScope=a.createDefaultScope('plr',data),plr=a.getPlrReview(plrScope,data);
const season=scopes.SEASON.scope;
const pair=a.getPairFact('1000037','ST1001',season,data);
const product=a.getItemRows(season,data).find(row=>row.id==='1000037');
const r4Northport=a.getItemRows(a.withProductIds(scopes.R4.scope,['1000037']),data)[0], r4Pair=a.getPairFact('1000037','ST1001',scopes.R4.scope,data);
const compScope={...season,compPolicyId:a.DEMO_COMP_POLICY_ID};const comp=a.getCompPolicyResult(compScope,data);
const bamboo={...season,productFacets:{...season.productFacets,subcategories:['Bamboo']}};
const out={status:'Expected facts derived from current actual selectors; not browser execution',version:data.version,calendar:data.calendar,refresh:data.feeds.refreshedAt,master:{styles:data.products.length,stores:data.stores.length,candidates:data.products.length*data.stores.length},scopes,plr:{scope:plrScope,review:Object.fromEntries(Object.entries(plr).filter(([key])=>key!=='originalPairs'))},northport:{r4Product:r4Northport?pick(r4Northport):null,r4Pair:r4Pair?pick(r4Pair):null,product:product?{id:product.id,name:product.name,...pick(product)}:null,pair:pair?{id:pair.id,store:pair.store,range:pair.range,state:pair.matrixState,...pick(pair),supply:pair.supply}:null},bamboo:{scope:bamboo,total:pick(a.aggregatePairs(a.selectScopedPairs(bamboo,data),data))},comp:{scope:compScope,policy:comp,total:pick(a.aggregatePairs(a.selectScopedPairs(compScope,data),data))},matrixLast:{item:data.products.at(-1),store:data.stores.at(-1)},cases:data.cases};
writeFileSync('qa/redesign/native-expected-facts.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({version:data.version,scopes:Object.fromEntries(Object.entries(scopes).map(([key,value]:any)=>[key,{sales:value.total.sales,qty:value.total.quantity,pairs:value.total.pairCount,caseCount:value.total.openCaseCount,dates:value.dates}])),plrKeys:Object.keys(plr),compSales:(out.comp.total as any).sales,compStores:comp.cohortStoreIds.length,lastItem:out.matrixLast.item?.id,lastStore:out.matrixLast.store?.id}));
