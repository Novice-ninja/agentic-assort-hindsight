import { ReactNode } from 'react';
import { I18nContextValue, Locale, LoadMessages } from './types';

/**
 * Context shape:
 *   locale     - current active locale string (e.g. "en-US")
 *   messages   - resolved 3-layer message map for the active locale
 *   loading    - true while a locale switch is resolving loadMessages()
 *   setLocale  - async (code) => void; switches the active locale
 *   t          - (key, vars) => string; translation lookup + interpolation
 */
export declare const I18nContext: import('react').Context<I18nContextValue | null>;
export interface I18nProviderProps {
    /** initial active locale */
    defaultLocale?: Locale;
    /** (code) => messages | Promise<messages>; host overrides / extra languages */
    loadMessages?: LoadMessages;
    /** when true, `t()` returns the raw message key instead of the translation */
    debugKeys?: boolean;
    children: ReactNode;
}
export declare function I18nProvider({ defaultLocale, loadMessages, debugKeys, children, }: I18nProviderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=I18nContext.d.ts.map