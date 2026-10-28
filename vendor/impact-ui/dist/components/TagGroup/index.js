!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".tag-group-container{align-items:center;display:flex;gap:16px}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx } from "react/jsx-runtime";

function TagGroup({
  children,
  className,
  style,
  id,
  "data-testid": dataTestId,
  role = "group"
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `tag-group-container ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      role,
      style,
      children
    }
  );
}
TagGroup.displayName = "TagGroup";
export {
  TagGroup
};
