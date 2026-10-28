import { I18nContextValue } from './types';

/**
 * Access the full i18n context: { locale, messages, loading, setLocale, t }.
 *
 * Safe to use outside an I18nProvider: it degrades to the base locale
 * so library components never crash when a consumer forgets the provider.
 */
export declare function useI18n(): I18nContextValue;
//# sourceMappingURL=useI18n.d.ts.map