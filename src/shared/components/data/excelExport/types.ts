export type ExcelCellValue = string | number | boolean | null | undefined;
export type ExcelNumberFormat = 'text' | 'number' | 'integer' | 'percent' | 'currency';
export interface ExcelExportColumn<Row> { id: string; header: string; groupHeader?: string; format?: ExcelNumberFormat; value: (row: Row) => ExcelCellValue }
export interface ExcelFileNameParts { view: string; planCode?: string | number; seasonCode?: string | number | null; at?: Date }
export interface ExcelDefinition { id?: string; label: string; definition: string; unit?: string; status?: string; sourceAliases?: string; aggregation?: string; version?: string }
export interface ExcelExportMetadata {
  scope?: Record<string, unknown>;
  definitions?: readonly ExcelDefinition[];
  sourceLabel?: string;
  sourceVersion?: string;
  viewState?: Record<string, unknown>;
  accessPolicy?: string;
}
export interface ExcelWorkbookSpec<Row> { rows: readonly Row[]; columns: readonly ExcelExportColumn<Row>[]; fileName: string; sheetName: string; currencyCode?: string; metadata?: ExcelExportMetadata; additionalSheets?: readonly { name: string; rows: readonly Record<string, ExcelCellValue>[]; columns: readonly ExcelExportColumn<Record<string, ExcelCellValue>>[] }[] }
