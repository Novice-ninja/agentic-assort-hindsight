import { request } from './http';
import type { Query } from './http';

/**
 * Thin, typed API client used by every module's `api/` layer.
 * Network is mocked by MSW in dev/test; no real backend in scope.
 */
/** Per-call options. Kept to what a caller can be trusted with, not all of `RequestInit`. */
export interface ApiRequestOptions {
  signal?: AbortSignal;
}

export const apiClient = {
  get: <T>(path: string, query?: Query) => request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export type ApiClient = typeof apiClient;
