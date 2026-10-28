import type { HexGridTile } from './hexWorldGrid';

/**
 * New Zealand hex land mask.
 *
 * Source: Natural Earth 1:50m Cultural Vectors, country polygons, via the `world-atlas@2`
 * package (`countries-50m.json`, ISO 3166-1 numeric id 554). The MultiPolygon (North Island,
 * South Island, and small inshore islands) is rasterised onto a fixed equirectangular hex
 * lattice with `d3.geoContains`. Ocean cells are omitted. This is not a hand-drawn silhouette.
 *
 * The same `lon/lat → (x, y)` mapping is used to project stores, so a store can only resolve
 * to a cell that exists on this mask (after snapping to the nearest land cell).
 */
export const NZ_HEX_COLS = 24;
export const NZ_HEX_ROWS = 32;
export const NZ_LON_MIN = 166.2;
export const NZ_LON_MAX = 178.9;
export const NZ_LAT_MIN = -47.3;
export const NZ_LAT_MAX = -34.1;

export const NZ_HEX_LAND: readonly HexGridTile[] = Object.freeze([
  { x: 12, y: 1 },
  { x: 13, y: 2 },
  { x: 13, y: 3 },
  { x: 14, y: 3 },
  { x: 14, y: 4 },
  { x: 15, y: 5 },
  { x: 15, y: 6 },
  { x: 17, y: 6 },
  { x: 16, y: 7 },
  { x: 17, y: 7 },
  { x: 16, y: 8 },
  { x: 17, y: 8 },
  { x: 16, y: 9 },
  { x: 17, y: 9 },
  { x: 18, y: 9 },
  { x: 19, y: 9 },
  { x: 21, y: 9 },
  { x: 22, y: 9 },
  { x: 16, y: 10 },
  { x: 17, y: 10 },
  { x: 18, y: 10 },
  { x: 19, y: 10 },
  { x: 20, y: 10 },
  { x: 21, y: 10 },
  { x: 16, y: 11 },
  { x: 17, y: 11 },
  { x: 18, y: 11 },
  { x: 19, y: 11 },
  { x: 20, y: 11 },
  { x: 21, y: 11 },
  { x: 14, y: 12 },
  { x: 15, y: 12 },
  { x: 16, y: 12 },
  { x: 17, y: 12 },
  { x: 18, y: 12 },
  { x: 19, y: 12 },
  { x: 15, y: 13 },
  { x: 16, y: 13 },
  { x: 17, y: 13 },
  { x: 18, y: 13 },
  { x: 19, y: 13 },
  { x: 17, y: 14 },
  { x: 18, y: 14 },
  { x: 19, y: 14 },
  { x: 17, y: 15 },
  { x: 18, y: 15 },
  { x: 11, y: 16 },
  { x: 12, y: 16 },
  { x: 16, y: 16 },
  { x: 17, y: 16 },
  { x: 18, y: 16 },
  { x: 11, y: 17 },
  { x: 12, y: 17 },
  { x: 13, y: 17 },
  { x: 14, y: 17 },
  { x: 16, y: 17 },
  { x: 17, y: 17 },
  { x: 10, y: 18 },
  { x: 11, y: 18 },
  { x: 12, y: 18 },
  { x: 13, y: 18 },
  { x: 14, y: 18 },
  { x: 10, y: 19 },
  { x: 11, y: 19 },
  { x: 12, y: 19 },
  { x: 13, y: 19 },
  { x: 9, y: 20 },
  { x: 10, y: 20 },
  { x: 11, y: 20 },
  { x: 12, y: 20 },
  { x: 13, y: 20 },
  { x: 8, y: 21 },
  { x: 9, y: 21 },
  { x: 10, y: 21 },
  { x: 11, y: 21 },
  { x: 12, y: 21 },
  { x: 7, y: 22 },
  { x: 8, y: 22 },
  { x: 9, y: 22 },
  { x: 10, y: 22 },
  { x: 11, y: 22 },
  { x: 6, y: 23 },
  { x: 7, y: 23 },
  { x: 8, y: 23 },
  { x: 9, y: 23 },
  { x: 10, y: 23 },
  { x: 4, y: 24 },
  { x: 5, y: 24 },
  { x: 6, y: 24 },
  { x: 7, y: 24 },
  { x: 8, y: 24 },
  { x: 9, y: 24 },
  { x: 3, y: 25 },
  { x: 4, y: 25 },
  { x: 5, y: 25 },
  { x: 6, y: 25 },
  { x: 7, y: 25 },
  { x: 8, y: 25 },
  { x: 9, y: 25 },
  { x: 2, y: 26 },
  { x: 3, y: 26 },
  { x: 4, y: 26 },
  { x: 5, y: 26 },
  { x: 6, y: 26 },
  { x: 7, y: 26 },
  { x: 8, y: 26 },
  { x: 2, y: 27 },
  { x: 3, y: 27 },
  { x: 4, y: 27 },
  { x: 5, y: 27 },
  { x: 6, y: 27 },
  { x: 7, y: 27 },
  { x: 8, y: 27 },
  { x: 1, y: 28 },
  { x: 2, y: 28 },
  { x: 3, y: 28 },
  { x: 4, y: 28 },
  { x: 5, y: 28 },
  { x: 6, y: 28 },
  { x: 7, y: 28 },
  { x: 4, y: 29 },
  { x: 5, y: 29 },
  { x: 6, y: 29 },
  { x: 3, y: 30 },
]);

