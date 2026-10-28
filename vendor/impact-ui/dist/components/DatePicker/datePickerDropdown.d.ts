import { default as React } from 'react';
import { Moment } from 'moment';

export interface DatePickerDropdownProps {
    onDatesChange: (date: Moment | null) => void;
    focused: boolean;
    setFocused: (focused: boolean) => void;
    selectedDate: Moment | null;
    setSelectedDate?: (date: Moment | null) => void;
    showWeekNumbers?: boolean;
    primaryButtonProps?: Record<string, unknown>;
    secondaryButtonProps?: Record<string, unknown>;
    tertiaryButtonProps?: Record<string, unknown>;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onTertiaryButtonClick?: () => void;
    setIsOpen: (open: boolean) => void;
    withPortal?: boolean;
    portalContainer?: HTMLElement;
    containerRef: React.RefObject<HTMLDivElement | null>;
    showMonthYearSelect?: boolean;
    customYears?: {
        label: string;
        value: string;
    }[];
    minDate?: Moment | null;
    maxDate?: Moment | null;
    isOutsideRange?: (day: Moment) => boolean;
    readOnly?: boolean;
    hideTertiaryButton?: boolean;
    hideSecondaryButton?: boolean;
    hidePrimaryButton?: boolean;
    placement?: 'top' | 'bottom';
    dropdownRef?: React.RefObject<HTMLDivElement | null>;
    allButtonsHidden?: boolean;
    [key: string]: unknown;
}
export declare function DatePickerDropdown({ onDatesChange, focused, setFocused, selectedDate, setSelectedDate, showWeekNumbers, primaryButtonProps, secondaryButtonProps, tertiaryButtonProps, onPrimaryButtonClick, onSecondaryButtonClick, onTertiaryButtonClick, setIsOpen, withPortal, portalContainer, containerRef, showMonthYearSelect, customYears, minDate, maxDate, isOutsideRange, hideTertiaryButton, hideSecondaryButton, hidePrimaryButton, placement, dropdownRef, allButtonsHidden, ...calendarProps }: DatePickerDropdownProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=datePickerDropdown.d.ts.map