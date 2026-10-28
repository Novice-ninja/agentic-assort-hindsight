import { OptionPropsTyped, SelectOption } from './Select.types';

export declare const getSelectedChildrenCount: (parent: SelectOption, selectedOptions: SelectOption | SelectOption[] | undefined) => number;
export declare const areAllChildrenSelected: (option: SelectOption, selectedOptions: SelectOption | SelectOption[] | undefined) => boolean;
export declare const Option: ({ isLoadingOption, isDisabled, customOptionProps, ...props }: OptionPropsTyped) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=optionList.d.ts.map