import { FilterPanelProps } from './FilterPanel.types';

export type { FilterPanelProps, FilterPanelItem, FilterPanelAnchor, FilterPanelSize, } from './FilterPanel.types';
export { FilterPanelHeader } from './FilterPanelHeader';
export { PanelFooter } from './PanelFooter';
export { PanelSidebar } from './PanelSidebar';
/**
 * Filter panel (drawer) with sidebar tabs and optional footer buttons.
 * Renders the active filter's content in the right panel.
 */
export declare function FilterPanel({ className, title, size, anchor, isOpen, setIsOpen, active, setActive, filters, handleClose, primaryButtonLabel, onPrimaryButtonClick, secondaryButtonLabel, onSecondaryButtonClick, tertiaryButtonLabel, onTertiaryButtonClick, quaternaryButtonLabel, onQuaternaryButtonClick, primaryButtonProps, secondaryButtonProps, tertiaryButtonProps, quaternaryButtonProps, alwaysRender, 'data-testid': dataTestId, ...drawerProps }: FilterPanelProps): import("react/jsx-runtime").JSX.Element;
export declare namespace FilterPanel {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map