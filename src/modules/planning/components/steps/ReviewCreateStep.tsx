import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/store/hooks';
import { decodeIaString } from '@shared/utils/format';
import { ImpactTooltip as Tooltip } from '@shared/components/vendor/impact-ui';
import {
  committedExceptSearchNeedles,
  committedSearchNeedles,
  isUniverseSelectAll,
  visibleSelectedIds,
} from '../../services/filterHierarchy';
import type {
  HierarchyScopeEntry,
  PipelineStagePreview,
  PlanDraft,
  PlanningReferenceData,
  ProductValue,
  SeasonYear,
  WizardStep,
} from '../../types';
import { AgentPreview } from './AgentPreview';
import editIconSvg from '@assets/icons/planning/edit-icon.svg';
import styles from './wizardSteps.module.css';

export interface ReviewCreateStepProps {
  draft: PlanDraft;
  referenceData: PlanningReferenceData;
  seasonsData: SeasonYear[];
  pipelinePreview: PipelineStagePreview[];
  createError?: string;
  onEditStep: (step: WizardStep) => void;
}

const VISIBLE_ITEMS = 3;

function overflowSplit(names: string[]) {
  const visible = names.slice(0, VISIBLE_ITEMS);
  const remaining = names.length - VISIBLE_ITEMS;
  return { text: visible.join(', ') || '—', overflow: remaining > 0 ? remaining : 0 };
}

function labelsForIds(
  ids: readonly string[],
  rows: readonly Pick<ProductValue, 'value' | 'label'>[],
): string[] {
  const byValue = new Map(rows.map((row) => [row.value, row.label]));
  return ids.map((id) => decodeIaString(byValue.get(id) ?? id));
}

function scopeValueSummary(
  entry: HierarchyScopeEntry,
  rows: readonly Pick<ProductValue, 'value' | 'label'>[],
  t: (key: string, options?: { count?: number; needles?: string; matching?: string; except?: string }) => string,
): { valueText: string; valueTooltip: string; overflow: number } {
  const allSelected =
    isUniverseSelectAll(entry) && (entry.except?.length ?? 0) === 0;
  const needles = committedSearchNeedles(entry);
  const exceptNeedles = committedExceptSearchNeedles(entry);
  const exceptIds = entry.except ?? [];

  if (allSelected) {
    const text = t('scope.allSelected');
    return { valueText: text, valueTooltip: text, overflow: 0 };
  }

  if (needles.length > 0 && exceptNeedles.length > 0) {
    const text = t('scope.matchingAndExceptSelected', {
      matching: needles.join(', '),
      except: exceptNeedles.join(', '),
    });
    return { valueText: text, valueTooltip: text, overflow: 0 };
  }

  if (needles.length > 0) {
    const text = t('scope.matchingSelected', { needles: needles.join(', ') });
    return { valueText: text, valueTooltip: text, overflow: 0 };
  }

  if (exceptNeedles.length > 0) {
    const text = t('scope.exceptMatchingSelected', {
      needles: exceptNeedles.join(', '),
    });
    return { valueText: text, valueTooltip: text, overflow: 0 };
  }

  // Universe Select All + hand unticks (`except`): selectedValues stays empty.
  // Prefer loaded-row labels (same as Product Scope); fall back to count summary.
  if (entry.selectAll) {
    const selectedIds = visibleSelectedIds(entry, rows);
    const labels = labelsForIds(selectedIds, rows);
    if (labels.length > 0) {
      const split = overflowSplit(labels);
      return {
        valueText: split.text,
        valueTooltip: `${split.text}${split.overflow > 0 ? ` ( +${split.overflow})` : ''}`,
        overflow: split.overflow,
      };
    }
    if (exceptIds.length > 0) {
      const exceptLabels = labelsForIds(exceptIds, rows);
      const text = t('scope.allSelectedWithExcept', { count: exceptIds.length });
      return {
        valueText: text,
        valueTooltip: `${text}: ${exceptLabels.join(', ')}`,
        overflow: 0,
      };
    }
  }

  // Form A — explicit selectedValues (and any leftover include).
  const formAIds = [
    ...entry.selectedValues,
    ...(entry.include ?? []).filter((id) => !entry.selectedValues.includes(id)),
  ];
  const split = overflowSplit(labelsForIds(formAIds, rows));
  return {
    valueText: split.text,
    valueTooltip: `${split.text}${split.overflow > 0 ? ` ( +${split.overflow})` : ''}`,
    overflow: split.overflow,
  };
}

