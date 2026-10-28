import { env } from '@config/env';
import type { AgentFileData } from './types';

/**
 * Turns a file block URL into an absolute fetch target.
 *
 * Live replies send root-relative paths under `/api/assort-agent/…`. Those must
 * resolve against the agent host origin — prefixing `apiBaseUrl` would double
 * `/api`. Absolute `https://…` URLs pass through unchanged.
 */
export function resolveAgentFileUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.length === 0) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const agentBase = env.agentApiBaseUrl.replace(/\/$/, '');
  try {
    const origin = new URL(agentBase).origin;
    if (trimmed.startsWith('/')) return `${origin}${trimmed}`;
    return `${agentBase}/${trimmed.replace(/^\.\//, '')}`;
  } catch {
    return trimmed;
  }
}

function authorizationHeader(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined;
  const token = localStorage.getItem('token')?.trim();
  if (!token) return undefined;
  return /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
}

function triggerBlobDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

/**
 * Fetches the agent file with the session token and saves it under `filename`.
 * A bare `<a download>` would skip auth on protected `/api/assort-agent` paths.
 */
export async function downloadAgentFile(file: AgentFileData): Promise<void> {
  const url = resolveAgentFileUrl(file.url);
  const authorization = authorizationHeader();

  const response = await fetch(url, {
    method: 'GET',
    headers: authorization ? { Authorization: authorization } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const typed =
    file.mime.length > 0 && blob.type.length === 0
      ? new Blob([blob], { type: file.mime })
      : blob;

  triggerBlobDownload(typed, file.filename);
}
