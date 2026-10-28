import { NotificationBodyProps } from './NotificationBody.types';
import { NotificationPanelItem } from '../Notification.types';

type NotificationPanelContentProps = NotificationBodyProps & {
    panel: NotificationPanelItem;
};
export declare function NotificationPanelContent({ panel, expand, badgesList, notificationPanels, setNotificationPanels, handleSelectAll, handleMarkReadAll, handleMoveAllPending, moveToPendingDropdownOptions, handleNotificationDeleteAll, showNotificationListLoader, showBadgeLoader, displayFormat, onNotificationScrollToBottom, scrollThreshold, isWithSearch, onSearchChange, isChipsExpandable, isHoverOnCard, isDeleteAlwaysVisible, isEmptyState, emptyStateTitle, emptyStateDescription, customNotificationJsx, activeBadge, }: NotificationPanelContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NotificationPanelContent.d.ts.map