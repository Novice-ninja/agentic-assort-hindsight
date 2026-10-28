import type { HexGridTile } from './hexWorldGrid';
import { HEX_WORLD_GRID, nearestLandTile, projectLatLon } from './hexWorldGrid';
import {
  NZ_HEX_COLS,
  NZ_HEX_LAND,
  NZ_HEX_LAND_KEYS,
  NZ_HEX_ROWS,
  isWithinNzHexExtent,
  projectOntoNzHexGrid,
  snapToNzLand,
} from './nzHexLand';

export interface StoreHexPoint {
  lat: number;
  lon: number;
  value: number;
  name: string;
  storeId?: string;
  cluster?: string;
}

export interface PlacedStoreHex extends StoreHexPoint {
  tile: HexGridTile;
}

export interface HexMapLayout {
  land: HexGridTile[];
  stores: PlacedStoreHex[];
}

function tileKey(tile: HexGridTile): string {
  return `${tile.x}:${tile.y}`;
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

function inBounds(tile: HexGridTile, cols: number, rows: number): boolean {
  return tile.x >= 0 && tile.y >= 0 && tile.x < cols && tile.y < rows;
}

function firstFreeLandCell(
  start: HexGridTile,
  occupied: Set<string>,
  landKeys: ReadonlySet<string>,
  cols: number,
  rows: number,
): HexGridTile | null {
  const queue: HexGridTile[] = [start];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const cell = queue.shift() as HexGridTile;
    const key = tileKey(cell);
    if (seen.has(key)) continue;
    seen.add(key);
    if (inBounds(cell, cols, rows) && landKeys.has(key) && !occupied.has(key)) {
      return cell;
    }
    for (const neighbor of hexNeighbors(cell.x, cell.y)) {
      if (!seen.has(tileKey(neighbor))) queue.push(neighbor);
    }
  }
  return null;
}

function warnStore(store: StoreHexPoint, reason: string, extra?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.warn(`[store-hex-map] ${reason}`, {
    name: store.name,
    storeId: store.storeId,
    lat: store.lat,
    lon: store.lon,
    ...extra,
  });
}

function layoutOnNzMask(stores: readonly StoreHexPoint[]): HexMapLayout {
  const occupied = new Set<string>();
  const placed: PlacedStoreHex[] = [];
  const northToSouth = [...stores].sort((a, b) => b.lat - a.lat || a.lon - b.lon);

  for (const store of northToSouth) {
    const projected = projectOntoNzHexGrid(store.lat, store.lon);
    const snapped = snapToNzLand(projected);
    const tile = firstFreeLandCell(
      snapped.tile,
      occupied,
      NZ_HEX_LAND_KEYS,
      NZ_HEX_COLS,
      NZ_HEX_ROWS,
    );

    if (tile === null || !NZ_HEX_LAND_KEYS.has(tileKey(tile)) || !Number.isFinite(snapped.hops)) {
      warnStore(store, 'failed to land on a valid NZ mask cell', {
        projected,
        snapped: snapped.tile,
        hops: snapped.hops,
      });
      continue;
    }

    occupied.add(tileKey(tile));
    placed.push({ ...store, tile });
  }

  return { land: [...NZ_HEX_LAND], stores: placed };
}

function layoutWorld(stores: readonly StoreHexPoint[]): HexMapLayout {
  const occupied = new Set<string>();
  const placed: PlacedStoreHex[] = [];
  const landKeys = new Set(HEX_WORLD_GRID.map(tileKey));
  const xs = HEX_WORLD_GRID.map((t) => t.x);
  const ys = HEX_WORLD_GRID.map((t) => t.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const cols = Math.max(...xs) - minX + 1;
  const rows = Math.max(...ys) - minY + 1;
  const localLand = new Set(
    [...landKeys].map((key) => {
      const [x, y] = key.split(':').map(Number);
      return `${(x as number) - minX}:${(y as number) - minY}`;
    }),
  );

  for (const store of stores) {
    const { fx, fy } = projectLatLon(store.lat, store.lon);
    const snapped = nearestLandTile(fx, fy);
    const localStart = { x: snapped.x - minX, y: snapped.y - minY };
    const localOccupied = new Set(
      [...occupied].map((key) => {
        const [x, y] = key.split(':').map(Number);
        return `${(x as number) - minX}:${(y as number) - minY}`;
      }),
    );
    const localTile = firstFreeLandCell(localStart, localOccupied, localLand, cols, rows);
    if (localTile === null) {
      warnStore(store, 'failed to land on a valid world-grid land cell');
      continue;
    }
    const tile = { x: localTile.x + minX, y: localTile.y + minY };
    occupied.add(tileKey(tile));
    placed.push({ ...store, tile });
  }

  return { land: [...HEX_WORLD_GRID], stores: placed };
}

/**
 * Places every store on a unique land hex. New Zealand datasets use the Natural Earth-derived
 * NZ mask and the same lon/lat lattice as that mask, so stores cannot float on ocean cells.
 */
export function layoutHexMap(stores: readonly StoreHexPoint[]): HexMapLayout {
  if (stores.length === 0) {
    return { land: [...HEX_WORLD_GRID], stores: [] };
  }

  const allInNz = stores.every((store) => isWithinNzHexExtent(store.lat, store.lon));
  return allInNz ? layoutOnNzMask(stores) : layoutWorld(stores);
}
