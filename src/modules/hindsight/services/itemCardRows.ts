import { normaliseMetricKey } from '@modules/appConfig';
import type { ByItemTableField, VisualViewItem, VisualViewKpi } from '../types';
import { BY_ITEM_COLUMNS } from './byItemColumns';

/**
 * Row definitions for the two faces of an item card.
 *
 * `flipViewConfig.*.displayMetricList` chooses **which** metrics appear (and in what order).
 * Card copy — Style ID, "Sale Units", "Units (Vs Plan)", etc. — stays on the card so catalogue
 * short names (SlsU / Sls$) never replace those literals. Absent / empty lists keep the static
 * defaults below.
 */

function tableLabel(field: ByItemTableField): string {
  return BY_ITEM_COLUMNS.find((column) => column.field === field)?.headerName ?? field;
}

/** Where a front-face row gets its value. */
export type ItemCardFrontSource = 'styleId' | 'kpi';

export interface ItemCardFrontRow {
  id: string;
  label: string;
  source: ItemCardFrontSource;
  /**
   * Visual-view KPI keys to try, in order, lowercased. Several are listed because the backend's
   * keys are inconsistently cased and worded between metrics.
   */
  kpiKeys?: readonly string[];
}

/** Always-shown identity row above the configured front metrics. */
export const ITEM_CARD_STYLE_ID_ROW: ItemCardFrontRow = {
  id: 'styleId',
  label: tableLabel('styleId'),
  source: 'styleId',
};

/**
 * Front-face labels for configured metric keys. These are card copy, not catalogue display
 * values — e.g. `qty_sold` stays "Sale Units" rather than "SlsU".
 */
const FRONT_LABEL_BY_METRIC: Readonly<Record<string, string>> = {
  buy_units: 'Buy Units',
  qty_sold: 'Sale Units',
  sale_units: 'Sale Units',
  slsu: 'Sale Units',
  'sls$': 'Sls$',
  'gm%': 'GM%',
  'md%': 'MD%',
  'st%': 'ST%',
  woh: 'WOH',
  ros: 'ROS',
};

export const ITEM_CARD_FRONT_ROWS: readonly ItemCardFrontRow[] = [
  ITEM_CARD_STYLE_ID_ROW,
  {
    id: 'buyUnits',
    label: FRONT_LABEL_BY_METRIC.buy_units,
    source: 'kpi',
    kpiKeys: ['buy units', 'buy_units', 'buy-units'],
  },
  {
    id: 'saleUnits',
    label: FRONT_LABEL_BY_METRIC.qty_sold,
    source: 'kpi',
    // The backend has no "sale units"; `Qty Sold` / `slsu` (labelled SlsU) is the same measure.
    kpiKeys: ['qty sold', 'qty_sold', 'sale units', 'sale_units', 'slsu'],
  },
];

/** Comparison rows carry a change badge; plain rows are a value alone. */
export type ItemCardBackKind = 'comparison' | 'plain';

/** Card-back aliases on the table row — explicit union (ByItemTableField is an open string). */
export type ItemCardBackField = 'units' | 'revenue' | 'gm' | 'md' | 'woh' | 'st';

/** Card-back copy stays on the aliases, independent of kebab-case table headers. */
const CARD_BACK_LABEL: Readonly<Record<ItemCardBackField, string>> = {
  units: 'Units',
  revenue: 'Revenue',
  gm: 'GM%',
  md: 'MD%',
  woh: 'WOH',
  st: 'ST%',
};

export interface ItemCardBackRow {
  field: ItemCardBackField;
  label: string;
  kind: ItemCardBackKind;
  /** `strong` rows are the larger, darker labels in the design; `muted` are the smaller ones. */
  emphasis: 'strong' | 'muted';
}

export const ITEM_CARD_BACK_ROWS: readonly ItemCardBackRow[] = [
  {
    field: 'units',
    label: CARD_BACK_LABEL.units,
    kind: 'comparison',
    emphasis: 'strong',
  },
  {
    field: 'revenue',
    label: CARD_BACK_LABEL.revenue,
    kind: 'comparison',
    emphasis: 'strong',
  },
  { field: 'gm', label: CARD_BACK_LABEL.gm, kind: 'plain', emphasis: 'muted' },
  { field: 'md', label: CARD_BACK_LABEL.md, kind: 'plain', emphasis: 'muted' },
  { field: 'woh', label: CARD_BACK_LABEL.woh, kind: 'plain', emphasis: 'muted' },
  {
    field: 'st',
    label: CARD_BACK_LABEL.st,
    kind: 'comparison',
    emphasis: 'strong',
  },
];

/**
 * Catalogue metric key → By Item table field the back face reads.
 *
 * Visual-view / catalogue keys name the measure; the table payload exposes cells under these
 * field names. Unmapped keys are skipped rather than inventing empty rows.
 */
const BACK_FIELD_BY_METRIC: Readonly<Record<string, ItemCardBackField>> = {
  qty_sold: 'units',
  buy_units: 'units',
  slsu: 'units',
  revenue: 'revenue',
  'sls$': 'revenue',
  gross_margin_pct: 'gm',
  'gm%': 'gm',
  mark_down_pct: 'md',
  'md%': 'md',
  weeks_on_hand: 'woh',
  woh: 'woh',
  sell_thru_pct: 'st',
  sell_thru_eop_pct: 'st',
  'st%': 'st',
};

const COMPARISON_FIELDS: ReadonlySet<ItemCardBackField> = new Set([
  'units',
  'revenue',
  'st',
]);

function kpiIdentity(kpi: VisualViewKpi): string {
  return (kpi.name ?? kpi.key ?? kpi.label).trim();
}

