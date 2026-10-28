import { useTranslation } from 'react-i18next';
import { ITEM_CARD_BACK_ROWS, type ItemCardBackRow } from '../../services/itemCardRows';
import { NO_COMPARISON } from '../../services/metricCatalog';
import type {
  ByItemChange,
  ByItemComparisonCell,
  ByItemNumericCell,
  ByItemTableRow,
  VisualViewKpi,
  VisualViewRecommendation,
} from '../../types';
import { AiInsightButton } from '../cells/AiInsightButton';
import { NarrationTooltip } from '../overview/NarrationTooltip';
import { ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import { ItemThumbnail } from '../cells/ItemThumbnail';
import { ItemCardRecommendation } from './ItemCardRecommendation';
import type { ItemCardView } from './itemCardView';
import styles from './ItemCardBack.module.css';

/** The recommendation row at the foot of each card is hidden for now; flip to bring it back. */
const SHOW_CARD_RECOMMENDATION = false;

export interface ItemCardBackProps {
  view: ItemCardView;
  /** The item's By Item table row. Used when `kpisBack` is empty, and for department/narration. */
  row?: ByItemTableRow;
  /** Metric rows to show when `kpisBack` is empty; defaults to the static back set. */
  metricRows?: readonly ItemCardBackRow[];
  recommendation?: VisualViewRecommendation;
  editable: boolean;
  pending: boolean;
  onRecommendationChange: (article: string, value: string) => void;
  onAskAi?: () => void;
}

type MetricCell = ByItemComparisonCell | ByItemNumericCell;

const BACK_STRONG_COUNT = 0;

/** Cells arrive from the network, so a field that is absent or the wrong shape reads as absent. */
function isMetric(cell: unknown): cell is MetricCell {
  return (
    typeof cell === 'object' &&
    cell !== null &&
    'value' in cell &&
    typeof (cell as { value: unknown }).value === 'number'
  );
}

function changeOf(cell: MetricCell): ByItemChange | null {
  return 'change' in cell ? (cell.change ?? null) : null;
}

function kpiRowKey(kpi: VisualViewKpi, index: number): string {
  const id = kpi.name ?? kpi.key;
  return id.length > 0 ? id : `back-${index}`;
}

function kpiValue(kpi: VisualViewKpi, locale: string): string {
  if (kpi.formattedValue.length > 0) return kpi.formattedValue;
  return kpi.value === null
    ? NO_COMPARISON
    : new Intl.NumberFormat(locale).format(kpi.value);
}

function badgeFromKpi(kpi: VisualViewKpi): { text: string; status: string } | null {
  const comparison = kpi.comparison;
  if (comparison === undefined || comparison === null) return null;
  const entry = Array.isArray(comparison) ? comparison[0] : comparison;
  if (entry === undefined || entry.delta === null) return null;
  const sign = entry.delta > 0 ? '+' : '';
  const status =
    entry.sentiment === 'positive' || entry.sentiment === 'negative'
      ? entry.sentiment
      : 'neutral';
  return {
    text: `${sign}${entry.delta}${entry.deltaUnit ?? ''} ${entry.label}`.trim(),
    status,
  };
}

/** The figures face. Prefers visual-view `kpisBack`; otherwise the matching By Item table row. */
export function ItemCardBack({
  view,
  row,
  metricRows = ITEM_CARD_BACK_ROWS,
  recommendation,
  editable,
  pending,
  onRecommendationChange,
  onAskAi,
}: ItemCardBackProps) {
  const { t, i18n } = useTranslation('hindsight');

  const department = row?.department?.value ?? view.department ?? '';
  const backendRows = view.kpisBack;

  function display(cell: MetricCell): string {
    if (cell.formattedValue !== undefined && cell.formattedValue.length > 0) {
      return cell.formattedValue;
    }
    return new Intl.NumberFormat(i18n.language).format(cell.value);
  }

  return (
    <div className={styles.back} data-testid="hindsight-item-card-back">
      <div className={styles.header}>
        {/* Same id as the front, so both faces of one card show the same photo. */}
        <ItemThumbnail
          imageUrl={view.imageUrl}
          description={view.title}
          itemId={view.styleId}
          size="square"
        />

        <p className={styles.title}>
          <Tooltip title={view.title} variant="tertiary">
            <span>{view.title}</span>
          </Tooltip>
        </p>

        {view.hasAiInsight && (
          <NarrationTooltip narration={view.narration}>
            <AiInsightButton
              className={styles.aiButton}
              label={t('items.table.askAi', { style: view.styleId })}
              onClick={onAskAi}
            />
          </NarrationTooltip>
        )}

        <div className={styles.chips}>
          {view.styleId.length > 0 && (
            <span className={styles.chip}>
              {t('items.card.idChip', { id: view.styleId })}
            </span>
          )}
          {department.length > 0 && <span className={styles.chip}>{department}</span>}
        </div>
      </div>

      <dl className={styles.metrics}>
        {backendRows.length > 0
          ? backendRows.map((kpi, index) => {
              const badge = badgeFromKpi(kpi);
              return (
                <div
                  key={kpiRowKey(kpi, index)}
                  className={styles.row}
                  data-emphasis={index < BACK_STRONG_COUNT ? 'strong' : 'muted'}
                >
                  <dt className={styles.label}>{kpi.label}</dt>
                  {badge === null ? null : (
                    <span className={styles.badge} data-status={badge.status}>
                      {badge.text}
                    </span>
                  )}
                  <dd className={styles.value}>{kpiValue(kpi, i18n.language)}</dd>
                </div>
              );
            })
          : metricRows.map((definition) => {
              const cell = row?.[definition.field];
              const metric = isMetric(cell) ? cell : null;
              const change = metric === null ? null : changeOf(metric);

              return (
                <div
                  key={definition.field}
                  className={styles.row}
                  data-emphasis={definition.emphasis}
                >
                  <dt className={styles.label}>{definition.label}</dt>
                  {change === null ? null : (
                    <span className={styles.badge} data-status={change.status}>
                      {`${change.label} ${change.metric}`.trim()}
                    </span>
                  )}
                  <dd className={styles.value}>
                    {metric === null ? NO_COMPARISON : display(metric)}
                  </dd>
                </div>
              );
            })}
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
