import { ComponentType, ReactNode, ReactPortal } from 'react';

/**
 * Render the app root component.
 * Supports React 17, 18, and 19 (matches legacy `frontend copy` behavior).
 */
export declare function renderAppRoot(Component: ComponentType, rootElement: HTMLElement | null): void;
/**
 * Render a portal (used by Portal for React 17/18/19 compatibility).
 */
export declare function renderPortal(children: ReactNode, container: Element | null): Promise<ReactPortal | null>;
//# sourceMappingURL=renderReactRoot.d.ts.map