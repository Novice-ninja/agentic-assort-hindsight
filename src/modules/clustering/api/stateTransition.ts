import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `PUT /v1/clustering/plans/state-transition/{clusterPlanCode}`. */
export const STATE_TRANSITION_ENDPOINT = `${env.goApiBaseUrl}/v1/clustering/plans/state-transition`;

/** Backend wire values for the Gate 2 decision (note: `reject`, not `rejected`). */
export type Gate2Decision = 'approved' | 'reject';

/** Finalize → "Final Sign Off". */
export interface FinalSignOffTransitionRequest {
  section: 'final_signoff';
}

/** Sign-Off → Gate 2 Approve / Reject. */
export interface Gate2ApprovalTransitionRequest {
  section: 'gate_2_approval';
  decision: Gate2Decision;
}

export type StateTransitionRequest =
  | FinalSignOffTransitionRequest
  | Gate2ApprovalTransitionRequest;

export interface StateTransitionResponse {
  clusterPlanCode: string;
  section: string;
  status: string;
  substatus: string;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

function endpointFor(clusterPlanCode: string): string {
  const code = clusterPlanCode.trim();
  if (!code) throw new Error('clusterPlanCode is required');
  return `${STATE_TRANSITION_ENDPOINT}/${encodeURIComponent(code)}`;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

function parseStateTransitionResponse(value: unknown): StateTransitionResponse | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (!isNonEmptyString(raw.clusterPlanCode)) return null;
  return {
    clusterPlanCode: raw.clusterPlanCode,
    section: typeof raw.section === 'string' ? raw.section : '',
    status: typeof raw.status === 'string' ? raw.status : '',
    substatus: typeof raw.substatus === 'string' ? raw.substatus : '',
  };
}

/** Moves the plan through a wizard section (final sign-off, Gate 2 approve / reject). */
export async function putStateTransition(
  clusterPlanCode: string,
  body: StateTransitionRequest,
): Promise<StateTransitionResponse> {
  const payload = await apiClient.put<unknown>(endpointFor(clusterPlanCode), body);
  const data = parseStateTransitionResponse(unwrapData(payload));
  if (!data) throw new Error('Unexpected state transition response');
  return data;
}
