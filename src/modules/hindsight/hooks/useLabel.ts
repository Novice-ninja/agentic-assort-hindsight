import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { replaceSpecialCharacter } from '@shared/utils/format';

/**
 * Resolves a display label that may be either a translation key or a literal name.
 *
 * The module's label fields carry both kinds. Seasons, hierarchy levels, clusters, metrics and
 * plan versions are application concepts and have translations. Product positions, colour
 * values, attribute values and style descriptions are tenant data — there is nothing to
 * translate, and inventing translations for a customer's product names would be wrong.
 *
 * Rather than making every widget know which kind it is holding, this translates when a
 * translation exists and otherwise shows the value as given. Checking `exists` first also
 * keeps tenant data out of the missing-key handler, so that warning stays a real signal.
 *
 * Tenant data labels may contain IA char codes (`__ia_char_*`) from the backend; these are
 * decoded to their real characters before display.
 */
export function useLabel(): (labelKey: string) => string {
  const { t, i18n } = useTranslation('hindsight');

  return useCallback(
    (labelKey: string) => {
      if (i18n.exists(labelKey, { ns: 'hindsight' })) return t(labelKey);
      const decoded = replaceSpecialCharacter(labelKey);
      return typeof decoded === 'string' ? decoded : labelKey;
    },
    [t, i18n],
  );
}
