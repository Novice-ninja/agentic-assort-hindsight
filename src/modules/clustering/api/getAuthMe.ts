import { env } from '@config/env';
import { apiClient } from '@shared/services';

/** `GET /v1/auth/me` — the currently authenticated user. */
export const AUTH_ME_ENDPOINT = `${env.goApiBaseUrl}/v1/auth/me`;

/**
 * The authenticated user shown as the Sign-Off approver. Only the fields the UI needs are
 * kept; `uid`, `tenant` and `auth_provider` are deliberately not surfaced.
 */
export interface AuthenticatedUser {
  name: string;
  email: string;
  userId: string;
  emailVerified: boolean;
}

function unwrapData(payload: unknown): unknown {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

function parseAuthMe(value: unknown): AuthenticatedUser | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (!isNonEmptyString(raw.email)) return null;
  return {
    // The backend may fall back to the email for `name`; keep that behaviour on our side too.
    name: isNonEmptyString(raw.name) ? raw.name : raw.email,
    email: raw.email,
    userId: typeof raw.user_id === 'string' ? raw.user_id : '',
    emailVerified: raw.email_verified === true,
  };
}

/** Returns the authenticated user, or throws when the response is not what the contract says. */
export async function getAuthMe(): Promise<AuthenticatedUser> {
  const payload = await apiClient.get<unknown>(AUTH_ME_ENDPOINT);
  const user = parseAuthMe(unwrapData(payload));
  if (!user) throw new Error('Unexpected auth/me response');
  return user;
}
