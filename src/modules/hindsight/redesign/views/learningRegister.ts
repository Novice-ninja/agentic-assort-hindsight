import { createDefaultScope, isContiguousReviewPrefix, type CaseRecord, type Dataset, type DecisionRecord, type Learning, type Scope } from '../data';

export interface LearningRegisterSettings { direction:'origin'|'destination'; destinationId:string; }
/** A destination reading view includes reviewed, explicitly accepted records only. */
export function acceptedLearningDestinations(learnings:readonly Learning[]):string[] {
  return [...new Set(learnings.filter(learning=>learning.state==='Accepted'&&learning.nextReviewId.trim()).map(learning=>learning.nextReviewId.trim()))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
}
export function learningRegisterRows(learnings:readonly Learning[], reviewId:string, settings:LearningRegisterSettings):Learning[] {
  return learnings.filter(learning=>settings.direction==='destination'
    ? learning.state==='Accepted'&&!!settings.destinationId&&learning.nextReviewId.trim()===settings.destinationId
    : learning.reviewId===reviewId).slice().sort((a,b)=>(b.reviewedAt??b.recordedAt??'').localeCompare(a.reviewedAt??a.recordedAt??'')||a.id.localeCompare(b.id,undefined,{numeric:true}));
}
/** Reading a destination never creates that PLR. Only an existing source approval can be opened. */
export function learningOriginScope(learning:Learning, current:Scope, dataset:Dataset):Scope|null {
  const review=dataset.reviews?.find(review=>review.id===learning.reviewId);
  const version=dataset.versions.find(version=>version.reviewId===learning.reviewId&&version.id===learning.version);
  if(!review||!version)return null;
  const scope:Scope={...createDefaultScope('plr',dataset),...learning.scope,mode:'plr',reviewId:learning.reviewId,version:version.id,calendarId:review.calendarId,seasonId:review.seasonId,window:'PLR',population:'original',comparison:'original',access:current.access,compPolicyId:undefined,compPolicyAnchor:undefined};
  if(!isContiguousReviewPrefix(scope,dataset))scope.weekIds=undefined;
  return scope;
}
/** Pair overlap alone is not proof that a case authored this learning. */
export function learningCaseLinks(learning:Learning,cases:readonly CaseRecord[],decisions:readonly DecisionRecord[]):CaseRecord[] {
  const evidence=new Set(learning.evidenceIds),ids=new Set(decisions.filter(decision=>evidence.has(decision.id)).map(decision=>decision.caseId));
  return cases.filter(record=>evidence.has(record.id)||ids.has(record.id));
}
