import { useEffect, useRef, useState, type RefObject } from 'react';
import { CartesianPlot } from '@shared/components/charts/CartesianPlot';
import {
  COLUMN_CHART_HEIGHT,
  COLUMN_PLOT_PAD,
  columnBarGradient,
  minColumnPlotWidth,
} from '@shared/components/charts/columnChartTheme';
import { SemiDonutPlot } from '@shared/components/charts/SemiDonutPlot';
import { seriesColour } from '@shared/components/charts/seriesColour';
import type {
  ChartCategory,
  ChartKind,
  ChartSeries,
} from '@shared/components/charts/types';
import type { AgentChartData } from '@shared/services/agentWs';
import { decodeIaString } from '@shared/utils/format';
import { formatAgentValue } from './agentResultFormat';
import styles from './AgentReplyBody.module.css';

const LINE_CHART_HEIGHT = 220;

function hasPlottableValue(data: AgentChartData): boolean {
  return data.series.some((serie) =>
    serie.values.some((value) => value !== null && Number.isFinite(value)),
  );
}

function toCategories(data: AgentChartData): ChartCategory[] {
  return data.categories.map((label, index) => ({ id: `${index}-${label}`, label }));
}

function toSeries(data: AgentChartData): ChartSeries[] {
  return data.series.map((serie, index) => ({
    id: `${index}-${serie.name}`,
    label: serie.name,
    values: serie.values,
  }));
}

function cartesianKind(
  data: AgentChartData,
): Extract<ChartKind, 'column' | 'stackedColumn' | 'line' | 'area'> {
  if (data.kind === 'line' || data.kind === 'area') return data.kind;
  return data.stacked === true ? 'stackedColumn' : 'column';
}

function isColumnKind(kind: ReturnType<typeof cartesianKind>): boolean {
  return kind === 'column' || kind === 'stackedColumn';
}

export interface AgentReplyChartProps {
  data: AgentChartData;
  emptyLabel: string;
  dataTableCaption: string;
}

function AgentHeatmapTable({
  data,
  formatValue,
}: {
  data: AgentChartData;
  formatValue: (value: number | null) => string;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" />
            {data.categories.map((category, index) => (
              <th key={`${index}-${category}`} scope="col">
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.series.map((serie) => (
            <tr key={serie.name}>
              <th scope="row">{serie.name}</th>
              {serie.values.map((value, index) => (
                <td key={`${serie.name}-${index}`}>{formatValue(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function useAvailableWidth(): { ref: RefObject<HTMLDivElement | null>; width: number } {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const next = el.clientWidth;
      setWidth((current) => (current === next ? current : next));
    };

    apply();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/**
 * One agent chart, drawn without Highcharts.
 *
 * Impact UI's Chart calls `setSize` before Highcharts has created the instance, which
 * throws inside a chat bubble. Cartesian / donut plots are SVG and do not hit that path.
 * `bar` is drawn as a column chart (vertical grouped bars). Heatmaps render as a table.
 */
export function AgentReplyChart({
  data,
  emptyLabel,
  dataTableCaption,
}: AgentReplyChartProps) {
  const format = data.format ?? 'number';
  const formatValue = (value: number | null) => formatAgentValue(value, format);
  const empty = data.categories.length === 0 || !hasPlottableValue(data);
  const { ref: scrollRef, width: availableWidth } = useAvailableWidth();

  if (empty) {
    return <p className={styles.fallback}>{emptyLabel}</p>;
  }

  const display: AgentChartData = {
    ...data,
    title: decodeIaString(data.title),
    categories: data.categories.map((label) => decodeIaString(label)),
    series: data.series.map((serie) => ({
      ...serie,
      name: decodeIaString(serie.name),
    })),
  };

  const categories = toCategories(display);
  const series = toSeries(display);
  const plotKind = cartesianKind(display);
  const column = isColumnKind(plotKind);
  const plotHeight = column ? COLUMN_CHART_HEIGHT : LINE_CHART_HEIGHT;
  const minWidth = column
    ? minColumnPlotWidth(categories.length, COLUMN_PLOT_PAD.plot, COLUMN_PLOT_PAD.right)
    : 0;
  const plotWidth = column ? Math.max(availableWidth, minWidth) : undefined;
  const showLegend =
    display.kind !== 'pie' && display.kind !== 'heatmap' && (column || series.length > 1);

  return (
    <figure className={styles.chart} data-testid="iris-reply-chart" data-kind={data.kind}>
      <figcaption className={styles.chartTitle}>{display.title}</figcaption>

      {display.kind === 'heatmap' ? (
        <AgentHeatmapTable data={display} formatValue={formatValue} />
      ) : display.kind === 'pie' ? (
        <SemiDonutPlot
          categories={categories}
          series={series}
          formatValue={formatValue}
          height={LINE_CHART_HEIGHT}
        />
      ) : column ? (
        <div className={styles.plotShell}>
          <div className={styles.yAxisPane} data-testid="iris-reply-chart-yaxis">
            <CartesianPlot
              kind={plotKind}
              categories={categories}
              series={series}
              formatValue={formatValue}
              height={plotHeight}
              width={COLUMN_PLOT_PAD.left}
              pane="yAxis"
            />
          </div>
          <div
            ref={scrollRef}
            className={styles.plotScroll}
            tabIndex={0}
            role="region"
            aria-label={display.title}
          >
            <div className={styles.plot} style={{ width: plotWidth, height: plotHeight }}>
              <CartesianPlot
                kind={plotKind}
                categories={categories}
                series={series}
                formatValue={formatValue}
                height={plotHeight}
                width={plotWidth}
                pane="plot"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.plot} style={{ height: plotHeight }}>
          <CartesianPlot
            kind={plotKind}
            categories={categories}
            series={series}
            formatValue={formatValue}
            height={plotHeight}
          />
        </div>
      )}

      {showLegend ? (
        <ul className={styles.legend}>
          {series.map((serie, index) => (
            <li key={serie.id} className={styles.legendItem}>
              <span
                className={styles.legendSwatch}
                style={{
                  backgroundColor:
                    serie.color ??
                    (column ? columnBarGradient(index).color : seriesColour(index)),
                }}
                aria-hidden="true"
              />
              {serie.label}
            </li>
          ))}
        </ul>
      ) : null}

      <table className={styles.visuallyHidden}>
        <caption>{dataTableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{display.kind === 'pie' ? '' : 'Category'}</th>
            {display.kind === 'pie' ? (
              <th scope="col">{display.series[0]?.name || display.title}</th>
            ) : (
              display.series.map((serie) => (
                <th key={serie.name} scope="col">
                  {serie.name}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {display.categories.map((category, index) => (
            <tr key={`${category}-${index}`}>
              <th scope="row">{category}</th>
              {display.kind === 'pie' ? (
                <td>{formatValue(display.series[0]?.values[index] ?? null)}</td>
              ) : (
                display.series.map((serie) => (
                  <td key={serie.name}>{formatValue(serie.values[index] ?? null)}</td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
