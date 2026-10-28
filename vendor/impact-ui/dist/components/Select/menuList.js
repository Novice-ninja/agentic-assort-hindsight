import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useMemo, useRef, useEffect } from "react";
import { ShowAll as ShowAll_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import { components } from "react-select";
import { FixedSizeList } from "react-window";
import { Button } from "../Button/index.js";
import { Loader } from "../Loader/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const MenuList = (props) => {
  var _a;
  const { t } = useTranslation();
  const { options, children, maxHeight, selectProps } = props;
  const { isLoading } = selectProps;
  const itemHeight = 37;
  const optionList = options;
  const dynamicHeight = useMemo(() => {
    let calcHeight = options.length * itemHeight;
    if (props.selectProps.isLoadingMore) {
      calcHeight += 92;
    }
    return Math.min(calcHeight, maxHeight);
  }, [options.length, props.selectProps.isLoadingMore, maxHeight]);
  const internalListRef = useRef(null);
  const highlightedIndex = selectProps.highlightedIndex ?? -1;
  const isKeyboardNav = props.selectProps.isKeyboardNav;
  const listboxId = selectProps.listboxId;
  useEffect(() => {
    if (selectProps.listRef && internalListRef.current) {
      selectProps.listRef.current = internalListRef.current;
    }
  });
  useEffect(() => {
    if (isKeyboardNav && highlightedIndex >= 0 && internalListRef.current) {
      internalListRef.current.scrollToItem(highlightedIndex, "smart");
    }
  }, [isKeyboardNav, highlightedIndex]);
  const handleScroll = ({
    scrollOffset,
    scrollUpdateWasRequested
  }) => {
    if (!internalListRef.current || scrollUpdateWasRequested) return;
    const totalHeight = optionList.length * itemHeight;
    if (scrollOffset + dynamicHeight >= totalHeight - 2) {
      if (typeof selectProps.onMenuScrollToBottom === "function") {
        selectProps.onMenuScrollToBottom();
      }
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(components.MenuList, { className: "menulistScroll", ...props, children: /* @__PURE__ */ jsx("div", { "aria-live": "polite", className: "ia-select-loading-container", role: "status", children: /* @__PURE__ */ jsx(Loader, { size: "small" }) }) });
  }
  if (optionList.length === 0) {
    return /* @__PURE__ */ jsx(components.MenuList, { className: "menulistScroll", ...props, children: /* @__PURE__ */ jsx("div", { "aria-live": "polite", className: "ia-select-no-options-message", role: "status", children: selectProps.noOptionMessage }) });
  }
  const childrenArr = Array.isArray(children) ? children : [];
  const itemCount = selectProps.isLoadingMore ? optionList.length + 1 : optionList.length;
  const footerMessage = selectProps.showFooterMessage;
  const hasFooter = !!((props.selectProps.maxSelectableOptions || ((_a = props.selectProps.showFooterMessage) == null ? void 0 : _a.description)) && options.length > 0);
  const menuListClass = `menulistScroll${hasFooter ? " has-footer" : ""}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-label": t("select.ariaOptions"),
        className: "menulistScroll",
        id: listboxId,
        role: "listbox",
        children: /* @__PURE__ */ jsx(components.MenuList, { className: menuListClass, ...props, children: /* @__PURE__ */ jsx(
          FixedSizeList,
          {
            ref: internalListRef,
            height: dynamicHeight,
            itemCount,
            itemSize: itemHeight,
            width: "100%",
            onScroll: handleScroll,
            children: ({ index, style }) => {
              if (selectProps.isLoadingMore && index === optionList.length) {
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "ia-select-loading-container ia-select-loading-more-container",
                    style,
                    children: /* @__PURE__ */ jsx(Loader, { size: "small" })
                  }
                );
              }
              return /* @__PURE__ */ jsx("div", { style, children: childrenArr[index] });
            }
          }
        ) })
      }
    ),
    selectProps.maxSelectableOptions != null && selectProps.maxSelectableOptions > 0 && optionList.length > 0 && /* @__PURE__ */ jsx("span", { className: "ia-select-max-selectable-options", children: `Maximum ${selectProps.maxSelectableOptions} selections` }),
    (footerMessage == null ? void 0 : footerMessage.description) && optionList.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ia-select-footer-message", children: [
      /* @__PURE__ */ jsx("span", { className: "ia-select-max-selectable-options", children: footerMessage.description }),
      footerMessage.actionButtonText && /* @__PURE__ */ jsx(
        Button,
        {
          icon: /* @__PURE__ */ jsx(ShowAll_default, { height: 16, width: 16 }),
          iconPlacement: "right",
          size: "small",
          type: "default",
          variant: "url",
          onClick: (e) => {
            var _a2;
            e.stopPropagation();
            (_a2 = footerMessage.action) == null ? void 0 : _a2.call(footerMessage);
          },
          children: footerMessage.actionButtonText
        }
      )
    ] })
  ] });
};
export {
  MenuList
};
