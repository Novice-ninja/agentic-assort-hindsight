/** Matches the wizard card's right inset (`inset: 0 24px 24px`). */
const CARD_EDGE_PX = 24;

export interface GlowBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Right inset of the page glow. Expanded Cluster Copilot covers the card's
 * right edge, so the stroke stops at the chat's left. Any other chat state
 * keeps the stroke on the card's own right edge.
 */
export function describeGlowRightInset(
  page: Pick<GlowBox, 'left' | 'right' | 'top' | 'bottom'>,
  chat: GlowBox | null,
  expanded: boolean,
): number {
  if (!expanded || !chat || chat.width < 8 || chat.height < 8) return CARD_EDGE_PX;
  const pageHeight = page.bottom - page.top;
  const coversRightEdge =
    chat.left > page.left + 16 &&
    chat.left < page.right - 8 &&
    chat.top < page.top + 80 &&
    chat.height > pageHeight * 0.55;
  if (!coversRightEdge) return CARD_EDGE_PX;
  return Math.max(CARD_EDGE_PX, Math.round(page.right - chat.left));
}
