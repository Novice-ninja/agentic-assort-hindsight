export declare const rangeSelectorTypes: {
    id: string;
    value: string;
    label: string;
}[];
export declare const getRangeSelectorTypes: (t: any) => {
    id: string;
    value: string;
    label: any;
}[];
export declare const setStartDateOffset: (selectedRange: any, day: any) => any;
export declare const setEndDateOffset: (selectedRange: any, day: any) => any;
export declare const calculatePosition: ({ containerRef, setCustomPosition, showRangeSelector }: {
    containerRef: any;
    setCustomPosition: any;
    showRangeSelector: any;
}) => void;
export declare const formatMomentDate: (date: any, dateFormat?: string) => any;
/**
 * Preprocesses fiscal week records into a day-keyed lookup ('YYYY-MM-DD' -> record) plus the
 * first/last day of every fiscal month, quarter and year. Returns null when no valid record exists.
 */
export declare const buildFiscalDayLookup: (moment: any, data: any) => {
    days: Map<any, any>;
    periods: {
        month: Map<any, any>;
        quarter: Map<any, any>;
        year: Map<any, any>;
    };
} | null;
export declare const getFiscalRecord: (lookup: any, day: any) => any;
export declare const getFiscalWeekLabel: (record: any) => number | undefined;
export declare const getFiscalStartDateOffset: (lookup: any, moment: any, selectedRange: any, day: any) => any;
export declare const getFiscalEndDateOffset: (lookup: any, moment: any, selectedRange: any, day: any) => any;
/**
 * Whether `day` belongs in the panel it is currently being rendered in, according to fiscal
 * month data. Falls back to calendar-month membership when the day has no fiscal record.
 */
export declare const isDayInFiscalPanel: (lookup: any, day: any, isOutsideDay: any) => boolean;
//# sourceMappingURL=utils.d.ts.map