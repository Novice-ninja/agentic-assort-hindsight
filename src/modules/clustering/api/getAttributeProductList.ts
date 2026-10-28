import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';

/** `POST /v1/clustering/attributes/product-list` with `{ variantId, clusterPlanCode }`. */
export const ATTRIBUTE_PRODUCT_LIST_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/attributes/product-list`;

/** One attribute the Finalize grades dropdown can plot. `value` is sent back unchanged. */
export interface AttributeProductOption {
  label: string;
  value: string;
}

/** Parsed `POST /v1/clustering/attributes/product-list` body (after unwrapping `{ data }`). */
export interface AttributeProductListResponse {
  attributes: AttributeProductOption[];
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function parseOption(value: unknown): AttributeProductOption | null {
  if (!isRecord(value) || !isNonEmptyString(value.label) || !isNonEmptyString(value.value)) {
    return null;
  }
  return {
    label: decodeIaString(value.label.trim()),
    value: value.value.trim(),
  };
}

export function parseAttributeProductListResponse(
  value: unknown,
): AttributeProductListResponse | null {
  if (!isRecord(value) || !Array.isArray(value.attributes)) return null;
  const attributes: AttributeProductOption[] = [];
  for (const item of value.attributes) {
    const option = parseOption(item);
    if (option === null) return null;
    attributes.push(option);
  }
  return { attributes };
}

/** Attribute dropdown options for the selected "3 Best" variant. */
export async function getAttributeProductList(
  clusterPlanCode: string,
  variantId: string,
): Promise<AttributeProductListResponse> {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  if (!isNonEmptyString(variantId)) throw new Error('variantId is required');
  const payload = await apiClient.post<unknown>(ATTRIBUTE_PRODUCT_LIST_ENDPOINT, {
    variantId,
    clusterPlanCode: code,
  });
  const data = parseAttributeProductListResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected attribute product list response');
  return data;
}
