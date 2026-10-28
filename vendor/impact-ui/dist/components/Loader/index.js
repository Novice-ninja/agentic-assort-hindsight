!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".ia-styles.ia-loader-container{align-items:center;display:flex;flex-direction:column;position:relative;z-index:99999}.ia-styles.ia-loader-container .ia-loader-outer{border-radius:50%;position:relative}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.ia-styles.ia-loader-container .ia-loader-outer{animation:spin 1s linear infinite}.ia-styles.ia-loader-container .ia-loader-outer .ia-loader-inner{align-items:center;animation:spin 1s linear infinite;animation-direction:reverse;background-color:#fff;border-radius:50%;display:flex;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;justify-content:center;line-height:16.39px;position:absolute;text-align:center}.ia-styles.ia-loader-container .ia-loader-outer.ia-loader-small{height:24px;width:24px}.ia-styles.ia-loader-container .ia-loader-outer.ia-loader-small .ia-loader-inner{height:20px;left:2px;top:2px;width:20px}.ia-styles.ia-loader-container .ia-loader-outer.ia-loader-medium{height:48px;width:48px}.ia-styles.ia-loader-container .ia-loader-outer.ia-loader-medium .ia-loader-inner{height:40px;left:4px;top:4px;width:40px}.ia-styles.ia-loader-container .ia-loader-outer.ia-loader-large{height:72px;width:72px}.ia-styles.ia-loader-container .ia-loader-outer.ia-loader-large .ia-loader-inner{height:60px;left:6px;top:6px;width:60px}.ia-styles.ia-loader-container .ia-loader-outer{background:conic-gradient(from 180deg at 50% 50%,#4259ee00,#4259ee 1turn)}.ia-styles.ia-loader-container .ia-loaderText{font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:16.39px;margin-top:4px;text-align:left}")),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { Skeleton } from "../Skeleton/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Box from "../../node_modules/@mui/material/Box/Box.js";
function getSkeletonDimensions(size) {
  switch (size) {
    case "small":
      return { circular: 20, rectangularWidth: 200, rectangularHeight: 10 };
    case "medium":
      return { circular: 25, rectangularWidth: 250, rectangularHeight: 12 };
    case "large":
    default:
      return { circular: 30, rectangularWidth: 268, rectangularHeight: 12 };
  }
}
function Loader({
  size = "large",
  progress = "",
  showSkeleton = false,
  text,
  className,
  id,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
  role = "status",
  boxProps,
  skeletonProps
}) {
  const { t } = useTranslation();
  const loaderText = text ?? t("common.loading");
  const resolvedAriaLabel = ariaLabel ?? t("loader.ariaLabel");
  const skeletonDimensions = useMemo(() => getSkeletonDimensions(size), [size]);
  if (showSkeleton) {
    return /* @__PURE__ */ jsxs(
      Box,
      {
        alignItems: "center",
        "aria-label": resolvedAriaLabel,
        className,
        "data-testid": dataTestId,
        display: "flex",
        id,
        role,
        ...boxProps,
        children: [
          /* @__PURE__ */ jsx(
            Skeleton,
            {
              borderRadius: 4,
              height: skeletonDimensions.circular,
              variant: "rectangular",
              width: skeletonDimensions.circular,
              ...skeletonProps
            }
          ),
          /* @__PURE__ */ jsxs(Box, { display: "flex", flexDirection: "column", justifyContent: "space-between", ml: 2, children: [
            /* @__PURE__ */ jsx(
              Skeleton,
              {
                borderRadius: 4,
                height: skeletonDimensions.rectangularHeight,
                style: { marginBottom: 4 },
                variant: "rectangular",
                width: skeletonDimensions.rectangularWidth,
                ...skeletonProps
              }
            ),
            /* @__PURE__ */ jsx(
              Skeleton,
              {
                borderRadius: 4,
                height: skeletonDimensions.rectangularHeight,
                variant: "rectangular",
                width: skeletonDimensions.rectangularWidth,
                ...skeletonProps
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-label": resolvedAriaLabel,
      className: `ia-styles ia-loader-container ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      role,
      children: [
        /* @__PURE__ */ jsx("div", { className: `ia-styles ia-loader-outer ia-loader-${size}`, children: /* @__PURE__ */ jsx("div", { className: "ia-loader ia-loader-inner", children: size !== "small" && progress }) }),
        (progress || loaderText) && /* @__PURE__ */ jsx("div", { className: "ia-loaderText", children: loaderText })
      ]
    }
  );
}
Loader.displayName = "Loader";
export {
  Loader
};
