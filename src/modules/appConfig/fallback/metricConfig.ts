import type { MetricConfigDto } from '../types';

/** Placement keys used by Hindsight overview metric-filter widgets in the fallback global config. */
export const FALLBACK_METRIC_FILTER_PLACEMENTS = [
  'charts-weekly',
  'charts-monthly',
  'charts-season',
] as const;

type MetricSeed = Omit<MetricConfigDto, 'uiComponent' | 'isEnabled'>;

/**
 * One catalogue identity per metric. Expanded to one DTO row per overview placement so merge
 * tags the same metric for every metric-filter widget until the live API sends real subsets.
 */
const METRIC_SEEDS: readonly MetricSeed[] = [
  {
    metricKey: 'revenue',
    description: 'Total income generated from sales.',
    displayValue: 'Sls$',
    metricType: '$',
  },
  {
    metricKey: 'qty_sold',
    description: 'Number of units sold to customers.',
    displayValue: 'SlsU',
    metricType: 'number',
  },
  {
    metricKey: 'gross_margin',
    description: 'Gross margin amount.',
    displayValue: 'GM $',
    metricType: '$',
  },
  {
    metricKey: 'gross_margin_pct',
    description: 'Gross margin percent.',
    displayValue: 'GM%',
    metricType: 'percent',
  },
  {
    metricKey: 'sell_thru_pct',
    description: 'Season sell-through: units sold as % of units available (BOP + receipts)',
    displayValue: 'ST%',
    metricType: 'percent',
  },
  {
    metricKey: 'mark_down_pct',
    description: 'Markdown percent.',
    displayValue: 'MD%',
    metricType: 'percent',
  },
  {
    metricKey: 'weeks_on_hand',
    description: 'Weeks of cover = avg daily on-hand / weekly rate of sale',
    displayValue: 'WOH',
    metricType: 'weeks',
  },
  {
    metricKey: 'receipts_units',
    description: 'Receipt units.',
    displayValue: 'RcptU',
    metricType: 'number',
  },
  {
    metricKey: 'receipts_revenue',
    description: 'Receipt revenue.',
    displayValue: 'Rcpt$',
    metricType: '$',
  },
  {
    metricKey: 'aur',
    description: 'Average selling price per unit sold.',
    displayValue: 'AUR',
    metricType: '$',
  },
  {
    metricKey: 'buy_units',
    description: 'Receipt/buy units.',
    displayValue: 'Buy Units',
    metricType: 'number',
  },
  {
    metricKey: 'ros',
    description: 'Rate of sale: units per store-week over the season',
    displayValue: 'ROS',
    metricType: 'number',
  },
  {
    metricKey: 'sell_thru_eop_pct',
    description:
      'EOP-based sell-through: units sold as % of (units sold + end-of-period inventory).',
    displayValue: 'ST% EOP',
    metricType: 'percent',
  },
  {
    metricKey: 'receipts_cost',
    description: 'Receipt cost.',
    displayValue: 'Rcpt Cost',
    metricType: '$',
  },
  {
    metricKey: 'sales_contribution',
    description: 'Sales contribution share.',
    displayValue: 'Sales Contrib',
    metricType: 'percent',
  },
  {
    metricKey: 'discount_pct',
    description: 'Discount percent.',
    displayValue: 'Disc%',
    metricType: 'percent',
  },
  {
    metricKey: 'option_count',
    description: 'Option count.',
    displayValue: 'Options',
    metricType: 'number',
  },
  {
    metricKey: 'depth',
    description: 'Assortment depth.',
    displayValue: 'Depth',
    metricType: 'number',
  },
  {
    metricKey: 'lost_sales',
    description: 'Lost sales.',
    displayValue: 'Lost Sales',
    metricType: '$',
  },
  // Planning All Plans cards still author `margin` in cardMetrics.
  {
    metricKey: 'margin',
    description: 'Profit amount after deducting costs (planning cards).',
    displayValue: 'Margin',
    metricType: '$',
  },
];

/**
 * Baked-in copy of the metric catalogue, used until the backend endpoint exists and whenever a
 * fetch fails. Held in wire form so it goes through the same mapper as a real response — one
 * mapping path means the fallback can never behave differently from the API.
 *
 * Keep this in step with `GET /v1/common/metrics-config`: it is what every widget labels itself
 * from when a user's config request fails, so a metric missing here is one shown by its raw key.
 *
 * Overview metric-filter widgets get one row per placement until the live payload sends
 * real per-widget subsets. Each row keeps a singular `uiComponent` string (same shape as the API).
 */
export const FALLBACK_METRIC_CONFIG_DTOS: MetricConfigDto[] = METRIC_SEEDS.flatMap((seed) =>
  FALLBACK_METRIC_FILTER_PLACEMENTS.map((uiComponent) => ({
    ...seed,
    isEnabled: true,
    uiComponent,
  })),
);
