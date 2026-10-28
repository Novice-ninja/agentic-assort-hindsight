import { ReactElement } from 'react';

export interface RootAutomationAttrs {
    id: string;
    'data-testid': string;
}
export declare const defaultRootAutomationAttrs: RootAutomationAttrs;
/**
 * Registers a unit test that verifies a component forwards `id` and `data-testid` to the DOM.
 *
 * @example
 * itForwardsRootId((attrs) => <Button {...attrs}>Save</Button>);
 */
export declare function itForwardsRootId(renderComponent: (attrs: RootAutomationAttrs) => ReactElement): void;
//# sourceMappingURL=itForwardsRootId.d.ts.map