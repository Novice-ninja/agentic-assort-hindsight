import type {
  ByItemCell,
  ByItemColumnDef,
  ByItemColumnType,
  ByItemComparisonCell,
  ByItemNumericCell,
  ByItemTableField,
  ByItemTableRow,
} from '../types';

/**
 * Fallback column definition used while no sample row has loaded.
 *
 * Identity and control columns stay frontend-owned. Metric columns here are the last-known
 * backend set and are replaced by `buildByItemColumns(rowData[0])` once a row arrives.
 */
export const BY_ITEM_COLUMNS: readonly ByItemColumnDef[] = [
  { field: 'styleId', headerName: 'Style ID', type: 'text' },
  { field: 'styleDescription', headerName: 'Style Description', type: 'product' },
  { field: 'department', headerName: 'Department', type: 'text' },
  { field: 'buy_units', headerName: 'Buy Units', type: 'number' },
  { field: 'buy-$', headerName: 'Buy $', type: 'kpiComparisonCurrency' },
  { field: 'qty_sold', headerName: 'SlsU', type: 'number' },
  { field: 'revenue', headerName: 'Sls$', type: 'kpiComparisonCurrency' },
  { field: 'aur', headerName: 'AUR', type: 'kpiComparisonCurrency' },
  { field: 'gross_margin', headerName: 'GM$', type: 'kpiComparisonCurrency' },
  { field: 'gross_margin_pct', headerName: 'GM%', type: 'percentage' },
  { field: 'mark_down_pct', headerName: 'MD%', type: 'percentage' },
  { field: 'ros', headerName: 'ROS', type: 'number' },
  { field: 'sell_thru_pct', headerName: 'ST%', type: 'percentage' },
  { field: 'sell_thru_eop_pct', headerName: 'ST EOP', type: 'percentage' },
  { field: 'woh', headerName: 'WOH', type: 'number' },
  { field: 'aiRecommendation', headerName: 'Recommendation', type: 'aiRecommendation' },
  { field: 'workingPlan', headerName: 'Working Plan', type: 'select' },
];

const LEAD_COLUMNS: readonly ByItemColumnDef[] = [
  { field: 'styleId', headerName: 'Style ID', type: 'text' },
  { field: 'styleDescription', headerName: 'Style Description', type: 'product' },
  { field: 'department', headerName: 'Department', type: 'text' },
];

const TRAIL_COLUMNS: readonly ByItemColumnDef[] = [
  { field: 'aiRecommendation', headerName: 'Recommendation', type: 'aiRecommendation' },
  { field: 'workingPlan', headerName: 'Working Plan', type: 'select' },
];

/** Row keys that are never metric columns — identity, control, hierarchy, or card-back aliases. */
const SKIP_METRIC_FIELDS = new Set<string>([
  'article',
  'productId',
  'colorId',
  'styleId',
  'styleDescription',
  'department',
  'aiRecommendation',
  'workingPlan',
  'recommendation',
  'units',
  'gm',
  'md',
  'st',
  'unitsVsPlan',
  'revenueVsPlan',
  'stVsPlan',
  'l0_name',
  'l1_name',
  'l2_name',
  'l3_name',
]);

const STATIC_HEADER_BY_FIELD = new Map(
  BY_ITEM_COLUMNS.map((column) => [column.field, column.headerName]),
);

/**
 * Builds the By Item grid columns from the first loaded row.
 *
 * Identity and Working Plan / Recommendation stay fixed. Every other numeric cell on the sample
 * becomes a column: header from `label` (then the known static title, then the field name),
 * type from `format` / `change`. No sample row returns the static fallback so the shell still
 * has headers while the first page loads.
 */
export function buildByItemColumns(sampleRow?: ByItemTableRow): ByItemColumnDef[] {
  if (sampleRow === undefined) {
    return [...BY_ITEM_COLUMNS];
  }

  const metrics: ByItemColumnDef[] = [];
  for (const field of Object.keys(sampleRow)) {
    if (SKIP_METRIC_FIELDS.has(field)) continue;
    const cell = sampleRow[field];
    if (!isMetricCell(cell)) continue;
    metrics.push({
      field: field as ByItemTableField,
      headerName: metricHeader(field, cell),
      type: inferMetricType(cell),
    });
  }

  return [...LEAD_COLUMNS, ...metrics, ...TRAIL_COLUMNS];
}

function metricHeader(field: string, cell: ByItemComparisonCell | ByItemNumericCell): string {
  const labelled = cell.label?.trim();
  if (labelled !== undefined && labelled.length > 0) return labelled;
  return STATIC_HEADER_BY_FIELD.get(field) ?? field;
}

function inferMetricType(cell: ByItemComparisonCell | ByItemNumericCell): ByItemColumnType {
  const format = cell.format ?? '';
  const hasChange = 'change' in cell && cell.change != null;
  if (hasChange) {
    return format.includes('$') ? 'kpiComparisonCurrency' : 'kpiComparison';
  }
  if (format.includes('%')) return 'percentage';
  if (format.includes('$')) return 'kpiComparisonCurrency';
  return 'number';
}

function isMetricCell(cell: ByItemCell | string | undefined): cell is ByItemComparisonCell | ByItemNumericCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'number'
  );
}
