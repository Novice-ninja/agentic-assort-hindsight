import numeral from 'numeral';
import { normalizeCompactAbbreviations } from '@shared/utils';

/**
 * Applies a column-config numeral/Excel mask (`0.00%`, `$0.00a`, …) to a numeric cell value.
 *
 * Percent masks (`%`) follow numeral's ratio convention: `0.3245` → `32.45%`. Whole percents
 * already on a 0–100 scale (`23.6`) are divided first so they do not render as `2360%`.
 * Compact `a` masks are normalized to uppercase abbreviations (`$35.51M`, not `$35.51m`).
 */
export function formatByNumeral(value: number, formatter?: string): string {
  if (formatter === undefined || formatter.trim().length === 0) {
    return fallbackNumber(value);
  }

  const formatted = numeral(toNumeralInput(value, formatter)).format(formatter);
  if (formatted.length === 0 || formatted === 'NaN') {
    return fallbackNumber(value);
  }
  return normalizeCompactAbbreviations(formatted);
}

/**
 * Progress-bar width in 0–100 terms. Percent masks use the same ratio/whole-percent rule as
 * {@link formatByNumeral}, so the bar and the label stay in agreement.
 */
export function progressFromFormatter(value: number, formatter?: string): number {
  const percent =
    formatter !== undefined && isPercentMask(formatter)
      ? toNumeralInput(value, formatter) * 100
      : value;
  return Math.min(100, Math.max(0, percent));
}

function isPercentMask(formatter: string): boolean {
  return formatter.includes('%');
}

function toNumeralInput(value: number, formatter: string): number {
  if (isPercentMask(formatter) && Math.abs(value) > 1) {
    return value / 100;
  }
  return value;
}

function fallbackNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
