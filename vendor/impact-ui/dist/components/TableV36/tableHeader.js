import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import default_1 from "../../node_modules/@mui/icons-material/FilterAltOffOutlined.js";
import default_1$1 from "../../node_modules/@mui/icons-material/FilterAltOutlined.js";
import default_1$2 from "../../node_modules/@mui/icons-material/MoreHorizOutlined.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Button } from "../Button/index.js";
import TableMoreOptions from "./tableMoreOptions.js";
import { Alert } from "../Alert/index.js";
import { FiltersStrip } from "../FiltersStrip/index.js";
import TableChatSidePanel from "../TableChat/TableChatSidePanel.js";
import { Tooltip } from "../Tooltip/index.js";
import Badge from "../../node_modules/@mui/material/Badge/Badge.js";
const ChatIcon = getAssetUrl("icons/chatIcon.svg");
function TableHeader({
  actualRef,
  colDefs,
  Columns,
  tableFontSize,
  setTableFontSize,
  rowHeight,
  setRowHeight,
  tableHeader,
  topRightOptions,
  topLeftOptions,
  onGlobalSearchClick,
  cardContainer,
  onNumberFormatChange,
  hideRowHeightOptionMenu,
  showDownloadButton,
  onDownloadButtonClick,
  closeButton,
  handleCloseButtonClick,
  additionalButtons,
  setTableSettingOpen,
  showHideEditableCells,
  handleShowHideEditableCells,
  topCenterOptions,
  showContentualFilter,
  showContentualFilterBadge,
  onContentualFilterClick,
  contentualFilterProps = {},
  contentualFilterComponent,
  tableActions,
  onTableActionsTabClick,
  hideTableFormat,
  hideTableActions,
  hideTableSetting,
  explicitlyCloseTableSetting,
  customSystemButton,
  isChatEnabled = true,
  handleChatClick = () => {
  },
  isChatOpen,
  handleChatClose,
  chatConfiguration,
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
  isCommentFeatureEnabled,
  showCommentBadge,
  toggleCommentMode,
  commentMode,
  hideFontSize,
  hideNumericFormat,
  onContentDensityChange,
  isCommentResolvedAlertOpen,
  setIsCommentResolvedAlertOpen,
  showCommentPanel,
  setShowCommentPanel,
  customTabInTableSettings,
  closeTableSettingOnOutsideClick,
  saveViewCustomFilter,
  customRenderSaveViewContent,
  onTableSettingClick,
  deleteViewPromptText,
  isViewNameUniqueAcrossTypes,
  contentualFilterOpenByDefault,
  tableSettingsTitle,
  registerTableSettingToggle,
  numericFormatDefault,
  extraNumericFormatOptions,
  viewPoint,
  disableContextualFilter,
  disableTableSettings,
  onAdvanceSortClick,
  advanceSortEnabled
}) {
  var _a, _b;
  const [showMenu, setShowMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleWidthButtonClose = () => {
    setAnchorEl(null);
  };
  const [showTableSetting, setShowTableSetting] = useState(false);
  const [showFilterStrip, setShowFilterStrip] = useState(contentualFilterOpenByDefault);
  useRef(0);
  const commentBtnRef = useRef(null);
  const onRowHeightChange = (val) => {
    setRowHeight(val);
    setTimeout(() => {
      var _a2, _b2;
      (_b2 = (_a2 = actualRef == null ? void 0 : actualRef.current) == null ? void 0 : _a2.api) == null ? void 0 : _b2.resetRowHeights();
    }, 0);
    handleWidthButtonClose();
  };
  const handleMenuClick = (e) => {
    document.body.style.overflowX = "hidden";
    e.stopPropagation();
    setShowMenu((prev) => !prev);
    setShowTableSetting(false);
    setTableSettingOpen(false);
    setTimeout(() => {
      document.body.style.overflowX = "unset";
    }, 200);
  };
  const toggleCommentPanel = () => {
    setShowCommentPanel((prev) => !prev);
  };
  const handleCommentClick = (e) => {
    e.stopPropagation();
    if (showTableSetting) {
      setShowMenu(false);
      setShowTableSetting(false);
      setTableSettingOpen(false);
    }
    toggleCommentMode();
    toggleCommentPanel();
  };
  useEffect(() => {
    if (!showCommentPanel && commentMode) {
      toggleCommentMode();
    } else if (!commentMode && showCommentPanel) {
      toggleCommentPanel();
    }
  }, [commentMode, showCommentPanel]);
  useEffect(() => {
    var _a2, _b2;
    const el = commentBtnRef.current || document.querySelector('[data-icon="comment"][data-type="table-icon"]');
    if (!el) return;
    if (commentMode) {
      (_a2 = el.focus) == null ? void 0 : _a2.call(el);
    } else {
      (_b2 = el.blur) == null ? void 0 : _b2.call(el);
    }
  }, [commentMode]);
  const isGroupRows = useMemo(() => {
    const hasGroupRows = (cols) => cols.some((col) => col.rowGroup || col.children && hasGroupRows(col.children));
    return hasGroupRows(colDefs || []);
  }, [colDefs]);
  const handleClickOutside = (event) => {
    if (showMenu && !showTableSetting && !event.target.closest(".table-more-options-container")) {
      setShowMenu(false);
    }
    if (closeTableSettingOnOutsideClick && showTableSetting && !event.target.closest(".table-setting-main-container") && !event.target.closest(".table-more-options-container")) {
      setShowTableSetting(false);
      setShowMenu(false);
      setTableSettingOpen(false);
    }
    if (showCommentPanel && !event.target.closest(".MuiPopover-root") && !event.target.closest(".impact-input-wrapper") && !event.target.closest(".comment-panel-main-container") && !event.target.closest(".table-more-options-container") && !event.target.closest(".ag-grid-viewport")) {
      setShowCommentPanel(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu, showTableSetting, showCommentPanel]);
  const handleFilterClick = () => {
    setShowFilterStrip(!showFilterStrip);
    if (onContentualFilterClick) {
      onContentualFilterClick();
    }
  };
  const hasHeaderContent = useMemo(() => {
    return !!(tableHeader || topLeftOptions || topCenterOptions || topRightOptions || onGlobalSearchClick || showContentualFilter || showDownloadButton || !hideTableSetting || closeButton || showFilterStrip || contentualFilterComponent || contentualFilterProps && Object.keys(contentualFilterProps).length > 0 || isCommentFeatureEnabled);
  }, [
    tableHeader,
    topLeftOptions,
    topCenterOptions,
    topRightOptions,
    onGlobalSearchClick,
    showContentualFilter,
    showDownloadButton,
    hideTableSetting,
    closeButton,
    showFilterStrip,
    contentualFilterComponent,
    contentualFilterProps,
    isCommentFeatureEnabled
  ]);
  if (!hasHeaderContent) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "impact-table-main-header",
      style: {
        flexDirection: showFilterStrip ? "column" : "row",
        alignItems: showFilterStrip ? "initial" : "center",
        justifyContent: "center",
        transition: "height 0.3s ease",
        position: "relative"
      },
      children: [
        isCommentResolvedAlertOpen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1e3
            },
            children: /* @__PURE__ */ jsx(
              Alert,
              {
                severity: "success",
                title: "Comment is resolved",
                onClose: () => setIsCommentResolvedAlertOpen(false)
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "impact-table-main-header-container", children: [
          /* @__PURE__ */ jsxs("div", { className: "impact-table-main-header-left", children: [
            /* @__PURE__ */ jsx("div", { className: "table-heading", children: tableHeader }),
            topLeftOptions
          ] }),
          /* @__PURE__ */ jsx("div", { className: "impact-table-center-cta-container", children: topCenterOptions }),
          /* @__PURE__ */ jsxs("div", { className: "right-table-cta-container", children: [
            topRightOptions,
            onGlobalSearchClick ? /* @__PURE__ */ jsx(
              Button,
              {
                "data-icon": "table-search",
                "data-type": "table-icon",
                variant: "secondary",
                onClick: onGlobalSearchClick
              }
            ) : null,
            topRightOptions && viewPoint !== "list" && /* @__PURE__ */ jsx("div", { className: "divider-line" }),
            isChatEnabled && /* @__PURE__ */ jsx(
              Tooltip,
              {
                description: ((_a = chatConfiguration == null ? void 0 : chatConfiguration.tooltipConfig) == null ? void 0 : _a.description) || '"Chat" allows you to collaborate with your companions on the go.',
                title: ((_b = chatConfiguration == null ? void 0 : chatConfiguration.tooltipConfig) == null ? void 0 : _b.title) || "New feature",
                variant: "feature",
                children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    className: "table-chat-icon-button",
                    "data-icon": "chat",
                    "data-type": "table-icon",
                    icon: /* @__PURE__ */ jsx("img", { alt: "chat", src: ChatIcon }),
                    variant: "tertiary",
                    onClick: handleChatClick
                  }
                )
              }
            ),
            showContentualFilter && /* @__PURE__ */ jsx(Tooltip, { title: showFilterStrip ? "Hide filter" : "Show filter", variant: "tertiary", children: /* @__PURE__ */ jsx(Badge, { invisible: !showContentualFilterBadge, variant: "dot", children: /* @__PURE__ */ jsx(
              Button,
              {
                disabled: disableContextualFilter,
                icon: showFilterStrip ? /* @__PURE__ */ jsx(default_1, {}) : /* @__PURE__ */ jsx(default_1$1, {}),
                variant: "text",
                onClick: handleFilterClick
              }
            ) }) }),
            isCommentFeatureEnabled && /* @__PURE__ */ jsx(Tooltip, { title: "Comment", variant: "tertiary", children: /* @__PURE__ */ jsx(Badge, { invisible: !showCommentBadge, variant: "dot", children: /* @__PURE__ */ jsx(
              Button,
              {
                ref: commentBtnRef,
                "aria-pressed": Boolean(commentMode),
                "data-active": commentMode ? "true" : void 0,
                "data-icon": "comment",
                "data-type": "table-icon",
                variant: "text",
                onClick: handleCommentClick
              }
            ) }) }),
            showDownloadButton && /* @__PURE__ */ jsx(Tooltip, { title: "Download", variant: "tertiary", children: /* @__PURE__ */ jsx(
              Button,
              {
                "data-icon": "download",
                "data-type": "table-icon",
                variant: "secondary",
                onClick: onDownloadButtonClick
              }
            ) }),
            customSystemButton && customSystemButton,
            !hideTableSetting && /* @__PURE__ */ jsx(Tooltip, { title: "More", variant: "tertiary", children: /* @__PURE__ */ jsx(
              Button,
              {
                disabled: disableTableSettings,
                icon: /* @__PURE__ */ jsx(default_1$2, {}),
                variant: "text",
                onClick: handleMenuClick
              }
            ) }),
            closeButton && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "divider-line" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  "data-icon": "close",
                  "data-type": "table-icon",
                  variant: "url",
                  onClick: handleCloseButtonClick
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          TableMoreOptions,
          {
            actualRef,
            advanceSortEnabled,
            colDefs,
            Columns,
            customRenderSaveViewContent,
            customTabInTableSettings,
            deleteViewPromptText,
            explicitlyCloseTableSetting,
            extraButtons: additionalButtons,
            handleDeleteViewClick,
            handleEditSaveView,
            handleMenuClick,
            handleSaveAndApply,
            handleSavedViewClick,
            handleSetDefaultView,
            handleShowHideEditableCells,
            hideFontSize,
            hideNumericFormat,
            hideRowHeightOptionMenu,
            hideTableActions,
            hideTableFormat,
            isDeleteViewLoading,
            isGroupRows,
            isSaveViewEnabled,
            isSavingViewLoading,
            isViewNameUniqueAcrossTypes,
            maxSavedViews,
            numericFormatDefault,
            extraNumericFormatOptions,
            registerTableSettingToggle,
            rowHeight,
            savedViewsOptions,
            saveViewCustomFilter,
            setRowHeight,
            setShowMenu,
            setShowTableSetting,
            setTableFontSize,
            setTableSettingOpen,
            showFilterStrip,
            showHideEditableCells,
            showMenu,
            showTableSetting,
            tableActions,
            tableFontSize,
            tableSettingsTitle,
            onAdvanceSortClick,
            onContentDensityChange,
            onNumberFormatChange,
            onRowHeightChange,
            onTableActionsTabClick,
            onTableSettingClick
          }
        ),
        showFilterStrip && /* @__PURE__ */ jsx("div", { className: "divider-line", style: { paddingTop: "16px" } }),
        showFilterStrip && /* @__PURE__ */ jsx("div", { className: "impact-table-header-filter-strip", children: contentualFilterComponent ? contentualFilterComponent : /* @__PURE__ */ jsx(FiltersStrip, { ...contentualFilterProps }) }),
        isChatEnabled && /* @__PURE__ */ jsx(
          TableChatSidePanel,
          {
            chatConfiguration,
            handleClose: handleChatClose,
            isOpen: isChatOpen
          }
        )
      ]
    }
  );
}
export {
  TableHeader as default
};
