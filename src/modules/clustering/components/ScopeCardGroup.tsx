import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import sections from '@shared/styles/wizardSections.module.css';
import scope from './scope.module.css';

export interface ScopeCardOption {
  id: string;
  title: string;
  meta?: string;
  icon?: string;
}

export interface ScopeCardGroupProps {
  legend: string;
  required?: boolean;
  options: ScopeCardOption[];
  value: string | null;
  onChange: (id: string) => void;
  name: string;
  /** True while the option source has not resolved — same card skeleton as Season. */
  loading?: boolean;
}

function isImageSrc(icon: string): boolean {
  return icon.includes('/') || icon.startsWith('data:');
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

export function ScopeCardGroup({
  legend,
  required = false,
  options,
  value,
  onChange,
  name,
  loading = false,
}: ScopeCardGroupProps) {
  const { t } = useTranslation('clustering');
  return (
    <div className={sections.sectionWrapper}>
      <span
        className={[sections.sectionTitle, scope.sectionHeading, required && sections.required]
          .filter(Boolean)
          .join(' ')}
      >
        {legend}
      </span>
      {loading ? (
        <div
          className={sections.cardGrid}
          data-testid={`cluster-scope-${name}-loading`}
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
        <div
          className={[sections.cardGrid, name === 'product' && scope.productGrid]
            .filter(Boolean)
            .join(' ')}
          role="radiogroup"
          aria-label={legend}
        >
        {options.map((option) => {
          const checked = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={checked}
              className={[
                sections.optionCard,
                sections.horizontalCard,
                scope.scopeCard,
                checked && sections.selected,
                focusRingClass,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(option.id)}
              name={name}
            >
              <span className={scope.scopeCardMain}>
                {option.icon ? (
                  isImageSrc(option.icon) ? (
                    <img src={option.icon} alt="" aria-hidden="true" className={scope.iconImg} />
                  ) : (
                    <span className={sections.optionIcon} aria-hidden="true">
                      {option.icon}
                    </span>
                  )
                ) : null}
                <span className={sections.optionCardHead}>
                  <span className={[sections.optionName, scope.optionTitle].join(' ')}>{option.title}</span>
                  {option.meta ? (
                    <span className={[sections.optionMeta, scope.optionMeta].join(' ')}>{option.meta}</span>
                  ) : null}
                </span>
              </span>
              <span
                className={[sections.radioCircle, scope.radio, checked && sections.checked]
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
