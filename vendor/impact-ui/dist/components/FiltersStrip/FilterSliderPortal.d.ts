import { MutableRefObject } from 'react';
import { FilterSliderTag } from './FilterSlider';

export interface FilterSliderPortalProps {
    filtersContainer: MutableRefObject<(HTMLDivElement | null)[]>;
    index: number;
    tags: {
        label: string;
    }[];
    showButton: boolean;
    tag: FilterSliderTag;
    viewAllAction?: (tag: FilterSliderTag) => void;
    position: {
        x: number;
        y: number;
        width: number;
    };
}
export declare function FilterSliderPortal({ filtersContainer, tags, showButton, tag, viewAllAction, position, }: FilterSliderPortalProps): import("react/jsx-runtime").JSX.Element | null;
export declare namespace FilterSliderPortal {
    var displayName: string;
}
//# sourceMappingURL=FilterSliderPortal.d.ts.map