import { useCallback, useMemo } from 'react';
import type { LoadStatus } from '@shared/types';
import { getAttributeColumnConfig } from '../api';
import type { ColumnConfigEntry } from '../types';
import { useKeyedRequest } from './useKeyedRequest';

export interface AttributeColumnConfigParams {
  planCode?: string;
  seasonCode?: number | null;
  enabled?: boolean;
}

export interface AttributeColumnConfigResult {
  groups: readonly ColumnConfigEntry[];
  status: LoadStatus;
  retry: () => void;
}

const EMPTY_ENTRIES: ColumnConfigEntry[] = [];

export function useAttributeColumnConfig({
  planCode,
  seasonCode,
  enabled = true,
}: AttributeColumnConfigParams): AttributeColumnConfigResult {
  const key = useMemo(() => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) {
      return null;
    }
    return `col-config|${planCode}|${seasonCode}`;
  }, [planCode, seasonCode]);

  const fetcher = useCallback(async () => {
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) {
      return EMPTY_ENTRIES;
    }
    return getAttributeColumnConfig({ planCode, seasonCode });
  }, [planCode, seasonCode]);

  const { data, status, retry } = useKeyedRequest(key, fetcher, EMPTY_ENTRIES, enabled);

  return { groups: data, status, retry };
}
