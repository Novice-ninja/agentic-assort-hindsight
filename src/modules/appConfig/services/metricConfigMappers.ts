import type { MetricCatalogue, MetricConfig, MetricConfigDto, MetricType } from '../types';

function optionalString(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined) return undefined;
  const text = value.trim();
  return text.length > 0 ? text : undefined;
}

/**
 * Wire spellings per normalised type. The catalogue mixes symbols with words (`$` alongside
 * `percent`) because the rows are authored by hand, so each type accepts the spellings it is
 * plausibly written with rather than one exact string.
 */
const METRIC_TYPES: Record<Exclude<MetricType, 'unknown'>, readonly string[]> = {
  currency: ['$', 'usd', 'currency', 'amount'],
  percent: ['%', 'percent', 'percentage', 'pct'],
  number: ['number', 'count', 'integer', 'units'],
  weeks: ['week', 'weeks'],
};

function warnMissingUiComponent(metricKey: string): void {
  if (process.env.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.warn(
    `[metrics-config] ${metricKey} is missing uiComponent; excluded from Metric/KPI dropdowns`,
  );
}

/** Maps the wire's free-form unit hint to a type the app can format against. */
export function toMetricType(value: string | null | undefined): MetricType {
  const wanted = optionalString(value)?.toLowerCase();
  if (wanted === undefined) return 'unknown';

  const match = Object.entries(METRIC_TYPES).find(([, spellings]) => spellings.includes(wanted));
  return match === undefined ? 'unknown' : (match[0] as MetricType);
}

/**
 * Maps the wire `uiComponent` string as-is. Missing values leave the row in the catalogue but
 * out of every Metric/KPI dropdown.
 */
export function toMetricUiComponent(
  value: string | null | undefined,
  metricKey: string,
): string | undefined {
  const text = optionalString(value);
  if (text === undefined) {
    warnMissingUiComponent(metricKey);
    return undefined;
  }
  return text;
}

/**
 * Maps a wire metric row to the model widgets consume.
 * - `key` = `metricKey` exactly as sent
 * - `label` = `displayValue` exactly as sent (falls back to key only when blank)
 * - `uiComponent` = `uiComponent` exactly as sent (string, not an array)
 */
export function mapMetricConfig(dto: MetricConfigDto): MetricConfig {
  const metricKey = optionalString(dto.metricKey) ?? '';
  const uiComponent = toMetricUiComponent(dto.uiComponent, metricKey || '(missing)');
  return {
    key: metricKey,
    label: optionalString(dto.displayValue) ?? metricKey,
    type: toMetricType(dto.metricType),
    enabled: dto.isEnabled !== false,
    description: optionalString(dto.description),
    ...(uiComponent === undefined ? {} : { uiComponent }),
  };
}

/**
 * Maps the wire list into the catalogue as an ordered list of rows.
 *
 * Every row is kept. The same `metricKey` may appear multiple times with different
 * `uiComponent` / `displayValue` values — we do not merge them into one entry.
 */
export function mapMetricConfigs(dtos: MetricConfigDto[]): MetricCatalogue {
  const catalogue: MetricConfig[] = [];

  for (const dto of dtos) {
    const key = optionalString(dto.metricKey) ?? '';
    if (key.length === 0) continue;
    catalogue.push(mapMetricConfig(dto));
  }

  return catalogue;
}
