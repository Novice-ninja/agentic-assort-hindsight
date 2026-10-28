/**
 * Scroll-progress helpers for infinite card lists.
 *
 * The By Item visual view scrolls inside a fixed-height card viewport (same height as the
 * table grid). Progress is the share of the *scrollable* range
 * (`scrollTop / (scrollHeight - clientHeight)`), so `0.6` means the planner is 60% of the
 * way to the bottom of what is currently loaded.
 */

export const LOAD_MORE_SCROLL_RATIO = 0.6;

export interface ScrollMetrics {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
}

/**
 * How far the planner has scrolled through the current content, `0..1`.
 *
 * Content that does not overflow is treated as fully scrolled (`1`) so a short first page
 * still asks for the next one instead of waiting for a scrollbar that never appears.
 */
export function scrollRatio({ scrollTop, clientHeight, scrollHeight }: ScrollMetrics): number {
  // Layout has not been measured yet; do not treat this as "fully scrolled" or we would
  // fire a prefetch on the first paint of an empty document.
  if (scrollHeight <= 0 || clientHeight <= 0) return 0;
  const max = scrollHeight - clientHeight;
  if (max <= 0) return 1;
  if (scrollTop <= 0) return 0;
  return Math.min(1, scrollTop / max);
}

export function isPastLoadMoreThreshold(
  metrics: ScrollMetrics,
  ratio: number = LOAD_MORE_SCROLL_RATIO,
): boolean {
  return scrollRatio(metrics) >= ratio;
}

/** Pixels still below the viewport. 0 when the planner is at the bottom. */
export function remainingScrollPx({ scrollTop, clientHeight, scrollHeight }: ScrollMetrics): number {
  return Math.max(0, scrollHeight - clientHeight - scrollTop);
}

/**
 * True when the planner is within `thresholdPx` of the bottom, or when the content does not
 * overflow (a short first page still has to ask for the next one).
 *
 * Unmeasured layout (`clientHeight` / `scrollHeight` of 0) is not "at the end" — that would
 * prefetch on the first paint of an empty scroller.
 */
export function isNearScrollEnd(metrics: ScrollMetrics, thresholdPx: number): boolean {
  if (metrics.clientHeight <= 0 || metrics.scrollHeight <= 0) return false;
  if (metrics.scrollHeight <= metrics.clientHeight) return true;
  return remainingScrollPx(metrics) <= Math.max(0, thresholdPx);
}

export function readScrollMetrics(root: Element): ScrollMetrics {
  if (root === document.documentElement || root === document.body) {
    return {
      scrollTop: window.scrollY || document.documentElement.scrollTop,
      clientHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
    };
  }
  return {
    scrollTop: root.scrollTop,
    clientHeight: root.clientHeight,
    scrollHeight: root.scrollHeight,
  };
}

/**
 * Walks from `start` to the nearest ancestor that actually scrolls vertically.
 * Falls back to the document so a test render without the app shell still works.
 */
export function nearestScrollRoot(start: Element | null): Element {
  let node: Element | null = start;
  while (node !== null) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }
  return document.documentElement;
}
