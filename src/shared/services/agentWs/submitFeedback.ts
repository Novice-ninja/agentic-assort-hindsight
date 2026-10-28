import { env } from '@config/env';
import { apiClient } from '@shared/services/apiClient';
import type { AgentResult, AgentUsage } from './types';

export const IRIS_FEEDBACK_RATINGS = ['like', 'dislike', 'cleared'] as const;
export type IrisFeedbackRating = (typeof IRIS_FEEDBACK_RATINGS)[number];

export type IrisFeedbackChoice = 'like' | 'dislike';

/** Flip to `true` once `/feedback` is live and a failed POST should undo the icon. */
export const ROLLBACK_IRIS_FEEDBACK_ON_FAILURE = false;

export const IRIS_FEEDBACK_EXCERPT_MAX = 2000;

export interface IrisFeedbackSource {
  messageId: string;
  requestId: string;
  sessionId: string;
  conversationId: string;
  planCode: string;
  query: string;
  responseExcerpt: string;
  responseContentTypes: string[];
  usage?: AgentUsage;
  agents?: string[];
}

/**
 * Body for `POST /feedback` on the agent service. Snake_case matches the rest of
 * the assort-agent contract. Easy to reshape in this one builder when the live
 * schema lands.
 */
export interface IrisFeedbackPayload {
  rating: IrisFeedbackRating;
  message_id: string;
  request_id: string;
  session_id: string;
  conversation_id: string;
  plan_code: string;
  query: string;
  response_excerpt: string;
  response_content_types: string[];
  created_at: string;
  usage?: AgentUsage;
  agents?: string[];
}

const sourceByMessageId = new Map<string, IrisFeedbackSource>();

export function irisFeedbackEndpoint(): string {
  return `${env.agentApiBaseUrl.replace(/\/$/, '')}/feedback`;
}

export function nextIrisFeedbackRating(
  current: IrisFeedbackChoice | undefined,
  clicked: IrisFeedbackChoice,
): IrisFeedbackRating {
  return current === clicked ? 'cleared' : clicked;
}

export function extraStatusToChoice(
  status: string | undefined,
): IrisFeedbackChoice | undefined {
  if (status === 'liked') return 'like';
  if (status === 'disliked') return 'dislike';
  return undefined;
}

export function choiceToExtraStatus(
  rating: IrisFeedbackRating,
): 'liked' | 'disliked' | undefined {
  if (rating === 'like') return 'liked';
  if (rating === 'dislike') return 'disliked';
  return undefined;
}

function stripMarkup(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function summarizeAgentResult(result: readonly AgentResult[]): {
  excerpt: string;
  contentTypes: string[];
} {
  const texts: string[] = [];
  const contentTypes: string[] = [];
  const seen = new Set<string>();

  for (const block of result) {
    const type =
      block.content_type === 'chart' ? `chart:${block.data.kind}` : block.content_type;
    if (!seen.has(type)) {
      seen.add(type);
      contentTypes.push(type);
    }
    if (block.content_type === 'text') {
      const plain = stripMarkup(block.data);
      if (plain.length > 0) texts.push(plain);
    }
    if (block.content_type === 'file' && block.data.filename.length > 0) {
      texts.push(block.data.filename);
    }
  }

  const joined = texts.join('\n');
  const excerpt =
    joined.length <= IRIS_FEEDBACK_EXCERPT_MAX
      ? joined
      : `${joined.slice(0, IRIS_FEEDBACK_EXCERPT_MAX)}…`;

  return { excerpt, contentTypes };
}

export function buildIrisFeedbackPayload(
  source: IrisFeedbackSource,
  rating: IrisFeedbackRating,
  createdAt: Date = new Date(),
): IrisFeedbackPayload {
  return {
    rating,
    message_id: source.messageId,
    request_id: source.requestId,
    session_id: source.sessionId,
    conversation_id: source.conversationId,
    plan_code: source.planCode,
    query: source.query,
    response_excerpt: source.responseExcerpt,
    response_content_types: source.responseContentTypes,
    created_at: createdAt.toISOString(),
    ...(source.usage !== undefined ? { usage: source.usage } : {}),
    ...(source.agents !== undefined && source.agents.length > 0
      ? { agents: source.agents }
      : {}),
  };
}

export function writeIrisFeedbackSource(source: IrisFeedbackSource): void {
  sourceByMessageId.set(source.messageId, source);
}

export function readIrisFeedbackSource(messageId: string): IrisFeedbackSource | undefined {
  return sourceByMessageId.get(messageId);
}

/**
 * Decides whether a thumbs click should POST, and what the next rating is.
 * Pure so the host can stay a thin adapter around conversation state.
 */
export function resolveIrisFeedbackAction(input: {
  messageId: string;
  extraStatus: string | undefined;
  clicked: IrisFeedbackChoice;
  isInFlight: boolean;
  source: IrisFeedbackSource | undefined;
  fallback: IrisFeedbackSource;
}):
  | { kind: 'ignored' }
  | {
      kind: 'apply';
      rating: IrisFeedbackRating;
      extraStatus: 'liked' | 'disliked' | undefined;
      payload: IrisFeedbackPayload;
    } {
  if (input.messageId.length === 0 || input.isInFlight) {
    return { kind: 'ignored' };
  }
  const rating = nextIrisFeedbackRating(
    extraStatusToChoice(input.extraStatus),
    input.clicked,
  );
  const source = input.source ?? { ...input.fallback, messageId: input.messageId };
  return {
    kind: 'apply',
    rating,
    extraStatus: choiceToExtraStatus(rating),
    payload: buildIrisFeedbackPayload(source, rating),
  };
}

export function submitIrisFeedback(
  payload: IrisFeedbackPayload,
  signal?: AbortSignal,
): Promise<void> {
  return apiClient.post(irisFeedbackEndpoint(), payload, { signal }).then(() => undefined);
}

/** Test helper. */
export function resetIrisFeedbackSources(): void {
  sourceByMessageId.clear();
}
