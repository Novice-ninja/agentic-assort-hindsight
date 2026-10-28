!function(){"use strict";try{if("undefined"!=typeof document){var t=document.createElement("style");t.appendChild(document.createTextNode('.ia-styles.ia-tabContainer{font-family:Manrope,sans-serif}.ia-styles.ia-tabContainer .ia-styles.ia-tabList{background-color:#fff;border:1px solid #d9dde7;border-radius:8px}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .MuiTabs-indicator{background-color:#4259ee;border-radius:4px;display:none}.ia-styles.ia-tabContainer .ia-styles.ia-tabList.MuiTabs-root{min-height:27px}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab{flex-direction:row;font-weight:500;min-height:23px;padding:7px 24px!important}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root{color:#60697d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;position:relative;text-transform:capitalize}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root:focus-visible{border-radius:4px;outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:-3px}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root:focus:not(:focus-visible){outline:none}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root.Mui-disabled:focus-visible{outline:none}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root svg{height:16px;margin:auto 8px auto auto;width:16px}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root.Mui-selected{color:#4259ee;font-weight:600}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.MuiButtonBase-root.Mui-selected:after{background-color:#4259ee;border-radius:4px;bottom:0;content:"";height:2px;left:0;position:absolute;width:100%}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab:hover{color:#3649c6}.ia-styles.ia-tabContainer .ia-styles.ia-tabList .ia-tab.Mui-disabled{color:#b4bac7!important}.ia-styles.ia-tabContainer .ia-tabPanel{font-family:Manrope,sans-serif;padding:8px 0!important;transition:opacity .2s ease-in-out}.ia-styles.ia-tabContainer .ia-tabPanel.ia-tabPanel-hidden{display:none}.ia-styles.ia-tabContainer .ia-tabPanel .MuiBox-root{padding:0!important}.ia-styles.ia-tabContainer.ia-tabs-horizontal .ia-styles.ia-tabList{height:40px}.ia-styles.ia-tabContainer.ia-tabs-horizontal .MuiTabs-flexContainer{height:38px;overflow:auto;scrollbar-width:none}.ia-styles.ia-tabs-vertical{display:flex}.ia-styles.ia-tabs-vertical .ia-tab.MuiButtonBase-root{color:#60697d;font-size:14px;font-weight:500;height:64px;justify-content:flex-end;position:relative;text-transform:capitalize}.ia-styles.ia-tabs-vertical .ia-tab.MuiButtonBase-root:after{display:none}.ia-styles.ia-tabs-vertical .MuiBox-root{border-bottom:none}.ia-styles.ia-tabs-vertical .ia-tabPanel{padding:0 8px!important}.ia-styles.ia-tabs-vertical .ia-tab:hover{color:#3649c6}.ia-tabList-blueBg,.ia-tabList-blueBg:focus-within,.ia-tabList-blueBg:hover{border:none!important;box-shadow:none!important}')),document.head.appendChild(t)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, createElement } from "react";
import { CustomTabPanel } from "./TabPanel.js";

import Box from "../../node_modules/@mui/material/Box/Box.js";
import Tabs$1 from "../../node_modules/@mui/material/Tabs/Tabs.js";
import Tab from "../../node_modules/@mui/material/Tab/Tab.js";
function Tabs({
  tabPanels,
  tabNames,
  value,
  onChange,
  orientation = "horizontal",
  isDisabled,
  tabPanelStyle,
  remountOnTabChange = true,
  isBlueBg = false,
  className,
  style,
  "data-testid": dataTestId,
  ...args
}) {
  var _a;
  const tabClassName = useMemo(() => "ia-styles ia-tab", []);
  const containerClassName = useMemo(() => {
    let retVal = "ia-styles ia-tabContainer";
    if (orientation === "vertical") retVal += " ia-tabs-vertical";
    else retVal += " ia-tabs-horizontal";
    return retVal;
  }, [orientation]);
  const selectedValue = typeof value === "number" ? ((_a = tabNames[value]) == null ? void 0 : _a.value) ?? String(value) : String(value);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: className ? `${containerClassName} ${className}`.trim() : containerClassName,
      "data-testid": dataTestId,
      style,
      children: [
        /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(
          Tabs$1,
          {
            className: `ia-styles ia-tabList ${isBlueBg ? "ia-tabList-blueBg" : ""}`.trim(),
            orientation,
            value: selectedValue,
            onChange,
            ...args,
            children: tabNames.map((tab) => /* @__PURE__ */ createElement(
              Tab,
              {
                disableRipple: true,
                ...tab,
                key: tab.value,
                className: tab.value === selectedValue ? `${tabClassName} ia-activeTabHeader` : tabClassName,
                disabled: tab.disabled ?? isDisabled,
                tabIndex: 0,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange == null ? void 0 : onChange(e, tab.value);
                  }
                }
              }
            ))
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "impact-tab-panel", style: tabPanelStyle, children: tabPanels.map(
          (tab, idx) => {
            var _a2, _b;
            return tab != null ? /* @__PURE__ */ jsx(
              CustomTabPanel,
              {
                index: idx,
                remountOnTabChange,
                selectedValue,
                value: ((_a2 = tabNames[idx]) == null ? void 0 : _a2.value) ?? "",
                children: tab
              },
              ((_b = tabNames[idx]) == null ? void 0 : _b.value) ?? idx
            ) : null;
          }
        ) })
      ]
    }
  );
}
Tabs.displayName = "Tabs";
export {
  CustomTabPanel,
  Tabs
};
