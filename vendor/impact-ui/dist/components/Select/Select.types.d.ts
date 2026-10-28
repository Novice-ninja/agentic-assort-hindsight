import { ReactNode, CSSProperties, RefObject, ChangeEvent, KeyboardEvent, FocusEvent, MouseEvent as ReactMouseEvent, MutableRefObject } from 'react';
import { Props as ReactSelectProps, MenuListProps as RSMenuListProps, OptionProps as RSOptionProps, GroupHeadingProps as RSGroupHeadingProps } from 'react-select';

export interface SelectFooterMessage {
    description?: string;
    actionButtonText?: string;
    action?: () => void;
}
export interface SelectSelectionLabels {
    selectAll?: string;
    deselectAll?: string;
    selected?: string;
}
export interface SelectOption {
    label: string;
    value: string | number;
    icon?: ReactNode;
    children?: SelectOption[];
    disabled?: boolean;
    isDisabled?: boolean;
    options?: SelectOption[];
    customBadgeLabel?: string;
    customBadgeColor?: string;
    customBadgeStyles?: Record<string, unknown>;
}
/** Loosely typed AG Grid column to avoid a hard dependency */
export interface AgGridColumn {
    getActualWidth?: () => number;
    getWidth?: () => number;
    addEventListener?: (event: string, handler: () => void) => void;
    removeEventListener?: (event: string, handler: () => void) => void;
}
export interface SelectProps extends Omit<ReactSelectProps<SelectOption>, 'onChange' | 'options' | 'value' | 'isMulti' | 'isDisabled' | 'isLoading' | 'placeholder' | 'isClearable' | 'onBlur' | 'menuShouldBlockScroll' | 'noOptionsMessage' | 'onMenuScrollToBottom' | 'styles' | 'components' | 'className' | 'classNames'> {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    initialOptions: SelectOption[];
    currentOptions: SelectOption[];
    setCurrentOptions: (opts: SelectOption[]) => void;
    selectedOptions: SelectOption | SelectOption[];
    setSelectedOptions: (opts: SelectOption | SelectOption[] | null) => void;
    isSelectAll?: boolean;
    setIsSelectAll?: (v: boolean) => void;
    label?: string;
    isRequired?: boolean;
    name?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    labelOrientation?: 'top' | 'left';
    isMulti?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    isWithIcon?: boolean;
    isError?: boolean;
    isWithSearch?: boolean;
    isClearable?: boolean;
    isWithSelectedOptionTags?: boolean;
    toggleSelectAll?: boolean;
    icon?: ReactNode;
    isGrouped?: boolean;
    isMultiInSubmenu?: boolean;
    isWithSelectAll?: boolean;
    isCloseWhenClickOutside?: boolean;
    noOptionMessage?: string;
    withPortal?: boolean;
    portalContainer?: HTMLElement;
    dropDownPortalClassName?: string;
    minWidth?: string | number;
    width?: string | number;
    dropdownPosition?: 'top' | 'bottom';
    isAgGridCellRenderer?: boolean;
    column?: AgGridColumn;
    /** DOM id for the select root container; also used for the trigger when `selectId` is omitted */
    id?: string;
    'data-testid'?: string;
    selectId?: string;
    customPlaceholderAfterSelect?: string | number;
    helperText?: string;
    maxSelectableOptions?: number;
    isLoadingMore?: boolean;
    onSearchBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    showFooterMessage?: SelectFooterMessage;
    selectionLabels?: SelectSelectionLabels;
    handleChange?: (selected: SelectOption | SelectOption[] | null, event?: unknown, index?: number) => void;
    onSelectAll?: (event: ChangeEvent<HTMLInputElement>) => void;
    onClearAll?: () => void;
    onSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    onDropdownClose?: () => void;
    onDropdownOpen?: () => void;
    onBlur?: (event?: unknown) => void;
    onMenuScrollToBottom?: () => void;
}
export interface SearchFilterProps {
    isClearable?: boolean;
    onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    isMulti?: boolean;
    onSelectAll: (event: ChangeEvent<HTMLInputElement>) => void;
    onClearAll: () => void;
    isSelectAll?: boolean;
    selectedOptions: SelectOption | SelectOption[];
    toggleSelectAll?: boolean;
    isWithSearch?: boolean;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onSubmenuKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => boolean;
    onClose?: () => void;
    setHighlightedIndex?: (index: number) => void;
    setIsKeyboardNav?: (active: boolean) => void;
    highlightedIndex?: number;
    isSelectAllHighlighted?: boolean;
    searchPlaceholder?: string;
    isLoading?: boolean;
    searchTerm: string;
    externalOnSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    setSearchTerm: (term: string) => void;
    onSearchBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    selectionLabels?: SelectSelectionLabels;
}
export interface SelectMenuListSelectProps {
    onMenuScrollToBottom?: () => void;
    noOptionMessage?: string;
    maxSelectableOptions?: number;
    isLoading?: boolean;
    isLoadingMore?: boolean;
    listboxId?: string;
    highlightedIndex?: number;
    setHighlightedIndex?: (index: number) => void;
    isKeyboardNav?: boolean;
    setIsKeyboardNav?: (active: boolean) => void;
    listRef?: MutableRefObject<{
        scrollToItem: (index: number, align: string) => void;
    } | null>;
    submenuParent?: SelectOption | null;
    showFooterMessage?: SelectFooterMessage;
}
export interface DropdownProps {
    children: ReactNode;
    dropDownPortalClassName?: string;
    isOpen: boolean;
    target: ReactNode;
    onClose: (event?: ReactMouseEvent<HTMLDivElement>) => void;
    disabled?: boolean;
    containerRef: RefObject<HTMLDivElement>;
    menuRef?: RefObject<HTMLDivElement>;
    withPortal?: boolean;
    portalContainer?: HTMLElement | null;
    dropdownButtonRef: RefObject<HTMLButtonElement>;
    dropdownPosition?: 'top' | 'bottom';
    isKeyboardNav?: boolean;
}
export interface UseMenuPositionParams {
    isOpen: boolean;
    triggerRef: RefObject<HTMLButtonElement>;
    menuRef?: RefObject<HTMLDivElement>;
    withPortal?: boolean;
    dropdownPosition?: 'top' | 'bottom';
}
export interface UseClickOutsideParams {
    isOpen: boolean;
    containerRef: RefObject<HTMLDivElement>;
    menuRef?: RefObject<HTMLDivElement>;
    isCloseWhenClickOutside?: boolean;
    onClose: (event: MouseEvent) => void;
}
export type MenuListPropsTyped = RSMenuListProps<SelectOption>;
export type OptionPropsTyped = RSOptionProps<SelectOption> & {
    isSelected: boolean;
    selectedOptions?: SelectOption | SelectOption[];
    initialOptions?: SelectOption[];
    isDisabled?: boolean;
    isLoadingOption?: boolean;
    customOptionProps?: Record<string, unknown>;
};
export type GroupHeadingPropsTyped = RSGroupHeadingProps<SelectOption>;
export interface OverflowTooltipLabelProps {
    text: string;
    popperProps?: Record<string, unknown>;
}
export interface SelectedOptionsTagsProps {
    selectedOptions: SelectOption[];
    setSelectedOptions?: (opts: SelectOption[]) => void;
    onChange: (opts: SelectOption[], event?: unknown, index?: number) => void;
}
export interface SelectedOptionsTagListProps {
    selectedOptions: SelectOption[];
    handleOptionTagRemove: (option: SelectOption) => void;
}
export interface HandleSearchParams {
    isMulti?: boolean;
    event: ChangeEvent<HTMLInputElement>;
    externalOnSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
    initialOptions: SelectOption[];
    setCurrentOptions: (opts: SelectOption[]) => void;
    setSearchTerm: (term: string) => void;
    setOpenToast?: (open: boolean) => void;
    setToastMessage?: (message: string) => void;
}
export interface HandleSelectAllParams {
    event: ChangeEvent<HTMLInputElement>;
    externalOnSelectAll?: (event: ChangeEvent<HTMLInputElement>) => void;
    setIsSelectAll: (v: boolean) => void;
    currentOptions: SelectOption[];
    selectedOptions: SelectOption[];
    setSelectedOptions: (opts: SelectOption[]) => void;
    handleSelect: (opts: SelectOption[], event?: unknown) => void;
}
export interface HandleClearAllParams {
    externalOnClearAll?: () => void;
    setSelectedOptions: (opts: SelectOption[]) => void;
    setIsSelectAll: (v: boolean) => void;
    handleSelect: (opts: SelectOption[], event?: {
        action: string;
    }) => void;
    syncParentChildSelection: (opts: SelectOption[]) => void;
}
export interface HandleDropdownCloseParams {
    externalOnDropdownClose?: () => void;
    setCurrentOptions: (opts: SelectOption[]) => void;
    initialOptions: SelectOption[];
    currentOptions: SelectOption[];
    setIsOpen: (open: boolean) => void;
    onBlur?: (event?: any) => void;
    event?: any;
}
export interface HandleDropdownOpenParams {
    externalOnDropdownOpen?: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
export interface HandleSelectAllWhenCompLoadsParams {
    currentOptions: SelectOption[];
    selectedOptions: SelectOption[];
    setSelectedOptions: (opts: SelectOption[]) => void;
}
export interface MenuPositionResult {
    top?: number;
    left?: number;
    width?: string;
    minWidth?: string;
    opacity?: number;
    position?: CSSProperties['position'];
}
//# sourceMappingURL=Select.types.d.ts.map