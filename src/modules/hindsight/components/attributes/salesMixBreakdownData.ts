import { getFlooringMixRows, type FlooringMixRow } from '@mocks/flooringDemo';
export type SalesMixAction='Expand'|'Hold'|'Rationalize';
export interface SalesMixBreakdownRow extends FlooringMixRow {}
/** Compatibility default; active view passes its lens and applied scope to this same selector. */
export const SALES_MIX_BREAKDOWN_ROWS:SalesMixBreakdownRow[]=getFlooringMixRows('brand');
