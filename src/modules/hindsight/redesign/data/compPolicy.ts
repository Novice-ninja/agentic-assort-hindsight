import type { CompPolicy, Dataset, Scope, Store } from './types';

export const DEMO_COMP_POLICY_ID='demo-flooring-comp-v1';
const ids=['ST1001','ST1002','ST1003','ST1004','ST1005','ST1006','ST1007','ST1008','ST1009','ST1010','ST1011','ST1012','ST1013','ST1014','ST1015','ST1016','ST1017','ST1018','ST1019','ST1020','ST1021','ST1022','ST1023','ST1024','ST1025','ST1026','ST1027','ST1028','ST1029','ST1030','ST1031','ST1032','ST1033','ST1034','ST1035','ST1036','ST1037','ST1038','ST1039','ST1040','ST1041','ST1042','ST1043','ST1044','ST1045'];
const demoPolicy:CompPolicy={id:DEMO_COMP_POLICY_ID,version:'demo-1',name:'Demo Comp locations',status:'illustrative-governed',approval:'Illustrative policy only · not F&D approved',rationale:'The same explicitly eligible canonical stores must trade throughout both the actual and matched comparison windows. ST1045 is a declared rehearsal holdout; its exclusion is not an observed client policy.',effectiveFrom:'2023-07-31',effectiveTo:'2026-12-31',members:ids.map(storeId=>({storeId,state:storeId==='ST1045'?'ineligible':'eligible',reason:storeId==='ST1045'?'Explicit demo holdout; no client exclusion is asserted.':'Explicit demo eligibility, subject to verified opening/closure dates in both windows.',validFrom:'2023-07-31',validTo:'2026-12-31'}))};
demoPolicy.members.forEach(Object.freeze);Object.freeze(demoPolicy.members);Object.freeze(demoPolicy);
export function availableCompPolicies(dataset:Dataset):CompPolicy[] {
  if(dataset.compPolicies!==undefined)return dataset.compPolicies;
  // The fixed demo registry is never used to invent IDs for another master.
  return ids.every(id=>dataset.stores.some(store=>store.id===id))?[demoPolicy]:[];
}
export type CompPolicyState='all-locations'|'ready'|'partial'|'missing'|'unknown'|'out-of-date'|'not-applicable';
export interface CompPolicyResult {
  state:CompPolicyState; valid:boolean; reason:string; label:string; policy?:CompPolicy;
  actualWeekIds:string[]; comparisonWeekIds:string[]; cohortActualWeekIds:string[]; cohortComparisonWeekIds:string[];
  cohortStoreIds:string[]; members:{storeId:string;storeName:string;state:'included'|'excluded'|'unknown';reason:string}[];
  anchored:boolean;
}
const validDate=(value:unknown):value is string=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
const sameIds=(a:string[],b:string[])=>a.length===b.length&&a.every((id,index)=>id===b[index]);
/** One store cohort is resolved before either actual or comparison facts are aggregated. */
export function evaluateCompPolicy(scope:Scope,dataset:Dataset,actualWeekIds:string[],comparisonWeekIds:string[],candidates:Store[],anchorComparisonWeekIds?:string[]):CompPolicyResult {
  const base={actualWeekIds:[...actualWeekIds],comparisonWeekIds:[...comparisonWeekIds],cohortActualWeekIds:[...actualWeekIds],cohortComparisonWeekIds:[...comparisonWeekIds],cohortStoreIds:[] as string[],members:[] as CompPolicyResult['members'],anchored:!!scope.compPolicyAnchor};
  if(!scope.compPolicyId)return {...base,state:'all-locations',valid:true,reason:'All selected canonical locations. Growth is labeled vs the selected comparator, not Comp.',label:'All selected locations',cohortStoreIds:candidates.map(store=>store.id)};
  const policy=availableCompPolicies(dataset).find(policy=>policy.id===scope.compPolicyId);
  const fail=(state:CompPolicyState,reason:string):CompPolicyResult=>({...base,policy,state,valid:false,reason,label:'Demo Comp unavailable',members:candidates.map(store=>({storeId:store.id,storeName:store.name,state:'unknown',reason}))});
  if(scope.mode!=='in-season'||!['ly','previous'].includes(scope.comparison))return fail('not-applicable','Demo Comp is available only in In-season Review with matched LY or previous equal-period comparison. Choose All selected locations for another mode/comparator.');
  if(!policy)return fail('missing','The selected Comp policy is not connected to this canonical store master. No broader all-location cohort was substituted.');
  if(new Set(policy.members.map(member=>member.storeId)).size!==policy.members.length)return fail('unknown','Comp eligibility contains duplicate canonical member records and cannot establish a governed cohort.');
  if(policy.status!=='illustrative-governed')return fail('unknown','Comp eligibility has not been explicitly governed, even for this local rehearsal.');
  const anchor=scope.compPolicyAnchor;
  if(anchor){
    if(new Set(anchor.cohortStoreIds).size!==anchor.cohortStoreIds.length||anchor.cohortStoreIds.some(id=>!dataset.stores.some(store=>store.id===id)))return fail('unknown','The saved Comp cohort contains duplicate or unavailable canonical stores.');
    if(anchor.policyId!==policy.id||anchor.policyVersion!==policy.version||anchor.comparison!==scope.comparison)return fail('out-of-date','The saved Comp anchor no longer matches its policy version or comparator. Apply a current global scope to reevaluate eligibility.');
    if(!actualWeekIds.every(id=>anchor.actualWeekIds.includes(id))||!sameIds(anchor.comparisonWeekIds,anchorComparisonWeekIds??[]))return fail('out-of-date','The displayed interval or comparison mapping is outside the frozen applied Comp window. Reapply global filters to establish a new cohort.');
    base.cohortActualWeekIds=[...anchor.actualWeekIds];base.cohortComparisonWeekIds=[...anchor.comparisonWeekIds];
  }
  const periodIds=[...new Set([...base.cohortActualWeekIds,...base.cohortComparisonWeekIds])],weeks=periodIds.map(id=>dataset.weeks.find(week=>week.id===id));
  if(!actualWeekIds.length||!comparisonWeekIds.length||actualWeekIds.length!==comparisonWeekIds.length||!base.cohortActualWeekIds.length||base.cohortActualWeekIds.length!==base.cohortComparisonWeekIds.length||weeks.some(week=>!week?.complete||!validDate(week.start)||!validDate(week.end)||week.start>week.end))return fail('unknown','Complete actual and explicitly mapped comparison weeks are required to establish Comp eligibility.');
  const start=weeks.map(week=>week!.start).sort()[0],end=weeks.map(week=>week!.end).sort().at(-1)!;
  if(!validDate(policy.effectiveFrom)||!validDate(policy.effectiveTo)||policy.effectiveFrom>policy.effectiveTo)return fail('unknown','The Comp policy effective-date contract is unavailable.');
  if(policy.effectiveFrom>start||policy.effectiveTo<end)return fail('out-of-date',`Comp eligibility is not certified across both windows (${start} – ${end}); policy covers ${policy.effectiveFrom} – ${policy.effectiveTo}.`);
  const members:CompPolicyResult['members']=candidates.map(store=>{
    const record=policy.members.find(member=>member.storeId===store.id),row={storeId:store.id,storeName:store.name};
    if(!record||record.state==='unknown')return {...row,state:'unknown',reason:record?.reason||'No governed eligibility record for this canonical store.'};
    if(record.state==='ineligible')return {...row,state:'excluded',reason:record.reason};
    if(!validDate(record.validFrom)||!validDate(record.validTo))return {...row,state:'unknown',reason:'Eligibility effective dates are missing or invalid.'};
    if(record.validFrom>start||record.validTo<end)return {...row,state:'unknown',reason:`Eligibility record is out of date for both windows (${record.validFrom} – ${record.validTo}).`};
    if(!validDate(store.openedOn)||store.closedOn!==undefined&&!validDate(store.closedOn))return {...row,state:'unknown',reason:'Canonical opening or closure date is unknown/invalid.'};
    if(store.openedOn>start)return {...row,state:'excluded',reason:`Opened ${store.openedOn}; did not trade throughout both selected windows.`};
    if(store.closedOn&&store.closedOn<end)return {...row,state:'excluded',reason:`Closed ${store.closedOn}; did not trade throughout both selected windows.`};
    if(anchor&&!anchor.cohortStoreIds.includes(store.id))return {...row,state:'excluded',reason:'Not in the exact applied Comp cohort; a local interval cannot add a store.'};
    return {...row,state:'included',reason:'Explicitly eligible and trading throughout the same actual and comparison windows.'};
  });
  const cohortStoreIds=members.filter(member=>member.state==='included').map(member=>member.storeId),unknown=members.filter(member=>member.state==='unknown').length;
  return {...base,policy,members,cohortStoreIds,state:unknown?(cohortStoreIds.length?'partial':'unknown'):'ready',valid:!(unknown&&!cohortStoreIds.length),label:'Demo Comp locations',reason:`${cohortStoreIds.length} included, ${members.filter(member=>member.state==='excluded').length} excluded, ${unknown} unknown eligibility. Identical stores are used for actual and comparison. ${policy.approval}.`};
}
