import { FiltersStripProps } from './FiltersStrip.types';

export type { FiltersStripProps, FilterTagItem, FilterTagValue, RecentFilterItem, SavedFilterBadge, SavedFilterListOption, } from './FiltersStrip.types';
export { FilterDropDown } from './FilterDropDown';
export { FilterSlider } from './FilterSlider';
export { AppliedFilters } from './AppliedFilters';
/**
 * Horizontal strip with saved/recent filter dropdown and filter tags. Optional "All Filters" button.
 */
export declare function FiltersStrip({ selectedFilter, setSelectedFilter, recentFilters, savedFiltersBadge, savedFilterLists, filterTags, handleBadgeChange, handleApplyFilter, handleCancelFilter, filterButtonLabel, filterButtonClick, filterButtonProps, hideSelectedFilterBadge, savedFilterSelectedBadge, handleSavedRecentFilterDropdown, filterDropDownLabel, className, id, 'data-testid': dataTestId, 'aria-label': ariaLabel, role, }: FiltersStripProps): import("react/jsx-runtime").JSX.Element;
export declare namespace FiltersStrip {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map