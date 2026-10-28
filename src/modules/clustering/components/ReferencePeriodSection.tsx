import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@shared/components/primitives';
import {
  Button,
  ImpactBadge,
  ImpactInput as Input,
} from '@shared/components/vendor/impact-ui';
import { decodeIaString } from '@shared/utils/format';
import type { LoadStatus } from '@shared/types';
import sections from '@shared/styles/wizardSections.module.css';
import type { ReferenceSeasonInfo, SeasonInfosResponse } from '../api/getSeasonInfos';
import scope from './scope.module.css';

export interface ReferencePeriodSectionProps {
  /** `POST /v1/clustering/season_info` response for the selected season, keys verbatim. */
  periods: SeasonInfosResponse | null;
  status: LoadStatus;
  /** Dropdown selection — response keys (`ly`, `lly`, …); filters the visible cards. */
  selectedKeys: string[];
  /** Coverage % edits keyed like `periods`; falls back to each entry's `seasonCoverage`. */
  coverage: Record<string, number>;
  /** Per-card include checkbox, keyed like `periods`; a missing key means checked. */
  checked: Record<string, boolean>;
  onSelectionChange: (keys: string[]) => void;
  onCheckedChange: (key: string, checked: boolean) => void;
  onCoverageChange: (key: string, value: number) => void;
  onRetry: () => void;
}

/** `ly` → `LY`, `lly` → `LLY`: the option label is the response key itself, upper-cased. */
export function referencePeriodLabel(key: string): string {
  return key.trim().toUpperCase();
}

/** Coverage is a whole percentage 0–100; anything else is ignored. */
export function clampCoverage(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function SkeletonCard() {
  return (
    <div
      className={[scope.skeletonCard, scope.referenceCard].join(' ')}
      aria-hidden="true"
    >
      <div className={[scope.skeletonBone, scope.skeletonRadio].join(' ')} />
      <div className={scope.skeletonContent}>
        <div className={[scope.skeletonBone, scope.skeletonTitle].join(' ')} />
        <div className={[scope.skeletonBone, scope.skeletonMeta].join(' ')} />
      </div>
    </div>
  );
}

function ReferencePeriodCard({
  periodKey,
  period,
  checked,
  coverage,
  onToggle,
  onCoverageChange,
}: {
  periodKey: string;
  period: ReferenceSeasonInfo;
  checked: boolean;
  coverage: number;
  onToggle: () => void;
  onCoverageChange: (value: number) => void;
}) {
  const { t } = useTranslation('clustering');
  const label = referencePeriodLabel(periodKey);
  const seasonName = decodeIaString(period.seasonName) || '—';
  const coverageId = `reference-coverage-${periodKey}`;

  return (
    <article
      className={[
        sections.optionCard,
        sections.horizontalCard,
        checked && sections.selected,
        scope.referenceCard,
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid={`reference-period-card-${periodKey}`}
      data-checked={checked}
      aria-label={`${label} · ${seasonName}`}
    >
      {/* Include/exclude this period. The card hosts an input, so the checkbox is the toggle. */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={t('scope.referencePeriodToggle', { period: label })}
        className={[
          scope.checkBox,
          scope.checkBoxButton,
          checked && scope.checkBoxChecked,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onToggle}
      />
      <span className={sections.optionCardHead}>
        <span className={scope.referenceCardTitle}>
          <ImpactBadge label={label} variant="subtle" color="info" size="small" />
          <span className={sections.optionName}>{seasonName}</span>
        </span>
        <span className={sections.optionMeta}>
          {/* Same raw trading-window format the Season cards use. */}
          {period.seasonStartDate} — {period.seasonEndDate}
        </span>
        <span className={sections.optionMeta}>
          {t('scope.referenceSeasonCode', { code: period.seasonCode })}
        </span>
      </span>
      <div className={scope.coverageField}>
        <Input
          id={coverageId}
          name={coverageId}
          className={scope.coverageInput}
          label={t('scope.coverage')}
          value={String(coverage)}
          isDisabled={!checked}
          inputProps={{
            type: 'number',
            inputMode: 'numeric',
            min: 0,
            max: 100,
            step: 1,
            'aria-label': t('scope.coverageFor', { period: label }),
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const next = clampCoverage(e.target.value);
            if (next !== null) onCoverageChange(next);
          }}
        />
        <span className={scope.coverageSuffix} aria-hidden="true">
          %
        </span>
      </div>
    </article>
  );
}

/**
 * Scope step — Reference Period. Rendered only once a season is selected; everything shown
 * comes from `/season_info` for that season. The multi-select dropdown filters which cards are
 * shown; each card's checkbox independently marks whether that period is included.
 */
export function ReferencePeriodSection({
  periods,
  status,
  selectedKeys,
  coverage,
  checked,
  onSelectionChange,
  onCheckedChange,
  onCoverageChange,
  onRetry,
}: ReferencePeriodSectionProps) {
  const { t } = useTranslation('clustering');
  const availableKeys = periods ? Object.keys(periods) : [];
  const options = availableKeys.map((key) => ({
    value: key,
    label: referencePeriodLabel(key),
  }));
  // Cards follow the response order, limited to what the dropdown selected.
  const visibleKeys = availableKeys.filter((key) => selectedKeys.includes(key));
  const loading = status === 'loading' || status === 'idle';

  return (
    <div
      className={[sections.sectionWrapper, scope.referenceSection].join(' ')}
      data-testid="reference-period-section"
    >
      <div className={scope.referenceHeader}>
        <span className={[sections.sectionTitle, scope.sectionHeading].join(' ')}>
          {t('scope.referencePeriodInsufficient')}
        </span>
        <div className={scope.referenceDropdown}>
          <Dropdown
            label={t('scope.referencePeriod')}
            aria-label={t('scope.referencePeriod')}
            labelOrientation="left"
            options={options}
            value={visibleKeys}
            onChange={onSelectionChange}
            placeholder={t('scope.referencePeriodPlaceholder')}
            isMulti
            isClearable={false}
            disabled={status !== 'succeeded' || options.length === 0}
            isLoading={loading}
            minWidth="200px"
            width="100%"
          />
        </div>
      </div>

      {status === 'failed' ? (
        <div className={scope.referenceError} role="alert">
          <span className={sections.optionMeta}>{t('errors.seasonInfosFailed')}</span>
          <Button variant="tertiary" size="small" onClick={onRetry}>
            {t('states.retry')}
          </Button>
        </div>
      ) : loading ? (
        <div
          className={sections.cardGrid}
          data-testid="reference-period-loading"
          aria-busy="true"
        >
          <span className="sr-only" role="status">
            {t('states.loading')}
          </span>
          <SkeletonCard />
        </div>
      ) : availableKeys.length === 0 ? (
        <p className={sections.optionMeta} role="status">
          {t('scope.referencePeriodNone')}
        </p>
      ) : visibleKeys.length === 0 ? (
        <p className={sections.optionMeta} role="status">
          {t('scope.referencePeriodEmpty')}
        </p>
      ) : (
        <div
          className={sections.cardGrid}
          role="group"
          aria-label={t('scope.referencePeriod')}
        >
          {visibleKeys.map((key) => {
            const period = (periods as SeasonInfosResponse)[key];
            const isChecked = checked[key] ?? true;
            return (
              <ReferencePeriodCard
                key={key}
                periodKey={key}
                period={period}
                checked={isChecked}
                coverage={coverage[key] ?? period.seasonCoverage}
                onToggle={() => onCheckedChange(key, !isChecked)}
                onCoverageChange={(value) => onCoverageChange(key, value)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
