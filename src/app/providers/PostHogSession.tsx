import { usePostHog } from '@posthog/react';
import { useEffect } from 'react';
import { env } from '@config/env';
import { AUTH_EXPIRED_EVENT } from '@shared/services/auth';
import { getUserInfo } from '@shared/utils/userInfo';

function readTenant(): string {
  const fromEnv = env.client.trim();
  if (fromEnv.length > 0) return fromEnv;
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('CLIENT_NAME')?.trim() ?? '';
}

/**
 * Identifies the host-session user and resets on auth expiry.
 * Mounted only inside the vendor PostHog provider.
 */
export function PostHogSession() {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog == null) return;

    const { userEmail, userName } = getUserInfo();
    if (userEmail.length > 0) {
      posthog.identify(userEmail, {
        email: userEmail,
        name: userName,
      });
    }

    const tenant = readTenant();
    if (tenant.length > 0) {
      posthog.group('tenant', tenant);
    }
  }, [posthog]);

  useEffect(() => {
    if (posthog == null) return;

    function onExpired() {
      posthog.reset();
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [posthog]);

  return null;
}
