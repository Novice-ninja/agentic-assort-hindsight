import type { AppEnvironment } from '@config/env';

/** Cloud UI host used to load the session-replay recorder and toolbar assets. */
export function resolvePostHogUiHost(apiHost: string): string {
  return /eu(\.i)?\.posthog\.com/i.test(apiHost)
    ? 'https://eu.posthog.com'
    : 'https://us.posthog.com';
}

/**
 * PostHog runs in production and UAT when a project key is present.
 * Development (`devs`) and test builds must not initialise the SDK or send
 * events / session recordings.
 */
export function isPostHogEnabled(
  posthogKey: string,
  appEnv: AppEnvironment,
): boolean {
  return posthogKey.length > 0 && (appEnv === 'production' || appEnv === 'uat');
}
