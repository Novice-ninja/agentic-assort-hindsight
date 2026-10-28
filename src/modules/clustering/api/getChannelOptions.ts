import { EMPTY_FILTER_SNAPSHOT_ID, getFilterValues } from '@modules/planning/api/getFilters';
import type { ChannelOption } from '../types';

export const CHANNEL_FILTER_ATTRIBUTE = 'channel';
export const CHANNEL_PAGE_SIZE = 50;

/**
 * Channel options for the Create Cluster Plan Scope step.
 *
 * Reuses the shared `POST /v1/filters/values` client with
 * `{ attributes: ["channel"], filters: [], limit: 50, offset: 0 }` and maps
 * `data.values.channel[]` onto the `ChannelOption` cards. Labels come straight
 * from the API (e.g. "BnM", "WEB", "WHS") rather than translation keys.
 */
export async function getChannelOptions(): Promise<ChannelOption[]> {
  const data = await getFilterValues({
    attributes: [CHANNEL_FILTER_ATTRIBUTE],
    filters: [],
    snapshot_id: EMPTY_FILTER_SNAPSHOT_ID,
    limit: CHANNEL_PAGE_SIZE,
    offset: 0,
  });
  const rows = data.values[CHANNEL_FILTER_ATTRIBUTE] ?? [];
  return rows.map((row) => ({ id: row.value, label: row.label }));
}