export const NZ_HEX_LAND_KEYS: ReadonlySet<string> = new Set(
  NZ_HEX_LAND.map((tile) => `${tile.x}:${tile.y}`),
);

export function isWithinNzHexExtent(lat: number, lon: number): boolean {
  return lat >= NZ_LAT_MIN && lat <= NZ_LAT_MAX && lon >= NZ_LON_MIN && lon <= NZ_LON_MAX;
}

/** Same equirectangular mapping used to rasterise the Natural Earth polygons. */
export function projectOntoNzHexGrid(lat: number, lon: number): HexGridTile {
  const fx = ((lon - NZ_LON_MIN) / (NZ_LON_MAX - NZ_LON_MIN)) * (NZ_HEX_COLS - 1);
  const fy = ((NZ_LAT_MAX - lat) / (NZ_LAT_MAX - NZ_LAT_MIN)) * (NZ_HEX_ROWS - 1);
  return {
    x: Math.min(NZ_HEX_COLS - 1, Math.max(0, Math.round(fx))),
    y: Math.min(NZ_HEX_ROWS - 1, Math.max(0, Math.round(fy))),
  };
}

function hexNeighbors(x: number, y: number): HexGridTile[] {
  const odd = x % 2 !== 0;
  const dy = odd ? 1 : -1;
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y: y + dy },
    { x: x + 1, y: y + dy },
  ];
}

/**
 * Walk from a projected cell to the nearest mask cell. Returns the hop count so callers can
 * log stores that were not on land at the raw projection.
 */
export function snapToNzLand(tile: HexGridTile): { tile: HexGridTile; hops: number } {
  const startKey = `${tile.x}:${tile.y}`;
  if (NZ_HEX_LAND_KEYS.has(startKey)) return { tile, hops: 0 };

  const queue: Array<{ tile: HexGridTile; hops: number }> = [{ tile, hops: 0 }];
  const seen = new Set<string>([startKey]);

  while (queue.length > 0) {
    const current = queue.shift() as { tile: HexGridTile; hops: number };
    for (const neighbor of hexNeighbors(current.tile.x, current.tile.y)) {
      const key = `${neighbor.x}:${neighbor.y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const hops = current.hops + 1;
      if (NZ_HEX_LAND_KEYS.has(key)) return { tile: neighbor, hops };
      queue.push({ tile: neighbor, hops });
    }
  }

  return { tile: NZ_HEX_LAND[0] ?? tile, hops: Number.POSITIVE_INFINITY };
}
