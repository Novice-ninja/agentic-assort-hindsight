/**
 * Utility functions for Impact UI library
 *
 * This module provides various utility functions for:
 * - Avatar color generation
 * - Debouncing function calls
 * - HTML content handling
 * - Column filtering and view management
 * - Text overflow detection
 */
export { getUserAvatarColor, DEFAULT_AVATAR_COLORS } from './avatarColor';
export { debounce } from './debounce';
export { getSize, onResize, type ElementSize } from './onResize';
export { toInnerHTML, type InnerHTML } from './html';
export { TEXT_FILTER_OPTIONS, NON_TEXT_FILTER_OPTIONS, DATE_FILTER_OPTIONS, getTextFilterOptions, getNonTextFilterOptions, getDateFilterOptions, convertToOptions, getAllowedColumns, hasDuplicateColumns, isColumnSelectionDuplicate, isViewNameUnique, toSentenceCase, type FilterOption, type ColumnOption, type ColumnDefinition, type FormFilter, type FormValues, type FilterField, type SavedView, } from './helper';
export { useTextOverflow } from './useTextOverflow';
//# sourceMappingURL=index.d.ts.map