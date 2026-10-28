import { SUMMARIZE_ENDPOINT } from '@modules/hindsight/api/getCardInsight';
import { withDeadline } from '@modules/hindsight/api/withDeadline';
import { parseInsightBullets } from '@modules/hindsight/services/insightBullets';
import { apiClient } from '@shared/services';
import type { ClusterScatterSummarizeRequest } from '../services/clusterScatterSummary';

interface SummarizeReply {
  response?: string[];
}

/**
 * Same agent summarize endpoint the Hindsight charts use, with the cluster scatter body.
 */
export async function getClusterScatterInsight(
  payload: ClusterScatterSummarizeRequest,
  signal?: AbortSignal,
): Promise<string> {
  const deadline = withDeadline(signal, 20_000);
  try {
    const response = await apiClient.post<SummarizeReply>(SUMMARIZE_ENDPOINT, payload, {
      signal: deadline.signal,
    });
    return parseInsightBullets(response.response ?? [])
      .map((bullet) => bullet.text)
      .join(' ');
  } finally {
    deadline.release();
  }
}
