import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getProductHierarchyList,
  getProductList,
} from '@modules/planning/api/getProductHierarchy';
import {
  applyClearSelection,
  applyDeselectAll,
  applySelectAllSearch,
  applySelectAllUniverse,
  applyToggleSelection,
  committedExceptSearchNeedles,
  committedSearchNeedles,
  hasMoreFilterValues,
  isHierarchyLevelSelected,
  isUniverseSelectAll,
  lastPageSizeFromLoaded,
  visibleSelectedIds,
} from '@modules/planning/services/filterHierarchy';
import type {
  HierarchyLevelDef,
  HierarchyScopeEntry,
  ProductValue,
} from '@modules/planning/types';
import type { LoadStatus } from '@shared/types';

/** Named `/filters/config` configuration that drives the Location Clustering product scope. */
export const CLUSTER_FILTER_CONFIG_KEY = 'cluster_config';

export interface ClusterProductScopeLevelView {
  level: HierarchyLevelDef;
  levelIndex: number;
  enabled: boolean;
  values: ProductValue[];
  selectedIds: string[];
  allSelected: boolean;
  matchingNeedles: string[];
  exceptMatchingNeedles: string[];
  status: LoadStatus;
  hasMore: boolean;
  loadingMore: boolean;
  searching: boolean;
  parentLabel?: string;
}

export interface ClusterProductScopeResult {
  levels: HierarchyLevelDef[];
  levelsStatus: LoadStatus;
  /** Channel codes from `cluster_config` `exclude_channels`. Empty until config succeeds. */
  excludedChannelKeys: string[];
  levelViews: ClusterProductScopeLevelView[];
  onToggle: (level: HierarchyLevelDef, id: string) => void;
  onSelectAll: (level: HierarchyLevelDef) => void;
  onClear: (level: HierarchyLevelDef) => void;
  onExpand: (level: HierarchyLevelDef, levelIndex: number) => void;
  onRetry: (level: HierarchyLevelDef, levelIndex: number) => void;
  onSearch: (level: HierarchyLevelDef, levelIndex: number, query: string) => void;
  onShowMore: (level: HierarchyLevelDef, levelIndex: number) => void;
}

function upsertScope(
  scope: readonly HierarchyScopeEntry[],
  next: HierarchyScopeEntry,
): HierarchyScopeEntry[] {
  const index = scope.findIndex((entry) => entry.levelNo === next.levelNo);
  if (index < 0) return [...scope, next];
  const copy = [...scope];
  copy[index] = next;
  return copy;
}

function omitKeys<T>(record: Record<string, T>, keys: readonly string[]): Record<string, T> {
  const next = { ...record };
  for (const key of keys) delete next[key];
  return next;
}

/**
 * Cascaded product-hierarchy state for the Create Cluster Plan Scope step.
 *
 * Same `/v1/filters/config` (with `config_key=cluster_config`) + `/v1/filters/values` APIs and
 * selection helpers as Create Plan Product Scope. Unlike the planning step this hook is
 * **controlled**: the committed selections live on the cluster draft (`scope`) and every change
 * is reported through `onScopeChange`, so they persist with the rest of the wizard draft.
 */
