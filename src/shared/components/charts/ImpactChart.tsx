import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';

import { ImpactUIChart } from '@shared/components/vendor/impact-ui';
import './guardHighchartsSetSize';
// Registers feature modules (e.g. scatter3d) the vendor Chart tree-shakes away. See file header.
import './highchartsModules';
import './highchartsScrolling.css';
// Register heatmap series for ImpactChart graphType="heatmap" consumers.
import 'highcharts/esm/modules/heatmap.js';

const VendorChart = ImpactUIChart as unknown as ComponentType<Record<string, unknown>>;

export type ImpactChartGraphType =
  | 'area'
  | 'bar'
  | 'column'
  | 'heatmap'
  | 'line'
  | 'pie'
  | 'treemap'
  | 'venn'
  | 'scatter';

export interface ImpactChartProps {
  /** Highcharts graph type. */
  graphType: ImpactChartGraphType;
  /** Series data array (shape depends on graphType). */
  seriesData: unknown[];
  /** X-axis category labels. */
  xAxisCategories?: string[];
  /** Chart header title. */
  graphTitle?: string;
  /** X-axis title text. */
  xAxisTitle?: string;
  /** Y-axis title text. */
  yAxisTitle?: string;
  /** Right Y-axis title (dual-axis charts). */
  yAxisTitleRight?: string | null;
  /** Stack bars/columns. */
  stackedColumn?: boolean;
  /** Enable 3D mode. */
  is3D?: boolean;
  /** Show subtitle. */
  showSubTitle?: boolean;
  /** Subtitle text. */
  subtitleText?: string;
  /** Chart height in px. */
  height?: number | null;
  /** Chart width in px. */
  width?: number | null;
  /** Bottom margin for the chart area. */
  chartMarginBottom?: number;
  /** Show chart header bar. */
  showHeader?: boolean;
  /** Wrap in a card with shadow. */
  cardContainer?: boolean;
  /** Show expand/fullscreen button. */
  showExpandButton?: boolean;
  /** Show download icon button. */
  showDownloadButton?: boolean;
  /** Show download dropdown menu. */
  showDownloadMenu?: boolean;
  /** Include built-in Highcharts download formats. */
  showBuiltInDownloadOptions?: boolean;
  /** Custom download menu items. */
  downloadMenuOptions?: unknown[];
  /** Show chart-type selector dropdown. */
  showChartTypeDropdown?: boolean;
  /** Options for chart-type dropdown. */
  chartTypesOptions?: unknown[];
  /** Currently selected chart type. */
  selectedChart?: unknown;
  /** Props for the chart type menu. */
  chartMenuProps?: unknown;
  /** Enable horizontal scrollbar. */
  showScrollX?: boolean;
  /** Show table/chart toggle. */
  showSwitchButton?: boolean;
  /** Whether to show the chart. */
  showchart?: boolean;
  /** Legend X offset. */
  legendXPosition?: number | null;
  /** Legend Y offset. */
  legendYPosition?: number | null;
  /** X-axis title Y offset. */
  xAxisTitlePositionY?: number | null;
  /** Custom tooltip formatter. */
  customTooltipFormatter?: ((...args: unknown[]) => string) | null;
  /** Share tooltip across series. */
  sharedTooltip?: boolean;
  /** Fallback content when chart has no data. */
  fallbackContent?: ReactNode;
  /** Extra actions in top-right header. */
  topRightOptions?: ReactNode;
  /** Extra content in top-left header. */
  topLeftOptions?: ReactNode;
  /** Custom button in header. */
  customSystemButton?: ReactNode;
  /** Custom legend component. */
  customLegend?: ReactNode;
  /** Style for custom legend container. */
  customLegendStyle?: CSSProperties | null;
  /** Content rendered above the chart body. */
  aboveChartComponent?: ReactNode;
  /** Sub-header below the main header. */
  topSubHeader?: ReactNode;
  /** Programmatically highlight an x-axis point. */
  hoveredXAxisIndex?: number | null;
  /** Show empty state. */
  isEmpty?: boolean;
  /** Show loading skeleton. */
  isLoading?: boolean;
  /** Skeleton shimmer direction. */
  shimmerDirection?: 'auto' | 'ltr' | 'rtl';
  /** Plot options event listeners. */
  plotOptionsEvents?: Record<string, unknown> | null;

