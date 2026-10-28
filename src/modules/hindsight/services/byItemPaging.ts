/**
 * By Item list paging: one API page is large enough to bind a first screen of cards or
 * rows; the next page is requested once the planner has scrolled near the end of what
 * is already loaded, so the round trip finishes before they run out of cached rows.
 */

/** Items asked for on each table-data and visual-view request. */
export const BY_ITEM_FETCH_PAGE_SIZE = 100;

/**
 * Items asked for on each visual-view (card) request. Same size as the table page so
 * both views stay light on first paint; infinite scroll appends further pages.
 */
export const BY_ITEM_VISUAL_FETCH_PAGE_SIZE = BY_ITEM_FETCH_PAGE_SIZE;

/**
 * How far into the latest page the planner must scroll before the next page is
 * requested (prefetch helpers). Card/table UIs primarily use scroll-near-end / last-row.
 */
export const BY_ITEM_PREFETCH_AFTER = 60;

/** Cards or rows bound into the DOM at once. The rest stay in IndexedDB until the window slides. */
export const BY_ITEM_UI_WINDOW = 400;

/** Shared viewport height for the card scroller and the table grid so both virtualize the same way. */
export const BY_ITEM_VIEWPORT_HEIGHT = 675;

/**
 * How long a plan/season/filter page may live in IndexedDB before the next read deletes it
 * and the hooks refetch from cursor `""`. Paging appends do not refresh this clock.
 */
export const BY_ITEM_CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * How close to either end of the bound window the viewed item may get before the window
 * recentres. Large enough that a single scroll step cannot bounce the start by 1.
 */
export const BY_ITEM_WINDOW_EDGE = 80;

/**
 * Index of the item that should trigger a prefetch for a cache of `loadedCount` items.
 *
 * For a full 100-item page that is 60; for a short last page it is 0 so a collection
 * smaller than the prefetch window still asks for the rest.
 */
export function prefetchAfterIndex(
  loadedCount: number,
  pageSize: number = BY_ITEM_FETCH_PAGE_SIZE,
  after: number = BY_ITEM_PREFETCH_AFTER,
): number {
  if (loadedCount <= 0) return 0;
  return Math.max(0, loadedCount - (pageSize - after));
}

/** True once `viewedIndex` has reached the prefetch mark of the current cache. */
export function shouldPrefetch(
  viewedIndex: number,
  loadedCount: number,
  pageSize: number = BY_ITEM_FETCH_PAGE_SIZE,
  after: number = BY_ITEM_PREFETCH_AFTER,
): boolean {
  if (loadedCount <= 0 || viewedIndex < 0) return false;
  const mark = prefetchAfterIndex(loadedCount, pageSize, after);
  // Index 0 is reported on the first paint. A short page (mark === 0) must not treat that
  // as "already at the end" or every mount with hasMore would fetch until the cache fills.
  if (mark === 0) return viewedIndex > 0 && viewedIndex >= loadedCount - 1;
  return viewedIndex >= mark;
}

/**
 * Start index of the 400-item UI window. Stays put while the viewed item is inside the
 * safe zone, then recentres so scrolling does not rebuild the DOM on every card.
 */
export function nextBindWindowStart(
  viewedIndex: number,
  currentStart: number,
  loadedCount: number,
  windowSize: number = BY_ITEM_UI_WINDOW,
  edge: number = BY_ITEM_WINDOW_EDGE,
): number {
  if (loadedCount <= windowSize) return 0;
  const maxStart = loadedCount - windowSize;
  const start = Math.min(Math.max(0, currentStart), maxStart);
  // First visible item sitting on the bound window is expected, including the first card.
  if (viewedIndex >= start && viewedIndex <= start + windowSize - edge) {
    return start;
  }
  if (viewedIndex < start) {
    return Math.max(0, Math.min(maxStart, viewedIndex - edge));
  }
  return Math.max(0, Math.min(maxStart, viewedIndex - Math.floor(windowSize / 2)));
}

/** Rounds `value` down to a multiple of `step` so a CSS grid window starts on a full row. */
export function snapDown(value: number, step: number): number {
  if (step <= 1) return value;
  return Math.floor(value / step) * step;
}

/**
 * Pixel height of skipped grid rows above (or below) the bound window, so the scroller
 * still reflects the items that live only in IndexedDB.
 */
export function windowSpacerPx(
  skippedItems: number,
  columns: number,
  rowHeight: number,
): number {
  if (skippedItems <= 0 || columns <= 0 || rowHeight <= 0) return 0;
  return Math.floor(skippedItems / columns) * rowHeight;
}

/**
 * How far the scroller must move when the bound window slides, so the same item stays
 * under the viewport instead of the planner staring at the empty spacer.
 */
export function spacerScrollDelta(
  previousStart: number,
  nextStart: number,
  columns: number,
  rowHeight: number,
): number {
  return windowSpacerPx(nextStart, columns, rowHeight) - windowSpacerPx(previousStart, columns, rowHeight);
}

/**
 * Absolute index of the first item whose row intersects the viewport, from how far the
 * grid has been scrolled and the measured row height.
 */
export function firstVisibleItemIndex(
  hiddenAbovePx: number,
  rowHeight: number,
  columns: number,
): number {
  if (rowHeight <= 0 || columns <= 0 || hiddenAbovePx <= 0) return 0;
  return Math.floor(hiddenAbovePx / rowHeight) * columns;
}

/** Count of tracks in a CSS `grid-template-columns` value. */
export function cardGridColumnCount(gridTemplateColumns: string): number {
  const tracks = gridTemplateColumns.split(' ').filter((track) => track.length > 0);
  return tracks.length > 0 ? tracks.length : 6;
}

/**
 * Upserts `incoming` onto `existing` by `keyOf`. Empty keys append, matching how the
 * By Item slice merges pages so an override is replaced by the server's current row.
 */
export function appendUniqueByKey<T>(
  existing: readonly T[],
  incoming: readonly T[],
  keyOf: (item: T) => string,
): T[] {
  const next = existing.slice();
  const indexByKey = new Map<string, number>();
  next.forEach((item, index) => {
    const key = keyOf(item);
    if (key.length > 0) indexByKey.set(key, index);
  });
  incoming.forEach((item) => {
    const key = keyOf(item);
    if (key.length === 0) {
      next.push(item);
      return;
    }
    const at = indexByKey.get(key);
    if (at === undefined) {
      indexByKey.set(key, next.length);
      next.push(item);
      return;
    }
    next[at] = item;
  });
  return next;
}
