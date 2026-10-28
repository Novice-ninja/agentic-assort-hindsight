import { ReactNode } from 'react';
import { AriaProps, BaseComponentProps } from '../types';

export interface RootDomAttributeProps extends Pick<BaseComponentProps, 'id' | 'data-testid' | 'className' | 'style'>, Partial<AriaProps> {
}
type PickableProps = RootDomAttributeProps & {
    children?: ReactNode;
};
/**
 * Extracts root DOM attributes (`id`, `data-testid`, `className`, `style`, common `aria-*`, `role`)
 * from component props so they can be applied to the outermost interactive element.
 */
export declare function pickRootDomAttributes<T extends PickableProps>(props: T): {
    root: RootDomAttributeProps;
    rest: Omit<T, keyof PickableProps>;
};
export {};
//# sourceMappingURL=pickRootDomAttributes.d.ts.map