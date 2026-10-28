const MODIFIER_KEYS = /* @__PURE__ */ new Set(["Control", "Alt", "Shift", "Meta"]);
const INPUT_ELEMENTS = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
const KEY_ALIASES = {
  esc: "escape",
  escape: "escape",
  space: " ",
  spacebar: " ",
  enter: "enter",
  return: "enter",
  tab: "tab",
  backspace: "backspace",
  delete: "delete",
  del: "delete",
  ins: "insert",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
  arrowup: "arrowup",
  arrowdown: "arrowdown",
  arrowleft: "arrowleft",
  arrowright: "arrowright",
  home: "home",
  end: "end",
  pageup: "pageup",
  pagedown: "pagedown",
  plus: "+",
  minus: "-"
};
const BROWSER_SHORTCUT_BLACKLIST = /* @__PURE__ */ new Set([
  "mod+r",
  "mod+w",
  "mod+t",
  "mod+n",
  "mod+q",
  "mod+l",
  "mod+d",
  "mod+shift+t",
  "ctrl+r",
  "ctrl+w",
  "ctrl+t",
  "ctrl+n",
  "ctrl+q",
  "ctrl+l",
  "ctrl+d",
  "ctrl+shift+t",
  "f5",
  "f11",
  "f12"
]);
const DEFAULT_SEQUENCE_TIMEOUT = 1e3;
export {
  BROWSER_SHORTCUT_BLACKLIST,
  DEFAULT_SEQUENCE_TIMEOUT,
  INPUT_ELEMENTS,
  KEY_ALIASES,
  MODIFIER_KEYS
};
