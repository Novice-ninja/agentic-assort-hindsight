import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useState, forwardRef } from "react";
import { Tag } from "../Tag/index.js";
import { Tooltip } from "../Tooltip/index.js";
const SelectedOptionsTags = ({ selectedOptions, onChange }) => {
  const optionListTagRef = useRef(null);
  const [isSelectedOptionsTagListOpen, setSelectedOptionsTagListOpen] = useState(false);
  const handleOptionTagRemove = (option) => {
    const updatedOptions = selectedOptions.filter((op) => op.value !== option.value);
    onChange(updatedOptions);
  };
  return /* @__PURE__ */ jsx("div", { className: "select-options-tag-group", children: selectedOptions.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
    selectedOptions.slice(0, 3).map((option, index) => /* @__PURE__ */ jsx(
      SelectedOptionTag,
      {
        label: option.label,
        orientation: "bottom",
        onClose: () => {
          handleOptionTagRemove(option);
        }
      },
      index
    )),
    selectedOptions.length > 3 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { ref: optionListTagRef, className: "tag-group-open", children: /* @__PURE__ */ jsx(
        Tag,
        {
          label: /* @__PURE__ */ jsx("span", { className: "tag-group-more" }),
          size: "small",
          onClick: () => {
            setSelectedOptionsTagListOpen((prevState) => !prevState);
          }
        }
      ) }),
      isSelectedOptionsTagListOpen && /* @__PURE__ */ jsx(
        SelectedOptionsTagList,
        {
          ref: optionListTagRef,
          handleOptionTagRemove,
          selectedOptions
        }
      )
    ] })
  ] }) : null });
};
const SelectedOptionsTagList = forwardRef(
  ({ selectedOptions, handleOptionTagRemove }, ref) => {
    var _a, _b;
    const divRef = ref;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "select-options-tag-list",
        style: {
          top: (((_a = divRef.current) == null ? void 0 : _a.offsetTop) ?? 0) + 25,
          left: ((_b = divRef.current) == null ? void 0 : _b.offsetLeft) ?? 0
        },
        children: selectedOptions.slice(3).map((option, index) => /* @__PURE__ */ jsx(
          SelectedOptionTag,
          {
            label: option.label,
            orientation: "right",
            onClose: () => {
              handleOptionTagRemove(option);
            }
          },
          index
        ))
      }
    );
  }
);
SelectedOptionsTagList.displayName = "SelectedOptionsTagList";
const SelectedOptionTag = ({ orientation, onClose, label }) => {
  return /* @__PURE__ */ jsx(Tooltip, { isHoverEnabled: true, orientation, title: label, variant: "primary", children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Tag, { isRemovable: true, label, size: "small", onDelete: onClose }) }) });
};
export {
  SelectedOptionsTagList,
  SelectedOptionsTags
};
