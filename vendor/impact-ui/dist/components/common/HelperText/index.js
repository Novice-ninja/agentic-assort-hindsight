!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".MuiFormHelperText-root{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-icon.svg) no-repeat;background-position:0;color:#7a8294!important;font-family:Manrope,sans-serif!important;margin-left:0!important;overflow:hidden;padding-left:14px;text-overflow:ellipsis;white-space:nowrap}.MuiFormHelperText-root.Mui-error{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/info-red.svg) no-repeat;background-position:0;color:#e15554!important}")),document.head.appendChild(o)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}}();
import { jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { Tooltip } from "../../Tooltip/index.js";

import FormHelperText from "../../../node_modules/@mui/material/FormHelperText/FormHelperText.js";
function HelperText({
  helper,
  error = false,
  className = "",
  minWidth,
  id,
  "data-testid": dataTestId
}) {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [helper]);
  if (helper == null || helper === "") return null;
  const textElement = /* @__PURE__ */ jsx(
    FormHelperText,
    {
      ref: textRef,
      className: `ia-select-helper-text ${className} ${error ? "Mui-error" : ""}`.trim(),
      "data-testid": dataTestId,
      error,
      id,
      style: { width: minWidth ?? "240px" },
      children: helper
    }
  );
  if (isTruncated) {
    return /* @__PURE__ */ jsx(Tooltip, { orientation: "right", title: helper, variant: "tertiary", children: textElement });
  }
  return textElement;
}
HelperText.displayName = "HelperText";
export {
  HelperText
};
