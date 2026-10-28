import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import { buildStoredFilterStrip, savePlanFilterStrip } from '../services/buildPlanFilterStrip';
import { filterStripStorageKey } from '../types/filterStrip';
import plans from '@mocks/pdfData/PL-plans.json';
import { selectFlooringItems } from '@mocks/flooringDemo';

export const FLOORING_SCOPE_EVENT = 'assort-flooring-scope-applied';
const DEFAULT_PLAN = plans.data[0].planCode;
const cache = new Map<string,{scope:HierarchyScopeEntry[];revision:number}>();
const levels: Record<string,string> = {Division:'l0_name',Category:'l1_name','Sub Category':'l2_name'};
function migrateUnmodifiedDefault(scope:HierarchyScopeEntry[],planCode:string) {
  const original:Record<string,string[]>={l0_name:['Flooring'],l1_name:['Hardwood','Engineered Hardwood','Bamboo'],l2_name:['Solid Hardwood','Water Resistant Engineered','Wire Brushed Engineered','Stranded Bamboo']};
  const unchanged=planCode===DEFAULT_PLAN&&scope.length===3&&scope.every(entry=>original[entry.levelNo]&&entry.selectedValues.length===original[entry.levelNo].length&&entry.selectedValues.every(value=>original[entry.levelNo].includes(value))&&!entry.selectAll&&![entry.search,entry.exceptSearch,entry.except,entry.include].some(value=>value?.length));
  return unchanged?scope.map(entry=>entry.levelNo==='l2_name'?{...entry,selectedValues:[...entry.selectedValues,'Hand Scraped Hardwood']}:entry):scope;
}
function initialScope(planCode: string): HierarchyScopeEntry[] {
  try {
    if (typeof window !== 'undefined') {
      const own = JSON.parse(window.sessionStorage.getItem(`assort-flooring-scope:${planCode}`) ?? 'null');
      if(own?.version===2&&Array.isArray(own.scope))return own.scope;
      if (Array.isArray(own) && own.every(entry => typeof entry?.levelNo === 'string' && Array.isArray(entry.selectedValues))) {
        const migrated=migrateUnmodifiedDefault(own,planCode);window.sessionStorage.setItem(`assort-flooring-scope:${planCode}`,JSON.stringify({version:2,scope:migrated}));return migrated;
      }
      const strip = JSON.parse(window.sessionStorage.getItem(filterStripStorageKey(planCode)) ?? 'null');
      if (planCode !== DEFAULT_PLAN && Array.isArray(strip?.groups)) return strip.groups.map((group:any) => ({levelName:group.label,levelNo:group.key,selectedValues:group.values.map((value:any)=>value.id)}));
    }
  } catch { /* Storage unavailable: use the matching local plan record. */ }
  const plan = plans.data.find(plan=>plan.planCode===planCode);
  if (!plan) return [];
  return plan.hierarchyScope.split(';').flatMap(part=>{
    const separator=part.indexOf(':');if(separator<0)return[];
    const levelName=part.slice(0,separator).trim();const levelNo=levels[levelName];
    const selectedValues=part.slice(separator+1).split(',').map(value=>value.trim()).filter(Boolean);
    if(planCode===DEFAULT_PLAN&&levelNo==='l2_name'&&!selectedValues.includes('Hand Scraped Hardwood'))selectedValues.push('Hand Scraped Hardwood');
    return levelNo?[{levelName,levelNo,selectedValues}]:[];
  });
}
function snapshot(planCode=DEFAULT_PLAN) { let value=cache.get(planCode);if(!value){value={scope:initialScope(planCode),revision:0};cache.set(planCode,value);}return value; }
export function getFlooringScope(planCode=DEFAULT_PLAN): HierarchyScopeEntry[] { return snapshot(planCode).scope; }
export function flooringScopeFilters(scope:readonly HierarchyScopeEntry[]):Record<string,unknown> { return {hierarchyScope:scope}; }
/** Resolve chip labels from the selected population without discarding the request recipe. */
export function flooringScopeForDisplay(scope:readonly HierarchyScopeEntry[]):HierarchyScopeEntry[] {
  const items=selectFlooringItems({hierarchyScope:scope});
  return scope.map(entry=>{
    if(!['l0_name','l1_name','l2_name'].includes(entry.levelNo))return {...entry,selectedValues:[...entry.selectedValues]};
    const values=[...new Set(items.map(item=>String(item[entry.levelNo as 'l0_name'|'l1_name'|'l2_name'])))];
    const present=new Set(values);
    const selectedValues=[...entry.selectedValues.filter(value=>present.has(value)),...values.filter(value=>!entry.selectedValues.includes(value))];
    return {...entry,selectedValues};
  });
}
export function applyFlooringScope(scope:readonly HierarchyScopeEntry[],planCode=DEFAULT_PLAN):void {
  const normalized=scope.map(entry=>({...entry,selectedValues:[...entry.selectedValues]}));
  const previous=snapshot(planCode);cache.set(planCode,{scope:normalized,revision:previous.revision+1});
  const plan=plans.data.find(plan=>plan.planCode===planCode)??plans.data[0];
  savePlanFilterStrip(buildStoredFilterStrip({id:planCode,season:plan.planSeason,hierarchyScope:flooringScopeForDisplay(normalized)}));
  try { if(typeof window!=='undefined')window.sessionStorage.setItem(`assort-flooring-scope:${planCode}`,JSON.stringify({version:2,scope:normalized})); } catch {}
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(FLOORING_SCOPE_EVENT,{detail:{planCode,scope:normalized,revision:previous.revision+1}}));
}
export function useFlooringScope(planCode=DEFAULT_PLAN) {
  const subscribe=useCallback((listener:()=>void)=>{if(typeof window==='undefined')return()=>{};const handler=(event:Event)=>{if((event as CustomEvent).detail?.planCode===planCode)listener();};window.addEventListener(FLOORING_SCOPE_EVENT,handler);return()=>window.removeEventListener(FLOORING_SCOPE_EVENT,handler);},[planCode]);
  const get=useCallback(()=>snapshot(planCode),[planCode]);
  const current=useSyncExternalStore(subscribe,get,get);
  useEffect(()=>{
    if(typeof window==='undefined')return;
    const plan=plans.data.find(plan=>plan.planCode===planCode)??plans.data[0];
    const expected=buildStoredFilterStrip({id:planCode,season:plan.planSeason,hierarchyScope:flooringScopeForDisplay(current.scope)});
    try{const stored=JSON.parse(window.sessionStorage.getItem(filterStripStorageKey(planCode))??'null');if(JSON.stringify(stored?.groups)!==JSON.stringify(expected.groups))applyFlooringScope(current.scope,planCode);}catch{}
  },[planCode]);
  return current;
}
