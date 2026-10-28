import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  METRIC_FILTER_KEY,
  placementForTimeGrain,
  useComponentConfig,
  useMetricFilter,
  useMetricLabel,
  useMetricType,
} from '@modules/appConfig';
import { Dropdown } from '@shared/components';
import { ImpactChart, seriesColour } from '@shared/components/charts';
import { AIStrip } from '@shared/components/primitives/AIStrip/AIStrip';
import { Button, ButtonGroup } from '@shared/components/vendor/impact-ui';
import { useAIChat } from '@shared/context';
import type { LoadStatus } from '@shared/types';
import {
  EmptyChartError,
  getRegularPromoSalesChart,
} from '../../api/getRegularPromoSalesChart';
import { useCardInsight, useLabel, useVisualHierarchyFilter } from '../../hooks';
import { buildChartSummarizePayload, chartInsightScope } from '../../services/chartSummary';
import { buildInsightDisplayHtml } from '../../services/buildInsightDisplayHtml';
import { joinInsightProse } from '../../services/insightProse';
import {
  grainFromRollupType,
  type ChartTimeGrain,
} from '../../services/chartTimeGrain';
import { formatAxisTick } from '../../services/formatChartValue';
import type { VersionChartData } from '../../types';
import { OVERVIEW_LAYOUT } from './overviewChartLayout';
import { useChartLabelFit } from './useChartLabelFit';
import styles from './RegularPromoTrendWidget.module.css';

/** Where this widget's metric dropdown reads its config from. */
const METRIC_FILTER_SCOPE = {
  module: 'hindsight',
  view: 'overview',
  component: 'regularPromoSales',
} as const;

export interface RegularPromoTrendWidgetProps {
  data?: VersionChartData;
  status?: LoadStatus;
  onRetry?: () => void;
  planCode?: string;
  seasonCode?: number | null;
}

/**
 * What the widget knows about the metric currently selected. Data belongs to the `ready` case
 * alone, so no state can carry a chart the request did not produce.
 */
type ChartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: VersionChartData }
  | { status: 'empty' }
  | { status: 'failed' };

/**
 * Time-series comparison of a KPI across LY / LLY / Optimised LY / Forecast / Plan
 * at weekly or monthly grain. Hierarchy selections aggregate into one line per version.
 */
