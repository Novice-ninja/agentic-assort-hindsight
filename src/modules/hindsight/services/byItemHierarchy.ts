import type {
  ByItemCell,
  ByItemComparisonCell,
  ByItemNumericCell,
  ByItemTableRow,
  ByItemTextCell,
} from '../types';
import { formatKpiValue } from './formatKpiValue';
import { DEFAULT_LEVEL_HIERARCHIES } from './visualHierarchy';

/** Wire fields that drive Product Hierarchy grouping in the By Item table. */
export const BY_ITEM_HIERARCHY_FIELDS = [
  'l0_name',
  'l1_name',
  'l2_name',
  'l3_name',
] as const;

export type ByItemHierarchyField = (typeof BY_ITEM_HIERARCHY_FIELDS)[number];

const HIERARCHY_FIELD_SET = new Set<string>(BY_ITEM_HIERARCHY_FIELDS);

/** True when a row key is a product-hierarchy level, not a metric. */
export function isByItemHierarchyField(field: string): boolean {
  return HIERARCHY_FIELD_SET.has(field);
}

/**
 * Selected level keys in config order (`l0` before `l1`, …). Selection order from the dropdown
 * is ignored so a planner cannot invert nesting.
 */
export function orderHierarchyLevels(
  selected: readonly string[],
  levelHierarchies: readonly string[] = DEFAULT_LEVEL_HIERARCHIES,
): string[] {
  const chosen = new Set(selected);
  return levelHierarchies.filter((key) => chosen.has(key));
}

export type ByItemHierarchyRowKind = 'group' | 'leaf';

/**
 * Flat tree node for the By Item grid. Hierarchy comes from `parentKey` (AG Grid tree data);
 * leaf nodes keep the original article/style identity for overrides and selection.
 */
export interface ByItemHierarchyNode {
  id: string;
  parentKey: string | null;
  rowKind: ByItemHierarchyRowKind;
  /** Label shown in the Product Hierarchy column. */
  hierarchyLabel: string;
  styleId: string;
  article?: string;
  cells: ByItemTableRow;
}

/**
 * Builds a flat parentKey tree from table rows and the selected hierarchy levels.
 *
 * Empty `levels` returns one leaf per row (flat table). Group rows carry rolled-up numeric
 * cells; product / recommendation / select cells are omitted so those columns render as "—".
 */
export function buildByItemHierarchyRows(
  rows: readonly ByItemTableRow[],
  levels: readonly string[],
): ByItemHierarchyNode[] {
  if (levels.length === 0) {
    return rows.map((cells, index) => toLeafNode(cells, index, null));
  }

  const groups = new Map<string, GroupAccumulator>();

  for (let index = 0; index < rows.length; index += 1) {
    const cells = rows[index];
    if (cells === undefined) continue;

    const path = levels.map((field) => hierarchyCellValue(cells, field));
    let parentKey: string | null = null;

    for (let depth = 0; depth < path.length; depth += 1) {
      const label = path[depth] ?? '—';
      const id = path.slice(0, depth + 1).join('\u0001');
      let group = groups.get(id);
      if (group === undefined) {
        group = {
          id,
          parentKey,
          hierarchyLabel: label,
          leaves: [],
        };
        groups.set(id, group);
      }
      // Every ancestor rolls up this leaf so intermediate groups show totals, not only the tip.
      group.leaves.push(cells);
      parentKey = id;
    }
  }

  const leafNodes: ByItemHierarchyNode[] = rows.map((cells, index) => {
    const path = levels.map((field) => hierarchyCellValue(cells, field));
    const parentKey = path.length > 0 ? path.join('\u0001') : null;
    return toLeafNode(cells, index, parentKey);
  });

  const groupNodes: ByItemHierarchyNode[] = Array.from(groups.values()).map((group) => ({
    id: `group:${group.id}`,
    parentKey: group.parentKey === null ? null : `group:${group.parentKey}`,
    rowKind: 'group',
    hierarchyLabel: group.hierarchyLabel,
    styleId: '',
    cells: aggregateGroupCells(group.leaves),
  }));

  // Remap leaf parents onto the `group:` id namespace used above.
  const remappedLeaves = leafNodes.map((leaf) => ({
    ...leaf,
    parentKey: leaf.parentKey === null ? null : `group:${leaf.parentKey}`,
  }));

  return [...groupNodes, ...remappedLeaves];
}

interface GroupAccumulator {
  id: string;
  parentKey: string | null;
  hierarchyLabel: string;
  leaves: ByItemTableRow[];
}

function toLeafNode(
  cells: ByItemTableRow,
  index: number,
  parentKey: string | null,
): ByItemHierarchyNode {
  const styleId = cells.styleId?.value ?? '';
  const article = cells.article?.trim() || undefined;
  return {
    id: article && article.length > 0 ? article : styleId || `row-${index}`,
    parentKey,
    rowKind: 'leaf',
    hierarchyLabel: styleId || article || '—',
    styleId,
    article,
    cells,
  };
}

/** Reads `lN_name.value`, falling back to an em dash when the level is missing or blank. */
export function hierarchyCellValue(row: ByItemTableRow, field: string): string {
  const cell = row[field];
  if (isTextCell(cell)) {
    const trimmed = cell.value.trim();
    return trimmed.length > 0 ? trimmed : '—';
  }
  return '—';
}

