import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpactInput as Input } from '@shared/components/vendor/impact-ui';
import { focusRingClass } from '@shared/a11y';
import { useToast } from '@shared/components/primitives/Toast';
import type { LoadStatus } from '@shared/types';
import { tradingSeasonLabel, validatePlanName } from '../../services';
import type { PlanDraft, SeasonInfo, SeasonYear } from '../../types';
import styles from './wizardSteps.module.css';

import fyCalendarIcon from '@assets/icons/planning/fy-calendar.png';
import seasonSsIcon from '@assets/icons/planning/season-ss.png';
import seasonAwIcon from '@assets/icons/planning/season-aw.png';
// import startFreshIcon from '@assets/icons/planning/start-fresh.png';
// import carryForwardIcon from '@assets/icons/planning/carry-forward.png';

// const STARTING_POINTS: { value: 'startFresh' | 'carryForwardLY'; disabled: boolean; icon: string }[] = [
//   { value: 'startFresh', disabled: false, icon: startFreshIcon },
//   { value: 'carryForwardLY', disabled: true, icon: carryForwardIcon },
// ];

export interface NameCalendarStepProps {
  draft: PlanDraft;
  seasonsData: SeasonYear[];
  seasonsStatus: LoadStatus;
  existingNames: string[];
  update: (patch: Partial<PlanDraft>) => void;
}

// const TAG_BADGE_COLOR: Record<FiscalYearTag, 'success' | 'info' | 'warning'> = {
//   complete: 'success',
//   current: 'info',
//   future: 'warning',
// };

// function getYearTag(year: SeasonYear): FiscalYearTag {
//   const now = new Date();
//   const { seasons } = year;
//   if (seasons.length === 0) return 'future';

//   const lastEnd = new Date(seasons[seasons.length - 1].seasonEndDate);
//   const firstStart = new Date(seasons[0].seasonStartDate);

//   if (lastEnd < now) return 'complete';
//   if (firstStart <= now) return 'current';
//   return 'future';
// }

function yearDateRange(year: SeasonYear): string {
  const { seasons } = year;
  if (seasons.length === 0) return '';
  if (seasons.length === 1) return tradingSeasonLabel(seasons[0]);
  return `${tradingSeasonLabel(seasons[0])} · ${tradingSeasonLabel(seasons[seasons.length - 1])}`;
}

function getSeasonIcon(seasonName: string): string {
  const lower = seasonName.toLowerCase();
  if (lower.includes('fall') || lower.includes('winter') || lower.includes('autumn')) {
    return seasonAwIcon;
  }
  return seasonSsIcon;
}

function getSeasonSubtitle(season: SeasonInfo): string {
  return `${season.seasonStartDate} — ${season.seasonEndDate}`;
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={[styles.skeletonBone, styles.skeletonIcon].join(' ')} />
      <div className={styles.skeletonContent}>
        <div className={[styles.skeletonBone, styles.skeletonTitle].join(' ')} />
        <div className={[styles.skeletonBone, styles.skeletonMeta].join(' ')} />
      </div>
      <div className={[styles.skeletonBone, styles.skeletonRadio].join(' ')} />
    </div>
  );
}

