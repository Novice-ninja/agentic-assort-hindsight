/**
 * Names the element that actually carries the `grid`/`treegrid` role.
 *
 * AG Grid 36's own `api.setGridAriaProperty('label', …)` writes the attribute onto `.ag-root`,
 * which is `role="presentation"` — so the name is discarded and the grid is announced unnamed. The
 * `aria-label` prop is no help either: v36 validates grid options, does not recognise it, and drops
 * it with a console warning. Setting the attribute where the role lives is the only route left.
 *
 * @param container The adapter's own wrapper element, not vendor DOM.
 */
export function nameGridForScreenReaders(
  container: HTMLElement | null,
  label: string,
): void {
  const grid = container?.querySelector('[role="grid"], [role="treegrid"]');
  grid?.setAttribute('aria-label', label);
}
