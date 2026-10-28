import { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatMetric, formatUnit, type TrendPoint } from '../data';
import { seriesColour } from '@shared/components/charts';
import { DataState, WorkspaceTable } from '../components/ui';
import styles from './screens.module.css';

export function ScreenChart({ points, metric, comparisonLabel, onSelectWeeks, events = [], selectedWeeks = [] }: {
  points: TrendPoint[];
  metric: 'sales' | 'quantity' | 'gmRate';
  comparisonLabel: string;
  onSelectWeeks?: (ids: string[]) => void;
  events?: { weekId: string; label: string }[];
  selectedWeeks?: string[];
}) {
  const options = useMemo<Highcharts.Options>(() => ({
    chart: {
      type: 'line', height: 300, backgroundColor: 'var(--color-surface, #ffffff)', spacing: [10, 10, 12, 10],
      style: { fontFamily: 'Manrope, sans-serif' }, zooming: { type: onSelectWeeks ? 'x' : undefined },
      events: {
        selection(event) {
          if (!event.xAxis?.[0] || !onSelectWeeks) return false;
          const { min, max } = event.xAxis[0];
          const ids = points.filter((_, index) => index >= Math.ceil(min) && index <= Math.floor(max)).map(point => point.id);
          if (ids.length) onSelectWeeks(ids);
          return false;
        },
      },
    },
    title: { text: undefined }, credits: { enabled: false }, accessibility: { enabled: false },
    xAxis: {
      categories: points.map(point => point.label), lineColor: 'var(--color-border, #d9dde7)', tickLength: 0,
      labels: { style: { color: 'var(--color-text-secondary, #60697d)', fontFamily:'Manrope, sans-serif',fontSize: '12px' } },
      plotLines: events.filter(event => points.some(point => point.id === event.weekId)).map(event => ({
        value: points.findIndex(point => point.id === event.weekId), color: '#b7bfd2', dashStyle: 'Dot', width: 1,
        label: { text: event.label, rotation: 0, y: 10, style: { color: '#737d8e', fontSize: '10px' } },
      })),
    },
    yAxis: {
      title: { text: metric === 'sales' ? 'Sales (USD)' : metric === 'gmRate' ? 'Gross margin (%)' : `Quantity (${formatUnit(points[0]?.actual.unit ?? 'compatible UOM')})`, style: { color: 'var(--color-text-secondary, #60697d)', fontFamily:'Manrope, sans-serif',fontSize: '12px' } },
      lineWidth:1,lineColor:'var(--color-border, #d9dde7)',gridLineColor:'var(--color-border, #d9dde7)',gridLineWidth:1,gridLineDashStyle:'Dash',
      labels: { style: { color: 'var(--color-text-secondary, #60697d)', fontFamily:'Manrope, sans-serif',fontSize: '12px' }, formatter() { return metric === 'gmRate' ? `${this.value}%` : Highcharts.numberFormat(Number(this.value), 0); } },
    },
    legend: { align: 'center', itemStyle: { fontFamily:'Manrope, sans-serif',fontSize: '13px', fontWeight: '400', color: 'var(--color-text-secondary, #60697d)' }, symbolWidth: 12, symbolPadding: 8, itemDistance: 64, itemMarginTop:8 },
    tooltip: {
      shared: true,useHTML:true,className:'custom-tooltip',borderWidth:0,borderRadius:8,borderColor:'transparent',backgroundColor:'var(--color-surface, #ffffff)',shadow:{color:'rgba(0,0,0,0.2)',offsetX:2,offsetY:2,opacity:.3}, style:{fontFamily:'Manrope, sans-serif',fontSize:'12px',color:'var(--color-text-primary, #1f2b4d)'},
      formatter() {
        const point = points[this.points?.[0]?.index ?? this.index ?? 0];
        if (!point) return '';
        return `<b>${point.label}</b><br/>${point.start} to ${point.end}<br/>Actual: ${formatMetric(point.actual, { includeUnit: true })}<br/>${comparisonLabel}: ${formatMetric(point.comparison, { includeUnit: true })}`;
      },
    },
    plotOptions: {
      series: {
        animation: false,connectNulls:false, marker: { enabled: false, radius: 3 },states:{hover:{lineWidthPlus:0}},
        point: { events: { click() { onSelectWeeks?.([points[this.index]?.id].filter(Boolean)); } } },
      },
    },
    series: [
      { type: 'line', name: 'Actual', data: points.map(point => point.actual.value), color: seriesColour(0), lineWidth: 2 },
      ...(comparisonLabel !== 'No comparison' ? [{ type: 'line' as const, name: comparisonLabel, data: points.map(point => point.comparison.value), color: seriesColour(1), lineWidth: 2 }] : []),
    ],
  }), [points, metric, comparisonLabel, onSelectWeeks, events]);
  if (!points.length) return <DataState state="empty" title="No complete weeks in this selection" description="Change the fiscal window or reset the local week selection." />;
  if (points.every(point => point.actual.state === 'restricted')) return <DataState state="restricted" description="Choose sales or compatible quantity. Restricted margin is excluded from the chart, table and export." />;
  return <>
    <div aria-hidden="true" className={styles.chart}><HighchartsReact highcharts={Highcharts} options={options} /></div>
    <details className={styles.dataAlternative}><summary>View chart data and definitions</summary>
      <WorkspaceTable caption="Trend data" rows={points} rowKey={point => point.id} columns={[
        { key: 'week', label: 'Fiscal interval', render: point => <div>{onSelectWeeks ? <button type="button" className={styles.link} aria-label={`Inspect ${point.label} contributing items`} aria-pressed={selectedWeeks.includes(point.id)} onClick={() => onSelectWeeks([point.id])}>{point.label}</button> : point.label}<small className={styles.mutedBlock}>{point.start} – {point.end}</small></div> },
        { key: 'actual', label: 'Actual', align: 'right', render: point => formatMetric(point.actual) },
        { key: 'comparison', label: comparisonLabel, align: 'right', render: point => formatMetric(point.comparison) },
      ]} />
      <p>Values: {formatUnit(points[0]?.actual.unit??'unavailable unit')}. Ratios are recalculated from contributing facts for each interval. A selected week is an explicit analysis cut; stock and range dates remain independent.</p>
    </details>
  </>;
}
