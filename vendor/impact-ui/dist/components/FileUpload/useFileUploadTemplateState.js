import { useState, useMemo, useEffect, useCallback } from "react";
import { toCamelCaseLabels, toCamelCase } from "./fileUploadUtils.js";
function useFileUploadTemplateState({
  options: templateColumnOptions,
  selectedValues: templateColumnSelections,
  onMenuPrimaryButtonClick: onTemplateMenuPrimaryClick,
  onTertiaryButtonClick: onTemplateMenuTertiaryClick
}) {
  const [selected, setSelected] = useState(
    () => toCamelCaseLabels(templateColumnSelections)
  );
  const hasTemplateOptions = ((templateColumnOptions == null ? void 0 : templateColumnOptions.length) ?? 0) > 0;
  const menuOptions = useMemo(() => {
    if (!templateColumnOptions) return [];
    return templateColumnOptions.map((item) => ({
      label: item,
      value: toCamelCase(item)
    }));
  }, [templateColumnOptions]);
  useEffect(() => {
    setSelected(toCamelCaseLabels(templateColumnSelections));
  }, [templateColumnSelections]);
  const handleMenuSelectionChange = useCallback((items) => {
    setSelected(items);
  }, []);
  const handleMenuPrimaryClick = useCallback(
    (selectedFileType) => {
      onTemplateMenuPrimaryClick == null ? void 0 : onTemplateMenuPrimaryClick(selectedFileType, selected);
    },
    [onTemplateMenuPrimaryClick, selected]
  );
  const handleMenuTertiaryClick = useCallback(() => {
    onTemplateMenuTertiaryClick == null ? void 0 : onTemplateMenuTertiaryClick(selected);
  }, [onTemplateMenuTertiaryClick, selected]);
  return {
    selected,
    hasTemplateOptions,
    menuOptions,
    handleMenuSelectionChange,
    handleMenuPrimaryClick,
    handleMenuTertiaryClick
  };
}
export {
  useFileUploadTemplateState
};
