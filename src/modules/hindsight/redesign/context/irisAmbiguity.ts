import { selectedWeekIds, selectScopedPairs } from '../data';
import type { Scope } from '../data';
import { evidenceScope, type FrozenContext } from './irisEvidence';

export type IrisDenominator = 'pair-week' | 'store-week' | 'gross-margin' | 'source-pwps';
export interface IrisResolution { itemIds?: string[]; storeIds?: string[]; weekIds?: string[]; comparison?: Scope['comparison']; denominator?: IrisDenominator; }
export interface IrisClarificationOption { id: string; label: string; resolution: IrisResolution; disabled?: boolean; }
export interface IrisClarification { kind: 'item' | 'store' | 'period' | 'comparison' | 'denominator'; prompt: string; options: IrisClarificationOption[]; }
export interface IrisQuestionContext { context: FrozenContext; questionForEvidence: string; resolution: IrisResolution; clarification?: IrisClarification; }
const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const phraseIn = (text: string, phrase: string) => !!phrase && ` ${normalized(text)} `.includes(` ${normalized(phrase)} `);
const unique = <T,>(values: T[]) => [...new Set(values)];
const ignoredAnchorWords = new Set(['performance','sales','quantity','quantities','metric','metrics','coverage','availability','inventory','productivity','trend','trends','breadth','distribution','decision','decisions','stock','count','counts','exposure','history','range','ranged','store','stores','week','weeks','pair','pairs','store-week','is','are','the','a','an','at','by','for','in','this','that','these','those','what','which','should','of','and','or','has','have','with']);
function references(question: string, kind: 'item' | 'store', masters: {id:string;name:string;article?:string}[]) {
  const ids = new Set<string>(), unknown: string[] = [];
  for (const master of masters) if (phraseIn(question, master.id) || master.article && phraseIn(question, master.article) || phraseIn(question, master.name)) ids.add(master.id);
  const expression = kind === 'item' ? /\b(?:sku|item|product|article)\b(?:\s+(?:id\b\s*)?[:#]?\s*|[:#]\s*)(?:"([^"]+)"|'([^']+)'|([a-z0-9_-]+))/gi : /\b(?:store|location)\b(?:\s+(?:id\b\s*)?[:#]?\s*|[:#]\s*)(?:"([^"]+)"|'([^']+)'|([a-z0-9_-]+))/gi;
  for (const match of question.matchAll(expression)) {
    const token = (match[1] ?? match[2] ?? match[3] ?? '').trim();
    if (!token || ignoredAnchorWords.has(token.toLowerCase())) continue;
    const found = masters.filter(master => normalized(master.id) === normalized(token) || master.article && normalized(master.article) === normalized(token) || normalized(master.name).includes(normalized(token)));
    if (found.length) found.forEach(master => ids.add(master.id)); else unknown.push(token);
  }
  // Canonical SKU IDs and ST location IDs are recognized without guessing arbitrary numbers.
  const bare = kind === 'item' ? question.match(/\b\d{6,12}\b/g) ?? [] : question.match(/\bST\d+\b/gi) ?? [];
  for (const token of bare) { const found = masters.find(master => master.id.toLowerCase() === token.toLowerCase() || master.article?.toLowerCase() === token.toLowerCase()); if (found) ids.add(found.id); else unknown.push(token); }
  return { ids:[...ids], unknown:unique(unknown) };
}
function identityOptions(kind: 'item'|'store', members: {id:string;name:string}[], mentioned: string[]): IrisClarificationOption[] {
  const field = kind === 'item' ? 'itemIds' : 'storeIds';
  return [...(mentioned.length > 1 ? [{id:'mentioned',label:`Use all ${mentioned.length} named ${kind === 'item' ? 'SKUs' : 'stores'} together`,resolution:{[field]:mentioned}}] : []), ...members.map(member => ({id:member.id,label:`${member.id} · ${member.name}`,resolution:{[field]:[member.id]}}))];
}
/** Deterministic reference guard over the frozen permitted cohort; this is not an NLP service. */
export function resolveIrisQuestion(context: FrozenContext, question: string, resolution: IrisResolution = {}): IrisQuestionContext {
  const result: IrisQuestionContext = {context,questionForEvidence:question,resolution};
  const scope = evidenceScope(context), pairs = selectScopedPairs(scope, context.dataset);
  const itemIds = new Set(pairs.map(pair => pair.itemId)), storeIds = new Set(pairs.map(pair => pair.storeId));
  const products = context.dataset.products.filter(item => itemIds.has(item.id)), stores = context.dataset.stores.filter(store => storeIds.has(store.id));
  const itemRefs = references(question,'item',context.dataset.products), storeRefs = references(question,'store',context.dataset.stores);
  const suppliedItems = resolution.itemIds ?? (itemRefs.ids.length === 1 && !itemRefs.unknown.length ? itemRefs.ids : undefined);
  const suppliedStores = resolution.storeIds ?? (storeRefs.ids.length === 1 && !storeRefs.unknown.length ? storeRefs.ids : undefined);
  const identity = (kind:'item'|'store', refs:ReturnType<typeof references>, supplied:string[]|undefined, permitted:Set<string>, members:{id:string;name:string}[]) => {
    const invalid = supplied?.some(id => !permitted.has(id));
    if (invalid || !supplied && (refs.unknown.length || refs.ids.length > 1 || refs.ids.some(id => !permitted.has(id)))) {
      const unknown = unique([...refs.unknown,...refs.ids.filter(id => !permitted.has(id))]);
      result.clarification = {kind,prompt:unknown.length ? `${kind === 'item' ? 'SKU' : 'Store'} reference ${unknown.map(value=>`“${value}”`).join(', ')} is unknown or outside this frozen population. Choose an exact permitted reference; I will not substitute the broader assortment.` : `You named more than one ${kind === 'item' ? 'SKU' : 'store'}. Choose one, or explicitly confirm the named cohort.`,options:identityOptions(kind,members,refs.ids.filter(id=>permitted.has(id)))};
      return true;
    }
    return false;
  };
  if (identity('item',itemRefs,resolution.itemIds,itemIds,products)) return result;
  const selected = {...context.selection,label:context.selection?.label ?? 'Frozen view'};
  if (suppliedItems) selected.itemIds = suppliedItems;
  result.context = {...context,selection:selected};
  const anchoredPairs = suppliedItems ? pairs.filter(pair=>suppliedItems.includes(pair.itemId)) : pairs;
  const anchoredStoreIds = new Set(anchoredPairs.map(pair=>pair.storeId));
  if (identity('store',storeRefs,resolution.storeIds,anchoredStoreIds,stores.filter(store=>anchoredStoreIds.has(store.id)))) return result;
  if (suppliedStores) selected.storeIds = suppliedStores;
  if (suppliedItems || suppliedStores) selected.label = `Explicit answer reference: ${suppliedItems ? suppliedItems.join(', ') : 'applied SKUs'} · ${suppliedStores ? suppliedStores.join(', ') : 'applied stores'}`;
  result.context = {...context,selection:selected};
  const weeks = context.dataset.weeks.filter(week => selectedWeekIds(scope,context.dataset).includes(week.id)).sort((a,b)=>a.start.localeCompare(b.start));
  const knownWindow = /\b(?:R4|R13|R52|MTD|QTD|YTD|SEASON|PLR)\b/i.exec(question)?.[0].toUpperCase();
  const vaguePeriod = /\b(?:last|this|next|previous)\s+(?:season|period|month|quarter|year|week)\b|\brecent(?:ly)?\b/i.test(question) || !!knownWindow && knownWindow !== scope.window;
  const mentionedDates: string[] = question.match(/\b\d{4}-\d{2}-\d{2}\b/g) ?? [];
  const offWindowDate = mentionedDates.some(date => !weeks.some(week => date >= week.start && date <= week.end));
  if (!resolution.weekIds && (vaguePeriod || offWindowDate)) {
    const options: IrisClarificationOption[] = weeks.length ? [{id:'frozen',label:`Use frozen interval · ${weeks[0].start} – ${weeks.at(-1)!.end}`,resolution:{weekIds:weeks.map(week=>week.id)}}] : [];
    weeks.forEach((week,index)=>options.push({id:week.id,label:scope.mode==='plr'?`Elapsed review through ${week.end} · ${index+1} complete weeks`:`${week.start} – ${week.end} · one complete fiscal week`,resolution:{weekIds:scope.mode==='plr'?weeks.slice(0,index+1).map(value=>value.id):[week.id]}}));
    result.clarification={kind:'period',prompt:'Which exact completed interval do you mean? These choices stay inside the frozen evidence. Use page Filters and capture new context for a broader or future period.',options};return result;
  }
  if (resolution.weekIds) {
    const ids = resolution.weekIds.filter(id=>weeks.some(week=>week.id===id));
    if (!ids.length || ids.length !== resolution.weekIds.length) {result.clarification={kind:'period',prompt:'That interval is outside the frozen evidence. Open Filters to change the page, then use current context.',options:[]};return result;}
    result.context={...result.context,selection:{...selected,label:`${selected.label} · explicit ${ids.length}-week interval`,weekIds:ids}};
  }
  if (/compare|versus|\bvs\b/i.test(question) && scope.comparison==='none' && !resolution.comparison) {
    const comparisons:Scope['comparison'][]=['ly','previous',...(scope.mode==='plr'?['original','revision'] as Scope['comparison'][]:[])];
    result.clarification={kind:'comparison',prompt:'Which comparator should be used with this frozen interval?',options:comparisons.map(value=>({id:value,label:({ly:'Matched LY fiscal weeks',previous:'Previous equal completed period',original:'Original approved plan',revision:'Named revision overlay'})[value],resolution:{comparison:value}}))};return result;
  }
  if (resolution.comparison) result.context={...result.context,scope:{...result.context.scope,comparison:resolution.comparison}};
  const explicitDenominator=/pwps|293|294|ranged[ -](?:pair|sku)|pair[ -]week|open[ -]store|store[ -]week|gross[ -]margin|\bgm\b/i.test(question);
  if (/denominator/i.test(question) && !explicitDenominator && !resolution.denominator) {
    result.clarification={kind:'denominator',prompt:'Which denominator do you want to inspect? These are separate definitions; no location or week count will be inferred.',options:[{id:'pair-week',label:'Quantity per ranged SKU–store-week',resolution:{denominator:'pair-week'}},{id:'store-week',label:'Sales or quantity per open store-week',resolution:{denominator:'store-week'}},{id:'gross-margin',label:'Gross margin · summed GM dollars / net sales',resolution:{denominator:'gross-margin'},disabled:context.scope.access!=='full'},{id:'source-pwps',label:'S15 sampled PWPS row · source inference',resolution:{denominator:'source-pwps'}}]};return result;
  }
  if (resolution.denominator) result.questionForEvidence=({ 'pair-week':'Explain the ranged pair-week velocity denominator','store-week':'Explain the open store-week productivity denominator','gross-margin':'Explain the gross margin denominator','source-pwps':'Explain the sampled S15 PWPS denominator' })[resolution.denominator];
  return result;
}
