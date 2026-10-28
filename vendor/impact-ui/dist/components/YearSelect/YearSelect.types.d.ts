import { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface YearOption {
    label: string;
    value: string;
}
export interface YearSelectProps {
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
    className?: string;
    'data-testid'?: string;
}
export type YearSelectComponentType = ForwardRefExoticComponent<YearSelectProps & RefAttributes<HTMLDivElement | null>>;
//# sourceMappingURL=YearSelect.types.d.ts.map