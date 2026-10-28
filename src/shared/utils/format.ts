import { SPECIAL_CHARACTER_MAPPING } from '../../config/constants';


/**
 * Locale-aware formatting helpers built on the Intl APIs.
 * The active locale is passed in by callers (from useTranslation().i18n.language).
 */
export function formatDate(
  value: string | number | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  locale: string,
  currency = 'USD',
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

/**
 * Compact abbreviations from numeral.js (`a` masks) and some hand-rolled scalers are
 * lowercase (`k`/`m`/`b`/`t`). Product copy uses uppercase (`K`/`M`/`B`/`T`) everywhere.
 */
export function normalizeCompactAbbreviations(formatted: string): string {
  return formatted.replace(/(\d)([kmbt])(?![a-z])/gi, (_match, digit: string, unit: string) =>
    `${digit}${unit.toUpperCase()}`,
  );
}

/**
 * Canonical tokens are `__ia_char_NN` (two underscores). A preceding literal `_` in the
 * source concatenates to `___ia_char_NN` in the screenshot; `{2,}` consumes that glue so
 * `Ve___ia_char_30` becomes `Ve,` rather than `Ve_,`.
 */
const IA_CHAR_TOKEN_PATTERN = '_{2,}ia_char_(\\d{2})';

function mappedIaCharacter(digits: string): string | undefined {
  return (SPECIAL_CHARACTER_MAPPING as Record<string, string>)[`__ia_char_${digits}`];
}

function warnUnknownIaToken(token: string): void {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[ia-char] unknown token ${token}`);
  }
}

export const replaceSpecialCharacter = (str: string): string | object => {
  if (typeof str === 'object') {
    return str;
  }
  if (str == null) {
    return str;
  }
  const re = new RegExp(IA_CHAR_TOKEN_PATTERN, 'gi');
  return str.toString().replace(re, (matched, digits: string) => {
    const mapped = mappedIaCharacter(digits);
    if (mapped === undefined) {
      warnUnknownIaToken(matched);
      return matched;
    }
    return mapped;
  });
};

const REVERSE_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(SPECIAL_CHARACTER_MAPPING).map(([code, char]) => [char, code]),
);

const REVERSE_REGEX = new RegExp(
  `[${Object.values(SPECIAL_CHARACTER_MAPPING).map((c) => `\\${c}`).join('')}]`,
  'g',
);

/**
 * Replaces special characters in a string with their IA char code equivalents
 * (the reverse of `replaceSpecialCharacter`). Use when building payloads to send
 * back to the backend.
 */
export const replaceSpecialCharToCharCode = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(REVERSE_REGEX, (matched) => REVERSE_MAPPING[matched] ?? matched);
};


/**
 * Typed string-only decode: replaces `__ia_char_*` codes with real characters.
 * Unlike `replaceSpecialCharacter`, always returns a string. Unknown tokens are
 * left in place (and logged in development) so a gap in the map stays visible.
 */
export function decodeIaString(value: string): string {
  if (!value || typeof value !== 'string') return value;
  const result = replaceSpecialCharacter(value);
  return typeof result === 'string' ? result : value;
}

export function decodeRowStrings(row: Record<string, unknown>): Record<string, unknown> {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
  const decoded: Record<string, unknown> = {};
  Object.keys(row).forEach((key) => {
    const val = row[key];
    if (typeof val === 'string') {
      decoded[key] = replaceSpecialCharacter(val);
    } else if (Array.isArray(val)) {
      decoded[key] = val.map((item) =>
        typeof item === 'string'
          ? replaceSpecialCharacter(item)
          : Array.isArray(item)
            ? item.map((nested) => typeof nested === 'string' ? replaceSpecialCharacter(nested) : nested)
            : item && typeof item === 'object'
              ? decodeRowStrings(item as Record<string, unknown>)
              : item
      );
    } else if (val && typeof val === 'object') {
      decoded[key] = decodeRowStrings(val as Record<string, unknown>);
    } else {
      decoded[key] = val;
    }
  });
  return decoded;
}