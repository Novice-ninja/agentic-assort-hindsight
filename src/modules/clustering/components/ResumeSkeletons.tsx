import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'react';
import scope from './scope.module.css';
import styles from './wizard.module.css';

function Bone({ className }: { className: string }) {
  return <div className={[scope.skeletonBone, className].join(' ')} />;
}

/** Accordion/row bones for the Auto-Selected Attributes matrix while GET score loads. */
export function ReviewAttributesSkeleton() {
  return (
    <div
      className={styles.attributeMatrix}
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="cluster-review-attributes-loading"
    >
      {Array.from({ length: 3 }, (_, column) => (
        <div key={column} className={styles.attributeColumn}>
          <Bone className={scope.skeletonTitle} />
          {Array.from({ length: 4 }, (_, row) => (
            <div key={row} className={scope.skeletonAccordion} aria-hidden="true">
              <Bone className={scope.skeletonAccordionTitle} />
              <Bone className={scope.skeletonAccordionPreview} />
              <Bone className={scope.skeletonAccordionChevron} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Variant cards plus the metric tiles underneath, while GET variants loads. */
export function VariantCardsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="cluster-review-variants-loading"
      className={styles.variantCardsSkeleton}
    >
      <div className={styles.variantGrid}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={styles.variantCardSkeleton} aria-hidden="true">
            <div className={styles.variantHeader}>
              <div className={styles.variantHeaderMain}>
                <Bone className={styles.variantSkeletonName} />
                <Bone className={styles.variantSkeletonBadge} />
              </div>
              <Bone className={styles.variantSkeletonAction} />
            </div>
            <div className={styles.chips}>
              <Bone className={styles.variantSkeletonChip} />
              <Bone className={styles.variantSkeletonChipWide} />
              <Bone className={styles.variantSkeletonChip} />
            </div>
            <Bone className={styles.variantSkeletonSummary} />
          </div>
        ))}
      </div>
      <div className={styles.metricTileGrid}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={styles.metricTileSkeleton} aria-hidden="true">
            <Bone className={styles.metricTileSkeletonValue} />
            <Bone className={styles.metricTileSkeletonHint} />
            <Bone className={styles.metricTileSkeletonBadge} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Gate 2 winner panel bones while GET selected-variant loads. */
export function Gate2Skeleton() {
  return (
    <section
      className={[styles.gateSection, styles.gatePanel].join(' ')}
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="cluster-signoff-variant-loading"
    >
      <Bone className={scope.skeletonTitle} />
      <Bone className={scope.skeletonMeta} />
      <Bone className={scope.skeletonMeta} />
    </section>
  );
}

const CANDIDATE_SKELETON_COUNT = 3;

/** Compare layout bones while GET cluster-variants loads. */
export function CandidateCardsSkeleton() {
  const { t } = useTranslation('clustering');
  const metricLabels = [
    t('finalize.separation'),
    t('finalize.stability'),
    t('finalize.storesPerCluster'),
  ];
  const layoutStyle = {
    ['--candidate-count']: CANDIDATE_SKELETON_COUNT,
    ['--compare-header-offset']: '80px',
  } as CSSProperties;

  return (
    <div
      className={styles.compareLayout}
      style={layoutStyle}
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="cluster-finalize-candidates-loading"
    >
      <div className={styles.compareLabelColumn} aria-hidden="true">
        <div className={styles.compareLabelHeaderSpacer} />
        {metricLabels.map((label) => (
          <div key={label} className={styles.compareLabelSlot}>
            <span className={styles.compareLabelPill}>{label}</span>
            <span className={styles.compareLabelConnector} />
          </div>
        ))}
      </div>
      {Array.from({ length: CANDIDATE_SKELETON_COUNT }, (_, index) => (
        <div key={index} className={styles.candidateCardSkeleton} aria-hidden="true">
          {index > 0 ? (
            <div className={styles.compareInterCardConnectors}>
              <div className={styles.compareLabelHeaderSpacer} />
              {metricLabels.map((label) => (
                <div key={label} className={styles.compareLabelSlot}>
                  <span className={styles.compareInterCardLine} />
                </div>
              ))}
            </div>
          ) : null}
          <div className={styles.candidateHeader}>
            <div className={styles.candidateHeaderMain}>
              <div className={styles.candidateTitleRow}>
                <Bone className={styles.candidateSkeletonIndex} />
                <Bone className={styles.candidateSkeletonName} />
                {index === 0 ? <Bone className={styles.candidateSkeletonBadge} /> : null}
              </div>
              <Bone className={styles.candidateSkeletonKLine} />
            </div>
          </div>
          <div className={styles.candidateMetrics}>
            <div className={styles.candidateMetricRow}>
              <div className={styles.compareScoreRow}>
                <Bone className={styles.candidateSkeletonTrack} />
                <Bone className={styles.candidateSkeletonScore} />
              </div>
            </div>
            <div className={styles.candidateMetricRow}>
              <div className={styles.compareScoreRow}>
                <Bone className={styles.candidateSkeletonTrack} />
                <Bone className={styles.candidateSkeletonScore} />
              </div>
            </div>
            <div className={[styles.candidateMetricRow, styles.candidateMetricRowLast].join(' ')}>
              <Bone className={styles.candidateSkeletonStores} />
            </div>
          </div>
          <div className={styles.candidateFooter}>
            <Bone className={styles.candidateSkeletonButton} />
            <Bone className={styles.candidateSkeletonButtonWide} />
          </div>
        </div>
      ))}
    </div>
  );
}
