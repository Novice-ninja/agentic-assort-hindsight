import type {
  AttributeCellRenderer,
  AttributeColumnDef,
  AttributeLeafColumnDef,
  ColumnConfigEntry,
  ColumnConfigSubHeader,
} from '../types';

/**
 * Maps an API `column_name` to the frontend row field name produced by the row adapter.
 *
 * The row adapter (`attributeTableRows.ts`) renames certain backend fields to camelCase.
 * This lookup ensures the column's `field` points to where the data actually lives in the
 * adapted row. Fields not listed here are used as-is (dynamic columns).
 */
const COLUMN_NAME_TO_FIELD: Record<string, string> = {
  attr_value: 'attribute',
  rev_share: 'performanceOrgRev',
  sell_through_percentage: 'performanceOrgST',
  gross_margin_percentage: 'performanceOrgGM',
  sales_revenue: 'salesRevenue',
  trend_yoy: 'trendYOY',
  signal: 'signal',
};

export function resolveAttributeField(columnName: string): string {
  return COLUMN_NAME_TO_FIELD[columnName] ?? columnName;
}

function rendererForEntry(entry: { column_name: string; extra?: { cellType?: string } }): AttributeCellRenderer {
  const cellType = entry.extra?.cellType;

  if (entry.column_name === 'attr_value') return 'attributeRenderer';
  if (cellType === 'progress') return 'progressRenderer';
  if (cellType === 'trend') return 'trendRenderer';
  if (cellType === 'badge') return 'statusRenderer';
  return 'metricRenderer';
}

const DEFAULT_MIN_WIDTH = 120;

function toLeafColumn(entry: ColumnConfigSubHeader | ColumnConfigEntry): AttributeLeafColumnDef {
  return {
    headerName: entry.label,
    field: resolveAttributeField(entry.column_name) as AttributeLeafColumnDef['field'],
    colId: entry.column_name,
    cellRenderer: rendererForEntry(entry),
    width: entry.width > 0 ? entry.width : DEFAULT_MIN_WIDTH,
    ...(entry.is_frozen ? { pinned: 'left' as const, lockPinned: true } : {}),
  };
}

function isGroup(entry: ColumnConfigEntry): boolean {
  return entry.type === 'group' && entry.sub_headers.length > 0;
}

/**
 * Converts a single API column-config entry into one or more `AttributeColumnDef`.
 *
 * - Groups produce an `AttributeColumnGroupDef` with children from visible sub-headers.
 * - Leaf entries (type "object", "number", etc.) produce a single `AttributeLeafColumnDef`.
 * - Hidden entries or groups with all-hidden children are omitted.
 */
function toColumnDef(entry: ColumnConfigEntry): AttributeColumnDef | null {
  if (entry.is_hidden) return null;

  if (isGroup(entry)) {
    const children = entry.sub_headers
      .filter((s) => !s.is_hidden)
      .sort((a, b) => a.order_of_display - b.order_of_display)
      .map(toLeafColumn);

    if (children.length === 0) return null;

    return {
      headerName: entry.label,
      groupId: entry.column_name,
      children,
    };
  }

  return toLeafColumn(entry);
}

/**
 * Builds the full column array from the column-config API response.
 *
 * Entries are sorted by `order_of_display` and hidden entries are excluded.
 * Returns an empty array if the input is empty — the table handles that as "no columns".
 */
export function buildAttributeColumns(
  entries: readonly ColumnConfigEntry[],
): AttributeColumnDef[] {
  return [...entries]
    .sort((a, b) => a.order_of_display - b.order_of_display)
    .map(toColumnDef)
    .filter((def): def is AttributeColumnDef => def !== null);
}

/**
 * Backwards-compatible export kept for tests that still import it.
 * @deprecated All columns come from the API now.
 */
export const ATTRIBUTE_BREAKDOWN_COLUMNS: readonly AttributeColumnDef[] = [];

/** @deprecated Use buildAttributeColumns. */
export const ATTRIBUTE_COLUMNS_PREFIX: readonly AttributeColumnDef[] = [];
/** @deprecated Use buildAttributeColumns. */
export const ATTRIBUTE_COLUMNS_SUFFIX: readonly AttributeColumnDef[] = [];
/** @deprecated Use buildAttributeColumns. */
export function mapColumnConfigGroups(
  groups: readonly ColumnConfigEntry[],
): AttributeColumnDef[] {
  return buildAttributeColumns(groups);
}
