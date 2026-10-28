import { RecentFilterItem, SavedFilterBadge, SavedFilterListOption } from './FiltersStrip.types';

/** Props for AppliedFilters (re-exported for consumers) */
export interface AppliedFiltersProps {
    selectedFilter: string;
    setSelectedFilter: (label: string) => void;
    recentFilters: RecentFilterItem[];
    savedFiltersBadge: SavedFilterBadge[];
    savedFilterLists: SavedFilterListOption[];
    handleApplyFilter: (selectedFilter: string) => void;
    handleCancelFilter: () => void;
    handleBadgeChange: (badge: SavedFilterBadge) => void;
    setShowDropDown: (show: boolean) => void;
    selectedBadge: string | null;
    setSelectedBadge: (label: string | null) => void;
    tempSelectedFilter: string;
    setTempSelectedFilter: (label: string) => void;
    selectedFilterOnApply: string;
    setSelectedFilterOnApply: (label: string) => void;
}
export declare function AppliedFilters({ selectedFilter, setSelectedFilter, recentFilters, savedFiltersBadge, savedFilterLists, handleApplyFilter, handleCancelFilter, handleBadgeChange, setShowDropDown, selectedBadge, setSelectedBadge, tempSelectedFilter, setTempSelectedFilter, selectedFilterOnApply, setSelectedFilterOnApply, }: AppliedFiltersProps): import("react/jsx-runtime").JSX.Element;
export declare namespace AppliedFilters {
    var displayName: string;
}
//# sourceMappingURL=AppliedFilters.d.ts.map