import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import type { DataGridRowPage, DataGridRowRange } from '@shared/components/data';
import type { LoadStatus } from '@shared/types';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import { toCreatePlanHierarchyScope } from '@modules/planning/services/filterHierarchy';
import { DEFAULT_BY_ITEM_RECOMMENDATION } from '../types';
import {
  BY_ITEM_TABLE_PAGE_SIZE,
  BY_ITEM_TABLE_SCOPE,
  DEFAULT_TABLE_COMPARE_TO,
  getByItemTableData,
} from '../api';
import {
  appendByItemCachePage,
  byItemSourceKey,
  cloneByItemCacheItems,
  deleteByItemCachePage,
  patchByItemCacheItems,
  peekByItemCachePage,
  readByItemCachePage,
  tableRowCacheKey,
  writeByItemCachePage,
} from '../services/byItemCache';
import type { ByItemCachePage } from '../services/byItemCache';
import { serializeHierarchyScopeKey } from '../services/byItemTableFilters';
import {
  clearByItemTableRows,
  setByItemTableRows,
  setByItemTableStatus,
} from '../store/hindsightSlice';
import type {
  ByItemRecommendationFilter,
  ByItemTableRow,
  ByItemVisualPageStatus,
  HindsightCompareTo,
} from '../types';

export interface ByItemTableParams {
  planCode?: string;
  /** Analytics season the items are measured for, from the plan's `kpi-seasons` list. */
  seasonCode?: number | null;
  /** The plan's own season code. Used to gate the fetch and the cache key; not sent in the body. */
  planSeasonCode?: number | null;
  /** Comparison bases. Defaults to the module constant rather than a literal at the call site. */
  compareTo?: readonly HindsightCompareTo[];
  /** Empty asks the backend for its default metric. */
  metric?: string;
  /** Recommendation filter: `'all'` (default), `'keep'`, or `'drop'`. */
  recommendation?: ByItemRecommendationFilter;
  /** Empty asks the backend for its default KPI set. */
  kpis?: readonly string[];
  /** Applied product hierarchy for table-data requests. Defaults to none (plan-wide). */
  hierarchyScope?: readonly HierarchyScopeEntry[];
  /** Only fetch while true — e.g. gate on the By Item tab being active. */
  enabled?: boolean;
}

export interface ByItemTableResult {
  rows: readonly ByItemTableRow[];
  /**
   * Every table row currently in the in-memory cache. Card backs look up by article here.
   * Matches `rows` now that the grid binds the full cache instead of a 400-row window.
   */
  cachedRows: readonly ByItemTableRow[];
  status: LoadStatus;
  /** Status of a subsequent page while earlier rows stay visible. */
  pageStatus: ByItemVisualPageStatus;
  /** True when another table-data page is available. */
  hasMore: boolean;
  /** Cache key for the current plan/season/filter set. */
  sourceKey: string;
  loadRows: (range: DataGridRowRange) => Promise<DataGridRowPage<ByItemTableRow>>;
  /** Immediate slice of a block already in memory. */
  peekRows: (range: DataGridRowRange) => DataGridRowPage<ByItemTableRow> | undefined;
  /** Fetch the next page when `hasMore` and nothing is already in flight. */
  loadMore: () => void;
  /** Fetch further table pages until these articles are in the cache or the stream ends. */
  ensureArticles: (articles: readonly string[]) => void;
  retry: () => void;
}

function emptyPage(): ByItemCachePage<ByItemTableRow> {
  return { sourceKey: '', items: [], cursor: '', hasMore: false };
}

function overlayBoundRows(
  incoming: ByItemTableRow[],
  bound: readonly ByItemTableRow[],
): ByItemTableRow[] {
  if (bound.length === 0) return incoming;
  const latest = new Map<string, ByItemTableRow>();
  bound.forEach((row) => {
    const key = tableRowCacheKey(row);
    if (key.length > 0) latest.set(key, row);
  });
  return incoming.map((row) => {
    const key = tableRowCacheKey(row);
    return key.length > 0 ? (latest.get(key) ?? row) : row;
  });
}

/**
 * Loads By Item table pages into IndexedDB and binds every cached row.
 *
 * Each request asks for 100 rows. The next request fires only when the planner reaches the
 * bottom of the grid; new rows append under the current list so scroll position stays put.
 */
