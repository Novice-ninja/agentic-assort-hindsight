import { NotificationListItemData, NotificationPanelItem } from '../../Notification.types';

interface NotificationListItemProps {
    list: NotificationListItemData;
    type: string;
    notificationPanels: NotificationPanelItem[];
    setNotificationPanels?: (panels: NotificationPanelItem[]) => void;
    displayFormat: string;
    isHoverOnCard?: boolean;
    isDeleteAlwaysVisible?: boolean;
}
export declare function NotificationListItem({ list, type, notificationPanels, setNotificationPanels, displayFormat, isHoverOnCard, isDeleteAlwaysVisible, }: NotificationListItemProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NotificationListItem.d.ts.map