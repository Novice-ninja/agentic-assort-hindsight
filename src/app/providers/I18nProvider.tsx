import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLocalStorage } from '@shared/hooks';
import { STORAGE_KEYS } from '@shared/constants';
import { env } from '@config/env';
import { directionFor, initI18n } from '@shared/i18n';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale] = useLocalStorage<string>(STORAGE_KEYS.locale, env.defaultLocale);
  const i18n = useMemo(() => initI18n(locale), []); // eslint-disable-line react-hooks/exhaustive-deps
  const initialApplied = useRef(false);

  if (!initialApplied.current) {
    document.documentElement.lang = locale;
    document.documentElement.dir = directionFor(locale);
    initialApplied.current = true;
  }

  useEffect(() => {
    const handler = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = directionFor(lng);
    };
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
