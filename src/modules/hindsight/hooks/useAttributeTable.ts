import { useCallback, useMemo } from 'react';
import type { LoadStatus } from '@shared/types';
import { DEFAULT_ATTRIBUTE_CHANNEL_CODE, getAttributeTableData } from '../api';
import { extractDynamicFields } from '../services/attributeTableRows';
import type {
  AttributeBreakdownRow,
  AttributeTableData,
  ByItemRecommendationFilter,
  ColumnConfigEntry,
} from '../types';
import { DEFAULT_BY_ITEM_RECOMMENDATION } from '../types';
import { useKeyedRequest } from './useKeyedRequest';

export interface AttributeTableParams {
  planCode?: string;
  /** The attribute selected in the cards above the table, sent as the backend's `attrKey`. */
  attributeId?: string | null;
  /** Season code from the plan's reference season, not the plan's own `planSeasonCode`. */
  seasonCode?: number | null;
  /** Channel to break down. Defaults to every channel. */
  channelCode?: string;
  /** Recommendation filter: `'all'` (default), `'keep'`, or `'drop'`. */
  recommendation?: ByItemRecommendationFilter;
  /** Only fetch while true — e.g. gate on the By Attribute tab being active. */
  enabled?: boolean;
  /** Column config entries for extracting additional fields from raw rows. */
  columnConfigGroups?: readonly ColumnConfigEntry[];
}

export interface AttributeTableResult {
  rows: readonly AttributeBreakdownRow[];
  /** The raw API rows before dynamic field extraction, for downstream merging. */
  rawRows: readonly AttributeBreakdownRow[];
  status: LoadStatus;
  retry: () => void;
}

const EMPTY_DATA: AttributeTableData = { rowData: [], rawApiRows: [] };

export function useAttributeTable({
  planCode,
  attributeId,
  seasonCode,
  channelCode = DEFAULT_ATTRIBUTE_CHANNEL_CODE,
  recommendation = DEFAULT_BY_ITEM_RECOMMENDATION,
  enabled = true,
  columnConfigGroups = [],
}: AttributeTableParams): AttributeTableResult {
  const key = useMemo(() => {
    if (
      planCode === undefined ||
      attributeId === null ||
      attributeId === undefined ||
      seasonCode === null ||
      seasonCode === undefined
    ) {
      return null;
    }
    return `${planCode}|${seasonCode}|${attributeId}|${channelCode}|${recommendation}`;
  }, [planCode, attributeId, seasonCode, channelCode, recommendation]);

  const fetcher = useCallback(async () => {
    if (
      planCode === undefined ||
      attributeId === null ||
      attributeId === undefined ||
      seasonCode === null ||
      seasonCode === undefined
    ) {
      return EMPTY_DATA;
    }
    return getAttributeTableData({
      filters: { planCode, seasonCode, attrKey: attributeId, channelCode, recommendation },
    });
  }, [planCode, attributeId, seasonCode, channelCode, recommendation]);

  const { data, status, retry } = useKeyedRequest(key, fetcher, EMPTY_DATA, enabled);

  const rows = useMemo<AttributeBreakdownRow[]>(() => {
    if (columnConfigGroups.length === 0 || data.rawApiRows === undefined) {
      return data.rowData;
    }
    return data.rawApiRows.map((rawRow, i) => ({
      ...data.rowData[i],
      ...extractDynamicFields(rawRow, columnConfigGroups),
    }));
  }, [data.rowData, data.rawApiRows, columnConfigGroups]);

  return { rows, rawRows: data.rowData, status, retry };
}
