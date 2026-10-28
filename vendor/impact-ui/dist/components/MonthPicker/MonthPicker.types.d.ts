import { ComponentType } from 'react';
import { BaseComponentProps } from '../../types';

export interface YearOption {
    label: string;
    value: string;
}
export interface MonthPickerSelectProps {
    name: string;
    isWithSearch?: boolean;
    withPortal?: boolean;
    dropDownPortalClassName?: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    currentOptions: YearOption[];
    setCurrentOptions: (opts: YearOption[]) => void;
    initialOptions: YearOption[];
    selectedOptions: YearOption;
    setSelectedOptions: (opts: YearOption | ((prev: YearOption) => YearOption)) => void;
    minWidth?: number;
}
export interface MonthPickerProps extends Omit<BaseComponentProps, 'children'> {
    /** Custom year options for the year dropdown (when showYearSelect is true) */
    customYears?: YearOption[];
    /** Locale for month names */
    locale?: string;
    /** Show mandatory asterisk */
    isMandatory?: boolean;
    /** Display format for the input value: MM/YYYY or YYYY/MM */
    displayFormat?: 'MM/YYYY' | 'YYYY/MM';
    /** Controlled focused input (internal) */
    focusedInput?: string | null;
    /** Callback when Apply is clicked with the selected month */
    onApply?: (month: Date | null) => void;
    /** Callback fired immediately when a month is clicked (before Apply) */
    onMonthChange?: (month: Date) => void;
    /** Initially selected month (controlled usage via key or parent state) */
    selectedMonth?: Date | null;
    /** Returns true if the given month should be disabled */
    isOutsideRange?: (month: Date) => boolean;
    /** Disable the whole picker */
    disabled?: boolean;
    /** Show year dropdown instead of prev/next only */
    showYearSelect?: boolean;
    /** Show error state on input */
    isError?: boolean;
    /** Width of the input/container */
    customWidth?: string;
    /** Render calendar in a portal (e.g. to avoid overflow clipping) */
    withPortal?: boolean;
    /** Portal mount node when withPortal is true */
    portalContainer?: HTMLElement;
    /** Class name for the portaled container */
    portalClassName?: string;
    /** Optional custom year select component (e.g. for testing); defaults to Select from OldJsComponents */
    YearSelectComponent?: ComponentType<MonthPickerSelectProps>;
}
//# sourceMappingURL=MonthPicker.types.d.ts.map