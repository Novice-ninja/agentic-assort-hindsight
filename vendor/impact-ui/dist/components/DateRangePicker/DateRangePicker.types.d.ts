import { BaseComponentProps } from '../../types';
import { Moment } from 'moment';

/**
 * One fiscal week record. All dates are Unix timestamps in milliseconds at UTC midnight;
 * `fiscal_week_end_date` is inclusive.
 */
export interface CustomWeekNumberData {
    calendar_week_start_date: number;
    fiscal_year_week: number;
    fiscal_year_month: number;
    fiscal_year_quarter: number;
    fiscal_week_begin_date: number;
    fiscal_week_end_date: number;
}
/**
 * DateRangePicker props.
 * startDate/setStartDate, endDate/setEndDate or handleDatesChange; extends BaseComponentProps.
 * Additional react-dates props are forwarded to the underlying DayPickerRangeController.
 */
export interface DateRangePickerProps extends BaseComponentProps {
    label?: string;
    isRequired?: boolean;
    labelOrientation?: 'left' | 'top';
    fullWidth?: boolean;
    startDate?: Moment | null;
    setStartDate?: (date: Moment | null) => void;
    startDateInputProps?: Record<string, unknown>;
    endDate?: Moment | null;
    setEndDate?: (date: Moment | null) => void;
    endDateInputProps?: Record<string, unknown>;
    isDisabled?: boolean;
    isError?: boolean;
    withPortal?: boolean;
    handleDatesChange?: (startDate: Moment | null, endDate: Moment | null) => void;
    handleFocusChange?: (focusedInput: string | null, setFocusedInput: (v: string) => void, startRef: React.RefObject<HTMLInputElement>, endRef: React.RefObject<HTMLInputElement>) => void;
    portalContainer?: HTMLElement;
    showWeekNumbers?: boolean;
    tertiaryButtonProps?: Record<string, unknown>;
    primaryButtonProps?: Record<string, unknown>;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onResetClick?: () => void;
    showRangeSelector?: boolean;
    showMonthYearSelect?: boolean;
    customYears?: number[] | {
        label: string;
        value: string;
    }[];
    handleStartDateFocus?: (setFocusedInput: (v: string) => void) => void;
    handleEndDateFocus?: (setFocusedInput: (v: string) => void) => void;
    displayFormat?: string;
    customWeekNumberData?: CustomWeekNumberData[];
    /**
     * When true, `customWeekNumberData` (as `CustomWeekNumberData[]`) assigns each date to its
     * fiscal week and fiscal month. Days are shown in the calendar panel that matches their
     * `fiscal_year_month` (grid layout unchanged). Week labels and Week/Month/Quarter/Year
     * range selection also follow the fiscal data. Falls back to the default behavior when the
     * data is missing or empty.
     */
    enableCustomDatePlacement?: boolean;
    suppressClickOnWeekNumber?: boolean;
    isAgGridCellRenderer?: boolean;
    minDate?: Moment | null;
    maxDate?: Moment | null;
    readOnly?: boolean;
    startDateOffset?: (date: Moment) => Moment;
    endDateOffset?: (date: Moment) => Moment;
    helperText?: string;
    isOutsideRange?: (day: Moment) => boolean;
    portalClassName?: string;
    customIcon?: React.ReactNode;
}
//# sourceMappingURL=DateRangePicker.types.d.ts.map