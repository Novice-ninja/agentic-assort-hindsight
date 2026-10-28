import { KEY_ALIASES } from "./constants.js";
function normalizeKey(key) {
  const lower = key.toLowerCase();
  return KEY_ALIASES[lower] ?? lower;
}
function normalizedPhysicalKey(code) {
  if (!code) return null;
  if (code.startsWith("Key") && code.length === 4) {
    return code.slice(3).toLowerCase();
  }
  if (code.startsWith("Digit")) {
    return code.slice(5);
  }
  const physicalMap = {
    Space: " ",
    Minus: "-",
    Equal: "=",
    Backquote: "`",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
    IntlBackslash: "\\",
    NumpadDecimal: ".",
    NumpadDivide: "/",
    NumpadMultiply: "*",
    NumpadSubtract: "-",
    NumpadAdd: "+",
    NumpadEnter: "enter",
    ArrowUp: "arrowup",
    ArrowDown: "arrowdown",
    ArrowLeft: "arrowleft",
    ArrowRight: "arrowright",
    Enter: "enter",
    Escape: "escape",
    Tab: "tab",
    Backspace: "backspace",
    Delete: "delete",
    Insert: "insert",
    Home: "home",
    End: "end",
    PageUp: "pageup",
    PageDown: "pagedown"
  };
  if (physicalMap[code]) return physicalMap[code];
  if (code.startsWith("Numpad") && code.length === 7) {
    const ch = code.slice(6);
    if (/^\d$/.test(ch)) return ch;
  }
  return null;
}
function getActiveModifiers(event) {
  const mods = /* @__PURE__ */ new Set();
  if (event.ctrlKey) mods.add("ctrl");
  if (event.metaKey) mods.add("meta");
  if (event.altKey) mods.add("alt");
  if (event.shiftKey) mods.add("shift");
  return mods;
}
function matchShortcut(event, combo) {
  const pressed = getActiveModifiers(event);
  if (pressed.size !== combo.modifiers.size) return false;
  for (const mod of combo.modifiers) {
    if (!pressed.has(mod)) return false;
  }
  const fromKey = normalizeKey(event.key);
  if (fromKey === combo.key) return true;
  const fromCode = normalizedPhysicalKey(event.code);
  return fromCode !== null && fromCode === combo.key;
}
export {
  matchShortcut,
  normalizeKey,
  normalizedPhysicalKey
};
