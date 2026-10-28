import { useEffect, useCallback } from "react";
import { ShortcutManager } from "../../utils/shortcuts/ShortcutManager.js";
function useShortcutScope(name, active = true) {
  useEffect(() => {
    const manager = ShortcutManager.getInstance();
    if (active) {
      manager.enableScope(name);
    } else {
      manager.disableScope(name);
    }
    return () => {
      manager.disableScope(name);
    };
  }, [name, active]);
  const enable = useCallback(() => {
    ShortcutManager.getInstance().enableScope(name);
  }, [name]);
  const disable = useCallback(() => {
    ShortcutManager.getInstance().disableScope(name);
  }, [name]);
  return { enable, disable };
}
export {
  useShortcutScope
};
