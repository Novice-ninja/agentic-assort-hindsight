import { decodeIaString } from '@shared/utils/format';
import { inferCurrencyCode, type ExcelExportColumn } from '@shared/components/data/excelExport';
import type {
  ByItemCell,
  ByItemColumnDef,
  ByItemComparisonCell,
  ByItemAiRecommendationCell,
  ByItemNumericCell,
  ByItemProductCell,
  ByItemSelectCell,
  ByItemTableRow,
  ByItemTextCell,
} from '../../types';

function isTextish(cell: ByItemCell | string | undefined): cell is ByItemTextCell | ByItemProductCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'string'
  );
}

function isNumeric(cell: ByItemCell | string | undefined): cell is ByItemComparisonCell | ByItemNumericCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'number'
  );
}

function isSelect(cell: ByItemCell | string | undefined): cell is ByItemSelectCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'options' in cell &&
    Array.isArray(cell.options)
  );
}

function isAiRecommendation(
  cell: ByItemCell | string | undefined,
): cell is ByItemAiRecommendationCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'narration' in cell &&
    typeof (cell as ByItemAiRecommendationCell).narration === 'string' &&
    'value' in cell &&
    typeof (cell as ByItemAiRecommendationCell).value === 'string'
  );
}

function text(value: string | null | undefined): string | null {
  if (value == null || value.length === 0) return null;
  return decodeIaString(value);
}

function numericValue(cell: ByItemCell | string | undefined): number | null {
  return isNumeric(cell) ? cell.value : null;
}

/**
 * Maps the frontend By Item column definition to export columns.
 *
 * Action-only `iconButton` columns are omitted. Product images are dropped.
 * KPI comparison cells export the numeric value only (same columns as the grid).
 */
export function buildByItemExportColumns(
  columns: readonly ByItemColumnDef[],
): ExcelExportColumn<ByItemTableRow>[] {
  const exported: ExcelExportColumn<ByItemTableRow>[] = [];

  columns.forEach((column) => {
    switch (column.type) {
      case 'iconButton':
        return;

      case 'text':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'text',
          value: (row) => {
            const cell = row[column.field];
            return isTextish(cell) ? text(cell.value) : null;
          },
        });
        return;

      case 'product':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'text',
          value: (row) => {
            const cell = row[column.field];
            return isTextish(cell) ? text(cell.value) : null;
          },
        });
        return;

      case 'kpiComparison':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'number',
          value: (row) => numericValue(row[column.field]),
        });
        return;

      case 'kpiComparisonCurrency':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'currency',
          value: (row) => numericValue(row[column.field]),
        });
        return;

      case 'percentage':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'percent',
          value: (row) => numericValue(row[column.field]),
        });
        return;

      case 'number':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'number',
          value: (row) => numericValue(row[column.field]),
        });
        return;

      case 'select':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'text',
          value: (row) => {
            const cell = row[column.field];
            return isSelect(cell) ? text(cell.value) : null;
          },
        });
        return;

      case 'aiRecommendation':
        exported.push({
          id: column.field,
          header: column.headerName,
          format: 'text',
          value: (row) =>
            isAiRecommendation(row.aiRecommendation) ? text(row.aiRecommendation.value) : null,
        });
        return;
    }
  });

  return exported;
}

export function inferByItemCurrency(rows: readonly ByItemTableRow[]): string {
  for (const row of rows) {
    const cell = row.revenue ?? row['buy-$'];
    if (cell !== undefined && 'formattedValue' in cell && typeof cell.formattedValue === 'string') {
      return inferCurrencyCode(cell.formattedValue);
    }
  }
  return 'USD';
}
