import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMetricFilter, useMetricType } from '@modules/appConfig';
import { AIStrip, Dropdown } from '@shared/components/primitives';
import { useToast } from '@shared/components/primitives/Toast';
import { enable3dDragRotation, formatChartValue, ImpactChart } from '@shared/components/charts';
import type {
  PerformanceInfoDataset,
  PerformanceMetricsMapper,
  PerformanceStoreCount,
} from '../api/getPerformanceInfo';
import { useClusterScatterInsight } from '../hooks/useClusterScatterInsight';
import { buildClusterScatterSummarizePayload } from '../services/clusterScatterSummary';
import { mapStoreKpisToSeries } from '../services/mapStoreKpisToSeries';
import type { PerformanceStoreKpi } from '../types';
import styles from './wizard.module.css';

// const CHART_HEIGHT = 460;
const AXIS_DROPDOWN_WIDTH = '90px';
const CLUSTER_PALETTE = ['#6bbec2', '#658ec4', '#ad97ce', '#c64746', '#f19579'] as const;
const AXIS_LINE = '#d9dde7';
const AXIS_LABEL = '#60697d';
const FRAME_FILL = '#f5f6fa';

const METRIC_FILTER_SCOPE = {
  module: 'clustering',
  view: 'finalize',
  component: 'performanceClusters',
} as const;

const AXIS_LABEL_STYLE = {
  color: AXIS_LABEL,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '12px',
  fontWeight: '500',
} as const;

const AXIS_TITLE_STYLE = {
  color: AXIS_LABEL,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '14px',
  fontWeight: '500',
} as const;

/**
 * Highcharts 3D otherwise styles X / Y / Z independently (Y is dashed, X can
 * become categorical, Z inherits x-axis defaults and skips Impact's label CSS).
 * Shared numeric ticks keep the cube grid identical on every wall.
 */
const SHARED_AXIS_OPTIONS = {
  type: 'linear',
  categories: undefined,
  startOnTick: true,
  endOnTick: true,
  showFirstLabel: true,
  showLastLabel: true,
  gridLineWidth: 1,
  gridLineColor: AXIS_LINE,
  gridLineDashStyle: 'Solid',
  minorGridLineWidth: 0,
  lineWidth: 1,
  lineColor: AXIS_LINE,
  tickWidth: 0,
  tickLength: 0,
  labels: {
    style: AXIS_LABEL_STYLE,
    position3d: 'offset',
    skew3d: false,
  },
} as const;

export interface PerformanceClustersChartProps {
  /** Scatter rows. Tests pass dummy KPIs; Finalize passes API-mapped stores. */
  stores?: readonly PerformanceStoreKpi[];
  /** Raw performance-info rows sent to the summarize API. */
  datasets?: readonly PerformanceInfoDataset[];
  /** Store counts per cluster sent with the summarize payload. */
  storeCount?: PerformanceStoreCount;
  /** Catalogue metricKey → dataset field. Absent: dummy-column aliases. */
  metricsMapper?: PerformanceMetricsMapper;
  /** ImpactChart skeleton only — the rest of Finalize stays interactive. */
  isLoading?: boolean;
}

function optionLabel(
  options: readonly { value: string; label: string }[],
  key: string | undefined,
): string {
  if (key === undefined) return '';
  return options.find((option) => option.value === key)?.label ?? key;
}

/** Prefer authored defaults, then the next unused catalogue key so X/Y/Z never start equal. */
export function uniqueAxisKeys(
  preferred: readonly (string | undefined)[],
  optionValues: readonly string[],
): (string | undefined)[] {
  const used = new Set<string>();
  return preferred.map((pref) => {
    if (pref !== undefined && optionValues.includes(pref) && !used.has(pref)) {
      used.add(pref);
      return pref;
    }
    const next = optionValues.find((value) => !used.has(value));
    if (next === undefined) return pref;
    used.add(next);
    return next;
  });
}

