/**
 * Measure-after-render helpers for Overview cartesian charts.
 *
 * Highcharts (via Impact UI) chooses 0° vs 45° internally. We never set rotation.
 * Prefer SVG `getBBox()` — CSS overflow / scrollablePlotArea can clip paint so
 * `getBoundingClientRect()` reports the cropped box and we would never grow.
 */

export interface LabelFitBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface LabelFitOptions {
  maxExtra: number;
  hysteresis: number;
}

export interface LabelFitChartUpdate {
  extra: number;
  height: number;
  marginBottom: number;
}

function overlapY(a: LabelFitBox, b: LabelFitBox): number {
  return Math.min(a?.bottom ?? 0, b?.bottom ?? 0) - Math.max(a?.top ?? 0, b?.top ?? 0);
}

function boxesOverlap(a: LabelFitBox, b: LabelFitBox): boolean {
  return a?.left < b?.right && a?.right > b?.left && overlapY(a, b) > 0;
}

/**
 * Positive = content sticks out of (or collides inside) the chart box and we must grow.
 * Negative = unused room at the bottom and we can shrink extra back toward the floor.
 */
export function labelFitOverflow(input: {
  container: LabelFitBox;
  labels: LabelFitBox | null;
  legend: LabelFitBox | null;
}): number {
  if (input?.labels === null) return 0;

  const contentBottom = Math.max(
    input?.labels?.bottom ?? 0,
    input?.legend?.bottom ?? input?.labels?.bottom ?? 0,
  );
  let overflow = contentBottom - input.container.bottom;

  if (input?.legend !== null && boxesOverlap(input?.labels, input?.legend)) {
    overflow = Math.max(overflow, overlapY(input?.labels, input?.legend));
  }

  return overflow;
}

export function nextLabelFitExtra(
  current: number,
  overflow: number,
  options: LabelFitOptions,
): number {
  if (Math.abs(overflow) < options.hysteresis) return current;
  const next = Math.min(options.maxExtra, Math.max(0, current + overflow));
  if (Math.abs(next - current) < options.hysteresis) return current;
  return next;
}

export function applyLabelFit(input: {
  extra: number;
  overflow: number;
  plotHeight: number;
  marginBottom: number;
  maxExtra: number;
  hysteresis: number;
}): LabelFitChartUpdate | null {
  const extra = nextLabelFitExtra(input?.extra ?? 0, input?.overflow ?? 0, {
    maxExtra: input?.maxExtra ?? 0,
    hysteresis: input?.hysteresis ?? 0,
  });
  if (extra === input?.extra) return null;
  return {
    extra,
    height: input?.plotHeight + extra,
    marginBottom: input?.marginBottom + extra,
  };
}

/** How much taller the Highcharts box can be if the card already stretched with its row. */
export function measureFillExtra(input: {
  wrapperHeight: number;
  chartTop: number;
  plotHeight: number;
}): number {
  const available = input?.wrapperHeight - input?.chartTop;
  return Math.max(0, Math.round(available - input?.plotHeight));
}

export function resolveFitExtras(input: {
  marginExtra: number;
  heightExtra: number;
  overflow: number;
  fillExtra: number;
  hysteresis: number;
  maxExtra: number;
}): { marginExtra: number; heightExtra: number } | null {
  const marginExtra = nextLabelFitExtra(input?.marginExtra ?? 0, input?.overflow ?? 0, {
    maxExtra: input?.maxExtra ?? 0,
    hysteresis: input?.hysteresis ?? 0,
  });
  const heightExtra = Math.max(marginExtra, input?.fillExtra ?? 0);
  if (
    Math.abs(marginExtra - input?.marginExtra) < input?.hysteresis &&
    Math.abs(heightExtra - input?.heightExtra) < input?.hysteresis
  ) {
    return null;
  }
  return { marginExtra, heightExtra };
}

function svgBox(element: Element): LabelFitBox | null {
  const svg = element as SVGGraphicsElement;
  if (typeof svg?.getBBox !== 'function') return null;
  try {
    const box = svg?.getBBox();
    if (box?.width <= 0 && box?.height <= 0) return null;
    return {
      top: box?.y ?? 0,
      bottom: box?.y + box?.height,
      left: box?.x ?? 0,
      right: box?.x + box?.width,
    };
  } catch {
    return null;
  }
}

export function boxFromElement(element: Element): LabelFitBox {
  const rect = element?.getBoundingClientRect();
  return {
    top: rect?.top ?? 0,
    bottom: rect?.bottom ?? 0,
    left: rect?.left ?? 0,
    right: rect?.right ?? 0,
  };
}

function chartPixelHeight(container: HTMLElement): number {
  const svg = container?.querySelector('svg');
  if (svg !== null) {
    const attr = Number(svg.getAttribute('height'));
    if (Number.isFinite(attr) && attr > 0) return attr;
  }
  return container?.getBoundingClientRect().height ?? 0;
}

/** Reads the live Highcharts groups. Prefers unclipped SVG bounds. */
export function measureLabelFitOverflow(container: HTMLElement): number {
  const labelsEl = container?.querySelector('.highcharts-xaxis-labels');
  const legendEl = container?.querySelector('.highcharts-legend');
  const labelsSvg = labelsEl === null ? null : svgBox(labelsEl);
  const legendSvg = legendEl === null ? null : svgBox(legendEl);

  if (labelsSvg !== null) {
    return labelFitOverflow({
      container: { top: 0, bottom: chartPixelHeight(container), left: 0, right: 1 },
      labels: labelsSvg,
      legend: legendSvg,
    });
  }

  return labelFitOverflow({
    container: boxFromElement(container),
    labels: labelsEl === null ? null : boxFromElement(labelsEl),
    legend: legendEl === null ? null : boxFromElement(legendEl),
  });
}

export function measureWrapperFillExtra(
  wrapper: HTMLElement,
  plotHeight: number,
): number {
  const chart = wrapper?.querySelector('.highcharts-container');
  if (!(chart instanceof HTMLElement)) return 0;
  const top = chart?.getBoundingClientRect()?.top - wrapper?.getBoundingClientRect()?.top;
  return measureFillExtra({
    wrapperHeight: wrapper?.clientHeight,
    chartTop: top,
    plotHeight,
  });
}
