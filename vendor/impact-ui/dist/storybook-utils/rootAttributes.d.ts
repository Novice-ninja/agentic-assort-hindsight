import { Meta } from '@storybook/react';

/** Builds stable `id` and `data-testid` values for Storybook stories. */
export declare function getRootAutomationArgs(componentSlug: string): {
    readonly id: `impact-ui-${string}`;
    readonly 'data-testid': `impact-ui-${string}`;
};
export declare const rootAutomationArgTypes: {
    readonly id: {
        readonly control: "text";
        readonly description: "Stable DOM id for QA automation and aria references.";
        readonly table: {
            readonly category: "Automation";
        };
    };
    readonly 'data-testid': {
        readonly control: "text";
        readonly description: "Stable data-testid for QA automation.";
        readonly table: {
            readonly category: "Automation";
        };
    };
};
/** Merges default automation args/argTypes into a Storybook meta object. */
export declare function withRootAutomationMeta<C>(componentSlug: string, meta: Meta<C>): Meta<C>;
interface RootAutomationArgs {
    id?: string;
    'data-testid'?: string;
}
/** Play function helper: asserts story args render `id` and `data-testid` on the DOM. */
export declare function playAssertRootIds(canvasElement: HTMLElement, args: RootAutomationArgs): Promise<void>;
export {};
//# sourceMappingURL=rootAttributes.d.ts.map