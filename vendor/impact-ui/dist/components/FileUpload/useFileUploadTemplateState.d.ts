import { MenuOption } from '../Menu';
import { FileUploadProps } from './FileUpload.types';

type FileUploadTemplateProps = Pick<FileUploadProps, 'options' | 'selectedValues' | 'onMenuPrimaryButtonClick' | 'onTertiaryButtonClick'>;
export declare function useFileUploadTemplateState({ options: templateColumnOptions, selectedValues: templateColumnSelections, onMenuPrimaryButtonClick: onTemplateMenuPrimaryClick, onTertiaryButtonClick: onTemplateMenuTertiaryClick, }: FileUploadTemplateProps): {
    selected: string[];
    hasTemplateOptions: boolean;
    menuOptions: MenuOption[];
    handleMenuSelectionChange: (items: string[]) => void;
    handleMenuPrimaryClick: (selectedFileType: string) => void;
    handleMenuTertiaryClick: () => void;
};
export {};
//# sourceMappingURL=useFileUploadTemplateState.d.ts.map