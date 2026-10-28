import { formatCurrency, formatNumber } from '@shared/utils';
import type { KpiTrend } from '../types';

export type KpiValueFormat = 'currency' | 'percentage' | 'count' | 'number';

/**
 * Infers how a KPI's headline value should be formatted from its name, because the API sends
 * the raw number without a unit.
 *
 * Order matters: ratio metrics ("gross margin", "sell-through", "markdown") are checked before
 * currency so that "Margin" reads as an amount while "Gross margin" reads as a percentage.
 */
export function inferKpiFormat(key: string): KpiValueFormat {
  const k = key.toLowerCase();
  if (/(gross\s*margin|sell[\s-]?through|markdown|\bst%|\bgm%|rate|ratio|percent)/.test(k)) {
    return 'percentage';
  }
  if (/(qty|quantity|units?|volume|count|pieces?)/.test(k)) return 'count';
  if (/(revenue|sales|margin|gmv|value|cost|spend|price|amount)/.test(k)) return 'currency';
  return 'number';
}

/**
 * Percentages may arrive either as a fraction (0.596) or as a whole number (59.6). Values at or
 * below 1 are treated as fractions; anything larger is treated as an already-scaled percentage.
 */
function formatPercentValue(value: number, locale: string): string {
  const fraction = Math.abs(value) <= 1 ? value : value / 100;
  return formatNumber(fraction, locale, { style: 'percent', maximumFractionDigits: 1 });
}

/** Formats a KPI's headline value according to the format inferred from its key. */
export function formatKpiValue(key: string, value: number, locale: string): string {
  switch (inferKpiFormat(key)) {
    case 'currency':
      return formatCurrency(value, locale);
    case 'percentage':
      return formatPercentValue(value, locale);
    case 'count':
      return formatNumber(value, locale, { maximumFractionDigits: 0 });
    default:
      return formatNumber(value, locale);
  }
}

/**
 * Formats a comparison delta with a leading sign taken from the trend's direction, so the
 * arrow and the number always agree regardless of how the backend signs `delta`.
 */
export function formatKpiDelta(trend: KpiTrend, locale: string): string {
  const magnitude = Math.abs(trend.delta);
  const number =
    trend.deltaUnit === 'currency'
      ? formatCurrency(magnitude, locale)
      : trend.deltaUnit === 'percent'
        ? `${formatNumber(magnitude, locale, { maximumFractionDigits: 1 })}%`
        : formatNumber(magnitude, locale, { maximumFractionDigits: 1 });

  const sign = trend.direction === 'up' ? '+' : trend.direction === 'down' ? '−' : '';
  return `${sign}${number}`;
}