export function PerformanceClustersChart({
  stores = [],
  datasets,
  storeCount,
  metricsMapper,
  isLoading = false,
}: PerformanceClustersChartProps) {
  const { t } = useTranslation('clustering');
  const { showToast } = useToast();
  const xFilter = useMetricFilter(METRIC_FILTER_SCOPE, 'xAxis');
  const yFilter = useMetricFilter(METRIC_FILTER_SCOPE, 'yAxis');
  const zFilter = useMetricFilter(METRIC_FILTER_SCOPE, 'zAxis');
  const allOptions = xFilter.options;
  const optionValues = useMemo(
    () => allOptions.map((option) => option.value),
    [allOptions],
  );

  const [override, setOverride] = useState<{
    x?: string;
    y?: string;
    z?: string;
  }>({});

  const [xKey, yKey, zKey] = useMemo(
    () =>
      uniqueAxisKeys(
        [
          override.x ?? xFilter.selected[0],
          override.y ?? yFilter.selected[0],
          override.z ?? zFilter.selected[0],
        ],
        optionValues,
      ),
    [
      optionValues,
      override.x,
      override.y,
      override.z,
      xFilter.selected,
      yFilter.selected,
      zFilter.selected,
    ],
  );

  const xLabel = optionLabel(allOptions, xKey);
  const yLabel = optionLabel(allOptions, yKey);
  const zLabel = optionLabel(allOptions, zKey);
  const xType = useMetricType(xKey ?? '');
  const yType = useMetricType(yKey ?? '');
  const zType = useMetricType(zKey ?? '');
  const title = t('finalize.scatterTitle');
  const axisOptions = useMemo(() => [...allOptions], [allOptions]);

  const mapped = useMemo(() => {
    if (xKey === undefined || yKey === undefined || zKey === undefined) {
      return mapStoreKpisToSeries([], { xKey: '', yKey: '', zKey: '' }, CLUSTER_PALETTE);
    }
    return mapStoreKpisToSeries(
      stores,
      { xKey, yKey, zKey, xType, yType, zType },
      CLUSTER_PALETTE,
      metricsMapper,
    );
  }, [stores, metricsMapper, xKey, yKey, zKey, xType, yType, zType]);

  const isEmpty = !isLoading && mapped.series.every((serie) => serie.data.length === 0);
  const insightPayload = useMemo(
    () =>
      isLoading
        ? null
        : buildClusterScatterSummarizePayload({
            xKey,
            yKey,
            zKey,
            datasets,
            storeCount,
            metricsMapper,
          }),
    [datasets, isLoading, metricsMapper, storeCount, xKey, yKey, zKey],
  );
  const insight = useClusterScatterInsight(insightPayload);
  const insightText = insight.text.trim();
  const stripLoading =
    isLoading ||
    (insightPayload !== null && (insight.status === 'idle' || insight.status === 'loading'));

  const xAxisOptions = useMemo(
    () => ({
      ...SHARED_AXIS_OPTIONS,
      ...mapped.xAxis,
      crosshair: false,
      labels: {
        ...SHARED_AXIS_OPTIONS.labels,
        formatter(this: { value: number }) {
          return formatChartValue(this.value, xType);
        },
      },
      title: {
        text: xLabel,
        style: AXIS_TITLE_STYLE,
        position3d: 'offset',
        skew3d: false,
      },
    }),
    [mapped.xAxis, xLabel, xType],
  );

  const yAxisOptions = useMemo(
    () => ({
      ...SHARED_AXIS_OPTIONS,
      ...mapped.yAxis,
      labels: {
        ...SHARED_AXIS_OPTIONS.labels,
        formatter(this: { value: number }) {
          return formatChartValue(this.value, yType);
        },
      },
      title: {
        text: yLabel,
        style: AXIS_TITLE_STYLE,
        position3d: 'offset',
        skew3d: false,
        reserveSpace: true,
        margin: 18,
        x: 0,
      },
    }),
    [mapped.yAxis, yLabel, yType],
  );

  const zAxisOptions = useMemo(
    () => ({
      ...SHARED_AXIS_OPTIONS,
      ...mapped.zAxis,
      title: {
        text: zLabel,
        style: AXIS_TITLE_STYLE,
        position3d: 'offset',
        skew3d: false,
      },
      showFirstLabel: false,
      labels: {
        ...SHARED_AXIS_OPTIONS.labels,
        step: 5,
        y: 14,
        formatter(this: { value: number }) {
          return formatChartValue(this.value, zType);
        },
      },
    }),
    [mapped.zAxis, zLabel, zType],
  );

  const tooltipOptions = useMemo(
    () => ({
      formatter() {
        const ctx = this as {
          color?: string;
          point?: {
            name?: string;
            x?: number;
            y?: number;
            z?: number;
            xMissing?: boolean;
            yMissing?: boolean;
            zMissing?: boolean;
          };
          series?: { name?: string };
        };
        const storeName = ctx.point?.name ?? '';
        const cluster = ctx.series?.name ?? '';
        const color = ctx.color ?? '#1f2b4d';
        const axisText = (
          value: number | undefined,
          missing: boolean | undefined,
          metricType: typeof xType,
        ) => (missing ? '—' : formatChartValue(value, metricType));
        return `<b>${storeName}</b><br/><span style="color:${color}">●</span> ${cluster}<br/>${xLabel}: <b>${axisText(ctx.point?.x, ctx.point?.xMissing, xType)}</b><br/>${yLabel}: <b>${axisText(ctx.point?.y, ctx.point?.yMissing, yType)}</b><br/>${zLabel}: <b>${axisText(ctx.point?.z, ctx.point?.zMissing, zType)}</b>`;
      },
    }),
    [xLabel, yLabel, zLabel, xType, yType, zType],
  );

  const selectIfUnique = useCallback(
    (
      axis: 'x' | 'y' | 'z',
      next: string[],
      current: string | undefined,
      others: readonly (string | undefined)[],
    ) => {
      const nextKey = next[0];
      if (nextKey === undefined || nextKey === current) return;
      if (others.includes(nextKey)) {
        showToast({ message: t('finalize.axisUniqueToast'), variant: 'error' });
        return;
      }
      setOverride((prev) => ({ ...prev, [axis]: nextKey }));
    },
    [showToast, t],
  );

  return (
    <div className={`${styles.chartSlot} ${styles.scatter3dSlot}`}>
      <ImpactChart
        graphType="scatter"
        is3D
        graphTitle={title}
        seriesData={mapped.series}
        xAxisTitle={xLabel}
        yAxisTitle={yLabel}
        // height={CHART_HEIGHT}
        chartMarginBottom={100}
        cardContainer
        showHeader
        showExpandButton={false}
        showDownloadButton={false}
        showDownloadMenu={false}
        showBuiltInDownloadOptions={false}
        showSwitchButton={false}
        isEmpty={isEmpty}
        isLoading={isLoading}
        topRightOptions={
          <>
            <Dropdown
              label="X"
              aria-label={t('finalize.axisX')}
              selectId="performance-clusters-axis-x"
              options={axisOptions}
              value={xKey === undefined ? [] : [xKey]}
              onChange={(next) => selectIfUnique('x', next, xKey, [yKey, zKey])}
              isClearable={false}
              isMulti={false}
              disabled={xFilter.disabled}
              minWidth={AXIS_DROPDOWN_WIDTH}
              width={AXIS_DROPDOWN_WIDTH}
              isRequired={true}
              // labelOrientation='left'
            />
            <Dropdown
              label="Y"
              aria-label={t('finalize.axisY')}
              selectId="performance-clusters-axis-y"
              options={axisOptions}
              value={yKey === undefined ? [] : [yKey]}
              onChange={(next) => selectIfUnique('y', next, yKey, [xKey, zKey])}
              isClearable={false}
              isMulti={false}
              disabled={yFilter.disabled}
              minWidth={AXIS_DROPDOWN_WIDTH}
              width={AXIS_DROPDOWN_WIDTH}
              isRequired={true}
              // labelOrientation='left'
            />
            <Dropdown
              label="Z"
              aria-label={t('finalize.axisZ')}
              selectId="performance-clusters-axis-z"
              options={axisOptions}
              value={zKey === undefined ? [] : [zKey]}
              onChange={(next) => selectIfUnique('z', next, zKey, [xKey, yKey])}
              isClearable={false}
              isMulti={false}
              disabled={zFilter.disabled}
              minWidth={AXIS_DROPDOWN_WIDTH}
              width={AXIS_DROPDOWN_WIDTH}
              isRequired={true}
              // labelOrientation='left'
            />
          </>
        }
        aboveChartComponent={
          stripLoading || insightText.length > 0 ? (
            <AIStrip
              text={insightText}
              loading={stripLoading}
              showAskButton={false}
            />
          ) : null
        }
        xAxisOptions={xAxisOptions}
        yAxisOptions={yAxisOptions}
        zAxisOptions={zAxisOptions}
        legendOptions={{
          align: 'left',
          itemDistance: 16,
          symbolHeight: 8,
          symbolWidth: 8,
          symbolRadius: 2,
          squareSymbol: true,
          margin: 16,
          y: 8,
        }}
        plotOptionsOptions={{
          scatter: {
            marker: { radius: 5, symbol: 'circle', lineWidth: 0 },
          },
          scatter3d: {
            marker: { radius: 5, symbol: 'circle', lineWidth: 0 },
          },
        }}
        chartOptions={{
          type: 'scatter3d',
          events: { load: enable3dDragRotation },
          spacingLeft: 0,
          spacingRight: 0,
          marginLeft: 24,
          marginRight: 8,
          options3d: {
            enabled: true,
            alpha: 16,
            beta: 22,
            depth: 320,
            viewDistance: 18,
            fitToPlot: true,
            frame: {
              size: 1,
              // Grids only paint on faces with visible: true. Force the three
              // cube walls on; hide the camera-facing sides so they don't cover
              // the plot. 'default' leaves right off and styles walls differently.
              bottom: { color: FRAME_FILL, size: 1, visible: true },
              back: { color: FRAME_FILL, size: 1, visible: true },
              left: { color: FRAME_FILL, size: 1, visible: true },
              right: { color: FRAME_FILL, size: 1, visible: false },
              top: { color: 'transparent', size: 0, visible: false },
              front: { color: 'transparent', size: 0, visible: false },
            },
          },
        }}
        tooltipOptions={tooltipOptions}
        showScrollX={true}
      />
    </div>
  );
}
