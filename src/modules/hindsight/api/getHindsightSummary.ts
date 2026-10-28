import { env, isDev } from '@config/env';
import { apiClient } from '@shared/services';
import { convertHindsightSummaryToInsightFeed } from '../services/hindsightSummaryToInsightFeed';
import type {
  GetHindsightSummaryParams,
  HindsightSummaryRequest,
  HindsightSummaryResponse,
} from '../types/hindsightSummary';
import type { SeasonNarrativeInsight, SeasonNarrativeSummaryData } from '../types/seasonNarrative';
import { withDeadline } from './withDeadline';
import type { HierarchyScopeEntry } from '@modules/planning/types';
import { getFlooringScope } from '../priority/flooringScope';

/**
 * Agent endpoint — plan_code is a path param.
 * Clean path (no double slash): `/v1/plans/{plan_code}/hindsight-summary`.
 */
export function hindsightSummaryEndpoint(planCode: string): string {
  const base = env.agentApiBaseUrl.replace(/\/$/, '');
  return `${base}/v1/plans/${encodeURIComponent(planCode)}/hindsight-summary`;
}

/**
 * Uncached generation can take ~8s+ (query_ms + llm_ms). Ceiling is well above that
 * so a normal miss is not aborted; still bounded so a hung agent cannot spin forever.
 */
const TIMEOUT_MS = 45_000;

/** Client-side cache keyed by plan and captured applied hierarchy for non-refresh loads. */
const insightCache = new Map<string, SeasonNarrativeInsight[]>();

/** Test helper — clears the module cache between cases. */
export function clearHindsightSummaryCache(): void {
  insightCache.clear();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Narrows the agent payload. Unknown / partial shapes degrade to empty summary
 * rather than throwing — the UI already handles an empty insight list.
 */
export function parseHindsightSummaryResponse(
  raw: unknown,
): HindsightSummaryResponse {
  if (!isRecord(raw)) {
    throw new Error('Hindsight summary response is not an object');
  }

  const summary = isRecord(raw.summary) ? (raw.summary as HindsightSummaryResponse['summary']) : {};

  return {
    request_id: typeof raw.request_id === 'string' ? raw.request_id : '',
    plan_code: typeof raw.plan_code === 'string' ? raw.plan_code : '',
    rules_version: typeof raw.rules_version === 'string' ? raw.rules_version : '',
    ly_season_code: typeof raw.ly_season_code === 'number' ? raw.ly_season_code : 0,
    lly_season_code: typeof raw.lly_season_code === 'number' ? raw.lly_season_code : 0,
    summary,
    generated_at: typeof raw.generated_at === 'string' ? raw.generated_at : '',
    cached: typeof raw.cached === 'boolean' ? raw.cached : false,
    model: typeof raw.model === 'string' ? raw.model : '',
    query_ms: typeof raw.query_ms === 'number' ? raw.query_ms : 0,
    llm_ms: typeof raw.llm_ms === 'number' ? raw.llm_ms : 0,
    input_tokens: typeof raw.input_tokens === 'number' ? raw.input_tokens : 0,
    output_tokens: typeof raw.output_tokens === 'number' ? raw.output_tokens : 0,
    cost_usd: typeof raw.cost_usd === 'number' ? raw.cost_usd : 0,
  };
}

/**
 * Fetches the plan hindsight summary from the agent service, maps `summary`
 * sections onto the Season Narrative insight feed (bodies pass through as
 * pre-tagged HTML), and caches per `planCode` when not refreshing.
 */
export async function getHindsightSummary(
  params: GetHindsightSummaryParams & {hierarchyScope?:readonly HierarchyScopeEntry[]},
): Promise<SeasonNarrativeSummaryData> {
  const { planCode, refresh = false, signal } = params;
  const trimmed = planCode.trim();
  if (!trimmed) {
    return { insights: [] };
  }
  const hierarchyScope=params.hierarchyScope??getFlooringScope(trimmed);
  const cacheKey=JSON.stringify([trimmed,hierarchyScope]);

  if (!refresh) {
    const cached = insightCache.get(cacheKey);
    if (cached !== undefined) {
      return { insights: cached };
    }
  }

  const body: HindsightSummaryRequest & {planCode:string;hierarchyScope:readonly HierarchyScopeEntry[]} = { refresh,planCode:trimmed,hierarchyScope };
  const deadline = withDeadline(signal, TIMEOUT_MS);

  try {
    const raw = await apiClient.post<unknown>(hindsightSummaryEndpoint(trimmed), body, {
      signal: deadline.signal,
    });
    const response = parseHindsightSummaryResponse(raw);

    if (isDev && response.request_id) {
      // eslint-disable-next-line no-console
      console.debug(
        `[hindsight] summary ${response.request_id} for plan ${response.plan_code}` +
          ` (cached=${response.cached}, query_ms=${response.query_ms}, llm_ms=${response.llm_ms})`,
      );
    }

    const insights = convertHindsightSummaryToInsightFeed(response.summary);
    insightCache.set(cacheKey, insights);
    return { insights };
  } finally {
    deadline.release();
  }
}
