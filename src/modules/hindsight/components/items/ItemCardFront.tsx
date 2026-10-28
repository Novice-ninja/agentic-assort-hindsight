import { useTranslation } from 'react-i18next';
import { NO_COMPARISON } from '../../services/metricCatalog';
import {
  ITEM_CARD_FRONT_ROWS,
  ITEM_CARD_STYLE_ID_ROW,
  findKpi,
  type ItemCardFrontRow,
} from '../../services/itemCardRows';
import type { VisualViewKpi, VisualViewRecommendation } from '../../types';
import { AiInsightButton } from '../cells/AiInsightButton';
import { NarrationTooltip } from '../overview/NarrationTooltip';
import { ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import { ItemThumbnail } from '../cells/ItemThumbnail';
import { ItemCardRecommendation } from './ItemCardRecommendation';
import type { ItemCardView } from './itemCardView';
import styles from './ItemCardFront.module.css';

/** The recommendation row at the foot of each card is hidden for now; flip to bring it back. */
const SHOW_CARD_RECOMMENDATION = false;

export interface ItemCardFrontProps {
  view: ItemCardView;
  /** Metric rows to show when `kpisFront` is empty; defaults to the static front set. */
  metricRows?: readonly ItemCardFrontRow[];
  recommendation?: VisualViewRecommendation;
  editable: boolean;
  pending: boolean;
  onRecommendationChange: (article: string, value: string) => void;
  onAskAi?: () => void;
}

function kpiValue(kpi: VisualViewKpi, locale: string): string {
  if (kpi.formattedValue.length > 0) return kpi.formattedValue;
  return kpi.value === null
    ? NO_COMPARISON
    : new Intl.NumberFormat(locale).format(kpi.value);
}

function kpiRowKey(kpi: VisualViewKpi, index: number): string {
  const id = kpi.name ?? kpi.key;
  return id.length > 0 ? id : `front-${index}`;
}

/** The image-led face: what the item looks like, and the figures the backend sent for the front. */
export function ItemCardFront({
  view,
  metricRows = ITEM_CARD_FRONT_ROWS,
  recommendation,
  editable,
  pending,
  onRecommendationChange,
  onAskAi,
}: ItemCardFrontProps) {
  const { t, i18n } = useTranslation('hindsight');
  const backendRows = view.kpisFront;

  function configuredValue(row: ItemCardFrontRow): string {
    if (row.source === 'styleId') {
      return view.styleId.length > 0 ? view.styleId : NO_COMPARISON;
    }

    const kpi = findKpi(view.kpis, row.kpiKeys ?? [row.id]);
    if (kpi === undefined) return NO_COMPARISON;
    return kpiValue(kpi, i18n.language);
  }

  return (
    <div className={styles.front} data-testid="hindsight-item-card-front">
      <div className={styles.imageWrap}>
        <ItemThumbnail
          imageUrl={view.imageUrl}
          description={view.title}
          itemId={view.styleId}
          size="lg"
        />
        {view.hasAiInsight && (
          <NarrationTooltip narration={view.narration}>
            <AiInsightButton
              className={styles.aiButton}
              label={t('items.table.askAi', { style: view.styleId })}
              onClick={onAskAi}
            />
          </NarrationTooltip>
        )}
      </div>

      <p className={styles.description}>
        <Tooltip title={view.title} variant="tertiary">
          <span>{view.title}</span>
        </Tooltip>
      </p>

      <dl className={styles.metrics}>
        <div>
          <dt>{ITEM_CARD_STYLE_ID_ROW.label}</dt>
          <dd>{view.styleId.length > 0 ? view.styleId : NO_COMPARISON}</dd>
        </div>
        {backendRows.length > 0
          ? backendRows.map((kpi, index) => (
              <div key={kpiRowKey(kpi, index)}>
                <dt>{kpi.label}</dt>
                <dd>{kpiValue(kpi, i18n.language)}</dd>
              </div>
            ))
          : metricRows
              .filter((row) => row.source !== 'styleId')
              .map((row) => (
                <div key={row.id}>
                  <dt>{row.label}</dt>
                  <dd>{configuredValue(row)}</dd>
                </div>
              ))}
      </dl>

      {SHOW_CARD_RECOMMENDATION && (
        <div className={styles.recommendation}>
          <span>{view.recommendationLabel}</span>
          {/* Setting a recommendation is not a request to see the other side of the card. */}
          <span data-no-flip>
            <ItemCardRecommendation
              view={view}
              recommendation={recommendation}
              editable={editable}
              pending={pending}
              onRecommendationChange={onRecommendationChange}
            />
          </span>
        </div>
      )}
    </div>
  );
}
