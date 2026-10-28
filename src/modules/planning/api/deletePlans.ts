import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** Soft-delete one or more plans by plan code. */
export const DELETE_PLANS_ENDPOINT = `${env.goApiBaseUrl}/v1/plans/delete`;

export interface DeletePlansInput {
  planCodes: string[];
}

export interface DeletePlansApiResponse {
  status: boolean;
  data?: unknown;
  message: string;
}

export async function deletePlans(input: DeletePlansInput): Promise<DeletePlansApiResponse> {
  return apiClient.post<DeletePlansApiResponse>(DELETE_PLANS_ENDPOINT, input);
}
