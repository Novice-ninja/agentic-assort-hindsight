/**
 * Static hex-grid coordinates forming a recognisable world continent silhouette.
 *
 * The grid uses Highcharts tilemap offset coordinates: odd columns shift down by half a row.
 * Approximate dimensions: 48 columns × 26 rows. Each entry is a white "land" hex that defines
 * the continent outlines; ocean cells are simply absent. Store data points overlay this grid at
 * their own (x, y) positions.
 *
 * Continent placement follows equirectangular projection with a fixed scale, so adding land
 * tiles at the edge of the grid does not shift every other continent:
 *   x = ((lon + 180) / 360) * GRID_SPAN_X + GRID_ORIGIN_X
 *   y = ((90 - lat) / 180) * GRID_SPAN_Y + GRID_ORIGIN_Y
 *
 * This data never changes at runtime.
 */

/** World-grid origin and span used by the projection. Independent of the land-tile bounding box. */
export const GRID_ORIGIN_X = 2;
export const GRID_ORIGIN_Y = 0;
export const GRID_SPAN_X = 45;
export const GRID_SPAN_Y = 23;

export interface HexGridTile {
  x: number;
  y: number;
}

function fill(x0: number, x1: number, y0: number, y1: number): HexGridTile[] {
  const tiles: HexGridTile[] = [];
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      tiles.push({ x, y });
    }
  }
  return tiles;
}

const greenland: HexGridTile[] = [
  ...fill(15, 17, 1, 2),
  ...fill(15, 18, 3, 3),
  { x: 16, y: 4 },
  { x: 17, y: 4 },
];

const iceland: HexGridTile[] = [
  { x: 20, y: 3 },
  { x: 21, y: 3 },
];

const alaska: HexGridTile[] = [
  ...fill(2, 5, 2, 2),
  ...fill(2, 5, 3, 3),
  ...fill(2, 6, 4, 4),
  ...fill(3, 6, 5, 5),
];

const northAmerica: HexGridTile[] = [
  ...fill(5, 10, 3, 3),
  ...fill(5, 12, 4, 4),
  ...fill(5, 13, 5, 5),
  ...fill(6, 14, 6, 6),
  ...fill(6, 15, 7, 7),
  ...fill(7, 15, 8, 8),
  ...fill(8, 14, 9, 9),
  ...fill(9, 13, 10, 10),
  ...fill(9, 12, 11, 11),
];

const centralAmerica: HexGridTile[] = [
  { x: 9, y: 12 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 11, y: 11 },
  { x: 11, y: 12 },
  { x: 12, y: 12 },
];

const caribbean: HexGridTile[] = [
  { x: 12, y: 10 },
  { x: 13, y: 10 },
  { x: 13, y: 11 },
  { x: 14, y: 11 },
];

const southAmerica: HexGridTile[] = [
  ...fill(13, 18, 12, 12),
  ...fill(14, 19, 13, 13),
  ...fill(14, 20, 14, 14),
  ...fill(14, 20, 15, 15),
  ...fill(14, 20, 16, 16),
  ...fill(14, 19, 17, 17),
  ...fill(14, 18, 18, 18),
  ...fill(14, 17, 19, 19),
  ...fill(14, 17, 20, 20),
  ...fill(14, 16, 21, 21),
  { x: 15, y: 22 },
];

const europe: HexGridTile[] = [
  ...fill(22, 25, 3, 3),
  ...fill(22, 27, 4, 4),
  ...fill(22, 28, 5, 5),
  ...fill(22, 28, 6, 6),
  ...fill(22, 28, 7, 7),
  ...fill(23, 27, 8, 8),
  ...fill(24, 26, 9, 9),
];

const scandinavia: HexGridTile[] = [
  { x: 23, y: 1 },
  { x: 24, y: 1 },
  { x: 25, y: 1 },
  { x: 23, y: 2 },
  { x: 24, y: 2 },
  { x: 25, y: 2 },
  { x: 26, y: 2 },
  { x: 25, y: 3 },
  { x: 26, y: 3 },
  { x: 27, y: 3 },
];

const uk: HexGridTile[] = [
  { x: 21, y: 5 },
  { x: 21, y: 6 },
  { x: 22, y: 7 },
];

const africa: HexGridTile[] = [
  ...fill(22, 28, 9, 9),
  ...fill(22, 29, 10, 10),
  ...fill(22, 29, 11, 11),
  ...fill(23, 30, 12, 12),
  ...fill(23, 30, 13, 13),
  ...fill(23, 29, 14, 14),
  ...fill(24, 29, 15, 15),
  ...fill(24, 28, 16, 16),
  ...fill(25, 28, 17, 17),
  ...fill(25, 27, 18, 18),
  { x: 26, y: 19 },
];

const madagascar: HexGridTile[] = [
  { x: 30, y: 16 },
  { x: 30, y: 17 },
  { x: 30, y: 18 },
];

const middleEast: HexGridTile[] = [
  ...fill(28, 32, 8, 8),
  ...fill(28, 32, 9, 9),
  ...fill(29, 32, 10, 10),
  ...fill(29, 31, 11, 11),
  { x: 30, y: 12 },
  { x: 31, y: 12 },
];

const russia: HexGridTile[] = [
  ...fill(27, 34, 0, 0),
  ...fill(26, 36, 1, 1),
  ...fill(26, 38, 2, 2),
  ...fill(27, 41, 3, 3),
  ...fill(28, 43, 4, 4),
  ...fill(28, 44, 5, 5),
  ...fill(30, 44, 6, 6),
  ...fill(35, 43, 7, 7),
];

