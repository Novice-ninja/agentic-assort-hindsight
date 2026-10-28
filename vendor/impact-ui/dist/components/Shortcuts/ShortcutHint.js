import { jsx } from "react/jsx-runtime";
import { formatShortcutDisplay } from "../../utils/shortcuts/format.js";
const defaultStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "12px",
  lineHeight: "16px",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontWeight: 500,
  color: "var(--shortcut-hint-color, #6b7280)",
  backgroundColor: "var(--shortcut-hint-bg, #f3f4f6)",
  border: "1px solid var(--shortcut-hint-border, #e5e7eb)",
  whiteSpace: "nowrap",
  userSelect: "none"
};
function ShortcutHint({ keys, style, className }) {
  const display = formatShortcutDisplay(keys);
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      "aria-label": `Keyboard shortcut: ${display}`,
      className,
      style: { ...defaultStyle, ...style },
      children: display
    }
  );
}
export {
  ShortcutHint
};
