import { jsx } from "react/jsx-runtime";
import { ShortcutScopeContext } from "./ShortcutContext.js";
import { useShortcutScope } from "./useShortcutScope.js";
function ShortcutScope({ name, active = true, children }) {
  useShortcutScope(name, active);
  return /* @__PURE__ */ jsx(ShortcutScopeContext.Provider, { value: name, children });
}
export {
  ShortcutScope
};
