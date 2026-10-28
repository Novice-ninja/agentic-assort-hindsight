import { ModalProps } from '../Modal/Modal.types';

/**
 * BottomSheet is a Modal that slides up from the bottom.
 * Props extend ModalProps; isBottomSheet and isExpanded are internal.
 * onExpand is overridden to pass the new expanded state to the consumer.
 */
export interface BottomSheetProps extends Omit<ModalProps, 'isBottomSheet' | 'isExpanded' | 'onExpand'> {
    /** Callback when expand/collapse is toggled (receives new expanded state) */
    onExpand?: (expanded: boolean) => void;
}
//# sourceMappingURL=BottomSheet.types.d.ts.map