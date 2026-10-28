!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-styles.ia-menu .MuiPaper-root{background:#fff;border:1px solid #f0f0f0;border-radius:16px;box-shadow:0 1px 6px #0000001f;margin-top:4px;padding:0 6px}.ia-styles.ia-menu .MuiList-root{display:flex;flex-direction:column;gap:4px}.ia-styles.ia-menu .MuiButtonBase-root{align-items:center;color:#1f2b4d;display:flex;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;gap:6px;height:35px;justify-content:space-between;line-height:20px;padding:0 12px}.ia-styles.ia-menu .MuiButtonBase-root:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-styles.ia-menu .MuiButtonBase-root:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-styles.ia-menu .MuiButtonBase-root.Mui-focusVisible{background-color:initial}.ia-styles.ia-menu .MuiButtonBase-root:hover{background:#f5f6fa;border-radius:8px;color:#1f2b4d}.ia-styles.ia-menu .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:has(.ia-list-sublabel){min-height:56px!important}.ia-styles.ia-menu .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root.Mui-selected{background-color:#eceefd;border-radius:8px}.ia-styles.ia-menu .ia-list-body:has(.menu-section-header){border-top:1px solid #f5f6fa;gap:6px;padding-top:4px}.ia-styles.ia-menu li:first-of-type :has(.menu-section-header){border-top:none}.ia-styles.ia-menu li:has(.menu-section-header){cursor:default;pointer-events:none}.ia-styles.ia-menu .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root.child-hover{background:#f5f6fa;border-radius:8px;color:#1f2b4d}.ia-styles.ia-menu .ia-vertical-line{align-self:stretch;border:1px solid #f5f6fa;flex:none;flex-grow:0;height:0;min-width:228px}.ia-styles.ia-menu .ia-menu-action-button-container{align-items:center;display:flex;gap:12px;justify-content:flex-end;padding:8px 8px 4px}.ia-styles.ia-menu .ia-menu-action-button-container .ia-styles.ia-btn{font-weight:400;height:32px;padding:8px}.ia-styles.ia-menu .ia-menu-action-button-container .ia-btn-contained{color:#fff}.ia-styles.ia-menu .ia-menu-action-button-container .ia-btn-contained:hover{background-color:#3649c6;color:#fff}.ia-styles.ia-menu .ia-menu-action-button-container .ia-btn-tertiary:hover{background-color:#eceefd;border-color:#3649c6;border-width:1px;color:#3649c6}.ia-styles.ia-menu .menu-scroll-area{display:flex;flex-direction:column;gap:4px;max-height:300px;overflow-y:auto}.ia-styles.ia-menu .menu-item-selected{background:#f5f6fa;border-radius:8px;color:#1f2b4d}.ia-menu-checkbox .MuiCheckbox-root.impact-checkbox-container{height:16px;margin-right:0;width:16px}.ia-menu-checkbox .MuiCheckbox-root.impact-checkbox-container:hover{background:#fff;border-radius:4px!important}.ia-menu-checkbox .MuiCheckbox-root.default-variant.Mui-checked:hover{background:#eceefd url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/tick.svg) no-repeat;background-position:50%;background-size:10px;border:1px solid #4259ee}.menu-section-header{align-items:center;color:#b4bac7;display:flex;font-size:12px;font-weight:700;height:35px;justify-content:flex-start;line-height:20px}.ia-list-icon{min-width:auto!important}.ia-list-icon svg{height:16px;width:16px}.ia-section-icon{min-width:32px!important}.ia-list-label-container{display:flex;flex-direction:column;justify-content:center;overflow:hidden}.ia-list-sublabel{color:#7a8294;font-size:12px;font-weight:400;max-width:7rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ia-list-body{align-items:center;display:flex;flex-grow:1;gap:8px}.bottom_action{background:#fff;border-top:1px solid #f0f0f0;bottom:0;padding:0;position:sticky}')),document.head.appendChild(e)}}catch(i){console.error("vite-plugin-css-injected-by-js",i)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useState, useEffect } from "react";
import { nestedMenuItemsFromObject } from "./nestedMenuItemsFromObject.js";
import { Button } from "../Button/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
import Menu$1 from "../../node_modules/@mui/material/Menu/Menu.js";
const Menu = forwardRef(
  function Menu2(props, ref) {
    const { t } = useTranslation();
    const {
      options: data,
      onClick: onMenuClick = () => {
      },
      MenuProps: menuProps,
      onClose,
      iconPlacement = "left",
      withCheckbox = false,
      withActionButtons = false,
      onPrimaryButtonClick = () => {
      },
      onTertiaryButtonClick = () => {
      },
      tertiaryButtonLabel,
      anchorEl,
      open,
      selected,
      renderCustomHeader,
      customHeaderProps = {},
      filteredOptions,
      searchQuery,
      onSearchChange,
      onSelectAll,
      onClearSelection,
      primaryButtonProps = {},
      menuContainerClassName,
      className,
      id,
      tertiaryButtonProps = {},
      "data-testid": dataTestId,
      ...rest
    } = props;
    const [selectedItems, setSelectedItems] = useState(
      () => customHeaderProps.selectedItems ?? []
    );
    useEffect(() => {
      if (Array.isArray(selected)) {
        setSelectedItems(selected);
      } else if (customHeaderProps.selectedItems != null) {
        setSelectedItems(customHeaderProps.selectedItems);
      }
    }, [selected, customHeaderProps.selectedItems]);
    const handleClose = () => {
      onClose == null ? void 0 : onClose();
    };
    const handleSelect = (opt, event) => {
      const value = opt.value;
      const newSelectedItems = value != null && selectedItems.includes(value) ? selectedItems.filter((item) => item !== value) : value != null ? [...selectedItems, value] : selectedItems;
      setSelectedItems(newSelectedItems);
      if (customHeaderProps.onSelectionChange) {
        customHeaderProps.onSelectionChange(newSelectedItems);
      }
      let itemResult;
      if (typeof opt.onClick === "function") {
        try {
          itemResult = opt.onClick(opt, event);
        } catch (e) {
          console.warn("item onClick threw:", e);
        }
      }
      if (typeof onMenuClick === "function") {
        try {
          onMenuClick(opt, newSelectedItems, itemResult);
        } catch (e) {
          console.warn("Menu onClick threw:", e);
        }
      }
    };
    const handleSelectAll = () => {
      const allValues = (filteredOptions ?? data ?? []).map((opt) => opt.value).filter((v) => v != null);
      setSelectedItems(allValues);
      onSelectAll == null ? void 0 : onSelectAll(allValues);
    };
    const handleClearSelection = () => {
      setSelectedItems([]);
      onClearSelection == null ? void 0 : onClearSelection();
    };
    const handleSearchChange = (value) => {
      onSearchChange == null ? void 0 : onSearchChange(value);
    };
    const isLoading = customHeaderProps.isLoading;
    const isSearching = customHeaderProps.isSearching;
    const hasEmptySearch = Boolean(searchQuery && (data == null ? void 0 : data.length) === 0 && !isSearching);
    const hasNoInitialData = !searchQuery && (data == null ? void 0 : data.length) === 0 && !isLoading;
    const renderLoadingState = () => /* @__PURE__ */ jsx("div", { style: { padding: "16px", textAlign: "center", color: "#666" }, children: /* @__PURE__ */ jsxs("div", { children: [
      " ",
      t("menu.loadingOptions")
    ] }) });
    const renderSearchingState = () => /* @__PURE__ */ jsx("div", { style: { padding: "16px", textAlign: "center", color: "#666" }, children: /* @__PURE__ */ jsxs("div", { children: [
      " ",
      t("menu.searching")
    ] }) });
    const renderEmptySearchState = () => /* @__PURE__ */ jsx("div", { style: { padding: "16px", textAlign: "center", color: "#666" }, children: /* @__PURE__ */ jsxs("div", { children: [
      " ",
      t("menu.noResults", { query: searchQuery ?? "" })
    ] }) });
    const renderNoDataState = () => /* @__PURE__ */ jsx("div", { style: { padding: "16px", textAlign: "center", color: "#666" }, children: /* @__PURE__ */ jsxs("div", { children: [
      "📭 ",
      t("menu.noOptions")
    ] }) });
    const menuItems = nestedMenuItemsFromObject({
      handleClose: onClose,
      isOpen: open,
      menuItemsData: data ?? [],
      withCheckbox,
      handleSelect,
      selectedItems,
      selected,
      ...rest
    });
    const renderHeader = () => {
      if (renderCustomHeader) {
        return renderCustomHeader({
          options: filteredOptions ?? data ?? [],
          selectedItems,
          searchQuery,
          onSearchChange: handleSearchChange,
          onSelectAll: handleSelectAll,
          onClearSelection: handleClearSelection,
          ...customHeaderProps
        });
      }
      return null;
    };
    const getMenuPositioning = () => {
      if (iconPlacement === "top") {
        return {
          anchorOrigin: { vertical: "top", horizontal: "center" },
          transformOrigin: { vertical: "bottom", horizontal: "center" }
        };
      }
      return {
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
        transformOrigin: { vertical: "top", horizontal: "center" }
      };
    };
    const menuPositioning = getMenuPositioning();
    const anchorOrigin = (menuProps == null ? void 0 : menuProps.anchorOrigin) ?? menuPositioning.anchorOrigin;
    const transformOrigin = (menuProps == null ? void 0 : menuProps.transformOrigin) ?? menuPositioning.transformOrigin;
    return /* @__PURE__ */ jsx("div", { ref, style: { display: "none" }, children: /* @__PURE__ */ jsxs(
      Menu$1,
      {
        anchorEl,
        anchorOrigin,
        className: `ia-styles ia-menu ${menuContainerClassName ?? ""} ${className ?? ""}`.trim(),
        "data-testid": dataTestId,
        id: id ?? "basic-menu",
        open,
        transformOrigin,
        onClose: handleClose,
        ...menuProps,
        ...rest,
        children: [
          renderHeader(),
          isLoading ? renderLoadingState() : isSearching ? renderSearchingState() : hasEmptySearch ? renderEmptySearchState() : hasNoInitialData ? renderNoDataState() : /* @__PURE__ */ jsx("div", { className: "menu-scroll-area", children: menuItems }),
          withActionButtons && withCheckbox && !isLoading && !isSearching && ((data == null ? void 0 : data.length) ?? 0) > 0 && /* @__PURE__ */ jsx("div", { className: "bottom_action", children: /* @__PURE__ */ jsxs("div", { className: "ia-menu-action-button-container", children: [
            tertiaryButtonLabel && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "tertiary",
                onClick: onTertiaryButtonClick,
                ...tertiaryButtonProps,
                children: tertiaryButtonLabel || t("common.cancel")
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                disabled: primaryButtonProps.disabled,
                variant: "primary",
                onClick: onPrimaryButtonClick,
                ...primaryButtonProps,
                children: primaryButtonProps.loading ? t("common.loading") : primaryButtonProps.label ?? t("common.apply")
              }
            )
          ] }) })
        ]
      }
    ) });
  }
);
Menu.displayName = "Menu";
export {
  Menu
};
