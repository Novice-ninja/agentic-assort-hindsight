import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AIStrip, Dropdown } from '@shared/components/primitives';
import { formatSharePercent, ImpactChart } from '@shared/components/charts';
import type { LoadStatus } from '@shared/types';
import type { AttributeGradeSeries } from '../api/getAttributeInfo';
import type { AttributeProductOption } from '../api/getAttributeProductList';
import styles from './wizard.module.css';

// const CHART_HEIGHT = 460;
const ATTRIBUTE_DROPDOWN_WIDTH = '201px';
const GRADE_PALETTE = ['#6bbec2', '#ad97ce', '#658ec4', '#c64746', '#f19579'] as const;

export interface AttributeGradesTooltipPoint {
  color?: string;
  y?: number | null;
  /** Category label when Highcharts has resolved the X axis. */
  category?: string;
  key?: string;
  series?: { name?: string };
}

/**
 * Shared stacked-column tooltip: cluster name, then each version as a percent
 * already on a 0–100 scale. Category axes report `x` as the index (`0`, `1`, …),
 * so the label comes from the point, then from `categories`.
 */
export function attributeGradesTooltipHtml(
  context: {
    x?: string | number;
    key?: string;
    points?: AttributeGradesTooltipPoint[];
  },
  categories: readonly string[] = [],
): string {
  const point = context.points?.[0];
  const indexed =
    typeof context.x === 'number' ? categories[context.x] : undefined;
  const cluster =
    point?.category ||
    point?.key ||
    (typeof context.key === 'string' ? context.key : '') ||
    indexed ||
    (typeof context.x === 'string' ? context.x : '');
  const lines = (context.points ?? []).map((point) => {
    const color = point.color ?? '#1f2b4d';
    const name = point.series?.name ?? '';
    return `<span style="color:${color}">●</span> ${name}: <b>${formatSharePercent(point.y)}</b>`;
  });
  return `<b>${cluster}</b><br/>${lines.join('<br/>')}`;
}

export function attributeGradesAxisLabel(value: number): string {
  return formatSharePercent(value);
}

export interface AttributeGradesChartProps {
  categories: readonly string[];
  series: readonly AttributeGradeSeries[];
  attributeOptions: readonly AttributeProductOption[];
  attributeValue?: string;
  onAttributeChange: (value: string) => void;
  isLoading?: boolean;
  /**
   * `POST /v1/summarize` (`cardType: 'cluster_attribute'`) narration for the plotted
   * attribute. `idle` renders no strip; `failed` renders the unavailable copy plus Retry.
   */
  summary?: string | null;
  summaryStatus?: LoadStatus;
  onRetrySummary?: () => void;
}

export function AttributeGradesChart({
  categories,
  series,
  attributeOptions,
  attributeValue,
  onAttributeChange,
  isLoading = false,
  summary = null,
  summaryStatus = 'idle',
  onRetrySummary,
}: AttributeGradesChartProps) {
  const { t } = useTranslation('clustering');
  const title = t('finalize.gradesTitle');

  let summaryStrip: ReactNode = null;
  if (summaryStatus === 'loading') {
    summaryStrip = <AIStrip text="" loading />;
  } else if (summaryStatus === 'succeeded' && summary) {
    summaryStrip = <AIStrip text={summary} showAskButton={false} />;
  } else if (summaryStatus === 'failed') {
    summaryStrip = (
      <div className={styles.insightFallbackRow} role="status">
        <AIStrip
          className={styles.reviewAiStrip}
          text={t('finalize.insightUnavailable')}
          showTooltip={false}
        />
        {onRetrySummary ? (
          <button type="button" className={styles.viewAssignment} onClick={onRetrySummary}>
            {t('finalize.insightRetry')}
          </button>
        ) : null}
      </div>
    );
  }

  const seriesData = useMemo(
    () =>
      series.map((row, index) => ({
        name: row.name,
        color: GRADE_PALETTE[index % GRADE_PALETTE.length],
        data: [...row.data],
      })),
    [series],
  );

  const isEmpty =
    !isLoading &&
    (categories.length === 0 ||
      series.every((row) => row.data.every((value) => value === null)));

  const tooltipOptions = useMemo(
    () => ({
      shared: true,
      formatter() {
        return attributeGradesTooltipHtml(
          this as {
            x?: string | number;
            key?: string;
            points?: AttributeGradesTooltipPoint[];
          },
          categories,
        );
      },
    }),
    [categories],
  );

  const yAxisOptions = useMemo(
    () => ({
      min: 0,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#d9dde7',
      labels: {
        formatter(this: { value: number }) {
          return attributeGradesAxisLabel(this.value);
        },
        style: {
          color: '#60697d',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
      title: { text: '' },
    }),
    [],
  );

  return (
    <div className={styles.chartSlot}>
      <ImpactChart
        graphType="column"
        stackedColumn
        sharedTooltip
        graphTitle={title}
        seriesData={seriesData}
        xAxisCategories={[...categories]}
        xAxisTitle=""
        yAxisTitle=""
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
        showScrollX={true}
        topRightOptions={
          <Dropdown
            label={t('finalize.attributeLabel')}
            labelOrientation="left"
            aria-label={t('finalize.attributeLabel')}
            options={attributeOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={attributeValue === undefined ? [] : [attributeValue]}
            onChange={(next) => {
              const value = next[0];
              if (value) onAttributeChange(value);
            }}
            isMulti={false}
            isClearable={false}
            minWidth={ATTRIBUTE_DROPDOWN_WIDTH}
            width={ATTRIBUTE_DROPDOWN_WIDTH}
          />
        }
        aboveChartComponent={summaryStrip}
        xAxisOptions={{
          labels: {
            style: {
              color: '#60697d',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '12px',
              fontWeight: '500',
            },
          },
          lineColor: '#d9dde7',
          tickLength: 0,
        }}
        yAxisOptions={yAxisOptions}
        tooltipOptions={tooltipOptions}
        plotOptionsOptions={{
          column: {
            borderWidth: 0,
            borderRadius: 8,
            pointWidth: 60,
            stacking: 'normal',
          },
        }}
        legendOptions={{
          align: 'center',
          itemDistance: 24,
          symbolHeight: 8,
          symbolWidth: 8,
          symbolRadius: 2,
          margin: 16,
        }}
      />
    </div>
  );
}
