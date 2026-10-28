import { jsxs, jsx } from "react/jsx-runtime";
import { Button } from "../Button/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function DateRangePickerFooter({
  selectedDaysNumber,
  handleResetDates,
  handleCancelDates,
  onSecondaryButtonClick,
  tertiaryButtonProps,
  handleApplyDates,
  primaryButtonProps,
  hasInputErrors,
  isApplyDisabled = selectedDaysNumber <= 0,
  isClearDisabled = selectedDaysNumber <= 0
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "dateRangePicker-footer-container", children: [
    /* @__PURE__ */ jsx("div", { className: "dateRangePicker-buttons-left-container", children: /* @__PURE__ */ jsxs("div", { className: "dateRangePicker-footer-label-container", children: [
      t("dateRangePicker.selectedLabel"),
      " ",
      /* @__PURE__ */ jsx("span", { className: "dateRangePicker-footer-value", children: t("dateRangePicker.daysCount", { count: selectedDaysNumber }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "dateRangePicker-buttons-right-container", children: [
      /* @__PURE__ */ jsx(Button, { disabled: isClearDisabled, size: "small", variant: "url", onClick: handleResetDates, children: t("common.clear") }),
      onSecondaryButtonClick && /* @__PURE__ */ jsx(
        Button,
        {
          size: "small",
          variant: "secondary",
          onClick: handleCancelDates,
          ...tertiaryButtonProps,
          children: t("common.cancel")
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "small",
          variant: "primary",
          onClick: handleApplyDates,
          ...primaryButtonProps,
          disabled: hasInputErrors || isApplyDisabled || (primaryButtonProps == null ? void 0 : primaryButtonProps.disabled) === true,
          children: t("common.apply")
        }
      )
    ] })
  ] });
}
export {
  DateRangePickerFooter
};
