import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import default_1$1 from "../../node_modules/@mui/icons-material/CheckCircle.js";
import default_1 from "../../node_modules/@mui/icons-material/Info.js";
function BulkActionBar({
  showBulkActionBar,
  bulkActionBarProps,
  onSelectAllRows,
  onClearSelection
}) {
  return /* @__PURE__ */ jsx(Fragment, { children: showBulkActionBar && /* @__PURE__ */ jsxs("div", { className: "ia-bulk-action-bar", children: [
    /* @__PURE__ */ jsx("span", { className: "icon", children: (bulkActionBarProps == null ? void 0 : bulkActionBarProps.enableSelectAll) ? /* @__PURE__ */ jsx(default_1, {}) : /* @__PURE__ */ jsx(default_1$1, {}) }),
    /* @__PURE__ */ jsx("span", { className: "ia-bulk-action-bar-text", children: bulkActionBarProps == null ? void 0 : bulkActionBarProps.actionBarLabel }),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "ia-bulk-action-bar-select-text",
        onClick: () => {
          if (bulkActionBarProps == null ? void 0 : bulkActionBarProps.enableSelectAll) {
            onSelectAllRows == null ? void 0 : onSelectAllRows();
          } else {
            onClearSelection == null ? void 0 : onClearSelection();
          }
        },
        children: (bulkActionBarProps == null ? void 0 : bulkActionBarProps.enableSelectAll) ? `Select all ${bulkActionBarProps.totalRowCount} rows across all pages` : "Clear selection"
      }
    )
  ] }) });
}
export {
  BulkActionBar as default
};