export function ReviewCreateStep({
  draft,
  referenceData,
  seasonsData,
  pipelinePreview,
  createError,
  onEditStep,
}: ReviewCreateStepProps) {
  const { t } = useTranslation('planning');
  const { clusteringScenarios } = referenceData;
  const productLists = useAppSelector((s) => s.planning.productLists);

  const selectedYear = seasonsData.find((y) => String(y.year) === draft.fiscalYearId);
  const selectedSeason = selectedYear?.seasons.find(
    (s) => s.seasonCode === draft.seasonCode,
  );
  const fySeasonLabel =
    selectedYear && selectedSeason
      ? `FY${selectedYear.year}-${selectedSeason.seasonDisplayName}`
      : draft.fiscalYearId
        ? `FY${draft.fiscalYearId}`
        : '—';
  const scenarioName =
    clusteringScenarios.find((c) => c.id === draft.clusteringScenarioId)?.name ?? '—';
  const scenarioConfidence = clusteringScenarios.find(
    (c) => c.id === draft.clusteringScenarioId,
  )?.confidencePct;

  const hierarchyScopeEntries = draft.hierarchyScope.filter(
    (entry) => entry.selectAll === true || entry.selectedValues.length > 0,
  );

  return (
    <div className={styles.reviewWrapper} data-testid="create-plan-review">
      {/* === Name & Calendar === */}
      <section
        className={styles.reviewSection}
        data-testid="create-plan-review-name-calendar"
      >
        <div className={styles.reviewSectionHead}>
          <p className={styles.reviewSectionTitle}>{t('steps.nameCalendar.title')}</p>
          <button
            type="button"
            className={styles.reviewEditBtn}
            onClick={() => onEditStep('nameCalendar')}
            aria-label={t('review.edit')}
            data-testid="create-plan-review-edit-name-calendar"
          >
            <img
              src={editIconSvg}
              alt=""
              aria-hidden="true"
              className={styles.reviewEditIcon}
            />
          </button>
        </div>
        <div className={styles.reviewContentRow}>
          <div className={[styles.reviewCol, styles.reviewCol230].join(' ')}>
            <span className={styles.reviewLabel}>{t('fields.planName')}</span>
            <span className={styles.reviewValue}>
              <Tooltip title={draft.name || '—'} variant="tertiary" orientation="top-start">
                {draft.name || '—'}
              </Tooltip>
            </span>
          </div>
          <div className={[styles.reviewCol, styles.reviewCol232].join(' ')}>
            <span className={styles.reviewLabel}>{t('fields.fiscalYear')}</span>
            <span className={styles.reviewValue}>
              <Tooltip title={fySeasonLabel} variant="tertiary" orientation="top-start">
                {fySeasonLabel}
              </Tooltip>
            </span>
          </div>
          {/* Starting Point — temporarily commented out
          <div className={[styles.reviewCol, styles.reviewCol228].join(' ')}>
            <span className={styles.reviewLabel}>{t('fields.startingPoint')}</span>
            <span className={styles.reviewValue}>
              {draft.startingPoint ? t(`startingPoints.${draft.startingPoint}`) : '—'}
            </span>
          </div>
          */}
        </div>
      </section>

      {/* === Product Scope === */}
      <section
        className={styles.reviewSection}
        data-testid="create-plan-review-product-scope"
      >
        <div className={styles.reviewSectionHead}>
          <p className={styles.reviewSectionTitle}>{t('steps.productScope.title')}</p>
          <button
            type="button"
            className={styles.reviewEditBtn}
            onClick={() => onEditStep('productScope')}
            aria-label={t('review.edit')}
            data-testid="create-plan-review-edit-product-scope"
          >
            <img
              src={editIconSvg}
              alt=""
              aria-hidden="true"
              className={styles.reviewEditIcon}
            />
          </button>
        </div>
        <div className={styles.reviewContentRow}>
          {hierarchyScopeEntries.length > 0 ? (
            hierarchyScopeEntries.map((entry) => {
              const { valueText, valueTooltip, overflow } = scopeValueSummary(
                entry,
                productLists[entry.levelNo] ?? [],
                t as (
                  key: string,
                  options?: {
                    count?: number;
                    needles?: string;
                    matching?: string;
                    except?: string;
                  },
                ) => string,
              );
              return (
                <div
                  key={entry.levelNo}
                  className={[styles.reviewCol, styles.reviewCol230].join(' ')}
                >
                  <span className={styles.reviewLabel}>{entry.levelName}</span>
                  <div className={styles.reviewValueRow}>
                    <Tooltip
                      title={valueTooltip}
                      variant="tertiary"
                      orientation="top-start"
                    >
                      <span className={styles.reviewValue}>{valueText}</span>
                    </Tooltip>
                    {overflow > 0 && (
                      <span className={styles.overflowBadge}>
                        <span className={styles.overflowBadgeText}>
                          {t('scope.overflowCount', { count: overflow })}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={[styles.reviewCol, styles.reviewCol230].join(' ')}>
              <span className={styles.reviewValue}>{'—'}</span>
            </div>
          )}
        </div>
      </section>

      {/* === Clustering & Run Mode === */}
      <section
        className={styles.reviewSection}
        data-testid="create-plan-review-clustering"
      >
        <div className={styles.reviewSectionHead}>
          <p className={styles.reviewSectionTitle}>
            {t('steps.clusteringRunMode.title')}
          </p>
          <button
            type="button"
            className={styles.reviewEditBtn}
            onClick={() => onEditStep('clusteringRunMode')}
            aria-label={t('review.edit')}
            data-testid="create-plan-review-edit-clustering"
          >
            <img
              src={editIconSvg}
              alt=""
              aria-hidden="true"
              className={styles.reviewEditIcon}
            />
          </button>
        </div>
        <div className={styles.reviewContentRow}>
          <div className={[styles.reviewCol, styles.reviewCol230].join(' ')}>
            <span className={styles.reviewLabel}>{t('review.clustering')}</span>
            <span className={styles.reviewValue}>
              {scenarioConfidence != null ? (
                <Tooltip
                  title={`${scenarioName} · ${scenarioConfidence}% Conf`}
                  variant="tertiary"
                  orientation="top-start"
                >
                  {scenarioName} · {scenarioConfidence}% Conf
                </Tooltip>
              ) : (
                <Tooltip
                  title={scenarioName}
                  variant="tertiary"
                  orientation="top-start"
                >
                  {scenarioName}
                </Tooltip>
              )}
            </span>
          </div>
          <div className={[styles.reviewCol, styles.reviewCol232].join(' ')}>
            <span className={styles.reviewLabel}>{t('review.runMode')}</span>
            <span className={styles.reviewValue}>
              <Tooltip
                title={t(`runModes.${draft.runMode}.title`)}
                variant="tertiary"
                orientation="top-start"
              >
                {t(`runModes.${draft.runMode}.title`)}
              </Tooltip>
            </span>
          </div>
          <div className={[styles.reviewCol, styles.reviewCol230].join(' ')}>
            <span className={styles.reviewLabel}>
              {t('clustering.confidenceThreshold', 'Confidence Threshold')}
            </span>
            <span className={styles.reviewValue}>{draft.confidenceThreshold}%</span>
          </div>
        </div>
      </section>

      {/* === Agent Pipeline Preview === */}
      <AgentPreview stages={pipelinePreview} />

      {createError && (
        <p className={styles.error} role="alert" data-testid="create-plan-error">
          {createError.includes('.')
            ? t(createError.replace(/^planning\./, ''), { defaultValue: createError })
            : createError}
        </p>
      )}
    </div>
  );
}
