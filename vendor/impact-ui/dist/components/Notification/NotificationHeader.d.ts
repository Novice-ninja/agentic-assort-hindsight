import { DrawerAnchor } from './Notification.types';

export interface NotificationHeaderProps {
    title?: React.ReactNode;
    expand: boolean;
    setExpand: (expand: boolean) => void;
    toggleDrawer: (anchor: DrawerAnchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    anchor: DrawerAnchor;
    showBadgeLoader?: boolean;
}
export declare function NotificationHeader({ title, expand, setExpand, toggleDrawer, anchor, }: NotificationHeaderProps): React.ReactElement;
export declare namespace NotificationHeader {
    var displayName: string;
}
//# sourceMappingURL=NotificationHeader.d.ts.map