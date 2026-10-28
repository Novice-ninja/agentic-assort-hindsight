/** Shared id used in component root-attribute compliance tests */
export declare const COMPONENT_ROOT_ID = "impact-ui-component-root-id";
/** Shared data-testid used in component root-attribute compliance tests */
export declare const COMPONENT_ROOT_TEST_ID = "impact-ui-component-root";
/**
 * Asserts that an element with the given `id` exists in the document.
 * Returns the element for further assertions.
 */
export declare function expectElementWithId(id?: string): HTMLElement;
/**
 * Asserts that an element with the given `data-testid` exists in the document.
 */
export declare function expectElementWithTestId(testId?: string): HTMLElement;
/**
 * Asserts both `id` and `data-testid` are present on the same root element.
 */
export declare function expectRootAttributes(options?: {
    id?: string;
    testId?: string;
    element?: HTMLElement | null;
}): HTMLElement;
//# sourceMappingURL=rootAttributes.d.ts.map