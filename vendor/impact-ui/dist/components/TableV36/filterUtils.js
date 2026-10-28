import moment from "moment";
import { TEXT_FILTER_OPTIONS, NON_TEXT_FILTER_OPTIONS, DATE_FILTER_OPTIONS, convertToOptions } from "../../utils/helper.js";
const getOperatorListForColumn = (columnDef) => {
  if (columnDef == null ? void 0 : columnDef.operationFilterOptions) {
    return columnDef.operationFilterOptions;
  }
  if (columnDef == null ? void 0 : columnDef.thirdOptionAsDateRangePicker) {
    return [{ label: "In range", value: "inRange" }];
  }
  switch (columnDef == null ? void 0 : columnDef.filter) {
    case "agDateColumnFilter":
      return DATE_FILTER_OPTIONS;
    case "agNumberColumnFilter":
      return NON_TEXT_FILTER_OPTIONS;
    case "agTextColumnFilter":
      if ((columnDef == null ? void 0 : columnDef.dataType) === "boolean") {
        return [
          { label: "Equals", value: "equals" },
          { label: "Not equal", value: "notEqual" }
        ];
      }
      if ((columnDef == null ? void 0 : columnDef.type) === "number") {
        return TEXT_FILTER_OPTIONS;
      }
      return TEXT_FILTER_OPTIONS;
  }
  if ((columnDef == null ? void 0 : columnDef.dataType) === "boolean") {
    return [
      { label: "Equals", value: "equals" },
      { label: "Not equal", value: "notEqual" }
    ];
  }
  if ((columnDef == null ? void 0 : columnDef.type) === "number") {
    return NON_TEXT_FILTER_OPTIONS;
  }
  return TEXT_FILTER_OPTIONS;
};
const getDefaultOperationForColumn = (columnDef, filter = null) => {
  const operatorList = getOperatorListForColumn(columnDef);
  const equalsOption = operatorList.find((opt) => opt.value === "equals");
  if (columnDef == null ? void 0 : columnDef.thirdOptionAsDateRangePicker) {
    return { label: "In range", value: "inRange" };
  }
  const prefersEquals = (columnDef == null ? void 0 : columnDef.filter) === "agDateColumnFilter" || (filter == null ? void 0 : filter.filterType) === "date" || (columnDef == null ? void 0 : columnDef.filter) === "agNumberColumnFilter" || (columnDef == null ? void 0 : columnDef.dataType) === "boolean" || (filter == null ? void 0 : filter.filterType) === "boolean" || (columnDef == null ? void 0 : columnDef.type) === "number" && (columnDef == null ? void 0 : columnDef.filter) === "agNumberColumnFilter";
  if (prefersEquals && equalsOption) {
    return equalsOption;
  }
  return operatorList[0];
};
const cleanNumericValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  return value.replace(/[$€£¥₹,\s%]/g, "");
};
const parseFilterValue = (value, columnDef) => {
  const type = columnDef == null ? void 0 : columnDef.type;
  const filter = columnDef == null ? void 0 : columnDef.filter;
  let parsedValue;
  let filterType = "contains";
  if (value && typeof value === "object" && (value == null ? void 0 : value.startDate) !== void 0 && (value == null ? void 0 : value.endDate) !== void 0) {
    const startDate = moment.isMoment(value.startDate) ? value.startDate : moment(value.startDate);
    const endDate = moment.isMoment(value.endDate) ? value.endDate : moment(value.endDate);
    parsedValue = {
      startDate: startDate.isValid() ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate.isValid() ? endDate.format("YYYY-MM-DD") : null
    };
    return { parsedValue, filterType };
  }
  if (filter === "agDateColumnFilter") {
    filterType = "equals";
    if (value && typeof value === "object" && moment.isMoment(value)) {
      parsedValue = value.format("YYYY-MM-DD");
      return { parsedValue, filterType };
    }
    if (value && typeof value === "string") {
      const dateMoment = moment(value, ["MM-DD-YYYY", "YYYY-MM-DD", "MM/DD/YYYY"], true);
      if (dateMoment.isValid()) {
        parsedValue = dateMoment.format("YYYY-MM-DD");
        return { parsedValue, filterType };
      }
    }
    if (value && typeof value === "object" && typeof (value == null ? void 0 : value.format) === "function") {
      parsedValue = value.format("YYYY-MM-DD");
      return { parsedValue, filterType };
    }
    parsedValue = void 0;
    return { parsedValue, filterType };
  }
  if (filter === "agNumberColumnFilter" || type === "number") {
    const cleanedValue = cleanNumericValue(value);
    const numericValue = parseFloat(cleanedValue);
    if (isNaN(numericValue) || cleanedValue === "") {
      return { parsedValue: null, filterType };
    }
    parsedValue = numericValue;
    filterType = "equals";
    return { parsedValue, filterType };
  }
  parsedValue = typeof value === "string" ? value : typeof value === "object" && (value == null ? void 0 : value.value) ? value.value : value;
  return { parsedValue, filterType };
};
const isColumnDataString = (api, columnId) => {
  let firstValue = null;
  api.forEachNode((node) => {
    if (firstValue === null && node.data) {
      firstValue = node.data[columnId];
    }
  });
  return typeof firstValue === "string";
};
const buildFilterModelEntry = (parsedValue, filterType, columnDef, operationType = null) => {
  const type = columnDef == null ? void 0 : columnDef.type;
  const filter = columnDef == null ? void 0 : columnDef.filter;
  const operator = operationType || filterType;
  if (operator === "blank" || operator === "notBlank") {
    let filterTypeForBlank = "text";
    if (filter === "agDateColumnFilter") {
      filterTypeForBlank = "date";
    } else if (filter === "agNumberColumnFilter" || type === "number") {
      filterTypeForBlank = "number";
    } else if ((columnDef == null ? void 0 : columnDef.dataType) === "boolean" && filter === "agTextColumnFilter") {
      filterTypeForBlank = "text";
    }
    return {
      filterType: filterTypeForBlank,
      type: operator
    };
  }
  if (parsedValue === null || parsedValue === void 0 || parsedValue === "") {
    return void 0;
  }
  if (Array.isArray(parsedValue)) {
    const validValues = parsedValue.filter((v) => v !== null && v !== void 0 && v !== "");
    if (validValues.length === 0) {
      return void 0;
    }
    if (validValues.length === 1) {
      return buildFilterModelEntry(
        String(typeof validValues[0] === "object" ? validValues[0].value : validValues[0]),
        filterType,
        columnDef,
        operationType
      );
    }
    const filterTypeStr = filter === "agDateColumnFilter" ? "date" : filter === "agNumberColumnFilter" || type === "number" ? "number" : "text";
    const conditions = validValues.map((val) => ({
      filterType: filterTypeStr,
      type: operator,
      filter: String(val.value)
    }));
    return {
      filterType: filterTypeStr,
      operator: (columnDef == null ? void 0 : columnDef.operator) || "OR",
      conditions
    };
  }
  if (filter === "agDateColumnFilter" && typeof parsedValue === "object" && parsedValue.startDate && parsedValue.endDate) {
    return {
      filterType: "date",
      type: "inRange",
      dateFrom: parsedValue.startDate,
      dateTo: parsedValue.endDate
    };
  }
  if (filter === "agDateColumnFilter") {
    return {
      filterType: "date",
      type: operator,
      dateFrom: parsedValue
    };
  }
  if (filter === "agNumberColumnFilter") {
    return {
      filterType: "number",
      type: operator,
      filter: parsedValue
    };
  }
  if ((columnDef == null ? void 0 : columnDef.dataType) === "boolean") {
    return {
      filterType: "text",
      type: operator,
      filter: String(parsedValue)
    };
  }
  if (type === "number" && filter === "agTextColumnFilter") {
    return {
      filterType: "text",
      type: operator,
      filter: String(parsedValue)
    };
  }
  if (type === "number") {
    return {
      filterType: "number",
      type: operator,
      filter: parsedValue
    };
  }
  const filterEntry = {
    type: operator,
    filter: parsedValue,
    filterType: "text"
  };
  return filterEntry;
};
const resolveAdvanceSearchFieldFromFilterKey = (filterKey, colDefs) => {
  if (!colDefs || !filterKey) {
    return filterKey;
  }
  const find = (defs) => {
    for (const col of defs) {
      if (col.children) {
        const nested = find(col.children);
        if (nested != null) {
          return nested;
        }
      }
      if (col.columnFieldsFilterMap) {
        const entry = Object.entries(col.columnFieldsFilterMap).find(
          ([, mapped]) => mapped === filterKey
        );
        if (entry) {
          return entry[0];
        }
      }
    }
    return null;
  };
  return find(colDefs) ?? filterKey;
};
const resolveDuplicateAdvanceField = (col, field) => {
  if (!col.toShowDuplicateColumnInAdvanceSearch || !col.columnFieldsInAdvanceSearch) {
    return null;
  }
  let advanceField = field;
  let index = col.columnFieldsInAdvanceSearch.indexOf(field);
  if (index === -1 && col.columnFieldsFilterMap) {
    const entry = Object.entries(col.columnFieldsFilterMap).find(([, mapped]) => mapped === field);
    if (entry) {
      advanceField = entry[0];
      index = col.columnFieldsInAdvanceSearch.indexOf(advanceField);
    }
  }
  if (index === -1) {
    return null;
  }
  return { advanceField, index };
};
const findColumnDef = (colDefs, field) => {
  for (const col of colDefs) {
    if (col.children) {
      const found = findColumnDef(col.children, field);
      if (found) return found;
    }
    const duplicate = resolveDuplicateAdvanceField(col, field);
    if (duplicate) {
      return {
        ...col,
        currentColumnField: `${duplicate.advanceField}${duplicate.index + 1}`
      };
    }
    if (col.colId && col.colId === field || col.field && col.field === field) {
      return col;
    }
  }
  return null;
};
const parseInlineSearchValue = (value, columnDef, api, columnId) => {
  const type = columnDef == null ? void 0 : columnDef.type;
  const filter = columnDef == null ? void 0 : columnDef.filter;
  if (filter === "agDateColumnFilter") {
    if (value && typeof value === "object" && (value == null ? void 0 : value.startDate) !== void 0 && (value == null ? void 0 : value.endDate) !== void 0) {
      const startDate = moment.isMoment(value.startDate) ? value.startDate : moment(value.startDate);
      const endDate = moment.isMoment(value.endDate) ? value.endDate : moment(value.endDate);
      return {
        parsedValue: {
          startDate: startDate.isValid() ? startDate.format("YYYY-MM-DD") : null,
          endDate: endDate.isValid() ? endDate.format("YYYY-MM-DD") : null
        },
        filterType: "inRange"
      };
    }
    if (value && typeof value === "object" && moment.isMoment(value)) {
      return {
        parsedValue: value.format("YYYY-MM-DD"),
        filterType: "equals"
      };
    }
    if (value && typeof value === "string") {
      const dateMoment = moment(value, ["MM-DD-YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
      if (dateMoment.isValid()) {
        return {
          parsedValue: dateMoment.format("YYYY-MM-DD"),
          filterType: "equals"
        };
      }
    }
    return { parsedValue: void 0, filterType: "equals" };
  }
  if (filter === "agNumberColumnFilter" || type === "number") {
    const cleanedValue = cleanNumericValue(value);
    const parsedNumber = parseFloat(cleanedValue);
    if (isNaN(parsedNumber) || cleanedValue === "") {
      return { parsedValue: null, filterType: "contains" };
    }
    const isStringColumn = isColumnDataString(api, columnId);
    if (isStringColumn) {
      return { parsedValue: value, filterType: "contains" };
    } else {
      return { parsedValue: parsedNumber, filterType: "equals" };
    }
  }
  if ((columnDef == null ? void 0 : columnDef.dataType) === "boolean") {
    return { parsedValue: value, filterType: "equals" };
  }
  return { parsedValue: value, filterType: "contains" };
};
const isValidFilterValue = (parsedValue) => {
  if (parsedValue === null || parsedValue === void 0) {
    return false;
  }
  if (typeof parsedValue === "number" && isNaN(parsedValue)) {
    return false;
  }
  if (typeof parsedValue === "string" && parsedValue.trim() === "") {
    return false;
  }
  if (typeof parsedValue === "object" && parsedValue.startDate !== void 0 && parsedValue.endDate !== void 0) {
    return parsedValue.startDate !== null && parsedValue.endDate !== null;
  }
  return true;
};
const getColumnLabel = (columnId, columnDef, colDefs) => {
  let label = (columnDef == null ? void 0 : columnDef.headerName) || columnId;
  if (colDefs) {
    const columnOptions = convertToOptions(colDefs);
    const columnOption = columnOptions.find((opt) => opt.value === columnId);
    if (columnOption == null ? void 0 : columnOption.label) {
      label = columnOption.label;
    }
  }
  return label;
};
const hasValidFilterValue = (filter) => {
  if (!filter || filter === void 0 || filter === null) {
    return false;
  }
  const hasValue = filter.filter !== void 0 && filter.filter !== null && filter.filter !== "" || filter.dateFrom !== void 0 && filter.dateFrom !== null && filter.dateFrom !== "";
  return hasValue;
};
const convertFilterToModalFormat = (columnId, filter, columnDef, colDefs) => {
  var _a;
  const advanceField = resolveAdvanceSearchFieldFromFilterKey(columnId, colDefs);
  const columnLabel = getColumnLabel(advanceField, columnDef, colDefs);
  let value = (filter == null ? void 0 : filter.filter) || "";
  if (filter == null ? void 0 : filter.dateFrom) {
    if (typeof filter.dateFrom === "string") {
      value = (_a = filter.dateFrom.split(" ")) == null ? void 0 : _a[0];
    } else if (filter.dateFrom instanceof Date) {
      value = moment(filter.dateFrom).format("YYYY-MM-DD");
    } else {
      value = filter.dateFrom;
    }
  }
  let operationType = filter == null ? void 0 : filter.type;
  let operationLabel;
  if (!operationType) {
    const defaultOp = getDefaultOperationForColumn(columnDef, filter);
    operationType = defaultOp.value;
    operationLabel = defaultOp.label;
  } else {
    operationLabel = operationType.charAt(0).toUpperCase() + operationType.slice(1);
  }
  return {
    column: {
      label: columnLabel,
      value: advanceField,
      type: (filter == null ? void 0 : filter.filterType) || "text"
    },
    operation: {
      label: operationLabel,
      value: operationType
    },
    value
  };
};
const getColumnDefById = (api, colId, colDefs) => {
  const column = api == null ? void 0 : api.getColumn(colId);
  if (column) {
    return column.getColDef();
  }
  if (colDefs) {
    return findColumnDef(colDefs, colId);
  }
  return null;
};
const convertActiveFiltersToModalFormat = (filterModel, api, colDefs) => {
  return Object.keys(filterModel).filter((colId) => hasValidFilterValue(filterModel[colId])).map((colId) => {
    const filter = filterModel[colId];
    const colDef = getColumnDefById(api, colId, colDefs);
    return convertFilterToModalFormat(colId, filter, colDef, colDefs);
  });
};
const prepareValueForModal = (inputValue, columnDef, getOptionFromDropdownValue) => {
  const columnType = columnDef == null ? void 0 : columnDef.type;
  switch (columnType) {
    case "dropdown":
    case "select":
      if ((columnDef == null ? void 0 : columnDef.thirdOptionDropdownOptions) && inputValue) {
        const optionObject = getOptionFromDropdownValue(inputValue, columnDef);
        return typeof optionObject === "object" && optionObject !== null && optionObject.label ? optionObject : inputValue;
      }
      return inputValue;
    case "date":
      return inputValue;
    case "number":
      return inputValue;
    case "text":
    default:
      if ((columnDef == null ? void 0 : columnDef.thirdOptionDropdownOptions) && inputValue) {
        const optionObject = getOptionFromDropdownValue(inputValue, columnDef);
        return typeof optionObject === "object" && optionObject !== null && optionObject.label ? optionObject : inputValue;
      }
      return inputValue;
  }
};
const createModalFilterEntry = (columnId, value, columnDef, colDefs) => {
  const advanceField = resolveAdvanceSearchFieldFromFilterKey(columnId, colDefs);
  return {
    column: {
      label: getColumnLabel(advanceField, columnDef, colDefs),
      value: advanceField,
      type: (columnDef == null ? void 0 : columnDef.type) || "text"
    },
    operation: getDefaultOperationForColumn(columnDef),
    value
  };
};
const updateOrAddFilter = (existingFilters, columnId, value, columnDef, colDefs) => {
  const isAlreadyPresent = existingFilters.find((f) => {
    var _a;
    return ((_a = f == null ? void 0 : f.column) == null ? void 0 : _a.value) === columnId;
  });
  if (isAlreadyPresent) {
    return existingFilters.map((f) => {
      var _a;
      return ((_a = f == null ? void 0 : f.column) == null ? void 0 : _a.value) === columnId ? { ...f, value } : f;
    });
  } else {
    return [...existingFilters, createModalFilterEntry(columnId, value, columnDef, colDefs)];
  }
};
const syncFiltersWithModal = (api, currentColumnId, inputValue, columnDef, colDefs, setValue, setInitialFilters, getOptionFromDropdownValue) => {
  try {
    const currentFilterModel = (api == null ? void 0 : api.getFilterModel()) || {};
    const filtersFromModel = convertActiveFiltersToModalFormat(currentFilterModel, api, colDefs);
    const valueForModal = prepareValueForModal(inputValue, columnDef, getOptionFromDropdownValue);
    const updatedFilters = updateOrAddFilter(
      filtersFromModel,
      currentColumnId,
      valueForModal,
      columnDef,
      colDefs
    );
    setValue == null ? void 0 : setValue("filters", updatedFilters);
    setInitialFilters == null ? void 0 : setInitialFilters(updatedFilters);
  } catch (err) {
    console.warn("Error syncing modal filters:", err);
  }
};
const resolveFilterModelColumnKey = (columnDef, advanceField) => {
  var _a;
  const mappedKey = (_a = columnDef == null ? void 0 : columnDef.columnFieldsFilterMap) == null ? void 0 : _a[advanceField];
  return mappedKey || (columnDef == null ? void 0 : columnDef.colId) || (columnDef == null ? void 0 : columnDef.field) || advanceField;
};
const collectExistingColumnIds = (colDefs, ids = /* @__PURE__ */ new Set()) => {
  (colDefs || []).forEach((col) => {
    if (col.children) {
      collectExistingColumnIds(col.children, ids);
    }
    if (col.colId) ids.add(col.colId);
    if (col.field) ids.add(col.field);
  });
  return ids;
};
const createVirtualFilterColumns = (colDefs) => {
  const virtualCols = [];
  const existingIds = collectExistingColumnIds(colDefs);
  const walk = (cols) => {
    (cols || []).forEach((col) => {
      if (col.children) {
        walk(col.children);
      }
      if (!col.columnFieldsFilterMap) {
        return;
      }
      const parentField = col.field;
      Object.entries(col.columnFieldsFilterMap).forEach(([advanceField, mappedKey]) => {
        if (!mappedKey || existingIds.has(mappedKey)) {
          return;
        }
        existingIds.add(mappedKey);
        virtualCols.push({
          colId: mappedKey,
          field: mappedKey,
          headerName: advanceField,
          hide: true,
          lockVisible: true,
          suppressColumnsToolPanel: true,
          // Keep out of advance-search option lists
          advanceSearchEnabled: false,
          isSearchable: false,
          filter: col.filter || "agTextColumnFilter",
          type: col.type,
          filterParams: col.filterParams,
          valueGetter: (params) => {
            var _a;
            return parentField != null ? (_a = params.data) == null ? void 0 : _a[parentField] : void 0;
          }
        });
      });
    });
  };
  walk(colDefs);
  return virtualCols;
};
const appendVirtualFilterColumns = (colDefs) => {
  if (!Array.isArray(colDefs) || colDefs.length === 0) {
    return colDefs;
  }
  const virtualCols = createVirtualFilterColumns(colDefs);
  return virtualCols.length > 0 ? [...colDefs, ...virtualCols] : colDefs;
};
const buildAdvanceSearchFilterModel = (formValues, colDefs) => {
  const filterModel = {};
  if (!formValues || !Array.isArray(formValues)) {
    return filterModel;
  }
  formValues.forEach((value) => {
    var _a, _b;
    if (!((_a = value == null ? void 0 : value.column) == null ? void 0 : _a.value) || !((_b = value == null ? void 0 : value.operation) == null ? void 0 : _b.value)) {
      return;
    }
    const columnDef = findColumnDef(colDefs, value.column.value);
    if (!columnDef) {
      return;
    }
    const { parsedValue, filterType } = parseFilterValue(value.value, columnDef);
    if (!isValidFilterValue(parsedValue)) {
      return;
    }
    const advanceField = value.column.value;
    const columnKey = resolveFilterModelColumnKey(columnDef, advanceField);
    const filterEntry = buildFilterModelEntry(
      parsedValue,
      filterType,
      columnDef,
      value.operation.value
    );
    if (filterEntry) {
      filterModel[columnKey] = filterEntry;
    }
  });
  return filterModel;
};
export {
  appendVirtualFilterColumns,
  buildAdvanceSearchFilterModel,
  buildFilterModelEntry,
  cleanNumericValue,
  convertFilterToModalFormat,
  createVirtualFilterColumns,
  findColumnDef,
  getColumnLabel,
  getDefaultOperationForColumn,
  getOperatorListForColumn,
  hasValidFilterValue,
  isColumnDataString,
  isValidFilterValue,
  parseFilterValue,
  parseInlineSearchValue,
  resolveAdvanceSearchFieldFromFilterKey,
  resolveFilterModelColumnKey,
  syncFiltersWithModal,
  updateOrAddFilter
};