function isTextCell(cell: ByItemCell | string | undefined): cell is ByItemTextCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'string' &&
    !('options' in cell) &&
    !('narration' in cell) &&
    !('image' in cell) &&
    !('color' in cell)
  );
}

function isNumericCell(
  cell: ByItemCell | string | undefined,
): cell is ByItemComparisonCell | ByItemNumericCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'number'
  );
}

/**
 * Rolls absolute leaf metrics up by summing. Ratios use additive evidence supplied with
 * each cell, or known numerator/denominator columns. A rate with no supported basis stays
 * unavailable. Comparison change pills are dropped without a shared comparison baseline.
 */
function aggregateGroupCells(leaves: readonly ByItemTableRow[]): ByItemTableRow {
  if (leaves.length === 0) return {};

  const sample = leaves[0] ?? {};
  const aggregated: ByItemTableRow = {};
  const fields = new Set<string>();
  for (const leaf of leaves) {
    for (const field of Object.keys(leaf)) {
      fields.add(field);
    }
  }

  for (const field of fields) {
    if (
      field === 'article' ||
      field === 'productId' ||
      field === 'styleId' ||
      field === 'colorId' ||
      field === 'styleDescription' ||
      field === 'department' ||
      field === 'workingPlan' ||
      field === 'recommendation' ||
      field === 'aiRecommendation' ||
      isByItemHierarchyField(field)
    ) {
      continue;
    }

    const cells = leaves
      .map((leaf) => leaf[field])
      .filter(isNumericCell);
    if (cells.length === 0) continue;

    const template = cells[0] ?? sample[field];
    if (!isNumericCell(template)) continue;

    const format = template.format ?? '';
    const total = cells.reduce((sum, cell) => sum + cell.value, 0);
    const ratio = aggregateRatio(leaves, field);
    const isRatio = ratio.annotated || isRatioField(format, field);
    const value = isRatio ? ratio.value : total;
    if (value === undefined) continue;

    const next: ByItemComparisonCell | ByItemNumericCell = {
      value,
      format: template.format,
      name: template.name,
      label: template.label,
      formattedValue: formatKpiValue({
        value,
        format: template.format,
        displayValue: undefined,
      }),
    };

    if ('color' in template && template.color !== undefined) {
      (next as ByItemNumericCell).color = template.color;
    }

    aggregated[field] = next;
  }

  return aggregated;
}

interface RatioAggregation { numerator: number; denominator: number; multiplier: number }

function ratioEvidence(cell: unknown): RatioAggregation | undefined {
  if (!cell || typeof cell !== 'object' || !('aggregation' in cell)) return undefined;
  const basis = cell.aggregation;
  if (!basis || typeof basis !== 'object') return undefined;
  const { numerator, denominator, multiplier } = basis as Partial<RatioAggregation>;
  return typeof numerator === 'number' && Number.isFinite(numerator)
    && typeof denominator === 'number' && Number.isFinite(denominator) && denominator >= 0
    && typeof multiplier === 'number' && Number.isFinite(multiplier)
    ? { numerator, denominator, multiplier } : undefined;
}

function aggregateRatio(leaves: readonly ByItemTableRow[], field: string): { annotated: boolean; value?: number } {
  const evidence = leaves.map(leaf => ratioEvidence(leaf[field]));
  const annotated = evidence.some(value => value !== undefined);
  if (annotated) {
    // A partial basis would silently exclude some products from the denominator.
    if (evidence.some(value => value === undefined)) return { annotated };
    const bases = evidence as RatioAggregation[];
    const multiplier = bases[0].multiplier;
    if (bases.some(value => value.multiplier !== multiplier)) return { annotated };
    const numerator = bases.reduce((sum, value) => sum + value.numerator, 0);
    const denominator = bases.reduce((sum, value) => sum + value.denominator, 0);
    return { annotated, value: denominator > 0 ? numerator / denominator * multiplier : undefined };
  }
  const sumField = (key: string): number | undefined => {
    const cells = leaves.map(leaf => leaf[key]);
    return cells.every(isNumericCell) ? cells.reduce((sum, cell) => sum + cell.value, 0) : undefined;
  };
  const ratio = (numeratorKey: string, denominatorKey: string, multiplier = 1) => {
    const numerator = sumField(numeratorKey), denominator = sumField(denominatorKey);
    return numerator !== undefined && denominator !== undefined && denominator > 0
      ? numerator / denominator * multiplier : undefined;
  };
  if (['gross_margin_pct','gm_pct','gm'].includes(field)) return { annotated:false, value:ratio('gross_margin','revenue',100) };
  if (['sell_thru_pct','st'].includes(field)) return { annotated:false, value:ratio('qty_sold','buy_units',100) };
  if (field === 'aur') return { annotated:false, value:ratio('revenue','qty_sold') };
  return { annotated:false };
}

function isRatioField(format: string, field: string): boolean {
  if (format.includes('%')) return true;
  if (/_pct$/i.test(field) || /Pct$/i.test(field)) return true;
  if (format.includes('x') || ['ros','woh','aur','sales_per_sq_ft'].includes(field)) return true;
  return false;
}
