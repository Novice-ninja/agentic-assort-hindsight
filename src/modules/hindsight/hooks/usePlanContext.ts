import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface PlanContext {
  planCode: string | undefined;
  /** Analytics season code the Hindsight APIs key on. */
  referenceSeasonCode: number | undefined;
  /** The plan's own planning season. By Item hooks wait for it via context; it is not posted. */
  planSeasonCode: number | undefined;
  planName: string | undefined;
}

/**
 * Reads the plan context that `AllPlansPage` passes through `location.state`.
 *
 * Every Hindsight API that needs a plan code or a season code reads it from here instead of
 * fetching it via a separate round trip (`kpi-seasons`). Direct navigation to `/hindsight`
 * without state leaves every field `undefined`, and hooks that receive those values skip their
 * requests — no plan, no request.
 */
function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function usePlanContext(): PlanContext {
  const location = useLocation();

  return useMemo(() => {
    const state = (location.state ?? {}) as Record<string, unknown>;
    return {
      planCode: typeof state.planId === 'string' ? state.planId : undefined,
      referenceSeasonCode: toFiniteNumber(state.referenceSeasonCode),
      planSeasonCode: toFiniteNumber(state.seasonCode),
      planName: typeof state.planName === 'string' ? state.planName : undefined,
    };
  }, [location.state]);
}
