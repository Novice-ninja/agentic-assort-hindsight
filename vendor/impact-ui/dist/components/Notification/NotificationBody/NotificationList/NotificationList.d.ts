import { SelectOption } from '../../../Select/Select.types';
import { NotificationListItemData, NotificationPanelItem } from '../../Notification.types';

export interface NotificationListProps {
    expand?: boolean;
    type: string;
    title?: string;
    notificationList: NotificationListItemData[];
    notificationPanels: NotificationPanelItem[];
    setNotificationPanels?: (panels: NotificationPanelItem[]) => void;
    handleSelectAll?: (type?: string, notificationList?: NotificationListItemData[]) => void;
    handleMarkReadAll?: (type?: string, notificationList?: NotificationListItemData[]) => void;
    handleMoveAllPending?: (type?: string, selectedItems?: NotificationListItemData[], selectedOption?: unknown) => void;
    moveToPendingDropdownOptions?: SelectOption[];
    handleNotificationDeleteAll?: (type?: string, selectedItems?: NotificationListItemData[]) => void;
    showNotificationListLoader?: boolean;
    showBadgeLoader?: boolean;
    displayFormat?: string;
    onNotificationScrollToBottom?: () => void | Promise<void>;
    scrollThreshold?: number;
    isHoverOnCard?: boolean;
    isDeleteAlwaysVisible?: boolean;
    isEmptyState?: boolean;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    customNotificationJsx?: React.ReactNode;
}
export declare function getPanelNotificationList(panel: NotificationPanelItem): NotificationListItemData[];
export declare function NotificationList({ expand, type, title, notificationList, notificationPanels, setNotificationPanels, handleSelectAll, handleMarkReadAll, handleMoveAllPending, moveToPendingDropdownOptions, handleNotificationDeleteAll, showNotificationListLoader, showBadgeLoader, displayFormat, onNotificationScrollToBottom, scrollThreshold, isHoverOnCard, isDeleteAlwaysVisible, isEmptyState, emptyStateTitle, emptyStateDescription, customNotificationJsx, }: NotificationListProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NotificationList.d.ts.map