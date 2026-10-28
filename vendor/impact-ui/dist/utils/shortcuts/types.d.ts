/** Platform modifier after `mod` is resolved at parse time. */
export type Modifier = 'ctrl' | 'meta' | 'alt' | 'shift';
/**
 * A single key combination (e.g. Mod+Shift+K).
 * JS-compatible: `modifiers` is a Set (no unresolved `mod` token).
 */
export interface ShortcutCombo {
    modifiers: Set<Modifier>;
    /** Normalized lowercase key (e.g. 'k', 'enter', 'arrowup') */
    key: string;
}
/**
 * Parsed shortcut — single combo or sequence of combos.
 * JS-compatible shape used by consumers of the previous JS package.
 */
export interface ParsedShortcut {
    isSequence: boolean;
    /** Single-element for simple chords; multi for sequences like `g i` */
    combos: ShortcutCombo[];
}
export interface ShortcutRegistration {
    id: string;
    keys: string;
    handler: (event: KeyboardEvent) => void;
    scope?: string;
    enabled?: boolean;
    allowInInput?: boolean;
    priority?: number;
    description?: string;
    preventDefault?: boolean;
    propagate?: boolean;
}
export interface ShortcutBinding {
    keys: string;
    handler: (event: KeyboardEvent) => void;
    id?: string;
    scope?: string;
    namespace?: string;
    enabled?: boolean;
    allowInInput?: boolean;
    priority?: number;
    description?: string;
    preventDefault?: boolean;
    propagate?: boolean;
}
export interface ShortcutSummary {
    id: string;
    keys: string;
    scope: string;
    description: string;
    priority: number;
}
//# sourceMappingURL=types.d.ts.map