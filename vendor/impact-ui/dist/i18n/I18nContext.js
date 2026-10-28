import { jsx } from "react/jsx-runtime";
import { createContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import moment from "moment";
import "../node_modules/moment/dist/locale/de.js";
import { BASE_LOCALE } from "../locales/index.js";
import { buildMessages, translate } from "./translate.js";
const I18nContext = createContext(null);
function I18nProvider({
  defaultLocale = BASE_LOCALE,
  loadMessages = () => ({}),
  debugKeys = false,
  children
}) {
  const [locale, setLocaleState] = useState(defaultLocale);
  const [hostMessages, setHostMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const loadMessagesRef = useRef(loadMessages);
  useEffect(() => {
    loadMessagesRef.current = loadMessages;
  }, [loadMessages]);
  const setLocale = useCallback(async (code) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const host = await loadMessagesRef.current(code);
      if (requestId !== requestIdRef.current) return;
      setHostMessages(host);
      setLocaleState(code);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setHostMessages({});
      setLocaleState(code);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void setLocale(defaultLocale);
  }, []);
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);
  const messages = useMemo(() => buildMessages(locale, hostMessages), [locale, hostMessages]);
  const t = useCallback(
    (key, vars) => debugKeys ? key : translate(messages, key, vars),
    [messages, debugKeys]
  );
  const value = useMemo(
    () => ({ locale, messages, loading, setLocale, t, debugKeys }),
    [locale, messages, loading, setLocale, t, debugKeys]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
export {
  I18nContext,
  I18nProvider
};
