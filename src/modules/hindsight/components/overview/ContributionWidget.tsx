import { joinInsightProse } from '../../services/insightProse';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/store/hooks';
import { ImpactDonutChart } from '@shared/components/charts';
import type { ImpactDonutPoint } from '@shared/components/charts';
import { AIStrip } from '@shared/components/primitives/AIStrip/AIStrip';
import { useAIChat } from '@shared/context';
import type { LoadStatus } from '@shared/types';
import { useCardInsight, useLabel } from '../../hooks';
import { buildInsightDisplayHtml } from '../../services/buildInsightDisplayHtml';
import { buildContributionSlices } from '../../services/contribution';
import { buildSummarizePayload } from '../../services/summarizePayload';
import { findWidgetConfig } from '../../services/resolveSetting';
import { selectWidgets } from '../../store/selectors';
import type { ContributionData } from '../../types';
import { WidgetCard } from '../WidgetCard';
import styles from './ContributionWidget.module.css';

export interface ContributionWidgetProps {
  data?: ContributionData;
  widgetId: string;
  /** Heading for this breakdown. Defaults to the colour contribution title. */
  title?: string;
  /**
   * Set when the backend has already applied its own top-N and "Others" bucket, so the slices
   * are rendered in the order they arrived instead of being grouped a second time.
   */
  preGrouped?: boolean;
  status?: LoadStatus;
  onRetry?: () => void;
  /**
   * Plan and season the card belongs to. They identify the cached AI insight, so the same
   * breakdown under another season is never mistaken for this one's.
   */
  planCode?: string;
  seasonCode?: number | null;
  /**
   * Set when `data` came from the contribution API. Only those cards carry a dimension the agent
   * recognises, so only those can be summarised.
   */
  live?: boolean;
}

const FIGMA_SLICE_COLOURS = [
  '#ad97ce',
  '#658ec4',
  '#9cbbe4',
  '#b0ebed',
  '#ffc7b6',
  '#decdf9',
] as const;

const MAX_VISIBLE_SLICES = 6;

