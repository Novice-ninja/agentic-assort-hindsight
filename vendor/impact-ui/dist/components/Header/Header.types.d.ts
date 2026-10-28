import { MouseEvent, ReactNode } from 'react';
import { Locale } from '../../i18n/types';
import { RootComponentProps } from '../../types';
import { AvatarProps } from '../Avatar/Avatar.types';

/**
 * Drop menu option for the header avatar menu.
 */
export interface HeaderDropMenuOption {
    label: string;
    value?: string;
    onClick?: () => void;
}
/**
 * Header component props.
 * Avatar props can be extended via avatarProps; dropMenuOptions drive the avatar dropdown menu.
 */
export interface HeaderProps extends RootComponentProps {
    /** Title shown next to the logo */
    title?: ReactNode;
    /** User name shown in avatar and default menu option */
    userName?: string;
    /** Called when the logo is clicked */
    handleLogoClick?: () => void;
    /** Show the notification icon */
    showNotificationIcon?: boolean;
    /** Show notification indicator dot */
    notificationIndicator?: boolean;
    /** Called when notification icon is clicked */
    handleNotificationClick?: () => void;
    /** Show the help icon */
    showHelpIcon?: boolean;
    /** Called when help icon is clicked */
    handleHelpClick?: () => void;
    /** Show the message icon */
    showMessageIcon?: boolean;
    /** Called when message icon is clicked */
    handleMessageClick?: () => void;
    /** Show the chatbot "Ask Iris" button */
    showChatBotIcon?: boolean;
    /** Called when chatbot button is clicked */
    handleChatBotClick?: () => void;
    /** When true, message icon is shown but disabled (no click) */
    isMessageIconDisabled?: boolean;
    /** When true, show DND variant of notification icon */
    isNotificationDnd?: boolean;
    /** Options for the avatar dropdown menu */
    dropMenuOptions?: HeaderDropMenuOption[];
    /**
     * Custom popup rendered when the user avatar is clicked.
     * When provided, replaces the default Menu driven by dropMenuOptions.
     * Receives the avatar anchor element (`null` when closed). Open state and `onClose` are owned by the consumer.
     */
    userMenuPopup?: (anchorEl: HTMLElement | null) => ReactNode;
    /** When true, chatbot button is disabled */
    isChatBotDisabled?: boolean;
    /** Optional center section content */
    centerComponent?: ReactNode;
    /** Props passed to the Avatar component (extends AvatarProps) */
    avatarProps?: Partial<AvatarProps>;
    /** Avatar display type */
    avatarType?: AvatarProps['type'];
    /** Show the keyboard shortcuts button */
    showKeyboardShortcuts?: boolean;
    /** Called when the keyboard shortcuts button is clicked */
    handleKeyboardShortcutsClick?: () => void;
    /** When set, shows the comments button in the header */
    commentProps?: Record<string, unknown>;
    /** Called when the comments button is clicked (overrides default panel toggle) */
    onCommentsClick?: (event: MouseEvent) => void;
    /** @deprecated Pass custom panel content; defaults to bundled CommentsPanel when omitted */
    commentsPanel?: ReactNode;
    /** Show the language/locale switcher in the header */
    showLanguageIcon?: boolean;
    /** Locale codes to offer in the language switcher (resolved via LOCALE_REGISTRY) */
    enabledLocales?: Locale[];
    /** Called with the newly selected locale when the user switches language */
    onLanguageChange?: (locale: Locale) => void;
}
//# sourceMappingURL=Header.types.d.ts.map