  // --- Highcharts configuration overrides ---
  /** Highcharts `chart` config override. */
  chartOptions?: Record<string, unknown>;
  /** Highcharts `title` config override. */
  titleOptions?: Record<string, unknown>;
  /** Highcharts `xAxis` config override. */
  xAxisOptions?: Record<string, unknown>;
  /** Highcharts `yAxis` config override. */
  yAxisOptions?: Record<string, unknown>;
  /** Left Y-axis override (dual-axis charts). */
  yAxisLeftOptions?: Record<string, unknown>;
  /** Right Y-axis override (dual-axis charts). */
  yAxisRightOptions?: Record<string, unknown>;
  /** Z-axis override (3D charts). */
  zAxisOptions?: Record<string, unknown>;
  /** Highcharts `tooltip` config override. */
  tooltipOptions?: Record<string, unknown>;
  /** Highcharts `plotOptions` config override. */
  plotOptionsOptions?: Record<string, unknown>;
  /** Highcharts `subtitle` config override. */
  subtitleOptions?: Record<string, unknown>;
  /** Highcharts `credits` config override. */
  creditsOptions?: Record<string, unknown>;
  /** Highcharts `legend` config override. */
  legendOptions?: Record<string, unknown>;
  /** Highcharts `colorAxis` config override (heatmaps). */
  colorAxisOptions?: Record<string, unknown>;
  /** Additional Highcharts series-level config. */
  seriesOptions?: unknown | null;
  /** Spread into the final Highcharts config object. */
  additionalOptions?: Record<string, unknown>;
  /** Highcharts `exporting` config override. */
  exportingOptions?: Record<string, unknown>;

  // --- Callbacks ---
  /** Download callback. */
  onChartDownload?: () => void;
  /** Expand/fullscreen callback. */
  handleChartExpand?: () => void;
  /** Toggle chart visibility. */
  setShowChart?: () => void;
  /**
   * Escape hatch: any extra props forwarded directly to the vendor Chart.
   * Use for props not explicitly typed above.
   */
  chartProps?: Record<string, unknown>;
}

