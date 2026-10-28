import { ReactNode } from 'react';
import { BaseComponentProps } from '../../types';

/**
 * Single accordion item for AccordionModern
 */
export interface AccordionModernItem {
    /** Unique id (required for drag-and-drop) */
    id: string;
    /** Value used for expansion state */
    value: string;
    /** Header content */
    header: ReactNode;
    /** Body content when expanded */
    content: ReactNode;
    /** Whether this item is disabled */
    disabled?: boolean;
    /** Optional count badge next to header (e.g. number of children) */
    childCount?: number;
}
export interface AccordionModernProps extends BaseComponentProps {
    /** Whether items can be reordered by drag-and-drop */
    draggable?: boolean;
    /** Controlled expanded value (string for single, or string[] for multi) */
    expanded: string | string[];
    /** Callback when expansion changes */
    setExpanded: (value: string | string[]) => void;
    /** Allow multiple items expanded at once */
    isMultiExpanded?: boolean;
    /** List of accordion items (must have `id` when draggable) */
    data: AccordionModernItem[];
    /** Optional change callback (if provided, setExpanded may still be called) */
    onChange?: (value: string) => void;
}
//# sourceMappingURL=AccordionModern.types.d.ts.map