import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';
import { SliderProps as MUISliderProps } from '@mui/material/Slider';

export type SliderHeaderOrientation = 'top' | 'left';
export type SliderVariant = 'default' | 'ranged';
export type SliderInputPosition = 'inline' | 'bottom';
/**
 * Slider props. Extends MUI SliderProps with custom header, label, and optional range inputs.
 */
export interface SliderProps extends BaseComponentProps, Omit<MUISliderProps, 'value' | 'onChange'> {
    /** Orientation of the header (and optional label) relative to the slider */
    headerOrientation?: SliderHeaderOrientation;
    /** Optional header text above or beside the slider */
    header?: ReactNode;
    /** Optional label (e.g. field label) */
    label?: ReactNode;
    /** Placeholder for the optional number inputs (not used in current layout) */
    inputPlaceholder?: string;
    /** Current value: number for single, [min, max] for ranged variant */
    value?: number | number[];
    /** Called when value changes (from slider or inputs). MUI signature: (event, value, activeThumb) */
    onChange?: (event: Event, value: number | number[], activeThumb?: number) => void;
    /** Show required indicator next to label */
    required?: boolean;
    /** Disable slider and inputs */
    disabled?: boolean;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** 'default' for single thumb, 'ranged' for range slider */
    variant?: SliderVariant;
    /** Position of the optional number inputs: 'inline' (beside slider) or 'bottom' */
    inputPosition?: SliderInputPosition;
    /** Value above which the track color changes to a warning gradient */
    colorChangeThreshold?: number;
    /** Prefix/suffix format for input display: ['left'|'right', symbol], e.g. ['left', '$'] */
    valueFormat?: ['left' | 'right', string];
    /** Auto-dismiss timeout (ms) for validation info messages. Default 5000 */
    messageTimeout?: number;
}
//# sourceMappingURL=Slider.types.d.ts.map