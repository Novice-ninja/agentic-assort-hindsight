import { FLOORING_NEUTRAL_SWATCH, getFlooringSwatchForItem } from '@mocks/flooringDemo';

/** Code-native material illustrations. These are never authentic product photography. */
export const USE_PLACEHOLDER_ITEM_IMAGES = true;
export const PLACEHOLDER_ITEM_IMAGES: readonly string[] = [FLOORING_NEUTRAL_SWATCH];

function hash(value: string): number {
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index++) {
    result ^= value.charCodeAt(index);
    // The 32-bit FNV prime, as shifts, so the intermediate stays inside a safe integer.
    result +=
      (result << 1) + (result << 4) + (result << 7) + (result << 8) + (result << 24);
    result >>>= 0;
  }

  // murmur3's fmix32.
  result ^= result >>> 16;
  result = Math.imul(result, 0x85ebca6b);
  result ^= result >>> 13;
  result = Math.imul(result, 0xc2b2ae35);
  result ^= result >>> 16;
  return result >>> 0;
}


/** Stable canonical identity, with a neutral material illustration for an unknown product. */
export function getPlaceholderImageForItem(
  seed: string,
  images: readonly string[] = PLACEHOLDER_ITEM_IMAGES,
): string | null {
  if (!USE_PLACEHOLDER_ITEM_IMAGES) return null;
  const key=seed.trim();
  if (!key || !images.length) return null;
  return getFlooringSwatchForItem(key) ?? images[hash(key) % images.length] ?? null;
}
