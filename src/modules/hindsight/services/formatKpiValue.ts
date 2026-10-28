import numeral from 'numeral';
import { normalizeCompactAbbreviations } from '@shared/utils';

/** Neutral stand-in when neither a format+value nor a displayValue can be shown. */
export const KPI_VALUE_PLACEHOLDER = '—';

export interface FormatKpiValueInput {
  /** Raw metric value. `0` is a real reading; only null/undefined (or a failed coerce) are missing. */
  value?: number | string | null;
  /** numeral.js mask from the KPI payload, e.g. `0,0`, `0.0%`, `$0,0a`. Empty is treated as absent. */
  format?: string | null;
  /** Pre-formatted text from the API. Used as-is when `format` is absent or formatting cannot run. */
  displayValue?: string | null;
}

/**
 * Scorecard headline: format the raw value with numeral when a mask is present; otherwise show
 * `displayValue`. Never infers currency, percent, or compact units from the metric key.
 */
export function formatKpiValue({ value, format, displayValue }: FormatKpiValueInput): string {
  const fallback =
    normalizeOptionalDisplay(usableDisplayValue(displayValue)) ?? KPI_VALUE_PLACEHOLDER;
  const mask = typeof format === 'string' ? format.trim() : '';

  if (mask.length === 0) {
    return fallback;
  }

  const numeric = coerceNumber(value);
  if (numeric === null) {
    return fallback;
  }

  const multiplier = trailingMultiplier(mask);
  const numeralMask = multiplier === undefined ? mask : mask.slice(0, -1);
  if (!isNumeralMask(numeralMask)) {
    warnInvalidFormat(mask, value);
    return fallback;
  }

  const formatted = normalizeCompactAbbreviations(
    numeral(toNumeralInput(numeric, numeralMask)).format(numeralMask),
  );
  if (!isUsableFormatted(formatted)) {
    warnInvalidFormat(mask, value);
    return fallback;
  }

  return multiplier === undefined ? formatted : `${formatted}${multiplier}`;
}

function normalizeOptionalDisplay(displayValue: string | undefined): string | undefined {
  return displayValue === undefined
    ? undefined
    : normalizeCompactAbbreviations(displayValue);
}

/**
 * Same percent-mask convention as `formatByNumeral`: numeral treats `%` as a ratio, so a whole
 * percent already on a 0–100 scale is divided first. The mask still decides the output shape.
 */
function toNumeralInput(value: number, mask: string): number {
  if (mask.includes('%') && Math.abs(value) > 1) {
    return value / 100;
  }
  return value;
}

function usableDisplayValue(displayValue: string | null | undefined): string | undefined {
  if (displayValue === null || displayValue === undefined || displayValue === '') {
    return undefined;
  }
  return displayValue;
}

/**
 * numeral masks always specify a digit token (`0` or `#`). Semantic labels (`currency`) and
 * other dialects (`{:.2f}`) do not, and numeral will echo or scramble them instead of throwing.
 */
function isNumeralMask(format: string): boolean {
  return /[0#]/.test(format);
}

/** Trailing unit numeral does not understand (`x` for weeks-on-hand). */
function trailingMultiplier(mask: string): string | undefined {
  if (/[0#.,]+[xX]$/.test(mask)) return mask.slice(-1);
  return undefined;
}

function isUsableFormatted(formatted: string): boolean {
  return formatted.length > 0 && formatted !== 'NaN' && !formatted.includes('NaN');
}

function coerceNumber(value: number | string | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
}

function warnInvalidFormat(format: string, value: number | string | null | undefined): void {
  if (process.env.NODE_ENV === 'production') return;
  // eslint-disable-next-line no-console
  console.warn(`[season-scorecard] invalid KPI format "${format}"`, { value });
}
