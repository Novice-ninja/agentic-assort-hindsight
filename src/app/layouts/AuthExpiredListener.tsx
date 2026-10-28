import { useEffect } from 'react';
import { useToast } from '@shared/components/primitives/Toast';
import { AUTH_EXPIRED_EVENT } from '@shared/services';

/**
 * Listens for the `auth:expired` custom event dispatched by the HTTP layer on a 401
 * and shows an error toast. Mounted once inside the toast-enabled tree so the message
 * is visible before the redirect fires.
 *
 * Deduplication is handled at the source (`logoutInProgress` guard in auth.ts), so
 * this listener fires unconditionally whenever the event is dispatched.
 */
export function AuthExpiredListener() {
  const { showToast } = useToast();

  useEffect(() => {
    function onExpired() {
      showToast({
        message: 'Invalid token. Please login to continue.',
        variant: 'error',
        autoHideDuration: 3000,
        position: 'top-right',
      });
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [showToast]);

  return null;
}
