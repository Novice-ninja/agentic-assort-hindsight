import { env } from '@config/env';
import { apiClient } from '@shared/services';
import { decodeIaString } from '@shared/utils/format';

/** `POST /v1/clustering/attributes/info` with `{ variantId, clusterPlanCode, attribute }`. */
export const ATTRIBUTE_INFO_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/attributes/info`;

/** One stacked series: decoded version name, values aligned to `categories`. */
export interface AttributeGradeSeries {
  name: string;
  data: (number | null)[];
}

/**
 * Parsed attribute-grades chart. Labels are decoded once here so render and
 * tooltips never scan for `__ia_char_` tokens.
 */
export interface AttributeInfoResponse {
  chartType: string;
  component: string;
  metric: string;
  categories: string[];
  series: AttributeGradeSeries[];
  /** `encoding` exactly as the API sent it (versions undecoded), for the summarize payload. */
  encoding: AttributeInfoEncoding;
  /** `dataset` rows exactly as the API sent them, for the summarize payload. */
  dataset: unknown[];
}

/** The chart's `encoding` block as the API sends it; forwarded untouched to `/v1/summarize`. */
export interface AttributeInfoEncoding {
  x: string;
  y: string;
  versions: string[];
  [extra: string]: unknown;
}

/** Slice key for one variant's chart of one attribute. */
export function attributeInfoCacheKey(variantId: string, attribute: string): string {
  return `${variantId}:${attribute}`;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function parseVersions(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const versions: string[] = [];
  for (const item of value) {
    if (!isNonEmptyString(item)) return null;
    versions.push(item.trim());
  }
  return versions;
}

function parsePoint(value: unknown): number | null | undefined {
  if (value === null || value === undefined) return null;
  if (isFiniteNumber(value)) return value;
  return undefined;
}

export function parseAttributeInfoResponse(value: unknown): AttributeInfoResponse | null {
  if (!isRecord(value)) return null;
  const chartType = isNonEmptyString(value.chartType) ? value.chartType.trim() : null;
  const component = isNonEmptyString(value.component) ? value.component.trim() : null;
  const metric = isNonEmptyString(value.metric) ? value.metric.trim() : null;
  const encoding = isRecord(value.encoding) ? value.encoding : null;
  const versions = encoding ? parseVersions(encoding.versions) : null;
  if (
    chartType === null ||
    component === null ||
    metric === null ||
    encoding === null ||
    versions === null
  ) {
    return null;
  }
  if (!Array.isArray(value.dataset)) return null;

  const categories: string[] = [];
  const columns = versions.map(() => [] as (number | null)[]);

  for (const row of value.dataset) {
    if (!isRecord(row) || !isNonEmptyString(row.cluster)) return null;
    categories.push(decodeIaString(row.cluster.trim()));
    for (let index = 0; index < versions.length; index += 1) {
      const point = parsePoint(row[versions[index]]);
      if (point === undefined) return null;
      columns[index].push(point);
    }
  }

  return {
    chartType,
    component,
    metric,
    categories,
    series: versions.map((version, index) => ({
      name: decodeIaString(version),
      data: columns[index],
    })),
    encoding: {
      ...encoding,
      x: isNonEmptyString(encoding.x) ? encoding.x : 'cluster',
      y: isNonEmptyString(encoding.y) ? encoding.y : 'metric',
      versions,
    },
    dataset: value.dataset,
  };
}

/** Stacked attribute-grade columns for one attribute of the selected variant. */
export async function getAttributeInfo(
  clusterPlanCode: string,
  variantId: string,
  attribute: string,
): Promise<AttributeInfoResponse> {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  if (!isNonEmptyString(variantId)) throw new Error('variantId is required');
  if (!isNonEmptyString(attribute)) throw new Error('attribute is required');
  const payload = await apiClient.post<unknown>(ATTRIBUTE_INFO_ENDPOINT, {
    variantId,
    clusterPlanCode: code,
    attribute: attribute.trim(),
  });
  const data = parseAttributeInfoResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected attribute info response');
  return data;
}
