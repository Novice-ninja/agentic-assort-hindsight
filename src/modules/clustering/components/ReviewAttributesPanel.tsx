import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ImpactCheckbox, ImpactTooltip as Tooltip, Tag } from '@shared/components/vendor/impact-ui';
import attributeInfoIcon from '@assets/icons/clustering/attribute-variation-info.svg';
import sections from '@shared/styles/wizardSections.module.css';
import type { ClusteringAttribute } from '../types';
import { ReviewAttributesSkeleton } from './ResumeSkeletons';
import { AgentSectionStatus } from './AgentSectionStatus';
import agentFlow from './agentFlow.module.css';
import styles from './wizard.module.css';

const CATEGORIES = ['performance', 'product', 'store'] as const;

export interface ReviewAttributesPanelProps {
  attributes: ClusteringAttribute[];
  cutoff: number;
  onToggle: (id: string, selected: boolean) => void;
  /** "Confirm and Generate Variant": confirms the picks and starts significance scoring. */
  onConfirm: () => void;
  /** True while the significance-score POST → GET chain is in flight. */
  confirming?: boolean;
  /** Variants already match this checkbox selection, so Confirm must not run again. */
  confirmDisabled?: boolean;
  /** True while resume GET significance-score is in flight. */
  loading?: boolean;
  loadFailed?: boolean;
  onRetry?: () => void;
  /** Describe Your Plan mirror: the agent owns the picks, so nothing here is editable. */
  readOnly?: boolean;
  /** Agent is currently filling this section (cyan stroke, Figma "STROKE GLOW"). */
  highlighted?: boolean;
}

function selectedCount(rows: ClusteringAttribute[]) {
  return rows.filter((row) => row.userSelected).length;
}

export function ReviewAttributesPanel({
  attributes,
  onToggle,
  onConfirm,
  confirming = false,
  confirmDisabled = false,
  loading = false,
  loadFailed = false,
  onRetry,
  readOnly = false,
  highlighted = false,
}: ReviewAttributesPanelProps) {
  const { t } = useTranslation(['clustering', 'common']);

  return (
    <section
      className={[sections.sectionWrapper, highlighted ? agentFlow.sectionGlow : '']
        .filter(Boolean)
        .join(' ')}
      data-testid="review-attributes-section"
      data-highlighted={highlighted ? 'true' : undefined}
    >
      {highlighted ? <AgentSectionStatus section="attributes" /> : null}
      <div className={[sections.toolbar, styles.toolbarSpread].join(' ')}>
        <div className={styles.sectionHeading}>
          <div className={styles.reviewTitleRow}>
            <span className={styles.reviewTitle}>{t('review.attributesTitle')}</span>
            <Tooltip title={t('review.attributesInfo')} variant="tertiary">
              <button type="button" className={styles.reviewTitleInfo} aria-label={t('review.attributesInfo')}>
                <img src={attributeInfoIcon} alt="" width={16} height={16} />
              </button>
            </Tooltip>
          </div>
          <p className={styles.reviewSubtitle}>{t('review.attributesSubtitle')}</p>
        </div>
        <Button
          variant="secondary"
          htmlType="button"
          onClick={onConfirm}
          disabled={readOnly || confirming || confirmDisabled || loading || loadFailed}
          loading={confirming}
        >
          {t('review.confirmGenerateVariant')}
        </Button>
      </div>
      {loading ? <ReviewAttributesSkeleton /> : null}
      {loadFailed && !loading ? (
        <div role="alert">
          <p className={sections.empty}>{t('errors.attributeScoreFailed')}</p>
          {onRetry ? (
            <Button variant="secondary" htmlType="button" onClick={onRetry}>
              {t('common:actions.retry', 'Retry')}
            </Button>
          ) : null}
        </div>
      ) : null}
      {!loading && !loadFailed ? (
      <div className={styles.attributeMatrix}>
        {CATEGORIES.map((category) => {
          const rows = attributes.filter((attr) => attr.category === category);
          const selected = selectedCount(rows);
          return (
            <div key={category} className={styles.attributeColumn}>
              <div className={styles.attributeColumnHeader}>
                <span className={styles.attributeColumnTitle}>{t(`review.${category}`)}</span>
                <span className={styles.attributeCount}>
                  {t('review.selectedOf', { selected, total: rows.length })}
                </span>
              </div>
              {rows.length === 0 ? (
                <p className={sections.empty} role="status">
                  {t('common:states.empty')}
                </p>
              ) : (
                <div className={styles.attributeRows}>
                  {rows.map((attr) => {
                    const reasonText =
                      attr.exclusionReason ??
                      (attr.exclusionReasonKey ? t(attr.exclusionReasonKey) : undefined);
                    const showReason = !attr.userSelected && Boolean(reasonText);
                    const excluded = showReason || attr.noData;
                    const scoreLabel =
                      attr.noData || attr.significance == null
                        ? '—'
                        : attr.significance.toFixed(2);

                    return (
                      <div
                        key={attr.id}
                        className={[styles.excludedWrap, excluded ? styles.excludedWrapActive : '']
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <div
                          className={[
                            styles.attrPill,
                            excluded ? styles.attrPillExcluded : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <ImpactCheckbox
                            label={t(attr.labelKey, { defaultValue: attr.label ?? attr.id })}
                            checked={attr.userSelected}
                            disabled={readOnly || attr.noData}
                            onChange={(e: ChangeEvent<HTMLInputElement> | boolean) => {
                              onToggle(attr.id, typeof e === 'boolean' ? e : e.target.checked);
                            }}
                          />
                          <Tag label={scoreLabel} size="large" variant="solid" />
                        </div>
                        {showReason && reasonText ? (
                          <p className={styles.excludedReason}>{reasonText}</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      ) : null}
    </section>
  );
}
