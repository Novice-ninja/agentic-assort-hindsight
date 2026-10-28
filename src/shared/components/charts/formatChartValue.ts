import type { MetricType } from '@modules/appConfig';

/**
 * How chart values are written on an axis, in a tooltip, and in a chart's text alternative.
 *
 * Every widget that lets a planner switch metrics needs this: an axis reading "45%" for a currency
 * metric is not a smaller problem than a missing chart. The metric's configured type decides the
 * shape, so a widget never guesses from the numbers it happens to have been sent.
 */

function trimScaled(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Compact number for axes and tooltips. Values under 1 keep two decimals so
 * small KPIs like ROS (`0.0333`) show as `0.033` instead of collapsing to `0.0`.
 */
export function formatScaledNumber(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000_000) return `${trimScaled(value / 1_000_000_000_000)}T`;
  if (absolute >= 1_000_000_000) return `${trimScaled(value / 1_000_000_000)}B`;
  if (absolute >= 1_000_000) return `${trimScaled(value / 1_000_000)}M`;
  if (absolute >= 1_000) return `${trimScaled(value / 1_000)}K`;
  if (Number.isInteger(value)) return String(value);
  if (absolute > 0 && absolute < 1) return String(Number(value.toFixed(3)));
  return value.toFixed(1);
}

export function isPercentMetric(metricType: MetricType): boolean {
  return metricType === 'percent';
}

/**
 * Percentages are plotted as fractions, so `78.2` and `0.782` both have to end up at `0.782`.
 * The endpoint sends whole percents for some metrics and fractions for others, and only values
 * above 1 can be told apart — a true 0.5% is indistinguishable from a fraction and stays as is.
 */
export function toPlottedValue(value: number | null, metricType: MetricType): number | null {
  if (value === null) return null;
  if (!isPercentMetric(metricType)) return value;
  return Math.abs(value) > 1 ? value / 100 : value;
}

/** An axis or tooltip label for an already-plotted value. */
export function formatChartValue(value: number | null | undefined, metricType: MetricType): string {
  if (value === null || value === undefined) return '—';
  if (isPercentMetric(metricType)) return `${Math.round(value * 100)}%`;
  return formatScaledNumber(value);
}

/**
 * Smallest number of decimals that keeps ticks `interval` apart from printing as the same label.
 * `0.05` needs 2 (`0.30` vs `0.35`); `0.1` needs 1; `1` or more needs none.
 */
export function decimalsForInterval(interval: number): number {
  if (!Number.isFinite(interval) || interval <= 0) return 1;
  for (let decimals = 0; decimals <= 4; decimals += 1) {
    if (interval + 1e-9 >= 10 ** -decimals) return decimals;
  }
  return 4;
}

function trimFixed(value: number, decimals: number): string {
  if (decimals <= 0) return String(Math.round(value));
  return String(Number(value.toFixed(decimals)));
}

/**
 * Y-axis label for a value already in the shape the API sent.
 *
 * Percent metrics are not multiplied or divided: `82.8` stays `82.8%` and `0.83` stays `0.83%`.
 * Decimals follow the tick step so neighbouring ticks do not collapse onto one label.
 */
export function formatAxisTick(
  value: number,
  metricType: MetricType,
  tickInterval?: number,
): string {
  if (!Number.isFinite(value)) return '—';
  if (isPercentMetric(metricType)) {
    const places = tickInterval === undefined ? 2 : decimalsForInterval(tickInterval);
    const text = places <= 0 ? String(Math.round(value)) : trimFixed(value, places);
    return `${text}%`;
  }

  if (Math.abs(value) >= 1_000) return formatScaledNumber(value);
  const decimals = decimalsForInterval(tickInterval ?? 1);
  if (decimals <= 1) return formatScaledNumber(value);
  return trimFixed(value, decimals);
}

/**
 * Contribution / cumulative shares as the Pareto endpoint sends them: already 0–100, not a
 * fraction. One decimal unless the value is whole.
 */
export function formatSharePercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
}
