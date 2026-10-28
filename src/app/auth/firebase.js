import firebase from 'firebase/app';
import 'firebase/auth';
import { getAuthConfig } from './config';

const emptyAuth = {
  currentUser: null,
  onAuthStateChanged(next) {
    next(null);
    return () => undefined;
  },
  onIdTokenChanged(next) {
    next(null);
    return () => undefined;
  },
};

function resolveApp() {
  if (firebase.apps.length) return firebase.app();
  const authConfig = getAuthConfig();
  if (!authConfig.apiKey || !authConfig.authDomain) return null;
  return firebase.initializeApp({
    apiKey: authConfig.apiKey,
    authDomain: authConfig.authDomain,
  });
}

/**
 * Lazily resolve Auth so a cold remote boot (before `baseUrl` is set) can recover
 * once the host shell writes tenant config. Prefer `window.firebase` from the host
 * when present — that instance owns the signed-in user.
 */
export function getFirebaseAuth() {
  const app = resolveApp();
  return app ? app.auth() : emptyAuth;
}

const app = resolveApp();
export const auth = app ? app.auth() : emptyAuth;
export default app;
export const firebaseobj = firebase;
