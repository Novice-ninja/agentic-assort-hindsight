import type { Observation, PairFact } from '../data';

type ObservationAxes = Pick<Observation, 'itemIds' | 'storeIds'> & { pairIds?: string[] };
type ObservationSelection = { itemIds?: readonly string[]; storeIds?: readonly string[]; pairIds?: readonly string[] };

/** An explicit pair cohort takes precedence over the legacy axis-only representation. */
export function observationMatchesPair(note: ObservationAxes, pair: Pick<PairFact, 'id' | 'itemId' | 'storeId'>): boolean {
  return (note.pairIds === undefined || note.pairIds.includes(pair.id))
    && (!note.itemIds.length || note.itemIds.includes(pair.itemId))
    && (!note.storeIds.length || note.storeIds.includes(pair.storeId));
}

/** Resolve supplied anchors before deriving missing axes, without a Cartesian expansion. */
export function affectedObservationPairs(pairs: PairFact[], input: ObservationSelection): { pairs: PairFact[]; errors: string[] } {
  const errors: string[] = [];
  if (input.itemIds?.some(id => !pairs.some(pair => pair.itemId === id))
    || input.storeIds?.some(id => !pairs.some(pair => pair.storeId === id))
    || input.pairIds?.some(id => !pairs.some(pair => pair.id === id))) errors.push('Observation scope must remain within the applied canonical product–store population.');
  const affected = pairs.filter(pair => (input.itemIds === undefined || input.itemIds.includes(pair.itemId))
    && (input.storeIds === undefined || input.storeIds.includes(pair.storeId))
    && (input.pairIds === undefined || input.pairIds.includes(pair.id)));
  if (!affected.length) errors.push('Choose at least one matching product–store pair for this observation.');
  if (input.itemIds?.some(id => !affected.some(pair => pair.itemId === id))
    || input.storeIds?.some(id => !affected.some(pair => pair.storeId === id))) errors.push('The supplied product and store anchors do not form a matching pair inside the applied population.');
  return { pairs: affected, errors: [...new Set(errors)] };
}
