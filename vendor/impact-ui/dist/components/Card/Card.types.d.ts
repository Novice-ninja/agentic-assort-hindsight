import { ReactNode } from 'react';
import { CardProps as MUICardProps } from '@mui/material/Card';
import { BaseComponentProps } from '../../types';

export type CardSize = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'extraLarge-3x';
export interface CardProps extends Omit<BaseComponentProps, 'children'>, Omit<MUICardProps, 'size'> {
    /**
     * Card content
     */
    children?: ReactNode;
    /**
     * The size of the card which affects the box-shadow intensity
     * @default 'medium'
     */
    size?: CardSize;
    /**
     * Custom padding for the card
     * @default '20px'
     */
    padding?: string | number;
    /**
     * Custom width for the card
     * @default '100%'
     */
    width?: string | number;
    /**
     * Custom maximum width for the card
     * @default 500
     */
    maxWidth?: string | number;
    /**
     * Custom minimum height for the card
     * @default 300
     */
    minHeight?: string | number;
    /**
     * Whether the card is clickable/interactive
     * @default false
     */
    clickable?: boolean;
    /**
     * Click handler for the card
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Accessible label for screen readers
     */
    'aria-label'?: string;
}
//# sourceMappingURL=Card.types.d.ts.map