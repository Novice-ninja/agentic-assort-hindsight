import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import NewAdvanceSearchModalItem from "./NewAdvanceSearchModalItem.js";
import { convertToOptions } from "../../../utils/helper.js";
import { Button } from "../../Button/index.js";
import { ButtonGroup } from "../../ButtonGroup/index.js";
import { Modal } from "../../Modal/index.js";
import AddOutlined from "../../../node_modules/@mui/icons-material/esm/AddOutlined.js";
const filterInitialValues = {
  column: { label: "", value: "", type: "text" },
  operation: null,
  value: null
};
const NewAdvanceSearchModal = ({
  isAdvanceSearch,
  actualRef,
  onSearchApplyClick,
  toggleAdvanceSearch,
  initialFilters,
  setInitialFilters,
  colDefs = [],
  currentColumnId,
  ...args
}) => {
  const [activeSearchType, setActiveSearchType] = useState("advanceSearch");
  const onChangeSearchType = (e, val) => {
    e.preventDefault();
    setActiveSearchType(val);
  };
  const formMethods = useForm({
    defaultValues: {
      filters: initialFilters
    },
    rules: {
      required: true
    }
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid: isFormValid },
    setValue,
    getValues,
    reset
  } = formMethods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
    keyName: "fieldId"
  });
  const formValues = watch();
  const filteredColumnsInitialOptions = useMemo(() => {
    const selectedValues = (formValues.filters || []).map((f) => {
      var _a;
      return (_a = f == null ? void 0 : f.column) == null ? void 0 : _a.value;
    }).filter(Boolean);
    return convertToOptions(colDefs || []).filter((opt) => !selectedValues.includes(opt.value));
  }, [colDefs, formValues.filters]);
  const [hasInitializedWithColumnId, setHasInitializedWithColumnId] = useState(false);
  const prevIsAdvanceSearchRef = React__default.useRef(false);
  useEffect(() => {
    const isOpening = isAdvanceSearch && !prevIsAdvanceSearchRef.current;
    if (isOpening && initialFilters !== void 0) {
      const validInitialFilters = (initialFilters || []).filter((f) => {
        var _a;
        return (_a = f == null ? void 0 : f.column) == null ? void 0 : _a.value;
      });
      reset({
        filters: validInitialFilters.length > 0 ? validInitialFilters : [filterInitialValues]
      });
      setHasInitializedWithColumnId(false);
    }
    prevIsAdvanceSearchRef.current = isAdvanceSearch;
  }, [isAdvanceSearch, initialFilters, reset]);
  useEffect(() => {
    var _a, _b;
    if (isAdvanceSearch && currentColumnId && !hasInitializedWithColumnId && initialFilters) {
      const hasValidFilters = initialFilters.some(
        (f) => {
          var _a2, _b2, _c;
          return ((_a2 = f == null ? void 0 : f.column) == null ? void 0 : _a2.value) && ((_b2 = f == null ? void 0 : f.column) == null ? void 0 : _b2.value) !== null && ((_c = f == null ? void 0 : f.column) == null ? void 0 : _c.value) !== "";
        }
      );
      if (!hasValidFilters) {
        const formValues2 = getValues();
        const existingFilters = formValues2.filters || [];
        const columnExists = existingFilters.some(
          (filter) => {
            var _a2;
            return ((_a2 = filter == null ? void 0 : filter.column) == null ? void 0 : _a2.value) === currentColumnId;
          }
        );
        if (!columnExists) {
          const columnOption = convertToOptions(colDefs || []).find(
            (opt) => opt.value === currentColumnId
          );
          if (columnOption) {
            if (existingFilters.length > 0 && !((_b = (_a = existingFilters[0]) == null ? void 0 : _a.column) == null ? void 0 : _b.value)) {
              setValue(`filters.0.column`, columnOption);
            } else {
              append({
                column: columnOption,
                operation: null,
                value: null
              });
            }
          }
        }
      }
      setHasInitializedWithColumnId(true);
    }
  }, [
    isAdvanceSearch,
    currentColumnId,
    colDefs,
    getValues,
    setValue,
    append,
    hasInitializedWithColumnId,
    initialFilters
  ]);
  useEffect(() => {
    if (!isAdvanceSearch) {
      setHasInitializedWithColumnId(false);
    }
  }, [isAdvanceSearch]);
  const onCloseModal = () => {
    toggleAdvanceSearch();
  };
  const handleSearchApplyClick = () => {
    const formValues2 = formMethods.getValues().filters || [];
    const validFilters = formValues2.filter((filter) => {
      var _a, _b, _c, _d, _e, _f;
      const hasColumn = ((_a = filter == null ? void 0 : filter.column) == null ? void 0 : _a.value) && ((_b = filter == null ? void 0 : filter.column) == null ? void 0 : _b.value) !== null && ((_c = filter == null ? void 0 : filter.column) == null ? void 0 : _c.value) !== "";
      if (activeSearchType === "advanceSearch") {
        return hasColumn && ((_d = filter == null ? void 0 : filter.operation) == null ? void 0 : _d.value) && ((_e = filter == null ? void 0 : filter.operation) == null ? void 0 : _e.value) !== null && ((_f = filter == null ? void 0 : filter.operation) == null ? void 0 : _f.value) !== "";
      }
      return hasColumn;
    });
    onSearchApplyClick(validFilters);
  };
  const onClearAttributeValue = () => {
    const updatedFilters = formMethods.getValues().filters.map((filter) => ({ ...filter, value: null }));
    formMethods.reset({
      filters: updatedFilters
    });
  };
  const onClearAll = () => {
    formMethods.reset({
      filters: [filterInitialValues]
    });
  };
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      className: "ia-table-search-modal",
      height: 400,
      open: isAdvanceSearch,
      primaryButtonLabel: "Apply",
      primaryButtonProps: {
        type: "submit"
        // disabled: !isFormValid,
      },
      secondaryButtonLabel: args.onSearchSaveClick ? "Save search" : null,
      secondaryButtonProps: {
        disabled: !isFormValid
      },
      size: "small",
      title: "Search",
      width: 850,
      onClose: onCloseModal,
      onPrimaryButtonClick: handleSearchApplyClick,
      onSecondaryButtonClick: (e) => {
        e.preventDefault();
        onCloseModal();
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "ia-table-search-header", children: [
          /* @__PURE__ */ jsx(
            ButtonGroup,
            {
              options: [
                {
                  label: "Search",
                  value: "search"
                },
                {
                  label: "Advance Search",
                  value: "advanceSearch"
                }
              ],
              selectedOption: activeSearchType,
              onChange: (e, val) => {
                var _a, _b;
                e.preventDefault();
                onChangeSearchType(e, val);
                (_b = (_a = actualRef == null ? void 0 : actualRef.current) == null ? void 0 : _a.api) == null ? void 0 : _b.destroyFilter(null);
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              type: "button",
              variant: "url",
              onClick: (e) => {
                e.preventDefault();
                onClearAll();
              },
              children: "Clear all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            className: "ia-table-search-content",
            onSubmit: (e) => {
              e.preventDefault();
              handleSearchApplyClick();
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "ia-table-search-content-title", children: "Match all of the following rules" }),
              /* @__PURE__ */ jsx(Fragment, { children: fields.map((field, index) => /* @__PURE__ */ jsx(
                NewAdvanceSearchModalItem,
                {
                  activeSearchType,
                  colDefs,
                  control,
                  currentColumnId,
                  field,
                  fields,
                  filteredColumnsInitialOptions,
                  getValues,
                  index,
                  isLastVisible: fields.length === 1,
                  remove
                },
                field.fieldId || field.id
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "ia-table-search-content-footer", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "large",
                    variant: "secondary",
                    onClick: onClearAttributeValue,
                    type: "button",
                    children: "Clear values"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    icon: /* @__PURE__ */ jsx(AddOutlined, {}),
                    size: "large",
                    type: "button",
                    onClick: () => {
                      append({
                        column: null,
                        operation: null,
                        value: null
                      });
                    },
                    variant: "tertiary",
                    children: "Add attribute"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
};
export {
  NewAdvanceSearchModal as default
};
