!function(){"use strict";try{if("undefined"!=typeof document){var a=document.createElement("style");a.appendChild(document.createTextNode(".ia-styles.ia-card{background-color:#fff;border:1px solid #fff;border-radius:8px}.ia-styles.ia-card:hover{border-color:#d9dde7}.ia-styles.ia-card.ia-card-extraSmall{box-shadow:0 0 4px #0000001f}.ia-styles.ia-card.ia-card-small{box-shadow:0 8px 10px #0000000f}.ia-styles.ia-card.ia-card-medium{box-shadow:0 16px 18px #0000000f}.ia-styles.ia-card.ia-card-large{box-shadow:0 24px 26px #0000000f}.ia-styles.ia-card.ia-card-extraLarge{box-shadow:0 32px 36px #0000000f}.ia-styles.ia-card.ia-card-extraLarge-3x{box-shadow:0 64px 64px #0000000f}")),document.head.appendChild(a)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";

import Card$1 from "../../node_modules/@mui/material/Card/Card.js";
const Card = forwardRef(
  ({
    children,
    size = "medium",
    padding = "20px",
    width = "100%",
    maxWidth = 500,
    minHeight = 300,
    clickable = false,
    className = "",
    onClick,
    "aria-label": ariaLabel,
    sx,
    ...args
  }, ref) => {
    const classStr = useMemo(() => {
      let retVal = `ia-styles ia-card ia-card-${size} ${className}`;
      if (clickable) {
        retVal += " ia-card-clickable";
      }
      return retVal.trim();
    }, [size, className, clickable]);
    const handleClick = (event) => {
      if (onClick) {
        onClick(event);
      }
    };
    const handleKeyDown = (event) => {
      if (clickable && onClick && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onClick(event);
      }
    };
    return /* @__PURE__ */ jsx(
      Card$1,
      {
        ref,
        "aria-label": ariaLabel,
        className: classStr,
        role: clickable ? "button" : void 0,
        tabIndex: clickable ? 0 : void 0,
        onClick: clickable ? handleClick : void 0,
        onKeyDown: clickable ? handleKeyDown : void 0,
        ...args,
        sx: {
          padding,
          width,
          maxWidth,
          minHeight,
          cursor: clickable ? "pointer" : "default",
          ...sx
        },
        children
      }
    );
  }
);
Card.displayName = "Card";
export {
  Card
};
