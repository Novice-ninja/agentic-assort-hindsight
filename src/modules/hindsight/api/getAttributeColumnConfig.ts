import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type {
  ColumnConfigEntry,
  ColumnConfigParams,
  ColumnConfigResponse,
} from '../types';

export const ATTRIBUTE_COLUMN_CONFIG_ENDPOINT = `${env.goApiBaseUrl}/v1/hindsight/by-attribute/column-config`;

/**
 * Fetches the column configuration for the By Attribute breakdown table.
 *
 * Returns the visible entries sorted by `order_of_display`. An empty or failed
 * response resolves to an empty array — the table will show no columns.
 */
export async function getAttributeColumnConfig(
  params: ColumnConfigParams,
): Promise<ColumnConfigEntry[]> {
  const response = await apiClient.get<ColumnConfigResponse>(
    ATTRIBUTE_COLUMN_CONFIG_ENDPOINT,
    { planCode: params.planCode, seasonCode: params.seasonCode },
  );

  if (response.status === false) {
    throw new Error(response.message || 'Column config request failed');
  }

  const entries = response.data ?? [];

  return entries
    .filter((e) => !e.is_hidden)
    .sort((a, b) => a.order_of_display - b.order_of_display);
}
