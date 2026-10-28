import { PortalProps } from './Portal.types';

export type { PortalProps } from './Portal.types';
/**
 * Renders children into a DOM node (e.g. document.body) using React createPortal.
 * Works on React 17, 18, and 19.
 */
export declare function Portal({ children, container, className, style, id, 'data-testid': dataTestId, }: PortalProps): import('react').ReactPortal | null;
export declare namespace Portal {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map