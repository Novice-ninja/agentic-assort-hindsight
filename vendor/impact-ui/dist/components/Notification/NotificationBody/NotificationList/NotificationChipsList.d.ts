import { NotificationListItemData } from '../../Notification.types';

export interface NotificationChipItem {
    id?: number;
    label: string;
    numberOfTypes?: number;
    handleClick?: () => void;
    onClick?: () => void;
}
interface NotificationChipsListProps {
    list: NotificationChipItem[];
    currActiveListType: string;
    setCurrActiveListType: (label: string) => void;
    activeBadge?: string;
    showBadgeLoader?: boolean;
    notificationList: NotificationListItemData[];
    expandList: boolean;
    setExpandList: (value: boolean | ((prev: boolean) => boolean)) => void;
    setSearchExpand: (value: boolean | ((prev: boolean) => boolean)) => void;
}
export declare function NotificationChipsList({ list, currActiveListType, setCurrActiveListType, activeBadge, showBadgeLoader, notificationList, expandList, setExpandList, setSearchExpand, }: NotificationChipsListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NotificationChipsList.d.ts.map