function compactTotal(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Contribution rendered as the Figma "Colour Contribution" box-grid variant.
 *
 * Grouping is the tenant's decision, not the payload's: the widget's `topN`, threshold, and
 * "Others" settings are applied here so every contribution chart groups identically. Data that
 * arrives already grouped is the exception — grouping it twice would fold a remainder into a
 * second "Others" beside the one it came with.
 */
export function ContributionWidget({
  data,
  widgetId,
  title,
  preGrouped = false,
  status,
  planCode,
  seasonCode,
  live = false,
}: ContributionWidgetProps) {
  const { t, i18n } = useTranslation('hindsight');
  const label = useLabel();
  const widgets = useAppSelector(selectWidgets);
  const { askAboutInsight } = useAIChat();
  const heading = title ?? t('contribution.colourTitle');
  const centerName = heading.split(' ').slice(0, -1).join(' ') || heading;
  const centerLabel = centerName.length > 8 ? `${centerName.slice(0, 6)}...` : centerName;

  const insightPayload = useMemo(
    () => (live && data !== undefined ? buildSummarizePayload(data) : null),
    [live, data],
  );

  const {
    status: insightStatus,
    bullets: insightBullets,
    available: insightAvailable,
    request: requestInsight,
  } = useCardInsight({
    planCode,
    seasonCode,
    scope: insightPayload?.dimension ?? data?.metricId ?? '',
    payload: insightPayload,
  });

  useEffect(() => {
    if (live && insightPayload !== null) {
      requestInsight();
    }
  }, [live, insightPayload, requestInsight]);

  const insightText = joinInsightProse(insightBullets.map(bullet => bullet.text));
  const insightUnavailable =
    !insightAvailable ||
    insightStatus === 'failed' ||
    (insightStatus === 'succeeded' && insightBullets.length === 0);

  const config = findWidgetConfig(widgets, widgetId);
  const sourceSlices = useMemo(() => data?.slices ?? [], [data?.slices]);
  const slices = useMemo(
    () =>
      preGrouped
        ? sourceSlices
        : buildContributionSlices(
            sourceSlices.map((slice) => ({
              id: slice.id,
              labelKey: slice.labelKey,
              value: slice.value,
            })),
            {
              topN: Math.min(config?.topN ?? sourceSlices.length, MAX_VISIBLE_SLICES),
              thresholdPercent: config?.thresholdPercent ?? 0,
              showOthers: config?.showOthers,
            },
          ),
    [config, preGrouped, sourceSlices],
  );

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  // The source already owns grouping. Dropping its final slices changes the pie denominator.
  const visibleSlices = slices.map((slice, index) => ({
    ...slice,
    displayLabel: label(slice.labelKey),
    colour: FIGMA_SLICE_COLOURS[index % FIGMA_SLICE_COLOURS.length],
    percent: total === 0 ? 0 : slice.value / total,
  }));
  const legendColumns = [
    visibleSlices.slice(0, Math.ceil(visibleSlices.length / 2)),
    visibleSlices.slice(Math.ceil(visibleSlices.length / 2)),
  ];
  const donutPoints: ImpactDonutPoint[] = visibleSlices.map((slice) => ({
    name: slice.displayLabel,
    y: slice.value,
    color: slice.colour,
  }));

  if (status === 'failed') {
    return (
      <WidgetCard
        className={styles.card}
        data-testid={`contribution-${data?.instanceId ?? widgetId}`}
      >
        <div className={styles.state}>
          <p className={styles.stateText}>{t('states.empty')}</p>
        </div>
      </WidgetCard>
    );
  }

  if (status === 'loading') {
    return (
      <div className={styles.skeletonCard} role="status" aria-label={t('states.loading')}>
        <div className={[styles.skeletonHeader, styles.skeletonBone].join(' ')} />
        <div className={styles.skeletonBody}>
          <div className={[styles.skeletonDonut, styles.skeletonBone].join(' ')} />
          <div className={styles.skeletonLegend}>
            <div className={[styles.skeletonChip, styles.skeletonBone].join(' ')} />
            <div className={[styles.skeletonChip, styles.skeletonBone].join(' ')} />
            <div className={[styles.skeletonChip, styles.skeletonBone].join(' ')} />
            <div className={[styles.skeletonChip, styles.skeletonBone].join(' ')} />
            <div className={[styles.skeletonChip, styles.skeletonBone].join(' ')} />
            <div className={[styles.skeletonChip, styles.skeletonBone].join(' ')} />
          </div>
        </div>
      </div>
    );
  }

  const empty = total === 0;

  return (
    <WidgetCard
      className={styles.card}
      data-testid={`contribution-${data?.instanceId ?? widgetId}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{heading}</h3>
      </div>

      {live && (
        <div className={styles.narrationWrap}>
          <AIStrip
          iconOnly
            text={
              insightUnavailable
                ? t('aiStrip.noInsight', 'No insight available')
                : insightText
            }
            loading={!insightUnavailable && (insightStatus === 'idle' || insightStatus === 'loading')}
            showAskButton={!insightUnavailable && insightStatus === 'succeeded' && insightBullets.length > 0}
            onAskClick={() =>
              askAboutInsight({
                plainText: insightText,
                displayHtml: buildInsightDisplayHtml(heading, insightText),
                source: 'hindsight',
                widgetId,
                planCode,
              })
            }
          />
        </div>
      )}

      {empty ? (
        <div className={styles.state}>
          <p className={styles.stateText}>{t('states.empty')}</p>
        </div>
      ) : (
        <div className={styles.body}>
          <figure className={styles.donutFigure} aria-label={heading}>
            <ImpactDonutChart title={heading} points={donutPoints} />
            <figcaption className={styles.centerLabel}>
              <span className={styles.centerKicker}>{centerLabel}</span>
              <strong className={styles.centerValue}>
                {compactTotal(total, i18n.language)}
              </strong>
            </figcaption>
          </figure>

          <div className={styles.legendGrid}>
            {legendColumns.map((column, columnIndex) => (
              <ul key={columnIndex} className={styles.legendColumn}>
                {column.map((slice) => (
                  <li key={slice.id} className={styles.legendRow}>
                    <span className={styles.legendName}>
                      <span
                        className={styles.swatch}
                        style={{ backgroundColor: slice.colour }}
                        aria-hidden="true"
                      />
                      <span className={styles.legendText}>{slice.displayLabel}</span>
                    </span>
                    <span className={styles.legendValue}>
                      {new Intl.NumberFormat(i18n.language, {
                        style: 'percent',
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }).format(slice.percent)}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <table className={styles.visuallyHidden}>
            <caption>{t('a11y.chartDataTable', { name: heading })}</caption>
            <thead>
              <tr>
                <th scope="col">{t('contribution.title')}</th>
                <th scope="col">{t('contribution.share', { percent: '%' })}</th>
              </tr>
            </thead>
            <tbody>
              {visibleSlices.map((slice) => (
                <tr key={slice.id}>
                  <th scope="row">{slice.displayLabel}</th>
                  <td>{slice.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WidgetCard>
  );
}
