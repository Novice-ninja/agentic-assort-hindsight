import { jsx } from "react/jsx-runtime";
import { memo, useRef, useState } from "react";
import HighlightedText from "./HighlightedText.js";
import { Tooltip } from "../Tooltip/index.js";
const AgGridHeaderGroup = memo((props) => {
  const { displayName, context } = props;
  const textRef = useRef(null);
  const [isOverflowText, setIsOverflowText] = useState(false);
  const searchText = context == null ? void 0 : context.columnSearchText;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: textRef,
      className: "ia-header-group-text",
      onMouseEnter: () => {
        var _a, _b, _c, _d;
        setIsOverflowText(
          ((_a = textRef.current) == null ? void 0 : _a.scrollWidth) > ((_b = textRef.current) == null ? void 0 : _b.clientWidth) || ((_c = textRef.current) == null ? void 0 : _c.scrollHeight) > ((_d = textRef.current) == null ? void 0 : _d.clientHeight) + 1
        );
      },
      children: /* @__PURE__ */ jsx(Tooltip, { orientation: "top", title: isOverflowText ? displayName : "", variant: "tertiary", children: searchText ? /* @__PURE__ */ jsx(HighlightedText, { searchText, text: displayName }) : /* @__PURE__ */ jsx("span", { children: displayName }) })
    }
  );
});
AgGridHeaderGroup.displayName = "AgGridHeaderGroup";
export {
  AgGridHeaderGroup,
  AgGridHeaderGroup as default
};
