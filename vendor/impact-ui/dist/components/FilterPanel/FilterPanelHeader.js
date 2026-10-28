import { jsxs, jsx } from "react/jsx-runtime";
import default_1 from "../../node_modules/@mui/icons-material/Close.js";
import { Button } from "../Button/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function FilterPanelHeader({ title, toggleDrawer }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_header", children: [
    /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_left_header", children: [
      /* @__PURE__ */ jsx("span", { className: "impact_drawer_filter_left_heading_icon" }),
      /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_left_heading", children: title })
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        "aria-label": t("common.close"),
        icon: /* @__PURE__ */ jsx(default_1, {}),
        variant: "text",
        onClick: toggleDrawer
      }
    )
  ] });
}
FilterPanelHeader.displayName = "FilterPanelHeader";
export {
  FilterPanelHeader
};
