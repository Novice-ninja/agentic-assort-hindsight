import { useEffect, useMemo, useRef, useState } from 'react';
import { ImpactChart } from '@shared/components/charts';
import type { SalesMixRow } from './salesMixData';
import styles from './SalesMixDonut.module.css';

export interface SalesMixDonutProps {
  /** The same rows the table shows: one slice per row, sized by its share. */
  rows: SalesMixRow[];
  /** Slice (by row name) shown in its hover state, driven by the linked table. */
  hoveredName?: string | null;
  onHoverChange?: (name: string | null) => void;
}

/** Ring diameter as a share of the pane, i.e. 30% smaller than the original full-size donut. */
const DONUT_SCALE = '70%';

interface HoverablePoint {
  name: string;
  /** Highcharts' own pointer hover: sets the hover state and dims every other point. */
  onMouseOver: () => void;
  onMouseOut: () => void;
}

interface HoverableChart {
  series: Array<{ points: HoverablePoint[] }>;
  hoverPoint?: HoverablePoint;
  tooltip?: { refresh: (point: HoverablePoint) => void; hide: (delay?: number) => void };
}

/**
 * Impact UI donut (pie with an inner radius): no title, no header actions, no legend or slice
 * labels. It measures its pane and re-sizes whenever the pane resizes, and it mirrors hover with
 * the table: hovering a slice reports its row name, and a hovered row lights up its slice.
 */
export function SalesMixDonut({ rows, hoveredName, onHoverChange }: SalesMixDonutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HoverableChart | null>(null);
  // True while the effect below drives the chart; the hover events it triggers must not echo back.
  const syncingRef = useRef(false);
  const onHoverChangeRef = useRef(onHoverChange);
  onHoverChangeRef.current = onHoverChange;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return undefined;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Table -> chart: run the same hover path a real pointer would, so the slice is highlighted
  // and the other slices fade (the series' inactive state), then show the tooltip.
  useEffect(() => {
    const chart = chartRef.current;
    const points = chart?.series[0]?.points;
    if (!chart || !points) return;
    const active =
      hoveredName === null ? undefined : points.find((p) => p.name === hoveredName);
    syncingRef.current = true;
    try {
      if (active) {
        if (chart.hoverPoint !== active) active.onMouseOver();
        chart.tooltip?.refresh(active);
      } else {
        chart.hoverPoint?.onMouseOut();
        chart.tooltip?.hide(0);
      }
    } finally {
      syncingRef.current = false;
    }
  }, [hoveredName]);

  // Every object handed to the chart is memoised. A fresh object on each render makes the chart
  // re-apply its options, which redraws the series and drops the hover state we just set.
  const seriesData = useMemo(
    () => [
      {
        name: 'Sales mix',
        data: rows.map((row) => ({ name: row.name, y: row.share, color: row.color })),
      },
    ],
    [rows],
  );
  const legendOptions = useMemo(() => ({ enabled: false }), []);

  const chartOptions = useMemo(
    () => ({
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
      events: {
        load(this: HoverableChart) {
          chartRef.current = this;
        },
      },
    }),
    [],
  );

  const plotOptions = useMemo(
    () => ({
      pie: {
        center: ['50%', '50%'],
        size: DONUT_SCALE,
        innerSize: '65%',
        borderWidth: 0,
        dataLabels: { enabled: false },
        showInLegend: false,
        point: {
          events: {
            mouseOver(this: { name: string }) {
              if (!syncingRef.current) onHoverChangeRef.current?.(this.name);
            },
            mouseOut() {
              if (!syncingRef.current) onHoverChangeRef.current?.(null);
            },
          },
        },
      },
    }),
    [],
  );

  return (
    // The chart sits in an absolutely positioned layer so its own size never feeds back into the
    // pane's height: the pane is sized by the table, and the donut scales to whatever that is.
    <div ref={wrapperRef} className={styles.wrapper}>
      {size && size.width > 0 && size.height > 0 ? (
        <div className={styles.layer}>
          <ImpactChart
            graphType="pie"
            seriesData={seriesData}
            height={size.height}
            width={size.width}
            showHeader={false}
            cardContainer={false}
            showExpandButton={false}
            showDownloadButton={false}
            showDownloadMenu={false}
            chartMarginBottom={0}
            chartOptions={chartOptions}
            plotOptionsOptions={plotOptions}
            legendOptions={legendOptions}
          />
        </div>
      ) : null}
    </div>
  );
}
