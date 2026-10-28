import { dispatchIrisSessionReset } from './irisSession';

/** Refresh this far before JWT `exp` so API calls do not race the 1-hour expiry. */
export const TOKEN_REFRESH_SKEW_MS = 5 * 60 * 1000;

/**
 * Seconds-since-epoch `exp` from a JWT, or `null` when the value is not a JWT.
 */
export function readJwtExpirySeconds(token: string): number | null {
  const jwt = token.replace(/^Bearer\s+/i, '').trim();
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * Host shells also persist absolute expiry under these keys (ms since epoch).
 * Used when the stored token is opaque or JWT parsing fails.
 */
export function readStoredExpiryMs(): number | null {
  if (typeof localStorage === 'undefined') return null;
  for (const key of ['session.expiry', 'session_expires_at'] as const) {
    const raw = localStorage.getItem(key)?.trim();
    if (raw === undefined || raw.length === 0) continue;
    const ms = Number(raw);
    if (Number.isFinite(ms) && ms > 0) return ms;
  }
  return null;
}

export function isTokenExpiringSoon(
  token: string,
  skewMs = TOKEN_REFRESH_SKEW_MS,
  nowMs = Date.now(),
): boolean {
  const exp = readJwtExpirySeconds(token);
  if (exp !== null) {
    return exp * 1000 - nowMs <= skewMs;
  }
  const storedMs = readStoredExpiryMs();
  if (storedMs === null) return false;
  return storedMs - nowMs <= skewMs;
}

/** Absolute ms when the current session token should be force-refreshed, or null. */
export function readRefreshDeadlineMs(
  token: string,
  skewMs = TOKEN_REFRESH_SKEW_MS,
): number | null {
  const exp = readJwtExpirySeconds(token);
  if (exp !== null) return exp * 1000 - skewMs;
  const storedMs = readStoredExpiryMs();
  if (storedMs === null) return null;
  return storedMs - skewMs;
}

export function persistSessionToken(token: string): void {
  if (typeof localStorage === 'undefined') return;
  const jwt = token.replace(/^Bearer\s+/i, '').trim();
  if (jwt.length === 0) return;
  const previous = localStorage.getItem('token')?.trim() ?? '';
  localStorage.setItem('token', jwt);
  const exp = readJwtExpirySeconds(jwt);
  if (exp !== null) {
    const expiryMs = String(exp * 1000);
    localStorage.setItem('session.expiry', expiryMs);
    localStorage.setItem('session_expires_at', expiryMs);
  }
  // Token restored after a clear (logout / soft re-login) — remount Iris so the panel
  // and WebSocket are not stuck until a hard reload.
  if (previous.length === 0) {
    dispatchIrisSessionReset();
  }
}
