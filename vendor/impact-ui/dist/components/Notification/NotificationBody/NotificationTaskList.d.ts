import { NotificationChipItem } from './NotificationList/NotificationChipsList';
import { SelectOption } from '../../Select/Select.types';
import { NotificationListItemData, NotificationPanelItem } from '../Notification.types';

interface FilterChipOption {
    label: string;
    value: string | number;
}
export interface NotificationTaskListProps {
    expand?: boolean;
    type: string;
    listTypes?: NotificationChipItem[];
    notificationList: NotificationListItemData[];
    handleSettingClick?: () => void;
    handleSelectAll?: (type?: string, notificationList?: NotificationListItemData[]) => void;
    handleMarkReadAll?: (type?: string, notificationList?: NotificationListItemData[]) => void;
    handleMoveAllPending?: (type?: string, selectedItems?: NotificationListItemData[], selectedOption?: unknown) => void;
    moveToPendingDropdownOptions?: SelectOption[];
    handleNotificationDeleteAll?: (type?: string, selectedItems?: NotificationListItemData[]) => void;
    notificationPanels: NotificationPanelItem[];
    setNotificationPanels?: (panels: NotificationPanelItem[]) => void;
    activeBadge?: string;
    filterChip?: FilterChipOption[];
    handleApplyFilter?: (selected: FilterChipOption | FilterChipOption[] | null) => void;
    isMultiSelectFilter?: boolean;
    showBadgeLoader?: boolean;
    showNotificationListLoader?: boolean;
    selectedFilterChip?: FilterChipOption | FilterChipOption[];
    displayFormat?: string;
    onNotificationScrollToBottom?: () => void | Promise<void>;
    scrollThreshold?: number;
    isWithSearch?: boolean;
    onSearchChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    isChipsExpandable?: boolean;
    isHoverOnCard?: boolean;
    isDeleteAlwaysVisible?: boolean;
    isEmptyState?: boolean;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    customNotificationJsx?: React.ReactNode;
}
export declare function NotificationTaskList({ expand, type, listTypes, notificationList, handleSettingClick, handleSelectAll, handleMarkReadAll, handleMoveAllPending, moveToPendingDropdownOptions, handleNotificationDeleteAll, notificationPanels, setNotificationPanels, activeBadge, filterChip, handleApplyFilter, isMultiSelectFilter, showBadgeLoader, showNotificationListLoader, selectedFilterChip, displayFormat, onNotificationScrollToBottom, scrollThreshold, isWithSearch, onSearchChange, isChipsExpandable, isHoverOnCard, isDeleteAlwaysVisible, isEmptyState, emptyStateTitle, emptyStateDescription, customNotificationJsx, }: NotificationTaskListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NotificationTaskList.d.ts.map