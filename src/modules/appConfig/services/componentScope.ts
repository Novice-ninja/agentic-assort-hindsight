import type { ComponentConfig } from '../types';
import { normaliseMetricKey } from './metricCatalogue';

function normalise(key: string): string {
  return key.trim().toLowerCase();
}

/**
 * Narrows what a component renders to the KPI keys its config names.
 *
 * An absent or empty `kpiList` means "no restriction" rather than "nothing", so a component that
 * has not been narrowed shows everything its endpoint returned. Keys are compared trimmed and
 * case-insensitively, because the list is authored alongside the backend rather than derived
 * from it, and "Qty Sold" should not miss `qty sold`.
 */
export function scopeToConfiguredKpis<T extends { key: string }>(
  items: readonly T[],
  config: ComponentConfig | undefined,
): readonly T[] {
  const allowed = config?.kpiList ?? [];
  if (allowed.length === 0) return items;

  const keys = new Set(allowed.map(normalise));
  return items.filter((item) => keys.has(normalise(item.key)));
}

/**
 * Narrows a plan's metrics to the keys `cardMetrics` names, in that authored order.
 *
 * Which metrics appear on an All Plans card, and how many, is config — not whatever the plans
 * endpoint happened to return. An absent or empty list leaves the payload whole so a missing
 * config still shows something; a key with no matching payload entry is dropped rather than
 * inventing a blank cell.
 */
export function scopeToConfiguredCardMetrics<T extends { key: string }>(
  items: readonly T[],
  config: ComponentConfig | undefined,
): readonly T[] {
  const wanted = config?.cardMetrics ?? [];
  if (wanted.length === 0) return items;

  const byKey = new Map(items.map((item) => [normaliseMetricKey(item.key), item]));
  return wanted
    .map((key) => byKey.get(normaliseMetricKey(key)))
    .filter((item): item is T => item !== undefined);
}

/**
 * Narrows contribution cards to the attribute dimensions `dimensionList` names.
 *
 * An absent or empty list means "no restriction", so a component that has not been narrowed
 * shows every card its endpoint returned. Keys are compared after `normaliseMetricKey` so
 * `Article-Brand-Name` still matches `article_brand_name`. Payload order is kept — the list
 * decides membership, not display order. `limit` is ignored here; which cards appear is the
 * list, not a cap.
 */
export function scopeToConfiguredDimensions<T extends { dimension: string }>(
  items: readonly T[],
  config: ComponentConfig | undefined,
): readonly T[] {
  const allowed = config?.dimensionList ?? [];
  if (allowed.length === 0) return items;

  const keys = new Set(allowed.map(normaliseMetricKey));
  return items.filter((item) => keys.has(normaliseMetricKey(item.dimension)));
}

/**
 * Caps how many entries a component renders, keeping the first `limit` in the order the backend
 * sent them. An absent limit leaves the list whole; a negative or non-finite one is treated as
 * absent, since neither can describe a number of cards.
 */
export function scopeToConfiguredLimit<T>(
  items: readonly T[],
  config: ComponentConfig | undefined,
): readonly T[] {
  const limit = config?.limit;
  if (limit === undefined || !Number.isFinite(limit) || limit < 0) return items;
  return items.slice(0, limit);
}
