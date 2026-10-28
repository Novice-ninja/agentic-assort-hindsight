import { useEffect } from 'react';
import { startSessionTokenRefresh } from '@shared/services/sessionToken';

/**
 * Copies Firebase's rotating ID token into `localStorage.token` while this remote is open.
 * Does not own login — the host still signs the planner in.
 */
export function SessionTokenRefresh() {
  useEffect(() => startSessionTokenRefresh(), []);
  return null;
}
