import { CustomTooltipProps } from 'ag-grid-react';

/**
 * Impact-styled replacement for AG Grid's built-in tooltip bubble.
 *
 * AG Grid owns the trigger, positioning and show/hide of its tooltip and renders this component
 * inside an already-placed popup, so the MUI-based `Tooltip` cannot be reused here — it needs its
 * own hover anchor. This renders the bubble body only; `.impact-ag-tooltip` in `Table.styles.scss`
 * mirrors the `tertiary` Tooltip variant. There is no arrow because AG Grid does not expose which
 * side of the cell it placed the popup on.
 */
declare const CellTooltip: ({ value, valueFormatted }: CustomTooltipProps) => import("react/jsx-runtime").JSX.Element | null;
export default CellTooltip;
//# sourceMappingURL=CellTooltip.d.ts.map