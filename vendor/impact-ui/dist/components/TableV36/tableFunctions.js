import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useMemo, useEffect, useCallback, memo } from "react";
import { useSensors, useSensor, MouseSensor, TouchSensor, DndContext, closestCenter, DragOverlay, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PersonUser as PersonUser_default, Globe as Globe_default, PinnedIcon as PinnedIcon_default } from "../../node_modules/@impactsmartsuite/impact-icons/dist/index.js";
import default_1$1 from "../../node_modules/@mui/icons-material/KeyboardArrowDown.js";
import default_1$3 from "../../node_modules/@mui/icons-material/KeyboardArrowRight.js";
import default_1 from "../../node_modules/@mui/icons-material/KeyboardArrowUp.js";
import default_1$2 from "../../node_modules/@mui/icons-material/Search.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { debounce } from "../../utils/debounce.js";
import { isViewNameUnique } from "../../utils/helper.js";
import { Badge } from "../Badge/index.js";
import { Button } from "../Button/index.js";
import { Checkbox } from "../Checkbox/index.js";
import { Input } from "../Input/index.js";
import { Modal } from "../Modal/index.js";
import { Prompt } from "../Prompt/index.js";
import { RadioButtonGroup } from "../RadioButtonGroup/index.js";
import { Select } from "../Select/index.js";
import HighlightedText from "./HighlightedText.js";
import { collectVisibleLeafIds, syncColumnSearchTextToGrid, ensureColumnGroupsExpanded } from "./tableUtils.js";
import IconButton from "../../node_modules/@mui/material/IconButton/IconButton.js";
import DragIndicator from "../../node_modules/@mui/icons-material/esm/DragIndicator.js";
import { useTranslation } from "../../i18n/useTranslation.js";
const saveViewIcon = getAssetUrl("icons/saveViewIcon.svg");
const saveViewEditIcon = getAssetUrl("icons/saveViewEditIcon.svg");
const saveViewDeleteIcon = getAssetUrl("icons/saveViewDeleteIcon.svg");
const defaultViewIcon = getAssetUrl("icons/defaultViewIcon.svg");
const defaultViewActiveIcon = getAssetUrl("icons/defaultViewIconActive.svg");
const clearIcon = getAssetUrl("icons/close-tags.svg");
const searchIcon = getAssetUrl("icons/search-table.svg");
const DEFAULT_VIEW_TYPE_ICONS = {
  global: /* @__PURE__ */ jsx(Globe_default, { height: 16, width: 16 }),
  personal: /* @__PURE__ */ jsx(PersonUser_default, { height: 16, width: 16 })
};
const getViewTypeIcon = (viewType, viewTypeOptions) => {
  var _a;
  const customIcon = (_a = viewTypeOptions == null ? void 0 : viewTypeOptions.find((option) => option.value === viewType)) == null ? void 0 : _a.icon;
  return customIcon || DEFAULT_VIEW_TYPE_ICONS[viewType] || null;
};
const onColMenuFreezeClick = (params) => {
  const { pinned } = params.column;
  if (pinned) {
    freezeColumn(params, false);
  } else {
    freezeColumn(params, true);
  }
};
const getTableMeta = (api) => {
  if (!api) return null;
  if (!api.__impactTableMeta) {
    api.__impactTableMeta = {};
  }
  return api.__impactTableMeta;
};
const freezeColumn = (params, isPinned) => {
  const { colId } = params.column;
  params.api.applyColumnState({
    state: [{ colId, pinned: isPinned ? "left" : null }]
  });
};
const onColMenuAutoAdjustClick = (params) => {
  const colDefExtra = { ...params.column.colDef.extra };
  params.column.colDef.extra = colDefExtra;
  params.api.autoSizeColumns([params.column]);
};
const sortFunc = (columnData, sortBy, api) => {
  api.api.applyColumnState({
    state: [{ colId: columnData.colId, sort: sortBy }],
    defaultState: { sort: null }
  });
};
const getMainMenuItems = (params) => {
  var _a, _b, _c;
  if (!(params == null ? void 0 : params.column)) {
    return [];
  }
  const { onFontSizeChange, onNumberFormatChange } = params;
  const { colDef, pinned, sort, actualWidth } = params.column;
  const columnMenuItems = [];
  columnMenuItems.push(
    {
      name: "Column Settings",
      cssClasses: ["settings-main-container"]
    },
    "separator"
  );
  columnMenuItems.push({
    name: "Sort",
    subMenu: [
      {
        name: "Sort A to Z",
        action: () => {
          sortFunc(params.column, "asc", params);
        },
        checked: sort === "asc"
      },
      {
        name: "Sort Z to A",
        checked: sort === "desc",
        action: () => {
          sortFunc(params.column, "desc", params);
        }
      },
      {
        name: "Reset",
        action: () => {
          sortFunc(params.column, null, params);
        }
      }
    ],
    disabled: !(colDef == null ? void 0 : colDef.sortable)
  });
  columnMenuItems.push({
    name: pinned ? "Unfreeze Column" : "Freeze Column",
    action: () => {
      onColMenuFreezeClick(params);
    }
  });
  columnMenuItems.push({
    name: "Column width",
    subMenu: [
      {
        name: "Auto Adjust",
        action: () => {
          onColMenuAutoAdjustClick(params);
        },
        // if extra.width property is not present- column is auto adjusted
        checked: actualWidth !== ((_a = colDef == null ? void 0 : colDef.extra) == null ? void 0 : _a.width)
      },
      {
        name: "Custom width",
        action: () => {
          var _a2;
          params.api.setColumnWidths([
            { key: params.column.colId, newWidth: (_a2 = colDef == null ? void 0 : colDef.extra) == null ? void 0 : _a2.width }
          ]);
        },
        // if extra.width property is present- column has custom width
        checked: ((_b = colDef == null ? void 0 : colDef.extra) == null ? void 0 : _b.width) === actualWidth,
        disabled: !((_c = colDef == null ? void 0 : colDef.extra) == null ? void 0 : _c.width)
      }
    ]
  });
  columnMenuItems.push({
    name: "Wrap Text",
    disabled: true
  });
  columnMenuItems.push(
    {
      name: "Format",
      cssClasses: ["format-main-container"]
    },
    "separator"
  );
  columnMenuItems.push({
    name: "Numeric Values",
    subMenu: [
      {
        name: "Full Number",
        action: () => onNumberFormatChange("full")
      },
      {
        name: "In K",
        action: () => onNumberFormatChange("thousand")
      },
      {
        name: "In Mn",
        action: () => onNumberFormatChange("million")
      },
      {
        name: "In Bn",
        action: () => onNumberFormatChange("billion")
      }
    ],
    disabled: !onFontSizeChange
  });
  columnMenuItems.push({
    name: "Font Size",
    subMenu: [
      {
        name: "Small Font",
        action: () => onFontSizeChange("small")
      },
      {
        name: "Medium Font",
        action: () => onFontSizeChange("medium")
      },
      {
        name: "Large Font",
        action: () => onFontSizeChange("large")
      }
    ],
    disabled: !onNumberFormatChange
  });
  return columnMenuItems;
};
const filterColumnsBySearch = (columns, searchText) => {
  if (!searchText) return columns;
  return columns.map((column) => {
    const matches = column.headerName.toLowerCase().includes(searchText);
    if (matches) {
      return column;
    }
    const filteredChildren = column.children ? filterColumnsBySearch(column.children, searchText) : null;
    if ((filteredChildren == null ? void 0 : filteredChildren.length) > 0) {
      return {
        ...column,
        children: filteredChildren
      };
    }
    return null;
  }).filter(Boolean);
};
const getDirectColumnIds = (columns) => (columns || []).map((col) => col.colId).filter(Boolean);
const getTopLevelColumnIds = getDirectColumnIds;
const findColumnById = (columns, colId) => {
  var _a;
  for (const col of columns || []) {
    if (col.colId === colId) return col;
    if ((_a = col.children) == null ? void 0 : _a.length) {
      const found = findColumnById(col.children, colId);
      if (found) return found;
    }
  }
  return null;
};
const findColumnLocation = (columns, colId, parent = null) => {
  var _a;
  for (const col of columns || []) {
    if (col.colId === colId) {
      return { column: col, parent, siblings: columns };
    }
    if ((_a = col.children) == null ? void 0 : _a.length) {
      const found = findColumnLocation(col.children, colId, col);
      if (found) return found;
    }
  }
  return null;
};
const reorderSiblingsInTree = (columns, parentId, siblingOrder) => (columns || []).map((col) => {
  var _a, _b;
  if (col.colId === parentId && ((_a = col.children) == null ? void 0 : _a.length)) {
    const byId = new Map(col.children.map((c) => [c.colId, c]));
    const ordered = siblingOrder.map((id) => byId.get(id)).filter(Boolean);
    const orderedSet = new Set(siblingOrder);
    const rest = col.children.filter((c) => !orderedSet.has(c.colId));
    return { ...col, children: [...ordered, ...rest] };
  }
  if ((_b = col.children) == null ? void 0 : _b.length) {
    return {
      ...col,
      children: reorderSiblingsInTree(col.children, parentId, siblingOrder)
    };
  }
  return col;
});
const collectLeafColIds = (column) => {
  var _a;
  if (!((_a = column == null ? void 0 : column.children) == null ? void 0 : _a.length)) {
    return (column == null ? void 0 : column.colId) ? [column.colId] : [];
  }
  return column.children.flatMap((child) => collectLeafColIds(child));
};
const buildOrderedLeafIds = (topLevelColumns, topLevelOrder) => {
  const byId = new Map(topLevelColumns.map((c) => [c.colId, c]));
  return topLevelOrder.flatMap((id) => {
    const col = byId.get(id);
    return col ? collectLeafColIds(col) : [id];
  });
};
const applyColumnReorderToGrid = (api, { allColumns, frozenOrder, scrollableOrder, pinChanges, childReorder }) => {
  if (!api) return;
  let columns = allColumns;
  if ((childReorder == null ? void 0 : childReorder.parentId) && (childReorder == null ? void 0 : childReorder.siblingOrder)) {
    columns = reorderSiblingsInTree(columns, childReorder.parentId, childReorder.siblingOrder);
  }
  const byId = new Map(columns.map((c) => [c.colId, c]));
  if (pinChanges == null ? void 0 : pinChanges.length) {
    const pinState = [];
    pinChanges.forEach(({ colId, pinned }) => {
      const col = byId.get(colId) || findColumnById(columns, colId);
      const leafIds = col ? collectLeafColIds(col) : [colId];
      leafIds.forEach((leafId) => {
        pinState.push({ colId: leafId, pinned });
      });
    });
    api.applyColumnState({ state: pinState });
  }
  const orderedLeafIds = [
    ...buildOrderedLeafIds(columns, frozenOrder),
    ...buildOrderedLeafIds(columns, scrollableOrder)
  ];
  const seen = /* @__PURE__ */ new Set();
  const uniqueLeafIds = orderedLeafIds.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  api.applyColumnState({
    state: uniqueLeafIds.map((colId) => ({ colId })),
    applyOrder: true
  });
};
const collectLeafVisibility = (columns) => {
  const leaves = [];
  const walk = (cols) => {
    cols.forEach((col) => {
      var _a;
      if (((_a = col.children) == null ? void 0 : _a.length) > 0) {
        walk(col.children);
      } else {
        leaves.push(!!col.isVisible);
      }
    });
  };
  walk(columns);
  return leaves;
};
const getCheckState = (columns) => {
  const leaves = collectLeafVisibility(columns);
  if (leaves.length === 0) {
    return { checked: false, indeterminate: false };
  }
  const visibleCount = leaves.filter(Boolean).length;
  if (visibleCount === 0) {
    return { checked: false, indeterminate: false };
  }
  if (visibleCount === leaves.length) {
    return { checked: true, indeterminate: false };
  }
  return { checked: true, indeterminate: true };
};
const applyVisibilityToggle = (columns, colId) => {
  const visibilityMap = /* @__PURE__ */ new Map();
  const updateChildren = (children, visibility) => children.map((column) => {
    visibilityMap.set(column.colId, visibility);
    return {
      ...column,
      isVisible: visibility,
      children: column.children ? updateChildren(column.children, visibility) : null
    };
  });
  const update = (cols) => cols.map((column) => {
    if (column.colId === colId) {
      const newVisibility = !column.isVisible;
      visibilityMap.set(column.colId, newVisibility);
      return {
        ...column,
        isVisible: newVisibility,
        children: column.children ? updateChildren(column.children, newVisibility) : null
      };
    }
    if (column.children) {
      const updatedChildren = update(column.children);
      const isAnyChildVisible = updatedChildren.some((child) => child.isVisible);
      visibilityMap.set(column.colId, isAnyChildVisible);
      return {
        ...column,
        isVisible: isAnyChildVisible,
        children: updatedChildren
      };
    }
    return column;
  });
  return { columns: update(columns), visibilityMap };
};
const applyVisibilityToAll = (columns, visibility) => {
  const visibilityMap = /* @__PURE__ */ new Map();
  const update = (cols) => cols.map((column) => {
    visibilityMap.set(column.colId, visibility);
    return {
      ...column,
      isVisible: visibility,
      children: column.children ? update(column.children) : null
    };
  });
  return { columns: update(columns), visibilityMap };
};
const applyVisibilityMapToGrid = (api, visibilityMap) => {
  if (!api || !visibilityMap.size) return;
  const showIds = [];
  const hideIds = [];
  visibilityMap.forEach((visible, colId) => {
    if (visible) showIds.push(colId);
    else hideIds.push(colId);
  });
  if (showIds.length) api.setColumnsVisible(showIds, true);
  if (hideIds.length) api.setColumnsVisible(hideIds, false);
};
const capitalizeHeader = (name) => name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
const mouseSensorOptions = { activationConstraint: { distance: 5 } };
const touchSensorOptions = { activationConstraint: { delay: 200, tolerance: 5 } };
const FROZEN_DROP_ZONE_ID = "frozen-drop-zone";
const FrozenColumnsDropZone = () => {
  const { t } = useTranslation();
  const { setNodeRef } = useDroppable({ id: FROZEN_DROP_ZONE_ID });
  return /* @__PURE__ */ jsx("div", { ref: setNodeRef, className: "table-setting-frozen-drop-zone", children: /* @__PURE__ */ jsx("span", { children: t("table.columns.dragHereToFreeze") }) });
};
const hasFrozenColumns = (columns) => columns.length > 0 && !(columns.length === 1 && columns[0].headerName === "N/A");
const PinSideToggle = ({ pinned, onToggle }) => {
  const isRight = pinned === "right";
  return /* @__PURE__ */ jsxs("div", { className: "table-setting-pin-side-toggle", children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: `table-setting-pin-side-label${isRight ? "" : " is-active"}`, children: "L" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-label": isRight ? "Pin right" : "Pin left",
        className: `table-setting-pin-side-track${isRight ? " is-right" : ""}`,
        onClick: (e) => {
          e.stopPropagation();
          onToggle == null ? void 0 : onToggle(isRight ? "left" : "right");
        },
        children: /* @__PURE__ */ jsx("span", { className: "table-setting-pin-side-thumb", children: /* @__PURE__ */ jsx(PinnedIcon_default, {}) })
      }
    ),
    /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: `table-setting-pin-side-label${isRight ? " is-active" : ""}`, children: "R" })
  ] });
};
const ColumnRowContent = memo(function ColumnRowContent2({
  column,
  level,
  isCollapsed,
  hasChildren,
  isIndeterminate,
  checkboxChecked,
  reserveCollapseSlot,
  rowClassName,
  dragIconClass,
  onToggleCollapse,
  onToggleVisibility,
  onKeyboardReorder,
  dragHandleProps,
  isOverlay,
  searchText,
  onTogglePinSide
}) {
  const isFrozen = rowClassName == null ? void 0 : rowClassName.includes("frozen-columns-list-item");
  const rowStyle = useMemo(
    () => ({
      ["--indent-level"]: level
    }),
    [level]
  );
  const handleCollapseClick = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleCollapse == null ? void 0 : onToggleCollapse(column.colId);
    },
    [onToggleCollapse, column.colId]
  );
  const handleVisibilityChange = useCallback(() => {
    onToggleVisibility == null ? void 0 : onToggleVisibility(column.colId);
  }, [onToggleVisibility, column.colId]);
  const handleRowKeyDown = useCallback(
    (e) => {
      var _a, _b, _c, _d;
      if (isOverlay) return;
      const current = e.currentTarget;
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        onKeyboardReorder == null ? void 0 : onKeyboardReorder(column.colId, e.key === "ArrowUp" ? -1 : 1);
        return;
      }
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = (_b = (_a = current.parentElement) == null ? void 0 : _a.nextElementSibling) == null ? void 0 : _b.querySelector('[role="treeitem"]');
          next == null ? void 0 : next.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = (_d = (_c = current.parentElement) == null ? void 0 : _c.previousElementSibling) == null ? void 0 : _d.querySelector('[role="treeitem"]');
          prev == null ? void 0 : prev.focus();
          break;
        }
        case "ArrowRight": {
          if (hasChildren && isCollapsed) {
            e.preventDefault();
            onToggleCollapse == null ? void 0 : onToggleCollapse(column.colId);
          }
          break;
        }
        case "ArrowLeft": {
          if (hasChildren && !isCollapsed) {
            e.preventDefault();
            onToggleCollapse == null ? void 0 : onToggleCollapse(column.colId);
          }
          break;
        }
        case "Enter":
        case " ": {
          if (column.disabled) break;
          e.preventDefault();
          onToggleVisibility == null ? void 0 : onToggleVisibility(column.colId);
          break;
        }
      }
    },
    [
      isOverlay,
      level,
      hasChildren,
      isCollapsed,
      onToggleCollapse,
      onToggleVisibility,
      onKeyboardReorder,
      column.colId,
      column.disabled
    ]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-checked": isIndeterminate ? "mixed" : checkboxChecked,
      "aria-expanded": hasChildren ? !isCollapsed : void 0,
      "aria-label": column.headerName,
      "aria-roledescription": !isOverlay && dragHandleProps ? "sortable column" : void 0,
      "aria-selected": !!checkboxChecked,
      className: rowClassName,
      "data-col-id": column.colId,
      role: "treeitem",
      style: rowStyle,
      tabIndex: isOverlay ? -1 : 0,
      onKeyDown: handleRowKeyDown,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "table-setting-column-leading", children: [
          reserveCollapseSlot && /* @__PURE__ */ jsx("span", { "aria-hidden": !hasChildren, className: "table-setting-column-collapse-slot", children: hasChildren ? /* @__PURE__ */ jsx(
            IconButton,
            {
              "aria-label": isCollapsed ? "Expand column group" : "Collapse column group",
              className: "table-setting-column-collapse-btn",
              onClick: handleCollapseClick,
              children: isCollapsed ? /* @__PURE__ */ jsx(default_1$3, {}) : /* @__PURE__ */ jsx(default_1, {})
            }
          ) : null }),
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: checkboxChecked,
              disabled: column.disabled || isOverlay,
              variant: isIndeterminate ? "dashed" : "default",
              onChange: handleVisibilityChange
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "table-setting-column-trailing", children: [
          dragHandleProps && /* @__PURE__ */ jsx(
            "span",
            {
              className: "table-setting-column-drag-handle",
              ...dragHandleProps,
              "aria-label": `Reorder ${column.headerName}`,
              children: /* @__PURE__ */ jsx(DragIndicator, { className: dragIconClass })
            }
          ),
          /* @__PURE__ */ jsx(
            HighlightedText,
            {
              className: "table-setting-column-name",
              searchText,
              text: capitalizeHeader(column.headerName)
            }
          )
        ] }),
        isFrozen && !isOverlay && /* @__PURE__ */ jsx(
          PinSideToggle,
          {
            pinned: column.pinned,
            onToggle: (side) => onTogglePinSide == null ? void 0 : onTogglePinSide(column.colId, side)
          }
        )
      ]
    }
  );
});
const areSortablePropsEqual = (prev, next) => prev.column.colId === next.column.colId && prev.column.isVisible === next.column.isVisible && prev.column.headerName === next.column.headerName && prev.column.disabled === next.column.disabled && prev.column.pinned === next.column.pinned && prev.isIndeterminate === next.isIndeterminate && prev.checkboxChecked === next.checkboxChecked && prev.reserveCollapseSlot === next.reserveCollapseSlot && prev.level === next.level && prev.isCollapsed === next.isCollapsed && prev.hasChildren === next.hasChildren && prev.rowClassName === next.rowClassName && prev.dragIconClass === next.dragIconClass && prev.onToggleCollapse === next.onToggleCollapse && prev.onToggleVisibility === next.onToggleVisibility && prev.onTogglePinSide === next.onTogglePinSide && prev.onKeyboardReorder === next.onKeyboardReorder && prev.searchText === next.searchText && prev.children === next.children;
const SortableColumnItem = memo(function SortableColumnItem2({
  column,
  level,
  isCollapsed,
  hasChildren,
  isIndeterminate,
  checkboxChecked,
  reserveCollapseSlot,
  rowClassName,
  dragIconClass,
  onToggleCollapse,
  onToggleVisibility,
  onKeyboardReorder,
  searchText,
  children,
  onTogglePinSide
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.colId
  });
  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      // Placeholder stays in-flow; DragOverlay renders the floating preview
      opacity: isDragging ? 0 : void 0,
      zIndex: isDragging ? 0 : void 0
    }),
    [transform, transition, isDragging]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      className: isDragging ? "table-setting-column-sortable--dragging" : void 0,
      style,
      children: [
        /* @__PURE__ */ jsx(
          ColumnRowContent,
          {
            checkboxChecked,
            column,
            dragHandleProps: { ...attributes, ...listeners },
            dragIconClass,
            hasChildren,
            isCollapsed,
            isIndeterminate,
            level,
            reserveCollapseSlot,
            rowClassName,
            searchText,
            onKeyboardReorder,
            onToggleCollapse,
            onToggleVisibility,
            onTogglePinSide
          }
        ),
        hasChildren && !isCollapsed && children
      ]
    }
  );
}, areSortablePropsEqual);
const NestedColumnItem = memo(function NestedColumnItem2({
  column,
  level,
  isCollapsed,
  hasChildren,
  isIndeterminate,
  checkboxChecked,
  reserveCollapseSlot,
  rowClassName,
  dragIconClass,
  onToggleCollapse,
  onToggleVisibility,
  searchText,
  children,
  onTogglePinSide
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      ColumnRowContent,
      {
        checkboxChecked,
        column,
        dragIconClass,
        hasChildren,
        isCollapsed,
        isIndeterminate,
        level,
        reserveCollapseSlot,
        rowClassName,
        searchText,
        onToggleCollapse,
        onToggleVisibility,
        onTogglePinSide
      }
    ),
    hasChildren && !isCollapsed && children
  ] });
});
const Columns = forwardRef((props, ref) => {
  var _a, _b, _c, _d, _e, _f;
  const [frozenColumn, setFrozenColumn] = useState([]);
  const [scrollableColumn, setScrollableColumn] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [collapsedScrollable, setCollapsedScrollable] = useState(false);
  const [collapsedColumn, setCollapsedcolumn] = useState(false);
  const [collapsedScrollColumns, setCollapsedScrollColumns] = useState({});
  const [collapsedFrozenColumns, setCollapsedFrozenColumns] = useState({});
  const [activeDragId, setActiveDragId] = useState(null);
  const reorderLiveRegionRef = useRef(null);
  const [openSaveViewModal, setOpenSaveViewModal] = useState(false);
  const [isDefaultView, setIsDefaultView] = useState(false);
  const [selectedViewType, setSelectedViewType] = useState(
    (_a = props.saveViewCustomFilter) == null ? void 0 : _a.selectedOption
  );
  const [savedViewsOptions, setSavedViewsOptions] = useState(props.savedViewsOptions || []);
  const [filteredSavedViewsOptions, setFilteredSavedViewsOptions] = useState(
    props.savedViewsOptions || []
  );
  const [currentSaveViewOptions, setCurrentSaveViewOptions] = useState([]);
  const [selectedSavedView, setSelectedSavedView] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openSaveViewMenu, setOpenSaveViewMenu] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState("All");
  const [isEditView, setIsEditView] = useState(false);
  const [editedView, setEditedView] = useState(null);
  const [saveViewSearchText, setSaveViewSearchText] = useState("");
  const [openDeletePrompt, setOpenDeletePrompt] = useState(false);
  const [deleteView, setDeleteView] = useState(null);
  const [selectedView, setSelectedView] = useState(null);
  const isDraggingRef = useRef(false);
  const isInternalUpdateRef = useRef(false);
  const isColumnPinnedRef = useRef(false);
  const debouncedSetSearchText = useMemo(
    () => debounce((value) => {
      setDebouncedSearchText(value);
    }, 400),
    []
  );
  useEffect(
    () => () => {
      debouncedSetSearchText.cancel();
    },
    [debouncedSetSearchText]
  );
  const filteredFrozenColumns = useMemo(
    () => filterColumnsBySearch(frozenColumn, debouncedSearchText),
    [frozenColumn, debouncedSearchText]
  );
  const filteredScrollableColumns = useMemo(
    () => filterColumnsBySearch(scrollableColumn, debouncedSearchText),
    [scrollableColumn, debouncedSearchText]
  );
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const searchMatchIds = useMemo(() => {
    if (!debouncedSearchText) return [];
    return [
      ...collectVisibleLeafIds(filteredFrozenColumns),
      ...collectVisibleLeafIds(filteredScrollableColumns)
    ];
  }, [debouncedSearchText, filteredFrozenColumns, filteredScrollableColumns]);
  const searchMatchCount = searchMatchIds.length;
  const normalizedMatchIndex = searchMatchCount ? (activeMatchIndex % searchMatchCount + searchMatchCount) % searchMatchCount : 0;
  const activeMatchColId = searchMatchCount ? searchMatchIds[normalizedMatchIndex] : null;
  useEffect(() => {
    setActiveMatchIndex(0);
  }, [debouncedSearchText]);
  useEffect(() => {
    var _a2;
    syncColumnSearchTextToGrid((_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api, debouncedSearchText);
  }, [debouncedSearchText, ref]);
  const goToSearchMatch = useCallback((direction) => {
    setActiveMatchIndex((prev) => prev + direction);
  }, []);
  useEffect(() => {
    var _a2, _b2;
    if (!activeMatchColId) return;
    const api = (_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api;
    ensureColumnGroupsExpanded(api, activeMatchColId);
    (_b2 = api == null ? void 0 : api.ensureColumnVisible) == null ? void 0 : _b2.call(api, activeMatchColId, "middle");
    const escaped = CSS.escape ? CSS.escape(activeMatchColId) : activeMatchColId.replace(/"/g, '\\"');
    const node = document.querySelector(
      `.table-setting-column-collapse-container [data-col-id="${escaped}"]`
    );
    node == null ? void 0 : node.scrollIntoView({ block: "nearest" });
  }, [activeMatchColId, ref]);
  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!searchMatchCount) return;
      goToSearchMatch(e.shiftKey ? -1 : 1);
    },
    [goToSearchMatch, searchMatchCount]
  );
  const frozenColumnOrder = useMemo(
    () => getTopLevelColumnIds(
      filteredFrozenColumns.filter((c) => c.headerName !== "N/A" && c.isVisible !== false)
    ),
    [filteredFrozenColumns]
  );
  const scrollableColumnOrder = useMemo(
    () => getTopLevelColumnIds(
      filteredScrollableColumns.filter((c) => c.headerName !== "N/A" && c.isVisible !== false)
    ),
    [filteredScrollableColumns]
  );
  const fullFrozenOrder = useMemo(
    () => getTopLevelColumnIds(frozenColumn.filter((c) => c.headerName !== "N/A")),
    [frozenColumn]
  );
  const fullScrollableOrder = useMemo(
    () => getTopLevelColumnIds(scrollableColumn.filter((c) => c.headerName !== "N/A")),
    [scrollableColumn]
  );
  const sortableItems = useMemo(
    () => [...scrollableColumnOrder, ...frozenColumnOrder],
    [scrollableColumnOrder, frozenColumnOrder]
  );
  const allColumnsForLookup = useMemo(
    () => [...frozenColumn, ...scrollableColumn],
    [frozenColumn, scrollableColumn]
  );
  const activeDragColumn = useMemo(
    () => activeDragId ? findColumnById(allColumnsForLookup, activeDragId) : null,
    [activeDragId, allColumnsForLookup]
  );
  const mainCheckState = useMemo(
    () => getCheckState(filteredScrollableColumns),
    [filteredScrollableColumns]
  );
  const allCheckState = useMemo(
    () => getCheckState([...filteredFrozenColumns, ...filteredScrollableColumns]),
    [filteredFrozenColumns, filteredScrollableColumns]
  );
  const mainChecked = mainCheckState.checked;
  const allColumnVisibility = allCheckState.checked;
  const sensors = useSensors(
    useSensor(MouseSensor, mouseSensorOptions),
    useSensor(TouchSensor, touchSensorOptions)
  );
  useEffect(() => {
    const views = props.savedViewsOptions ?? [];
    setSavedViewsOptions(views);
    setFilteredSavedViewsOptions(views);
    setSelectedView(views.filter((view) => view.isActive));
    if (views.length === 0) {
      setOpenSaveViewMenu(false);
      setSaveViewSearchText("");
    }
    const matchingViews = views.filter(
      (view) => !selectedViewType || view.viewType === selectedViewType
    );
    setCurrentSaveViewOptions(
      views.map((view) => {
        var _a2;
        return {
          label: /* @__PURE__ */ jsxs("span", { className: "save-view-select-option-label", children: [
            /* @__PURE__ */ jsx("span", { className: "save-view-select-option-icon", children: getViewTypeIcon(view.viewType, (_a2 = props.saveViewCustomFilter) == null ? void 0 : _a2.options) }),
            view.viewName
          ] }),
          value: view.viewName,
          disabled: view == null ? void 0 : view.isDisabled,
          viewType: view.viewType,
          isDefaultView: view.isDefaultView
        };
      })
    );
    setSelectedSavedView(
      (prev) => (prev == null ? void 0 : prev.value) && matchingViews.some((view) => view.viewName === prev.value) ? prev : null
    );
  }, [props.savedViewsOptions, selectedViewType]);
  useEffect(() => {
    if (selectedSavedView == null ? void 0 : selectedSavedView.value) {
      setInputValue(selectedSavedView.value);
      setSelectedViewType(selectedSavedView.viewType);
      setIsDefaultView(!!selectedSavedView.isDefaultView);
    } else {
      setInputValue("");
      setIsDefaultView(false);
    }
  }, [selectedSavedView]);
  const isReplaceViewSelected = !!(selectedSavedView == null ? void 0 : selectedSavedView.value);
  const isInputValueEmpty = !inputValue.trim();
  const getColumnDefs = useCallback((columns) => {
    return columns.map((column) => {
      if (column.children) {
        const updatedChildren = getColumnDefs(column.children);
        const allChildrenHidden = updatedChildren.every((child) => child.hide === true);
        return {
          ...column,
          children: updatedChildren,
          hide: allChildrenHidden
        };
      }
      return column;
    });
  }, []);
  const updateColumnState = useCallback(() => {
    var _a2, _b2;
    const getColumnState = (columns) => columns.map((column) => {
      var _a3;
      return {
        colId: column.colId || column.field || column.headerName,
        headerName: column.headerName || column.field || "N/A",
        isVisible: !(column == null ? void 0 : column.hide),
        isPinned: !!column.pinned,
        pinned: column.pinned === "right" ? "right" : column.pinned ? "left" : null,
        children: ((_a3 = column == null ? void 0 : column.children) == null ? void 0 : _a3.length) > 0 ? getColumnState(column.children) : null,
        disabled: column == null ? void 0 : column.disableColumnCheckboxInSettings
      };
    });
    const columnDefs = getColumnDefs(((_b2 = (_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api) == null ? void 0 : _b2.getColumnDefs()) || props.column);
    const columnState = getColumnState(columnDefs);
    const { frozColumn, scrollColumn } = (columnState || []).reduce(
      (acc, column) => {
        if (column.isPinned) {
          acc.frozColumn.push(column);
        } else {
          acc.scrollColumn.push(column);
        }
        return acc;
      },
      { frozColumn: [], scrollColumn: [] }
    );
    setFrozenColumn(frozColumn);
    setScrollableColumn(scrollColumn);
  }, [getColumnDefs, ref, props.column]);
  const debouncedUpdateColumnState = useMemo(
    () => debounce(updateColumnState, 100),
    [updateColumnState]
  );
  useEffect(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    if (props.showMenu || isColumnPinnedRef.current) {
      isColumnPinnedRef.current = false;
      updateColumnState();
      const onColumnEvent = () => {
        if (isDraggingRef.current || isInternalUpdateRef.current) {
          return;
        }
        isColumnPinnedRef.current = true;
        debouncedUpdateColumnState();
      };
      if (ref == null ? void 0 : ref.current) {
        (_b2 = (_a2 = ref.current) == null ? void 0 : _a2.api) == null ? void 0 : _b2.addEventListener("columnPinned", onColumnEvent);
        (_d2 = (_c2 = ref.current) == null ? void 0 : _c2.api) == null ? void 0 : _d2.addEventListener("columnMoved", onColumnEvent);
        (_f2 = (_e2 = ref.current) == null ? void 0 : _e2.api) == null ? void 0 : _f2.addEventListener("columnVisible", onColumnEvent);
      }
      return () => {
        var _a3, _b3, _c3, _d3, _e3, _f3;
        if (ref == null ? void 0 : ref.current) {
          (_b3 = (_a3 = ref.current) == null ? void 0 : _a3.api) == null ? void 0 : _b3.removeEventListener("columnPinned", onColumnEvent);
          (_d3 = (_c3 = ref.current) == null ? void 0 : _c3.api) == null ? void 0 : _d3.removeEventListener("columnMoved", onColumnEvent);
          (_f3 = (_e3 = ref.current) == null ? void 0 : _e3.api) == null ? void 0 : _f3.removeEventListener("columnVisible", onColumnEvent);
        }
      };
    }
  }, [props.showMenu, updateColumnState, debouncedUpdateColumnState, ref]);
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInputValue(value);
      debouncedSetSearchText(value.toLowerCase());
    },
    [debouncedSetSearchText]
  );
  const toggleColumnVisibility = useCallback(
    (colId, section) => {
      var _a2;
      const api = (_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api;
      const setter = section === "frozen" ? setFrozenColumn : setScrollableColumn;
      setter((prev) => {
        const { columns, visibilityMap } = applyVisibilityToggle(prev, colId);
        isInternalUpdateRef.current = true;
        applyVisibilityMapToGrid(api, visibilityMap);
        queueMicrotask(() => {
          isInternalUpdateRef.current = false;
        });
        return columns;
      });
    },
    [ref]
  );
  const toggleColumnVisibilityFrozen = useCallback(
    (colId) => {
      toggleColumnVisibility(colId, "frozen");
    },
    [toggleColumnVisibility]
  );
  const toggleColumnVisibilityScroll = useCallback(
    (colId) => {
      toggleColumnVisibility(colId, "scrollable");
    },
    [toggleColumnVisibility]
  );
  const onMainCheckboxChange = useCallback(() => {
    var _a2;
    const api = (_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api;
    const nextVisible = !mainChecked;
    const filteredIds = debouncedSearchText ? new Set(getTopLevelColumnIds(filteredScrollableColumns)) : null;
    setScrollableColumn((prev) => {
      let result;
      if (filteredIds) {
        const visibilityMap = /* @__PURE__ */ new Map();
        const update = (cols) => cols.map((column) => {
          var _a3;
          const inFilter = filteredIds.has(column.colId) || ((_a3 = column.children) == null ? void 0 : _a3.some((c) => filteredIds.has(c.colId)));
          if (!inFilter) return column;
          visibilityMap.set(column.colId, nextVisible);
          return {
            ...column,
            isVisible: nextVisible,
            children: column.children ? update(column.children) : null
          };
        });
        result = { columns: update(prev), visibilityMap };
      } else {
        result = applyVisibilityToAll(prev, nextVisible);
      }
      isInternalUpdateRef.current = true;
      applyVisibilityMapToGrid(api, result.visibilityMap);
      queueMicrotask(() => {
        isInternalUpdateRef.current = false;
      });
      return result.columns;
    });
  }, [ref, mainChecked, filteredScrollableColumns, debouncedSearchText]);
  const onAllColumnCheckBoxChange = useCallback(() => {
    var _a2;
    const api = (_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api;
    const nextVisible = !allColumnVisibility;
    const frozenResult = applyVisibilityToAll(frozenColumn, nextVisible);
    const scrollResult = applyVisibilityToAll(scrollableColumn, nextVisible);
    const combinedMap = new Map([...frozenResult.visibilityMap, ...scrollResult.visibilityMap]);
    isInternalUpdateRef.current = true;
    applyVisibilityMapToGrid(api, combinedMap);
    setFrozenColumn(frozenResult.columns);
    setScrollableColumn(scrollResult.columns);
    queueMicrotask(() => {
      isInternalUpdateRef.current = false;
    });
  }, [ref, allColumnVisibility, frozenColumn, scrollableColumn]);
  const toggleScrollableCollapse = useCallback((e) => {
    e.stopPropagation();
    setCollapsedScrollable((prev) => !prev);
  }, []);
  const toggleColumnCollapse = useCallback((e) => {
    e.stopPropagation();
    setCollapsedcolumn((prev) => !prev);
  }, []);
  const toggleScrollColumnCollapse = useCallback((colId) => {
    setCollapsedScrollColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId]
    }));
  }, []);
  const toggleFrozenColumnCollapse = useCallback((colId) => {
    setCollapsedFrozenColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId]
    }));
  }, []);
  const announceReorder = useCallback((colId, direction) => {
    const el = reorderLiveRegionRef.current;
    if (!el) return;
    el.textContent = `Moved ${colId} ${direction === -1 ? "up" : "down"}`;
  }, []);
  const commitColumnReorder = useCallback(
    ({ frozenOrder, scrollableOrder, pinChanges, childReorder, announce }) => {
      var _a2;
      const api = (_a2 = ref == null ? void 0 : ref.current) == null ? void 0 : _a2.api;
      if (!api) return;
      isInternalUpdateRef.current = true;
      isDraggingRef.current = true;
      applyColumnReorderToGrid(api, {
        allColumns: allColumnsForLookup,
        frozenOrder,
        scrollableOrder,
        pinChanges,
        childReorder
      });
      updateColumnState();
      if (announce) {
        announceReorder(announce.colId, announce.direction);
      }
      queueMicrotask(() => {
        isDraggingRef.current = false;
        isInternalUpdateRef.current = false;
      });
    },
    [ref, allColumnsForLookup, updateColumnState, announceReorder]
  );
  const handleDragStart = useCallback((event) => {
    isDraggingRef.current = true;
    setActiveDragId(event.active.id);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveDragId(null);
    isDraggingRef.current = false;
  }, []);
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveDragId(null);
      if (!over || active.id === over.id) {
        isDraggingRef.current = false;
        return;
      }
      const activeId = active.id;
      const overId = over.id;
      const activeLoc = findColumnLocation(frozenColumn, activeId) || findColumnLocation(scrollableColumn, activeId);
      if (!activeLoc) {
        isDraggingRef.current = false;
        return;
      }
      if (activeLoc.parent) {
        const overLoc = findColumnLocation(frozenColumn, overId) || findColumnLocation(scrollableColumn, overId);
        if (!(overLoc == null ? void 0 : overLoc.parent) || overLoc.parent.colId !== activeLoc.parent.colId) {
          isDraggingRef.current = false;
          return;
        }
        const siblingIds = getDirectColumnIds(activeLoc.siblings);
        const oldIndex = siblingIds.indexOf(activeId);
        const newIndex = siblingIds.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1) {
          isDraggingRef.current = false;
          return;
        }
        commitColumnReorder({
          frozenOrder: fullFrozenOrder,
          scrollableOrder: fullScrollableOrder,
          childReorder: {
            parentId: activeLoc.parent.colId,
            siblingOrder: arrayMove(siblingIds, oldIndex, newIndex)
          }
        });
        return;
      }
      const isFrozenSource = fullFrozenOrder.includes(activeId);
      const isScrollableSource = fullScrollableOrder.includes(activeId);
      if (!isFrozenSource && !isScrollableSource) {
        isDraggingRef.current = false;
        return;
      }
      const isFrozenDropZone = overId === FROZEN_DROP_ZONE_ID;
      const isFrozenTarget = isFrozenDropZone || fullFrozenOrder.includes(overId) || frozenColumnOrder.includes(overId);
      const isScrollableTarget = fullScrollableOrder.includes(overId) || scrollableColumnOrder.includes(overId);
      const visibleScrollable = scrollableColumnOrder.length ? scrollableColumnOrder : fullScrollableOrder;
      let nextFrozen = [...fullFrozenOrder];
      let nextScrollable = [...fullScrollableOrder];
      let pinChanges = null;
      if (isFrozenSource && isFrozenTarget && !isFrozenDropZone) {
        const oldIndex = nextFrozen.indexOf(activeId);
        const newIndex = nextFrozen.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1) {
          isDraggingRef.current = false;
          return;
        }
        nextFrozen = arrayMove(nextFrozen, oldIndex, newIndex);
      } else if (isScrollableSource && isScrollableTarget) {
        const oldIndex = nextScrollable.indexOf(activeId);
        const newIndex = nextScrollable.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1) {
          isDraggingRef.current = false;
          return;
        }
        nextScrollable = arrayMove(nextScrollable, oldIndex, newIndex);
      } else if (isFrozenSource && isScrollableTarget) {
        nextFrozen = nextFrozen.filter((id) => id !== activeId);
        const overIndex = visibleScrollable.indexOf(overId);
        const insertAt = overIndex === -1 ? nextScrollable.length : !nextScrollable.includes(overId) ? nextScrollable.length : nextScrollable.indexOf(overId);
        nextScrollable = [...nextScrollable];
        nextScrollable.splice(insertAt, 0, activeId);
        pinChanges = [{ colId: activeId, pinned: null }];
      } else if (isScrollableSource && isFrozenTarget) {
        nextScrollable = nextScrollable.filter((id) => id !== activeId);
        const insertAt = isFrozenDropZone || !nextFrozen.includes(overId) ? nextFrozen.length : nextFrozen.indexOf(overId);
        nextFrozen = [...nextFrozen];
        nextFrozen.splice(insertAt, 0, activeId);
        pinChanges = [{ colId: activeId, pinned: "left" }];
      } else {
        isDraggingRef.current = false;
        return;
      }
      commitColumnReorder({
        frozenOrder: nextFrozen,
        scrollableOrder: nextScrollable,
        pinChanges
      });
    },
    [
      frozenColumn,
      scrollableColumn,
      fullFrozenOrder,
      fullScrollableOrder,
      frozenColumnOrder,
      scrollableColumnOrder,
      commitColumnReorder
    ]
  );
  const handleKeyboardReorder = useCallback(
    (colId, direction) => {
      const loc = findColumnLocation(frozenColumn, colId) || findColumnLocation(scrollableColumn, colId);
      if (!loc) return;
      if (loc.parent) {
        const siblingIds = getDirectColumnIds(loc.siblings);
        const oldIndex = siblingIds.indexOf(colId);
        const newIndex = oldIndex + direction;
        if (oldIndex === -1 || newIndex < 0 || newIndex >= siblingIds.length) return;
        commitColumnReorder({
          frozenOrder: fullFrozenOrder,
          scrollableOrder: fullScrollableOrder,
          childReorder: {
            parentId: loc.parent.colId,
            siblingOrder: arrayMove(siblingIds, oldIndex, newIndex)
          },
          announce: { colId, direction }
        });
      } else {
        const isFrozen = fullFrozenOrder.includes(colId);
        const isScrollable = fullScrollableOrder.includes(colId);
        if (!isFrozen && !isScrollable) return;
        const order = isFrozen ? [...fullFrozenOrder] : [...fullScrollableOrder];
        const oldIndex = order.indexOf(colId);
        const newIndex = oldIndex + direction;
        if (oldIndex === -1 || newIndex < 0 || newIndex >= order.length) return;
        const newOrder = arrayMove(order, oldIndex, newIndex);
        commitColumnReorder({
          frozenOrder: isFrozen ? newOrder : fullFrozenOrder,
          scrollableOrder: isScrollable ? newOrder : fullScrollableOrder,
          announce: { colId, direction }
        });
      }
      requestAnimationFrame(() => {
        var _a2, _b2;
        const escaped = CSS.escape ? CSS.escape(colId) : colId.replace(/"/g, '\\"');
        (_b2 = (_a2 = document.querySelector(`.table-setting-columns-settings [data-col-id="${escaped}"]`)) == null ? void 0 : _a2.focus) == null ? void 0 : _b2.call(_a2);
      });
    },
    [frozenColumn, scrollableColumn, fullFrozenOrder, fullScrollableOrder, commitColumnReorder]
  );
  const handleTogglePinSide = useCallback(
    (colId, pinned) => {
      commitColumnReorder({
        frozenOrder: fullFrozenOrder,
        scrollableOrder: fullScrollableOrder,
        pinChanges: [{ colId, pinned }]
      });
    },
    [commitColumnReorder, fullFrozenOrder, fullScrollableOrder]
  );
  const renderColumnRow = useCallback(
    (column, level, section) => {
      const isFrozen = section === "frozen";
      const collapsedMap = isFrozen ? collapsedFrozenColumns : collapsedScrollColumns;
      const isCollapsed = debouncedSearchText ? false : !!collapsedMap[column.colId];
      const hasChildren = Array.isArray(column.children) && column.children.length > 0;
      const onToggleCollapse = isFrozen ? toggleFrozenColumnCollapse : toggleScrollColumnCollapse;
      const onToggleVisibility = isFrozen ? toggleColumnVisibilityFrozen : toggleColumnVisibilityScroll;
      const checkState = hasChildren ? getCheckState(column.children) : { checked: !!column.isVisible, indeterminate: false };
      const reserveCollapseSlot = isFrozen ? hasChildren : true;
      const isActiveSearchMatch = !!debouncedSearchText && column.colId === activeMatchColId;
      const rowClassName = `${isFrozen ? "table-setting-frozen-columns-list-item" : "table-setting-scroll-inner-column"}${isActiveSearchMatch ? " table-setting-column-search-match-active" : ""}`;
      const dragIconClass = isFrozen ? "table-setting-frozen-columns-list-drag-icon" : "table-setting-scroll-columns-list-drag-icon";
      const nestedSortableIds = hasChildren ? getDirectColumnIds(
        column.children.filter((c) => c.headerName !== "N/A" && c.isVisible !== false)
      ) : [];
      const childNodes = hasChildren && !isCollapsed ? /* @__PURE__ */ jsx(SortableContext, { items: nestedSortableIds, children: /* @__PURE__ */ jsx("div", { className: "table-setting-column-children", role: "group", children: column.children.map((child) => renderColumnRow(child, level + 1, section)) }) }) : null;
      if (column.isVisible !== false) {
        return /* @__PURE__ */ jsx(
          SortableColumnItem,
          {
            checkboxChecked: checkState.checked,
            column,
            dragIconClass,
            hasChildren,
            isCollapsed,
            isIndeterminate: checkState.indeterminate,
            level,
            reserveCollapseSlot,
            rowClassName,
            searchText: debouncedSearchText,
            onKeyboardReorder: handleKeyboardReorder,
            onToggleCollapse,
            onToggleVisibility,
            onTogglePinSide: isFrozen ? handleTogglePinSide : void 0,
            children: childNodes
          },
          column.colId
        );
      }
      return /* @__PURE__ */ jsx(
        NestedColumnItem,
        {
          checkboxChecked: checkState.checked,
          column,
          dragIconClass,
          hasChildren,
          isCollapsed,
          isIndeterminate: checkState.indeterminate,
          level,
          reserveCollapseSlot,
          rowClassName,
          searchText: debouncedSearchText,
          onToggleCollapse,
          onToggleVisibility,
          onTogglePinSide: isFrozen ? handleTogglePinSide : void 0,
          children: childNodes
        },
        column.colId
      );
    },
    [
      collapsedFrozenColumns,
      collapsedScrollColumns,
      debouncedSearchText,
      activeMatchColId,
      toggleFrozenColumnCollapse,
      toggleScrollColumnCollapse,
      toggleColumnVisibilityFrozen,
      toggleColumnVisibilityScroll,
      handleKeyboardReorder,
      handleTogglePinSide
    ]
  );
  const handleSaveAndApply = () => {
    var _a2, _b2;
    if (isEditView) {
      const newView2 = {
        ...editedView,
        viewName: inputValue,
        viewType: selectedViewType,
        isDefaultView,
        isActive: false
      };
      props.handleEditSaveView(newView2, editedView);
      if (!props.isSavingViewLoading) {
        setIsEditView(false);
        setEditedView(null);
        setOpenSaveViewModal(false);
        setInputValue("");
        setSelectedViewType((_a2 = props.saveViewCustomFilter) == null ? void 0 : _a2.selectedOption);
        setIsDefaultView(false);
      }
      return;
    }
    const replaceViewName = selectedSavedView == null ? void 0 : selectedSavedView.value;
    const isReplacing = isInputValueEmpty && !!replaceViewName;
    const newView = {
      viewName: isReplacing ? replaceViewName : inputValue,
      viewType: selectedViewType,
      isDefaultView,
      isActive: true
    };
    const applyToViews = (prev) => isReplacing ? prev.map(
      (view) => view.viewName === replaceViewName && view.viewType === selectedViewType ? { ...view, ...newView } : { ...view, isActive: false }
    ) : [...prev.map((view) => ({ ...view, isActive: false })), newView];
    setSavedViewsOptions(applyToViews);
    setFilteredSavedViewsOptions(applyToViews);
    (_b2 = props.handleSaveAndApply) == null ? void 0 : _b2.call(props, newView, replaceViewName);
  };
  useEffect(() => {
    var _a2;
    if (!props.isSavingViewLoading) {
      setOpenSaveViewModal(false);
      setSelectedSavedView(null);
      setInputValue("");
      setSelectedViewType((_a2 = props.saveViewCustomFilter) == null ? void 0 : _a2.selectedOption);
      setIsDefaultView(false);
      setOpenDeletePrompt(false);
      setDeleteView(null);
      setEditedView(null);
    }
  }, [props.isSavingViewLoading]);
  const handleEditView = (view, e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditView(true);
    setOpenSaveViewModal(true);
    setInputValue(view.viewName);
    setSelectedViewType(view.viewType);
    setIsDefaultView(view.isDefaultView);
    setEditedView(view);
  };
  const handleCloseSaveViewModal = () => {
    var _a2;
    setOpenSaveViewModal(false);
    setSelectedSavedView(null);
    setInputValue("");
    setSelectedViewType((_a2 = props.saveViewCustomFilter) == null ? void 0 : _a2.selectedOption);
    setIsDefaultView(false);
    setIsEditView(false);
  };
  const handleSaveViewSearchChange = (e) => {
    setSaveViewSearchText(e.target.value);
    const filteredViews = savedViewsOptions.filter(
      (view) => view.viewName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredSavedViewsOptions(filteredViews);
  };
  const handleDeleteView = (view, e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenDeletePrompt(true);
    setDeleteView(view);
  };
  useEffect(() => {
    if (!props.isDeleteViewLoading) {
      setOpenDeletePrompt(false);
    }
  }, [props.isDeleteViewLoading]);
  useEffect(() => {
    if (selectedBadge === "All") {
      setFilteredSavedViewsOptions([...savedViewsOptions]);
    } else {
      setFilteredSavedViewsOptions(
        savedViewsOptions.filter((view) => view.viewType === selectedBadge)
      );
    }
  }, [selectedBadge, savedViewsOptions]);
  const handleSaveViewClick = (view) => {
    setFilteredSavedViewsOptions(
      (prev) => prev.map((item) => {
        if (item.viewName === view.viewName) {
          return {
            ...item,
            isActive: true
          };
        }
        return {
          ...item,
          isActive: false
        };
      })
    );
    setSelectedView(view);
  };
  const nameConflictExcludeView = isEditView ? editedView : (selectedSavedView == null ? void 0 : selectedSavedView.value) ? {
    viewName: selectedSavedView.value,
    viewType: selectedSavedView.viewType
  } : null;
  const nameConflict = !props.isSavingViewLoading && !isInputValueEmpty && !isViewNameUnique(
    inputValue,
    selectedViewType,
    isDefaultView,
    savedViewsOptions,
    nameConflictExcludeView,
    props.isViewNameUniqueAcrossTypes
  );
  const onSearchUpArrowClick = () => {
    goToSearchMatch(-1);
  };
  const onSearchDownArrowClick = () => {
    goToSearchMatch(1);
  };
  const clearSearchText = () => {
    debouncedSetSearchText.cancel();
    setSearchInputValue("");
    setDebouncedSearchText("");
  };
  const rightIconForSearchInout = searchInputValue.length > 0 ? /* @__PURE__ */ jsx("img", { alt: "Clear", src: clearIcon, onClick: clearSearchText }) : /* @__PURE__ */ jsx("img", { alt: "search", className: "table-settings-search-icon", src: searchIcon });
  return /* @__PURE__ */ jsxs("div", { className: "table-setting-columns-settings", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: reorderLiveRegionRef,
        "aria-live": "polite",
        className: "table-setting-reorder-live-region"
      }
    ),
    props.isSaveViewEnabled && /* @__PURE__ */ jsxs("div", { className: "table-setting-save-view-container", children: [
      savedViewsOptions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "save-view-icon-title", children: [
        /* @__PURE__ */ jsx("img", { alt: "save-view-icon", src: saveViewIcon }),
        /* @__PURE__ */ jsx("span", { className: "save-view-title", children: "No views saved yet" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "save-view-container-active-view", children: [
        /* @__PURE__ */ jsx(
          Badge,
          {
            color: "success",
            label: `${((_b = savedViewsOptions.find((view) => view.isActive)) == null ? void 0 : _b.viewName) || "Not Applicable"}`,
            variant: "stroke"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: openSaveViewMenu ? /* @__PURE__ */ jsx(default_1, {}) : /* @__PURE__ */ jsx(default_1$1, {}),
            size: "small",
            variant: "tertiary",
            onClick: () => {
              setOpenSaveViewMenu(!openSaveViewMenu);
              setFilteredSavedViewsOptions([...savedViewsOptions]);
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "small",
          variant: "tertiary",
          onClick: () => {
            setOpenSaveViewModal(true);
          },
          children: "Save View"
        }
      )
    ] }),
    openSaveViewMenu && /* @__PURE__ */ jsxs("div", { className: "save-view-menu", children: [
      /* @__PURE__ */ jsxs("div", { className: "save-view-menu-title", children: [
        /* @__PURE__ */ jsx("span", { children: "Saved views" }),
        /* @__PURE__ */ jsxs("div", { className: "save-view-menu-default-view", children: [
          /* @__PURE__ */ jsx("img", { alt: "default-view-icon", src: defaultViewActiveIcon }),
          /* @__PURE__ */ jsx("span", { className: "save-view-menu-default-view-text", children: "Default" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "save-view-menu-view-type", children: [
        /* @__PURE__ */ jsx(
          Badge,
          {
            color: selectedBadge === "All" ? "info" : "default",
            label: "All",
            size: "small",
            variant: "stroke",
            onClick: () => {
              setSelectedBadge("All");
              setFilteredSavedViewsOptions([...savedViewsOptions]);
            }
          }
        ),
        (_d = (_c = props.saveViewCustomFilter) == null ? void 0 : _c.options) == null ? void 0 : _d.map((option) => /* @__PURE__ */ jsx(
          Badge,
          {
            isIcon: true,
            color: selectedBadge === option.value ? "info" : "default",
            icon: getViewTypeIcon(option.value),
            label: option.label,
            size: "small",
            variant: "stroke",
            onClick: () => {
              setSelectedBadge(option.value);
              setFilteredSavedViewsOptions(
                savedViewsOptions.filter((view) => view.viewType === option.value)
              );
            }
          },
          option.value
        ))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "save-view-menu-search-container", children: /* @__PURE__ */ jsx(
        Input,
        {
          leftIcon: /* @__PURE__ */ jsx(default_1$2, {}),
          placeholder: "Search here...",
          value: saveViewSearchText,
          onChange: handleSaveViewSearchChange
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "save-view-menu-view-list-container", children: props.customRenderSaveViewContent ? props.customRenderSaveViewContent : filteredSavedViewsOptions.length > 0 && filteredSavedViewsOptions.map((view, idx) => {
        var _a2;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            "aria-label": `Saved view ${view.viewName}`,
            className: `save-view-menu-view-list-item ${view.isActive ? "active" : ""}`,
            role: "button",
            tabIndex: idx === 0 ? 0 : -1,
            onClick: () => {
              handleSaveViewClick(view);
            },
            onKeyDown: (e) => {
              var _a3, _b2;
              const current = e.currentTarget;
              switch (e.key) {
                case "Enter":
                case " ":
                  e.preventDefault();
                  handleSaveViewClick(view);
                  break;
                case "ArrowDown": {
                  e.preventDefault();
                  (_a3 = current.nextElementSibling) == null ? void 0 : _a3.focus();
                  break;
                }
                case "ArrowUp": {
                  e.preventDefault();
                  (_b2 = current.previousElementSibling) == null ? void 0 : _b2.focus();
                  break;
                }
              }
            },
            children: [
              /* @__PURE__ */ jsxs("span", { className: "save-view-menu-view-list-item-name", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "save-view-menu-view-list-item-type-icon",
                    title: view.viewType,
                    children: getViewTypeIcon(view.viewType, (_a2 = props.saveViewCustomFilter) == null ? void 0 : _a2.options)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "save-view-menu-view-list-item-name-text", children: view.viewName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "save-view-menu-view-list-item-actions", children: [
                (view == null ? void 0 : view.isEditable) && /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "save-view-edit-icon",
                    src: saveViewEditIcon,
                    onClick: (e) => {
                      handleEditView(view, e);
                    }
                  }
                ),
                (view == null ? void 0 : view.isDeletable) && /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "save-view-delete-icon",
                    src: saveViewDeleteIcon,
                    onClick: (e) => {
                      handleDeleteView(view, e);
                    }
                  }
                ),
                !(view == null ? void 0 : view.notReqDefaultView) && ((view == null ? void 0 : view.isDefaultView) ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "default-view-icon",
                    className: "default-view-active-icon",
                    src: defaultViewActiveIcon,
                    onClick: (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      props.handleSetDefaultView(view);
                    }
                  }
                ) : /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "default-view-icon",
                    src: defaultViewIcon,
                    onClick: (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      props.handleSetDefaultView(view);
                    }
                  }
                ))
              ] })
            ]
          },
          view.viewName + idx
        );
      }) }),
      /* @__PURE__ */ jsx("hr", { className: "save-view-menu-view-list-item-divider" }),
      /* @__PURE__ */ jsxs("div", { className: "save-view-menu-footer", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "medium",
            variant: "tertiary",
            onClick: () => {
              setOpenSaveViewMenu(false);
              setFilteredSavedViewsOptions([...savedViewsOptions]);
            },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            disabled: props.customRenderSaveViewContent,
            size: "medium",
            variant: "primary",
            onClick: () => {
              var _a2;
              (_a2 = props.handleSavedViewClick) == null ? void 0 : _a2.call(props, selectedView);
              updateColumnState();
              setOpenSaveViewMenu(false);
            },
            children: "Apply"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        className: "save-view-modal",
        height: "542px",
        open: openSaveViewModal,
        primaryButtonLabel: props.isSavingViewLoading ? "Saving..." : "Save",
        primaryButtonProps: {
          disabled: (isInputValueEmpty || props.maxSavedViews != null && savedViewsOptions.length >= props.maxSavedViews) && !isReplaceViewSelected || nameConflict || props.isSavingViewLoading,
          loading: props.isSavingViewLoading,
          iconPlacement: "right"
        },
        secondaryButtonLabel: "Cancel",
        title: isEditView ? "Edit view" : "Save view",
        width: "422px",
        onClose: handleCloseSaveViewModal,
        onPrimaryButtonClick: handleSaveAndApply,
        onSecondaryButtonClick: handleCloseSaveViewModal,
        children: /* @__PURE__ */ jsxs("div", { className: "save-view-modal-children", children: [
          props.maxSavedViews != null && /* @__PURE__ */ jsx("div", { className: "save-view-modal-children-header", children: /* @__PURE__ */ jsx("span", { className: "save-view-modal-children-header-text", children: `${props.maxSavedViews - savedViewsOptions.length}/${props.maxSavedViews} views remaining` }) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `save-view-modal-children-body${props.maxSavedViews == null ? " save-view-modal-children-body-no-header" : ""}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "save-view-modal-children-body-input", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    helperText: nameConflict ? "A view with this name already exists" : "",
                    isDisabled: isReplaceViewSelected,
                    isError: nameConflict,
                    isHelperText: nameConflict,
                    label: "New view name",
                    placeholder: "Enter here",
                    readOnly: isReplaceViewSelected,
                    value: inputValue,
                    onChange: (e) => {
                      setInputValue(e.target.value);
                      setSelectedSavedView(null);
                    }
                  }
                ) }),
                !isEditView && /* @__PURE__ */ jsxs("div", { className: "save-view-modal-children-body-radio-group", children: [
                  /* @__PURE__ */ jsx("span", { className: "save-view-modal-children-body-radio-group-text", children: "View type" }),
                  /* @__PURE__ */ jsx(
                    RadioButtonGroup,
                    {
                      isDisabled: isReplaceViewSelected,
                      options: (_f = (_e = props.saveViewCustomFilter) == null ? void 0 : _e.options) == null ? void 0 : _f.filter(
                        (option) => !(option == null ? void 0 : option.notReqInSaveView)
                      ),
                      orientation: "row",
                      selectedOption: selectedViewType,
                      onChange: (event) => {
                        setSelectedViewType(event.target.value);
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "save-view-modal-children-body-checkbox", children: /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: isDefaultView,
                    disabled: isReplaceViewSelected || isEditView,
                    label: "Make it default view",
                    onChange: () => {
                      setIsDefaultView(!isDefaultView);
                    }
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "save-view-modal-children-body-replace-view", children: /* @__PURE__ */ jsx("span", { children: "Or replace with saved view" }) }),
                /* @__PURE__ */ jsx("div", { className: "save-view-modal-children-body-replace-view-select", children: /* @__PURE__ */ jsx(
                  Select,
                  {
                    isClearable: true,
                    withPortal: true,
                    currentOptions: currentSaveViewOptions,
                    initialOptions: currentSaveViewOptions,
                    isDisabled: savedViewsOptions.length === 0 || !isInputValueEmpty && !isReplaceViewSelected || isEditView,
                    isOpen,
                    label: "Replace with",
                    minWidth: "100%",
                    selectedOptions: selectedSavedView,
                    setCurrentOptions: setCurrentSaveViewOptions,
                    setIsOpen,
                    setSelectedOptions: setSelectedSavedView
                  }
                ) })
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Prompt,
      {
        handleClose: (e) => {
          e.stopPropagation();
          setOpenDeletePrompt(false);
        },
        isOpen: openDeletePrompt,
        primaryButtonLabel: "Yes,Delete",
        primaryButtonProps: {
          loading: props.isDeleteViewLoading,
          iconPlacement: "right"
        },
        secondaryButtonLabel: "Cancel",
        title: "Delete, Are you sure?",
        variant: "error",
        onPrimaryButtonClick: (e) => {
          var _a2;
          e.stopPropagation();
          (_a2 = props.handleDeleteViewClick) == null ? void 0 : _a2.call(props, deleteView);
        },
        onSecondaryButtonClick: (e) => {
          e.stopPropagation();
          setOpenDeletePrompt(false);
        },
        children: props.deleteViewPromptText
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "table-setting-column-search-container", children: [
      /* @__PURE__ */ jsx("span", { className: "table-setting-column-collapse-slot", children: /* @__PURE__ */ jsx(
        IconButton,
        {
          "aria-label": collapsedColumn ? "Expand columns" : "Collapse columns",
          className: "table-setting-column-collapse-btn",
          onClick: toggleColumnCollapse,
          children: collapsedColumn ? /* @__PURE__ */ jsx(default_1$3, {}) : /* @__PURE__ */ jsx(default_1, {})
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "table-setting-column-search-controls", children: [
        /* @__PURE__ */ jsxs("div", { className: "table-settings-lhs", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              "aria-label": "Toggle all columns",
              checked: allCheckState.checked,
              variant: allCheckState.indeterminate ? "dashed" : "default",
              onChange: onAllColumnCheckBoxChange
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              "aria-label": "Search columns",
              className: "table-settings-input",
              placeholder: "Search",
              rightIcon: rightIconForSearchInout,
              value: searchInputValue,
              onChange: handleSearchChange,
              onKeyDown: handleSearchKeyDown
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "table-setting-column-search-nav", role: "status", children: [
          /* @__PURE__ */ jsx("span", { className: "table-setting-column-search-nav-count", children: searchMatchCount ? `${normalizedMatchIndex + 1}/${searchMatchCount}` : "0/0" }),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              "aria-label": "Previous match",
              className: "table-setting-column-search-nav-btn",
              disabled: !searchMatchCount,
              onClick: onSearchUpArrowClick,
              children: /* @__PURE__ */ jsx(default_1, { fontSize: "small" })
            }
          ),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              "aria-label": "Next match",
              className: "table-setting-column-search-nav-btn",
              disabled: !searchMatchCount,
              onClick: onSearchDownArrowClick,
              children: /* @__PURE__ */ jsx(default_1$1, { fontSize: "small" })
            }
          )
        ] })
      ] })
    ] }),
    !collapsedColumn && /* @__PURE__ */ jsx(
      "div",
      {
        className: `table-setting-column-collapse-container ${props.isSaveViewEnabled ? "save-view-enabled" : ""}`,
        children: /* @__PURE__ */ jsxs(
          DndContext,
          {
            collisionDetection: closestCenter,
            sensors,
            onDragCancel: handleDragCancel,
            onDragEnd: handleDragEnd,
            onDragStart: handleDragStart,
            children: [
              /* @__PURE__ */ jsxs(SortableContext, { items: sortableItems, children: [
                /* @__PURE__ */ jsxs("div", { className: "table-setting-collapse-columns-container", children: [
                  /* @__PURE__ */ jsx("h3", { children: "Frozen columns" }),
                  hasFrozenColumns(frozenColumn) ? /* @__PURE__ */ jsx(
                    "div",
                    {
                      "aria-label": "Frozen columns",
                      className: "table-setting-frozen-columns-list",
                      role: "tree",
                      children: filteredFrozenColumns.map(
                        (column) => column.headerName !== "N/A" && renderColumnRow(column, 0, "frozen")
                      )
                    }
                  ) : /* @__PURE__ */ jsx(FrozenColumnsDropZone, {})
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "table-setting-scroll-columns-container", children: [
                  /* @__PURE__ */ jsx("h3", { children: "Scrollable Columns" }),
                  /* @__PURE__ */ jsxs("div", { className: "table-setting-scroll-main-column-list", children: [
                    /* @__PURE__ */ jsxs("div", { className: "table-setting-scroll-main-column", children: [
                      /* @__PURE__ */ jsxs("div", { className: "table-setting-column-leading", children: [
                        /* @__PURE__ */ jsx("span", { className: "table-setting-column-collapse-slot", children: /* @__PURE__ */ jsx(
                          IconButton,
                          {
                            "aria-label": collapsedScrollable ? "Expand scrollable columns" : "Collapse scrollable columns",
                            className: "table-setting-column-collapse-btn",
                            onClick: toggleScrollableCollapse,
                            children: collapsedScrollable ? /* @__PURE__ */ jsx(default_1$3, {}) : /* @__PURE__ */ jsx(default_1, {})
                          }
                        ) }),
                        /* @__PURE__ */ jsx(
                          Checkbox,
                          {
                            "aria-label": "Toggle main columns",
                            checked: mainCheckState.checked,
                            variant: mainCheckState.indeterminate ? "dashed" : "default",
                            onChange: onMainCheckboxChange
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "table-setting-column-name", children: "Main Column" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        "aria-label": "Scrollable columns",
                        className: "table-setting-scroll-inner-column-list",
                        role: "tree",
                        children: !collapsedScrollable && filteredScrollableColumns.map(
                          (column) => column.headerName !== "N/A" && renderColumnRow(column, 0, "scrollable")
                        )
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(DragOverlay, { adjustScale: false, dropAnimation: null, children: activeDragColumn ? /* @__PURE__ */ jsxs("div", { className: "table-setting-column-drag-overlay", role: "presentation", children: [
                /* @__PURE__ */ jsx(DragIndicator, { className: "table-setting-column-drag-overlay-icon" }),
                /* @__PURE__ */ jsx("span", { className: "table-setting-column-drag-overlay-label", children: capitalizeHeader(activeDragColumn.headerName) })
              ] }) : null })
            ]
          }
        )
      }
    )
  ] });
});
const updateFontSizeOnToolPanel = (fontSizeType) => {
  let fontSize;
  switch (fontSizeType) {
    case "small":
      fontSize = "12px";
      break;
    case "medium":
      fontSize = "14px";
      break;
    case "large":
      fontSize = "16px";
      break;
    default:
      fontSize = "14px";
  }
  return fontSize;
};
export {
  Columns,
  freezeColumn,
  getMainMenuItems,
  getTableMeta,
  onColMenuAutoAdjustClick,
  onColMenuFreezeClick,
  sortFunc,
  updateFontSizeOnToolPanel
};
