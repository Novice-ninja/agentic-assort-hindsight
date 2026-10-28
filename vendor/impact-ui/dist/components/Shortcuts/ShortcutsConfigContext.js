import { createContext } from "react";
const ShortcutsConfigContext = createContext({
  enabled: false,
  namespaces: null
});
export {
  ShortcutsConfigContext
};
