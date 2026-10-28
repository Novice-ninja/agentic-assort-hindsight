import { useCallback, useEffect, useRef, useState } from 'react';
import type { LoadStatus } from '@shared/types';
import { getHindsightSummary } from '../api/getHindsightSummary';
import type { SeasonNarrativeInsight } from '../types';
import { useFlooringScope } from '../priority/flooringScope';

export interface SeasonNarrativeSummaryParams {
  planCode?: string;
  /**
   * Kept for OverviewPanel prop compatibility. The hindsight-summary endpoint is
   * plan-scoped only — season does not participate in the request or cache key.
   */
  seasonCode?: number | null;
  /** Only fetch while true — e.g. gate on the Overview tab. */
  enabled?: boolean;
  /** Force server regeneration (no UI yet — available for a future Regenerate control). */
  refresh?: boolean;
}

export interface SeasonNarrativeSummaryResult {
  insights: readonly SeasonNarrativeInsight[];
  status: LoadStatus;
  retry: () => void;
}

/**
 * Loads Season Narrative Summary via the agent hindsight-summary API.
 *
 * Conversion to the insight-feed shape happens in the data layer (section titles
 * and sequence only — bodies pass through as pre-tagged HTML). A plan change
 * bumps the request generation so a late response never paints over the new plan.
 */
export function useSeasonNarrativeSummary({
  planCode,
  enabled = true,
  refresh = false,
}: SeasonNarrativeSummaryParams): SeasonNarrativeSummaryResult {
  const [insights, setInsights] = useState<SeasonNarrativeInsight[]>([]);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const flooring = useFlooringScope(planCode);

  const request = useCallback(() => {
    if (planCode === undefined || planCode.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const requestId = ++requestIdRef.current;
    setInsights([]);
    setStatus('loading');

    void getHindsightSummary({
      planCode,
      refresh,
      signal: controller.signal,
      hierarchyScope:flooring.scope,
    })
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setInsights(data.insights);
        setStatus('succeeded');
      })
      .catch((error: unknown) => {
        if (requestId !== requestIdRef.current) return;
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          (error as { name?: string }).name === 'AbortError'
        ) {
          return;
        }
        setInsights([]);
        setStatus('failed');
      });
  }, [planCode, refresh, flooring.scope, flooring.revision]);

  useEffect(() => {
    if (!enabled || planCode === undefined || planCode.length === 0) {
      requestIdRef.current += 1;
      abortRef.current?.abort();
      setInsights([]);
      setStatus('idle');
      return;
    }
    request();
    return () => {
      abortRef.current?.abort();
    };
  }, [enabled, planCode, request]);

  return { insights, status, retry: request };
}
