import './guardHighchartsSetSize';
import { Chart } from '@shared/components/vendor/impact-ui';
import type { ComponentType } from 'react';
import styles from './charts.module.css';

const ImpactChart = Chart as unknown as ComponentType<Record<string, unknown>>;

export interface ImpactDonutPoint {
  name: string;
  y: number;
  color: string;
}

export interface ImpactDonutChartProps {
  title: string;
  points: ImpactDonutPoint[];
}

const DONUT_SIZE = 100;
const PIE_SIZE = 84;

function formatTooltipValue(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(value);
}

export function ImpactDonutChart({ title, points }: ImpactDonutChartProps) {
  const chartKey = points
    .map((point) => `${point.name}:${point.y}:${point.color}`)
    .join('|');

  return (
    <div className={styles.impactDonut} aria-hidden="true">
      <ImpactChart
        key={chartKey}
        fallbackContent={null}
        graphTitle=""
        graphType="pie"
        handleChartExpand={() => {}}
        onChartDownload={() => {}}
        seriesData={[
          {
            data: points,
            name: title,
          },
        ]}
        cardContainer={false}
        chartMarginBottom={0}
        height={DONUT_SIZE as unknown as null}
        setShowChart={() => {}}
        showChartTypeDropdown={false}
        showDownloadButton={false}
        showDownloadMenu={false}
        showExpandButton={false}
        showHeader={false}
        showScrollX={false}
        showSwitchButton={false}
        stackedColumn={false}
        topRightOptions={null}
        width={DONUT_SIZE as unknown as null}
        xAxisCategories={[]}
        xAxisTitle=""
        yAxisTitle=""
        selectedChart={null}
        chartMenuProps={null}
        plotOptionsEvents={null}
        yAxisTitleRight={null}
        chartOptions={{
          backgroundColor: 'transparent',
          height: DONUT_SIZE,
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0],
          reflow: false,
          width: DONUT_SIZE,
        }}
        plotOptionsOptions={{
          pie: {
            borderWidth: 0,
            opacity: 0.8,
            center: ['50%', '50%'],
            dataLabels: { enabled: false },
            innerSize: '72%',
            size: PIE_SIZE,
            states: {
              hover: {
                brightness: 0,
                halo: {
                  opacity: 0.2,
                  size: 5,
                },
              },
            },
          },
        }}
        legendOptions={{ enabled: false }}
        tooltipOptions={{
          enabled: true,
          distance: 12,
          outside: true,
          positioner(
            this: { chart: { chartWidth: number; plotLeft: number; plotTop: number } },
            labelWidth: number,
            _labelHeight: number,
            point: { plotX: number; plotY: number },
          ) {
            const x = this.chart.plotLeft + point.plotX - labelWidth / 2;
            return {
              x: Math.max(0, Math.min(x, this.chart.chartWidth - labelWidth)),
              y: this.chart.plotTop + point.plotY + 12,
            };
          },
          useHTML: true,
          formatter(this: {
            point?: { color?: string; name?: string; percentage?: number };
            y?: number;
          }) {
            const value = this.y ?? 0;
            const name = this.point?.name ?? title;
            const color = this.point?.color ?? '#1f2b4d';
            const percent =
              this.point?.percentage === undefined
                ? ''
                : ` (${new Intl.NumberFormat(undefined, {
                    maximumFractionDigits: 0,
                    style: 'percent',
                  }).format(this.point.percentage / 100)})`;
            return `<span style="color:${color}">●</span> ${name}: <b>${formatTooltipValue(value)}</b>${percent}`;
          },
        }}
      />
    </div>
  );
}
