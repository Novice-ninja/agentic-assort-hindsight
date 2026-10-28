import { CSSProperties } from 'react';
import { UseMenuPositionParams } from '../Select.types';

/**
 * Calculates and tracks menu position with:
 * - requestAnimationFrame throttling
 * - ResizeObserver for trigger element changes
 * - Stable placement while scrolling
 * - Support for both portal and non-portal modes
 */
export declare const useMenuPosition: ({ isOpen, triggerRef, menuRef, withPortal, dropdownPosition, }: UseMenuPositionParams) => {
    menuStyle: CSSProperties;
    placement: "top" | "bottom";
};
export default useMenuPosition;
//# sourceMappingURL=useMenuPosition.d.ts.map