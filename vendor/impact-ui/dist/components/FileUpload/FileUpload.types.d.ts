import { ReactNode } from 'react';
import { RootComponentProps } from '../../types';
import { ButtonProps } from '../Button';

/**
 * Single file item in the upload list (with progress, failure, retry, etc.).
 */
export interface FileUploadItem {
    file: File;
    progress?: number;
    isUploadRunning?: boolean;
    failed?: boolean;
    failedMessage?: string;
    disabled?: boolean;
    timeRemaining?: number;
    onPause?: () => void;
    onRetry?: () => void;
}
/**
 * Valid file type configuration (fileType key, optional template download, type override).
 */
export interface ValidFileTypeConfig {
    fileType: string;
    templateDownloader?: () => void;
    typeOverride?: boolean;
}
/**
 * MIME type map by file type key (extends record for custom keys).
 */
export declare const FILE_TYPE_MIME_MAP: Record<string, string[]>;
export declare const SIZE_CONVENTIONS: readonly ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
export interface FileUploadProps extends RootComponentProps {
    fileList: FileUploadItem[];
    onFileListChange: (list: FileUploadItem[]) => void;
    disabled?: boolean;
    numberOfFiles?: number;
    validFileTypes?: ValidFileTypeConfig[];
    /** Column labels for template download menu; enables Template Preview grid when set */
    options?: string[];
    /** Initial selected template columns (mapped to camelCase internally) */
    selectedValues?: string[];
    /** Called when the primary template format button is clicked in the options menu (e.g. xlsx) */
    onMenuPrimaryButtonClick?: (fileType: string, selectedColumns: string[]) => void;
    /** Called when the secondary template format button is clicked in the options menu (e.g. csv) */
    onTertiaryButtonClick?: (selectedColumns: string[]) => void;
    primaryButtonLabel?: ReactNode;
    secondaryButtonLabel?: ReactNode;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    primaryButtonProps?: Partial<ButtonProps>;
    secondaryButtonProps?: Partial<ButtonProps>;
    onClose?: () => void;
    customFailedActionButton?: ReactNode;
    /** Whether to show the header section (default true) */
    showHeader?: boolean;
    /** Title text in the header (default "Upload Your File") */
    headerTitle?: string;
    /** Subtitle text in the header; defaults to "You can upload up to N file(s)" */
    headerSubtitle?: string;
    /** Whether to show the close icon in the header (default true) */
    showCloseIcon?: boolean;
    /** Custom width for the upload container */
    width?: string | number;
    /** Custom height for the drop zone area */
    height?: string | number;
}
//# sourceMappingURL=FileUpload.types.d.ts.map