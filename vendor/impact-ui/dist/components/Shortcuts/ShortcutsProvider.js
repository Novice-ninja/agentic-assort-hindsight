import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { ShortcutsConfigContext } from "./ShortcutsConfigContext.js";
function ShortcutsProvider({ enabled = false, children }) {
  const value = useMemo(() => {
    if (!enabled) {
      return { enabled: false, namespaces: null };
    }
    if (Array.isArray(enabled)) {
      return { enabled: true, namespaces: enabled };
    }
    return { enabled: true, namespaces: null };
  }, [Array.isArray(enabled) ? enabled.join(",") : enabled]);
  return /* @__PURE__ */ jsx(ShortcutsConfigContext.Provider, { value, children });
}
export {
  ShortcutsProvider
};
