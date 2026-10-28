import { RootComponentProps } from '../../types';

export interface FilterTagValue {
    label: string;
}
export interface FilterTagItem {
    id: string;
    label: string;
    required?: boolean;
    values: FilterTagValue[];
    handleViewAll?: (tag: FilterTagItem) => void;
}
export interface RecentFilterItem {
    filterSet: {
        label: string;
    }[];
    handleRecentFilter: (filter: RecentFilterItem) => void;
}
export interface SavedFilterBadge {
    label: string;
}
export interface SavedFilterListOption {
    label: string;
    value: string;
}
export interface FiltersStripProps extends RootComponentProps {
    /** Currently selected saved filter label */
    selectedFilter?: string;
    /** Callback when saved filter selection changes */
    setSelectedFilter?: (label: string) => void;
    /** Recent filters for dropdown */
    recentFilters?: RecentFilterItem[];
    /** Badge options for saved filter category */
    savedFiltersBadge?: SavedFilterBadge[];
    /** Saved filter list options */
    savedFilterLists?: SavedFilterListOption[];
    /** Tag groups shown in the strip (label + values) */
    filterTags?: FilterTagItem[];
    /** Called when a saved filter badge is selected */
    handleBadgeChange?: (badge: SavedFilterBadge) => void;
    /** Called when Apply is clicked in dropdown */
    handleApplyFilter?: (selectedFilter: string) => void;
    /** Called when Cancel is clicked in dropdown */
    handleCancelFilter?: () => void;
    /** Label for the "All Filters" button */
    filterButtonLabel?: string;
    /** Click handler for the filter button */
    filterButtonClick?: () => void;
    /** Props passed to the filter button */
    filterButtonProps?: Record<string, unknown>;
    /** Hide the selected filter badge in dropdown */
    hideSelectedFilterBadge?: boolean;
    /** Initially selected badge label */
    savedFilterSelectedBadge?: string | null;
    /** Called when dropdown open state changes */
    handleSavedRecentFilterDropdown?: () => void;
    /** Label for the filter dropdown (e.g. "Filters Applied") */
    filterDropDownLabel?: string;
}
//# sourceMappingURL=FiltersStrip.types.d.ts.map