export function useClusterProductScope(
  scope: readonly HierarchyScopeEntry[],
  onScopeChange: (next: HierarchyScopeEntry[]) => void,
  active = true,
): ClusterProductScopeResult {
  const [levels, setLevels] = useState<HierarchyLevelDef[]>([]);
  const [levelsStatus, setLevelsStatus] = useState<LoadStatus>('idle');
  const [excludedChannelKeys, setExcludedChannelKeys] = useState<string[]>([]);
  const [productLists, setProductLists] = useState<Record<string, ProductValue[]>>({});
  const [productListStatuses, setProductListStatuses] = useState<Record<string, LoadStatus>>({});
  const [productListSearch, setProductListSearch] = useState<Record<string, string>>({});
  const [productListTotals, setProductListTotals] = useState<Record<string, number | undefined>>(
    {},
  );
  const [productListNextOffset, setProductListNextOffset] = useState<Record<string, number>>({});
  const [productListLoadingMore, setProductListLoadingMore] = useState<Record<string, boolean>>(
    {},
  );
  const [productListSearching, setProductListSearching] = useState<Record<string, boolean>>({});
  /**
   * `config_hash` last returned by `/filters/values`. The levels come from the named
   * `cluster_config` configuration, whose hash differs from the one `/filters/values` reports
   * (that endpoint is not keyed by `config_key`), so drift is detected by comparing the values
   * endpoint against its own previous response rather than against the config hash.
   */
  const valuesHashRef = useRef('');
  const [levelsReloadToken, setLevelsReloadToken] = useState(0);
  /** Token already requested. Not cleared on cleanup, so a StrictMode remount does not refetch. */
  const levelsFetchTokenRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    if (levelsFetchTokenRef.current === levelsReloadToken) return;
    levelsFetchTokenRef.current = levelsReloadToken;
    const token = levelsReloadToken;
    setLevelsStatus('loading');
    void getProductHierarchyList({ configKey: CLUSTER_FILTER_CONFIG_KEY })
      .then((result) => {
        if (levelsFetchTokenRef.current !== token) return;
        setLevels(result.levels);
        setExcludedChannelKeys(result.excludedChannelKeys);
        setLevelsStatus('succeeded');
      })
      .catch(() => {
        if (levelsFetchTokenRef.current !== token) return;
        setLevelsStatus('failed');
      });
  }, [active, levelsReloadToken]);

  const getScopeEntry = useCallback(
    (levelNo: string): HierarchyScopeEntry | undefined =>
      scope.find((entry) => entry.levelNo === levelNo),
    [scope],
  );

  const buildUpstreamScope = useCallback(
    (currentLevelIndex: number): HierarchyScopeEntry[] =>
      levels.slice(0, currentLevelIndex).map((level) => {
        const entry = getScopeEntry(level.levelNo);
        return {
          levelName: level.levelName,
          levelNo: level.levelNo,
          selectedValues: entry?.selectedValues ?? [],
          selectAll: entry?.selectAll,
          search: entry?.search,
          exceptSearch: entry?.exceptSearch,
          except: entry?.except,
          include: entry?.include,
        };
      }),
    [levels, getScopeEntry],
  );

  const isLevelEnabled = useCallback(
    (levelIndex: number): boolean => {
      if (levelIndex === 0) return true;
      const parentLevel = levels[levelIndex - 1];
      if (!parentLevel) return false;
      return isHierarchyLevelSelected(getScopeEntry(parentLevel.levelNo));
    },
    [levels, getScopeEntry],
  );

  const fetchLevel = useCallback(
    async (
      level: HierarchyLevelDef,
      levelIndex: number,
      options: { search?: string; offset?: number; mode?: 'replace' | 'append' } = {},
    ) => {
      const mode = options.mode ?? 'replace';
      const offset = options.offset ?? 0;
      const search = options.search ?? '';
      const key = level.levelNo;

      if (mode === 'append') {
        setProductListLoadingMore((prev) => ({ ...prev, [key]: true }));
      } else if (search.length > 0 || offset === 0) {
        setProductListSearching((prev) => ({ ...prev, [key]: search.length > 0 }));
        setProductListStatuses((prev) => ({ ...prev, [key]: 'loading' }));
      }

      const request = (expectedConfigHash: string | undefined) =>
        getProductList(level, buildUpstreamScope(levelIndex), {
          search: search || undefined,
          offset,
          expectedConfigHash,
        });

      try {
        let data: Awaited<ReturnType<typeof getProductList>>;
        try {
          data = await request(valuesHashRef.current || undefined);
        } catch (err) {
          if (!(err instanceof Error) || err.name !== 'ConfigHashMismatchError') throw err;
          // The filter configuration changed mid-session: reload the levels so the accordion
          // matches the new config, then accept the new hash and fetch this level once more.
          valuesHashRef.current = '';
          setLevelsReloadToken((token) => token + 1);
          data = await request(undefined);
        }
        valuesHashRef.current = data.configHash;
        setProductLists((prev) => ({
          ...prev,
          [key]: mode === 'append' ? [...(prev[key] ?? []), ...data.values] : data.values,
        }));
        setProductListStatuses((prev) => ({ ...prev, [key]: 'succeeded' }));
        setProductListSearch((prev) => ({ ...prev, [key]: search }));
        setProductListTotals((prev) => ({ ...prev, [key]: data.total }));
        setProductListNextOffset((prev) => ({
          ...prev,
          [key]: (mode === 'append' ? (prev[key] ?? 0) : 0) + data.values.length,
        }));
      } catch {
        setProductListStatuses((prev) => ({ ...prev, [key]: 'failed' }));
      } finally {
        setProductListLoadingMore((prev) => ({ ...prev, [key]: false }));
        setProductListSearching((prev) => ({ ...prev, [key]: false }));
      }
    },
    [buildUpstreamScope],
  );

  // Prefetch the first level as soon as the hierarchy levels land.
  useEffect(() => {
    if (!active || levels.length === 0) return;
    const first = levels[0];
    if (first === undefined) return;
    const status = productListStatuses[first.levelNo];
    if (status !== undefined && status !== 'idle') return;
    void fetchLevel(first, 0);
  }, [active, levels, productListStatuses, fetchLevel]);

  // A parent change invalidates every deeper values page (same as Create Plan Product Scope).
  const clearDeeperLevelCaches = useCallback((deeperKeys: readonly string[]) => {
    if (deeperKeys.length === 0) return;
    setProductLists((prev) => omitKeys(prev, deeperKeys));
    setProductListStatuses((prev) => omitKeys(prev, deeperKeys));
    setProductListSearch((prev) => omitKeys(prev, deeperKeys));
    setProductListTotals((prev) => omitKeys(prev, deeperKeys));
    setProductListNextOffset((prev) => omitKeys(prev, deeperKeys));
  }, []);

  const deeperLevelKeys = useCallback(
    (level: HierarchyLevelDef): string[] => {
      const levelIndex = levels.findIndex((item) => item.levelNo === level.levelNo);
      return levelIndex >= 0 ? levels.slice(levelIndex + 1).map((item) => item.levelNo) : [];
    },
    [levels],
  );

  const currentEntry = useCallback(
    (level: HierarchyLevelDef): HierarchyScopeEntry =>
      getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      },
    [getScopeEntry],
  );

  const onToggle = useCallback(
    (level: HierarchyLevelDef, id: string) => {
      const multiSelect = level.isMultiSelection !== false;
      const label =
        (productLists[level.levelNo] ?? []).find((value) => value.value === id)?.label ?? id;
      const next = applyToggleSelection(currentEntry(level), id, multiSelect, label);
      const deeper = deeperLevelKeys(level);
      let updated = upsertScope(scope, next);
      if (deeper.length > 0 && !isHierarchyLevelSelected(next)) {
        updated = updated.filter((entry) => !deeper.includes(entry.levelNo));
      }
      onScopeChange(updated);
      if (deeper.length > 0) clearDeeperLevelCaches(deeper);
    },
    [productLists, currentEntry, deeperLevelKeys, scope, onScopeChange, clearDeeperLevelCaches],
  );

  const onSelectAll = useCallback(
    (level: HierarchyLevelDef) => {
      const activeSearch = (productListSearch[level.levelNo] ?? '').trim();
      const current = currentEntry(level);
      const next = activeSearch
        ? applySelectAllSearch(current, activeSearch, productLists[level.levelNo] ?? [])
        : applySelectAllUniverse(current);
      onScopeChange(upsertScope(scope, next));
    },
    [productListSearch, currentEntry, productLists, scope, onScopeChange],
  );

  const onClear = useCallback(
    (level: HierarchyLevelDef) => {
      const activeSearch = (productListSearch[level.levelNo] ?? '').trim();
      const current = currentEntry(level);
      const next = !activeSearch
        ? applyClearSelection(current)
        : applyDeselectAll(current, activeSearch, productLists[level.levelNo] ?? []);
      const deeper = deeperLevelKeys(level);
      const withoutDeeper =
        deeper.length > 0 ? scope.filter((entry) => !deeper.includes(entry.levelNo)) : scope;
      onScopeChange(upsertScope(withoutDeeper, next));
      if (deeper.length > 0) clearDeeperLevelCaches(deeper);
    },
    [
      productListSearch,
      currentEntry,
      productLists,
      deeperLevelKeys,
      scope,
      onScopeChange,
      clearDeeperLevelCaches,
    ],
  );

  const onExpand = useCallback(
    (level: HierarchyLevelDef, levelIndex: number) => {
      const status = productListStatuses[level.levelNo];
      if (status === 'succeeded' || status === 'loading') return;
      void fetchLevel(level, levelIndex);
    },
    [fetchLevel, productListStatuses],
  );

  const onRetry = useCallback(
    (level: HierarchyLevelDef, levelIndex: number) => {
      void fetchLevel(level, levelIndex, {
        search: productListSearch[level.levelNo],
        offset: 0,
        mode: 'replace',
      });
    },
    [fetchLevel, productListSearch],
  );

  const onSearch = useCallback(
    (level: HierarchyLevelDef, levelIndex: number, query: string) => {
      if (query === (productListSearch[level.levelNo] ?? '')) return;
      void fetchLevel(level, levelIndex, { search: query, offset: 0, mode: 'replace' });
    },
    [fetchLevel, productListSearch],
  );

  const onShowMore = useCallback(
    (level: HierarchyLevelDef, levelIndex: number) => {
      if (productListLoadingMore[level.levelNo]) return;
      void fetchLevel(level, levelIndex, {
        search: productListSearch[level.levelNo],
        offset: productListNextOffset[level.levelNo] ?? 0,
        mode: 'append',
      });
    },
    [fetchLevel, productListLoadingMore, productListNextOffset, productListSearch],
  );

  const levelViews = useMemo<ClusterProductScopeLevelView[]>(
    () =>
      levels.map((level, levelIndex) => {
        const scopeEntry = getScopeEntry(level.levelNo);
        const values = productLists[level.levelNo] ?? [];
        const status = productListStatuses[level.levelNo] ?? 'idle';
        const total = productListTotals[level.levelNo];
        const allSelected =
          isUniverseSelectAll(scopeEntry) && (scopeEntry?.except?.length ?? 0) === 0;
        return {
          level,
          levelIndex,
          enabled: isLevelEnabled(levelIndex),
          values,
          selectedIds: visibleSelectedIds(scopeEntry, values),
          allSelected,
          matchingNeedles: allSelected ? [] : committedSearchNeedles(scopeEntry),
          exceptMatchingNeedles: allSelected ? [] : committedExceptSearchNeedles(scopeEntry),
          status,
          hasMore: hasMoreFilterValues(values.length, total, lastPageSizeFromLoaded(values.length)),
          loadingMore: productListLoadingMore[level.levelNo] ?? false,
          searching: productListSearching[level.levelNo] ?? false,
          parentLabel: levelIndex > 0 ? levels[levelIndex - 1]?.levelName : undefined,
        };
      }),
    [
      levels,
      getScopeEntry,
      productLists,
      productListStatuses,
      productListTotals,
      productListLoadingMore,
      productListSearching,
      isLevelEnabled,
    ],
  );

  return {
    levels,
    levelsStatus,
    excludedChannelKeys,
    levelViews,
    onToggle,
    onSelectAll,
    onClear,
    onExpand,
    onRetry,
    onSearch,
    onShowMore,
  };
}
