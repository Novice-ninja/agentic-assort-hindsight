!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode(".ia-menu .menu-header{background:#fff;border-radius:16px 16px 0 0;padding-bottom:0;position:sticky;top:0;width:260px;z-index:10}.ia-menu .menu-header .MuiRadioGroup-row{margin-bottom:8px}.ia-menu .menu-header .MuiTextField-root .MuiInputBase-root{background-color:#f5f5f5;border-radius:8px}.ia-menu .menu-header .MuiTextField-root .MuiInputBase-root .MuiInputAdornment-root{color:#b4bac7}.ia-menu .menu-header .menu-header-search-container{align-items:center;display:flex;gap:8px;padding:0 16px}.ia-menu .menu-header .menu-header-search-container .menu-header-search-icon{height:14px;width:14px}.ia-menu .menu-header .menu-header-search-container .menu-header-search-input{border:none;border-radius:8px;font-size:14px;outline:none;padding:8px 0;width:100%}.ia-menu .menu-header .menu-header-search-container .menu-header-search-input::placeholder{color:#b4bac7}.ia-menu .menu-header .menu-header-radio-group-container{border-bottom:1px solid #f0f0f0;margin-bottom:8px}.ia-menu .menu-header .menu-header-radio-group-container .MuiFormGroup-root.orientation-row{padding:2px 12px}.ia-menu .menu-header .menu-header-radio-group{display:flex;justify-content:space-between}.ia-menu .menu-header .MuiButtonBase-root,.ia-menu .menu-header .MuiFormGroup-root.orientation-row{padding:0 8px}.ia-menu .menu-header .select-all-option{margin-right:12px;padding:0 12px}.ia-menu .select-all-option{display:flex;justify-content:space-between}.ia-menu .select-all-option .MuiCheckbox-root{margin-right:8px;padding:0}.ia-menu .select-all-option .select-all-text{color:#0d152c!important;flex-grow:1;font-weight:500}.ia-menu .select-all-option .clear-text{color:#60697d;cursor:pointer;font-weight:500}.ia-menu .menu-list-container{max-height:250px;overflow-y:auto;padding-bottom:0;padding-top:0}.ia-menu .menu-option{align-items:center;display:flex;padding:8px 16px}.ia-menu .menu-option.selected{background-color:#e2f4ff}.ia-menu .menu-option .MuiCheckbox-root{margin-right:8px;padding:0}.ia-menu .menu-option .menu-option-label{flex-grow:1}.ia-menu .ia-menu-action-button-container{display:flex;gap:8px;justify-content:flex-end}")),document.head.appendChild(e)}}catch(n){console.error("vite-plugin-css-injected-by-js",n)}}();
import { jsxs, jsx } from "react/jsx-runtime";
import { memo, useState, useRef, useEffect, useMemo } from "react";
import { SearchIconTable as SearchIconTable_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import { Checkbox } from "../Checkbox/index.js";
import { RadioButtonGroup } from "../RadioButtonGroup/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import MenuItem from "../../node_modules/@mui/material/MenuItem/MenuItem.js";
function debounce(func, wait) {
  let timeout = null;
  return function executedFunction(value) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func(value);
    }, wait);
  };
}
const MenuHeaderInfoComponent = ({
  options,
  selectedItems,
  onSearchChange,
  onSelectAll,
  searchQuery,
  onClearSelection,
  onRadioButtonChange,
  radioButtonOptions = [],
  selectedRadioButton,
  showRadioButton = false,
  isSearchable = true,
  isSelectAllAllowed = true,
  customHeaderProps = {},
  externalHandlers = {},
  overrideConfig = {}
}) => {
  const { t } = useTranslation();
  const config = {
    radioButtonOptions: overrideConfig.radioButtonOptions ?? radioButtonOptions,
    selectedRadioButton: overrideConfig.selectedRadioButton ?? selectedRadioButton,
    showRadioButton: overrideConfig.showRadioButton ?? showRadioButton,
    isSearchable: overrideConfig.isSearchable ?? isSearchable,
    isSelectAllAllowed: overrideConfig.isSelectAllAllowed ?? isSelectAllAllowed
  };
  const [selectedRadioOption, setSelectedRadioOption] = useState(config.selectedRadioButton ?? "");
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery ?? "");
  const inputRef = useRef(null);
  const isUserTyping = useRef(false);
  useEffect(() => {
    if (isUserTyping.current && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  });
  useEffect(() => {
    if (searchQuery === void 0 || searchQuery === "") {
      setInternalSearchQuery("");
    }
  }, [searchQuery]);
  const debouncedExternalHandler = useMemo(
    () => debounce((value) => {
      if (externalHandlers.onSearchChange) {
        externalHandlers.onSearchChange(value);
      } else {
        onSearchChange == null ? void 0 : onSearchChange(value);
      }
    }, 500),
    [externalHandlers, onSearchChange]
  );
  const handleSearchChange = (event) => {
    const value = event.target.value;
    isUserTyping.current = true;
    setInternalSearchQuery(value);
    debouncedExternalHandler(value);
    setTimeout(() => {
      isUserTyping.current = false;
    }, 50);
  };
  const handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey) {
      const allowedKeys = ["c", "v", "x", "a", "z", "y"];
      if (allowedKeys.includes(event.key.toLowerCase())) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        isUserTyping.current = true;
        return;
      }
    }
    const navigationKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "PageUp",
      "PageDown",
      "Tab",
      "Escape",
      "Enter"
    ];
    if (navigationKeys.includes(event.key)) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    isUserTyping.current = true;
    if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
      const input = event.currentTarget;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const currentValue = input.value;
      let newValue;
      let newCursorPos;
      if (event.key === "Backspace") {
        if (start === end && start > 0) {
          newValue = currentValue.slice(0, start - 1) + currentValue.slice(start);
          newCursorPos = start - 1;
        } else if (start !== end) {
          newValue = currentValue.slice(0, start) + currentValue.slice(end);
          newCursorPos = start;
        }
      } else if (event.key === "Delete") {
        if (start === end && start < currentValue.length) {
          newValue = currentValue.slice(0, start) + currentValue.slice(start + 1);
          newCursorPos = start;
        } else if (start !== end) {
          newValue = currentValue.slice(0, start) + currentValue.slice(end);
          newCursorPos = start;
        }
      } else if (event.key.length === 1) {
        newValue = currentValue.slice(0, start) + event.key + currentValue.slice(end);
        newCursorPos = start + 1;
      }
      if (newValue !== void 0) {
        setInternalSearchQuery(newValue);
        debouncedExternalHandler(newValue);
        setTimeout(() => {
          if (newCursorPos !== void 0) {
            input.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    }
  };
  const isAllSelected = selectedItems.length === options.length && options.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < options.length;
  const onSelectRadioButton = (_e, value) => {
    setSelectedRadioOption(value);
    if (externalHandlers.onRadioButtonChange) {
      externalHandlers.onRadioButtonChange(value);
    } else {
      onRadioButtonChange == null ? void 0 : onRadioButtonChange(value);
    }
  };
  const handleSelectAll = () => {
    const allValues = options.map((opt) => opt.value).filter((v) => v != null);
    if (externalHandlers.onSelectAll) {
      externalHandlers.onSelectAll(allValues);
    } else {
      onSelectAll == null ? void 0 : onSelectAll(allValues);
    }
  };
  const handleClearSelection = () => {
    if (externalHandlers.onClearSelection) {
      externalHandlers.onClearSelection();
    } else {
      onClearSelection == null ? void 0 : onClearSelection();
    }
  };
  const {
    searchPlaceholder,
    selectAllLabel,
    clearButtonText,
    radioButtonProps,
    searchInputProps,
    checkboxProps,
    clearButtonProps,
    ...restCustomProps
  } = customHeaderProps;
  return /* @__PURE__ */ jsxs("div", { className: "menu-header menu-header-fixed", ...restCustomProps, children: [
    config.showRadioButton && config.radioButtonOptions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "menu-header-radio-group-container", children: /* @__PURE__ */ jsx(
      RadioButtonGroup,
      {
        name: "menu-header-radio-group",
        options: config.radioButtonOptions,
        orientation: "row",
        selectedOption: selectedRadioOption,
        onChange: onSelectRadioButton,
        ...radioButtonProps ?? {}
      }
    ) }) : null,
    config.isSearchable ? /* @__PURE__ */ jsxs(
      "div",
      {
        "aria-label": t("menu.searchAriaLabel"),
        className: "menu-header-search-container",
        role: "search",
        children: [
          /* @__PURE__ */ jsx(SearchIconTable_default, { className: "menu-header-search-icon", height: 14, width: 14 }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              autoComplete: "off",
              className: "menu-header-search-input",
              placeholder: searchPlaceholder ?? t("menu.searchPlaceholder"),
              tabIndex: 0,
              type: "text",
              value: internalSearchQuery,
              onChange: handleSearchChange,
              onKeyDown: handleKeyDown,
              ...searchInputProps ?? {}
            }
          )
        ]
      }
    ) : null,
    config.isSelectAllAllowed ? /* @__PURE__ */ jsxs(MenuItem, { className: "select-all-option", children: [
      /* @__PURE__ */ jsx("div", { className: "ia-menu-checkbox", children: /* @__PURE__ */ jsx(
        Checkbox,
        {
          checked: isAllSelected,
          indeterminate: isIndeterminate,
          label: selectAllLabel ?? t("common.selectAll"),
          variant: "default",
          onChange: () => {
            handleSelectAll();
          },
          ...checkboxProps ?? {}
        }
      ) }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "clear-text",
          role: "button",
          tabIndex: 0,
          onClick: handleClearSelection,
          onKeyDown: (e) => {
            if (e.key === "Enter") handleClearSelection();
          },
          ...clearButtonProps ?? {},
          children: clearButtonText ?? t("common.clear")
        }
      )
    ] }) : null
  ] });
};
const MenuHeaderInfo = memo(MenuHeaderInfoComponent);
MenuHeaderInfo.displayName = "MenuHeaderInfo";
export {
  MenuHeaderInfo
};
