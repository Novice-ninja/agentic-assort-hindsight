/**
 * Helper utilities for column filtering, view management, and string operations
 */
export interface FilterOption {
    label: string;
    value: string;
}
export interface ColumnOption extends FilterOption {
    type: 'text' | 'number' | 'date';
}
export interface ColumnDefinition {
    field?: string;
    colId?: string;
    headerName?: string;
    filter?: string;
    children?: ColumnDefinition[];
    advanceSearchEnabled?: boolean;
    isSearchable?: boolean;
    inputProps?: Record<string, unknown>;
    columnFieldsInAdvanceSearch?: string[];
    /** Maps advance-search field names to AG Grid filterModel keys. Optional. */
    columnFieldsFilterMap?: Record<string, string>;
    toShowDuplicateColumnInAdvanceSearch?: boolean;
    extra_params?: {
        is_advance_search?: boolean;
        is_search?: boolean;
    }[];
}
export interface FormFilter {
    column?: {
        value: string;
    };
}
export interface FormValues {
    filters: FormFilter[];
}
export interface FilterField {
    fieldId: string;
}
export interface SavedView {
    viewName?: string;
    viewType?: string;
    isDefaultView?: boolean;
}
export declare const TEXT_FILTER_OPTIONS: readonly FilterOption[];
export declare const NON_TEXT_FILTER_OPTIONS: readonly FilterOption[];
/**
 * Default date filter operators supported by AG Grid Date Filter
 * These operators work with agDateColumnFilter
 *
 * Available operators:
 * - equals: Exact date match
 * - notEqual: Not equal to date
 * - lessThan: Before the specified date (exclusive)
 * - lessThanOrEqual: On or before the specified date (inclusive)
 * - greaterThan: After the specified date (exclusive)
 * - greaterThanOrEqual: On or after the specified date (inclusive)
 * - inRange: Between two dates (handled separately for date range picker)
 * - blank: Date is null/empty (not commonly used in UI)
 * - notBlank: Date is not null/empty (not commonly used in UI)
 */
export declare const DATE_FILTER_OPTIONS: readonly FilterOption[];
type TranslateFn = (key: string) => string;
export declare const getTextFilterOptions: (t?: TranslateFn) => FilterOption[];
export declare const getNonTextFilterOptions: (t?: TranslateFn) => FilterOption[];
export declare const getDateFilterOptions: (t?: TranslateFn) => FilterOption[];
interface EnrichedColumnDefinition extends ColumnDefinition {
    hierarchicalLabel: string;
    type: 'text' | 'number' | 'date';
}
/**
 * Convert column definitions to options for select/dropdown components
 */
export declare const convertToOptions: (colDefs: ColumnDefinition[]) => ColumnOption[];
/**
 * Get all columns that are allowed for advanced search
 */
export declare const getAllowedColumns: (colDefs: ColumnDefinition[]) => EnrichedColumnDefinition[];
/**
 * Check if a list of columns has duplicates
 */
export declare function hasDuplicateColumns(listOfColumns: string[]): boolean;
/**
 * Check if the selected column is a duplicate in the form
 */
export declare function isColumnSelectionDuplicate(formValues: FormValues, currentValue: string, pendingDeletions: string[], fields: FilterField[]): boolean;
/**
 * Check if a view name is unique among saved views.
 * When `isViewNameUniqueAcrossTypes` is true, names must be unique across all
 * view types; otherwise uniqueness is only within the selected type.
 */
export declare function isViewNameUnique(inputValue: string, selectedViewType: string | null | undefined, _isDefaultView: boolean | null | undefined, savedViewsOptions: SavedView[], excludeView?: Pick<SavedView, 'viewName' | 'viewType'> | null, isViewNameUniqueAcrossTypes?: boolean): boolean;
/**
 * Convert a string to camelCase: lowercase first word, capitalize subsequent words,
 * strip non-alphanumeric characters.
 */
export declare const toCamelCase: (str: string) => string;
/**
 * Convert a string to sentence case: first character uppercase, the rest lowercase.
 * Safely handles null/undefined and trims whitespace.
 */
export declare function toSentenceCase(value: string | null | undefined): string;
export {};
//# sourceMappingURL=helper.d.ts.map