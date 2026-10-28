import { seriesColour } from './seriesColour';
import type { ChartCategory, ChartSeries } from './types';
import styles from './charts.module.css';

interface SemiDonutPlotProps {
  categories: ChartCategory[];
  series: ChartSeries[];
  formatValue: (value: number | null) => string;
  height: number;
}

const RADIUS = 90;
const THICKNESS = 26;
const CENTRE_X = 110;
const CENTRE_Y = 104;

function pointOnArc(angle: number, radius: number): [number, number] {
  const radians = (angle - 180) * (Math.PI / 180);
  return [CENTRE_X + radius * Math.cos(radians), CENTRE_Y + radius * Math.sin(radians)];
}

function arcPath(startAngle: number, endAngle: number): string {
  const outer = RADIUS;
  const inner = RADIUS - THICKNESS;
  const [x1, y1] = pointOnArc(startAngle, outer);
  const [x2, y2] = pointOnArc(endAngle, outer);
  const [x3, y3] = pointOnArc(endAngle, inner);
  const [x4, y4] = pointOnArc(startAngle, inner);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M${x1} ${y1}`,
    `A${outer} ${outer} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L${x3} ${y3}`,
    `A${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

/**
 * Contribution rendering as a half ring. The first series carries one value per category,
 * matching how a contribution chart is a single distribution rather than a comparison.
 */
export function SemiDonutPlot({
  categories,
  series,
  formatValue,
  height,
}: SemiDonutPlotProps) {
  const distribution = series[0];
  const values = distribution?.values ?? [];

  // Each slice is its own subject here, so a per-point colour wins over the series colour.
  const sliceColour = (index: number): string =>
    distribution?.pointColors?.[index] ?? distribution?.color ?? seriesColour(index);

  const total = values.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  if (total === 0) return null;

  let cursor = 0;
  const segments = categories.map((category, index) => {
    const value = values[index] ?? 0;
    const sweep = (value / total) * 180;
    const start = cursor;
    cursor += sweep;
    return { category, value, start, end: cursor, index };
  });

  const leader = [...segments].sort((a, b) => b.value - a.value)[0];

  return (
    <div className={styles.donutWrap} style={{ minHeight: height }}>
      <svg
        className={styles.donut}
        viewBox={`0 0 220 ${CENTRE_Y + 8}`}
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        {segments.map(({ category, start, end, index }) =>
          end - start <= 0 ? null : (
            <path
              key={category.id}
              d={arcPath(start, end)}
              fill={sliceColour(index)}
              className={styles.donutSegment}
            />
          ),
        )}
        {leader !== undefined && (
          <>
            <text
              className={styles.donutValue}
              x={CENTRE_X}
              y={CENTRE_Y - 26}
              textAnchor="middle"
            >
              {formatValue(leader.value)}
            </text>
            <text
              className={styles.donutLabel}
              x={CENTRE_X}
              y={CENTRE_Y - 8}
              textAnchor="middle"
            >
              {leader.category.label}
            </text>
          </>
        )}
      </svg>
      <ul className={styles.legend}>
        {segments.map(({ category, value, index }) => (
          <li key={category.id} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: sliceColour(index) }}
            />
            <span className={styles.legendLabel}>{category.label}</span>
            <span className={styles.legendValue}>{formatValue(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
