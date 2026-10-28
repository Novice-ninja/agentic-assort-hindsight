import type { MetricCatalogue } from '@modules/appConfig';
import { getMetricLabel } from '@modules/appConfig';
import { formatKpiValue } from './formatKpiValue';
import type {
  KpiSummarizeItem,
  KpiSummarizeRequest,
  ProductPerformanceKpi,
} from '../types';

export const KPI_CARD_TYPE = 'segment' as const;
export const KPI_STRIP_PROMPT_KEY = 'kpi_strip_insight' as const;

/**
 * Builds the summarize request for the Overview season-scorecard AI strip.
 *
 * Labels come from the metric catalogue (same source as the cards). Null when there are no
 * numeric KPIs worth sending — the agent rejects an empty list.
 */
export function buildKpiSummarizePayload(
  kpis: readonly ProductPerformanceKpi[],
  catalogue: MetricCatalogue,
): KpiSummarizeRequest | null {
  const items: KpiSummarizeItem[] = [];

  for (const kpi of kpis) {
    const raw = kpi.value;
    const numeric =
      typeof raw === 'number'
        ? raw
        : typeof raw === 'string' && raw.trim() !== ''
          ? Number(raw)
          : NaN;
    if (!Number.isFinite(numeric)) continue;

    const displayValue =
      formatKpiValue({
        value: kpi.value,
        format: kpi.format,
        displayValue: kpi.displayValue,
      }) || undefined;

    const item: KpiSummarizeItem = {
      key: kpi.key,
      label: getMetricLabel(catalogue, kpi.key),
      value: numeric,
      trend: kpi.trend.map((t) => ({
        direction: t.direction,
        delta: t.delta,
        deltaUnit: t.deltaUnit,
        comparisonLabel: t.comparisonLabel,
        sentiment: t.sentiment,
      })),
    };

    if (displayValue !== undefined && displayValue.length > 0) {
      item.displayValue = displayValue;
    }
    if (kpi.format != null && kpi.format.trim().length > 0) {
      item.format = kpi.format;
    }

    items.push(item);
  }

  if (items.length === 0) return null;

  return {
    cardType: KPI_CARD_TYPE,
    dimension: 'kpi',
    promptKey: KPI_STRIP_PROMPT_KEY,
    series: [{ name: 'KPIs', data: items }],
  };
}
