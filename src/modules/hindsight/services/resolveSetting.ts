import type { EnabledMetrics, MetricCatalogue, ThresholdBounds, WidgetConfig } from '../types';

/**
 * Resolves a tenant default against a planner's choice.
 *
 * There is deliberately **no error path and no empty state**. If a planner's choice is no
 * longer enabled — because the business changed its configuration — the tenant default is
 * returned silently. Every widget reads its settings through this function, so the rule is
 * proven once by test rather than re-implemented per widget.
 */
export function resolveSetting<T>(
  tenantDefault: T,
  userChoice: T | undefined,
  isStillEnabled: (value: T) => boolean,
): T {
  if (userChoice === undefined) return tenantDefault;
  return isStillEnabled(userChoice) ? userChoice : tenantDefault;
}

function metricIsEnabled(
  catalogue: MetricCatalogue,
  enabled: EnabledMetrics,
  metricId: string,
): boolean {
  const inCatalogue = catalogue.metrics.some((m) => m.id === metricId);
  if (!inCatalogue) return false;
  return enabled === 'all' || enabled.includes(metricId);
}

/** The metric a widget should show, given the tenant's config and the planner's choice. */
export function resolveMetricId(
  catalogue: MetricCatalogue,
  config: Pick<WidgetConfig, 'defaultMetricId' | 'enabledMetricIds'>,
  userChoice: string | undefined,
): string {
  return resolveSetting(config.defaultMetricId, userChoice, (id) =>
    metricIsEnabled(catalogue, config.enabledMetricIds, id),
  );
}

/** The metrics a picker may offer. Never anything outside the tenant's enabled set. */
export function availableMetricIds(
  catalogue: MetricCatalogue,
  enabled: EnabledMetrics,
): string[] {
  return catalogue.metrics.filter((m) => enabled === 'all' || enabled.includes(m.id)).map((m) => m.id);
}

/**
 * An ordered metric list, preserving the planner's order and dropping anything no longer
 * enabled. Falls back to the tenant default when nothing survives, so a widget is never
 * left with an empty list.
 */
export function resolveMetricList(
  catalogue: MetricCatalogue,
  config: Pick<WidgetConfig, 'defaultMetricId' | 'enabledMetricIds'>,
  userChoice: string[] | undefined,
): string[] {
  const surviving = (userChoice ?? []).filter((id) =>
    metricIsEnabled(catalogue, config.enabledMetricIds, id),
  );
  return surviving.length > 0 ? surviving : [config.defaultMetricId];
}

/**
 * Clamps on read rather than on write. A planner who chose 40 keeps that choice stored; if
 * the tenant later lowers the maximum to 25 they see 25, and raising it back restores 40.
 */
export function resolveListLength(
  config: Pick<WidgetConfig, 'defaultListLength' | 'maxListLength'>,
  userChoice: number | undefined,
): number {
  const fallback = config.defaultListLength ?? 20;
  const max = config.maxListLength;
  const chosen = resolveSetting(fallback, userChoice, (n) => Number.isFinite(n) && n > 0);
  return max === undefined ? chosen : Math.min(chosen, max);
}

export function clampToBounds(value: number, bounds: ThresholdBounds): number {
  return Math.min(Math.max(value, bounds.min), bounds.max);
}

/** Returns the threshold to use and whether it had to be constrained, so the UI can say so. */
export function resolveThreshold(
  config: Pick<WidgetConfig, 'thresholdPercent' | 'surfacingThresholdBounds'>,
  userChoice: number | undefined,
): { value: number; clamped: boolean } {
  const fallback = config.thresholdPercent ?? 0;
  const bounds = config.surfacingThresholdBounds;
  const chosen = userChoice ?? fallback;
  if (bounds === undefined) return { value: chosen, clamped: false };
  const clampedValue = clampToBounds(chosen, bounds);
  return { value: clampedValue, clamped: clampedValue !== chosen };
}

export function findWidgetConfig(
  widgets: WidgetConfig[],
  widgetId: string,
): WidgetConfig | undefined {
  return widgets.find((w) => w.widgetId === widgetId);
}
