import { useId, useRef, useState } from 'react';
import { seriesColour } from './seriesColour';
import { DEFAULT_PLOT, axisMax, innerHeight, innerWidth, ticks } from './plotGeometry';
import type { ChartCategory, ChartKind, ChartSeries } from './types';
import {
  COLUMN_BAR_POINT_WIDTH,
  COLUMN_BAR_TOP_RADIUS,
  COLUMN_CATEGORY_LINE_HEIGHT,
  COLUMN_PLOT_PAD,
  charsPerCategorySlot,
  columnBarGradient,
  roundedTopBarPath,
  wrapCategoryLabel,
} from './columnChartTheme';
import styles from './charts.module.css';

interface CategoryTooltipState {
  text: string;
  /** SVG x of the category centre — converted to % of the host so scaling stays aligned. */
  x: number;
  /** SVG y at the top of the label band — tooltip sits just above so scroll parents do not clip it. */
  y: number;
  /**
   * Horizontal growth direction. `start` / `end` keep the tip clear of the pinned y-axis
   * and the plot scroll edges when the category sits near a viewport side.
   */
  align: 'start' | 'center' | 'end';
}

function tooltipAlignForView(
  hit: Element,
  host: HTMLElement,
): CategoryTooltipState['align'] {
  const view = (host.closest('[role="region"]') as HTMLElement | null) ?? host;
  const viewRect = view.getBoundingClientRect();
  const hitRect = hit.getBoundingClientRect();
  const mid = hitRect.left + hitRect.width / 2;
  const rel = (mid - viewRect.left) / Math.max(viewRect.width, 1);
  if (rel < 0.28) return 'start';
  if (rel > 0.72) return 'end';
  return 'center';
}

export type CartesianPlotPane = 'full' | 'yAxis' | 'plot';

interface CartesianPlotProps {
  kind: Extract<ChartKind, 'column' | 'stackedColumn' | 'line' | 'area'>;
  categories: ChartCategory[];
  series: ChartSeries[];
  formatValue: (value: number | null) => string;
  height: number;
  /**
   * Pixel width of the SVG. When omitted the plot fills its parent (the original ChartFrame
   * behaviour). Chat passes an intrinsic width so categories keep a minimum slot and the
   * bubble scrolls instead of compressing labels.
   */
  width?: number;
  /**
   * `yAxis` is a pinned label strip. `plot` is the scrolling bars and x-labels with no
   * y-tick text. Omit (`full`) for a single SVG, as ChartFrame does.
   */
  pane?: CartesianPlotPane;
}

const BAND_INSET = 0.18;

function isColumnKind(
  kind: CartesianPlotProps['kind'],
): kind is 'column' | 'stackedColumn' {
  return kind === 'column' || kind === 'stackedColumn';
}

function gradientId(uid: string, index: number): string {
  return `col-grad-${uid}-${index}`;
}

/**
 * Column, stacked column, line, and area rendering.
 *
 * The SVG is `aria-hidden` throughout: `ChartFrame` publishes the same figures as a real
 * data table, which is a better experience for a screen reader than any amount of ARIA on
 * the shapes.
 */
