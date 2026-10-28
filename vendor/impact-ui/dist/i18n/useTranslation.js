import { useI18n } from "./useI18n.js";
function useTranslation() {
  const { t, locale } = useI18n();
  return { t, locale };
}
export {
  useTranslation
};
