import { default as enUS } from './en-US.json';
import { Locale, Messages } from '../i18n/types';

export { enUS };
export declare const ourDictionaries: Record<Locale, Messages>;
export declare const AGLocaleMap: Record<Locale, Record<string, string>>;
export declare const BASE_LOCALE: Locale;
export interface LocaleRegistryEntry {
    label: string;
    /**
     * Absolute asset-CDN URL of the flag icon (rendered via `<img src=...>`).
     * The TS/Vite build serves SVGs from the CDN rather than bundling them, so
     * this is a URL string (unlike the JS branch which used an SVG component).
     */
    icon: string;
    iconLabel: string;
}
/**
 * Single source of truth for every language impact-ui knows about.
 * Consumers should reference this (via the `enabledLocales` prop on Header)
 * rather than duplicating label/icon data themselves.
 */
export declare const LOCALE_REGISTRY: Record<Locale, LocaleRegistryEntry>;
//# sourceMappingURL=index.d.ts.map