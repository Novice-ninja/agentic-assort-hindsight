import './guardHighchartsSetSize';
import './highchartsScrolling.css';
import 'highcharts/esm/modules/heatmap.js';
import { Chart } from '@shared/components/vendor/impact-ui';
import type { ComponentType } from 'react';
import { useTheme } from '@app/providers/ThemeProvider';
import { palette } from '@design-system';
import type { ChartCategory, ChartSeries, ChartValueDirection } from './types';
import styles from './charts.module.css';

const ImpactChart = Chart as unknown as ComponentType<Record<string, unknown>>;

interface ImpactHeatmapPlotProps {
  title: string;
  categories: ChartCategory[];
  series: ChartSeries[];
  formatValue: (value: number | null) => string;
  valueDirection?: ChartValueDirection;
  height: number;
  density?: 'default' | 'compact';
  cellHeight?: number;
  axisLabelSpace?: number;
  minHeight?: number;
  rowLabelWidth?: number;
  chartMarginBottom?: number;
}

type HeatmapPoint = [number, number, number | null];

const CELL_HEIGHT = 32;
const AXIS_LABEL_SPACE = 48;
const MIN_HEATMAP_HEIGHT = 220;
const CELL_BORDER_WIDTH = 4;
const CELL_RADIUS = 8;
const CHART_SPACING = 0;
const CHART_MARGIN_BOTTOM = 40;
const ROW_LABEL_WIDTH = 130;

const figmaHeatmapScale = [
  '#ed9998',
  '#f6cccc',
  '#fceeee',
  '#ffffff',
  '#ebf7f1',
  '#c4e8d5',
  '#89d1ab',
] as const;

const darkHeatmapScale = [
  palette.rose[800],
  palette.amber[800],
  palette.emerald[800],
] as const;

interface HeatmapFormatterContext {
  point: {
    x: number;
    y: number;
    value?: number | null;
  };
}

function heatmapPoints(series: ChartSeries[]): HeatmapPoint[] {
  return series.flatMap((serie, yIndex) =>
    serie.values.map((value, xIndex) => [xIndex, yIndex, value] as HeatmapPoint),
  );
}

function colourStops(
  valueDirection: ChartValueDirection,
  colours: readonly string[],
): [number, string][] {
  const scale = valueDirection === 'lowerIsBetter' ? [...colours].reverse() : colours;
  const lastIndex = Math.max(scale.length - 1, 1);

  return scale.map((colour, index) => [index / lastIndex, colour]);
}

