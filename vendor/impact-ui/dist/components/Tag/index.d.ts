import { TagProps } from './Tag.types';

/**
 * Tag component for displaying labels, categories, or metadata.
 * Supports three visual variants: filled, stroke (outlined), and solid.
 * Can be made removable with an optional delete button.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // Basic tag
 * <Tag label="JavaScript" />
 *
 * // Different variants
 * <Tag label="Filled" variant="filled" />
 * <Tag label="Stroke" variant="stroke" />
 * <Tag label="Solid" variant="solid" />
 *
 * // Removable tag
 * <Tag
 *   label="React"
 *   isRemovable
 *   onDelete={() => handleRemove('React')}
 * />
 *
 * // Different sizes
 * <Tag label="Small" size="small" />
 * <Tag label="Medium" size="medium" />
 * <Tag label="Large" size="large" />
 */
export declare const Tag: import('react').ForwardRefExoticComponent<Omit<TagProps, "ref"> & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=index.d.ts.map