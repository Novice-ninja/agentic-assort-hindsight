import { apiClient } from '@shared/services';
import type { PlanDraft } from '../types';

export interface SaveDraftResponse {
  id: string;
  status: 'draft';
  updatedAt: string;
}

export function savePlanDraft(draft: PlanDraft): Promise<SaveDraftResponse> {
  return apiClient.post<SaveDraftResponse>('/planning/plans/draft', draft);
}
