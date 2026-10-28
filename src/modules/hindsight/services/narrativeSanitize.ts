import DOMPurify from 'dompurify';
import { decodeIaString } from '@shared/utils/format';
import {
  NARRATIVE_ALLOWED_CLASSES,
  transformHtmlStringInsightFeed,
} from './narrativeHtml';

const ALLOWED_TAGS = ['b', 'br', 'ul', 'ol', 'li', 'span', 'h2', 'h3', 'p'] as const;
const ALLOWED_ATTR = ['class'] as const;

const ALLOWED_TAG_SET = new Set<string>(ALLOWED_TAGS);
const ALLOWED_CLASS_SET = new Set(NARRATIVE_ALLOWED_CLASSES);
const PURIFY_INTERNAL_TAGS = new Set(['html', 'body', 'head']);

/**
 * `__ia_char_13` / `_28` / `_29` map to `&` / `<` / `>`. Escape those tokens to
 * entities *before* the shared decoder runs so a decoded character cannot open
 * a tag (or turn into `<green>`) ahead of the transform + sanitizer.
 */
const HTML_SIGNIFICANT_IA_TOKEN_RE = /_{2,}ia_char_(13|28|29)/gi;
const HTML_SIGNIFICANT_IA_ENTITIES: Readonly<Record<string, string>> = {
  '13': '&amp;',
  '28': '&lt;',
  '29': '&gt;',
};

function decodeIaTokensForHtml(raw: string): string {
    const escaped = raw.replace(
    HTML_SIGNIFICANT_IA_TOKEN_RE,
    (matched, digits: string) => HTML_SIGNIFICANT_IA_ENTITIES[digits] ?? matched,
  );
  return decodeIaString(escaped);
}

/**
 * Transforms insight-feed pseudo-HTML and sanitizes for `dangerouslySetInnerHTML`.
 *
 * Pipeline: HTML-escape significant IA tokens → decode remaining `__ia_char_*`
 * → map `<green>`/`<main-h>` → DOMPurify.
 * Decoding stays before sanitizing so `,` `/` are real characters the sanitizer
 * sees; state and the Ask Iris `query` stay encoded (see `insightToPlainText`).
 *
 * LLM-generated markup is untrusted: only an explicit tag/attr allowlist survives,
 * and `class` values are restricted to narrative metric/heading classes.
 */
export function sanitizeNarrativeHtml(raw: string): string {
  const decoded = decodeIaTokensForHtml(raw ?? '');
  const transformed = transformHtmlStringInsightFeed(decoded);

  return DOMPurify.sanitize(transformed, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  });
}

/**
 * Restricts `class` on sanitized nodes to the narrative allowlist.
 * Called after purify when a hook is registered (see `ensureNarrativeSanitizeHooks`).
 */
function restrictNarrativeClasses(node: Element): void {
  if (!node.hasAttribute('class')) return;
  const kept = (node.getAttribute('class') ?? '')
    .split(/\s+/)
    .filter((token) => ALLOWED_CLASS_SET.has(token));
  if (kept.length === 0) {
    node.removeAttribute('class');
  } else {
    node.setAttribute('class', kept.join(' '));
  }
}

let hooksRegistered = false;

/** Idempotent DOMPurify hook registration for class allowlisting. */
export function ensureNarrativeSanitizeHooks(): void {
  if (hooksRegistered) return;
  hooksRegistered = true;
  DOMPurify.addHook('uponSanitizeElement', (_node, data) => {
    if (process.env.NODE_ENV === 'production') return;
    const tag = data.tagName;
    if (
      !tag ||
      tag.startsWith('#') ||
      PURIFY_INTERNAL_TAGS.has(tag) ||
      ALLOWED_TAG_SET.has(tag)
    ) {
      return;
    }
    // eslint-disable-next-line no-console
    console.warn(`[season-narrative] Stripping unknown tag <${tag}>`);
  });
  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName !== 'class') return;
    const kept = (data.attrValue ?? '')
      .split(/\s+/)
      .filter((token) => ALLOWED_CLASS_SET.has(token));
    data.attrValue = kept.join(' ');
    if (kept.length === 0) {
      data.keepAttr = false;
    }
  });
  // Keep a post-pass for environments where the attribute hook is skipped.
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node instanceof Element) restrictNarrativeClasses(node);
  });
}

ensureNarrativeSanitizeHooks();

/**
 * Memo-friendly: transform + sanitize one string. Empty input → empty string.
 */
export function prepareNarrativeHtml(raw: string | undefined | null): string {
  if (raw == null || raw.length === 0) return '';
  return sanitizeNarrativeHtml(raw);
}
