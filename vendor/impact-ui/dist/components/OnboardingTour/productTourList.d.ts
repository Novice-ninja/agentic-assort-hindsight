
export interface ProductTourStep {
    /** Step label shown in the list */
    label: string;
    /** Action button label (e.g. Open, Start, Retry) */
    actionLabel: string;
    /** Called when the step action is clicked */
    onAction?: () => void;
    /**
     * When true, step uses muted completed styling (lighter text + gray action button).
     * Defaults to false.
     */
    completed?: boolean;
}
export interface ProductTourListProps {
    /** Title shown in the opened card. Defaults to "How it works?" */
    title?: string;
    /** Label shown on the minimized chip. Defaults to "Complete your learning" */
    minimizedLabel?: string;
    /** Steps rendered in the opened list */
    steps: ProductTourStep[];
    /**
     * Badge count on the minimized chip.
     * Defaults to the number of incomplete steps.
     */
    remainingCount?: number;
    /** Footer dismiss link label */
    dismissLabel?: string;
    /** Called when the user dismisses the tour entirely */
    onDismiss?: () => void;
    /** Controlled expanded state. When omitted, component manages its own state. */
    expanded?: boolean;
    /** Initial expanded state when uncontrolled. Defaults to false (minimized). */
    defaultExpanded?: boolean;
    /** Called when expanded/minimized state changes */
    onExpandedChange?: (expanded: boolean) => void;
}
export declare const ProductTourList: ({ title, minimizedLabel, steps, remainingCount, dismissLabel, onDismiss, expanded: expandedProp, defaultExpanded, onExpandedChange, }: ProductTourListProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=productTourList.d.ts.map