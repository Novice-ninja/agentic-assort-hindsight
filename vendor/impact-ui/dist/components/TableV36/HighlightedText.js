import { jsx, Fragment } from "react/jsx-runtime";
import { memo } from "react";
import { getSearchHighlightSegments } from "./tableUtils.js";
const HighlightedText = memo(function HighlightedText2({
  text,
  searchText,
  className
}) {
  const segments = getSearchHighlightSegments(text, searchText);
  const hasMatch = segments.some((segment) => segment.isMatch);
  if (!hasMatch) {
    return className ? /* @__PURE__ */ jsx("span", { className, children: text }) : /* @__PURE__ */ jsx(Fragment, { children: text });
  }
  return /* @__PURE__ */ jsx("span", { className, children: segments.map(
    (segment, index) => segment.isMatch ? /* @__PURE__ */ jsx("mark", { className: "ia-search-highlight", children: segment.text }, index) : /* @__PURE__ */ jsx("span", { children: segment.text }, index)
  ) });
});
export {
  HighlightedText as default
};
