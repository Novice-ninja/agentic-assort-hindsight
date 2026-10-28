import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { useSensors, useSensor, MouseSensor, TouchSensor, DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import default_1 from "../../node_modules/@mui/icons-material/DragIndicator.js";
import default_1$1 from "../../node_modules/@mui/icons-material/KeyboardArrowRight.js";
import { useTranslation } from "../../i18n/useTranslation.js";
function SortableAccordionComp({
  item,
  handleMultiAccordionChange,
  checkExpand,
  isDragging = false,
  isOverlay = false
}) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id
  });
  const style = {
    transform: isDragging && transform ? CSS.Transform.toString(transform) : void 0,
    transition: transition ?? void 0,
    width: "100%"
  };
  const inlineStyles = {
    opacity: isDragging ? 0.5 : 1,
    transformOrigin: "50% 50%",
    borderRadius: "10px",
    cursor: isDragging ? "grabbing" : "grab",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    boxShadow: isDragging ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px" : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
    transform: isDragging ? "scale(1.05)" : "scale(1)",
    ...style
  };
  const expandClass = checkExpand(item);
  return /* @__PURE__ */ jsx("div", { ref: setNodeRef, className: "impact-modern-accordion-container", style: inlineStyles, children: /* @__PURE__ */ jsxs("div", { className: "impact-modern-accordion-item", children: [
    /* @__PURE__ */ jsxs("div", { className: "impact-modern-accordion-header", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "impact-modern-accordion-drag-icon",
          ...isOverlay ? {} : { ...attributes, ...listeners },
          "aria-label": t("accordion.dragToReorder"),
          children: /* @__PURE__ */ jsx(default_1, {})
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-controls": `${item.value}-content`,
          "aria-expanded": expandClass === "expand-content",
          "aria-label": expandClass === "expand-content" ? t("common.collapse") : t("common.expand"),
          className: `impact-modern-accordion-expand-icon ${expandClass}-icon`,
          role: "button",
          tabIndex: 0,
          onClick: (event) => {
            event.stopPropagation();
            handleMultiAccordionChange(item.value);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleMultiAccordionChange(item.value);
            }
          },
          children: /* @__PURE__ */ jsx(default_1$1, {})
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "impact-modern-accordion-title", children: item.header })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-labelledby": `${item.value}-header`,
        className: `impact-modern-accordion-content ${expandClass}`,
        id: `${item.value}-content`,
        role: "region",
        children: item.content
      }
    )
  ] }) });
}
function SortableAccordionList({
  data,
  handleMultiAccordionChange,
  checkExpand
}) {
  const [items, setItems] = useState(data);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const handleDragStart = useCallback((event) => {
    setActiveId(String(event.active.id));
  }, []);
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.findIndex((item) => item.id === active.id);
        const newIndex = current.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return current;
        return arrayMove(current, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);
  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;
  return /* @__PURE__ */ jsxs(
    DndContext,
    {
      collisionDetection: closestCenter,
      sensors,
      onDragCancel: handleDragCancel,
      onDragEnd: handleDragEnd,
      onDragStart: handleDragStart,
      children: [
        /* @__PURE__ */ jsx(SortableContext, { items, children: /* @__PURE__ */ jsx("div", { className: "impact-accordion-modern-main-container", children: items.map((item) => /* @__PURE__ */ jsx(
          SortableAccordionComp,
          {
            checkExpand,
            handleMultiAccordionChange,
            item
          },
          item.id
        )) }) }),
        /* @__PURE__ */ jsx(DragOverlay, { adjustScale: false, style: { width: "inherit", transformOrigin: "0 0" }, children: activeItem ? /* @__PURE__ */ jsx(
          SortableAccordionComp,
          {
            isDragging: true,
            isOverlay: true,
            checkExpand,
            handleMultiAccordionChange,
            item: activeItem
          }
        ) : null })
      ]
    }
  );
}
export {
  SortableAccordionComp,
  SortableAccordionList
};
