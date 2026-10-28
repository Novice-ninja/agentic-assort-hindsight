export declare const onColMenuFreezeClick: (params: any) => void;
/**
 * AG Grid v36 migration (v33): api.getModel() was removed.
 * Custom metadata previously hung on the row model is stored on api.__impactTableMeta instead.
 */
export declare const getTableMeta: (api: any) => any;
export declare const freezeColumn: (params: any, isPinned: any) => void;
export declare const onColMenuAutoAdjustClick: (params: any) => void;
export declare const sortFunc: (columnData: any, sortBy: any, api: any) => void;
export declare const getMainMenuItems: (params: any) => (string | {
    name: string;
    cssClasses: string[];
    subMenu?: undefined;
    disabled?: undefined;
    action?: undefined;
} | {
    name: string;
    subMenu: ({
        name: string;
        action: () => void;
        checked: boolean;
    } | {
        name: string;
        action: () => void;
        checked?: undefined;
    })[];
    disabled: boolean;
    cssClasses?: undefined;
    action?: undefined;
} | {
    name: string;
    action: () => void;
    cssClasses?: undefined;
    subMenu?: undefined;
    disabled?: undefined;
} | {
    name: string;
    subMenu: ({
        name: string;
        action: () => void;
        checked: boolean;
        disabled?: undefined;
    } | {
        name: string;
        action: () => void;
        checked: boolean;
        disabled: boolean;
    })[];
    cssClasses?: undefined;
    disabled?: undefined;
    action?: undefined;
} | {
    name: string;
    disabled: boolean;
    cssClasses?: undefined;
    subMenu?: undefined;
    action?: undefined;
})[];
export declare const Columns: import('react').ForwardRefExoticComponent<import('react').RefAttributes<unknown>>;
export declare const updateFontSizeOnToolPanel: (fontSizeType: any) => string;
//# sourceMappingURL=tableFunctions.d.ts.map