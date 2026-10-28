import { AvatarProps } from './Avatar.types';

/**
 * Avatar component for displaying user profile images or initials.
 * Supports three display modes: image, initials (2 characters), or single initial.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // With image
 * <Avatar type="withPicture" src="/avatar.jpg" alt="John Doe" />
 *
 * // With initials
 * <Avatar label="John Doe" /> // Shows "JD"
 *
 * // With single initial
 * <Avatar type="onlyName" label="John Doe" /> // Shows "J"
 */
export declare const Avatar: import('react').ForwardRefExoticComponent<Omit<AvatarProps, "ref"> & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=index.d.ts.map