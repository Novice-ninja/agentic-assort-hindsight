import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useCallback } from "react";
import { Checkbox } from "../Checkbox/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const SearchFilter = forwardRef(
  ({
    isClearable,
    onSearch,
    isMulti,
    onSelectAll,
    onClearAll,
    isSelectAll,
    selectedOptions,
    toggleSelectAll,
    isWithSearch,
    onKeyDown,
    onSubmenuKeyDown,
    searchPlaceholder,
    isLoading,
    searchTerm,
    setSearchTerm,
    onSearchBlur,
    selectionLabels = {},
    onClose,
    setHighlightedIndex,
    setIsKeyboardNav,
    highlightedIndex = -1,
    isSelectAllHighlighted = false
  }, ref) => {
    const { t } = useTranslation();
    const selectedArr = Array.isArray(selectedOptions) ? selectedOptions : [];
    const hasSelectAll = !!(isMulti && toggleSelectAll && !isLoading);
    useEffect(() => {
      setSearchTerm("");
    }, [setSearchTerm]);
    const handleSearchKeyDown = useCallback(
      (e) => {
        if (onSubmenuKeyDown == null ? void 0 : onSubmenuKeyDown(e)) return;
        if ((e.ctrlKey || e.metaKey) && e.key === "a" && isMulti) {
          e.preventDefault();
          if (onSelectAll) {
            const syntheticEvent = {
              target: { checked: !isSelectAll }
            };
            onSelectAll(syntheticEvent);
          }
          return;
        }
        const isOnOptions = highlightedIndex >= 0;
        const isOnSelectAll = highlightedIndex === -1 && hasSelectAll;
        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            setIsKeyboardNav == null ? void 0 : setIsKeyboardNav(true);
            if (isOnOptions || isOnSelectAll) {
              onKeyDown == null ? void 0 : onKeyDown(e);
            } else if (hasSelectAll) {
              setHighlightedIndex == null ? void 0 : setHighlightedIndex(-1);
            } else {
              setHighlightedIndex == null ? void 0 : setHighlightedIndex(0);
            }
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            if (isOnOptions || isOnSelectAll) {
              onKeyDown == null ? void 0 : onKeyDown(e);
            }
            break;
          }
          case "Enter": {
            if (isOnOptions || isOnSelectAll) {
              e.preventDefault();
              onKeyDown == null ? void 0 : onKeyDown(e);
            }
            break;
          }
          case " ": {
            if ((isOnOptions || isOnSelectAll) && !searchTerm) {
              e.preventDefault();
              onKeyDown == null ? void 0 : onKeyDown(e);
            }
            break;
          }
          case "Home":
          case "End": {
            if (isOnOptions) {
              e.preventDefault();
              onKeyDown == null ? void 0 : onKeyDown(e);
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            onClose == null ? void 0 : onClose();
            break;
          }
          case "Tab":
            onClose == null ? void 0 : onClose();
            break;
        }
      },
      [
        onKeyDown,
        onSubmenuKeyDown,
        onClose,
        setHighlightedIndex,
        setIsKeyboardNav,
        isMulti,
        onSelectAll,
        isSelectAll,
        hasSelectAll,
        highlightedIndex,
        searchTerm
      ]
    );
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      isWithSearch && /* @__PURE__ */ jsx(
        "input",
        {
          ref,
          "aria-label": searchPlaceholder ?? t("select.searchAriaLabel"),
          autoComplete: "off",
          className: "ia-select-search-box",
          placeholder: searchPlaceholder,
          role: "searchbox",
          value: searchTerm,
          onBlur: onSearchBlur,
          onChange: onSearch,
          onKeyDown: handleSearchKeyDown
        }
      ),
      hasSelectAll && /* @__PURE__ */ jsx("div", { className: "ia-select-search-container", children: /* @__PURE__ */ jsxs(
        "div",
        {
          "aria-selected": isSelectAll,
          className: `ia-select-selectAll-container${isSelectAllHighlighted ? " ia-select-option-highlighted" : ""}`,
          role: "option",
          children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                checked: isSelectAll,
                className: "select-selectAll-checkbox",
                id: "select-all",
                label: isSelectAll ? selectionLabels.deselectAll ?? t("select.deselectAllLabel") : selectionLabels.selectAll ?? t("select.selectAllLabel"),
                name: "select-all",
                onChange: onSelectAll
              }
            ),
            isClearable && selectedArr.length > 0 && /* @__PURE__ */ jsx(
              "button",
              {
                "aria-label": t("select.ariaClearAll"),
                className: "ia-select-clear-all-button",
                type: "button",
                onClick: () => {
                  onClearAll();
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onClearAll();
                  }
                },
                children: t("common.clear")
              }
            )
          ]
        }
      ) })
    ] });
  }
);
SearchFilter.displayName = "SearchFilter";
export {
  SearchFilter as default
};
