!function(){"use strict";try{if("undefined"!=typeof document){var i=document.createElement("style");i.appendChild(document.createTextNode("@keyframes impact-notification-sync-spin{0%{transform:rotate(0)}to{transform:rotate(1turn)}}.impact-notification-sync-icon--rotating{animation:impact-notification-sync-spin 1s linear infinite}.impact-notification-separator{background-color:#d9dde7;display:inline-block;height:16px;width:1.5px}.impact-notification-container{height:100%;transition:width .2s ease-in;width:600px}.impact-notification-container .impact-notification-header{align-items:center;background-color:#fff;border-bottom:1px solid #d9dde7;display:flex;height:40px;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:1}.impact-notification-container .impact-notification-header .impact-notification-heading{font-size:16px;font-weight:700;line-height:20px}.impact-notification-container .impact-notification-header .impact-notification-header-action-btns{align-items:center;display:flex;gap:12px}.impact-notification-container .impact-notification-header .impact-notification-header-action-btns button{background-color:#f5f6fa;border:none;border-radius:8px;cursor:pointer;height:32px;width:32px}.impact-notification-container .impact-notification-header .collapse-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/collapse-icon-2.svg) no-repeat;background-position:50%;background-size:16px;cursor:pointer;height:16px;width:16px}.impact-notification-container .impact-notification-header .expand-icon{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/expand-icon.svg) no-repeat;background-position:50%;background-size:20px;cursor:pointer;height:16px;width:16px}.impact-notification-container .impact-notification-header .impact-notification-header-close-btn{background:url(https://impact-kit.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/close-tags.svg) no-repeat;background-position:50%;background-size:24px;cursor:pointer;height:16px;width:16px}.impact-notification-container .impact-notification-body-container{height:calc(100% - 96px);padding:20px 10px}.impact-notification-container .notification-body-container-full{height:calc(100% - 40px)}.impact-notification-container .impact-notification-body-header-container{align-items:baseline;display:flex;flex-direction:row;gap:12px}.impact-notification-container .impact-notification-body-header-container .ia-tabContainer{height:100%;width:100%}.impact-notification-container .impact-notification-body-header-container .ia-tabContainer .impact-tab-panel{height:calc(100% - 156px);overflow:hidden;padding:20px 6px 0;position:absolute;width:calc(100% - 32px)}.impact-notification-container .impact-notification-body-header-container .ia-tabContainer .impact-tab-panel .ia-tabPanel{height:100%}.impact-notification-container .impact-notification-body-header-container .ia-tabContainer .impact-tab-panel .ia-tabPanel .MuiBox-root:has(.empty-state-container){height:100%}.impact-notification-container .impact-notification-body-header-container .ia-styles.ia-btn{flex-shrink:0}.impact-notification-container .impact-notification-task-list-filter-container{background:#fff;border:1px solid #b3bdf8;border-radius:12px;min-height:128px;padding:16px;position:absolute;right:0;top:65px;width:379px;z-index:99999}.impact-notification-container .impact-notification-task-list-filter-item{align-items:center;display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px}.impact-notification-container .impact-notification-task-list-title{align-items:center;display:flex;gap:4px;margin-bottom:8px}.impact-notification-container .impact-notification-task-list-title .impact-notification-task-list-title-text{color:#1f2b4d;font-size:16px;font-weight:600;line-height:24px}.impact-notification-container .impact-notification-task-list-title .impact-notification-task-list-title-text-sub{color:#60697d;font-size:12px;font-weight:500;line-height:16px}.impact-notification-container .impact-notification-task-list-filter-item-badge .MuiChip-root.impact_badges_only_label_subtle{background-color:#f5f6fa;border:1px solid #c3c8d4;cursor:pointer}.impact-notification-container .impact-notification-task-list-filter-item-badge .MuiChip-root.impact_badges_only_label_subtle .MuiChip-label{color:#7a8294}.impact-notification-container .impact-notification-task-list-filter-item-badge.selected .MuiChip-root.impact_badges_only_label_subtle{background-color:#eceefd;border:1px solid #4259ee;cursor:pointer}.impact-notification-container .impact-notification-task-list-filter-item-badge.selected .MuiChip-root.impact_badges_only_label_subtle .MuiChip-label{color:#4259ee}.impact-notification-container .body-header-container-full .ia-tabContainer .impact-tab-panel{height:calc(100% - 100px)}.impact-notification-container .impact-notification-footer-container{align-items:center;background:#fff;border-top:1px solid #d9dde7;bottom:0;display:flex;gap:8px;height:56px;justify-content:flex-end;left:0;padding:0 16px;position:absolute;right:0;z-index:1}.impact-notification-task-list-container{height:100vh}.impact-notification-task-list-container.empty-state-container{height:100%}.impact-notification-task-list-container .impact-notification-task-list-header{align-items:center;border-bottom:1px solid #d9dde7;box-sizing:border-box;display:flex;justify-content:space-between;min-height:55px;padding-bottom:20px}.impact-notification-task-list-container .impact-notification-task-list-search-container{position:relative}.impact-notification-task-list-container .impact-notification-task-list-search-container .impact-input-wrapper{height:27px;min-width:100%!important;transition:width .2s ease-in-out;width:35px}.impact-notification-task-list-container .impact-notification-task-list-search-container .right-input-icon{position:relative;right:7px;top:1px}.impact-notification-task-list-container .search-expand .impact-input-wrapper{width:240px}.impact-notification-task-list-container .search-expand .right-input-icon{left:0}.impact-notification-task-list-container .impact-notification-task-list-chips{display:flex;flex-basis:90%;gap:4px;overflow:hidden}.impact-notification-task-list-container .impact-notification-task-list-chips .impact-notification-task-list-item{display:flex;gap:4px}.impact-notification-task-list-container .impact-notification-task-list-chips .impact-notification-task-list-item .MuiChip-label{font-size:12px!important}.impact-notification-task-list-container .impact-notification-task-list-chips .impact-notification-task-list-item-hidden{display:flex;gap:4px;overflow:hidden;transition:width .2s ease-in;width:0}.impact-notification-task-list-container .impact-notification-task-list-chips .list-item-full-width{width:100%}.impact-notification-task-list-container .impact-notification-task-list-actions{align-items:center;display:flex;gap:4px}.impact-notification-list-container{height:100%;padding-top:20px}.impact-notification-list-container .impact-notification-list-header{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding-bottom:20px}.impact-notification-list-container .impact-notification-list-title{color:#1f2b4d;font-family:Manrope,sans-serif;font-size:16px;font-weight:600;line-height:24px}.impact-notification-list-container .impact-notification-list-action-btns{align-items:center;display:flex;flex-direction:row;gap:4px}.impact-notification-list-container .impact-notification-list-items-container{display:flex;flex-direction:column;gap:8px;height:calc(100% - 280px);overflow-y:auto;padding-bottom:20px;scroll-behavior:smooth}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item{align-items:flex-start;background-color:#f8f9fb;border-radius:12px;display:flex;flex-direction:row;gap:8px;padding:16px 12px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item:hover .impact-notification-list-item-header-right{transition:width .4s ease-in-out;width:24%!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item:hover .impact-notification-list-item-header-left--btns-3{max-width:76%!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item:hover .impact-notification-list-item-header-left--btns-2{max-width:84%!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item:hover .impact-notification-list-item-header-left--btns-1{max-width:92%!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item:hover .impact-notification-list-item-header-left--btns-0{max-width:100%!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-checkbox{padding-top:5px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-icon{align-items:center;border-radius:50%;display:flex;flex-shrink:0;height:30px;justify-content:center;width:30px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-icon .impact-notification-list-item-icon-line{height:15px;width:2px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .status-success{background-color:#ebf7f1;border:1px solid #108431}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .status-success .impact-notification-list-item-icon-line{background-color:#108431}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .status-fail{background-color:#fceeee;border:1px solid #ec4c5c}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .status-fail .impact-notification-list-item-icon-line{background-color:#ec4c5c}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .status-pending{background-color:#fcf8ea;border:1px solid #ffe174}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .status-pending .impact-notification-list-item-icon-line{background-color:#ffe174}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container{align-items:flex-start;display:flex;flex-direction:column;gap:6px;justify-content:flex-start;min-width:0;width:100%}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header{align-items:center;display:flex;flex-direction:row;gap:8px;justify-content:space-between;width:100%}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header:focus,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header:hover{cursor:pointer}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left{flex:1;max-width:100%;transition:max-width .3s ease-out}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right{align-items:center;display:flex;flex-direction:row;gap:12px;justify-content:flex-start}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left .impact-notification-list-item-title-icons,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-title-icons{align-items:center;display:flex;gap:12px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left .impact-notification-list-item-title-icons .title-icon-btn,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-title-icons .title-icon-btn{align-items:center;cursor:pointer;display:flex}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left .impact-notification-list-item-title-icons .title-icon-btn .impact-notification-title-icon,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left .impact-notification-list-item-title-icons .title-icon-btn img,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-title-icons .title-icon-btn .impact-notification-title-icon,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-title-icons .title-icon-btn img{height:16px;width:16px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-left .impact-notification-list-item-title-icons .title-icon-btn:hover .impact-notification-title-icon path,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-title-icons .title-icon-btn:hover .impact-notification-title-icon path{fill:#4259ee}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right{justify-content:flex-end}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-title{color:#0d152c;font-family:Manrope,sans-serif;font-size:14px;font-weight:800;line-height:21px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right{overflow:hidden;width:0}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-delete-btn{display:inline-flex!important;opacity:1!important;visibility:visible!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right .impact-notification-list-item-delete-btn~*{display:none!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header:has(.impact-notification-list-item-delete-btn) .impact-notification-list-item-header-right{width:24%!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-header:hover .impact-notification-list-item-header-right .impact-notification-list-item-delete-btn~*{display:inline-flex!important;opacity:1!important;visibility:visible!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-schedule{align-items:center;color:#5f6673;display:flex;flex-direction:row;font-family:Manrope,sans-serif;font-size:12px;font-weight:500;gap:8px;justify-content:flex-start;line-height:15px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-description{color:#394960;font-family:Manrope,sans-serif;font-size:14px;font-weight:500;line-height:20px;max-width:100%;min-width:0;overflow-wrap:anywhere;word-break:break-word}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-description span{color:#4259ee;cursor:pointer}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item .impact-notification-list-item-container .impact-notification-list-item-action-btns{align-items:center;display:flex;flex-direction:row;gap:8px}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item.impact-notification-list-item-hover-on-card .impact-notification-list-item-container .impact-notification-list-item-header:focus .impact-notification-list-item-header-right,.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item.impact-notification-list-item-hover-on-card .impact-notification-list-item-container .impact-notification-list-item-header:hover .impact-notification-list-item-header-right{width:0!important}.impact-notification-list-container .impact-notification-list-items-container .impact-notification-list-item.impact-notification-list-item-hover-on-card:hover .impact-notification-list-item-container .impact-notification-list-item-header .impact-notification-list-item-header-right{width:24%!important}.impact-notification-list-container .impact-notification-list-items-container .list-item-selected{background-color:#eceefd}.impact-notification-list-container .impact-notification-list-items-container .list-item-read{border-left:3px solid #4259ee}.impact-notification-list-empty-state-container{align-items:center;display:flex;flex-direction:column;gap:16px;height:calc(100% - 48px);justify-content:center}.impact-notification-list-empty-state-container .impact-notification-list-empty-state-icon{height:72px;width:72px}.impact-notification-list-empty-state-container .impact-notification-list-empty-state-content{align-items:center;display:flex;flex-direction:column;gap:4px;justify-content:center}.impact-notification-list-empty-state-container .impact-notification-list-empty-state-content .impact-notification-list-empty-state-title{color:#0d152c;font-size:20px;font-weight:800;line-height:28px}.impact-notification-list-empty-state-container .impact-notification-list-empty-state-content .impact-notification-list-empty-state-description{color:#7a8294;font-size:14px;font-weight:500;line-height:21px}.impact-notification-container-expand{width:800px}.impact-notification-list-item-bookmark-btn.ia-styles.ia-btn.ia-btn-text svg path{fill:#4258ed!important}.impact-notification-list-header .impact-notification-list-title-loader .css-tqb5fd-MuiSkeleton-root{display:none}.impact-notification-list-header .impact-notification-list-title-loader .css-58ftfq-MuiSkeleton-root{width:40px!important}.impact-notification-list-loader-container .css-70qvj9{left:calc(50% - 157px);position:absolute;top:calc(50% - 15px)}.impact-notification-list-action-btns-loader .css-tqb5fd-MuiSkeleton-root{display:none}.impact-notification-list-action-btns-loader .css-1366qbr{position:absolute;right:calc(50% - 150px)}")),document.head.appendChild(i)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}}();
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback, Suspense } from "react";
import { NotificationBody } from "./NotificationBody/index.js";
import { NotificationFooter } from "./NotificationFooter.js";
import { NotificationHeader } from "./NotificationHeader.js";

