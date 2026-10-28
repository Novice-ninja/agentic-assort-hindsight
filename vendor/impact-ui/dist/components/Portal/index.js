import { jsx } from "react/jsx-runtime";
import { createPortal } from "react-dom";
function Portal({
  children,
  container,
  className,
  style,
  id,
  "data-testid": dataTestId
}) {
  if (!container) return null;
  const content = className != null || style != null || dataTestId != null || id != null ? /* @__PURE__ */ jsx("div", { className, "data-testid": dataTestId, id, style, children }) : children;
  return createPortal(content, container);
}
Portal.displayName = "Portal";
export {
  Portal
};
