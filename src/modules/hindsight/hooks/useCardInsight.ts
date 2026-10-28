import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import type { LoadStatus } from '@shared/types';
import { cardInsightKey, fetchCardInsight } from '../store/hindsightSlice';
import type { CardInsightArgs } from '../store/hindsightSlice';
import type { InsightBullet, SummarizeRequest } from '../types';
import { useFlooringScope } from '../priority/flooringScope';

const NO_BULLETS: InsightBullet[] = [];

export interface CardInsightParams {
  planCode?: string;
  /** Season code from the plan's `kpi-seasons` list. */
  seasonCode?: number | null;
  /** What this insight is about. See `CardInsightArgs.scope`. */
  scope: string;
  /** Null when there is nothing worth summarising. */
  payload: SummarizeRequest | null;
}

export interface CardInsightResult {
  status: LoadStatus;
  bullets: InsightBullet[];
  /** False when there is nothing to ask for, so the caller can say so instead of spinning. */
  available: boolean;
  /** Asks for the insight. A cached or in-flight one is left alone; a failed one is retried. */
  request: () => void;
}

/**
 * One card's or chart's AI summary.
 *
 * The caller subscribes to its own cache entry and nothing else, so an insight arriving for one
 * widget leaves every other widget on the tab untouched.
 */
export function useCardInsight({
  planCode,
  seasonCode,
  scope,
  payload,
}: CardInsightParams): CardInsightResult {
  const dispatch = useAppDispatch();
  const flooring = useFlooringScope(planCode);

  // Without a plan and season the answer could not be cached against what it describes, and the
  // same numbers under a different season would read as this season's.
  const args = useMemo<CardInsightArgs | null>(() => {
    if (payload === null || planCode === undefined) return null;
    if (seasonCode === null || seasonCode === undefined) return null;
    const scopedPayload = { ...payload, planCode, hierarchyScope:flooring.scope };
    return { planCode, seasonCode, scope:`${scope}|flooring:${flooring.revision}`, payload:scopedPayload };
  }, [payload, planCode, scope, seasonCode, flooring.scope, flooring.revision]);

  const key = args === null ? null : cardInsightKey(args);
  const entry = useAppSelector((state) =>
    key === null ? undefined : state.hindsight.cardInsights[key],
  );

  const request = useCallback(() => {
    if (args === null) return;
    void dispatch(fetchCardInsight(args));
  }, [dispatch, args]);

  return {
    status: entry?.status ?? 'idle',
    bullets: entry?.bullets ?? NO_BULLETS,
    available: args !== null,
    request,
  };
}
