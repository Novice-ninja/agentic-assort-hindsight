/** Default column count for Table Settings scale stories (virtual list kicks in above 300). */
export declare const TABLE_SETTINGS_STORY_COLUMN_COUNT = 500;
export declare const TABLE_SETTINGS_STORY_ROW_COUNT = 20;
export interface ManyColumnsStoryOptions {
    columnCount?: number;
    rowCount?: number;
    pinFirst?: number;
}
/**
 * Flat column defs + row data for TableV36 column-settings stress tests.
 */
export declare function buildManyColumnsStoryData(options?: ManyColumnsStoryOptions): {
    columnDefs: {
        pinned?: string | undefined;
        field: string;
        headerName: string;
        filter: string;
        sortable: boolean;
    }[];
    rowData: Record<string, string | number>[];
    columnCount: number;
    rowCount: number;
};
export declare const manyColumnsStoryArgs: (options?: ManyColumnsStoryOptions) => {
    tableHeader: string;
    cardContainer: boolean;
    columnDefs: {
        pinned?: string | undefined;
        field: string;
        headerName: string;
        filter: string;
        sortable: boolean;
    }[];
    rowData: Record<string, string | number>[];
    defaultColDef: {
        sortable: boolean;
        resizable: boolean;
    };
    domLayout: string;
    height: string;
    pagination: boolean;
    suppressHorizontalScroll: boolean;
};
//# sourceMappingURL=tableStoryManyColumns.d.ts.map