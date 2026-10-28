import type { WatchlistThreshold } from './WatchlistRuleCard';

/** A rule's display value split into the editable number and its fixed affixes. */
export interface ParsedThreshold {
  prefix: string;
  number: string;
  suffix: string;
}

const VALUE_PATTERN = /^([^\d-]*)(-?\d[\d,]*\.?\d*)(.*)$/;

/** "-2 pts" -> { prefix: "", number: "-2", suffix: " pts" }; "$500" -> { "$", "500", "" }. */
export function parseThresholdValue(value: number | string): ParsedThreshold {
  const text = String(value);
  const match = VALUE_PATTERN.exec(text);
  if (!match) return { prefix: '', number: text, suffix: '' };
  return { prefix: match[1] ?? '', number: match[2] ?? '', suffix: match[3] ?? '' };
}

/** Unit shown in the input label: "%" , "$", "pts", "days", or none. */
export function thresholdUnit({ prefix, suffix }: ParsedThreshold): string {
  return prefix.trim() || suffix.trim();
}

/** Numbers only: an optional leading minus, digits and one decimal point. */
export const isPartialNumber = (text: string) => /^-?\d*\.?\d*$/.test(text);
export const isCompleteNumber = (text: string) => /^-?\d+(\.\d+)?$/.test(text);

export function formatThresholdValue(parsed: ParsedThreshold, number: string): string {
  return `${parsed.prefix}${number}${parsed.suffix}`;
}

export function applyThresholdEdits(
  rules: readonly WatchlistThreshold[],
  numbers: Readonly<Record<string, string>>,
): WatchlistThreshold[] {
  return rules.map((rule) => {
    const number = numbers[rule.key];
    return number === undefined
      ? rule
      : { ...rule, value: formatThresholdValue(parseThresholdValue(rule.value), number) };
  });
}
