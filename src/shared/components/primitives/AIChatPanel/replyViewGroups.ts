import type { AgentResult } from '@shared/services/agentWs';

/**
 * Presentation grouping for one reply. Charts share `content_type: 'chart'`
 * and split by `data.kind`. `bar` and `column` are the same visual (vertical
 * columns), so they share one view.
 */
export type ReplyViewId =
  | 'text'
  | 'table'
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'heatmap'
  | 'chart';

export interface ReplyViewGroup {
  id: ReplyViewId;
  blocks: AgentResult[];
}

const selectionByReplyId = new Map<string, ReplyViewId>();

export function replyViewIdFor(block: AgentResult): ReplyViewId {
  if (block.content_type === 'text') return 'text';
  if (block.content_type === 'table') return 'table';
  // Files render as download chrome under the reply, not as a toggled view.
  if (block.content_type === 'file') return 'text';

  switch (block.data.kind) {
    case 'bar':
    case 'column':
      return 'bar';
    case 'line':
      return 'line';
    case 'area':
      return 'area';
    case 'pie':
      return 'pie';
    case 'heatmap':
      return 'heatmap';
    default: {
      const unknownKind: string = block.data.kind;
      if (typeof console !== 'undefined') {
        // Unknown `kind` values are coerced to column at parse time; this is a
        // last-resort group so a future kind cannot crash the reply card.
        // eslint-disable-next-line no-console
        console.warn(`[iris] grouping unrecognized chart kind as Chart: ${unknownKind}`);
      }
      return 'chart';
    }
  }
}

/**
 * Groups blocks by view id, preserving first-appearance order of types and
 * original relative order of blocks within each type.
 */
export function groupReplyBlocks(blocks: readonly AgentResult[]): ReplyViewGroup[] {
  const groups: ReplyViewGroup[] = [];
  const indexById = new Map<ReplyViewId, number>();

  for (const block of blocks) {
    const id = replyViewIdFor(block);
    const existing = indexById.get(id);
    if (existing === undefined) {
      indexById.set(id, groups.length);
      groups.push({ id, blocks: [block] });
    } else {
      groups[existing].blocks.push(block);
    }
  }

  return groups;
}

export function defaultReplyView(groups: readonly ReplyViewGroup[]): ReplyViewId | null {
  if (groups.length === 0) return null;
  const text = groups.find((group) => group.id === 'text');
  return text?.id ?? groups[0].id;
}

export function resolveReplyView(
  groups: readonly ReplyViewGroup[],
  preferred: ReplyViewId | undefined,
): ReplyViewId | null {
  if (preferred !== undefined && groups.some((group) => group.id === preferred)) {
    return preferred;
  }
  return defaultReplyView(groups);
}

export function readReplyViewSelection(replyId: string): ReplyViewId | undefined {
  return selectionByReplyId.get(replyId);
}

export function writeReplyViewSelection(replyId: string, view: ReplyViewId): void {
  selectionByReplyId.set(replyId, view);
}

/** Test helper — not used in product code. */
export function resetReplyViewSelections(): void {
  selectionByReplyId.clear();
}
