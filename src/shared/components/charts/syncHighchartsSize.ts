/**
 * Re-assert an explicit Highcharts size after browser zoom / Impact UI's
 * `setSize(null, "auto")` path, which otherwise collapses category heatmaps.
 */
import Highcharts from 'highcharts/esm/highcharts.js';
import './guardHighchartsSetSize';

type ChartLike = {
  container?: Element | null;
  renderTo?: Element | null;
  chartWidth?: number;
  chartHeight?: number;
  setSize: (width: number, height: number, animation?: boolean) => void;
};

type HighchartsNamespace = {
  charts?: Array<ChartLike | undefined>;
};

const namespace = Highcharts as unknown as HighchartsNamespace & {
  default?: HighchartsNamespace;
};

function chartList(): Array<ChartLike | undefined> {
  return namespace.charts ?? namespace.default?.charts ?? [];
}

export function findHighchartsIn(root: HTMLElement): ChartLike | undefined {
  return chartList().find((chart) => {
    if (chart == null) return false;
    const node = chart.container ?? chart.renderTo;
    return node instanceof Element && root.contains(node);
  });
}

/** Force width/height when they drifted (no animation). */
export function syncHighchartsSize(
  root: HTMLElement,
  width: number,
  height: number,
): boolean {
  if (width <= 0 || height <= 0) return false;
  const chart = findHighchartsIn(root);
  if (chart == null) return false;
  if (
    Math.abs((chart.chartWidth ?? 0) - width) < 2 &&
    Math.abs((chart.chartHeight ?? 0) - height) < 2
  ) {
    return true;
  }
  chart.setSize(width, height, false);
  return true;
}
