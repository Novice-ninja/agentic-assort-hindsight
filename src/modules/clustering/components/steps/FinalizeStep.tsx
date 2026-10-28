import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@shared/components/primitives/Toast';
import { decodeIaString } from '@shared/utils/format';
import { attributeInfoCacheKey } from '../../api/getAttributeInfo';
import type { StoreAssignmentCluster } from '../../api/getStoreAssignments';
import { mapPerformanceInfoToStores } from '../../services/mapPerformanceInfo';
import type {
  AttributeGradesSummaryEntry,
  AttributeInfoEntry,
  AttributeProductListEntry,
  ClusterPerformanceSummaryEntry,
  ClusterPlansEntry,
  ClusterVariantSummaryEntry,
  KpiBreakdownEntry,
  PerformanceInfoEntry,
  StoreAssignmentsEntry,
} from '../../store/clusteringSlice';
import { variantCardTitle } from '../../services/reviewVariantDisplay';
import type { ClusterResultCandidate } from '../../types';
import { AttributeGradesChart } from '../AttributeGradesChart';
import { CandidateCompare } from '../CandidateCompare';
import { ClusterSummaryTable } from '../ClusterSummaryTable';
import { PerformanceClustersChart } from '../PerformanceClustersChart';
import { COMPARE_ALL_TAB, StoreAssignmentsPanel } from '../StoreAssignmentsPanel';
import styles from '../wizard.module.css';

export interface FinalizeStepProps {
  candidates: ClusterResultCandidate[];
  weeks: number;
  locked?: boolean;
  onSelect: (id: string) => void;
  onRename: (clusterId: string, name: string) => void;
  onTogglePin: (storeId: string, clusterId: string, pinned: boolean) => void;
  candidatesLoading?: boolean;
  candidatesFailed?: boolean;
  onRetryCandidates?: () => void;
  /** `POST …/store_assignments` state per `variantId`, for the Store Assignments panel. */
  storeAssignments: Record<string, StoreAssignmentsEntry | undefined>;
  onLoadStoreAssignments: (variantId: string) => void;
  /** `POST …/performance/info` state per `variantId`, for the scatter. */
  performanceInfo: Record<string, PerformanceInfoEntry | undefined>;
  onLoadPerformanceInfo: (variantId: string) => void;
  /** `POST …/get-cluster-plans` state per `variantId`, for the Cluster Summary table. */
  clusterPlans: Record<string, ClusterPlansEntry | undefined>;
  onLoadClusterPlans: (variantId: string) => void;
  /** `POST /v1/summarize` (`cardType: 'cluster_performance'`) per `variantId`, for the table strip. */
  clusterPerformanceSummary?: Record<string, ClusterPerformanceSummaryEntry | undefined>;
  onLoadClusterPerformanceSummary?: (variantId: string, options?: { force?: boolean }) => void;
  /** `POST …/kpi-breakdown` state per `variantId`, for the Full KPI Breakdown panel. */
  kpiBreakdown: Record<string, KpiBreakdownEntry | undefined>;
  onLoadKpiBreakdown: (variantId: string) => void;
  /** `POST …/attributes/product-list` per `variantId`, for the grades dropdown. */
  attributeProductList: Record<string, AttributeProductListEntry | undefined>;
  onLoadAttributeProductList: (variantId: string) => void;
  /** `POST …/attributes/info` keyed by `variantId:attribute`, for the grades chart. */
  attributeInfo: Record<string, AttributeInfoEntry | undefined>;
  onLoadAttributeInfo: (variantId: string, attribute: string) => void;
  /** `POST /v1/summarize` (`cardType: 'cluster_attribute'`) keyed like `attributeInfo`, for the grades strip. */
  attributeGradesSummary?: Record<string, AttributeGradesSummaryEntry | undefined>;
  onLoadAttributeGradesSummary?: (
    variantId: string,
    attribute: string,
    options?: { force?: boolean },
  ) => void;
  /** `POST /v1/summarize` (`cardType: 'cluster'`) narration for the "3 Best" section + cards. */
  variantSummary?: ClusterVariantSummaryEntry;
  onRetryVariantSummary?: () => void;
  /** Describe Your Plan mirror: the agent selects the winner; selection and renames are off. */
  readOnly?: boolean;
  /** Agent is currently filling the candidates section (cyan stroke). */
  highlighted?: boolean;
  onMoveStore: (
    variantId: string,
    storeCode: string,
    cluster: StoreAssignmentCluster,
  ) => Promise<void> | void;
}

