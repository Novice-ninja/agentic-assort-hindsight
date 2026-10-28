/**
 * Pure transforms for Season Narrative pseudo-HTML.
 *
 * Pipeline: normalize newlines → arrow/`ul` break → map custom tags → (caller sanitizes).
 * Classes are token-driven in CSS modules; this module only emits known class names.
 */

const POSITIVE_CLASS = 'narrativeMetricPositive';
const NEGATIVE_CLASS = 'narrativeMetricNegative';
const MAIN_HEADING_CLASS = 'narrativeMainHeading';
const SUB_HEADING_CLASS = 'narrativeSubHeading';

/** Classes the sanitizer may retain on narrative markup. */
export const NARRATIVE_ALLOWED_CLASSES: readonly string[] = [
  POSITIVE_CLASS,
  NEGATIVE_CLASS,
  MAIN_HEADING_CLASS,
  SUB_HEADING_CLASS,
];

/**
 * Inserts a line break before a `<ul>` that follows an arrow character so lists
 * don't run into the preceding sentence on one line.
 */
export function addBreakBeforeArrowUl(html: string): string {
  if (!html) return '';
  return html.replace(/([→➔➜➡⟶])\s*(<ul\b)/gi, '$1<br>$2');
}

/**
 * Maps custom insight-feed tags to real elements with known classes.
 * Unknown / unbalanced tags are left for the sanitizer to strip.
 */
export function transformHtmlStringInsightFeed(html: string): string {
  if (!html) return '';

  let next = html.replace(/\\n/g, '\n').replace(/\n/g, '<br>');

  next = addBreakBeforeArrowUl(next);

  next = next
    .replace(/<main-h\b[^>]*>/gi, `<h2 class="${MAIN_HEADING_CLASS}">`)
    .replace(/<\/main-h>/gi, '</h2>')
    .replace(/<sub-h\b[^>]*>/gi, `<h3 class="${SUB_HEADING_CLASS}">`)
    .replace(/<\/sub-h>/gi, '</h3>')
    .replace(/<green\b[^>]*>/gi, `<span class="${POSITIVE_CLASS}">`)
    .replace(/<\/green>/gi, '</span>')
    .replace(/<red\b[^>]*>/gi, `<span class="${NEGATIVE_CLASS}">`)
    .replace(/<\/red>/gi, '</span>');

  return next;
}
