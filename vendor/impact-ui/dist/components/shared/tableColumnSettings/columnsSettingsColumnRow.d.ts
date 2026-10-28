import { default as React } from 'react';

export declare const capitalizeHeader: (name: any) => any;
/** Figma / TableV36: scrollable rows under Main Column start at 48px; +28px per tree level. */
export declare const SETTINGS_COLUMN_INDENT_STEP = 28;
export declare const SETTINGS_SCROLL_COLUMN_INDENT_BASE = 48;
export declare const SETTINGS_FROZEN_COLUMN_INDENT_BASE = 20;
/** Top-level sortable row — groups drag as a unit with nested children inside. */
export declare const SortableColumnItem: React.NamedExoticComponent<object>;
/** Nested child row — not individually sortable (AG Grid group constraint). */
export declare const NestedColumnItem: React.NamedExoticComponent<object>;
//# sourceMappingURL=columnsSettingsColumnRow.d.ts.map