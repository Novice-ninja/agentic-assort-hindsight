import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import default_1 from "../../../node_modules/@mui/icons-material/DeleteOutlineOutlined.js";
import moment from "moment";
import { useController } from "react-hook-form";
import { convertToOptions } from "../../../utils/helper.js";
import { Button } from "../../Button/index.js";
import { DatePicker } from "../../DatePicker/index.js";
import { DateRangePicker } from "../../DateRangePicker/index.js";
import { Input } from "../../Input/index.js";
import { Select } from "../../Select/index.js";
import { findColumnDef, getOperatorListForColumn, getDefaultOperationForColumn } from "../filterUtils.js";
const NewAdvanceSearchModalItem = ({
  colDefs,
  control,
  index,
  field,
  remove,
  filteredColumnsInitialOptions,
  activeSearchType,
  isLastVisible,
  currentColumnId,
  getValues,
  fields,
  ...args
}) => {
  var _a, _b, _c, _d;
  const [isColumnOptionsOpen, setIsColumnOptionsOpen] = useState(false);
  const [isOperationOptionsOpen, setIsOperationOptionsOpen] = useState(false);
  const [isThirdOptionDropdownOpen, setIsThirdOptionDropdownOpen] = useState(false);
  const [currentOperationOptions, setCurrentOperationOptions] = useState([]);
  const [currentThirdOptionDropdownOptions, setCurrentThirdOptionDropdownOptions] = useState([]);
  const [currentColumnDef, setCurrentColumnDef] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const { field: columnField } = useController({
    name: `filters.${index}.column`,
    control,
    rules: {
      required: true
    }
  });
  const { field: operationField } = useController({
    name: `filters.${index}.operation`,
    control,
    rules: { required: activeSearchType !== "advanceSearch" && true }
  });
  const { field: valueField } = useController({
    name: `filters.${index}.value`,
    control,
    rules: {
      required: true
    }
  });
  useEffect(() => {
    var _a2;
    if (!((_a2 = columnField.value) == null ? void 0 : _a2.value)) return;
    const columnDef = findColumnDef(colDefs, columnField.value.value);
    setCurrentColumnDef(columnDef);
    const operatorList = getOperatorListForColumn(columnDef);
    setCurrentOperationOptions(operatorList);
    const shouldAutoSelect = activeSearchType === "advanceSearch" && (operatorList == null ? void 0 : operatorList.length) > 0 && !operationField.value;
    if (shouldAutoSelect) {
      const defaultOperation = getDefaultOperationForColumn(columnDef);
      operationField.onChange(defaultOperation);
    }
  }, [columnField.value, colDefs, activeSearchType]);
  useEffect(() => {
    var _a2;
    if ((currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionAsDropdown) && operationField.value) {
      if (currentColumnDef.toShowDuplicateColumnInAdvanceSearch) {
        const currentOptions = ((_a2 = currentColumnDef.currentColumnField) == null ? void 0 : _a2.endsWith("1")) ? currentColumnDef.thirdOptionDropdownOptions1 : currentColumnDef.thirdOptionDropdownOptions2;
        setCurrentThirdOptionDropdownOptions(currentOptions);
      } else {
        setCurrentThirdOptionDropdownOptions(currentColumnDef.thirdOptionDropdownOptions);
      }
    }
  }, [currentColumnDef, operationField]);
  useEffect(() => {
    if (activeSearchType === "search" && !operationField.value && columnField.value && currentOperationOptions.length > 0) {
      if (currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionAsDateRangePicker) {
        operationField.onChange({ label: "In range", value: "inRange" });
      } else if ((currentColumnDef == null ? void 0 : currentColumnDef.filter) === "agDateColumnFilter") {
        const equalsOption = currentOperationOptions.find((opt) => opt.value === "equals");
        if (equalsOption) {
          operationField.onChange(equalsOption);
        } else {
          operationField.onChange(currentOperationOptions[0]);
        }
      } else {
        const containsOption = currentOperationOptions.find((opt) => opt.value === "contains");
        if (containsOption) {
          operationField.onChange(containsOption);
        } else {
          operationField.onChange(currentOperationOptions[0]);
        }
      }
    }
  }, [columnField.value, currentOperationOptions, activeSearchType, currentColumnDef]);
  useEffect(() => {
    var _a2;
    if (currentColumnId && index === 0 && // Only auto-select for the first filter
    !columnField.value && ((_a2 = columnField.value) == null ? void 0 : _a2.value) !== currentColumnId) {
      const columnOption = filteredColumnsInitialOptions == null ? void 0 : filteredColumnsInitialOptions.find(
        (opt) => opt.value === currentColumnId
      );
      const allOptions = convertToOptions(colDefs || []);
      const columnOptionFromAll = allOptions.find((opt) => opt.value === currentColumnId);
      const optionToSelect = columnOption || columnOptionFromAll;
      if (optionToSelect) {
        columnField.onChange(optionToSelect);
      }
    }
  }, [currentColumnId, index, columnField.value, filteredColumnsInitialOptions, colDefs]);
  const handleClickOutside = (event) => {
    if (isColumnOptionsOpen || isThirdOptionDropdownOpen || isOperationOptionsOpen && !event.target.closest(".ia-table-search-content-body")) {
      setIsColumnOptionsOpen(false);
      setIsOperationOptionsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isColumnOptionsOpen, isThirdOptionDropdownOpen, isOperationOptionsOpen]);
  return /* @__PURE__ */ jsxs("div", { className: "ia-table-search-content-body", children: [
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", flex: 1 }, children: /* @__PURE__ */ jsx(
      Select,
      {
        currentOptions: filteredColumnsInitialOptions || [],
        initialOptions: filteredColumnsInitialOptions || [],
        isOpen: isColumnOptionsOpen,
        minWidth: activeSearchType !== "advanceSearch" ? 400 : void 0,
        name: `filters.${index}.column`,
        placeholder: "Select",
        selectedOptions: columnField.value || null,
        setCurrentOptions: () => {
        },
        setIsOpen: setIsColumnOptionsOpen,
        setSelectedOptions: (option) => {
          if (option && getValues) {
            const formValues = getValues();
            const existingFilters = (formValues == null ? void 0 : formValues.filters) || [];
            const isDuplicate = existingFilters.some(
              (filter, idx) => {
                var _a2, _b2, _c2;
                return idx !== index && ((_a2 = filter == null ? void 0 : filter.column) == null ? void 0 : _a2.value) === option.value && ((_b2 = filter == null ? void 0 : filter.column) == null ? void 0 : _b2.value) !== null && ((_c2 = filter == null ? void 0 : filter.column) == null ? void 0 : _c2.value) !== "";
              }
            );
            if (isDuplicate) {
              return;
            }
          }
          columnField.onChange(option);
          operationField.onChange(null);
          valueField.onChange("");
        },
        withPortal: true,
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    ) }),
    activeSearchType === "advanceSearch" && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", flex: 1 }, children: /* @__PURE__ */ jsx(
      Select,
      {
        currentOptions: currentOperationOptions,
        disabled: !columnField.value,
        initialOptions: currentOperationOptions,
        isDisabled: (currentColumnDef == null ? void 0 : currentColumnDef.isThirdOptionDropdownIsBoolean) || (currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionAsDateRangePicker) ? true : !columnField.value,
        isOpen: isOperationOptionsOpen,
        name: `filters.${index}.operation`,
        placeholder: "Select",
        selectedOptions: operationField.value || null,
        setCurrentOptions: setCurrentOperationOptions,
        setIsOpen: setIsOperationOptionsOpen,
        setSelectedOptions: (option) => {
          operationField.onChange(option);
        },
        withPortal: true,
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", flex: 1 }, children: (currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionAsDropdown) ? /* @__PURE__ */ jsx(
      Select,
      {
        currentOptions: currentThirdOptionDropdownOptions,
        initialOptions: currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionDropdownOptions,
        isDisabled: !operationField.value,
        isMulti: currentColumnDef == null ? void 0 : currentColumnDef.enableMultiSelect,
        isOpen: isThirdOptionDropdownOpen,
        isSelectAll,
        isWithSearch: currentColumnDef == null ? void 0 : currentColumnDef.enableSearch,
        minWidth: activeSearchType !== "advanceSearch" ? 344 : void 0,
        name: `filters.${index}.value`,
        placeholder: "Select value",
        selectedOptions: (valueField == null ? void 0 : valueField.value) || [],
        setCurrentOptions: setCurrentThirdOptionDropdownOptions,
        setIsOpen: setIsThirdOptionDropdownOpen,
        setSelectedOptions: (option) => {
          valueField.onChange(option);
        },
        toggleSelectAll: currentColumnDef == null ? void 0 : currentColumnDef.enableMultiSelect,
        withPortal: true,
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        setIsSelectAll
      }
    ) : (currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionAsDatePicker) || (currentColumnDef == null ? void 0 : currentColumnDef.filter) === "agDateColumnFilter" && !currentColumnDef.thirdOptionAsDateRangePicker ? /* @__PURE__ */ jsx(
      DatePicker,
      {
        fullWidth: true,
        showMonthYearSelect: true,
        displayFormat: currentColumnDef.displayFormat || "MM-DD-YYYY",
        isDisabled: !operationField.value,
        name: `filters.${index}.value`,
        placeholder: "Select date",
        selectedDate: valueField.value ? moment(valueField.value) : void 0,
        setSelectedDate: (date) => {
          valueField.onChange(date);
        },
        withPortal: true,
        ...currentColumnDef.thirdOptionAsDatePickerProps
      }
    ) : (currentColumnDef == null ? void 0 : currentColumnDef.thirdOptionAsDateRangePicker) ? /* @__PURE__ */ jsx(
      DateRangePicker,
      {
        fullWidth: true,
        endDate: ((_a = valueField.value) == null ? void 0 : _a.endDate) ? moment.isMoment(valueField.value.endDate) ? valueField.value.endDate : moment(valueField.value.endDate) : ((_b = currentColumnDef.thirdOptionAsDateRangePickerProps) == null ? void 0 : _b.endDate) ? moment.isMoment(currentColumnDef.thirdOptionAsDateRangePickerProps.endDate) ? currentColumnDef.thirdOptionAsDateRangePickerProps.endDate : moment(currentColumnDef.thirdOptionAsDateRangePickerProps.endDate) : null,
        handleDatesChange: (startDate, endDate) => {
          const formattedValue = {
            startDate: startDate ? moment.isMoment(startDate) ? startDate : moment(startDate) : null,
            endDate: endDate ? moment.isMoment(endDate) ? endDate : moment(endDate) : null
          };
          valueField.onChange(formattedValue);
        },
        isDisabled: !operationField.value,
        name: `filters.${index}.value`,
        setEndDate: () => {
        },
        setStartDate: () => {
        },
        startDate: ((_c = valueField.value) == null ? void 0 : _c.startDate) ? moment.isMoment(valueField.value.startDate) ? valueField.value.startDate : moment(valueField.value.startDate) : ((_d = currentColumnDef.thirdOptionAsDateRangePickerProps) == null ? void 0 : _d.startDate) ? moment.isMoment(currentColumnDef.thirdOptionAsDateRangePickerProps.startDate) ? currentColumnDef.thirdOptionAsDateRangePickerProps.startDate : moment(currentColumnDef.thirdOptionAsDateRangePickerProps.startDate) : null,
        withPortal: true,
        onResetClick: () => {
          valueField.onChange({ startDate: null, endDate: null });
        },
        ...(() => {
          const {
            startDate: _,
            endDate: __,
            ...restProps
          } = currentColumnDef.thirdOptionAsDateRangePickerProps || {};
          return restProps;
        })()
      }
    ) : /* @__PURE__ */ jsx(
      Input,
      {
        isDisabled: activeSearchType === "advanceSearch" && !operationField.value,
        name: `filters.${index}.value`,
        placeholder: "Enter text",
        value: valueField.value || "",
        onChange: (e) => {
          valueField.onChange(e.target.value);
        }
      }
    ) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        disabled: isLastVisible,
        size: "large",
        type: "button",
        variant: "tertiary",
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          const fieldId = (field == null ? void 0 : field.fieldId) || (field == null ? void 0 : field.id);
          if (fieldId !== void 0) {
            const actualIndex = fields.findIndex((f) => (f.fieldId || f.id) === fieldId);
            if (actualIndex !== -1) {
              remove(actualIndex);
            }
          } else {
            remove(index);
          }
        },
        children: /* @__PURE__ */ jsx(default_1, {})
      }
    )
  ] });
};
export {
  NewAdvanceSearchModalItem as default
};
