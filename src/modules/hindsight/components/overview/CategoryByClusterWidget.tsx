import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@app/providers/ThemeProvider';
import { useGlobalConfig } from '@modules/appConfig';
import { palette } from '@design-system';
import { Dropdown } from '@shared/components';
import { ImpactChart } from '@shared/components/charts';
import type { ChartCategory, ChartSeries } from '@shared/components/charts';
import { syncHighchartsSize } from '@shared/components/charts/syncHighchartsSize';
import { AIStrip } from '@shared/components/primitives/AIStrip/AIStrip';
import { useToast } from '@shared/components/primitives/Toast';
import type { LoadStatus } from '@shared/types';
import { getCategoryClusterMetricChart } from '../../api/getCategoryClusterMetricChart';
import { EmptyChartError } from '../../api/getRegularPromoSalesChart';
import { useLabel, usePlanFilterStrip } from '../../hooks';
import {
  CategoryClusterHierarchyError,
  resolveCategoryClusterScope,
  type CategoryClusterHierarchyScope,
} from '../../services/categoryClusterHierarchy';
import {
  HEATMAP_UI_WINDOW,
  colourAxisBounds,
  firstVisibleHeatmapRowIndex,
  heatmapRowSpacerPx,
  nextHeatmapWindowStart,
} from '../../services/categoryClusterHeatmapWindow';
import { formatChartValue } from '../../services/formatChartValue';
import { DEFAULT_LEVEL_HIERARCHIES } from '../../services/visualHierarchy';
import type { HeatmapData } from '../../types';
import styles from './CategoryByClusterWidget.module.css';

const CELL_HEIGHT = 44;
/** Minimum cluster column width inside the scrollable plot area. */
const CELL_WIDTH_MIN = 120;
/** Sticky cluster header height (pinned while the plot scrolls vertically). */
const X_AXIS_STICKY_HEIGHT = 36;
/** Small top inset inside the chart — cluster labels live in the sticky header. */
const CHART_MARGIN_TOP = 4;
/** Space reserved below the plot (padding only; labels sit on top). */
const AXIS_LABEL_BOTTOM = 12;
/** Right gutter so the last cluster column + tooltip are not clipped. */
const PLOT_MARGIN_RIGHT = 16;
/** Fixed viewport height — earlier floor; content scrolls instead of growing the card. */
const FIXED_CHART_HEIGHT = 355;
const CELL_BORDER_WIDTH = 4;
const CELL_RADIUS = 8;
const CHART_SPACING = 0;
/**
 * Category (y-axis) label band. Long names ellipsize on one line; opaque fill
 * covers scrolling cells so labels never look overlapped.
 */
const ROW_LABEL_WIDTH = 112;
const ROW_LABEL_TEXT_WIDTH = ROW_LABEL_WIDTH - 12;

const FIGMA_HEATMAP_SCALE = ['#fbe0e0', '#f8eec7', '#ddf2e7'] as const;

const DARK_HEATMAP_SCALE = [
  palette.rose[800],
  palette.amber[800],
  palette.emerald[800],
] as const;

type HeatmapPoint = [number, number, number | null];

interface HeatmapFormatterContext {
  point: { x: number; y: number; value?: number | null };
}

type ChartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: HeatmapData & { insightText?: string } }
  | { status: 'empty' }
  | { status: 'failed' };

function cellKey(rowId: string, columnId: string): string {
  return `${rowId}::${columnId}`;
}

function heatmapPoints(series: ChartSeries[]): HeatmapPoint[] {
  return series.flatMap((serie, yIndex) =>
    serie.values.map((value, xIndex) => [xIndex, yIndex, value] as HeatmapPoint),
  );
}

function colourStops(
  valueDirection: 'higherIsBetter' | 'lowerIsBetter',
  colours: readonly string[],
): [number, string][] {
  const scale = valueDirection === 'lowerIsBetter' ? [...colours].reverse() : colours;
  const lastIndex = Math.max(scale.length - 1, 1);
  return scale.map((colour, index) => [index / lastIndex, colour]);
}

