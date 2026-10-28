import { palette } from '@design-system';
import { getFlooringMixRows, type FlooringFilters } from '@mocks/flooringDemo';

export interface SalesMixRow {
  name: string; totalSkus: number; share: number; vsLy: number;
  productivity: number; color: string;
}
const COLORS=[palette.iris[200],palette.sky[200],palette.emerald[200],palette.amber[200],palette.coral[200],palette.slate[200]];
/** Summary and donut project the same filtered canonical flooring facts. */
export function makeSalesMixRows(lens='brand',filters:FlooringFilters={}):SalesMixRow[] {
  return getFlooringMixRows(lens,filters).map((r,i)=>({name:r.name,totalSkus:r.sellingSkus,share:r.salesShare,vsLy:r.growth,productivity:r.productivity,color:COLORS[i%COLORS.length]}));
}
export const SALES_MIX_ROWS=makeSalesMixRows();
export const VS_LY_THRESHOLD=0;
export const VS_LY_BELOW_COLOR='#ab3939';
export const VS_LY_ABOVE_COLOR='#26734b';
export const formatMultiple=(value:number)=>`${value.toFixed(2)}x`;
export const formatPercent=(value:number)=>`${value.toFixed(1)}%`;
