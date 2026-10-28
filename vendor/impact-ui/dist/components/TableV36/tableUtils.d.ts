import { GridApi } from 'ag-grid-community';

export interface ColumnTreeNode {
    colId?: string;
    headerName?: string;
    isVisible?: boolean;
    children?: ColumnTreeNode[] | null;
}
export declare const collectVisibleLeafIds: (columns: ColumnTreeNode[]) => string[];
export declare const ensureColumnGroupsExpanded: (api: GridApi | null | undefined, colId: string | null | undefined) => void;
export interface SearchHighlightSegment {
    text: string;
    isMatch: boolean;
}
export declare const getSearchHighlightSegments: (text: string | null | undefined, searchText: string | null | undefined) => SearchHighlightSegment[];
export declare const syncColumnSearchTextToGrid: (api: GridApi | null | undefined, searchText: string) => void;
//# sourceMappingURL=tableUtils.d.ts.map