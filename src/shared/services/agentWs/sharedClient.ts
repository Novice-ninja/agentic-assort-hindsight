import { env, isDev, useMocks } from '@config/env';
import { createAgentWsClient, type AgentWsClient } from './createAgentWsClient';
import { createLocalAgentWsClient } from '@mocks/createLocalAgentWsClient';

/**
 * One agent socket for the whole app. Module-scoped so it survives React
 * StrictMode remounts and so screens other than the chat panel (Describe Your
 * Plan) can observe frames without owning a second connection.
 */
let sharedAgentWsClient: AgentWsClient | null = null;

function readAuthToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  const token = localStorage.getItem('token')?.trim();
  return token && token.length > 0 ? token : null;
}

export function getSharedAgentWsClient(): AgentWsClient {
  if (sharedAgentWsClient === null) {
    sharedAgentWsClient = useMocks ? createLocalAgentWsClient({
      mode: isDev ? env.localIrisMode : 'connection-error',
    }) : createAgentWsClient({
      agentApiBaseUrl: env.agentApiBaseUrl,
      getAuthToken: readAuthToken,
    });
  }
  return sharedAgentWsClient;
}

/** Drop the module-scoped socket so the next open uses a fresh auth token. */
export function resetSharedAgentWsClient(): void {
  if (sharedAgentWsClient === null) return;
  sharedAgentWsClient.disconnect();
  sharedAgentWsClient = null;
}
