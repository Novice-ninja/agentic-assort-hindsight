import type { Query } from '@shared/services/http';
import type { GlobalSelection } from '../types';

/**
 * Serialises the global selection into query parameters.
 *
 * Every data request carries the full selection, so the season, product, country, and
 * channel a response was computed for are never ambiguous — and the server can bound the
 * response to the planner's scope on every call rather than trusting a cached scope.
 */
export function selectionQuery(selection: GlobalSelection, extra: Query = {}): Query {
  return {
    seasonId: selection.seasonId,
    productLevelId: selection.productLevelId,
    productPositionIds: selection.productPositionIds.join(','),
    countryIds: selection.countryIds.join(','),
    channelIds: selection.channelIds.join(','),
    ...extra,
  };
}

/** True when the selection cannot produce data, so callers can skip the request. */
export function isSelectionEmpty(selection: GlobalSelection): boolean {
  return (
    selection.seasonId === '' ||
    selection.productPositionIds.length === 0 ||
    selection.countryIds.length === 0 ||
    selection.channelIds.length === 0
  );
}
