import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { toAttributeBreakdownRows } from '../services/attributeTableRows';
import type {
  AttributeTableData,
  AttributeTableDataRequest,
  AttributeTableDataResponse,
} from '../types';

/** Backend endpoint for the By Attribute breakdown table's rows. */
export const ATTRIBUTE_TABLE_DATA_ENDPOINT = `${env.goApiBaseUrl}/v1/hindsight/by-attribute/table`;

/**
 * Channel requested until a channel control exists on the tab. Empty asks for every channel —
 * the channel facet's own ids are not the codes this endpoint expects.
 */
export const DEFAULT_ATTRIBUTE_CHANNEL_CODE = '';

/**
 * Fetches the rows for the By Attribute breakdown table.
 *
 * Only row data is requested — the column definition is frontend-owned static config. The
 * endpoint's flat rows are adapted to the cells those columns address, and a missing `data` is
 * normalised to an empty array so callers never have to guard for it.
 */
export async function getAttributeTableData(
  payload: AttributeTableDataRequest,
): Promise<AttributeTableData> {
  const response = await apiClient.post<AttributeTableDataResponse>(
    ATTRIBUTE_TABLE_DATA_ENDPOINT,
    payload,
  );

  if (response.status === false) {
    throw new Error(response.message || 'Attribute table data request failed');
  }

  const rawApiRows = response.data ?? [];

  return {
    rowData: toAttributeBreakdownRows(rawApiRows),
    rawApiRows,
    total: response.total,
  };
}
