export declare const MODIFIER_KEYS: Set<string>;
export declare const INPUT_ELEMENTS: Set<string>;
/** Canonical key aliases for shortcut parsing and matching. */
export declare const KEY_ALIASES: Record<string, string>;
/**
 * Browser-reserved chords we refuse to register (warn and skip).
 * Values are normalized shortcut strings without platform mod resolution.
 */
export declare const BROWSER_SHORTCUT_BLACKLIST: Set<string>;
/** Default ms between keys in a sequence chord (e.g. `g i`). */
export declare const DEFAULT_SEQUENCE_TIMEOUT = 1000;
//# sourceMappingURL=constants.d.ts.map