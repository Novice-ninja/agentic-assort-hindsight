/**
 * Centralised authentication utilities.
 *
 * The parent container handles login and stores the token in `localStorage.token`.
 * This module owns everything on the "out" side: logout, session clear, and the
 * custom event that lets React components show a toast before the redirect fires.
 */

import { resetAnalytics } from './analytics';
import { dispatchIrisSessionReset } from './irisSession';

/** Custom event dispatched on 401 so the React tree can show a toast. */
export const AUTH_EXPIRED_EVENT = 'auth:expired' as const;

/**
 * Guard against concurrent 401 responses all triggering logout at once.
 * Stored on `window` so it survives across module boundaries in dev hot-reload.
 */
let logoutInProgress = false;

const LOCAL_STORAGE_KEYS = [
  'token',
  'session.expiry',
  'CLIENT_NAME',
  'currentApp',
  'coreScreenNames',
  'applicationCodesList',
  'tenantDateFormat',
  'tenantTimeZone',
  'currentScreenName',
  'inventorysmartScreenConfig',
  'tenantUamConfig',
  'filter_attribute_exclusion_values',
  'quickFilterLoad',
  'chatData',
  'smartBotScreenName',
  'smartBotCurrentAppLink',
  'currentModeData',
  'currentSelectedModuleData',
  'chatDataScreenLinkRef',
  'currentModulesData',
  'chatDataForReference',
  'isStreaming',
  'enableAllAccess',
  'web_master_key',
  'session_expires_at',
  'shortcutsDemoDismissed',
] as const;

const SESSION_STORAGE_KEYS = [
  'currentApp',
  'currentSideBar',
  'redirectUrl',
  'redirectionInfo',
  'mfaFlow',
  'mfaVerified',
  'mfaEmail',
  'mfaResendRemaining',
  'mfaPending',
  'crossFilterVersion',
  'isLoggingIn',
  'notificationVersion',
  'showKbShortcuts',
  'authToken',
] as const;

function clearStorage(): void {
  const appCode = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentApp') || '{}')?.applicationCode;
    } catch {
      return undefined;
    }
  })();

  LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  if (appCode) localStorage.removeItem(`languagePreference_${appCode}`);

  SESSION_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));

  document.cookie = 'csrf_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';

  try {
    const request = indexedDB.deleteDatabase('firebaseLocalStorageDb');
    request.onerror = () => {/* best-effort */};
  } catch {
    /* indexedDB unavailable in some test envs */
  }
}

/**
 * Clears all session data and redirects to the login page.
 *
 * Safe to call from anywhere — the sidebar, an HTTP interceptor, or an effect.
 * Concurrent calls are deduplicated.
 */
export function logout(): void {
  if (logoutInProgress) return;
  logoutInProgress = true;

  dispatchIrisSessionReset();
  resetAnalytics();
  clearStorage();
  window.location.href = window.location.origin + '/login';
}

/**
 * Handles a 401 response: dispatches the `auth:expired` event so the UI can show
 * a toast, then redirects after a short delay to let the message be read.
 *
 * Returns `true` if logout was initiated, `false` if one was already in progress.
 */
export function handleUnauthorized(): boolean {
  if (logoutInProgress) return false;
  logoutInProgress = true;

  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));

  // Allow toast to render before navigating away.
  setTimeout(() => {
    dispatchIrisSessionReset();
    resetAnalytics();
    clearStorage();
    window.location.href = window.location.origin + '/login';

    // Safety: if navigation didn't happen (e.g. blocked by browser), reset the guard
    // so a subsequent 401 can still trigger logout.
    setTimeout(() => {
      logoutInProgress = false;
    }, 1000);
  }, 2000);

  return true;
}

/** Resets the guard — only needed in tests. */
export function resetLogoutGuard(): void {
  logoutInProgress = false;
}
