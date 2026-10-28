import { joinInsightProse } from '../../services/insightProse';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMetricFilter, useMetricLabel, useMetricType } from '@modules/appConfig';
import { Dropdown } from '@shared/components';
import { ImpactChart } from '@shared/components/charts';
import {
  COLUMN_BAR_POINT_WIDTH,
  COLUMN_BAR_TOP_RADIUS,
  COLUMN_GROUP_PADDING,
  COLUMN_POINT_PADDING,
  highchartsColumnGradient,
  COLUMN_BAR_GRADIENTS,
  ellipsizeCategoryLine,
} from '@shared/components/charts/columnChartTheme';
import { AIStrip } from '@shared/components/primitives/AIStrip/AIStrip';
import { useAIChat } from '@shared/context';
import { EmptyChartError } from '../../api/getRegularPromoSalesChart';
import { getHierarchyParetoChart } from '../../api/getHierarchyParetoChart';
import { useCardInsight, useLabel, useVisualHierarchyFilter } from '../../hooks';
import {
  buildChartSummarizePayload,
  chartInsightScope,
} from '../../services/chartSummary';
import { buildInsightDisplayHtml } from '../../services/buildInsightDisplayHtml';
import { formatAxisTick, formatSharePercent } from '../../services/formatChartValue';
import {
  alignParetoSeries,
  departmentAxisLabel,
  formatParetoTooltipHtml,
  groupParetoTooltipPoints,
} from '../../services/paretoChart';
import type { ParetoChartData } from '../../types';
import { OVERVIEW_LAYOUT } from './overviewChartLayout';
import { useChartLabelFit } from './useChartLabelFit';
import styles from './HierarchyParetoWidget.module.css';

const METRIC_FILTER_SCOPE = {
  module: 'hindsight',
  view: 'overview',
  component: 'subCategoryContribution',
} as const;

/** Cap rotated tick length so long code-names do not collide with the legend. */
const X_AXIS_LABEL_MAX_CHARS = 10;
/**
 * Category axes ignore `minPadding`. A small fractional `min` nudges the first
 * slot off the y-axis / scrollable mask without a full empty category.
 * Non-category ticks (e.g. "-1") are blanked in the label formatter.
 */
const X_AXIS_FIRST_CATEGORY_INSET = 0.28;

export interface HierarchyParetoWidgetProps {
  onRetry?: () => void;
  planCode?: string;
  seasonCode?: number | null;
}

type ChartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: ParetoChartData }
  | { status: 'empty' }
  | { status: 'failed' };

interface ParetoPointOptions {
  y: number | null;
  custom: {
    metricValue: number | null;
    pointKind: 'contribution' | 'cumulative';
    versionIndex: number;
    versionColor: string;
    versionLabel: string;
  };
}

interface ParetoTooltipPoint {
  color?: string;
  key?: string;
  y?: number;
  point?: {
    color?: string;
    category?: string;
    custom?: {
      metricValue?: number | null;
      pointKind?: 'contribution' | 'cumulative';
      versionIndex?: number;
      versionColor?: string;
      versionLabel?: string;
    };
  };
  series?: { color?: string; name?: string };
}

/**
 * Hierarchy Pareto of the selected KPI: contribution bars, a cumulative line, and an 80%
 * (or endpoint-supplied) threshold. A second version such as LLY adds a second bar and line.
 */
