import { RefObject } from 'react';

export declare function useScrollIntoView({ highlightedIndex, containerRef, listRef, isVirtualized, isKeyboardNav, }: {
    highlightedIndex: number;
    containerRef?: RefObject<HTMLElement | null>;
    listRef?: RefObject<{
        scrollToItem: (index: number, align: string) => void;
    } | null>;
    isVirtualized?: boolean;
    isKeyboardNav?: boolean;
}): void;
//# sourceMappingURL=useScrollIntoView.d.ts.map