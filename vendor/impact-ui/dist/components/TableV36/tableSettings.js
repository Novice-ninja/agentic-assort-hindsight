import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import default_1$2 from "../../node_modules/@mui/icons-material/AutoFixHigh.js";
import default_1$1 from "../../node_modules/@mui/icons-material/FormatColorTextOutlined.js";
import default_1 from "../../node_modules/@mui/icons-material/ViewColumnOutlined.js";
import { RadioButtonGroup } from "../RadioButtonGroup/index.js";
import { Tabs } from "../Tabs/index.js";
function TableSettings({
  showMenu,
  Columns,
  actualRef,
  tableFontSize,
  setTableFontSize,
  handleMenuClick,
  onNumberFormatChange,
  colDefs,
  setShowMenu,
  showTableSetting,
  setShowTableSetting,
  setTableSettingOpen,
  tableActions,
  onTableActionsTabClick,
  showFilterStrip,
  hideTableFormat,
  hideTableActions,
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
  hideNumericFormat,
  hideFontSize,
  customTabInTableSettings,
  saveViewCustomFilter,
  customRenderSaveViewContent,
  onTableSettingClick,
  deleteViewPromptText,
  isViewNameUniqueAcrossTypes,
  tableSettingsTitle = "Table Settings",
  registerTableSettingToggle,
  numericFormatDefault,
  extraNumericFormatOptions
}) {
  const [selectedMenuTab, setSelectedMenuTab] = useState("Columns");
  const [numericFormat, setNumericFormat] = useState(numericFormatDefault || "full_no");
  const showTableSettingRef = useRef(showTableSetting);
  showTableSettingRef.current = showTableSetting;
  const onFontSizeChange = useCallback(
    (val) => {
      setTableFontSize(val);
    },
    [setTableFontSize]
  );
  const onNumericFormatChange = useCallback(
    (val) => {
      setNumericFormat(val);
      onNumberFormatChange(val);
    },
    [onNumberFormatChange]
  );
  useEffect(() => {
    setNumericFormat(numericFormatDefault);
  }, [numericFormatDefault]);
  const onCloseTableSetting = useCallback(() => {
    setSelectedMenuTab("Columns");
    setShowMenu(false);
    setShowTableSetting(false);
    setTableSettingOpen(false);
    onTableSettingClick(false);
  }, [setShowMenu, setShowTableSetting, setTableSettingOpen, onTableSettingClick]);
  const tabPanels = useMemo(
    () => [
      /* @__PURE__ */ jsx(
        Columns,
        {
          ref: actualRef,
          column: colDefs,
          customRenderSaveViewContent,
          deleteViewPromptText,
          handleDeleteViewClick,
          handleEditSaveView,
          handleSaveAndApply,
          handleSavedViewClick,
          handleSetDefaultView,
          isDeleteViewLoading,
          isSaveViewEnabled,
          isSavingViewLoading,
          isViewNameUniqueAcrossTypes,
          maxSavedViews,
          savedViewsOptions,
          saveViewCustomFilter,
          showMenu
        },
        "columns-tab"
      ),
      !hideTableFormat && /* @__PURE__ */ jsx(
        TableFormat,
        {
          extraNumericFormatOptions,
          hideFontSize,
          hideNumericFormat,
          numericFormat,
          tableFontSize,
          onFontSizeChange,
          onNumericFormatChange
        },
        "format-tab"
      ),
      !hideTableActions && /* @__PURE__ */ jsx(TableActions, { tableActions }, "actions-tab"),
      ...Array.isArray(customTabInTableSettings) ? customTabInTableSettings.map((tab, index) => {
        var _a;
        return /* @__PURE__ */ jsx(React__default.Fragment, { children: tab == null ? void 0 : tab.tabPanels }, ((_a = tab == null ? void 0 : tab.tabNames) == null ? void 0 : _a.value) || `custom-tab-${index}`);
      }) : []
    ].filter(Boolean),
    [
      Columns,
      actualRef,
      colDefs,
      customRenderSaveViewContent,
      deleteViewPromptText,
      handleDeleteViewClick,
      handleEditSaveView,
      handleSaveAndApply,
      handleSavedViewClick,
      handleSetDefaultView,
      isDeleteViewLoading,
      isSaveViewEnabled,
      isSavingViewLoading,
      isViewNameUniqueAcrossTypes,
      maxSavedViews,
      savedViewsOptions,
      saveViewCustomFilter,
      showMenu,
      hideTableFormat,
      hideFontSize,
      hideNumericFormat,
      numericFormat,
      tableFontSize,
      onFontSizeChange,
      onNumericFormatChange,
      extraNumericFormatOptions,
      hideTableActions,
      tableActions,
      customTabInTableSettings
    ]
  );
  const tabNames = useMemo(
    () => [
      {
        label: selectedMenuTab === "Columns" ? "Columns" : "",
        value: "Columns",
        icon: /* @__PURE__ */ jsx(default_1, { fontSize: "small" })
      },
      !hideTableFormat && {
        label: selectedMenuTab === "Format" ? "Format" : "",
        value: "Format",
        icon: /* @__PURE__ */ jsx(default_1$1, { fontSize: "small" })
      },
      !hideTableActions && {
        label: selectedMenuTab === "Actions" ? "Actions" : "",
        value: "Actions",
        icon: /* @__PURE__ */ jsx(default_1$2, {})
      },
      ...Array.isArray(customTabInTableSettings) ? customTabInTableSettings.map((tab) => {
        var _a, _b;
        return {
          ...tab.tabNames,
          label: selectedMenuTab === ((_a = tab == null ? void 0 : tab.tabNames) == null ? void 0 : _a.value) ? (_b = tab == null ? void 0 : tab.tabNames) == null ? void 0 : _b.label : ""
        };
      }) : []
    ].filter(Boolean),
    [selectedMenuTab, hideTableFormat, hideTableActions, customTabInTableSettings]
  );
  const handleTabChange = useCallback(
    (_event, val) => {
      setSelectedMenuTab(val);
      if (val === "Actions") {
        onTableActionsTabClick();
      }
    },
    [onTableActionsTabClick]
  );
  useEffect(() => {
    if (typeof registerTableSettingToggle !== "function") return void 0;
    const toggle = (open, tabName, options = {}) => {
      const shouldOpen = typeof open === "undefined" ? !showTableSettingRef.current : Boolean(open);
      if (shouldOpen) {
        if (options.menuOnly) {
          setShowMenu(true);
        } else {
          setShowMenu(true);
          setShowTableSetting(true);
          setTableSettingOpen(true);
          if (tabName) {
            setSelectedMenuTab(tabName);
          }
          onTableSettingClick(true);
        }
      } else if (options.menuOnly) {
        setShowMenu(false);
      } else {
        setSelectedMenuTab("Columns");
        setShowMenu(false);
        setShowTableSetting(false);
        setTableSettingOpen(false);
        onTableSettingClick(false);
      }
    };
    registerTableSettingToggle(toggle);
  }, [
    registerTableSettingToggle,
    setShowMenu,
    setShowTableSetting,
    setTableSettingOpen,
    onTableSettingClick
  ]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `table-setting-main-container ${showTableSetting ? "display-table-setting" : ""} ${showFilterStrip ? "filters-strip-visible" : ""}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "table-setting-header", children: [
          /* @__PURE__ */ jsx("h2", { children: tableSettingsTitle }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "close_icon",
              role: "button",
              tabIndex: 0,
              onClick: onCloseTableSetting,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCloseTableSetting();
                }
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Tabs,
          {
            remountOnTabChange: false,
            tabNames,
            tabPanels,
            value: selectedMenuTab,
            onChange: handleTabChange
          }
        )
      ]
    }
  );
}
const TableFormat = React__default.memo(function TableFormat2({
  tableFontSize,
  onFontSizeChange,
  numericFormat,
  onNumericFormatChange,
  hideNumericFormat,
  hideFontSize,
  extraNumericFormatOptions
}) {
  const fontSizeOptions = useMemo(
    () => [
      { label: "Small", value: "small" },
      { label: "Medium (default)", value: "medium" },
      { label: "Large", value: "large" }
    ],
    []
  );
  const numericOptions = useMemo(
    () => [
      { label: "Full Number", value: "full_no" },
      { label: "In K (Thousands)", value: "thou" },
      { label: "In M (Millions)", value: "mil" },
      { label: "In B (Billions)", value: "bil" },
      ...Array.isArray(extraNumericFormatOptions) ? extraNumericFormatOptions : []
    ],
    [extraNumericFormatOptions]
  );
  return /* @__PURE__ */ jsxs("div", { className: "table-setting-format-settings", children: [
    !hideFontSize && /* @__PURE__ */ jsxs("div", { className: "table-setting-font-size-setting-container", children: [
      /* @__PURE__ */ jsx("h3", { className: "custom-menu-sub-header", children: "Font size" }),
      /* @__PURE__ */ jsx(
        RadioButtonGroup,
        {
          options: fontSizeOptions,
          selectedOption: "medium",
          value: tableFontSize,
          onChange: (_e, val) => {
            onFontSizeChange(val);
          }
        }
      )
    ] }),
    !hideNumericFormat && /* @__PURE__ */ jsxs("div", { className: "table-setting-number-format-setting-container", children: [
      /* @__PURE__ */ jsx("h3", { className: "custom-menu-sub-header", children: "Numeric Values" }),
      /* @__PURE__ */ jsx(
        RadioButtonGroup,
        {
          options: numericOptions,
          selectedOption: "full_no",
          value: numericFormat,
          onChange: (_e, val) => {
            onNumericFormatChange(val);
          }
        }
      )
    ] })
  ] });
});
const TableActions = React__default.memo(function TableActions2({ tableActions }) {
  return /* @__PURE__ */ jsx("div", { className: "table-setting-action-settings", children: /* @__PURE__ */ jsx("div", { className: "table-setting-action-container", children: tableActions }) });
});
export {
  TableSettings as default
};
