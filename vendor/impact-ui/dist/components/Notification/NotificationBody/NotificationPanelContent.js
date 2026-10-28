import { jsx } from "react/jsx-runtime";
import { getPanelNotificationList } from "./NotificationList/NotificationList.js";
import { NotificationTaskList } from "./NotificationTaskList.js";
function NotificationPanelContent({
  panel,
  expand = false,
  badgesList,
  notificationPanels,
  setNotificationPanels,
  handleSelectAll,
  handleMarkReadAll,
  handleMoveAllPending,
  moveToPendingDropdownOptions,
  handleNotificationDeleteAll,
  showNotificationListLoader,
  showBadgeLoader,
  displayFormat = "L",
  onNotificationScrollToBottom,
  scrollThreshold,
  isWithSearch,
  onSearchChange,
  isChipsExpandable,
  isHoverOnCard,
  isDeleteAlwaysVisible,
  isEmptyState,
  emptyStateTitle,
  emptyStateDescription,
  customNotificationJsx,
  activeBadge
}) {
  var _a;
  const notificationList = getPanelNotificationList(panel);
  const listTypes = ((_a = badgesList == null ? void 0 : badgesList.find((badgeGroup) => badgeGroup.value === panel.value)) == null ? void 0 : _a.lists) ?? [];
  return /* @__PURE__ */ jsx(
    NotificationTaskList,
    {
      activeBadge,
      customNotificationJsx,
      displayFormat,
      emptyStateDescription,
      emptyStateTitle,
      expand,
      filterChip: panel.filterChip,
      handleApplyFilter: panel.handleApplyFilter,
      handleMarkReadAll,
      handleMoveAllPending,
      handleNotificationDeleteAll,
      handleSelectAll,
      handleSettingClick: panel.handleSettingClick,
      isChipsExpandable,
      isDeleteAlwaysVisible,
      isEmptyState,
      isHoverOnCard,
      isMultiSelectFilter: panel.isMultiSelectFilter,
      isWithSearch,
      listTypes,
      moveToPendingDropdownOptions,
      notificationList,
      notificationPanels,
      scrollThreshold,
      selectedFilterChip: panel.selectedFilterChip,
      setNotificationPanels,
      showBadgeLoader,
      showNotificationListLoader,
      type: panel.value,
      onNotificationScrollToBottom,
      onSearchChange
    }
  );
}
export {
  NotificationPanelContent
};
