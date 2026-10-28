import { Locale, Messages, TranslateVars } from './types';

/**
 * Build the effective message map for a locale using the 3-layer merge:
 *   1. enUS                      -> guaranteed-complete base (never blank)
 *   2. ourDictionaries[locale]   -> impact-ui's translation for this locale
 *   3. hostMessages              -> consumer overrides / their own keys (win)
 */
export declare function buildMessages(locale: Locale, hostMessages?: Messages): Messages;
/**
 * Look up a key and interpolate {placeholder} tokens.
 * Falls back to the key itself if it is missing (so nothing renders blank).
 */
export declare function translate(messages: Messages, key: string, vars?: TranslateVars): string;
//# sourceMappingURL=translate.d.ts.map