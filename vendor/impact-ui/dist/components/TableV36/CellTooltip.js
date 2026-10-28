import { jsx } from "react/jsx-runtime";
const CellTooltip = ({ value, valueFormatted }) => {
  const raw = valueFormatted ?? value;
  if (raw === null || raw === void 0 || raw === "") {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "impact-ag-tooltip", children: typeof raw === "object" ? JSON.stringify(raw) : String(raw) });
};
export {
  CellTooltip as default
};
