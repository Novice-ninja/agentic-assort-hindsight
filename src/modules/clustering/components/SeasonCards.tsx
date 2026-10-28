import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import sections from '@shared/styles/wizardSections.module.css';
import seasonSsIcon from '@assets/icons/clustering/season-ss.png';
import seasonAwIcon from '@assets/icons/clustering/season-aw.png';
import type { SeasonOption } from '../types';
import scope from './scope.module.css';

const SEASON_ICONS: Record<SeasonOption['seasonKind'], string> = {
  springSummer: seasonSsIcon,
  autumnWinter: seasonAwIcon,
};

export interface SeasonCardsProps {
  seasons: SeasonOption[];
  value: string | null;
  onChange: (id: string) => void;
  /** True while `/plans/seasons` has not resolved — shows the same card skeleton as Create Plan. */
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className={scope.skeletonCard} aria-hidden="true">
      <div className={[scope.skeletonBone, scope.skeletonIcon].join(' ')} />
      <div className={scope.skeletonContent}>
        <div className={[scope.skeletonBone, scope.skeletonTitle].join(' ')} />
        <div className={[scope.skeletonBone, scope.skeletonMeta].join(' ')} />
      </div>
      <div className={[scope.skeletonBone, scope.skeletonRadio].join(' ')} />
    </div>
  );
}

/**
 * Season selector rendered with the exact card treatment used by the Create Plan
 * flow (`NameCalendarStep` trading-season cards): hug-width cards, top-aligned
 * radio, and a season-code title over a trading-window subtitle. Reuses the
 * shared wizard section/card classes rather than the fixed-width `ScopeCardGroup`
 * layout used by the other Scope sections.
 */
export function SeasonCards({ seasons, value, onChange, loading = false }: SeasonCardsProps) {
  const { t } = useTranslation('clustering');
  const legend = t('scope.season');

  return (
    <div className={sections.sectionWrapper}>
      <span
        className={[sections.sectionTitle, scope.sectionHeading, sections.required].join(' ')}
      >
        {legend}
      </span>
      {loading ? (
        <div
          className={sections.cardGrid}
          data-testid="cluster-scope-seasons-loading"
          aria-busy="true"
        >
          <span className="sr-only" role="status">
            {t('states.loading')}
          </span>
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className={sections.cardGrid} role="radiogroup" aria-label={legend}>
          {seasons.map((season) => {
            const checked = season.id === value;
            return (
              <button
                key={season.id}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={season.code}
                className={[
                  sections.optionCard,
                  sections.horizontalCard,
                  checked && sections.selected,
                  focusRingClass,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onChange(season.id)}
                name="season"
              >
                <img
                  src={SEASON_ICONS[season.seasonKind]}
                  alt=""
                  aria-hidden="true"
                  className={scope.iconImg}
                />
                <span className={sections.optionCardHead}>
                  <span className={sections.optionName}>{season.code}</span>
                  {season.subtitle ? (
                    <span className={sections.optionMeta} aria-hidden="true">
                      {season.subtitle}
                    </span>
                  ) : null}
                </span>
                <span
                  className={[sections.radioCircle, checked && sections.checked]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
