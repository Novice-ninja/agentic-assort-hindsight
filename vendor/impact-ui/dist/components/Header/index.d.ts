import { HeaderProps } from './Header.types';

export type { HeaderProps, HeaderDropMenuOption } from './Header.types';
/**
 * App header with logo, title, actions (help, message, notification, chatbot) and avatar menu.
 */
export declare function Header({ title, userName, handleLogoClick, showNotificationIcon, notificationIndicator, handleNotificationClick, showHelpIcon, handleHelpClick, showMessageIcon, handleMessageClick, showChatBotIcon, handleChatBotClick, isMessageIconDisabled, isNotificationDnd, dropMenuOptions, userMenuPopup, isChatBotDisabled, centerComponent, avatarProps, avatarType, showKeyboardShortcuts, handleKeyboardShortcutsClick, commentProps, onCommentsClick, commentsPanel, className, id, 'data-testid': dataTestId, role, showLanguageIcon, enabledLocales, onLanguageChange, }: HeaderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Header {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map