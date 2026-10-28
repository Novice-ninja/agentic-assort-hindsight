import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ErrorOutline.js";
import { Tooltip } from "../Tooltip/index.js";
function SidebarItems({
  item,
  active,
  setActive
}) {
  const textRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    const checkEllipsis = () => {
      if (textRef.current) {
        const isEllipsis = textRef.current.scrollWidth > textRef.current.clientWidth;
        setShowTooltip(isEllipsis);
      }
    };
    checkEllipsis();
    window.addEventListener("resize", checkEllipsis);
    return () => {
      window.removeEventListener("resize", checkEllipsis);
    };
  }, [item.title]);
  if (item.type === "separator") {
    return /* @__PURE__ */ jsx("div", { className: "impact-drawer-filter-separator" });
  }
  const tabContent = /* @__PURE__ */ jsxs(
    "div",
    {
      className: `impact_drawer_filter_tab ${active == item.value ? "filter_tab_active" : ""} ${item.disabled ? "filter_tab_disabled" : ""}`,
      role: "button",
      tabIndex: item.disabled ? -1 : 0,
      onClick: () => {
        if (!item.disabled) setActive(item.value);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (!item.disabled) setActive(item.value);
        }
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_tab_content", children: [
          /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_tab_icon", children: item.icon }),
          /* @__PURE__ */ jsxs("div", { className: "impact_drawer_filter_tab_label", children: [
            /* @__PURE__ */ jsx("span", { ref: textRef, children: item.title }),
            item.required && /* @__PURE__ */ jsx("span", { className: "impact_drawer_filter_tab_label-required", children: "*" })
          ] })
        ] }),
        item.error ? /* @__PURE__ */ jsx(default_1, { color: "error", fontSize: "small" }) : typeof item.numberOfFilter === "number" && /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_tab_badges", children: item.numberOfFilter })
      ]
    }
  );
  return showTooltip ? /* @__PURE__ */ jsx(Tooltip, { orientation: "left", title: item.title, variant: "tertiary", children: tabContent }) : tabContent;
}
function PanelSidebar({ filters, active, setActive }) {
  return /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_container_left_panel", children: /* @__PURE__ */ jsx("div", { className: "impact_drawer_filter_left_filters_tabs", children: filters.map((item, index) => /* @__PURE__ */ jsx(SidebarItems, { active, item, setActive }, index)) }) });
}
PanelSidebar.displayName = "PanelSidebar";
export {
  PanelSidebar
};
