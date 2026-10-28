import type { CellValue, ColumnDataType, ColumnFormat } from '../MatrixGrid.types';

/**
 * Locale-aware formatting AND parsing (research R14).
 *
 * Two things here are load-bearing:
 *
 * 1. **Parsing is never `parseFloat`.** In `es`, `parseFloat('1.234,56')` returns `1.234` — a
 *    silent 1000× error that passes validation and lands in the host's data. Input is read with
 *    the active locale's separators and numbering system, and text that is not a quantity comes
 *    back as `null` so the grid can reject it visibly.
 * 2. **Formatters are memoized.** A `valueFormatter` runs per visible cell on every scroll frame;
 *    constructing an `Intl` instance in there is what breaks the frame-rate budget.
 *
 * Pure and vendor-free: no React, no AG Grid, no store.
 */

export const EM_DASH = '—';

const numberFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatters = new Map<string, Intl.DateTimeFormat>();
const localeSeparators = new Map<string, LocaleSeparators>();
const dateFieldOrders = new Map<string, DateField[]>();

interface LocaleSeparators {
  group: string;
  decimal: string;
  /** The locale's own digits, index 0–9, when its numbering system is not `latn`. */
  digits: string[];
}

type DateField = 'year' | 'month' | 'day';

/** Zero code points of the numbering systems the supported locales can surface. */
const DIGIT_BLOCK_ZEROS = [0x0030, 0x0660, 0x06f0, 0x0966];

/** Direction marks and isolates that `Intl` embeds around numbers in RTL locales. */
const DIRECTION_MARKS = /[\u200e\u200f\u061c\u2066-\u2069]/g;
const PERCENT_SIGNS = /[%\u066a\uff05\ufe6a]/g;
const CURRENCY_SYMBOLS = /\p{Sc}/gu;
const ISO_CURRENCY_CODE = /(?:^|\s)[A-Z]{3}(?=\s|$)/g;
const WHITESPACE = /[\s\u00a0\u202f]/g;
// One global for stripping and one non-global for testing: `RegExp.test` on a `/g` pattern
// advances `lastIndex`, so a shared instance would start missing matches after the first call.
const MINUS_SIGNS = /[-\u2212\u2012\u2013]/;
const MINUS_SIGNS_ALL = /[-\u2212\u2012\u2013]/g;

function maskKey(mask: ColumnFormat | undefined, dataType: ColumnDataType): string {
  return [
    dataType,
    mask?.currency ?? '',
    mask?.minimumFractionDigits ?? '',
    mask?.maximumFractionDigits ?? '',
    mask?.magnitude ?? '',
  ].join('|');
}

/**
 * Memoized. `dataType` is part of the key because percent and currency need a different `Intl`
 * style than a plain number, and the same column mask can be reused across types.
 */
export function getNumberFormatter(
  locale: string,
  mask?: ColumnFormat,
  dataType: ColumnDataType = 'number',
): Intl.NumberFormat {
  const key = `${locale}#${maskKey(mask, dataType)}`;
  const cached = numberFormatters.get(key);
  if (cached) return cached;

  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: mask?.maximumFractionDigits ?? (dataType === 'percent' ? 1 : 2),
  };
  if (mask?.minimumFractionDigits !== undefined) {
    options.minimumFractionDigits = mask.minimumFractionDigits;
  }
  if (dataType === 'percent') {
    options.style = 'percent';
  } else if (dataType === 'currency') {
    options.style = 'currency';
    options.currency = mask?.currency ?? 'USD';
  }

  const formatter = new Intl.NumberFormat(locale, options);
  numberFormatters.set(key, formatter);
  return formatter;
}

/** Memoized, for the same reason as the number formatter. */
export function getDateFormatter(locale: string, mask?: ColumnFormat): Intl.DateTimeFormat {
  const key = `${locale}#${maskKey(mask, 'date')}`;
  const cached = dateFormatters.get(key);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  dateFormatters.set(key, formatter);
  return formatter;
}

function separatorsFor(locale: string): LocaleSeparators {
  const cached = localeSeparators.get(locale);
  if (cached) return cached;

  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const plain = new Intl.NumberFormat(locale, { useGrouping: false });
  const resolved: LocaleSeparators = {
    group: parts.find((part) => part.type === 'group')?.value ?? ',',
    decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.',
    digits: Array.from({ length: 10 }, (_, digit) => plain.format(digit)),
  };
  localeSeparators.set(locale, resolved);
  return resolved;
}

