import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import moment from "moment";
import { Select } from "../Select/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function ShowMonthYearSelect({ customYears, month, onMonthSelect, onYearSelect }) {
  const { t } = useTranslation();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const yrs = Array.from({ length: 10 }, (_, index) => {
    const year = (currentYear - 5 + index).toString();
    return { label: year, value: year };
  });
  const years = customYears && customYears.length > 0 ? customYears : yrs;
  const months = moment.months().map((label, value) => {
    return {
      label,
      value
    };
  });
  const [open1, setOpen1] = useState(false);
  const [currentOptions1, setCurrentOptions1] = useState(months);
  const [open2, setOpen2] = useState(false);
  const [currentOptions2, setCurrentOptions2] = useState(years);
  const selectedOptions1 = {
    label: month.format("MMMM"),
    value: month.month()
  };
  const selectedOptions2 = {
    label: month.year().toString(),
    value: month.year().toString()
  };
  return /* @__PURE__ */ jsxs("div", { className: "date-range-picker-show-month-year-select-container", children: [
    /* @__PURE__ */ jsx("div", { className: "date-range-picker-month-select-container", children: /* @__PURE__ */ jsx(
      Select,
      {
        isWithSearch: true,
        withPortal: true,
        currentOptions: currentOptions1,
        dropDownPortalClassName: "date-range-picker-month-select-dropdown",
        handleChange: (val) => {
          onMonthSelect(month, val.value);
        },
        initialOptions: months,
        isOpen: open1,
        minWidth: "80px",
        name: "year-select",
        placeholder: t("dateRangePicker.monthSelectPlaceholder"),
        selectedOptions: selectedOptions1,
        setCurrentOptions: setCurrentOptions1,
        setIsOpen: setOpen1,
        setSelectedOptions: () => {
        }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "date-range-picker-year-select-container", children: /* @__PURE__ */ jsx(
      Select,
      {
        isWithSearch: true,
        withPortal: true,
        currentOptions: currentOptions2,
        dropDownPortalClassName: "date-range-picker-year-select-dropdown",
        handleChange: (val) => {
          onYearSelect(month, val.value);
        },
        initialOptions: years,
        isOpen: open2,
        minWidth: "66px",
        name: "month-select",
        placeholder: t("dateRangePicker.yearSelectPlaceholder"),
        selectedOptions: selectedOptions2,
        setCurrentOptions: setCurrentOptions2,
        setIsOpen: setOpen2,
        setSelectedOptions: () => {
        }
      }
    ) })
  ] });
}
export {
  ShowMonthYearSelect
};
