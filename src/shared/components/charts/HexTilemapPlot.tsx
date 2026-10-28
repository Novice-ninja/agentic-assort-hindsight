import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hexColorForValue } from './hexMapLegend';
import type { HexMapLegendBand } from './hexMapLegend';
import { layoutHexMap, type StoreHexPoint } from './hexMapLayout';
import { HEX_WORLD_GRID } from './hexWorldGrid';
import styles from './HexTilemapPlot.module.css';

export type { StoreHexPoint } from './hexMapLayout';
export type { HexMapLegendBand } from './hexMapLegend';

export interface HexTilemapPlotProps {
  stores: StoreHexPoint[];
  legend: HexMapLegendBand[];
  height?: number;
  backgroundColor?: string;
  dataTableCaption?: string;
  /** Metric catalogue label for tooltips and the text alternative, e.g. `ST%` or `GM%`. */
  metricLabel?: string;
  /**
   * Formats the metric in the hover tooltip and accessible data table.
   * Hosts should pass the same formatter used on other overview charts (e.g. `formatAxisTick`).
   */
  formatValue?: (value: number) => string;
}

const HEX_PATH =
  'M9.56148 9.69087C9.20834 10.3244 8.53986 10.7171 7.81452 10.7171H3.94774C3.23129 10.7171 2.56957 10.3339 2.21301 9.71249L0.265298 6.3179C-0.090937 5.69704-0.0882008 4.93312 0.272474 4.31482L2.21064 0.992257C2.56906 0.377822 3.22686 0 3.93819 0H7.824C8.54428 0 9.20893 0.387309 9.56404 1.01397L11.4467 4.33636C11.7909 4.94364 11.7935 5.6864 11.4536 6.2961L9.56148 9.69087Z';

const HEX_W = 12;
const HEX_H = 10.72;
const COL_STEP = 11.5;
const ROW_STEP = 13.28;
const ROW_OFFSET = 6.64;

const MAP_HEIGHT = 315;
const BG_COLOR = '#eceefd';
const ZOOM_STEP = 25;
const ZOOM_MIN = 50;
const ZOOM_MAX = 300;
const ZOOM_DEFAULT = 100;
const VIEWPORT_PADDING = 4;
const MIN_SPAN_X = 20;
const MIN_SPAN_Y = 12;

function hexToPixel(col: number, row: number): { px: number; py: number } {
  const px = col * COL_STEP;
  const py = row * ROW_STEP + (col % 2 === 1 ? ROW_OFFSET : 0);
  return { px, py };
}

interface Viewport {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function computeViewport(projectedStores: { x: number; y: number }[]): Viewport {
  if (projectedStores.length === 0) {
    const allX = HEX_WORLD_GRID.map((t) => t.x);
    const allY = HEX_WORLD_GRID.map((t) => t.y);
    return {
      minX: Math.min(...allX),
      maxX: Math.max(...allX),
      minY: Math.min(...allY),
      maxY: Math.max(...allY),
    };
  }

  const xs = projectedStores.map((p) => p.x);
  const ys = projectedStores.map((p) => p.y);

  let minX = Math.min(...xs) - VIEWPORT_PADDING;
  let maxX = Math.max(...xs) + VIEWPORT_PADDING;
  let minY = Math.min(...ys) - VIEWPORT_PADDING;
  let maxY = Math.max(...ys) + VIEWPORT_PADDING;

  const spanX = maxX - minX;
  if (spanX < MIN_SPAN_X) {
    const cx = (minX + maxX) / 2;
    minX = cx - MIN_SPAN_X / 2;
    maxX = cx + MIN_SPAN_X / 2;
  }

  const spanY = maxY - minY;
  if (spanY < MIN_SPAN_Y) {
    const cy = (minY + maxY) / 2;
    minY = cy - MIN_SPAN_Y / 2;
    maxY = cy + MIN_SPAN_Y / 2;
  }

