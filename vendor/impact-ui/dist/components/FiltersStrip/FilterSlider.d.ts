import { MouseEvent as ReactMouseEvent, ReactNode } from 'react';

export interface FilterSliderTag {
    id: string;
    label: string;
    required?: boolean;
    values: {
        label: string;
    }[];
    handleViewAll?: (tag: FilterSliderTag) => void;
}
export interface FilterSliderProps {
    list: FilterSliderTag[];
    width?: string | number;
    isExpanded?: boolean;
    handleExpandClick?: () => void;
    tagsChildren: (item: FilterSliderTag, index: number) => ReactNode;
    containerChildren?: (item: FilterSliderTag, index: number) => ReactNode;
    setShowSeparator?: (show: boolean) => void;
    onNextClick?: (event: React.MouseEvent) => void;
    onPrevClick?: (event: React.MouseEvent) => void;
    currDropShow: number | null;
    handleClickOutside?: (event?: ReactMouseEvent | globalThis.MouseEvent) => void;
}
export declare function FilterSlider({ list, width, isExpanded, handleExpandClick, tagsChildren, containerChildren, setShowSeparator, onNextClick, onPrevClick, currDropShow, handleClickOutside, }: FilterSliderProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace FilterSlider {
    var displayName: string;
}
//# sourceMappingURL=FilterSlider.d.ts.map