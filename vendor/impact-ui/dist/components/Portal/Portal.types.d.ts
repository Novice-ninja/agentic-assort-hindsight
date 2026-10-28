import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

/**
 * Portal renders children into a DOM node (e.g. document.body) via ReactDOM.createPortal.
 * Use for dropdowns, modals, and tooltips so they escape overflow/stacking context.
 */
export interface PortalProps extends BaseComponentProps {
    /** Content to render inside the container */
    children: ReactNode;
    /** DOM node to mount children into (e.g. document.body). If null, nothing is rendered. */
    container: HTMLElement | null;
}
//# sourceMappingURL=Portal.types.d.ts.map