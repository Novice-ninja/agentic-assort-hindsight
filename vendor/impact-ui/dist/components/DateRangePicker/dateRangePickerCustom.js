import { jsxs, jsx } from "react/jsx-runtime";
import { getRangeSelectorTypes } from "./utils.js";
import { RadioButtonGroup } from "../RadioButtonGroup/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function DateRangePickerCustom({ handleRangeSelectorChange, selectedRange }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "dateRangePicker-show-range-main-container", children: [
    /* @__PURE__ */ jsx("div", { className: "dateRangePicker-shortcut-heading", children: t("dateRangePicker.rangeHeading") }),
    /* @__PURE__ */ jsx("div", { className: "dateRangePicker-shortcut-list", children: /* @__PURE__ */ jsx(
      RadioButtonGroup,
      {
        className: "dateRangePicker-shortcut-list-item",
        options: getRangeSelectorTypes(t),
        value: selectedRange,
        onChange: handleRangeSelectorChange
      }
    ) })
  ] });
}
export {
  DateRangePickerCustom
};
