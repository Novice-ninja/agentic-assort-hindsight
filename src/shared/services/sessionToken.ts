import type { FirebaseAuth, FirebaseUser } from '@app/auth/firebase';
import {
  isTokenExpiringSoon,
  persistSessionToken,
  readRefreshDeadlineMs,
} from './sessionTokenExpiry';
import { dispatchIrisSessionReset } from './irisSession';
import { useMocks } from '@config/env';

export {
  TOKEN_REFRESH_SKEW_MS,
  readJwtExpirySeconds,
  readStoredExpiryMs,
  readRefreshDeadlineMs,
  isTokenExpiringSoon,
  persistSessionToken,
} from './sessionTokenExpiry';

const POLL_MS = 60 * 1000;
/** Keep probing for host `window.firebase` — the shell may inject it after this remote mounts. */
const HOST_AUTH_RETRY_MS = 2_000;
const USER_WAIT_MS = 8_000;

let refreshInFlight: Promise<string | null> | undefined;

type HostFirebase = {
  auth?: () => FirebaseAuth;
};

function readHostAuth(): FirebaseAuth | null {
  if (typeof window === 'undefined') return null;
  const firebase = (window as Window & { firebase?: HostFirebase }).firebase;
  if (typeof firebase?.auth !== 'function') return null;
  try {
    return firebase.auth();
  } catch {
    return null;
  }
}

async function loadAuth(): Promise<FirebaseAuth | null> {
  const host = readHostAuth();
  if (host !== null) return host;
  try {
    const { getFirebaseAuth } = await import('@app/auth/firebase');
    return getFirebaseAuth();
  } catch {
    return null;
  }
}

async function waitForCurrentUser(
  auth: FirebaseAuth,
  timeoutMs = USER_WAIT_MS,
): Promise<FirebaseUser | null> {
  if (auth.currentUser !== null) return auth.currentUser;
  const hasStoredToken = Boolean(localStorage.getItem('token')?.trim());
  // No local token → fail fast on the first null. With a token, wait out IndexedDB restore
  // (Firebase often emits null once before hydrating the signed-in user).
  const waitMs = hasStoredToken ? timeoutMs : 1_500;
  return new Promise((resolve) => {
    let settled = false;
    const finish = (user: FirebaseUser | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      unsubscribe();
      resolve(user);
    };
    const timer = window.setTimeout(() => finish(auth.currentUser), waitMs);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        finish(user);
        return;
      }
      if (!hasStoredToken) finish(null);
    });
  });
}

/**
 * Asks Firebase for a fresh ID token and writes it to `localStorage.token`.
 *
 * Login still belongs to the host. This only reuses the persisted session so the
 * hour-long JWT the host stored at sign-in does not go stale while the planner works.
 */
export async function refreshSessionToken(force = true): Promise<string | null> {
  // The standalone local copy has no identity provider or production session.
  if (useMocks) return null;
  if (refreshInFlight !== undefined) return refreshInFlight;
  refreshInFlight = (async () => {
    const auth = await loadAuth();
    if (auth === null) return null;
    const user = await waitForCurrentUser(auth);
    if (user === null) return null;
    const token = await user.getIdToken(force);
    persistSessionToken(token);
    return token;
  })()
    .catch(() => null)
    .finally(() => {
      refreshInFlight = undefined;
    });
  return refreshInFlight;
}

function readStoredToken(): string | null {
  const token = localStorage.getItem('token')?.trim();
  return token !== undefined && token.length > 0 ? token : null;
}

/**
 * Keeps `localStorage.token` aligned with Firebase's rotating ID token.
 * Returns a disposer for the App unmount path.
 */
export function startSessionTokenRefresh(): () => void {
  if (useMocks) return () => undefined;
  let disposed = false;
  const disposers: Array<() => void> = [];
  let authUnsubscribers: Array<() => void> = [];
  let scheduledRefreshTimer: number | undefined;
  let boundAuth: FirebaseAuth | null = null;

  const clearAuthSubscriptions = () => {
    authUnsubscribers.forEach((dispose) => dispose());
    authUnsubscribers = [];
    boundAuth = null;
  };

  const persistFromUser = (user: FirebaseUser | null) => {
    if (user === null) {
      // Soft sign-out in the host shell — drop Iris socket/panel state without waiting for reload.
      dispatchIrisSessionReset();
      return;
    }
    // force=false lets Firebase hit the network when the cached ID token is inside its
    // own ~5 min skew; persist whatever it returns so localStorage stays aligned.
    void user.getIdToken(false).then(persistSessionToken).catch(() => undefined);
  };

  const maybeRefreshFromStorage = () => {
    const token = readStoredToken();
    if (token === null) return;
    if (isTokenExpiringSoon(token)) {
      void refreshSessionToken(true);
    }
  };

  const scheduleRefreshFromDeadline = () => {
    if (scheduledRefreshTimer !== undefined) {
      window.clearTimeout(scheduledRefreshTimer);
      scheduledRefreshTimer = undefined;
    }
    const token = readStoredToken();
    if (token === null) return;
    const deadline = readRefreshDeadlineMs(token);
    if (deadline === null) return;
    const delay = Math.max(0, deadline - Date.now());
    // setTimeout is clamped by browsers (~24.8d); for ~1h ID tokens this is fine.
    scheduledRefreshTimer = window.setTimeout(() => {
      void refreshSessionToken(true).finally(() => {
        if (!disposed) scheduleRefreshFromDeadline();
      });
    }, delay);
  };

  const bindAuth = (auth: FirebaseAuth) => {
    if (disposed || auth === boundAuth) return;
    clearAuthSubscriptions();
    boundAuth = auth;
    authUnsubscribers.push(auth.onAuthStateChanged(persistFromUser));
    authUnsubscribers.push(auth.onIdTokenChanged(persistFromUser));
    void refreshSessionToken(true).finally(() => {
      if (!disposed) scheduleRefreshFromDeadline();
    });
  };

  const resolveAndBindAuth = () => {
    if (disposed) return;
    void loadAuth().then((auth) => {
      if (disposed || auth === null) return;
      bindAuth(auth);
    });
  };

  resolveAndBindAuth();
  // Host firebase is often assigned after the remote's first paint.
  const hostRetry = window.setInterval(() => {
    const host = readHostAuth();
    if (host !== null) {
      bindAuth(host);
    } else if (boundAuth === null) {
      resolveAndBindAuth();
    }
  }, HOST_AUTH_RETRY_MS);
  disposers.push(() => window.clearInterval(hostRetry));

  const poll = window.setInterval(maybeRefreshFromStorage, POLL_MS);
  disposers.push(() => window.clearInterval(poll));

  const onVisible = () => {
    if (document.visibilityState !== 'visible') return;
    maybeRefreshFromStorage();
  };
  document.addEventListener('visibilitychange', onVisible);
  disposers.push(() => document.removeEventListener('visibilitychange', onVisible));

  disposers.push(() => {
    if (scheduledRefreshTimer !== undefined) {
      window.clearTimeout(scheduledRefreshTimer);
    }
    clearAuthSubscriptions();
  });

  return () => {
    disposed = true;
    disposers.forEach((dispose) => dispose());
  };
}

/** Test-only: drop an in-flight refresh so cases do not leak into each other. */
export function resetSessionTokenStateForTests(): void {
  refreshInFlight = undefined;
}
