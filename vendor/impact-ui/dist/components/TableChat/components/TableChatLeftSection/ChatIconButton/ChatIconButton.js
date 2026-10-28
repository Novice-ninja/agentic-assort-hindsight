import { jsx } from "react/jsx-runtime";
import React__default from "react";
const ChatIconButton = ({
  icon,
  onClick,
  ariaLabel,
  className = "nav-icon-button",
  size = "small",
  disabled = false,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      "aria-label": ariaLabel,
      className,
      disabled,
      onClick,
      ...props,
      children: React__default.cloneElement(icon, { fontSize: size })
    }
  );
};
export {
  ChatIconButton
};
