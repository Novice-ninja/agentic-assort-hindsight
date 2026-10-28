import { buildWorkbookBytes } from './writeWorkbook';
import type { ExcelWorkbookSpec } from './types';

function triggerDownload(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([new Uint8Array(bytes)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Writes an `.xlsx` from the typed export spec. Does not touch AG Grid — the host shell
 * shares `ag-grid-*` as a singleton, and loading Enterprise from this remote crashes it.
 */
export function downloadExcelWorkbook<Row>(spec: ExcelWorkbookSpec<Row>): void {
  if (spec.rows.length === 0 || spec.columns.length === 0) {
    throw new Error('Nothing to export');
  }
  triggerDownload(buildWorkbookBytes(spec), spec.fileName);
}
