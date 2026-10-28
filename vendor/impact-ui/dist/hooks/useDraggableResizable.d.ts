import { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
export declare const BOTTOM_VIEWPORT_MARGIN = 24;
export interface ViewportMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
/** Accepts a single number (all sides) or per-side overrides. */
export type ViewportMarginInput = number | Partial<ViewportMargin>;
export interface UseDraggableResizableOptions {
    /** Starting position/size. Only read once on mount (use `setRect`/`collapseTo` to change later). */
    initialRect: Rect;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    /**
     * Gap kept clear between the panel and the viewport edges while dragging/resizing, so it
     * stops short of the edge instead of touching it. Pass a number for a uniform margin, or
     * per-side values (e.g. `{ top: 56, bottom: 24 }` to also clear a fixed app header).
     * Pass `0` for docked panels that should sit flush with the viewport.
     * @default 0
     */
    viewportMargin?: ViewportMarginInput;
    /** Disables both dragging and resizing (e.g. while in a "full width" mode). */
    disabled?: boolean;
    onChange?: (rect: Rect) => void;
    onDragEnd?: (rect: Rect) => void;
    onResizeEnd?: (rect: Rect) => void;
}
export interface HandleProps {
    onPointerDown: (e: ReactPointerEvent) => void;
    onKeyDown: (e: ReactKeyboardEvent) => void;
}
/** Viewport corner the collapsed panel is pinned to. */
export type CollapseAnchor = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export interface CollapseOptions {
    /** @default 'bottom-right' */
    anchor?: CollapseAnchor;
    /**
     * Margin to inset the collapsed panel from the viewport edges. Pass this when the margin
     * changes in the same event that triggers the collapse - the `viewportMargin` *prop* is
     * still the pre-update value at that point (React batches state), so relying on it would
     * anchor against the wrong gap.
     */
    viewportMargin?: ViewportMarginInput;
}
export interface UseDraggableResizableResult {
    rect: Rect;
    isDragging: boolean;
    isResizing: boolean;
    isCollapsed: boolean;
    setRect: (updater: Rect | ((prev: Rect) => Rect)) => void;
    /** Spread onto the element that should act as the "title bar" drag handle. */
    dragHandleProps: HandleProps;
    /** Spread onto one of the 8 resize handle elements. */
    getResizeHandleProps: (direction: ResizeDirection) => HandleProps & {
        role: 'separator';
        tabIndex: 0;
        'aria-orientation': 'horizontal' | 'vertical';
    };
    /**
     * Shrink to a fixed compact size pinned to a viewport corner (default: bottom-right),
     * remembering the current rect so `restore()` can bring it back.
     */
    collapseTo: (size: {
        width: number;
        height: number;
    }, options?: CollapseOptions) => void;
    /** Restore the rect that was active before the last `collapseTo` call. */
    restore: () => void;
}
/**
 * Headless drag + 8-direction resize behavior for a floating panel (think: Google Meet's
 * pop-out mini window). Framework-agnostic logic lives here so any component (chatbot,
 * modal, side panel, etc.) can opt in just by spreading `dragHandleProps` /
 * `getResizeHandleProps(direction)` onto its own markup.
 *
 * Implementation notes (see chat discussion for rationale):
 * - Uses Pointer Events + `setPointerCapture` (works for mouse, touch, and pen) instead of
 *   plain `mousedown`/`mousemove`, and keeps receiving events on the same element even if the
 *   pointer moves faster than layout, so there is no need for `document`-level listeners.
 * - Batches state updates via `requestAnimationFrame` so dragging/resizing doesn't trigger a
 *   React re-render on every single pixel of pointer movement.
 * - Clamps the rect to the viewport (recomputed on every move, not just drag-start) so the
 *   panel can never be dragged/resized off-screen on any edge, and always keeps a small margin
 *   clear at the bottom of the viewport.
 * - Toggles a `no-select`/`col-resize`-style class on `<body>` while interacting, and always
 *   cleans up listeners + that class on `pointerup`/`pointercancel` and on unmount, even if the
 *   consumer unmounts mid-drag.
 * - Resize handles expose `role="separator"` + keyboard nudging (arrow keys, Shift for a
 *   larger step) for accessibility.
 */
export declare function useDraggableResizable({ initialRect, minWidth, minHeight, maxWidth, maxHeight, viewportMargin, disabled, onChange, onDragEnd, onResizeEnd, }: UseDraggableResizableOptions): UseDraggableResizableResult;
//# sourceMappingURL=useDraggableResizable.d.ts.map