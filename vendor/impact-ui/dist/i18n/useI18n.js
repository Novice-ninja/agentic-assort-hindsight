import { useContext } from "react";
import { I18nContext } from "./I18nContext.js";
import { buildMessages } from "./translate.js";
import { BASE_LOCALE } from "../locales/index.js";
function useI18n() {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  const messages = buildMessages(BASE_LOCALE, {});
  return {
    locale: BASE_LOCALE,
    messages,
    loading: false,
    setLocale: () => Promise.resolve(),
    t: (key, vars) => {
      let text = messages[key] ?? key;
      if (vars) {
        Object.keys(vars).forEach((name) => {
          text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
        });
      }
      return text;
    },
    debugKeys: false
  };
}
export {
  useI18n
};
