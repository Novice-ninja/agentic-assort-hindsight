import { BaseComponentProps } from '../../types';

export interface RadioButtonGroupOption {
    label: string;
    value: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}
export interface RadioButtonGroupProps extends BaseComponentProps {
    options: RadioButtonGroupOption[];
    value?: string;
    selectedOption?: string;
    isDisabled?: boolean;
    disabled?: boolean;
    /** Called when selection changes. MUI RadioGroup passes (event, value). */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    name?: string;
    orientation?: 'row' | 'column';
    /** Optional group label rendered above the radio buttons */
    label?: string;
}
//# sourceMappingURL=RadioButtonGroup.types.d.ts.map