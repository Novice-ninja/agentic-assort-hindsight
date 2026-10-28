import { BaseComponentProps } from '../../types';

/** Single toolkit card item */
export interface ToolKitItem {
    name: string;
    description: string;
    cta?: string;
    details?: string;
    folderContent?: string[];
    isNewProduct?: boolean;
    releaseStatus?: string;
}
/** Smart AI item; extends toolkit item with optional new-product badge */
export type SmartAiItem = ToolKitItem;
/** Configuration menu item (logo, label, description) */
export interface ConfigurationMenuItem {
    logo: string;
    label: string;
    desc: string;
}
/** Agentic use case (for constants / panel content) */
export interface AgenticUsecaseItem {
    name: string;
    description: string;
    background: string;
    borderColor: string;
    backgroundImage: string;
    image: string;
}
/** Client logo entry */
export interface ClientLogoItem {
    name: string;
    image: string;
}
export interface HomePageProps extends BaseComponentProps {
    /** Client name used to resolve and show client logo */
    clientName?: string;
    /** Shown in welcome text */
    userName?: string;
    /** Toolkit cards (left panel) */
    toolKitItems?: ToolKitItem[];
    /** Smart AI solution cards */
    smartAiItems?: SmartAiItem[];
    /** Items for the Configurations dropdown */
    configurationsMenuItems?: ConfigurationMenuItem[];
    /** Initial active toolkit item */
    activeToolKitItem?: ToolKitItem | null;
    /** Initial active Smart AI item */
    activeSmartAiItem?: SmartAiItem | null;
    /** Called when Launch is clicked for a toolkit item */
    onLaunchClick?: (item: ToolKitItem) => void;
    /** Called when Book demo is clicked (Smart AI or agentic use case) */
    onBookDemoClick?: (item: SmartAiItem | AgenticUsecaseItem) => void;
    /** Called when "View released notes" is clicked */
    onViewReleasedNotesClick?: () => void;
    /** Called when a configuration menu item is chosen */
    onConfigurationsClick?: (item: ConfigurationMenuItem) => void;
    /** Called when "Know more" is clicked on a Smart AI item */
    onKnowMoreClick?: (item: SmartAiItem) => void;
    /** Whether to show the Configurations button */
    showConfigurationsButton?: boolean;
}
//# sourceMappingURL=HomePage.types.d.ts.map