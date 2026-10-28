import { env, useMocks } from '@config/env';
import { handleUnauthorized } from './auth';
import { isTokenExpiringSoon, refreshSessionToken } from './sessionToken';

export interface ApiError {
  code: string;
  message: string;
}

export class HttpError extends Error {
  readonly status: number;
  readonly body: { error: ApiError } | undefined;

  constructor(status: number, message: string, body?: { error: ApiError }) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export type Query = Record<
  string,
  string | number | boolean | Array<string | number> | undefined
>;

function buildUrl(path: string, query?: Query): string {
  // Absolute URLs (e.g. a fully-qualified service endpoint) bypass the base prefix.
  const isAbsolute = /^https?:\/\//i.test(path);
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const url = isAbsolute ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Session token from the host shell (`localStorage.token`; cleared on logout in `Sidebar`).
 * Read per request so a refreshed login is picked up without a reload.
 */
function readAuthToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  const token = localStorage.getItem('token')?.trim();
  return token && token.length > 0 ? token : null;
}

function isUnauthorizedBody(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;
  const record = body as Record<string, unknown>;
  return (
    record.errorCode === 'UNAUTHORIZED_ACCESS' ||
    record.errorCode === 'TOKEN_EXPIRED' ||
    record.errorCode === 'INVALID_TOKEN'
  );
}

function isAbortError(error: unknown): boolean {
  if (error == null || typeof error !== 'object') return false;
  const name = (error as { name?: unknown }).name;
  return name === 'AbortError' || name === 'TimeoutError';
}

function authorizationHeader(token: string | null): string | undefined {
  if (token === null) return undefined;
  return /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
}

async function ensureFreshToken(): Promise<void> {
  const token = readAuthToken();
  if (token === null || !isTokenExpiringSoon(token)) return;
  await refreshSessionToken(true);
}

type PerformResult<T> = { ok: true; value: T } | { ok: false; authFailed: true };

async function performRequest<T>(
  path: string,
  options: RequestInit & { query?: Query },
): Promise<PerformResult<T>> {
  const { query, headers, ...rest } = options;
  // Only send Content-Type when there's a body. Adding it to bodyless GET requests makes
  // them "non-simple" and triggers a needless CORS preflight (OPTIONS) on cross-origin calls,
  // which shows up as a duplicate request to the same endpoint.
  const hasBody = rest.body != null;
  const authorization = authorizationHeader(readAuthToken());

  let response: Response;
  try {
    const fetchApi = useMocks
      ? (await import('@mocks/localApiRecovery')).fetchWithLocalApiRecovery
      : fetch;
    response = await fetchApi(buildUrl(path, query), {
      headers: {
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
        ...headers,
      },
      ...rest,
    });
  } catch (error) {
    // AbortSignal (timeout / unmount / plan change) must never clear the session.
    if (isAbortError(error)) {
      throw new HttpError(0, 'Request aborted.');
    }
    // CORS / offline / DNS failures also surface here. Those are not proof the session
    // expired — only an explicit HTTP 401 or unauthorized body (below) should log out.
    // Treating every agent/network blip as auth expiry was logging users out of Overview
    // when `/api/assort-agent/.../hindsight-summary` failed cross-origin.
    throw new HttpError(0, 'Network error. Please check your connection.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      return { ok: false, authFailed: true };
    }

    let body: { error: ApiError } | undefined;
    let rawBody: Record<string, unknown> | undefined;
    try {
      rawBody = (await response.json()) as Record<string, unknown>;
      body = rawBody as unknown as { error: ApiError } | undefined;
    } catch {
      body = undefined;
      rawBody = undefined;
    }

    if (isUnauthorizedBody(rawBody)) {
      return { ok: false, authFailed: true };
    }

    const errorMessage =
      body?.error?.message ||
      (typeof rawBody?.message === 'string' ? rawBody.message : undefined) ||
      `Request failed with status ${response.status}`;

    throw new HttpError(response.status, errorMessage, body);
  }

  if (response.status === 204) return { ok: true, value: undefined as T };
  const json = (await response.json()) as T;

  if (isUnauthorizedBody(json)) {
    return { ok: false, authFailed: true };
  }

  return { ok: true, value: json };
}

function expireSession(): never {
  handleUnauthorized();
  throw new HttpError(401, 'Session expired. Redirecting to login.');
}

export async function request<T>(
  path: string,
  options: RequestInit & { query?: Query } = {},
): Promise<T> {
  await ensureFreshToken();
  const first = await performRequest<T>(path, options);
  if (first.ok) return first.value;

  const refreshed = await refreshSessionToken(true);
  if (refreshed === null) expireSession();

  const retry = await performRequest<T>(path, options);
  if (!retry.ok) expireSession();
  return retry.value;
}