export function ImpactChart({
  graphType,
  seriesData,
  xAxisCategories = [],
  graphTitle = '',
  xAxisTitle = '',
  yAxisTitle = '',
  yAxisTitleRight = null,
  stackedColumn = false,
  is3D = false,
  showSubTitle = false,
  subtitleText = '',
  height = null,
  width = null,
  chartMarginBottom = 150,
  showHeader = true,
  cardContainer = true,
  showExpandButton = true,
  showDownloadButton = true,
  showDownloadMenu = true,
  showBuiltInDownloadOptions = true,
  downloadMenuOptions = [],
  showChartTypeDropdown = false,
  chartTypesOptions = [],
  selectedChart = null,
  chartMenuProps = null,
  showScrollX = false,
  showSwitchButton = false,
  showchart = true,
  legendXPosition = null,
  legendYPosition = null,
  xAxisTitlePositionY = null,
  customTooltipFormatter = null,
  sharedTooltip = false,
  fallbackContent = null,
  topRightOptions = null,
  topLeftOptions = null,
  customSystemButton = null,
  customLegend = null,
  customLegendStyle = null,
  aboveChartComponent = null,
  topSubHeader = null,
  hoveredXAxisIndex = null,
  isEmpty = false,
  isLoading = false,
  shimmerDirection = 'auto',
  plotOptionsEvents = null,
  chartOptions,
  titleOptions,
  xAxisOptions,
  yAxisOptions,
  yAxisLeftOptions,
  yAxisRightOptions,
  zAxisOptions,
  tooltipOptions,
  plotOptionsOptions,
  subtitleOptions,
  creditsOptions,
  legendOptions,
  colorAxisOptions,
  seriesOptions = null,
  additionalOptions,
  exportingOptions,
  onChartDownload = () => {},
  handleChartExpand = () => {},
  setShowChart = () => {},
  chartProps,
}: ImpactChartProps) {
  // Cheap remount key — never JSON.stringify full series (hangs on large heatmaps).
  const chartKey = useMemo(() => {
    const categoryKey = xAxisCategories.join('|');
    let seriesKey = '0';
    if (Array.isArray(seriesData) && seriesData.length > 0) {
      const head = seriesData[0] as { name?: unknown; data?: unknown[] };
      const dataLen = Array.isArray(head.data) ? head.data.length : 0;
      const name = typeof head.name === 'string' ? head.name : '';
      seriesKey = `${seriesData.length}:${name}:${dataLen}`;
    }
    return `${graphType}:${graphTitle}:${categoryKey}:${seriesKey}`;
  }, [graphType, graphTitle, xAxisCategories, seriesData]);

  const mergedChartOptions: Record<string, unknown> = {
    // Highcharts paints `.highcharts-scrollable-mask` with this fill so the
    // fixed Y-axis covers the plot while it scrolls. `transparent` is truthy,
    // so it disables the default `#fff` fallback and the series shows through.
    backgroundColor: showScrollX ? 'var(--color-surface, #ffffff)' : 'transparent',
    plotBackgroundColor: 'transparent',
    reflow: false,
    animation: false,
    ...(height != null && { height }),
    ...(width != null && { width }),
    ...chartOptions,
  };

  return (
    <VendorChart
      key={chartKey}
      graphType={graphType}
      seriesData={seriesData}
      xAxisCategories={xAxisCategories}
      graphTitle={graphTitle}
      xAxisTitle={xAxisTitle}
      yAxisTitle={yAxisTitle}
      yAxisTitleRight={yAxisTitleRight}
      stackedColumn={stackedColumn}
      is3D={is3D}
      showSubTitle={showSubTitle}
      subtitleText={subtitleText}
      height={height}
      width={width}
      chartMarginBottom={chartMarginBottom}
      showHeader={showHeader}
      cardContainer={cardContainer}
      showExpandButton={showExpandButton}
      showDownloadButton={showDownloadButton}
      showDownloadMenu={showDownloadMenu}
      showBuiltInDownloadOptions={showBuiltInDownloadOptions}
      downloadMenuOptions={downloadMenuOptions}
      showChartTypeDropdown={showChartTypeDropdown}
      chartTypesOptions={chartTypesOptions}
      selectedChart={selectedChart}
      chartMenuProps={chartMenuProps}
      showScrollX={showScrollX}
      showSwitchButton={showSwitchButton}
      showchart={showchart}
      legendXPosition={legendXPosition}
      legendYPosition={legendYPosition}
      xAxisTitlePositionY={xAxisTitlePositionY}
      customTooltipFormatter={customTooltipFormatter}
      sharedTooltip={sharedTooltip}
      fallbackContent={fallbackContent}
      topRightOptions={topRightOptions}
      topLeftOptions={topLeftOptions}
      customSystemButton={customSystemButton}
      customLegend={customLegend}
      customLegendStyle={customLegendStyle}
      aboveChartComponent={aboveChartComponent}
      topSubHeader={topSubHeader}
      hoveredXAxisIndex={hoveredXAxisIndex}
      isEmpty={isEmpty}
      isLoading={isLoading}
      shimmerDirection={shimmerDirection}
      plotOptionsEvents={plotOptionsEvents}
      chartOptions={mergedChartOptions}
      titleOptions={titleOptions}
      xAxisOptions={xAxisOptions}
      yAxisOptions={yAxisOptions}
      yAxisLeftOptions={yAxisLeftOptions}
      yAxisRightOptions={yAxisRightOptions}
      zAxisOptions={zAxisOptions}
      tooltipOptions={tooltipOptions}
      plotOptionsOptions={plotOptionsOptions}
      subtitleOptions={subtitleOptions}
      creditsOptions={creditsOptions}
      legendOptions={legendOptions}
      colorAxisOptions={colorAxisOptions}
      seriesOptions={seriesOptions}
      additionalOptions={additionalOptions}
      exportingOptions={exportingOptions}
      onChartDownload={onChartDownload}
      handleChartExpand={handleChartExpand}
      setShowChart={setShowChart}
      {...chartProps}
    />
  );
}
