import { SliderProps } from './Slider.types';

export type { SliderProps, SliderHeaderOrientation, SliderVariant, SliderInputPosition, } from './Slider.types';
/**
 * Slider with optional header, label, and range inputs. Wraps MUI Slider; supports single and ranged variants.
 */
export declare function Slider({ headerOrientation: _headerOrientation, header, label, value, onChange, required, disabled, min, max, variant, inputPosition, colorChangeThreshold, valueFormat, messageTimeout, className, id, 'data-testid': dataTestId, ...sliderProps }: SliderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Slider {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map