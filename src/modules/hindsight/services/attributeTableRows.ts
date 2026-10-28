import { decodeIaString } from '@shared/utils/format';
import type {
  AttributeBreakdownRow,
  AttributeMetricCell,
  AttributeProgressCell,
  AttributeTableApiRow,
  AttributeTableApiTrend,
  AttributeTrendCell,
  AttributeValueCell,
  ColumnConfigEntry,
  ColumnConfigSubHeader,
} from '../types';
import { resolveAttributeField } from './attributeBreakdownColumns';
import { formatByNumeral, progressFromFormatter } from './numeralFormat';

/**
 * Adapts the By Attribute table endpoint's rows to the cells the columns address.
 *
 * The endpoint sends flat, unformatted `snake_case` scalars, so percentages are formatted here
 * and a movement's direction and colour are derived from its sign.
 */

function percent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function isNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function nonEmpty(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isTrendObject(value: unknown): value is AttributeTableApiTrend {
  return typeof value === 'object' && value !== null && 'direction' in value;
}

function attributeCell(row: AttributeTableApiRow): AttributeValueCell {
  const attrValue = row.attr_value;

  if (typeof attrValue === 'object' && attrValue !== null) {
    return {
      value: nonEmpty(attrValue.value) ? decodeIaString(attrValue.value) : '',
      significance: nonEmpty(attrValue.significance)
        ? { label: decodeIaString(attrValue.significance), variant: 'primary' }
        : null,
    };
  }

  return {
    value: nonEmpty(attrValue) ? decodeIaString(attrValue) : '',
    significance: nonEmpty(row.significance)
      ? { label: decodeIaString(row.significance), variant: 'primary' }
      : null,
  };
}

function formatTrendMagnitude(delta: number): string {
  return Math.abs(delta).toFixed(2);
}

function trendCellFromObject(trend: AttributeTableApiTrend): AttributeTrendCell {
  const delta = trend.delta ?? 0;
  const direction = trend.direction ?? 'flat';
  const sentiment = trend.sentiment ?? 'neutral';

  const colorMap: Record<string, 'success' | 'danger' | 'default'> = {
    positive: 'success',
    negative: 'danger',
    neutral: 'default',
  };

  const sign = direction === 'up' ? '+' : direction === 'down' ? '-' : '';
  const suffix = trend.deltaUnit === 'percent' ? '%' : '';

  return {
    value: delta,
    formattedValue: `${sign}${formatTrendMagnitude(delta)}${suffix}`,
    direction,
    color: colorMap[sentiment] ?? 'default',
  };
}

function trendCellFromNumber(value: number): AttributeTrendCell {
  return {
    value,
    formattedValue: percent(value),
    direction: value > 0 ? 'up' : value < 0 ? 'down' : 'flat',
    color: value > 0 ? 'success' : value < 0 ? 'danger' : 'neutral',
  };
}

const SIGNAL_COLORS: Record<string, 'success' | 'neutral' | 'danger'> = {
  grow: 'success',
  hold: 'neutral',
  exit: 'danger',
};

const SENTIMENT_COLORS: Record<string, 'success' | 'danger' | 'default'> = {
  positive: 'success',
  negative: 'danger',
  neutral: 'default',
};

function isSignalObject(
  value: unknown,
): value is { sentiment?: string; value?: string } {
  return typeof value === 'object' && value !== null && 'value' in value;
}

function signalCell(signal: AttributeTableApiRow['signal']): AttributeBreakdownRow['signal'] {
  if (isSignalObject(signal)) {
    const label = nonEmpty(signal.value) ? decodeIaString(signal.value) : '';
    if (!label) return undefined;
    return {
      label,
      status: SENTIMENT_COLORS[signal.sentiment ?? 'neutral'] ?? 'default',
    };
  }
  if (!nonEmpty(signal)) return undefined;
  return {
    label: decodeIaString(signal),
    status: SIGNAL_COLORS[signal.toLowerCase()] ?? 'default',
  };
}

/**
 * Formats a value as compact USD currency: `35507095.74` → `$35.51M`.
 */
function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function toAttributeBreakdownRow(
  row: AttributeTableApiRow,
): AttributeBreakdownRow {
  const share = row.rev_share;
  const margin = row.gross_margin_percentage;
  const sellThrough = row.sell_through_percentage;
  const revenue = row.sales_revenue;
  const trendRaw = row.trend_yoy;

  let trendYOY: AttributeTrendCell | undefined;
  if (isTrendObject(trendRaw)) {
    trendYOY = trendCellFromObject(trendRaw);
  } else if (isNumber(trendRaw)) {
    trendYOY = trendCellFromNumber(trendRaw);
  }

  const signal = signalCell(row.signal);

  return {
    attribute: attributeCell(row),
    ...(isNumber(share)
      ? {
          performanceOrgRev: {
            value: share,
            progress: Math.min(100, Math.max(0, share)),
            formattedValue: percent(share),
          },
        }
      : {}),
    ...(isNumber(sellThrough)
      ? {
          performanceOrgST: {
            value: sellThrough,
            formattedValue: percent(sellThrough),
            color: 'default' as const,
          },
        }
      : {}),
    ...(isNumber(margin)
      ? {
          performanceOrgGM: {
            value: margin,
            formattedValue: percent(margin),
            color: 'default' as const,
          },
        }
      : {}),
    ...(isNumber(revenue)
      ? {
          salesRevenue: {
            value: revenue,
            formattedValue: formatCompactCurrency(revenue),
            color: 'default' as const,
          },
        }
      : {}),
    ...(trendYOY ? { trendYOY } : {}),
    ...(signal ? { signal } : {}),
  };
}

export function toAttributeBreakdownRows(
  rows: readonly AttributeTableApiRow[],
): AttributeBreakdownRow[] {
  return rows.map(toAttributeBreakdownRow);
}

// ---------------------------------------------------------------------------
// Column-config formatting (numeral masks from the column-config API)
// ---------------------------------------------------------------------------

type ColumnConfigLeaf = Pick<
  ColumnConfigSubHeader,
  'column_name' | 'type' | 'is_hidden' | 'formatter' | 'extra'
>;

function isNumericLeaf(leaf: ColumnConfigLeaf): boolean {
  const cellType = leaf.extra?.cellType;
  if (cellType === 'trend' || cellType === 'badge') return false;
  if (leaf.type === 'object') return false;
  return leaf.type === 'number' || Boolean(leaf.formatter);
}

function collectNumericLeaves(
  entries: readonly ColumnConfigEntry[],
): Map<string, ColumnConfigLeaf> {
  const map = new Map<string, ColumnConfigLeaf>();

  for (const entry of entries) {
    if (entry.sub_headers.length > 0) {
      for (const sub of entry.sub_headers) {
        if (!sub.is_hidden && isNumericLeaf(sub)) {
          map.set(sub.column_name, sub);
        }
      }
      continue;
    }

    if (!entry.is_hidden && isNumericLeaf(entry)) {
      map.set(entry.column_name, entry);
    }
  }

  return map;
}

function toNumericCell(
  value: number,
  leaf: ColumnConfigLeaf,
): AttributeProgressCell | AttributeMetricCell {
  const formattedValue = formatByNumeral(value, leaf.formatter);

  if (leaf.extra?.cellType === 'progress') {
    return {
      value,
      progress: progressFromFormatter(value, leaf.formatter),
      formattedValue,
    };
  }

  return {
    value,
    formattedValue,
    color: 'default' as const,
  };
}

/**
 * Formats every numeric column named in the column-config API, using that column's `formatter`
 * mask via numeral. Results are keyed by the same field the grid column addresses, so org-level
 * cells overwrite the static adapter's fallback formatting when config is present.
 */
export function extractDynamicFields(
  row: AttributeTableApiRow,
  columnConfigEntries: readonly ColumnConfigEntry[],
): Record<string, AttributeProgressCell | AttributeMetricCell> {
  if (columnConfigEntries.length === 0) return {};

  const leaves = collectNumericLeaves(columnConfigEntries);
  const result: Record<string, AttributeProgressCell | AttributeMetricCell> = {};

  for (const [columnName, leaf] of leaves) {
    const rawValue = row[columnName];
    const numValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    if (!Number.isFinite(numValue)) continue;

    result[resolveAttributeField(columnName)] = toNumericCell(numValue, leaf);
  }

  return result;
}

/**
 * Adapts raw API rows to the breakdown row shape including config-formatted fields.
 */
export function toAttributeBreakdownRowsWithConfig(
  rows: readonly AttributeTableApiRow[],
  columnConfigEntries: readonly ColumnConfigEntry[],
): AttributeBreakdownRow[] {
  return rows.map((row) => ({
    ...toAttributeBreakdownRow(row),
    ...extractDynamicFields(row, columnConfigEntries),
  }));
}
