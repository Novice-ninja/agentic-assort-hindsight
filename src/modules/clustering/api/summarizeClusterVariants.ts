import { env, isDev } from '@config/env';
import { apiClient } from '@shared/services';
import {
  parseClusterVariantSummary,
  type ClusterVariantSummarizePayload,
  type ClusterVariantSummary,
} from '../services/clusterVariantSummary';

/** Agent service endpoint shared with Hindsight; `cardType: 'cluster'` selects this prompt. */
export const SUMMARIZE_CLUSTER_ENDPOINT = `${env.agentApiBaseUrl}/v1/summarize`;

/** Generation runs in seconds; the ceiling keeps a hung call from spinning the strips forever. */
const TIMEOUT_MS = 30_000;

/** Metadata the agent service returns around the sentences. Logged in dev, never displayed. */
interface SummarizeEnvelope {
  requestId?: string;
  promptKey?: string;
  promptVersion?: number;
  response?: unknown;
  cards?: unknown;
  model?: string;
  latencyMs?: number;
}

/**
 * Asks the agent to narrate the "3 Best — With Evidence" section: `response` is the section
 * paragraph, `cards` one entry per variant. Returns display-ready text.
 */
export async function summarizeClusterVariants(
  payload: ClusterVariantSummarizePayload,
  signal?: AbortSignal,
): Promise<ClusterVariantSummary> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  const forward = () => controller.abort();
  signal?.addEventListener('abort', forward);
  try {
    const envelope = await apiClient.post<SummarizeEnvelope | unknown>(
      SUMMARIZE_CLUSTER_ENDPOINT,
      payload,
      { signal: controller.signal },
    );
    if (isDev && typeof envelope === 'object' && envelope !== null) {
      const meta = envelope as SummarizeEnvelope;
      console.debug(
        `[clustering] variant summary ${meta.requestId ?? '?'} for ${payload.clusterPlanCode} (${meta.promptKey ?? '?'})`,
      );
    }
    return parseClusterVariantSummary(envelope);
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', forward);
  }
}
