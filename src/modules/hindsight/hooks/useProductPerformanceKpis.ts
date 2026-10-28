import { useCallback, useMemo } from 'react';
import type { LoadStatus } from '@shared/types';
import { getProductPerformanceKpis } from '../api';
import type { ProductPerformanceKpi } from '../types';
import { useKeyedRequest } from './useKeyedRequest';

/** Default comparisons until a compare-to control exists in the UI. */
export const DEFAULT_COMPARE_TO = ['lyOptimised','lly'] as const;

export interface ProductPerformanceKpiParams {
  planCode?: string;
  seasonCode?: number | null;
  compareTo?: string[];
  /** Only fetch while true — e.g. gate on the Overview tab being active. */
  enabled?: boolean;
}

export interface ProductPerformanceKpiResult {
  kpis: ProductPerformanceKpi[];
  status: LoadStatus;
  retry: () => void;
}

const EMPTY_KPIS: ProductPerformanceKpi[] = [];

export function useProductPerformanceKpis({
  planCode,
  seasonCode,
  compareTo = [...DEFAULT_COMPARE_TO],
  enabled = true,
}: ProductPerformanceKpiParams): ProductPerformanceKpiResult {
  const compareKey = compareTo.join(',');

  const key = useMemo(() => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return null;
    return `${planCode}|${seasonCode}|${compareKey}`;
  }, [planCode, seasonCode, compareKey]);

  const fetcher = useCallback(async () => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) {
      return { kpis: EMPTY_KPIS };
    }
    return getProductPerformanceKpis({
      planCode,
      seasonCode: String(seasonCode),
      compareTo: compareKey.length > 0 ? compareKey.split(',') : [],
    });
  }, [planCode, seasonCode, compareKey]);

  const { data, status, retry } = useKeyedRequest(
    key,
    fetcher,
    { kpis: EMPTY_KPIS },
    enabled,
  );

  return { kpis: data.kpis, status, retry };
}
