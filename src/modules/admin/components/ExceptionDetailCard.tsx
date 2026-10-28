import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { focusRingClass } from '@shared/a11y';
import { Button, Input, Modal, Select } from '@shared/components';
import type { ExceptionRule, GlobalException } from '../types/exception';
import { RULE_OPERATOR_OPTIONS } from '../types/exception';
import styles from './ExceptionDetailCard.module.css';

export interface ExceptionDetailCardProps {
  exception: GlobalException;
  expanded: boolean;
  readOnly?: boolean;
  onToggle: () => void;
  onEditRule?: (ruleId: string, patch: Partial<ExceptionRule>) => void;
  onAddRule?: () => void;
  onRemove?: () => void;
}

export function ExceptionDetailCard({
  exception,
  expanded,
  readOnly = false,
  onToggle,
  onEditRule,
  onAddRule,
  onRemove,
}: ExceptionDetailCardProps) {
  const { t } = useTranslation('admin');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const operatorOptions = RULE_OPERATOR_OPTIONS.map((op) => ({
    value: op,
    label: t(`operators.${op}`),
  }));

  return (
    <>
      <article className={[styles.card, expanded && styles.expanded].filter(Boolean).join(' ')}>
        <button
          type="button"
          className={[styles.header, focusRingClass].join(' ')}
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`exception-${exception.id}-body`}
        >
          <span className={styles.thumb} aria-hidden />
          <span className={styles.headerText}>
            <span className={styles.title}>{exception.title}</span>
            <span className={styles.meta}>
              {exception.geography.name} · {t('exceptions.card.ruleCount', { count: exception.rules.length })}
            </span>
          </span>
        </button>

        {expanded && (
          <div id={`exception-${exception.id}-body`} className={styles.body}>
            <ul className={styles.rules}>
              {exception.rules.map((rule) => (
                <li key={rule.id} className={styles.rule}>
                  <span className={styles.attribute}>{rule.attribute}</span>
                  {editingRuleId === rule.id && !readOnly ? (
                    <div className={styles.editRow}>
                      <Select
                        label={t('exceptions.card.operator')}
                        options={operatorOptions}
                        value={[rule.operator]}
                        onChange={(v) => onEditRule?.(rule.id, { operator: v[0] as ExceptionRule['operator'] })}
                      />
                      <Input
                        label={t('exceptions.card.value')}
                        value={rule.value}
                        onChange={(e) => onEditRule?.(rule.id, { value: e.target.value })}
                      />
                      <Button variant="ghost" size="small" onClick={() => setEditingRuleId(null)}>
                        {t('exceptions.card.done')}
                      </Button>
                    </div>
                  ) : (
                    <span className={styles.ruleText}>
                      {t(`operators.${rule.operator}`)} {rule.value}
                      {!readOnly && (
                        <button
                          type="button"
                          className={[styles.editBtn, focusRingClass].join(' ')}
                          aria-label={t('exceptions.card.editRule')}
                          onClick={() => setEditingRuleId(rule.id)}
                        >
                          ✎
                        </button>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p className={styles.metadata}>
              {t('exceptions.card.added', { date: exception.addedOn, by: exception.addedBy })}
            </p>

            {!readOnly && (
              <div className={styles.actions}>
                <Button variant="secondary" size="small" onClick={onAddRule}>
                  {t('exceptions.card.addRule')}
                </Button>
                <Button variant="danger" size="small" onClick={() => setConfirmOpen(true)}>
                  {t('exceptions.card.remove')}
                </Button>
              </div>
            )}
          </div>
        )}
      </article>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('exceptions.removeConfirm.title')}
      >
        <p>{t('exceptions.removeConfirm.body', { title: exception.title })}</p>
        <div className={styles.confirmActions}>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            {t('filterModal.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onRemove?.();
              setConfirmOpen(false);
            }}
          >
            {t('exceptions.removeConfirm.confirm')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
