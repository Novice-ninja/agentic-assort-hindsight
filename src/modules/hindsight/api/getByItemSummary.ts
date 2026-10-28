import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';
import { formatKpiValue } from '../services/formatKpiValue';
import type {
  ByItemKpiComparison,
  ByItemSummaryData,
  ByItemSummaryKpi,
  ByItemSummaryRequest,
  ByItemSummaryResponse,
} from '../types';

/** Real backend endpoint for the By Item summary card row. */
export const BY_ITEM_SUMMARY_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/by-item/summary`;

/** Module and component the backend keys the By Item summary by. */
export const BY_ITEM_SUMMARY_SCOPE = {
  moduleName: 'by-item',
  componentName: 'summary-view',
} as const;

interface SummaryKpiWire {
  key?: string;
  name?: string;
  label: string;
  variant?: 'stat';
  value: number | null;
  formattedValue?: string;
  format?: string;
  unit?: string;
  comparison?: ByItemKpiComparison[] | null;
}

function normalizeSummaryKpi(kpi: SummaryKpiWire): ByItemSummaryKpi {
  return {
    key: kpi.name ?? kpi.key ?? '',
    name: kpi.name,
    label: decodeIaString(kpi.label),
    variant: kpi.variant ?? 'stat',
    value: kpi.value ?? null,
    formattedValue: formatKpiValue({
      value: kpi.value,
      format: kpi.format,
      displayValue: kpi.formattedValue,
    }),
    format: kpi.format,
    unit: kpi.unit ?? '',
    comparison: kpi.comparison ?? null,
  };
}

/**
 * Fetches the KPI and recommendation cards above the By Item collection.
 *
 * A `status: false` envelope is thrown rather than returned, so a business failure reported
 * over a 200 lands in the same error path as a network failure — one error state, one retry.
 */
export async function getByItemSummary(
  payload: ByItemSummaryRequest,
): Promise<ByItemSummaryData> {
  const response = await apiClient.post<ByItemSummaryResponse>(BY_ITEM_SUMMARY_ENDPOINT, payload);

  if (!response.status) {
    throw new Error(response.message || 'By item summary request failed');
  }

  const data = response.data;
  const cards = data.cards;
  const kpis = Array.isArray(cards?.kpis) ? cards.kpis.map(normalizeSummaryKpi) : [];

  return {
    ...data,
    cards: {
      ...cards,
      kpis,
      recommendation: cards?.recommendation
        ? {
            ...cards.recommendation,
            label: decodeIaString(cards.recommendation.label),
            items: cards.recommendation.items.map((entry) => ({
              ...entry,
              badge: { ...entry.badge, text: decodeIaString(entry.badge.text) },
            })),
          }
        : null,
    },
  };
}
