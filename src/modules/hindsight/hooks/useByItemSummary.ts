import { useCallback, useMemo } from 'react';
import type { LoadStatus } from '@shared/types';
import { BY_ITEM_SUMMARY_SCOPE, getByItemSummary } from '../api';
import type { ByItemSummaryCards } from '../types';
import { useKeyedRequest } from './useKeyedRequest';

/** Comparisons the summary is requested with until a compare-to control exists in the UI. */
export const DEFAULT_BY_ITEM_COMPARE_TO = ['optimisedly', 'forecast'] as const;

export interface ByItemSummaryParams {
  planCode?: string;
  seasonCode?: number | null;
  compareTo?: string[];
  /** Only fetch while true — e.g. gate on the By Item tab being active. */
  enabled?: boolean;
}

export interface ByItemSummaryResult {
  summary: ByItemSummaryCards | null;
  status: LoadStatus;
  retry: () => void;
}

interface SummaryWrapper {
  cards: ByItemSummaryCards | null;
}

const EMPTY: SummaryWrapper = { cards: null };

export function useByItemSummary({
  planCode,
  seasonCode,
  enabled = true,
}: ByItemSummaryParams): ByItemSummaryResult {
  const key = useMemo(() => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return null;
    return `${planCode}|${seasonCode}`;
  }, [planCode, seasonCode]);

  const fetcher = useCallback(async (): Promise<SummaryWrapper> => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return EMPTY;
    const result = await getByItemSummary({
      planCode,
      ...BY_ITEM_SUMMARY_SCOPE,
      recommendationSource: 'ai',
    });
    return { cards: result.cards };
  }, [planCode, seasonCode]);

  const { data, status, retry } = useKeyedRequest(key, fetcher, EMPTY, enabled);

  return { summary: data.cards, status, retry };
}
