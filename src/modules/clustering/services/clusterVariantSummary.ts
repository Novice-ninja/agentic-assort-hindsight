import type { ClusterRunResponse } from '../api/runClusterPlan';
import type { ClusterPlan, ClusterPlanStatus, ClusterResultCandidate } from '../types';

/** `POST /v1/summarize` body for the Finalize "3 Best — With Evidence" section. */
export interface ClusterVariantSummarizePayload {
  cardType: 'cluster';
  clusterPlanCode: string;
  /** Raw backend status, e.g. `USER_INPUT_NEEDED`. */
  status: string;
  /** Raw backend substatus, e.g. `SELECT_FINAL_CLUSTER_VARIANT_PENDING`. */
  substatus: string;
  /** The `variants` list exactly as `GET …/plans/{code}/cluster-variants` returned it. */
  variants: unknown[];
}

/** One card's narration from `cards[]`: the variant it describes and its sentences joined. */
export interface ClusterVariantInsight {
  variantId: string | null;
  /** The variant `name` the service echoed back; the fallback match when ids differ. */
  label: string | null;
  text: string;
}

/** Display-ready summary: one paragraph for the section plus one per variant card. */
export interface ClusterVariantSummary {
  overall: string | null;
  variants: ClusterVariantInsight[];
}

const STATUS_TO_API: Record<ClusterPlanStatus, string> = {
  draft: 'DRAFT',
  inputNeeded: 'USER_INPUT_NEEDED',
  awaitingApproval: 'AWAITING_APPROVAL',
  approved: 'APPROVED',
};

/** The section only renders while the final variant is still to be chosen. */
const FINALIZE_SUBSTATUS = 'SELECT_FINAL_CLUSTER_VARIANT_PENDING';

function nonEmpty(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Builds the summarize body from the cluster-variants GET: its `variants` list is forwarded
 * verbatim. Status/substatus come from that response when it carries them, otherwise from the
 * plan in the wizard. Null when there is nothing to summarise.
 */
export function buildClusterVariantSummarizePayload(input: {
  clusterPlanCode: string;
  run: ClusterRunResponse | null | undefined;
  plan: Pick<ClusterPlan, 'status' | 'substatus'> | null | undefined;
}): ClusterVariantSummarizePayload | null {
  const code = input.clusterPlanCode.trim();
  const variants: unknown[] = input.run?.rawVariants ?? input.run?.variants ?? [];
  if (!code || variants.length === 0) return null;
  return {
    cardType: 'cluster',
    clusterPlanCode: code,
    status:
      nonEmpty(input.run?.status) ??
      (input.plan ? STATUS_TO_API[input.plan.status] : STATUS_TO_API.inputNeeded),
    substatus:
      nonEmpty(input.run?.substatus) ?? nonEmpty(input.plan?.substatus) ?? FINALIZE_SUBSTATUS,
    variants,
  };
}

// ---------------------------------------------------------------------------------------------
// Response parsing
// ---------------------------------------------------------------------------------------------

/**
 * `/v1/summarize` envelope for `cardType: 'cluster'` (prompt `finalize_cluster_variant`):
 * `response` holds the section-level sentences, `cards` one entry per variant.
 */
interface ClusterSummarizeEnvelope {
  response?: unknown;
  cards?: unknown;
}

interface ClusterSummarizeCard {
  variantId?: unknown;
  name?: unknown;
  response?: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Joins a sentence list into one paragraph. A bare string is accepted too so a prompt that
 * returns prose instead of a list still renders.
 */
function paragraphOf(value: unknown): string | null {
  if (typeof value === 'string') return nonEmpty(value);
  if (!Array.isArray(value)) return null;
  const parts = value
    .map((item) => (typeof item === 'string' ? nonEmpty(item) : null))
    .filter((item): item is string => item !== null);
  return parts.length > 0 ? parts.join(' ') : null;
}

function cardOf(value: unknown): ClusterVariantInsight | null {
  if (!isRecord(value)) return null;
  const card = value as ClusterSummarizeCard;
  const text = paragraphOf(card.response);
  if (text === null) return null;
  const variantId = nonEmpty(card.variantId);
  const label = nonEmpty(card.name);
  if (variantId === null && label === null) return null;
  return { variantId, label, text };
}

/**
 * Reads the summarize response for the "3 Best" section: the top-level `response` list becomes
 * the section paragraph, each `cards[]` entry becomes that variant's card sentence. Either half
 * may be missing; the strips for whatever did arrive still render.
 */
export function parseClusterVariantSummary(raw: unknown): ClusterVariantSummary {
  if (!isRecord(raw)) return { overall: null, variants: [] };
  const envelope = raw as ClusterSummarizeEnvelope;
  const variants = Array.isArray(envelope.cards)
    ? envelope.cards.map(cardOf).filter((card): card is ClusterVariantInsight => card !== null)
    : [];
  return { overall: paragraphOf(envelope.response), variants };
}

/** The per-card sentence: by backend variant id first, then by the name the service echoed. */
export function insightForCandidate(
  summary: ClusterVariantSummary | null | undefined,
  candidate: Pick<ClusterResultCandidate, 'variantId' | 'name'>,
): string | null {
  if (!summary) return null;
  const byId = summary.variants.find((item) => item.variantId === candidate.variantId);
  if (byId) return byId.text;
  const name = candidate.name.trim().toLowerCase();
  if (!name) return null;
  const byLabel = summary.variants.find((item) => item.label?.trim().toLowerCase() === name);
  return byLabel?.text ?? null;
}
