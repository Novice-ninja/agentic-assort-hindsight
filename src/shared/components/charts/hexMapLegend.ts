export interface HexMapLegendBand {
  min: number | null;
  max: number | null;
  label: string;
  color: string;
}

/**
 * How legend thresholds are written. Comes from the selected KPI's catalogue `metricType`
 * (`percent` / `currency` / `number` / `weeks`), not from the band config copy.
 */
export type HexMapLegendScaleKind = 'percent' | 'dollar' | 'unit' | 'straight';

const FALLBACK_HEX_COLOR = '#ffffff';

/**
 * Classify the selected KPI before rewriting legend labels. Unknown catalogue types infer from
 * the display label (`GM%`, `Sls$`) so a missing `metricType` still formats correctly.
 */
export function hexMapLegendScaleKind(
  metricType: string,
  metricLabel: string,
): HexMapLegendScaleKind {
  if (metricType === 'percent') return 'percent';
  if (metricType === 'currency') return 'dollar';
  if (metricType === 'number') return 'unit';
  if (metricType === 'weeks') return 'straight';
  if (metricLabel.includes('%')) return 'percent';
  if (metricLabel.includes('$')) return 'dollar';
  return 'straight';
}

function formatLegendThreshold(value: number, kind: HexMapLegendScaleKind): string {
  if (kind === 'percent') return `${value}%`;
  if (kind === 'dollar') return value < 0 ? `-$${Math.abs(value)}` : `$${value}`;
  return String(value);
}

function labelForBand(
  band: HexMapLegendBand,
  metricLabel: string,
  kind: HexMapLegendScaleKind,
): string {
  const { min, max } = band;
  if (min !== null && max === null) return `${metricLabel} ≥ ${formatLegendThreshold(min, kind)}`;
  if (min === null && max !== null) return `${metricLabel} ≤ ${formatLegendThreshold(max, kind)}`;
  if (min !== null && max !== null) {
    if (min === 0) {
      return `${formatLegendThreshold(min, kind)} < ${metricLabel} < ${formatLegendThreshold(max, kind)}`;
    }
    if (min < 0) {
      return `${formatLegendThreshold(min, kind)} < ${metricLabel} ≤ ${formatLegendThreshold(max, kind)}`;
    }
    return `${formatLegendThreshold(min, kind)} ≤ ${metricLabel} < ${formatLegendThreshold(max, kind)}`;
  }
  return metricLabel;
}

/** Rewrites band labels for the selected KPI. Thresholds and colours are unchanged. */
export function relabelHexMapLegend(
  bands: readonly HexMapLegendBand[],
  metricLabel: string,
  kind: HexMapLegendScaleKind,
): HexMapLegendBand[] {
  return bands.map((band) => ({
    ...band,
    label: labelForBand(band, metricLabel, kind),
  }));
}

/**
 * Colour for a metric value. Unbounded bands (`≥ 20%`, `≤ -20%`) are applied before interior
 * `[min, max)` ranges so a boundary like `-20` belongs to `≤ -20%`, not to `-20% < x ≤ -10%`.
 */
export function hexColorForValue(value: number, legend: readonly HexMapLegendBand[]): string {
  const unboundedHigh = legend.filter((band) => band.max === null);
  const unboundedLow = legend.filter((band) => band.min === null && band.max !== null);
  const interior = legend.filter((band) => band.min !== null && band.max !== null);
  for (const band of [...unboundedHigh, ...unboundedLow, ...interior]) {
    if (valueInBand(value, band)) return band.color;
  }
  return FALLBACK_HEX_COLOR;
}

export function valueInBand(value: number, band: HexMapLegendBand): boolean {
  const aboveMin = band.min === null || value >= band.min;
  const belowMax =
    band.max === null ? true : band.min === null ? value <= band.max : value < band.max;
  return aboveMin && belowMax;
}
