import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/SearchOutlined.js";
import { Badge } from "../Badge/index.js";
import { Button } from "../Button/index.js";
import { Input } from "../Input/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function AppliedFilters({
  selectedFilter,
  setSelectedFilter,
  recentFilters,
  savedFiltersBadge,
  savedFilterLists,
  handleApplyFilter,
  handleCancelFilter,
  handleBadgeChange,
  setShowDropDown,
  selectedBadge,
  setSelectedBadge,
  tempSelectedFilter,
  setTempSelectedFilter,
  selectedFilterOnApply,
  setSelectedFilterOnApply
}) {
  const { t } = useTranslation();
  const [savedLists, setSavedLists] = useState(savedFilterLists);
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    setSavedLists(savedFilterLists);
  }, [savedFilterLists]);
  const handleSearch = (event) => {
    setSearchInput(event.target.value);
    const searchTerm = event.target.value.trim().toLowerCase();
    const searchTerms = searchTerm.split(/\s+/).filter(Boolean);
    if (searchTerms.length > 0) {
      const searchResults = savedFilterLists.filter((option) => {
        const label = option.label.toLowerCase() ?? "";
        return searchTerms.every((term) => label.includes(term));
      });
      setSavedLists([...searchResults]);
    } else {
      setSavedLists(savedFilterLists);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "impact-filter-dropdown-wrapper", children: [
    recentFilters.length > 0 && /* @__PURE__ */ jsxs("div", { className: "impact-filter-dropdown-recent-container", children: [
      /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-label", children: t("filtersStrip.recent") }),
      /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-recent-filters-wrapper", children: recentFilters.map((filter, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "impact-filter-dropdown-recent-filters",
          role: "button",
          tabIndex: 0,
          onClick: () => {
            filter.handleRecentFilter(filter);
            setShowDropDown(false);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              filter.handleRecentFilter(filter);
              setShowDropDown(false);
            }
          },
          children: [
            filter.filterSet.slice(0, 2).map((fil, i) => /* @__PURE__ */ jsxs("span", { children: [
              fil.label,
              i === 0 && filter.filterSet.length > 1 && ", "
            ] }, i)),
            filter.filterSet.length > 2 && ",..."
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsx("div", { className: "impact-notification-horizontal-separator" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "impact-filter-dropdown-saved-container", children: [
      /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-label", children: t("filtersStrip.savedFilters") }),
      /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-saved-filters-badge-wrapper", children: savedFiltersBadge.map((badge, index) => /* @__PURE__ */ jsx(
        Badge,
        {
          color: selectedBadge === badge.label ? "info" : void 0,
          label: badge.label,
          variant: "stroke",
          onClick: () => {
            handleBadgeChange(badge);
            setSelectedBadge(badge.label);
          }
        },
        index
      )) }),
      savedFilterLists.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-saved-filters-search-wrapper", children: /* @__PURE__ */ jsx(
          Input,
          {
            leftIcon: /* @__PURE__ */ jsx(default_1, {}),
            placeholder: t("filtersStrip.searchPlaceholder"),
            value: searchInput,
            onChange: handleSearch
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-saved-filters-lists-wrapper", children: savedLists.length > 0 ? savedLists.map((list) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `impact-filter-dropdown-saved-filters-list ${selectedFilterOnApply === list.label ? "filter-dropdown-selected-list" : ""}`,
            role: "button",
            tabIndex: 0,
            onClick: () => {
              setSelectedFilter(list.label);
              setSelectedFilterOnApply(list.label);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedFilter(list.label);
                setSelectedFilterOnApply(list.label);
              }
            },
            children: list.label
          },
          list.value
        )) : /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-saved-filters-no-data", children: /* @__PURE__ */ jsx("span", { className: "impact-filter-dropdown-saved-filters-no-data-text", children: t("filtersStrip.noSavedFilters") }) }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "impact-filter-dropdown-saved-filters-no-data", children: /* @__PURE__ */ jsx("span", { className: "impact-filter-dropdown-saved-filters-no-data-text", children: t("filtersStrip.noSavedFilters") }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "impact-filter-dropdown-action-wrapper", children: [
      /* @__PURE__ */ jsx("div", { className: "impact-notification-horizontal-separator" }),
      /* @__PURE__ */ jsxs("div", { className: "impact-filter-dropdown-action-btns", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "large",
            variant: "text",
            onClick: () => {
              setSelectedFilterOnApply(tempSelectedFilter);
              handleCancelFilter();
              setShowDropDown(false);
            },
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            disabled: savedLists.length === 0,
            size: "large",
            variant: "primary",
            onClick: () => {
              setTempSelectedFilter(selectedFilterOnApply);
              handleApplyFilter(selectedFilter);
              setShowDropDown(false);
            },
            children: t("filtersStrip.applyFilter")
          }
        )
      ] })
    ] })
  ] });
}
AppliedFilters.displayName = "AppliedFilters";
export {
  AppliedFilters
};
