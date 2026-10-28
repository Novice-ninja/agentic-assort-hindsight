import type { MetricCatalogue, MetricConfig, MetricType } from '../types';

const NO_METRICS: readonly MetricConfig[] = [];

/**
 * Canonical form of a metric key for tolerant catalogue *lookups* (labels/types).
 * Not used to rewrite keys for dropdown values or chart payloads.
 */
export function normaliseMetricKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function rowsMatchingKey(catalogue: MetricCatalogue, key: string): MetricConfig[] {
  const wanted = normaliseMetricKey(key);
  if (wanted.length === 0) return [];

  return catalogue.filter(
    (metric) => metric.key === key || normaliseMetricKey(metric.key) === wanted,
  );
}

/**
 * Lookup by metric key for labels/types. When the same key exists for several placements,
 * prefers `uiComponent === 'default'`, otherwise the first matching row.
 */
export function findMetricConfig(
  catalogue: MetricCatalogue,
  key: string,
): MetricConfig | undefined {
  const matches = rowsMatchingKey(catalogue, key);
  if (matches.length === 0) return undefined;
  return matches.find((metric) => metric.uiComponent === 'default') ?? matches[0];
}

/**
 * Wire `metricKey` for payloads: the catalogue entry's key as metrics-config sent it.
 */
export function getWireMetricKey(catalogue: MetricCatalogue, key: string): string {
  return findMetricConfig(catalogue, key)?.key ?? key;
}

/** Display label for a metric, falling back to the key when it is not in the catalogue. */
export function getMetricLabel(catalogue: MetricCatalogue, key: string): string {
  return findMetricConfig(catalogue, key)?.label ?? key;
}

/** Value type for a metric, or `unknown` when the catalogue does not describe one. */
export function getMetricType(catalogue: MetricCatalogue, key: string): MetricType {
  return findMetricConfig(catalogue, key)?.type ?? 'unknown';
}

/**
 * One enabled entry per metric key (for non-placement consumers). Prefers `uiComponent ===
 * 'default'` when several rows share a key.
 */
export function getEnabledMetricConfigs(catalogue: MetricCatalogue): readonly MetricConfig[] {
  const byKey = new Map<string, MetricConfig>();

  for (const metric of catalogue) {
    if (!metric.enabled) continue;
    const existing = byKey.get(metric.key);
    if (existing === undefined || metric.uiComponent === 'default') {
      byKey.set(metric.key, metric);
    }
  }

  const enabled = [...byKey.values()];
  return enabled.length === 0 ? NO_METRICS : enabled;
}
