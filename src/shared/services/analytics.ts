import posthog from 'posthog-js';
import { env } from '@config/env';
import { isPostHogEnabled } from '@app/providers/posthogCloud';

function isClientReady(): boolean {
  return isPostHogEnabled(env.posthogKey, env.appEnv) && posthog.__loaded === true;
}

/**
 * Capture a product event. No-ops when PostHog was not initialised (no project key).
 * Feature code should use this rather than importing `posthog-js` directly.
 */
export function captureEvent(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!isClientReady()) return;
  posthog.capture(event, properties);
}

/**
 * Drop the current person so the next session on this browser is not attributed
 * to the planner who just signed out. Safe when PostHog never started.
 */
export function resetAnalytics(): void {
  if (!isClientReady()) return;
  posthog.reset();
}
