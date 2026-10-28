import { ReactNode } from 'react';
import { ButtonProps } from '../Button';

export interface PanelFooterProps {
    primaryButtonLabel?: ReactNode;
    onPrimaryButtonClick?: () => void;
    secondaryButtonLabel?: ReactNode;
    onSecondaryButtonClick?: () => void;
    tertiaryButtonLabel?: ReactNode;
    onTertiaryButtonClick?: () => void;
    quaternaryButtonLabel?: ReactNode;
    onQuaternaryButtonClick?: () => void;
    primaryButtonProps?: Partial<ButtonProps>;
    secondaryButtonProps?: Partial<ButtonProps>;
    tertiaryButtonProps?: Partial<ButtonProps>;
    quaternaryButtonProps?: Partial<ButtonProps>;
}
export declare function PanelFooter({ quaternaryButtonLabel, onQuaternaryButtonClick, tertiaryButtonLabel, onTertiaryButtonClick, secondaryButtonLabel, onSecondaryButtonClick, primaryButtonLabel, onPrimaryButtonClick, primaryButtonProps, secondaryButtonProps, tertiaryButtonProps, quaternaryButtonProps, }: PanelFooterProps): import("react/jsx-runtime").JSX.Element;
export declare namespace PanelFooter {
    var displayName: string;
}
//# sourceMappingURL=PanelFooter.d.ts.map