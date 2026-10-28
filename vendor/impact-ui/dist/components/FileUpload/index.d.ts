import { FileUploadProps } from './FileUpload.types';

export type { FileUploadProps, FileUploadItem, ValidFileTypeConfig } from './FileUpload.types';
export { FILE_TYPE_MIME_MAP, SIZE_CONVENTIONS } from './FileUpload.types';
export declare function FileUpload({ fileList, onFileListChange, disabled, numberOfFiles: numFiles, validFileTypes, primaryButtonLabel, secondaryButtonLabel, onPrimaryButtonClick, primaryButtonProps, onSecondaryButtonClick, secondaryButtonProps, onClose, customFailedActionButton, options: templateColumnOptions, selectedValues: templateColumnSelections, onMenuPrimaryButtonClick: onTemplateMenuPrimaryClick, onTertiaryButtonClick: onTemplateMenuTertiaryClick, showHeader, headerTitle, headerSubtitle, showCloseIcon, width, height, className, id, 'data-testid': dataTestId, 'aria-label': ariaLabel, role, }: FileUploadProps): import("react/jsx-runtime").JSX.Element;
export declare namespace FileUpload {
    var displayName: string;
}
//# sourceMappingURL=index.d.ts.map