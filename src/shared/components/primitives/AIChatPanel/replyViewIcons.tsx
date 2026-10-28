import { type ComponentType, type ReactNode } from 'react';
import type { ReplyViewId } from './replyViewGroups';

/**
 * Visual glyphs the type toggle can draw. Wider than `ReplyViewId` so Bar vs
 * Column and Pie vs Donut stay distinct even though grouping still merges
 * `bar`+`column` and the product labels `pie` as Donut Chart.
 */
export const REPLY_VIEW_GLYPH_IDS = [
  'text',
  'bar',
  'column',
  'line',
  'area',
  'pie',
  'donut',
  'table',
  'heatmap',
  'chart',
] as const;

export type ReplyViewGlyphId = (typeof REPLY_VIEW_GLYPH_IDS)[number];

function Glyph({ id, children }: { id: ReplyViewGlyphId; children: ReactNode }) {
  return (
    <svg
      data-glyph={id}
      viewBox="0 0 16 16"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function TextGlyph() {
  return (
    <Glyph id="text">
      <path d="M3.5 3.5h9" />
      <path d="M3.5 6.5h9" />
      <path d="M3.5 9.5h6.5" />
      <path d="M3.5 12.5h4.5" />
    </Glyph>
  );
}

function BarGlyph() {
  return (
    <Glyph id="bar">
      <path d="M2.5 4h11" />
      <path d="M2.5 8h7.5" />
      <path d="M2.5 12h9.5" />
    </Glyph>
  );
}

function ColumnGlyph() {
  return (
    <Glyph id="column">
      <path d="M4 13.5V7" />
      <path d="M8 13.5V3.5" />
      <path d="M12 13.5V9" />
    </Glyph>
  );
}

function LineGlyph() {
  return (
    <Glyph id="line">
      <path d="M2.5 11.5 6 7.5l3 2.5 4.5-6" />
    </Glyph>
  );
}

function AreaGlyph() {
  return (
    <Glyph id="area">
      <path d="M2.5 12.5V8.5l3.5-3 3 2 4.5-4v9z" />
    </Glyph>
  );
}

function PieGlyph() {
  return (
    <Glyph id="pie">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 8 8 2.5" />
      <path d="M8 8 12.7 10.5" />
    </Glyph>
  );
}

function DonutGlyph() {
  return (
    <Glyph id="donut">
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2.25" />
    </Glyph>
  );
}

function TableGlyph() {
  return (
    <Glyph id="table">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.25" />
      <path d="M2.5 6.5h11M2.5 10.5h11M6.5 2.5v11" />
    </Glyph>
  );
}

function HeatmapGlyph() {
  return (
    <Glyph id="heatmap">
      <rect x="2.5" y="2.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="2.5" width="3" height="3" rx="0.5" />
      <rect x="10.5" y="2.5" width="3" height="3" rx="0.5" />
      <rect x="2.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="10.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="2.5" y="10.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="10.5" width="3" height="3" rx="0.5" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" />
    </Glyph>
  );
}

function ChartFallbackGlyph() {
  return (
    <Glyph id="chart">
      <path d="M2.5 13.5h11" />
      <path d="M5 13.5V8" />
      <path d="M8 13.5V5" />
      <path d="M11 13.5V10" />
    </Glyph>
  );
}

/** Full glyph set — including pairs grouping does not currently emit. */
export const REPLY_VIEW_GLYPHS: Record<ReplyViewGlyphId, ComponentType> = {
  text: TextGlyph,
  bar: BarGlyph,
  column: ColumnGlyph,
  line: LineGlyph,
  area: AreaGlyph,
  pie: PieGlyph,
  donut: DonutGlyph,
  table: TableGlyph,
  heatmap: HeatmapGlyph,
  chart: ChartFallbackGlyph,
};

/**
 * Which glyph a grouped view uses. `bar` stays horizontal (label is "Bar Chart");
 * `pie` uses the donut glyph because product copy is "Donut Chart".
 */
export const REPLY_VIEW_GLYPH: Record<ReplyViewId, ReplyViewGlyphId> = {
  text: 'text',
  bar: 'bar',
  line: 'line',
  area: 'area',
  pie: 'donut',
  heatmap: 'heatmap',
  table: 'table',
  chart: 'chart',
};

export function glyphForReplyView(view: ReplyViewId): ReplyViewGlyphId {
  return REPLY_VIEW_GLYPH[view] ?? 'chart';
}

export function iconComponentForReplyView(view: ReplyViewId): ComponentType {
  const glyph = glyphForReplyView(view);
  return REPLY_VIEW_GLYPHS[glyph] ?? REPLY_VIEW_GLYPHS.chart;
}

export function ReplyViewIcon({ view }: { view: ReplyViewId }) {
  const Icon = iconComponentForReplyView(view);
  return <Icon />;
}
