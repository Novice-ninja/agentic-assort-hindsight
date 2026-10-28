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

export interface ByItemProductScopeLevelView {
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

export interface ByItemProductScopeResult {
  levels: HierarchyLevelDef[];
  levelsStatus: LoadStatus;
  scope: HierarchyScopeEntry[];
  setScope: (scope: HierarchyScopeEntry[] | ((prev: HierarchyScopeEntry[]) => HierarchyScopeEntry[])) => void;
  levelViews: ByItemProductScopeLevelView[];
  onToggle: (level: HierarchyLevelDef, id: string) => void;
  onSelectAll: (level: HierarchyLevelDef) => void;
  onClear: (level: HierarchyLevelDef) => void;
  onExpand: (level: HierarchyLevelDef, levelIndex: number) => void;
  onRetry: (level: HierarchyLevelDef, levelIndex: number) => void;
  onSearch: (level: HierarchyLevelDef, levelIndex: number, query: string) => void;
  onShowMore: (level: HierarchyLevelDef, levelIndex: number) => void;
}

function upsertScope(
  scope: HierarchyScopeEntry[],
  next: HierarchyScopeEntry,
): HierarchyScopeEntry[] {
  const index = scope.findIndex((entry) => entry.levelNo === next.levelNo);
  if (index < 0) return [...scope, next];
  const copy = [...scope];
  copy[index] = next;
  return copy;
}

/**
 * Product-hierarchy filter state for the By Item table Filter Settings panel.
 *
 * Same `/v1/filters/config` + `/v1/filters/values` APIs and selection helpers as Create Plan
 * Product Scope, kept local so Hindsight does not depend on the planning Redux draft.
 */
export function useByItemProductScope(
  initialScope: readonly HierarchyScopeEntry[],
  active: boolean,
): ByItemProductScopeResult {
  const [levels, setLevels] = useState<HierarchyLevelDef[]>([]);
  const [levelsStatus, setLevelsStatus] = useState<LoadStatus>('idle');
  const [scope, setScope] = useState<HierarchyScopeEntry[]>(() => [...initialScope]);
  const [productLists, setProductLists] = useState<Record<string, ProductValue[]>>({});
  const [productListStatuses, setProductListStatuses] = useState<Record<string, LoadStatus>>({});
  const [productListSearch, setProductListSearch] = useState<Record<string, string>>({});
  const [productListTotals, setProductListTotals] = useState<Record<string, number | undefined>>({});
  const [productListNextOffset, setProductListNextOffset] = useState<Record<string, number>>({});
  const [productListLoadingMore, setProductListLoadingMore] = useState<Record<string, boolean>>({});
  const [productListSearching, setProductListSearching] = useState<Record<string, boolean>>({});
  const configHashRef = useRef('');
  const seededRef = useRef(false);

  // Re-seed draft when the panel opens with a new applied scope.
  useEffect(() => {
    if (!active) {
      seededRef.current = false;
      return;
    }
    if (seededRef.current) return;
    seededRef.current = true;
    setScope([...initialScope]);
  }, [active, initialScope]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setLevelsStatus('loading');
    void getProductHierarchyList()
      .then((result) => {
        if (cancelled) return;
        setLevels(result.levels);
        configHashRef.current = result.configHash;
        setLevelsStatus('succeeded');
      })
      .catch(() => {
        if (!cancelled) setLevelsStatus('failed');
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

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

      try {
        const data = await getProductList(level, buildUpstreamScope(levelIndex), {
          search: search || undefined,
          offset,
          expectedConfigHash: configHashRef.current || undefined,
        });
        setProductLists((prev) => ({
          ...prev,
          [key]:
            mode === 'append' ? [...(prev[key] ?? []), ...data.values] : data.values,
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

  // Prefetch L0 when levels land.
  useEffect(() => {
    if (!active || levels.length === 0) return;
    const first = levels[0];
    if (first === undefined) return;
    const status = productListStatuses[first.levelNo];
    if (status !== undefined && status !== 'idle') return;
    void fetchLevel(first, 0);
  }, [active, levels, productListStatuses, fetchLevel]);

  const clearDeeperLevelCaches = useCallback((deeperKeys: readonly string[]) => {
    if (deeperKeys.length === 0) return;
    setProductLists((prev) => {
      const next = { ...prev };
      for (const key of deeperKeys) delete next[key];
      return next;
    });
    setProductListStatuses((prev) => {
      const next = { ...prev };
      for (const key of deeperKeys) delete next[key];
      return next;
    });
    setProductListSearch((prev) => {
      const next = { ...prev };
      for (const key of deeperKeys) delete next[key];
      return next;
    });
    setProductListTotals((prev) => {
      const next = { ...prev };
      for (const key of deeperKeys) delete next[key];
      return next;
    });
    setProductListNextOffset((prev) => {
      const next = { ...prev };
      for (const key of deeperKeys) delete next[key];
      return next;
    });
  }, []);

  const onToggle = useCallback(
    (level: HierarchyLevelDef, id: string) => {
      const current: HierarchyScopeEntry = getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      };
      const multiSelect = level.isMultiSelection !== false;
      const label =
        (productLists[level.levelNo] ?? []).find((value) => value.value === id)?.label ?? id;
      const next = applyToggleSelection(current, id, multiSelect, label);
      const levelIndex = levels.findIndex((item) => item.levelNo === level.levelNo);
      const deeper =
        levelIndex >= 0 ? levels.slice(levelIndex + 1).map((item) => item.levelNo) : [];
      setScope((prev) => {
        let updated = upsertScope(prev, next);
        if (deeper.length > 0 && !isHierarchyLevelSelected(next)) {
          updated = updated.filter((entry) => !deeper.includes(entry.levelNo));
        }
        return updated;
      });
      // Parent change invalidates every deeper values page (same as Create Plan Product Scope).
      if (deeper.length > 0) clearDeeperLevelCaches(deeper);
    },
    [getScopeEntry, productLists, levels, clearDeeperLevelCaches],
  );

  const onSelectAll = useCallback(
    (level: HierarchyLevelDef) => {
      const activeSearch = (productListSearch[level.levelNo] ?? '').trim();
      const current: HierarchyScopeEntry = getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      };
      const next = activeSearch
        ? applySelectAllSearch(current, activeSearch, productLists[level.levelNo] ?? [])
        : applySelectAllUniverse(current);
      setScope((prev) => upsertScope(prev, next));
    },
    [getScopeEntry, productListSearch, productLists],
  );

  const onClear = useCallback(
    (level: HierarchyLevelDef) => {
      const activeSearch = (productListSearch[level.levelNo] ?? '').trim();
      const current: HierarchyScopeEntry = getScopeEntry(level.levelNo) ?? {
        levelName: level.levelName,
        levelNo: level.levelNo,
        selectedValues: [],
      };
      const next = !activeSearch
        ? applyClearSelection(current)
        : applyDeselectAll(current, activeSearch, productLists[level.levelNo] ?? []);
      const levelIndex = levels.findIndex((item) => item.levelNo === level.levelNo);
      const deeper =
        levelIndex >= 0 ? levels.slice(levelIndex + 1).map((item) => item.levelNo) : [];
      setScope((prev) => {
        const withoutDeeper =
          deeper.length > 0
            ? prev.filter((entry) => !deeper.includes(entry.levelNo))
            : prev;
        return upsertScope(withoutDeeper, next);
      });
      if (deeper.length > 0) clearDeeperLevelCaches(deeper);
    },
    [getScopeEntry, productListSearch, productLists, levels, clearDeeperLevelCaches],
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

  const levelViews = useMemo<ByItemProductScopeLevelView[]>(() => {
    return levels.map((level, levelIndex) => {
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
        exceptMatchingNeedles: allSelected
          ? []
          : committedExceptSearchNeedles(scopeEntry),
        status,
        hasMore: hasMoreFilterValues(
          values.length,
          total,
          lastPageSizeFromLoaded(values.length),
        ),
        loadingMore: productListLoadingMore[level.levelNo] ?? false,
        searching: productListSearching[level.levelNo] ?? false,
        parentLabel:
          levelIndex > 0 ? levels[levelIndex - 1]?.levelName : undefined,
      };
    });
  }, [
    levels,
    getScopeEntry,
    productLists,
    productListStatuses,
    productListTotals,
    productListLoadingMore,
    productListSearching,
    isLevelEnabled,
  ]);

  return {
    levels,
    levelsStatus,
    scope,
    setScope,
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
