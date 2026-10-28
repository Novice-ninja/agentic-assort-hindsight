import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import type { LoadStatus } from '@shared/types';
import { getFlooringScope, useFlooringScope } from '../priority/flooringScope';
import { BY_ITEM_VIEW_SCOPE, BY_ITEM_VISUAL_PAGE_SIZE, getByItemVisualView } from '../api';
import {
  appendByItemCachePage,
  byItemSourceKey,
  cloneByItemCacheItems,
  deleteByItemCachePage,
  patchByItemCacheItems,
  peekByItemCachePage,
  readByItemCachePage,
  visualItemCacheKey,
  writeByItemCachePage,
} from '../services/byItemCache';
import type { ByItemCachePage } from '../services/byItemCache';
import {
  clearByItemVisualItems,
  setByItemVisualItems,
  setByItemVisualStatus,
} from '../store/hindsightSlice';
import {
  DEFAULT_BY_ITEM_RECOMMENDATION,
  type ByItemRecommendationFilter,
  type ByItemVisualPageStatus,
  type VisualViewItem,
} from '../types';

export type { ByItemVisualPageStatus };
const scopedVisualSourceKey = (args: Parameters<typeof byItemSourceKey>[0]) => `${byItemSourceKey(args)}|flooring:${JSON.stringify(getFlooringScope(args.planCode))}`;

export interface ByItemVisualViewParams {
  planCode?: string;
  /** Analytics season the items are measured for, from the plan's `kpi-seasons` list. */
  seasonCode?: number | null;
  /** The plan's own season code. Used to gate the fetch and the cache key; not sent in the body. */
  planSeasonCode?: number | null;
  compareTo?: string[];
  /** Recommendation filter: `'all'` (default), `'keep'`, or `'drop'`. */
  recommendation?: ByItemRecommendationFilter;
  /** Empty asks the backend for its default KPI set. */
  kpis?: readonly string[];
  /** Only fetch while true — e.g. gate on the By Item tab being active. */
  enabled?: boolean;
}

export interface ByItemVisualViewResult {
  items: VisualViewItem[];
  status: LoadStatus;
  /** Status of a subsequent page while earlier cards stay visible. */
  pageStatus: ByItemVisualPageStatus;
  hasMore: boolean;
  /** Items currently in IndexedDB, including those not bound into the DOM. */
  loadedCount: number;
  /** Always 0 — cards append in document order instead of sliding a bound window. */
  windowStart: number;
  /** Kept for callers that still report a viewed index; cards no longer rebind from it. */
  syncWindow: (viewedIndex: number, columns?: number) => void;
  /** Fetch the next page when `hasMore` and nothing is already in flight. */
  loadMore: () => void;
  retry: () => void;
  /** Re-try only the failed next page. */
  retryPage: () => void;
}

function overlayBoundItems(
  incoming: VisualViewItem[],
  bound: readonly VisualViewItem[],
): VisualViewItem[] {
  if (bound.length === 0) return incoming;
  const latest = new Map<string, VisualViewItem>();
  bound.forEach((item) => {
    const key = visualItemCacheKey(item);
    if (key.length > 0) latest.set(key, item);
  });
  return incoming.map((item) => {
    const key = visualItemCacheKey(item);
    return key.length > 0 ? (latest.get(key) ?? item) : item;
  });
}

/**
 * Loads By Item visual-view pages into IndexedDB and binds every cached card.
 *
 * Each request asks for 100 cards. The next request fires only when the planner reaches the
 * bottom of the scroller; new cards append under the current list so scroll position stays put.
 */
