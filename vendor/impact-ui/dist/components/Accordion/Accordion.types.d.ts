import { ReactNode } from 'react';
import { AccordionProps as MUIAccordionProps } from '@mui/material/Accordion';
import { BaseComponentProps } from '../../types';

/**
 * Data structure for individual accordion items
 */
export interface AccordionItemData {
    /**
     * Unique identifier/value for the accordion item
     * Used to track expanded state
     */
    value: string;
    /**
     * Content displayed in the accordion header/summary
     * Can be a string or React component
     */
    header: ReactNode;
    /**
     * Content displayed when the accordion is expanded
     */
    content: ReactNode;
    /**
     * Whether this specific item is disabled
     * @default false
     */
    disabled?: boolean;
}
/**
 * Data structure for single accordion mode
 */
export interface SingleAccordionData {
    /**
     * Unique identifier/value for the accordion item
     */
    value: string;
    /**
     * Content displayed in the accordion header/summary
     */
    header: ReactNode;
    /**
     * Content displayed when the accordion is expanded
     */
    content: ReactNode;
}
export interface AccordionProps extends Omit<BaseComponentProps, 'children'>, Omit<MUIAccordionProps, 'expanded' | 'onChange' | 'children' | 'disabled'> {
    /**
     * Current expanded state. For single expansion mode, this is a string value.
     * For multi-expansion mode (isMultiExpanded=true), this is an array of string values.
     * @example
     * // Single expansion
     * expanded="panel1"
     *
     * // Multi expansion
     * expanded={['panel1', 'panel3']}
     */
    expanded: string | string[];
    /**
     * Callback to update the expanded state.
     * Required when not using the onChange prop for controlled behavior.
     * @example
     * const [expanded, setExpanded] = useState<string>('');
     * <Accordion expanded={expanded} setExpanded={setExpanded} data={items} />
     */
    setExpanded?: (value: string | string[]) => void;
    /**
     * When true, multiple accordion items can be expanded simultaneously.
     * When false (default), only one item can be expanded at a time.
     * @default false
     * @example
     * <Accordion isMultiExpanded expanded={['panel1', 'panel2']} ... />
     */
    isMultiExpanded?: boolean;
    /**
     * Array of accordion items to render.
     * Each item should have a unique `value`, `header`, and `content`.
     * Required when isSingleItem is false or not provided.
     * @example
     * const data = [
     *   { value: 'panel1', header: 'Section 1', content: <p>Content 1</p> },
     *   { value: 'panel2', header: 'Section 2', content: <p>Content 2</p> },
     * ];
     */
    data?: AccordionItemData[];
    /**
     * Custom onChange handler for accordion state changes.
     * When provided, this takes precedence over setExpanded.
     * Receives the value of the accordion item that was toggled.
     * @param value - The value of the accordion item being toggled
     * @example
     * <Accordion onChange={(value) => console.log('Toggled:', value)} ... />
     */
    onChange?: (value: string) => void;
    /**
     * When true, renders a single accordion item using singleData prop.
     * Useful for standalone accordions without a list of items.
     * @default false
     */
    isSingleItem?: boolean;
    /**
     * Data for single accordion mode (when isSingleItem is true).
     * Contains value, header, and content for the single accordion.
     * @example
     * <Accordion
     *   isSingleItem
     *   singleData={{ value: 'faq', header: 'FAQ', content: '...' }}
     *   expanded="faq"
     * />
     */
    singleData?: SingleAccordionData;
    /**
     * Disables all accordion items when true.
     * Individual items can also be disabled via their disabled property in data array.
     * @default false
     */
    disabled?: boolean;
}
//# sourceMappingURL=Accordion.types.d.ts.map