  return { minX, maxX, minY, maxY };
}

interface MapViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MapExtents {
  fullW: number;
  fullH: number;
}

function extentsFromViewport(vp: Viewport): MapExtents {
  return {
    fullW: (vp.maxX - vp.minX + 1) * COL_STEP + HEX_W,
    fullH: (vp.maxY - vp.minY + 1) * ROW_STEP + HEX_H + ROW_OFFSET,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sizeForZoom(extents: MapExtents, zoomLevel: number): { w: number; h: number } {
  const scale = 100 / zoomLevel;
  return { w: extents.fullW * scale, h: extents.fullH * scale };
}

function centeredViewBox(extents: MapExtents, zoomLevel: number): MapViewBox {
  const { w, h } = sizeForZoom(extents, zoomLevel);
  return {
    x: (extents.fullW - w) / 2,
    y: (extents.fullH - h) / 2,
    w,
    h,
  };
}

function clampViewBox(vb: MapViewBox, extents: MapExtents): MapViewBox {
  let { x, y } = vb;
  if (vb.w >= extents.fullW) {
    x = (extents.fullW - vb.w) / 2;
  } else {
    x = clamp(x, 0, extents.fullW - vb.w);
  }
  if (vb.h >= extents.fullH) {
    y = (extents.fullH - vb.h) / 2;
  } else {
    y = clamp(y, 0, extents.fullH - vb.h);
  }
  return { ...vb, x, y };
}

function clientToSvgPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const mapped = point.matrixTransform(ctm.inverse());
  return { x: mapped.x, y: mapped.y };
}

interface TooltipData {
  name: string;
  cluster: string;
  value: number;
  x: number;
  y: number;
}

export function HexTilemapPlot({
  stores,
  legend,
  height = MAP_HEIGHT,
  backgroundColor = BG_COLOR,
  dataTableCaption = 'Store hex map',
  metricLabel = 'Value',
  formatValue = String,
}: HexTilemapPlotProps) {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const [viewBox, setViewBox] = useState<MapViewBox>({ x: 0, y: 0, w: 1, h: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef(zoom);
  const viewBoxRef = useRef(viewBox);
  const extentsRef = useRef<MapExtents>({ fullW: 1, fullH: 1 });
  const panRef = useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);

  zoomRef.current = zoom;
  viewBoxRef.current = viewBox;

  const layout = useMemo(() => layoutHexMap(stores), [stores]);
  const projectedStores = layout.stores;

  const viewport = useMemo(() => {
    const tiles = [...layout.land, ...projectedStores.map((s) => s.tile)];
    return computeViewport(tiles);
  }, [layout.land, projectedStores]);

  const visibleLand = useMemo(
    () =>
      layout.land.filter(
        (t) =>
          t.x >= viewport.minX - 1 &&
          t.x <= viewport.maxX + 1 &&
          t.y >= viewport.minY - 1 &&
          t.y <= viewport.maxY + 1,
      ),
    [layout.land, viewport],
  );

  const originX = viewport.minX;
  const originY = viewport.minY;

  const extents = useMemo(() => extentsFromViewport(viewport), [viewport]);
  extentsRef.current = extents;

  const applyZoom = useCallback((nextZoom: number, focal?: { x: number; y: number }) => {
    const clamped = clamp(nextZoom, ZOOM_MIN, ZOOM_MAX);
    if (clamped === zoomRef.current) {
      return;
    }
    const current = viewBoxRef.current;
    const mapExtents = extentsRef.current;
    const { w, h } = sizeForZoom(mapExtents, clamped);

    if (focal) {
      const mx = current.w === 0 ? 0.5 : (focal.x - current.x) / current.w;
      const my = current.h === 0 ? 0.5 : (focal.y - current.y) / current.h;
      setViewBox(
        clampViewBox(
          { x: focal.x - mx * w, y: focal.y - my * h, w, h },
          mapExtents,
        ),
      );
    } else {
      const cx = current.x + current.w / 2;
      const cy = current.y + current.h / 2;
      setViewBox(clampViewBox({ x: cx - w / 2, y: cy - h / 2, w, h }, mapExtents));
    }

    setZoom(clamped);
  }, []);

  const handleZoomIn = useCallback(() => {
    applyZoom(zoomRef.current + ZOOM_STEP);
  }, [applyZoom]);

  const handleZoomOut = useCallback(() => {
    applyZoom(zoomRef.current - ZOOM_STEP);
  }, [applyZoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(ZOOM_DEFAULT);
    setViewBox(centeredViewBox(extentsRef.current, ZOOM_DEFAULT));
  }, []);

  const { fullW, fullH } = extents;

  useEffect(() => {
    setZoom(ZOOM_DEFAULT);
    setViewBox(centeredViewBox({ fullW, fullH }, ZOOM_DEFAULT));
  }, [fullW, fullH]);

  const handleStoreHover = useCallback(
    (store: (typeof projectedStores)[0], event: React.MouseEvent) => {
      if (!mapRef.current || panRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      setTooltip({
        name: store.name,
        cluster: store.cluster ?? '',
        value: store.value,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [],
  );

  const handleStoreLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const svg = svgRef.current;
      const direction = event.deltaY < 0 ? 1 : -1;
      const step = event.ctrlKey ? 10 : ZOOM_STEP;
      const focal = svg ? clientToSvgPoint(svg, event.clientX, event.clientY) : null;
      applyZoom(zoomRef.current + direction * step, focal ?? undefined);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyZoom]);

  return (
    <div className={styles.container}>
      <div
        ref={mapRef}
        className={[styles.mapArea, isPanning ? styles.mapAreaPanning : '']
          .filter(Boolean)
          .join(' ')}
        style={{ height, background: backgroundColor }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          if ((event.target as HTMLElement).closest(`.${styles.zoomPill}`)) return;
          panRef.current = {
            pointerId: event.pointerId,
            lastX: event.clientX,
            lastY: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsPanning(true);
          setTooltip(null);
        }}
        onPointerMove={(event) => {
          const pan = panRef.current;
          const svg = svgRef.current;
          if (!pan || pan.pointerId !== event.pointerId || !svg) return;
          const prev = clientToSvgPoint(svg, pan.lastX, pan.lastY);
          const next = clientToSvgPoint(svg, event.clientX, event.clientY);
          pan.lastX = event.clientX;
          pan.lastY = event.clientY;
          if (!prev || !next) return;
          setViewBox((current) =>
            clampViewBox(
              {
                ...current,
                x: current.x - (next.x - prev.x),
                y: current.y - (next.y - prev.y),
              },
              extentsRef.current,
            ),
          );
        }}
        onPointerUp={(event) => {
          if (panRef.current?.pointerId !== event.pointerId) return;
          panRef.current = null;
          setIsPanning(false);
        }}
        onPointerCancel={() => {
          panRef.current = null;
          setIsPanning(false);
        }}
      >
        <svg
          ref={svgRef}
          className={styles.svgMap}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={dataTableCaption}
        >
          {visibleLand.map((tile) => {
            const { px, py } = hexToPixel(tile.x - originX, tile.y - originY);
            return (
              <path
                key={`land-${tile.x}-${tile.y}`}
                data-testid="hex-land"
                d={HEX_PATH}
                transform={`translate(${px}, ${py})`}
                fill="#ffffff"
                className={styles.hexLand}
              />
            );
          })}
          {projectedStores.map((store) => {
            const { px, py } = hexToPixel(store.tile.x - originX, store.tile.y - originY);
            const color = hexColorForValue(store.value, legend);
            return (
              <path
                key={`store-${store.storeId ?? `${store.lat}-${store.lon}`}`}
                data-testid="hex-store"
                data-store-id={store.storeId}
                d={HEX_PATH}
                transform={`translate(${px}, ${py})`}
                fill={color}
                className={styles.hexStore}
                onMouseEnter={(e) => handleStoreHover(store, e)}
                onMouseLeave={handleStoreLeave}
              />
            );
          })}
        </svg>

        {tooltip && (
          <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
            <span className={styles.tooltipName}>{tooltip.name}</span>
            {/* <span className={styles.tooltipCluster}>{tooltip.cluster}</span> */}
            <span className={styles.tooltipValue}>
              {metricLabel}: {formatValue(tooltip.value)}
            </span>
          </div>
        )}

        <div className={styles.zoomPill}>
          <button
            className={styles.zoomButton}
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            disabled={zoom <= ZOOM_MIN}
          >
            <svg className={styles.zoomIcon} viewBox="0 0 16 16" fill="none">
              <path
                d="M3.33 8h9.34"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className={styles.zoomValue}>
            <span>{zoom}%</span>
          </div>
          <button
            className={styles.zoomButton}
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            disabled={zoom >= ZOOM_MAX}
          >
            <svg className={styles.zoomIcon} viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3.33v9.34M3.33 8h9.34"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className={styles.zoomDivider} />
          <button
            className={styles.zoomButton}
            type="button"
            onClick={handleZoomReset}
            aria-label="Reset zoom"
          >
            <svg className={styles.zoomIcon} viewBox="0 0 16 16" fill="none">
              <path
                d="M2.67 6.67A5.33 5.33 0 0 1 13.33 8"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
              />
              <path
                d="M13.33 9.33A5.33 5.33 0 0 1 2.67 8"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
              />
              <path
                d="M2 2.67v4h4M14 13.33v-4h-4"
                stroke="currentColor"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {legend.length > 0 && (
        <div className={styles.legend}>
          {legend.map((band) => (
            <div key={band.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: band.color }}
              />
              <span className={styles.legendLabel}>{band.label}</span>
            </div>
          ))}
        </div>
      )}

      <table className={styles.visuallyHidden}>
        <caption>{dataTableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">Store</th>
            <th scope="col">Cluster</th>
            <th scope="col">{metricLabel}</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.storeId ?? `${store.lat}-${store.lon}-${store.name}`}>
              <th scope="row">{store.name}</th>
              <td>{store.cluster}</td>
              <td>{formatValue(store.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
