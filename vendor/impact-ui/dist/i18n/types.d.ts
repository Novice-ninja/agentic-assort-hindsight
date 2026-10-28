export type Locale = string;
export type Messages = Record<string, string>;
export type TranslateVars = Record<string, string | number>;
export type TFunction = (key: string, vars?: TranslateVars) => string;
/**
 * Host hook to supply consumer overrides / extra languages for a locale.
 * May be sync or async.
 */
export type LoadMessages = (code: Locale) => Messages | Promise<Messages>;
export interface I18nContextValue {
    locale: Locale;
    messages: Messages;
    loading: boolean;
    setLocale: (code: Locale) => Promise<void>;
    t: TFunction;
    debugKeys: boolean;
}
//# sourceMappingURL=types.d.ts.map