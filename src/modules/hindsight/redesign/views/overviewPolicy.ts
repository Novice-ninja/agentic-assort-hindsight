/** Card support is narrower than the full definition library; never alias different KPI contracts. */
export const defaultOverviewCards = (mode: string) => mode === 'plr' ? ['K01','K02','K04','K26','K10','K08'] : ['K01','K02','K04','K56','ranged-out','K40'];
const tactical = new Set(['K01','K02','K03','K04','K05','K06','K23','K40','K56','ranged-out']);
const strategic = new Set([...defaultOverviewCards('plr')]);
export function cardAvailability(mode:string,id:string): { available:boolean; reason:string } {
  if ((mode==='plr'?strategic:tactical).has(id)) return {available:true,reason:'Calculated from the connected illustrative facts for this review mode.'};
  return {available:false,reason:mode==='plr'?'This metric has a definition, but no governed original-cohort scorecard calculation for this mode. Inspect it in the relevant evidence view or metric library.':'This metric needs a separate valuation, dated membership, forecast or source definition. It cannot be substituted with on-hand cost or a location count.'};
}
