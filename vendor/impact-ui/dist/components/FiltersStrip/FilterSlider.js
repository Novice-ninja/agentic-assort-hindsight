!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}:root{--ia-focus-color:#4259ee;--ia-focus-bg:#fff;--ia-focus-ring-width:2px;--ia-focus-ring-offset:2px;--ia-modal-backdrop:#0d152ccc}*,:after,:before{box-sizing:border-box}body,textarea{font-style:normal;font-weight:500}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{border:0;font-size:100%;font:inherit;margin:0;padding:0;vertical-align:initial}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Manrope,sans-serif}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-horizontal-separator{background-color:#d9dde7;display:inline-block;height:1px;width:100%}ul.storybook-order-list{list-style-type:disc;padding-left:12px}ul.storybook-order-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-list li strong{font-weight:800}ul.storybook-order-child-list{list-style-type:circle;padding-left:20px}ul.storybook-order-child-list li{font-size:12px;line-height:20px;padding-bottom:8px}ul.storybook-order-child-list li strong{font-weight:800}.impact-selected-filter-container{align-items:center;display:flex;flex-direction:row;gap:8px;justify-content:space-between}.impact-selected-filter-container .impact-selected-filter-tags{align-items:center;display:flex;flex:1 1 0;flex-direction:row;gap:8px;max-width:100%;min-width:0;overflow:scroll;scrollbar-width:none}.impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper{align-items:center;display:flex;flex-direction:row;flex-shrink:0;gap:6px;position:relative;transition:transform .5s ease-in-out}.impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper .impact-selected-filter-label{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:21px}.impact-selected-filter-container .impact-selected-filter-tags .impact-selected-filter-wrapper .impact-selected-filter-tags-container{align-items:center;display:flex;flex-direction:row;gap:4px}.impact-selected-filter-container .collapsed{overflow:hidden}.impact-selected-filter-container .impact-selected-filter-action-btns{align-items:center;display:flex;flex-direction:row;gap:4px}.impact-selected-filter-container .impact-selected-filter-action-btns .impact-selected-filter-action-btn{align-items:center;background-color:#f5f6fa;cursor:pointer;display:flex;justify-content:center;padding:8px 4px}.impact-selected-filter-container .impact-selected-filter-action-btns .impact-selected-filter-action-btn svg{color:#60697d;font-size:18px}.impact-selected-filter-container .impact-selected-filter-action-btns .prev{border-bottom-left-radius:4px;border-top-left-radius:4px}.impact-selected-filter-container .impact-selected-filter-action-btns .next{border-bottom-right-radius:4px;border-top-right-radius:4px}.impact-selected-filter-container .impact-selected-filter-action-btns .expand{border-radius:8px;color:#60697d;font-size:14px}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useCallback, useLayoutEffect, useEffect, Fragment } from "react";
import default_1$3 from "../../node_modules/@mui/icons-material/ChevronRightOutlined.js";
import default_1$2 from "../../node_modules/@mui/icons-material/CloseOutlined.js";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowLeft.js";
import default_1$1 from "../../node_modules/@mui/icons-material/KeyboardArrowRight.js";
import { FilterSliderPortal } from "./FilterSliderPortal.js";

import { useTranslation } from "../../i18n/useTranslation.js";
function FilterSlider({
  list,
  width,
  isExpanded = true,
  handleExpandClick,
  tagsChildren,
  containerChildren,
  setShowSeparator,
  onNextClick,
  onPrevClick,
  currDropShow,
  handleClickOutside = () => {
  }
}) {
  const { t } = useTranslation();
  const [overFlow, setOverFlow] = useState(false);
  const [currCount, setCurrCount] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [maxTranslateX] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({
    x: 0,
    y: 0,
    width: 200
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tagContainer = useRef(null);
  const filtersContainer = useRef([]);
  const prevItemWidth = useRef(0);
  const prevCount = useRef(currCount);
  const memoizedHandleClickOutside = useCallback(handleClickOutside, [handleClickOutside]);
  const handleCloseClick = () => {
    setCurrCount(0);
    setTranslateX(0);
    handleExpandClick == null ? void 0 : handleExpandClick();
  };
  useLayoutEffect(() => {
    if (tagContainer.current) {
      const container = tagContainer.current;
      setOverFlow(container.scrollWidth > container.clientWidth);
      setShowSeparator == null ? void 0 : setShowSeparator(container.scrollWidth > container.clientWidth);
    }
  }, [list, setShowSeparator]);
  useLayoutEffect(() => {
    const container = tagContainer.current;
    if (!container) return;
    const checkScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;
      setCanScrollLeft(currentScroll > 0);
      setCanScrollRight(currentScroll < maxScroll - 1);
      setOverFlow(maxScroll > 0);
      setShowSeparator == null ? void 0 : setShowSeparator(maxScroll > 0);
    };
    requestAnimationFrame(checkScroll);
    container.addEventListener("scroll", checkScroll);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(checkScroll) : null;
    resizeObserver == null ? void 0 : resizeObserver.observe(container);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
    };
  }, [list, setShowSeparator]);
  useLayoutEffect(() => {
    const el = filtersContainer.current[currCount];
    if (!el) return;
    const itemWidth = el.offsetWidth;
    let newTranslateX = translateX;
    if (currCount > prevCount.current) {
      newTranslateX += itemWidth;
    } else if (currCount < prevCount.current) {
      newTranslateX -= prevItemWidth.current;
    }
    newTranslateX = Math.min(newTranslateX, maxTranslateX);
    newTranslateX = Math.max(newTranslateX, 0);
    setTranslateX(newTranslateX);
    prevItemWidth.current = itemWidth;
    prevCount.current = currCount;
  }, [currCount, maxTranslateX, translateX]);
  useEffect(() => {
    const handleMouseDown = (event) => {
      memoizedHandleClickOutside(event);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [memoizedHandleClickOutside]);
  const scrollAmount = 200;
  const handleNextClick = (event) => {
    var _a;
    onNextClick == null ? void 0 : onNextClick(event);
    (_a = tagContainer.current) == null ? void 0 : _a.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  const handlePrevClick = (event) => {
    var _a;
    onPrevClick == null ? void 0 : onPrevClick(event);
    (_a = tagContainer.current) == null ? void 0 : _a.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const handleTagClick = (index) => {
    const el = filtersContainer.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropdownPosition({
        x: rect.right + window.scrollX,
        y: rect.bottom + window.scrollY,
        width: rect.width
      });
    }
  };
  if (!Array.isArray(list)) return null;
  return /* @__PURE__ */ jsxs("div", { className: "impact-selected-filter-container", style: { width: width ?? "100%" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: tagContainer,
        className: `impact-selected-filter-tags ${!isExpanded ? "collapsed" : ""}`,
        children: list.map((item, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            ref: (el) => {
              filtersContainer.current[index] = el;
            },
            className: "impact-selected-filter-wrapper",
            style: { transform: `translateX(-${translateX}px)` },
            onClick: () => {
              handleTagClick(index);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTagClick(index);
              }
              if (e.key === "Escape") {
                handleClickOutside();
              }
            },
            children: [
              containerChildren == null ? void 0 : containerChildren(item, index),
              /* @__PURE__ */ jsx("div", { className: "impact-selected-filter-tags-container", children: tagsChildren(item, index) }),
              currDropShow === index && /* @__PURE__ */ jsx(
                FilterSliderPortal,
                {
                  filtersContainer,
                  index,
                  position: dropdownPosition,
                  showButton: item.values.length > 7,
                  tag: item,
                  tags: item.values.slice(2, 7),
                  viewAllAction: item.handleViewAll
                }
              )
            ]
          },
          item.id
        ))
      }
    ),
    overFlow && list.length > 2 ? /* @__PURE__ */ jsx("div", { className: "impact-selected-filter-action-btns", children: isExpanded ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-label": t("filtersStrip.previousFilterAria"),
          className: "impact-selected-filter-action-btn prev",
          role: "button",
          style: {
            opacity: canScrollLeft ? 1 : 0.5,
            pointerEvents: canScrollLeft ? "auto" : "none"
          },
          tabIndex: canScrollLeft ? 0 : -1,
          onClick: handlePrevClick,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePrevClick(e);
            }
          },
          children: /* @__PURE__ */ jsx(default_1, {})
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-label": t("filtersStrip.nextFilterAria"),
          className: "impact-selected-filter-action-btn next",
          role: "button",
          style: {
            opacity: canScrollRight ? 1 : 0.5,
            pointerEvents: canScrollRight ? "auto" : "none"
          },
          tabIndex: canScrollRight ? 0 : -1,
          onClick: handleNextClick,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNextClick(e);
            }
          },
          children: /* @__PURE__ */ jsx(default_1$1, {})
        }
      ),
      handleExpandClick && /* @__PURE__ */ jsx(
        "div",
        {
          "aria-label": t("filtersStrip.closeFilterAria"),
          className: "impact-selected-filter-action-btn next",
          role: "button",
          style: { opacity: currCount === list.length ? 0.5 : 1 },
          tabIndex: 0,
          onClick: handleCloseClick,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCloseClick();
            }
          },
          children: /* @__PURE__ */ jsx(default_1$2, { fontSize: "small" })
        }
      )
    ] }) : /* @__PURE__ */ jsxs(
      "div",
      {
        "aria-label": t("filtersStrip.expandFilterAria"),
        className: "impact-selected-filter-action-btn expand",
        role: "button",
        style: { opacity: currCount === list.length ? 0.5 : 1 },
        tabIndex: 0,
        onClick: handleExpandClick,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleExpandClick == null ? void 0 : handleExpandClick();
          }
        },
        children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "+",
            list.length
          ] }),
          /* @__PURE__ */ jsx(default_1$3, {})
        ]
      }
    ) }) : null
  ] });
}
FilterSlider.displayName = "FilterSlider";
export {
  FilterSlider
};
