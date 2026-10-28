import type { AttributeInfoEncoding, AttributeInfoResponse } from '../api/getAttributeInfo';
import { parseSummarySentence } from './summarySentence';

/**
 * `POST /v1/summarize` body for the Finalize "Attribute Grades" chart. Everything after
 * `cardType` is the `POST …/attributes/info` response for the attribute picked from
 * `POST …/attributes/product-list`, forwarded as the API sent it.
 */
export interface AttributeGradesSummarizePayload {
  cardType: 'cluster_attribute';
  chartType: string;
  component: string;
  /** The product-list option `value` that was plotted, e.g. `articleBrandName`. */
  metric: string;
  encoding: AttributeInfoEncoding;
  dataset: unknown[];
}

/**
 * Builds the summarize body from the stored attribute-info chart. Null when there is no chart
 * or no rows to narrate.
 */
export function buildAttributeGradesSummarizePayload(
  info: AttributeInfoResponse | null | undefined,
): AttributeGradesSummarizePayload | null {
  if (!info || info.dataset.length === 0) return null;
  return {
    cardType: 'cluster_attribute',
    chartType: info.chartType,
    component: info.component,
    metric: info.metric,
    encoding: info.encoding,
    dataset: info.dataset,
  };
}

/** The chart has one strip, so the response collapses to one sentence. */
export function parseAttributeGradesSummary(raw: unknown): string | null {
  return parseSummarySentence(raw);
}