export function FinalizeStep({
  candidates,
  locked,
  onSelect,
  onRename,
  candidatesLoading,
  candidatesFailed,
  onRetryCandidates,
  storeAssignments,
  onLoadStoreAssignments,
  onMoveStore,
  performanceInfo,
  onLoadPerformanceInfo,
  clusterPlans,
  onLoadClusterPlans,
  clusterPerformanceSummary = {},
  onLoadClusterPerformanceSummary,
  kpiBreakdown,
  onLoadKpiBreakdown,
  attributeProductList,
  onLoadAttributeProductList,
  attributeInfo,
  onLoadAttributeInfo,
  attributeGradesSummary = {},
  onLoadAttributeGradesSummary,
  variantSummary,
  onRetryVariantSummary,
  readOnly = false,
  highlighted = false,
}: FinalizeStepProps) {
  const { t } = useTranslation(['clustering', 'common']);
  const { showToast } = useToast();
  const toastedGradeFailure = useRef<string | null>(null);
  // Store Assignments panel: `null` = closed, otherwise the active tab (candidate id or
  // "Compare All"). Opening from a card lands on that card's tab; "Compare" lands on Compare All.
  const [assignmentsTab, setAssignmentsTab] = useState<string | null>(null);
  const [attributeByVariant, setAttributeByVariant] = useState<Record<string, string>>({});
  const closeAssignments = useCallback(() => setAssignmentsTab(null), []);
  const selected = candidates.find((c) => c.selected);
  const selectedVariantId = selected?.variantId;
  const selectedName = selected
    ? variantCardTitle(decodeIaString(selected.name), {
        fallback: t('review.customVariant'),
        variantId: selected.variantId,
      })
    : '';
  const performanceEntry = selectedVariantId
    ? performanceInfo[selectedVariantId]
    : undefined;
  const performanceStores = useMemo(
    () =>
      performanceEntry?.data
        ? mapPerformanceInfoToStores(performanceEntry.data.datasets)
        : [],
    [performanceEntry?.data],
  );
  const performanceLoading =
    Boolean(selectedVariantId) &&
    performanceEntry?.status !== 'succeeded' &&
    performanceEntry?.status !== 'failed';
  const clusterPlansEntry = selectedVariantId
    ? clusterPlans[selectedVariantId]
    : undefined;
  const clusterPlansLoading =
    Boolean(selectedVariantId) &&
    clusterPlansEntry?.status !== 'succeeded' &&
    clusterPlansEntry?.status !== 'failed';
  const performanceSummaryEntry = selectedVariantId
    ? clusterPerformanceSummary[selectedVariantId]
    : undefined;
  const kpiBreakdownEntry = selectedVariantId
    ? kpiBreakdown[selectedVariantId]
    : undefined;
  const kpiBreakdownLoading =
    Boolean(selectedVariantId) &&
    kpiBreakdownEntry?.status !== 'succeeded' &&
    kpiBreakdownEntry?.status !== 'failed';
  const attributeListEntry = selectedVariantId
    ? attributeProductList[selectedVariantId]
    : undefined;
  const attributeOptions = attributeListEntry?.data?.attributes ?? [];
  const selectedAttribute = selectedVariantId
    ? (attributeByVariant[selectedVariantId] ?? attributeOptions[0]?.value)
    : undefined;
  const attributeInfoKey =
    selectedVariantId && selectedAttribute
      ? attributeInfoCacheKey(selectedVariantId, selectedAttribute)
      : null;
  const attributeInfoEntry = attributeInfoKey ? attributeInfo[attributeInfoKey] : undefined;
  const gradesSummaryEntry = attributeInfoKey
    ? attributeGradesSummary[attributeInfoKey]
    : undefined;
  const attributeListLoading =
    Boolean(selectedVariantId) &&
    attributeListEntry?.status !== 'succeeded' &&
    attributeListEntry?.status !== 'failed';
  const attributeInfoLoading =
    Boolean(selectedAttribute) &&
    attributeInfoEntry?.status !== 'succeeded' &&
    attributeInfoEntry?.status !== 'failed';
  const gradesLoading =
    attributeListLoading ||
    attributeInfoLoading ||
    Boolean(candidatesLoading && !selected);
  const gradesFailed =
    attributeListEntry?.status === 'failed' || attributeInfoEntry?.status === 'failed';
  const gradeFailureKey =
    attributeListEntry?.status === 'failed'
      ? `list:${selectedVariantId ?? ''}`
      : attributeInfoEntry?.status === 'failed'
        ? `info:${selectedVariantId ?? ''}:${selectedAttribute ?? ''}`
        : null;
  const gradeCategories = gradesFailed ? [] : (attributeInfoEntry?.data?.categories ?? []);
  const gradeSeries = gradesFailed ? [] : (attributeInfoEntry?.data?.series ?? []);

  useEffect(() => {
    if (candidatesLoading || candidatesFailed) return;
    if (candidates.length === 0 || candidates.some((candidate) => candidate.selected))
      return;
    const firstId = candidates[0]?.id;
    if (firstId) onSelect(firstId);
  }, [candidates, candidatesFailed, candidatesLoading, onSelect]);

  useEffect(() => {
    if (selectedVariantId) void onLoadPerformanceInfo(selectedVariantId);
  }, [onLoadPerformanceInfo, selectedVariantId]);

  useEffect(() => {
    if (selectedVariantId) void onLoadClusterPlans(selectedVariantId);
  }, [onLoadClusterPlans, selectedVariantId]);

  // The summary is built from the table rows, so it waits for that request to succeed.
  const clusterPlansReady = clusterPlansEntry?.status === 'succeeded';
  useEffect(() => {
    if (selectedVariantId && clusterPlansReady) {
      onLoadClusterPerformanceSummary?.(selectedVariantId);
    }
  }, [clusterPlansReady, onLoadClusterPerformanceSummary, selectedVariantId]);

  const retryPerformanceSummary = useCallback(() => {
    if (selectedVariantId) onLoadClusterPerformanceSummary?.(selectedVariantId, { force: true });
  }, [onLoadClusterPerformanceSummary, selectedVariantId]);

  useEffect(() => {
    if (selectedVariantId) void onLoadKpiBreakdown(selectedVariantId);
  }, [onLoadKpiBreakdown, selectedVariantId]);

  useEffect(() => {
    if (selectedVariantId) void onLoadAttributeProductList(selectedVariantId);
  }, [onLoadAttributeProductList, selectedVariantId]);

  useEffect(() => {
    if (selectedVariantId && selectedAttribute) {
      void onLoadAttributeInfo(selectedVariantId, selectedAttribute);
    }
  }, [onLoadAttributeInfo, selectedAttribute, selectedVariantId]);

  // The grades summary is built from the plotted chart, so it waits for that request to succeed.
  const attributeInfoReady = attributeInfoEntry?.status === 'succeeded';
  useEffect(() => {
    if (selectedVariantId && selectedAttribute && attributeInfoReady) {
      onLoadAttributeGradesSummary?.(selectedVariantId, selectedAttribute);
    }
  }, [attributeInfoReady, onLoadAttributeGradesSummary, selectedAttribute, selectedVariantId]);

  const retryGradesSummary = useCallback(() => {
    if (selectedVariantId && selectedAttribute) {
      onLoadAttributeGradesSummary?.(selectedVariantId, selectedAttribute, { force: true });
    }
  }, [onLoadAttributeGradesSummary, selectedAttribute, selectedVariantId]);

  useEffect(() => {
    if (!gradeFailureKey) {
      toastedGradeFailure.current = null;
      return;
    }
    if (toastedGradeFailure.current === gradeFailureKey) return;
    toastedGradeFailure.current = gradeFailureKey;
    showToast({
      message: t('errors.attributeGradesFailed'),
      variant: 'error',
      position: 'top-right',
      autoHideDuration: 3000,
    });
  }, [gradeFailureKey, showToast, t]);

  const onAttributeChange = useCallback(
    (value: string) => {
      if (!selectedVariantId) return;
      setAttributeByVariant((current) => ({ ...current, [selectedVariantId]: value }));
    },
    [selectedVariantId],
  );

  return (
    <div className={styles.finalizeStep}>
      <h2 className={styles.finalizeStepTitle}>{t('steps.finalize.title')}</h2>
      <CandidateCompare
        candidates={candidates}
        onSelect={onSelect}
        loading={candidatesLoading}
        loadFailed={candidatesFailed}
        onRetry={onRetryCandidates}
        onCompareAssignments={() => setAssignmentsTab(COMPARE_ALL_TAB)}
        onViewAssignments={setAssignmentsTab}
        summary={variantSummary?.data ?? null}
        summaryStatus={variantSummary?.status ?? 'idle'}
        onRetrySummary={onRetryVariantSummary}
        readOnly={readOnly}
        highlighted={highlighted}
      />
      {candidatesFailed ? null : (
        <section className={styles.visualisationSection}>
          <h3 className={styles.finalizeStepTitle}>
            {selected
              ? t('finalize.visualisationTitle', { name: selectedName })
              : t('finalize.visualisationFallback')}
          </h3>
          <div className={styles.chartRow}>
            <PerformanceClustersChart
              stores={performanceStores}
              datasets={performanceEntry?.data?.datasets}
              storeCount={performanceEntry?.data?.storeCount}
              metricsMapper={performanceEntry?.data?.meta.metricsMapper}
              isLoading={performanceLoading || Boolean(candidatesLoading && !selected)}
            />
            <AttributeGradesChart
              categories={gradeCategories}
              series={gradeSeries}
              attributeOptions={attributeOptions}
              attributeValue={selectedAttribute}
              onAttributeChange={onAttributeChange}
              isLoading={gradesLoading}
              summary={gradesSummaryEntry?.data ?? null}
              summaryStatus={gradesSummaryEntry?.status ?? 'idle'}
              onRetrySummary={onLoadAttributeGradesSummary ? retryGradesSummary : undefined}
            />
          </div>
        </section>
      )}
      {candidatesFailed ? null : (
        <ClusterSummaryTable
          rows={clusterPlansEntry?.data?.data ?? []}
          kpiColumns={clusterPlansEntry?.data?.meta.kpiColumns ?? []}
          isLoading={clusterPlansLoading || Boolean(candidatesLoading && !selected)}
          locked={locked || readOnly}
          onRename={onRename}
          summary={performanceSummaryEntry?.data ?? null}
          summaryStatus={performanceSummaryEntry?.status ?? 'idle'}
          onRetrySummary={onLoadClusterPerformanceSummary ? retryPerformanceSummary : undefined}
          breakdownRows={kpiBreakdownEntry?.data?.data ?? []}
          breakdownColumns={kpiBreakdownEntry?.data?.meta.kpiColumns ?? []}
          breakdownLoading={
            kpiBreakdownLoading || Boolean(candidatesLoading && !selected)
          }
        />
      )}
      <StoreAssignmentsPanel
        open={assignmentsTab !== null}
        onClose={closeAssignments}
        candidates={candidates}
        activeTab={assignmentsTab ?? COMPARE_ALL_TAB}
        onTabChange={setAssignmentsTab}
        assignments={storeAssignments}
        onLoad={onLoadStoreAssignments}
        onMoveStore={onMoveStore}
      />
    </div>
  );
}
