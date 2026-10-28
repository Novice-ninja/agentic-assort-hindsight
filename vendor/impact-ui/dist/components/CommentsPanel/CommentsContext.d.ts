import { CommentsContextValue } from './CommentsPanel.types';

declare const CommentsContext: import('react').Context<CommentsContextValue | null>;
export declare function CommentsProvider({ commentProps, children }: {
    commentProps: any;
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export declare function useComments(): CommentsContextValue | null;
export { CommentsContext };
export default CommentsProvider;
//# sourceMappingURL=CommentsContext.d.ts.map