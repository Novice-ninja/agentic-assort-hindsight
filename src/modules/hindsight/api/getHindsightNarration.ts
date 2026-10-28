import { apiClient } from '@shared/services';
import { selectionQuery } from './selectionQuery';
import type { GlobalSelection, NarrationInsight, UserPreferences } from '../types';

export interface HindsightNarrationResponse {
  insights: NarrationInsight[];
}

/**
 * Reads insights a prior batch produced. There is no generate endpoint: narration is
 * batch-only, and this module never asks for text to be written on demand.
 */
export function getHindsightNarration(
  selection: GlobalSelection,
  widgetIds: string[],
): Promise<HindsightNarrationResponse> {
  return apiClient.get<HindsightNarrationResponse>(
    '/hindsight/narration',
    selectionQuery(selection, { widgetIds: widgetIds.join(',') }),
  );
}

export function patchPreferences(
  patch: Partial<UserPreferences>,
): Promise<UserPreferences> {
  return apiClient.patch<UserPreferences>('/hindsight/preferences', patch);
}
