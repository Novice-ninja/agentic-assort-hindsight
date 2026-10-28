import { ChangeEvent, ReactNode } from 'react';
import { NotificationTabItem, NotificationPanelItem, NotificationBadgeList } from '../Notification.types';

export interface NotificationBodyProps {
    expand?: boolean;
    badgesList?: NotificationBadgeList[];
    notificationTabs: NotificationTabItem[];
    notificationPanels: NotificationPanelItem[];
    setNotificationPanels?: (panels: NotificationPanelItem[]) => void;
    onSettingButtonClick?: () => void;
    handleSelectAll?: () => void;
    handleMarkReadAll?: () => void;
    handleMoveAllPending?: () => void;
    handleNotificationDeleteAll?: () => void;
    handleTabChange?: (value: string) => void;
    moveToPendingDropdownOptions?: unknown;
    activeNotiTab?: string;
    activeBadge?: string;
    showBadgeLoader?: boolean;
    showNotificationListLoader?: boolean;
    displayFormat?: string;
    onNotificationScrollToBottom?: () => void;
    scrollThreshold?: number;
    isWithSearch?: boolean;
    onSearchChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    isHoverOnCard?: boolean;
    isChipsExpandable?: boolean;
    isDeleteAlwaysVisible?: boolean;
    isEmptyState?: boolean;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    customNotificationJsx?: ReactNode;
    /** Optional custom render for each tab panel (default: placeholder) */
    renderPanel?: (item: NotificationPanelItem, index: number) => ReactNode;
}
//# sourceMappingURL=NotificationBody.types.d.ts.map