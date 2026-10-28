import { useTranslation } from 'react-i18next';

/** Generic placeholder for navigation destinations that are not yet built. */
export function PlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation('nav');
  return (
    <div>
      <h1>{t(titleKey)}</h1>
      <p>{t('nav.comingSoon')}</p>
    </div>
  );
}
