/**
 * Follow-up questions arrive on the final `done` frame (not on `trace`).
 *
 * The live assort-agent contract uses snake_case. The canonical field is
 * `follow_up_questions: string[]`. A few aliases are accepted so a rename on
 * the service does not silently drop the list — we never invent the questions
 * themselves.
 */

const FOLLOW_UP_FRAME_KEYS = [
  'follow_up_questions',
  'suggested_questions',
  'follow_ups',
] as const;

const FOLLOW_UP_RESULT_TYPES = new Set([
  'questions',
  'follow_up_questions',
  'suggested_questions',
  'follow_ups',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Normalises a raw list into unique, non-empty strings.
 * Non-strings and blanks are dropped; first occurrence wins for duplicates.
 */
export function parseFollowUpQuestionList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const questions: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const text = item.trim();
    if (text.length === 0 || seen.has(text)) continue;
    seen.add(text);
    questions.push(text);
  }
  return questions;
}

function contentTypeOf(value: Record<string, unknown>): string {
  const raw = value.content_type ?? value.type;
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

function readFromResult(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    if (!FOLLOW_UP_RESULT_TYPES.has(contentTypeOf(entry))) continue;
    const parsed = parseFollowUpQuestionList(entry.data);
    if (parsed.length > 0) return parsed;
  }
  return [];
}

/**
 * Reads follow-up questions from a raw `done` payload.
 *
 * Prefers a top-level array on the frame; falls back to a `result` block whose
 * `content_type` is a questions list (those blocks are otherwise dropped as
 * empty text by `parseAgentResult`).
 */
export function readFollowUpQuestionsFromDone(data: Record<string, unknown>): string[] {
  for (const key of FOLLOW_UP_FRAME_KEYS) {
    if (!(key in data) || data[key] === undefined || data[key] === null) continue;
    const parsed = parseFollowUpQuestionList(data[key]);
    if (parsed.length > 0) return parsed;
  }
  return readFromResult(data.result);
}
