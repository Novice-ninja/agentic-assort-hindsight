import { SelectOption } from '../Select.types';

export interface UseKeyboardNavigationOptions {
    options?: SelectOption[];
    isOpen: boolean;
    onSelect?: (option: SelectOption, index: number) => void;
    onClose?: () => void;
    isMulti?: boolean;
    selectedOption?: SelectOption | null;
    selectedOptions?: SelectOption[];
    getOptionDisabled?: (option: SelectOption) => boolean;
    onHighlightChange?: (index: number) => void;
    onNavigateUp?: () => void;
    hasSelectAll?: boolean;
    onSelectAllToggle?: () => void;
}
export declare function useKeyboardNavigation({ options, isOpen, onSelect, onClose, isMulti, selectedOption, getOptionDisabled, onHighlightChange, onNavigateUp, hasSelectAll, onSelectAllToggle, }: UseKeyboardNavigationOptions): {
    highlightedIndex: number;
    setHighlightedIndex: import('react').Dispatch<import('react').SetStateAction<number>>;
    handleKeyDown: (e: React.KeyboardEvent) => void;
};
//# sourceMappingURL=useKeyboardNavigation.d.ts.map