function truncateAxisLabel(raw: string, maxChars = 14): string {
  const text = raw.trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1)}…`;
}

export interface CategoryByClusterWidgetProps {
  data?: HeatmapData;
  status?: LoadStatus;
  onRetry?: () => void;
  planCode?: string;
  seasonCode?: number | null;
}

export function CategoryByClusterWidget({
  planCode,
  seasonCode,
}: CategoryByClusterWidgetProps) {
  const { t } = useTranslation('hindsight');
  const label = useLabel();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const global = useGlobalConfig();
  const strip = usePlanFilterStrip(planCode);
  const levelHierarchies =
    global.hierarchy?.levelHierarchies ?? DEFAULT_LEVEL_HIERARCHIES;
  const levelHierarchiesRef = useRef(levelHierarchies);
  levelHierarchiesRef.current = levelHierarchies;

  // The priority demo supplies sell-through rates only. Do not offer currency or
  // margin selectors until the underlying ledger and labels support those measures.
  const metricKey = 'sell_thru_pct';
  const metricType = 'percent' as const;
  const selectedLabel = 'ST%';
  const title = t('categoryByCluster.title', {
    metric: selectedLabel,
    defaultValue: `Category × Cluster — ${selectedLabel || 'ST%'}`,
  });

  const [chartState, setChartState] = useState<ChartState>({ status: 'idle' });
  const inFlightRequestKeyRef = useRef<string | null>(null);
  const latestRequestKeyRef = useRef<string | null>(null);
  const fetchedRequestKeyRef = useRef<string | null>(null);
  const hierarchyCacheRef = useRef<Map<string, CategoryClusterHierarchyScope>>(new Map());
  const toastShownRef = useRef(false);

  const format = useCallback(
    (value: number | null | undefined): string => formatChartValue(value, metricType),
    [metricType],
  );

  const filterScopeKey = strip.groups
    .map((group) => `${group.key}:${group.values.map((value) => value.id).join(',')}`)
    .join('|');
  const stripGroupsRef = useRef(strip.groups);
  stripGroupsRef.current = strip.groups;
  const hierarchyEmpty = strip.status === 'succeeded' && !strip.groups.some(group => group.values.length > 0);

  const requestChart = useCallback(async () => {
    if (metricKey === undefined || metricKey.length === 0) return;
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return;
    if (strip.status !== 'succeeded') return;

    const requestKey = `${planCode}:${seasonCode}:${metricKey}:${filterScopeKey}`;
    if (hierarchyEmpty) {
      latestRequestKeyRef.current = requestKey;
      inFlightRequestKeyRef.current = null;
      fetchedRequestKeyRef.current = requestKey;
      toastShownRef.current = false;
      setChartState({ status: 'empty' });
      return;
    }
    if (inFlightRequestKeyRef.current === requestKey) return;
    if (fetchedRequestKeyRef.current === requestKey) return;

    inFlightRequestKeyRef.current = requestKey;
    latestRequestKeyRef.current = requestKey;
    setChartState((prev) => (prev.status === 'loading' ? prev : { status: 'loading' }));

    try {
      const hierarchy = await resolveCategoryClusterScope({
        planCode,
        groups: stripGroupsRef.current,
        levelHierarchies: levelHierarchiesRef.current,
        cache: hierarchyCacheRef.current,
      });

      if (latestRequestKeyRef.current !== requestKey) return;

      const next = await getCategoryClusterMetricChart({
        planCode,
        seasonCode,
        metric: metricKey,
        levelHierarchy: hierarchy.levelHierarchy,
        hierarchyScope: hierarchy.hierarchyScope,
      });

      if (latestRequestKeyRef.current !== requestKey) return;
      toastShownRef.current = false;
      fetchedRequestKeyRef.current = requestKey;
      // Keep Overview responsive — heavy heatmap paint is deferred below.
      startTransition(() => {
        setChartState({ status: 'ready', data: next });
      });
    } catch (error) {
      if (latestRequestKeyRef.current !== requestKey) return;

      if (error instanceof EmptyChartError) {
        toastShownRef.current = false;
        fetchedRequestKeyRef.current = requestKey;
        setChartState({ status: 'empty' });
        return;
      }

      if (!toastShownRef.current) {
        toastShownRef.current = true;
        const isHierarchy = error instanceof CategoryClusterHierarchyError;
        showToast({
          message: isHierarchy
            ? t(
                'categoryByCluster.hierarchyError',
                'Could not load hierarchy for Category × Cluster',
              )
            : t('categoryByCluster.chartError', 'Could not load Category × Cluster chart'),
          variant: 'error',
        });
      }
      setChartState({ status: 'failed' });
    } finally {
      if (inFlightRequestKeyRef.current === requestKey) {
        inFlightRequestKeyRef.current = null;
      }
    }
  }, [
    metricKey,
    planCode,
    seasonCode,
    strip.status,
    filterScopeKey,
    hierarchyEmpty,
    showToast,
    t,
  ]);

  useEffect(() => {
    void requestChart();
  }, [requestChart]);

  useEffect(() => {
    hierarchyCacheRef.current = new Map();
    toastShownRef.current = false;
    fetchedRequestKeyRef.current = null;
  }, [planCode]);

  const chartData = !hierarchyEmpty && chartState.status === 'ready' ? chartState.data : null;

  const values = useMemo(
    () =>
      new Map((chartData?.cells ?? []).map((cell) => [cellKey(cell.rowId, cell.columnId), cell.value])),
    [chartData?.cells],
  );

  const categories: ChartCategory[] = useMemo(
    () =>
      (chartData?.columns ?? []).map((column) => ({
        id: column.id,
        label: label(column.labelKey),
      })),
    [chartData?.columns, label],
  );
  const series: ChartSeries[] = useMemo(
    () =>
      (chartData?.rows ?? []).map((row) => ({
        id: row.id,
        label: label(row.labelKey),
        values: (chartData?.columns ?? []).map(
          (column) => values.get(cellKey(row.id, column.id)) ?? null,
        ),
      })),
    [chartData?.rows, chartData?.columns, label, values],
  );

  const colourBounds = useMemo(
    () => colourAxisBounds(chartData?.cells ?? []),
    [chartData?.cells],
  );

  // Row window — Highcharts only paints HEATMAP_UI_WINDOW rows; spacers keep scroll height.
  // Absolute row Y = windowStart * CELL_HEIGHT + localOffset, so scrollTop must NOT be
  // adjusted when the window slides (doing so inflated scrollTop and raced to the end).
  const [windowStart, setWindowStart] = useState(0);
  const windowStartRef = useRef(0);
  windowStartRef.current = windowStart;
  const plotScrollRef = useRef<HTMLDivElement | null>(null);
  const xAxisRailRef = useRef<HTMLDivElement | null>(null);

  const rowCount = series.length;
  const windowing = rowCount > HEATMAP_UI_WINDOW;
  const boundStart = windowing ? windowStart : 0;
  const boundEnd = windowing ? boundStart + HEATMAP_UI_WINDOW : rowCount;
  const windowedSeries = useMemo(
    () => (windowing ? series.slice(boundStart, boundEnd) : series),
    [series, windowing, boundStart, boundEnd],
  );

  useEffect(() => {
    setWindowStart(0);
    const root = plotScrollRef.current;
    if (root !== null) root.scrollTop = 0;
  }, [chartData]);

  useEffect(() => {
    if (!windowing) return;
    const root = plotScrollRef.current;
    if (root === null) return;

    let rafId = 0;
    let rafScheduled = false;

    const applyWindow = () => {
      rafScheduled = false;
      const viewed = firstVisibleHeatmapRowIndex(root.scrollTop, CELL_HEIGHT);
      const next = nextHeatmapWindowStart(viewed, windowStartRef.current, rowCount);
      if (next === windowStartRef.current) return;
      setWindowStart(next);
    };

    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      rafId = window.requestAnimationFrame(applyWindow);
    };

    root.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      root.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [windowing, rowCount, chartData]);

  const isUnavailable =
    hierarchyEmpty ||
    metricKey === undefined ||
    metricKey.length === 0 ||
    chartState.status === 'failed' ||
    chartState.status === 'empty' ||
    (chartState.status === 'ready' && series.length === 0);
  const hasFailed = chartState.status === 'failed';
  const isChartLoading =
    !hierarchyEmpty &&
    metricKey !== undefined &&
    metricKey.length > 0 &&
    (strip.status === 'idle' ||
      strip.status === 'loading' ||
      chartState.status === 'idle' ||
      chartState.status === 'loading');

  const isDarkTheme = theme === 'dark';
  const heatmapScale = isDarkTheme ? DARK_HEATMAP_SCALE : FIGMA_HEATMAP_SCALE;
  const cellBorderColour = isDarkTheme ? palette.graphite[2] : palette.graphite[10];
  const valueDirection = 'higherIsBetter' as const;

  // Fixed column geometry — never measure viewport. ResizeObserver + scrollbar
  // width feedback was freezing the Overview main thread and shrinking cells.
  const paintedRowCount = Math.max(windowedSeries.length, 1);
  const colCount = Math.max(categories.length, 1);
  const plotContentWidth = colCount * CELL_WIDTH_MIN;
  const scrollableMinWidth = plotContentWidth + ROW_LABEL_WIDTH + PLOT_MARGIN_RIGHT;
  const columnWidth = CELL_WIDTH_MIN;
  const chartBodyHeight = Math.max(
    paintedRowCount * CELL_HEIGHT + CHART_MARGIN_TOP + AXIS_LABEL_BOTTOM,
    FIXED_CHART_HEIGHT - X_AXIS_STICKY_HEIGHT,
  );
  const topSpacerPx = windowing ? heatmapRowSpacerPx(boundStart, CELL_HEIGHT) : 0;
  const bottomSpacerPx = windowing
    ? heatmapRowSpacerPx(Math.max(rowCount - boundEnd, 0), CELL_HEIGHT)
    : 0;
  const showClusterHeader =
    !isChartLoading && !isUnavailable && categories.length > 0;

  // Defer Highcharts mount until after the ready paint so Overview stays interactive.
  const [chartMounted, setChartMounted] = useState(false);
  useEffect(() => {
    if (chartState.status !== 'ready') {
      setChartMounted(false);
      return;
    }
    let cancelled = false;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const mount = () => {
      if (!cancelled) setChartMounted(true);
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(mount, { timeout: 250 });
    } else {
      timeoutId = window.setTimeout(mount, 0);
    }
    return () => {
      cancelled = true;
      if (idleId !== undefined) win.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [chartState.status, chartData]);

  // Capture-phase scroll sync — no MutationObserver / polling. Scroll does not bubble,
  // but it does fire on ancestors in the capture phase.
  useEffect(() => {
    if (!showClusterHeader) {
      const rail = xAxisRailRef.current;
      if (rail !== null) rail.style.transform = 'translate3d(0, 0, 0)';
      return;
    }
    const root = plotScrollRef.current;
    if (root === null) return;

    let rafId = 0;
    let pendingLeft = 0;
    let rafScheduled = false;

    const applyTransform = () => {
      rafScheduled = false;
      const rail = xAxisRailRef.current;
      if (rail === null) return;
      rail.style.transform = `translate3d(-${pendingLeft}px, 0, 0)`;
    };

    const onScrollCapture = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains('highcharts-scrolling')) return;
      pendingLeft = target.scrollLeft;
      if (rafScheduled) return;
      rafScheduled = true;
      rafId = window.requestAnimationFrame(applyTransform);
    };

    root.addEventListener('scroll', onScrollCapture, true);
    return () => {
      root.removeEventListener('scroll', onScrollCapture, true);
      window.cancelAnimationFrame(rafId);
    };
  }, [showClusterHeader]);

  // Browser zoom (⌘+/⌘−) triggers Impact's setSize(null,"auto") which squashes rows.
  // Re-assert the locked pixel height only — no ResizeObserver feedback loop.
  useEffect(() => {
    if (!chartMounted || chartState.status !== 'ready') return;
    const root = plotScrollRef.current;
    if (root === null) return;

    let timerId = 0;
    const reassert = () => {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => {
        const width = Math.max(root.clientWidth, 1);
        syncHighchartsSize(root, width, chartBodyHeight);
      }, 100);
    };

    reassert();
    window.visualViewport?.addEventListener('resize', reassert);
    return () => {
      window.visualViewport?.removeEventListener('resize', reassert);
      window.clearTimeout(timerId);
    };
  }, [chartMounted, chartState.status, chartBodyHeight]);

  const points = useMemo(() => heatmapPoints(windowedSeries), [windowedSeries]);
  const categoryLabels = useMemo(
    () => categories.map((category) => category.label),
    [categories],
  );
  const seriesLabels = useMemo(
    () => windowedSeries.map((serie) => serie.label),
    [windowedSeries],
  );

  const seriesData = useMemo(
    () => [
      {
        borderColor: cellBorderColour,
        borderRadius: CELL_RADIUS,
        borderWidth: CELL_BORDER_WIDTH,
        data: points,
        animation: false,
        dataLabels: {
          allowOverlap: true,
          color: '#1f2b4d',
          crop: false,
          enabled: true,
          inside: true,
          overflow: 'allow',
          padding: 0,
          style: {
            fontSize: '13px',
            fontWeight: '600',
            textOutline: 'none',
          },
          verticalAlign: 'middle' as const,
          formatter(this: HeatmapFormatterContext) {
            return format(this.point.value ?? null);
          },
        },
        name: title,
      },
    ],
    [cellBorderColour, points, format, title],
  );

  const chartOptions = useMemo(
    () => ({
      backgroundColor: '#ffffff',
      plotBackgroundColor: 'transparent',
      animation: false,
      // Lock pixel height so Impact setSize("auto") / zoom cannot squash rows.
      height: chartBodyHeight,
      marginLeft: ROW_LABEL_WIDTH,
      marginRight: PLOT_MARGIN_RIGHT,
      marginTop: CHART_MARGIN_TOP,
      marginBottom: AXIS_LABEL_BOTTOM,
      spacingBottom: CHART_SPACING,
      spacingLeft: CHART_SPACING,
      spacingRight: CHART_SPACING,
      spacingTop: CHART_SPACING,
      scrollablePlotArea: {
        // Fixed column pitch: each cluster is CELL_WIDTH_MIN CSS pixels.
        minWidth: scrollableMinWidth,
        opacity: 1,
        scrollPositionX: 0,
      },
    }),
    [scrollableMinWidth, chartBodyHeight],
  );

  const colorAxisOptions = useMemo(
    () => ({
      min: colourBounds.min,
      max: colourBounds.max,
      stops: colourStops(valueDirection, heatmapScale),
    }),
    [colourBounds.min, colourBounds.max, heatmapScale],
  );

  const plotOptionsOptions = useMemo(
    () => ({
      series: { animation: false },
      heatmap: {
        animation: false,
        borderColor: cellBorderColour,
        borderRadius: CELL_RADIUS,
        borderWidth: CELL_BORDER_WIDTH,
        dataLabels: {
          allowOverlap: true,
          color: '#1f2b4d',
          crop: false,
          enabled: true,
          inside: true,
          overflow: 'allow',
          padding: 0,
          style: {
            fontSize: '13px',
            fontWeight: '600',
            textOutline: 'none',
          },
          verticalAlign: 'middle' as const,
          formatter(this: HeatmapFormatterContext) {
            return format(this.point.value ?? null);
          },
        },
      },
    }),
    [cellBorderColour, format],
  );

  const tooltipOptions = useMemo(
    () => ({
      outside: true,
      positioner(
        this: {
          chart: {
            chartWidth: number;
            chartHeight: number;
            plotLeft: number;
            plotTop: number;
            pointer?: { chartPosition?: unknown };
            scrollablePlotArea?: {
              scrollingContainer?: { scrollLeft: number; scrollTop: number };
            };
          };
        },
        labelWidth: number,
        labelHeight: number,
        point: { plotX?: number; plotY?: number },
      ) {
        const { chart } = this;
        if (chart.pointer) {
          chart.pointer.chartPosition = undefined;
        }
        const scrollLeft =
          chart.scrollablePlotArea?.scrollingContainer?.scrollLeft ?? 0;
        const scrollTop =
          chart.scrollablePlotArea?.scrollingContainer?.scrollTop ?? 0;
        let x = chart.plotLeft + (point.plotX ?? 0) - scrollLeft - labelWidth / 2;
        let y = chart.plotTop + (point.plotY ?? 0) - scrollTop - labelHeight - 12;
        x = Math.max(4, Math.min(x, chart.chartWidth - labelWidth - 4));
        y = Math.max(4, Math.min(y, chart.chartHeight - labelHeight - 4));
        return { x, y };
      },
      formatter(this: HeatmapFormatterContext) {
        const xLabel = categories[this.point.x]?.label ?? this.point.x;
        const yLabel = windowedSeries[this.point.y]?.label ?? this.point.y;
        return `${yLabel} / ${xLabel}: ${format(this.point.value ?? null)}`;
      },
    }),
    [categories, windowedSeries, format],
  );

  const yAxisOptions = useMemo(
    () => ({
      categories: seriesLabels,
      gridLineWidth: 0,
      lineWidth: 0,
      min: 0,
      max: Math.max(seriesLabels.length - 1, 0),
      offset: 0,
      reversed: true,
      tickLength: 0,
      // Fixed row pitch — each category is exactly CELL_HEIGHT pixels (survives zoom).
      staticScale: CELL_HEIGHT,
      title: { text: null },
      labels: {
        align: 'right' as const,
        reserveSpace: true,
        useHTML: false,
        formatter(this: { value?: string | number }) {
          return truncateAxisLabel(String(this.value ?? ''));
        },
        style: {
          color: isDarkTheme ? palette.graphite[7] : palette.slate[800],
          fontSize: '12px',
          fontWeight: '600',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: `${ROW_LABEL_TEXT_WIDTH}px`,
        },
        x: -4,
      },
    }),
    [seriesLabels, isDarkTheme],
  );

  const xAxisOptions = useMemo(
    () => ({
      categories: categoryLabels,
      gridLineWidth: 0,
      lineWidth: 0,
      min: 0,
      max: Math.max(categoryLabels.length - 1, 0),
      opposite: true,
      tickLength: 0,
      // Column pitch comes from scrollablePlotArea.minWidth (= colCount × CELL_WIDTH_MIN).
      title: { text: null },
      labels: { enabled: false },
    }),
    [categoryLabels],
  );

  const legendOptions = useMemo(() => ({ enabled: false }), []);

  return (
    <div className={styles.wrapper} data-testid="category-by-cluster">
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.actions}>
            <Dropdown
              label={t('categoryByCluster.metricLabel', 'Metric')}
              labelOrientation="left"
              options={[{value:metricKey,label:selectedLabel}]}
              isMulti={false}
              isClearable={false}
              disabled
              placeholder={t('categoryByCluster.metricPlaceholder', 'Select')}
              noOptionMessage={t('categoryByCluster.noMetrics', 'No metrics available')}
              value={[metricKey]}
              onChange={() => {}}
              aria-label={t('categoryByCluster.metricLabel', 'Metric')}
              minWidth="130px"
              data-testid="chart-metric-filter"
            />
          </div>
        </div>
        {(isChartLoading || chartData?.insightText) && <AIStrip
          iconOnly
          text={chartData?.insightText ?? ''}
          loading={isChartLoading}
          showAskButton={false}
        />}
        <div className={styles.plotScroll} ref={plotScrollRef}>
          {showClusterHeader ? (
            <div
              className={styles.xAxisSticky}
              style={{ height: X_AXIS_STICKY_HEIGHT }}
            >
              <div
                className={styles.xAxisGutter}
                style={{ flex: `0 0 ${ROW_LABEL_WIDTH}px` }}
              />
              <div className={styles.xAxisViewport}>
                <div
                  ref={xAxisRailRef}
                  className={styles.xAxisRail}
                  style={{ width: plotContentWidth }}
                >
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className={styles.xAxisTick}
                      style={{ flex: `0 0 ${columnWidth}px` }}
                      title={category.label}
                    >
                      {category.label}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className={styles.xAxisGutter}
                style={{ flex: `0 0 ${PLOT_MARGIN_RIGHT}px` }}
              />
            </div>
          ) : null}
          {topSpacerPx > 0 ? (
            <div
              className={styles.rowSpacer}
              style={{ height: topSpacerPx }}
              aria-hidden
              data-testid="heatmap-row-spacer-top"
            />
          ) : null}
          <div
            className={styles.plotCanvas}
            style={{ height: chartBodyHeight, minHeight: chartBodyHeight }}
          >
            <ImpactChart
              graphType="heatmap"
              graphTitle={title}
              seriesData={seriesData}
              xAxisCategories={categoryLabels}
              xAxisTitle=""
              yAxisTitle=""
              height={chartBodyHeight}
              width={null}
              chartMarginBottom={AXIS_LABEL_BOTTOM}
              cardContainer={false}
              showHeader={false}
              showExpandButton={false}
              showDownloadButton={false}
              showDownloadMenu={false}
              // Impact ChartSkeleton while fetching or before the deferred Highcharts mount.
              isLoading={
                isChartLoading || (chartState.status === 'ready' && !chartMounted)
              }
              isEmpty={isUnavailable}
              fallbackContent={
                <p>
                  {hasFailed
                    ? t('states.error', 'This widget could not load')
                    : t('states.empty', 'No data for this selection')}
                </p>
              }
              chartOptions={chartOptions}
              colorAxisOptions={colorAxisOptions}
              legendOptions={legendOptions}
              plotOptionsOptions={plotOptionsOptions}
              tooltipOptions={tooltipOptions}
              yAxisOptions={yAxisOptions}
              xAxisOptions={xAxisOptions}
            />
          </div>
          {bottomSpacerPx > 0 ? (
            <div
              className={styles.rowSpacer}
              style={{ height: bottomSpacerPx }}
              aria-hidden
              data-testid="heatmap-row-spacer-bottom"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
