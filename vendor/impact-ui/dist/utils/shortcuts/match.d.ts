import { ShortcutCombo } from './types';

/** Normalize KeyboardEvent.key to canonical lowercase form. */
export declare function normalizeKey(key: string): string;
/** Map `KeyboardEvent.code` to normalized key (fixes macOS Option+letter). */
export declare function normalizedPhysicalKey(code: string): string | null;
/**
 * Test whether a KeyboardEvent matches a ShortcutCombo exactly
 * (same modifiers, no more / no fewer, and matching key).
 */
export declare function matchShortcut(event: KeyboardEvent, combo: ShortcutCombo): boolean;
//# sourceMappingURL=match.d.ts.map