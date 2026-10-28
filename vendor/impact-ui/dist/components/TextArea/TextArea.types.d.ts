import { FocusEventHandler } from 'react';
import { BaseComponentProps } from '../../types';
import { TextareaAutosizeProps } from '@mui/base/TextareaAutosize';

/** Props for TextArea; extends MUI Base TextareaAutosize with label, state variants, and layout. */
export interface TextAreaProps extends BaseComponentProps, Omit<TextareaAutosizeProps, 'style' | 'disabled' | 'onBlur' | 'onFocus'> {
    /** Label text above the textarea */
    label?: string;
    /** Blur handler (forwarded to TextareaAutosize) */
    onBlur?: FocusEventHandler<HTMLTextAreaElement>;
    /** Focus handler (forwarded to TextareaAutosize) */
    onFocus?: FocusEventHandler<HTMLTextAreaElement>;
    /** Helper or hint text below the textarea */
    secondaryLabel?: string;
    /** Disables the textarea (maps to native disabled) */
    isDisabled?: boolean;
    /** Shows required asterisk next to label */
    isRequired?: boolean;
    /** Max character count; when set shows "current/max" and enables counter */
    characterLimit?: number;
    /** Error state styling */
    isError?: boolean;
    /** Success state styling */
    isSuccess?: boolean;
    /** Warning state styling */
    isWarning?: boolean;
    /** Width of the textarea (e.g. "240px") */
    width?: string;
    /** Height of the textarea (e.g. "100px") */
    height?: string;
}
//# sourceMappingURL=TextArea.types.d.ts.map