export function CartesianPlot({
  kind,
  categories,
  series,
  formatValue,
  height,
  width,
  pane = 'full',
}: CartesianPlotProps) {
  const uid = useId().replace(/:/g, '');
  const hostRef = useRef<HTMLDivElement>(null);
  const [categoryTip, setCategoryTip] = useState<CategoryTooltipState | null>(null);
  const column = isColumnKind(kind);
  const showYLabels = pane !== 'plot';
  const showPlot = pane !== 'yAxis';
  const padLeft =
    pane === 'plot' && column
      ? COLUMN_PLOT_PAD.plot
      : pane === 'yAxis'
        ? COLUMN_PLOT_PAD.left
        : column
          ? COLUMN_PLOT_PAD.left
          : DEFAULT_PLOT.padLeft;
  const box = column
    ? {
        width: pane === 'yAxis' ? COLUMN_PLOT_PAD.left : (width ?? DEFAULT_PLOT.width),
        height,
        padTop: COLUMN_PLOT_PAD.top,
        padRight: pane === 'yAxis' ? 0 : COLUMN_PLOT_PAD.right,
        padBottom: COLUMN_PLOT_PAD.bottom,
        padLeft,
      }
    : { ...DEFAULT_PLOT, height, width: width ?? DEFAULT_PLOT.width };
  const plotWidth = innerWidth(box);
  const plotHeight = innerHeight(box);
  const stacked = kind === 'stackedColumn';
  const max = axisMax(series, stacked);
  const bandWidth = categories.length > 0 ? plotWidth / categories.length : plotWidth;
  const categoryWrapChars = charsPerCategorySlot(bandWidth);

  const yOf = (value: number) => box.padTop + plotHeight - (value / max) * plotHeight;
  const bandCentre = (index: number) => box.padLeft + bandWidth * (index + 0.5);
  const labelBandTop = box.padTop + plotHeight;

  return (
    <div
      ref={hostRef}
      className={width === undefined ? styles.plotHost : styles.plotHostIntrinsic}
      style={
        width === undefined
          ? { height }
          : { width: box.width, height: box.height }
      }
    >
    <svg
      className={width === undefined ? styles.plot : styles.plotIntrinsic}
      viewBox={`0 0 ${box.width} ${box.height}`}
      preserveAspectRatio={width === undefined ? 'none' : 'xMinYMid meet'}
      width={width === undefined ? undefined : box.width}
      height={width === undefined ? undefined : box.height}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {column && showPlot && (
        <defs>
          {series.map((serie, index) => {
            const stop = columnBarGradient(index);
            return (
              <linearGradient
                key={serie.id}
                id={gradientId(uid, index)}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={stop.color} />
                <stop offset="100%" stopColor={stop.fade} />
              </linearGradient>
            );
          })}
        </defs>
      )}

      {pane === 'yAxis' && (
        <rect
          className={styles.yAxisBackdrop}
          x="0"
          y="0"
          width={box.width}
          height={box.height}
        />
      )}

      {ticks(max).map((tick) => (
        <g key={tick}>
          {showPlot && (
            <line
              className={column ? styles.gridlineDashed : styles.gridline}
              x1={box.padLeft}
              x2={box.width - box.padRight}
              y1={yOf(tick)}
              y2={yOf(tick)}
            />
          )}
          {showYLabels && (
            <text
              className={column ? styles.yAxisLabel : styles.axisLabel}
              x={box.padLeft - 8}
              y={yOf(tick) + 4}
              textAnchor="end"
            >
              {formatValue(tick)}
            </text>
          )}
        </g>
      ))}

      {showPlot &&
        column &&
        categories.map((category, categoryIndex) => {
          const slotWidth = bandWidth * (1 - BAND_INSET * 2);
          const seriesCount = Math.max(series.length, 1);
          const groupedWidth = stacked
            ? COLUMN_BAR_POINT_WIDTH
            : Math.min(
                COLUMN_BAR_POINT_WIDTH,
                Math.max((slotWidth - (seriesCount - 1) * 4) / seriesCount, 1),
              );
          const clusterWidth = stacked
            ? groupedWidth
            : groupedWidth * seriesCount + 4 * (seriesCount - 1);
          const clusterStart =
            box.padLeft + bandWidth * categoryIndex + (bandWidth - clusterWidth) / 2;
          let stackBase = 0;

          return (
            <g key={category.id}>
              {series.map((serie, serieIndex) => {
                const value = serie.values[categoryIndex];
                if (value === null || value === undefined) return null;

                const barHeight = Math.max((value / max) * plotHeight, 0);
                const x = stacked
                  ? clusterStart
                  : clusterStart + (groupedWidth + 4) * serieIndex;
                const y = stacked ? yOf(stackBase + value) : yOf(value);
                if (stacked) stackBase += value;
                const path = roundedTopBarPath(
                  x,
                  y,
                  groupedWidth,
                  barHeight,
                  COLUMN_BAR_TOP_RADIUS,
                );
                if (path === '') return null;

                return (
                  <path
                    key={serie.id}
                    className={styles.bar}
                    d={path}
                    fill={
                      serie.color ??
                      (column
                        ? `url(#${gradientId(uid, serieIndex)})`
                        : seriesColour(serieIndex))
                    }
                  />
                );
              })}
            </g>
          );
        })}

      {showPlot &&
        (kind === 'line' || kind === 'area') &&
        series.map((serie, serieIndex) => {
          const colour = serie.color ?? seriesColour(serieIndex);
          const points = serie.values
            .map((value, index) =>
              value === null || value === undefined
                ? null
                : { x: bandCentre(index), y: yOf(value) },
            )
            .filter((p): p is { x: number; y: number } => p !== null);

          if (points.length === 0) return null;
          const path = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`)
            .join(' ');
          const baseline = box.padTop + plotHeight;

          return (
            <g key={serie.id}>
              {kind === 'area' && (
                <path
                  className={styles.area}
                  d={`${path} L${points[points.length - 1].x} ${baseline} L${points[0].x} ${baseline} Z`}
                  fill={colour}
                />
              )}
              <path className={styles.line} d={path} stroke={colour} />
              {points.map((p) => (
                <circle
                  key={`${serie.id}-${p.x}`}
                  className={styles.marker}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill={colour}
                />
              ))}
            </g>
          );
        })}

      {showPlot && !column && (
        <line
          className={styles.axis}
          x1={box.padLeft}
          x2={box.width - box.padRight}
          y1={box.padTop + plotHeight}
          y2={box.padTop + plotHeight}
        />
      )}

      {showPlot &&
        categories.map((category, index) => {
          const lines = wrapCategoryLabel(category.label, categoryWrapChars);
          const firstLineY = labelBandTop + 16 + (lines.length > 1 ? 0 : 4);
          const truncated = lines.some((line) => line.endsWith('…'));
          const centreX = bandCentre(index);
          return (
            <g key={category.id}>
              <text
                className={column ? styles.categoryLabel : styles.axisLabel}
                x={centreX}
                y={firstLineY}
                textAnchor="middle"
              >
                {lines.map((line, lineIndex) => (
                  <tspan
                    key={`${category.id}-${lineIndex}`}
                    x={centreX}
                    dy={lineIndex === 0 ? 0 : COLUMN_CATEGORY_LINE_HEIGHT}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              {truncated ? (
                <rect
                  className={styles.categoryHit}
                  data-testid="cartesian-category-hit"
                  data-category-label={category.label}
                  x={box.padLeft + bandWidth * index}
                  y={labelBandTop}
                  width={Math.max(bandWidth, 1)}
                  height={box.padBottom}
                  fill="transparent"
                  onMouseEnter={(event) => {
                    const host = hostRef.current;
                    setCategoryTip({
                      text: category.label,
                      x: centreX,
                      y: labelBandTop,
                      align: host
                        ? tooltipAlignForView(event.currentTarget, host)
                        : 'center',
                    });
                  }}
                  onMouseLeave={() => setCategoryTip(null)}
                />
              ) : null}
            </g>
          );
        })}
    </svg>
    {categoryTip ? (
      <div
        role="tooltip"
        data-testid="cartesian-category-tooltip"
        data-align={categoryTip.align}
        className={[
          styles.categoryTooltip,
          categoryTip.align === 'start' ? styles.categoryTooltipStart : '',
          categoryTip.align === 'end' ? styles.categoryTooltipEnd : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          left: `${(categoryTip.x / box.width) * 100}%`,
          top: categoryTip.y,
        }}
      >
        {categoryTip.text}
      </div>
    ) : null}
    </div>
  );
}
