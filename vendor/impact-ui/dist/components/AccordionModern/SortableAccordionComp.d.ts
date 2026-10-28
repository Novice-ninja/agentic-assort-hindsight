import { AccordionModernItem } from './AccordionModern.types';

type CheckExpandFn = (item: AccordionModernItem) => string;
interface SortableAccordionListProps {
    data: AccordionModernItem[];
    handleMultiAccordionChange: (value: string) => void;
    checkExpand: CheckExpandFn;
}
interface SortableAccordionCompProps {
    item: AccordionModernItem;
    handleMultiAccordionChange: (value: string) => void;
    checkExpand: CheckExpandFn;
    isDragging?: boolean;
    isOverlay?: boolean;
}
export declare function SortableAccordionComp({ item, handleMultiAccordionChange, checkExpand, isDragging, isOverlay, }: SortableAccordionCompProps): import("react/jsx-runtime").JSX.Element;
export declare function SortableAccordionList({ data, handleMultiAccordionChange, checkExpand, }: SortableAccordionListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SortableAccordionComp.d.ts.map