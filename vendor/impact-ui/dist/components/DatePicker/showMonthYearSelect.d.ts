import { Moment } from 'moment';

export interface DatePickerShowMonthYearSelectProps {
    customYears?: {
        label: string;
        value: string;
    }[];
    month: Moment;
    onMonthSelect: (month: Moment, value: string) => void;
    onYearSelect: (month: Moment, value: string) => void;
    minDate?: Moment | null;
    maxDate?: Moment | null;
}
export declare function ShowMonthYearSelect({ customYears, month, onMonthSelect, onYearSelect, minDate, maxDate, }: DatePickerShowMonthYearSelectProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=showMonthYearSelect.d.ts.map