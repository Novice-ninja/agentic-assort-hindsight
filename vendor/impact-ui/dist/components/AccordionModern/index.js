!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.impact-accordion-modern-main-container{display:flex;flex-direction:column;gap:12px}.impact-modern-accordion-item{background-color:#fff;border:1px solid #eff2fa;border-radius:8px;display:flex;flex-direction:column;transition:border .2s ease}.impact-modern-accordion-item:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-modern-accordion-item:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-modern-accordion-item.Mui-disabled:focus-visible,.impact-modern-accordion-item.ia-btn-disabled:focus-visible,.impact-modern-accordion-item.ia-switch-disabled:focus-visible,.impact-modern-accordion-item.impact-select-disabled:focus-visible,.impact-modern-accordion-item.impact_input_disabled:focus-visible,.impact-modern-accordion-item.route-disabled:focus-visible,.impact-modern-accordion-item:disabled:focus-visible,.impact-modern-accordion-item[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.impact-modern-accordion-item .impact-modern-accordion-header{align-items:center;cursor:pointer;display:flex;flex-direction:row;gap:12px;height:48px;padding:8px 16px;width:100%}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-drag-icon{border-radius:8px}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-drag-icon svg{color:#60697d;height:20px;margin-top:2px;width:20px}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-expand-icon{align-items:center;background-color:#f5f6fa;border-radius:8px;display:flex;height:32px;justify-content:center;padding:8px;transition:transform .2s ease-in-out;width:32px}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-expand-icon:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-expand-icon:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-expand-icon:hover{cursor:pointer}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-expand-icon svg{fill:#60697d;height:20px;transition:transform .2s ease-in-out;width:20px}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-title{color:#0d152c;font-family:Manrope,sans-serif;font-size:14px;font-weight:600;line-height:21px;width:100%}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-title.child-count{align-items:center;display:flex;gap:12px}.impact-modern-accordion-item .impact-modern-accordion-header .impact-modern-accordion-title.disabled{color:#b4bac7}.impact-modern-accordion-item .impact-modern-accordion-content{box-sizing:border-box;color:#0d152c;font-family:Manrope,sans-serif!important;font-size:14px;font-weight:500;height:0;line-height:21px;opacity:0;overflow:hidden;padding:0 16px;transition:height .2s ease,padding .2s ease,opacity .2s ease;visibility:hidden}.impact-modern-accordion-item .expand-content{height:auto;opacity:1;padding:16px;visibility:visible}.impact-modern-accordion-container.disabled{cursor:not-allowed}.impact-modern-accordion-container.disabled .impact-modern-accordion-item .impact-modern-accordion-header{pointer-events:none}.impact-modern-accordion-container.disabled .impact-modern-accordion-item .impact-modern-accordion-drag-icon,.impact-modern-accordion-container.disabled .impact-modern-accordion-item .impact-modern-accordion-expand-icon{background-color:#f8f9fb}.expand-content-icon{transform:rotate(-90deg)}.expand-content-icon+.impact-modern-accordion-title{fill:#60697d;font-weight:800!important}.expand-content-icon+.impact-modern-accordion-title h3{font-weight:800}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowRight.js";
import { Badge } from "../Badge/index.js";
import { SortableAccordionList } from "./SortableAccordionComp.js";

function AccordionModern({
  draggable = false,
  expanded,
  setExpanded,
  isMultiExpanded = false,
  data = [],
  onChange,
  className = ""
}) {
  const handleMultiAccordionChange = useCallback(
    (value) => {
      if (onChange) {
        onChange(value);
      }
      if (isMultiExpanded) {
        const expandedItems = Array.isArray(expanded) ? expanded : [expanded];
        const nextExpandedItems = expandedItems.includes(value) ? expandedItems.filter((itemValue) => itemValue !== value) : [...expandedItems, value];
        setExpanded(nextExpandedItems);
        return;
      }
      setExpanded(expanded === value ? "" : value);
    },
    [expanded, isMultiExpanded, onChange, setExpanded]
  );
  const checkExpand = useCallback(
    (item) => {
      if (isMultiExpanded && Array.isArray(expanded) && expanded.includes(item.value)) {
        return "expand-content";
      }
      if (expanded === item.value) {
        return "expand-content";
      }
      return "";
    },
    [expanded, isMultiExpanded]
  );
  if (draggable && data.length > 0) {
    return /* @__PURE__ */ jsx(
      SortableAccordionList,
      {
        checkExpand,
        data,
        handleMultiAccordionChange
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: `impact-accordion-modern-main-container ${className}`.trim(), children: data.map((item) => /* @__PURE__ */ jsx(
    "div",
    {
      className: `impact-modern-accordion-container ${item.disabled ? "disabled" : ""}`,
      children: /* @__PURE__ */ jsxs("div", { className: "impact-modern-accordion-item", children: [
        /* @__PURE__ */ jsxs("div", { className: "impact-modern-accordion-header", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `impact-modern-accordion-expand-icon ${checkExpand(item)}-icon`,
              tabIndex: item.disabled ? -1 : 0,
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!item.disabled) handleMultiAccordionChange(item.value);
              },
              onKeyDown: (e) => {
                if (!item.disabled && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleMultiAccordionChange(item.value);
                }
              },
              children: /* @__PURE__ */ jsx(default_1, {})
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `impact-modern-accordion-title ${(item.childCount ?? 0) > 0 ? "child-count" : ""} ${item.disabled ? "disabled" : ""}`,
              children: [
                item.header,
                (item.childCount ?? 0) > 0 ? /* @__PURE__ */ jsx(Badge, { color: "info", label: String(item.childCount), variant: "stroke" }) : null
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: `impact-modern-accordion-content ${checkExpand(item)}`, children: item.content })
      ] })
    },
    item.value
  )) });
}
AccordionModern.displayName = "AccordionModern";
export {
  AccordionModern
};
