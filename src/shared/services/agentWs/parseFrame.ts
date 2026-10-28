import { readActionsFromDone } from './parseActions';
import { readFollowUpQuestionsFromDone } from './parseFollowUps';
import { parseAgentResultList } from './parseResult';
import type {
  AgentInboundFrame,
  AgentPlanStatusMeta,
  AgentPlanStep,
  AgentQueryRecord,
  AgentUsage,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/**
 * `meta: { status, substatus, clusterPlanCode?, selectedGeneratedClusterVariantId? }` —
 * the cluster-plan pipeline position. `status` and `substatus` must be non-empty
 * strings; anything else is treated as "no status on this frame". Plan / variant
 * ids are optional and only present after the agent has created / selected them.
 */
export function readPlanStatusMeta(data: Record<string, unknown>): AgentPlanStatusMeta | null {
  const meta = data.meta;
  if (!isRecord(meta)) return null;
  const status = typeof meta.status === 'string' ? meta.status.trim() : '';
  const substatus = typeof meta.substatus === 'string' ? meta.substatus.trim() : '';
  if (!status || !substatus) return null;
  const clusterPlanCode =
    typeof meta.clusterPlanCode === 'string' ? meta.clusterPlanCode.trim() : '';
  const selectedGeneratedClusterVariantId =
    typeof meta.selectedGeneratedClusterVariantId === 'string'
      ? meta.selectedGeneratedClusterVariantId.trim()
      : '';
  return {
    status,
    substatus,
    ...(clusterPlanCode ? { clusterPlanCode } : {}),
    ...(selectedGeneratedClusterVariantId ? { selectedGeneratedClusterVariantId } : {}),
  };
}

function withMeta<T extends object>(frame: T, data: Record<string, unknown>): T {
  const meta = readPlanStatusMeta(data);
  return meta ? { ...frame, meta } : frame;
}

/**
 * Parses one inbound WS payload. Returns `null` for non-JSON or unknown `type`
 * (never throws — a bad frame must not tear down the socket).
 */
export function parseAgentInboundFrame(raw: unknown): AgentInboundFrame | null {
  let data: unknown = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  if (!isRecord(data) || typeof data.type !== 'string') return null;

  const frame = parseByType(data);
  return frame ? withMeta(frame, data) : null;
}

function parseByType(data: Record<string, unknown>): AgentInboundFrame | null {
  switch (data.type) {
    case 'ready':
      return {
        type: 'ready',
        session_id: asString(data.session_id),
        user_id: asString(data.user_id),
        auth_required: asBoolean(data.auth_required),
        plan_code: asString(data.plan_code),
        plan_ready: asBoolean(data.plan_ready, true),
        plan_error: typeof data.plan_error === 'string' ? data.plan_error : null,
        plan_scope: asString(data.plan_scope),
        trace_enabled: asBoolean(data.trace_enabled),
      };
    case 'accepted':
      return {
        type: 'accepted',
        request_id: asString(data.request_id),
        user_id: asString(data.user_id),
        session_id: asString(data.session_id),
        plan_code: asString(data.plan_code),
      };
    case 'trace':
      return {
        type: 'trace',
        request_id: asString(data.request_id),
        step: asString(data.step),
        attempt: asNumber(data.attempt, 1),
        passed: asBoolean(data.passed, true),
        feedback: asString(data.feedback),
        duration_ms: asNumber(data.duration_ms),
        usage: isRecord(data.usage) ? (data.usage as AgentUsage) : undefined,
      };
    case 'done': {
      const followUpQuestions = readFollowUpQuestionsFromDone(data);
      const actions = readActionsFromDone(data);
      return {
        type: 'done',
        user_id: asString(data.user_id),
        session_id: asString(data.session_id),
        request_id: asString(data.request_id),
        plan: Array.isArray(data.plan) ? (data.plan as AgentPlanStep[]) : [],
        agents: Array.isArray(data.agents)
          ? data.agents.filter((a): a is string => typeof a === 'string')
          : [],
        result: parseAgentResultList(data.result),
        passed: asBoolean(data.passed, true),
        attempts: asNumber(data.attempts, 1),
        feedback: asString(data.feedback),
        plan_code: asString(data.plan_code),
        plan_scope: asString(data.plan_scope),
        usage: isRecord(data.usage) ? (data.usage as AgentUsage) : undefined,
        queries: Array.isArray(data.queries)
          ? (data.queries as AgentQueryRecord[])
          : undefined,
        ...(followUpQuestions.length > 0
          ? { follow_up_questions: followUpQuestions }
          : {}),
        ...(actions.length > 0 ? { actions } : {}),
      };
    }
    default:
      return null;
  }
}
