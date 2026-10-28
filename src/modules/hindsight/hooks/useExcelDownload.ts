import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildExportFilename,
  downloadExcelWorkbook,
  type ExcelExportColumn,
  type ExcelFileNameParts,
  type ExcelExportMetadata,
} from '@shared/components/data/excelExport';
import { useToast } from '@shared/components/primitives/Toast';

export interface UseExcelDownloadOptions<Row> {
  getRows: () => readonly Row[];
  columns: readonly ExcelExportColumn<Row>[];
  fileName: ExcelFileNameParts;
  sheetName: string;
  currencyCode?: string;
  canExport: boolean;
  /** Optional scope and provisional definitions are exported as separate metadata sheets. */
  metadata?: ExcelExportMetadata;
  /** Read imperative grid filters/sort at click time rather than a stale React render. */
  getMetadata?: () => ExcelExportMetadata;
}

export interface UseExcelDownloadResult {
  download: () => Promise<void>;
  downloading: boolean;
  disabled: boolean;
}

/**
 * Shared download orchestration for Hindsight table toolbars: loading, empty guard, toast.
 */
export function useExcelDownload<Row>(
  options: UseExcelDownloadOptions<Row>,
): UseExcelDownloadResult {
  const { t } = useTranslation('hindsight');
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const disabled = !options.canExport || downloading;

  const download = useCallback(async () => {
    if (!options.canExport || downloading) return;

    setDownloading(true);
    try {
      // Let React commit the loading state before the file is generated.
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });
      const rows = options.getRows();
      if (rows.length === 0 || options.columns.length === 0) {
        throw new Error('Nothing to export');
      }
      await downloadExcelWorkbook({
        rows,
        columns: options.columns,
        fileName: buildExportFilename(options.fileName),
        sheetName: options.sheetName,
        currencyCode: options.currencyCode,
        metadata: options.getMetadata?.() ?? options.metadata,
      });
      showToast({ message: t('export.success', 'Download started'), variant: 'success' });
    } catch {
      showToast({
        message: t('export.failed', 'Could not export the table'),
        variant: 'error',
      });
    } finally {
      setDownloading(false);
    }
  }, [downloading, options, showToast, t]);

  return { download, downloading, disabled };
}
