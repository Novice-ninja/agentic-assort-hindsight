import type { MetricCatalogue } from '../types';

export interface MetricFilterOption {
  /** Exact `metricKey` from metrics-config — sent unchanged on chart payloads. */
  value: string;
  /** Exact `displayValue` from metrics-config — shown in the dropdown. */
  label: string;
}

const NO_OPTIONS: readonly MetricFilterOption[] = [];

/**
 * Metric/KPI dropdown options for a component: enabled catalogue rows whose `uiComponent`
 * string is in the component's `metricKeys` allowlist
 * (`ComponentConfig.metricKeys` includes metrics-config `uiComponent`).
 *
 * Each API row is evaluated on its own — same `metricKey` with a different `uiComponent`
 * is a different option set entry (with that row's own `displayValue`).
 */
export function getMetricDropdownOptions(
  catalogue: MetricCatalogue,
  placementKeys: readonly string[],
): readonly MetricFilterOption[] {
  const wanted = new Set(
    placementKeys.map((key) => key.trim()).filter((key) => key.length > 0),
  );
  if (wanted.size === 0) return NO_OPTIONS;

  const options = catalogue
    .filter(
      (metric) =>
        metric.enabled &&
        metric.uiComponent !== undefined &&
        wanted.has(metric.uiComponent),
    )
    .map((metric) => ({ value: metric.key, label: metric.label }));

  return options.length === 0 ? NO_OPTIONS : options;
}
