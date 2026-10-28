!function(){"use strict";try{if("undefined"!=typeof document){var o=document.createElement("style");o.appendChild(document.createTextNode(".impact_accordion_main_container{background:#eceefd;display:flex;flex-direction:column;flex-wrap:wrap;gap:0;gap:12px;width:100%}.impact_accordion_main_container .Mui-expanded{margin:0!important}.impact_accordion_main_container .accordion_main_container{border-bottom:1px solid #d4d4d4;border-radius:8px;box-shadow:none!important}.impact_accordion_main_container .accordion_main_container:before{opacity:0!important}.impact_accordion_main_container .accordion_main_container .accordion_header{display:flex!important;flex-direction:row-reverse;flex-grow:0!important;font-size:16px;gap:12px;height:48px;justify-content:flex-end!important;margin:0 16px!important;padding:0!important}.impact_accordion_main_container .accordion_main_container .accordion_header .MuiAccordionSummary-content{color:#0d152c;flex-grow:0!important;justify-content:flex-end}.impact_accordion_main_container .accordion_main_container .accordion_header .css-yw020d-MuiAccordionSummary-expandIconWrapper{align-items:center;background:#f5f6fa;border-radius:8px;height:32px;justify-content:center;transform:rotate(-90deg);width:32px}.impact_accordion_main_container .accordion_main_container .accordion_header .css-yw020d-MuiAccordionSummary-expandIconWrapper.Mui-expanded{transform:rotate(-180deg)}.impact_accordion_main_container .accordion_main_container .accordion_header.Mui-expanded{margin:0 16px!important;min-height:48px!important}.impact_accordion_main_container .accordion_main_container .accordion_body{color:#0d152c;padding:12px 16px!important}.impact_accordion_main_container .css-1elwnq4-MuiPaper-root-MuiAccordion-root.Mui-disabled{background-color:#fff}.impact_accordion_main_container .css-1elwnq4-MuiPaper-root-MuiAccordion-root.Mui-disabled .css-yw020d-MuiAccordionSummary-expandIconWrapper{background-color:#f8f9fb}.impact_accordion_main_container .css-1elwnq4-MuiPaper-root-MuiAccordion-root.Mui-disabled .MuiAccordionSummary-content,.impact_accordion_main_container .css-1elwnq4-MuiPaper-root-MuiAccordion-root.Mui-disabled .accordion_body{color:#b4bac7}.impact_accordion_main_container_single .accordion_main_container:last-child{border-radius:8px}.Mui-expanded.accordion_main_container{border:1px solid #eff2fa!important}.Mui-expanded.MuiAccordionSummary-content{font-weight:500}.accordion_main_container:focus{box-shadow:-3px 3px #eceefd,1px -1px 0 2px #eceefd!important}.impact_accordion_main_container .css-1086bdv-MuiPaper-root-MuiAccordion-root.Mui-expanded{margin:0!important}.accordions_white .impact_accordion_main_container{background:#fff}.impact_accordion_main_container .accordion_main_container{border:1px solid #eff2fa}.accordion_header .Mui-expanded{font-weight:600}")),document.head.appendChild(o)}}catch(n){console.error("vite-plugin-css-injected-by-js",n)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ExpandMore.js";

import Accordion$1 from "../../node_modules/@mui/material/Accordion/Accordion.js";
import AccordionSummary from "../../node_modules/@mui/material/AccordionSummary/AccordionSummary.js";
import AccordionDetails from "../../node_modules/@mui/material/AccordionDetails/AccordionDetails.js";
const Accordion = forwardRef(
  ({
    expanded,
    setExpanded,
    isMultiExpanded = false,
    data = [],
    onChange,
    isSingleItem = false,
    singleData,
    disabled = false,
    className = "",
    id,
    "data-testid": dataTestId,
    ...args
  }, ref) => {
    const handleSingleAccordionChange = useCallback(
      (value) => {
        if (onChange) {
          onChange(value);
          return;
        }
        if (setExpanded) {
          setExpanded(value);
        }
      },
      [onChange, setExpanded]
    );
    const handleMultiAccordionChange = useCallback(
      (value) => {
        if (onChange) {
          onChange(value);
          return;
        }
        if (!setExpanded) return;
        if (isMultiExpanded && Array.isArray(expanded)) {
          if (!expanded.includes(value)) {
            setExpanded([...expanded, value]);
          } else {
            setExpanded(expanded.filter((item) => item !== value));
          }
        } else if (expanded === value) {
          setExpanded("");
        } else {
          setExpanded(value);
        }
      },
      [onChange, setExpanded, isMultiExpanded, expanded]
    );
    if (isSingleItem && singleData) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          ref,
          className: `impact_accordion_main_container impact_accordion_main_container_single ${className}`.trim(),
          "data-testid": dataTestId,
          id,
          children: /* @__PURE__ */ jsxs(
            Accordion$1,
            {
              className: "accordion_main_container",
              defaultExpanded: expanded === singleData.value,
              disabled,
              onChange: () => {
                handleSingleAccordionChange(singleData.value);
              },
              ...args,
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    "aria-controls": `${singleData.value}-content`,
                    className: "accordion_header",
                    expandIcon: /* @__PURE__ */ jsx(default_1, {}),
                    id: `${singleData.value}-header`,
                    children: singleData.header
                  }
                ),
                /* @__PURE__ */ jsx(AccordionDetails, { className: "accordion_body", children: singleData.content })
              ]
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `impact_accordion_main_container ${className}`.trim(),
        "data-testid": dataTestId,
        id,
        children: data.map((item, index) => {
          const isExpanded = isMultiExpanded ? Array.isArray(expanded) && expanded.includes(item.value) : expanded === item.value;
          return /* @__PURE__ */ jsxs(
            Accordion$1,
            {
              className: "accordion_main_container",
              defaultExpanded: isExpanded,
              disabled: disabled || item.disabled,
              expanded: isExpanded,
              onChange: () => {
                handleMultiAccordionChange(item.value);
              },
              ...args,
              children: [
                /* @__PURE__ */ jsx(
                  AccordionSummary,
                  {
                    "aria-controls": `${item.value}-content`,
                    className: "accordion_header",
                    expandIcon: /* @__PURE__ */ jsx(default_1, {}),
                    id: `${item.value}-header`,
                    children: item.header
                  }
                ),
                /* @__PURE__ */ jsx(AccordionDetails, { className: "accordion_body", children: item.content })
              ]
            },
            item.value || index
          );
        })
      }
    );
  }
);
Accordion.displayName = "Accordion";
export {
  Accordion
};