const centralAsia: HexGridTile[] = [
  ...fill(33, 38, 7, 7),
  ...fill(33, 38, 8, 8),
  ...fill(34, 37, 9, 9),
  ...fill(35, 37, 10, 10),
];

const india: HexGridTile[] = [
  ...fill(32, 36, 9, 9),
  ...fill(32, 36, 10, 10),
  ...fill(32, 35, 11, 11),
  ...fill(33, 35, 12, 12),
  ...fill(33, 35, 13, 13),
  { x: 34, y: 14 },
];

const eastAsia: HexGridTile[] = [
  ...fill(36, 41, 6, 6),
  ...fill(37, 41, 7, 7),
  ...fill(37, 41, 8, 8),
  ...fill(38, 41, 9, 9),
  ...fill(38, 41, 10, 10),
  ...fill(39, 40, 11, 11),
];

const japan: HexGridTile[] = [
  { x: 42, y: 6 },
  { x: 43, y: 6 },
  { x: 42, y: 7 },
  { x: 43, y: 7 },
  { x: 42, y: 8 },
  { x: 43, y: 8 },
  { x: 43, y: 9 },
];

const korea: HexGridTile[] = [
  { x: 41, y: 8 },
  { x: 41, y: 9 },
  { x: 42, y: 9 },
];

const southeastAsia: HexGridTile[] = [
  ...fill(35, 39, 10, 10),
  ...fill(35, 39, 11, 11),
  ...fill(36, 40, 12, 12),
  ...fill(36, 40, 13, 13),
  ...fill(37, 39, 14, 14),
];

const indonesia: HexGridTile[] = [
  ...fill(36, 41, 14, 14),
  ...fill(37, 42, 15, 15),
  ...fill(38, 43, 16, 16),
  { x: 40, y: 17 },
  { x: 41, y: 17 },
  { x: 42, y: 17 },
  { x: 43, y: 17 },
];

const oceania: HexGridTile[] = [
  ...fill(39, 44, 17, 17),
  ...fill(39, 45, 18, 18),
  ...fill(39, 45, 19, 19),
  ...fill(40, 45, 20, 20),
  ...fill(40, 44, 21, 21),
  ...fill(41, 44, 22, 22),
  ...fill(42, 43, 23, 23),
];

/**
 * New Zealand land mask — the same 5-cell two-island silhouette as the original world grid
 * (North Island pair, east bump, South Island), shifted east so a one-column ocean gap
 * keeps it disconnected from Australia. Not GeoJSON: ocean is simply the absence of a tile.
 *
 * Original cells (x 45–47, y 21–23):
 *   (45,21) (46,21)
 *           (46,22) (47,22)
 *           (46,23)
 */
const newZealand: HexGridTile[] = [
  { x: 47, y: 16 },
  { x: 48, y: 16 },
  { x: 48, y: 17 },
  { x: 49, y: 17 },
  { x: 48, y: 18 },
];

function uniqueTiles(tiles: HexGridTile[]): HexGridTile[] {
  const seen = new Set<string>();
  const unique: HexGridTile[] = [];
  for (const tile of tiles) {
    const key = `${tile.x}:${tile.y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(tile);
  }
  return unique;
}

export const HEX_WORLD_GRID: readonly HexGridTile[] = Object.freeze(
  uniqueTiles([
    ...greenland,
    ...iceland,
    ...alaska,
    ...northAmerica,
    ...centralAmerica,
    ...caribbean,
    ...southAmerica,
    ...europe,
    ...scandinavia,
    ...uk,
    ...africa,
    ...madagascar,
    ...middleEast,
    ...russia,
    ...centralAsia,
    ...india,
    ...eastAsia,
    ...japan,
    ...korea,
    ...southeastAsia,
    ...indonesia,
    ...oceania,
    ...newZealand,
  ]),
);

export interface ProjectedLatLon {
  fx: number;
  fy: number;
}

/** Equirectangular projection onto the world hex plane (continuous, not snapped). */
export function projectLatLon(lat: number, lon: number): ProjectedLatLon {
  const clampedLon = Math.min(180, Math.max(-180, lon));
  const clampedLat = Math.min(90, Math.max(-90, lat));
  return {
    fx: ((clampedLon + 180) / 360) * GRID_SPAN_X + GRID_ORIGIN_X,
    fy: ((90 - clampedLat) / 180) * GRID_SPAN_Y + GRID_ORIGIN_Y,
  };
}

/** Nearest land tile to a projected world-grid point. */
export function nearestLandTile(fx: number, fy: number): HexGridTile {
  let nearest = HEX_WORLD_GRID[0] ?? { x: 0, y: 0 };
  let best = Number.POSITIVE_INFINITY;
  for (const tile of HEX_WORLD_GRID) {
    const dx = tile.x - fx;
    const dy = tile.y - fy;
    const distance = dx * dx + dy * dy;
    if (distance < best) {
      best = distance;
      nearest = tile;
    }
  }
  return { x: nearest.x, y: nearest.y };
}

/**
 * Equirectangular projection of a WGS84 point onto the hex world grid, then snapped to the
 * nearest land tile so coloured stores always sit on the continent silhouette.
 */
export function latLonToHexTile(lat: number, lon: number): HexGridTile {
  const { fx, fy } = projectLatLon(lat, lon);
  return nearestLandTile(fx, fy);
}