export function RegularPromoTrendWidget({
  planCode,
  seasonCode,
}: RegularPromoTrendWidgetProps) {
  const { t } = useTranslation('hindsight');
  const label = useLabel();
  const { askAboutInsight } = useAIChat();
  const componentConfig = useComponentConfig(
    METRIC_FILTER_SCOPE.module,
    METRIC_FILTER_SCOPE.view,
    METRIC_FILTER_SCOPE.component,
  );
  const defaultGrain = grainFromRollupType(componentConfig?.defaultRollupType);
  const [timeGrain, setTimeGrain] = useState<ChartTimeGrain>(defaultGrain);
  const activePlacement = placementForTimeGrain(componentConfig?.metricKeys, timeGrain);
  const metricFilter = useMetricFilter(METRIC_FILTER_SCOPE, METRIC_FILTER_KEY, activePlacement);
  const hierarchyFilter = useVisualHierarchyFilter(METRIC_FILTER_SCOPE, planCode);
  /**
   * Multi-select: keep a draft while the menu is open and only commit (→ chart refetch)
   * when the planner closes it (click outside / blur).
   */
  const [hierarchyDraft, setHierarchyDraft] = useState<string[] | null>(null);
  const hierarchyDraftRef = useRef<string[] | null>(null);

  const commitHierarchySelection = useCallback(() => {
    const next = hierarchyDraftRef.current;
    hierarchyDraftRef.current = null;
    setHierarchyDraft(null);
    if (next === null) return;

    const current = hierarchyFilter.selected;
    const unchanged =
      next.length === current.length && next.every((value, index) => value === current[index]);
    if (unchanged) return;
    hierarchyFilter.select(next);
  }, [hierarchyFilter]);
  const openHierarchyMenu = useCallback(() => {
    hierarchyDraftRef.current = hierarchyFilter.selected;
    setHierarchyDraft(hierarchyFilter.selected);
  }, [hierarchyFilter.selected]);

  const changeHierarchyDraft = useCallback((values: string[]) => {
    hierarchyDraftRef.current = values;
    setHierarchyDraft(values);
  }, []);

  const [chartState, setChartState] = useState<ChartState>({ status: 'idle' });
  const inFlightRequestKeyRef = useRef<string | null>(null);
  const latestRequestKeyRef = useRef<string | null>(null);
  const lastReadyDataRef = useRef<VersionChartData | null>(null);
  /** Request key that produced `lastReadyDataRef` — never reuse chart data across grain/metric/filter changes. */
  const lastReadyRequestKeyRef = useRef<string | null>(null);

  // Client-config default applies on first mount / when config arrives; session toggles stay.
  const configDefaultApplied = useRef(false);
  useEffect(() => {
    if (configDefaultApplied.current) return;
    if (componentConfig?.defaultRollupType === undefined) return;
    configDefaultApplied.current = true;
    setTimeGrain(grainFromRollupType(componentConfig.defaultRollupType));
  }, [componentConfig?.defaultRollupType]);

  const metricKey = metricFilter.selected[0];
  const metricType = useMetricType(metricKey ?? '');
  const grainOptions = useMemo(
    () => [
      { value: 'week', label: t('regularPromoTrend.weekly', 'Weekly') },
      { value: 'month', label: t('regularPromoTrend.monthly', 'Monthly') },
    ],
    [t],
  );
  const hierarchyReady =
    !hierarchyFilter.enabled || hierarchyFilter.chartFilters !== null || hierarchyFilter.empty;
  const requestChart = useCallback(async () => {
    if (metricKey === undefined) return;
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return;
    if (hierarchyFilter.empty) {
      latestRequestKeyRef.current = null;
      inFlightRequestKeyRef.current = null;
      lastReadyDataRef.current = null;
      lastReadyRequestKeyRef.current = null;
      setChartState({ status: 'empty' });
      return;
    }
    if (hierarchyFilter.enabled && hierarchyFilter.chartFilters === null) return;

    const hierarchyValues = hierarchyFilter.chartFilters?.levelHierarchyValue ?? [];
    const requestKey = hierarchyFilter.enabled
      ? `${planCode}:${seasonCode}:${metricKey}:${timeGrain}:${hierarchyFilter.chartFilters?.levelHierarchy}:${hierarchyValues.join(',')}`
      : `${planCode}:${seasonCode}:${metricKey}:${timeGrain}`;
    if (inFlightRequestKeyRef.current === requestKey) return;

    inFlightRequestKeyRef.current = requestKey;
    latestRequestKeyRef.current = requestKey;
    setChartState({ status: 'loading' });
    try {
      const data = await getRegularPromoSalesChart({
        planCode,
        seasonCode,
        metric: metricKey,
        timeGrain,
        ...(hierarchyFilter.chartFilters !== null
          ? {
              levelHierarchy: hierarchyFilter.chartFilters.levelHierarchy,
              ...(hierarchyFilter.chartFilters.levelHierarchyValue !== undefined
                ? { levelHierarchyValue: hierarchyFilter.chartFilters.levelHierarchyValue }
                : {}),
              hierarchyScope: hierarchyFilter.chartFilters.hierarchyScope,
            }
          : {}),
      });
      if (latestRequestKeyRef.current !== requestKey) return;
      lastReadyDataRef.current = data;
      lastReadyRequestKeyRef.current = requestKey;
      setChartState({ status: 'ready', data });
    } catch (error) {
      if (latestRequestKeyRef.current !== requestKey) return;
      if (error instanceof EmptyChartError) {
        lastReadyDataRef.current = null;
        lastReadyRequestKeyRef.current = null;
        setChartState({ status: 'empty' });
        return;
      }
      // Same selection re-fetch failed — keep the chart that already matches this key.
      if (
        lastReadyDataRef.current !== null &&
        lastReadyRequestKeyRef.current === requestKey
      ) {
        setChartState({ status: 'ready', data: lastReadyDataRef.current });
        return;
      }
      // Grain / metric / filter changed: prior chart belongs to another selection.
      const hadStaleDifferentSelection = lastReadyDataRef.current !== null;
      lastReadyDataRef.current = null;
      lastReadyRequestKeyRef.current = null;
      setChartState({ status: hadStaleDifferentSelection ? 'empty' : 'failed' });
    } finally {
      if (inFlightRequestKeyRef.current === requestKey) {
        inFlightRequestKeyRef.current = null;
      }
    }
  }, [
    planCode,
    seasonCode,
    metricKey,
    timeGrain,
    hierarchyFilter.enabled,
    hierarchyFilter.empty,
    hierarchyFilter.chartFilters,
  ]);

  useEffect(() => {
    void requestChart();
  }, [requestChart]);

  const selectedLabel =
    metricFilter.options.find((o) => o.value === metricFilter.selected[0])?.label ?? '';
  const title = t('regularPromoTrend.title', {
    metric: selectedLabel,
    defaultValue: `Regular + Promo ${selectedLabel}`,
  });
  const chartData = !hierarchyFilter.empty && chartState.status === 'ready' ? chartState.data : null;
  const chartSource = chartData?.source ?? null;

  const metricLabel = useMetricLabel(metricKey ?? '');
  const insightPayload = useMemo(
    () => (chartSource != null ? buildChartSummarizePayload(chartSource, metricLabel) : null),
    [chartSource, metricLabel],
  );

  const {
    status: insightStatus,
    bullets: insightBullets,
    request: requestInsight,
  } = useCardInsight({
    planCode: chartSource?.filters.planCode,
    seasonCode: chartSource?.filters.seasonCode ?? null,
    scope: chartSource != null ? `${chartInsightScope(chartSource)}|${timeGrain}` : '',
    payload: insightPayload,
  });

  useEffect(() => {
    if (insightPayload !== null) {
      requestInsight();
    }
  }, [insightPayload, requestInsight]);

  const insightText = joinInsightProse(insightBullets.map((b) => b.text));
  const insightLooksBroken =
    /null/i.test(insightText.trim()) || insightText.trim().toUpperCase() === 'NULL';
  const { marginExtra, chartHeight, chartMarginBottom, wrapperRef, chartEvents } =
    useChartLabelFit({
      plotHeight: OVERVIEW_LAYOUT.regularPromo.plotHeight,
      marginBottom: OVERVIEW_LAYOUT.regularPromo.marginBottom,
    });
  const categories = useMemo(
    () =>
      chartData?.categories.map((category) => {
        const raw = label(category.labelKey);
        const period = Number(raw);
        if (!Number.isFinite(period)) return raw;
        return timeGrain === 'month'
          ? t('regularPromoTrend.monthLabel', { n: period, defaultValue: `Month ${period}` })
          : t('regularPromoTrend.weekLabel', { n: period, defaultValue: `Week ${period}` });
      }) ?? [],
    [chartData?.categories, label, t, timeGrain],
  );
  const [visibleRange, setVisibleRange] = useState<[number, number] | null>(null);
  useEffect(() => setVisibleRange(null), [chartData?.categories, timeGrain]);
  const rangeStart = visibleRange?.[0] ?? 0;
  const rangeEnd = visibleRange?.[1] ?? Math.max(0, categories.length - 1);
  const seriesData = useMemo(
    () =>
      (chartData?.series ?? []).map((serie, index) => ({
        name: label(serie.labelKey),
        data: serie.values,
        color: seriesColour(index),
        marker: { enabled: true, radius: 3, symbol: 'circle' },
        connectNulls: false,
      })),
    [chartData?.series, label],
  );
  const isEmpty =
    chartData === null ||
    categories.length === 0 ||
    seriesData.every((serie) => serie.data.every((value) => value === null));

  const isAwaitingChart =
    !hierarchyFilter.empty &&
    metricKey !== undefined &&
    (!hierarchyReady ||
      chartState.status === 'idle' ||
      (chartState.status === 'loading' && lastReadyDataRef.current === null));
  const isRefreshing =
    chartState.status === 'loading' && lastReadyDataRef.current !== null;
  const hasFailed = chartState.status === 'failed';
  const noChartData = hierarchyFilter.empty || chartState.status === 'empty' || hasFailed;
  const insightUnavailable =
    noChartData ||
    insightStatus === 'failed' ||
    insightLooksBroken ||
    (insightStatus === 'succeeded' && insightBullets.length === 0);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{ minHeight: OVERVIEW_LAYOUT.regularPromo.cardMin + marginExtra }}
      data-testid="regular-promo-trend"
    >
      <ImpactChart
        graphType="line"
        graphTitle={title}
        seriesData={seriesData}
        xAxisCategories={categories}
        xAxisTitle=""
        yAxisTitle=""
        height={chartHeight}
        chartMarginBottom={chartMarginBottom}
        cardContainer
        showHeader
        showExpandButton={false}
        showDownloadButton={false}
        showDownloadMenu={false}
        isLoading={isAwaitingChart || isRefreshing}
        isEmpty={isEmpty || hasFailed}
        fallbackContent={
          <p>{hasFailed ? t('states.error') : t('states.empty')}</p>
        }
        topRightOptions={
          <div className={styles.actions}>
            <ButtonGroup
              options={grainOptions}
              selectedOption={timeGrain}
              onChange={(_event, value) => {
                if (value === 'week' || value === 'month') setTimeGrain(value);
              }}
              className={styles.grainToggle}
              data-testid="chart-grain-toggle"
              aria-label={t('regularPromoTrend.grainLabel', 'Time grain')}
            />
            {hierarchyFilter.visible ? (
              <Dropdown
                label={hierarchyFilter.label}
                labelOrientation="left"
                options={hierarchyFilter.options}
                isMulti
                isWithSelectAll
                isWithSearch
                isClearable={false}
                disabled={hierarchyFilter.disabled}
                placeholder={t('hierarchyFilter.placeholder', 'Select')}
                noOptionMessage={t(
                  'hierarchyFilter.noOptions',
                  'No hierarchy values available',
                )}
                selectionLabels={{
                  selectAll: t('hierarchyFilter.selectAll', 'Select All'),
                  deselectAll: t('hierarchyFilter.deselectAll', 'Deselect All'),
                }}
                value={hierarchyDraft ?? hierarchyFilter.selected}
                onChange={changeHierarchyDraft}
                onDropdownOpen={openHierarchyMenu}
                onDropdownClose={commitHierarchySelection}
                aria-label={hierarchyFilter.label}
                minWidth="180px"
                data-testid="chart-hierarchy-filter"
              />
            ) : null}
            
            <Dropdown
              label={t('regularPromoTrend.metricLabel', 'Metric')}
              labelOrientation="left"
              options={metricFilter.options}
              isMulti={metricFilter.multi}
              isClearable={false}
              disabled={metricFilter.disabled}
              placeholder={t('regularPromoTrend.metricPlaceholder', 'Select')}
              noOptionMessage={t('regularPromoTrend.noMetrics', 'No metrics available')}
              value={metricFilter.selected}
              onChange={metricFilter.select}
              aria-label={t('regularPromoTrend.metricLabel', 'Metric')}
              minWidth="130px"
              data-testid="chart-metric-filter"
            />
          </div>
        }
        aboveChartComponent={
          <>
          {insightUnavailable && !isAwaitingChart ? null : (
            <AIStrip
          iconOnly
              text={insightText}
              loading={
                !insightUnavailable &&
                (insightStatus === 'idle' || insightStatus === 'loading')
              }
              showAskButton={
                !insightUnavailable &&
                insightStatus === 'succeeded' &&
                insightBullets.length > 0
              }
              onAskClick={() =>
                askAboutInsight({
                  plainText: insightText,
                  displayHtml: buildInsightDisplayHtml(title, insightText),
                  source: 'hindsight',
                  widgetId: 'regularPromoTrend',
                  planCode,
                })
              }
            />
          )}
          {categories.length > 0 && (
            <div className={styles.rangeControls} role="group" aria-label="Chart period range">
              <span>{visibleRange ? `${categories[rangeStart]} – ${categories[rangeEnd]}` : `Full season · ${categories.length} ${timeGrain === 'week' ? 'weeks' : 'months'}`}</span>
              <label>From
                <select aria-label="Chart range start" value={rangeStart}
                  onChange={(event) => { const start = Number(event.target.value); setVisibleRange([start, Math.max(start, rangeEnd)]); }}>
                  {categories.map((category, index) => <option key={category} value={index}>{category}</option>)}
                </select>
              </label>
              <label>To
                <select aria-label="Chart range end" value={rangeEnd}
                  onChange={(event) => { const end = Number(event.target.value); setVisibleRange([Math.min(rangeStart, end), end]); }}>
                  {categories.map((category, index) => <option key={category} value={index}>{category}</option>)}
                </select>
              </label>
              <Button variant="tertiary" size="small" disabled={visibleRange === null} onClick={() => setVisibleRange(null)}>Reset zoom</Button>
              <span className={styles.rangeHint}>Drag across the plot to zoom</span>
            </div>
          )}
          </>
        }
        legendOptions={{
          align: 'center',
          itemDistance: 64,
          itemMarginTop: 8,
          itemStyle: {
            color: 'var(--color-text-secondary, #60697d)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '13px',
            fontWeight: '400',
            textOverflow: 'none',
          },
          // Keep legend clear of the scrollablePlotArea scrollbar.
          margin: 40,
          symbolPadding: 8,
          symbolWidth: 12,
          verticalAlign: 'bottom',
          y: 12,
        }}
        showScrollX={false}
        chartOptions={{
          reflow: true,
          backgroundColor: 'var(--color-surface, #ffffff)',
          spacing: [10, 10, 12, 10],
          zooming: { type: 'x' },
          events: {
            ...chartEvents,
            selection(event: { xAxis?: { min: number; max: number }[]; resetSelection?: boolean }) {
              const selected = event.xAxis?.[0];
              if (event.resetSelection) setVisibleRange(null);
              else if (selected) {
                const start = Math.max(0, Math.min(categories.length - 1, Math.ceil(selected.min)));
                const end = Math.max(start, Math.min(categories.length - 1, Math.floor(selected.max)));
                setVisibleRange([start, end]);
              }
              return false;
            },
          },
        }}
        plotOptionsOptions={{
          series: {
            connectNulls: false,
          },
        }}
        xAxisOptions={{
          min: rangeStart,
          max: rangeEnd,
          minPadding: 0,
          maxPadding: 0,
          tickPixelInterval: 75,
          labels: {
            autoRotation: [-45, -60],
            crop: false,
            overflow: 'allow',
          },
        }}
        yAxisOptions={{
          labels: {
            formatter(this: { value: number; axis?: { tickInterval?: number } }) {
              return formatAxisTick(this.value, metricType, this.axis?.tickInterval);
            },
            style: {
              color: 'var(--color-text-secondary, #60697d)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
            },
          },
          title: { text: '' },
        }}
        tooltipOptions={{
          formatter(this: {
            color?: string;
            point?: { color?: string; category?: string };
            series?: { color?: string; name?: string };
            key?: string;
            y?: number | null;
          }) {
            if (this.y == null || !Number.isFinite(this.y)) return false;
            const color =
              this.point?.color ??
              this.color ??
              this.series?.color ??
              'var(--color-text-primary, #1f2b4d)';
            const categoryName = this.key ?? this.point?.category ?? '';
            const seriesLabel = this.series?.name ?? '';
            return `<b>${categoryName}</b><br/><span style="color:${color}">●</span> ${seriesLabel}: <b>${formatAxisTick(this.y, metricType)}</b>`;
          },
          pointFormatter(this: { color?: string; series: { name: string }; y?: number | null }) {
            if (this.y == null || !Number.isFinite(this.y)) return '';
            return `${this.series.name}: <b>${formatAxisTick(this.y, metricType)}</b><br/>`;
          },
        }}
      />
    </div>
  );
}
