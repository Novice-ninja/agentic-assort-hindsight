import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover } from '@shared/components/vendor/impact-ui';
import { visuallyHiddenClass } from '@shared/a11y';
import candidateAiIcon from '@assets/icons/clustering/candidate-ai.svg';
import styles from './createPlanMethod.module.css';

/** The two ways to start a cluster plan. */
export type CreatePlanMethod = 'describe' | 'setup';

export interface CreatePlanMethodPopoverProps {
  open: boolean;
  /** Element the popover hangs from — the "Create Cluster Plan" button. */
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /** Called once per Proceed with the chosen method; the host decides where it leads. */
  onProceed: (method: CreatePlanMethod) => void;
}

interface MethodOption {
  value: CreatePlanMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** `false` keeps Proceed disabled when the option has no destination. */
  available: boolean;
}

export function CreatePlanMethodPopover({
  open,
  anchorEl,
  onClose,
  onProceed,
}: CreatePlanMethodPopoverProps) {
  const { t } = useTranslation('clustering');
  const groupName = useId();
  const [selected, setSelected] = useState<CreatePlanMethod | null>(null);

  // Each opening starts from a clean choice so a stale pick can't be proceeded by accident.
  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  const options: MethodOption[] = [
    {
      value: 'describe',
      title: t('dashboard.createMethod.describeTitle'),
      description: t('dashboard.createMethod.describeDescription'),
      icon: (
        <img
          src={candidateAiIcon}
          alt=""
          aria-hidden="true"
          className={styles.iconImage}
        />
      ),
      available: true,
    },
    {
      value: 'setup',
      title: t('dashboard.createMethod.setupTitle'),
      description: t('dashboard.createMethod.setupDescription'),
      icon: (
        <span className={styles.iconEmoji} aria-hidden="true">
          📝
        </span>
      ),
      available: true,
    },
  ];

  const current = options.find((option) => option.value === selected) ?? null;
  const canProceed = current !== null && current.available;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      title={t('dashboard.createMethod.title')}
      primaryButtonLabel={t('dashboard.createMethod.proceed')}
      onPrimaryButtonClick={() => {
        if (canProceed && current) onProceed(current.value);
      }}
      primaryButtonProps={{
        size: 'large',
        disabled: !canProceed,
        'data-testid': 'create-plan-method-proceed',
      }}
      slotProps={{ paper: { className: styles.paper } }}
      data-testid="create-plan-method-popover"
    >
      <div
        role="radiogroup"
        aria-label={t('dashboard.createMethod.groupLabel')}
        className={styles.options}
      >
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <label
              key={option.value}
              className={`${styles.card}${isSelected ? ` ${styles.cardSelected}` : ''}`}
              data-method={option.value}
              data-selected={isSelected ? 'true' : 'false'}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                onChange={() => setSelected(option.value)}
                className={visuallyHiddenClass}
              />
              <span className={styles.cardTop}>
                <span className={styles.icon}>{option.icon}</span>
                <span className={styles.radio} aria-hidden="true" />
              </span>
              <span className={styles.cardTitle}>{option.title}</span>
              <span className={styles.cardDescription}>{option.description}</span>
            </label>
          );
        })}
      </div>
    </Popover>
  );
}
