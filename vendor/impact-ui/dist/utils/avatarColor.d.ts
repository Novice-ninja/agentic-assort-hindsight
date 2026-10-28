/**
 * Utility to deterministically map a user identifier (name/email/id)
 * to a color from a predefined palette. Same input -> same color.
 * Optionally allow passing a custom palette.
 */
export declare const DEFAULT_AVATAR_COLORS: readonly ["#B28B63", "#977CC1", "#658EC4", "#8C906A", "#7A8294", "#DB8229", "#917A69", "#82637B", "#BF9F22", "#48ACB2"];
/**
 * Get a deterministic avatar color for a user based on their identifier
 * @param userKey - User identifier (name, email, id, etc.)
 * @param palette - Optional custom color palette
 * @returns A color string from the palette
 */
export declare function getUserAvatarColor(userKey?: string | null, palette?: readonly string[]): string;
//# sourceMappingURL=avatarColor.d.ts.map