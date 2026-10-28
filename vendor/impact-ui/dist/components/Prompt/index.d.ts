import { PromptProps } from './Prompt.types';

export type { PromptProps, PromptVariant } from './Prompt.types';
/**
 * Prompt dialog for confirmations, alerts, and messages. Supports info, success, warning, and error variants.
 */
export declare function Prompt({ variant, title, children, primaryButtonLabel, secondaryButtonLabel, isOpen, onPrimaryButtonClick, onSecondaryButtonClick, handleClose, primaryButtonProps, secondaryButtonProps, ...args }: PromptProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Prompt {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map