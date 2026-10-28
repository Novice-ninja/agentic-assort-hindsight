import { buildAgentWsUrl } from './buildAgentWsUrl';
import {
  logAgentWsEvent,
  logAgentWsRequest,
  logAgentWsResponse,
  logAgentWsWarn,
  redactWsUrl,
} from './log';
import { parseAgentInboundFrame } from './parseFrame';
import type {
  AgentInboundFrame,
  AgentOutboundQuery,
  AgentWsConnectionState,
} from './types';

export type AgentWsFrameHandler = (frame: AgentInboundFrame) => void;
export type AgentWsStateHandler = (state: AgentWsConnectionState) => void;

export interface AgentWsClient {
  /** Update plan scope. Reconnects when the code changes; does not clear UI messages. */
  setPlanCode: (planCode: string | undefined) => void;
  /** Ensure a socket exists for the current plan (lazy). */
  connect: () => void;
  /**
   * Open the socket with no `plan_code`. Used by Describe Your Plan, which has
   * no plan yet. Drops any plan left over from another screen.
   */
  connectWithoutPlan: () => void;
  disconnect: () => void;
  /**
   * Close the socket without clearing `plan_code` — used on React StrictMode remount
   * so a later `connect()` / `sendQuery` can reopen without losing plan scope.
   */
  releaseSocket: () => void;
  /**
   * Enqueue an outbound query. Sends when the socket is `ready` and no request is in flight.
   * Mid-stream callers queue behind the active request.
   */
  sendQuery: (query: string) => void;
  /** True while waiting for `done` (or socket loss) for the active query. */
  isInFlight: () => boolean;
  getState: () => AgentWsConnectionState;
  getPlanCode: () => string | undefined;
  subscribeFrames: (handler: AgentWsFrameHandler) => () => void;
  subscribeState: (handler: AgentWsStateHandler) => () => void;
}

export interface CreateAgentWsClientOptions {
  agentApiBaseUrl: string;
  getAuthToken?: () => string | null;
  /** Injected for tests. Defaults to global `WebSocket`. */
  WebSocketImpl?: typeof WebSocket;
  /** Backoff delays (ms) after unexpected close. */
  reconnectDelaysMs?: readonly number[];
}

const DEFAULT_BACKOFF_MS = [1000, 2000, 5000, 10000] as const;

/**
 * StrictMode-safe agent chat transport: one socket per plan, outbound query queue,
 * reconnect with backoff. Conversation history lives in React — not here.
 */
