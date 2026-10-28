import { RecentFilterItem, SavedFilterBadge, SavedFilterListOption } from './FiltersStrip.types';

/** Props for FilterDropDown (re-exported for consumers) */
export interface FilterDropDownProps {
    selectedFilter: string;
    setSelectedFilter: (label: string) => void;
    recentFilters: RecentFilterItem[];
    savedFilterLists: SavedFilterListOption[];
    savedFiltersBadge: SavedFilterBadge[];
    handleApplyFilter: (selectedFilter: string) => void;
    handleCancelFilter: () => void;
    handleBadgeChange: (badge: SavedFilterBadge) => void;
    hideSelectedFilterBadge?: boolean;
    savedFilterSelectedBadge?: string | null;
    handleSavedRecentFilterDropdown?: () => void;
    filterDropDownLabel?: string;
}
export declare function FilterDropDown({ selectedFilter, setSelectedFilter, recentFilters, savedFilterLists, savedFiltersBadge, handleApplyFilter, handleCancelFilter, handleBadgeChange, hideSelectedFilterBadge, savedFilterSelectedBadge, handleSavedRecentFilterDropdown, filterDropDownLabel, }: FilterDropDownProps): import("react/jsx-runtime").JSX.Element;
export declare namespace FilterDropDown {
    var displayName: string;
}
//# sourceMappingURL=FilterDropDown.d.ts.map