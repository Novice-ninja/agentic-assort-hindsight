import { AccordionProps } from './Accordion.types';

/**
 * Accordion component for collapsible content sections.
 * Supports single and multi-expansion modes, single item mode, and disabled states.
 * Meets WCAG 2.1 Level AA accessibility standards.
 *
 * @example
 * // Single expansion mode
 * const [expanded, setExpanded] = useState('');
 * <Accordion expanded={expanded} setExpanded={setExpanded} data={items} />
 *
 * // Multi expansion mode
 * const [expanded, setExpanded] = useState<string[]>([]);
 * <Accordion isMultiExpanded expanded={expanded} setExpanded={setExpanded} data={items} />
 *
 * // Single item mode
 * <Accordion isSingleItem singleData={item} expanded="" setExpanded={setExpanded} />
 */
export declare const Accordion: import('react').ForwardRefExoticComponent<Omit<AccordionProps, "ref"> & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=index.d.ts.map