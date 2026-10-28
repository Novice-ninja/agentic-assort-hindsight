import type { AgentActionButtonVariant, AgentActionOption } from './types';

const BUTTON_VARIANTS = new Set<AgentActionButtonVariant>([
  'primary',
  'contained',
  'secondary',
  'outlined',
  'tertiary',
  'text',
  'url',
]);

/**
 * Reply actions arrive on the final `done` frame.
 * The canonical field is `actions: { id, label }[]`. A result block with
 * `content_type: "actions"` is accepted as a fallback. The socket send uses `id`
 * only — the label is display text.
 */

const ACTION_FRAME_KEYS = ['actions'] as const;
const ACTION_RESULT_TYPES = new Set(['actions', 'action']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asTrimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function idOf(value: Record<string, unknown>): string {
  return asTrimmed(value.id) || asTrimmed(value.action_id) || asTrimmed(value.actionId);
}

function labelOf(value: Record<string, unknown>, id: string): string {
  return (
    asTrimmed(value.label) ||
    asTrimmed(value.title) ||
    asTrimmed(value.name) ||
    asTrimmed(value.text) ||
    id
  );
}

function variantOf(value: Record<string, unknown>): AgentActionButtonVariant | undefined {
  const raw =
    asTrimmed(value.type) || asTrimmed(value.variant) || asTrimmed(value.buttonType);
  const key = raw.toLowerCase() as AgentActionButtonVariant;
  return BUTTON_VARIANTS.has(key) ? key : undefined;
}

/** Unique options. Blank ids are dropped. First id wins. */
export function parseAgentActionList(raw: unknown): AgentActionOption[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const actions: AgentActionOption[] = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      const id = item.trim();
      if (id.length === 0 || seen.has(id)) continue;
      seen.add(id);
      actions.push({ id, label: id });
      continue;
    }
    if (!isRecord(item)) continue;
    const id = idOf(item);
    if (id.length === 0 || seen.has(id)) continue;
    seen.add(id);
    const variant = variantOf(item);
    actions.push(
      variant
        ? { id, label: labelOf(item, id), variant }
        : { id, label: labelOf(item, id) },
    );
  }
  return actions;
}

function contentTypeOf(value: Record<string, unknown>): string {
  const raw = value.content_type ?? value.type;
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

function readFromResult(raw: unknown): AgentActionOption[] {
  if (!Array.isArray(raw)) return [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    if (!ACTION_RESULT_TYPES.has(contentTypeOf(entry))) continue;
    const parsed = parseAgentActionList(entry.data);
    if (parsed.length > 0) return parsed;
  }
  return [];
}

export function readActionsFromDone(data: Record<string, unknown>): AgentActionOption[] {
  for (const key of ACTION_FRAME_KEYS) {
    if (!(key in data) || data[key] === undefined || data[key] === null) continue;
    const parsed = parseAgentActionList(data[key]);
    if (parsed.length > 0) return parsed;
  }
  return readFromResult(data.result);
}
