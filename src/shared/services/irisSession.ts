/**
 * Cross-cutting Iris session lifecycle.
 *
 * Logout / 401 / Firebase sign-out can leave the module-scoped agent socket and the
 * ChatBot host in a bad state when the shell soft-navigates back without a full reload.
 * Listeners remount the panel and drop the shared WebSocket client.
 */

export const IRIS_SESSION_RESET_EVENT = 'iris:session-reset' as const;

/** Fire before clearing auth storage or when Firebase reports signed-out. */
export function dispatchIrisSessionReset(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(IRIS_SESSION_RESET_EVENT));
}
