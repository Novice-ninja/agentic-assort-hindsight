import { ReactNode } from 'react';

export interface ShortcutsProviderProps {
    /** false = off; true = all namespaces; string[] = allow-list */
    enabled?: boolean | string[];
    children: ReactNode;
}
export declare function ShortcutsProvider({ enabled, children }: ShortcutsProviderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ShortcutsProvider.d.ts.map