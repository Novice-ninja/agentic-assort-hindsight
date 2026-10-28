import { Moment } from 'moment';

export interface DatePickerFooterProps {
    tertiaryButtonProps?: Record<string, unknown>;
    secondaryButtonProps?: Record<string, unknown>;
    primaryButtonProps?: Record<string, unknown>;
    isPrimaryButtonDisabled?: boolean;
    isTertiaryButtonDisabled?: boolean;
    setSelectedDate?: (date: Moment | null) => void;
    setFocused: (focused: boolean) => void;
    onTertiaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onPrimaryButtonClick?: () => void;
    setIsOpen: (open: boolean) => void;
    hideTertiaryButton?: boolean;
    hideSecondaryButton?: boolean;
    hidePrimaryButton?: boolean;
}
export declare function DatePickerFooter({ tertiaryButtonProps, secondaryButtonProps, primaryButtonProps, isPrimaryButtonDisabled, isTertiaryButtonDisabled, setSelectedDate, setFocused, onTertiaryButtonClick, onSecondaryButtonClick, onPrimaryButtonClick, setIsOpen, hideTertiaryButton, hideSecondaryButton, hidePrimaryButton, }: DatePickerFooterProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=datePickerFooter.d.ts.map