function isStyleIdKpi(kpi: VisualViewKpi): boolean {
  const key = normaliseMetricKey(kpiIdentity(kpi)).replace(/_/g, '');
  return key === 'styleid';
}

/**
 * Front-face KPIs from the visual-view payload. Prefers `kpisFront`; falls back to the legacy
 * `kpis` list. Style ID is rendered from the product, so a style-id KPI is dropped.
 */
export function visualKpisForFront(
  item: Pick<VisualViewItem, 'kpis' | 'kpisFront'>,
): VisualViewKpi[] {
  const list = item.kpisFront ?? item.kpis ?? [];
  return list.filter((kpi) => !isStyleIdKpi(kpi));
}

/** Back-face KPIs from the visual-view payload. Empty means the table-row fallback still applies. */
export function visualKpisForBack(item: Pick<VisualViewItem, 'kpisBack'>): VisualViewKpi[] {
  return item.kpisBack ?? [];
}

/** KPI list for mapping a visual item onto a table row when `kpis` is absent. */
export function visualKpisForMapping(
  item: Pick<VisualViewItem, 'kpis' | 'kpisFront' | 'kpisBack'>,
): VisualViewKpi[] {
  if (item.kpis !== undefined && item.kpis.length > 0) return item.kpis;
  const seen = new Set<string>();
  const merged: VisualViewKpi[] = [];
  for (const kpi of [...(item.kpisFront ?? []), ...(item.kpisBack ?? [])]) {
    const key = kpiIdentity(kpi);
    if (key.length === 0 || seen.has(key)) continue;
    seen.add(key);
    merged.push(kpi);
  }
  return merged;
}

/**
 * Finds a KPI by key, name, or label, case- and separator-insensitively.
 *
 * The visual-view payload mixes conventions in one array — `Buy Units`, `Qty Sold`, `gm_pct`,
 * `weeks_on_hand` — so an exact key match finds only some of what is there.
 */
export function findKpi(
  kpis: readonly VisualViewKpi[],
  keys: readonly string[],
): VisualViewKpi | undefined {
  const normalise = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, '');
  const wanted = keys.map(normalise);
  return kpis.find((kpi) => {
    const candidates = [kpi.key, kpi.name, kpi.label].filter(
      (value): value is string => typeof value === 'string' && value.length > 0,
    );
    return candidates.some((value) => wanted.includes(normalise(value)));
  });
}

const FRONT_KPI_ALIASES: Readonly<Record<string, readonly string[]>> = {
  buy_units: ['buy units', 'buy_units', 'buy-units'],
  qty_sold: ['qty sold', 'qty_sold', 'sale units', 'sale_units', 'slsu'],
  sale_units: ['qty sold', 'qty_sold', 'sale units', 'sale_units', 'slsu'],
  slsu: ['qty sold', 'qty_sold', 'sale units', 'sale_units', 'slsu'],
  revenue: ['revenue', 'sls$'],
  'sls$': ['revenue', 'sls$'],
  'gm%': ['gm%', 'gross_margin_pct', 'gm_pct'],
  'md%': ['md%', 'mark_down_pct', 'md_pct'],
  'st%': ['st%', 'sell_thru_pct', 'sell_thru_eop_pct'],
  woh: ['woh', 'weeks_on_hand'],
  ros: ['ros'],
};

function kpiKeysFor(metricKey: string): readonly string[] {
  return FRONT_KPI_ALIASES[normaliseMetricKey(metricKey)] ?? [metricKey];
}

function frontLabelFor(
  metricKey: string,
  fallbackLabel?: (metricKey: string) => string,
): string {
  const normalised = normaliseMetricKey(metricKey);
  return (
    FRONT_LABEL_BY_METRIC[normalised] ?? fallbackLabel?.(metricKey) ?? metricKey
  );
}

/**
 * Front-face rows from `flipViewConfig.frontViewConfig.displayMetricList`.
 *
 * Style ID is always first (identity, not a metric). Configured metrics follow in authored order,
 * labelled with card copy ("Buy Units", "Sale Units", …).
 */
export function resolveItemCardFrontRows(
  displayMetricList: readonly string[] | undefined,
  fallbackLabel?: (metricKey: string) => string,
): readonly ItemCardFrontRow[] {
  if (displayMetricList === undefined || displayMetricList.length === 0) {
    return ITEM_CARD_FRONT_ROWS;
  }

  return [
    ITEM_CARD_STYLE_ID_ROW,
    ...displayMetricList.map((metricKey) => ({
      id: metricKey,
      label: frontLabelFor(metricKey, fallbackLabel),
      source: 'kpi' as const,
      kpiKeys: kpiKeysFor(metricKey),
    })),
  ];
}

/**
 * Back-face rows from `flipViewConfig.backViewConfig.displayMetricList`.
 *
 * Labels come from the By Item column headers; change badges still come from each cell's
 * `change` payload when the API sends one.
 */
export function resolveItemCardBackRows(
  displayMetricList: readonly string[] | undefined,
): readonly ItemCardBackRow[] {
  if (displayMetricList === undefined || displayMetricList.length === 0) {
    return ITEM_CARD_BACK_ROWS;
  }

  const rows: ItemCardBackRow[] = [];
  for (const metricKey of displayMetricList) {
    const field = BACK_FIELD_BY_METRIC[normaliseMetricKey(metricKey)];
    if (field === undefined) continue;
    const comparison = COMPARISON_FIELDS.has(field);
    rows.push({
      field,
      label: CARD_BACK_LABEL[field],
      kind: comparison ? 'comparison' : 'plain',
      emphasis: comparison ? 'strong' : 'muted',
    });
  }
  return rows;
}
