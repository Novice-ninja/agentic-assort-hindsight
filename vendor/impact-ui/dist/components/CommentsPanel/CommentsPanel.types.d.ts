import { ReactNode } from 'react';

export interface CommentConfiguration {
    disableMarkAsRead?: boolean;
    disableDeleteThread?: boolean;
    disableEditComment?: boolean;
    disableDeleteComment?: boolean;
    disableMarkAsResolved?: boolean;
}
export interface CommentProps {
    comments?: Record<string, unknown[]>;
    resolvedComments?: string[];
    author?: string;
    badgeKey?: string;
    defaultShowPanel?: boolean;
    closeOnItemClick?: boolean;
    configuration?: CommentConfiguration;
    onCommentItemClick?: (...args: unknown[]) => void;
    handleMarkAsUnread?: (id: string) => Promise<unknown>;
    handleMarkAsRead?: (id: string) => Promise<unknown>;
    handleCommentEdit?: (...args: unknown[]) => Promise<unknown>;
    handleSaveComment?: (...args: unknown[]) => Promise<unknown>;
    handleMarkAsResolved?: (cellId: string, commentsForCell: unknown[]) => Promise<unknown>;
    handleUnresolve?: (cellId: string) => Promise<void>;
    handleCommentDelete?: (id: unknown, comment: unknown) => Promise<unknown>;
    handleThreadDelete?: (cellId: string, data: unknown) => Promise<unknown>;
    handleFetchResolvedComments?: () => Promise<{
        comments?: Record<string, unknown[]>;
        resolvedComments?: string[];
    }>;
}
export interface CommentsProviderProps {
    commentProps?: CommentProps;
    children: ReactNode;
}
export interface CommentsPanelProps {
    className?: string;
    style?: React.CSSProperties;
    onClose?: () => void;
    visibleSortOptions?: string[];
}
export interface CommentsContextValue {
    comments: Record<string, unknown[]>;
    resolvedComments: string[];
    commentMode: boolean | string;
    showCommentPanel: boolean;
    commentError?: string | null;
    commentProps?: CommentProps;
    getEffectiveCellId: (cellId: string) => string;
    getLatestUnresolvedThreadId: (cellId: string) => string | null | undefined;
    toggleCommentMode: () => void;
    setShowCommentPanel: (open: boolean) => void;
    setCommentMode: (mode: boolean | string) => void;
    setEditingComment: (comment: unknown) => void;
    handleAddComment: (cellId: string, text: string, mentions?: unknown[]) => void;
    handleUpdateComment: (id: unknown, text: string) => void;
    handleMarkAsResolved: (cellId: string, commentsForCell: unknown[]) => void;
    handleUnresolve: (cellId: string) => void;
    handleMenuClick: (event: unknown, comment: unknown) => void;
    handleMenuClose: () => void;
    registerCommentItemClickHandler: (handler: (id: string) => void) => void;
    onCommentItemClick: (...args: unknown[]) => void;
    onShowResolvedCommentsRequest?: () => void;
    onExitResolvedCommentsView?: () => void;
    clearCommentError: () => void;
    [key: string]: unknown;
}
//# sourceMappingURL=CommentsPanel.types.d.ts.map