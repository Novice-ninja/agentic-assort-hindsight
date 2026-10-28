import { freezeCompCohort, selectedMasters, selectedWeekIds, selectScopedPairs, type Dataset, type Scope, type TrendPoint } from '../data';
import type { LocalSelection } from '../context/types';

/** Presence is significant: an explicitly empty local set means no members. */
export function analysisScope(scope: Scope, local: LocalSelection | null, dataset: Dataset): Scope {
  if (!local) return scope;
  scope=freezeCompCohort(scope,dataset);
  const allowedWeeks = selectedWeekIds(scope, dataset);
  let base: Scope = local.weekIds ? {...scope,weekIds:allowedWeeks.filter(id=>local.weekIds!.includes(id))} : scope;
  // Product/store cuts constrain the master axes, not the approved cohort. The PLR
  // reconciliation still needs later additions on those axes to remain visible.
  const masters=selectedMasters(base,dataset);
  if(local.itemIds) {
    const productIds=masters.products.filter(item=>local.itemIds!.includes(item.id)).map(item=>item.id);
    base={...base,productIds,productSelection:productIds.length?'selected':'none'};
  }
  if(local.storeIds) {
    const storeIds=masters.stores.filter(store=>local.storeIds!.includes(store.id)).map(store=>store.id);
    base={...base,storeIds,storeSelection:storeIds.length?'selected':'none'};
  }
  if(!local.pairIds && !local.attribute) return base;
  const universe:Scope=base.mode==='plr'?{...base,mode:'in-season',population:'all-candidates'}:base;
  const pairs = selectScopedPairs(universe,dataset).filter(pair =>
    (!local.pairIds || local.pairIds.includes(pair.id)) &&
    (!local.attribute || String((pair.item as unknown as Record<string, unknown>)[local.attribute.lens] ?? 'Unknown') === local.attribute.value));
  return {...base,pairIds:pairs.map(pair=>pair.id)};
}

/** A fiscal-month mark represents only the weeks already inside the applied window. */
export function trendEvidenceScope(scope:Scope, points:TrendPoint[], dataset:Dataset):Scope {
  const allowed=new Set(selectedWeekIds(scope,dataset));
  return {...scope,weekIds:dataset.weeks.filter(week=>allowed.has(week.id)&&points.some(point=>week.start>=point.start&&week.end<=point.end)).map(week=>week.id)};
}
