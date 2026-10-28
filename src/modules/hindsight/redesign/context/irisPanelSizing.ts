export const IRIS_COMPACT_WIDTH = 448;
export const IRIS_EXPANDED_WIDTH = 640;
export function irisWidthBounds(viewportWidth: number) {
  const maximum = Math.max(1, Math.min(IRIS_EXPANDED_WIDTH, viewportWidth - 16));
  return { minimum: Math.min(320, maximum), maximum };
}
export function clampIrisWidth(width: number, viewportWidth: number): number {
  const { minimum, maximum } = irisWidthBounds(viewportWidth);
  return Math.max(minimum, Math.min(maximum, Number.isFinite(width) ? width : IRIS_COMPACT_WIDTH));
}
