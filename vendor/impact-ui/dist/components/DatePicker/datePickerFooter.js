import { jsxs, jsx } from "react/jsx-runtime";
import { Button } from "../Button/index.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function DatePickerFooter({
  tertiaryButtonProps,
  secondaryButtonProps,
  primaryButtonProps,
  isPrimaryButtonDisabled = true,
  isTertiaryButtonDisabled = true,
  setSelectedDate,
  setFocused,
  onTertiaryButtonClick,
  onSecondaryButtonClick,
  onPrimaryButtonClick,
  setIsOpen,
  hideTertiaryButton,
  hideSecondaryButton,
  hidePrimaryButton
}) {
  const { t } = useTranslation();
  const allButtonsHidden = hideTertiaryButton && hideSecondaryButton && hidePrimaryButton;
  const handleClear = () => {
    setSelectedDate == null ? void 0 : setSelectedDate(null);
    setFocused(false);
    onTertiaryButtonClick == null ? void 0 : onTertiaryButtonClick();
  };
  const handleCancel = () => {
    setIsOpen(false);
    setFocused(false);
    onSecondaryButtonClick == null ? void 0 : onSecondaryButtonClick();
  };
  const handleApply = () => {
    setIsOpen(false);
    onPrimaryButtonClick == null ? void 0 : onPrimaryButtonClick();
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `datePicker-buttons-container ${allButtonsHidden ? "datePicker-buttons-container--hidden" : ""}`,
      children: [
        !hideTertiaryButton && /* @__PURE__ */ jsx(
          Button,
          {
            size: "small",
            variant: "url",
            onClick: handleClear,
            ...tertiaryButtonProps,
            disabled: isTertiaryButtonDisabled || (tertiaryButtonProps == null ? void 0 : tertiaryButtonProps.disabled) === true,
            children: t("common.clear")
          }
        ),
        !hideSecondaryButton && /* @__PURE__ */ jsx(Button, { size: "small", variant: "secondary", onClick: handleCancel, ...secondaryButtonProps, children: t("common.cancel") }),
        !hidePrimaryButton && /* @__PURE__ */ jsx(
          Button,
          {
            size: "small",
            variant: "primary",
            onClick: handleApply,
            ...primaryButtonProps,
            disabled: isPrimaryButtonDisabled || (primaryButtonProps == null ? void 0 : primaryButtonProps.disabled) === true,
            children: t("common.apply")
          }
        )
      ]
    }
  );
}
export {
  DatePickerFooter
};