export function ImpactHeatmapPlot({
  title,
  categories,
  series,
  formatValue,
  valueDirection = 'higherIsBetter',
  height,
  density = 'default',
  cellHeight: cellHeightOverride,
  axisLabelSpace: axisLabelSpaceOverride,
  minHeight: minHeightOverride,
  rowLabelWidth: rowLabelWidthOverride,
  chartMarginBottom: chartMarginBottomOverride,
}: ImpactHeatmapPlotProps) {
  const { theme } = useTheme();
  const compact = density === 'compact';
  const isDarkTheme = theme === 'dark';
  const heatmapScale = isDarkTheme ? darkHeatmapScale : figmaHeatmapScale;
  const cellBorderColour = isDarkTheme ? palette.graphite[2] : palette.graphite[10];
  // const cellTextColour = isDarkTheme ? palette.graphite[9] : palette.slate[800];
  const cellHeight = cellHeightOverride ?? (compact ? 36 : CELL_HEIGHT);
  const axisLabelSpace = axisLabelSpaceOverride ?? (compact ? 46 : AXIS_LABEL_SPACE);
  const minHeight = minHeightOverride ?? (compact ? 270 : MIN_HEATMAP_HEIGHT);
  const rowLabelWidth = rowLabelWidthOverride ?? (compact ? 104 : ROW_LABEL_WIDTH);
  const chartMarginBottom =
    chartMarginBottomOverride ?? (compact ? 28 : CHART_MARGIN_BOTTOM);
  const chartHeight = Math.max(
    height,
    series.length * cellHeight + axisLabelSpace,
    minHeight,
  );
  const chartKey = `${theme}:${title}:${chartHeight}:${categories.map((category) => category.label).join('|')}:${series
    .map((serie) => `${serie.label}:${serie.values.join(',')}`)
    .join('|')}`;

  return (
    <div
      className={styles.impactHeatmap}
      style={{ minHeight: chartHeight }}
      aria-hidden="true"
    >
      <ImpactChart
        key={chartKey}
        fallbackContent={null}
        graphTitle={title}
        graphType="heatmap"
        handleChartExpand={() => {}}
        onChartDownload={() => {}}
        seriesData={[
          {
            borderColor: cellBorderColour,
            borderRadius: CELL_RADIUS,
            borderWidth: CELL_BORDER_WIDTH,
            data: heatmapPoints(series),
            dataLabels: {
              color: '#1f2b4d',//cellTextColour
              enabled: true,
              style: {
                fontSize: '16px',
                fontWeight: '600',
                textOutline: 'none',
              },
              formatter(this: HeatmapFormatterContext) {
                return formatValue(this.point.value ?? null);
              },
            },
            name: title,
          },
        ]}
        cardContainer={false}
        height={chartHeight as unknown as null}
        setShowChart={() => {}}
        showChartTypeDropdown={false}
        showDownloadButton={false}
        showDownloadMenu={false}
        showExpandButton={false}
        showScrollX={false}
        showSwitchButton={false}
        showHeader={false}
        stackedColumn={false}
        topRightOptions={null}
        xAxisCategories={categories.map((category) => category.label)}
        xAxisTitle=""
        yAxisTitle=""
        selectedChart={null}
        chartMenuProps={null}
        plotOptionsEvents={null}
        yAxisTitleRight={null}
        chartMarginBottom={chartMarginBottom}
        chartOptions={{
          backgroundColor: 'transparent',
          height: chartHeight,
          marginLeft: rowLabelWidth,
          reflow: false,
          spacingBottom: CHART_SPACING,
          spacingLeft: CHART_SPACING,
          spacingRight: CHART_SPACING,
          spacingTop: CHART_SPACING,
        }}
        colorAxisOptions={{
          stops: colourStops(valueDirection, heatmapScale),
        }}
        legendOptions={{ enabled: false }}
        plotOptionsOptions={{
          heatmap: {
            borderColor: cellBorderColour,
            borderRadius: CELL_RADIUS,
            borderWidth: CELL_BORDER_WIDTH,
          },
        }}
        tooltipOptions={{
          formatter(this: HeatmapFormatterContext) {
            const xLabel = categories[this.point.x]?.label ?? this.point.x;
            const yLabel = series[this.point.y]?.label ?? this.point.y;
            return `${yLabel} / ${xLabel}: ${formatValue(this.point.value ?? null)}`;
          },
        }}
        yAxisOptions={{
          categories: series.map((serie) => serie.label),
          gridLineWidth: 0,
          lineWidth: 0,
          min: 0,
          max: Math.max(series.length - 1, 0),
          offset: 0,
          reversed: true,
          tickLength: 0,
          title: { text: null },
          labels: {
            align: 'right',
            reserveSpace: true,
            style: {
              color: isDarkTheme ? palette.graphite[7] : palette.slate[800],
              fontSize: compact ? '16px' : '16px',
              fontWeight: '600',
              textOverflow: 'ellipsis',
              width: `${rowLabelWidth - 20}px`,
            },
            x: compact ? -10 : -18,
          },
        }}
        xAxisOptions={{
          gridLineWidth: 0,
          lineWidth: 0,
          min: 0,
          max: Math.max(categories.length - 1, 0),
          tickLength: 0,
          title: { text: null },
          labels: {
            style: {
              color: isDarkTheme ? palette.graphite[7] : palette.slate[800],
              fontSize: compact ? '16px' : '18px',
              fontWeight: '600',
            },
            y: compact ? 24 : 28,
          },
        }}
      />
    </div>
  );
}
