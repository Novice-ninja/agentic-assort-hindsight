import { memo, useState, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpactCheckbox } from '@shared/components/vendor/impact-ui';
import type { ItemCardBackRow, ItemCardFrontRow } from '../../services/itemCardRows';
import type { ByItemTableRow, VisualViewRecommendation } from '../../types';
import { FlippableCard } from './FlippableCard';
import { ItemCardBack } from './ItemCardBack';
import { ItemCardFront } from './ItemCardFront';
import type { ItemCardView } from './itemCardView';
import styles from './ItemCard.module.css';

/** The per-card selection checkbox (bulk edit) is hidden for now; flip to bring it back. */
const SHOW_CARD_CHECKBOX = false;

export interface ItemCardProps {
  view: ItemCardView;
  /** The item's By Item table row. Back-face fallback when `kpisBack` is absent. */
  row?: ByItemTableRow;
  frontMetricRows?: readonly ItemCardFrontRow[];
  backMetricRows?: readonly ItemCardBackRow[];
  /** The item's recommendation as the backend sent it, including the options it will accept. */
  recommendation?: VisualViewRecommendation;
  editable: boolean;
  /** True while this item's override is in flight, on both faces at once. */
  pending: boolean;
  onRecommendationChange: (article: string, value: string) => void;
  onAskAi?: (itemId: string) => void;
  /** Marks this card as the prefetch trigger near the end of the loaded set. */
  prefetchRef?: Ref<HTMLLIElement>;
  /** Whether this card is included in the bulk-edit selection. */
  selected?: boolean;
  onSelectedChange?: (article: string, selected: boolean) => void;
}

/**
 * One item, front and back.
 *
 * Which side is showing is held here rather than in the grid or the store: cards flip
 * independently, so nothing above needs to know, and a flip re-renders this card alone instead
 * of all fifty. Both faces read the same recommendation from the store, so changing it on one side
 * is already the value the other side shows.
 */
export const ItemCard = memo(function ItemCard({
  view,
  row,
  frontMetricRows,
  backMetricRows,
  recommendation,
  editable,
  pending,
  onRecommendationChange,
  onAskAi,
  prefetchRef,
  selected = false,
  onSelectedChange,
}: ItemCardProps) {
  const { t } = useTranslation('hindsight');
  const [flipped, setFlipped] = useState(false);

  const askAi = () => onAskAi?.(view.id);
  const article = view.article?.trim() || view.id;

  // Visual-view `aiRecommendation.narration` wins; the table row is the same field if the card
  // payload omitted it (both endpoints return `{ value, narration }`).
  const resolvedView: ItemCardView = {
    ...view,
    narration: view.narration ?? row?.aiRecommendation?.narration,
  };

  const faceProps = {
    view: resolvedView,
    recommendation,
    editable,
    pending,
    onRecommendationChange,
    onAskAi: askAi,
  };

  return (
    <li
      ref={prefetchRef}
      className={[styles.card, selected ? styles.selected : ''].filter(Boolean).join(' ')}
      data-item-card="true"
      data-selected={selected ? 'true' : undefined}
      data-testid={`hindsight-item-card-${view.id}`}
    >
      {SHOW_CARD_CHECKBOX && onSelectedChange !== undefined && (
        <span
          className={styles.select}
          data-testid={`hindsight-item-card-select-${view.id}`}
        >
          <ImpactCheckbox
            checked={selected}
            withoutFormLabel
            aria-label={t('items.bulkEdit.selectItem', {
              style: view.styleId || article,
            })}
            onChange={(event) => onSelectedChange(article, event.target.checked)}
          />
        </span>
      )}
      <FlippableCard
        flipped={flipped}
        onFlippedChange={setFlipped}
        showBackLabel={t('items.card.showMetrics', { style: view.styleId })}
        showFrontLabel={t('items.card.showImage', { style: view.styleId })}
        front={<ItemCardFront {...faceProps} metricRows={frontMetricRows} />}
        back={<ItemCardBack {...faceProps} row={row} metricRows={backMetricRows} />}
      />
    </li>
  );
});
