import { ourDictionaries, BASE_LOCALE } from "../locales/index.js";
import enUS from "../locales/en-US.json.js";
function buildMessages(locale, hostMessages = {}) {
  return {
    ...enUS,
    ...ourDictionaries[locale] ?? ourDictionaries[BASE_LOCALE] ?? {},
    ...hostMessages
  };
}
function translate(messages, key, vars) {
  let text = messages[key] ?? key;
  if (vars) {
    Object.keys(vars).forEach((name) => {
      text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
    });
  }
  return text;
}
export {
  buildMessages,
  translate
};