export function useByItemVisualView({
  planCode,
  seasonCode,
  planSeasonCode,
  compareTo = [],
  recommendation = DEFAULT_BY_ITEM_RECOMMENDATION,
  kpis = [],
  enabled = true,
}: ByItemVisualViewParams): ByItemVisualViewResult {
  useFlooringScope(planCode);
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.hindsight.byItemVisualItems);
  const status = useAppSelector((s) => s.hindsight.statuses.byItemVisual);
  const [pageStatus, setPageStatus] = useState<ByItemVisualPageStatus>('idle');
  const [hasMore, setHasMore] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [windowStart, setWindowStart] = useState(0);

  const compareKey = compareTo.join(',');
  const kpisKey = kpis.join(',');
  const sourceKey =
    planCode !== undefined && seasonCode !== null && seasonCode !== undefined
      ? scopedVisualSourceKey({
          planCode,
          seasonCode,
          planSeasonCode,
          compareKey,
          kpisKey,
          recommendation,
        })
      : '';

  const requestIdRef = useRef(0);
  const inFlightRef = useRef(false);
  const cursorRef = useRef('');
  const hasMoreRef = useRef(false);
  const sourceKeyRef = useRef(sourceKey);
  sourceKeyRef.current = sourceKey;
  /** Set only after a successful bind for `sourceKey` — gates cache patches. */
  const boundSourceKeyRef = useRef('');
  /** Previous filter key — a change skips the patch effect so stale rows cannot pollute cache. */
  const prevSourceKeyRef = useRef(sourceKey);
  const loadedCountRef = useRef(0);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const applyBoundWindow = useCallback(
    (cached: ByItemCachePage<VisualViewItem>, preserveBound = false) => {
      cursorRef.current = cached.cursor;
      hasMoreRef.current = cached.hasMore;
      loadedCountRef.current = cached.items.length;
      setHasMore(cached.hasMore);
      setLoadedCount(cached.items.length);
      setWindowStart(0);
      // Never overlay items from another recommendation filter — that leaks Keep/Drop and
      // membership across all/keep/drop caches.
      const next = preserveBound
        ? overlayBoundItems(cached.items, itemsRef.current)
        : cached.items;
      dispatch(setByItemVisualItems(cloneByItemCacheItems(next)));
      boundSourceKeyRef.current = cached.sourceKey;
      setPageStatus('idle');
    },
    [dispatch],
  );

  const bindWindow = useCallback(
    async (preserveBound = false) => {
      const key = sourceKeyRef.current;
      if (key.length === 0) return;
      const memory = peekByItemCachePage<VisualViewItem>('visual', key);
      if (memory !== undefined) {
        applyBoundWindow(memory, preserveBound);
        return;
      }
      const cached = await readByItemCachePage<VisualViewItem>('visual', key);
      if (cached === undefined || sourceKeyRef.current !== key) return;
      applyBoundWindow(cached, preserveBound);
    },
    [applyBoundWindow],
  );

  const fetchPage = useCallback(
    async (mode: 'initial' | 'next') => {
      if (
        !enabled ||
        planCode === undefined ||
        seasonCode === null ||
        seasonCode === undefined
      ) {
        return;
      }
      if (mode === 'next' && (inFlightRef.current || !hasMoreRef.current)) return;

      const requestId = ++requestIdRef.current;
      inFlightRef.current = true;
      const key = scopedVisualSourceKey({
        planCode,
        seasonCode,
        planSeasonCode,
        compareKey,
        kpisKey,
        recommendation,
      });

      let fetchMode = mode;
      let continuation: ByItemCachePage<VisualViewItem> | undefined;
      if (fetchMode === 'next') {
        continuation = peekByItemCachePage<VisualViewItem>('visual', key);
        if (continuation === undefined) fetchMode = 'initial';
      }

      if (fetchMode === 'initial') {
        boundSourceKeyRef.current = '';
        dispatch(clearByItemVisualItems());
        dispatch(setByItemVisualStatus('loading'));
        setPageStatus('idle');
        setHasMore(false);
        setLoadedCount(0);
        setWindowStart(0);
        cursorRef.current = '';
        hasMoreRef.current = false;
        loadedCountRef.current = 0;
        // Retry / cold miss only — do not wipe a sibling filter's cache.
        await deleteByItemCachePage('visual', key);
      } else {
        setPageStatus('loading');
      }

      try {
        const data = await getByItemVisualView({
          ...BY_ITEM_VIEW_SCOPE,
          filters: {
            planCode,
            recommendation,
            cursor: fetchMode === 'initial' ? '' : cursorRef.current,
            pageSize: BY_ITEM_VISUAL_PAGE_SIZE,
          },
        });

        if (requestId !== requestIdRef.current || sourceKeyRef.current !== key) return;

        if (fetchMode === 'initial') {
          await writeByItemCachePage('visual', {
            sourceKey: key,
            items: data.items,
            cursor: data.pagination.cursor,
            hasMore: data.pagination.hasMore,
          });
        } else {
          await appendByItemCachePage(
            'visual',
            key,
            data.items,
            {
              cursor: data.pagination.cursor,
              hasMore: data.pagination.hasMore,
            },
            visualItemCacheKey,
            continuation,
          );
        }

        if (requestId !== requestIdRef.current || sourceKeyRef.current !== key) return;
        // Initial bind replaces; next page keeps in-flight Keep/Drop on already-shown cards.
        await bindWindow(fetchMode === 'next');
      } catch {
        if (requestId !== requestIdRef.current) return;
        if (fetchMode === 'initial') {
          dispatch(setByItemVisualStatus('failed'));
          setHasMore(false);
          hasMoreRef.current = false;
        } else {
          setPageStatus('failed');
        }
      } finally {
        if (requestId === requestIdRef.current) {
          inFlightRef.current = false;
        }
      }
    },
    [bindWindow, compareKey, dispatch, enabled, kpisKey, planCode, planSeasonCode, recommendation, seasonCode],
  );

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;
  const applyBoundWindowRef = useRef(applyBoundWindow);
  applyBoundWindowRef.current = applyBoundWindow;

  useLayoutEffect(() => {
    if (!enabled || planCode === undefined || seasonCode === null || seasonCode === undefined) {
      requestIdRef.current += 1;
      inFlightRef.current = false;
      boundSourceKeyRef.current = '';
      return;
    }

    // Invalidate in-flight fetches from the previous all/keep/drop key.
    requestIdRef.current += 1;
    inFlightRef.current = false;
    boundSourceKeyRef.current = '';
    dispatch(clearByItemVisualItems());
    dispatch(setByItemVisualStatus('loading'));
    setWindowStart(0);
    setLoadedCount(0);
    setHasMore(false);
    setPageStatus('idle');
    cursorRef.current = '';
    hasMoreRef.current = false;
    loadedCountRef.current = 0;

    const memory = peekByItemCachePage<VisualViewItem>('visual', sourceKey);
    if (memory !== undefined) {
      // Empty pages are a hit so keep/drop with no items show "no data", matching table.
      applyBoundWindowRef.current(memory, false);
      return;
    }

    const requestId = requestIdRef.current;
    let cancelled = false;
    void (async () => {
      const cached = await readByItemCachePage<VisualViewItem>('visual', sourceKey);
      if (cancelled || requestId !== requestIdRef.current) return;
      if (cached !== undefined) {
        applyBoundWindowRef.current(cached, false);
        return;
      }
      void fetchPageRef.current('initial');
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, enabled, planCode, seasonCode, sourceKey]);

  const syncWindow = useCallback((_viewedIndex: number, _columns = 1) => {
    /* Cards append in place; a viewed index no longer rebinds or prefetches. */
  }, []);

  const loadMore = useCallback(() => {
    if (status !== 'succeeded' || pageStatus === 'loading') return;
    void fetchPage('next');
  }, [fetchPage, pageStatus, status]);

  const retry = useCallback(() => {
    void fetchPage('initial');
  }, [fetchPage]);

  const retryPage = useCallback(() => {
    if (pageStatus !== 'failed') return;
    void fetchPage('next');
  }, [fetchPage, pageStatus]);

  useEffect(() => {
    const filterChanged = prevSourceKeyRef.current !== sourceKey;
    prevSourceKeyRef.current = sourceKey;
    // Filter switches bind from cache/network themselves. A passive effect from the render
    // that still closed over the previous filter's items must not merge them into this key.
    if (filterChanged) return;
    if (sourceKey.length === 0 || items.length === 0) return;
    if (boundSourceKeyRef.current !== sourceKey) return;
    void patchByItemCacheItems('visual', sourceKey, items, visualItemCacheKey);
  }, [items, sourceKey]);

  return {
    items,
    status,
    pageStatus,
    hasMore,
    loadedCount,
    windowStart,
    syncWindow,
    loadMore,
    retry,
    retryPage,
  };
}
