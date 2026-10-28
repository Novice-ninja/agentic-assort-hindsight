import { isDev } from '@config/env';

const PREFIX = '[agent-ws]';

/** Strips `token` from WS URLs so auth material never hits the console. */
export function redactWsUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has('token')) {
      parsed.searchParams.set('token', '***');
    }
    return parsed.toString();
  } catch {
    return url.replace(/([?&]token=)[^&]*/gi, '$1***');
  }
}

/**
 * Dev logging uses `console.info` (not `debug`) so messages show under the default
 * DevTools level — `console.debug` is hidden unless "Verbose" is enabled.
 */
function log(level: 'info' | 'warn', message: string, payload?: unknown): void {
  if (!isDev && level === 'info') return;
  // eslint-disable-next-line no-console
  const write = level === 'warn' ? console.warn : console.info;
  if (payload === undefined) {
    write(`${PREFIX} ${message}`);
  } else {
    write(`${PREFIX} ${message}`, payload);
  }
}

/** Outbound frame (client → agent). */
export function logAgentWsRequest(payload: unknown): void {
  log('info', '→ request', payload);
}

/** Inbound frame (agent → client), including unknown raw payloads. */
export function logAgentWsResponse(payload: unknown): void {
  log('info', '← response', payload);
}

export function logAgentWsEvent(message: string, payload?: unknown): void {
  log('info', message, payload);
}

export function logAgentWsWarn(message: string, payload?: unknown): void {
  log('warn', message, payload);
}
