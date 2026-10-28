!function(){"use strict";try{if("undefined"!=typeof document){var e=document.createElement("style");e.appendChild(document.createTextNode('@keyframes ia-shimmer-horizontal{0%{background-position:100% 0}to{background-position:0 0}}@keyframes ia-shimmer-vertical{0%{background-position:0 100%}to{background-position:0 0}}@property --ia-shimmer-angle{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes ia-shimmer-circular{0%{--ia-shimmer-angle:0deg}to{--ia-shimmer-angle:360deg}}.ia-shimmer{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ltr{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(90deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ltr{animation:none;background-image:linear-gradient(90deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--rtl{animation:ia-shimmer-horizontal 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(270deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:300% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--rtl{animation:none;background-image:linear-gradient(270deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--btt{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:reverse;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--btt{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--ttb{animation:ia-shimmer-vertical 1.6s ease-in-out infinite;animation-direction:normal;background-color:#e8edf5;background-image:linear-gradient(0deg,#e8edf5,#eceef4 22%,#e8edf5 48%,#d5dbe8 62%,#e8edf5);background-repeat:no-repeat;background-size:100% 300%}@media (prefers-reduced-motion:reduce){.ia-shimmer--ttb{animation:none;background-image:linear-gradient(0deg,#e8edf5,#eceef4 40%,#d5dbe8);background-size:100% 100%}}.ia-shimmer--circular{background-color:#e8edf5;background-repeat:no-repeat;--ia-shimmer-angle:0deg;animation:ia-shimmer-circular 1.6s linear infinite;background-image:conic-gradient(from var(--ia-shimmer-angle),#eceef4 0deg,#e8edf5 80deg,#d5dbe8 160deg,#e8edf5 260deg,#eceef4 1turn);background-size:100% 100%}@media (prefers-reduced-motion:reduce){.ia-shimmer--circular{animation:none;background-image:conic-gradient(from 0deg,#eceef4,#e8edf5,#d5dbe8,#e8edf5 1turn)}}.ia-select-main-container-v3{align-items:center;display:flex;gap:5px}.top-orientation{align-items:flex-start;flex-direction:column}.isAgGridCellRenderer{width:100%}.isAgGridCellRenderer .ia-select-button-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.isAgGridCellRenderer .ia-select-button-text-span{display:block;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ia-select-label-v3{line-height:18px;white-space:nowrap}.ia-select-container-v3{position:relative}.ia-select-container-v3 [aria-disabled=true]{background-color:#f8f9fb!important;border:1px solid #d9dde7!important;border-radius:8px;cursor:not-allowed;pointer-events:none}.multi-select__control{display:none}.multi-select__option{font-size:14px;padding:8px 16px}@media screen and (max-width:1399px) and (min-width:1200px){.multi-select__option{font-size:12px;padding:5px 16px}}.multi-select__option--is-selected{background-color:#984d4d;color:#1d1d1d}.multi-select__option--is-selected:active{background-color:#cfafaf}.loading-option{color:green;pointer-events:none}.loading-option-multi label{color:#ff0;pointer-events:none}.ia-select-container-v3-styled-menu{background:#fff;border-radius:4px;box-shadow:0 3px 6px #00000040;margin-top:4px;min-width:240px;padding:8px 0;position:absolute;z-index:2;z-index:99999}.ia-select-container-v3-blanket{bottom:0;left:0;position:fixed;right:0;top:0;z-index:9998}.ia-select-styled-dropdown-main-button{align-items:center;background:#fff;border:1px solid #0000001f;border-radius:4px;box-sizing:border-box;color:#1d1d1d;cursor:pointer;display:flex;font-size:14px;height:37px;justify-content:space-between;padding:8px 12px;text-align:left;width:100%}@media screen and (max-width:1399px) and (min-width:1200px){.ia-select-styled-dropdown-main-button{font-size:12px;height:28px}}.ia-select-styled-dropdown-main-button.is-with-clearable{gap:16px}.ia-select-button-clear-icon{background-image:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/notification-close.svg);background-position:end;background-repeat:no-repeat;background-size:10px;border-radius:4px;cursor:pointer;height:10px;margin-left:10px;position:absolute;right:40px;top:10px;width:10px}.ia-select-button-clear-icon:focus-visible{outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:2px}.ia-select-chevron-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/select-chevron.svg) no-repeat;background-position:50%;background-size:10px;display:inline-block;flex-shrink:0;height:10px;margin-left:10px;transform:rotate(0);width:10px}.ia-select-chevron-icon.open{transform:rotate(180deg)}.ia-select-search-box{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/search.svg) no-repeat;background-position:16px;background-size:12px;border:none;border-bottom:1px solid blue;box-sizing:border-box;font-family:Poppins,sans-serif;font-size:14px;height:37px;outline:none;padding:0 16px 0 34px;width:100%}@media screen and (max-width:1399px) and (min-width:1200px){.ia-select-search-box{height:28px}}.ia-select-search-box::placeholder{color:#b4bac7}.ia-select-clear-all-button{background-color:initial;border:none;border-radius:4px;box-sizing:border-box;color:#60697d;cursor:pointer;font-size:12px;font-weight:400;height:26px;line-height:18px}.ia-select-clear-all-button:focus-visible{outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:2px}.ia-select-selectAll-container{align-items:center;border-radius:8px;box-sizing:border-box;display:flex;height:35px;justify-content:space-between;margin-bottom:2px;padding:4px 12px;position:relative}.ia-select-selectAll-container.ia-select-option-highlighted{background-color:#f5f6fa;outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:-2px}.ia-select-selectAll-container:after{background:#d9dde7;bottom:-3px;content:" ";height:1px;left:-6px;position:absolute;right:-6px}.ia-select-selectAll-container:hover{background-color:#f5f6fa;border-radius:8px}.ia-select-selectAll-container .impact-form-checkbox-container .MuiFormControlLabel-label{color:#1f2b4d}.ia-select-max-selectable-options{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/selectInfoIcon.svg) no-repeat;background-position:12px 10px;border-top:1px solid #f5f6fa;color:#60697d;display:flex;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;line-height:16px;padding:9px 0 4px 34px}.ia-select-button-text{align-items:center;color:#1f2b4d;display:flex;font-family:Manrope,sans-serif!important;font-weight:500;gap:8px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ia-select-button-text svg{font-size:18px}.ia-select-button-text.impact-select-table{align-items:center;box-sizing:border-box;display:flex;flex:1 1 auto;gap:0;max-width:100%;min-width:0;overflow:hidden;width:100%}.ia-select-button-text.impact-select-table .ia-select-button-text-span{box-sizing:border-box;display:block;flex:1;max-width:100%;min-width:0;overflow:hidden;position:relative;text-overflow:ellipsis;white-space:nowrap;width:100%}.ia-select-button-text-full-width{width:90%}.ia-select-button-text-span{display:inline-block;font-weight:500;max-width:100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.placeholder .ia-select-button-text-span{font-weight:400}.ia-select-button-text.placeholder{color:#b4bac7;font-weight:400}.select-label-with-icon{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;height:20px;line-height:20px;text-align:left;width:100%}.select-label-with-icon span{display:inline-block}.select-label-with-icon .selected-children-count{color:#6b7280;font-size:12px;margin-left:4px}.select-label-with-icon-multi span{max-width:153px}.impact-checkbox-label.disabled .select-label-with-icon{color:#b4bac7!important}.select-options-tag-group{display:flex;gap:4px;margin-top:4px;position:absolute;width:70px}.select-options-tag-group span{width:100%}.select-options-tag-group span>div{background-color:#eceefd;border:none!important}.select-options-tag-list{background:#fff;border-radius:12px;box-shadow:0 4px 8px #0000001f;display:flex;flex-direction:column;margin-top:2px;max-height:200px;overflow-y:auto;padding:4px 8px;position:absolute;width:91px;z-index:10}.tag-group-more{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/menu-ext.svg) 50% no-repeat;display:inline-block;display:flex;height:20px;transform:rotate(90deg);width:14px!important;z-index:10}.tag-group-open>div{background-color:#eceefd}.ia-select-container-v3-styled-menu{border:none;border-radius:12px;box-shadow:0 1px 6px #1a277c24;margin-top:6px;padding:8px 6px}.ia-select-search-box{background-position:12px;border-bottom:none;border-radius:8px 8px 0 0;font-family:Manrope,sans-serif;font-weight:400;height:35px;padding-left:30px}.ia-select-search-box:focus,.ia-select-search-box:focus-visible{border:none;box-shadow:none;outline:none}.ia-select-search-box::placeholder{font-weight:400}.ia-select-search-box:not(:placeholder-shown){font-weight:500}.css-13cymwt-control{display:none!important}.ia-select-label-v3{color:#60697d;font-family:Manrope,sans-serif;font-size:12px;font-weight:500}.ia-select-main-container-v3{gap:6px}.css-tr4s17-option{background-color:#edf0ff!important;border-radius:8px;color:#1f2b4d!important;font-family:Manrope,sans-serif;font-weight:500;height:36px;margin-bottom:2px}.ia-select-styled-dropdown-main-button{border:1px solid #c3c8d4;border-radius:8px;color:#1f2b4d;font-family:Manrope,sans-serif!important;font-weight:500;height:32px}.ia-select-styled-dropdown-main-button:focus-visible{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none;transition:box-shadow .15s ease-in-out}.ia-select-styled-dropdown-main-button:focus:not(:focus-visible){box-shadow:none;outline:none}.ia-select-styled-dropdown-main-button.Mui-disabled:focus-visible,.ia-select-styled-dropdown-main-button.ia-btn-disabled:focus-visible,.ia-select-styled-dropdown-main-button.ia-switch-disabled:focus-visible,.ia-select-styled-dropdown-main-button.impact-select-disabled:focus-visible,.ia-select-styled-dropdown-main-button.impact_input_disabled:focus-visible,.ia-select-styled-dropdown-main-button.route-disabled:focus-visible,.ia-select-styled-dropdown-main-button:disabled:focus-visible,.ia-select-styled-dropdown-main-button[aria-disabled=true]:focus-visible{box-shadow:none;outline:none}.ia-select-styled-dropdown-main-button.ia-select-button-keyboard-open{box-shadow:0 0 0 var(--ia-focus-ring-offset,2px) var(--ia-focus-bg,#fff),0 0 0 calc(var(--ia-focus-ring-offset, 2px) + var(--ia-focus-ring-width, 2px)) var(--ia-focus-color,#4259ee);outline:none}.ia-select-styled-dropdown-main-button:hover{border:1px solid #4259ee}.impact-select-error,.impact-select-error:hover{border:1px solid #e15554!important}.impact-select-disabled{background-color:#f2f4fb}.impact-select-disabled,.impact-select-disabled:hover{border:1px solid #d9dde7}.ia-select-loading-container{align-items:center;display:flex;justify-content:center;min-height:100px;width:100%}.ia-select-loading-more-container{height:92px!important}.default-select-tooltip,.select-tooltip{z-index:999999!important}.ia-select-dropdown-container{gap:4px}.ia-select-dropdown-v3{position:relative}.ia-select-dropdown-v3 .select__menu{position:relative;z-index:1}.ia-select-dropdown-v3 .menulistScroll{margin-top:3px;overflow-y:hidden;padding-bottom:0;padding-top:0!important}.ia-select-dropdown-v3 .menulistScroll .ia-select-no-options-message{align-items:center;color:#60697d;display:flex;font-weight:500;height:50px;justify-content:center;line-height:16px}.ia-select-dropdown-v3 .menulistScroll .css-d7l1ni-option{background-color:initial;border-radius:8px;height:35px;margin-bottom:2px}.ia-select-dropdown-v3 .menulistScroll .css-d7l1ni-option:focus,.ia-select-dropdown-v3 .menulistScroll .css-d7l1ni-option:hover{background-color:#f5f6fa}.ia-select-dropdown-v3 .css-1s9izoc,.ia-select-dropdown-v3 .css-qr46ko{padding:0}.ia-select-dropdown-v3 .css-1s9izoc{border-bottom:1px solid #d9dde7}.ia-select-dropdown-v3 .css-1s9izoc:last-child{border-bottom:none}.ia-select-dropdown-v3 .ia-select-group-heading-container{align-items:center;display:flex;height:35px;justify-content:space-between;padding:0 12px}.ia-select-dropdown-v3 .ia-select-group-heading-container .css-jtaw72-group{color:#b4bac7;font-size:12px;font-weight:700;line-height:20px;margin-bottom:0;padding:0;text-transform:capitalize}.ia-select-dropdown-v3 .ia-select-group-heading-left{gap:6px}.ia-select-dropdown-v3 .group-icon,.ia-select-dropdown-v3 .ia-select-group-heading-left{align-items:center;display:flex;justify-content:center}.ia-select-dropdown-v3 .group-icon svg{color:#60697d;height:16px;width:16px}.ia-select-dropdown-v3 .group-icon svg path{fill:#60697d}.ia-select-dropdown-v3 .ia-select-option{background-color:initial;cursor:pointer;margin-bottom:2px}.ia-select-dropdown-v3 .ia-select-option:has(.disabled){opacity:.5;pointer-events:none}.ia-select-dropdown-v3 .ia-select-option.submenu-active,.ia-select-dropdown-v3 .ia-select-option:hover{background-color:#f5f6fa;border-radius:8px}.ia-select-dropdown-v3 .ia-select-option.ia-select-option-highlighted{background-color:#f5f6fa;border-radius:8px;outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:-2px}.select-option-content .select-submenu-chevron{bottom:11px;color:#60697d;height:16px;position:absolute;right:12px;width:16px}.ia-select-submenu-header{background-color:#f9fafb;border-bottom:1px solid #e5e7eb;padding:8px 12px}.ia-select-submenu-header .ia-select-submenu-back{align-items:center;background:none;border:none;color:#6b7280;cursor:pointer;display:flex;font-size:14px;font-weight:500;gap:4px;padding:0}.ia-select-submenu-header .ia-select-submenu-back:hover{color:#374151}.ia-select-dropdown-container{display:flex;position:relative}.ia-select-dropdown-v3{flex:1}.select-label-with-icon{align-items:center;display:flex;flex:1;gap:8px;min-width:0}.select-label-with-icon span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ia-select-submenu{background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 2px 8px #00000014;max-height:200px;overflow-y:auto;overscroll-behavior:contain;padding:8px 6px;z-index:3}.ia-select-submenu-content .select-option-content:not(:first-child){margin-top:2px}.ia-select-submenu-content .select-option-content{padding:7.5px 0 7.5px 12px}.ia-select-submenu-content .select-option-content:hover{background-color:#f5f6fa!important;border-radius:8px;color:#1f2b4d!important}.ia-select-submenu-content .select-option-content.selected{background-color:#edf0ff!important;border-radius:8px;color:#1f2b4d!important}.ia-select-chevron-icon.disabled{cursor:not-allowed;filter:grayscale(100%);opacity:.4;opacity:.2;pointer-events:none}.ia-select-submenu-content .ia-select-option-highlighted{background-color:#f5f6fa!important;border-radius:8px;outline:2px solid var(--ia-focus-color,#4259ee);outline-offset:-2px}.ia-select-footer-message{align-items:center;border-top:1px solid #f5f6fa;display:flex;justify-content:space-between;padding:8px 12px 4px}.ia-select-footer-message .ia-select-max-selectable-options{background-position:0 1px;border:none;padding:0 0 0 20px}.ia-select-footer-message .ia-styles.ia-btn.ia-btn-with-icon{height:16px}.ia-select-footer-message .ia-select-footer-description{color:#60697d;font-size:12px;font-weight:500;line-height:16px}.ia-select-footer-message .ia-select-footer-action-button{color:#4259ee;cursor:pointer;font-size:12px;font-weight:500;padding:0;white-space:nowrap}')),document.head.appendChild(e)}}catch(o){console.error("vite-plugin-css-injected-by-js",o)}}();
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React__default, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import ReactSelect from "react-select";
import { Alert } from "../Alert/index.js";
import { CustomGroupHeading } from "./customGroupHeading.js";
import Dropdown from "./dropdown.js";
import { Checkbox } from "../Checkbox/index.js";
import { Toast } from "../Toast/index.js";
import { Tooltip } from "../Tooltip/index.js";
import { useClickOutside } from "./hooks/useClickOutside.js";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation.js";
import { useScrollIntoView } from "./hooks/useScrollIntoView.js";
import { useTypeahead } from "./hooks/useTypeahead.js";
import { MenuList } from "./menuList.js";
import { Option } from "./optionList.js";
import SearchFilter from "./SearchFilter.js";
import { SelectedOptionsTags } from "./selected-option-tags.js";
import { flattenOptions, handleSelectAllWhenCompLoads, handleDropdownClose, getPlaceholder, handleSearch, handleDropdownOpen } from "./utils.js";
import { HelperText } from "../common/HelperText/index.js";

