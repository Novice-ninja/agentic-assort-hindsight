/**
 * Builds `wss://…/v1/ws` from `agentApiBaseUrl` (`https://…/api/assort-agent`).
 * `plan_code` is set only when a plan is in scope. The session token is appended
 * as `token` (browsers cannot set Authorization on WebSocket).
 */
export function buildAgentWsUrl(
  agentApiBaseUrl: string,
  planCode?: string | null,
  token?: string | null,
): string {
  const trimmed = agentApiBaseUrl.replace(/\/$/, '');
  let wsBase = trimmed;
  if (/^https:/i.test(trimmed)) {
    wsBase = trimmed.replace(/^https:/i, 'wss:');
  } else if (/^http:/i.test(trimmed)) {
    wsBase = trimmed.replace(/^http:/i, 'ws:');
  }
  const url = new URL(`${wsBase}/v1/ws`);
  const code = planCode?.trim();
  if (code) url.searchParams.set('plan_code', code);
  const auth = token?.trim();
  if (auth && auth.length > 0) {
    url.searchParams.set('token', auth.replace(/^Bearer\s+/i, ''));
  }
  return url.toString();
}
