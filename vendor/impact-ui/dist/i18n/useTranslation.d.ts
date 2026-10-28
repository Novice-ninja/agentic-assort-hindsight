import { Locale, TFunction } from './types';

/**
 * Convenience hook for components that only need the translation function.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   <Button>{t("common.apply")}</Button>
 *   <span>{t("monthPicker.placeholder", { format: "MM/YYYY" })}</span>
 */
export declare function useTranslation(): {
    t: TFunction;
    locale: Locale;
};
//# sourceMappingURL=useTranslation.d.ts.map