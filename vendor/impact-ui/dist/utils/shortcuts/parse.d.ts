import { ParsedShortcut } from './types';

/**
 * Parse a shortcut string into the JS-compatible `{ isSequence, combos }` shape.
 * `mod+k` → single combo (mod resolved to ctrl/meta); `g i` → sequence.
 */
export declare function parseShortcutString(shortcutStr: string): ParsedShortcut;
/**
 * Normalize shortcut string for blacklist / dedup / comparison.
 * Modifiers are sorted alphabetically; `mod` is already platform-resolved.
 */
export declare function normalizeShortcutString(shortcutStr: string): string;
//# sourceMappingURL=parse.d.ts.map