/** Maps every non-ASCII decimal digit onto its ASCII equivalent. */
function toAsciiDigits(text: string, digits: string[]): string {
  let mapped = text;
  digits.forEach((digit, value) => {
    if (digit !== String(value)) mapped = mapped.split(digit).join(String(value));
  });
  return mapped.replace(/\p{Nd}/gu, (char) => {
    const codePoint = char.codePointAt(0) ?? 0;
    for (const zero of DIGIT_BLOCK_ZEROS) {
      if (codePoint >= zero && codePoint <= zero + 9) return String(codePoint - zero);
    }
    return char;
  });
}

/**
 * Reads a number the way the active locale writes one. Returns `null` for anything that is not
 * unambiguously a quantity — an unrecognised affix is rejected rather than guessed, because a
 * visible rejection is always safer than a plausible wrong number.
 */
export function parseLocaleNumber(text: string, locale: string): number | null {
  if (typeof text !== 'string') return null;
  const { group, decimal, digits } = separatorsFor(locale);

  let working = toAsciiDigits(text.trim(), digits)
    .replace(DIRECTION_MARKS, '')
    .replace(PERCENT_SIGNS, '')
    .replace(CURRENCY_SYMBOLS, '')
    .replace(ISO_CURRENCY_CODE, '')
    .replace(WHITESPACE, '');
  if (working === '') return null;

  const negative = MINUS_SIGNS.test(working) || /^\(.*\)$/.test(working);
  working = working.replace(MINUS_SIGNS_ALL, '').replace(/[()+]/g, '');

  const [integerText, fractionText, ...extra] = working.split(decimal);
  if (extra.length > 0) return null;

  const integerDigits = integerText.split(group).join('');
  if (!/^\d*$/.test(integerDigits)) return null;
  if (fractionText !== undefined && !/^\d*$/.test(fractionText)) return null;
  if (integerDigits === '' && (fractionText === undefined || fractionText === '')) return null;

  const magnitude = Number(`${integerDigits === '' ? '0' : integerDigits}.${fractionText ?? '0'}`);
  if (!Number.isFinite(magnitude)) return null;
  return negative ? -magnitude : magnitude;
}

function fieldOrderFor(locale: string): DateField[] {
  const cached = dateFieldOrders.get(locale);
  if (cached) return cached;

  const order = getDateFormatter(locale)
    .formatToParts(new Date(Date.UTC(2026, 2, 19)))
    .filter((part): part is Intl.DateTimeFormatPart & { type: DateField } =>
      part.type === 'year' || part.type === 'month' || part.type === 'day',
    )
    .map((part) => part.type);
  dateFieldOrders.set(locale, order);
  return order;
}

function toIsoDate(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects the impossible dates the range check lets through, such as 31 February.
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`;
}

/** Reads a date in the locale's field order and returns ISO `YYYY-MM-DD`, or `null`. */
export function parseLocaleDate(text: string, locale: string): string | null {
  if (typeof text !== 'string') return null;
  const trimmed = toAsciiDigits(text.trim(), separatorsFor(locale).digits).replace(
    DIRECTION_MARKS,
    '',
  );
  if (trimmed === '') return null;

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const numbers = trimmed.split(/\D+/).filter((part) => part !== '');
  if (numbers.length !== 3) return null;

  const order = fieldOrderFor(locale);
  const values: Record<DateField, number> = { year: NaN, month: NaN, day: NaN };
  order.forEach((field, index) => {
    values[field] = Number(numbers[index]);
  });
  if (Object.values(values).some((value) => !Number.isFinite(value))) return null;

  return toIsoDate(values.year, values.month, values.day);
}

export interface FormatContext {
  locale: string;
  dataType: ColumnDataType;
  mask?: ColumnFormat;
}

function scaleFor(mask: ColumnFormat | undefined): number {
  if (mask?.magnitude === 'thousand') return 1_000;
  if (mask?.magnitude === 'million') return 1_000_000;
  return 1;
}

/**
 * Renders one cell. A missing value is an em dash and never a zero, because zero is a claim about
 * the data (constitution IX).
 */
export function formatCellValue(
  value: CellValue | undefined,
  { locale, dataType, mask }: FormatContext,
): string {
  if (value === null || value === undefined || value === '') return EM_DASH;

  if (dataType === 'text') return String(value);

  if (dataType === 'date') {
    const iso = typeof value === 'string' ? parseLocaleDate(value, locale) : null;
    if (iso === null) return String(value);
    const [year, month, day] = iso.split('-').map(Number);
    return getDateFormatter(locale, mask).format(new Date(Date.UTC(year, month - 1, day)));
  }

  const numeric = typeof value === 'number' ? value : parseLocaleNumber(value, locale);
  if (numeric === null || !Number.isFinite(numeric)) return EM_DASH;

  const scaled = numeric / scaleFor(mask);
  const forFormatter = dataType === 'percent' ? scaled / 100 : scaled;
  return getNumberFormatter(locale, mask, dataType).format(forFormatter);
}