export function createAgentWsClient(options: CreateAgentWsClientOptions): AgentWsClient {
  const WebSocketImpl = options.WebSocketImpl ?? WebSocket;
  const backoff = options.reconnectDelaysMs ?? DEFAULT_BACKOFF_MS;

  let planCode: string | undefined;
  /** Describe Your Plan: connect and reconnect without a plan_code query param. */
  let planless = false;
  let socket: WebSocket | null = null;
  let state: AgentWsConnectionState = 'idle';
  let inFlight = false;
  let outboundQueue: string[] = [];
  let reconnectAttempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;

  const frameHandlers = new Set<AgentWsFrameHandler>();
  const stateHandlers = new Set<AgentWsStateHandler>();

  function setState(next: AgentWsConnectionState): void {
    if (state === next) return;
    state = next;
    stateHandlers.forEach((h) => h(next));
  }

  function clearReconnectTimer(): void {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function teardownSocket(): void {
    clearReconnectTimer();
    if (socket) {
      intentionalClose = true;
      try {
        socket.close();
      } catch {
        /* ignore */
      }
      socket = null;
    }
    intentionalClose = false;
  }

  function pump(): void {
    if (inFlight) return;
    if (state !== 'ready' || !socket || socket.readyState !== WebSocketImpl.OPEN) return;
    const next = outboundQueue.shift();
    if (next === undefined) return;
    inFlight = true;
    const payload: AgentOutboundQuery = { type: 'query', query: next };
    logAgentWsRequest(payload);
    socket.send(JSON.stringify(payload));
  }

  function markRequestComplete(): void {
    inFlight = false;
    pump();
  }

  function canOpenSocket(): boolean {
    return planless || Boolean(planCode);
  }

  function scheduleReconnect(): void {
    if (!canOpenSocket()) {
      setState('closed');
      return;
    }
    clearReconnectTimer();
    const delay = backoff[Math.min(reconnectAttempt, backoff.length - 1)] ?? 10000;
    reconnectAttempt += 1;
    setState('reconnecting');
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      openSocket();
    }, delay);
  }

  function openSocket(): void {
    if (!canOpenSocket()) return;
    teardownSocket();
    setState(reconnectAttempt > 0 ? 'reconnecting' : 'connecting');
    const url = buildAgentWsUrl(
      options.agentApiBaseUrl,
      planless ? undefined : planCode,
      options.getAuthToken?.() ?? null,
    );
    logAgentWsEvent('connecting', { url: redactWsUrl(url), planCode });
    const next = new WebSocketImpl(url);
    socket = next;

    next.addEventListener('open', () => {
      reconnectAttempt = 0;
      logAgentWsEvent('socket open', { planCode });
      // Stay in connecting until `ready` frame — server owns session bootstrap.
    });

    next.addEventListener('message', (event: MessageEvent) => {
      const frame = parseAgentInboundFrame(event.data);
      if (!frame) {
        logAgentWsWarn('Ignoring unknown frame', event.data);
        logAgentWsResponse(event.data);
        return;
      }

      logAgentWsResponse(frame);
      frameHandlers.forEach((h) => h(frame));

      if (frame.type === 'ready') {
        setState('ready');
        pump();
      }
      if (frame.type === 'done') {
        markRequestComplete();
      }
    });

    next.addEventListener('error', () => {
      logAgentWsWarn('socket error', { planCode });
      setState('error');
    });

    next.addEventListener('close', () => {
      socket = null;
      logAgentWsEvent('socket close', { planCode, intentional: intentionalClose });
      if (intentionalClose) {
        setState('closed');
        return;
      }
      // Drop in-flight so a queued retry can run after reconnect; UI shows an error separately.
      if (inFlight) {
        inFlight = false;
      }
      scheduleReconnect();
    });
  }

  return {
    setPlanCode(next) {
      planless = false;
      const normalized = next?.trim() || undefined;
      if (normalized === planCode) {
        logAgentWsEvent('setPlanCode unchanged', { planCode });
        return;
      }
      logAgentWsEvent('setPlanCode', { from: planCode, to: normalized });
      planCode = normalized;
      outboundQueue = [];
      inFlight = false;
      teardownSocket();
      if (!planCode) {
        setState('idle');
        return;
      }
      reconnectAttempt = 0;
      openSocket();
    },

    connectWithoutPlan() {
      const hadPlan = Boolean(planCode);
      planless = true;
      if (hadPlan) {
        planCode = undefined;
        outboundQueue = [];
        inFlight = false;
        teardownSocket();
      }
      if (
        !hadPlan &&
        state === 'ready' &&
        socket &&
        socket.readyState === WebSocketImpl.OPEN
      ) {
        logAgentWsEvent('connectWithoutPlan skipped — socket already ready');
        return;
      }
      if (
        !hadPlan &&
        (state === 'connecting' || state === 'reconnecting') &&
        socket &&
        socket.readyState === WebSocketImpl.CONNECTING
      ) {
        return;
      }
      reconnectAttempt = 0;
      openSocket();
    },

    connect() {
      if (planless) {
        this.connectWithoutPlan();
        return;
      }
      if (!planCode) {
        logAgentWsWarn('connect skipped — plan_code is not set');
        return;
      }
      // Only skip when the socket is already usable. A hung CONNECTING / ERROR socket
      // after logout→login must be torn down and reopened with the fresh token.
      if (state === 'ready' && socket && socket.readyState === WebSocketImpl.OPEN) {
        logAgentWsEvent('connect skipped — socket already ready', { planCode });
        return;
      }
      reconnectAttempt = 0;
      openSocket();
    },

    disconnect() {
      logAgentWsEvent('disconnect', { planCode, planless });
      planless = false;
      planCode = undefined;
      outboundQueue = [];
      inFlight = false;
      teardownSocket();
      setState('idle');
    },

    /** Close the socket without clearing plan_code (StrictMode-safe remount). */
    releaseSocket() {
      logAgentWsEvent('releaseSocket', { planCode });
      teardownSocket();
      setState(planCode || planless ? 'closed' : 'idle');
    },

    sendQuery(query) {
      const text = query.trim();
      if (!text) {
        logAgentWsWarn('sendQuery skipped — empty query');
        return;
      }
      logAgentWsEvent('enqueue query', {
        planCode,
        state,
        queueLength: outboundQueue.length + 1,
        preview: text.slice(0, 80),
      });
      outboundQueue.push(text);
      if (!socket || socket.readyState === WebSocketImpl.CLOSED) {
        this.connect();
      }
      pump();
    },

    isInFlight: () => inFlight,

    getState: () => state,

    getPlanCode: () => planCode,

    subscribeFrames(handler) {
      frameHandlers.add(handler);
      return () => {
        frameHandlers.delete(handler);
      };
    },

    subscribeState(handler) {
      stateHandlers.add(handler);
      handler(state);
      return () => {
        stateHandlers.delete(handler);
      };
    },
  };
}
