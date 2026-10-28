import type { AgentWsClient, AgentWsFrameHandler, AgentWsStateHandler } from '@shared/services/agentWs/createAgentWsClient';
import { parseAgentInboundFrame } from '@shared/services/agentWs/parseFrame';
import type { AgentWsConnectionState } from '@shared/services/agentWs/types';

const DEMO_NARRATIVE = [
  'Solid Hardwood and Water Resistant Engineered together carry over half of season sales.',
  'Cluster A and B stores sell through well above the chain average, while Cluster F lags.',
  'Recommendation: re-weight the buy toward the leading product types and redistribute stock from E and F to A and B.',
].join('\n\n');

/**
 * Uses the same UI-facing transport contract without opening a network socket.
 * Default behavior mirrors the current deployed connection-error state. The sample
 * response is available only through the development/build option, never a UI control.
 */
export function createLocalAgentWsClient(
  options: { mode?: 'connection-error' | 'sample' } = {},
): AgentWsClient {
  const mode = options.mode ?? 'connection-error';
  let planCode: string | undefined;
  let state: AgentWsConnectionState = 'idle';
  let inFlight = false;
  let requestSequence = 0;
  let pending: string[] = [];
  const frames = new Set<AgentWsFrameHandler>();
  const states = new Set<AgentWsStateHandler>();
  const timers = new Set<ReturnType<typeof setTimeout>>();

  const setState = (next: AgentWsConnectionState) => {
    state = next;
    states.forEach((handler) => handler(next));
  };
  const emit = (payload: Record<string, unknown>) => {
    const frame = parseAgentInboundFrame(payload);
    if (frame) frames.forEach((handler) => handler(frame));
  };
  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
    timers.add(timer);
  };
  const release = () => {
    timers.forEach(clearTimeout);
    timers.clear();
    inFlight = false;
    pending = [];
  };
  const pump = () => {
    if (inFlight || state !== 'ready' || pending.length === 0) return;
    pending.shift();
    inFlight = true;
    const requestId = `local-demo-${++requestSequence}`;
    emit({ type: 'accepted', request_id: requestId, session_id: 'local-demo', plan_code: planCode ?? '' });
    schedule(() => {
      if (mode === 'connection-error') {
        inFlight = false;
        // The unchanged shared provider renders its localized connection error and
        // clears the pending UI state. Keep planCode so another send can reconnect.
        setState('error');
        return;
      }
      emit({
        type: 'done',
        request_id: requestId,
        session_id: 'local-demo',
        plan_code: planCode ?? '',
        passed: true,
        result: [{ content_type: 'text', data: `**Local preview · sample response**\n\n${DEMO_NARRATIVE}\n\nThis response uses the bundled preview narrative. A live Iris service is not connected.` }],
        follow_up_questions: [],
      });
      inFlight = false;
      pump();
    }, 450);
  };
  const connect = () => {
    if (state === 'ready' || state === 'connecting') return;
    setState('connecting');
    schedule(() => {
      emit({ type: 'ready', session_id: 'local-demo', user_id: 'local-preview', auth_required: false, plan_code: planCode ?? '', plan_ready: true });
      setState('ready');
      pump();
    }, 60);
  };

  return {
    setPlanCode(next) {
      const normalized = next?.trim() || undefined;
      if (normalized === planCode) return;
      release();
      planCode = normalized;
      setState('idle');
      if (planCode) connect();
    },
    connect,
    connectWithoutPlan() {
      if (planCode) { release(); planCode = undefined; setState('idle'); }
      connect();
    },
    disconnect() { release(); planCode = undefined; setState('idle'); },
    releaseSocket() { release(); setState('closed'); },
    sendQuery(query) {
      if (!query.trim()) return;
      pending.push(query.trim());
      connect();
      pump();
    },
    isInFlight: () => inFlight,
    getState: () => state,
    getPlanCode: () => planCode,
    subscribeFrames(handler) { frames.add(handler); return () => { frames.delete(handler); }; },
    subscribeState(handler) { states.add(handler); handler(state); return () => { states.delete(handler); }; },
  };
}
