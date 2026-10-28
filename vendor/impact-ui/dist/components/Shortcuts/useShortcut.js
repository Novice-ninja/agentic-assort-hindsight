import { useContext, useRef, useEffect } from "react";
import { ShortcutManager } from "../../utils/shortcuts/ShortcutManager.js";
import { ShortcutScopeContext } from "./ShortcutContext.js";
import { ShortcutsConfigContext } from "./ShortcutsConfigContext.js";
function isNamespaceAllowed(ns, config) {
  if (!ns) return true;
  if (!config.enabled) return false;
  if (!config.namespaces) return true;
  return config.namespaces.includes(ns);
}
function useShortcut(keysOrBindings, handlerOrShared = {}, singleOptions = {}) {
  const contextScope = useContext(ShortcutScopeContext);
  const config = useContext(ShortcutsConfigContext);
  const isArrayMode = Array.isArray(keysOrBindings);
  const bindings = isArrayMode ? keysOrBindings : [
    {
      keys: keysOrBindings,
      handler: handlerOrShared,
      ...singleOptions
    }
  ];
  const shared = isArrayMode ? handlerOrShared : {};
  const stableIdsRef = useRef(null);
  if (stableIdsRef.current === null) {
    stableIdsRef.current = bindings.map((b) => {
      const scope = b.scope ?? shared.scope ?? contextScope;
      return b.id ?? `${scope}::${b.keys}`;
    });
  }
  const handlersRef = useRef([]);
  bindings.forEach((b, i) => {
    handlersRef.current[i] = b.handler;
  });
  const configKey = config.enabled ? config.namespaces ? config.namespaces.join(",") : "all" : "off";
  const depsKey = bindings.map((b) => {
    const merged = { ...shared, ...b };
    return [
      b.keys,
      merged.scope ?? contextScope,
      merged.namespace ?? "",
      merged.enabled ?? true,
      merged.allowInInput ?? false,
      merged.priority ?? 0,
      merged.description ?? "",
      merged.preventDefault ?? true,
      merged.propagate ?? false
    ].join("|");
  }).join("||") + "||config:" + configKey;
  useEffect(() => {
    const manager = ShortcutManager.getInstance();
    const ids = stableIdsRef.current;
    const registered = [];
    bindings.forEach((b, i) => {
      const merged = { ...shared, ...b };
      const {
        keys,
        namespace,
        scope = contextScope,
        enabled = true,
        allowInInput = false,
        priority = 0,
        description = "",
        preventDefault = true,
        propagate = false
      } = merged;
      if (!enabled) return;
      if (!isNamespaceAllowed(namespace, config)) return;
      const id = ids[i];
      const handler = handlersRef.current[i];
      if (!id || !handler) return;
      manager.register({
        id,
        keys,
        handler: (e) => {
          handler(e);
        },
        scope,
        priority,
        allowInInput,
        description,
        preventDefault,
        propagate
      });
      registered.push(id);
    });
    return () => {
      registered.forEach((id) => {
        manager.unregister(id);
      });
    };
  }, [depsKey, contextScope]);
}
export {
  useShortcut
};
