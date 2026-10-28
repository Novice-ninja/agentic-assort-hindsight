import { useCallback, useMemo } from 'react';
import { isDev } from '@config/env';
import type { LoadStatus } from '@shared/types';
import { getProductContribution } from '../api';
import { toContributionDataList } from '../services/productContribution';
import type { ContributionData, ProductContributionData } from '../types';
import { useKeyedRequest } from './useKeyedRequest';

export interface ProductContributionParams {
  planCode?: string;
  seasonCode?: number | null;
  /** Only fetch while true — e.g. gate on the Overview tab being active. */
  enabled?: boolean;
}

export interface ProductContributionResult {
  contributions: ContributionData[];
  titles: Record<string, string>;
  status: LoadStatus;
  retry: () => void;
}

const EMPTY_DATA: ProductContributionData = { planId: '', topN: 0, cards: [] };

export function useProductContribution({
  planCode,
  seasonCode,
  enabled = true,
}: ProductContributionParams): ProductContributionResult {
  const key = useMemo(() => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return null;
    return `${planCode}|${seasonCode}`;
  }, [planCode, seasonCode]);

  const fetcher = useCallback(async () => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return EMPTY_DATA;
    return getProductContribution({ planCode, seasonCode: String(seasonCode) });
  }, [planCode, seasonCode]);

  const { data, status, retry } = useKeyedRequest(key, fetcher, EMPTY_DATA, enabled);

  if (isDev && status === 'failed') {
    // eslint-disable-next-line no-console
    console.warn(
      '[hindsight] scoped contribution request failed. Overview will show its unavailable state.',
    );
  }

  const contributions = useMemo(() => toContributionDataList(data.cards), [data.cards]);
  const titles = useMemo(
    () =>
      Object.fromEntries(
        data.cards.map((card) => [`contribution-${card.dimension}`, card.title]),
      ),
    [data.cards],
  );

  return { contributions, titles, status, retry };
}
