import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpactInput as Input, Panel } from '@shared/components/vendor/impact-ui';
import type { WatchlistThreshold } from './WatchlistRuleCard';
import {
  isCompleteNumber,
  isPartialNumber,
  parseThresholdValue,
  thresholdUnit,
} from './watchlistThresholds';
import styles from './WatchlistEditPanel.module.css';

export interface WatchlistEditPanelProps {
  open: boolean;
  onClose: () => void;
  /** Values currently shown in the banner; the draft starts from these on every open. */
  thresholds: readonly WatchlistThreshold[];
  /** Values "Reset to Default" returns to. */
  defaults: readonly WatchlistThreshold[];
  /** Called with the edited number for each rule, keyed by rule key. */
  onApply: (numbers: Record<string, string>) => void;
}

const numbersOf = (rules: readonly WatchlistThreshold[]) =>
  Object.fromEntries(
    rules.map((rule) => [rule.key, parseThresholdValue(rule.value).number]),
  );

/**
 * "Edit Threshold" drawer: one numeric input per rule. Edits stay in a draft until
 * "Apply Changes", which stays disabled until a value differs from what the banner shows.
 */
export function WatchlistEditPanel({
  open,
  onClose,
  thresholds,
  defaults,
  onApply,
}: WatchlistEditPanelProps) {
  const { t } = useTranslation('hindsight');
  const applied = useMemo(() => numbersOf(thresholds), [thresholds]);
  const defaultNumbers = useMemo(() => numbersOf(defaults), [defaults]);
  const [draft, setDraft] = useState<Record<string, string>>(applied);

  // Reopening discards unapplied edits.
  useEffect(() => {
    if (open) setDraft(applied);
  }, [open, applied]);

  const edited = thresholds.some((rule) => draft[rule.key] !== applied[rule.key]);
  const valid = thresholds.every((rule) => isCompleteNumber(draft[rule.key] ?? ''));

  return (
    <Panel
      open={open}
      setIsOpen={(next) => {
        if (!next) onClose();
      }}
      anchor="right"
      size="medium"
      title={t('watchlist.editThresholdTitle')}
      primaryButtonLabel={t('watchlist.applyChanges')}
      primaryButtonProps={{ disabled: !edited || !valid }}
      onPrimaryButtonClick={() => {
        onApply(draft);
        onClose();
      }}
      secondaryButtonLabel={t('watchlist.resetToDefault')}
      secondaryButtonProps={{ variant: 'url' }}
      onSecondaryButtonClick={() => setDraft(defaultNumbers)}
    >
      <div
        className={styles.body}
        data-testid="hindsight-watchlist-edit-thresholds-panel"
      >
        {thresholds.map((rule) => {
          const unit = thresholdUnit(parseThresholdValue(rule.value));
          return (
            <div key={rule.key} className={styles.field}>
              <h3 className={styles.title}>{rule.title}</h3>
              <Input
                id={`watchlist-threshold-${rule.key}`}
                label={unit ? `${rule.subtitle} (${unit})` : rule.subtitle}
                value={draft[rule.key] ?? ''}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isPartialNumber(next)) {
                    setDraft((prev) => ({ ...prev, [rule.key]: next }));
                  }
                }}
                isHelperText={false}
                inputProps={{ inputMode: 'decimal' }}
              />
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
