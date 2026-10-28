import { KEY_ALIASES } from "./constants.js";
import { isMac } from "./platform.js";
const MODIFIER_SET = /* @__PURE__ */ new Set(["ctrl", "meta", "alt", "shift", "mod"]);
function resolveModifier(mod) {
  if (mod === "mod") return isMac ? "meta" : "ctrl";
  return mod;
}
function canonicalModifierToken(token) {
  if (token === "control") return "ctrl";
  if (token === "cmd" || token === "command") return "meta";
  if (token === "option") return "alt";
  if (MODIFIER_SET.has(token)) return token;
  return null;
}
function parseCombo(comboStr) {
  const parts = comboStr.toLowerCase().split("+").map((p) => p.trim()).filter(Boolean);
  const modifiers = /* @__PURE__ */ new Set();
  let key = "";
  for (const part of parts) {
    const modToken = canonicalModifierToken(part);
    if (modToken !== null) {
      modifiers.add(resolveModifier(modToken));
    } else {
      key = KEY_ALIASES[part] ?? part;
    }
  }
  return { modifiers, key };
}
function parseShortcutString(shortcutStr) {
  const trimmed = shortcutStr.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { isSequence: false, combos: [parseCombo(parts[0] ?? "")] };
  }
  return {
    isSequence: true,
    combos: parts.map(parseCombo)
  };
}
function normalizeShortcutString(shortcutStr) {
  const parsed = parseShortcutString(shortcutStr);
  return parsed.combos.map((combo) => {
    const mods = [...combo.modifiers].sort();
    return mods.length > 0 ? [...mods, combo.key].join("+") : combo.key;
  }).join(" ");
}
export {
  normalizeShortcutString,
  parseShortcutString
};
