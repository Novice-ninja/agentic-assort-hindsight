import { PostHogProvider as VendorPostHogProvider } from '@posthog/react';
import type { ReactNode } from 'react';
import type { PostHogConfig } from 'posthog-js';
import { env } from '@config/env';
import { PostHogSession } from './PostHogSession';
import { isPostHogEnabled, resolvePostHogUiHost } from './posthogCloud';

/** Latest SDK defaults snapshot recommended for new PostHog Cloud projects. */
const POSTHOG_DEFAULTS = '2026-05-30' as const;

const posthogOptions: Partial<PostHogConfig> = {
  api_host: env.posthogHost,
  // Events go to `api_host`. The recorder script and toolbar load from `ui_host`.
  ui_host: resolvePostHogUiHost(env.posthogHost),
  defaults: POSTHOG_DEFAULTS,
  disable_session_recording: false,
  loaded(client) {
    client.register({
      app: 'agentic-assort',
      app_env: env.appEnv,
      client: env.client,
    });
    // Events can succeed while replay stays idle (sample rate, URL trigger, or
    // recorder still lazy-loading). Start it once the client is ready.
    client.startSessionRecording();
  },
};

/**
 * Starts PostHog Cloud in production and UAT when a project key is present.
 * Development and test builds render children only — no events, replay, or SDK logs.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  if (!isPostHogEnabled(env.posthogKey, env.appEnv)) {
    return children;
  }

  return (
    <VendorPostHogProvider apiKey={env.posthogKey} options={posthogOptions}>
      <PostHogSession />
      {children}
    </VendorPostHogProvider>
  );
}
