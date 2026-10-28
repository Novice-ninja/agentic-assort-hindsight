import type { Recommendation, Verdict, VerdictTotals } from '../types';

/**
 * The verdict currently in effect.
 *
 * This is derived rather than stored, which is what makes "the agent's original stays
 * recoverable" true by construction. Turning overrides off reveals the agent's verdicts
 * without discarding a single override.
 */
export function effectiveVerdict(
  recommendation: Recommendation | undefined,
  overridesEnabled: boolean,
): Verdict | undefined {
  if (recommendation === undefined) return undefined;
  if (overridesEnabled && recommendation.override !== undefined) {
    return recommendation.override.verdict;
  }
  return recommendation.agentVerdict;
}

/** True when a planner has changed this item's verdict, for the overridden treatment. */
export function isOverridden(
  recommendation: Recommendation | undefined,
  overridesEnabled: boolean,
): boolean {
  return overridesEnabled && recommendation?.override !== undefined;
}

/**
 * Totals count the verdicts in effect, so the bar tracks the override switch. Only items
 * present in `itemIds` are counted, which is what keeps the totals aligned with a searched
 * or filtered set rather than the whole collection.
 */
export function verdictTotals(
  recommendations: Record<string, Recommendation>,
  itemIds: string[],
  overridesEnabled: boolean,
): VerdictTotals {
  const totals: VerdictTotals = { keep: 0, shop: 0, drop: 0 };
  itemIds.forEach((id) => {
    const verdict = effectiveVerdict(recommendations[id], overridesEnabled);
    if (verdict !== undefined) totals[verdict] += 1;
  });
  return totals;
}

/**
 * Applies a planner's choice. Selecting the agent's own verdict clears the override rather
 * than storing a redundant one, so "overridden" keeps meaning something.
 */
export function applyOverride(
  recommendation: Recommendation,
  verdict: Verdict,
  by: string,
  at: string = new Date().toISOString(),
): Recommendation {
  if (verdict === recommendation.agentVerdict) {
    return {
      itemId: recommendation.itemId,
      agentVerdict: recommendation.agentVerdict,
      agentNarrationId: recommendation.agentNarrationId,
    };
  }
  return { ...recommendation, override: { verdict, at, by } };
}
