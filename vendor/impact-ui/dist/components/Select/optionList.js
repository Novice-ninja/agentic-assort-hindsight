import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/ChevronRight.js";
import { components } from "react-select";
import { Checkbox } from "../Checkbox/index.js";
import { Tooltip } from "../Tooltip/index.js";
const getSelectedChildrenCount = (parent, selectedOptions) => {
  var _a;
  if (!parent.children || !selectedOptions || !Array.isArray(selectedOptions)) return 0;
  const selectedParent = selectedOptions.find((sel) => sel.value === parent.value);
  return selectedParent ? ((_a = selectedParent.children) == null ? void 0 : _a.length) ?? 0 : 0;
};
const areAllChildrenSelected = (option, selectedOptions) => {
  var _a;
  if (!option.children || !selectedOptions || !Array.isArray(selectedOptions)) return false;
  const selectedParent = selectedOptions.find((sel) => sel.value === option.value);
  return !!(selectedParent && ((_a = selectedParent.children) == null ? void 0 : _a.length) === option.children.length);
};
const OverflowTooltipLabel = ({ text, popperProps }) => {
  const labelRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const checkOverflow = () => {
    const el = labelRef.current;
    if (!el) return;
    setIsOverflowed(el.scrollWidth > el.clientWidth);
  };
  useEffect(() => {
    checkOverflow();
  }, [text]);
  useEffect(() => {
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);
  const content = /* @__PURE__ */ jsx("span", { ref: labelRef, children: text });
  return isOverflowed ? /* @__PURE__ */ jsx(
    Tooltip,
    {
      className: "select-tooltip",
      orientation: "right",
      PopperProps: popperProps,
      title: text,
      variant: "tertiary",
      children: content
    }
  ) : content;
};
const Option = ({
  isLoadingOption,
  isDisabled,
  customOptionProps,
  ...props
}) => {
  const { data, isSelected, selectedOptions } = props;
  const resolveComponent = () => {
    if (props.isMulti) {
      const hasChildren2 = !!(data.children && data.children.length > 0);
      const selectedCount = hasChildren2 ? getSelectedChildrenCount(data, selectedOptions) : 0;
      const allChildrenSelected = hasChildren2 ? areAllChildrenSelected(data, selectedOptions) : false;
      const popperProps = {
        modifiers: [{ name: "offset", options: { offset: [0, 18] } }]
      };
      return /* @__PURE__ */ jsx(
        Checkbox,
        {
          checked: isSelected,
          disabled: isLoadingOption || isDisabled,
          label: /* @__PURE__ */ jsx("div", { className: "select-label-with-icon", children: data.children ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(OverflowTooltipLabel, { popperProps, text: data.label }),
            hasChildren2 && selectedCount > 0 && /* @__PURE__ */ jsxs("span", { className: "selected-children-count", children: [
              "(",
              selectedCount,
              ")"
            ] })
          ] }) : /* @__PURE__ */ jsx(OverflowTooltipLabel, { popperProps, text: data.label }) }),
          variant: hasChildren2 && selectedCount > 0 && !allChildrenSelected ? "dashed" : "default",
          withoutFormLabel: true,
          onChange: () => null
        }
      );
    } else {
      const isParentSelected = data.children && data.children.some(
        (child) => selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.value === child.value
      );
      const isOptionSelected = isSelected || isParentSelected;
      const popperProps = {
        modifiers: [{ name: "offset", options: { offset: [0, 15] } }]
      };
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `select-label-with-icon ${isOptionSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`,
          children: data.children ? /* @__PURE__ */ jsx(OverflowTooltipLabel, { popperProps, text: data.label }) : /* @__PURE__ */ jsx(OverflowTooltipLabel, { popperProps, text: data.label })
        }
      );
    }
  };
  const selectProps = props.selectProps;
  const optionIndex = selectProps.options ? selectProps.options.findIndex((o) => o.value === data.value) : -1;
  const listboxId = selectProps.listboxId || "ia-select-listbox";
  const hasChildren = !!(data.children && data.children.length > 0);
  const renderOption = () => {
    var _a;
    return /* @__PURE__ */ jsx(components.Option, { ...props, isDisabled: !!isDisabled, children: /* @__PURE__ */ jsxs(
      "div",
      {
        "aria-expanded": hasChildren ? ((_a = selectProps.submenuParent) == null ? void 0 : _a.value) === data.value : void 0,
        "aria-selected": !!isSelected,
        className: `select-option-content ${props.isSelected || data.children && data.children.some(
          (child) => selectedOptions && !Array.isArray(selectedOptions) && selectedOptions.value === child.value
        ) ? "selected" : ""}`,
        id: `${listboxId}-option-${optionIndex}`,
        role: "option",
        ...customOptionProps ?? {},
        onMouseEnter: (e) => {
          if (typeof selectProps.setHighlightedIndex === "function") {
            selectProps.setHighlightedIndex(optionIndex);
          }
          if (typeof selectProps.setIsKeyboardNav === "function") {
            selectProps.setIsKeyboardNav(false);
          }
          if (typeof customOptionProps.onMouseEnter === "function") {
            customOptionProps.onMouseEnter(e);
          }
        },
        children: [
          resolveComponent(),
          hasChildren && /* @__PURE__ */ jsx(default_1, { className: "select-submenu-chevron" })
        ]
      }
    ) });
  };
  return renderOption();
};
export {
  Option,
  areAllChildrenSelected,
  getSelectedChildrenCount
};
