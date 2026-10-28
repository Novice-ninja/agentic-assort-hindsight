!function(){"use strict";try{if("undefined"!=typeof document){var a=document.createElement("style");a.appendChild(document.createTextNode(".ia-styles.ia-avatar{background-color:#3bb273;border-radius:12px;color:#fff;font-family:Manrope,sans-serif;font-weight:800}.ia-styles.ia-avatar.ia-avatar-small{font-size:12px;height:36px;width:36px}.ia-styles.ia-avatar.ia-avatar-medium{font-size:16px;height:48px;width:48px}.ia-styles.ia-avatar.ia-avatar-large{font-size:20px;height:64px;width:64px}")),document.head.appendChild(a)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";

import Avatar$1 from "../../node_modules/@mui/material/Avatar/Avatar.js";
const Avatar = forwardRef(
  ({
    label = "Unknown",
    type = "withoutPicture",
    src,
    size = "large",
    alt,
    className = "",
    ...args
  }, ref) => {
    const safeLabel = label ?? "Unknown";
    const initials = useMemo(() => {
      if (type === "withPicture") {
        return "";
      }
      return safeLabel.trim().split(" ").filter((word) => word).map((word) => {
        var _a;
        return ((_a = word[0]) == null ? void 0 : _a.toUpperCase()) ?? "";
      }).join("") || "";
    }, [safeLabel, type]);
    const displayInitials = useMemo(() => {
      const maxChars = type === "onlyName" ? 1 : 2;
      return initials.substring(0, maxChars);
    }, [initials, type]);
    const classStr = useMemo(() => {
      let retVal = `ia-styles ia-avatar ${className}`;
      switch (size) {
        case "small":
          retVal += " ia-avatar-small";
          break;
        case "medium":
          retVal += " ia-avatar-medium";
          break;
        case "large":
        default:
          retVal += " ia-avatar-large";
          break;
      }
      return retVal.trim();
    }, [size, className]);
    return /* @__PURE__ */ jsx(
      Avatar$1,
      {
        ref,
        alt: alt ?? safeLabel,
        className: classStr,
        src: type === "withPicture" ? src : void 0,
        ...args,
        children: displayInitials
      }
    );
  }
);
Avatar.displayName = "Avatar";
export {
  Avatar
};
