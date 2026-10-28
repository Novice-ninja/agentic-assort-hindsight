import DOMPurify from 'dompurify';
import { decodeIaString } from '@shared/utils/format';

/**
 * What the agent is allowed to render in a reply.
 *
 * The service answers in HTML — the observed shape is `<p>`, `<b>`, `<ul>`, `<li>`, and
 * `<table>` — so the list mirrors that plus the neighbouring tags an LLM reaches for
 * unprompted. Anything else is stripped while its text is kept, so an unexpected tag
 * degrades to prose rather than disappearing.
 */
const ALLOWED_TAGS = [
  'p',
  'br',
  'b',
  'strong',
  'i',
  'em',
  'u',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'h4',
  'span',
  'code',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
] as const;

/** Any tag at all. Replies are not always markup — `feedback` arrives as bare prose. */
const MARKUP_PATTERN = /<[a-z][^>]*>/i;

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/**
 * Wraps prose in paragraphs so a plain reply keeps its shape. Blank lines separate
 * paragraphs; single newlines become breaks.
 */
function plainTextToHtml(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/**
 * Turns an agent reply into markup safe for `dangerouslySetInnerHTML`.
 *
 * `__ia_char_*` tokens are decoded before the markup/plain split and before
 * sanitization, so product names never show encoded punctuation. The WebSocket
 * `query` is not built here and stays encoded.
 *
 * The reply is model-generated and therefore untrusted: only the tag allowlist survives, and
 * no attributes at all are kept. Dropping attributes is deliberate rather than restrictive —
 * `AgentReplyBody` styles the result through its own descendant selectors, so nothing here
 * needs a `class`, and the module that does allow one registers global DOMPurify hooks
 * (`modules/hindsight/services/narrativeSanitize.ts`) whose allowlist would otherwise decide
 * what a chat reply may be styled with.
 *
 * Returns `''` for an empty reply so the caller can show its own fallback copy.
 */
export function prepareAgentReplyHtml(raw: string | null | undefined): string {
  const text = raw?.trim();
  if (text === undefined || text.length === 0) return '';

  const decoded = decodeIaString(text);
  const source = MARKUP_PATTERN.test(decoded) ? decoded : plainTextToHtml(decoded);

  return DOMPurify.sanitize(source, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  }).trim();
}
