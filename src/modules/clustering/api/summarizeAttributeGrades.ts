import { isDev } from '@config/env';
import { apiClient } from '@shared/services';
import {
  parseAttributeGradesSummary,
  type AttributeGradesSummarizePayload,
} from '../services/attributeGradesSummary';
import { SUMMARIZE_CLUSTER_ENDPOINT } from './summarizeClusterVariants';

const TIMEOUT_MS = 30_000;

interface SummarizeEnvelope {
  requestId?: string;
  promptKey?: string;
}

/**
 * Asks the agent to narrate the Finalize "Attribute Grades" chart (`cardType: 'cluster_attribute'`).
 * Resolves to the display sentence; the parser owns the shape guesses.
 */
export async function summarizeAttributeGrades(
  payload: AttributeGradesSummarizePayload,
  signal?: AbortSignal,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  const forward = () => controller.abort();
  signal?.addEventListener('abort', forward);
  try {
    const envelope = await apiClient.post<unknown>(SUMMARIZE_CLUSTER_ENDPOINT, payload, {
      signal: controller.signal,
    });
    if (isDev && typeof envelope === 'object' && envelope !== null) {
      const meta = envelope as SummarizeEnvelope;
      console.debug(
        `[clustering] attribute grades summary ${meta.requestId ?? '?'} (${meta.promptKey ?? '?'})`,
      );
    }
    return parseAttributeGradesSummary(envelope);
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', forward);
  }
}
