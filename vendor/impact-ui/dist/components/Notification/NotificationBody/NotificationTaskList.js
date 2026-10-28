import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import default_1$1 from "../../../node_modules/@mui/icons-material/FilterListOutlined.js";
import default_1 from "../../../node_modules/@mui/icons-material/SearchOutlined.js";
import { debounce } from "../../../utils/debounce.js";
import { Badge } from "../../Badge/index.js";
import { Button } from "../../Button/index.js";
import { Input } from "../../Input/index.js";
import { NotificationChipsList } from "./NotificationList/NotificationChipsList.js";
import { NotificationList } from "./NotificationList/NotificationList.js";
import { useTranslation } from "../../../i18n/useTranslation.js";
function NotificationTaskList({
  expand = false,
  type,
  listTypes = [],
  notificationList,
  handleSettingClick,
  handleSelectAll,
  handleMarkReadAll,
  handleMoveAllPending,
  moveToPendingDropdownOptions,
  handleNotificationDeleteAll,
  notificationPanels,
  setNotificationPanels,
  activeBadge,
  filterChip,
  handleApplyFilter,
  isMultiSelectFilter = false,
  showBadgeLoader,
  showNotificationListLoader,
  selectedFilterChip,
  displayFormat = "L",
  onNotificationScrollToBottom,
  scrollThreshold,
  isWithSearch = true,
  onSearchChange,
  isChipsExpandable = false,
  isHoverOnCard = false,
  isDeleteAlwaysVisible = false,
  isEmptyState = false,
  emptyStateTitle,
  emptyStateDescription,
  customNotificationJsx
}) {
  var _a;
  const { t } = useTranslation();
  const [list, setList] = useState(listTypes);
  const [currActiveListType, setCurrActiveListType] = useState(
    activeBadge ?? ((_a = listTypes[0]) == null ? void 0 : _a.label) ?? ""
  );
  const [notificationListItems, setNotificationListItems] = useState(notificationList);
  const [expandList, setExpandList] = useState(isChipsExpandable);
  const [searchExpand, setSearchExpand] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const searchInputRef = useRef(null);
  useEffect(() => {
    var _a2;
    if (searchExpand) {
      (_a2 = searchInputRef.current) == null ? void 0 : _a2.focus();
    }
  }, [searchExpand]);
  const [selectedFilter, setSelectedFilter] = useState(selectedFilterChip ?? (isMultiSelectFilter ? [] : null));
  useEffect(() => {
    var _a2;
    if (Array.isArray(listTypes)) {
      setList(listTypes);
      if (listTypes.length > 0) {
        setCurrActiveListType(activeBadge ?? ((_a2 = listTypes[0]) == null ? void 0 : _a2.label) ?? "");
      }
    }
  }, [listTypes, activeBadge]);
  useEffect(() => {
    setNotificationListItems(notificationList);
  }, [notificationList]);
  useEffect(() => {
    setExpandList(isChipsExpandable);
  }, [isChipsExpandable]);
  const debouncedSearch = useMemo(
    () => debounce((value, event) => {
      if (onSearchChange) {
        onSearchChange(value, event);
      } else {
        const searchTerm = value.trim().toUpperCase();
        const searchTerms = searchTerm.split(/\s+/).filter(Boolean);
        if (searchTerms.length > 0) {
          const searchResults = notificationList.filter(
            (option) => searchTerms.every((term) => new RegExp(term, "i").test(option.label))
          );
          setNotificationListItems([...searchResults]);
        } else {
          setNotificationListItems(notificationList);
        }
      }
    }, 400),
    [notificationList, onSearchChange]
  );
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handleSearch = useCallback(
    (event) => {
      const value = event.target.value ?? "";
      setSearchInput(value);
      debouncedSearch(value, event);
    },
    [debouncedSearch]
  );
  const handleClickOutside = useCallback(
    (event) => {
      if (!showFilter) {
        return;
      }
      const target = event.target;
      if (!target.closest(".impact-notification-task-list-filter-container")) {
        setShowFilter(false);
      }
    },
    [showFilter]
  );
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);
  const listTitle = activeBadge != null && activeBadge !== "" ? activeBadge : currActiveListType;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `impact-notification-task-list-container ${isEmptyState ? "empty-state-container" : ""}`,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "impact-notification-task-list-header",
            style: {
              justifyContent: list.length > 0 ? "space-between" : "flex-end"
            },
            children: [
              list.length > 0 && /* @__PURE__ */ jsx(
                NotificationChipsList,
                {
                  activeBadge,
                  currActiveListType,
                  expandList,
                  list,
                  notificationList: notificationListItems,
                  setCurrActiveListType,
                  setExpandList,
                  setSearchExpand,
                  showBadgeLoader
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "impact-notification-task-list-actions", children: [
                isWithSearch && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `impact-notification-task-list-search-container ${searchExpand ? "search-expand" : ""}`,
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        ref: searchInputRef,
                        placeholder: t("notification.searchPlaceholder"),
                        rightIcon: /* @__PURE__ */ jsx(default_1, {}),
                        rightIconClick: () => {
                          if (expandList) {
                            setExpandList(false);
                          }
                          setSearchExpand((prev) => !prev);
                        },
                        value: searchInput,
                        onChange: handleSearch
                      }
                    )
                  }
                ),
                handleSettingClick && /* @__PURE__ */ jsx(
                  Button,
                  {
                    icon: /* @__PURE__ */ jsx(default_1$1, {}),
                    size: "medium",
                    variant: "text",
                    onClick: () => {
                      setShowFilter((prev) => !prev);
                      handleSettingClick();
                    },
                    children: filterChip && filterChip.length > 0 ? filterChip.length : null
                  }
                ),
                showFilter && filterChip && filterChip.length > 0 && /* @__PURE__ */ jsxs("div", { className: "impact-notification-task-list-filter-container", children: [
                  /* @__PURE__ */ jsxs("div", { className: "impact-notification-task-list-title", children: [
                    /* @__PURE__ */ jsx("span", { className: "impact-notification-task-list-title-text", children: t("notification.selectFilter") }),
                    /* @__PURE__ */ jsx("span", { className: "impact-notification-task-list-title-text-sub", children: isMultiSelectFilter ? t("notification.multiSelect") : t("notification.singleSelect") })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "impact-notification-task-list-filter-item", children: filterChip.map((item) => {
                    const isSelected = isMultiSelectFilter ? Array.isArray(selectedFilter) && selectedFilter.some((filter) => filter.value === item.value) : (selectedFilter == null ? void 0 : selectedFilter.value) === item.value;
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `impact-notification-task-list-filter-item-badge ${isSelected ? "selected" : ""}`,
                        children: /* @__PURE__ */ jsx(
                          Badge,
                          {
                            label: item.label,
                            variant: "subtle",
                            onClick: () => {
                              setSelectedFilter((prev) => {
                                if (isMultiSelectFilter) {
                                  const prevArr = Array.isArray(prev) ? prev : [];
                                  return prevArr.some((el) => el.value === item.value) ? prevArr.filter((filter) => filter.value !== item.value) : [...prevArr, item];
                                }
                                return prev === item ? null : item;
                              });
                            }
                          }
                        )
                      },
                      item.value
                    );
                  }) }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "url",
                      onClick: () => {
                        handleApplyFilter == null ? void 0 : handleApplyFilter(selectedFilter);
                        setShowFilter(false);
                      },
                      children: t("common.apply")
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          NotificationList,
          {
            customNotificationJsx,
            displayFormat,
            emptyStateDescription,
            emptyStateTitle,
            expand,
            handleMarkReadAll,
            handleMoveAllPending,
            handleNotificationDeleteAll,
            handleSelectAll,
            isDeleteAlwaysVisible,
            isEmptyState,
            isHoverOnCard,
            moveToPendingDropdownOptions,
            notificationList: notificationListItems,
            notificationPanels,
            scrollThreshold,
            setNotificationPanels,
            showBadgeLoader,
            showNotificationListLoader,
            title: listTitle,
            type,
            onNotificationScrollToBottom
          }
        )
      ]
    }
  );
}
export {
  NotificationTaskList
};
