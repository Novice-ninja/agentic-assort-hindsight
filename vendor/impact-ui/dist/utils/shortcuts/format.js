import { parseShortcutString } from "./parse.js";
import { isMac } from "./platform.js";
const MAC_SYMBOLS = {
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧"
};
const WIN_SYMBOLS = {
  meta: "Win",
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Shift"
};
const MODIFIER_ORDER = ["ctrl", "alt", "shift", "meta"];
const SPECIAL_KEY_DISPLAY = {
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  enter: "↵",
  escape: "Esc",
  backspace: "⌫",
  delete: "⌦",
  tab: "⇥",
  " ": "Space"
};
function formatKey(key) {
  if (SPECIAL_KEY_DISPLAY[key]) return SPECIAL_KEY_DISPLAY[key];
  if (key.length === 1) return key.toUpperCase();
  return key.charAt(0).toUpperCase() + key.slice(1);
}
function formatCombo(combo, symbols, separator) {
  const modParts = MODIFIER_ORDER.filter((m) => combo.modifiers.has(m)).map((m) => symbols[m]);
  const keyPart = formatKey(combo.key);
  return [...modParts, keyPart].join(separator);
}
function formatShortcutDisplay(keys, options = {}) {
  const symbols = isMac ? MAC_SYMBOLS : WIN_SYMBOLS;
  const separator = options.separator ?? (isMac ? "" : "+");
  const parsed = parseShortcutString(keys);
  return parsed.combos.map((combo) => formatCombo(combo, symbols, separator)).join(" then ");
}
export {
  formatShortcutDisplay
};
