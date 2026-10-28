import { DEFAULT_SEQUENCE_TIMEOUT, MODIFIER_KEYS, INPUT_ELEMENTS, BROWSER_SHORTCUT_BLACKLIST } from "./constants.js";
import { matchShortcut } from "./match.js";
import { parseShortcutString, normalizeShortcutString } from "./parse.js";
import { SequenceTracker } from "./sequence.js";
function isBlacklisted(keys) {
  return BROWSER_SHORTCUT_BLACKLIST.has(normalizeShortcutString(keys));
}
const _ShortcutManager = class _ShortcutManager {
  constructor(options) {
    this.registrations = /* @__PURE__ */ new Map();
    this.activeScopes = /* @__PURE__ */ new Set(["global"]);
    this.listenerAttached = false;
    this.debug = false;
    this.sequenceTimeout = DEFAULT_SEQUENCE_TIMEOUT;
    this._sortedCache = null;
    this.handleKeyDown = (event) => {
      if (MODIFIER_KEYS.has(event.key)) return;
      const target = event.target;
      const isInInput = INPUT_ELEMENTS.has(target.tagName) || target.isContentEditable;
      const sorted = this.getSorted();
      const active = sorted.filter((e) => this.isScopeActive(e.scope ?? "global"));
      const sequenceEntries = active.filter((e) => e.parsed.isSequence && (e.allowInInput === true || !isInInput)).map((e) => ({ ...e, steps: e.parsed.combos }));
      if (sequenceEntries.length > 0 || this._sequenceTracker.hasActiveSequences) {
        const seqMatch = this._sequenceTracker.advance(event, sequenceEntries);
        if (seqMatch) {
          if (seqMatch.preventDefault !== false) event.preventDefault();
          this.debugLog(event, seqMatch);
          seqMatch.handler(event);
          if (!seqMatch.propagate) return;
        }
        if (this._sequenceTracker.hasActiveSequences) {
          return;
        }
      }
      const comboEntries = active.filter(
        (e) => !e.parsed.isSequence && (e.allowInInput === true || !isInInput)
      );
      for (const entry of comboEntries) {
        const combo = entry.parsed.combos[0];
        if (!combo) continue;
        if (matchShortcut(event, combo)) {
          if (entry.preventDefault !== false) event.preventDefault();
          this.debugLog(event, entry);
          entry.handler(event);
          if (!entry.propagate) return;
        }
      }
    };
    if (options == null ? void 0 : options.debug) this.debug = options.debug;
    if (options == null ? void 0 : options.sequenceTimeout) this.sequenceTimeout = options.sequenceTimeout;
    this._sequenceTracker = new SequenceTracker(this.sequenceTimeout);
    this.attachListener();
  }
  static getInstance(options) {
    if (!_ShortcutManager.instance) {
      _ShortcutManager.instance = new _ShortcutManager(options);
    }
    return _ShortcutManager.instance;
  }
  static resetInstance() {
    var _a;
    (_a = _ShortcutManager.instance) == null ? void 0 : _a.destroy();
    _ShortcutManager.instance = null;
  }
  attachListener() {
    if (this.listenerAttached || typeof document === "undefined") return;
    document.addEventListener("keydown", this.handleKeyDown, true);
    this.listenerAttached = true;
  }
  getSorted() {
    if (!this._sortedCache) {
      this._sortedCache = [...this.registrations.values()].sort(
        (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
      );
    }
    return this._sortedCache;
  }
  register(registration) {
    if (isBlacklisted(registration.keys)) {
      console.warn(
        `[ShortcutManager] Skipping blacklisted shortcut: ${registration.keys} (${registration.id})`
      );
      return;
    }
    if (this.registrations.has(registration.id)) {
      this.unregister(registration.id);
    }
    const parsed = parseShortcutString(registration.keys);
    this.registrations.set(registration.id, { ...registration, parsed });
    this._sortedCache = null;
    if (this.debug) {
      console.log(
        `[ShortcutManager] Registered "${registration.id}" → ${registration.keys} (scope: ${registration.scope ?? "global"})`
      );
    }
  }
  /**
   * Programmatically invoke a registered shortcut handler by its id.
   * Returns true if the shortcut was found and fired, false otherwise.
   */
  trigger(id, event) {
    const entry = this.registrations.get(id);
    if (!entry) return false;
    if (entry.preventDefault !== false && event) event.preventDefault();
    if (this.debug) {
      console.log(`[ShortcutManager] Programmatic trigger "${id}" (${entry.keys})`);
    }
    if (event) {
      entry.handler(event);
    } else {
      entry.handler({});
    }
    return true;
  }
  unregister(id) {
    if (this.registrations.delete(id)) {
      this._sortedCache = null;
      if (this.debug) {
        console.log(`[ShortcutManager] Unregistered "${id}"`);
      }
    }
  }
  isRegistered(id) {
    return this.registrations.has(id);
  }
  enableScope(name) {
    this.activeScopes.add(name);
    if (this.debug) {
      console.log(`[ShortcutManager] Scope enabled: "${name}"`);
    }
  }
  disableScope(name) {
    if (name === "global") {
      console.warn('[ShortcutManager] The "global" scope cannot be disabled.');
      return;
    }
    this.activeScopes.delete(name);
    this._sequenceTracker.reset();
    if (this.debug) {
      console.log(`[ShortcutManager] Scope disabled: "${name}"`);
    }
  }
  isScopeActive(name) {
    return name === "global" || this.activeScopes.has(name);
  }
  getAllShortcuts() {
    return [...this.registrations.values()].map((r) => ({
      id: r.id,
      keys: r.keys,
      scope: r.scope ?? "global",
      description: r.description ?? "",
      priority: r.priority ?? 0
    }));
  }
  getShortcutsByScope(scope) {
    return this.getAllShortcuts().filter((s) => s.scope === scope).map(({ id, keys, description, priority }) => ({
      id,
      keys,
      description,
      priority
    }));
  }
  setDebug(enabled) {
    this.debug = enabled;
  }
  destroy() {
    if (this.listenerAttached && typeof document !== "undefined") {
      document.removeEventListener("keydown", this.handleKeyDown, true);
      this.listenerAttached = false;
    }
    this.registrations.clear();
    this.activeScopes = /* @__PURE__ */ new Set(["global"]);
    this._sequenceTracker.reset();
    this._sortedCache = null;
  }
  debugLog(event, entry) {
    if (!this.debug) return;
    console.log(
      `[ShortcutManager] Triggered "${entry.id}" (${entry.keys}) — scope: ${entry.scope ?? "global"}, priority: ${entry.priority ?? 0}`,
      {
        key: event.key,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
        alt: event.altKey,
        shift: event.shiftKey
      }
    );
  }
};
_ShortcutManager.instance = null;
let ShortcutManager = _ShortcutManager;
export {
  ShortcutManager
};
