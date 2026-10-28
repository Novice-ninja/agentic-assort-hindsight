import { NotificationProps } from './Notification.types';

export type { NotificationProps, DrawerAnchor } from './Notification.types';
export { NotificationHeader } from './NotificationHeader';
export { NotificationFooter } from './NotificationFooter';
export declare function Notification({ title, anchor, isOpen, setIsOpen, className, handleClose, secondaryButtonLabel, onSecondaryButtonClick, primaryButtonLabel, onPrimaryButtonClick, onSettingButtonClick, handleSelectAll, handleMarkReadAll, handleMoveAllPending, handleNotificationDeleteAll, badgesList, notificationTabs, notificationPanels, setNotificationPanels, handleTabChange, moveToPendingDropdownOptions, activeNotiTab, activeBadge, showBadgeLoader, showNotificationListLoader, displayFormat, onNotificationScrollToBottom, scrollThreshold, isWithSearch, onSearchChange, isHoverOnCard, isChipsExpandable, isDeleteAlwaysVisible, isEmptyState, emptyStateTitle, emptyStateDescription, customNotificationJsx, NotificationBodyComponent, }: NotificationProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Notification {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map