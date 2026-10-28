import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import default_1 from "../../node_modules/@mui/icons-material/DragIndicator.js";
import { getAssetUrl } from "../../utils/assetBase.js";
import { Badge } from "../Badge/index.js";
import { Button } from "../Button/index.js";
import { Modal } from "../Modal/index.js";
import { Select } from "../Select/index.js";
import { Tooltip } from "../Tooltip/index.js";
const SaveViewDeleteIcon = (props) => /* @__PURE__ */ jsx("img", { alt: "", src: getAssetUrl("icons/saveViewDeleteIcon.svg"), ...props });
const AddOutlinedIcon = (props) => /* @__PURE__ */ jsx("img", { alt: "", src: getAssetUrl("icons/plus.svg"), ...props });
const SORT_ORDER_OPTIONS_TEXT = [
  { label: "Ascending (A To Z)", value: "asc" },
  { label: "Descending (Z To A)", value: "desc" }
];
const SORT_ORDER_OPTIONS_NUMBER = [
  { label: "Smallest to largest", value: "asc" },
  { label: "Largest to smallest", value: "desc" }
];
function getSortOrderOptionsByFilter(filterType) {
  if (filterType === "agNumberColumnFilter") {
    return SORT_ORDER_OPTIONS_NUMBER;
  }
  if (filterType === "agTextColumnFilter") {
    return SORT_ORDER_OPTIONS_TEXT;
  }
  return SORT_ORDER_OPTIONS_TEXT;
}
let nextId = 1;
const generateId = () => `sort-row-${nextId++}`;
function buildColumnOptions(colDefs) {
  const options = [];
  const collect = (cols) => {
    if (!Array.isArray(cols)) return;
    cols.forEach((col) => {
      if (col.children) {
        collect(col.children);
      } else if (col.field && col.sortable) {
        options.push({
          label: col.headerName || col.field,
          value: col.field,
          filter: col.filter
        });
      }
    });
  };
  collect(colDefs);
  return options;
}
function makeEmptyRow() {
  return { id: generateId(), colId: null, order: "null" };
}
function SortRow({
  row,
  index,
  availableColumnOptions,
  selectedColumnOption,
  selectedOrderOption,
  selectedColumnFilter,
  onColumnChange,
  onOrderChange,
  onDelete,
  dragHandlers,
  rowsCount
}) {
  const [columnIsOpen, setColumnIsOpen] = useState(false);
  const [orderIsOpen, setOrderIsOpen] = useState(false);
  const [columnCurrentOptions, setColumnCurrentOptions] = useState(availableColumnOptions);
  const [orderCurrentOptions, setOrderCurrentOptions] = useState(
    getSortOrderOptionsByFilter(selectedColumnFilter)
  );
  useEffect(() => {
    setColumnCurrentOptions(availableColumnOptions);
  }, [availableColumnOptions]);
  useEffect(() => {
    setOrderCurrentOptions(getSortOrderOptionsByFilter(selectedColumnFilter));
  }, [selectedColumnFilter]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      draggable: true,
      className: "advance-sort-row",
      onDragEnd: dragHandlers.onDragEnd,
      onDragEnter: () => dragHandlers.onDragEnter(index),
      onDragOver: (e) => {
        e.preventDefault();
      },
      onDragStart: () => dragHandlers.onDragStart(index),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "advance-sort-row-content", children: [
          /* @__PURE__ */ jsx(default_1, { className: "advance-sort-drag-indicator" }),
          /* @__PURE__ */ jsxs("div", { className: "advance-sort-field-group", children: [
            /* @__PURE__ */ jsx(
              Select,
              {
                isWithSearch: true,
                withPortal: true,
                currentOptions: columnCurrentOptions,
                handleChange: (val) => onColumnChange(index, val),
                initialOptions: availableColumnOptions,
                isOpen: columnIsOpen,
                label: "Column",
                minWidth: "210px",
                placeholder: "Select column",
                selectedOptions: selectedColumnOption,
                setCurrentOptions: setColumnCurrentOptions,
                setIsOpen: setColumnIsOpen,
                setSelectedOptions: () => {
                }
              }
            ),
            /* @__PURE__ */ jsx(
              Select,
              {
                withPortal: true,
                currentOptions: orderCurrentOptions,
                handleChange: (val) => onOrderChange(index, val),
                initialOptions: getSortOrderOptionsByFilter(selectedColumnFilter),
                isOpen: orderIsOpen,
                label: "Sorting Order",
                minWidth: "210px",
                placeholder: "Select sorting order",
                selectedOptions: selectedOrderOption,
                setCurrentOptions: setOrderCurrentOptions,
                setIsOpen: setOrderIsOpen,
                setSelectedOptions: () => {
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "advance-sort-priority-group", children: [
          /* @__PURE__ */ jsx(
            Badge,
            {
              color: "default",
              label: `Priority ${index + 1}`,
              size: "default",
              sx: {
                background: "#F1F3FE !important",
                "& .MuiChip-label": {
                  color: "#4259EE !important"
                }
              },
              variant: "filled"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "divider-line" }),
          /* @__PURE__ */ jsx(Tooltip, { title: "Delete", variant: "tertiary", children: /* @__PURE__ */ jsx("span", { style: { display: "inline-block" }, children: /* @__PURE__ */ jsx(
            Button,
            {
              disabled: rowsCount === 1,
              icon: /* @__PURE__ */ jsx(SaveViewDeleteIcon, {}),
              size: "medium",
              type: "destructive",
              variant: "secondary",
              onClick: () => onDelete(index)
            }
          ) }) })
        ] })
      ]
    }
  );
}
function AdvanceSortModal({ open, onClose, colDefs = [], sortState = [], onApply }) {
  const [rows, setRows] = useState([makeEmptyRow()]);
  const dragIndexRef = useRef(null);
  const dragOverIndexRef = useRef(null);
  const columnOptions = buildColumnOptions(colDefs);
  useEffect(() => {
    if (!open) return;
    if (sortState && sortState.length > 0) {
      setRows(
        sortState.map((s) => ({
          id: generateId(),
          colId: s.colId,
          order: s.sort || "asc"
        }))
      );
    } else {
      setRows([makeEmptyRow()]);
    }
  }, [open]);
  const handleColumnChange = (index, option) => {
    setRows(
      (prev) => prev.map((row, i) => i === index ? { ...row, colId: option ? option.value : null } : row)
    );
  };
  const handleOrderChange = (index, option) => {
    setRows(
      (prev) => prev.map((row, i) => i === index ? { ...row, order: option ? option.value : "asc" } : row)
    );
  };
  const handleDeleteRow = (index) => {
    setRows((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [makeEmptyRow()] : next;
    });
  };
  const handleAddLevel = () => {
    setRows((prev) => [...prev, makeEmptyRow()]);
  };
  const handleClearValues = () => {
    setRows((prev) => prev.map((row, i) => ({ ...row, order: null })));
  };
  const handleClearAll = () => {
    setRows([makeEmptyRow()]);
  };
  const handleApply = () => {
    const validRows = rows.filter((r) => r.colId);
    onApply(validRows);
  };
  const onDragStart = (index) => {
    dragIndexRef.current = index;
  };
  const onDragEnter = (index) => {
    dragOverIndexRef.current = index;
  };
  const onDragEnd = () => {
    const from = dragIndexRef.current;
    const to = dragOverIndexRef.current;
    if (from === null || to === null || from === to) return;
    setRows((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
    dragIndexRef.current = null;
    dragOverIndexRef.current = null;
  };
  const getSelectedColumnOption = (colId) => columnOptions.find((o) => o.value === colId) || null;
  const getSelectedOrderOption = (order, colId) => {
    var _a;
    const filterType = (_a = getSelectedColumnOption(colId)) == null ? void 0 : _a.filter;
    return getSortOrderOptionsByFilter(filterType).find((o) => o.value === order) || null;
  };
  const usedColIds = rows.map((r) => r.colId).filter(Boolean);
  const getAvailableColumnOptionsForRow = (rowColId) => columnOptions.filter((opt) => opt.value === rowColId || !usedColIds.includes(opt.value));
  return /* @__PURE__ */ jsx(
    Modal,
    {
      className: "advance-sort-modal",
      open,
      primaryButtonLabel: "Apply",
      secondaryButtonLabel: "Cancel",
      size: "medium",
      title: "Advance Sort",
      onClose,
      onPrimaryButtonClick: handleApply,
      onSecondaryButtonClick: onClose,
      children: /* @__PURE__ */ jsxs("div", { className: "advance-sort-modal-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "advance-sort-section-header", children: [
          /* @__PURE__ */ jsx("span", { className: "advance-sort-section-title", children: "Column sort" }),
          /* @__PURE__ */ jsx(Button, { variant: "url", onClick: handleClearAll, children: "Clear All" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "advance-sort-rows", children: rows.map((row, index) => {
          var _a;
          return /* @__PURE__ */ jsx(
            SortRow,
            {
              availableColumnOptions: getAvailableColumnOptionsForRow(row.colId),
              dragHandlers: { onDragStart, onDragEnter, onDragEnd },
              index,
              row,
              rowsCount: rows.length,
              selectedColumnFilter: (_a = getSelectedColumnOption(row.colId)) == null ? void 0 : _a.filter,
              selectedColumnOption: getSelectedColumnOption(row.colId),
              selectedOrderOption: getSelectedOrderOption(row.order, row.colId),
              onColumnChange: handleColumnChange,
              onDelete: handleDeleteRow,
              onOrderChange: handleOrderChange
            },
            row.id
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "advance-sort-footer-actions", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: handleClearValues, children: "Clear Values" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "advance-sort-add-level-button",
              disabled: columnOptions.length === rows.length,
              icon: /* @__PURE__ */ jsx(AddOutlinedIcon, {}),
              variant: "tertiary",
              onClick: handleAddLevel,
              children: "Add Level"
            }
          )
        ] })
      ] })
    }
  );
}
export {
  AdvanceSortModal as default
};
