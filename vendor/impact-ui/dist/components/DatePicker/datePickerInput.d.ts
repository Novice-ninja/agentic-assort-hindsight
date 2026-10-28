import { default as React } from 'react';
import { Moment } from 'moment';

export interface DatePickerInputProps {
    dateString: string;
    placeholder?: string;
    isDisabled?: boolean;
    isError?: boolean;
    inputContainerRef?: React.RefObject<HTMLDivElement | null>;
    selectedDate?: Moment | null;
    inputProps?: Record<string, unknown>;
    isOpen?: boolean;
    setIsOpen: (open: boolean) => void;
    displayFormat?: string;
    onDateStringChange?: (value: Moment | string | null) => void;
    minDate?: Moment | null;
    maxDate?: Moment | null;
    onCancel?: number;
    readOnly?: boolean;
    customIcon?: React.ReactNode;
    id?: string;
    'data-testid'?: string;
}
export declare const DatePickerInput: React.ForwardRefExoticComponent<DatePickerInputProps & React.RefAttributes<HTMLInputElement | null>>;
//# sourceMappingURL=datePickerInput.d.ts.map