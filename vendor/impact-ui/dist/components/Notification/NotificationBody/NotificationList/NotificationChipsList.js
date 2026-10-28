import { jsx } from "react/jsx-runtime";
import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { Badge } from "../../../Badge/index.js";
import { FilterSlider } from "../../../FiltersStrip/FilterSlider.js";
import { Loader } from "../../../Loader/index.js";
function getBadgeLabel(item, notificationList) {
  const baseLabel = item.label || "";
  if (item.numberOfTypes) {
    return `${baseLabel} (${item.numberOfTypes})`;
  }
  const count = notificationList.filter((listItem) => listItem.badge === item.label).length;
  return count > 0 ? `${baseLabel} (${count})` : baseLabel;
}
function toFilterSliderList(list) {
  return list.map((item) => ({
    id: String(item.id ?? item.label),
    label: item.label,
    values: []
  }));
}
function getSliderWidth(expandList, listLength, collapsedWidth) {
  if (expandList) {
    return "75%";
  }
  if (listLength < 3) {
    return "fit-content";
  }
  return collapsedWidth != null ? `${collapsedWidth}px` : "auto";
}
function NotificationChipsList({
  list,
  currActiveListType,
  setCurrActiveListType,
  activeBadge,
  showBadgeLoader,
  notificationList,
  expandList,
  setExpandList,
  setSearchExpand
}) {
  const containerRef = useRef(null);
  const [collapsedWidth, setCollapsedWidth] = useState(null);
  const handleClick = useCallback(
    (chip) => {
      var _a, _b;
      (_a = chip.handleClick) == null ? void 0 : _a.call(chip);
      (_b = chip.onClick) == null ? void 0 : _b.call(chip);
      setCurrActiveListType(chip.label);
    },
    [setCurrActiveListType]
  );
  const handleExpandClick = useCallback(() => {
    if (!expandList) {
      setSearchExpand(false);
    }
    setExpandList((prev) => !prev);
  }, [expandList, setExpandList, setSearchExpand]);
  useLayoutEffect(() => {
    if (expandList || list.length < 3) {
      return;
    }
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const firstItem = el.querySelector(".impact-selected-filter-wrapper");
    const expandBtn = el.querySelector(".impact-selected-filter-action-btn.expand");
    if (!firstItem) {
      return;
    }
    const firstItemWidth = firstItem.getBoundingClientRect().width;
    const btnWidth = expandBtn ? expandBtn.getBoundingClientRect().width : 48;
    const CONTAINER_GAP = 8;
    setCollapsedWidth(Math.ceil(firstItemWidth) + CONTAINER_GAP + btnWidth);
  }, [list, notificationList, expandList]);
  if (showBadgeLoader) {
    return /* @__PURE__ */ jsx(Loader, { showSkeleton: true });
  }
  const activeLabel = activeBadge != null && activeBadge !== "" ? activeBadge : currActiveListType;
  return /* @__PURE__ */ jsx("div", { className: "impact-notification-task-list-chips", children: /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: `impact-notification-task-list-item ${expandList ? "list-item-full-width" : ""}`,
      children: /* @__PURE__ */ jsx(
        FilterSlider,
        {
          currDropShow: null,
          handleExpandClick,
          isExpanded: expandList,
          list: toFilterSliderList(list),
          tagsChildren: (item, index) => {
            const chip = list[index];
            if (!chip) {
              return null;
            }
            return /* @__PURE__ */ jsx(
              Badge,
              {
                color: activeLabel === chip.label ? "info" : void 0,
                label: getBadgeLabel(chip, notificationList),
                variant: "stroke",
                onClick: () => {
                  handleClick(chip);
                }
              },
              item.id
            );
          },
          width: getSliderWidth(expandList, list.length, collapsedWidth)
        }
      )
    }
  ) });
}
export {
  NotificationChipsList
};