export function useByItemTable({
  planCode,
  seasonCode,
  planSeasonCode,
  compareTo = DEFAULT_TABLE_COMPARE_TO,
  metric = '',
  recommendation = DEFAULT_BY_ITEM_RECOMMENDATION,
  kpis = [],
  hierarchyScope = [],
  enabled = true,
}: ByItemTableParams): ByItemTableResult {
  const dispatch = useAppDispatch();
  const rows = useAppSelector((s) => s.hindsight.byItemTableRows);
  const status = useAppSelector((s) => s.hindsight.statuses.byItemTable);
  const [cachedRows, setCachedRows] = useState<readonly ByItemTableRow[]>([]);
  const [pageStatus, setPageStatus] = useState<ByItemVisualPageStatus>('idle');
  const [hasMore, setHasMore] = useState(false);

  const compareKey = compareTo.join(',');
  const kpisKey = kpis.join(',');
  const hierarchyKey = serializeHierarchyScopeKey(hierarchyScope);
  const hierarchyScopeRef = useRef(hierarchyScope);
  hierarchyScopeRef.current = hierarchyScope;
  const sourceKey =
    planCode !== undefined && seasonCode !== null && seasonCode !== undefined
      ? byItemSourceKey({
          planCode,
          seasonCode,
          planSeasonCode,
          compareKey,
          kpisKey,
          metric,
          recommendation,
          hierarchyKey,
        })
      : '';

  const sourceKeyRef = useRef(sourceKey);
  sourceKeyRef.current = sourceKey;
  const loadedCountRef = useRef(0);
  const hasMoreRef = useRef(false);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const fetchLockRef = useRef<Promise<ByItemCachePage<ByItemTableRow>> | undefined>(undefined);
  /** Set only after a successful bind for `sourceKey` — gates cache patches. */
  const boundSourceKeyRef = useRef('');
  /** Previous filter key — a change skips the patch effect so stale rows cannot pollute cache. */
  const prevSourceKeyRef = useRef(sourceKey);

  const bindPage = useCallback(
    (page: ByItemCachePage<ByItemTableRow>, preserveBound = false) => {
      loadedCountRef.current = page.items.length;
      hasMoreRef.current = page.hasMore;
      setHasMore(page.hasMore);
      // Always clone — never let React state alias the in-memory cache array.
      const next = preserveBound
        ? overlayBoundRows(page.items, rowsRef.current)
        : page.items;
      const cloned = cloneByItemCacheItems(next);
      setCachedRows(cloned);
      setPageStatus('idle');
      dispatch(setByItemTableRows(cloned));
      boundSourceKeyRef.current = page.sourceKey;
    },
    [dispatch],
  );

  const fetchNextPage = useCallback(async (): Promise<ByItemCachePage<ByItemTableRow>> => {
    if (
      !enabled ||
      planCode === undefined ||
      seasonCode === null ||
      seasonCode === undefined
    ) {
      return emptyPage();
    }

    const key = sourceKeyRef.current;
    const existing = (await readByItemCachePage<ByItemTableRow>('table', key)) ?? {
      sourceKey: key,
      items: [],
      cursor: '',
      hasMore: false,
    };

    if (existing.items.length > 0 && !existing.hasMore) {
      bindPage(existing, true);
      return existing;
    }

    const isNextPage = existing.items.length > 0;
    if (isNextPage) setPageStatus('loading');

    try {
      const wireScope = toCreatePlanHierarchyScope(hierarchyScopeRef.current);
      const data = await getByItemTableData(
        {
          ...BY_ITEM_TABLE_SCOPE,
          filters: {
            planCode,
            recommendation,
            cursor: existing.items.length === 0 ? '' : existing.cursor,
            pageSize: BY_ITEM_TABLE_PAGE_SIZE,
            ...(wireScope.length > 0 ? { hierarchyScope: wireScope } : {}),
          },
        },
        { uiHierarchyScope: hierarchyScopeRef.current },
      );

      // Filter/plan changed while this request was in flight — do not return the previous
      // key's rows or a waiter for the new key will bind stale data.
      if (sourceKeyRef.current !== key) {
        return { sourceKey: key, items: [], cursor: '', hasMore: false };
      }

      const cached =
        existing.items.length === 0
          ? await writeByItemCachePage('table', {
              sourceKey: key,
              items: data.rowData,
              cursor: data.pagination.cursor,
              hasMore: data.pagination.hasMore,
            })
          : await appendByItemCachePage(
              'table',
              key,
              data.rowData,
              { cursor: data.pagination.cursor, hasMore: data.pagination.hasMore },
              tableRowCacheKey,
              existing,
            );

      bindPage(cached, isNextPage);
      return cached;
    } catch (error) {
      if (isNextPage) setPageStatus('failed');
      throw error;
    }
  }, [bindPage, enabled, planCode, recommendation, seasonCode]);

  const ensureRowsUntil = useCallback(
    async (endRow: number): Promise<ByItemCachePage<ByItemTableRow>> => {
      const key = sourceKeyRef.current;
      const memory = peekByItemCachePage<ByItemTableRow>('table', key);
      if (
        memory !== undefined &&
        memory.sourceKey === key &&
        (memory.items.length >= endRow || !memory.hasMore)
      ) {
        bindPage(memory, true);
        return memory;
      }

      let page =
        memory ??
        (await readByItemCachePage<ByItemTableRow>('table', key)) ??
        ({
          sourceKey: key,
          items: [],
          cursor: '',
          hasMore: false,
        } satisfies ByItemCachePage<ByItemTableRow>);

      if (page.sourceKey !== key) {
        page = { sourceKey: key, items: [], cursor: '', hasMore: false };
      }

      while (page.items.length < endRow && (page.items.length === 0 || page.hasMore)) {
        if (fetchLockRef.current !== undefined) {
          const locked = await fetchLockRef.current;
          // A lock started under another filter must not become this key's bound page.
          if (locked.sourceKey === key) {
            page = locked;
          } else if (sourceKeyRef.current !== key) {
            return { sourceKey: key, items: [], cursor: '', hasMore: false };
          } else {
            page = peekByItemCachePage<ByItemTableRow>('table', key) ?? {
              sourceKey: key,
              items: [],
              cursor: '',
              hasMore: false,
            };
          }
          continue;
        }
        const before = page.items.length;
        const pending = fetchNextPage();
        fetchLockRef.current = pending;
        try {
          page = await pending;
        } finally {
          if (fetchLockRef.current === pending) {
            fetchLockRef.current = undefined;
          }
        }
        if (page.sourceKey !== key) {
          return { sourceKey: key, items: [], cursor: '', hasMore: false };
        }
        if (page.items.length <= before) break;
      }

      if (sourceKeyRef.current === key) {
        bindPage(page, true);
      }
      return page;
    },
    [bindPage, fetchNextPage],
  );

  const ensureRowsUntilRef = useRef(ensureRowsUntil);
  ensureRowsUntilRef.current = ensureRowsUntil;
  const bindPageRef = useRef(bindPage);
  bindPageRef.current = bindPage;

  useLayoutEffect(() => {
    if (!enabled || planCode === undefined || seasonCode === null || seasonCode === undefined) {
      return;
    }

    // Drop any in-flight page from the previous filter before binding the new key.
    fetchLockRef.current = undefined;
    boundSourceKeyRef.current = '';
    loadedCountRef.current = 0;
    hasMoreRef.current = false;
    setHasMore(false);

    // Always clear first (same as visual view) so an empty filter never keeps prior rows
    // on screen while the new request / cache bind settles.
    dispatch(clearByItemTableRows());
    dispatch(setByItemTableStatus('loading'));
    setCachedRows([]);
    setPageStatus('idle');

    const memory = peekByItemCachePage<ByItemTableRow>('table', sourceKey);
    if (memory !== undefined) {
      // Fresh empty pages are a hit: show "no data" instead of reusing the previous filter.
      bindPageRef.current(memory, false);
      return;
    }

    let cancelled = false;
    void (async () => {
      const cached = await readByItemCachePage<ByItemTableRow>('table', sourceKey);
      if (cancelled || sourceKeyRef.current !== sourceKey) return;
      if (cached !== undefined) {
        bindPageRef.current(cached, false);
        return;
      }
      try {
        const page = await ensureRowsUntilRef.current(BY_ITEM_TABLE_PAGE_SIZE);
        if (cancelled || sourceKeyRef.current !== sourceKey) return;
        bindPageRef.current(page, false);
      } catch {
        if (cancelled || sourceKeyRef.current !== sourceKey) return;
        dispatch(setByItemTableStatus('failed'));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, enabled, planCode, seasonCode, sourceKey]);

  const loadRows = useCallback(
    async ({ startRow, endRow }: DataGridRowRange): Promise<DataGridRowPage<ByItemTableRow>> => {
      if (
        !enabled ||
        planCode === undefined ||
        seasonCode === null ||
        seasonCode === undefined
      ) {
        return { rows: [], lastRow: 0 };
      }

      try {
        const page = await ensureRowsUntil(endRow);
        return {
          rows: page.items.slice(startRow, endRow),
          lastRow: page.hasMore ? undefined : page.items.length,
        };
      } catch (error) {
        if (startRow === 0) {
          dispatch(setByItemTableStatus('failed'));
        }
        throw error;
      }
    },
    [dispatch, enabled, ensureRowsUntil, planCode, seasonCode],
  );

  const peekRows = useCallback(
    ({ startRow, endRow }: DataGridRowRange): DataGridRowPage<ByItemTableRow> | undefined => {
      const memory = peekByItemCachePage<ByItemTableRow>('table', sourceKeyRef.current);
      if (memory === undefined) return undefined;
      if (memory.items.length < endRow && memory.hasMore) return undefined;
      return {
        rows: memory.items.slice(startRow, endRow),
        lastRow: memory.hasMore ? undefined : memory.items.length,
      };
    },
    [],
  );

  const loadMore = useCallback(() => {
    if (status !== 'succeeded' || pageStatus === 'loading' || !hasMoreRef.current) return;
    void ensureRowsUntil(loadedCountRef.current + 1);
  }, [ensureRowsUntil, pageStatus, status]);

  const ensureArticles = useCallback(
    (articles: readonly string[]) => {
      const wanted = [...new Set(articles.filter((article) => article.length > 0))];
      if (wanted.length === 0) return;
      const key = sourceKeyRef.current;
      if (key.length === 0) return;

      void (async () => {
        let page =
          peekByItemCachePage<ByItemTableRow>('table', key) ??
          (await readByItemCachePage<ByItemTableRow>('table', key)) ??
          emptyPage();

        const hasAll = (items: readonly ByItemTableRow[]) => {
          const present = new Set(
            items
              .map((row) => row.article?.trim())
              .filter((article): article is string => article !== undefined && article.length > 0),
          );
          return wanted.every((article) => present.has(article));
        };

        while (!hasAll(page.items) && (page.items.length === 0 || page.hasMore)) {
          const before = page.items.length;
          page = await ensureRowsUntil(page.items.length + 1);
          if (sourceKeyRef.current !== key) return;
          if (page.items.length <= before) break;
        }

        if (sourceKeyRef.current !== key) return;
        bindPage(page, true);
      })();
    },
    [bindPage, ensureRowsUntil],
  );

  const retry = useCallback(() => {
    const key = sourceKeyRef.current;
    void (async () => {
      await deleteByItemCachePage('table', key);
      dispatch(clearByItemTableRows());
      dispatch(setByItemTableStatus('loading'));
      setCachedRows([]);
      setHasMore(false);
      loadedCountRef.current = 0;
      hasMoreRef.current = false;
      try {
        const page = await ensureRowsUntil(BY_ITEM_TABLE_PAGE_SIZE);
        if (sourceKeyRef.current !== key) return;
        bindPage(page, false);
      } catch {
        if (sourceKeyRef.current !== key) return;
        dispatch(setByItemTableStatus('failed'));
      }
    })();
  }, [bindPage, dispatch, ensureRowsUntil]);

  useEffect(() => {
    const filterChanged = prevSourceKeyRef.current !== sourceKey;
    prevSourceKeyRef.current = sourceKey;
    // Filter switches bind from cache/network themselves. A passive effect from the render
    // that still closed over the previous filter's rows must not merge them into this key.
    if (filterChanged) return;
    if (sourceKey.length === 0 || rows.length === 0) return;
    if (boundSourceKeyRef.current !== sourceKey) return;
    void patchByItemCacheItems('table', sourceKey, rows, tableRowCacheKey).then((page) => {
      if (page !== undefined && sourceKeyRef.current === sourceKey) {
        setCachedRows(cloneByItemCacheItems(page.items));
      }
    });
  }, [rows, sourceKey]);

  return {
    rows,
    cachedRows,
    status,
    pageStatus,
    hasMore,
    sourceKey,
    loadRows,
    peekRows,
    loadMore,
    ensureArticles,
    retry,
  };
}
