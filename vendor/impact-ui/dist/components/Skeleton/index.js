!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".ia-skeleton{box-sizing:border-box;display:block;flex-shrink:0}.ia-skeleton--rectangular{border-radius:4px}.ia-skeleton--rounded{border-radius:8px}.ia-skeleton--circular{border-radius:50%}.ia-skeleton--text{height:12px}.ia-skeleton--pill,.ia-skeleton--text{border-radius:999px}.ia-skeleton__group{display:flex;flex-direction:column;gap:8px;width:100%}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx } from "react/jsx-runtime";

const VARIANT_CLASS = {
  rectangular: "ia-skeleton--rectangular",
  rounded: "ia-skeleton--rounded",
  circular: "ia-skeleton--circular",
  text: "ia-skeleton--text",
  pill: "ia-skeleton--pill"
};
const SHIMMER_DIRECTIONS = ["ltr", "rtl", "btt", "ttb", "circular"];
const toCssSize = (value) => {
  if (value === void 0 || value === null || value === "") return void 0;
  return typeof value === "number" ? `${value}px` : value;
};
const getShimmerClass = (direction = "ltr") => {
  const normalized = SHIMMER_DIRECTIONS.includes(direction) ? direction : "ltr";
  return `ia-shimmer ia-shimmer--${normalized}`;
};
function Skeleton({
  variant = "rectangular",
  width,
  height,
  borderRadius,
  direction = "ltr",
  count = 1,
  className = "",
  style = {},
  id,
  "data-testid": dataTestId,
  ...rest
}) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.rectangular;
  const shimmerClass = getShimmerClass(direction);
  const itemStyle = {
    width: toCssSize(width),
    height: toCssSize(height),
    ...borderRadius !== void 0 && borderRadius !== null ? { borderRadius: toCssSize(borderRadius) } : {},
    ...style
  };
  if (variant === "circular") {
    const size = itemStyle.width || itemStyle.height || "40px";
    itemStyle.width = itemStyle.width || size;
    itemStyle.height = itemStyle.height || size;
  }
  if (variant === "text" && !itemStyle.height) {
    itemStyle.height = "12px";
  }
  if (!itemStyle.width && variant !== "circular") {
    itemStyle.width = "100%";
  }
  if (!itemStyle.height && variant !== "circular" && variant !== "text") {
    itemStyle.height = "16px";
  }
  const safeCount = Math.max(1, count);
  const items = Array.from({ length: safeCount }, (_, index) => {
    const isLast = index === safeCount - 1;
    const lineStyle = safeCount > 1 && variant === "text" && isLast ? {
      ...itemStyle,
      width: itemStyle.width === "100%" ? "70%" : itemStyle.width
    } : itemStyle;
    return /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: `ia-skeleton ${variantClass} ${shimmerClass} ${className}`.trim(),
        "data-testid": dataTestId,
        id: safeCount === 1 ? id : void 0,
        style: lineStyle,
        ...rest
      },
      `ia-skeleton-${index}`
    );
  });
  if (safeCount > 1) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "aria-busy": "true",
        "aria-live": "polite",
        className: "ia-skeleton__group",
        "data-testid": dataTestId,
        id,
        children: items
      }
    );
  }
  return items[0] ?? null;
}
Skeleton.displayName = "Skeleton";
export {
  Skeleton,
  getShimmerClass
};
