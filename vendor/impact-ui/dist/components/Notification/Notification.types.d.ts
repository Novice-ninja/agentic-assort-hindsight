import { ChangeEvent, ReactNode } from 'react';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';
export interface NotificationTabItem {
    label: string;
    value: string;
}
export interface NotificationListItemData {
    id: string | number;
    label: string;
    date: Date;
    time: number;
    description: string;
    selected?: boolean;
    read?: boolean;
    status?: 'success' | 'fail' | 'pending';
    badge?: string;
    bookMarked?: boolean;
    showBookMark?: boolean;
    showOverdueIcon?: boolean;
    showFastApproachingIcon?: boolean;
    showNOverdueIcon?: boolean;
    isSyncing?: boolean;
    titleIconsContent?: ReactNode;
    moveToPendingText?: string;
    checkBoxClick?: NotificationListItemHandler;
    handleSelectChange?: NotificationListItemHandler;
    handleMarkCompleted?: NotificationListItemHandler;
    handleMoveToPending?: NotificationListItemHandler;
    handleMarkAsRead?: NotificationListItemHandler;
    handleBookMark?: NotificationListItemHandler;
    handleDeleteNotification?: NotificationListItemHandler;
    handleDownloadNotification?: NotificationListItemHandler;
    handleRedirect?: NotificationListItemHandler;
    handleSync?: NotificationListItemHandler;
    customActionContent?: ReactNode;
}
export type NotificationListItemHandler = (type?: string, notificationPanels?: NotificationPanelItem[], setNotificationPanels?: (panels: NotificationPanelItem[]) => void, list?: NotificationListItemData) => void;
export interface NotificationPanelItem {
    id: number;
    value: string;
    notificationList?: NotificationListItemData[] | ReactNode;
    handleSettingClick?: () => void;
    filterChip?: unknown;
    selectedFilterChip?: unknown;
    handleApplyFilter?: () => void;
    isMultiSelectFilter?: boolean;
    [key: string]: unknown;
}
export interface NotificationBadgeList {
    id: number;
    value: string;
    lists?: {
        id: number;
        label: string;
        numberOfTypes?: number;
        handleClick?: () => void;
        onClick?: () => void;
    }[];
}
export interface NotificationProps {
    title?: ReactNode;
    anchor?: DrawerAnchor;
    isOpen: boolean;
    setIsOpen?: (open: boolean) => void;
    className?: string;
    handleClose?: () => void;
    secondaryButtonLabel?: string;
    onSecondaryButtonClick?: () => void;
    primaryButtonLabel?: string;
    onPrimaryButtonClick?: () => void;
    onSettingButtonClick?: () => void;
    handleSelectAll?: (type?: string, notificationList?: NotificationListItemData[]) => void;
    handleMarkReadAll?: (type?: string, notificationList?: NotificationListItemData[]) => void;
    handleMoveAllPending?: (type?: string, selectedItems?: NotificationListItemData[], selectedOption?: unknown) => void;
    handleNotificationDeleteAll?: (type?: string, selectedItems?: NotificationListItemData[]) => void;
    badgesList?: NotificationBadgeList[];
    notificationTabs?: NotificationTabItem[];
    notificationPanels?: NotificationPanelItem[];
    setNotificationPanels?: (panels: NotificationPanelItem[]) => void;
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
    /** Optional body component (e.g. for testing); defaults to NotificationBody */
    NotificationBodyComponent?: React.ComponentType<Record<string, unknown>>;
}
/** @deprecated Use NotificationListItemData */
export type NotificationItem = NotificationListItemData;
/** @deprecated Use NotificationPanelItem */
export type NotificationPanel = NotificationPanelItem;
//# sourceMappingURL=Notification.types.d.ts.map