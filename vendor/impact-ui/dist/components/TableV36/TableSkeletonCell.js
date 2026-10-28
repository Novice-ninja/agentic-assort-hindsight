import { jsx } from "react/jsx-runtime";
import { memo, useMemo } from "react";
const FALLBACK_WIDTH_STYLE = { width: "85%" };
const getSkeletonBarWidth = (rowIndex) => {
  if (rowIndex == null) return "85%";
  return `${75 + 25 * (rowIndex % 2 === 0 ? Math.sin(rowIndex) : Math.cos(rowIndex))}%`;
};
const createInfiniteSkeletonCellRendererSelector = (consumerSelector) => {
  return (params) => {
    if (params.data == null) {
      return { component: TableSkeletonCell };
    }
    return typeof consumerSelector === "function" ? consumerSelector(params) : void 0;
  };
};
const TableSkeletonCell = memo((params) => {
  var _a;
  const rowIndex = (_a = params.node) == null ? void 0 : _a.rowIndex;
  const width = getSkeletonBarWidth(rowIndex);
  const style = useMemo(
    () => width === "85%" ? FALLBACK_WIDTH_STYLE : { width },
    [width]
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-label": "Row data is loading",
      className: "ag-skeleton-container",
      role: "status",
      children: /* @__PURE__ */ jsx("div", { className: "ag-skeleton-effect", style })
    }
  );
});
TableSkeletonCell.displayName = "TableSkeletonCell";
export {
  createInfiniteSkeletonCellRendererSelector,
  getSkeletonBarWidth
};
