import { BaseComponentProps } from '../../types';
import { Moment } from 'moment';

/**
 * DatePicker props.
 * selectedDate/setSelectedDate or controlled handleDateChange; extends BaseComponentProps.
 */
export interface DatePickerProps extends BaseComponentProps {
    fullWidth?: boolean;
    label?: string;
    isRequired?: boolean;
    labelOrientation?: 'left' | 'top';
    showRangeSelector?: boolean;
    isError?: boolean;
    isDisabled?: boolean;
    showInputs?: boolean;
    closeOnDateSelect?: boolean;
    placeholder?: string;
    initialDate?: Moment | null;
    inputProps?: Record<string, unknown>;
    selectedDate?: Moment | null;
    setSelectedDate?: (date: Moment | null) => void;
    handleDateChange?: (date: Moment | null) => void;
    showWeekNumbers?: boolean;
    primaryButtonProps?: Record<string, unknown>;
    secondaryButtonProps?: Record<string, unknown>;
    tertiaryButtonProps?: Record<string, unknown>;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onTertiaryButtonClick?: () => void;
    withPortal?: boolean;
    portalContainer?: HTMLElement;
    showMonthYearSelect?: boolean;
    customYears?: number[] | {
        label: string;
        value: string;
    }[];
    displayFormat?: string;
    minDate?: Moment | null;
    maxDate?: Moment | null;
    onClickOutside?: () => void;
    isOutsideRange?: (day: Moment) => boolean;
    isAgGridCellRenderer?: boolean;
    customIcon?: React.ReactNode;
    readOnly?: boolean;
    /** Hide the Clear button in the footer */
    hideTertiaryButton?: boolean;
    /** Hide the Cancel button in the footer */
    hideSecondaryButton?: boolean;
    /** Hide the Apply button in the footer */
    hidePrimaryButton?: boolean;
}
//# sourceMappingURL=DatePicker.types.d.ts.map