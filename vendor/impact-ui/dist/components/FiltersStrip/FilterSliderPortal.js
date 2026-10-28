import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "../Button/index.js";
import { Portal } from "../Portal/index.js";
function FilterSliderPortal({
  filtersContainer,
  tags,
  showButton,
  tag,
  viewAllAction,
  position
}) {
  if (!filtersContainer) return null;
  return /* @__PURE__ */ jsx(Portal, { container: document.body, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "impact-selected-filter-tags-dropdown",
      style: {
        top: position.y + 18,
        left: position.width > 200 ? position.x - 200 : position.x - position.width,
        width: `${position.width}px`
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "impact-selected-filter-tag-container", children: tags.map((dropdownTag, tagIndex) => /* @__PURE__ */ jsx("div", { className: "impact-selected-filter-tag-label", children: dropdownTag.label }, tagIndex)) }),
        showButton && viewAllAction && /* @__PURE__ */ jsxs("div", { className: "impact-selected-filter-tags-actions-container", children: [
          /* @__PURE__ */ jsx("div", { className: "impact-notification-horizontal-separator" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "large",
              variant: "text",
              onClick: () => {
                viewAllAction(tag);
              },
              children: `View all (${tag.values.length})`
            }
          )
        ] })
      ]
    }
  ) });
}
FilterSliderPortal.displayName = "FilterSliderPortal";
export {
  FilterSliderPortal
};
