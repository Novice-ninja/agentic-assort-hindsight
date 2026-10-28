import type { Variant } from '../types';

/** Last id token, matching the Review variant card heading (e.g. `cpc-1-custom-1` → `1`). */
export function reviewVariantCode(id: string): string {
  const token = id.split('-').pop() ?? id;
  return token.length === 1 ? token.toUpperCase() : token.charAt(0).toUpperCase() + token.slice(1);
}

/** Generated ids (`var_…`), id-derived headings (`Variant 1` / `Variant2cfb…`), and raw ids. */
export function isVariantCodeName(name: string, variantId?: string): boolean {
  const value = name.trim();
  if (!value) return true;
  const id = variantId?.trim();
  if (id) {
    const lower = value.toLowerCase();
    const idLower = id.toLowerCase();
    if (lower === idLower) return true;
    if (lower === `variant${idLower}` || lower === `variant ${idLower}`) return true;
    if (lower === `variant_${idLower}` || lower === `variant-${idLower}`) return true;
  }
  if (/^var_[a-z0-9_]+$/i.test(value)) return true;
  if (/^variant[\s_-]+\S+$/i.test(value)) return true;
  if (/^variant[0-9a-f]{6,}$/i.test(value)) return true;
  if (/^[0-9a-f]{8}-[0-9a-f-]{13,}$/i.test(value)) return true;
  return false;
}

/** Card title: a real `variantName`, or `fallback` for a custom card, a blank name, or a code. */
export function variantCardTitle(
  name: string | undefined,
  options: { custom?: boolean; fallback: string; variantId?: string },
): string {
  const trimmed = name?.trim() ?? '';
  if (options.custom || isVariantCodeName(trimmed, options.variantId)) return options.fallback;
  return trimmed;
}

/**
 * Name shown on the Review variant card badge — backend `variantName` when present,
 * otherwise the interpolated `Variant {{code}}` heading.
 */
export function reviewVariantDisplayName(
  variant: Pick<Variant, 'id' | 'name' | 'labelKey'>,
  translate: (key: string, options: { code: string }) => string,
): string {
  const fromApi = variant.name?.trim();
  if (fromApi) return fromApi;
  return translate(variant.labelKey, { code: reviewVariantCode(variant.id) }).trim();
}
