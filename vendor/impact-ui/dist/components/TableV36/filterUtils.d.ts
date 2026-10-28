export declare const getOperatorListForColumn: (columnDef: any) => any;
export declare const getDefaultOperationForColumn: (columnDef: any, filter?: null) => any;
/**
 * Removes special characters from numeric strings
 * Supports: currency symbols ($, €, £, ¥, ₹), commas, spaces, percentages
 * @param {string} value - The value to clean
 * @returns {string} - Cleaned value
 */
export declare const cleanNumericValue: (value: any) => any;
/**
 * Builds a `colDef.filterValueGetter` that filters on the number the cell displays rather
 * than the one it stores, for columns whose valueFormatter rounds.
 *
 * A rate held as 27.865460358560085 and rendered as "27.9%" cannot otherwise be matched
 * with Equals: the user searches for what is on screen, and no one can type digits they
 * cannot see. Rounding the compared value to the displayed precision makes Equals and
 * Not equal mean what they appear to mean, and leaves the filter model itself untouched.
 * @param {number} decimals - Decimal places the column's valueFormatter shows
 * @returns {Function} - A filterValueGetter for the column definition
 */
export declare const roundedFilterValueGetter: (decimals?: number) => (params: any) => any;
/**
 * Parses a filter value based on the column type and definition
 * @param {*} value - The raw filter value
 * @param {object} columnDef - The column definition from AG Grid
 * @returns {object} - { parsedValue, filterType }
 */
export declare const parseFilterValue: (value: any, columnDef: any) => {
    parsedValue: any;
    filterType: string;
};
/**
 * Determines if a column value is a string or number by checking first row data
 * Used to decide between "equals" (numbers) vs "contains" (strings) filter type
 * @param {object} api - AG Grid API
 * @param {string} columnId - Column ID to check
 * @returns {boolean} - true if column contains string values
 */
export declare const isColumnDataString: (api: any, columnId: any) => boolean;
/**
 * Builds a filter model entry for AG Grid
 * Supports all AG Grid filter operators including:
 * - Text: contains, notContains, equals, notEqual, startsWith, endsWith, blank, notBlank
 * - Number: equals, notEqual, lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual, blank, notBlank
 * - Date: equals, notEqual, lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual, inRange, blank, notBlank
 *
 * @param {*} parsedValue - The parsed filter value
 * @param {string} filterType - The filter type (equals, contains, etc.)
 * @param {object} columnDef - The column definition
 * @param {string} operationType - Optional operation type from advance search
 * @returns {object|undefined} - Filter model entry or undefined if invalid
 */
export declare const buildFilterModelEntry: (parsedValue: any, filterType: any, columnDef: any, operationType?: null) => any;
/**
 * Resolves an advance-search option value from a filterModel key when
 * `columnFieldsFilterMap` maps advance field → filterModel key.
 * Returns `filterKey` unchanged when no reverse mapping exists.
 */
export declare const resolveAdvanceSearchFieldFromFilterKey: (filterKey: any, colDefs: any) => any;
/**
 * Recursively finds a column definition by field or colId
 * @param {array} colDefs - Array of column definitions
 * @param {string} field - Field or colId to find
 * @returns {object|null} - Column definition or null
 */
export declare const findColumnDef: (colDefs: any, field: any) => any;
/**
 * Applies inline search filter for a single column
 * Handles special logic for number columns with formatted vs raw data
 * @param {*} value - Search value
 * @param {object} columnDef - Column definition
 * @param {object} api - AG Grid API
 * @param {string} columnId - Column ID
 * @returns {object} - { parsedValue, filterType }
 */
export declare const parseInlineSearchValue: (value: any, columnDef: any, api: any, columnId: any) => {
    parsedValue: any;
    filterType: string;
};
/**
 * Validates if a parsed value is valid for filtering
 * @param {*} parsedValue - The parsed value to validate
 * @returns {boolean} - true if valid
 */
export declare const isValidFilterValue: (parsedValue: any) => boolean;
/**
 * Gets the display label for a column (handles nested/hierarchical columns)
 * @param {string} columnId - The column ID
 * @param {object} columnDef - The column definition
 * @param {array} colDefs - All column definitions
 * @returns {string} - Display label for the column
 */
export declare const getColumnLabel: (columnId: any, columnDef: any, colDefs: any) => any;
/**
 * Validates if a filter in the filter model has a valid value
 * @param {object} filter - Filter object from filter model
 * @returns {boolean} - true if filter has valid value
 */
export declare const hasValidFilterValue: (filter: any) => boolean;
/**
 * Converts AG Grid filter model entry to advance search modal format
 * @param {string} columnId - Column ID
 * @param {object} filter - Filter from filter model
 * @param {object} columnDef - Column definition
 * @param {array} colDefs - All column definitions
 * @returns {object} - Filter in modal format
 */
export declare const convertFilterToModalFormat: (columnId: any, filter: any, columnDef: any, colDefs: any) => {
    column: {
        label: any;
        value: any;
        type: any;
    };
    operation: {
        label: any;
        value: any;
    };
    value: any;
};
/**
 * Updates existing filters or adds new filter
 * @param {array} existingFilters - Current filters in modal format
 * @param {string} columnId - Column ID being updated
 * @param {*} value - New filter value
 * @param {object} columnDef - Column definition
 * @param {array} colDefs - All column definitions
 * @returns {array} - Updated filters array
 */
export declare const updateOrAddFilter: (existingFilters: any, columnId: any, value: any, columnDef: any, colDefs: any) => any;
/**
 * Syncs AG Grid filter model with advance search modal state
 * Clean, step-by-step approach for better maintainability
 *
 * @param {object} api - AG Grid API
 * @param {string} currentColumnId - Current column being filtered
 * @param {*} inputValue - The filter value
 * @param {object} columnDef - Column definition
 * @param {array} colDefs - All column definitions
 * @param {function} setValue - Form setValue function
 * @param {function} setInitialFilters - Set initial filters function
 * @param {function} getOptionFromDropdownValue - Function to convert dropdown values
 */
export declare const syncFiltersWithModal: (api: any, currentColumnId: any, inputValue: any, columnDef: any, colDefs: any, setValue: any, setInitialFilters: any, getOptionFromDropdownValue: any) => void;
/**
 * Resolves the AG Grid filterModel key for an advance-search field.
 * Prefers columnFieldsFilterMap, then colId / field / advance field.
 */
export declare const resolveFilterModelColumnKey: (columnDef: any, advanceField: any) => any;
/**
 * Builds hidden AG Grid columns for `columnFieldsFilterMap` values that are not
 * already real columns. Without these, setFilterModel drops the mapped keys.
 * Each virtual column filters against the parent column's row-data field.
 */
export declare const createVirtualFilterColumns: (colDefs: any) => any[];
/**
 * Appends hidden virtual filter columns for columnFieldsFilterMap values.
 */
export declare const appendVirtualFilterColumns: (colDefs: any) => any;
/**
 * Processes advance search filters and builds AG Grid filter model
 * @param {array} formValues - Array of filter objects from form
 * @param {array} colDefs - Column definitions
 * @returns {object} - AG Grid filter model
 */
export declare const buildAdvanceSearchFilterModel: (formValues: any, colDefs: any) => {};
//# sourceMappingURL=filterUtils.d.ts.map