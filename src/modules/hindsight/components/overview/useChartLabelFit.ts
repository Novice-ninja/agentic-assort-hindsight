import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  measureLabelFitOverflow,
  measureWrapperFillExtra,
  resolveFitExtras,
} from './chartLabelFit';
import { OVERVIEW_LAYOUT } from './overviewChartLayout';

/**
 * Minimal Highcharts chart surface used after paint.
 * Impact UI does not expose rotation or a fit-labels callback.
 *
 * `container` is optional because Highcharts / Impact UI can fire `load` /
 * `redraw` during destroy (e.g. route change) after the DOM node is cleared.
 */
export interface ChartLabelFitTarget {
  container?: HTMLElement | null;
}

export interface UseChartLabelFitConfig {
  plotHeight: number;
  marginBottom: number;
  maxExtra?: number;
  hysteresis?: number;
}

/** True when the chart still has a live DOM container we can measure. */
export function isLiveChartTarget(
  chart: ChartLabelFitTarget | null | undefined,
): chart is ChartLabelFitTarget & { container: HTMLElement } {
  const container = chart?.container;
  return container instanceof HTMLElement && container.isConnected;
}

/**
 * After Highcharts paints:
 * - `marginExtra` grows the bottom band so rotated ticks + legend fit (capped).
 * - `heightExtra` is at least that, and also fills leftover card height when the
 *   row already stretched (so the SVG uses the whitespace instead of sitting
 *   clipped above a gap).
 *
 * Size is applied via React `height` / `chartMarginBottom` props so a vendor
 * remount cannot wipe `chart.update`. Extra is not reset on `load`.
 *
 * Fit runs on `load`, real width changes, and font ready — never on every
 * `redraw` (height writes cause redraw and would feedback-loop).
 */
export function useChartLabelFit({
  plotHeight,
  marginBottom,
  maxExtra = OVERVIEW_LAYOUT.maxExtra,
  hysteresis = OVERVIEW_LAYOUT.hysteresis,
}: UseChartLabelFitConfig) {
  const marginExtraRef = useRef(0);
  const heightExtraRef = useRef(0);
  const [marginExtra, setMarginExtra] = useState(0);
  const [heightExtra, setHeightExtra] = useState(0);
  const applyingRef = useRef(false);
  const stepsRef = useRef(0);
  const chartRef = useRef<ChartLabelFitTarget | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastWidthRef = useRef(0);

  const apply = useCallback(
    (chart: ChartLabelFitTarget) => {
      // Tear-down / remount can invoke events with a dead chart instance.
      if (!isLiveChartTarget(chart)) return;

      chartRef.current = chart;
      if (applyingRef.current) return;
      if (stepsRef.current >= OVERVIEW_LAYOUT.maxSteps) return;

      const overflow = measureLabelFitOverflow(chart.container);
      const fillExtra =
        wrapperRef.current === null
          ? 0
          : measureWrapperFillExtra(wrapperRef.current, plotHeight);
      const next = resolveFitExtras({
        marginExtra: marginExtraRef.current,
        heightExtra: heightExtraRef.current,
        overflow,
        fillExtra,
        hysteresis,
        maxExtra,
      });
      if (next === null) return;

      marginExtraRef.current = next.marginExtra;
      heightExtraRef.current = next.heightExtra;
      stepsRef.current += 1;
      applyingRef.current = true;
      setMarginExtra(next.marginExtra);
      setHeightExtra(next.heightExtra);
      requestAnimationFrame(() => {
        applyingRef.current = false;
      });
    },
    [hysteresis, maxExtra, plotHeight],
  );

  const chartEvents = useMemo(
    () => ({
      load(this: ChartLabelFitTarget) {
        stepsRef.current = 0;
        apply(this);
      },
    }),
    [apply],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper === null || typeof ResizeObserver === 'undefined') return;

    lastWidthRef.current = wrapper.clientWidth;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Skip feedback from our own height writes and ignore non-width resizes.
        if (applyingRef.current) return;
        const width = wrapper.clientWidth;
        if (Math.abs(width - lastWidthRef.current) < 2) return;
        lastWidthRef.current = width;
        stepsRef.current = 0;
        if (chartRef.current !== null) apply(chartRef.current);
      });
    });
    observer.observe(wrapper);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [apply]);

  useEffect(() => {
    const fonts = document.fonts;
    if (fonts === undefined) return;
    let cancelled = false;
    void fonts.ready.then(() => {
      if (cancelled) return;
      stepsRef.current = 0;
      const chart = chartRef.current;
      if (isLiveChartTarget(chart)) apply(chart);
    });
    return () => {
      cancelled = true;
    };
  }, [apply]);

  useEffect(() => {
    return () => {
      chartRef.current = null;
    };
  }, []);

  return {
    marginExtra,
    heightExtra,
    chartHeight: plotHeight + heightExtra,
    chartMarginBottom: marginBottom + marginExtra,
    wrapperRef,
    chartEvents,
  };
}
