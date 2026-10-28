import { decodeIaString } from '@shared/utils/format';
import type {
  ByItemChange,
  ByItemChangeStatus,
  ByItemComparisonCell,
  ByItemNumericCell,
  ByItemProductCell,
  ByItemTableRow,
  ByItemTableWireRow,
  ByItemTextCell,
  VisualViewComparison,
  VisualViewItem,
  VisualViewKpi,
  VisualViewProduct,
} from '../types';
import { formatKpiValue } from './formatKpiValue';
import { findKpi, visualKpisForMapping } from './itemCardRows';

const UNITS_KEYS = ['qty_sold', 'qty sold', 'sale_units', 'sale units', 'slsu', 'buy-units'] as const;
const REVENUE_KEYS = ['revenue', 'sls$'] as const;
const GM_KEYS = ['gross_margin_pct', 'gm_pct', 'gm%'] as const;
const MD_KEYS = ['mark_down_pct', 'md_pct', 'md%'] as const;
const WOH_KEYS = ['weeks_on_hand', 'woh'] as const;
const ST_KEYS = ['sell_thru_pct', 'sell_thru_eop_pct', 'st%'] as const;


/**
 * Maps a table-data `items[]` entry onto the cell-shaped row the By Item grid already renders.
 *
 * The endpoint sends product identity plus a KPI list; the grid still addresses `units`,
 * `revenue`, `gm`, and so on. This is the only place that join happens, so a new KPI key is a
 * mapping change rather than a renderer change.
 */
export function toByItemTableRow(item: VisualViewItem): ByItemTableRow {
  const { product } = item;
  const kpis = visualKpisForMapping(item);
  const styleId = product.styleId?.trim() || product.id;
  const article = product.article?.trim() || product.id;

  return {
    article,
    productId: { value: product.id },
    styleId: { value: styleId },
    colorId: product.colorId !== undefined && product.colorId.length > 0
      ? { value: product.colorId }
      : undefined,
    styleDescription: productCell(product),
    department:
      product.category !== undefined && product.category.length > 0
        ? { value: product.category }
        : undefined,
    units: numericCell(findKpi(kpis, UNITS_KEYS)),
    revenue: numericCell(findKpi(kpis, REVENUE_KEYS)),
    gm: numericCell(findKpi(kpis, GM_KEYS)),
    md: numericCell(findKpi(kpis, MD_KEYS)),
    woh: numericCell(findKpi(kpis, WOH_KEYS)),
    st: numericCell(findKpi(kpis, ST_KEYS)),
    workingPlan: item.workingPlan,
    aiRecommendation: item.aiRecommendation,
  };
}

/**
 * Indexes table rows for card-back lookup. Article is unique per colourway; styleId is only
 * used when both the card and the row have no article.
 */
export function indexTableRowsForCards(rows: readonly ByItemTableRow[]): {
  byArticle: Map<string, ByItemTableRow>;
  byStyleId: Map<string, ByItemTableRow>;
} {
  const byArticle = new Map<string, ByItemTableRow>();
  const byStyleId = new Map<string, ByItemTableRow>();
  for (const row of rows) {
    const article = row.article?.trim();
    if (article !== undefined && article.length > 0) {
      byArticle.set(article, row);
      continue;
    }
    const styleId = row.styleId?.value?.trim();
    if (styleId !== undefined && styleId.length > 0 && !byStyleId.has(styleId)) {
      byStyleId.set(styleId, row);
    }
  }
  return { byArticle, byStyleId };
}

/** Matching By Item table row for a card, or `undefined` when the cache has not landed it yet. */
export function tableRowForCard(
  index: ReturnType<typeof indexTableRowsForCards>,
  article: string | undefined,
  styleId: string,
): ByItemTableRow | undefined {
  const articleKey = article?.trim();
  if (articleKey !== undefined && articleKey.length > 0) {
    return index.byArticle.get(articleKey);
  }
  const styleKey = styleId.trim();
  if (styleKey.length === 0) return undefined;
  return index.byStyleId.get(styleKey);
}

/**
 * Flattens a table-data wire row onto the UI row model: unwrap `article.value`, format numeral
 * masks, and copy snake_case metric cells onto the card-back aliases (`units`, `gm`, …).
 */
