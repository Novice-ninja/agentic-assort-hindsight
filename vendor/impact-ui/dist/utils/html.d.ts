/**
 * Utility to prepare content for React's dangerouslySetInnerHTML
 * Accepts either a string of HTML or a DOM Node/Element
 * Returns the { __html: string } object React expects
 */
export interface InnerHTML {
    __html: string;
}
/**
 * Convert content to an object suitable for dangerouslySetInnerHTML
 * @param content - HTML string or DOM Node/Element
 * @returns Object with __html property containing the HTML string
 *
 * @example
 * <div dangerouslySetInnerHTML={toInnerHTML('<strong>Bold</strong>')} />
 * <div dangerouslySetInnerHTML={toInnerHTML(domElement)} />
 */
export declare function toInnerHTML(content: string | Node | Element | null | undefined): InnerHTML;
//# sourceMappingURL=html.d.ts.map