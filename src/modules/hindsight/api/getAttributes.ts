import { env } from '@config/env';
import { apiClient } from '@shared/services';
import type { AttributeDefinition } from '../types';

export interface GetAttributesParams {
  planCode: string;
  seasonCode: number;
}

interface AttributeApiItem {
  attrKey: string;
  label: string;
  ordinal: number;
  valueCount: number;
  significance: string | null;
  isDefault: boolean;
}

interface AttributesApiResponse {
  status: boolean;
  data: {
    planCode: string;
    seasonCode: string;
    attributes: AttributeApiItem[];
  };
  message: string;
}

function buildEndpoint(planCode: string, seasonCode: number): string {
  const base = env.goApiBaseUrl.replace(/\/$/, '');
  const url = base.endsWith('/v1') ? base : `${base}/v1`;
  return `${url}/hindsight/attributes?planCode=${encodeURIComponent(planCode)}&seasonCode=${encodeURIComponent(String(seasonCode))}`;
}

function normalize(items: AttributeApiItem[]): AttributeDefinition[] {
  return items
    .sort((a, b) => a.ordinal - b.ordinal)
    .map((item) => ({
      id: item.attrKey,
      labelKey: item.label,
      valueCount: item.valueCount,
      isDefault: item.isDefault,
    }));
}

/**
 * Fetches the available attributes for a plan/season from the backend.
 *
 * Returns `null` when the API is unreachable or returns an error response so the caller
 * can fall back to the tenant's static attribute catalogue without the UI breaking.
 */
export async function getAttributes(
  params: GetAttributesParams,
): Promise<AttributeDefinition[] | null> {
  try {
    const response = await apiClient.get<AttributesApiResponse>(
      buildEndpoint(params.planCode, params.seasonCode),
    );

    if (!response.status || !response.data?.attributes?.length) {
      return null;
    }

    return normalize(response.data.attributes);
  } catch {
    return null;
  }
}
