import type { ExcelFileNameParts } from './types';

const SHEET_FORBIDDEN = /[:\\/?*[\]]/g;

export function sanitizeFilePart(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function sanitizeSheetName(name: string): string {
  const cleaned = name.replace(SHEET_FORBIDDEN, ' ').replace(/\s+/g, ' ').trim();
  return (cleaned.length > 0 ? cleaned : 'Sheet').slice(0, 31);
}

export function buildExportFilename(parts: ExcelFileNameParts): string {
  const date = (parts.at ?? new Date()).toISOString().slice(0, 10);
  const tokens = [
    sanitizeFilePart(parts.view) || 'export',
    parts.planCode ? sanitizeFilePart(String(parts.planCode)) : undefined,
    parts.seasonCode != null && String(parts.seasonCode).length > 0
      ? sanitizeFilePart(String(parts.seasonCode))
      : undefined,
    date,
  ].filter((token): token is string => token !== undefined && token.length > 0);
  return `${tokens.join('_')}.xlsx`;
}
