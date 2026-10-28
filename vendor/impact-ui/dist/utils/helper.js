const TEXT_FILTER_OPTIONS = [
  { label: "Contains", value: "contains" },
  { label: "Not contains", value: "notContains" },
  { label: "Equals", value: "equals" },
  { label: "Not equal", value: "notEqual" },
  { label: "Starts with", value: "startsWith" },
  { label: "Ends with", value: "endsWith" }
];
const NON_TEXT_FILTER_OPTIONS = [
  { label: "Equals", value: "equals" },
  { label: "Not equal", value: "notEqual" },
  { label: "Less than", value: "lessThan" },
  { label: "Less than or equal", value: "lessThanOrEqual" },
  { label: "Greater than", value: "greaterThan" },
  { label: "Greater than or equal", value: "greaterThanOrEqual" }
];
const DATE_FILTER_OPTIONS = [
  { label: "Equals", value: "equals" },
  { label: "Not equal", value: "notEqual" },
  { label: "Before (Less than)", value: "lessThan" },
  { label: "On or before (Less than or equal)", value: "lessThanOrEqual" },
  { label: "After (Greater than)", value: "greaterThan" },
  { label: "On or after (Greater than or equal)", value: "greaterThanOrEqual" }
];
function capitalizeFirstLetter(val) {
  return String(val ?? "").charAt(0).toUpperCase() + String(val ?? "").slice(1);
}
const isAdvanceSearchEnabled = (col) => {
  if (col.advanceSearchEnabled) {
    return true;
  }
  if (col.extra_params && Array.isArray(col.extra_params) && col.extra_params.length > 0) {
    const firstParam = col.extra_params[0];
    if ((firstParam == null ? void 0 : firstParam.is_advance_search) === true) {
      return true;
    }
  }
  return false;
};
const isSearchable = (col) => {
  if (col.isSearchable) {
    return true;
  }
  if (col.extra_params && Array.isArray(col.extra_params) && col.extra_params.length > 0) {
    const firstParam = col.extra_params[0];
    if ((firstParam == null ? void 0 : firstParam.is_search) === true) {
      return true;
    }
  }
  return false;
};
const getNestedFields = (colDefs, parentHeaders = []) => {
  let fields = [];
  colDefs.forEach((col) => {
    const currentHeader = col.headerName ?? capitalizeFirstLetter(col.field);
    if (col.children) {
      fields = [...fields, ...getNestedFields(col.children, [...parentHeaders, currentHeader])];
    } else if (isAdvanceSearchEnabled(col) && isSearchable(col)) {
      const allHeaders = [...parentHeaders, currentHeader].filter(Boolean);
      if (Array.isArray(col.columnFieldsInAdvanceSearch) && col.columnFieldsInAdvanceSearch.length > 0) {
        col.columnFieldsInAdvanceSearch.forEach((fieldName) => {
          fields.push({
            ...col,
            hierarchicalLabel: allHeaders.join(" - "),
            field: fieldName,
            type: col.filter === "agNumberColumnFilter" ? "number" : "text"
          });
        });
      } else {
        fields.push({
          ...col,
          hierarchicalLabel: allHeaders.join(" - "),
          field: col.colId ?? col.field ?? "",
          type: col.filter === "agNumberColumnFilter" ? "number" : "text"
        });
      }
    }
  });
  return fields;
};
const convertToOptions = (colDefs) => {
  const nestedFields = getNestedFields(colDefs);
  return nestedFields.map((col) => ({
    label: col.toShowDuplicateColumnInAdvanceSearch ? capitalizeFirstLetter(col.field) : col.hierarchicalLabel,
    value: col.field ?? "",
    type: col.type
  }));
};
function isViewNameUnique(inputValue, selectedViewType, _isDefaultView, savedViewsOptions, excludeView = null, isViewNameUniqueAcrossTypes = false) {
  const normalizeName = (value) => (value || "").replace(/\s+/g, "").toLowerCase();
  const normalizeType = (value) => (value || "").replace(/\s+/g, "");
  const normalizedInputName = normalizeName(inputValue);
  const normalizedInputType = normalizeType(selectedViewType);
  if (!normalizedInputName) return true;
  const isExcluded = (view) => Boolean(
    excludeView && normalizeName(view.viewName) === normalizeName(excludeView.viewName) && normalizeType(view.viewType) === normalizeType(excludeView.viewType)
  );
  return !savedViewsOptions.find((view) => {
    if (isExcluded(view)) return false;
    const nameMatches = normalizeName(view.viewName) === normalizedInputName;
    if (!nameMatches) return false;
    return isViewNameUniqueAcrossTypes || normalizeType(view.viewType) === normalizedInputType;
  });
}
export {
  DATE_FILTER_OPTIONS,
  NON_TEXT_FILTER_OPTIONS,
  TEXT_FILTER_OPTIONS,
  convertToOptions,
  isViewNameUnique
};
