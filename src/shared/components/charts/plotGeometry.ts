import type { ChartSeries } from './types';

export interface PlotBox {
  width: number;
  height: number;
  padTop: number;
  padRight: number;
  padBottom: number;
  padLeft: number;
}

export const DEFAULT_PLOT: PlotBox = {
  width: 640,
  height: 220,
  padTop: 12,
  padRight: 8,
  padBottom: 28,
  padLeft: 48,
};

export function innerWidth(box: PlotBox): number {
  return box.width - box.padLeft - box.padRight;
}

export function innerHeight(box: PlotBox): number {
  return box.height - box.padTop - box.padBottom;
}

/**
 * A rounded axis maximum. Charts always start at zero so bar lengths stay proportional to
 * their values — a truncated axis exaggerates differences, which for performance data is
 * actively misleading.
 */
export function axisMax(series: ChartSeries[], stacked = false): number {
  const totals: number[] = [];

  if (stacked && series.length > 0) {
    const categoryCount = Math.max(...series.map((s) => s.values.length));
    for (let i = 0; i < categoryCount; i += 1) {
      totals.push(series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
    }
  } else {
    series.forEach((s) => {
      s.values.forEach((v) => {
        if (v !== null) totals.push(v);
      });
    });
  }

  const peak = totals.length > 0 ? Math.max(...totals, 0) : 0;
  if (peak === 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(peak));
  return Math.ceil(peak / magnitude) * magnitude;
}

/** Evenly spaced gridline values, including zero and the maximum. */
export function ticks(max: number, count = 4): number[] {
  return Array.from({ length: count + 1 }, (_, i) => (max / count) * i);
}

export function hasAnyValue(series: ChartSeries[]): boolean {
  return series.some((s) => s.values.some((v) => v !== null));
}
