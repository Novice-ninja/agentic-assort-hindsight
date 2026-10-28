import type { ApiRequestOptions } from '@shared/services/apiClient';
import {
  EMPTY_FILTER_SNAPSHOT_ID,
  getFilterConfig,
  getFilterValues,
} from './getFilters';
import {
  buildFilterValuesRequest,
  toFilterValuesFilters,
  excludedChannelKeys,
  toHierarchyLevels,
  toProductValue,
} from '../services/filterHierarchy';
import {
  FILTER_VALUES_PAGE_SIZE,
  type HierarchyLevelDef,
  type HierarchyScopeEntry,
  type ProductListResponse,
} from '../types';

export interface ProductHierarchyListResult {
  levels: HierarchyLevelDef[];
  configHash: string;
  /** Codes from the config `channel.exclude_channels` list. Empty when the field omits it. */
  excludedChannelKeys: string[];
}

export type GetProductListOptions = ApiRequestOptions & {
  expectedConfigHash?: string;
  search?: string;
  offset?: number;
  /** `0` = unpaged matching-set fetch (search Select All). */
  limit?: number;
};

export interface GetProductHierarchyListOptions {
  /** Named filter configuration (e.g. `cluster_config`). Omit for the Create Plan default. */
  configKey?: string;
}

/**
 * Loads product hierarchy levels from `GET /v1/filters/config` (product + cascaded only).
 */
export async function getProductHierarchyList(
  options?: GetProductHierarchyListOptions,
): Promise<ProductHierarchyListResult> {
  const config = await getFilterConfig(options?.configKey);
  return {
    levels: toHierarchyLevels(config.fields),
    configHash: config.config_hash,
    excludedChannelKeys: excludedChannelKeys(config.fields),
  };
}

/**
 * Loads options for one hierarchy level via `POST /v1/filters/values`.
 * Uses `value` as the machine id for filters / plan save.
 */
export async function getProductList(
  attribute: HierarchyLevelDef,
  hierarchyScope: HierarchyScopeEntry[],
  options?: GetProductListOptions,
): Promise<ProductListResponse & { configHash: string; total?: number }> {
  const data = await getFilterValues(
    buildFilterValuesRequest({
      attributes: [attribute.levelNo],
      filters: toFilterValuesFilters(hierarchyScope),
      snapshotId: EMPTY_FILTER_SNAPSHOT_ID,
      search: options?.search,
      limit: options?.limit === 0 ? 0 : (options?.limit ?? FILTER_VALUES_PAGE_SIZE),
      offset: options?.offset ?? 0,
    }),
    options,
  );

  if (
    options?.expectedConfigHash !== undefined &&
    options.expectedConfigHash.length > 0 &&
    data.config_hash !== options.expectedConfigHash
  ) {
    const error = new Error('CONFIG_HASH_MISMATCH');
    error.name = 'ConfigHashMismatchError';
    throw error;
  }

  const optionsForLevel = data.values[attribute.levelNo] ?? [];
  const total = data.total ?? data.totals?.[attribute.levelNo];
  return {
    levelName: attribute.levelName,
    levelNo: attribute.levelNo,
    values: optionsForLevel.map(toProductValue),
    configHash: data.config_hash,
    ...(total !== undefined ? { total } : {}),
  };
}
