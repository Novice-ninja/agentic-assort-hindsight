import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { FinalAttributesRequest } from './putFinalAttributes';
import type { GeneratedVariantDto } from './generateVariants';

/** `POST /v1/clustering/plans/attributes/variants/custom`. */
export const CREATE_CUSTOM_VARIANT_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/attributes/variants/custom`;

export interface CreateCustomVariantRequest extends FinalAttributesRequest {
  clusterPlanCode: string;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function isVariantDto(value: unknown): value is GeneratedVariantDto {
  if (typeof value !== 'object' || value === null) return false;
  const id = (value as { variantId?: unknown }).variantId;
  return typeof id === 'string' && id.trim().length > 0;
}

/** Creates one custom variant from the user's chip selection. */
export async function createCustomVariant(
  body: CreateCustomVariantRequest,
): Promise<GeneratedVariantDto> {
  const code = body.clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  const payload = await apiClient.post<unknown>(CREATE_CUSTOM_VARIANT_ENDPOINT, {
    ...body,
    clusterPlanCode: code,
  });
  const data = unwrapData(payload);
  if (!isVariantDto(data)) {
    throw new Error('Unexpected custom variant response');
  }
  return data;
}
