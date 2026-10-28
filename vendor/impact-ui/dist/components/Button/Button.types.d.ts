import { ReactNode } from 'react';
import { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { BaseComponentProps } from '../../types';

export type ConvertedVariant = 'contained' | 'outlined' | 'text' | 'tertiary' | 'link';
export interface ButtonProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIButtonProps, 'size' | 'variant' | 'type'> {
    /**
     * Button content
     */
    children?: ReactNode;
    /**
     * The size of the button
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * The variant style of the button
     */
    variant?: 'primary' | 'contained' | 'secondary' | 'outlined' | 'tertiary' | 'text' | 'url';
    /**
     * Whether the button is in a loading state
     */
    loading?: boolean;
    /**
     * Icon to display in the button
     */
    icon?: ReactNode;
    /**
     * Placement of the icon relative to the label
     */
    iconPlacement?: 'left' | 'right';
    /**
     * Whether the button is disabled
     */
    disabled?: boolean;
    /**
     * The button type for styling purposes (not HTML button type)
     */
    type?: 'default' | 'destructive';
    /**
     * Native HTML button type (submit, reset, or button)
     */
    htmlType?: 'button' | 'submit' | 'reset';
    /**
     * Click handler for the button
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /**
     * Accessible label for screen readers (required if button has no text)
     */
    'aria-label'?: string;
}
//# sourceMappingURL=Button.types.d.ts.map