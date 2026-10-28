import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { memo, useRef, useState, useCallback, useEffect, Fragment } from "react";
import default_1$1 from "../../node_modules/@mui/icons-material/Close.js";
import default_1$2 from "../../node_modules/@mui/icons-material/Search.js";
import default_1 from "../../node_modules/@mui/icons-material/Tune.js";
import moment from "moment";
import { getAssetUrl } from "../../utils/assetBase.js";
import { debounce } from "../../utils/debounce.js";
import { DatePicker } from "../DatePicker/index.js";
import { DateRangePicker } from "../DateRangePicker/index.js";
import { Input } from "../Input/index.js";
import { Select } from "../Select/index.js";
import { syncFiltersWithModal, parseInlineSearchValue, buildFilterModelEntry } from "./filterUtils.js";
import HighlightedText from "./HighlightedText.js";
import { Tooltip } from "../Tooltip/index.js";
import Badge from "../../node_modules/@mui/material/Badge/Badge.js";
const TableSortIcon = getAssetUrl("icons/tableSortIcon.svg");
const TableSortAscIcon = getAssetUrl("icons/Up.svg");
const TableSortDescIcon = getAssetUrl("icons/Down.svg");
function AgGridHeader({
  children,
  sortModel,
  handleInlineSearch,
  handleClearSearchInline,
  handleCloseInputField,
  debounceTime,
  initialFilters,
  enableHeaderTextWrap = true,
  ...rest
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa;
  if (!rest.column || !rest.api) {
    return null;
  }
  const getLabelFromDropdownValue = (value, columnDef) => {
    if (!(columnDef == null ? void 0 : columnDef.isThirdOptionDropdownIsBoolean) || !(columnDef == null ? void 0 : columnDef.thirdOptionDropdownOptions) || !Array.isArray(columnDef.thirdOptionDropdownOptions)) {
      return value;
    }
    const option = columnDef.thirdOptionDropdownOptions.find((opt) => {
      const optValue = typeof opt === "object" ? opt.value : opt;
      const filterValue = String(value || "").toLowerCase();
      const optValueStr = String(optValue || "").toLowerCase();
      return optValueStr === filterValue || optValueStr === filterValue.replace(/\s+/g, "");
    });
    if (option) {
      return typeof option === "object" ? option.label : option;
    }
    return value;
  };
  const getOptionFromDropdownValue = (value, columnDef) => {
    if (!(columnDef == null ? void 0 : columnDef.thirdOptionDropdownOptions) || !Array.isArray(columnDef.thirdOptionDropdownOptions) || !value) {
      return value;
    }
    const valueStr = String(value || "").toLowerCase().trim();
    if (!valueStr) {
      return value;
    }
    const option = columnDef.thirdOptionDropdownOptions.find((opt) => {
      const optValue = typeof opt === "object" ? opt.value : opt;
      const optValueStr = String(optValue || "").toLowerCase().trim();
      return optValueStr === valueStr;
    });
    if (option) {
      return typeof option === "object" ? option : { label: option, value: option };
    }
    return value;
  };
  const menuRef = useRef();
  const inputRef = useRef();
  useRef();
  const originalColumnWidthRef = useRef(null);
  const [showInputField, setShowInputField] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuvisible] = useState(false);
  const [currentSort, setCurrentSort] = useState(((_b = (_a = rest.column) == null ? void 0 : _a.getSort) == null ? void 0 : _b.call(_a)) ?? null);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const originalSuppressHeaderKeyboardEventRef = useRef(
    (_d = (_c = rest.column) == null ? void 0 : _c.colDef) == null ? void 0 : _d.suppressHeaderKeyboardEvent
  );
  const [isOverflowText, setIsOverflowText] = useState(false);
  const headerTextRef = useRef(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const onFilterChanged = useCallback(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2;
    const newFilterModel = (_a2 = rest.api) == null ? void 0 : _a2.getFilterModel();
    const columnId = ((_b2 = rest.column) == null ? void 0 : _b2.field) || ((_c2 = rest.column) == null ? void 0 : _c2.colId);
    const columnFilter = newFilterModel == null ? void 0 : newFilterModel[columnId];
    let filterValue = "";
    if (columnFilter) {
      if (((_e2 = (_d2 = rest.column) == null ? void 0 : _d2.colDef) == null ? void 0 : _e2.filter) === "agDateColumnFilter") {
        const dateFrom = columnFilter == null ? void 0 : columnFilter.dateFrom;
        const dateTo = columnFilter == null ? void 0 : columnFilter.dateTo;
        if (dateFrom && dateTo) {
          setStartDate(moment(dateFrom));
          setEndDate(moment(dateTo));
          const dateFromStr = dateFrom instanceof Date ? moment(dateFrom).format("YYYY-MM-DD") : typeof dateFrom === "string" ? dateFrom.split(" ")[0] : dateFrom;
          const dateToStr = dateTo instanceof Date ? moment(dateTo).format("YYYY-MM-DD") : typeof dateTo === "string" ? dateTo.split(" ")[0] : dateTo;
          filterValue = `${dateFromStr} - ${dateToStr}`;
        } else if (dateFrom) {
          filterValue = moment(dateFrom);
          setSelectedDate(filterValue);
          if (dateFrom instanceof Date) {
            filterValue = moment(dateFrom).format("YYYY-MM-DD");
          } else if (typeof dateFrom === "string") {
            filterValue = dateFrom.split(" ")[0];
          } else {
            filterValue = dateFrom;
          }
        }
      } else {
        filterValue = isMultiSelect && (columnFilter == null ? void 0 : columnFilter.conditions) ? (_f2 = columnFilter == null ? void 0 : columnFilter.conditions) == null ? void 0 : _f2.map((condition) => condition.filter) : columnFilter == null ? void 0 : columnFilter.filter;
        if (((_h2 = (_g2 = rest.column) == null ? void 0 : _g2.colDef) == null ? void 0 : _h2.thirdOptionAsDropdown) && filterValue) {
          const initialDropdownOption = (_j2 = (_i2 = rest.column) == null ? void 0 : _i2.colDef) == null ? void 0 : _j2.thirdOptionDropdownOptions;
          let option = null;
          if (isMultiSelect) {
            option = initialDropdownOption == null ? void 0 : initialDropdownOption.filter((option2) => filterValue.includes(option2.value));
          } else {
            option = initialDropdownOption == null ? void 0 : initialDropdownOption.find((option2) => option2.value === filterValue);
          }
          if (option) {
            setSelectedDropdownOption(
              typeof option === "object" ? option : { label: option, value: option }
            );
          }
        } else {
          const displayValue = getLabelFromDropdownValue(filterValue, (_k2 = rest.column) == null ? void 0 : _k2.colDef);
          setSearchText(displayValue);
        }
      }
    }
    if (!filterValue) {
      setSearchText("");
      setSelectedDropdownOption(isMultiSelect ? [] : null);
      setSelectedDate(null);
      setStartDate(null);
      setEndDate(null);
      setHasActiveSearch(false);
    } else {
      if (!((_m2 = (_l2 = rest.column) == null ? void 0 : _l2.colDef) == null ? void 0 : _m2.thirdOptionAsDropdown)) {
        const displayValue = getLabelFromDropdownValue(filterValue, (_n2 = rest.column) == null ? void 0 : _n2.colDef);
        setSearchText(displayValue);
      }
      setHasActiveSearch(true);
    }
  }, [rest.api]);
  useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.thirdOptionAsDropdown) {
      const options = ((_d2 = (_c2 = rest.column) == null ? void 0 : _c2.colDef) == null ? void 0 : _d2.thirdOptionDropdownOptions) || [];
      setCurrentDropdownOptions(options);
    }
  }, [(_f = (_e = rest.column) == null ? void 0 : _e.colDef) == null ? void 0 : _f.thirdOptionAsDropdown, (_h = (_g = rest.column) == null ? void 0 : _g.colDef) == null ? void 0 : _h.thirdOptionDropdownOptions]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const isMultiSelect = (_j = (_i = rest.column) == null ? void 0 : _i.colDef) == null ? void 0 : _j.enableMultiSelect;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(isMultiSelect ? [] : null);
  const [currentDropdownOptions, setCurrentDropdownOptions] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2;
    const columnId = ((_a2 = rest.column) == null ? void 0 : _a2.field) || ((_b2 = rest.column) == null ? void 0 : _b2.colId);
    const currentFilterModel = ((_d2 = (_c2 = rest.api) == null ? void 0 : _c2.getFilterModel) == null ? void 0 : _d2.call(_c2)) || {};
    const existingFilter = currentFilterModel[columnId] ?? currentFilterModel[(_e2 = rest.column) == null ? void 0 : _e2.colId];
    if (existingFilter) {
      onFilterChanged();
      if ((_g2 = (_f2 = rest.column) == null ? void 0 : _f2.colDef) == null ? void 0 : _g2.isSearchable) {
        if (((_i2 = (_h2 = rest.column) == null ? void 0 : _h2.colDef) == null ? void 0 : _i2.filter) === "agDateColumnFilter") {
          setShowDatePicker(true);
        } else {
          setShowInputField(true);
        }
      }
    }
    rest.api.addEventListener("filterChanged", onFilterChanged);
    return () => {
      rest.api.removeEventListener("filterChanged", onFilterChanged);
    };
  }, []);
  const prevSearchValueRef = useRef(void 0);
  const handleSearchChange = (value) => {
    var _a2, _b2, _c2, _d2, _e2;
    const isEmptyValue = (val) => val === null || val === void 0 || val === "" || Array.isArray(val) && val.length === 0;
    const normalizedValue = isEmptyValue(value) ? null : value;
    const normalizedPrev = isEmptyValue(prevSearchValueRef.current) ? null : prevSearchValueRef.current;
    const currentValue = typeof normalizedValue === "object" && normalizedValue !== null ? JSON.stringify(normalizedValue) : normalizedValue;
    const prevValue = typeof normalizedPrev === "object" && normalizedPrev !== null ? JSON.stringify(normalizedPrev) : normalizedPrev;
    if (currentValue === prevValue) {
      const colId = (_a2 = rest.column) == null ? void 0 : _a2.colId;
      const hasExistingFilter = Boolean(colId && ((_d2 = (_c2 = (_b2 = rest.api) == null ? void 0 : _b2.getFilterModel) == null ? void 0 : _c2.call(_b2)) == null ? void 0 : _d2[colId]));
      if (!(normalizedValue === null && hasExistingFilter)) {
        return;
      }
    }
    prevSearchValueRef.current = value;
    if (handleInlineSearch) {
      handleInlineSearch == null ? void 0 : handleInlineSearch(value);
      (_e2 = rest.onFilterChanged) == null ? void 0 : _e2.call(rest, rest);
      return;
    }
    setTimeout(() => {
      var _a3, _b3, _c3, _d3;
      try {
        const { inputValue, filterType } = parseSearchValue(value);
        applyFilterToGrid(inputValue, filterType);
        syncFiltersWithModal(
          rest.api,
          rest.column.colId,
          inputValue,
          (_a3 = rest.column) == null ? void 0 : _a3.colDef,
          rest.colDefs,
          rest.setValue,
          rest.setInitialFilters,
          getOptionFromDropdownValue
        );
        (_c3 = (_b3 = rest.api) == null ? void 0 : _b3.onFilterChanged) == null ? void 0 : _c3.call(_b3);
        (_d3 = rest.onFilterChanged) == null ? void 0 : _d3.call(rest, rest);
      } catch (error) {
        console.warn("Error during filter operation:", error);
      }
    }, 0);
  };
  const parseSearchValue = (value) => {
    var _a2, _b2, _c2, _d2, _e2;
    if ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.thirdOptionAsDropdown) {
      const isBoolean = ((_d2 = (_c2 = rest.column) == null ? void 0 : _c2.colDef) == null ? void 0 : _d2.dataType) === "boolean";
      if (Array.isArray(value)) {
        const extractedValues = value.map((opt) => opt);
        return {
          inputValue: extractedValues,
          filterType: isBoolean ? "equals" : "contains"
        };
      }
      const extractedValue = typeof value === "object" && value !== null ? value.value : value;
      return {
        inputValue: extractedValue,
        filterType: isBoolean ? "equals" : "contains"
      };
    } else {
      const parsed = parseInlineSearchValue(
        value,
        (_e2 = rest.column) == null ? void 0 : _e2.colDef,
        rest.api,
        rest.column.colId
      );
      return {
        inputValue: parsed.parsedValue,
        filterType: parsed.filterType
      };
    }
  };
  const updateEmptyStateOverlay = () => {
    setTimeout(() => {
      if (rest.api) {
        const displayedRowCount = rest.api.getDisplayedRowCount();
        if (displayedRowCount === 0) {
          rest.api.showNoRowsOverlay();
        } else {
          rest.api.hideOverlay();
        }
      }
    }, 0);
  };
  const applyFilterToGrid = (inputValue, filterType) => {
    var _a2;
    const currentFilterModel = rest.sortModel || rest.api.getFilterModel();
    const filterEntry = buildFilterModelEntry(inputValue, filterType, (_a2 = rest.column) == null ? void 0 : _a2.colDef);
    if (filterEntry === void 0) {
      delete currentFilterModel[rest.column.colId];
    } else {
      currentFilterModel[rest.column.colId] = filterEntry;
    }
    rest.api.setFilterModel(currentFilterModel);
    updateEmptyStateOverlay();
  };
  const debouncedHandleSearchChange = useCallback(
    debounce((value) => {
      handleSearchChange(value);
    }, debounceTime),
    []
  );
  const handleSearch = (e) => {
    var _a2, _b2;
    e.stopPropagation();
    if (((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.filter) === "agDateColumnFilter") {
      setShowDatePicker((prev) => !prev);
    } else {
      setShowInputField((prev) => !prev);
    }
    expandColumnIfNeeded();
  };
  const onCloseIconClick = (colId) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2;
    setSearchText("");
    setSelectedDropdownOption(isMultiSelect ? [] : null);
    setSelectedDate(null);
    setStartDate(null);
    setEndDate(null);
    setHasActiveSearch(false);
    prevSearchValueRef.current = void 0;
    (_a2 = rest.api) == null ? void 0 : _a2.destroyFilter(colId);
    const currentFilterModel = { ...((_b2 = rest.api) == null ? void 0 : _b2.getFilterModel()) || {} };
    delete currentFilterModel[colId];
    (_c2 = rest.api) == null ? void 0 : _c2.setFilterModel(currentFilterModel);
    const currentFilters = ((_e2 = (_d2 = rest.getValues) == null ? void 0 : _d2.call(rest)) == null ? void 0 : _e2.filters) || [];
    const updatedFilters = currentFilters.filter((f) => {
      var _a3;
      return ((_a3 = f == null ? void 0 : f.column) == null ? void 0 : _a3.value) !== colId;
    });
    (_f2 = rest.setValue) == null ? void 0 : _f2.call(rest, "filters", updatedFilters);
    (_g2 = rest.setInitialFilters) == null ? void 0 : _g2.call(rest, updatedFilters);
    (_i2 = (_h2 = rest.api) == null ? void 0 : _h2.onFilterChanged) == null ? void 0 : _i2.call(_h2);
    if (rest.onFilterChanged) {
      rest.onFilterChanged(rest);
    }
    updateEmptyStateOverlay();
  };
  const MIN_SEARCH_WIDTH = 200;
  const expandColumnIfNeeded = () => {
    var _a2;
    const currentWidth = (_a2 = rest.column) == null ? void 0 : _a2.actualWidth;
    if (currentWidth && currentWidth < MIN_SEARCH_WIDTH) {
      originalColumnWidthRef.current = currentWidth;
      rest.api.setColumnWidths([{ key: rest.column.colId, newWidth: MIN_SEARCH_WIDTH }]);
    }
  };
  const restoreColumnWidth = () => {
    if (originalColumnWidthRef.current !== null) {
      rest.api.setColumnWidths([
        { key: rest.column.colId, newWidth: originalColumnWidthRef.current }
      ]);
      originalColumnWidthRef.current = null;
    }
  };
  useEffect(() => {
    if (!menuVisible) return void 0;
    const handleClickOutside = () => {
      setMenuvisible(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuVisible]);
  const onHeaderClick = () => {
    var _a2, _b2;
    if (rest.applySort) {
      rest.applySort(rest.column.colId);
      return;
    }
    if ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.sortable) {
      const currentSortModel = rest.api.getColumnState();
      const currentSort2 = currentSortModel.find((model) => model.colId === rest.column.colId);
      const newSort = (currentSort2 == null ? void 0 : currentSort2.sort) === null ? "asc" : (currentSort2 == null ? void 0 : currentSort2.sort) === "asc" ? "desc" : null;
      rest.api.applyColumnState({
        state: [{ colId: rest.column.colId, sort: newSort }],
        defaultState: { sort: null }
      });
    }
  };
  useEffect(() => {
    var _a2;
    const onSortChanged = () => {
      var _a3, _b2;
      setCurrentSort(((_b2 = (_a3 = rest.column) == null ? void 0 : _a3.getSort) == null ? void 0 : _b2.call(_a3)) ?? null);
    };
    (_a2 = rest.api) == null ? void 0 : _a2.addEventListener("sortChanged", onSortChanged);
    return () => {
      var _a3;
      return (_a3 = rest.api) == null ? void 0 : _a3.removeEventListener("sortChanged", onSortChanged);
    };
  }, [rest.api, rest.column]);
  const onColumnMoved = useCallback(
    (params) => {
      var _a2, _b2;
      if (((_a2 = params == null ? void 0 : params.column) == null ? void 0 : _a2.colId) && (showInputField || showDatePicker)) {
        (_b2 = rest.api) == null ? void 0 : _b2.applyColumnState({
          state: [
            {
              colId: params.column.colId,
              width: params.column.actualWidth
            }
          ],
          defaultState: { width: null }
        });
      }
    },
    [rest.api, showInputField, showDatePicker]
  );
  useEffect(() => {
    const api = rest.api;
    if (!api) return void 0;
    api.addEventListener("columnResized", onColumnMoved);
    return () => {
      api.removeEventListener("columnResized", onColumnMoved);
    };
  }, [rest.api, onColumnMoved]);
  useEffect(() => {
    var _a2;
    const colDef = (_a2 = rest.column) == null ? void 0 : _a2.colDef;
    if (!colDef) return;
    if (isInputFocused) {
      if (originalSuppressHeaderKeyboardEventRef.current === void 0) {
        originalSuppressHeaderKeyboardEventRef.current = colDef.suppressHeaderKeyboardEvent;
      }
      colDef.suppressHeaderKeyboardEvent = () => true;
    } else {
      colDef.suppressHeaderKeyboardEvent = originalSuppressHeaderKeyboardEventRef.current;
    }
    return () => {
      if (colDef) {
        colDef.suppressHeaderKeyboardEvent = originalSuppressHeaderKeyboardEventRef.current;
      }
    };
  }, [isInputFocused, (_k = rest.column) == null ? void 0 : _k.colId]);
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: `custom-ag-header-container ${((_m = (_l = rest.column) == null ? void 0 : _l.colDef) == null ? void 0 : _m.checkboxSelection) || ((_n = rest.column) == null ? void 0 : _n.colId) === "ag-Grid-SelectionColumn" ? "checkbox-selection" : ""} ${((_p = (_o = rest.column) == null ? void 0 : _o.colDef) == null ? void 0 : _p.customHeaderIcons) || !(((_r = (_q = rest.column) == null ? void 0 : _q.colDef) == null ? void 0 : _r.suppressHeaderMenuButton) ?? ((_t = (_s = rest.column) == null ? void 0 : _s.colDef) == null ? void 0 : _t.suppressMenu)) || ((_v = (_u = rest.column) == null ? void 0 : _u.colDef) == null ? void 0 : _v.isSearchable) ? "with-icons" : ""}`,
      onClick: () => rest.onClick(),
      children: showDatePicker ? /* @__PURE__ */ jsxs("div", { className: `ia-search-input-field ia-search-input-narrow`, children: [
        ((_x = (_w = rest.column) == null ? void 0 : _w.colDef) == null ? void 0 : _x.thirdOptionAsDateRangePicker) ? /* @__PURE__ */ jsx(
          DateRangePicker,
          {
            fullWidth: true,
            withPortal: true,
            customIcon: ((_z = (_y = rest.column) == null ? void 0 : _y.colDef) == null ? void 0 : _z.advanceSearchEnabled) && /* @__PURE__ */ jsx(
              default_1,
              {
                className: "ia-search-input-field-custom-icon",
                onClick: (e) => {
                  var _a2, _b2, _c2, _d2, _e2, _f2;
                  e.stopPropagation();
                  if (rest.onAdvanceSearchClick) {
                    rest.onAdvanceSearchClick(rest.column);
                    return;
                  }
                  rest.toggleAdvanceSearch(
                    ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.toShowDuplicateColumnInAdvanceSearch) ? ((_d2 = (_c2 = rest.column) == null ? void 0 : _c2.colDef) == null ? void 0 : _d2.columnFieldsInAdvanceSearch) ? (_f2 = (_e2 = rest.column) == null ? void 0 : _e2.colDef) == null ? void 0 : _f2.columnFieldsInAdvanceSearch : rest.column.colId : rest.column.colId
                  );
                }
              }
            ),
            displayFormat: ((_B = (_A = rest.column) == null ? void 0 : _A.colDef) == null ? void 0 : _B.displayFormat) || "MM-DD-YYYY",
            endDate,
            handleDatesChange: (start, end) => {
              setStartDate(start);
              setEndDate(end);
            },
            maxDate: /* @__PURE__ */ new Date("2100-12-31"),
            minDate: /* @__PURE__ */ new Date("2000-01-01"),
            setEndDate,
            setStartDate,
            startDate,
            onPrimaryButtonClick: () => {
              if (startDate && endDate) {
                handleSearchChange({ startDate, endDate });
              }
              setShowDatePicker(false);
            },
            onResetClick: () => {
              setStartDate(null);
              setEndDate(null);
              handleSearchChange(null);
              setShowDatePicker(false);
            },
            onSecondaryButtonClick: () => {
              setShowDatePicker(false);
            }
          }
        ) : /* @__PURE__ */ jsx(
          DatePicker,
          {
            fullWidth: true,
            showMonthYearSelect: true,
            withPortal: true,
            customIcon: ((_D = (_C = rest.column) == null ? void 0 : _C.colDef) == null ? void 0 : _D.advanceSearchEnabled) && /* @__PURE__ */ jsx(
              default_1,
              {
                className: "ia-search-input-field-custom-icon",
                onClick: () => {
                  var _a2, _b2, _c2, _d2, _e2, _f2;
                  if (rest.onAdvanceSearchClick) {
                    rest.onAdvanceSearchClick(rest.column);
                    return;
                  }
                  rest.toggleAdvanceSearch(
                    ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.toShowDuplicateColumnInAdvanceSearch) ? ((_d2 = (_c2 = rest.column) == null ? void 0 : _c2.colDef) == null ? void 0 : _d2.columnFieldsInAdvanceSearch) ? (_f2 = (_e2 = rest.column) == null ? void 0 : _e2.colDef) == null ? void 0 : _f2.columnFieldsInAdvanceSearch : rest.column.colId : rest.column.colId
                  );
                }
              }
            ),
            displayFormat: ((_F = (_E = rest.column) == null ? void 0 : _E.colDef) == null ? void 0 : _F.displayFormat) || "MM-DD-YYYY",
            maxDate: /* @__PURE__ */ new Date("2100-12-31"),
            minDate: /* @__PURE__ */ new Date("2000-01-01"),
            placeholder: "Select Date",
            selectedDate,
            setSelectedDate,
            onPrimaryButtonClick: () => {
              handleSearchChange(selectedDate);
              setShowDatePicker(false);
            },
            onSecondaryButtonClick: () => {
              setShowDatePicker(false);
            },
            onTertiaryButtonClick: () => {
              setSelectedDate(null);
              handleSearchChange(null);
              setShowDatePicker(false);
            }
          }
        ),
        /* @__PURE__ */ jsx(
          default_1$1,
          {
            className: "ia-search-input-field-close-icon",
            style: { cursor: "pointer" },
            onClick: () => {
              handleCloseInputField == null ? void 0 : handleCloseInputField();
              setShowDatePicker(false);
              restoreColumnWidth();
            }
          }
        )
      ] }) : showInputField ? /* @__PURE__ */ jsxs(
        "div",
        {
          className: `ia-search-input-field ia-search-input-narrow
             ${((_H = (_G = rest.column) == null ? void 0 : _G.colDef) == null ? void 0 : _H.thirdOptionAsDropdown) ? "with-dropdown" : ""}`,
          children: [
            ((_J = (_I = rest.column) == null ? void 0 : _I.colDef) == null ? void 0 : _J.thirdOptionAsDropdown) && !((_L = (_K = rest.column) == null ? void 0 : _K.colDef) == null ? void 0 : _L.toShowDuplicateColumnInAdvanceSearch) ? /* @__PURE__ */ jsxs(
              "div",
              {
                id: "ia-select-option-dropdown-container",
                style: {
                  position: "relative",
                  // width: (Array.isArray(selectedDropdownOption) ? selectedDropdownOption.length > 0 : !!selectedDropdownOption) ? "66%" : "100%",
                  width: "100%",
                  minWidth: 0
                },
                children: [
                  /* @__PURE__ */ jsx(
                    Select,
                    {
                      currentOptions: currentDropdownOptions,
                      dropDownPortalClassName: "ag-select-dropdown-portal",
                      initialOptions: (_N = (_M = rest == null ? void 0 : rest.column) == null ? void 0 : _M.colDef) == null ? void 0 : _N.thirdOptionDropdownOptions,
                      isClearable: true,
                      isMulti: (_P = (_O = rest == null ? void 0 : rest.column) == null ? void 0 : _O.colDef) == null ? void 0 : _P.enableMultiSelect,
                      isOpen: isDropdownOpen,
                      isSelectAll,
                      isWithSearch: (_R = (_Q = rest == null ? void 0 : rest.column) == null ? void 0 : _Q.colDef) == null ? void 0 : _R.enableSearch,
                      placeholder: "Select option",
                      selectedOptions: selectedDropdownOption,
                      setCurrentOptions: setCurrentDropdownOptions,
                      setIsOpen: setIsDropdownOpen,
                      setIsSelectAll,
                      setSelectedOptions: (option) => {
                        setSelectedDropdownOption(option);
                        if (!isMultiSelect) {
                          if (option) {
                            const value = typeof option === "object" ? option.value : option;
                            setHasActiveSearch(true);
                            handleSearchChange(value);
                          } else {
                            setHasActiveSearch(false);
                            handleSearchChange(null);
                          }
                        }
                      },
                      toggleSelectAll: (_T = (_S = rest == null ? void 0 : rest.column) == null ? void 0 : _S.colDef) == null ? void 0 : _T.enableMultiSelect,
                      onClearAll: () => {
                        setSelectedDropdownOption(isMultiSelect ? [] : null);
                        setHasActiveSearch(false);
                        handleSearchChange(null);
                        setIsSelectAll(false);
                      },
                      onDropdownClose: () => {
                        if (isMultiSelect && (selectedDropdownOption == null ? void 0 : selectedDropdownOption.length) > 0) {
                          setHasActiveSearch(true);
                          handleSearchChange(selectedDropdownOption);
                        }
                      },
                      withPortal: true,
                      minWidth: "100%",
                      ...(_V = (_U = rest.column) == null ? void 0 : _U.colDef) == null ? void 0 : _V.selectProps
                    }
                  ),
                  ((_X = (_W = rest.column) == null ? void 0 : _W.colDef) == null ? void 0 : _X.advanceSearchEnabled) && /* @__PURE__ */ jsx(
                    default_1,
                    {
                      className: "ia-search-input-field-custom-icon",
                      id: "toggle-advance-search-icon",
                      style: {
                        position: "absolute",
                        right: (Array.isArray(selectedDropdownOption) ? selectedDropdownOption.length > 0 : !!selectedDropdownOption) ? "44px" : "28px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        zIndex: 1,
                        pointerEvents: "auto"
                      },
                      onClick: (e) => {
                        var _a2, _b2, _c2, _d2, _e2, _f2;
                        e.stopPropagation();
                        if (rest.onAdvanceSearchClick) {
                          rest.onAdvanceSearchClick(rest.column);
                          return;
                        }
                        rest.toggleAdvanceSearch(
                          ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.toShowDuplicateColumnInAdvanceSearch) ? ((_d2 = (_c2 = rest.column) == null ? void 0 : _c2.colDef) == null ? void 0 : _d2.columnFieldsInAdvanceSearch) ? (_f2 = (_e2 = rest.column) == null ? void 0 : _e2.colDef) == null ? void 0 : _f2.columnFieldsInAdvanceSearch : rest.column.colId : rest.column.colId
                        );
                      }
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsx(
              Input,
              {
                ref: inputRef,
                iconClickOnDisabled: (_Z = (_Y = rest.column) == null ? void 0 : _Y.colDef) == null ? void 0 : _Z.toShowDuplicateColumnInAdvanceSearch,
                isDisabled: (_$ = (__ = rest.column) == null ? void 0 : __.colDef) == null ? void 0 : _$.toShowDuplicateColumnInAdvanceSearch,
                placeholder: "Search",
                rightIcon: /* @__PURE__ */ jsxs(Fragment, { children: [
                  searchText.toString().length > 0 && /* @__PURE__ */ jsx(
                    default_1$1,
                    {
                      onClick: () => {
                        if (handleClearSearchInline) {
                          handleClearSearchInline(rest);
                        }
                        onCloseIconClick(rest.column.colId);
                      }
                    }
                  ),
                  ((_ba = (_aa = rest.column) == null ? void 0 : _aa.colDef) == null ? void 0 : _ba.advanceSearchEnabled) && /* @__PURE__ */ jsx(
                    default_1,
                    {
                      onClick: () => {
                        var _a2, _b2, _c2, _d2, _e2, _f2;
                        if (rest.onAdvanceSearchClick) {
                          rest.onAdvanceSearchClick(rest.column);
                          return;
                        }
                        rest.toggleAdvanceSearch(
                          ((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.toShowDuplicateColumnInAdvanceSearch) ? ((_d2 = (_c2 = rest.column) == null ? void 0 : _c2.colDef) == null ? void 0 : _d2.columnFieldsInAdvanceSearch) ? (_f2 = (_e2 = rest.column) == null ? void 0 : _e2.colDef) == null ? void 0 : _f2.columnFieldsInAdvanceSearch : rest.column.colId : rest.column.colId,
                          searchText
                        );
                      }
                    }
                  )
                ] }),
                value: searchText,
                onChange: (e) => {
                  setSearchText(e.target.value);
                  setHasActiveSearch(!!e.target.value);
                  debouncedHandleSearchChange(e.target.value);
                }
              }
            ),
            /* @__PURE__ */ jsx(
              default_1$1,
              {
                className: "ia-search-input-field-close-icon",
                style: { cursor: "pointer" },
                onClick: () => {
                  handleCloseInputField == null ? void 0 : handleCloseInputField();
                  setShowInputField(false);
                  restoreColumnWidth();
                }
              }
            )
          ]
        }
      ) : (
        // Original simple structure when enableHeaderTextWrap is false
        /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `ag-header-cell-text ${((_da = (_ca = rest.column) == null ? void 0 : _ca.colDef) == null ? void 0 : _da.sortable) ? "sortable" : ""} ${enableHeaderTextWrap ? "header-wrap-enabled" : ""}`,
              children: [
                ((_fa = (_ea = rest.column) == null ? void 0 : _ea.colDef) == null ? void 0 : _fa.field) === "Selection" || ((_ha = (_ga = rest.column) == null ? void 0 : _ga.colDef) == null ? void 0 : _ha.checkboxSelection) || ((_ia = rest.column) == null ? void 0 : _ia.colId) === "ag-Grid-SelectionColumn" ? children : /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: headerTextRef,
                    className: "header-text-content",
                    style: { WebkitLineClamp: containerHeight > 40 ? 4 : 2 },
                    onMouseEnter: () => {
                      var _a2, _b2, _c2, _d2;
                      setIsOverflowText(
                        ((_a2 = headerTextRef.current) == null ? void 0 : _a2.scrollWidth) > ((_b2 = headerTextRef.current) == null ? void 0 : _b2.clientWidth) || ((_c2 = headerTextRef.current) == null ? void 0 : _c2.scrollHeight) > ((_d2 = headerTextRef.current) == null ? void 0 : _d2.clientHeight) + 1
                      );
                    },
                    children: /* @__PURE__ */ jsx(
                      Tooltip,
                      {
                        orientation: "top",
                        title: isOverflowText && children !== "Selection" ? children : "",
                        variant: "tertiary",
                        children: typeof children === "string" && ((_ja = rest.context) == null ? void 0 : _ja.columnSearchText) ? /* @__PURE__ */ jsx(HighlightedText, { searchText: rest.context.columnSearchText, text: children }) : children
                      }
                    )
                  }
                ),
                (_la = (_ka = rest.column) == null ? void 0 : _ka.colDef) == null ? void 0 : _la.headerIcons,
                ((_na = (_ma = rest.column) == null ? void 0 : _ma.colDef) == null ? void 0 : _na.sortable) && /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "TableSortIcon",
                    className: "ia-table-sort-icon",
                    src: currentSort === "asc" ? TableSortAscIcon : currentSort === "desc" ? TableSortDescIcon : TableSortIcon,
                    onClick: onHeaderClick
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `ia-icon-div ${hasActiveSearch ? "has-active-search" : ""} ${menuVisible ? "menu-visible" : ""}`,
              children: [
                (_qa = (_pa = (_oa = rest.column) == null ? void 0 : _oa.colDef) == null ? void 0 : _pa.customHeaderIcons) == null ? void 0 : _qa.map((icon) => {
                  return icon;
                }),
                ((_sa = (_ra = rest.column) == null ? void 0 : _ra.colDef) == null ? void 0 : _sa.isSearchable) && (hasActiveSearch || !showInputField) && /* @__PURE__ */ jsx(Badge, { invisible: !hasActiveSearch, variant: "dot", children: /* @__PURE__ */ jsx(
                  default_1$2,
                  {
                    fontSize: "small",
                    style: {
                      color: "#60697D",
                      cursor: "pointer",
                      backgroundColor: hasActiveSearch && "#ECEEFD",
                      display: menuVisible && !hasActiveSearch ? "none" : "block"
                    },
                    onClick: rest.onColumnSearchClick ? () => {
                      var _a2, _b2;
                      rest.onColumnSearchClick(rest);
                      setShowInputField(true);
                      if (((_b2 = (_a2 = rest.column) == null ? void 0 : _a2.colDef) == null ? void 0 : _b2.filter) === "agDateColumnFilter") {
                        setShowDatePicker(true);
                      }
                      expandColumnIfNeeded();
                    } : handleSearch
                  }
                ) }),
                !(((_ua = (_ta = rest.column) == null ? void 0 : _ta.colDef) == null ? void 0 : _ua.suppressHeaderMenuButton) ?? ((_wa = (_va = rest.column) == null ? void 0 : _va.colDef) == null ? void 0 : _wa.suppressMenu)) && /* @__PURE__ */ jsx("div", { className: "custom-ag-header-icons", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    ref: menuRef,
                    className: `custom-ag-menu-icon-button`,
                    onClick: (e) => {
                      e.stopPropagation();
                      rest.showColumnMenu(menuRef.current);
                      setMenuvisible(true);
                    }
                  }
                ) })
              ]
            }
          )
        ] })
      )
    }
  );
}
function areHeaderPropsEqual(prev, next) {
  const prevCol = prev == null ? void 0 : prev.column;
  const nextCol = next == null ? void 0 : next.column;
  if ((prevCol == null ? void 0 : prevCol.colId) !== (nextCol == null ? void 0 : nextCol.colId)) return false;
  if ((prev == null ? void 0 : prev.displayName) !== (next == null ? void 0 : next.displayName)) return false;
  if ((prev == null ? void 0 : prev.enableHeaderTextWrap) !== (next == null ? void 0 : next.enableHeaderTextWrap)) return false;
  if ((prev == null ? void 0 : prev.debounceTime) !== (next == null ? void 0 : next.debounceTime)) return false;
  const prevDef = (prevCol == null ? void 0 : prevCol.colDef) || {};
  const nextDef = (nextCol == null ? void 0 : nextCol.colDef) || {};
  if (prevDef.isSearchable !== nextDef.isSearchable) return false;
  if (prevDef.sortable !== nextDef.sortable) return false;
  if (prevDef.filter !== nextDef.filter) return false;
  if ((prevDef.suppressHeaderMenuButton ?? prevDef.suppressMenu) !== (nextDef.suppressHeaderMenuButton ?? nextDef.suppressMenu)) {
    return false;
  }
  return true;
}
const AgGridHeader$1 = memo(AgGridHeader, areHeaderPropsEqual);
export {
  AgGridHeader$1 as default
};
