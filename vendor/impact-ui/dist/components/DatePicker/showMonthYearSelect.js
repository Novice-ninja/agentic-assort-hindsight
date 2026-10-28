import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import moment from "moment";
import { Select } from "../Select/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const DEFAULT_YEARS_COUNT = 10;
function ShowMonthYearSelect({
  customYears,
  month,
  onMonthSelect,
  onYearSelect,
  minDate,
  maxDate
}) {
  const { t } = useTranslation();
  const yearOptions = useMemo(() => {
    if (customYears && customYears.length > 0) {
      return customYears.map((y) => ({ label: y.label, value: y.value }));
    }
    if (minDate && maxDate) {
      return Array.from(
        {
          length: new Date(maxDate).getFullYear() - new Date(minDate).getFullYear() + 1
        },
        (_, index) => {
          const year = (new Date(minDate).getFullYear() + index).toString();
          return { label: year, value: year };
        }
      );
    }
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return Array.from({ length: DEFAULT_YEARS_COUNT }, (_, i) => {
      const y = (currentYear - 5 + i).toString();
      return { label: y, value: y };
    });
  }, [customYears, minDate, maxDate]);
  const monthOptions = useMemo(
    () => moment.months().map((label, value) => ({ label, value })),
    []
  );
  const selectedMonth = {
    label: month.format("MMMM"),
    value: month.month()
  };
  const selectedYear = {
    label: month.year().toString(),
    value: month.year().toString()
  };
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [monthCurrentOptions, setMonthCurrentOptions] = useState(monthOptions);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [yearCurrentOptions, setYearCurrentOptions] = useState(yearOptions);
  return /* @__PURE__ */ jsxs("div", { className: "date-picker-show-month-year-select-container", children: [
    /* @__PURE__ */ jsx("div", { className: "date-picker-month-select-container", children: /* @__PURE__ */ jsx(
      Select,
      {
        isWithSearch: true,
        withPortal: true,
        currentOptions: monthCurrentOptions,
        dropDownPortalClassName: "date-picker-month-select-dropdown",
        handleChange: (val) => {
          if (val && !Array.isArray(val)) {
            onMonthSelect(month, val.value.toString());
            setIsMonthOpen(false);
          }
        },
        initialOptions: monthOptions,
        isOpen: isMonthOpen,
        minWidth: "105px",
        name: "month-select",
        placeholder: t("datePicker.monthSelectPlaceholder"),
        setCurrentOptions: setMonthCurrentOptions,
        setIsOpen: setIsMonthOpen,
        selectedOptions: selectedMonth,
        setSelectedOptions: () => {
        }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "date-picker-year-select-container", children: /* @__PURE__ */ jsx(
      Select,
      {
        isWithSearch: true,
        withPortal: true,
        currentOptions: yearCurrentOptions,
        dropDownPortalClassName: "date-picker-year-select-dropdown",
        handleChange: (val) => {
          if (val && !Array.isArray(val)) {
            onYearSelect(month, val.value.toString());
            setIsYearOpen(false);
          }
        },
        initialOptions: yearOptions,
        isOpen: isYearOpen,
        minWidth: "80px",
        name: "year-select",
        placeholder: t("datePicker.yearSelectPlaceholder"),
        setCurrentOptions: setYearCurrentOptions,
        setIsOpen: setIsYearOpen,
        selectedOptions: selectedYear,
        setSelectedOptions: () => {
        }
      }
    ) })
  ] });
}
export {
  ShowMonthYearSelect
};