import Drawer from "../../node_modules/@mui/material/Drawer/Drawer.js";
function Notification({
  title,
  anchor = "right",
  isOpen,
  setIsOpen,
  className,
  handleClose,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  primaryButtonLabel,
  onPrimaryButtonClick,
  onSettingButtonClick,
  handleSelectAll,
  handleMarkReadAll,
  handleMoveAllPending,
  handleNotificationDeleteAll,
  badgesList,
  notificationTabs,
  notificationPanels,
  setNotificationPanels,
  handleTabChange = () => {
  },
  moveToPendingDropdownOptions,
  activeNotiTab,
  activeBadge,
  showBadgeLoader,
  showNotificationListLoader,
  displayFormat = "L",
  onNotificationScrollToBottom,
  scrollThreshold,
  isWithSearch = true,
  onSearchChange,
  isHoverOnCard = false,
  isChipsExpandable = false,
  isDeleteAlwaysVisible = false,
  isEmptyState,
  emptyStateTitle,
  emptyStateDescription,
  customNotificationJsx,
  NotificationBodyComponent
}) {
  const [expand, setExpand] = useState(false);
  const BodyComponent = NotificationBodyComponent ?? NotificationBody;
  const toggleDrawer = useCallback(
    (_anchor, _open) => (event) => {
      if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }
      if (handleClose) {
        handleClose();
      } else {
        setIsOpen == null ? void 0 : setIsOpen(!isOpen);
      }
    },
    [handleClose, isOpen, setIsOpen]
  );
  return /* @__PURE__ */ jsx(Drawer, { anchor, open: isOpen, onClose: toggleDrawer(anchor, false), children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `impact-notification-container ${expand ? "impact-notification-container-expand" : ""} ${className ?? ""}`.trim(),
      children: [
        /* @__PURE__ */ jsx(
          NotificationHeader,
          {
            anchor,
            expand,
            setExpand,
            showBadgeLoader,
            title,
            toggleDrawer
          }
        ),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "impact-notification-body-container" }), children: /* @__PURE__ */ jsx(
          BodyComponent,
          {
            activeBadge,
            activeNotiTab,
            badgesList,
            customNotificationJsx,
            displayFormat,
            emptyStateDescription,
            emptyStateTitle,
            expand: !primaryButtonLabel && !secondaryButtonLabel,
            handleMarkReadAll,
            handleMoveAllPending,
            handleNotificationDeleteAll,
            handleSelectAll,
            handleTabChange,
            isChipsExpandable,
            isDeleteAlwaysVisible,
            isEmptyState,
            isHoverOnCard,
            isWithSearch,
            moveToPendingDropdownOptions,
            notificationPanels: notificationPanels ?? [],
            notificationTabs: notificationTabs ?? [],
            scrollThreshold,
            setNotificationPanels,
            showBadgeLoader,
            showNotificationListLoader,
            onNotificationScrollToBottom,
            onSearchChange,
            onSettingButtonClick
          }
        ) }),
        /* @__PURE__ */ jsx(
          NotificationFooter,
          {
            primaryButtonLabel,
            secondaryButtonLabel,
            onPrimaryButtonClick,
            onSecondaryButtonClick
          }
        )
      ]
    }
  ) });
}
Notification.displayName = "Notification";
export {
  Notification,
  NotificationFooter,
  NotificationHeader
};
