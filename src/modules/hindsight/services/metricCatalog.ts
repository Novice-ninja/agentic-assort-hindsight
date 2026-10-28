import { formatCurrency, formatNumber } from '@shared/utils';
import type { Metric, MetricCatalogue, MetricDirection } from '../types';

/** Rendered in place of any value that has no comparable basis. Never blank, never zero. */
export const NO_COMPARISON = '—';

export class EmptyCatalogueError extends Error {
  constructor() {
    super('A metric catalogue must contain at least one metric.');
    this.name = 'EmptyCatalogueError';
  }
}

/**
 * An empty catalogue would leave every widget with nothing to show and no way to recover,
 * so it is rejected at the boundary rather than defended against in each widget.
 */
export function assertCatalogue(catalogue: MetricCatalogue): MetricCatalogue {
  if (catalogue.metrics.length === 0) throw new EmptyCatalogueError();
  return catalogue;
}

export function findMetric(catalogue: MetricCatalogue, metricId: string): Metric | undefined {
  return catalogue.metrics.find((m) => m.id === metricId);
}

/**
 * Formats a value according to its metric's configured format and the active locale.
 * Percentages arrive as fractions (0.782), matching the API contract.
 */
export function formatMetricValue(
  metric: Metric | undefined,
  value: number | null | undefined,
  locale: string,
): string {
  if (metric === undefined || value === null || value === undefined) return NO_COMPARISON;

  switch (metric.format) {
    case 'currency':
      return formatCurrency(value, locale);
    case 'percentage':
      return formatNumber(value, locale, {
        style: 'percent',
        maximumFractionDigits: 1,
      });
    case 'unitCount':
      return formatNumber(value, locale, { maximumFractionDigits: 0 });
    default:
      return formatNumber(value, locale);
  }
}

/** A signed percentage movement, for delta indicators. */
export function formatDelta(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined) return NO_COMPARISON;
  return formatNumber(value, locale, {
    style: 'percent',
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  });
}

export type Favourability = 'favourable' | 'unfavourable' | 'neutral';

/**
 * Whether a movement is good news, judged by the metric's configured direction rather than
 * the sign of the delta. A markdown percentage falling is favourable; sell-through falling
 * is not, and no widget is allowed to guess which.
 */
export function favourabilityOf(
  direction: MetricDirection | undefined,
  delta: number | null | undefined,
): Favourability {
  if (delta === null || delta === undefined || delta === 0) return 'neutral';
  const risingIsGood = direction !== 'lowerIsBetter';
  const rising = delta > 0;
  return rising === risingIsGood ? 'favourable' : 'unfavourable';
}

/** Convenience wrapper for callers that hold a metric rather than a direction. */
export function isFavourable(metric: Metric | undefined, delta: number | null): boolean {
  return favourabilityOf(metric?.direction, delta) === 'favourable';
}

/** Metrics that can be compared against last year, for TY/LY columns. */
export function comparableMetrics(catalogue: MetricCatalogue): Metric[] {
  return catalogue.metrics.filter((m) => m.lyComparable);
}