export function normalizeByItemTableRow(row: ByItemTableWireRow): ByItemTableRow {
  const styleDescription = isProductCell(row.styleDescription)
    ? { ...row.styleDescription, value: decodeIaString(row.styleDescription.value) }
    : undefined;
  const department = isTextCell(row.department)
    ? { ...row.department, value: decodeIaString(row.department.value) }
    : undefined;

  const normalized: ByItemTableRow = {
    ...row,
    article: unwrapArticle(row.article),
    styleDescription,
    department,
    l0_name: decodeTextCell(row.l0_name),
    l1_name: decodeTextCell(row.l1_name),
    l2_name: decodeTextCell(row.l2_name),
    l3_name: decodeTextCell(row.l3_name),
  };

  for (const field of Object.keys(row)) {
    if (field === 'article') continue;
    const cell = row[field];
    if (isFormattableCell(cell)) {
      normalized[field] = formatNumericCell(cell);
    }
  }

  normalized.units = normalized.units ?? normalized.qty_sold ?? normalized.buy_units;
  normalized.gm = normalized.gm ?? normalized.gross_margin_pct;
  normalized.md = normalized.md ?? normalized.mark_down_pct;
  normalized.st = normalized.st ?? normalized.sell_thru_pct;

  const ai = normalized.aiRecommendation;
  if (ai !== undefined && typeof ai === 'object' && 'narration' in ai) {
    normalized.aiRecommendation = {
      ...ai,
      value: decodeIaString(ai.value),
      narration: decodeIaString(ai.narration),
    };
  }

  return normalized;
}

function isFormattableCell(
  cell: ByItemTableWireRow[string],
): cell is ByItemComparisonCell | ByItemNumericCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'number'
  );
}

function isProductCell(cell: ByItemTableWireRow[string]): cell is ByItemProductCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'string'
  );
}

function isTextCell(cell: ByItemTableWireRow[string]): cell is ByItemTextCell {
  return (
    cell !== undefined &&
    typeof cell === 'object' &&
    'value' in cell &&
    typeof cell.value === 'string' &&
    !('image' in cell) &&
    !('color' in cell)
  );
}

function decodeTextCell(
  cell: ByItemTableWireRow[string] | ByItemTextCell | undefined,
): ByItemTextCell | undefined {
  if (!isTextCell(cell)) return undefined;
  return { ...cell, value: decodeIaString(cell.value) };
}

function unwrapArticle(article: string | ByItemTextCell | undefined): string | undefined {
  if (typeof article === 'string') {
    const trimmed = article.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (article !== undefined && typeof article.value === 'string') {
    const trimmed = article.value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}

function formatNumericCell(
  cell: ByItemComparisonCell | ByItemNumericCell,
): ByItemComparisonCell | ByItemNumericCell {
  if (cell.format === undefined || cell.format.trim().length === 0) {
    return cell;
  }
  return {
    ...cell,
    formattedValue: formatKpiValue({
      value: cell.value,
      format: cell.format,
      displayValue: cell.formattedValue,
    }),
  };
}

function productCell(product: VisualViewProduct): ByItemTableRow['styleDescription'] {
  const imageUrl = product.showImage === false ? '' : (product.imageUrl ?? '');
  return {
    value: product.name,
    color:
      product.colorId !== undefined && isCssColor(product.colorId)
        ? { value: product.colorId }
        : undefined,
    image:
      imageUrl.length > 0
        ? { url: imageUrl, alt: product.name }
        : undefined,
  };
}

function isCssColor(value: string): boolean {
  return value.startsWith('#') || value.startsWith('rgb');
}

function numericCell(
  kpi: VisualViewKpi | undefined,
): ByItemComparisonCell | ByItemNumericCell | undefined {
  if (kpi === undefined || kpi.value === null) return undefined;

  const change = changeFrom(kpi.comparison);
  const formattedValue =
    kpi.formattedValue !== undefined && kpi.formattedValue.length > 0
      ? kpi.formattedValue
      : undefined;

  if (change === undefined) {
    return { value: kpi.value, formattedValue };
  }

  return { value: kpi.value, formattedValue, change };
}

function changeFrom(
  comparison: VisualViewKpi['comparison'],
): ByItemChange | undefined {
  if (comparison === undefined || comparison === null) return undefined;
  const entry = Array.isArray(comparison) ? comparison[0] : comparison;
  if (entry === undefined) return undefined;
  return {
    value: entry.delta ?? 0,
    label: deltaLabel(entry),
    metric: entry.label,
    status: toChangeStatus(entry.sentiment),
  };
}

function deltaLabel(entry: VisualViewComparison): string {
  if (entry.delta === null) return '';
  const sign = entry.delta > 0 ? '+' : '';
  return `${sign}${entry.delta}${entry.deltaUnit ?? ''}`;
}

function toChangeStatus(sentiment: VisualViewComparison['sentiment']): ByItemChangeStatus {
  if (sentiment === 'positive' || sentiment === 'negative') return sentiment;
  return 'neutral';
}
