import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import sections from '@shared/styles/wizardSections.module.css';
import gatedIcon from '@assets/icons/clustering/run-mode-gated.png';
import autonomousIcon from '@assets/icons/clustering/run-mode-autonomous.png';
import type { ClusterRunMode } from '../types';
import scope from './scope.module.css';

export interface RunModeCardsProps {
  value: ClusterRunMode;
  onChange: (mode: ClusterRunMode) => void;
}

const RUN_MODES: ClusterRunMode[] = ['gated', 'autonomous'];

const RUN_MODE_ICONS: Record<ClusterRunMode, string> = {
  gated: gatedIcon,
  autonomous: autonomousIcon,
};

const RUN_MODE_ICON_BG: Record<ClusterRunMode, string> = {
  gated: '#e9f7fc',
  autonomous: '#fcf8ea',
};

export function RunModeCards({ value, onChange }: RunModeCardsProps) {
  const { t } = useTranslation('clustering');
  const legend = t('scope.runMode.title');

  return (
    <div className={sections.sectionWrapper}>
      <span className={[sections.sectionTitle, scope.sectionHeading].join(' ')}>{legend}</span>
      <div className={sections.cardGrid} role="radiogroup" aria-label={legend}>
        {RUN_MODES.map((mode) => {
          const checked = mode === value;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={checked}
              className={[
                sections.optionCard,
                sections.horizontalCard,
                scope.runModeCard,
                checked && sections.selected,
                focusRingClass,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(mode)}
              name="runMode"
            >
              <span className={scope.runModeIcon} style={{ backgroundColor: RUN_MODE_ICON_BG[mode] }}>
                <img
                  src={RUN_MODE_ICONS[mode]}
                  alt=""
                  aria-hidden="true"
                  className={scope.runModeIconImg}
                />
              </span>
              <span className={scope.runModeText}>
                <span className={[sections.optionName, scope.optionTitle].join(' ')}>
                  {t(`scope.runMode.${mode}.title`)}
                </span>
                <span className={scope.runModeDesc}>{t(`scope.runMode.${mode}.description`)}</span>
                <span className={scope.runModeDesc}>{t(`scope.runMode.${mode}.support`)}</span>
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
    </div>
  );
}
