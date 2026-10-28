!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.impact-info-panel-container{align-items:center;background-color:#fff;display:flex;flex-direction:row;font-family:Manrope,sans-serif;gap:12px;height:48px;justify-content:space-between;padding:8px 24px;position:relative;width:100%}.impact-info-panel-container .impact-info-panel-left-container{align-items:center;display:flex;flex:1 1 auto;flex-direction:row;gap:12px;justify-content:space-between;min-width:0}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container{align-items:center;display:flex;flex-direction:row;flex-shrink:0;gap:8px;justify-content:space-between}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .MuiChip-root.impact_badges_only_label_stroke{height:24px!important;max-width:145px;min-height:24px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-label{color:#60697d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:21px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-button{align-items:center;background-color:#f5f6fa;border-radius:8px;display:flex;flex-shrink:0;height:32px;justify-content:center;max-height:32px;min-height:32px;overflow:hidden;padding:8px;transition:transform .2s ease;width:32px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-button:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-button:focus:not(:focus-visible){box-shadow:none;outline:none}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-button:hover{cursor:pointer}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-button svg{color:#1f2b4d;height:20px;width:20px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper{background-color:#fff;border-radius:8px;box-shadow:0 0 4px #0000001f;left:0;min-width:265px;padding:8px 6px;position:absolute;top:54px;z-index:1200}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-recent-container{display:flex;flex-direction:column}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-recent-container .impact-filter-dropdown-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:21px;padding:6px 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-recent-container .impact-filter-dropdown-recent-filters-wrapper{display:flex;flex-direction:column;margin-bottom:6px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-recent-container .impact-filter-dropdown-recent-filters-wrapper .impact-filter-dropdown-recent-filters{border-radius:8px;display:flex;flex-direction:row;padding:8px 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-recent-container .impact-filter-dropdown-recent-filters-wrapper .impact-filter-dropdown-recent-filters:hover{background-color:#edf0ff;cursor:pointer}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-recent-container .impact-filter-dropdown-recent-filters-wrapper .impact-filter-dropdown-recent-filters span{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container{display:flex;flex-direction:column}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:21px;padding:6px 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-badge-wrapper{display:flex;flex-direction:row;gap:6px;padding:8px 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-badge-wrapper .MuiChip-root.impact_badges_only_label_stroke{cursor:pointer}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-no-data-text{align-items:center;color:#7a8294;display:flex;font-family:Manrope,sans-serif;font-size:14px;font-weight:400;justify-content:center;line-height:20px;margin:24px 0}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-search-wrapper{padding:8px 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-search-wrapper .impact-input-wrapper{border:none!important;min-width:100%!important;padding-left:0}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-lists-wrapper{display:flex;flex-direction:column;max-height:160px;overflow:auto}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-lists-wrapper .impact-filter-dropdown-saved-filters-list{border-radius:8px;color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;margin-bottom:4px;padding:8px 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .impact-filter-dropdown-saved-filters-lists-wrapper .impact-filter-dropdown-saved-filters-list:hover{background-color:#f5f6fa;cursor:pointer}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-saved-container .filter-dropdown-selected-list{background-color:#edf0ff}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-action-wrapper{display:flex;flex-direction:column;gap:8px}.impact-info-panel-container .impact-info-panel-left-container .impact-filter-dropdown-container .impact-filter-dropdown-wrapper .impact-filter-dropdown-action-wrapper .impact-filter-dropdown-action-btns{display:flex;flex-direction:row;gap:8px;justify-content:flex-end;padding:0 18px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container{align-items:center;display:flex;flex-direction:row;gap:16px;justify-content:space-between;min-width:0;width:100%}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-tags{align-items:center;display:flex;flex:1 1 0;flex-direction:row;gap:12px;max-width:100%;min-width:0;overflow:hidden}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper{align-items:center;display:flex;flex-direction:row;flex-shrink:0;gap:0;position:relative;transition:transform .5s ease-in-out}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper .impact-selected-filter-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:21px;padding-right:4px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper .impact-selected-filter-tags-container{align-items:center;display:flex;flex-direction:row;gap:4px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper .impact-filter-strip-separator{margin-right:8px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-action-btns{align-items:center;display:flex;flex-direction:row;gap:4px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-action-btns .impact-selected-filter-action-btn{align-items:center;background-color:#f5f6fa;cursor:pointer;display:flex;justify-content:center;padding:8px 4px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-action-btns .impact-selected-filter-action-btn svg{color:#60697d;font-size:18px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-action-btns .prev{border-bottom-left-radius:4px;border-top-left-radius:4px}.impact-info-panel-container .impact-info-panel-left-container .impact-selected-filter-container .impact-selected-filter-action-btns .next{border-bottom-right-radius:4px;border-top-right-radius:4px}.impact-info-panel-container .impact-info-panel-right-container{align-items:center;display:flex;flex-direction:row;flex-shrink:0;gap:12px}.impact-info-panel-container .impact-filter-strip-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1px}.impact-selected-filter-tags-dropdown{background-color:#fff;border-radius:8px;box-shadow:0 0 4px #0000001f;max-width:200px;padding:8px 6px;position:absolute;right:0;top:45px;width:100%;z-index:1200}.impact-selected-filter-tags-dropdown .impact-selected-filter-tag-container{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}.impact-selected-filter-tags-dropdown .impact-selected-filter-tag-label{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;overflow:hidden;padding:8px 18px;text-overflow:ellipsis;white-space:nowrap}.impact-selected-filter-tags-dropdown .impact-selected-filter-tags-actions-container{display:flex;flex-direction:column;gap:8px}.impact-selected-filter-tags-dropdown .impact-selected-filter-tags-actions-container .ia-styles.ia-btn{width:100%}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useCallback, Fragment as Fragment$1 } from "react";
import default_1 from "../../node_modules/@mui/icons-material/FilterList.js";
import { Button } from "../Button/index.js";
import { Tag } from "../Tag/index.js";
import { FilterDropDown } from "./FilterDropDown.js";
import { FilterSlider } from "./FilterSlider.js";

import { useTranslation } from "../../i18n/useTranslation.js";
function FiltersStrip({
  selectedFilter = "",
  setSelectedFilter = () => {
  },
  recentFilters = [],
  savedFiltersBadge = [],
  savedFilterLists = [],
  filterTags = [],
  handleBadgeChange = () => {
  },
  handleApplyFilter,
  handleCancelFilter,
  filterButtonLabel,
  filterButtonClick,
  filterButtonProps,
  hideSelectedFilterBadge = false,
  savedFilterSelectedBadge = null,
  handleSavedRecentFilterDropdown = () => {
  },
  filterDropDownLabel,
  className,
  id,
  "data-testid": dataTestId,
  "aria-label": ariaLabel,
  role = "region"
}) {
  const { t } = useTranslation();
  const resolvedFilterButtonLabel = filterButtonLabel ?? t("filtersStrip.allFilters");
  const resolvedAriaLabel = ariaLabel ?? t("filtersStrip.ariaLabel");
  const [showSeparator, setShowSeparator] = useState(false);
  const [currDropShow, setCurrDropShow] = useState(null);
  const handleCurrDropSet = useCallback((val) => {
    setCurrDropShow(val);
  }, []);
  const handleClick = (event) => {
    var _a;
    if (!((_a = event == null ? void 0 : event.target) == null ? void 0 : _a.closest(".impact-selected-filter-tags-dropdown"))) {
      setCurrDropShow(null);
    }
  };
  const hasDropDown = Boolean(savedFilterLists || recentFilters);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-label": resolvedAriaLabel,
      className: `impact-info-panel-container ${className ?? ""}`.trim(),
      "data-testid": dataTestId,
      id,
      role,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "impact-info-panel-left-container", children: [
          hasDropDown && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              FilterDropDown,
              {
                filterDropDownLabel,
                handleApplyFilter: handleApplyFilter ?? (() => {
                }),
                handleBadgeChange,
                handleCancelFilter: handleCancelFilter ?? (() => {
                }),
                handleSavedRecentFilterDropdown,
                hideSelectedFilterBadge,
                recentFilters,
                savedFilterLists,
                savedFiltersBadge,
                savedFilterSelectedBadge,
                selectedFilter,
                setSelectedFilter
              }
            ),
            /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "impact-filter-strip-separator" })
          ] }),
          filterTags.length > 0 && /* @__PURE__ */ jsx(
            FilterSlider,
            {
              containerChildren: (item, index) => /* @__PURE__ */ jsxs(Fragment, { children: [
                index !== 0 && /* @__PURE__ */ jsx("span", { className: "impact-filter-strip-separator" }),
                /* @__PURE__ */ jsxs("div", { className: "impact-selected-filter-label", children: [
                  item.label,
                  " ",
                  item.required && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
                ] })
              ] }),
              currDropShow,
              handleClickOutside: handleClick,
              list: filterTags,
              setShowSeparator,
              tagsChildren: (item, index) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
                item.values.slice(0, 2).map((value, idx) => /* @__PURE__ */ jsx(
                  Tag,
                  {
                    label: value.label,
                    size: "medium",
                    variant: "solid",
                    onDelete: () => {
                    }
                  },
                  idx
                )),
                item.values.length > 2 && /* @__PURE__ */ jsx(
                  Tag,
                  {
                    label: `+${item.values.length - 2}`,
                    size: "medium",
                    variant: "solid",
                    onClick: () => {
                      handleCurrDropSet(currDropShow === index ? null : index);
                    }
                  }
                )
              ] }),
              onNextClick: handleClick,
              onPrevClick: handleClick
            }
          )
        ] }),
        resolvedFilterButtonLabel && /* @__PURE__ */ jsxs("div", { className: "impact-info-panel-right-container", children: [
          showSeparator && /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "impact-filter-strip-separator" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              icon: /* @__PURE__ */ jsx(default_1, { fontSize: "small" }),
              iconPlacement: "left",
              size: "large",
              variant: "tertiary",
              onClick: filterButtonClick,
              ...filterButtonProps,
              children: resolvedFilterButtonLabel
            }
          )
        ] })
      ]
    }
  );
}
FiltersStrip.displayName = "FiltersStrip";
export {
  FilterDropDown,
  FilterSlider,
  FiltersStrip
};
