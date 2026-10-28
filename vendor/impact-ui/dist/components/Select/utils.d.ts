import { SelectOption, SelectSelectionLabels, HandleSearchParams, HandleSelectAllParams, HandleClearAllParams, HandleDropdownCloseParams, HandleDropdownOpenParams, HandleSelectAllWhenCompLoadsParams } from './Select.types';

export declare const handleSearch: ({ event, externalOnSearch, initialOptions, setCurrentOptions, setSearchTerm, }: HandleSearchParams) => void;
export declare const handleSelectAll: ({ event, externalOnSelectAll, setIsSelectAll, currentOptions, selectedOptions, setSelectedOptions, handleSelect, }: HandleSelectAllParams) => void;
export declare const handleSelectAllWhenCompLoads: ({ currentOptions, selectedOptions, setSelectedOptions, }: HandleSelectAllWhenCompLoadsParams) => void;
export declare const handleClearAll: ({ externalOnClearAll, setSelectedOptions, setIsSelectAll, handleSelect, syncParentChildSelection, }: HandleClearAllParams) => void;
export declare const handleDropdownClose: ({ externalOnDropdownClose, setCurrentOptions, initialOptions, currentOptions, setIsOpen, onBlur, event, }: HandleDropdownCloseParams) => void;
export declare const handleDropdownOpen: ({ externalOnDropdownOpen, isOpen, setIsOpen, }: HandleDropdownOpenParams) => void;
export declare const getPlaceholder: (isMulti: boolean | undefined, selectedOptions: SelectOption | SelectOption[] | undefined, placeholder: string | undefined, customPlaceholderAfterSelect?: string | number | null, selectionLabels?: SelectSelectionLabels, t?: (key: string) => string) => string;
export declare const onKeyDown: ({ e, focusedIndex, currentOptions, }: {
    e: React.KeyboardEvent;
    focusedIndex: React.MutableRefObject<number>;
    currentOptions: SelectOption[];
}) => void;
export declare const flattenOptions: (options: SelectOption[] | undefined) => SelectOption[];
//# sourceMappingURL=utils.d.ts.map