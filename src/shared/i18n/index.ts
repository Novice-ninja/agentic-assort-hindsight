import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { env } from '@config/env';
import { isDev } from '@config/env';
import { FALLBACK_LOCALE, namespaces, resources } from './resources';

export function initI18n(initialLocale: string = env.defaultLocale) {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: initialLocale,
      fallbackLng: FALLBACK_LOCALE,
      ns: namespaces as unknown as string[],
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      saveMissing: isDev,
      missingKeyHandler: isDev
        ? (lngs, ns, key) => {
            // eslint-disable-next-line no-console
            console.warn(`[i18n] missing key "${ns}:${key}" for ${lngs.join(',')}`);
          }
        : undefined,
    });
  }
  return i18n;
}

export { i18n };
export * from './resources';