import { useTranslation } from "../../i18n/useTranslation.js";
const selectStyles = {
  menu: () => ({})
};
const SUBMENU_MAX_HEIGHT = 200;
const countTotalSelectedOptions = (selectedOptions) => {
  if (!selectedOptions) return 0;
  if (Array.isArray(selectedOptions)) return selectedOptions.length;
  return selectedOptions.value !== void 0 ? 1 : 0;
};
const Select = React__default.memo(function Select2(props) {
  var _a, _b;
  const { t } = useTranslation();
  const {
    isOpen,
    setIsOpen,
    label,
    isRequired,
    name,
    placeholder,
    searchPlaceholder = t("select.searchPlaceholderDefault"),
    labelOrientation = "top",
    isMulti = false,
    isDisabled,
    isLoading,
    isWithIcon,
    isError,
    isWithSearch,
    isClearable,
    isWithSelectedOptionTags,
    toggleSelectAll,
    isSelectAll,
    icon,
    withPortal,
    dropDownPortalClassName,
    initialOptions,
    currentOptions,
    setCurrentOptions,
    selectedOptions = [],
    setSelectedOptions,
    portalContainer,
    isAgGridCellRenderer,
    onMenuScrollToBottom,
    setIsSelectAll,
    isWithSelectAll,
    isCloseWhenClickOutside = true,
    handleChange: externalOnChange,
    onSelectAll: externalOnSelectAll,
    onClearAll: externalOnClearAll,
    onSearch: externalOnSearch,
    onDropdownClose: externalOnDropdownClose,
    onDropdownOpen: externalOnDropdownOpen,
    minWidth,
    width,
    onBlur,
    isGrouped,
    selectId,
    id,
    "data-testid": dataTestId,
    column,
    customPlaceholderAfterSelect,
    isMultiInSubmenu = false,
    helperText,
    dropdownPosition,
    maxSelectableOptions,
    noOptionMessage = t("select.noOptionsAvailable"),
    isLoadingMore = false,
    onSearchBlur,
    showFooterMessage = {},
    selectionLabels = {},
    ...rest
  } = props;
  const resolvedSelectId = selectId ?? id;
  const [submenuOptions, setSubmenuOptions] = useState(null);
  const [submenuParent, setSubmenuParent] = useState(null);
  const flattenInitialOptions = flattenOptions(initialOptions);
  const searchBarRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const textSpanRef = useRef(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const memoizedOptions = useMemo(() => currentOptions, [currentOptions]);
  const flatOptions = useMemo(
    () => isGrouped ? flattenOptions(currentOptions) : currentOptions,
    [currentOptions, isGrouped]
  );
  const listboxId = useMemo(
    () => `ia-select-listbox-${resolvedSelectId || Math.random().toString(36).slice(2, 9)}`,
    [resolvedSelectId]
  );
  const submenuTimeoutRef = useRef(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, bottom: "auto", left: 0, width: 0 });
  const dropdownMenuRef = useRef(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [submenuHighlightedIndex, setSubmenuHighlightedIndex] = useState(-1);
  const [isSubmenuKeyboardActive, setIsSubmenuKeyboardActive] = useState(false);
  const [columnWidth, setColumnWidth] = useState(() => {
    var _a2, _b2;
    const width2 = ((_a2 = column == null ? void 0 : column.getActualWidth) == null ? void 0 : _a2.call(column)) ?? ((_b2 = column == null ? void 0 : column.getWidth) == null ? void 0 : _b2.call(column));
    return width2 !== void 0 ? width2 - 12 : void 0;
  });
  useEffect(() => {
    if (textSpanRef.current) {
      const isTruncated = textSpanRef.current.scrollWidth > textSpanRef.current.clientWidth;
      setIsTextTruncated(isTruncated);
    }
  }, [columnWidth, currentOptions, selectedOptions, placeholder]);
  useEffect(() => {
    var _a2;
    if (isAgGridCellRenderer && column) {
      const handleColumnResized = () => {
        var _a3, _b2;
        const newWidth = ((_a3 = column.getActualWidth) == null ? void 0 : _a3.call(column)) ?? ((_b2 = column.getWidth) == null ? void 0 : _b2.call(column));
        if (newWidth !== void 0) setColumnWidth(newWidth - 12);
      };
      (_a2 = column.addEventListener) == null ? void 0 : _a2.call(column, "widthChanged", handleColumnResized);
      return () => {
        var _a3;
        (_a3 = column.removeEventListener) == null ? void 0 : _a3.call(column, "widthChanged", handleColumnResized);
      };
    }
    return void 0;
  }, [isAgGridCellRenderer, column, columnWidth]);
  useClickOutside({
    isOpen,
    containerRef,
    menuRef,
    isCloseWhenClickOutside,
    onClose: (event) => {
      handleDropdownClose({
        externalOnDropdownClose,
        setCurrentOptions,
        initialOptions: isGrouped ? flattenInitialOptions : initialOptions,
        currentOptions,
        setIsOpen,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onBlur,
        event
      });
    }
  });
  useEffect(() => {
    if (isWithSelectAll) {
      handleSelectAllWhenCompLoads({
        currentOptions,
        selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : [],
        setSelectedOptions: (opts) => {
          setSelectedOptions(opts);
        }
      });
    }
  }, [isWithSelectAll]);
  const syncParentChildSelection = useCallback(
    (selectedArr2) => {
      if (!selectedArr2 || selectedArr2.length === 0) {
        setSelectedOptions([]);
        setIsSelectAll == null ? void 0 : setIsSelectAll(false);
        return;
      }
      let updated = [...selectedArr2];
      (initialOptions || []).forEach((parent) => {
        if (parent.children && parent.children.length > 0) {
          const allChildrenSelected = parent.children.every(
            (child) => updated.some((sel) => sel.value === child.value)
          );
          const parentSelected = updated.some((sel) => sel.value === parent.value);
          if (allChildrenSelected && !parentSelected) {
            updated.push(parent);
          } else if (!allChildrenSelected && parentSelected) {
            updated = updated.filter((sel) => sel.value !== parent.value);
          }
        }
      });
      setSelectedOptions(updated);
      setIsSelectAll == null ? void 0 : setIsSelectAll(
        updated.length === (initialOptions.length > 0 ? initialOptions.length : currentOptions.length)
      );
    },
    [initialOptions, currentOptions, setSelectedOptions, setIsSelectAll]
  );
  const closeDropdown = useCallback(
    (event) => {
      handleDropdownClose({
        externalOnDropdownClose,
        setCurrentOptions,
        initialOptions: isGrouped ? flattenInitialOptions : initialOptions,
        currentOptions,
        setIsOpen,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onBlur,
        event
      });
      setTimeout(() => {
        var _a2;
        return (_a2 = dropdownButtonRef.current) == null ? void 0 : _a2.focus();
      }, 0);
    },
    [
      externalOnDropdownClose,
      setCurrentOptions,
      initialOptions,
      isGrouped,
      flattenInitialOptions,
      currentOptions,
      setIsOpen,
      onBlur
    ]
  );
  const handleSelect = useCallback(
    (selectedValues, event, index) => {
      var _a2;
      if (!isMulti) {
        (_a2 = searchBarRef.current) == null ? void 0 : _a2.blur();
      }
      if ((event == null ? void 0 : event.action) === "clear") {
        if (externalOnChange) {
          externalOnChange([], event, index);
        }
        return;
      }
      if (isMulti) {
        let newSelectedOptions = Array.isArray(selectedOptions) ? [...selectedOptions] : [];
        const option = (event == null ? void 0 : event.option) || selectedValues;
        const isParent = !!(option.children && option.children.length > 0);
        const valuesSet = new Set(newSelectedOptions.map((o) => o.value));
        const isSelected = Array.isArray(option) ? option.some((opt) => valuesSet.has(opt.value)) : option ? valuesSet.has(option.value) : false;
        const currentCount = maxSelectableOptions !== void 0 ? countTotalSelectedOptions(selectedOptions) : 0;
        if (isParent) {
          if (!isSelected) {
            if (maxSelectableOptions !== void 0 && currentCount >= maxSelectableOptions) {
              return;
            }
            newSelectedOptions.push({ ...option, children: option.children });
          } else {
            newSelectedOptions = newSelectedOptions.filter((sel) => sel.value !== option.value);
          }
        } else {
          const parentOption = (initialOptions || []).find(
            (parent) => parent.children && parent.children.some((child) => child.value === option.value)
          );
          if (parentOption) {
            const parentIndex = newSelectedOptions.findIndex(
              (sel) => sel.value === parentOption.value
            );
            if (isSelected) {
              if (parentIndex !== -1) {
                const parent = { ...newSelectedOptions[parentIndex] };
                parent.children = (parent.children ?? []).filter(
                  (child) => child.value !== option.value
                );
                if (parent.children.length === 0) {
                  newSelectedOptions = newSelectedOptions.filter(
                    (sel) => sel.value !== parentOption.value
                  );
                } else {
                  newSelectedOptions[parentIndex] = parent;
                }
              }
            } else {
              if (parentIndex !== -1) {
                const parent = { ...newSelectedOptions[parentIndex] };
                if (!(parent.children ?? []).some((child) => child.value === option.value)) {
                  parent.children = [...parent.children ?? [], option];
                }
                newSelectedOptions[parentIndex] = parent;
              } else {
                if (maxSelectableOptions !== void 0 && currentCount >= maxSelectableOptions) {
                  return;
                }
                newSelectedOptions.push({ ...parentOption, children: [option] });
              }
            }
          } else {
            if (isSelected) {
              const optionValues = Array.isArray(option) ? option.map((o) => o.value) : [option.value];
              newSelectedOptions = newSelectedOptions.filter(
                (sel) => !optionValues.includes(sel.value)
              );
            } else {
              if (maxSelectableOptions !== void 0 && currentCount >= maxSelectableOptions) {
                return;
              }
              newSelectedOptions.push(option);
            }
          }
        }
        setSelectedOptions(newSelectedOptions);
        setIsSelectAll == null ? void 0 : setIsSelectAll(newSelectedOptions.length === initialOptions.length);
        if (externalOnChange) {
          externalOnChange(newSelectedOptions, event, index);
        }
        return;
      }
      if (isGrouped && isMulti) {
        const flattenSelectedValues = flattenOptions(selectedValues);
        setSelectedOptions(flattenSelectedValues);
        setIsSelectAll == null ? void 0 : setIsSelectAll(flattenSelectedValues.length === flattenInitialOptions.length);
        if (externalOnChange) {
          externalOnChange(flattenSelectedValues, event, index);
        }
      } else {
        setSelectedOptions(selectedValues);
        if (externalOnChange) {
          externalOnChange(selectedValues, event, index);
        }
      }
      if (isMulti && !isGrouped) {
        if (initialOptions.length > 0)
          setIsSelectAll == null ? void 0 : setIsSelectAll(
            Array.isArray(selectedValues) && selectedValues.length === initialOptions.length
          );
        else
          setIsSelectAll == null ? void 0 : setIsSelectAll(
            Array.isArray(selectedValues) && selectedValues.length === currentOptions.length
          );
      }
      if (!isMulti) {
        handleDropdownClose({
          externalOnDropdownClose,
          setCurrentOptions,
          initialOptions,
          currentOptions,
          setIsOpen,
          event: void 0
        });
      }
    },
    [
      isMulti,
      setIsSelectAll,
      setIsOpen,
      externalOnChange,
      initialOptions,
      selectedOptions,
      setSelectedOptions,
      flattenInitialOptions,
      isGrouped,
      currentOptions,
      maxSelectableOptions,
      externalOnDropdownClose,
      setCurrentOptions
    ]
  );
  const isMaxLimitReached = useMemo(() => {
    const total = countTotalSelectedOptions(selectedOptions);
    return maxSelectableOptions !== void 0 && total >= maxSelectableOptions;
  }, [maxSelectableOptions, selectedOptions]);
  const getOptionDisabled = useCallback((opt) => {
    return !!(opt.disabled || opt.isDisabled);
  }, []);
  const hasSelectAll = !!(isMulti && toggleSelectAll && !isLoading);
  const handleSelectAllToggle = useCallback(() => {
    const syntheticEvent = {
      target: { checked: !isSelectAll }
    };
    if (externalOnSelectAll) {
      externalOnSelectAll(syntheticEvent);
    } else if (!isSelectAll) {
      const currentSelected = Array.isArray(selectedOptions) ? selectedOptions : [];
      const restCurrentOptions = currentOptions.filter(
        (option) => !currentSelected.find((sel) => sel.label === option.label && option.value === sel.value)
      );
      const newSelected = [...currentSelected, ...restCurrentOptions];
      setIsSelectAll == null ? void 0 : setIsSelectAll(true);
      setSelectedOptions(newSelected);
      if (externalOnChange) externalOnChange(newSelected);
    } else {
      setIsSelectAll == null ? void 0 : setIsSelectAll(false);
      setSelectedOptions([]);
      if (externalOnChange) externalOnChange([]);
    }
  }, [
    isSelectAll,
    externalOnChange,
    externalOnSelectAll,
    currentOptions,
    selectedOptions,
    setSelectedOptions,
    setIsSelectAll
  ]);
  const handleOptionSelect = useCallback(
    (opt, index) => {
      var _a2, _b2;
      if (opt.children && opt.children.length > 0) {
        setSubmenuOptions(opt.children);
        setSubmenuParent(opt);
        setIsSubmenuKeyboardActive(true);
        setSubmenuHighlightedIndex(0);
        const optionNodes = (_a2 = dropdownMenuRef.current) == null ? void 0 : _a2.querySelectorAll('[role="option"]');
        const optionNode = optionNodes == null ? void 0 : optionNodes[index];
        const dropdownRect = (_b2 = dropdownMenuRef.current) == null ? void 0 : _b2.getBoundingClientRect();
        const optionRect = optionNode == null ? void 0 : optionNode.getBoundingClientRect();
        if (dropdownRect && optionRect) {
          const spaceBelow = window.innerHeight - optionRect.bottom;
          if (spaceBelow < SUBMENU_MAX_HEIGHT) {
            setSubmenuPosition({
              top: "auto",
              bottom: dropdownRect.bottom - optionRect.bottom,
              left: dropdownRect.width + 12,
              width: dropdownRect.width
            });
          } else {
            setSubmenuPosition({
              top: optionRect.top - dropdownRect.top,
              bottom: "auto",
              left: dropdownRect.width + 12,
              width: dropdownRect.width
            });
          }
        }
        return;
      }
      const actionMeta = { option: opt, action: "select-option" };
      if (isMulti) {
        handleSelect(selectedOptions, actionMeta, index);
      } else {
        handleSelect(opt, actionMeta, index);
        closeDropdown();
      }
    },
    [isMulti, selectedOptions, closeDropdown, handleSelect]
  );
  const {
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown: navKeyDown
  } = useKeyboardNavigation({
    options: flatOptions,
    isOpen,
    onSelect: handleOptionSelect,
    onClose: closeDropdown,
    isMulti,
    selectedOption: isMulti ? null : selectedOptions,
    getOptionDisabled,
    hasSelectAll,
    onSelectAllToggle: handleSelectAllToggle,
    onNavigateUp: isWithSearch && !hasSelectAll ? () => {
      var _a2;
      setIsKeyboardNav(false);
      (_a2 = searchBarRef.current) == null ? void 0 : _a2.focus();
    } : void 0
  });
  const { handleTypeahead, resetBuffer } = useTypeahead({
    options: flatOptions,
    setHighlightedIndex,
    isActive: isOpen && !isWithSearch
  });
  useScrollIntoView({
    highlightedIndex,
    listRef,
    isVirtualized: !isGrouped,
    containerRef: dropdownMenuRef,
    isKeyboardNav
  });
  const handleSubmenuKeyDown = useCallback(
    (e) => {
      var _a2, _b2;
      if (isSubmenuKeyboardActive && submenuOptions) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSubmenuHighlightedIndex((prev) => prev < submenuOptions.length - 1 ? prev + 1 : 0);
            return true;
          case "ArrowUp":
            e.preventDefault();
            setSubmenuHighlightedIndex((prev) => prev > 0 ? prev - 1 : submenuOptions.length - 1);
            return true;
          case "ArrowLeft":
            e.preventDefault();
            setIsSubmenuKeyboardActive(false);
            setSubmenuOptions(null);
            setSubmenuParent(null);
            setSubmenuHighlightedIndex(-1);
            return true;
          case "Escape":
            e.preventDefault();
            setIsSubmenuKeyboardActive(false);
            setSubmenuOptions(null);
            setSubmenuParent(null);
            setSubmenuHighlightedIndex(-1);
            return true;
          case "Enter":
          case " ": {
            e.preventDefault();
            if (submenuHighlightedIndex >= 0 && submenuHighlightedIndex < submenuOptions.length) {
              const submenuEl = (_a2 = dropdownMenuRef.current) == null ? void 0 : _a2.querySelector(".ia-select-submenu");
              const optionEls = submenuEl == null ? void 0 : submenuEl.querySelectorAll(".select-option-content");
              (_b2 = optionEls == null ? void 0 : optionEls[submenuHighlightedIndex]) == null ? void 0 : _b2.click();
            }
            return true;
          }
          default:
            return true;
        }
      }
      if (e.key === "ArrowRight" && highlightedIndex >= 0) {
        const currentOpt = flatOptions[highlightedIndex];
        if ((currentOpt == null ? void 0 : currentOpt.children) && currentOpt.children.length > 0) {
          e.preventDefault();
          handleOptionSelect(currentOpt, highlightedIndex);
          return true;
        }
      }
      return false;
    },
    [
      isSubmenuKeyboardActive,
      submenuOptions,
      submenuHighlightedIndex,
      highlightedIndex,
      flatOptions,
      handleOptionSelect
    ]
  );
  useEffect(() => {
    if (!isOpen) {
      resetBuffer();
      setIsKeyboardNav(false);
      setIsSubmenuKeyboardActive(false);
      setSubmenuHighlightedIndex(-1);
    }
  }, [isOpen, resetBuffer]);
  useEffect(() => {
    if (isOpen && isWithSearch) {
      setTimeout(() => {
        var _a2;
        return (_a2 = searchBarRef.current) == null ? void 0 : _a2.focus();
      }, 0);
    }
  }, [isOpen, isWithSearch]);
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);
  const handleOptionHover = useCallback(
    (option, _index, event) => {
      var _a2;
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
      if (option.children && option.children.length > 0) {
        const optionNode = event.currentTarget;
        const dropdownRect = (_a2 = dropdownMenuRef.current) == null ? void 0 : _a2.getBoundingClientRect();
        const optionRect = optionNode.getBoundingClientRect();
        if (dropdownRect && optionRect) {
          const spaceBelow = window.innerHeight - optionRect.bottom;
          const openUpward = spaceBelow < SUBMENU_MAX_HEIGHT;
          if (openUpward) {
            setSubmenuPosition({
              top: "auto",
              bottom: dropdownRect.bottom - optionRect.bottom,
              left: dropdownRect.width + 12,
              width: dropdownRect.width
            });
          } else {
            setSubmenuPosition({
              top: optionRect.top - dropdownRect.top,
              bottom: "auto",
              left: dropdownRect.width + 12,
              width: dropdownRect.width
            });
          }
        }
        setSubmenuOptions(option.children);
        setSubmenuParent(option);
        setIsSubmenuHovered(true);
      } else {
        setIsSubmenuHovered(false);
        setSubmenuOptions(null);
        setSubmenuParent(null);
      }
    },
    []
  );
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);
  function handleSelectAllWrapper(event) {
    if (externalOnSelectAll) {
      externalOnSelectAll(event);
    } else {
      if (event && event.target.checked) {
        setIsSelectAll == null ? void 0 : setIsSelectAll(true);
        const currentSelected = Array.isArray(selectedOptions) ? selectedOptions : [];
        const restCurrentOptions = currentOptions.filter(
          (option) => !currentSelected.find((sel) => sel.label === option.label && option.value === sel.value)
        );
        const merged = [...currentSelected, ...restCurrentOptions];
        setSelectedOptions(merged);
        if (externalOnChange) externalOnChange(merged);
      } else {
        setIsSelectAll == null ? void 0 : setIsSelectAll(false);
        setSelectedOptions([]);
        if (externalOnChange) externalOnChange([]);
      }
    }
  }
  function handleClearAllWrapper() {
    if (externalOnClearAll) {
      externalOnClearAll();
      setSelectedOptions([]);
      setIsSelectAll == null ? void 0 : setIsSelectAll(false);
    } else {
      handleSelect([], { action: "clear" });
      setSelectedOptions([]);
      setIsSelectAll == null ? void 0 : setIsSelectAll(false);
    }
    syncParentChildSelection([]);
  }
  const portalContainerResolved = typeof document !== "undefined" ? portalContainer ?? document.body : null;
  if (isMulti && !setIsSelectAll) {
    return /* @__PURE__ */ jsx(
      Alert,
      {
        description: t("select.errorMultiRequiresSelectAll"),
        severity: "error",
        title: t("select.errorTitle")
      }
    );
  }
  const selectedArr = Array.isArray(selectedOptions) ? selectedOptions : [];
  const placeholderText = getPlaceholder(
    isMulti,
    selectedOptions,
    placeholder,
    customPlaceholderAfterSelect,
    selectionLabels,
    t
  );
  const isPlaceholder = placeholderText === placeholder;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `ia-select-main-container-v3 ${labelOrientation === "top" ? "top-orientation" : ""} ${isAgGridCellRenderer ? "isAgGridCellRenderer" : ""}`,
      children: [
        label && /* @__PURE__ */ jsxs("div", { className: "ia-select-label-v3", children: [
          label,
          " ",
          isRequired && /* @__PURE__ */ jsx("span", { style: { color: "red" }, children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: containerRef,
            style: {
              width: isAgGridCellRenderer ? "100%" : minWidth ?? width ?? "auto",
              minWidth: isAgGridCellRenderer ? "0" : minWidth ?? width ?? "auto",
              maxWidth: isAgGridCellRenderer ? columnWidth != null ? columnWidth : "100%" : "none"
            },
            children: /* @__PURE__ */ jsxs(
              Dropdown,
              {
                containerRef,
                disabled: isDisabled,
                dropdownButtonRef,
                dropDownPortalClassName,
                dropdownPosition,
                isKeyboardNav,
                isOpen,
                menuRef,
                portalContainer: portalContainerResolved,
                target: /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      ref: dropdownButtonRef,
                      "aria-activedescendant": isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : void 0,
                      "aria-controls": isOpen ? listboxId : void 0,
                      "aria-expanded": !!isOpen,
                      "aria-haspopup": "listbox",
                      className: `ia-select-styled-dropdown-main-button ${isError ? "impact-select-error" : ""} ${isDisabled ? "impact-select-disabled" : ""} ${isClearable ? "is-with-clearable" : ""} ${isOpen && isKeyboardNav && isWithSearch ? "ia-select-button-keyboard-open" : ""}`,
                      "data-testid": dataTestId,
                      disabled: isDisabled,
                      id: resolvedSelectId,
                      name,
                      role: "combobox",
                      style: {
                        minWidth: isAgGridCellRenderer ? "0" : minWidth ?? "240px",
                        width: isAgGridCellRenderer ? "100%" : width ?? minWidth ?? "240px",
                        maxWidth: isAgGridCellRenderer ? columnWidth != null ? columnWidth : "100%" : "300px",
                        flex: isAgGridCellRenderer ? "1 1 auto" : "none"
                      },
                      type: "button",
                      onBlur: (e) => {
                        if (!isMulti) {
                          e.preventDefault();
                          e.stopPropagation();
                          e.target.value = String(
                            (selectedOptions == null ? void 0 : selectedOptions.value) ?? ""
                          );
                          if (onBlur) onBlur(e);
                        }
                      },
                      onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsKeyboardNav(false);
                        isOpen ? handleDropdownClose({
                          externalOnDropdownClose,
                          setCurrentOptions,
                          initialOptions,
                          currentOptions,
                          setIsOpen,
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onBlur,
                          event: e
                        }) : handleDropdownOpen({
                          externalOnDropdownOpen,
                          isOpen,
                          setIsOpen
                        });
                      },
                      onKeyDown: (e) => {
                        if (!isOpen) {
                          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
                            e.preventDefault();
                            setIsKeyboardNav(true);
                            handleDropdownOpen({ externalOnDropdownOpen, isOpen, setIsOpen });
                            return;
                          }
                          return;
                        }
                        setIsKeyboardNav(true);
                        if (handleSubmenuKeyDown(e)) return;
                        if (!isWithSearch) {
                          const consumed = handleTypeahead(e);
                          if (consumed) return;
                        }
                        navKeyDown(e);
                      },
                      children: [
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: `ia-select-button-text ${isPlaceholder ? "placeholder" : ""} ${!(isClearable && selectedOptions || isMulti && selectedArr.length > 0 && isClearable) ? "ia-select-button-text-full-width" : ""} ${isAgGridCellRenderer ? "impact-select-table" : ""}`,
                            children: [
                              isWithIcon && icon,
                              isTextTruncated ? /* @__PURE__ */ jsx(
                                Tooltip,
                                {
                                  orientation: "top",
                                  title: getPlaceholder(
                                    isMulti,
                                    selectedOptions,
                                    placeholder,
                                    customPlaceholderAfterSelect,
                                    selectionLabels,
                                    t
                                  ),
                                  variant: "tertiary",
                                  children: /* @__PURE__ */ jsx("span", { ref: textSpanRef, className: "ia-select-button-text-span", children: isMultiInSubmenu && !isMulti && selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.children && (selectedOptions.children.length ?? 0) > 0 ? selectedOptions.children.length === 1 ? (_a = selectedOptions.children[0]) == null ? void 0 : _a.label : `${selectionLabels.selected ?? "Selected"} (${selectedOptions.children.length})` : placeholderText })
                                }
                              ) : /* @__PURE__ */ jsx("span", { ref: textSpanRef, className: "ia-select-button-text-span", children: !isMulti && selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.children && (selectedOptions.children.length ?? 0) > 0 ? selectedOptions.children.length === 1 ? (_b = selectedOptions.children[0]) == null ? void 0 : _b.label : `${selectionLabels.selected ?? "Selected"} (${selectedOptions.children.length})` : placeholderText })
                            ]
                          }
                        ),
                        isMulti && selectedArr.length > 0 && isClearable && /* @__PURE__ */ jsx(
                          "div",
                          {
                            "aria-label": t("select.ariaClearSelection"),
                            className: "ia-select-button-clear-icon",
                            role: "button",
                            tabIndex: 0,
                            onClick: (event) => {
                              event.stopPropagation();
                              if (externalOnClearAll) {
                                externalOnClearAll();
                              } else {
                                setSelectedOptions([]);
                                setIsSelectAll == null ? void 0 : setIsSelectAll(false);
                                syncParentChildSelection([]);
                              }
                            },
                            onKeyDown: (event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                if (externalOnClearAll) {
                                  externalOnClearAll();
                                } else {
                                  setSelectedOptions([]);
                                  setIsSelectAll == null ? void 0 : setIsSelectAll(false);
                                  syncParentChildSelection([]);
                                }
                              }
                            }
                          }
                        ),
                        !isMulti && isClearable && selectedOptions && !Array.isArray(selectedOptions) && Object.keys(selectedOptions).length > 0 && /* @__PURE__ */ jsx(
                          "div",
                          {
                            "aria-label": t("select.ariaClearSelection"),
                            className: "ia-select-button-clear-icon",
                            role: "button",
                            tabIndex: 0,
                            onClick: (event) => {
                              event.stopPropagation();
                              if (externalOnClearAll) {
                                externalOnClearAll();
                              } else {
                                setSelectedOptions([]);
                                setIsSelectAll == null ? void 0 : setIsSelectAll(false);
                                syncParentChildSelection([]);
                              }
                            },
                            onKeyDown: (event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                if (externalOnClearAll) {
                                  externalOnClearAll();
                                } else {
                                  setSelectedOptions([]);
                                  setIsSelectAll == null ? void 0 : setIsSelectAll(false);
                                  syncParentChildSelection([]);
                                }
                              }
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `ia-select-chevron-icon ${isOpen ? "open" : ""} ${isDisabled ? "disabled" : ""}`
                          }
                        )
                      ]
                    }
                  ),
                  helperText && /* @__PURE__ */ jsx(
                    HelperText,
                    {
                      error: isError,
                      helper: isError ? helperText : "",
                      minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth
                    }
                  ),
                  isMulti && isWithSelectedOptionTags && /* @__PURE__ */ jsx(
                    SelectedOptionsTags,
                    {
                      selectedOptions: selectedArr,
                      onChange: (opts) => {
                        handleSelect(opts);
                      }
                    }
                  )
                ] }),
                withPortal,
                onClose: (event) => {
                  handleDropdownClose({
                    externalOnDropdownClose,
                    setCurrentOptions,
                    initialOptions,
                    currentOptions,
                    setIsOpen,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onBlur,
                    event
                  });
                },
                children: [
                  /* @__PURE__ */ jsx(
                    SearchFilter,
                    {
                      ref: searchBarRef,
                      externalOnSearch,
                      highlightedIndex,
                      isClearable,
                      isLoading,
                      isMulti,
                      isSelectAll,
                      isSelectAllHighlighted: isKeyboardNav && hasSelectAll && highlightedIndex === -1,
                      isWithSearch,
                      searchPlaceholder,
                      searchTerm,
                      selectedOptions,
                      selectionLabels,
                      setHighlightedIndex,
                      setIsKeyboardNav,
                      setSearchTerm,
                      toggleSelectAll,
                      onClearAll: handleClearAllWrapper,
                      onClose: closeDropdown,
                      onKeyDown: navKeyDown,
                      onSearch: (event) => {
                        handleSearch({
                          event,
                          externalOnSearch,
                          initialOptions,
                          setCurrentOptions,
                          setSearchTerm
                        });
                      },
                      onSearchBlur,
                      onSelectAll: handleSelectAllWrapper,
                      onSubmenuKeyDown: handleSubmenuKeyDown
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { ref: dropdownMenuRef, className: "ia-select-dropdown-container", children: [
                    /* @__PURE__ */ jsx(
                      ReactSelect,
                      {
                        ...rest,
                        autoFocus: true,
                        menuIsOpen: true,
                        backspaceRemovesValue: false,
                        captureMenuScroll: false,
                        className: "ia-select-dropdown-v3",
                        classNames: {
                          option: ({ data }) => {
                            const opt = data;
                            const optIdx = flatOptions.findIndex((o) => o.value === (opt == null ? void 0 : opt.value));
                            return `ia-select-option${(submenuParent == null ? void 0 : submenuParent.value) === (opt == null ? void 0 : opt.value) ? " submenu-active" : ""}${isKeyboardNav && optIdx >= 0 && optIdx === highlightedIndex ? " ia-select-option-highlighted" : ""}`;
                          }
                        },
                        components: {
                          IndicatorSeparator: null,
                          Option: (optionProps) => {
                            var _a2, _b2, _c, _d;
                            const data = optionProps.data;
                            const optionIndex = flatOptions.findIndex((opt) => opt.value === data.value);
                            const parentOption = (initialOptions || []).find(
                              (parent) => parent.children && parent.children.some((child) => child.value === data.value)
                            );
                            let isSelected;
                            if (!isMulti) {
                              if (isMultiInSubmenu) {
                                if (parentOption) {
                                  isSelected = !!(selectedOptions && !Array.isArray(selectedOptions) && ((_a2 = selectedOptions.children) == null ? void 0 : _a2.some(
                                    (child) => child.value === data.value
                                  )));
                                } else if (data.children) {
                                  isSelected = !!(selectedOptions && !Array.isArray(selectedOptions) && ((_b2 = selectedOptions.children) == null ? void 0 : _b2.length) && selectedOptions.value === data.value);
                                } else {
                                  isSelected = !!(selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.value === data.value);
                                }
                              } else {
                                if (parentOption) {
                                  isSelected = !!(selectedOptions && !Array.isArray(selectedOptions) && ((_c = selectedOptions.children) == null ? void 0 : _c.some(
                                    (child) => child.value === data.value
                                  )));
                                } else if (data.children) {
                                  isSelected = !!(selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.value === data.value);
                                } else {
                                  isSelected = !!(selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.value === data.value);
                                }
                              }
                            } else {
                              if (parentOption) {
                                const selectedParent = Array.isArray(selectedOptions) ? selectedOptions.find((sel) => sel.value === parentOption.value) : null;
                                isSelected = !!(selectedParent && ((_d = selectedParent.children) == null ? void 0 : _d.some((child) => child.value === data.value)));
                              } else {
                                isSelected = Array.isArray(selectedOptions) ? selectedOptions.some((sel) => sel.value === data.value) : false;
                              }
                            }
                            const shouldDisableOption = isMaxLimitReached && !isSelected && isMulti;
                            return /* @__PURE__ */ jsx(
                              Option,
                              {
                                ...optionProps,
                                isSelected,
                                selectedOptions,
                                initialOptions,
                                isDisabled: shouldDisableOption || !!(data == null ? void 0 : data.disabled) || !!(data == null ? void 0 : data.isDisabled),
                                customOptionProps: {
                                  onMouseEnter: (e) => {
                                    handleOptionHover(data, optionIndex, e);
                                  }
                                }
                              }
                            );
                          },
                          ...!isGrouped && { MenuList },
                          ...isGrouped && {
                            GroupHeading: CustomGroupHeading
                          }
                        },
                        controlShouldRenderValue: true,
                        hideSelectedOptions: false,
                        isClearable,
                        isLoading,
                        isMulti,
                        menuShouldBlockScroll: false,
                        options: memoizedOptions,
                        placeholder: t("select.searchPlaceholder"),
                        styles: selectStyles,
                        tabSelectsValue: false,
                        value: selectedOptions,
                        onChange: (selectedValues, actionMeta) => {
                          const option = actionMeta == null ? void 0 : actionMeta.option;
                          const idx = flatOptions.findIndex(
                            (opt) => opt.value === ((option == null ? void 0 : option.value) ?? (selectedValues == null ? void 0 : selectedValues.value))
                          );
                          if (!isMulti) {
                            actionMeta.option = selectedValues;
                          }
                          handleSelect(
                            selectedValues,
                            actionMeta,
                            idx
                          );
                        },
                        onMenuScrollToBottom,
                        maxMenuHeight: 190,
                        ...{
                          noOptionMessage,
                          maxSelectableOptions,
                          isLoadingMore,
                          showFooterMessage,
                          listboxId,
                          highlightedIndex,
                          setHighlightedIndex,
                          isKeyboardNav,
                          setIsKeyboardNav,
                          listRef,
                          submenuParent
                        }
                      }
                    ),
                    submenuOptions && /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "ia-select-submenu",
                        style: {
                          position: "absolute",
                          top: submenuPosition.top,
                          bottom: submenuPosition.bottom,
                          left: submenuPosition.left,
                          width: submenuPosition.width
                        },
                        onMouseEnter: () => {
                          setIsSubmenuHovered(true);
                          if (submenuTimeoutRef.current) {
                            clearTimeout(submenuTimeoutRef.current);
                          }
                        },
                        onMouseLeave: () => {
                          setIsSubmenuHovered(false);
                          submenuTimeoutRef.current = setTimeout(() => {
                            if (!isSubmenuHovered) {
                              setSubmenuOptions(null);
                              setSubmenuParent(null);
                            }
                          }, 100);
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            "aria-label": t("select.ariaSubmenuOptions"),
                            className: "ia-select-submenu-content",
                            role: "listbox",
                            children: submenuOptions.map((option, subIdx) => {
                              var _a2, _b2;
                              const isChildSelected = !isMulti ? isMultiInSubmenu ? !!(selectedOptions && !Array.isArray(selectedOptions) && ((_a2 = selectedOptions.children) == null ? void 0 : _a2.some((child) => child.value === option.value))) : !!(selectedOptions && !Array.isArray(selectedOptions) && ((_b2 = selectedOptions.children) == null ? void 0 : _b2.some((child) => child.value === option.value))) : (() => {
                                const selectedOptionsArray = Array.isArray(selectedOptions) ? selectedOptions : [];
                                const parentOpt = submenuParent ? selectedOptionsArray.find((sel) => sel.value === submenuParent.value) : null;
                                return parentOpt ? (parentOpt.children ?? []).some(
                                  (child) => child.value === option.value
                                ) : false;
                              })();
                              const isSubHighlighted = isSubmenuKeyboardActive && subIdx === submenuHighlightedIndex;
                              return /* @__PURE__ */ jsx(
                                "div",
                                {
                                  "aria-selected": !!isChildSelected,
                                  className: `select-option-content${isChildSelected ? " selected" : ""}${isSubHighlighted ? " ia-select-option-highlighted" : ""}`,
                                  id: `${listboxId}-submenu-option-${subIdx}`,
                                  role: "option",
                                  onClick: (event) => {
                                    if (!isMulti) {
                                      if (isMultiInSubmenu) {
                                        if (isChildSelected) {
                                          const single = selectedOptions;
                                          if (single.children) {
                                            const updatedChildren = single.children.filter(
                                              (child) => child.value !== option.value
                                            );
                                            if (updatedChildren.length === 0) {
                                              setSelectedOptions(null);
                                              if (externalOnChange)
                                                externalOnChange(null, { option }, void 0);
                                            } else {
                                              const newSelected = { ...single, children: updatedChildren };
                                              setSelectedOptions(newSelected);
                                              if (externalOnChange)
                                                externalOnChange(newSelected, { option }, void 0);
                                            }
                                          }
                                        } else {
                                          if (!selectedOptions) {
                                            if (maxSelectableOptions !== void 0) {
                                              const currentCount = countTotalSelectedOptions(selectedOptions);
                                              if (currentCount >= maxSelectableOptions) {
                                                return;
                                              }
                                            }
                                            const newSelected = { ...submenuParent, children: [option] };
                                            setSelectedOptions(newSelected);
                                            if (externalOnChange)
                                              externalOnChange(newSelected, { option }, void 0);
                                          } else if (selectedOptions.value === (submenuParent == null ? void 0 : submenuParent.value)) {
                                            const single = selectedOptions;
                                            const newSelected = {
                                              ...single,
                                              children: [...single.children ?? [], option]
                                            };
                                            setSelectedOptions(newSelected);
                                            if (externalOnChange)
                                              externalOnChange(newSelected, { option }, void 0);
                                          } else {
                                            if (maxSelectableOptions !== void 0) {
                                              const currentCount = countTotalSelectedOptions(selectedOptions);
                                              if (currentCount >= maxSelectableOptions) {
                                                return;
                                              }
                                            }
                                            const newSelected = { ...submenuParent, children: [option] };
                                            setSelectedOptions(newSelected);
                                            if (externalOnChange)
                                              externalOnChange(newSelected, { option }, void 0);
                                          }
                                        }
                                      } else {
                                        const newSelected = { ...submenuParent, children: [option] };
                                        setSelectedOptions(newSelected);
                                        if (externalOnChange)
                                          externalOnChange(newSelected, { option }, void 0);
                                        handleDropdownClose({
                                          externalOnDropdownClose,
                                          setCurrentOptions,
                                          initialOptions,
                                          currentOptions,
                                          setIsOpen,
                                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                          onBlur,
                                          event
                                        });
                                      }
                                    } else {
                                      const newSelectedOptions = Array.isArray(selectedOptions) ? [...selectedOptions] : [];
                                      const parentIndex = newSelectedOptions.findIndex(
                                        (sel) => sel.value === (submenuParent == null ? void 0 : submenuParent.value)
                                      );
                                      if (isChildSelected) {
                                        if (parentIndex !== -1) {
                                          const parent = { ...newSelectedOptions[parentIndex] };
                                          parent.children = (parent.children ?? []).filter(
                                            (child) => child.value !== option.value
                                          );
                                          if (parent.children.length === 0) {
                                            newSelectedOptions.splice(parentIndex, 1);
                                          } else {
                                            newSelectedOptions[parentIndex] = parent;
                                          }
                                        }
                                      } else {
                                        if (parentIndex !== -1) {
                                          const parent = { ...newSelectedOptions[parentIndex] };
                                          if (!(parent.children ?? []).some(
                                            (child) => child.value === option.value
                                          )) {
                                            parent.children = [...parent.children ?? [], option];
                                          }
                                          newSelectedOptions[parentIndex] = parent;
                                        } else {
                                          if (maxSelectableOptions !== void 0) {
                                            const currentCount = countTotalSelectedOptions(selectedOptions);
                                            if (currentCount >= maxSelectableOptions) {
                                              return;
                                            }
                                          }
                                          newSelectedOptions.push({
                                            ...submenuParent,
                                            children: [option]
                                          });
                                        }
                                      }
                                      setSelectedOptions(newSelectedOptions);
                                      if (externalOnChange)
                                        externalOnChange(newSelectedOptions, { option }, void 0);
                                    }
                                  },
                                  children: isMulti || isMultiInSubmenu ? /* @__PURE__ */ jsx(
                                    Checkbox,
                                    {
                                      checked: isChildSelected,
                                      label: /* @__PURE__ */ jsx("div", { className: "select-label-with-icon", children: option.label }),
                                      withoutFormLabel: true,
                                      onChange: () => null
                                    }
                                  ) : /* @__PURE__ */ jsx("div", { className: "select-label-with-icon", children: option.label })
                                },
                                option.value
                              );
                            })
                          }
                        )
                      }
                    )
                  ] })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Toast,
          {
            isOpen: openToast,
            message: toastMessage,
            position: "top-right",
            variant: "error",
            onClose: () => {
              setOpenToast(false);
            }
          }
        )
      ]
    }
  );
});
Select.displayName = "Select";
export {
  Select
};
