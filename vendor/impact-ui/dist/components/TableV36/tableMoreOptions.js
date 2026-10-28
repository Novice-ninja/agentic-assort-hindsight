import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { getAssetUrl } from "../../utils/assetBase.js";
import TableSettings from "./tableSettings.js";
import { Button } from "../Button/index.js";
import { getTableMeta } from "./tableFunctions.js";
const tableSettingsIcon = getAssetUrl("icons/tableSettingIcon.svg");
getAssetUrl("icons/compress.svg");
const tableSortIcon = getAssetUrl("icons/tableSortIcon.svg");
function TableMoreOptions({
  showMenu,
  extraButtons,
  hideRowHeightOptionMenu,
  onRowHeightChange,
  rowHeight,
  isGroupRows,
  actualRef,
  Columns,
  handleMenuClick,
  tableFontSize,
  setTableFontSize,
  onNumberFormatChange,
  colDefs,
  setShowMenu,
  showTableSetting,
  setShowTableSetting,
  setTableSettingOpen,
  showHideEditableCells,
  handleShowHideEditableCells,
  tableActions,
  onTableActionsTabClick,
  showFilterStrip,
  hideTableFormat,
  hideTableActions,
  explicitlyCloseTableSetting,
  savedViewsOptions,
  handleSaveAndApply,
  maxSavedViews,
  handleSavedViewClick,
  handleEditSaveView,
  isSaveViewEnabled,
  isSavingViewLoading,
  handleDeleteViewClick,
  isDeleteViewLoading,
  handleSetDefaultView,
  hideFontSize,
  hideNumericFormat,
  onContentDensityChange,
  customTabInTableSettings,
  saveViewCustomFilter,
  customRenderSaveViewContent,
  onTableSettingClick,
  deleteViewPromptText,
  isViewNameUniqueAcrossTypes,
  tableSettingsTitle,
  registerTableSettingToggle,
  numericFormatDefault,
  extraNumericFormatOptions,
  onAdvanceSortClick,
  advanceSortEnabled = true
}) {
  var _a, _b;
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [showEditableCells, setShowEditableCells] = useState(false);
  const handleDensityMenuOpen = (e) => {
    e.stopPropagation();
    setShowDensityMenu(!showDensityMenu);
  };
  const handleDensityMenuClose = () => {
    setShowDensityMenu(false);
  };
  const handleTableSettingClick = () => {
    setShowTableSetting(true);
    setTableSettingOpen(true);
    onTableSettingClick(true);
  };
  const handleClickOutside = (e) => {
    if (showDensityMenu && !e.target.closest(".density-menu-container")) {
      setShowDensityMenu(false);
      setTableSettingOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDensityMenu]);
  const handleChange = () => {
    if (isExpand) {
      actualRef.current.api.collapseAll();
      setIsExpand(false);
      const meta = getTableMeta(actualRef.current.api);
      if (meta) meta.isExpand = false;
    } else {
      actualRef.current.api.expandAll();
      setIsExpand(true);
      const meta = getTableMeta(actualRef.current.api);
      if (meta) meta.isExpand = true;
    }
  };
  useEffect(() => {
    setShowDensityMenu(false);
    setShowMenu(false);
  }, [explicitlyCloseTableSetting]);
  useEffect(() => {
    var _a2;
    const meta = getTableMeta((_a2 = actualRef == null ? void 0 : actualRef.current) == null ? void 0 : _a2.api);
    if (meta) {
      meta.isTableSettingOpen = showTableSetting;
    }
  }, [showTableSetting]);
  useEffect(() => {
    var _a2, _b2;
    setIsExpand((_b2 = getTableMeta((_a2 = actualRef == null ? void 0 : actualRef.current) == null ? void 0 : _a2.api)) == null ? void 0 : _b2.isExpand);
  }, [(_b = getTableMeta((_a = actualRef == null ? void 0 : actualRef.current) == null ? void 0 : _a.api)) == null ? void 0 : _b.isExpand]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !showTableSetting && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `table-more-options-container ${showMenu ? "display-table-more-options" : ""}`,
        children: [
          extraButtons,
          extraButtons ? /* @__PURE__ */ jsx("div", { className: "horizontal-line" }) : null,
          /* @__PURE__ */ jsxs("div", { className: "table-option-footer-wrapper", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `table-settings-container ${!extraButtons ? "table-settings-container-without-extra-buttons" : ""}`,
                tabIndex: 0,
                onClick: handleTableSettingClick,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTableSettingClick();
                  }
                },
                children: [
                  /* @__PURE__ */ jsx("img", { alt: "tableOptionButtonIcon", src: tableSettingsIcon }),
                  /* @__PURE__ */ jsx("span", { className: "table-settings-text", children: "Table Settings" })
                ]
              }
            ),
            !hideRowHeightOptionMenu && /* @__PURE__ */ jsxs("div", { className: "density-menu-wrapper", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `table-settings-container table-density-container ${showDensityMenu ? "density-menu-open" : ""}`,
                  tabIndex: 0,
                  onClick: handleDensityMenuOpen,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleDensityMenuOpen(e);
                    }
                  },
                  children: /* @__PURE__ */ jsx("span", { className: "table-settings-text", children: "Row size" })
                }
              ),
              showDensityMenu && /* @__PURE__ */ jsxs("div", { className: "density-menu-container", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `density-menu-item default_menu ${rowHeight === 46 ? "selected" : ""}`,
                    tabIndex: 0,
                    onClick: () => {
                      onRowHeightChange(46);
                      handleDensityMenuClose();
                      onContentDensityChange == null ? void 0 : onContentDensityChange("default");
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowHeightChange(46);
                        handleDensityMenuClose();
                        onContentDensityChange == null ? void 0 : onContentDensityChange("default");
                      }
                    },
                    children: /* @__PURE__ */ jsx("span", { className: "density-menu-item-text", children: "Medium" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `density-menu-item compact_menu ${rowHeight === 30 ? "selected" : ""}`,
                    tabIndex: 0,
                    onClick: () => {
                      onRowHeightChange(30);
                      handleDensityMenuClose();
                      onContentDensityChange == null ? void 0 : onContentDensityChange("compact");
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowHeightChange(30);
                        handleDensityMenuClose();
                        onContentDensityChange == null ? void 0 : onContentDensityChange("compact");
                      }
                    },
                    children: /* @__PURE__ */ jsx("span", { className: "density-menu-item-text", children: "Small" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `density-menu-item comfort_menu ${rowHeight === 52 ? "selected" : ""}`,
                    tabIndex: 0,
                    onClick: () => {
                      onRowHeightChange(52);
                      handleDensityMenuClose();
                      onContentDensityChange == null ? void 0 : onContentDensityChange("comfort");
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowHeightChange(52);
                        handleDensityMenuClose();
                        onContentDensityChange == null ? void 0 : onContentDensityChange("comfort");
                      }
                    },
                    children: /* @__PURE__ */ jsx("span", { className: "density-menu-item-text", children: "Large" })
                  }
                )
              ] })
            ] }),
            advanceSortEnabled && onAdvanceSortClick && /* @__PURE__ */ jsxs(
              "div",
              {
                className: "table-settings-container",
                tabIndex: 0,
                onClick: () => {
                  onAdvanceSortClick();
                  setShowMenu(false);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onAdvanceSortClick();
                    setShowMenu(false);
                  }
                },
                children: [
                  /* @__PURE__ */ jsx("img", { alt: "advance sort", src: tableSortIcon }),
                  /* @__PURE__ */ jsx("span", { className: "table-settings-text", children: "Advance Sort" })
                ]
              }
            ),
            showHideEditableCells ? /* @__PURE__ */ jsx("div", { className: "show-hide-editable-cells-container", children: /* @__PURE__ */ jsx(
              Button,
              {
                className: showEditableCells ? "show-editable-cells-icon" : "hide-editable-cells-icon",
                "data-icon": "show-hide-editable-cells",
                "data-type": "table-icon",
                variant: "secondary",
                onClick: () => {
                  setShowEditableCells(!showEditableCells);
                  handleShowHideEditableCells();
                },
                children: !showEditableCells ? "Hide editable cells" : "Show editable cells"
              }
            ) }) : null,
            isGroupRows ? /* @__PURE__ */ jsx("div", { className: "group-row-container", children: /* @__PURE__ */ jsx(
              Button,
              {
                className: isExpand ? "expand-icon" : "collapse-icon",
                "data-icon": "unfold-row-group",
                "data-type": "table-icon",
                variant: "secondary",
                onClick: handleChange,
                children: !isExpand ? "Expand all rows" : "Collapse all rows"
              }
            ) }) : null
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `${showTableSetting ? "show-table-settings" : ""} table-settings-wrapper`, children: /* @__PURE__ */ jsx(
      TableSettings,
      {
        actualRef,
        colDefs,
        Columns,
        customRenderSaveViewContent,
        customTabInTableSettings,
        deleteViewPromptText,
        handleDeleteViewClick,
        handleEditSaveView,
        handleMenuClick,
        handleSaveAndApply,
        handleSavedViewClick,
        handleSetDefaultView,
        hideFontSize,
        hideNumericFormat,
        hideTableActions,
        hideTableFormat,
        isDeleteViewLoading,
        isSaveViewEnabled,
        isSavingViewLoading,
        isViewNameUniqueAcrossTypes,
        maxSavedViews,
        numericFormatDefault,
        extraNumericFormatOptions,
        registerTableSettingToggle,
        savedViewsOptions,
        saveViewCustomFilter,
        setShowMenu,
        setShowTableSetting,
        setTableFontSize,
        setTableSettingOpen,
        showFilterStrip,
        showMenu,
        showTableSetting,
        tableActions,
        tableFontSize,
        tableSettingsTitle,
        onNumberFormatChange,
        onTableActionsTabClick,
        onTableSettingClick
      }
    ) })
  ] });
}
export {
  TableMoreOptions as default
};