export function NameCalendarStep({
  draft,
  seasonsData,
  seasonsStatus,
  existingNames,
  update,
}: NameCalendarStepProps) {
  const { t } = useTranslation('planning');
  const { showToast } = useToast();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (seasonsStatus === 'failed' && !toastShownRef.current) {
      toastShownRef.current = true;
      showToast({
        message: t('errors.seasonsFetchFailed', 'Failed to load seasons. Please try again.'),
        variant: 'error',
      });
    }
    if (seasonsStatus !== 'failed') {
      toastShownRef.current = false;
    }
  }, [seasonsStatus, showToast, t]);

  const selectedYear = seasonsData.find((y) => String(y.year) === draft.fiscalYearId) ?? null;

  const nameErrorKey = draft.name.trim()
    ? validatePlanName(draft.name, existingNames)
    : null;

  const selectFiscalYear = (year: SeasonYear) => {
    const yearId = String(year.year);
    const currentSeason = selectedYear?.seasons.find(
      (s) => s.seasonCode === draft.seasonCode,
    );
    const seasonStillValid =
      currentSeason && year.seasons.some((s) => s.seasonCode === currentSeason.seasonCode);

    update({
      fiscalYearId: yearId,
      season: seasonStillValid ? draft.season : null,
      seasonCode: seasonStillValid ? draft.seasonCode : null,
    });
  };

  const selectSeason = (season: SeasonInfo) => {
    update({
      season: season.name,
      seasonCode: season.seasonCode,
    });
  };

  const isLoading = seasonsStatus === 'loading' || seasonsStatus === 'idle';

  return (
    <div className={styles.step} data-testid="create-plan-name-calendar">
      {/* Plan Details */}
      <div className={styles.sectionWrapper} data-testid="create-plan-details">
        <span className={styles.sectionTitle}>{t('planDetails', 'Plan Details')}</span>
        <Input
          id="planName"
          name="planName"
          label={t('fields.planName')}
          value={draft.name}
          placeholder={'Enter plan name'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            update({ name: e.target.value })
          }
          isRequired
          isError={!!nameErrorKey}
          isHelperText={!!nameErrorKey}
          helperText={
            nameErrorKey ? t(nameErrorKey.replace(/^planning\./, '')) : ''
          }
          inputProps={{ maxLength: 30 }}
          data-testid="create-plan-plan-name"
        />
      </div>

      {/* Fiscal Year */}
      <div className={styles.sectionWrapper}>
        <span className={[styles.sectionTitle, styles.required].join(' ')}>
          {t('fields.fiscalYear')}
        </span>
        <div
          className={styles.cardGrid}
          role="radiogroup"
          aria-label={t('fields.fiscalYear')}
          data-testid="create-plan-fiscal-year-group"
        >
          {isLoading
            ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
            : seasonsData.map((year) => {
                const yearId = String(year.year);
                const selected = yearId === draft.fiscalYearId;
                // const tag = getYearTag(year);
                return (
                  <button
                    key={year.year}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={[
                      styles.optionCard,
                      styles.horizontalCard,
                      selected && styles.selected,
                      focusRingClass,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => selectFiscalYear(year)}
                    data-testid={`create-plan-fiscal-year-${year.year}`}
                  >
                    <img
                      src={fyCalendarIcon}
                      alt=""
                      aria-hidden="true"
                      className={styles.optionIconImg}
                    />
                    <span className={styles.optionCardHead}>
                      <span className={styles.optionNameRow}>
                        <span className={styles.optionName}>{`FY${year.year}`}</span>
                        {/* <Badge
                          label={t(`fiscalTags.${tag}`)}
                          color={TAG_BADGE_COLOR[tag]}
                          variant="subtle"
                          size="small"
                        /> */}
                      </span>
                      <span className={styles.optionMeta}>{yearDateRange(year)}</span>
                    </span>
                    <span
                      className={[styles.radioCircle, selected && styles.checked]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
        </div>
      </div>

      {/* Trading Season */}
      <div className={styles.sectionWrapper}>
        <span className={styles.sectionTitle}>{t('fields.tradingSeason')}</span>
        {isLoading ? (
          <div className={styles.cardGrid}>
            {Array.from({ length: 2 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : selectedYear ? (
          <div
            className={styles.cardGrid}
            role="radiogroup"
            aria-label={t('fields.tradingSeason')}
            data-testid="create-plan-season-group"
          >
            {selectedYear.seasons.map((season) => {
              const selected = season.seasonCode === draft.seasonCode;
              const label = tradingSeasonLabel(season);
              return (
                <button
                  key={season.seasonCode}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={label}
                  className={[
                    styles.optionCard,
                    styles.horizontalCard,
                    selected && styles.selected,
                    focusRingClass,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => selectSeason(season)}
                  data-testid={`create-plan-season-${season.seasonCode}`}
                >
                  <img
                    src={getSeasonIcon(season.name)}
                    alt=""
                    aria-hidden="true"
                    className={styles.optionIconImg}
                  />
                  <span className={styles.optionCardHead}>
                    <span className={styles.optionName}>{label}</span>
                    <span className={styles.optionMeta} aria-hidden="true">{getSeasonSubtitle(season)}</span>
                  </span>
                  <span
                    className={[styles.radioCircle, selected && styles.checked]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <span className={styles.hint}>{t('fields.selectFiscalFirst')}</span>
        )}
      </div>

      {/* Starting Point — temporarily commented out
      <div className={styles.sectionWrapper}>
        <span className={styles.sectionTitle}>{t('fields.startingPoint')}</span>
        <div
          className={styles.cardGrid}
          role="radiogroup"
          aria-label={t('fields.startingPoint')}
        >
          {STARTING_POINTS.map(({ value, disabled, icon }) => {
            const selected = value === draft.startingPoint;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                className={[
                  styles.optionCard,
                  styles.horizontalCard,
                  disabled && styles.wideCard,
                  selected && styles.selected,
                  focusRingClass,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => update({ startingPoint: value })}
              >
                <img
                  src={icon}
                  alt=""
                  aria-hidden="true"
                  className={styles.optionIconImg}
                />
                <span className={styles.optionCardHead}>
                  <span className={styles.optionName}>
                    {t(`startingPoints.${value}`)}
                  </span>
                  <span className={styles.optionDesc}>
                    {t(`startingPointDesc.${value}`)}
                  </span>
                </span>
                <span
                  className={[
                    styles.radioCircle,
                    selected && styles.checked,
                    disabled && styles.disabled,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
                {disabled && (
                  <span
                    className={styles.upcomingRibbon}
                    aria-label={t('common.upcoming')}
                  >
                    <svg
                      className={styles.ribbonEdge}
                      width="28"
                      height="32"
                      viewBox="0 0 12 32"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M11 16L0 0H27.5V32H0L11 16Z" fill="#E1C0F8" />
                    </svg>
                    <span className={styles.ribbonBody}>{t('common.upcoming')}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      */}
    </div>
  );
}
