import { formatCurrency, formatNumber } from '@shared/utils';
import type { ClusteringMetric } from '../types';

export const NO_COMPARISON = '—';

export function formatClusteringMetricValue(
  metric: ClusteringMetric | undefined,
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
    case 'score':
      return formatNumber(value, locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case 'unitCount':
      return formatNumber(value, locale, { maximumFractionDigits: 0 });
    default:
      return formatNumber(value, locale);
  }
}

export function formatClusterCount(value: number | null | undefined): string {
  return value === null || value === undefined ? '-' : String(value);
}
