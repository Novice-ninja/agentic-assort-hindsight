import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ExpandLess.js";
import { Button } from "../Button/index.js";
import { Menu } from "../Menu/index.js";
function TablePagination({
  actualRef,
  localPageSize,
  setLocalPageSize,
  paginationPageSizeSelector
}) {
  const [paginationOptionsAnchorEl, setPaginationOptionsAnchorEl] = useState(null);
  const paginationOptionsOpen = Boolean(paginationOptionsAnchorEl);
  const handlePageSizeClick = (e) => {
    setPaginationOptionsAnchorEl(e.currentTarget);
  };
  const onPageSizeChange = (val) => {
    var _a, _b;
    setLocalPageSize(val);
    (_b = (_a = actualRef == null ? void 0 : actualRef.current) == null ? void 0 : _a.api) == null ? void 0 : _b.setGridOption("paginationPageSize", val);
    setPaginationOptionsAnchorEl(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "pagination-container", children: [
    /* @__PURE__ */ jsx("div", { className: "select-button-container", children: /* @__PURE__ */ jsx(
      Button,
      {
        "data-collapsed": !paginationOptionsOpen,
        "data-type": "pagination-btn",
        icon: /* @__PURE__ */ jsx(default_1, {}),
        iconPlacement: "right",
        label: `${localPageSize} per page`,
        variant: "secondary",
        onClick: handlePageSizeClick,
        children: /* @__PURE__ */ jsx("span", { className: "ia-pageSize", children: `${localPageSize} per page` })
      }
    ) }),
    /* @__PURE__ */ jsx(
      Menu,
      {
        anchorEl: paginationOptionsAnchorEl,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        },
        open: paginationOptionsOpen,
        options: paginationPageSizeSelector.map((opt) => ({
          label: `${opt} per page`,
          onClick: () => {
            onPageSizeChange(opt);
          },
          value: opt
        })),
        selected: localPageSize,
        transformOrigin: {
          vertical: "bottom",
          horizontal: "center"
        },
        onClose: () => {
          setPaginationOptionsAnchorEl(null);
        }
      }
    )
  ] });
}
export {
  TablePagination as default
};
