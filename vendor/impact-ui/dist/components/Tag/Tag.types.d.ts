import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { ChipProps as MUIChipProps } from '@mui/material/Chip';
import { BaseComponentProps } from '../../types';

/**
 * Tag size variants
 */
export type TagSize = 'small' | 'medium' | 'large';
/**
 * Tag visual variants that determine the styling
 */
export type TagVariant = 'filled' | 'stroke' | 'solid';
export interface TagProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIChipProps, 'size' | 'variant' | 'label' | 'onDelete' | 'deleteIcon'> {
    /**
     * The text content displayed inside the tag.
     * @example
     * <Tag label="New" />
     * <Tag label="JavaScript" />
     */
    label: string | ReactNode;
    /**
     * The size of the tag component.
     * - 'small': Compact size (22px height, 12px font)
     * - 'medium': Standard size (24px height, 14px font)
     * - 'large': Larger size (32px height, 14px font with heavier weight)
     * @default 'large'
     * @example
     * <Tag label="Small Tag" size="small" />
     * <Tag label="Medium Tag" size="medium" />
     * <Tag label="Large Tag" size="large" />
     */
    size?: TagSize;
    /**
     * The visual style variant of the tag.
     * - 'filled': Has a light background with a visible border
     * - 'stroke': Transparent background with a colored border (outlined style)
     * - 'solid': Solid light blue background without border
     * @default 'filled'
     * @example
     * <Tag label="Filled" variant="filled" />
     * <Tag label="Stroke" variant="stroke" />
     * <Tag label="Solid" variant="solid" />
     */
    variant?: TagVariant;
    /**
     * Custom icon to display as the delete/action button.
     * Only visible when `isRemovable` is true.
     * If not provided, a default close (X) icon is used.
     * @example
     * import EditIcon from '@mui/icons-material/Edit';
     *
     * <Tag
     *   label="Editable"
     *   isRemovable
     *   icon={<EditIcon />}
     *   onDelete={() => handleEdit()}
     * />
     */
    icon?: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
    /**
     * Callback function triggered when the tag is clicked.
     * Use this for selection or navigation behavior.
     * @example
     * <Tag
     *   label="React"
     *   onClick={() => filterByTag('React')}
     * />
     */
    onClick?: () => void;
    /**
     * When true, displays a delete/close icon that can be clicked.
     * The icon appearance can be customized via the `icon` prop.
     * @default false
     * @example
     * <Tag
     *   label="Removable Tag"
     *   isRemovable
     *   onDelete={() => removeTag()}
     * />
     */
    isRemovable?: boolean;
    /**
     * Callback function triggered when the delete icon is clicked.
     * Only applicable when `isRemovable` is true.
     * @example
     * const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);
     *
     * {tags.map(tag => (
     *   <Tag
     *     key={tag}
     *     label={tag}
     *     isRemovable
     *     onDelete={() => setTags(tags.filter(t => t !== tag))}
     *   />
     * ))}
     */
    onDelete?: () => void;
}
/**
 * Internal props for Tag variant components (Filled, Stroke, Solid)
 */
export interface TagVariantProps {
    label: string | ReactNode;
    size: TagSize;
    icon?: ReactNode;
    onClick?: () => void;
    isRemovable: boolean;
    onDelete?: () => void;
    id?: string;
    'data-testid'?: string;
    ref?: React.Ref<HTMLDivElement>;
    [key: string]: unknown;
}
//# sourceMappingURL=Tag.types.d.ts.map