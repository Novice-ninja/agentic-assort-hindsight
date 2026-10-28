import { SelectOption } from '../Select.types';

export declare function useTypeahead({ options, setHighlightedIndex, isActive, }: {
    options?: SelectOption[];
    setHighlightedIndex: (index: number) => void;
    isActive?: boolean;
}): {
    handleTypeahead: (e: React.KeyboardEvent) => boolean;
    resetBuffer: () => void;
};
//# sourceMappingURL=useTypeahead.d.ts.map