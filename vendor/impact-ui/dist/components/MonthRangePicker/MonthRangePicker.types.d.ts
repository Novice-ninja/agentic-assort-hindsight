import { ReactNode } from 'react';

export interface MonthRangePickerYearOption {
    label: string;
    value: string;
}
export interface MonthRangePickerProps {
    customYears?: MonthRangePickerYearOption[];
    locale?: string;
    isMandatory?: boolean;
    displayFormat?: string;
    focusedInput?: 'start' | 'end' | null;
    onApply?: (start: Date | null, end: Date | null) => void;
    startMonth?: Date | null;
    endMonth?: Date | null;
    showYearSelect?: boolean;
    isOutsideRange?: (month: Date) => boolean;
    disabled?: boolean;
    customWidth?: string;
    isError?: boolean;
    withPortal?: boolean;
    portalContainer?: HTMLElement;
    portalClassName?: string;
    onStartMonthChange?: (month: Date | null) => void;
    onEndMonthChange?: (month: Date | null) => void;
    className?: string;
    'data-testid'?: string;
    children?: ReactNode;
}
//# sourceMappingURL=MonthRangePicker.types.d.ts.map