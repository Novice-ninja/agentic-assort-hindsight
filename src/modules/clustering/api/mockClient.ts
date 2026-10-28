import { HttpError } from '@shared/services/http';
import type { Query } from '@shared/services/http';
import { handleClusteringRequest } from '@mocks/handlers/clustering';

function withQuery(path: string, query?: Query): string {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
    } else {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  const result = await handleClusteringRequest(method, path, body);
  if (result.status === 204) return undefined as T;
  if (result.status >= 400) {
    const errorBody = result.body as { error: { code: string; message: string } } | undefined;
    throw new HttpError(
      result.status,
      errorBody?.error?.message ?? `Request failed with status ${result.status}`,
      errorBody,
    );
  }
  return result.body as T;
}

/** In-process clustering mock — no Service Worker, so the host on :8080 does not need mockServiceWorker.js. */
export const clusteringClient = {
  get: <T>(path: string, query?: Query) => send<T>('GET', withQuery(path, query)),
  post: <T>(path: string, body?: unknown) => send<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => send<T>('PATCH', path, body),
  delete: <T>(path: string) => send<T>('DELETE', path),
};
