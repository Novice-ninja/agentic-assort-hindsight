import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowDown.js";
import { Badge } from "../Badge/index.js";
import { AppliedFilters } from "./AppliedFilters.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function FilterDropDown({
  selectedFilter,
  setSelectedFilter,
  recentFilters = [],
  savedFilterLists = [],
  savedFiltersBadge = [],
  handleApplyFilter,
  handleCancelFilter,
  handleBadgeChange,
  hideSelectedFilterBadge = false,
  savedFilterSelectedBadge = null,
  handleSavedRecentFilterDropdown,
  filterDropDownLabel
}) {
  const { t } = useTranslation();
  const resolvedFilterDropDownLabel = filterDropDownLabel ?? t("filtersStrip.filtersApplied");
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(
    savedFilterSelectedBadge ?? null
  );
  const [tempSelectedFilter, setTempSelectedFilter] = useState(selectedFilter);
  const [selectedFilterOnApply, setSelectedFilterOnApply] = useState(selectedFilter);
  const handleClickOutside = useCallback(
    (event) => {
      const target = event.target;
      if (showDropDown && !target.closest(".impact-filter-dropdown-container") && !target.closest(".impact-filter-dropdown-action-btns")) {
        setShowDropDown(false);
        setSelectedFilterOnApply(tempSelectedFilter);
      }
    },
    [showDropDown, tempSelectedFilter]
  );
  useEffect(() => {
    setTempSelectedFilter(selectedFilter);
  }, [selectedFilter]);
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);
  return /* @__PURE__ */ jsxs("div", { className: "impact-filter-dropdown-container", children: [
    /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-label", children: resolvedFilterDropDownLabel }),
    !hideSelectedFilterBadge && /* @__PURE__ */ jsx(
      Badge,
      {
        color: "info",
        label: tempSelectedFilter,
        tabIndex: -1,
        variant: "stroke",
        onClick: () => {
        }
      }
    ),
    !hideSelectedFilterBadge && /* @__PURE__ */ jsx(
      "div",
      {
        "aria-expanded": showDropDown,
        "aria-label": t("filtersStrip.toggleDropdown"),
        className: "impact-filter-dropdown-button",
        role: "button",
        style: {
          transform: showDropDown ? "rotate(180deg)" : "rotate(0deg)"
        },
        tabIndex: 0,
        onClick: () => {
          setShowDropDown((prev) => !prev);
          handleSavedRecentFilterDropdown == null ? void 0 : handleSavedRecentFilterDropdown();
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowDropDown((prev) => !prev);
            handleSavedRecentFilterDropdown == null ? void 0 : handleSavedRecentFilterDropdown();
          }
          if (e.key === "Escape") {
            setShowDropDown(false);
          }
        },
        children: /* @__PURE__ */ jsx(default_1, {})
      }
    ),
    showDropDown && /* @__PURE__ */ jsx(
      AppliedFilters,
      {
        handleApplyFilter,
        handleBadgeChange,
        handleCancelFilter,
        recentFilters,
        savedFilterLists,
        savedFiltersBadge,
        selectedBadge,
        selectedFilter,
        selectedFilterOnApply,
        setSelectedBadge,
        setSelectedFilter,
        setSelectedFilterOnApply,
        setShowDropDown,
        setTempSelectedFilter,
        tempSelectedFilter
      }
    )
  ] });
}
FilterDropDown.displayName = "FilterDropDown";
export {
  FilterDropDown
};
