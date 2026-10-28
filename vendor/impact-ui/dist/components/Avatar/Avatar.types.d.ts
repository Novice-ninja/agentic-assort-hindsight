import { AvatarProps as MUIAvatarProps } from '@mui/material/Avatar';
import { BaseComponentProps } from '../../types';

/**
 * Avatar display types that determine how the avatar is rendered
 */
export type AvatarType = 'withPicture' | 'withoutPicture' | 'onlyName';
/**
 * Avatar size variants
 */
export type AvatarSize = 'small' | 'medium' | 'large';
export interface AvatarProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIAvatarProps, 'variant' | 'sizes'> {
    /**
     * The name or label to display as initials when type is 'withoutPicture' or 'onlyName'.
     * For 'withoutPicture', up to 2 initials are shown (e.g., "John Doe" → "JD").
     * For 'onlyName', only the first initial is shown (e.g., "John Doe" → "J").
     * @default 'Unknown'
     * @example
     * // Shows "JD"
     * <Avatar label="John Doe" type="withoutPicture" />
     * // Shows "J"
     * <Avatar label="John Doe" type="onlyName" />
     */
    label?: string | null;
    /**
     * Controls how the avatar content is displayed:
     * - 'withPicture': Displays the image from the `src` prop
     * - 'withoutPicture': Displays up to 2 initials extracted from the `label` prop
     * - 'onlyName': Displays only the first initial from the `label` prop
     * @default 'withoutPicture'
     * @example
     * <Avatar type="withPicture" src="/path/to/image.jpg" />
     * <Avatar type="withoutPicture" label="John Doe" /> // Shows "JD"
     * <Avatar type="onlyName" label="John Doe" /> // Shows "J"
     */
    type?: AvatarType;
    /**
     * The URL of the image to display when type is 'withPicture'.
     * This prop is ignored for other avatar types.
     * @example
     * <Avatar type="withPicture" src="https://example.com/avatar.jpg" />
     */
    src?: string;
    /**
     * The size of the avatar component.
     * - 'small': 36x36px
     * - 'medium': 48x48px
     * - 'large': 64x64px (default)
     * @default 'large'
     */
    size?: AvatarSize;
    /**
     * Alternative text for the avatar image (for accessibility).
     * If not provided, the label will be used.
     */
    alt?: string;
    /**
     * Click handler for the avatar
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
//# sourceMappingURL=Avatar.types.d.ts.map