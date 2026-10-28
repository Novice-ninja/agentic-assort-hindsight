import { env, isDev } from '@config/env';
import { apiClient } from '@shared/services';
import { parseInsightBullets } from '../services/insightBullets';
import type { InsightBullet, SummarizeRequest, SummarizeResponse } from '../types';
import { withDeadline } from './withDeadline';

/** Agent service endpoint that narrates a card's own numbers. */
export const SUMMARIZE_ENDPOINT = `${env.agentApiBaseUrl}/v1/summarize`;

/**
 * Generation runs in seconds, so the ceiling is generous — but it exists, because a hanging
 * call would otherwise leave a tooltip spinning for as long as the planner looks at it.
 */
const TIMEOUT_MS = 20_000;

/** What a generation was about, for the development log. */
function subjectOf(payload: SummarizeRequest): string {
  if (payload.cardType === 'segment') return payload.dimension;
  if (payload.cardType === 'kpi') return 'kpi_strip';
  return `${payload.chartType} ${payload.metric}`;
}

/**
 * Asks the agent to summarise one card.
 *
 * Returns display-ready bullets rather than the raw payload: the metadata the service sends back
 * is for correlation, not for planners, and parsing it here keeps that decision out of the UI.
 */
export async function getCardInsight(
  payload: SummarizeRequest,
  signal?: AbortSignal,
): Promise<InsightBullet[]> {
  const deadline = withDeadline(signal, TIMEOUT_MS);

  try {
    const response = await apiClient.post<SummarizeResponse>(SUMMARIZE_ENDPOINT, payload, {
      signal: deadline.signal,
    });

    if (isDev) {
      console.debug(
        `[hindsight] insight ${response.requestId} for ${subjectOf(payload)} (${response.promptKey})`,
      );
    }

    return parseInsightBullets(response.response ?? []);
  } finally {
    deadline.release();
  }
}