export function HierarchyParetoWidget({
  planCode,
  seasonCode,
}: HierarchyParetoWidgetProps) {
  const { t } = useTranslation('hindsight');
  const label = useLabel();
  const { askAboutInsight } = useAIChat();
  const [chartState, setChartState] = useState<ChartState>({ status: 'idle' });
  const inFlightRequestKeyRef = useRef<string | null>(null);
  const latestRequestKeyRef = useRef<string | null>(null);
  const metricFilter = useMetricFilter(METRIC_FILTER_SCOPE);
  const hierarchyFilter = useVisualHierarchyFilter(METRIC_FILTER_SCOPE, planCode, {
    mode: 'pareto',
  });
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
      next.length === current.length &&
      next.every((value, index) => value === current[index]);
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

  const metricKey = metricFilter.selected[0];
  const selectedLabel =
    metricFilter.options.find((option) => option.value === metricKey)?.label ?? '';
  const title = t('pareto.title', { metric: selectedLabel });
  const metricType = useMetricType(metricKey ?? '');
  const hierarchyReady =
    !hierarchyFilter.enabled || hierarchyFilter.chartFilters !== null || hierarchyFilter.empty;

  const requestChart = useCallback(async () => {
    if (metricKey === undefined) return;
    if (planCode === undefined || seasonCode === null || seasonCode === undefined) return;
    if (hierarchyFilter.empty) {
      latestRequestKeyRef.current = null;
      inFlightRequestKeyRef.current = null;
      setChartState({ status: 'empty' });
      return;
    }
    if (hierarchyFilter.enabled && hierarchyFilter.chartFilters === null) return;

    const scopeKey = hierarchyFilter.chartFilters
      ? Object.entries(hierarchyFilter.chartFilters.hierarchyScope)
          .map(([key, values]) => `${key}:${values.join(',')}`)
          .join('|')
      : '';
    const requestKey = hierarchyFilter.enabled
      ? `${planCode}:${seasonCode}:${metricKey}:${hierarchyFilter.chartFilters?.levelHierarchy}:${scopeKey}`
      : `${planCode}:${seasonCode}:${metricKey}`;
    if (inFlightRequestKeyRef.current === requestKey) return;

    inFlightRequestKeyRef.current = requestKey;
    latestRequestKeyRef.current = requestKey;
    setChartState({ status: 'loading' });
    try {
      const next = await getHierarchyParetoChart({
        planCode,
        seasonCode,
        metric: metricKey,
        ...(hierarchyFilter.chartFilters !== null
          ? {
              levelHierarchy: hierarchyFilter.chartFilters.levelHierarchy,
              hierarchyScope: hierarchyFilter.chartFilters.hierarchyScope,
            }
          : {}),
      });
      if (latestRequestKeyRef.current !== requestKey) return;
      setChartState({ status: 'ready', data: next });
    } catch (error) {
      if (latestRequestKeyRef.current !== requestKey) return;
      setChartState({ status: error instanceof EmptyChartError ? 'empty' : 'failed' });
    } finally {
      if (inFlightRequestKeyRef.current === requestKey) {
        inFlightRequestKeyRef.current = null;
      }
    }
  }, [
    planCode,
    seasonCode,
    metricKey,
    hierarchyFilter.enabled,
    hierarchyFilter.empty,
    hierarchyFilter.chartFilters,
  ]);

  useEffect(() => {
    void requestChart();
  }, [requestChart]);

  const chartData = !hierarchyFilter.empty && chartState.status === 'ready' ? chartState.data : null;
  const { departments, aligned } = useMemo(
    () => alignParetoSeries(chartData?.series ?? []),
    [chartData],
  );
  const categories = departments.map((department) =>
    label(departmentAxisLabel(department)),
  );

  const xAxisOptions = useMemo(
    () => ({
      gridLineWidth: 0,
      ...(categories.length > 0
        ? {
            min: -X_AXIS_FIRST_CATEGORY_INSET,
            max: categories.length - 1,
            startOnTick: false,
            endOnTick: false,
          }
        : {}),
      labels: {
        autoRotation: [-45, -60],
        crop: false,
        overflow: 'allow' as const,
        // Ellipsize in the formatter; keep categories full so tooltips stay complete.
        formatter(this: { value?: string | number }) {
          // Fractional min can invent numeric ticks ("-1") — never paint those.
          if (typeof this.value === 'number') return '';
          const text = String(this.value ?? '');
          if (!text || !categories.includes(text)) return '';
          return ellipsizeCategoryLine(text, X_AXIS_LABEL_MAX_CHARS);
        },
        style: {
          color: 'var(--color-text-secondary, #60697d)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '13px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        y: 22,
      },
      lineColor: 'var(--color-border, #d9dde7)',
      tickLength: 0,
    }),
    [categories],
  );

  const seriesData = useMemo(() => {
    const columns = aligned.map((serie, index) => {
      const versionLabel = label(serie.labelKey);
      const versionColor = COLUMN_BAR_GRADIENTS[index % COLUMN_BAR_GRADIENTS.length].color;
      return {
        type: 'column' as const,
        name: versionLabel,
        yAxis: 0,
        data: serie.points.map(
          (point): ParetoPointOptions => ({
            y: point?.contribution ?? null,
            custom: {
              metricValue: point?.metric ?? null,
              pointKind: 'contribution',
              versionIndex: index,
              versionColor,
              versionLabel,
            },
          }),
        ),
        borderRadius: COLUMN_BAR_TOP_RADIUS,
        color: highchartsColumnGradient(index),
        ...(aligned.length === 1 ? { pointWidth: COLUMN_BAR_POINT_WIDTH } : {}),
        zIndex: 1,
      };
    });
    const lines = aligned.map((serie, index) => {
      const versionLabel = label(serie.labelKey);
      const versionColor = COLUMN_BAR_GRADIENTS[index % COLUMN_BAR_GRADIENTS.length].color;
      return {
        type: 'line' as const,
        name: t('pareto.cumulativeSeries', { version: versionLabel }),
        yAxis: 1,
        data: serie.points.map(
          (point): ParetoPointOptions => ({
            y: point?.cumulativeContribution ?? null,
            custom: {
              metricValue: point?.metric ?? null,
              pointKind: 'cumulative',
              versionIndex: index,
              versionColor,
              versionLabel,
            },
          }),
        ),
        color: versionColor,
        marker: { symbol: 'circle', radius: 4 },
        dashStyle: index === 0 ? 'Solid' : 'Dash',
        zIndex: 2,
      };
    });
    return [...columns, ...lines];
  }, [aligned, label, t]);

  const empty =
    chartData === null ||
    departments.length === 0 ||
    aligned.every((serie) =>
      serie.points.every(
        (point) => point?.contribution === null && point?.cumulativeContribution === null,
      ),
    );

  const awaitingChart =
    !hierarchyFilter.empty && (!hierarchyReady || chartState.status === 'idle' || chartState.status === 'loading');
  const isLoading = metricKey !== undefined && awaitingChart;
  const hasFailed = chartState.status === 'failed';

  const chartSource = chartData?.source ?? null;
  const metricLabel = useMetricLabel(metricKey ?? '');
  const insightPayload = useMemo(
    () =>
      chartSource != null ? buildChartSummarizePayload(chartSource, metricLabel) : null,
    [chartSource, metricLabel],
  );

  const {
    status: insightStatus,
    bullets: insightBullets,
    request: requestInsight,
  } = useCardInsight({
    planCode: chartSource?.filters.planCode,
    seasonCode: chartSource?.filters.seasonCode ?? null,
    scope: chartSource != null ? chartInsightScope(chartSource) : '',
    payload: insightPayload,
  });

  useEffect(() => {
    if (insightPayload !== null) {
      requestInsight();
    }
  }, [insightPayload, requestInsight]);

  const insightText = joinInsightProse(insightBullets.map(bullet => bullet.text));
  const { marginExtra, chartHeight, chartMarginBottom, wrapperRef, chartEvents } =
    useChartLabelFit({
      plotHeight: OVERVIEW_LAYOUT.subCategoryContribution.plotHeight,
      marginBottom: OVERVIEW_LAYOUT.subCategoryContribution.marginBottom,
    });
  const noChartData = hierarchyFilter.empty || chartState.status === 'empty' || hasFailed;
  const insightUnavailable =
    noChartData ||
    insightStatus === 'failed' ||
    (insightStatus === 'succeeded' && insightBullets.length === 0);

  const thresholdPct = chartData?.thresholdPct ?? null;
  const tooltipMetricLabel = selectedLabel || metricLabel;

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{ minHeight: OVERVIEW_LAYOUT.subCategoryContribution.cardMin + marginExtra }}
      data-testid="hierarchy-pareto"
    >
      <ImpactChart
        graphType="column"
        graphTitle={title}
        seriesData={seriesData}
        xAxisCategories={categories}
        xAxisTitle=""
        yAxisTitle=""
        yAxisTitleRight={t('pareto.cumulative')}
        height={chartHeight}
        chartMarginBottom={chartMarginBottom}
        cardContainer
        showHeader
        showExpandButton={false}
        showDownloadButton={false}
        showDownloadMenu={false}
        showScrollX={true}
        sharedTooltip
        isLoading={isLoading}
        isEmpty={empty || hasFailed}
        fallbackContent={<p>{hasFailed ? t('states.error') : t('states.empty')}</p>}
        topRightOptions={
          <div className={styles.actions}>
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
                minWidth="160px"
                data-testid="chart-hierarchy-filter"
              />
            ) : null}
            <Dropdown
              label="Metric"
              labelOrientation="left"
              options={metricFilter.options}
              isMulti={metricFilter.multi}
              isClearable={false}
              disabled={metricFilter.disabled}
              placeholder="Select"
              noOptionMessage="No metrics available"
              value={metricFilter.selected}
              onChange={metricFilter.select}
              aria-label="Metric"
              minWidth="130px"
              data-testid="chart-metric-filter"
            />
          </div>
        }
        aboveChartComponent={
          <AIStrip
          iconOnly
            text={
              insightUnavailable
                ? t('aiStrip.noInsight', 'No insight available')
                : insightText
            }
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
                widgetId: 'subCategoryContribution',
                planCode,
              })
            }
          />
        }
        legendOptions={{
          align: 'center',
          itemDistance: 48,
          itemMarginTop: 8,
          itemStyle: {
            color: 'var(--color-text-secondary, #60697d)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '13px',
            fontWeight: '400',
            textOverflow: 'none',
          },
          // Keep legend clear of the scrollablePlotArea scrollbar (~6–12px).
          margin: 40,
          symbolHeight: 9,
          symbolRadius: 2,
          symbolWidth: 9,
          verticalAlign: 'bottom',
          y: 12,
        }}
        chartOptions={{
          marginLeft: 56,
          marginRight: 48,
          marginTop: 14,
          // Extra bottom band so the horizontal scroller does not cover legend text.
          spacing: [0, 0, 12, 0],
          reflow: true,
          events: chartEvents,
        }}
        xAxisOptions={xAxisOptions}
        yAxisOptions={{
          gridLineColor: 'var(--color-border, #d9dde7)',
          gridLineDashStyle: 'Dash',
          gridLineWidth: 1,
          min: 0,
          title: { text: '' },
        }}
        yAxisLeftOptions={{
          labels: {
            formatter(this: { value: number }) {
              return formatSharePercent(this.value);
            },
            style: {
              color: 'var(--color-text-secondary, #60697d)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
            },
          },
        }}
        yAxisRightOptions={{
          max: 100,
          labels: {
            formatter(this: { value: number }) {
              return formatSharePercent(this.value);
            },
            style: {
              color: 'var(--color-text-secondary, #60697d)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '13px',
            },
          },
          plotLines:
            thresholdPct === null
              ? []
              : [
                  {
                    value: thresholdPct,
                    color: 'var(--color-warning, #ffb020)',
                    dashStyle: 'Dash',
                    width: 1,
                    zIndex: 5,
                    label: {
                      text: t('pareto.threshold', { value: thresholdPct }),
                      align: 'right',
                      // Inset from the scrollable-mask clip at the right axis (z-index cannot fix overflow).
                      x: -24,
                      verticalAlign: 'bottom',
                      y: -12,
                      style: {
                        color: 'var(--color-text-secondary, #60697d)',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '11px',
                      },
                    },
                  },
                ],
        }}
        plotOptionsOptions={{
          column: {
            borderWidth: 0,
            groupPadding: COLUMN_GROUP_PADDING,
            pointPadding: COLUMN_POINT_PADDING,
          },
          line: {
            lineWidth: 2,
          },
          series: {
            states: {
              inactive: { opacity: 1 },
            },
          },
        }}
        tooltipOptions={{
          shared: true,
          formatter(this: {
            key?: string;
            x?: string | number;
            points?: ParetoTooltipPoint[];
            point?: ParetoTooltipPoint['point'];
            series?: ParetoTooltipPoint['series'];
            y?: number;
            color?: string;
          }) {
            const categoryName = String(this.key ?? this.x ?? '');
            const points = this.points ?? [
              {
                color: this.color,
                y: this.y,
                point: this.point,
                series: this.series,
              },
            ];
            return formatParetoTooltipHtml({
              categoryName,
              groups: groupParetoTooltipPoints(points),
              metricLabel: tooltipMetricLabel,
              formatContribution: formatSharePercent,
              formatMetric: (value) => formatAxisTick(value ?? NaN, metricType),
              cumulativeLabel: (version) =>
                t('pareto.cumulativeSeries', { version }),
            });
          },
        }}
      />
      {!empty && !hasFailed && !isLoading && (
        <table className={styles.visuallyHidden}>
          <caption>{t('a11y.chartDataTable', { name: title })}</caption>
          <thead>
            <tr>
              <th scope="col">{t('levels.department')}</th>
              {aligned.map((serie) => (
                <th key={`${serie.versionId}-contribution`} scope="col">
                  {t('pareto.contributionSeries', { version: label(serie.labelKey) })}
                </th>
              ))}
              {aligned.map((serie) => (
                <th key={`${serie.versionId}-metric`} scope="col">
                  {t('pareto.metricSeries', {
                    version: label(serie.labelKey),
                    metric: tooltipMetricLabel,
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, categoryIndex) => (
              <tr key={departments[categoryIndex]}>
                <th scope="row">{category}</th>
                {aligned.map((serie) => (
                  <td key={`${serie.versionId}-contribution-${category}`}>
                    {formatSharePercent(
                      serie.points[categoryIndex]?.contribution ?? null,
                    )}
                  </td>
                ))}
                {aligned.map((serie) => {
                  const metric = serie.points[categoryIndex]?.metric ?? null;
                  return (
                    <td key={`${serie.versionId}-metric-${category}`}>
                      {metric === null
                        ? '—'
                        : formatAxisTick(metric, metricType)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
